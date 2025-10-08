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
} from "react-native";
import { NotchProvider, NotchView } from "react-native-notchclear";
import AsyncStorage from "@react-native-async-storage/async-storage";
import analytics from "@react-native-firebase/analytics";
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
import { appleAuth } from "@invertase/react-native-apple-authentication";
import jwtDecode from "jwt-decode";
import EncryptedStorage from "react-native-encrypted-storage";
import { CRYPTO_SECRET } from "@env";
import CryptoJS from "crypto-js";

import {
  GoogleSignin,
  isSuccessResponse,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";

export default function Login({
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
  const isLoadingRef = useRef(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "824749508213-d1v72mfjjej728dsosv4ujdo2sk00qrl.apps.googleusercontent.com",
      offlineAccess: true,

      //forceCodeForRefreshToken: true,
    });
  }, []);
  const onPressGoogleBtn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response: any = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const idToken = response?.data?.idToken;
        const googleCredential = auth?.GoogleAuthProvider?.credential(idToken);
        const res: any = await auth()?.signInWithCredential(googleCredential);

        if (res) {
          if (isLoadingRef.current) return;
          isLoadingRef.current = true;

          const email = res.user.email;
          const sns = "google";
          const snsId = res.additionalUserInfo.profile.sub;

          //Sns 로그인시 계정 한번 체크 -> 있다면 a. 진행하여 로그인 진행
          await axios
            .post(`${serverURL}/user/snsUserCheck`, {
              email,
              sns,
              snsId,
            })
            .then(async res => {
              if (res.data.status === "true") {
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
                const point = res.data?.point;
                updateUser(user);
                updatePoint(point);
                navigation.navigate("Live");
              } else if (res.data.status === "ban") {
                try {
                  const currentUser = await GoogleSignin.getCurrentUser();
                  if (currentUser) {
                    await GoogleSignin.signOut();
                    console.log('로그아웃 성공');
                  }
                } catch (error) {
                  console.error('로그아웃 에러:', error);
                }
                Alert.alert(
                  country === "ko"
                    ? "계정 밴"
                    : country === "ja"
                      ? "アカウント禁止"
                      : country === "es"
                        ? "Cuenta suspendida"
                        : country === "fr"
                          ? "Compte banni"
                          : country === "id"
                            ? "Akun diblokir"
                            : country === "zh"
                              ? "账户封禁"
                              : "Account ban",
                  country === "ko"
                    ? "계정 밴 관련 문의는 이메일 traveltofindlife@gmail.com 로 문의 주세요"
                    : country === "ja"
                      ? "アカウントの禁止に関するお問い合わせは、メール traveltofindlife@gmail.com にご連絡ください"
                      : country === "es"
                        ? "Para consultas sobre la suspensión de la cuenta, envíe un correo a traveltofindlife@gmail.com"
                        : country === "fr"
                          ? "Pour toute question concernant le bannissement du compte, veuillez contacter traveltofindlife@gmail.com par email"
                          : country === "id"
                            ? "Untuk pertanyaan tentang pemblokiran akun, silakan hubungi email traveltofindlife@gmail.com"
                            : country === "zh"
                              ? "关于账户封禁的咨询，请发送电子邮件至 traveltofindlife@gmail.com"
                              : "For account ban inquiries, please contact traveltofindlife@gmail.com via email",
                );
              } else {
                try {
                  const currentUser = await GoogleSignin.getCurrentUser();
                  if (currentUser) {
                    await GoogleSignin.signOut();
                    console.log('로그아웃 성공');
                  }
                } catch (error) {
                  console.error('로그아웃 에러:', error);
                }
                if (res.data.dupEmail) {
                  Alert.alert(
                    country === "ko"
                      ? `기존 계정이 있습니다.`
                      : country === "ja"
                        ? `既存のアカウントがあります。`
                        : country === "es"
                          ? `Ya tiene una cuenta existente.`
                          : country === "fr"
                            ? `Vous avez déjà un compte existant.`
                            : country === "id"
                              ? `Anda sudah memiliki akun yang ada.`
                              : country === "zh"
                                ? `您已经有现有帐户。`
                                : `You already have an existing account.`,
                    country === "ko"
                      ? `해당 이메일로 로그인해주세요`
                      : country === "ja"
                        ? `そのメールアドレスでログインしてください`
                        : country === "es"
                          ? `Por favor, inicie sesión con ese correo electrónico`
                          : country === "fr"
                            ? `Veuillez vous connecter avec cette adresse e-mail`
                            : country === "id"
                              ? `Silakan masuk dengan email tersebut`
                              : country === "zh"
                                ? `请使用该电子邮件登录`
                                : `Please log in with that email`,
                  );
                } else {
                  navigation.navigate("Info", {
                    email,
                    sns,
                    snsId,
                  });
                }
              }
            });
          isLoadingRef.current = false;
        }
      } else {
        isLoadingRef.current = false;
      }
    } catch (err) {
      try {
        const currentUser = await GoogleSignin.getCurrentUser();
        if (currentUser) {
          await GoogleSignin.signOut();
          console.log('로그아웃 성공');
        }
      } catch (error) {
        console.error('로그아웃 에러:', error);
      }
      console.error(err);
    }
  };
  async function onAppleButtonPress() {
    try {
      // performs login request
      const appleAuthRequestResponse: any = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // Note: it appears putting FULL_NAME first is important, see issue #293
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );
      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        if (isLoadingRef.current) return;
        isLoadingRef.current = true;

        const identityToken = appleAuthRequestResponse.identityToken;
        const decoded: any = jwtDecode(identityToken);
        const email = decoded.email;
        const sns = "apple";
        //Sns 로그인시 계정 한번 체크 -> 있다면 a. 진행하여 로그인 진행
        const snsId = decoded.sub;
        await axios
          .post(`${serverURL}/user/snsUserCheck`, {
            email,
            sns,
            snsId,
          })
          .then(async res => {
            if (res.data.status === "true") {
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
              const point = res.data?.point;
              updateUser(user);
              updatePoint(point);
              navigation.navigate("Live");
            } else if (res.data.status === "ban") {
              Alert.alert(
                country === "ko"
                  ? "계정 밴"
                  : country === "ja"
                    ? "アカウント禁止"
                    : country === "es"
                      ? "Cuenta suspendida"
                      : country === "fr"
                        ? "Compte banni"
                        : country === "id"
                          ? "Akun diblokir"
                          : country === "zh"
                            ? "账户封禁"
                            : "Account ban",
                country === "ko"
                  ? "계정 밴 관련 문의는 이메일 traveltofindlife@gmail.com 로 문의 주세요"
                  : country === "ja"
                    ? "アカウントの禁止に関するお問い合わせは、メール traveltofindlife@gmail.com にご連絡ください"
                    : country === "es"
                      ? "Para consultas sobre la suspensión de la cuenta, envíe un correo a traveltofindlife@gmail.com"
                      : country === "fr"
                        ? "Pour toute question concernant le bannissement du compte, veuillez contacter traveltofindlife@gmail.com par email"
                        : country === "id"
                          ? "Untuk pertanyaan tentang pemblokiran akun, silakan hubungi email traveltofindlife@gmail.com"
                          : country === "zh"
                            ? "关于账户封禁的咨询，请发送电子邮件至 traveltofindlife@gmail.com"
                            : "For account ban inquiries, please contact traveltofindlife@gmail.com via email",
              );
            } else {
              if (res.data.dupEmail) {
                Alert.alert(
                  country === "ko"
                    ? `기존 계정이 있습니다.`
                    : country === "ja"
                      ? `既存のアカウントがあります。`
                      : country === "es"
                        ? `Ya tiene una cuenta existente.`
                        : country === "fr"
                          ? `Vous avez déjà un compte existant.`
                          : country === "id"
                            ? `Anda sudah memiliki akun yang ada.`
                            : country === "zh"
                              ? `您已经有现有帐户。`
                              : `You already have an existing account.`,
                  country === "ko"
                    ? `해당 이메일로 로그인해주세요`
                    : country === "ja"
                      ? `そのメールアドレスでログインしてください`
                      : country === "es"
                        ? `Por favor, inicie sesión con ese correo electrónico`
                        : country === "fr"
                          ? `Veuillez vous connecter avec cette adresse e-mail`
                          : country === "id"
                            ? `Silakan masuk dengan email tersebut`
                            : country === "zh"
                              ? `请使用该电子邮件登录`
                              : `Please log in with that email`,
                );
              } else {
                navigation.navigate("Info", {
                  email,
                  sns,
                  snsId,
                });
              }
            }
          });
        isLoadingRef.current = false;
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={[]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={"dark-content"}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              backgroundColor: PALETTE.COLOR_MAIN,
            }}>
            <View
              style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                height: vh(40),
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}>
              <View
                style={{
                  flexDirection: "column",
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <Image
                  source={require("../../assets/auth/iconW.png")}
                  style={{
                    width: 120,
                    height: 120,
                    marginRight: 10,
                  }}></Image>
                <Text
                  style={{
                    fontSize: 35,
                    fontWeight: "bold",
                    color: PALETTE.COLOR_BROWN,
                  }}>
                  VIDEO IT
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 13,
                  color: PALETTE.COLOR_WHITE,
                }}>
                {country === "ko"
                  ? `너 그리고 나와 함께하는 순간`
                  : country === "ja"
                    ? `あなたと私と一緒に過ごす瞬間`
                    : country === "es"
                      ? `El momento en que estamos juntos`
                      : country === "fr"
                        ? `Le moment où nous sommes ensemble`
                        : country === "id"
                          ? `Saat kamu dan aku bersama`
                          : country === "zh"
                            ? `你和我在一起的时刻`
                            : `The moment when we are together`}
              </Text>
            </View>
            <View
              style={{
                height: vh(40),
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                paddingLeft: vw(10),
                paddingRight: vw(10),
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  borderRadius: 8,
                  backgroundColor: PALETTE.COLOR_WHITE,
                  padding: 10,
                  height: vh(8),
                  maxHeight: 50,
                  marginBottom: vh(1),
                }}
                onPress={onPressGoogleBtn}>
                <Image
                  source={require("../../assets/auth/google.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
                <Text
                  style={{
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `구글로 시작하기`
                    : country === "ja"
                      ? `Googleで始める`
                      : country === "es"
                        ? `Comenzar con Google`
                        : country === "fr"
                          ? `Commencer avec Google`
                          : country === "id"
                            ? `Mulai dengan Google`
                            : country === "zh"
                              ? `以Google开始`
                              : `Start with Google`}
                </Text>

                <View></View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  borderRadius: 8,
                  backgroundColor: PALETTE.COLOR_WHITE,
                  padding: 10,
                  height: vh(8),
                  maxHeight: 50,
                  marginBottom: vh(1),
                }}
                onPress={() => onAppleButtonPress()}>
                <Image
                  source={require("../../assets/auth/apple.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
                <Text
                  style={{
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `애플로 시작하기`
                    : country === "ja"
                      ? `Appleで始める`
                      : country === "es"
                        ? `Comenzar con Apple`
                        : country === "fr"
                          ? `Commencer avec Apple`
                          : country === "id"
                            ? `Mulai dengan Apple`
                            : country === "zh"
                              ? `以Apple开始`
                              : `Start with Apple`}
                </Text>
                <View></View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  borderRadius: 8,
                  backgroundColor: PALETTE.COLOR_WHITE,
                  padding: 10,
                  height: vh(8),
                  maxHeight: 50,
                  marginBottom: vh(1),
                }}
                onPress={() => {
                  navigation.navigate("PhoneLogin");
                }}>
                <Image
                  source={require("../../assets/auth/phone.png")}
                  style={{
                    width: 25,
                    height: 25,
                  }}></Image>
                <Text
                  style={{
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `전화번호로 시작하기`
                    : country === "ja"
                      ? `電話番号で始める`
                      : country === "es"
                        ? `Comenzar con el número de teléfono`
                        : country === "fr"
                          ? `Commencer avec le numéro de téléphone`
                          : country === "id"
                            ? `Mulai dengan nomor telepon`
                            : country === "zh"
                              ? `以电话号码开始`
                              : `Start with phone number`}
                </Text>
                <View></View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  borderRadius: 8,
                  backgroundColor: PALETTE.COLOR_WHITE,
                  padding: 10,
                  height: vh(8),
                  maxHeight: 50,
                  marginBottom: vh(1),
                }}
                onPress={() => {
                  navigation.navigate("EmailLogin");
                }}>
                <Image
                  source={require("../../assets/auth/email.png")}
                  style={{
                    width: 25,
                    height: 25,
                  }}></Image>
                <Text
                  style={{
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `이메일로 시작하기`
                    : country === "ja"
                      ? `メールアドレスで始める`
                      : country === "es"
                        ? `Comenzar con correo electrónico`
                        : country === "fr"
                          ? `Commencer avec un e-mail`
                          : country === "id"
                            ? `Mulai dengan email`
                            : country === "zh"
                              ? `以电子邮件开始`
                              : `Start with email`}
                </Text>
                <View></View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: vh(20),
                justifyContent: "flex-start",
                alignContent: "center",
                alignItems: "center",
              }}>
              <View
                style={{
                  flexDirection: "column",
                  alignContent: "center",
                  alignItems: "center",
                  marginBottom: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Privacy");
                  }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: PALETTE.COLOR_BLACK,
                    }}>
                    {country === "ko"
                      ? `개인정보 처리방침`
                      : country === "ja"
                        ? `プライバシーポリシー`
                        : country === "es"
                          ? `Política de privacidad`
                          : country === "fr"
                            ? `Politique de confidentialité`
                            : country === "id"
                              ? `Kebijakan privasi`
                              : country === "zh"
                                ? `隐私政策`
                                : `Privacy policy`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Tou");
                  }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: PALETTE.COLOR_BLACK,
                    }}>
                    {country === "ko"
                      ? `이용약관`
                      : country === "ja"
                        ? `利用規約`
                        : country === "es"
                          ? `Términos de uso`
                          : country === "fr"
                            ? `Conditions d'utilisation`
                            : country === "id"
                              ? `Syarat penggunaan`
                              : country === "zh"
                                ? `使用条款`
                                : `Terms of use`}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: PALETTE.COLOR_GRAY,
                  fontSize: 11,
                }}>
                {country === "ko"
                  ? `회원가입시 nmoment의 개인정보 처리방침과`
                  : country === "ja"
                    ? `nmomentの個人情報処理ポリシーと登録時に`
                    : country === "es"
                      ? `Política de privacidad y condiciones de registro de nmoment`
                      : country === "fr"
                        ? `Politique de confidentialité et conditions d'inscription de nmoment`
                        : country === "id"
                          ? `Kebijakan privasi nmoment dan syarat pendaftaran`
                          : country === "zh"
                            ? `nmoment的隐私政策和注册条款`
                            : `nmoment's privacy policy and registration terms`}
              </Text>
              <Text
                style={{
                  color: PALETTE.COLOR_GRAY,
                  fontSize: 11,
                }}>
                {country === "ko"
                  ? `이용약관에 동의하는걸로 간주합니다.`
                  : country === "ja"
                    ? `利用規約に同意するものとみなします。`
                    : country === "es"
                      ? `Se considera que usted acepta los Términos de uso.`
                      : country === "fr"
                        ? `Vous êtes réputé accepter les conditions d’utilisation.`
                        : country === "id"
                          ? `Anda dianggap menyetujui Ketentuan Penggunaan.`
                          : country === "zh"
                            ? `您将被视为同意使用条款。`
                            : `You are deemed to agree to the Terms of Use.`}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </NotchView>
  );
}
