//
//  CallKitBridge.swift
//  nmoment
//
//  Created on 2/3/25.
//

import Foundation

import UIKit

import CallKit
import PushKit

#if canImport(Atomics)
import Atomics
#else
/// Atomics 라이브러리가 없는 경우 대비용 더미 클래스
func ManagedAtomic<T> (_ value: T) -> T {
  return value
}

#endif

#if canImport(Sentry)
import Sentry
#else
/// Sentry SDK가 없는 경우 대비용 더미 클래스
class SentrySDK {
  static func capture(message: String) {
    print("[Sentry] \(message)")
  }
  
  static func capture(error: Error) {
    print("[Sentry] \(error)")
  }
}

#endif

/// CallKitBridge - CallKit의 일부 기능을 사용하기 편하게 감쌉니다.
@objc(NMCallKitBridge)
@objcMembers
public class CallKitBridge: NSObject {
  public static let shared = CallKitBridge()
  
  private(set) public var cxProvider: CXProvider!
  private(set) public var cxCallController: CXCallController!
  
  private(set) public var pushRegistry: PKPushRegistry!

  private(set) public var isCallIncoming = ManagedAtomic(false)
  public var incomingCallPayload: String? = nil
  
  private(set) public var pushCredentials: PKPushCredentials? = nil
  
  public var shouldPerformReqDenyCall = false
  
  @objc
  public static func instance() -> CallKitBridge {
    return shared
  }
  
  private override init() {
    super.init()
  }

  
  /// CallKit을 초기화합니다.
  public func configureCallKit() {
    let configuration = CXProviderConfiguration()

    // FIXME: 'applogo'라는 이름으로 앱 아이콘을 추가해야 합니다. (흑백 단색이어야 합니다!!)
    configuration.iconTemplateImageData = UIImage(named: "applogo")?.pngData()
    
    configuration.maximumCallGroups = 1
    configuration.maximumCallsPerCallGroup = 1
    
    configuration.supportsVideo = true
    configuration.supportedHandleTypes = [.generic]
    
    let cxProvider = CXProvider(configuration: configuration)
    let cxCallController = CXCallController()
    
    self.cxProvider = cxProvider
    self.cxCallController = cxCallController
    
    cxProvider.invalidate()
  }
  
  /// PushKit을 초기화합니다.
  public func configurePushKit() {
    let pushRegistry = PKPushRegistry(queue: DispatchQueue.main)
    pushRegistry.delegate = self
    pushRegistry.desiredPushTypes = [.voIP]
  }

  /// CallKit의 delegate를 설정합니다. (NMVoIPAPI에서 호출할 예정)
  public func setCXDelegate(_ delegate: CXProviderDelegate) {
    cxProvider.setDelegate(delegate, queue: nil)
  }
  
  /// PushKit의 VoIP Push를 핸들링합니다. **수동으로 호출하지 마십시오.**
  public func handleNotification(forIncomingCall payload: PKPushPayload, completionHandler: () -> Void) {
    defer {
      completionHandler()
    }
    
    if (payload.type != .voIP) {
      return
    }
    
    isCallIncoming = true
    
    
    guard let payloadDict = payload.dictionaryPayload as? [String: Any] else {
      return
    }
    
    // FIXME: nmoment의 서비스 사정에 맞춰서 payload 관련 처리를 수정해야 합니다.
    guard let opponentId = payloadDict["you_id"] as? Int,
          let opponentNick = payloadDict["you_nick"] as? String,
          let roomUUIDStr = payloadDict["room_uuid"] as? String,
          let nmPayload = payloadDict["nm_payload"] as? String else {
      SentrySDK.capture(message: "Received malformed voip push payload")
      return
    }
    
    let roomUUID = UUID()
    
    /**
                   **여기에 별도 로직을 추가하지 마세요!!**
     PushKit을 통해 voip 푸시를 수신한 경우, 약 2초 안에 CallKit을 통해 전화 수신을 보고해야 합니다.
     보고 작업이 특정 횟수 이상 이루어지지 않으면, 사용자가 앱을 재설치할 때까지 전화 수신이 불가능해집니다.
     
     만약 흐름 제어 문제로 서버로부터 dismiss 이벤트를 먼저 수신하더라도, CallKit을 통해 전화 수신을 보고해야 합니다.
     그 뒤에 수동으로 dismiss 이벤트를 보고하면 됩니다.
     */
    
    self.incomingCallPayload = nmPayload
    self.shouldPerformReqDenyCall = true
    
    report(incomingCall: roomUUID, handle: String(opponentId), as: opponentNick)
  }
  
