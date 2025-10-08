/* eslint-disable prettier/prettier */
import { EmitterSubscription, NativeEventEmitter, NativeModules, Platform } from "react-native";

type NMVoIPAPIEvent = {
  'answerCall': { uuid: string; payload: string; };
  'endCall': { uuid: string; payload?: string; };
  'mute': { muted: boolean };
};

export type NMVoIPPushPayload = {
  screen: 'Call',
  RoomId: string,
  YouId: string,
  you: string,
  // gender: String(user?.gender),
  // avgTime: String(user?.avgTime),
  // avgScore: String(user?.avgScore),
  vip: string,
  callTime: string,
};

type INMVoIPAPIEventEmitter = Omit<NativeEventEmitter, 'addListener'> & {
  addListener<E extends keyof NMVoIPAPIEvent>(eventType: E, listener: (event: NMVoIPAPIEvent[E]) => unknown): EmitterSubscription;
}

type INMVoIPAPI = {
  eventEmitter: INMVoIPAPIEventEmitter;

  /**
   * APNS (PushKit VoIP) 토큰을 가져옵니다.
   *
   * @returns APNS 토큰이 없으면 `null`을 반환합니다.
   */
  getAPNSToken(): Promise<string | null>;

  /**
   * **나가는 전화**를 iOS에 보고합니다.
   *
   * @param opponentId - 상대방 사용자의 ID
   * @param displayName - 상대방 사용자의 표시명 (닉네임)
   *
   * @throws { Error } - UUID 형식이 아닌 방 ID가 전달되었거나, iOS 내부 오류가 발생하면 예외를 던집니다.
   */
  reportOutgoingCall(): Promise<unknown>;

  /**
   * **전화가 종료되었음**을 iOS에 보고합니다.
   */
  reportCallEnded(): Promise<unknown>;
}

if (Platform.OS === 'ios') {
  NativeModules.NMVoIPAPI.eventEmitter = new NativeEventEmitter(NativeModules.NMVoIPAPI);
}

const NMVoIPAPIEventEmitterDummy: INMVoIPAPIEventEmitter = {
  addListener: () => ({ remove: () => { } }),
} as unknown as any;

const NMVoIPAPIDummy: INMVoIPAPI = {
  eventEmitter: NMVoIPAPIEventEmitterDummy,

  getAPNSToken: async () => null,
  reportOutgoingCall: async () => { },
  reportCallEnded: async () => { },
};

export const NMVoIPAPI: () => INMVoIPAPI =
  () => Platform.OS === 'ios' ? NativeModules.NMVoIPAPI : NMVoIPAPIDummy;