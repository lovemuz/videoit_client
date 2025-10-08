import React, { useCallback } from "react";
import { useState, useEffect, useRef } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  useColorScheme,
  View,
  BackHandler,
  Image,
  Dimensions,
  Alert,
  Permission,
  TextInput,
  Linking,
  ImageBackground,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  FlatList,
  RefreshControl,
  Animated,
  ActivityIndicator,
  AppState,
  PermissionsAndroid,
} from "react-native";
import { NotchProvider, NotchView } from "react-native-notchclear";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { vw, vh, vmin, vmax } from "react-native-css-vh-vw";
import LinearGradient from "react-native-linear-gradient";
import Video from "react-native-video";
//import {LinearTextGradient} from "react-native-text-gradient";
import SplashScreen from "react-native-splash-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Share from "react-native-share";
import FastImage from "react-native-fast-image";
import Clipboard from "@react-native-clipboard/clipboard";
import api from "../../lib/api/api";
import { PALETTE } from "../../lib/constant/palette";
import serverURL from "../../lib/constant/serverURL";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import ToggleButton from "react-native-toggle-element";
import { LIVE_CONSTANT } from "../../lib/constant/live-constant";
import { useScrollToTop } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import Modal from "react-native-modal";
import { BlurView } from "@react-native-community/blur";
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";
import { Settings } from "react-native-fbsdk-next";

// import Voice from "@react-native-voice/voice";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import { USER_GENDER, USER_ROLE } from "../../lib/constant/user-constant";
import ProfileModal from "../reusable/profileModal";
import { showCall } from "../reusable/useToast";
import { CALL_TYPE } from "../../lib/constant/call-constant";
import RNCallKeep from "react-native-callkeep";
import { BANNER_TYPE } from "../../lib/constant/banner-constant";
import APP_VERSION from "../../lib/constant/APP_VERSION";