  /// 일반 푸시 (FCM, APNs) 핸들러.
  /// 통화 종료나 기타 이벤트는 여기서 담당합니다.
  ///
  /// **수동으로 호출하지 마십시오.**
  public func handleNotification(forOtherCallEvent payload: NSDictionary, completionHandler: @escaping () -> Void) {
    guard let type = payload["type"] as? String else {
      completionHandler()
      return
    }
    
    if (type != "call") {
      completionHandler()
      return
    }
    
    guard let state = payload["state"] as? String,
          let uuidStr = payload["call_uuid"] as? String,
          let uuid = UUID(uuidString: uuidStr) else {
      completionHandler()
      return
    }
    
    if (state == "incoming") {
      SentrySDK.capture(message: "assertion failure: 통화 수신 이벤트는 PushKit을 통해 처리되어야 합니다.")
    } else if (state == "disconnected") {
      self.shouldPerformReqDenyCall = false
      
      report(callEnded: uuid, reason: .remoteEnded, completionHandler: completionHandler)
    }
  }
  
  
  /// 전화를 수신한 것으로 마킹합니다.
  internal func markCallAsAnswered() {
    isCallIncoming = false
    self.shouldPerformReqDenyCall = false
    
    incomingCallPayload = nil
  }
  
  /// **들어오는 전화**를 iOS에 보고합니다.
  ///
  /// - Parameters:
  ///   - handle: 전화를 걸어온 사용자 UUID
  ///   - displayName: 전화를 걸어온 사용자의 표시 이름 (닉네임 등...)
  public func report(incomingCall uuid: UUID, handle: String, as displayName: String = "알 수 없음", completionHandler: (() -> Void)? = nil) {
    
    self.endCall()
    
    let cxHandle = CXHandle(type: .generic, value: handle)
    
    let update = CXCallUpdate()
    
    update.remoteHandle = cxHandle
    update.localizedCallerName = displayName
    
    update.hasVideo = true
    update.supportsDTMF = false
    update.supportsHolding = false
    update.supportsGrouping = false
    update.supportsUngrouping = false
    
    cxProvider.reportNewIncomingCall(with: uuid, update: update) { error in
      guard let error = error else { return }
      
      SentrySDK.capture(error: error)
    }
  }
  
  /// **나가는 전화**를 iOS에 보고합니다.
  ///
  /// TODO: **NMVoIPAPI에 노출한다.**
  ///
  /// - Parameters:
  ///   - handle: 전화 대상 사용자 UUID
  ///   - displayName: 전화 대상 사용자의 표시 이름 (닉네임 등...)
  public func report(outgoingCall uuid: UUID, handle: String, as displayName: String = "알 수 없음", completionHandler: ((Error?) -> Void)? = nil) {
    let cxHandle = CXHandle(type: .generic, value: displayName)
    
    let action = CXStartCallAction(call: uuid, handle: cxHandle)
    action.isVideo = true
    
    
    let transaction = CXTransaction(action: action)
    cxCallController.request(transaction) { error in
      if let error = error {
        SentrySDK.capture(error: error)
      } else {
        // 이거 없어져야 하지 않을까요? 시간 계산 꼬일듯..
        self.cxProvider.reportOutgoingCall(with: uuid, startedConnectingAt: Date.now)
      }
      
      completionHandler?(error)
    }
  }
  
  public func report(callDismissed uuid: UUID, completionHandler: (() -> Void)? = nil) {
    self.report(callEnded: uuid, reason: .remoteEnded, completionHandler: completionHandler)
  }
  
  /// 전화가 연결되었음을 iOS에 보고합니다.
  public func report(callConnected uuid: UUID, at: Date = Date.now) {
    cxProvider.reportOutgoingCall(with: uuid, connectedAt: at)
  }
  
  /// 전화가 종료되었음을 iOS에 보고합니다.
  public func report(callEnded uuid: UUID, reason: CXCallEndedReason, completionHandler: (() -> Void)? = nil) {
    cxProvider.reportCall(with: uuid, endedAt: Date.now, reason: reason)
    completionHandler?()
  }
  
  /// 전화를 종료합니다.
  public func endCall() {
    cxCallController.callObserver.calls.forEach { call in
      let action = CXEndCallAction(call: call.uuid)
      
      let transaction = CXTransaction(action: action)
      
      cxCallController.request(transaction) { error in
        if let error = error {
          SentrySDK.capture(error: error)
        }
      }
      cxProvider.reportCall(with: call.uuid, endedAt: Date.now, reason: .remoteEnded)
    }
  }
  
}


extension CallKitBridge: PKPushRegistryDelegate {
  public func pushRegistry(_ registry: PKPushRegistry, didUpdate pushCredentials: PKPushCredentials, for type: PKPushType) {
    self.pushCredentials = pushCredentials
  }
  
  public func pushRegistry(_ registry: PKPushRegistry, didReceiveIncomingPushWith payload: PKPushPayload, for type: PKPushType, completion: @escaping () -> Void) {
    self.handleNotification(forIncomingCall: payload, completionHandler: completion)
  }
}
