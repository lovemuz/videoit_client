/* eslint-disable prettier/prettier */

import * as React from "react";

import {v5 as uuidv5} from "uuid";
import {NMVoIPAPI} from "../lib/native/NMVoIPAPI";

type CallContextBase = {
  startCall: (
    roomId: number,
    opponentId: string,
    displayName: string,
    direction: "incoming" | "outgoing",
  ) => unknown;
  endCall: () => unknown;
};

type CallContextBody =
  | {
      isInCall: true;

      /** 현재 입장해 있는 room id */
      roomId: number;

      /** uuid v5에 의하여 재표현된(해싱된) room id */
      roomUUID: string;

      /** 상대방의 user id */
      opponentId: string;

      /** 상대방의 닉네임 */
      displayName: string;
    }
  | {
      isInCall: false;
    };

type CallContext = CallContextBody & CallContextBase;

export const CallContext = React.createContext<CallContext>({
  isInCall: false,
  startCall: () => {},
  endCall: () => {},
});

export const CallContextProvider: React.FC<{children: JSX.Element}> = ({
  children,
}) => {
  const [contextBody, setContextBody] = React.useState<CallContextBody>({
    isInCall: false,
  });

  const startCall = async (
    roomId: number,
    opponentId: string,
    displayName: string,
    direction: "incoming" | "outgoing",
  ) => {
    const roomUUID = uuidv5(
      String(roomId),
      "764B29E1-A819-48C2-8EF1-C851918BA2A5",
    );
    setContextBody({
      isInCall: true,
      roomId,
      roomUUID,
      opponentId,
      displayName,
    });

    if (direction === "outgoing") {
      // 나가는 전화이므로 iOS에 보고합니다.
      // (user -> iOS)
      try {
        await NMVoIPAPI().reportOutgoingCall();
      } catch (e) {
        console.error("iOS: 나가는 전화를 보고하는데 실패하였습니다", e);
      }
    } else if (direction === "incoming") {
      // iOS를 통해 들어오는 전화이므로 별도로 처리하지 않습니다.
      // (iOS -> user)
      // noop
    }
  };

  const endCall = async () => {
    try {
      await NMVoIPAPI().reportCallEnded();
    } catch (e) {
      console.error("iOS: 통화 종료를 보고하는데 실패하였습니다", e);
    }

    setContextBody({
      isInCall: false,
    });
  };

  return (
    <CallContext.Provider value={{...contextBody, startCall, endCall}}>
      {children}
    </CallContext.Provider>
  );
};
