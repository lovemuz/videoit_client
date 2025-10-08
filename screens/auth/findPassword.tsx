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

export default function FindPassword({
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

  const [findMethod, setFindMethod] = useState("email"); //phone,email

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [emailStep, setEmailStep] = useState(1);
  const [phoneStep, setPhoneStep] = useState(1);
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");

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
                      ? `비밀번호 찾기`
                      : country === "ja"
                      ? `パスワードを忘れました`
                      : country === "es"
                      ? `¿Olvidaste tu contraseña?`
                      : country === "fr"
                      ? `Mot de passe oublié ?`
                      : country === "id"
                      ? `Lupa kata sandi?`
                      : country === "zh"
                      ? `忘记密码？`
                      : `Forgot your password?`}
                  </Text>
                </View>
                <View
                  style={{
                    width: 30,
                    height: 30,
                  }}></View>
              </View>
            </View>
            {
              findMethod === "email" && (
                <View
                  style={{
                    marginTop: vh(2),
                    paddingLeft: vw(4),
                    paddingRight: vw(4),
                  }}>
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: 20,
                      marginBottom: 5,
                    }}>
                    {emailStep === 1
                      ? country === "ko"
                        ? `이메일을 입력해주세요.`
                        : country === "ja"
                        ? `メールアドレスを入力してください。`
                        : country === "es"
                        ? `Por favor, introduzca su correo electrónico.`
                        : country === "fr"
                        ? `Veuillez entrer votre adresse e-mail.`
                        : country === "id"
                        ? `Silakan masukkan email Anda.`
                        : country === "zh"
                        ? `请输入您的电子邮件。`
                        : `Please enter your email.`
                      : country === "ko"
                      ? `인증코드를 입력해주세요.`
                      : country === "ja"
                      ? `認証コードを入力してください。`
                      : country === "es"
                      ? `Introduzca el código de verificación.`
                      : country === "fr"
                      ? `Veuillez entrer le code de vérification.`
                      : country === "id"
                      ? `Silakan masukkan kode verifikasi.`
                      : country === "zh"
                      ? `请输入验证码。`
                      : `Please enter the verification code.`}
                  </Text>
                  <Text
                    style={{
                      color: "black",
                      marginBottom: 10,
                    }}>
                    {country === "ko"
                      ? `연동된 이메일로 새로운 임시 비밀번호를 전달드립니다.`
                      : country === "ja"
                      ? `登録されたメールアドレスに新しい仮パスワードをお送りします。`
                      : country === "es"
                      ? `Enviaremos una nueva contraseña temporal a su correo electrónico registrado.`
                      : country === "fr"
                      ? `Nous vous enverrons un nouveau mot de passe temporaire à l'adresse e-mail associée.`
                      : country === "id"
                      ? `Kami akan mengirimkan kata sandi sementara baru ke email yang terdaftar.`
                      : country === "zh"
                      ? `我们将向关联的电子邮件发送新的临时密码。`
                      : `We will send a new temporary password to the associated email.`}
                  </Text>
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
                      marginBottom: vh(2),
                    }}>
                    {emailStep === 1 ? (
                      <TextInput
                        value={email}
                        onChangeText={e => {
                          setEmail(e);
                        }}
                        style={{
                          color: "black",
                          width: "80%",
                          height: "100%",
                        }}
                        placeholder={
                          country === "ko"
                            ? `이메일을 입력하세요.`
                            : country === "ja"
                            ? `メールアドレスを入力してください。`
                            : country === "es"
                            ? `Por favor, introduzca su correo electrónico.`
                            : country === "fr"
                            ? `Veuillez entrer votre adresse e-mail.`
                            : country === "id"
                            ? `Silakan masukkan email Anda.`
                            : country === "zh"
                            ? `请输入您的电子邮件。`
                            : `Please enter your email.`
                        }></TextInput>
                    ) : (
                      <TextInput
                        value={emailCode}
                        onChangeText={e => {
                          setEmailCode(e);
                        }}
                        style={{
                          color: "black",
                          width: "80%",
                          height: "100%",
                        }}
                        placeholder={
                          country === "ko"
                            ? `인증코드를 입력하세요.`
                            : country === "ja"
                            ? `認証コードを入力してください。`
                            : country === "es"
                            ? `Introduzca el código de verificación.`
                            : country === "fr"
                            ? `Veuillez entrer le code de vérification.`
                            : country === "id"
                            ? `Silakan masukkan kode verifikasi.`
                            : country === "zh"
                            ? `请输入验证码。`
                            : `Please enter the verification code.`
                        }></TextInput>
                    )}
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
                  {/*country === "ko" && (
                    <TouchableOpacity
                      style={{
                        paddingBottom: vh(2),
                        marginBottom: vh(2),
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                      }}
                      onPress={() => {
                        setFindMethod("phone");
                      }}>
                      <Text
                        style={{
                          color: PALETTE.COLOR_NAVY,
                        }}>
                        전화번호로 비밀번호 찾기
                        {country === "ko"
                          ? ``
                          : country === "ja"
                          ? ``
                          : country === "es"
                          ? ``
                          : country === "fr"
                          ? ``
                          : country === "id"
                          ? ``
                          : country === "zh"
                          ? ``
                          : ``}
                      </Text>
                    </TouchableOpacity>
                      )*/}

                  <TouchableOpacity
                    style={
                      email
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
                      if (emailStep === 1) {
                        await axios
                          .post(`${serverURL}/etc/passwordEmailVerification`, {
                            country,
                            email,
                          })
                          .then(res => {
                            if (res.data.status === "true") {
                              setEmailStep(2);
                            } else {
                              Alert.alert(
                                country === "ko"
                                  ? "SNS 로그인으로 가입한 계정 혹은 없는 계정 입니다."
                                  : country === "ja"
                                  ? "SNSログインで登録されたアカウント、または存在しないアカウントです。"
                                  : country === "es"
                                  ? "Cuenta registrada con inicio de sesión SNS o cuenta inexistente."
                                  : country === "fr"
                                  ? "Compte enregistré via une connexion SNS ou compte inexistant."
                                  : country === "id"
                                  ? "Akun yang terdaftar dengan login SNS atau akun tidak ada."
                                  : country === "zh"
                                  ? "通过SNS登录注册的账户或不存在的账户。"
                                  : "An account registered via SNS login or a non-existent account.",
                              );
                            }
                          });
                      } else if (emailStep === 2) {
                        await axios
                          .post(
                            `${serverURL}/etc/emailCodeCheckAndUpdatePassword`,
                            {
                              email,
                              code: emailCode,
                            },
                          )
                          .then(res => {
                            if (res.data.status === "true") {
                              Alert.alert(
                                country === "ko"
                                  ? `메일로 새로운 비밀번호를 전달하였습니다.`
                                  : country === "ja"
                                  ? `新しいパスワードをメールでお送りしました。`
                                  : country === "es"
                                  ? `Hemos enviado una nueva contraseña por correo electrónico.`
                                  : country === "fr"
                                  ? `Nous avons envoyé un nouveau mot de passe par e-mail.`
                                  : country === "id"
                                  ? `Kami telah mengirimkan kata sandi baru melalui email.`
                                  : country === "zh"
                                  ? `我们已通过电子邮件发送了新密码。`
                                  : `We have sent a new password via email.`,
                              );

                              navigation.goBack();
                            } else {
                              Alert.alert(
                                country === "ko"
                                  ? `인증 오류`
                                  : country === "ja"
                                  ? `認証エラー`
                                  : country === "es"
                                  ? `Error de autenticación`
                                  : country === "fr"
                                  ? `Erreur d'authentification`
                                  : country === "id"
                                  ? `Kesalahan autentikasi`
                                  : country === "zh"
                                  ? `验证错误`
                                  : `Authentication error`,
                                country === "ko"
                                  ? `인증코드가 다릅니다.`
                                  : country === "ja"
                                  ? `認証コードが異なります。`
                                  : country === "es"
                                  ? `El código de verificación es incorrecto.`
                                  : country === "fr"
                                  ? `Le code de vérification est incorrect.`
                                  : country === "id"
                                  ? `Kode verifikasi berbeda.`
                                  : country === "zh"
                                  ? `验证码错误。`
                                  : `Verification code is incorrect.`,
                              );
                            }
                          });
                      }
                    }}>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                      }}>
                      {emailStep === 1
                        ? country === "ko"
                          ? `보내기`
                          : country === "ja"
                          ? `送信`
                          : country === "es"
                          ? `Enviar`
                          : country === "fr"
                          ? `Envoyer`
                          : country === "id"
                          ? `Kirim`
                          : country === "zh"
                          ? `发送`
                          : `Send`
                        : country === "ko"
                        ? `인증하기`
                        : country === "ja"
                        ? `認証する`
                        : country === "es"
                        ? `Autenticar`
                        : country === "fr"
                        ? `Authentifier`
                        : country === "id"
                        ? `Autentikasi`
                        : country === "zh"
                        ? `认证`
                        : `Authenticate`}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) /* : (
              <View
                style={{
                  marginTop: vh(2),
                  paddingLeft: vw(4),
                  paddingRight: vw(4),
                }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    marginBottom: 5,
                  }}>
                  {emailStep === 1
                    ? "핸드폰 번호를 입력해주세요."
                    : "인증코드를 입력해주세요."}
                  {country === "ko"
                    ? ``
                    : country === "ja"
                    ? ``
                    : country === "es"
                    ? ``
                    : country === "fr"
                    ? ``
                    : country === "id"
                    ? ``
                    : country === "zh"
                    ? ``
                    : ``}
                </Text>
                <Text
                  style={{
                    marginBottom: 10,
                  }}>
                  연동된 번호로 새로운 임시 비밀번호를 전달드립니다.
                  {country === "ko"
                    ? ``
                    : country === "ja"
                    ? ``
                    : country === "es"
                    ? ``
                    : country === "fr"
                    ? ``
                    : country === "id"
                    ? ``
                    : country === "zh"
                    ? ``
                    : ``}
                </Text>
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
                    marginBottom: vh(2),
                  }}>
                  {phoneStep === 1 ? (
                    <TextInput
                      value={phone}
                      onChangeText={e => {
                        setPhone(
                          e.toString().replace(/ /g, "").replace(/-/g, ""),
                        );
                      }}
                      style={{
                        height: "100%",
                      }}
                      placeholder="핸드폰번호를 입력하세요"></TextInput>
                  ) : (
                    <TextInput
                      value={phoneCode}
                      onChangeText={e => {
                        setPhoneCode(e);
                      }}
                      style={{
                        width: "80%",
                        height: "100%",
                      }}
                      placeholder="인증코드를 입력하세요"></TextInput>
                  )}
                  {country === "ko"
                    ? ``
                    : country === "ja"
                    ? ``
                    : country === "es"
                    ? ``
                    : country === "fr"
                    ? ``
                    : country === "id"
                    ? ``
                    : country === "zh"
                    ? ``
                    : ``}
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      backgroundColor: PALETTE.COLOR_BORDER,
                      padding: 5,
                      borderRadius: 100,
                    }}
                    onPress={() => setPhone("")}>
                    <Image
                      source={require("../../assets/auth/closeW.png")}
                      style={{
                        width: 10,
                        height: 10,
                      }}></Image>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{
                    paddingBottom: vh(2),
                    marginBottom: vh(2),
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                  onPress={() => {
                    if (findMethod === "phone") {
                      setFindMethod("email");
                    } else if (findMethod === "email") {
                      setFindMethod("phone");
                    }
                  }}>
                  <Text
                    style={{
                      color: PALETTE.COLOR_NAVY,
                    }}>
                    이메일로 비밀번호 찾기
                    {country === "ko"
                      ? ``
                      : country === "ja"
                      ? ``
                      : country === "es"
                      ? ``
                      : country === "fr"
                      ? ``
                      : country === "id"
                      ? ``
                      : country === "zh"
                      ? ``
                      : ``}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    phone
                      ? {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          backgroundColor: PALETTE.COLOR_NAVY,
                          height: vh(5.5),
                          minHeight: 50,
                          borderRadius: 50,
                        }
                      : {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          backgroundColor: "#d0d0df",
                          height: vh(5.5),
                          minHeight: 50,
                          borderRadius: 50,
                        }
                  }
                  onPress={async () => {
                    if (phoneStep === 1) {
                      setPhoneStep(2);
                      await axios.post(`${serverURL}/etc/phoneVerification`, {
                        country,
                        phone,
                      });
                    } else if (phoneStep === 2) {
                      await axios
                        .post(
                          `${serverURL}/etc/phoneCodeCheckAndUpdatePassword`,
                          {
                            phone,
                            code: phoneCode,
                          },
                        )
                        .then(res => {
                          if (res.data.status === "true") {
                            Alert.alert(
                              "핸드폰으로 새로운 비밀번호를 전달하였습니다.",
                            );
                            {
                              country === "ko"
                                ? ``
                                : country === "ja"
                                ? ``
                                : country === "es"
                                ? ``
                                : country === "fr"
                                ? ``
                                : country === "id"
                                ? ``
                                : country === "zh"
                                ? ``
                                : ``;
                            }
                            navigation.goBack();
                          } else {
                            {
                              country === "ko"
                                ? ``
                                : country === "ja"
                                ? ``
                                : country === "es"
                                ? ``
                                : country === "fr"
                                ? ``
                                : country === "id"
                                ? ``
                                : country === "zh"
                                ? ``
                                : ``;
                            }
                            Alert.alert("인증 오류", "인증코드가 다릅니다.");
                          }
                        });
                    }
                  }}>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                    }}>
                    {phoneStep === 1 ? "보내기" : "인증하기"}
                    {country === "ko"
                      ? ``
                      : country === "ja"
                      ? ``
                      : country === "es"
                      ? ``
                      : country === "fr"
                      ? ``
                      : country === "id"
                      ? ``
                      : country === "zh"
                      ? ``
                      : ``}
                  </Text>
                </TouchableOpacity>
              </View>
                  )*/
            }
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </NotchView>
  );
}
