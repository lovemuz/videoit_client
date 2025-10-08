import React from "react";
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
  AppState,
  Switch,
} from "react-native";
import { NotchProvider, NotchView } from "react-native-notchclear";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { vw, vh, vmin, vmax } from "react-native-css-vh-vw";
import LinearGradient from "react-native-linear-gradient";
import Video from "react-native-video";
//import {LinearTextGradient} from "react-native-text-gradient";
import SplashScreen from "react-native-splash-screen";

import Share from "react-native-share";
import FastImage from "react-native-fast-image";
import Clipboard from "@react-native-clipboard/clipboard";
import api from "../../lib/api/api";
import { PALETTE } from "../../lib/constant/palette";
import serverURL from "../../lib/constant/serverURL";
import { BlurView } from "@react-native-community/blur";
import { useIsFocused, useScrollToTop } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import { DECLARATION_TYPE } from "../../lib/constant/declaration-constant";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileModal from "../reusable/profileModal";
import { LIVE_CONSTANT } from "../../lib/constant/live-constant";
import { FANSTEP_DURATION } from "../../lib/constant/fanStep-constant";
import { POST_TYPE } from "../../lib/constant/post-constant";
import ImageModal from "../reusable/imageModal";
import VideoModal from "../reusable/videoModal";
import EncryptedStorage from "react-native-encrypted-storage";
import { WebView } from "react-native-webview";
import APP_VERSION from "../../lib/constant/APP_VERSION";

function kmParsing(content2: any) {
  const content = String(content2);
  if (content.length <= 3) return content;
  else if (content.length < 7) {
    const fi = content.slice(0, content.length - 2);
    const a = fi.slice(0, fi.length - 1);
    const b = fi.slice(fi.length - 1, fi.length);
    return String(a) + "." + String(b) + "k";
  } else {
    const fi = content.slice(0, content.length - 5);
    const a = fi.slice(0, fi.length - 1);
    const b = fi.slice(fi.length - 1, fi.length);
    return String(a) + "." + String(b) + "m";
  }
}

