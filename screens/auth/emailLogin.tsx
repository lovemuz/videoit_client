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

export default function EmailLogin({
  FCMToken,
  country,
  navigation,
  route,
  chatPlus,
  setChatPlus,
  appState,
  user,
  updateUser,
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
  user: any;
  updateUser: any;
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
  navigation?: any;
  route?: any;
  appState?: any;
}): JSX.Element {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(true);

  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["top", "bottom"]}>
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
            }}>
            <View
              style={{
                paddingLeft: vw(4),
                paddingRight: vw(4),
                backgroundColor: PALETTE.COLOR_WHITE,
              }}>
              <View
                style={{
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  height: vh(6),
                }}>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    //navigation.replace("Setting");
                    navigation.goBack();
                  }}>
                  <Image
                    source={require("../../assets/setting/back.png")}
                    style={{
                      width: 30,
                      height: 30,
                    }}></Image>
                </TouchableOpacity>
                <View>
                  <Text
                    style={{
                      color: "black",
                      //fontWeight: "bold",
                      fontWeight: "400",
                      fontSize: 18,
                    }}>
                    {country === "ko"
                      ? `이메일 로그인`
                      : country === "ja"
                      ? `メールログイン`
                      : country === "es"
                      ? `iniciar sesión por correo electrónico`
                      : country === "fr"
                      ? `connexion par e-mail`
                      : country === "id"
                      ? `masuk email`
                      : country === "zh"
                      ? `电子邮件登录`
                      : `email login`}
                  </Text>
                </View>
                <View
                  style={{
                    width: 30,
                    height: 30,
                  }}></View>
              </View>
            </View>
            <View
              style={{
                marginTop: vh(2),
                paddingLeft: vw(4),
                paddingRight: vw(4),
              }}>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: PALETTE.COLOR_BORDER,
                  height: 50,
                  paddingLeft: vw(2),
                  paddingRight: vw(2),
                  borderRadius: 10,
                  justifyContent: "space-between",
                  marginBottom: vh(1),
                }}>
                <TextInput
                  value={email}
                  onChangeText={e => {
                    setEmail(e.toString());
                  }}
                  style={{
                    color: "black",
                    width: "80%",
                    height: "100%",
                  }}
                  placeholderTextColor={"#c0c0c0"}
                  placeholder={
                    country === "ko"
                      ? `이메일을 입력하세요`
                      : country === "ja"
                      ? `メールアドレスを入力してください`
                      : country === "es"
                      ? `Por favor, introduzca su correo electrónico`
                      : country === "fr"
                      ? `Veuillez entrer votre adresse e-mail`
                      : country === "id"
                      ? `Silakan masukkan email Anda`
                      : country === "zh"
                      ? `请输入您的电子邮件`
                      : `Please enter your email`
                  }></TextInput>

                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    backgroundColor: PALETTE.COLOR_BORDER,
                    padding: 5,
                    borderRadius: 100,
                  }}
                  onPress={() => {
                    setEmail("");
                  }}>
                  <Image
                    source={require("../../assets/auth/closeW.png")}
                    style={{
                      width: 10,
                      height: 10,
                    }}></Image>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: PALETTE.COLOR_BORDER,
                  height: 50,
                  paddingLeft: vw(2),
                  paddingRight: vw(2),
                  borderRadius: 10,
                  justifyContent: "space-between",
                  marginBottom: vh(1),
                }}>
                <TextInput
                  secureTextEntry={passwordShow}
                  value={password}
                  onChangeText={e => {
                    setPassword(e);
                  }}
                  style={{
                    color: "black",
                    width: "80%",
                    height: "100%",
                  }}
                  placeholderTextColor={"#c0c0c0"}
                  placeholder={
                    country === "ko"
                      ? `비밀번호를 입력하세요`
                      : country === "ja"
                      ? `パスワードを入力してください`
                      : country === "es"
                      ? `Por favor, introduzca su contraseña`
                      : country === "fr"
                      ? `Veuillez entrer votre mot de passe`
                      : country === "id"
                      ? `Silakan masukkan kata sandi Anda`
                      : country === "zh"
                      ? `请输入您的密码`
                      : `Please enter your password`
                  }></TextInput>

                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    //backgroundColor: PALETTE.COLOR_BORDER,
                    padding: 5,
                    borderRadius: 100,
                  }}
                  onPress={() => {
                    setPasswordShow(!passwordShow);
                  }}>
                  <Image
                    source={require("../../assets/auth/eyeOff.png")}
                    style={{
                      width: 20,
                      height: 20,
                    }}></Image>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "flex-end",
                  marginTop: vh(1),
                  marginBottom: vh(3),
                }}>
                <TouchableOpacity
                  style={{
                    paddingBottom: vh(2),
                  }}
                  onPress={() => {
                    navigation.navigate("FindPassword");
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#838383",
                      fontWeight: "400",
                    }}>
                    {country === "ko"
                      ? `비밀번호를 잊으셨나요?`
                      : country === "ja"
                      ? `パスワードをお忘れですか？`
                      : country === "es"
                      ? `¿Olvidaste tu contraseña?`
                      : country === "fr"
                      ? `Mot de passe oublié ?`
                      : country === "id"
                      ? `Lupa kata sandi Anda?`
                      : country === "zh"
                      ? `忘记密码？`
                      : `Forgot your password?`}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={
                  password && email
                    ? {
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        backgroundColor: PALETTE.COLOR_BROWN,
                        height: vh(5.5),
                        minHeight: 50,
                        borderRadius: 8,
                      }
                    : {
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        backgroundColor: "#d0d0df",
                        height: vh(5.5),
                        minHeight: 50,
                        borderRadius: 8,
                      }
                }
                onPress={async () => {
                  await axios
                    .post(`${serverURL}/user/loginLocal/v2`, {
                      email,
                      password,
                      sns: null,
                      snsId: null,
                    })
                    .then(async res => {
                      if (res.data.status === "true") {
                        const accessToken: any = res.data.accessToken;
                        const refreshToken: any = res.data.refreshToken;
                        const user: any = res.data.user;
                        await EncryptedStorage.setItem(
                          "accessToken",
                          accessToken,
                        );
                        await EncryptedStorage.setItem(
                          "refreshToken",
                          refreshToken,
                        );
                        await EncryptedStorage.setItem("password", password);
                        await EncryptedStorage.setItem("email", email);
                        await EncryptedStorage.setItem(
                          "sns",
                          String(user?.sns),
                        );
                        await EncryptedStorage.setItem(
                          "snsId",
                          String(user?.snsId),
                        );
                        const phone = await EncryptedStorage.getItem("phone");
                        if (phone) await EncryptedStorage.removeItem("phone");
                        const point = res.data.point;
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
                            ? `아이디 혹은 비밀번호가 다릅니다.`
                            : country === "ja"
                            ? `ユーザーIDまたはパスワードが異なります。`
                            : country === "es"
                            ? `El nombre de usuario o la contraseña son incorrectos.`
                            : country === "fr"
                            ? `Nom d'utilisateur ou mot de passe incorrect.`
                            : country === "id"
                            ? `Nama pengguna atau kata sandi salah.`
                            : country === "zh"
                            ? `用户名或密码不正确。`
                            : `Username or password is incorrect.`,
                        );
                      }
                    });
                }}>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                  }}>
                  {country === "ko"
                    ? `로그인`
                    : country === "ja"
                    ? `ログイン`
                    : country === "es"
                    ? `Iniciar sesión`
                    : country === "fr"
                    ? `Se connecter`
                    : country === "id"
                    ? `Masuk`
                    : country === "zh"
                    ? `登录`
                    : `Sign in`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  marginTop: vh(4),
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingBottom: vh(2),
                }}
                onPress={() => {
                  navigation.navigate("Info");
                }}>
                <Text
                  style={{
                    color: "black",
                    fontSize: 15,
                    marginRight: 10,
                  }}>
                  {country === "ko"
                    ? `아직 계정이 없으신가요?`
                    : country === "ja"
                    ? `まだアカウントをお持ちでないですか？`
                    : country === "es"
                    ? `¿Aún no tienes una cuenta?`
                    : country === "fr"
                    ? `Vous n'avez pas encore de compte ?`
                    : country === "id"
                    ? `Belum punya akun?`
                    : country === "zh"
                    ? `您还没有帐户吗？`
                    : `Don't have an account yet?`}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#F7A409",
                  }}>
                  {country === "ko"
                    ? `회원가입`
                    : country === "ja"
                    ? `新規登録`
                    : country === "es"
                    ? `Registro`
                    : country === "fr"
                    ? `S'inscrire`
                    : country === "id"
                    ? `Daftar`
                    : country === "zh"
                    ? `注册`
                    : `Sign Up`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </NotchView>
  );
}
