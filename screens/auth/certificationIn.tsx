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

export default function CertificationIn({
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
  const profile = route.params?.profile;
  const urlFormData = route.params?.urlFormData;
  const [loading, setLoading] = useState(false);

  /* [필수입력] 본인인증 종료 후, 라우터를 변경하고 결과를 전달합니다. */
  async function callback(rsp: any) {
    if (rsp.success) {
      await api
        .post(`${serverURL}/etc/certifications/v2`, {
          imp_uid: rsp.imp_uid,
        })
        .then(async res => {
          if (res.data.status === "true") {
            const user = res.data.user;
            updateUser(user);
          } else {
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
          }
        });
      navigation.goBack();
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
