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
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { vw, vh, vmin, vmax } from "react-native-css-vh-vw";
import CheckBox from "@react-native-community/checkbox";
import LinearGradient from "react-native-linear-gradient";
import Video from "react-native-video";
//import {LinearTextGradient} from "react-native-text-gradient";
import SplashScreen from "react-native-splash-screen";
import SelectDropdown from "react-native-select-dropdown";
import Share from "react-native-share";
import FastImage from "react-native-fast-image";
import Clipboard from "@react-native-clipboard/clipboard";
import api from "../../lib/api/api";
import { PALETTE } from "../../lib/constant/palette";
import serverURL from "../../lib/constant/serverURL";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
import { useDispatch } from "react-redux";
//import { CRYPTO_SECRET } from "@env";
import CryptoJS from "crypto-js";
import Loading from "../reusable/loading";
import { COUNTRY_LIST } from "../../lib/constant/country-constant";
import analytics from "@react-native-firebase/analytics";

const ageList = () => {
  const age: any = [];
  for (let i = 20; i <= 100; i++) {
    age.push(i.toString());
  }
  return age;
};

export default function Info({
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

   const CRYPTO_SECRET = "vifsadfaedo21if13tw31312112faf";
  console.log("CRYPTO_SECRET exists:", !!CRYPTO_SECRET);
  
  const insets = useSafeAreaInsets();

  const ageData = ageList();
  const [nick, setNick] = useState("");
  const [age, setAge] = useState(20);
  const [profile, setProfile] = useState(
    "https://d5w3s87s233gw.cloudfront.net/boy.png",
  );
  const [urlFormData, setUrlFormData] = useState(null);
  const [gender, setGender] = useState(0); //1 여자 2 남자
  const [password, setPassword] = useState(
    route.params?.password ? route.params?.password : "",
  );
  const [email, setEmail] = useState(route.params?.email);
  const [emailCode, setEmailCode] = useState("");
  const [emailStep, setEmailStep] = useState(1);
  const [emailResult, setEmailResult] = useState(false);
  const [phone, setPhone] = useState(route.params?.phone);
  const [sns, setSns] = useState(route.params?.sns);
  const [snsId, setSnsId] = useState(route.params?.snsId);
  // const [code, setCode] = useState("");

  const [passwordShow, setPasswordShow] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const [adultChk, setAdultChk]: any = useState(false);

  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["top"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={"dark-content"}
      />
      {loading === true && <Loading></Loading>}
      <KeyboardAwareScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}>
        <ScrollView
          style={{
            flex: 1,
            paddingLeft: vw(4),
            paddingRight: vw(4),
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
                  fontWeight: "500",
                  fontSize: 18,
                  color: "black",
                }}>
                {country === "ko"
                  ? `회원정보 입력`
                  : country === "ja"
                    ? `会員情報入力`
                    : country === "es"
                      ? `Ingresar información del miembro`
                      : country === "fr"
                        ? `Saisie des informations du membre`
                        : country === "id"
                          ? `Masukkan informasi anggota`
                          : country === "zh"
                            ? `输入会员信息`
                            : `Enter member information`}
              </Text>
            </View>
            <View
              style={{
                width: 30,
                height: 30,
              }}></View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
            }}>
            <View>
              {/*
              <View
                style={{
                  height: vh(12),
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <TouchableOpacity
                  onPress={async e => {
                    const result: any = await launchImageLibrary({
                      mediaType: "photo", //'mixed',
                      maxHeight: 400,
                      quality: 0.3,
                    });
                    if (result.didCancel === true) return;
                    //setLoadingState(true);
                    setProfile(result.assets[0].uri);
                    const formData: any = new FormData();
                    formData.append("file", {
                      uri: result.assets[0].uri,
                      name: result.assets[0].uri,
                      type: result.assets[0].type,
                    });
                    setUrlFormData(formData);
                  }}>
                  <Image
                    source={{
                      uri: profile,
                    }}
                    style={{
                      borderRadius: 100,
                      height: vh(10),
                      width: vh(10),
                    }}></Image>
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderRadius: 100,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      width: vh(4),
                      height: vh(4),
                      position: "absolute",
                    }}>
                    <Image
                      source={require("../../assets/setting/add.png")}
                      style={{
                        width: vh(2.5),
                        height: vh(2.5),
                      }}></Image>
                  </View>
                </TouchableOpacity>
              </View>
              */}

              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 16,
                  marginTop: vh(2),
                  marginBottom: vh(2),
                }}>
                {country === "ko"
                  ? `닉네임`
                  : country === "ja"
                    ? `ニックネーム`
                    : country === "es"
                      ? `Apodo`
                      : country === "fr"
                        ? `Pseudo`
                        : country === "id"
                          ? `Nama panggilan`
                          : country === "zh"
                            ? `昵称`
                            : `Nickname`}
              </Text>
              <TextInput
                style={{
                  paddingTop: vh(1),
                  paddingBottom: vh(1),
                  borderBottomColor: PALETTE.COLOR_BORDER,
                  borderBottomWidth: 1,
                  color: "black",
                }}
                placeholderTextColor={"#c0c0c0"}
                placeholder="홍길동"
                value={nick}
                onChangeText={e => {
                  setNick(e);
                }}></TextInput>

              {!sns && (
                <>
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginTop: vh(2),
                      marginBottom: vh(2),
                    }}>
                    {country === "ko"
                      ? `이메일`
                      : country === "ja"
                        ? `メールアドレス`
                        : country === "es"
                          ? `Correo electrónico`
                          : country === "fr"
                            ? `Adresse e-mail`
                            : country === "id"
                              ? `Surel`
                              : country === "zh"
                                ? `电子邮件`
                                : `Email`}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      paddingBottom: vh(1),
                      borderBottomColor: PALETTE.COLOR_BORDER,
                      borderBottomWidth: 1,
                      justifyContent: "space-between",
                    }}>
                    <TextInput
                      style={{
                        color: "black",
                        width: "70%",
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
                      }
                      value={email}
                      onChangeText={e => {
                        setEmail(e);
                        setEmailResult(false);
                      }}></TextInput>

                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        backgroundColor: PALETTE.COLOR_BROWN,
                        padding: 10,
                      }}
                      onPress={async () => {
                        await axios
                          .post(`${serverURL}/etc/emailVerification`, {
                            country,
                            email,
                          })
                          .then(res => {
                            if (res.data.status === "true") {
                              setEmailStep(2);
                            } else {
                              Alert.alert(
                                country === "ko"
                                  ? "이미 가입되어 있는 이메일 입니다."
                                  : country === "ja"
                                    ? "すでに登録されているメールアドレスです"
                                    : country === "es"
                                      ? "El correo electrónico ya está registrado"
                                      : country === "fr"
                                        ? "L'adresse e-mail est déjà enregistrée"
                                        : country === "id"
                                          ? "Email sudah terdaftar"
                                          : country === "zh"
                                            ? "该邮箱已注册"
                                            : "The email is already registered",
                              );
                            }
                          });
                      }}>
                      <Text
                        style={{
                          color: "white",
                        }}>
                        {country === "ko"
                          ? `인증`
                          : country === "ja"
                            ? `認証`
                            : country === "es"
                              ? `Autenticación`
                              : country === "fr"
                                ? `Authentification`
                                : country === "id"
                                  ? `Otentikasi`
                                  : country === "zh"
                                    ? `认证`
                                    : `Authentication`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              {!sns && emailStep === 2 && (
                <>
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginTop: vh(2),
                      marginBottom: vh(2),
                    }}>
                    {country === "ko"
                      ? `인증번호`
                      : country === "ja"
                        ? `認証番号`
                        : country === "es"
                          ? `Código de autenticación`
                          : country === "fr"
                            ? `Code d'authentification`
                            : country === "id"
                              ? `Kode otentikasi`
                              : country === "zh"
                                ? `验证号码`
                                : `Authentication code`}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      paddingBottom: vh(1),
                      borderBottomColor: PALETTE.COLOR_BORDER,
                      borderBottomWidth: 1,
                      justifyContent: "space-between",
                    }}>
                    <TextInput
                      style={{
                        color: "black",
                        width: "80%",
                        height: "100%",
                      }}
                      placeholderTextColor={"#c0c0c0"}
                      placeholder={
                        country === "ko"
                          ? `인증코드를 입력하세요`
                          : country === "ja"
                            ? `認証コードを入力してください`
                            : country === "es"
                              ? `Por favor, introduzca el código de autenticación`
                              : country === "fr"
                                ? `Veuillez entrer le code d'authentification`
                                : country === "id"
                                  ? `Silakan masukkan kode otentikasi`
                                  : country === "zh"
                                    ? `请输入验证代码`
                                    : `Please enter the authentication code`
                      }
                      value={emailCode}
                      onChangeText={e => {
                        setEmailCode(e);
                      }}></TextInput>

                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        backgroundColor: PALETTE.COLOR_NAVY,
                        padding: 10,
                      }}
                      onPress={async () => {
                        //setEmailStep(2);
                        await axios
                          .post(`${serverURL}/etc/emailCodeCheck`, {
                            code: emailCode,
                            email,
                          })
                          .then(res => {
                            if (res.data.status === "true") {
                              setEmailStep(1);
                              setEmailResult(true);
                              Alert.alert(
                                country === "ko"
                                  ? `인증 되었습니다.`
                                  : country === "ja"
                                    ? `認証が完了しました。`
                                    : country === "es"
                                      ? `Autenticación exitosa.`
                                      : country === "fr"
                                        ? `Authentification réussie.`
                                        : country === "id"
                                          ? `Autentikasi berhasil.`
                                          : country === "zh"
                                            ? `认证成功。`
                                            : `Authentication successful.`,
                              );
                            } else {
                              Alert.alert(
                                country === "ko"
                                  ? `인증코드가 다릅니다.`
                                  : country === "ja"
                                    ? `認証コードが異なります。`
                                    : country === "es"
                                      ? `El código de autenticación es incorrecto.`
                                      : country === "fr"
                                        ? `Le code d'authentification est incorrect.`
                                        : country === "id"
                                          ? `Kode otentikasi berbeda.`
                                          : country === "zh"
                                            ? `验证码错误。`
                                            : `Authentication code is incorrect.`,
                              );
                            }
                          });
                      }}>
                      <Text
                        style={{
                          color: "white",
                        }}>
                        {country === "ko"
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
                                    : `Confirm`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              {!sns && (
                <>
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginTop: vh(2),
                      marginBottom: vh(2),
                    }}>
                    {country === "ko"
                      ? `비밀번호`
                      : country === "ja"
                        ? `パスワード`
                        : country === "es"
                          ? `Contraseña`
                          : country === "fr"
                            ? `Mot de passe`
                            : country === "id"
                              ? `Kata sandi`
                              : country === "zh"
                                ? `密码`
                                : `Password`}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      paddingBottom: vh(1),
                      borderBottomColor: PALETTE.COLOR_BORDER,
                      borderBottomWidth: 1,
                      justifyContent: "space-between",
                    }}>
                    <TextInput
                      style={{
                        color: "black",
                        width: "80%",
                        height: "100%",
                      }}
                      secureTextEntry={passwordShow}
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
                      }
                      value={password}
                      onChangeText={e => {
                        setPassword(e);
                      }}></TextInput>

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
                        source={
                          passwordShow === false
                            ? require("../../assets/auth/eyeOn.png")
                            : require("../../assets/auth/eyeOff.png")
                        }
                        style={{
                          width: 20,
                          height: 20,
                        }}></Image>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              {/*
              <Text
                style={{
                  color: "#838383",
                  fontWeight: "bold",
                  fontSize: 16,
                  marginTop: vh(2),
                  marginBottom: vh(2),
                }}>
                {country === "ko"
                  ? "추천인 코드 (선택사항)"
                  : country === "ja"
                  ? "紹介コード（任意）"
                  : country === "es"
                  ? "Código de referencia (opcional)"
                  : country === "fr"
                  ? "Code de parrainage (optionnel)"
                  : country === "id"
                  ? "Kode referensi (opsional)"
                  : country === "zh"
                  ? "推荐码（可选）"
                  : "Referral code (optional)"}
              </Text>
              <View
                style={{
                  width: "50%",
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  paddingBottom: vh(1),
                  borderBottomColor: PALETTE.COLOR_BORDER,
                  borderBottomWidth: 1,
                  justifyContent: "space-between",
                }}>
                <TextInput
                  style={{
                    width: "100%",
                    height: "100%",
                    color: "black",
                  }}
                  placeholder={
                    country === "ko"
                      ? "추천인 코드를 입력하세요."
                      : country === "ja"
                      ? "紹介コードを入力してください"
                      : country === "es"
                      ? "Ingrese el código de referencia"
                      : country === "fr"
                      ? "Veuillez entrer le code de parrainage"
                      : country === "id"
                      ? "Masukkan kode referensi"
                      : country === "zh"
                      ? "请输入推荐码"
                      : "Please enter the referral code"
                  }
                  value={code}
                  maxLength={20}
                  onChangeText={e => {
                    setCode(e);
                  }}></TextInput>
              </View>
              */}
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 16,
                  marginTop: vh(2),
                  marginBottom: vh(2),
                }}>
                {country === "ko"
                  ? `나이`
                  : country === "ja"
                    ? `年齢`
                    : country === "es"
                      ? `Edad`
                      : country === "fr"
                        ? `Âge`
                        : country === "id"
                          ? `Usia`
                          : country === "zh"
                            ? `年龄`
                            : `Age`}
              </Text>
              <SelectDropdown
                defaultButtonText={age.toString()}
                buttonStyle={{
                  borderRadius: 10,
                  width: 70,
                  height: 40,
                  backgroundColor: PALETTE.COLOR_BACK,
                }}
                dropdownStyle={{
                  borderRadius: 10,
                }}
                rowStyle={{
                  backgroundColor: PALETTE.COLOR_WHITE,
                  borderWidth: 0,
                }}
                rowTextStyle={{
                  fontSize: 12,
                }}
                buttonTextStyle={{
                  fontSize: 12,
                  backgroundColor: PALETTE.COLOR_BACK,
                }}
                renderDropdownIcon={() => (
                  <Text
                    style={{
                      color: "black",
                      fontSize: 12,
                    }}>
                    ▼
                  </Text>
                )}
                data={ageData}
                onSelect={(selectedItem, index) => {
                  setAge(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item;
                }}
              />
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 16,
                  marginTop: vh(2),
                  marginBottom: vh(2),
                }}>
                {country === "ko"
                  ? `성별`
                  : country === "ja"
                    ? `性別`
                    : country === "es"
                      ? `Género`
                      : country === "fr"
                        ? `Sexe`
                        : country === "id"
                          ? `Jenis kelamin`
                          : country === "zh"
                            ? `性别`
                            : `Gender`}
              </Text>
              <SelectDropdown
                defaultButtonText={
                  country === "ko"
                    ? `성별`
                    : country === "ja"
                      ? `性別`
                      : country === "es"
                        ? `Género`
                        : country === "fr"
                          ? `Sexe`
                          : country === "id"
                            ? `Jenis kelamin`
                            : country === "zh"
                              ? `性别`
                              : `Gender`
                }
                buttonStyle={{
                  borderRadius: 10,
                  width: 70,
                  height: 40,
                  backgroundColor: PALETTE.COLOR_BACK,
                }}
                dropdownStyle={{
                  borderRadius: 10,
                }}
                rowStyle={{
                  backgroundColor: PALETTE.COLOR_WHITE,
                  borderWidth: 0,
                }}
                rowTextStyle={{
                  fontSize: 12,
                }}
                buttonTextStyle={{
                  fontSize: 12,
                  backgroundColor: PALETTE.COLOR_BACK,
                }}
                renderDropdownIcon={() => (
                  <Text
                    style={{
                      color: "black",
                      fontSize: 12,
                    }}>
                    ▼
                  </Text>
                )}
                data={[
                  country === "ko"
                    ? `여자`
                    : country === "ja"
                      ? `女性`
                      : country === "es"
                        ? `Mujer`
                        : country === "fr"
                          ? `Femme`
                          : country === "id"
                            ? `Wanita`
                            : country === "zh"
                              ? `女性`
                              : `Female`,
                  country === "ko"
                    ? `남자`
                    : country === "ja"
                      ? `男性`
                      : country === "es"
                        ? `Hombre`
                        : country === "fr"
                          ? `Homme`
                          : country === "id"
                            ? `Pria`
                            : country === "zh"
                              ? `男性`
                              : `Male`,
                ]}
                onSelect={(selectedItem, index) => {
                  if (Number(index) === 1) {
                    setGender(2);
                    setProfile("https://d5w3s87s233gw.cloudfront.net/boy.png");
                  } else if (Number(index) === 0) {
                    setProfile("https://d5w3s87s233gw.cloudfront.net/girl.png");
                    setGender(1);
                  }
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item;
                }}
              />
              {country !== COUNTRY_LIST.한국 && (
                <View
                  style={{
                    marginTop: vh(2),
                    marginBottom: vh(2),
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      color: "black",
                    }}>
                    {country === "ko"
                      ? "당신은 만18세 이상입니까?"
                      : country === "ja"
                        ? "あなたは18歳以上ですか？"
                        : country === "es"
                          ? "¿Tienes más de 18 años?"
                          : country === "fr"
                            ? "Avez-vous plus de 18 ans ?"
                            : country === "id"
                              ? "Apakah Anda berusia di atas 18 tahun?"
                              : country === "zh"
                                ? "您是否已满18岁？"
                                : "Are you over 18?"}
                  </Text>
                  <CheckBox
                    tintColors={{
                      true: PALETTE.COLOR_RED,
                    }}
                    onTintColor={PALETTE.COLOR_RED}
                    onCheckColor={PALETTE.COLOR_RED}
                    style={{
                      marginLeft: 10,
                      width: 25,
                      height: 25,
                    }}
                    value={adultChk}
                    boxType="square"
                    onValueChange={(newValue: any) => {
                      setAdultChk(!adultChk);
                    }}></CheckBox>
                </View>
              )}
            </View>
          </View>
          <View
            style={{
              marginTop: vh(4),
              marginBottom: vh(6),
            }}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                borderRadius: 8,
                backgroundColor: PALETTE.COLOR_BROWN,
                height: vh(6),
                minHeight: 50,
              }}
              onPress={async () => {
                if (country !== COUNTRY_LIST.한국 && !adultChk) {
                  Alert.alert(
                    country === "ko"
                      ? `입력 부족`
                      : country === "ja"
                        ? `入力不足`
                        : country === "es"
                          ? `Falta de información`
                          : country === "fr"
                            ? `Données manquantes`
                            : country === "id"
                              ? `Data kurang lengkap`
                              : country === "zh"
                                ? `输入不足`
                                : `Insufficient input`,
                    country === "ko"
                      ? "만18세 이상만 가입 가능합니다."
                      : country === "ja"
                        ? "18歳以上のみ登録可能です。"
                        : country === "es"
                          ? "Solo pueden registrarse los mayores de 18 años."
                          : country === "fr"
                            ? "Seules les personnes de plus de 18 ans peuvent s'inscrire."
                            : country === "id"
                              ? "Hanya yang berusia di atas 18 tahun yang dapat mendaftar."
                              : country === "zh"
                                ? "仅限18岁以上的用户注册。"
                                : "Only those 18 and older can register.",
                  );
                  return;
                }
                if (!gender) {
                  Alert.alert(
                    country === "ko"
                      ? `입력 부족`
                      : country === "ja"
                        ? `入力不足`
                        : country === "es"
                          ? `Falta de información`
                          : country === "fr"
                            ? `Données manquantes`
                            : country === "id"
                              ? `Data kurang lengkap`
                              : country === "zh"
                                ? `输入不足`
                                : `Insufficient input`,
                    country === "ko"
                      ? `성별을 선택해주세요`
                      : country === "ja"
                        ? `性別を選択してください`
                        : country === "es"
                          ? `Por favor, elija su género`
                          : country === "fr"
                            ? `Veuillez sélectionner votre sexe`
                            : country === "id"
                              ? `Silakan pilih jenis kelamin Anda`
                              : country === "zh"
                                ? `请选择您的性别`
                                : `Please select your gender`,
                  );

                  return;
                } else if (!age) {
                  Alert.alert(
                    country === "ko"
                      ? `입력 부족`
                      : country === "ja"
                        ? `入力不足`
                        : country === "es"
                          ? `Falta de información`
                          : country === "fr"
                            ? `Données manquantes`
                            : country === "id"
                              ? `Data kurang lengkap`
                              : country === "zh"
                                ? `输入不足`
                                : `Insufficient input`,
                    country === "ko"
                      ? `나이를 선택해주세요`
                      : country === "ja"
                        ? `年齢を選択してください`
                        : country === "es"
                          ? `Por favor, elija su edad`
                          : country === "fr"
                            ? `Veuillez sélectionner votre âge`
                            : country === "id"
                              ? `Silakan pilih usia Anda`
                              : country === "zh"
                                ? `请选择您的年龄`
                                : `Please select your age`,
                  );

                  return;
                } else if (!nick) {
                  Alert.alert(
                    country === "ko"
                      ? `입력 부족`
                      : country === "ja"
                        ? `入力不足`
                        : country === "es"
                          ? `Falta de información`
                          : country === "fr"
                            ? `Données manquantes`
                            : country === "id"
                              ? `Data kurang lengkap`
                              : country === "zh"
                                ? `输入不足`
                                : `Insufficient input`,
                    country === "ko"
                      ? `이름을 입력해주세요`
                      : country === "ja"
                        ? `名前を入力してください`
                        : country === "es"
                          ? `Por favor, introduzca su nombre`
                          : country === "fr"
                            ? `Veuillez entrer votre nom`
                            : country === "id"
                              ? `Silakan masukkan nama Anda`
                              : country === "zh"
                                ? `请输入您的姓名`
                                : `Please enter your name`,
                  );

                  return;
                } else if (!sns && !password) {
                  Alert.alert(
                    country === "ko"
                      ? `입력 부족`
                      : country === "ja"
                        ? `入力不足`
                        : country === "es"
                          ? `Falta de información`
                          : country === "fr"
                            ? `Données manquantes`
                            : country === "id"
                              ? `Data kurang lengkap`
                              : country === "zh"
                                ? `输入不足`
                                : `Insufficient input`,
                    country === "ko"
                      ? `비밀번호를 입력해주세요`
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
                                : `Please enter your password`,
                  );

                  return;
                } else if (!sns && !email) {
                  Alert.alert(
                    country === "ko"
                      ? `입력 부족`
                      : country === "ja"
                        ? `入力不足`
                        : country === "es"
                          ? `Falta de información`
                          : country === "fr"
                            ? `Données manquantes`
                            : country === "id"
                              ? `Data kurang lengkap`
                              : country === "zh"
                                ? `输入不足`
                                : `Insufficient input`,
                    country === "ko"
                      ? `이메일을 입력해주세요`
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
                                : `Please enter your email`,
                  );

                  return;
                } else if (!sns && !emailResult) {
                  Alert.alert(
                    country === "ko"
                      ? `입력 부족`
                      : country === "ja"
                        ? `入力不足`
                        : country === "es"
                          ? `Falta de información`
                          : country === "fr"
                            ? `Données manquantes`
                            : country === "id"
                              ? `Data kurang lengkap`
                              : country === "zh"
                                ? `输入不足`
                                : `Insufficient input`,
                    country === "ko"
                      ? `이메일 인증을 해주세요`
                      : country === "ja"
                        ? `メールアドレスを認証してください`
                        : country === "es"
                          ? `Por favor, verifique su correo electrónico`
                          : country === "fr"
                            ? `Veuillez confirmer votre adresse e-mail`
                            : country === "id"
                              ? `Silakan verifikasi email Anda`
                              : country === "zh"
                                ? `请验证您的电子邮件`
                                : `Please verify your email`,
                  );

                  return;
                }

                if (country === "ko") {
                  //다날 본인인증 해야함 -> 폰만 추가해서 보내는걸로
                  //but 전화번호 검사시 만약 있는 계정이라면 그걸로 줘야함
                  navigation.navigate("Certification", {
                    email,
                    sns,
                    snsId,
                    age,
                    password,
                    gender,
                    nick,
                    // code,
                  });
                } else {
                  if (isLoadingRef.current) return;
                  isLoadingRef.current = true;

                  setLoading(true);
                  let profileURL: any = profile;
                  /*
                  if (urlFormData) {
                    await axios
                      .post(`${serverURL}/etc/addimg`, urlFormData, {
                        headers: {"Content-Type": "multipart/form-data"},
                      })
                      .then(async res => {
                        profileURL = res.data.url;
                      });
                  }
                      */
                  //바로 가입처리하면됨

                  const adCode: any = await AsyncStorage.getItem("adCode");
                  const cnv_id: any = await AsyncStorage.getItem("cnv_id");
                  const code = await AsyncStorage.getItem("code");
                  await axios
                    .post(`${serverURL}/user/joinLocal`, {
                      phone: null,
                      email,
                      sns,
                      snsId,
                      age,
                      password,
                      gender,
                      nick,
                      profile: profileURL,
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
                          const bytes = CryptoJS.AES.decrypt(
                            password,
                            CRYPTO_SECRET,
                          );
                          const alpha = bytes.toString(CryptoJS.enc.Utf8);
                          await EncryptedStorage.setItem(
                            "accessToken",
                            accessToken,
                          );
                          await EncryptedStorage.setItem(
                            "refreshToken",
                            refreshToken,
                          );
                          await EncryptedStorage.setItem(
                            "sns",
                            String(user?.sns),
                          );
                          await EncryptedStorage.setItem(
                            "snsId",
                            String(user?.snsId),
                          );
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
                        if (res.data.dupPhone) {
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
                              ? `해당 번호로 로그인해주세요`
                              : country === "ja"
                                ? `該当の番号でログインしてください`
                                : country === "es"
                                  ? `Por favor, inicie sesión con ese número`
                                  : country === "fr"
                                    ? `Veuillez vous connecter avec ce numéro`
                                    : country === "id"
                                      ? `Silakan masuk dengan nomor tersebut`
                                      : country === "zh"
                                        ? `请使用该号码登录`
                                        : `Please log in with that number`,
                          );
                        } else if (res.data.dupEmail) {
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
                        //오류 발생
                      }
                    });
                  isLoadingRef.current = false;
                  setLoading(false);
                }
              }}>
              <Text
                style={{
                  color: PALETTE.COLOR_WHITE,
                  fontSize: 15,
                }}>
                {country === "ko"
                  ? `시작하기`
                  : country === "ja"
                    ? `始める`
                    : country === "es"
                      ? `Comenzar`
                      : country === "fr"
                        ? `Commencer`
                        : country === "id"
                          ? `Mulai`
                          : country === "zh"
                            ? `开始`
                            : `Start`}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </NotchView>
  );
}
