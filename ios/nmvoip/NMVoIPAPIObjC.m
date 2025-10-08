//
//  NMVoIPAPIObjC.m
//  nmoment
//
//  Created on 2/3/25.
//


#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(NMVoIPAPI, RCTEventEmitter)

RCT_EXTERN_METHOD(getAPNSToken: (RCTPromiseResolveBlock) resolve
                      rejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(reportOutgoingCall: (RCTPromiseResolveBlock) resolve
                            rejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(reportCallEnded: (RCTPromiseResolveBlock) resolve
                         rejecter: (RCTPromiseRejectBlock) reject)



@end