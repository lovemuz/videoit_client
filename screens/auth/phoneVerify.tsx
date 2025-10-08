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
import {CRYPTO_SECRET} from "@env";
import CryptoJS from "crypto-js";

export default function PhoneVerify({
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

  const [step, setStep] = useState(1);

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [failCount, setFailCount] = useState(0);

  const [email, setEmail] = useState(route.params?.email);
  const [sns, setSns] = useState(route.params?.sns);
  const [snsId, setSnsId] = useState(route.params?.snsId);

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
                    if (step === 1) {
                      //navigation.replace("Setting");
                      navigation.goBack();
                    } else if (step === 2) {
                      setStep(1);
                    }
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
                    본인인증
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
                justifyContent: "space-between",
                flex: 1,
                paddingBottom: vh(2),
              }}>
              <View>
                {step === 1 && (
                  <Text
                    style={{
                      color: "black",
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: vh(2),
                    }}>
                    핸드폰 번호를 입력하세요
                  </Text>
                )}
                {step === 2 && (
                  <View
                    style={{
                      marginBottom: vh(2),
                    }}>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: vh(1),
                      }}>
                      인증번호를 입력하세요
                    </Text>
                    <Text
                      style={{
                        color: "#838383",
                      }}>
                      {phone}로 인증문자를 보냈습니다.
                    </Text>
                  </View>
                )}
                {step === 1 ? (
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
                      marginBottom: vh(4),
                    }}>
                    <TextInput
                      style={{
                        color: "black",
                        height: "100%",
                        width: "80%",
                      }}
                      value={phone}
                      onChangeText={e => {
                        setPhone(
                          e.toString().replace(/-/g, "").replace(/ /g, ""),
                        );
                      }}
                      placeholder="전화번호를 입력하세요."></TextInput>
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        backgroundColor: PALETTE.COLOR_BORDER,
                        padding: 5,
                        borderRadius: 100,
                      }}>
                      <Image
                        source={require("../../assets/auth/closeW.png")}
                        style={{
                          width: 10,
                          height: 10,
                        }}></Image>
                    </TouchableOpacity>
                  </View>
                ) : (
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
                      marginBottom: vh(4),
                    }}>
                    <TextInput
                      value={code}
                      onChangeText={e => {
                        setCode(e.replace(/ /g, ""));
                      }}
                      style={{
                        color: "black",
                        height: "100%",
                        width: "80%",
                      }}
                      placeholder="인증번호를 입력하세요"></TextInput>
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        backgroundColor: PALETTE.COLOR_BORDER,
                        padding: 5,
                        borderRadius: 100,
                      }}>
                      <Image
                        source={require("../../assets/auth/closeW.png")}
                        style={{
                          width: 10,
                          height: 10,
                        }}></Image>
                    </TouchableOpacity>
                  </View>
                )}

                {step === 2 && (
                  <TouchableOpacity
                    style={{
                      paddingBottom: vh(2),
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                    onPress={async () => {
                      await axios
                        .post(`${serverURL}/etc/phoneVerify`, {
                          phone,
                          sns,
                          snsId,
                        })
                        .then(res => {
                          if (res.data.status === "true") {
                            Alert.alert(
                              "재전송 되었습니다.",
                              "최대 1분안으로 재전송 됩니다.",
                            );
                          } else {
                            //존재하는 계정
                            Alert.alert(
                              "중복 계정",
                              "이미 존재하는 계정입니다. 로그인 혹은 비밀번호 찾기로 진행해주세요.",
                            );
                          }
                        });
                    }}>
                    <Text
                      style={{
                        color: "#20202f",
                        fontWeight: "bold",
                      }}>
                      재전송
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: "#20202f", //"#d0d0df",
                  height: vh(5.5),
                  minHeight: 50,
                  borderRadius: 50,
                }}
                onPress={async () => {
                  if (step === 1) {
                    await axios
                      .post(`${serverURL}/etc/phoneVerify`, {
                        phone,
                        sns,
                        snsId,
                      })
                      .then(res => {
                        if (res.data.status === "true") {
                          setStep(2);
                        } else {
                          //존재하는 계정
                          Alert.alert(
                            "중복 계정",
                            "이미 존재하는 계정입니다. 로그인 혹은 비밀번호 찾기로 진행해주세요.",
                          );
                        }
                      });
                  } else if (step === 2) {
                    //만약 sns, snsId 가 있으면 검사후
                    //phone계정이 이미 존재한다면 로그인 처리해야함

                    await axios
                      .post(`${serverURL}/etc/phoneCodeCheck`, {
                        phone,
                        code,
                      })
                      .then(async res => {
                        if (res.data.status === "true") {
                          if (sns && snsId) {
                            await axios
                              .post(`${serverURL}/user/socialUserAdd`, {
                                phone,
                                email,
                                sns,
                                snsId,
                              })
                              .then(async res => {
                                if (res.data.status === "true") {
                                  const accessToken: any = res.data.accessToken;
                                  const refreshToken: any =
                                    res.data.refreshToken;
                                  const password: any = res.data.alpha;
                                  const user: any = res.data.user;
                                  const bytes = CryptoJS.AES.decrypt(
                                    password,
                                    CRYPTO_SECRET,
                                  );
                                  const alpha = bytes.toString(
                                    CryptoJS.enc.Utf8,
                                  );
                                  await EncryptedStorage.setItem(
                                    "accessToken",
                                    accessToken,
                                  );
                                  await EncryptedStorage.setItem(
                                    "refreshToken",
                                    refreshToken,
                                  );
                                  await EncryptedStorage.setItem(
                                    "password",
                                    alpha,
                                  );
                                  if (email) {
                                    await EncryptedStorage.setItem(
                                      "email",
                                      email,
                                    );
                                  }
                                  if (phone) {
                                    await EncryptedStorage.setItem(
                                      "phone",
                                      phone,
                                    );
                                  }
                                  updateUser(user);
                                  navigation.navigate("Live");
                                  return;
                                } else {
                                  navigation.navigate("Info", {
                                    phone,
                                    email,
                                    sns,
                                    snsId,
                                  });
                                }
                              });
                          } else {
                            navigation.navigate("Info", {
                              phone,
                              email,
                              sns,
                              snsId,
                            });
                          }
                        } else if (res.data.status === "expire") {
                          //존재하는 계정
                          Alert.alert(
                            `인증 만료`,
                            "인증번호 유효시간이 만료되었습니다.",
                          );
                          setFailCount(failCount + 1);
                        } else if (res.data.status === "false") {
                          //존재하는 계정
                          Alert.alert(
                            `인증실패 ${failCount + 1}회`,
                            "인증번호가 틀립니다. 5회이상 실패시 5분간 인증 제한됩니다.",
                          );
                          setFailCount(failCount + 1);
                        }
                        setCode("");
                      });
                  }
                }}>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                  }}>
                  {step === 1 ? "인증하기" : "확인"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </NotchView>
  );
}