export default function Profile({
  FCMToken,
  country,
  user,
  updateUser,
  navigation,
  route,
  chatPlus,
  setChatPlus,
  //appState,
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
  myFollowing,
  setMyFollowing,
  calling,
  setCalling,
  timer,
  setTimer,
  isRunning,
  setIsRunning,
  callEndByMe,
  modalState,
  setModalState,
  reToken,
  setReToken,
}: {
  reToken: any;
  setReToken: any;
  calling: any;
  setCalling: any;
  timer: any;
  setTimer: any;
  isRunning: any;
  setIsRunning: any;
  callEndByMe: any;
  modalState: any;
  setModalState: any;
  myFollowing: any;
  setMyFollowing: any;
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
  //appState?: any;
}): JSX.Element {
  const membership = route.params?.membership;
  //const paymentSuccess = route.params?.paymentSuccess;

  const YouId = route.params?.YouId;
  const pageNum: any = useRef(0);
  const pageSize: any = useRef(6);
  const [fanStepList, setFanStepList] = useState([]);
  const [you, setYou]: any = useState(null);
  const [followState, setFollowState] = useState(false);
  const [followCount, setFollowCount] = useState(0);
  const [postLength, setPostLength] = useState(0);
  const [userPost, setUserPost]: any = useState([]);
  const [profileState, setProfileState] = useState(
    membership ? "멤버십" : "포스트",
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseType, setPurchaseType]: any = useState("membership"); //point , membership
  const [purchaseOneSelect, setPurchaseOneSelect]: any = useState(null);
  const [videoId, setVideoId]: any = useState(null);
  const [videoType, setVideoType]: any = useState(null);
  const [subscribeState, setSubsribeState]: any = useState(null);
  const [forceFollow, setForceFollow] = useState(false);

  useEffect(() => {
    if (membership) {
      setProfileState("멤버십");
    }
  }, [membership]);
  const [firstRender, setFirstRender] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await api
        .get("/post/postUserList", {
          params: {
            APP_VERSION,
            pageNum: 0,
            pageSize: pageSize.current,
            YouId,
            country,
            platform: Platform.OS,
          },
        })
        .then(res => {
          setUserPost(res.data.postList);
          pageNum.current = 1;
        });
    } catch (err) { }
    setRefreshing(false);
  }, [user]);

  useEffect(() => {
    async function fetchData() {
      try {
        await api
          .get("/user/profileData", {
            params: {
              APP_VERSION,
              pageNum: 0,
              pageSize: pageSize.current,
              YouId,
              country,
              platform: Platform.OS,
            },
          })
          .then(res => {
            setSubsribeState(res.data?.subscribe);
            setFanStepList(res.data?.fanStepList);
            setFollowCount(res.data.followCount);
            setYou(res.data.user);
            setFollowState(res.data.followCheck);
            setPostLength(res.data.postLength);
            setUserPost(res.data.postList);
            pageNum.current = 1;
          });
      } catch (err) { }
      setFirstRender(true);
    }
    fetchData();
  }, [YouId]);

  const oneTime: any = useRef(false);
  useEffect(() => {
    async function fetchFollow() {
      try {
        await api
          .post("/user/createFollowFromProfile", {
            YouId,
          })
          .then(res => {
            if (res.data.status === "true") {
              const result = res.data?.result;
              if (result) {
                setFollowCount(followCount + 1);
                setMyFollowing((prev: any) => [you, ...prev]);
                setForceFollow(true);
                setFollowState(true);
                setTimeout(() => {
                  setForceFollow(false);
                }, 2000);
              }
            }
          });
      } catch (err) { }
    }
    if (you && you?.id !== user?.id && !oneTime.current) {
      fetchFollow();
      oneTime.current = true;
    }
  }, [you]);

  const [topCheck, setTopCheck] = useState(false);
  const [currentHeight, setCurrentHeight] = useState(0);

  const ref: any = useRef(null);

  const insets = useSafeAreaInsets();
  const [selectUrl, setSelectUrl]: any = useState(null);
  const [selectType, setSelectType] = useState("photo"); // photo or video
  const [modalContent, setModalContent] = useState(false);

  //const [modalState, setModalState]: any = useState(false);
  const [imgUrl, setImgUrl]: any = useState(null);
  const [modalText, setModalText]: any = useState(null);
  const [imgVisible, setImgVisible] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);

  const copyToClipboard = () => {
    Clipboard.setString(`https://nmoment.live/profile/${you?.link}`);
  };

  const isFocused = useIsFocused();

  const [accessToken, setAccessToken]: any = useState(null);
  const [refreshToken, setRefreshToken]: any = useState(null);

  useEffect(() => {
    async function getSecureToken() {
      setAccessToken(await EncryptedStorage.getItem("accessToken"));
      setRefreshToken(await EncryptedStorage.getItem("refreshToken"));
      setReToken(false);
    }
    if (isFocused || reToken) {
      getSecureToken();
    }
  }, [isFocused, reToken]);

  useEffect(() => {
    async function subscribeEnd() {
      const subscribeEnd = await AsyncStorage.getItem("subscribeEnd");
      if (subscribeEnd) {
        try {
          await api
            .get("/user/profileData", {
              params: {
                APP_VERSION,
                pageNum: 0,
                pageSize: pageSize.current,
                YouId,
                country,
                platform: Platform.OS,
              },
            })
            .then(res => {
              setSubsribeState(res.data?.subscribe);
              setFanStepList(res.data?.fanStepList);
              setFollowCount(res.data.followCount);
              setYou(res.data.user);
              setFollowState(res.data.followCheck);
              setPostLength(res.data.postLength);
              setUserPost(res.data.postList);
              pageNum.current = 1;
            });
        } catch (err) { }

        await AsyncStorage.removeItem("subscribeEnd");
      }
    }
    if (isFocused) {
      setTimeout(() => {
        subscribeEnd();
      }, 500);
    }
  }, [isFocused]);

  const [adultChk, setAdultChk] = useState(false);

  useEffect(() => {
    async function adultFetch() {
      if (
        you?.adultPage === true &&
        parseInt(YouId) !== parseInt(user?.id) &&
        (user?.real_birthday === null ||
          (user?.real_birthday &&
            Number(user?.real_birthday) >
            Number(new Date().getFullYear() - 19)))
      ) {
        setAdultChk(true);
      }
    }
    adultFetch();
  }, [you]);

  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["left"]}>
      {isFocused && you && (
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
          selectedUser={you}></ProfileModal>
      )}

      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={"dark-content"}
      />

      {imgVisible === true && (
        <ImageModal
          country={country}
          screenModal={false}
          isVisible={imgVisible}
          imgUrl={imgUrl}
          setIsVisible={setImgVisible}
          modalText={modalText}
          setModalText={setModalText}></ImageModal>
      )}
      {videoVisible === true && (
        <VideoModal
          country={country}
          screenModal={false}
          isVisible={videoVisible}
          videoId={videoId}
          videoType={videoType}
          setIsVisible={setVideoVisible}
          modalText={modalText}
          setModalText={setModalText}></VideoModal>
      )}
      {forceFollow === true && (
        <View
          style={{
            position: "absolute",
            left: vw(8),
            width: vw(84),
            height: 50,
            bottom: vh(6),
            zIndex: 9999,
            borderRadius: 30,
            backgroundColor: PALETTE.COLOR_BLACK,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}>
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
            }}>
            {country === "ko"
              ? `팔로우 하였습니다❤️`
              : country === "ja"
                ? `フォローしました❤️`
                : country === "es"
                  ? `Seguido❤️`
                  : country === "fr"
                    ? `Suivi❤️`
                    : country === "id"
                      ? `Diikuti❤️`
                      : country === "zh"
                        ? `已关注❤️`
                        : `Followed❤️`}
          </Text>
        </View>
      )}

      {country === "ko" && adultChk === true && (
        <View
          style={{
            width: vw(100),
            height: vh(100),
            position: "absolute",
            zIndex: 214748666,
            top: 0,
            backgroundColor: "rgba(0,0,0,0.2)",
          }}>
          <View
            style={{
              width: vw(100),
              height: vh(100),
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}>
            <View
              style={{
                width: vw(80),
                height: vh(40),
                backgroundColor: "white",
                borderRadius: 20,
                paddingTop: 10,
                justifyContent: "space-between",
              }}>
              <View
                style={{
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <Image
                  style={{
                    width: vh(10),
                    height: vh(10),
                    marginBottom: 20,
                  }}
                  source={require("../../assets/home/adult.png")}></Image>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 24,
                    marginTop: 5,
                  }}>
                  {country === "ko"
                    ? "성인인증이 필요한"
                    : country === "ja"
                      ? "成人認証が必要"
                      : country === "es"
                        ? "Se requiere autenticación de adulto"
                        : "Adult authentication required"}
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 24,
                    marginTop: 5,
                  }}>
                  {country === "ko"
                    ? "콘텐츠입니다."
                    : country === "ja"
                      ? "コンテンツです。"
                      : country === "es"
                        ? "Contenido."
                        : "Content."}
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 14,
                  }}>
                  {country === "ko"
                    ? "해당 콘텐츠는 19세 이상 이용제한이 설정된"
                    : country === "ja"
                      ? "このコンテンツは19歳以上の利用制限が設定されています"
                      : country === "es"
                        ? "El contenido está restringido para su uso por personas mayores de 19 años."
                        : "The content is restricted for use by people over the age of 19."}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                  }}>
                  {country === "ko"
                    ? "콘텐츠 입니다. 최초 1번 인증 완료 이후에는 추가"
                    : country === "ja"
                      ? "コンテンツです。最初の1回認証料金の後に追加"
                      : country === "es"
                        ? "es contenido Después de la primera cuota de autenticación, adicional"
                        : "It is content. After the first authentication fee, additional"}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                  }}>
                  {country === "ko"
                    ? "인증 없이 사용 가능합니다."
                    : country === "ja"
                      ? "認証なしで利用可能です。"
                      : country === "es"
                        ? "Se puede utilizar sin autenticación."
                        : "Can be used without authentication."}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <TouchableOpacity
                  style={{
                    width: vw(40),
                    height: vh(5),
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    backgroundColor: "#eb0000",
                  }}
                  onPress={() => {
                    navigation.replace("CertificationIn");
                  }}>
                  <Text
                    style={{
                      color: "white",
                    }}>
                    {country === "ko"
                      ? "확인"
                      : country === "ja"
                        ? "確認"
                        : country === "es"
                          ? "Confirmar"
                          : "Confirm"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: vw(40),
                    height: vh(5),
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f4f4f4",
                  }}
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Text>
                    {country === "ko"
                      ? "취소"
                      : country === "ja"
                        ? "キャンセル"
                        : country === "es"
                          ? "cancelación"
                          : "cancellation"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      <Modal
        animationIn="slideInUp"
        animationOut={"slideInDown"}
        swipeDirection="down"
        onSwipeComplete={() => {
          setShowPurchaseModal(false);
        }}
        isVisible={showPurchaseModal}
        //animationOutTiming
        onBackButtonPress={() => {
          setShowPurchaseModal(false);
        }}
        style={{
          position: "absolute",
          width: vw(100),
          marginLeft: 0,
          marginTop: 0,
          marginBottom: 0,
          justifyContent: "space-between",
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            //marginTop: -insets.top,
            //paddingTop: insets.top,
            height: vh(60),
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
          onPress={() => {
            setShowPurchaseModal(false);
          }}></TouchableOpacity>
        <View
          style={{
            flex: 1,
            height: vh(40),
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            backgroundColor: PALETTE.COLOR_WHITE,
            paddingBottom: insets.bottom,
            paddingTop: vh(3),
            justifyContent: "space-between",
          }}>
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 17,
                color: "black",
              }}>
              {country === "ko"
                ? `포스트 열람권 구매`
                : country === "ja"
                  ? `投稿閲覧権購入`
                  : country === "es"
                    ? `Compra de derecho de acceso a la publicación`
                    : country === "fr"
                      ? `Achat du droit d'accès à la publication`
                      : country === "id"
                        ? `Pembelian hak akses ke posting`
                        : country === "zh"
                          ? `购买帖子访问权`
                          : `Purchase post access right`}
            </Text>
          </View>
          <View
            style={{
              marginLeft: vw(6),
              marginRight: vw(6),
            }}>
            <View
              style={{
                marginBottom: vh(2),
              }}>
              {purchaseOneSelect?.cost !== -1 && (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor:
                      purchaseType === "point"
                        ? PALETTE.COLOR_BLACK
                        : PALETTE.COLOR_BORDER,
                    borderRadius: 10,
                    height: 60,
                    padding: 10,
                  }}
                  onPress={() => setPurchaseType("point")}>
                  <Text
                    style={{
                      color: "black",
                    }}>
                    {country === "ko"
                      ? `포인트로 구매하기`
                      : country === "ja"
                        ? `ポイントで購入する`
                        : country === "es"
                          ? `Comprar con puntos`
                          : country === "fr"
                            ? `Acheter avec des points`
                            : country === "id"
                              ? `Beli dengan poin`
                              : country === "zh"
                                ? `使用积分购买`
                                : `Purchase with points`}
                  </Text>
                  <View
                    style={{
                      marginLeft: 10,
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      backgroundColor: PALETTE.COLOR_BACK,
                      borderRadius: 10,
                      padding: 8,
                    }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#838383",
                        fontSize: 14,
                      }}>
                      {Number(purchaseOneSelect?.cost).toLocaleString()}
                    </Text>
                    <Image
                      source={require("../../assets/setting/point.png")}
                      style={{
                        backgroundColor: PALETTE.COLOR_WHITE,
                        borderRadius: 100,
                        width: 14,
                        height: 14,
                        marginLeft: 5,
                      }}></Image>
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor:
                    purchaseType === "point"
                      ? PALETTE.COLOR_BORDER
                      : PALETTE.COLOR_BLACK,
                  borderRadius: 10,
                  height: 60,
                  padding: 10,
                }}
                onPress={() => setPurchaseType("membership")}>
                <Text
                  style={{
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `멤버십 구매하기`
                    : country === "ja"
                      ? `メンバーシップを購入する`
                      : country === "es"
                        ? `Comprar membresía`
                        : country === "fr"
                          ? `Acheter un abonnement`
                          : country === "id"
                            ? `Beli keanggotaan`
                            : country === "zh"
                              ? `购买会员`
                              : `Purchase membership`}
                </Text>
                <View
                  style={{
                    marginLeft: 10,
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    backgroundColor: PALETTE.COLOR_BACK,
                    borderRadius: 10,
                    padding: 8,
                  }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#838383",
                      fontSize: 14,
                    }}>
                    VIP {purchaseOneSelect?.step}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: PALETTE.COLOR_BACK,
                  width: vw(42),
                  height: vh(6),
                  borderRadius: 50,
                }}
                onPress={() => {
                  setShowPurchaseModal(false);
                }}>
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
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
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: PALETTE.COLOR_NAVY,
                  width: vw(42),
                  height: vh(6),
                  borderRadius: 50,
                }}
                onPress={async () => {
                  setShowPurchaseModal(false);
                  if (purchaseType === "point") {
                    if (purchaseOneSelect?.cost === -1) return;
                    if (point?.amount < purchaseOneSelect?.cost) {
                      Alert.alert(
                        country === "ko"
                          ? `포인트가 부족합니다.`
                          : country === "ja"
                            ? `ポイントが不足しています。`
                            : country === "es"
                              ? `Puntos insuficientes.`
                              : country === "fr"
                                ? `Points insuffisants.`
                                : country === "id"
                                  ? `Poin tidak mencukupi.`
                                  : country === "zh"
                                    ? `积分不足。`
                                    : `Insufficient points.`,
                      );
                      navigation.navigate("Store");
                      return;
                    }
                    Alert.alert(
                      country === "ko"
                        ? `해당 게시글 열람권을 구매하시겠습니까?`
                        : country === "ja"
                          ? `この投稿の閲覧権を購入しますか？`
                          : country === "es"
                            ? `¿Desea comprar el derecho de acceso a esta publicación?`
                            : country === "fr"
                              ? `Souhaitez-vous acheter le droit d'accès à cette publication ?`
                              : country === "id"
                                ? `Apakah Anda ingin membeli hak akses ke postingan ini?`
                                : country === "zh"
                                  ? `您要购买此帖子的阅览权吗？`
                                  : `Do you want to purchase the access right to this post?`,
                      "",
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
                              ? `확인`
                              : country === "ja"
                                ? `確認`
                                : country === "es"
                                  ? `Confirmar`
                                  : country === "fr"
                                    ? `Confirmer`
                                    : country === "id"
                                      ? `Konfirmasi`
                                      : country === "zh"
                                        ? `确认`
                                        : `Confirm`,
                          onPress: async () => {
                            await api
                              .post("/post/purchasePost", {
                                PostId: purchaseOneSelect?.id,
                              })
                              .then(res => {
                                if (res.data.status === "true") {
                                  Alert.alert(
                                    country === "ko"
                                      ? `구매가 완료 되었습니다.`
                                      : country === "ja"
                                        ? `購入が完了しました。`
                                        : country === "es"
                                          ? `La compra se ha completado.`
                                          : country === "fr"
                                            ? `L'achat est terminé.`
                                            : country === "id"
                                              ? `Pembelian selesai.`
                                              : country === "zh"
                                                ? `购买完成。`
                                                : `Purchase completed.`,
                                  );
                                  const postAfter = res.data.post;
                                  setUserPost(
                                    userPost?.map((list: any, idx: number) =>
                                      list.id === purchaseOneSelect?.id
                                        ? {
                                          ...list,
                                          url: postAfter.url,
                                          contentSecret: false,
                                        }
                                        : list,
                                    ),
                                  );
                                  updatePoint({
                                    ...point,
                                    amount:
                                      point.amount - purchaseOneSelect?.cost,
                                  });
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
                          },
                        },
                      ],
                    );
                  } else {
                    setProfileState("멤버십");
                  }
                }}>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                  }}>
                  {country === "ko"
                    ? `구매하기`
                    : country === "ja"
                      ? `購入する`
                      : country === "es"
                        ? `Comprar`
                        : country === "fr"
                          ? `Acheter`
                          : country === "id"
                            ? `Beli`
                            : country === "zh"
                              ? `购买`
                              : `Purchase`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View
        style={{
          flex: 1,
        }}>
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            top: vh(6),
            left: vw(4),
            borderRadius: 100,
            width: 30,
            height: 30,
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "absolute",
            zIndex: 4,
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={require("../../assets/home/back.png")}
            style={{
              width: 18,
              height: 18,
            }}></Image>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            top: vh(6),
            right: vw(4),
            borderRadius: 100,
            width: 30,
            height: 30,
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "absolute",
            zIndex: 4,
          }}
          onPress={() => {
            if (you.id === user.id) return;

            Alert.alert(
              country === "ko"
                ? `차단 하시겠습니까?`
                : country === "ja"
                  ? `ブロックしますか？`
                  : country === "es"
                    ? `¿Quieres bloquear?`
                    : country === "fr"
                      ? `Voulez-vous bloquer?`
                      : country === "id"
                        ? `Apakah Anda ingin memblokir?`
                        : country === "zh"
                          ? `你想阻止吗？`
                          : `Do you want to block?`,
              "",
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
                      ? `확인`
                      : country === "ja"
                        ? `確認`
                        : country === "es"
                          ? `Confirmar`
                          : country === "fr"
                            ? `Confirmer`
                            : country === "id"
                              ? `Konfirmasi`
                              : country === "zh"
                                ? `确认`
                                : `Confirm`,
                  onPress: async () => {
                    await api
                      .post("/user/createBan", {
                        YouId: you.id,
                      })
                      .then((res: any) => {
                        if (res.data.status === "true") {
                          Alert.alert(
                            country === "ko"
                              ? `차단 완료`
                              : country === "ja"
                                ? `ブロック完了`
                                : country === "es"
                                  ? `Obstruido`
                                  : country === "fr"
                                    ? `Bloqué`
                                    : country === "id"
                                      ? `Diblokir`
                                      : country === "zh"
                                        ? `被阻止`
                                        : `Blocked`,
                            country === "ko"
                              ? `차단 되었습니다.`
                              : country === "ja"
                                ? `ブロックされました。`
                                : country === "es"
                                  ? `Has sido bloqueado.`
                                  : country === "fr"
                                    ? `Vous avez été bloqué.`
                                    : country === "id"
                                      ? `Anda telah diblokir.`
                                      : country === "zh"
                                        ? `您已被阻止。`
                                        : `You have been blocked.`,
                          );
                          navigation.goBack();
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
                  },
                },
              ],
            );
          }}>
          <Image
            source={require("../../assets/home/menu.png")}
            style={{
              width: 18,
              height: 18,
            }}></Image>
        </TouchableOpacity>

        {currentHeight > vh(10) ? (
          <View
            style={{
              zIndex: 0,
            }}>
            <BlurView
              //blurAmount={5}
              blurType="light"
              blurAmount={15}
              style={{
                width: vw(100),
                height: vh(12), //12
                position: "absolute",
                zIndex: 1,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}>
              <Text
                numberOfLines={1}
                style={{
                  paddingTop: Platform.OS === "android" ? vh(6) : vh(4),
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 18,
                  color: PALETTE.COLOR_WHITE,
                }}>
                {you?.nick}
              </Text>
            </BlurView>
            <FastImage
              source={{
                uri: you?.background,
                priority: FastImage.priority.normal,
              }}
              style={{
                top: 0,
                width: "100%",
                height: vh(12),
              }}
              resizeMode={FastImage.resizeMode.cover}></FastImage>
          </View>
        ) : (
          <FastImage
            source={{
              uri: you?.background,
              priority: FastImage.priority.normal,
            }}
            style={{
              width: "100%",
              height: vh(18),
              paddingTop: 60,
              paddingLeft: vw(4),
              paddingRight: vw(4),
              flexDirection: "row",
              justifyContent: "space-between",
              position: "absolute",
              zIndex: 0,
              top: 0,
            }}
            resizeMode={FastImage.resizeMode.cover}></FastImage>
        )}
        {userPost && fanStepList && firstRender && (
          <FlatList
            ref={ref}
            onScroll={e => {
              const { contentSize, layoutMeasurement, contentOffset } =
                e.nativeEvent;
              setCurrentHeight(contentOffset.y);
            }}
            contentContainerStyle={{
              paddingBottom: vh(10),
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            scrollEnabled
            onEndReached={async e => {
              if (profileState === "멤버십") return;
              await api
                .get("/post/postUserList", {
                  params: {
                    APP_VERSION,
                    pageNum: pageNum.current,
                    pageSize: pageSize.current,
                    YouId,
                    country,
                    platform: Platform.OS,
                  },
                })
                .then(res => {
                  setUserPost((prevPost: any) => [
                    ...prevPost,
                    ...res.data.postList,
                  ]);
                  pageNum.current = pageNum.current + 1;
                });
            }}
            //horizontal={true}
            keyExtractor={(item: any) => item.id}
            data={profileState === "포스트" ? userPost : fanStepList}
            numColumns={1}
            decelerationRate={"fast"}
            //stickyHeaderIndices={true}
            ListHeaderComponent={() => (
              <View
                style={{
                  paddingLeft: vw(4),
                  paddingRight: vw(4),
                  marginTop: currentHeight > vh(10) ? 0 : vh(18),
                  width: vw(100),
                  paddingTop: vh(2),
                  //paddingBottom: vh(2),
                  backgroundColor: PALETTE.COLOR_WHITE,
                  //borderBottomColor: PALETTE.COLOR_BORDER,
                  //borderBottomWidth: 0.5,
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    width: "100%",
                  }}>
                  <View></View>
                  <TouchableOpacity
                    style={{
                      width: vw(20) + 5,
                      height: vw(20) + 5,
                      borderRadius: 100,
                      borderWidth: 5,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      backgroundColor: PALETTE.COLOR_WHITE,
                      borderColor: PALETTE.COLOR_WHITE,
                      transform: [{ translateY: -vw(10) }],
                      position: "absolute",
                      zIndex: 1,
                    }}
                    onPress={() => {
                      setModalContent(true);
                      setSelectType("photo");
                      setSelectUrl(you?.profile);

                      setImgVisible(true);
                      setImgUrl(you?.profile);
                    }}>
                    <FastImage
                      source={{
                        uri: you?.profile,
                        priority: FastImage.priority.normal,
                      }}
                      style={{
                        width: vw(20),
                        height: vw(20),
                        borderRadius: 100,
                      }}
                      resizeMode={FastImage.resizeMode.cover}></FastImage>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                    }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        width: 36,
                        height: 36,
                        marginRight: 5,
                      }}
                      onPress={async () => {
                        if (you?.id === user?.id) return;
                        await api
                          .post("/room/createRoom", {
                            YouId: you?.id,
                          })
                          .then(async res => {
                            if (res.data.status === "true") {
                              const RoomId: number = res.data.RoomId;
                              //setModalState(LIVE_CONSTANT.MODAL_STATE_DEFAULT);
                              navigation.navigate("Chat", {
                                RoomId,
                              });
                            }
                          });
                      }}>
                      <Image
                        source={require("../../assets/home/chat.png")}
                        style={{
                          width: 36,
                          height: 36,
                        }}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        width: 36,
                        height: 36,
                        marginRight: 5,
                      }}
                      onPress={() => {
                        setModalState(LIVE_CONSTANT.MODAL_STATE_PROFILE);
                      }}>
                      <Image
                        source={require("../../assets/home/video.png")}
                        style={{
                          width: 36,
                          height: 36,
                        }}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        width: 36,
                        height: 36,
                        marginRight: 5,
                      }}
                      onPress={() => {
                        navigation.navigate("Donation", {
                          YouId: you.id,
                        });
                      }}>
                      <Image
                        source={require("../../assets/home/trophy.png")}
                        style={{
                          width: 36,
                          height: 36,
                        }}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        width: 36,
                        height: 36,
                        marginRight: 5,
                      }}
                      onPress={() => {
                        navigation.navigate("Gallery", {
                          YouId: you.id,
                          type: "profile",
                        });
                      }}>
                      <Image
                        source={require("../../assets/home/gallery.png")}
                        style={{
                          width: 36,
                          height: 36,
                        }}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        borderRadius: 100,
                        borderWidth: 1,
                        borderColor: PALETTE.COLOR_BORDER,
                        padding: 10,
                        backgroundColor: "#f4f4f4",
                      }}
                      onPress={async e => {
                        if (user.id === you.id) return;
                        if (followState === false) {
                          await api
                            .post("/user/createFollow", {
                              YouId,
                            })
                            .then(res => {
                              if (res.data.status === "true") {
                                setFollowCount(followCount + 1);
                                setFollowState(true);
                                setMyFollowing((prev: any) => [you, ...prev]);
                              }
                            });
                        } else {
                          await api
                            .delete("/user/removeFollow", {
                              data: {
                                YouId,
                              },
                            })
                            .then(res => {
                              if (res.data.status === "true") {
                                setFollowCount(followCount - 1);
                                setFollowState(false);
                                setMyFollowing(
                                  myFollowing.filter(
                                    (item: any) => item?.id !== you?.id,
                                  ),
                                );
                              }
                            });
                        }
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "black",
                        }}>
                        {followState === true
                          ? country === "ko"
                            ? `팔로잉`
                            : country === "ja"
                              ? `フォロー中`
                              : country === "es"
                                ? `Siguiendo`
                                : country === "fr"
                                  ? `Abonnements`
                                  : country === "id"
                                    ? `Mengikuti`
                                    : country === "zh"
                                      ? `正在关注`
                                      : `Following`
                          : country === "ko"
                            ? `팔로우 하기`
                            : country === "ja"
                              ? `フォローする`
                              : country === "es"
                                ? `Seguir`
                                : country === "fr"
                                  ? `Suivre`
                                  : country === "id"
                                    ? `Ikuti`
                                    : country === "zh"
                                      ? `关注`
                                      : `Follow`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: vw(5),
                    //backgroundColor: "red",
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "flex-end",
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginRight: 5,
                        color: "black",
                      }}>
                      {you?.nick}
                    </Text>
                    <Image
                      source={require("../../assets/setting/badge.png")}
                      style={{
                        width: 15,
                        height: 15,
                      }}></Image>
                  </View>
                  <Text
                    style={{
                      marginTop: 2,
                      color: "#838383",
                      fontSize: 13,
                    }}>
                    {you?.link}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      marginTop: 12,
                      marginBottom: 12,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "#535353",
                        marginRight: 4,
                      }}>
                      {kmParsing(followCount)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#838383",
                        marginRight: 4,
                      }}>
                      {country === "ko"
                        ? `팔로워`
                        : country === "ja"
                          ? `フォロワー`
                          : country === "es"
                            ? `Seguidores`
                            : country === "fr"
                              ? `Abonnés`
                              : country === "id"
                                ? `Pengikut`
                                : country === "zh"
                                  ? `粉丝`
                                  : `Followers`}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "#535353",
                        marginRight: 4,
                      }}>
                      ·
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "#535353",
                        marginRight: 4,
                      }}>
                      {kmParsing(postLength)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#838383",
                        marginRight: 4,
                      }}>
                      {country === "ko"
                        ? `포스트`
                        : country === "ja"
                          ? `ポスト`
                          : country === "es"
                            ? `Publicación`
                            : country === "fr"
                              ? `Publication`
                              : country === "id"
                                ? `Pos`
                                : country === "zh"
                                  ? `帖子`
                                  : `Post`}
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: "black",
                      fontSize: 14,
                    }}>
                    {you?.introduce}
                  </Text>

                  <TouchableOpacity
                    style={{
                      marginTop: 10,
                      marginBottom: 10,
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      copyToClipboard();

                      Alert.alert(
                        country === "ko"
                          ? `복사 완료 링크를 공유 해보세요!`
                          : country === "ja"
                            ? `コピー済みのリンクを共有してみてください！`
                            : country === "es"
                              ? `¡Comparte el enlace copiado!`
                              : country === "fr"
                                ? `Partagez le lien copié !`
                                : country === "id"
                                  ? `Bagikan tautan yang disalin!`
                                  : country === "zh"
                                    ? `分享复制的链接！`
                                    : `Share the copied link!`,
                      );
                    }}>
                    <Image
                      source={require("../../assets/home/link.png")}
                      style={{
                        width: 16,
                        height: 16,
                        marginRight: 5,
                      }}></Image>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#838383",
                        fontWeight: "bold",
                      }}>
                      {`nmoment.live/profile/${you?.link}`}
                    </Text>
                  </TouchableOpacity>

                  {you?.id === user?.id && (
                    <View
                      style={{
                        backgroundColor: PALETTE.COLOR_BACK,
                        borderRadius: 10,
                        paddingLeft: vw(2),
                        paddingRight: vw(2),
                        paddingTop: 10,
                        paddingBottom: 10,
                        marginTop: vh(2),
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: vh(2),
                      }}>
                      <View>
                        <Text
                          style={{
                            fontWeight: "400",
                            fontSize: 14,
                            color: "black",
                          }}>
                          {country === "ko"
                            ? "게시글 앱에서 확인"
                            : country === "ja"
                              ? "投稿はアプリで確認してください"
                              : country === "es"
                                ? "Revisa la publicación en la aplicación"
                                : country === "fr"
                                  ? "Vérifiez l'article dans l'application"
                                  : country === "id"
                                    ? "Periksa postingan di aplikasi"
                                    : country === "zh"
                                      ? "在应用程序中查看帖子"
                                      : "Check the post in the app"}
                        </Text>
                        <Text
                          style={{
                            marginTop: 2,
                            fontWeight: "400",
                            fontSize: 14,
                            color: PALETTE.COLOR_MAIN,
                          }}>
                          {country === "ko"
                            ? "(유출 방지)"
                            : country === "ja"
                              ? "（漏洩防止）"
                              : country === "es"
                                ? "(prevención de fugas)"
                                : country === "fr"
                                  ? "(prévention des fuites)"
                                  : country === "id"
                                    ? "(pencegahan kebocoran)"
                                    : country === "zh"
                                      ? "（防止泄漏）"
                                      : "(leak prevention)"}
                        </Text>
                      </View>
                      <Switch
                        trackColor={{
                          false: "#a4a4a4",
                          true: PALETTE.COLOR_NAVY,
                        }}
                        thumbColor={user?.postShowApp ? "#f4f3f4" : "#f4f3f4"}
                        ios_backgroundColor="#a4a4a4"
                        onValueChange={async () => {
                          await api
                            .post("/user/updatePostShowApp", {})
                            .then(res => {
                              if (res.data.status === "true") {
                                updateUser(res.data.user);
                              }
                            });
                        }}
                        value={user?.postShowApp}
                      />
                    </View>
                  )}
                </View>
                {
                  /*
                  <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    paddingLeft: vw(4),
                    paddingRight: vw(4),
                    justifyContent: "space-evenly",
                  }}>
                  <TouchableOpacity
                    style={{
                      width: "45%",
                      paddingTop: 10,
                      paddingBottom: 15,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderBottomColor:
                        profileState === "포스트" ? "black" : "white",
                      borderBottomWidth: profileState === "포스트" ? 2 : 2,
                    }}
                    onPress={() => {
                      setProfileState("포스트");
                    }}>
                    <Text
                      style={
                        profileState === "포스트"
                          ? {
                              fontWeight: "bold",
                              color: "black",
                              fontSize: 14,
                            }
                          : {
                              color: "#838383",
                              fontSize: 14,
                            }
                      }>
                      {country === "ko"
                        ? `포스트`
                        : country === "ja"
                        ? `ポスト`
                        : country === "es"
                        ? `Publicación`
                        : country === "fr"
                        ? `Publication`
                        : country === "id"
                        ? `Pos`
                        : country === "zh"
                        ? `帖子`
                        : `Post`}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: "45%",
                      paddingTop: 10,
                      paddingBottom: 15,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderBottomColor:
                        profileState === "포스트" ? "white" : "black",
                      borderBottomWidth: profileState === "포스트" ? 2 : 2,
                    }}
                    onPress={() => {
                      setProfileState("멤버십");
                    }}>
                    <Text
                      style={
                        profileState === "포스트"
                          ? {
                              fontWeight: "bold",
                              color: "#838383",
                              fontSize: 14,
                            }
                          : {
                              fontWeight: "bold",
                              color: "black",
                              fontSize: 14,
                            }
                      }>
                      {country === "ko"
                        ? `멤버십`
                        : country === "ja"
                        ? `メンバーシップ`
                        : country === "es"
                        ? `Membresía`
                        : country === "fr"
                        ? `Adhésion`
                        : country === "id"
                        ? `Keanggotaan`
                        : country === "zh"
                        ? `会员`
                        : `Membership`}
                    </Text>
                  </TouchableOpacity>
                </View>
                  */
                }

              </View>
            )}
            //stickyHeaderHiddenOnScroll
            //stickyHeaderIndices={[0]} // 0번째 index 로지정
            showsVerticalScrollIndicator={false}
            renderItem={(props: any) => (
              <>
              </>
            )}
          />
        )}

        {currentHeight > vh(10) && (
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              borderRadius: 100,
              backgroundColor: PALETTE.COLOR_WHITE,
              borderWidth: 1,
              borderColor: PALETTE.COLOR_BORDER,
              position: "absolute",
              zIndex: 5,
              width: 35,
              height: 35,
              bottom: vh(13),
              right: vw(8),
            }}
            onPress={() => {
              ref.current?.scrollToIndex({ index: 0 });
            }}>
            <Image
              source={require("../../assets/home/up.png")}
              style={{
                width: 18,
                height: 18,
              }}></Image>
          </TouchableOpacity>
        )}
        {/*profileState === "포스트" && !subscribeState?.step && (
          <TouchableOpacity
            style={{
              position: "absolute",
              left: vw(8),
              width: vw(84),
              height: 50,
              bottom: vh(6),
              borderRadius: 30,
              backgroundColor: PALETTE.COLOR_NAVY,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setProfileState("멤버십");
            }}>
            <Text
              style={{
                color: PALETTE.COLOR_WHITE,
                fontWeight: "500",
                fontSize: 16,
              }}>
              {country === "ko"
                ? `멤버십 구독`
                : country === "ja"
                ? `メンバーシップサブスクリプション`
                : country === "es"
                ? `Suscripción a la membresía`
                : country === "fr"
                ? `Abonnement à la adhésion`
                : country === "id"
                ? `Berlangganan keanggotaan`
                : country === "zh"
                ? `会员订阅`
                : `Membership subscription`}
            </Text>
          </TouchableOpacity>
        )*/}
      </View>
    </NotchView>
  );
}