export default function Live({
  FCMToken,
  country,
  user,
  updateUser,
  navigation,
  route,
  chatPlus,
  setChatPlus,
  // appState,
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
  calling,
  setCalling,
  timer,
  setTimer,
  isRunning,
  setIsRunning,
  callEndByMe,
  modalState,
  setModalState,
  endCall,
  youIdByCall,
  backgroundCheck,
  navigationRoot,
  backgroundChk,
}: {
  backgroundChk: any;
  backgroundCheck: any;
  endCall: any;
  youIdByCall: any;
  calling: any;
  setCalling: any;
  timer: any;
  setTimer: any;
  isRunning: any;
  setIsRunning: any;
  callEndByMe: any;
  modalState: any;
  setModalState: any;
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
  navigationRoot?: any;
  // appState?: any;
}): JSX.Element {
  const [banner, setBanner]: any = useState({
    exist: false,
    url: null,
    bannerImage: null,
  });

  useEffect(() => {
    async function bannerRead() {
      const bannerReadTime: any = await AsyncStorage.getItem("bannerReadTime");

      const currentDateTime = new Date().getTime();
      const beforeDateTime = new Date(
        JSON.parse(bannerReadTime)?.date,
      )?.getTime();

      const diffDate =
        Number(currentDateTime) - (beforeDateTime ? Number(beforeDateTime) : 0);

      const resultDiff = Math.abs(diffDate / (1000 * 60 * 60 * 24));

      if (
        !beforeDateTime ||
        resultDiff > 0.25 /*1 = 배너 읽은지 하루도 안됨*/
      ) {
        //로직
        try {
          await api
            .get(
              user?.gender === USER_GENDER.BOY
                ? "/user/getBannerBoy/v2"
                : "/user/getBannerGirl",
            )
            .then(res => {
              if (res.data.type === BANNER_TYPE.TICKET) {
                const bannerImage = res.data.bannerImage;
                setBanner({
                  type: BANNER_TYPE.TICKET,
                  exist: true,
                  url: null,
                  bannerImage,
                });
              } else if (res.data.type === BANNER_TYPE.TICKET2) {
                const bannerImage = res.data.bannerImage;
                setBanner({
                  type: BANNER_TYPE.TICKET2,
                  exist: true,
                  url: null,
                  bannerImage,
                });
              } else if (res.data.type === BANNER_TYPE.REFERRAL) {
                const androidUrl = res.data.androidUrl;
                const iosUrl = res.data.iosUrl;
                const webUrl = res.data.webUrl;
                const bannerImage = res.data.bannerImage;
                if (webUrl) {
                  setBanner({
                    type: BANNER_TYPE.REFERRAL,
                    exist: true,
                    url: webUrl,
                    bannerImage,
                  });
                } else if (androidUrl && iosUrl) {
                  if (Platform.OS === "android") {
                    setBanner({
                      type: BANNER_TYPE.REFERRAL,
                      exist: true,
                      url: androidUrl,
                      bannerImage,
                    });
                  } else {
                    setBanner({
                      type: BANNER_TYPE.REFERRAL,
                      exist: true,
                      url: iosUrl,
                      bannerImage,
                    });
                  }
                }
              } else if (res.data.type === BANNER_TYPE.GIRL) {
                const androidUrl = res.data.androidUrl;
                const iosUrl = res.data.iosUrl;
                const webUrl = res.data.webUrl;
                const bannerImage = res.data.bannerImage;
                if (webUrl) {
                  setBanner({
                    type: BANNER_TYPE.GIRL,
                    exist: true,
                    url: webUrl,
                    bannerImage,
                  });
                } else if (androidUrl && iosUrl) {
                  if (Platform.OS === "android") {
                    setBanner({
                      type: BANNER_TYPE.GIRL,
                      exist: true,
                      url: androidUrl,
                      bannerImage,
                    });
                  } else {
                    setBanner({
                      type: BANNER_TYPE.GIRL,
                      exist: true,
                      url: iosUrl,
                      bannerImage,
                    });
                  }
                }
              }
            });
        } catch (err) { }
        await AsyncStorage.setItem(
          "bannerReadTime",
          JSON.stringify({
            date: new Date(),
          }),
        );
      } else {
        setBanner({
          type: null,
          exist: false,
          url: null,
          bannerImage: null,
        });
      }

      // if (token?.token) setFCMToken(token?.token);
    }
    bannerRead();
  }, []);

  const ref = useRef(null);
  useScrollToTop(ref);

  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);

  const pageNum: any = useRef(0);
  const pageSize: any = useRef(21);

  const [liveList, setLiveList] = useState([]);
  const [suggestionList, setSuggestionList] = useState([]);

  const global = useRef(false);
  const gender = useRef(
    user.gender === USER_GENDER.GIRL ? USER_GENDER.BOY : USER_GENDER.GIRL,
  );

  /*
  const [global, setGlobal] = useState(false);
  const [gender, setGender] = useState(
    user.gender === USER_GENDER.GIRL ? USER_GENDER.BOY : USER_GENDER.GIRL,
  );
  */

  const [selectedUser, setSelectedUser]: any = useState(null);

  useEffect(() => {
    const permissionCheck = () => {
      const platformPermissions =
        Platform.OS === "ios"
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA;

      const platformPermissionsMic =
        Platform.OS === "ios"
          ? PERMISSIONS.IOS.MICROPHONE
          : PERMISSIONS.ANDROID.RECORD_AUDIO;

      const requestCameraPermission = async () => {
        try {
          if (Platform.OS === "ios") {
            const requestResult = await request(
              PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY,
            );
            await Settings.setAdvertiserTrackingEnabled(
              requestResult === RESULTS.GRANTED,
            );
            // await request(PERMISSIONS.IOS.SPEECH_RECOGNITION);
          } else if (Platform.OS === "android") {
            // await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
          }
          await request(platformPermissions);
          await request(platformPermissionsMic);
          /*
          if (Platform.OS === "ios") {
            Voice.onSpeechStart = () => {};
            Voice.onSpeechEnd = () => {};
            Voice.onSpeechResults = () => {};
            Voice.onSpeechError = () => {};
            Voice.start("ko-KR"); //통화 연결시
            Voice.destroy().then(Voice.removeAllListeners);
          }
            */
        } catch (err) {
          Alert.alert("Camera permission err");
          console.warn(err);
        }
      };
      requestCameraPermission();
    };
    permissionCheck();
  }, []);

  /*
  if (Platform.OS === "ios") {
    useEffect(() => {
      Voice.start("ko-KR"); //통화 연결시
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, []);
  }
  */
  useEffect(() => {
    async function fetchData() {
      try {
        await api
          .get("/user/liveList", {
            params: {
              APP_VERSION,
              pageNum: 0,
              pageSize: pageSize.current,
              country,
              global: global.current,
              gender: gender.current,
              platform: Platform.OS,
            },
          })
          .then(res => {
            if (res.data?.userList) {
              setLiveList(res.data?.userList);
              pageNum.current = 1;
            }
          });
      } catch (err) { }
      try {
        await api
          .get("/user/suggestionList", {
            params: {
              APP_VERSION,
              pageNum: 0,
              pageSize: 15,
              country,
              global: global.current,
              gender: gender.current,
              platform: Platform.OS,
            },
          })
          .then(res => {
            setSuggestionList(res.data?.suggestionList);
          });
      } catch (err) { }
    }
    fetchData();
  }, []);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await api
        .get("/user/liveList", {
          params: {
            APP_VERSION,
            pageNum: 0,
            pageSize: pageSize.current,
            country,
            global: global.current,
            gender: gender.current,
            platform: Platform.OS,
          },
        })
        .then(res => {
          if (res.data?.userList) {
            setLiveList(res.data?.userList);
            pageNum.current = 1;
          }
        });
    } catch (err) { }
    /*
    try {
      await api
        .get("/user/suggestionList", {
          params: {
            APP_VERSION,
            pageNum: 0,
            pageSize: 15,
            country,
            global: global.current,
            gender: gender.current,
            platform: Platform.OS,
          },
        })
        .then(res => {
          setSuggestionList(res.data?.suggestionList);
        });
    } catch (err) {}
     */
    setRefreshing(false);
  }, [user]);

  const currentHeight: any = useRef(0);
  const animatedValue: any = useRef(new Animated.Value(0)).current;
  let loop: any = Animated.loop(
    Animated.timing(animatedValue, {
      toValue: vw(92),
      duration: 5000,
      useNativeDriver: false,
    }),
  );

  useEffect(() => {
    if (!loop) return;
    if (backgroundChk) {
      loop?.stop();
    } else {
      Animated.sequence([Animated.delay(1000), loop]).start();
    }
  }, [backgroundChk]);

  const isFocused = useIsFocused();

  const lastVisitCount: any = useRef(12);
  //2번씩 실행됨 ㅜ ㅜ
  useEffect(() => {
    const animatedListener = animatedValue.addListener(async (state: any) => {
      //vw92
      if (
        parseInt(state.value) === parseInt(vw(90)) &&
        currentHeight.current < vh(50) &&
        navigationRoot.current?.getCurrentRoute()?.name === "Live" &&
        !backgroundCheck.current
      ) {
        try {
          await api
            .get("/user/liveList", {
              params: {
                APP_VERSION,
                pageNum: 0,
                pageSize: pageSize.current,
                country,
                global: global.current,
                gender: gender.current,
                platform: Platform.OS,
              },
            })
            .then(res => {
              if (res.data?.userList) {
                setLiveList(res.data?.userList);
                pageNum.current = 1;
              }
            });
        } catch (err) { }
        try {
          await api.post("/user/updateLastVisit");
        } catch (err) { }
      } else if (
        parseInt(state.value) === parseInt(vw(90)) &&
        user?.roles === USER_GENDER.GIRL
      ) {
        if (lastVisitCount.current >= 12) {
          lastVisitCount.current = 0;
          try {
            await api.post("/user/updateLastVisitV2");
          } catch (err) { }
        } else {
          lastVisitCount.current = lastVisitCount.current + 1;
        }
      }
    });

    return () => {
      animatedValue?.removeAllListeners();
      animatedValue?.removeListener(animatedListener);
    };
  }, []);

  const [endCallCheck, setEndCallCheck]: any = useState(false);
  const [star, setStar] = useState(3);
  // const [YouId, setYouId] = useState(null);
  const YouId = useRef(null);

  useEffect(() => {
    async function scoreProcess() {
      setEndCallCheck(endCall.current);
      YouId.current = youIdByCall.current;
      // setYouId(youIdByCall.current);
      endCall.current = false;
      youIdByCall.current = null;
    }
    if (isFocused && endCall.current) {
      setTimeout(() => {
        scoreProcess();
      }, 500);
    }
  }, [isFocused]);

  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["top", "bottom"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={"dark-content"}
      />
      {banner?.exist && banner.type === BANNER_TYPE.TICKET ? (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            width: vw(100),
            height: vh(100),
            position: "absolute",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            zIndex: 9129,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: PALETTE.COLOR_BACK,
              borderRadius: 20,
              width: vw(85),
              maxWidth: vh(42),
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
              //height: vh(30),
              zIndex: 9130,
            }}>
            <FastImage
              source={{
                uri: banner?.bannerImage,
                priority: FastImage.priority.normal,
              }}
              style={{
                width: "100%",
                height: vh(55),
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
              resizeMode={FastImage.resizeMode.stretch}></FastImage>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                width: "90%",
                marginTop: vh(2.5),
                marginBottom: vh(2.5),
              }}>
              <TouchableOpacity
                style={{
                  width: "48%",
                  height: 45,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: "#D9DCE6",
                  borderRadius: 10,
                  zIndex: 9130,
                }}
                onPress={async () => {
                  setBanner({
                    type: null,
                    exist: false,
                    url: null,
                    bannerImage: null,
                  });
                }}>
                <Text
                  style={{
                    color: "black",
                    fontSize: 16,
                  }}>
                  {country === "ko"
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
                              : `cancellation`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: "48%",
                  height: 45,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: PALETTE.COLOR_RED,
                  borderRadius: 10,
                  zIndex: 9130,
                }}
                onPress={async () => {
                  // if (banner?.url) await Linking.openURL(banner?.url);
                  navigation.navigate("CertificationIn");
                  setBanner({
                    type: null,
                    exist: false,
                    url: null,
                    bannerImage: null,
                  });
                }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                  }}>
                  {country === "ko"
                    ? "인증"
                    : country === "ja"
                      ? "認証"
                      : country === "es"
                        ? "Autenticación"
                        : country === "fr"
                          ? "Authentification"
                          : country === "id"
                            ? "Verifikasi"
                            : country === "zh"
                              ? "认证"
                              : "Verification"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      ) : banner.type === BANNER_TYPE.TICKET2 ? (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            width: vw(100),
            height: vh(100),
            position: "absolute",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            zIndex: 9129,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: PALETTE.COLOR_BACK,
              borderRadius: 20,
              width: vw(85),
              maxWidth: vh(42),
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
              //height: vh(30),
              zIndex: 9130,
            }}>
            <FastImage
              source={{
                uri: banner?.bannerImage,
                priority: FastImage.priority.normal,
              }}
              style={{
                width: "100%",
                height: vh(55),
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
              resizeMode={FastImage.resizeMode.stretch}></FastImage>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                width: "90%",
                marginTop: vh(2.5),
                marginBottom: vh(2.5),
              }}>
              <TouchableOpacity
                style={{
                  width: "48%",
                  height: 45,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: "#D9DCE6",
                  borderRadius: 10,
                  zIndex: 9130,
                }}
                onPress={async () => {
                  setBanner({
                    type: null,
                    exist: false,
                    url: null,
                    bannerImage: null,
                  });
                }}>
                <Text
                  style={{
                    color: "black",
                    fontSize: 16,
                  }}>
                  {country === "ko"
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
                              : `cancellation`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: "48%",
                  height: 45,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: PALETTE.COLOR_RED,
                  borderRadius: 10,
                  zIndex: 9130,
                }}
                onPress={async () => {
                  setBanner({
                    type: null,
                    exist: false,
                    url: null,
                    bannerImage: null,
                  });
                }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                  }}>
                  {country === "ko"
                    ? "확인"
                    : country === "ja"
                      ? "確認"
                      : country === "es"
                        ? "Confirmar"
                        : country === "fr"
                          ? "Confirmer"
                          : country === "id"
                            ? "Konfirmasi"
                            : country === "zh"
                              ? "确认"
                              : "Confirm"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      ) : banner.type === BANNER_TYPE.GIRL ? (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            width: vw(100),
            height: vh(100),
            position: "absolute",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            zIndex: 9129,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: PALETTE.COLOR_BACK,
              borderRadius: 20,
              width: vw(85),
              maxWidth: vh(42),
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
              //height: vh(30),
              zIndex: 9130,
            }}>
            <FastImage
              source={{
                uri: banner?.bannerImage,
                priority: FastImage.priority.normal,
              }}
              style={{
                width: "100%",
                height: vh(55),
                backgroundColor: PALETTE.COLOR_WHITE,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
              resizeMode={FastImage.resizeMode.stretch}></FastImage>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                width: "90%",
                marginTop: vh(2.5),
                marginBottom: vh(2.5),
              }}>
              <TouchableOpacity
                style={{
                  width: "48%",
                  height: 45,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: "#D9DCE6",
                  borderRadius: 10,
                  zIndex: 9130,
                }}
                onPress={async () => {
                  setBanner({
                    type: null,
                    exist: false,
                    url: null,
                    bannerImage: null,
                  });
                }}>
                <Text
                  style={{
                    color: "black",
                    fontSize: 16,
                  }}>
                  {country === "ko"
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
                              : `cancellation`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: "48%",
                  height: 45,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: PALETTE.COLOR_MAIN,
                  borderRadius: 10,
                  zIndex: 9130,
                }}
                onPress={async () => {
                  if (banner?.url) await Linking.openURL(banner?.url);
                  setBanner({
                    type: null,
                    exist: false,
                    url: null,
                    bannerImage: null,
                  });
                }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                  }}>
                  {country === "ko"
                    ? "지원"
                    : country === "ja"
                      ? "サポート"
                      : country === "es"
                        ? "Soporte"
                        : country === "fr"
                          ? "Assistance"
                          : country === "id"
                            ? "Dukungan"
                            : country === "zh"
                              ? "支持"
                              : "Support"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      ) : (
        banner.type === BANNER_TYPE.REFERRAL && (
          <TouchableOpacity
            activeOpacity={1}
            style={{
              width: vw(100),
              height: vh(100),
              position: "absolute",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              zIndex: 9129,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            onPress={async () => {
              setEndCallCheck(false);
            }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: PALETTE.COLOR_BACK,
                borderRadius: 20,
                width: vw(85),
                maxWidth: vh(42),
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
                //height: vh(30),
                zIndex: 9130,
              }}>
              <FastImage
                source={{
                  uri: banner?.bannerImage,
                  priority: FastImage.priority.normal,
                }}
                style={{
                  width: "100%",
                  height: vh(55),
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
                resizeMode={FastImage.resizeMode.stretch}></FastImage>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "90%",
                  marginTop: vh(2.5),
                  marginBottom: vh(2.5),
                }}>
                <TouchableOpacity
                  style={{
                    width: "48%",
                    height: 45,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    backgroundColor: "#D9DCE6",
                    borderRadius: 10,
                    zIndex: 9130,
                  }}
                  onPress={async () => {
                    setBanner({
                      type: null,
                      exist: false,
                      url: null,
                      bannerImage: null,
                    });
                  }}>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 16,
                    }}>
                    {country === "ko"
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
                                : `cancellation`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: "48%",
                    height: 45,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    backgroundColor: PALETTE.COLOR_RED,
                    borderRadius: 10,
                    zIndex: 9130,
                  }}
                  onPress={async () => {
                    if (banner?.url) await Linking.openURL(banner?.url);
                    setBanner({
                      type: null,
                      exist: false,
                      url: null,
                      bannerImage: null,
                    });
                  }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                    }}>
                    {country === "ko"
                      ? `이동`
                      : country === "ja"
                        ? `移動`
                        : country === "es"
                          ? `movimiento`
                          : country === "fr"
                            ? `mouvement`
                            : country === "id"
                              ? `pergerakan`
                              : country === "zh"
                                ? `移动`
                                : `movement`}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        )
      )}
      {endCallCheck && (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            width: vw(100),
            height: vh(100),
            position: "absolute",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            zIndex: 9129,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          onPress={async () => {
            setEndCallCheck(false);
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: PALETTE.COLOR_BACK,
              borderRadius: 20,
              paddingTop: vh(3),
              paddingBottom: vh(3),
              width: vw(85),
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              //height: vh(30),
              zIndex: 9130,
            }}>
            <Image
              source={require("../../assets/icon_round.png")}
              style={{
                width: vh(7),
                height: vh(7),
                marginBottom: vh(2),
              }}></Image>
            <Text
              style={{
                marginBottom: vh(1),
                color: "#838383",
                fontWeight: "bold",
              }}>
              {country === "ko"
                ? `상대방과의 통화가 즐거우셨나요?`
                : country === "ja"
                  ? `相手との通話は楽しかったですか？`
                  : country === "es"
                    ? `¿Disfrutaste de la llamada con la otra persona?`
                    : country === "fr"
                      ? `Avez-vous apprécié l'appel avec l'autre personne ?`
                      : country === "id"
                        ? `Apakah Anda menikmati panggilan dengan orang lain?`
                        : country === "zh"
                          ? `您与对方的通话愉快吗？`
                          : `Did you enjoy the call with the other person?`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
              }}>
              <TouchableOpacity
                onPress={() => {
                  setStar(1);
                }}
                style={{
                  zIndex: 9130,
                  marginRight: 5,
                }}>
                <Image
                  source={
                    star >= 1
                      ? require("../../assets/live/starY.png")
                      : require("../../assets/live/starW.png")
                  }
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setStar(2);
                }}
                style={{
                  zIndex: 9130,
                  marginRight: 5,
                }}>
                <Image
                  source={
                    star >= 2
                      ? require("../../assets/live/starY.png")
                      : require("../../assets/live/starW.png")
                  }
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setStar(3);
                }}
                style={{
                  zIndex: 9130,
                  marginRight: 5,
                }}>
                <Image
                  source={
                    star >= 3
                      ? require("../../assets/live/starY.png")
                      : require("../../assets/live/starW.png")
                  }
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setStar(4);
                }}
                style={{
                  zIndex: 9130,
                  marginRight: 5,
                }}>
                <Image
                  source={
                    star >= 4
                      ? require("../../assets/live/starY.png")
                      : require("../../assets/live/starW.png")
                  }
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setStar(5);
                }}
                style={{
                  zIndex: 9130,
                  marginRight: 5,
                }}>
                <Image
                  source={
                    star >= 5
                      ? require("../../assets/live/starY.png")
                      : require("../../assets/live/starW.png")
                  }
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                marginTop: vh(1),
                color: "black",
                fontWeight: "bold",
              }}>
              {country === "ko"
                ? `통화 점수를 평가해주세요!`
                : country === "ja"
                  ? `通話の評価をお願いします！`
                  : country === "es"
                    ? `¡Por favor, califica la llamada!`
                    : country === "fr"
                      ? `Veuillez noter l'appel !`
                      : country === "id"
                        ? `Silakan beri nilai panggilan ini!`
                        : country === "zh"
                          ? `请评价通话质量！`
                          : `Please rate the call!`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                width: "90%",
                marginTop: vh(4),
              }}>
              <TouchableOpacity
                style={{
                  width: "48%",
                  height: 45,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: "#D9DCE6",
                  borderRadius: 10,
                  zIndex: 9130,
                }}
                onPress={async () => {
                  setEndCallCheck(false);
                  //await AsyncStorage.removeItem("EndCall");
                }}>
                <Text
                  style={{
                    color: "black",
                    fontSize: 16,
                  }}>
                  {country === "ko"
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
                              : `cancellation`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: "48%",
                  height: 45,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: PALETTE.COLOR_MAIN,
                  borderRadius: 10,
                  zIndex: 9130,
                }}
                onPress={async () => {
                  await api.put("/call/updateScore", {
                    YouId: YouId.current,
                    score: star,
                  });
                  setEndCallCheck(false);
                  //await AsyncStorage.removeItem("EndCall");
                }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                  }}>
                  {country === "ko"
                    ? `제출`
                    : country === "ja"
                      ? `提出`
                      : country === "es"
                        ? `entregar`
                        : country === "fr"
                          ? `soumettre`
                          : country === "id"
                            ? `kirim`
                            : country === "zh"
                              ? `提交`
                              : `submit`}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
      {isFocused && selectedUser && (
        <ProfileModal
          country={country}
          connectSocket={connectSocket}
          user={user}
          navigation={navigation}
          calling={calling}
          setCalling={setCalling}
          timer={timer}
          setTimer={setTimer}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          callEndByMe={callEndByMe}
          modalState={modalState}
          setModalState={setModalState}
          selectedUser={selectedUser}></ProfileModal>
      )}

      {user?.ticket !== 0 && (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            zIndex: 5,
            position: "absolute",
            right: vw(4),
            bottom: vh(8),
            borderRadius: 100,
            width: 55,
            height: 55,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}>
          <Image
            source={require("../../assets/live/click.gif")}
            style={{
              width: 55,
              height: 55,
            }}></Image>
        </TouchableOpacity>
      )}
      {user?.ticket !== 0 && (
        <TouchableOpacity
          style={{
            zIndex: 3,
            position: "absolute",
            right: vw(4),
            bottom: vh(12),
            borderRadius: 100,
            backgroundColor: PALETTE.COLOR_BLACK,
            borderWidth: 1,
            borderColor: PALETTE.COLOR_BORDER,
            width: 55,
            height: 55,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            Alert.alert(
              country === "ko"
                ? "영상통화 가격 2,000원 이하와 30초 통화 가능한 티켓 입니다."
                : country === "ja"
                  ? "2,000ウォン以下のビデオ通話価格と30秒の通話が可能なチケットです。"
                  : country === "es"
                    ? "Es un boleto para videollamadas de menos de 2,000 won y 30 segundos de conversación."
                    : country === "fr"
                      ? "C'est un billet pour un prix de visioconférence inférieur à 2 000 wons et une conversation de 30 secondes."
                      : country === "id"
                        ? "Ini adalah tiket untuk harga panggilan video di bawah 2.000 won dan panggilan selama 30 detik."
                        : country === "zh"
                          ? "这是一个价格在2000韩元以下且可以通话30秒的视频通话票。"
                          : "This is a ticket for video calls under 2,000 won and 30 seconds of talk time.",
            );
          }}>
          <Image
            source={require("../../assets/live/ticket.png")}
            style={{
              width: 55,
              height: 55,
            }}></Image>
        </TouchableOpacity>
      )}
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            paddingLeft: vw(4),
            paddingRight: vw(4),
            marginTop: vh(2),
          }}>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: vh(2),
            }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: "black",
              }}>
              홈
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  borderRadius: 100,
                  paddingLeft: 4,
                  paddingRight: 2,
                  paddingTop: 2,
                  paddingBottom: 2,
                  backgroundColor: PALETTE.COLOR_WHITE,
                }}
                onPress={() => {
                  navigation.navigate("Store");
                }}>
                <Image
                  source={require("../../assets/setting/point.png")}
                  style={{
                    backgroundColor: PALETTE.COLOR_WHITE,
                    borderRadius: 100,
                    width: 24,
                    height: 24,
                  }}></Image>
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    backgroundColor: PALETTE.COLOR_WHITE,
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
                      color: "#535353",
                    }}>
                    {Number(point?.amount).toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
              {/*
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  //marginBottom: -12,
                }}
                onPress={() => {
                  navigation.navigate("SelfCamera");
                }}>
                <Image
                  source={require("../../assets/setting/faceg.png")}
                  style={{
                    marginLeft: 15,
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
              */}
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  //marginBottom: -12,
                }}
                onPress={() => {
                  navigation.navigate("Search");
                }}>
                <Image
                  source={require("../../assets/nav/search.png")}
                  style={{
                    marginLeft: 15,
                    width: 24,
                    height: 24,
                  }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  navigation.navigate("Alarm");
                }}>
                <Image
                  source={require("../../assets/live/bell.png")}
                  style={{
                    marginLeft: 15,
                    width: 24,
                    height: 24,
                  }}></Image>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {liveList?.length > 0 && (
          <FlatList
            ref={ref}
            contentContainerStyle={{
              paddingLeft: vw(4),
              paddingRight: vw(4),
            }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            scrollEnabled
            onScroll={e => {
              currentHeight.current = e.nativeEvent.contentOffset.y;
            }}
            onEndReached={async e => {
              await api
                .get("/user/liveList", {
                  params: {
                    APP_VERSION,
                    pageNum: pageNum.current,
                    pageSize: pageSize.current,
                    country,
                    global: global.current,
                    gender: gender.current,
                    platform: Platform.OS,
                  },
                })
                .then(res => {
                  if (res.data?.userList) {
                    setLiveList((prev: any) => prev.concat(res.data?.userList));
                    pageNum.current = pageNum.current + 1;
                  }
                });
            }}
            //horizontal={true}
            keyExtractor={(item: any) => item?.id}
            data={liveList}
            numColumns={3}
            decelerationRate={"fast"}
            ListHeaderComponent={
              <View>
                <View
                  style={{
                    justifyContent: "space-between",
                    alignContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginBottom: vh(2),
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      flex: 1, // 부모 컨테이너 전체 폭 사용
                    }}>
                    <SelectDropdown
                      defaultButtonText={
                        global.current === false
                          ? country === "ko"
                            ? `국내`
                            : country === "ja"
                              ? `国内`
                              : country === "es"
                                ? `doméstico`
                                : country === "fr"
                                  ? `domestique`
                                  : country === "id"
                                    ? `lokal`
                                    : country === "zh"
                                      ? `国内的`
                                      : `domestic`
                          : country === "ko"
                            ? `국외`
                            : country === "ja"
                              ? `国外`
                              : country === "es"
                                ? `De ultramar`
                                : country === "fr"
                                  ? `Outre-mer`
                                  : country === "id"
                                    ? `Luar negeri`
                                    : country === "zh"
                                      ? `海外`
                                      : `Oversea`
                      }
                      buttonStyle={{
                        borderRadius: 8, // 더 작은 라운드
                        flex: 1, // 남는 공간을 모두 차지
                        height: 40,
                        backgroundColor: PALETTE.COLOR_WHITE,
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                        borderWidth: 1, // 테두리 추가
                        borderColor: "#E0E0E0", // 연한 회색 테두리
                        marginRight: 10, // 성별 버튼과의 간격
                      }}
                      dropdownStyle={{
                        borderRadius: 12,
                        marginTop: 3,
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 3,
                        },
                        shadowOpacity: 0.12,
                        shadowRadius: 4,
                        elevation: 6,
                      }}
                      rowStyle={{
                        backgroundColor: PALETTE.COLOR_WHITE,
                        borderWidth: 0,
                        paddingVertical: 12,
                      }}
                      rowTextStyle={{
                        fontSize: 14,
                        color: "#333",
                        textAlign: "center",
                      }}
                      buttonTextStyle={{
                        fontSize: 14,
                        color: "#333",
                        fontWeight: "400",
                      }}
                      renderDropdownIcon={() => (
                        <Text
                          style={{
                            color: "#999",
                            fontSize: 12,
                            marginLeft: 6,
                          }}>
                          ▼
                        </Text>
                      )}
                      data={["국내", "국외"]}
                      onSelect={async (selectedItem, index) => {
                        let globalTmp;
                        if (index === 0) {
                          global.current = false;
                          globalTmp = false;
                        } else if (index === 1) {
                          global.current = true;
                          globalTmp = true;
                        }
                        await api
                          .get("/user/liveList", {
                            params: {
                              APP_VERSION,
                              pageNum: 0,
                              pageSize: pageSize.current,
                              country,
                              global: globalTmp,
                              gender: gender.current,
                              platform: Platform.OS,
                            },
                          })
                          .then(res => {
                            if (res.data?.userList) {
                              setLiveList(res.data?.userList);
                              pageNum.current = 1;
                            }
                          });
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        width: 80, // 고정 크기 유지
                        height: 40, // 높이 증가
                      }}
                      onPress={async () => {
                        // 토글로 성별 변경
                        const newGender =
                          gender.current === USER_GENDER.GIRL
                            ? USER_GENDER.BOY
                            : USER_GENDER.GIRL;
                        gender.current = newGender;

                        // 기존 API 호출 로직들...
                      }}>
                      <Image
                        source={
                          gender.current === USER_GENDER.GIRL
                            ? require("../../assets/live/girl.png")
                            : require("../../assets/live/man.png")
                        }
                        style={{
                          width: 80,
                          height: 50,
                          borderRadius: 8,
                          marginTop: -1,
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: "transparent",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    width: "100%",
                    borderBottomWidth: 1,
                    borderBottomColor: "#EFEFEF",
                    marginBottom: vh(2),
                  }}>
                  <Text
                    style={{
                      color: PALETTE.COLOR_BLACK,
                      fontSize: 16,
                      fontWeight: "500",
                      textAlign: "left",
                    }}>
                    인기순위
                  </Text>
                </View>

                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  style={{
                    paddingLeft: vw(4),
                    marginLeft: -vw(4),
                    marginRight: -vw(4),
                    marginBottom: vh(2),
                  }}>
                  {suggestionList.map((list: any, index) => (
                    <View
                      key={index}
                      style={{
                        marginRight: vw(2),
                        width: vw(18) + 10,
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                      }}>
                      <TouchableOpacity
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(18) + 8,
                          height: vw(18) + 8,
                          borderWidth: 1,
                          borderColor: PALETTE.COLOR_BORDER,
                          borderRadius: 100,
                        }}
                        onPress={() => {
                          setSelectedUser(list);
                          setModalState(LIVE_CONSTANT.MODAL_STATE_PROFILE);
                        }}>
                        {list?.callState === CALL_TYPE.CALL_ING && (
                          <View
                            style={{
                              position: "absolute",
                              justifyContent: "center",
                              alignContent: "center",
                              alignItems: "center",
                              width: "100%",
                              height: "100%",
                              zIndex: 2,
                              backgroundColor: "rgba(0,0,0,0.4)",
                              borderRadius: 100,
                            }}>
                            <Image
                              source={require("../../assets/live/ing.png")}
                              style={{
                                width: vw(8),
                                height: vw(8),
                                maxWidth: 50,
                                maxHeight: 50,
                              }}></Image>
                            <Text
                              style={{
                                marginTop: 5,
                                fontSize: 8,
                                fontWeight: "bold",
                                color: PALETTE.COLOR_RED,
                              }}>
                              {country === "ko"
                                ? `통화중..`
                                : country === "ja"
                                  ? `通話中...`
                                  : country === "es"
                                    ? `En llamada...`
                                    : country === "fr"
                                      ? `En communication...`
                                      : country === "id"
                                        ? `Sedang berbicara...`
                                        : country === "zh"
                                          ? `通话中...`
                                          : `In a call...`}
                            </Text>
                          </View>
                        )}
                        <FastImage
                          removeClippedSubviews={true}
                          source={{
                            uri: list?.profile,
                            priority: FastImage.priority.normal,
                          }}
                          style={{
                            width: vw(18),
                            height: vw(18),
                            borderRadius: 100,
                          }}
                          resizeMode={FastImage.resizeMode.cover}></FastImage>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 12,
                          marginTop: 4,
                          color: "black",
                        }}
                        numberOfLines={1}>
                        {list?.nick}
                      </Text>
                    </View>
                  ))}
                </ScrollView>

                <View
                  style={{
                    backgroundColor: "transparent",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    width: "100%",
                    borderBottomWidth: 1,
                    borderBottomColor: "#EFEFEF",
                    marginBottom: vh(2),
                  }}>
                  <Text
                    style={{
                      color: PALETTE.COLOR_BLACK,
                      fontSize: 16,
                      fontWeight: "500",
                      textAlign: "left",
                    }}>
                    실시간접속
                  </Text>
                </View>

                <View
                  style={{
                    justifyContent: "flex-start",
                    alignContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginBottom: vh(2),
                  }}>
                  <Animated.View
                    style={[
                      {
                        height: 10,
                        backgroundColor: PALETTE.COLOR_RED,
                        borderRadius: 50,
                        // left: animatedValue,
                      },
                      {
                        width: animatedValue,
                      },
                    ]}
                  />
                  <View
                    style={{
                      backgroundColor: PALETTE.COLOR_WHITE,
                      borderWidth: 1,
                      borderColor: PALETTE.COLOR_BORDER,
                      transform: [{ translateX: -10 }],
                      borderRadius: 100,
                      width: 15,
                      height: 15,
                    }}></View>
                </View>
              </View>
            }
            renderItem={props => (
              <TouchableOpacity
                activeOpacity={1}
                key={props?.index}
                onPress={async () => {
                  setSelectedUser(props?.item);
                  setModalState(LIVE_CONSTANT.MODAL_STATE_PROFILE);
                }}
                style={{
                  width: "31%",
                  marginRight: props.index % 3 === 2 ? 0 : "3%",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  aspectRatio: "1/1.25",
                  marginBottom: vh(2),
                  borderRadius: 10,
                }}>
                {props.item?.callState === CALL_TYPE.CALL_ING && (
                  <View
                    style={{
                      position: "absolute",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                      zIndex: 2,
                      backgroundColor: "rgba(0,0,0,0.4)",
                      borderRadius: 10,
                    }}>
                    <Image
                      source={require("../../assets/live/ing.png")}
                      style={{
                        width: 40,
                        height: 40,
                      }}></Image>
                    <Text
                      style={{
                        marginTop: 5,
                        fontSize: 10,
                        fontWeight: "bold",
                        color: PALETTE.COLOR_RED,
                      }}>
                      {country === "ko"
                        ? `통화중..`
                        : country === "ja"
                          ? `通話中...`
                          : country === "es"
                            ? `En llamada...`
                            : country === "fr"
                              ? `En communication...`
                              : country === "id"
                                ? `Sedang berbicara...`
                                : country === "zh"
                                  ? `通话中...`
                                  : `In a call...`}
                    </Text>
                  </View>
                )}

                <FastImage
                  removeClippedSubviews={true}
                  source={{
                    uri: props.item?.profile,
                    priority: FastImage.priority.normal,
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    borderRadius: 10,
                    padding: 5,
                    //marginBottom: -(props.index % 3) * vh(8),
                  }}
                  resizeMode={FastImage.resizeMode.cover}>
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      justifyContent: "flex-end",
                    }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        marginBottom: 5,
                        width: "100%",
                      }}>
                      {props.item?.on ? (
                        <View
                          style={{
                            marginRight: 5,
                            width: 10,
                            height: 10,
                            backgroundColor: PALETTE.COLOR_GREEN,
                            borderWidth: 1,
                            borderColor: PALETTE.COLOR_WHITE,
                            borderRadius: 100,
                          }}></View>
                      ) : (
                        <View
                          style={{
                            marginRight: 5,
                            width: 10,
                            height: 10,
                            backgroundColor: PALETTE.COLOR_BORDER,
                            borderWidth: 1,
                            borderColor: PALETTE.COLOR_WHITE,
                            borderRadius: 100,
                          }}></View>
                      )}
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,

                          color: PALETTE.COLOR_WHITE,
                        }}
                        numberOfLines={1}>
                        {props.item?.nick}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",

                        alignItems: "center",
                        marginBottom: 5,
                      }}>
                      {props.item?.country === "ko" ? (
                        <Image
                          source={require("../../assets/live/ko.png")}
                          style={{
                            width: 14,
                            height: 14,
                            marginRight: 2,
                          }}></Image>
                      ) : props.item?.country === "ja" ? (
                        <Image
                          source={require("../../assets/live/ja.png")}
                          style={{
                            width: 14,
                            height: 14,
                            marginRight: 2,
                          }}></Image>
                      ) : props.item?.country === "es" ? (
                        <Image
                          source={require("../../assets/live/es.png")}
                          style={{
                            width: 14,
                            height: 14,
                            marginRight: 2,
                          }}></Image>
                      ) : props.item?.country === "fr" ? (
                        <Image
                          source={require("../../assets/live/fr.png")}
                          style={{
                            width: 14,
                            height: 14,
                            marginRight: 2,
                          }}></Image>
                      ) : props.item?.country === "id" ? (
                        <Image
                          source={require("../../assets/live/id.png")}
                          style={{
                            width: 14,
                            height: 14,
                            marginRight: 2,
                          }}></Image>
                      ) : props.item?.country === "zh" ? (
                        <Image
                          source={require("../../assets/live/zh.png")}
                          style={{
                            width: 14,
                            height: 14,
                            marginRight: 2,
                          }}></Image>
                      ) : (
                        <Image
                          source={require("../../assets/live/en.png")}
                          style={{
                            width: 14,
                            height: 14,
                            marginRight: 2,
                          }}></Image>
                      )}

                      <Text
                        style={{
                          fontSize: 12,
                          color: PALETTE.COLOR_WHITE,
                        }}>
                        {props.item?.country === "ko"
                          ? country === "ko"
                            ? `대한민국 |`
                            : country === "ja"
                              ? `日本 |`
                              : country === "es"
                                ? `España |`
                                : country === "fr"
                                  ? `France |`
                                  : country === "id"
                                    ? `Indonesia |`
                                    : country === "zh"
                                      ? `中国 |`
                                      : `Korea |`
                          : props.item?.country === "ja"
                            ? country === "ko"
                              ? `일본 | `
                              : country === "ja"
                                ? `日本`
                                : country === "es"
                                  ? `Japón |`
                                  : country === "fr"
                                    ? `Japon |`
                                    : country === "id"
                                      ? `Jepang |`
                                      : country === "zh"
                                        ? `日本 |`
                                        : `Japan |`
                            : props.item?.country === "es"
                              ? country === "ko"
                                ? `스페인 | `
                                : country === "ja"
                                  ? `スペイン`
                                  : country === "es"
                                    ? `España |`
                                    : country === "fr"
                                      ? `Espagne |`
                                      : country === "id"
                                        ? `Spanyol |`
                                        : country === "zh"
                                          ? `西班牙 |`
                                          : `Spain |`
                              : props.item?.country === "fr"
                                ? country === "ko"
                                  ? `프랑스 | `
                                  : country === "ja"
                                    ? `フランス|`
                                    : country === "es"
                                      ? `Francia |`
                                      : country === "fr"
                                        ? `France |`
                                        : country === "id"
                                          ? `Perancis |`
                                          : country === "zh"
                                            ? `法国 |`
                                            : `France |`
                                : props.item?.country === "id"
                                  ? country === "ko"
                                    ? `인도 | `
                                    : country === "ja"
                                      ? `インド`
                                      : country === "es"
                                        ? `India |`
                                        : country === "fr"
                                          ? `Inde |`
                                          : country === "id"
                                            ? `India |`
                                            : country === "zh"
                                              ? `印度 |`
                                              : `India |`
                                  : props.item?.country === "zh"
                                    ? country === "ko"
                                      ? `중국 | `
                                      : country === "ja"
                                        ? `中国|`
                                        : country === "es"
                                          ? `China |`
                                          : country === "fr"
                                            ? `Chine |`
                                            : country === "id"
                                              ? `Cina |`
                                              : country === "zh"
                                                ? `中国 |`
                                                : `China |`
                                    : country === "ko"
                                      ? `미국 | `
                                      : country === "ja"
                                        ? `アメリカ|`
                                        : country === "es"
                                          ? `Estados Unidos |`
                                          : country === "fr"
                                            ? `États-Unis |`
                                            : country === "id"
                                              ? `Amerika Serikat |`
                                              : country === "zh"
                                                ? `美国 |`
                                                : `USA |`}
                        {props.item.age}
                      </Text>
                    </View>
                  </View>
                </FastImage>
              </TouchableOpacity>
            )}
          />
        )}

        <View
          style={{
            height: vh(6),
            width: vw(100),
          }}></View>
      </View>
    </NotchView>
  );
}
