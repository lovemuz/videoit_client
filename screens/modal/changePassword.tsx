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
import EncryptedStorage from "react-native-encrypted-storage";

export default function ChangePassword({
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

  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

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
                {country === "ko"
                  ? `비밀번호 변경`
                  : country === "ja"
                  ? `パスワード変更`
                  : country === "es"
                  ? `Cambiar la contraseña`
                  : country === "fr"
                  ? `Changer le mot de passe`
                  : country === "id"
                  ? `Ganti kata sandi`
                  : country === "zh"
                  ? `更改密码`
                  : `Change Password`}
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
            //justifyContent: "space-between",
          }}>
          <Text
            style={{
              marginBottom: vh(2),
              color: "black",
            }}>
            {country === "ko"
              ? `새로운 비밀번호`
              : country === "ja"
              ? `新しいパスワード`
              : country === "es"
              ? `Nueva contraseña`
              : country === "fr"
              ? `Nouveau mot de passe`
              : country === "id"
              ? `Kata sandi baru`
              : country === "zh"
              ? `新密码`
              : `New password`}
          </Text>
          <TextInput
            style={{
              width: "100%",
              height: 45,
              backgroundColor: PALETTE.COLOR_BACK,
              borderRadius: 10,
              marginBottom: vh(2),
            }}
            value={newPassword1}
            onChangeText={e => {
              setNewPassword1(e);
            }}></TextInput>
          <Text
            style={{
              marginBottom: vh(2),
              color: "black",
            }}>
            {country === "ko"
              ? `비밀번호 확인`
              : country === "ja"
              ? `パスワード確認`
              : country === "es"
              ? `Verificar contraseña`
              : country === "fr"
              ? `vérifier le mot de passe`
              : country === "id"
              ? `verifikasi kata sandi`
              : country === "zh"
              ? `验证密码`
              : `verify password`}
          </Text>
          <TextInput
            style={{
              width: "100%",
              height: 45,
              backgroundColor: PALETTE.COLOR_BACK,
              borderRadius: 10,
              marginBottom: vh(8),
            }}
            value={newPassword2}
            onChangeText={e => {
              setNewPassword2(e);
            }}></TextInput>

          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              width: "100%",
              height: 45,
              backgroundColor: PALETTE.COLOR_NAVY,
              borderRadius: 10,
            }}
            onPress={async () => {
              if (newPassword1 !== newPassword2) {
                Alert.alert(
                  country === "ko"
                    ? `새로운 비밀번호가 일치하지 않습니다.`
                    : country === "ja"
                    ? `新しいパスワードが一致しません。`
                    : country === "es"
                    ? `La nueva contraseña no coincide.`
                    : country === "fr"
                    ? `Le nouveau mot de passe ne correspond pas.`
                    : country === "id"
                    ? `Kata sandi baru tidak cocok.`
                    : country === "zh"
                    ? `新密码不匹配。`
                    : `New password does not match.`,
                );
                return;
              }
              await api
                .post("/user/changePassword", {
                  password: newPassword1,
                })
                .then(async res => {
                  if (res.data.status === "true") {
                    await EncryptedStorage.setItem("password", newPassword1);
                    Alert.alert(
                      country === "ko"
                        ? `변경 되었습니다.`
                        : country === "ja"
                        ? `変更されました。`
                        : country === "es"
                        ? `Ha cambiado.`
                        : country === "fr"
                        ? `Cela a changé.`
                        : country === "id"
                        ? `Itu telah berubah.`
                        : country === "zh"
                        ? `它已经改变了。`
                        : `It has changed.`,
                    );
                  }
                });
            }}>
            <Text
              style={{
                color: "white",
              }}>
              {country === "ko"
                ? `변경하기`
                : country === "ja"
                ? `変更する`
                : country === "es"
                ? `cambiar`
                : country === "fr"
                ? `changement`
                : country === "id"
                ? `mengubah`
                : country === "zh"
                ? `改变`
                : `change`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </NotchView>
  );
}
