import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  AppState,
  NativeModules,
  Linking,
  Alert,
  TouchableOpacity,
} from "react-native";

import {StackActions} from "@react-navigation/routers";
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {NotchProvider} from "react-native-notchclear";
import axios from "axios";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification, {Importance} from "react-native-push-notification";
import {request, PERMISSIONS, RESULTS} from "react-native-permissions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EncryptedStorage from "react-native-encrypted-storage";
import InCallManager from "react-native-incall-manager";
import {DeviceEventEmitter} from "react-native";

import {connect} from "react-redux";
import {getUser, updateUser} from "./reduxModules/user";
import {getPost, updatePost} from "./reduxModules/post";
import {getRoom, updateRoom} from "./reduxModules/room";
import {getRank, updateRank} from "./reduxModules/rank";
import {getPoint, updatePoint} from "./reduxModules/point";
import BackgroundTimer from "react-native-background-timer";
import {createStore} from "redux";
import {Provider} from "react-redux";
import rootReducer from "./reduxModules/index";
import SplashScreen from "react-native-splash-screen";
// import Toast, {BaseToast, ErrorToast} from "react-native-toast-message";
import RootStackNavigator from "./screens/navigation/RootStackNavigator";
import api from "./lib/api/api";
import {requestTrackingPermission} from "react-native-tracking-transparency";
import {vw, vh, vmin, vmax} from "react-native-css-vh-vw";
import {
  CaptureProtection,
  CaptureProtectionModuleStatus,
  useCaptureProtection,
} from "react-native-capture-protection";
import serverURL from "./lib/constant/serverURL";
import SocketIOClient from "socket.io-client";
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
} from "react-native-webrtc";
import {USER_GENDER} from "./lib/constant/user-constant";
import {DEV_MODE} from "@env";
import {CHAT_TYPE} from "./lib/constant/chat-constant";
import {showCall, ToastComponent, hideShow} from "./screens/reusable/useToast";
import mobileAds from "react-native-google-mobile-ads";
import {LIVE_CONSTANT} from "./lib/constant/live-constant";
import messaging from "@react-native-firebase/messaging";
import {PALETTE} from "./lib/constant/palette";
import FastImage from "react-native-fast-image";
import Toastable from "react-native-toastable";
import SoundPlayer from "react-native-sound-player";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import analytics from "@react-native-firebase/analytics";
import RNNotificationCall from "react-native-full-screen-notification-incoming-call";

import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from "sp-react-native-in-app-updates";
import DeviceInfo from "react-native-device-info";
import appsFlyer from "react-native-appsflyer";

import {CallContextProvider} from "./contexts/CallContext";
import {NMVoIPAPI} from "./lib/native/NMVoIPAPI";
import {useCallKitEvent} from "./hooks/useCallKitEvent";

const mapStateToProps = (state: any) => ({
  user: state.user.user,
  post: state.post.post,
  room: state.room.room,
  rank: state.rank.rank,
  point: state.point.point,
});
const mapDispatchProps = (
  dispatch: (arg0: {type: string; input?: any}) => void,
) => ({
  getUser: () => {
    dispatch(getUser());
  },
  updateUser: (input: any) => {
    dispatch(updateUser(input));
  },
  getPoint: () => {
    dispatch(getPoint());
  },
  updatePoint: (input: any) => {
    dispatch(updatePoint(input));
  },
  getPost: () => {
    dispatch(getPost());
  },
  updatePost: (input: any) => {
    dispatch(updatePost(input));
  },
  getRank: () => {
    dispatch(getRank());
  },
  updateRank: (input: any) => {
    dispatch(updateRank(input));
  },
  getRoom: () => {
    dispatch(getRoom());
  },
  updateRoom: (input: any) => {
    dispatch(updateRoom(input));
  },
});

const Stack = createStackNavigator();

const inAppUpdates = new SpInAppUpdates(
  false, // isDebug
);

