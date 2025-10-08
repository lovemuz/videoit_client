import React from "react";
import {useState, useEffect, useRef} from "react";
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
  ActivityIndicator,
} from "react-native";
import {NotchProvider, NotchView} from "react-native-notchclear";
import AsyncStorage from "@react-native-async-storage/async-storage";

import serverURL from "../../lib/constant/serverURL";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {vw, vh, vmin, vmax} from "react-native-css-vh-vw";
import {useNavigation, useRoute} from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import {PALETTE} from "../../lib/constant/palette";

import VideoPlayer from "react-native-video-controls";
import Video from "react-native-video";
import GestureRecognizer from "react-native-swipe-gestures";
import Modal from "react-native-modal";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import EncryptedStorage from "react-native-encrypted-storage";
import {WebView} from "react-native-webview";
import {InAppBrowser} from "react-native-inappbrowser-reborn";

export default function VideoModal({
  videoType,
  videoId,
  setIsVisible,
  isVisible,
  screenModal,
  country,
  modalText,
  setModalText,
}: {
  videoType: any;
  videoId: any;
  setIsVisible: any;
  isVisible: any;
  screenModal: any;
  country: any;
  modalText?: any;
  setModalText?: any;
}): JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [accessToken, setAccessToken]: any = useState(null);
  const [refreshToken, setRefreshToken]: any = useState(null);

  useEffect(() => {
    async function getSecureToken() {
      setAccessToken(await EncryptedStorage.getItem("accessToken"));
      setRefreshToken(await EncryptedStorage.getItem("refreshToken"));
    }
    getSecureToken();
  }, []);

  return (
    <Modal
      animationIn="slideInUp"
      animationOut={"slideInDown"}
      swipeDirection="down"
      onSwipeComplete={() => {
        setIsVisible(false);
        setModalText(null);
      }}
      isVisible={isVisible}
      //animationOutTiming
      onBackButtonPress={() => {
        setIsVisible(false);
        setModalText(null);
      }}
      style={{
        position: "absolute",
        width: vw(100),
        marginLeft: 0,
        marginTop: 0,
        marginBottom: 0,
      }}>
      <View
        // activeOpacity={1}
        style={{
          flex: 1,
          backgroundColor: PALETTE.COLOR_BLACK,
          paddingTop: screenModal ? vh(2) : insets.top,
          paddingBottom: screenModal ? vh(2) : insets.bottom,
          width: vw(100),
          height: vh(100),
          zIndex: 2,
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}>
        <View
          style={{
            marginBottom: 20,
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            paddingLeft: vw(4),
            paddingRight: vw(4),
            width: "100%",
          }}>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              marginRight: 20,
            }}
            onPress={() => {
              setIsVisible(false);
              setModalText(null);
            }}>
            <Image
              source={require("../../assets/live/closeW.png")}
              style={{
                width: 25,
                height: 25,
              }}></Image>
          </TouchableOpacity>
          <View>
            <Text
              style={{
                color: PALETTE.COLOR_WHITE,
                fontSize: 12,
              }}>
              {country === "ko"
                ? `무단으로 해당 자료를 캡쳐 혹은 유포할 경우`
                : country === "ja"
                ? `無断で該当データをキャプチャーまたは共有する場合`
                : country === "es"
                ? `En caso de capturar o compartir este material sin autorización`
                : country === "fr"
                ? `En cas de capture ou de diffusion non autorisée de ces données`
                : country === "id"
                ? `Jika menangkap atau berbagi materi ini tanpa izin`
                : country === "zh"
                ? `未经许可捕捉或分享此材料的情况下`
                : `Unauthorized capture or sharing of this material`}
            </Text>
            <Text
              style={{
                color: PALETTE.COLOR_RED,
                fontSize: 12,
              }}>
              {country === "ko"
                ? `추적시스템에 의하여 수사 대상이 될 수 있습니다.`
                : country === "ja"
                ? `トラッキングシステムによって捜査対象となる可能性があります。`
                : country === "es"
                ? `Puede ser objeto de investigación mediante un sistema de seguimiento.`
                : country === "fr"
                ? `Vous pourriez faire l'objet d'une enquête grâce à un système de suivi.`
                : country === "id"
                ? `Anda mungkin menjadi sasaran penyelidikan melalui sistem pelacakan.`
                : country === "zh"
                ? `您可能会因跟踪系统而成为调查对象。`
                : `You may be subject to investigation through a tracking system.`}
            </Text>
          </View>
        </View>

        <WebView
          style={{
            flex: 1,
            zIndex: 9129,
            width: vw(100),
            margin: 30,
            //position: "absolute",
            //bottom: 0,
            //zIndex: 9129991291231232,
            ///position: "absolute",
          }}
          allowsFullscreenVideo={true}
          //geolocationEnabled={true}
          allowsInlineMediaPlayback={true}
          useWebKit={true}
          //userAgent="Mozilla/5.0 (Linux; Android 10; Android SDK built for x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.185 Mobile Safari/537.36"
          userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"
          source={{
            uri: `https://nmoment.live/${
              videoType === "post" ? "postwebview" : "chatwebview"
            }/${videoId}?accessToken=${accessToken}&controls=true`,
          }}
          allowsBackForwardNavigationGestures={false}
          scrollEnabled={true}
          originWhitelist={["*"]}
          allowFileAccess={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccessFromFileURLs={true}
          mixedContentMode="always"
          androidLayerType={"hardware"}
          mediaPlaybackRequiresUserAction={false}
          mediaCapturePermissionGrantType={"grant"}></WebView>
      </View>
    </Modal>
  );
}
