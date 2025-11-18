import React, {useEffect, useState, useRef} from "react";
import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  NativeEventEmitter,
  NativeModules,
} from "react-native";
import SocketIOClient from "socket.io-client";
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from "react-native-webrtc";
import InCallManager from "react-native-incall-manager";
import EncryptedStorage from "react-native-encrypted-storage";
import {NotchProvider, NotchView} from "react-native-notchclear";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {vw, vh, vmin, vmax} from "react-native-css-vh-vw";
import LinearGradient from "react-native-linear-gradient";
import Video from "react-native-video";
//import {LinearTextGradient} from "react-native-text-gradient";
import SplashScreen from "react-native-splash-screen";

import Share from "react-native-share";
import FastImage from "react-native-fast-image";
import Clipboard from "@react-native-clipboard/clipboard";
import api from "../../lib/api/api";
import {PALETTE} from "../../lib/constant/palette";
import serverURL from "../../lib/constant/serverURL";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {USER_GENDER} from "../../lib/constant/user-constant";
import Dialog from "react-native-dialog";
import {ITEM_LIST} from "../../lib/constant/item-constant";
import BackgroundTimer from "react-native-background-timer";
import {useIsFocused} from "@react-navigation/native";
import {TURN_USERNAME} from "@env";
import {DeviceEventEmitter} from "react-native";
import Loading from "../reusable/loading";
import {useIsHeadphonesConnected} from "react-native-device-info";
// import Voice from "@react-native-voice/voice";
import {BAN_KEYWORD} from "../../lib/constant/ban-constant";
import {COUNTRY_LIST} from "../../lib/constant/country-constant";
import {CallContext} from "../../contexts/CallContext";
import {v5 as uuidv5} from "uuid";
import {NMVoIPAPI} from "../../lib/native/NMVoIPAPI";
import Slider from "@react-native-community/slider";
import analytics from "@react-native-firebase/analytics";

