/* eslint-disable prettier/prettier */
import React, { useContext, useEffect } from "react";
import { default as SocketIOClient } from "socket.io-client";

import { Alert, AppState } from "react-native";

import { NMVoIPAPI, NMVoIPPushPayload } from "../lib/native/NMVoIPAPI";
import { CallContext } from "../contexts/CallContext";
import api from "../lib/api/api";
import Toast from "react-native-toast-message";
import SoundPlayer from "react-native-sound-player";
import EncryptedStorage from "react-native-encrypted-storage";


type MaybeSocket = ReturnType<typeof SocketIOClient>;

/**
 * CallKit 이벤트를 처리하는 Hook
 */
export function useCallKitEvent(user: any,
  callAccept: React.MutableRefObject<boolean>,
  connectSocket: React.RefObject<MaybeSocket>,
  navigation: React.RefObject<any>) {
  const callContext: any = useContext(CallContext);

  useEffect(() => {
    if (user.id) {
      EncryptedStorage.setItem("userId", String(user.id));
      EncryptedStorage.setItem("userGender", String(user.gender));
      // EncryptedStorage.setItem("userId", String(user.id));
      // EncryptedStorage.setItem("userGender", String(user.gender));
    }
  }, [user]);

  useEffect(() => {
    const eventEmitter = NMVoIPAPI().eventEmitter;

    // iOS 시스템 UI를 통해 '전화 받기' 버튼이 눌렸을 때
    const answerCall = eventEmitter.addListener('answerCall', async ({ uuid, payload }) => {
      SoundPlayer.stop();

      const parsed: NMVoIPPushPayload = JSON.parse(payload);
      const you = JSON.parse(parsed.you);

      //console.log(parsed);

      if (user.id === null) {
        console.error("user.id가 null입니다!! 캐싱된 값을 사용하게 될 것입니다.");
      }

      {
        const res = await api.get("/room/getRoomCallingState", {
          params: {
            RoomId: parsed.RoomId,
          },
        });
        if (res.data.status !== "true" || !(res.data.room?.calling ?? false)) {
          callContext.endCall();
          return;
        }
      }


      const startCall = async () => {
        const userId = user?.id ?? await EncryptedStorage.getItem("userId");
        const userGender = user?.gender ?? await EncryptedStorage.getItem("userGender");

        connectSocket.current?.emit("acceptConnectCall", {
          otherUserId: userId,
          YouId: you.id,
          RoomId: parsed.RoomId,
        });
        setTimeout(() => {
          navigation.current?.navigate("Call", {
            RoomId: parsed.RoomId,
            otherUserId: you.id,
            caller: false,
            gender: userGender,
            incoming: true,
          });
        }, 500)

      };


      callAccept.current = true;

      setTimeout(() => {
        callAccept.current = false;
      }, 5000);


      // FIXME: 백그라운드에서 돌아온 뒤라서 setTimeout 필요할 수 있음!!!

      if (AppState.currentState === "active") {
        startCall();
        setTimeout(() => Toast.hide(), 150);
        callContext.startCall(Number(parsed.RoomId), you.id, you.nickname, 'incoming');
        NMVoIPAPI().reportCallEnded();
      } else {
        const change = AppState.addEventListener('change', (state) => {
          if (state === "active") {
            startCall();
            setTimeout(() => Toast.hide(), 150);
            callContext.startCall(Number(parsed.RoomId), you.id, you.nickname, 'incoming');
            NMVoIPAPI().reportCallEnded();
            change.remove();
          }
        });
      }
    });

    // iOS 시스템 UI를 통해 '음소거' 버튼이 눌렸을 때
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mute = eventEmitter.addListener('mute', async ({ muted }) => {
      // TODO: 음소거 상태를 처리합니다.
    });

    return () => {
      answerCall.remove();
      mute.remove();
    };
  }, [user]);

  useEffect(() => {
    const eventEmitter = NMVoIPAPI().eventEmitter;

    // iOS 시스템 UI를 통해 '전화 종료' 버튼이 눌렸거나, 전화가 종료되었을 때
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const endCall = eventEmitter.addListener('endCall', async ({ uuid, payload }) => {

      callAccept.current = true;
      if (payload) {
        const parsed: NMVoIPPushPayload = JSON.parse(payload);
        const you = JSON.parse(parsed.you);
        await api.post("/call/stopCall", {
          YouId: you.id,
          calling: false,
        });
        connectSocket?.current?.emit("denyConnectCall", {
          YouId: you.id,
        });
      } else if (callContext.isInCall) {
        await api.post("/call/stopCall", {
          YouId: callContext?.opponentId,
          calling: false,
        });
        /*
        connectSocket?.current?.emit("denyConnectCall", {
          YouId: callContext?.opponentId,
        });
        */
      }
      Toast?.hide()
      setTimeout(() => {
        callAccept.current = false;
      }, 5000);

      callContext.endCall();
    });

    return () => {
      endCall.remove();
    };
  }, [callContext]);
}
