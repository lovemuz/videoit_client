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
  ImageBackground,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import {NotchProvider, NotchView} from "react-native-notchclear";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {vw, vh, vmin, vmax} from "react-native-css-vh-vw";
import LinearGradient from "react-native-linear-gradient";
import Video from "react-native-video";
//import {LinearTextGradient} from "react-native-text-gradient";
import SplashScreen from "react-native-splash-screen";
import analytics from "@react-native-firebase/analytics";
import Share from "react-native-share";
import FastImage from "react-native-fast-image";
import Clipboard from "@react-native-clipboard/clipboard";
import api from "../../lib/api/api";
import {PALETTE} from "../../lib/constant/palette";
import serverURL from "../../lib/constant/serverURL";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
import {CRYPTO_SECRET} from "@env";
import CryptoJS from "crypto-js";
import IMP from "iamport-react-native";
import Loading from "../reusable/loading";
import {USER_GENDER} from "../../lib/constant/user-constant";

export default function Certification({
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
}: {
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
  const insets = useSafeAreaInsets();

  const email = route.params?.email;
  const sns = route.params?.sns;
  const snsId = route.params?.snsId;
  const age = route.params?.age;
  const password = route.params?.password;
  const gender = route.params?.gender;
  const nick = route.params?.nick;
  // let code: any = route.params?.code;
  // const profile = route.params?.profile;
  // const country = route.params?.country;
  // const urlFormData = route.params?.urlFormData;
  const [loading, setLoading] = useState(false);

  /* [필수입력] 본인인증 종료 후, 라우터를 변경하고 결과를 전달합니다. */
  async function callback(rsp: any) {
    if (rsp.success) {
      const adCode: any = await AsyncStorage.getItem("adCode");
      const code: any = await AsyncStorage.getItem("code");
      const cnv_id: any = await AsyncStorage.getItem("cnv_id");
      await axios
        .post(`${serverURL}/user/joinLocal/v2`, {
          imp_uid: rsp.imp_uid,
          email,
          sns,
          snsId,
          age,
          password,
          gender,
          nick,
          country,
          code,
          adCode,
          cnv_id,
        })
        .then(async (res: any) => {
          if (res.data.status === "true") {
            try {
              await analytics().initiateOnDeviceConversionMeasurementWithEmailAddress(
                email,
              );
              const accessToken: any = res.data.accessToken;
              const refreshToken: any = res.data.refreshToken;
              const password: any = res.data.alpha;
              const user: any = res.data.user;
              const bytes = CryptoJS.AES.decrypt(password, CRYPTO_SECRET);
              const alpha = bytes.toString(CryptoJS.enc.Utf8);
              await EncryptedStorage.setItem("accessToken", accessToken);
              await EncryptedStorage.setItem("refreshToken", refreshToken);
              await EncryptedStorage.setItem("sns", String(user?.sns));
              await EncryptedStorage.setItem("snsId", String(user?.snsId));
              await EncryptedStorage.setItem("password", alpha);
              await EncryptedStorage.setItem("email", email);
              const phone = await EncryptedStorage.getItem("phone");
              if (phone) await EncryptedStorage.removeItem("phone");
              updateUser(user);
              navigation.navigate("Live");
            } catch (err) {
              console.error(err);
            }
          } else {
            if (res.data.status === "adult") {
              Alert.alert(
                country === "ko"
                  ? `만 19세 이상부터 이용 가능합니다`
                  : country === "ja"
                  ? `19歳以上から利用可能です`
                  : country === "es"
                  ? `Disponible para mayores de 19 años.`
                  : country === "fr"
                  ? `Disponible pour les 19 ans et plus`
                  : country === "id"
                  ? `Tersedia untuk usia 19 tahun ke atas`
                  : country === "zh"
                  ? `适合 19 岁及以上人士`
                  : `Available for ages 19 and older`,
              );
              // navigation.goBack();
            } else if (res.data.dupPhone) {
              Alert.alert(
                country === "ko"
                  ? "기존 계정이 있습니다."
                  : country === "ja"
                  ? `既存のアカウントがあります。`
                  : country === "es"
                  ? `Tengo una cuenta existente.`
                  : country === "fr"
                  ? `J'ai un compte existant.`
                  : country === "id"
                  ? `Saya sudah memiliki akun.`
                  : country === "zh"
                  ? `我有一个现有帐户。`
                  : `I have an existing account.`,
              );

              // navigation.goBack();
            } else if (res.data.dupEmail) {
              Alert.alert(
                country === "ko"
                  ? `기존 계정이 있습니다.`
                  : country === "ja"
                  ? `既存のアカウントがあります。`
                  : country === "es"
                  ? `Tengo una cuenta existente.`
                  : country === "fr"
                  ? `J'ai un compte existant.`
                  : country === "id"
                  ? `Saya sudah memiliki akun.`
                  : country === "zh"
                  ? `我有一个现有帐户。`
                  : `I have an existing account.`,
              );
              // navigation.goBack();
            } else {
              Alert.alert(
                country === "ko"
                  ? `다시 시도해주세요.`
                  : country === "ja"
                  ? `もう一度お試しください。`
                  : country === "es"
                  ? `Inténtalo de nuevo.`
                  : country === "fr"
                  ? `Veuillez réessayer.`
                  : country === "id"
                  ? `silakan coba lagi.`
                  : country === "zh"
                  ? `请再试一次。`
                  : `please try again.`,
              );
              // navigation.goBack();
            }
            //오류 발생
            navigation.goBack();
          }
        });
    } else {
      // 인증 실패 시 로직,
      Alert.alert(
        country === "ko"
          ? "실패하셨습니다."
          : country === "ja"
          ? `失敗しました。`
          : country === "es"
          ? `Fallaste.`
          : country === "fr"
          ? `Tu as échoué.`
          : country === "id"
          ? `Anda telah gagal.`
          : country === "zh"
          ? `你失败了。`
          : `You failed.`,
      );
      navigation.goBack();
    }
  }

  /* [필수입력] 본인인증에 필요한 데이터를 입력합니다. */
  const data = {
    merchant_uid: `mid_${new Date().getTime()}`,
    company: "아임포트",
    carrier: "",
    name: "",
    phone: "",
    //pg: 'danal.B010008210"',
    //min_age: "",
  };
  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["top", "bottom"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={"dark-content"}
        //barStyle={Platform.OS === "ios" ? "light-content" : "dark-content"}
      />
      {loading && <Loading></Loading>}
      <IMP.Certification
        userCode={"imp54153407"} // 가맹점 식별코드
        //@ts-ignore
        //pg={"danal.B010008210"}
        //tierCode={'AAA'} // 티어 코드: agency 기능 사용자에 한함
        loading={
          <View
            style={{
              flex: 1,
              width: vw(100),
              height: vh(100),
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}>
            <ActivityIndicator color={"#d3d3d3"} size="large" />
          </View>
        } // 로딩 컴포넌트
        data={data} // 본인인증 데이터
        callback={callback} // 본인인증 종료 후 콜백
      />
    </NotchView>
  );
}
