//
//  NMVoIPAPI.swift
//  nmoment
//
//  Created on 2/3/25.
//

import AVFAudio
import CallKit

/// NMVoIPAPI - CallKit 기능을 React Native에서 호출하거나, 관련 이벤트를 수신하기 위한 어댑터 모듈
@objc(NMVoIPAPI)
@objcMembers
class NMVoIPAPI: RCTEventEmitter {
  var cxBridge: CallKitBridge {
    get { CallKitBridge.shared }
  }
  
  override init() {
    super.init()
    
    // CallKitBridge의 CXProviderDelegate를 자신으로 설정합니다.
    cxBridge.setCXDelegate(self)
  }
  
  public override class func requiresMainQueueSetup() -> Bool {
    return true
  }

  public override func supportedEvents() -> [String]! {
    return [
      "answerCall",
      "endCall",
      "mute"
    ]
  }
  
  func getAPNSToken(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    resolve(cxBridge.pushCredentials?.token.hexEncodedString())
  }
  
  func reportOutgoingCall(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let roomUUID = UUID()
    
    cxBridge.report(outgoingCall: roomUUID, handle: "anonymous", as: "nmoment video call") { error in
      if let error = error {
        reject("E_CALLKIT_ERROR", error.localizedDescription, error)
      } else {
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
          self.cxBridge.report(callConnected: roomUUID)
          resolve(true)
        }
      }
    }
  }
  
  func reportCallEnded(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    cxBridge.endCall()
    resolve(true)
  }
}

extension NMVoIPAPI: CXProviderDelegate {
  func providerDidReset(_ provider: CXProvider) {
    // NOOP
  }
  
  func provider(_ provider: CXProvider, perform action: CXStartCallAction) {
    // noop
    
    action.fulfill()
  }
  
  func provider(_ provider: CXProvider, perform action: CXAnswerCallAction) {
    let payload = cxBridge.incomingCallPayload
    cxBridge.incomingCallPayload = nil
    
    self.sendEvent(withName: "answerCall", body: [
      "uuid": action.callUUID.uuidString,
      "payload": payload
    ])
    
    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
      self.cxBridge.report(callConnected: action.callUUID)
    }
    action.fulfill()
  }
  
  func provider(_ provider: CXProvider, perform action: CXEndCallAction) {
    let payload = cxBridge.incomingCallPayload
    cxBridge.incomingCallPayload = nil
    
    self.sendEvent(withName: "endCall", body: [
      "uuid": action.callUUID.uuidString,
      "payload": payload
    ])
    
    cxBridge.endCall()
    
    action.fulfill()
  }
  
  func provider(_ provider: CXProvider, perform action: CXSetMutedCallAction) {
    self.sendEvent(withName: "mute", body: ["muted": action.isMuted])
    action.fulfill()
  }
  
  func provider(_ provider: CXProvider, didActivate audioSession: AVAudioSession) {
    DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
      do {
        try audioSession.setCategory(.playAndRecord, mode: .videoChat, options: [.allowBluetooth, .allowBluetoothA2DP])
        try audioSession.setActive(true)
      } catch {
        print(error)
      }
    }
  }

  func provider(_ provider: CXProvider, didDeactivate audioSession: AVAudioSession) {
    try? audioSession.setActive(false)
  }

}