export default function Call({
  FCMToken,
  country,
  user,
  updateUser,
  navigation,
  route,
  chatPlus,
  setChatPlus,
  appState,
  post,
  updatePost,
  room,
  updateRoom,
  rank,
  updateRank,
  point,
  updatePoint,
  connectSocket,
  callSocket,
  chatSocket,
  chatCount,
  setChatCount,
  endCall,
  youIdByCall,
}: {
  endCall: any;
  youIdByCall: any;
  chatCount: any;
  setChatCount: any;
  point: any;
  updatePoint: any;
  connectSocket: any;
  callSocket: any;
  chatSocket: any;
  post: any;
  updatePost: any;
  room: any;
  updateRoom: any;
  rank: any;
  updateRank: any;
  chatPlus?: any;
  setChatPlus?: any;
  FCMToken?: any;
  country?: any;
  user?: any;
  updateUser?: any;
  navigation?: any;
  route?: any;
  appState?: any;
}): JSX.Element {
  const callContext = React.useContext(CallContext);

  const insets = useSafeAreaInsets();
  const [localStream, setlocalStream]: any = useState(null);
  const [remoteStream, setRemoteStream]: any = useState(null);
  const RoomId = route.params?.RoomId;
  const caller = route.params?.caller;
  const incoming = route.params?.incoming;
  const otherUserId: any = useRef(route.params?.otherUserId);

  const [localMicOn, setlocalMicOn] = useState(true);
  const [localWebcamOn, setlocalWebcamOn] = useState(true);
  const [mainCameraMe, setMainCameraMe] = useState(true);

  const [timer, setTimer] = useState(0);
  const timer2: any = useRef(0);
  const [isRunning, setIsRunning] = useState(false);
  const [delay, setDelay] = useState(1000);

  const [item, setItem]: any = useState(null);
  const [gitShow, setGiftShow] = useState(false);
  const [newCode, setNewCode] = useState(null);
  const [newCount, setNewCount] = useState(0);
  const [newGift, setNewGift] = useState(false);

  const [waterMarkX, setWaterMarkX] = useState(50);
  const [waterMarkY, setWaterMarkY] = useState(50);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentType, setCurrentType] = useState("bright");

  const [brightValue, setBrightValue] = useState(10);
  const [skinValue, setSkinValue] = useState(10);
  const [noseValue, setNoseValue] = useState(10);
  const [eyeValue, setEyeValue] = useState(10);
  const [headValue, setHeadValue] = useState(10);

  useEffect(() => {
    async function getFilterValue() {
      setBrightValue(Number(await AsyncStorage.getItem("brightValue")));
      setSkinValue(Number(await AsyncStorage.getItem("skinValue")));
      setNoseValue(Number(await AsyncStorage.getItem("noseValue")));
      setEyeValue(Number(await AsyncStorage.getItem("eyeValue")));
      setHeadValue(Number(await AsyncStorage.getItem("headValue")));
    }
    getFilterValue();
  }, []);

  /*
  const [real, setReal] = useState(false);
  useEffect(() => {
    async function fetchData() {
      await api.get("/real").then(res => {
        setReal(res.data.real);
      });
    }
    fetchData();
  }, []);
  */
  // const [callVoiceText, setCallVoiceText] = useState<string>("");
  // const firstBanCheck = useRef(false);

  const [streamOk, setStreamOk] = useState(false);
  const [youStreamOk, setYouStreamOk] = useState(false);
  const [sdpOk, setSdpOk] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await api.get("/point/getMyItem").then(res => {
        setItem(res.data.item);
      });
      await api.get("/point/getMyPoint").then(res => {
        updatePoint(res.data.point);
      });
    }
    fetchData();
  }, []);

  let waterNum = 0;

  const startTime: any = useRef(new Date());
  //const [startTime, setStartTime]: any = useState(new Date());
  const startTimer = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      const currentTime: any = new Date().getTime();
      timer2.current = Math.floor(
        Number(currentTime / 1000) - Number(startTime.current / 1000),
      );

      setTimer(
        Math.floor(
          Number(currentTime / 1000) - Number(startTime.current / 1000),
        ),
      );
      if (waterNum % 11 === 0) {
        setWaterMarkX(Math.floor(Math.random() * 70) + 20);
        setWaterMarkY(Math.floor(Math.random() * 70) + 20);
      }
      waterNum++;
    }, 333);
  };
  useEffect(() => {
    startTime.current = new Date();
    //setStartTime(new Date());
    if (isRunning) startTimer();
    else BackgroundTimer.stopBackgroundTimer();
    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      if (USER_GENDER.BOY === user.gender && timer % 30 === 0) {
        //이후 1000포인트씩
        api
          .post("/call/afterConnectCost", {
            YouId: otherUserId.current,
          })
          .then(async res => {
            if (res.data.status === "true") {
              updatePoint(res.data.point);
              updateUser(res.data?.user);
            } else {
              //통화 끝
              Alert.alert(
                country === "ko"
                  ? `포인트가 부족합니다.`
                  : country === "ja"
                  ? `ポイントが足りません。`
                  : country === "es"
                  ? `No hay suficientes puntos.`
                  : country === "fr"
                  ? `Pas assez de points.`
                  : country === "id"
                  ? `Poin tidak cukup.`
                  : country === "zh"
                  ? `积分不够。`
                  : `Not enough points.`,
              );
              chatSocket.current.emit("endCall");
              peerConnection.current?.close();
              peerConnection.current = null;
              setlocalStream(null);
              endCall.current = timer2.current > 3 ? true : false;
              youIdByCall.current = otherUserId.current;

              navigation.navigate("Live");
              /*
              if (real) navigation.navigate("Live");
              else navigation.navigate("Home");
              */
            }
          });
      } else if (user.gender === USER_GENDER.GIRL && timer % 30 === 0) {
        if (timer === 0) {
          setTimeout(() => {
            api
              .post("/call/afterConnectCost", {
                YouId: otherUserId.current,
              })
              .then(res => {
                if (res.data.status === "true") {
                  updatePoint(res.data.point);
                }
              });
          }, 5000);
        } else {
          setTimeout(() => {
            api
              .post("/call/afterConnectCost", {
                YouId: otherUserId.current,
              })
              .then(res => {
                if (res.data.status === "true") {
                  updatePoint(res.data.point);
                }
              });
          }, 2500);
        }
      }
    }
  }, [timer, isRunning]);

  const peerConnection: any = useRef<RTCPeerConnection>(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
        {
          urls: "stun:stun1.l.google.com:19302",
        },
        {
          urls: "stun:stun2.l.google.com:19302",
        },
        {
          urls: `turn:3.36.227.137:3478`,
          username: "username",
          credential: TURN_USERNAME,
        },
      ],
    }),
  );

  let remoteRTCMessage: any = useRef(null);

  useEffect(() => {
    async function socketInit() {
      const accessToken = await EncryptedStorage.getItem("accessToken");
      chatSocket.current = SocketIOClient(`${serverURL}/chat`, {
        transports: ["websocket"],
        forceNew: true,
        query: {
          RoomId: RoomId,
          accessToken,
        },
      });

      chatSocket.current?.on("callGift", async (data: any) => {
        try {
          const code = data?.code;
          const count = data?.count;
          setNewCode(code);
          setNewCount(count);
          setNewGift(true);
          setTimeout(() => {
            setNewGift(false);
          }, 2500);
          await api.get("/point/getMyPoint").then(res => {
            updatePoint(res.data.point);
          });
        } catch (err) {
          console.error(err);
        }
      });
      chatSocket.current?.on("endCall", async (data: any) => {
        try {
          peerConnection.current?.close();
          peerConnection.current = null;
          setlocalStream(null);
          endCall.current = timer2.current > 3 ? true : false;

          youIdByCall.current = otherUserId.current;
          navigation.navigate("Live");
        } catch (err) {
          console.error(err);
        }
      });
      //streamOk
      chatSocket.current?.on("streamOk", async (data: any) => {
        try {
          const youId = data?.youId;
          if (Number(youId) === Number(otherUserId.current)) {
            setYouStreamOk(true);
          }
        } catch (err) {
          console.error(err);
        }
      });

      connectSocket.current?.on("newCall", async (data: any) => {
        try {
          remoteRTCMessage.current = data.rtcMessage;
          //에러 지점 실행이안됨
          //ADD
          if (remoteRTCMessage.current) {
            peerConnection.current
              ?.setRemoteDescription(
                new RTCSessionDescription(remoteRTCMessage.current),
              )
              .then(async () => {
                const sessionDescription =
                  await peerConnection.current?.createAnswer();
                await peerConnection.current?.setLocalDescription(
                  sessionDescription,
                );
                setIsRunning(true);
                answerCall({
                  callerId: otherUserId.current,
                  rtcMessage: sessionDescription,
                });
              });
          }
        } catch (err) {
          console.error(err);
        }
      });

      connectSocket.current?.on("callAnswered", async (data: any) => {
        try {
          remoteRTCMessage.current = data.rtcMessage;
          peerConnection.current?.setRemoteDescription(
            new RTCSessionDescription(remoteRTCMessage.current),
          );
          setIsRunning(true);
        } catch (err) {
          console.error(err);
        }
        //setIsRunning(true);
      });
      connectSocket.current?.on("ICEcandidate", (data: any) => {
        try {
          let message = data?.rtcMessage;
          if (peerConnection.current) {
            peerConnection.current
              ?.addIceCandidate(
                new RTCIceCandidate({
                  candidate: message?.candidate,
                  sdpMid: message?.id,
                  sdpMLineIndex: message?.label,
                }),
              )
              .then(async (data: any) => {
                console.log("SUCCESS");
              })
              .catch((err: any) => {
                console.log("Error", err);
              });
          }
        } catch (err) {
          console.error(err);
        }
      });

      // Setup ice handling 연결후 실행되야함
      peerConnection.current.onicecandidate = async (event: any) => {
        try {
          if (event.candidate) {
            sendICEcandidate({
              calleeId: otherUserId.current,
              rtcMessage: {
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate,
              },
            });
          } else {
            console.log("End of candidates.");
          }
        } catch (err) {
          console.error(err);
        }
      };

      peerConnection.current.onnegotiationneeded = async (event: any) => {
        if (peerConnection.current?.signalingState !== "stable") {
          return;
        }

        if (peerConnection.current?.signalingState === "stable") {
          setSdpOk(true);
        }
        //setSdpOk(true);
        console.log("onnegotiationneeded");
        console.log(event);
      };
      peerConnection.current.ontrack = (e: any) => {
        try {
          if (e && e.streams && e.streams[0]) {
            setRemoteStream(e?.streams[0]);
          }
        } catch (err) {
          console.error(err);
        }
      };
      return () => {
        connectSocket.current.off("newCall");
        connectSocket.current.off("callAnswered");
        connectSocket.current.off("ICEcandidate");
        chatSocket.current?.close();
        peerConnection.current?.close();
        peerConnection.current = null;
      };
    }
    socketInit();
  }, []);

  useEffect(() => {
    if (localStream) {
      //console.log("localstream 전송 완료!");
      chatSocket.current?.emit("streamOk", {
        youId: user?.id,
      });
    }
  }, [localStream]);

  const isFocused = useIsFocused();

  useEffect(() => {
    async function mediaDeviceInit() {
      let isFront = user?.gender === USER_GENDER.GIRL ? true : false; //asyncstorage
      await mediaDevices.enumerateDevices().then(async (sourceInfos: any) => {
        let videoSourceId;
        for (let i = 0; i < sourceInfos.length; i++) {
          const sourceInfo = sourceInfos[i];
          if (
            sourceInfo?.kind == "videoinput" &&
            sourceInfo?.facing == (isFront ? "user" : "environment")
          ) {
            videoSourceId = sourceInfo?.deviceId;
          }
        }
        await mediaDevices
          .getUserMedia({
            audio: true,
            video: {
              mandatory: {
                minWidth: vw(100), // Provide your own width, height and frame rate here
                minHeight: vh(100),
                minFrameRate: 60,
              },
              facingMode: isFront ? "user" : "environment",
              optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
            },
          })
          .then(async (stream: any) => {
            setlocalStream(stream);
            stream?.getTracks()?.forEach((track: any) => {
              peerConnection.current?.addTrack(track, stream);
            });
            setStreamOk(true);
          })
          .catch(error => {
            console.log("stream error");
            console.error(error);
          });
      });
    }
    mediaDeviceInit();
  }, []);

  function sendICEcandidate(data: any) {
    connectSocket.current.emit("ICEcandidate", data);
  }
  function answerCall(data: any) {
    connectSocket.current.emit("answerCall", data);
  }
  function sendCall(data: any) {
    connectSocket.current.emit("newCall", data);
  }
  function switchCamera() {
    localStream.getVideoTracks().forEach((track: any) => {
      track._switchCamera();
    });
  }

  function toggleCamera() {
    localWebcamOn ? setlocalWebcamOn(false) : setlocalWebcamOn(true);
    localStream.getVideoTracks().forEach((track: any) => {
      localWebcamOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function toggleMic() {
    localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
    localStream.getAudioTracks().forEach((track: any) => {
      localMicOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  async function leave() {
    peerConnection.current?.close();
    peerConnection.current = null;
    setlocalStream(null);
    chatSocket.current?.emit("endCall");
    endCall.current = timer2.current > 3 ? true : false;
    youIdByCall.current = otherUserId.current;
    navigation.navigate("Live");
    /*
    if (real) navigation.navigate("Live");
    else navigation.navigate("Home");
    */
  }

  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(1);
  const [selectCount, setSelectCount] = useState(0);
  const [selectCode, setSelectCode]: any = useState(null);
  const [loadingConnect, setLoadingConnect] = useState(true);

  useEffect(() => {
    if (sdpOk && streamOk) {
      async function connect() {
        if (!caller) {
          const sessionDescription = await peerConnection.current?.createOffer(
            {},
          );
          await peerConnection.current?.setLocalDescription(sessionDescription);
          //발송 먼저 걸지 않았던 사람이 해야하는게 맞는거같음
          sendCall({
            calleeId: otherUserId.current,
            rtcMessage: sessionDescription,
          }); //
        }
        /*
        setTimeout(() => {
          sendCall({
            calleeId: otherUserId.current,
            rtcMessage: sessionDescription,
          }); //
        }, 2500);
        */
        //
        //}
      }

      setTimeout(() => {
        connect();
      }, 1000);
    }
    setTimeout(() => {
      setLoadingConnect(false);
    }, 1000);
  }, [sdpOk, streamOk]);

  /*
  const _onSpeechStart = () => {
    console.log("onSpeechStart");
    // setVoiceToText("");
  };
  const _onSpeechEnd = () => {
    console.log("onSpeechEnd");
  };

  const _onSpeechResults = async (event: any) => {
    console.log("onSpeechResults");
    // console.log(event.value[0]);
    const callVoiceTextTmp = event.value[0];
    setCallVoiceText(callVoiceTextTmp);

    if (!firstBanCheck.current) {
      for (let i = 0; i < BAN_KEYWORD.LIST.length; i++) {
        if (callVoiceTextTmp.includes(BAN_KEYWORD.LIST[i])) {
          firstBanCheck.current = true;
          break;
        }
      }
    }
    // setVoiceToText(event.value[0]);
  };
  const _onSpeechError = (event: any) => {
    console.log("_onSpeechError");
    console.log(event.error);
  };

  if (user?.country === COUNTRY_LIST.한국 && Platform.OS === "ios") {
    useEffect(() => {
      Voice.onSpeechStart = _onSpeechStart;
      Voice.onSpeechEnd = _onSpeechEnd;
      Voice.onSpeechResults = _onSpeechResults;
      Voice.onSpeechError = _onSpeechError;
      Voice.start("ko-KR"); //통화 연결시
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, []);
  }
    */

  if (Platform.OS === "ios") {
    useEffect(() => {
      InCallManager.start();
      InCallManager.setKeepScreenOn(true);
      // InCallManager.setForceSpeakerphoneOn(true);
      if (Platform.OS === "ios") {
        InCallManager.setForceSpeakerphoneOn(
          !InCallManager.getIsWiredHeadsetPluggedIn(),
        );
      } else {
        /*
      // const detection: any = HeadphoneDetection.isAudioDeviceConnected();
      if (detection?.bluetooth) {
        // InCallManager.setSpeakerphoneOn(false);
      } else {
        InCallManager.setSpeakerphoneOn(true);
      }
        */
      }
    }, []);
  }

  const {loading, result} = useIsHeadphonesConnected();
  const [oneTime, setOneTime]: any = useState(0);

  if (Platform.OS === "android") {
    useEffect(() => {
      if (oneTime === 1) {
        if (result) {
        } else {
          InCallManager.start();
          InCallManager.setKeepScreenOn(true);
          InCallManager.setSpeakerphoneOn(true);
        }
      } else {
        if (!loading) {
          setTimeout(() => {
            setOneTime(1);
          }, 1000);
        }
      }
    }, [loading, result, oneTime]);
  }

  useEffect(() => {
    return () => {
      InCallManager?.stop();
    };
  }, []);

  useEffect(() => {
    if (!isFocused) {
      async function outFetch() {
        /*
        if (firstBanCheck.current) {
          await api.post("/call/banMonitor", {
            callVoiceText,
          });
        }
          */
        await api.post("/call/endCall/v2", {
          time: timer,
          RoomId,
        });
        if (user?.gender === USER_GENDER.BOY) {
          await api
            .get("/call/firebaseEventPurchase", {
              params: {
                YouId: otherUserId.current,
                time: timer,
              },
            })
            .then(async res => {
              if (res.data.status === "complete") {
                const value = res.data.value;
                await analytics().logPurchase({
                  currency: "KRW",
                  value,
                });
              }
            });
        }

        peerConnection.current?.close();
        peerConnection.current = null;
        setlocalStream(null);
        chatSocket.current?.emit("endCall");
      }
      outFetch();
    }
  }, [isFocused]);

  /*
  useEffect(() => {
    async function fetchData() {
      await api.get("/call/firebaseEventCall").then(async res => {
        if (res.data.status === "complete") {
          const count = res.data.count;
          await analytics().logEvent("nmoment_call", {
            count,
          });
        }
      });
    }
    fetchData();
  }, []);
  */

  useEffect(() => {
    /*
    if (!incoming && Platform.OS === "ios") {
      callContext?.startCall(
        RoomId,
        // 상대방 ID를 알 수 없는 경우 "unknown"을 대신 넘깁니다.
        String(otherUserId?.current) ?? "unknown",
        // TODO: 사용자 닉네임을 넘겨야 합니다.
        "nmoment video call",
        "outgoing",
      );
    }
      */
    //해당 코드가 무조건 실행되어야함
    // return () => {
    // if (Platform.OS === "ios") {
    // NMVoIPAPI().reportCallEnded();
    // }
    // };
  }, []);

  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["left"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={"light-content"}
      />
      <Dialog.Container visible={visible}>
        <Dialog.Title>
          {country === "ko"
            ? `선물 하시겠습니까? `
            : country === "ja"
            ? `プレゼントしますか？ `
            : country === "es"
            ? `¿Quieres regalarlo? `
            : country === "fr"
            ? `Vous souhaitez l'offrir en cadeau ? `
            : country === "id"
            ? `Apakah Anda ingin memberikannya sebagai hadiah? `
            : country === "zh"
            ? `您想把它作为礼物送给您吗？ `
            : `Would you like to give it as a gift? `}
        </Dialog.Title>
        <Dialog.Description>
          {country === "ko"
            ? `선물수량을 입력해주세요. `
            : country === "ja"
            ? `ギフト数量を入力してください。 `
            : country === "es"
            ? `Por favor ingrese la cantidad del regalo.`
            : country === "fr"
            ? `Veuillez entrer la quantité du cadeau. `
            : country === "id"
            ? `Silakan masukkan jumlah hadiah.`
            : country === "zh"
            ? `请输入礼品数量。 `
            : `Please enter the gift quantity. `}
        </Dialog.Description>
        <Dialog.Input
          keyboardType="decimal-pad"
          onChangeText={(e: any) => {
            if (isNaN(e)) {
              setCount(1);
              return;
            } else if (parseInt(e) >= selectCount) {
              setCount(selectCount);
              return;
            } else if (parseInt(e) <= 1) {
              setCount(1);
              return;
            } else {
              setCount(e);
            }
          }}>
          {count}
        </Dialog.Input>
        <Dialog.Button
          label={
            country === "ko"
              ? `취소`
              : country === "ja"
              ? `キャンセル`
              : country === "es"
              ? `cancelación`
              : country === "fr"
              ? `annulation`
              : country === "id"
              ? `pembatalan`
              : country === "zh"
              ? `消除`
              : `cancellation`
          }
          color="red"
          onPress={() => {
            setVisible(false);
            //after
            setCount(1);
          }}
        />
        <Dialog.Button
          label={
            country === "ko"
              ? `선물`
              : country === "ja"
              ? `贈り物`
              : country === "es"
              ? `regalo`
              : country === "fr"
              ? `cadeau`
              : country === "id"
              ? `hadiah`
              : country === "zh"
              ? `礼物`
              : `gift`
          }
          onPress={async () => {
            if (count > selectCount) {
              //선물개수 부족
              Alert.alert(
                country === "ko"
                  ? `선물개수가 부족합니다.`
                  : country === "ja"
                  ? `ギフト数が足りません。`
                  : country === "es"
                  ? `No hay suficientes regalos.`
                  : country === "fr"
                  ? `Il n'y a pas assez de cadeaux.`
                  : country === "id"
                  ? `Hadiahnya tidak cukup.`
                  : country === "zh"
                  ? `礼物不够。`
                  : `There are not enough gifts.`,
              );

              return;
            } else {
              await api
                .post("/point/giftItemByCall", {
                  code: selectCode,
                  count,
                  YouId: otherUserId.current,
                })
                .then(res => {
                  if (res.data.status === "true") {
                    const item = res.data.item;
                    Alert.alert(
                      country === "ko"
                        ? `선물 완료`
                        : country === "ja"
                        ? `プレゼント完了`
                        : country === "es"
                        ? `regalo completo`
                        : country === "fr"
                        ? `cadeau complet`
                        : country === "id"
                        ? `hadiah lengkap`
                        : country === "zh"
                        ? `礼物完成`
                        : `gift complete`,
                    );

                    setItem(item);
                    chatSocket.current.emit("callGift", {
                      code: selectCode,
                      count,
                    });
                  } else if (res.data.status === "ban") {
                    Alert.alert(
                      country === "ko"
                        ? `차단된 방입니다.`
                        : country === "ja"
                        ? `ブロックされた部屋です。`
                        : country === "es"
                        ? `Esta es una habitación bloqueada.`
                        : country === "fr"
                        ? `C'est une pièce bloquée.`
                        : country === "id"
                        ? `Ini adalah ruangan yang diblokir.`
                        : country === "zh"
                        ? `这是一个被封锁的房间。`
                        : `This is a blocked room.`,
                      country === "ko"
                        ? `차단 해제후 채팅 가능합니다.`
                        : country === "ja"
                        ? `ブロック解除後チャット可能です。`
                        : country === "es"
                        ? `Puedes chatear después de desbloquear.`
                        : country === "fr"
                        ? `Vous pouvez discuter après le déblocage.`
                        : country === "id"
                        ? `Anda dapat mengobrol setelah membuka blokir.`
                        : country === "zh"
                        ? `解封后就可以聊天了。`
                        : `You can chat after unblocking.`,
                    );
                  } else {
                    Alert.alert(
                      country === "ko"
                        ? `오류 발생`
                        : country === "ja"
                        ? `エラーが発生しました`
                        : country === "es"
                        ? `Error ocurrido`
                        : country === "fr"
                        ? `Erreur détectée`
                        : country === "id"
                        ? `Kesalahan terjadi`
                        : country === "zh"
                        ? `发生错误`
                        : `Error occurred`,
                      country === "ko"
                        ? `다시 시도해주세요`
                        : country === "ja"
                        ? `もう一度試してください`
                        : country === "es"
                        ? `Inténtelo de nuevo`
                        : country === "fr"
                        ? `Réessayez`
                        : country === "id"
                        ? `Coba lagi`
                        : country === "zh"
                        ? `请再试一次`
                        : `Please try again`,
                    );
                  }
                });
            }
            //after
            setVisible(false);
            setCount(1);
          }}
        />
      </Dialog.Container>
      <View
        style={{
          flex: 1,
          position: "absolute",
          zIndex: 20,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          // width: vw(100),
          // height: vh(100),
        }}>
        <Text
          style={{
            zIndex: 20,
            position: "absolute",
            top: vh(waterMarkY),
            left: vw(waterMarkX),
            color: "rgba(0,0,0,0.4)",
            fontSize: 12,
          }}>
          ID:{user?.id}
        </Text>
      </View>
      {loadingConnect === true && <Loading></Loading>}

      {showFilterModal && (
        <View
          style={{
            position: "absolute",
            zIndex: 5,
            bottom: 0,
            height: vh(35),
            width: vw(100),
            justifyContent: "space-between",
          }}>
          <View
            style={{
              height: "20%",
              paddingLeft: vw(4),
              paddingRight: vw(4),
              // justifyContent:'center',
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}>
            <View
              style={{
                width: "10%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}>
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                }}
                onPress={() => {
                  if (currentType === "bright") {
                    setBrightValue(10);
                    AsyncStorage.setItem("brightValue", String(10));
                  } else if (currentType === "skin") {
                    setSkinValue(10);
                    AsyncStorage.setItem("skinValue", String(10));
                  } else if (currentType === "eye") {
                    setEyeValue(10);
                    AsyncStorage.setItem("eyeValue", String(10));
                  } else if (currentType === "nose") {
                    setNoseValue(10);
                    AsyncStorage.setItem("noseValue", String(10));
                  } else if (currentType === "head") {
                    setHeadValue(10);
                    AsyncStorage.setItem("headValue", String(10));
                  }
                }}>
                <Image
                  source={require("../../assets/setting/refreshW.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingLeft: vw(2),
                paddingRight: vw(2),
                width: "80%",
                height: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}>
              <Slider
                style={{width: "100%"}}
                minimumValue={0}
                maximumValue={100}
                thumbTintColor={"#ffffff"}
                value={
                  currentType === "bright"
                    ? brightValue
                    : currentType === "skin"
                    ? skinValue
                    : currentType === "eye"
                    ? eyeValue
                    : currentType === "nose"
                    ? noseValue
                    : headValue
                }
                onValueChange={e => {
                  if (currentType === "bright") {
                    setBrightValue(e);
                    AsyncStorage.setItem("brightValue", String(e.toFixed()));
                  } else if (currentType === "skin") {
                    setSkinValue(e);
                    AsyncStorage.setItem("skinValue", String(e.toFixed()));
                  } else if (currentType === "eye") {
                    setEyeValue(e);
                    AsyncStorage.setItem("eyeValue", String(e.toFixed()));
                  } else if (currentType === "nose") {
                    setNoseValue(e);
                    AsyncStorage.setItem("noseValue", String(e.toFixed()));
                  } else if (currentType === "head") {
                    setHeadValue(e);
                    AsyncStorage.setItem("headValue", String(e.toFixed()));
                  }
                }}
                minimumTrackTintColor={PALETTE.COLOR_RED}
                maximumTrackTintColor={PALETTE.COLOR_ICON}
              />
            </View>
            <View
              style={{
                width: "10%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}></View>
          </View>
          <View
            style={{
              height: "80%",
              backgroundColor: PALETTE.COLOR_WHITE,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingLeft: vw(4),
              paddingRight: vw(4),
            }}>
            <View
              style={{
                height: "35%",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 18,
                }}>
                {country === "ko"
                  ? "AI 필터"
                  : country === "ja"
                  ? "AIフィルター"
                  : country === "es"
                  ? "Filtro de IA"
                  : country === "fr"
                  ? "Filtre AI"
                  : country === "id"
                  ? "Filter AI"
                  : country === "zh"
                  ? "AI过滤器"
                  : "AI filter"}
              </Text>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  setShowFilterModal(false);
                }}>
                <Image
                  source={require("../../assets/setting/downG.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: "45%",
                justifyContent: "space-between",
                flexDirection: "row",
                alignContent: "center",
                alignItems: "flex-start",
                width: "100%",
              }}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  width: vw(15),
                }}
                onPress={() => {
                  setCurrentType("bright");
                }}>
                <View
                  style={
                    currentType === "bright"
                      ? {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                          borderRadius: 100,
                          borderWidth: 2,
                          borderColor: PALETTE.COLOR_RED,
                        }
                      : {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                        }
                  }>
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      width: vw(13),
                      height: vw(13),
                      backgroundColor: PALETTE.COLOR_BACK,
                      borderRadius: 100,
                    }}>
                    <Image
                      source={require("../../assets/chat/bright.png")}
                      style={{
                        width: vw(8),
                        height: vw(8),
                      }}></Image>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "500",
                  }}>
                  {country === "ko"
                    ? "밝기"
                    : country === "ja"
                    ? "明るさ"
                    : country === "es"
                    ? "Brillo"
                    : country === "fr"
                    ? "Luminosité"
                    : country === "id"
                    ? "Kecerahan"
                    : country === "zh"
                    ? "亮度"
                    : "Brightness"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  width: vw(15),
                }}
                onPress={() => {
                  setCurrentType("skin");
                }}>
                <View
                  style={
                    currentType === "skin"
                      ? {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                          borderRadius: 100,
                          borderWidth: 2,
                          borderColor: PALETTE.COLOR_RED,
                        }
                      : {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                        }
                  }>
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      width: vw(13),
                      height: vw(13),
                      backgroundColor: PALETTE.COLOR_BACK,
                      borderRadius: 100,
                    }}>
                    <Image
                      source={require("../../assets/chat/skin.png")}
                      style={{
                        width: vw(6.5),
                        height: vw(6.5),
                      }}></Image>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "500",
                  }}>
                  {country === "ko"
                    ? "피부"
                    : country === "ja"
                    ? "肌"
                    : country === "es"
                    ? "Piel"
                    : country === "fr"
                    ? "Peau"
                    : country === "id"
                    ? "Kulit"
                    : country === "zh"
                    ? "皮肤"
                    : "Skin"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  width: vw(15),
                }}
                onPress={() => {
                  setCurrentType("eye");
                }}>
                <View
                  style={
                    currentType === "eye"
                      ? {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                          borderRadius: 100,
                          borderWidth: 2,
                          borderColor: PALETTE.COLOR_RED,
                        }
                      : {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                        }
                  }>
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      width: vw(13),
                      height: vw(13),
                      backgroundColor: PALETTE.COLOR_BACK,
                      borderRadius: 100,
                    }}>
                    <Image
                      source={require("../../assets/chat/eye.png")}
                      style={{
                        width: vw(6.5),
                        height: vw(6.5),
                      }}></Image>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "500",
                  }}>
                  {country === "ko"
                    ? "눈"
                    : country === "ja"
                    ? "目"
                    : country === "es"
                    ? "Ojos"
                    : country === "fr"
                    ? "Yeux"
                    : country === "id"
                    ? "Mata"
                    : country === "zh"
                    ? "眼睛"
                    : "Eyes"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  width: vw(15),
                }}
                onPress={() => {
                  setCurrentType("nose");
                }}>
                <View
                  style={
                    currentType === "nose"
                      ? {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                          borderRadius: 100,
                          borderWidth: 2,
                          borderColor: PALETTE.COLOR_RED,
                        }
                      : {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                        }
                  }>
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      width: vw(13),
                      height: vw(13),
                      backgroundColor: PALETTE.COLOR_BACK,
                      borderRadius: 100,
                    }}>
                    <Image
                      source={require("../../assets/chat/nose.png")}
                      style={{
                        width: vw(6.5),
                        height: vw(6.5),
                      }}></Image>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "500",
                  }}>
                  {country === "ko"
                    ? "코"
                    : country === "ja"
                    ? "鼻"
                    : country === "es"
                    ? "Nariz"
                    : country === "fr"
                    ? "Nez"
                    : country === "id"
                    ? "Hidung"
                    : country === "zh"
                    ? "鼻子"
                    : "Nose"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  width: vw(15),
                }}
                onPress={() => {
                  setCurrentType("head");
                }}>
                <View
                  style={
                    currentType === "head"
                      ? {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                          borderRadius: 100,
                          borderWidth: 2,
                          borderColor: PALETTE.COLOR_RED,
                        }
                      : {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                        }
                  }>
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      width: vw(13),
                      height: vw(13),
                      backgroundColor: PALETTE.COLOR_BACK,
                      borderRadius: 100,
                    }}>
                    <Image
                      source={require("../../assets/chat/head.png")}
                      style={{
                        width: vw(8),
                        height: vw(8),
                      }}></Image>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "500",
                  }}>
                  {country === "ko"
                    ? "얼굴"
                    : country === "ja"
                    ? "顔"
                    : country === "es"
                    ? "Rostro"
                    : country === "fr"
                    ? "Visage"
                    : country === "id"
                    ? "Wajah"
                    : country === "zh"
                    ? "脸"
                    : "Face"}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: "20%",
              }}></View>
          </View>
        </View>
      )}

      {newGift === true && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            zIndex: 15,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            width: vw(100),
            height: vh(100),
          }}>
          <View
            style={{
              borderRadius: 20,
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}>
            {newCode === ITEM_LIST.ITEM_CAKE.code ? (
              <Image
                source={require("../../assets/setting/store-cake.png")}
                style={{
                  width: vw(30),
                  height: vw(30),
                }}></Image>
            ) : newCode === ITEM_LIST.ITEM_CANDY.code ? (
              <Image
                source={require("../../assets/setting/store-candy.png")}
                style={{
                  width: vw(30),
                  height: vw(30),
                }}></Image>
            ) : newCode === ITEM_LIST.ITEM_CROWN.code ? (
              <Image
                source={require("../../assets/setting/store-crown.png")}
                style={{
                  width: vw(30),
                  height: vw(30),
                }}></Image>
            ) : newCode === ITEM_LIST.ITEM_HEART.code ? (
              <Image
                source={require("../../assets/setting/store-heart.png")}
                style={{
                  width: vw(30),
                  height: vw(30),
                }}></Image>
            ) : newCode === ITEM_LIST.ITEM_RING.code ? (
              <Image
                source={require("../../assets/setting/store-ring.png")}
                style={{
                  width: vw(30),
                  height: vw(30),
                }}></Image>
            ) : (
              newCode === ITEM_LIST.ITEM_ROSE.code && (
                <Image
                  source={require("../../assets/setting/store-rose.png")}
                  style={{
                    width: vw(30),
                    height: vw(30),
                  }}></Image>
              )
            )}
          </View>
          <View style={{}}>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}>
              {country === "ko"
                ? `${newCount}개 선물 하였습니다💕`
                : country === "ja"
                ? `${newCount}犬プレゼントしました💕`
                : country === "es"
                ? `Te regalé ${newCount}💕`
                : country === "fr"
                ? `Je t'en ai offert ${newCount} en cadeau💕`
                : country === "id"
                ? `Aku memberimu ${newCount} sebagai hadiah💕`
                : country === "zh"
                ? `我送了你1个作为礼物💕`
                : `I gave you ${newCount} as a gift💕`}
            </Text>
          </View>
        </View>
      )}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setGiftShow(false);
          setShowFilterModal(false);
        }}
        style={{
          flex: 1,
          backgroundColor: PALETTE.COLOR_BLACK,
        }}>
        {remoteStream ? (
          <RTCView
            mirror={true}
            objectFit={"cover"}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
            streamURL={
              mainCameraMe === true
                ? remoteStream && remoteStream?.toURL()
                : localStream && localStream?.toURL()
            }
          />
        ) : (
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "black",
              zIndex: 1,
            }}></View>
        )}
        <View
          style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: 999,
            elevation: 999,
            justifyContent: "space-between",
            paddingLeft: vw(2),
            paddingRight: vw(2),
          }}
          pointerEvents="box-none">
          <View
            style={{
              width: "100%",
              alignItems: "flex-end",
            }}>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                borderRadius: 100,
                paddingLeft: 4,
                paddingRight: 2,
                paddingTop: 2,
                paddingBottom: 2,
                backgroundColor: PALETTE.COLOR_MAIN,
                marginBottom: vh(2),
                marginTop: vh(2),
              }}>
              <Image
                source={require("../../assets/setting/point.png")}
                style={{
                  borderRadius: 100,
                  width: 25,
                  height: 25,
                  marginRight: 2,
                }}></Image>
              <View
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: PALETTE.COLOR_MAIN,
                  borderRadius: 100,
                  paddingTop: 9,
                  paddingBottom: 9,
                  paddingLeft: 5,
                  paddingRight: 5,
                  minWidth: 30,
                }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color: "black",
                  }}>
                  {Number(point?.amount).toLocaleString()}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={{
                width: vw(20),
                height: vw(35),
                zIndex: 2,
              }}
              onPress={() => {
                setMainCameraMe(!mainCameraMe);
              }}>
              {localStream ? (
                <RTCView
                  objectFit={"cover"}
                  mirror={true}
                  zOrder={1}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 20,
                    overflow: "hidden",
                    borderColor: PALETTE.COLOR_WHITE,
                    borderWidth: 1,
                    backgroundColor: PALETTE.COLOR_BACK,
                  }}
                  streamURL={
                    mainCameraMe === true
                      ? localStream && localStream?.toURL()
                      : remoteStream && remoteStream?.toURL()
                  }
                />
              ) : (
                <View
                  style={{
                    width: vw(20),
                    height: vw(35),
                    borderRadius: 20,
                    borderColor: PALETTE.COLOR_WHITE,
                    borderWidth: 1,
                    backgroundColor: PALETTE.COLOR_BACK,
                  }}></View>
              )}
            </TouchableOpacity>

            <View
              style={{
                marginTop: vh(2),
                borderRadius: 100,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                minWidth: 80,
                paddingLeft: 4,
                paddingRight: 4,
                height: 30,
                backgroundColor: "rgba(0,0,0,0.5)",
              }}>
              <Text
                style={{
                  color: PALETTE.COLOR_WHITE,
                  fontWeight: "bold",
                }}>
                {Math.floor(timer / 60)}:{timer % 60}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                marginTop: vh(1.5),
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                borderRadius: 100,
                width: 35,
                height: 35,
              }}
              onPress={() => {
                Alert.alert(
                  country === "ko"
                    ? `신고 되었습니다.`
                    : country === "ja"
                    ? `報告されました。`
                    : country === "es"
                    ? `Ha sido reportado.`
                    : country === "fr"
                    ? `Il a été rapporté.`
                    : country === "id"
                    ? `Telah di laporkan.`
                    : country === "zh"
                    ? `据报道。`
                    : `It has been reported.`,
                );
              }}>
              <Image
                source={require("../../assets/chat/danger.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: vh(1.5),
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                borderRadius: 100,
                width: 35,
                height: 35,
              }}
              onPress={() => {
                toggleMic();
              }}>
              <Image
                source={
                  localMicOn === true
                    ? require("../../assets/chat/micOn.png")
                    : require("../../assets/chat/micOff.png")
                }
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginTop: vh(1.5),
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                borderRadius: 100,
                width: 35,
                height: 35,
              }}
              onPress={() => {
                toggleCamera();
              }}>
              <Image
                source={
                  localWebcamOn === true
                    ? require("../../assets/chat/videoWOn.png")
                    : require("../../assets/chat/videoWOff.png")
                }
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: vh(1.5),
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                borderRadius: 100,
                width: 35,
                height: 35,
              }}
              onPress={() => {
                switchCamera();
              }}>
              <Image
                source={require("../../assets/chat/cameraSwitch.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              paddingLeft: vw(6),
              paddingRight: vw(6),
              justifyContent: "space-between",
              marginBottom: vh(2),
            }}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                zIndex: 10,
              }}
              onPress={() => {
                setGiftShow(!gitShow);
              }}>
              {gitShow === true && (
                <View
                  style={{
                    //transform: [{translateY: -10}, {translateX: 10}],
                    position: "absolute",
                    //height: vh(70),
                    backgroundColor: "rgba(0,0,0,0.5)",
                    bottom: 0,
                    width: vw(20),
                    borderRadius: 20,
                    padding: 5,
                    paddingTop: 10,
                    justifyContent: "space-between",
                    paddingBottom: vh(6),
                  }}>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      marginBottom: vh(1),
                    }}
                    onPress={async () => {
                      setGiftShow(false);
                      setVisible(true);
                      setSelectCode(ITEM_LIST.ITEM_CANDY.code);
                      setSelectCount(item?.candy_count);
                    }}>
                    <Image
                      source={require("../../assets/setting/store-candy.png")}
                      style={{
                        width: vh(4),
                        height: vh(4),
                      }}></Image>
                    <Text
                      style={{
                        marginTop: 5,
                        color: "white",
                        fontSize: 10,
                      }}>
                      {country === "ko"
                        ? `캔디바`
                        : country === "ja"
                        ? `キャンディーバー`
                        : country === "es"
                        ? `barra de chocolate`
                        : country === "fr"
                        ? `barre chocolatée`
                        : country === "id"
                        ? `permen batangan`
                        : country === "zh"
                        ? `糖果条`
                        : `candy bar`}
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                      }}>
                      x{item?.candy_count}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      marginBottom: vh(1),
                    }}
                    onPress={async () => {
                      setGiftShow(false);
                      setVisible(true);
                      setSelectCode(ITEM_LIST.ITEM_ROSE.code);
                      setSelectCount(item?.rose_count);
                    }}>
                    <Image
                      source={require("../../assets/setting/store-rose.png")}
                      style={{
                        width: vh(4),
                        height: vh(4),
                      }}></Image>
                    <Text
                      style={{
                        marginTop: 5,
                        color: "white",
                        fontSize: 10,
                      }}>
                      {country === "ko"
                        ? `장미꽃`
                        : country === "ja"
                        ? `バラの花`
                        : country === "es"
                        ? `Rosa`
                        : country === "fr"
                        ? `Rose`
                        : country === "id"
                        ? `Mawar`
                        : country === "zh"
                        ? `玫瑰`
                        : `Rose`}
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                      }}>
                      x{item?.rose_count}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      marginBottom: vh(1),
                    }}
                    onPress={async () => {
                      setGiftShow(false);
                      setVisible(true);
                      setSelectCode(ITEM_LIST.ITEM_CAKE.code);
                      setSelectCount(item?.cake_count);
                    }}>
                    <Image
                      source={require("../../assets/setting/store-cake.png")}
                      style={{
                        width: vh(4),
                        height: vh(4),
                      }}></Image>
                    <Text
                      style={{
                        marginTop: 5,
                        color: "white",
                        fontSize: 10,
                      }}>
                      {country === "ko"
                        ? `케이크`
                        : country === "ja"
                        ? `ケーキ`
                        : country === "es"
                        ? `pastel`
                        : country === "fr"
                        ? `gâteau`
                        : country === "id"
                        ? `kue`
                        : country === "zh"
                        ? `蛋糕`
                        : `cake`}
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                      }}>
                      x{item?.cake_count}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      marginBottom: vh(1),
                    }}
                    onPress={async () => {
                      setGiftShow(false);
                      setVisible(true);
                      setSelectCode(ITEM_LIST.ITEM_RING.code);
                      setSelectCount(item?.ring_count);
                    }}>
                    <Image
                      source={require("../../assets/setting/store-ring.png")}
                      style={{
                        width: vh(4),
                        height: vh(4),
                      }}></Image>
                    <Text
                      style={{
                        marginTop: 5,
                        color: "white",
                        fontSize: 10,
                      }}>
                      {country === "ko"
                        ? `다이아몬드 링`
                        : country === "ja"
                        ? `ダイヤモンドリング`
                        : country === "es"
                        ? `anillo de diamantes`
                        : country === "fr"
                        ? `bague de diamant`
                        : country === "id"
                        ? `cincin berlian`
                        : country === "zh"
                        ? `钻戒`
                        : `diamond ring`}
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                      }}>
                      x{item?.ring_count}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      marginBottom: vh(1),
                    }}
                    onPress={async () => {
                      setGiftShow(false);
                      setVisible(true);
                      setSelectCode(ITEM_LIST.ITEM_CROWN.code);
                      setSelectCount(item?.crown_count);
                    }}>
                    <Image
                      source={require("../../assets/setting/store-crown.png")}
                      style={{
                        width: vh(4),
                        height: vh(4),
                      }}></Image>
                    <Text
                      style={{
                        marginTop: 5,
                        color: "white",
                        fontSize: 10,
                      }}>
                      {country === "ko"
                        ? `보석 왕관`
                        : country === "ja"
                        ? `ジュエリークラウン`
                        : country === "es"
                        ? `corona de joyas`
                        : country === "fr"
                        ? `couronne de bijoux`
                        : country === "id"
                        ? `mahkota permata`
                        : country === "zh"
                        ? `宝石皇冠`
                        : `jewel crown`}
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                      }}>
                      x{item?.crown_count}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      marginBottom: vh(1),
                    }}
                    onPress={async () => {
                      setGiftShow(false);
                      setVisible(true);
                      setSelectCode(ITEM_LIST.ITEM_HEART.code);
                      setSelectCount(item?.heart_count);
                    }}>
                    <Image
                      source={require("../../assets/setting/store-heart.png")}
                      style={{
                        width: vh(4),
                        height: vh(4),
                      }}></Image>
                    <Text
                      style={{
                        marginTop: 5,
                        color: "white",
                        fontSize: 10,
                      }}>
                      {country === "ko"
                        ? `메가하트`
                        : country === "ja"
                        ? `メガハート`
                        : country === "es"
                        ? `mega corazon`
                        : country === "fr"
                        ? `Méga coeur`
                        : country === "id"
                        ? `Mega Hati`
                        : country === "zh"
                        ? `超级之心`
                        : `Mega Heart`}
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                      }}>
                      x{item?.heart_count}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <Image
                source={require("../../assets/chat/gift.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                leave();
              }}>
              <Image
                source={require("../../assets/chat/outCall.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                borderRadius: 100,
              }}
              onPress={() => {
                // setShowFilterModal(true);
              }}>
              {/*
              <Image
                source={require("../../assets/setting/facew.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
                */}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </NotchView>
  );
}
