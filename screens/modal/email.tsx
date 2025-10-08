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
import {ToastComponent} from "../reusable/useToast";

export default function Email({
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
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const insets = useSafeAreaInsets();
  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["bottom"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={Platform.OS === "ios" ? "light-content" : "dark-content"}
      />
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            marginTop: Platform.OS === "ios" ? vh(2) : insets.top,
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
                flex: 1,
                alignItems: "flex-start",
                justifyContent: "center",
                alignContent: "center",
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
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontWeight: "400",
                  fontSize: 15,
                  color: "black",
                }}>
                이메일 연동
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "flex-end",
              }}></View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            paddingLeft: vw(4),
            paddingTop: vh(2),
            paddingRight: vw(4),
            justifyContent: "space-between",
          }}>
          {step === 1 ? (
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}>
                이메일
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: PALETTE.COLOR_BLACK,
                  marginTop: vh(2),
                  marginBottom: vh(2),
                  justifyContent: "space-between",
                  paddingBottom: vh(0.5),
                }}>
                {user.email ? (
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 20,
                      }}>
                      {user?.email}
                    </Text>
                  </View>
                ) : (
                  <TextInput
                    value={email}
                    onChangeText={e => {
                      setEmail(e);
                    }}
                    placeholder="user@email.com"
                    style={{
                      flex: 1,
                      fontSize: 20,
                      color: "black",
                    }}></TextInput>
                )}

                {!user.email && (
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      backgroundColor: "#d3d3d3",
                      borderRadius: 100,
                      width: 22,
                      height: 22,
                    }}
                    onPress={() => {
                      setEmail("");
                    }}>
                    <Image
                      source={require("../../assets/live/closeW.png")}
                      style={{
                        width: 15,
                        height: 15,
                      }}></Image>
                  </TouchableOpacity>
                )}
              </View>

              <Text
                style={{
                  fontSize: 12,
                  color: "#838383",
                }}>
                이메일을 인증하면 어느 기기에서든 로그인 가능하며 계정을
                유지할수 있습니다.
              </Text>
            </View>
          ) : (
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}>
                인증코드
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: PALETTE.COLOR_BLACK,
                  marginTop: vh(2),
                  marginBottom: vh(2),
                  justifyContent: "space-between",
                  paddingBottom: vh(0.5),
                }}>
                <TextInput
                  keyboardType="number-pad"
                  value={code}
                  onChangeText={e => {
                    setCode(e);
                  }}
                  placeholder=""
                  style={{
                    flex: 1,
                    fontSize: 20,
                    color: "black",
                  }}></TextInput>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    backgroundColor: "#d3d3d3",
                    borderRadius: 100,
                    width: 22,
                    height: 22,
                  }}
                  onPress={() => {
                    setCode("");
                  }}>
                  <Image
                    source={require("../../assets/live/closeW.png")}
                    style={{
                      width: 15,
                      height: 15,
                    }}></Image>
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  fontSize: 12,
                  color: "#838383",
                }}>
                {email} 로 인증번호 6자리를 보냈습니다.
              </Text>
            </View>
          )}

          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}>
            {!user.email && (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  marginBottom: vh(2),
                  width: "100%",
                  backgroundColor: PALETTE.COLOR_NAVY,
                  borderRadius: 50,
                  height: vh(6.5),
                }}
                onPress={async () => {
                  if (step === 1) {
                    await api
                      .post("/etc/emailVerification", {
                        email,
                        country,
                      })
                      .then(res => {
                        if (res.data.status === "true") {
                          setStep(2);
                        }
                      });
                  } else if (step === 2) {
                    await api
                      .post("/etc/emailUpdateByCodeCheck", {
                        email,
                        code,
                      })
                      .then(res => {
                        if (res.data.status === "true") {
                          Alert.alert("인증 되었습니다!");
                          updateUser({
                            ...user,
                            email,
                          });
                          navigation.goBack();
                        }
                      });
                    setStep(1);
                  }
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "white",
                  }}>
                  {step === 1 ? "인증코드 받기" : "인증 하기"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </NotchView>
  );
}