function App({
  user,
  updateUser,
  //post,
  //updatePost,
  //room,
  //updateRoom,
  rank,
  updateRank,
  point,
  updatePoint,
}: {
  point: any;
  updatePoint: any;
  user: any;
  updateUser: any;
  //post: any;
  //updatePost: any;
  //room: any;
  //updateRoom: any;
  rank: any;
  updateRank: any;
}): JSX.Element {
  useEffect(() => {
    // console.log(DeviceInfo.getVersion())
    const curVersion = DeviceInfo.getVersion();
    inAppUpdates.checkNeedsUpdate({curVersion}).then(result => {
      /** curVersion 버전이 스토어 버전보다 낮다면 */
      // let updateOptions: StartUpdateOptions = {};
      if (result.shouldUpdate) {
        /** android */
        Alert.alert(
          country === "ko"
            ? "업데이트"
            : country === "ja"
            ? "アップデート"
            : country === "es"
            ? "Actualización"
            : country === "fr"
            ? "Mise à jour"
            : country === "id"
            ? "Pembaruan"
            : country === "zh"
            ? "更新"
            : "Update",
          country === "ko"
            ? "새 버젼이 출시 되었습니다. 업데이트 후 이용 바랍니다."
            : country === "ja"
            ? "新しいバージョンがリリースされました。アップデート後にご利用ください。"
            : country === "es"
            ? "Se ha lanzado una nueva versión. Por favor, actualícela antes de usarla."
            : country === "fr"
            ? "Une nouvelle version a été publiée. Veuillez effectuer la mise à jour avant de l'utiliser."
            : country === "id"
            ? "Versi baru telah dirilis. Silakan perbarui sebelum digunakan."
            : country === "zh"
            ? "新版本已发布。请更新后使用。"
            : "A new version has been released. Please update before use.",
          [
            {
              text:
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
                  : `cancellation`,
              style: "cancel",
            },
            {
              text:
                country === "ko"
                  ? "업데이트"
                  : country === "ja"
                  ? "アップデート"
                  : country === "es"
                  ? "Actualización"
                  : country === "fr"
                  ? "Mise à jour"
                  : country === "id"
                  ? "Pembaruan"
                  : country === "zh"
                  ? "更新"
                  : "Update",
              onPress: async () => {
                if (Platform.OS === "android") {
                  const url =
                    "https://play.google.com/store/apps/details?id=com.traveler.nmoment";
                  Linking.canOpenURL(url).then(supported => {
                    if (supported) {
                      Linking.openURL(url);
                    }
                  });
                } else if (Platform.OS === "ios") {
                  /** app store로 보낸다 (app store가 깔려있어야만 작동, 뒤 숫자는 앱 id) */
                  const url = "itms-apps://itunes.apple.com/app/6466714321";
                  Linking.canOpenURL(url).then(supported => {
                    if (supported) {
                      Linking.openURL(url);
                    }
                  });
                }
              },
            },
          ],
        );
        // inAppUpdates.startUpdate(updateOptions);
      }
    });
  }, []);

  useEffect(() => {
    /* sample OneLink URL
      https://b1devaf.onelink.me/eEY3?af_xp=social&pid=kakao&c=test&af_dp=b1devaf%3A%2F%2F&deep_link_value=DLValue&deep_link_sub1=DLSub1&deep_link_sub2=DLSub2&deep_link_sub3=DLSub3&deep_link_sub4=DLSub4&deep_link_sub5=DLSub5&deep_link_sub6=DLSub6&deep_link_sub7=DLSub7&deep_link_sub8=DLSub8&deep_link_sub9=DLSub9&deep_link_sub10=DLSub10
    */

    // STEP 1: 옵션 세팅
    const option: any = {
      isDebug: false, // Production 환경에서는 false로 설정
      appId: Platform.select({
        ios: "6466714321", // iOS 앱 ID(id값만 넣어야 함)
        android: "com.traveler.nmoment", // Android 앱 Package Name
      }),
      devKey: Platform.select({
        ios: "pPDa6u798WghQDf8B5hTJ6", // iOS Dev Key(AppsFlyer Console)
        android: "pPDa6u798WghQDf8B5hTJ6", // Android Dev Key(AppsFlyer Console)
      }),
      timeToWaitForATTUserAuthorization: 10, // iOS ATT 권한 획득 대기 시간(seconds)
      onDeepLinkListener: true,
    };

    // STEP 2: 딥링크 데이터 수신 리스너 설정
    appsFlyer.onDeepLink(async res => {
      // console.log("[DEBUG] onDeepLink:", JSON.stringify(res));

      if (res?.deepLinkStatus === "FOUND") {
        console.log("[DEBUG] Deep Link Data FOUND");

        const isDeferred = res?.isDeferred;
        //디퍼드 딥링크 = true 앱이 설치되지 않은 상태 에서 OneLink URL 클릭 후 앱스토어를 경유하여 설치한 한 후 앱 실행
        //딥링크 = false 앱이 설치된 상태 에서 OneLink URL을 클릭한 경우 자동으로 앱 실행
        const deep_link_value: any =
          res?.data?.deep_link_value?.toLocaleLowerCase(); // adCode, code
        const codeValue: any = res?.data?.deep_link_sub1?.toLocaleLowerCase(); //value

        //남성 레퍼럴
        if (isDeferred && deep_link_value === "adcode") {
          // 레퍼럴 추적 시작해야함
          const cnv_id: any = res?.data?.deep_link_sub2?.toLocaleLowerCase(); //마케팅 회사용
          await AsyncStorage.setItem("adCode", codeValue);
          await AsyncStorage.setItem("cnv_id", cnv_id);
        } else if (deep_link_value === "code") {
          // 여성 레퍼럴
          await AsyncStorage.setItem("code", codeValue);
        }
        /* 
          CASE 1: 디퍼드 딥링크인 경우(앱이 설치되지 않은 상태에서 OneLink URL 클릭 후 앱스토어를 경우하여 설치한 경우)
          {
            "deepLinkStatus": "FOUND",
            "status": "success",
            "type": "onDeepLinking",
            "data": {
              "campaign_id": "",
              "af_sub3": "",
              "match_type": "probabilistic",
              "af_sub1": "",
              "deep_link_value": "DLValue",
              "campaign": "",
              "af_sub4": "",
              "timestamp": "2025-02-19T01:48:22.431",
              "click_http_referrer": "",
              "af_sub5": "",
              "media_source": "",
              "af_sub2": "",
              "deep_link_sub4": "DLSub4",
              "deep_link_sub9": "DLSub9",
              "deep_link_sub2": "DLSub2",
              "deep_link_sub3": "DLSub3",
              "deep_link_sub8": "DLSub8",
              "deep_link_sub1": "DLSub1",
              "deep_link_sub10": "DLSub10",
              "deep_link_sub5": "DLSub5",
              "deep_link_sub7": "DLSub7",
              "deep_link_sub6": "DLSub6",
              "is_deferred": true
            },
            "isDeferred": true
          }

          CASE 2: 딥링크인 경우(앱이 설치된 상태에서 OneLink URL을 클릭한 경우)
          {
            "deepLinkStatus": "FOUND",
            "status": "success",
            "type": "onDeepLinking",
            "data": {
              "af_dp": "b1devaf://",
              "deep_link_sub6": "DLSub6",
              "deep_link_sub7": "DLSub7",
              "deep_link_sub10": "DLSub10",
              "deep_link_sub8": "DLSub8",
              "deep_link_sub9": "DLSub9",
              "media_source": "referral",
              "scheme": "b1devaf",
              "link": "b1devaf://?af_deeplink=true&af_dp=b1devaf%3A%2F%2F&af_xp=custom&campaign=male&deep_link_sub1=DLSub1&deep_link_sub10=DLSub10&deep_link_sub2=DLSub2&deep_link_sub3=DLSub3&deep_link_sub4=DLSub4&deep_link_sub5=DLSub5&deep_link_sub6=DLSub6&deep_link_sub7=DLSub7&deep_link_sub8=DLSub8&deep_link_sub9=DLSub9&deep_link_value=DLValue&media_source=referral",
              "deep_link_sub1": "DLSub1",
              "deep_link_sub2": "DLSub2",
              "deep_link_sub3": "DLSub3",
              "deep_link_sub4": "DLSub4",
              "deep_link_sub5": "DLSub5",
              "deep_link_value": "DLValue",
              "path": "",
              "af_xp": "custom",
              "host": "",
              "campaign": "male",
              "is_deferred": false
            },
            "isDeferred": false
          }
        */
        // setDeepLinkData(JSON.stringify(res.data, null, 2));
      } else {
        console.log("[DEBUG] Deep Link Data NOT FOUND");
      }
    });

    // STEP 3: SDK 초기화
    appsFlyer.initSdk(
      option,
      result => {
        console.log(
          "[DEBUG] AppsFlyer initSdk Success:",
          JSON.stringify(result),
        );
      },
      error => {
        console.error(
          "[DEBUG] AppsFlyer initSdk Error:",
          JSON.stringify(error),
        );
      },
    );

    return () => {
      console.log("[DEBUG] Cleaning up AppsFlyer...");
      appsFlyer.stop(true);
    };
  }, []);

  const store = createStore(rootReducer);

  const navigation: any = useRef(null);
  const connectSocket: any = useRef(null);
  const callSocket: any = useRef(null);
  const chatSocket: any = useRef(null);

  const [myFollowing, setMyFollowing]: any = useState([]);
  const [post, updatePost]: any = useState([]);
  const [room, updateRoom]: any = useState([]);
  const [adminRoom, updateAdminRoom]: any = useState(null);
  const [chatCount, setChatCount]: any = useState(0);
  const [FCMToken, setFCMToken]: any = useState(null);

  const endCall: any = useRef(false);
  const youIdByCall: any = useRef(null);

  useEffect(() => {
    async function dataTokenSave() {
      await AsyncStorage.setItem(
        "fcmToken",
        JSON.stringify({
          token: FCMToken,
        }),
      );
    }
    dataTokenSave();
  }, [FCMToken]);
  useEffect(() => {
    async function tokenHandOver() {
      const token: any = await AsyncStorage.getItem("fcmToken");
      if (token?.token) setFCMToken(token?.token);
    }
    tokenHandOver();
  }, []);
  useEffect(() => {
    async function tokenUpdate() {
      try {
        await api.put(`/user/tokenUpdate`, {
          pushToken: FCMToken,
        });
      } catch (err) {}
    }
    if (user?.id && FCMToken) {
      tokenUpdate();
    }
  }, [user, FCMToken]);

  useEffect(() => {
    async function apnsTokenUpdate(token: string | null) {
      try {
        await api.put("/user/apnsUpdate", {
          apnsToken: token,
        });
      } catch (err) {
        console.warn("APNS 토큰 업데이트 실패", err);
      }
    }

    if (Platform.OS === "ios") {
      NMVoIPAPI()
        .getAPNSToken()
        .then(token => {
          if (token) {
            apnsTokenUpdate(token);
          }
        });
    } else {
      apnsTokenUpdate(null);
    }
  }, [user]);

  const {isPrevent, status} = useCaptureProtection();

  useEffect(() => {
    CaptureProtection.preventScreenRecord();
    CaptureProtection.preventScreenshot();
    /*
    if (Platform.OS === "ios") {
      CaptureProtection.addEventListener(({status, isPrevent}) => {
        if (status === 6) {
          console.log("prevent Status is", isPrevent);
          console.log("Capture Status is", status);
          if (user.id) navigation.current?.navigate("Live");
        }
      });
    }
    */
  }, []);

  const callAccept: any = useRef(false);

  const [calling, setCalling] = useState(false);
  const [timer, setTimer] = useState(15);
  const [isRunning, setIsRunning] = useState(false);
  const callEndByMe: any = useRef(false);
  const [modalState, setModalState]: any = useState(false);

  //const [callYou, setCallYou]: any = useState(null);
  //const [callRoomId, setCallRoomId]: any = useState(null);
  const callYou: any = useRef(null);
  const callRoomId: any = useRef(null);
  const endCallByAnswer: any = useRef(false);

  const appState: any = useRef(AppState.currentState);
  const backgroundCheck: any = useRef(false);
  const [backgroundChk, setBackgroundChk]: any = useState(false);

  const [reconnectSocket, setReconnectSocket] = useState(true);

  useEffect(() => {
    if (user.id !== null) {
      async function getNotReadRoomCount() {
        try {
          await api.get("/room/getNotReadRoomCount").then(res => {
            setChatCount(res.data?.count);
          });
        } catch (err) {}
      }
      getNotReadRoomCount();
    }
  }, [user]);
  useEffect(() => {
    if (user.id !== null && reconnectSocket) {
      async function connectSocketInit() {
        try {
          setReconnectSocket(false);
          await api.post("/user/accessTokenRefresh").then(async res => {
            if (res.data.status === "true") {
              const accessTokenFromServer = res.data.accessToken;
              await EncryptedStorage.setItem(
                "accessToken",
                accessTokenFromServer,
              );
            }
          });
          ///accessToken 만료 될수도 있으니 재 갱신 해야함
          const accessToken = await EncryptedStorage.getItem("accessToken");
          connectSocket.current = SocketIOClient(`${serverURL}/connect`, {
            transports: ["websocket"],
            forceNew: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
            query: {
              accessToken,
            },
          });
          connectSocket.current.on("disconnect", () => {
            setReconnectSocket(true);
          });

          connectSocket.current.on("stopCall", (data: any) => {
            try {
              //
              SoundPlayer.stop();
              hideShow();
            } catch (err) {
              console.error(err);
            }
          });
          connectSocket.current.on("tryConnectCall", (data: any) => {
            try {
              
              Alert.alert('111');
              const RoomId = data.RoomId;
              const you = data.you;
              const avgTime: number = data.avgTime;
              const avgScore: number = data.avgScore;
              const vip: boolean = data.vip;
              const gender: number = data?.gender;
              callRoomId.current = RoomId;
              callYou.current = you;
              //백그라운드 일때만 떠야하는데 뜨드록, 15초 뒤에 꺼야함
              if (navigation.current?.getCurrentRoute()?.name !== "Call") {
                if (user?.soundOn) {
                  if (Platform.OS !== "ios") {
                    SoundPlayer.playAsset(require("./assets/live/bell.mp3"));
                  }
                }
                showCall({
                  result: {
                    connectSocket,
                    callAccept: callAccept,
                    RoomId,
                    you,
                    avgTime,
                    avgScore,
                    vip,
                    gender,
                  },
                });
              }
            } catch (err) {
              console.error(err);
            }
          });
          connectSocket.current.on("newChat", async (data: any) => {
            try {
              const newRoom = data?.room;
              const admin = data?.admin;
              const notShow = data?.notShow;
              if (admin) {
                updateAdminRoom(newRoom);
              } else {
                updateRoom((prevRoom: any) =>
                  prevRoom.length === 0
                    ? [
                        {
                          ...newRoom,
                          profile:
                            newRoom?.Chats[0].UserId === user?.id
                              ? newRoom?.profileYou
                              : newRoom?.profile,
                          nick:
                            newRoom?.Chats[0].UserId === user?.id
                              ? newRoom?.nickYou
                              : newRoom?.nick,
                          read:
                            newRoom?.Chats[0].UserId === user?.id
                              ? true
                              : false,
                        },
                      ]
                    : [
                        {
                          ...newRoom,
                          profile:
                            newRoom?.Chats[0].UserId === user?.id
                              ? newRoom?.profileYou
                              : newRoom?.profile,
                          nick:
                            newRoom?.Chats[0].UserId === user?.id
                              ? newRoom?.nickYou
                              : newRoom?.nick,
                          read:
                            newRoom?.Chats[0].UserId === user?.id
                              ? true
                              : false,
                        },
                        ...prevRoom.filter(
                          (item: any) => item?.id !== newRoom?.id,
                        ),
                      ],
                );
              }
              try {
                await api.get("/room/getNotReadRoomCount").then(res => {
                  setChatCount(res.data?.count);
                });
              } catch (err) {}
              if (newRoom?.Chats[0].UserId !== user?.id && !notShow) {
                if (navigation.current?.getCurrentRoute()?.name !== "Call") {
                  showMessage({
                    // backgroundColor: "rgba(0,0,0,0)",
                    message: JSON.stringify({
                      type: "onChat", //onPost
                      RoomId: newRoom?.id,
                      url:
                        newRoom?.Chats[0].UserId === user?.id
                          ? newRoom?.profileYou
                          : newRoom?.profile,
                      title:
                        newRoom?.Chats[0].UserId === user?.id
                          ? newRoom?.nickYou
                          : newRoom?.nick,
                      content:
                        newRoom?.Chats[0].type === CHAT_TYPE.CHAT_IMAGE
                          ? "사진을 보냈습니다."
                          : newRoom?.Chats[0].type === CHAT_TYPE.CHAT_VIDEO
                          ? "동영상을 보냈습니다."
                          : newRoom?.Chats[0].content,
                    }),
                    onPress: () => {
                      // console.log(1)
                      hideMessage();
                    },
                  });
                }
              }
            } catch (err) {
              console.error(err);
            }
          });
          connectSocket.current.on("newPost", async (data: any) => {
            try {
              const you = data?.you;
              if (navigation.current?.getCurrentRoute()?.name !== "Call") {
                showMessage({
                  // backgroundColor: "rgba(0,0,0,0)",
                  message: JSON.stringify({
                    type: "onPost", //onPost
                    you,
                  }),
                  onPress: () => {
                    // console.log(1)
                    hideMessage();
                  },
                });
              }
            } catch (err) {
              console.error(err);
            }
          });

          connectSocket.current?.on("acceptConnectCall", (data: any) => {
            try {
              const RoomId = data?.RoomId;
              const otherUserId = data?.otherUserId;
              setModalState(LIVE_CONSTANT?.MODAL_STATE_DEFAULT);
              setCalling(false);
              setIsRunning(false);
              setTimer(15);
              navigation.current?.navigate("Call", {
                RoomId,
                otherUserId,
                caller: true,
                // incoming: false,
              });
            } catch (err) {
              console.error(err);
            }
          });
          connectSocket.current?.on("denyConnectCall", (data: any) => {
            try {
              setCalling(false);
              setIsRunning(false);
              setTimer(15);
              if (!callEndByMe.current) {
                Alert.alert(
                  country === "ko"
                    ? `통화 거절`
                    : country === "ja"
                    ? `通話を拒否`
                    : country === "es"
                    ? `Rechazar llamada`
                    : country === "fr"
                    ? `Refuser l'appel`
                    : country === "id"
                    ? `Menolak panggilan`
                    : country === "zh"
                    ? `拒绝通话`
                    : `Decline call`,
                  country === "ko"
                    ? `상대방이 거절하였습니다.`
                    : country === "ja"
                    ? `相手が拒否しました。`
                    : country === "es"
                    ? `La otra persona ha rechazado.`
                    : country === "fr"
                    ? `La personne a refusé.`
                    : country === "id"
                    ? `Pihak lain telah menolak.`
                    : country === "zh"
                    ? `对方已拒绝`
                    : `The other party has declined.`,
                );
              } else {
                callEndByMe.current = false;
              }
            } catch (err) {
              console.error(err);
            }
          });
        } catch (err) {}

        return () => {
          //connectSocket.current?.off("tryConnectCall");
          //connectSocket.current?.off("stopCall");
          //chatSocket.current?.off("newChat");
          chatSocket.current?.close();
          connectSocket.current?.close();
        };
      }
      connectSocketInit();
    }
  }, [user, reconnectSocket]);

  useEffect(() => {
    PushNotificationIOS.addEventListener("notification", onRemoteNotification);
  });

  const onRemoteNotification = async (notification: any) => {};

  PushNotification.createChannel(
    {
      channelId: "videoit",
      channelName: "videoit",
      //channelDescription: 'lovelyme',
      playSound: true, // (optional) default: true
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );

  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: async function (token: any) {
      const tokenFromFir = await messaging().getToken();
      setFCMToken(tokenFromFir);
    },
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: async function (notification) {
      //setChatCount(true);
      //console.log(notification?.data);
      //notification?.data?.userInteraction:1 -> 알림 클릭했을때
      if (
        (Platform.OS === "ios" &&
          notification?.data &&
          notification?.data?.userInteraction === 1) ||
        (Platform.OS === "android" && notification.data.collapse_key)
      ) {
        const data = notification.data;
        const screen = data?.screen;

        if (screen === "Live") {
          navigation.current?.navigate("Live");
        } else if (screen === "Profile") {
          const YouId = data?.YouId;
          if (navigation.current?.getCurrentRoute()?.name === "Profile") {
            navigation.current?.dispatch(
              StackActions.replace(`Profile`, {
                YouId,
              }),
            );
          } else {
            navigation.current?.navigate("Profile", {
              YouId,
            });
          }
        } else if (screen === "Call") {
          const RoomId = data?.RoomId;
          const you = JSON.parse(data?.you);
          const gender = you?.gender;
          const avgTime = you?.avgTime;
          const avgScore = you?.avgScore;
          const vip = JSON.parse(data?.vip);
          const callTime = data?.callTime;
          /*
          //푸시 알림 보낸지 15초 차이 안난다면
          //상대방이 "나에게" 통화중일때
          const callAfterTime = new Date(Number(callTime)).getTime();
          const currentTime = new Date().getTime();
          const difference = Math.floor((currentTime - callAfterTime) / 1000);
          */
          try {
            await api
              .get("/room/getRoomCallingState", {
                params: {
                  RoomId,
                },
              })
              .then(res => {
                if (res.data.status === "true") {
                  const room = res.data.room;
                  if (/*difference < 15 &&*/ room?.calling) {
                    if (
                      navigation.current?.getCurrentRoute()?.name !== "Call"
                    ) {
                      if (user?.soundOn) {
                        if (Platform.OS !== "ios") {
                          SoundPlayer.playAsset(
                            require("./assets/live/bell.mp3"),
                          );
                        }
                      }
                      showCall({
                        result: {
                          connectSocket,
                          callAccept: callAccept,
                          RoomId,
                          you,
                          avgTime,
                          avgScore,
                          vip,
                          gender,
                        },
                      });
                    }
                  }
                }
              });
          } catch (err) {}
        } else if (screen === "Chat") {
          const RoomId = data?.RoomId;
          navigation.current?.navigate("Chat", {
            RoomId,
          });
        } else if (screen === "Comment") {
          const PostId = data?.PostId;
          navigation.current?.navigate("Comment", {
            PostId,
          });
        } else {
          navigation.current?.navigate("Live");
        }
      }
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {},

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
      console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    //@ts-ignore
    senderID: "422174200666",
    popInitialNotification: true,
    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
    ignoreInForeground: false,
  });

  PushNotification.popInitialNotification(notification => {
    console.log("Initial Notification", notification);
  });
  PushNotification.getChannels(function (channel_ids) {
    console.log("channel TTI", channel_ids); // ['channel_id_1']
  });

  const language = String(
    Platform.OS === "ios"
      ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
      : NativeModules?.I18nManager?.localeIdentifier,
  ).slice(0, 2);

  const [country, setCountry] = useState(
    // AsyncStorage.getItem('country')?AsyncStorage.getItem('country')
    language === "id" ||
      language === "fr" ||
      language === "es" ||
      language === "zh" ||
      language === "ja" ||
      language === "ko" ||
      language === "en"
      ? language
      : "en",
  );
  useEffect(() => {
    async function fetchCountryData() {
      const afterCountry: any = (await AsyncStorage.getItem("country"))
        ? await AsyncStorage.getItem("country")
        : language === "id" ||
          language === "fr" ||
          language === "es" ||
          language === "zh" ||
          language === "ja" ||
          language === "ko" ||
          language === "en"
        ? language
        : "en";
      setCountry(afterCountry);
    }
    fetchCountryData();
  }, []);

  useEffect(() => {
    if (Platform.OS === "android" && user?.id) {
      RNNotificationCall.addEventListener("answer", (data: any) => {
        async function connectCall() {
          const RoomId: any = await AsyncStorage.getItem("RoomIdCpy");
          let you: any = await AsyncStorage.getItem("youCpy");
          if (you) you = JSON.parse(you);
          const gender: any = you?.gender;
          try {
            await api
              .get("/room/getRoomCallingState", {
                params: {
                  RoomId,
                },
              })
              .then(res => {
                if (res.data.status === "true") {
                  const room = res.data.room;
                  if (room?.calling) {
                    if (
                      navigation.current?.getCurrentRoute()?.name !== "Call"
                    ) {
                      callAccept.current = true;
                      SoundPlayer.stop();
                      hideShow();

                      setTimeout(() => {
                        callAccept.current = false;
                      }, 5000);

                      connectSocket.current?.emit("acceptConnectCall", {
                        otherUserId: user.id,
                        YouId: you?.id,
                        RoomId: RoomId,
                      });
                      setTimeout(() => {
                        navigation.current?.navigate("Call", {
                          RoomId: RoomId,
                          otherUserId: you?.id,
                          caller: false,
                          gender: gender,
                          // incoming: false,
                        });
                      }, 500);
                    }
                  }
                }
              });
          } catch (err) {}
        }

        RNNotificationCall.backToApp();
        connectCall();
      });
    }
  }, [user]);

  useEffect(() => {
    async function loginProcess() {
      const phone = await EncryptedStorage.getItem("phone");
      const email: any = await EncryptedStorage.getItem("email");
      const password = await EncryptedStorage.getItem("password");
      const sns = (await EncryptedStorage.getItem("sns")) ?? null;
      const snsId = (await EncryptedStorage.getItem("snsId")) ?? null;

      if (!email && !phone) return;
      try {
        await axios
          .post(`${serverURL}/user/loginLocal/v2`, {
            phone,
            email,
            password,
            sns,
            snsId,
          })
          .then(async res => {
            if (Number(res.status) === 503) {
              Alert.alert(
                country === "ko"
                  ? "서버 점검중입니다. 완료후 로그인 바랍니다."
                  : country === "ja"
                  ? "サーバーチェック中です。完了後ログインしてください。"
                  : country === "es"
                  ? "El servidor está en mantenimiento. Inicie sesión después de finalizar."
                  : country === "fr"
                  ? "Le serveur est en maintenance. Veuillez vous connecter une fois terminé."
                  : country === "id"
                  ? "Server sedang dalam pemeliharaan. Silakan login setelah selesai."
                  : country === "zh"
                  ? "服务器正在维护中。完成后请登录。"
                  : "The server is under maintenance. Please log in after completion.",
              );
              SplashScreen.hide();
              return;
            }
            if (res.data.status === "true") {
              /*
              await analytics().initiateOnDeviceConversionMeasurementWithEmailAddress(
                email,
              );
              */
              const user = res.data.user;
              const accessToken = res.data.accessToken;
              const refreshToken = res.data.refreshToken;
              const point = res.data.point;
              await EncryptedStorage.setItem("accessToken", accessToken);
              await EncryptedStorage.setItem("refreshToken", refreshToken);

              updateUser(user);
              updatePoint(point);
              SplashScreen.hide();
            }
          });
      } catch (err) {}
    }
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
    loginProcess();
  }, []);

  const handleGetInitialURL = async () => {
    if (!user.id) return;

    // This always returns null when opened from a dynamic link which opens the scheme url
    const url = await Linking.getInitialURL();
    if (url) {
      //nmoment://Profile=123
      const screen = url.split("/")[2].split("=")[0];
      if (screen === "Profile") {
        const YouId = url.split("/")[2].split("=")[1];
        if (navigation.current?.getCurrentRoute()?.name === "Profile") {
          navigation.current?.dispatch(
            StackActions.replace(`Profile`, {
              YouId,
            }),
          );
        } else {
          navigation.current?.navigate("Profile", {
            YouId,
          });
        }
      }
    }
  };
  // This is never triggered after eas builds a standalone for android
  const handleDeepLink = async (e: any) => {
    if (e.url && user.id) {
      const screen = e.url.split("/")[2].split("=")[0];
      if (screen === "Profile") {
        const YouId = e.url.split("/")[2].split("=")[1];
        navigation.current.navigate("Profile", {
          YouId,
        });
      }
    }
  };
  useEffect(() => {
    if (user.id) {
      handleGetInitialURL();
      const linkingEvent = Linking.addEventListener("url", handleDeepLink);
      return () => {
        linkingEvent?.remove();
      };
    }
  }, [user]);

  useEffect(() => {
    async function permission() {
      const trackingStatus = await requestTrackingPermission();
      if (trackingStatus === "authorized" || trackingStatus === "unavailable") {
      }
    }
    permission();
  }, []);

  const [reToken, setReToken] = useState(false);

  let interval: any;

  let backgroundTime: any = new Date();

  let reconnectInterval: any;
  useEffect(() => {
    reconnectInterval = BackgroundTimer.setInterval(() => {
      setReconnectSocket(true);
    }, 1000 * 300);
  }, []);

  let count: number = 0;
  const handleAppStateChange = (nextAppState: any) => {
    console.log("⚽️appState nextAppState", appState.current, nextAppState);
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("⚽️⚽️App has come to the foreground!");

      // console.log("connection status ", connectSocket?.current?.connected);
      BackgroundTimer.clearInterval(interval);
      backgroundCheck.current = false;
      setBackgroundChk(false);
      /*
      const afterTime: any = Number(
        Math.abs(backgroundTime - Number(new Date())) / 36e5,
      ); //앱이 백그라운드에 있던 시간이 1시간이 지난다면
      if (afterTime >= 1 && Platform.OS === "android") {
        //1시간 이상 되었을때 재부팅 시키는게 맞는거 같음
        // RNRestart.restart();
        // RNMinimizeApp.minimizeApp();
      } else {
        backgroundTime = new Date();
      }
      */

      setReToken(true);
      setReconnectSocket(true);

      reconnectInterval = BackgroundTimer.setInterval(() => {
        setReconnectSocket(true);
      }, 1000 * 300);
    }
    if (
      appState.current.match(/inactive|active/) &&
      nextAppState === "background"
    ) {
      console.log("⚽️⚽️App has come to the background!");
      // RNRestart.restart();
      // RNMinimizeApp.minimizeApp();
      BackgroundTimer?.clearInterval(reconnectInterval);
      backgroundCheck.current = true;
      setBackgroundChk(true);

      //ios App 죽일수 있는 방법
      if (Platform.OS === "ios") {
        interval = BackgroundTimer.setInterval(() => {
          // console.log("connection status ", connectSocket?.current?.connected);
          connectSocket?.current?.emit("online");
          // setReToken(!reToken)
        }, 3000);
      }
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription?.remove();
  }, []);

  mobileAds()
    .initialize()
    .then(adapterStatuses => {
      // Initialization complete!
    });

  if (Platform.OS === "ios") {
    useEffect(() => {
      let WiredHeadset = DeviceEventEmitter.addListener(
        "WiredHeadset",
        ({isPlugged, hasMic}: any) => {
          if (isPlugged && hasMic) {
            InCallManager.setForceSpeakerphoneOn(false);
          } else if (Platform.OS === "ios") {
            InCallManager.setForceSpeakerphoneOn(!isPlugged); // Afin de forcer l'utilisation du speaker si on déconnecte des Airpods
          }
        },
      );
      return () => {
        WiredHeadset.remove();
      };
    });
  }

  useCallKitEvent(user, callAccept, connectSocket, navigation);

  const routeNameRef = React.useRef();

  return (
    <Provider store={store}>
      <NotchProvider>
        <NavigationContainer
          ref={navigation}
          onReady={() => {
            routeNameRef.current = navigation.current.getCurrentRoute().name;
          }}
          onStateChange={async () => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName = navigation.current.getCurrentRoute().name;

            if (previousRouteName !== currentRouteName) {
              if (user?.id) {
                await api.post("/user/updateLastScreen", {
                  name: currentRouteName,
                });
              }
              await analytics().logScreenView({
                screen_name: currentRouteName, // 디테일 정보 표시되는곳
                screen_class: currentRouteName, // GA 표시되는 이름
              });
            }
            routeNameRef.current = currentRouteName;
          }}>
          <RootStackNavigator
            backgroundCheck={backgroundCheck}
            backgroundChk={backgroundChk}
            reToken={reToken}
            setReToken={setReToken}
            country={country}
            setCountry={setCountry}
            user={user}
            updateUser={updateUser}
            post={post}
            updatePost={updatePost}
            room={room}
            updateRoom={updateRoom}
            rank={rank}
            updateRank={updateRank}
            point={point}
            updatePoint={updatePoint}
            connectSocket={connectSocket}
            callSocket={callSocket}
            chatSocket={chatSocket}
            chatCount={chatCount}
            setChatcount={setChatCount}
            adminRoom={adminRoom}
            updateAdminRoom={updateAdminRoom}
            myFollowing={myFollowing}
            setMyFollowing={setMyFollowing}
            calling={calling}
            setCalling={setCalling}
            timer={timer}
            setTimer={setTimer}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            callEndByMe={callEndByMe}
            modalState={modalState}
            setModalState={setModalState}
            endCall={endCall}
            youIdByCall={youIdByCall}
            navigationRoot={navigation}
          />
        </NavigationContainer>
        <ToastComponent
          country={country}
          user={user}
          navigation={navigation}
          connectSocket={connectSocket}
        />
        <FlashMessage
          position="top"
          // message=""
          duration={2500}
          //JSON.parse(message?.message).type
          MessageComponent={({message}: {message: any}) =>
            JSON.parse(message?.message)?.type === "onChat" ? (
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  marginTop: vh(8),
                  height: vh(9),
                  justifyContent: "space-between",
                  width: vw(92), // "100%",
                  marginLeft: vw(4),
                  backgroundColor: "rgba(255,255,255,0.85)",
                  borderRadius: 10,
                  paddingLeft: vw(4),
                  paddingRight: vw(4),
                  paddingTop: vh(2),
                  paddingBottom: vh(1),
                  ...Platform.select({
                    ios: {
                      shadowColor: "#d3d3d3",
                      shadowOffset: {
                        width: 2,
                        height: 2,
                      },
                      shadowOpacity: 5,
                      shadowRadius: 5,
                    },
                    android: {
                      elevation: 5,
                    },
                  }),
                }}
                onPress={() => {
                  navigation?.current?.navigate("Chat", {
                    RoomId: JSON.parse(message?.message)?.RoomId,
                  });
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    overflow: "hidden",
                  }}>
                  <FastImage
                    source={{
                      uri: JSON.parse(message?.message)?.url,
                      priority: FastImage.priority.normal,
                    }}
                    style={{
                      width: vh(5),
                      height: vh(5),
                      borderRadius: 100,
                    }}
                    resizeMode={FastImage.resizeMode.cover}></FastImage>
                  <View
                    style={{
                      marginLeft: 10,
                      justifyContent: "center",
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontWeight: "bold",
                        fontSize: 13,
                        marginBottom: 2,
                        color: "black",
                      }}>
                      {JSON.parse(message?.message)?.title}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontWeight: "200",
                        fontSize: 13,
                        color: "black",
                      }}>
                      {JSON.parse(message?.message)?.content}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <View
                    style={{
                      backgroundColor: PALETTE.COLOR_BORDER,
                      height: 4,
                      width: 50,
                      borderRadius: 100,
                    }}></View>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  marginTop: vh(8),
                  height: vh(9),
                  justifyContent: "space-between",
                  width: vw(92), // "100%",
                  marginLeft: vw(4),
                  backgroundColor: "rgba(255,255,255,0.85)",
                  borderRadius: 10,
                  paddingLeft: vw(4),
                  paddingRight: vw(4),
                  paddingTop: vh(2),
                  paddingBottom: vh(1),
                  ...Platform.select({
                    ios: {
                      shadowColor: "#d3d3d3",
                      shadowOffset: {
                        width: 2,
                        height: 2,
                      },
                      shadowOpacity: 5,
                      shadowRadius: 5,
                    },
                    android: {
                      elevation: 5,
                    },
                  }),
                }}
                onPress={() => {
                  navigation?.current?.navigate("Profile", {
                    YouId: JSON.parse(message?.message)?.you?.id,
                  });
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    overflow: "hidden",
                  }}>
                  <FastImage
                    source={{
                      uri: JSON.parse(message?.message)?.you?.profile,
                      priority: FastImage.priority.normal,
                    }}
                    style={{
                      width: vh(5),
                      height: vh(5),
                      borderRadius: 100,
                    }}
                    resizeMode={FastImage.resizeMode.cover}></FastImage>
                  <View
                    style={{
                      marginLeft: 10,
                      justifyContent: "center",
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontWeight: "bold",
                        fontSize: 13,
                        marginBottom: 2,
                        color: "black",
                      }}>
                      {JSON.parse(message?.message)?.you?.nick}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontWeight: "200",
                        fontSize: 13,
                        color: "black",
                      }}>
                      {country === "ko"
                        ? `새로운 포스트를 업로드 했습니다.`
                        : country === "ja"
                        ? `新しい投稿をアップロードしました。`
                        : country === "es"
                        ? `Se ha subido una nueva publicación.`
                        : country === "fr"
                        ? `Un nouveau message a été téléchargé.`
                        : country === "id"
                        ? `Postingan baru telah diunggah.`
                        : country === "zh"
                        ? `已上传新帖子。`
                        : `A new post has been uploaded.`}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <View
                    style={{
                      backgroundColor: PALETTE.COLOR_BORDER,
                      height: 4,
                      width: 50,
                      borderRadius: 100,
                    }}></View>
                </View>
              </TouchableOpacity>
            )
          }
        />
      </NotchProvider>
    </Provider>
  );
}

export default connect(mapStateToProps, mapDispatchProps)(App);
