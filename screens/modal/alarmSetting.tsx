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
  Switch,
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

export default function AlarmSetting({
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
  const [news, setNews] = useState(true);
  const [comment, setComment] = useState(true);
  const [call, setCall] = useState(true);
  const [gift, setGift] = useState(true);
  const [chat, setChat] = useState(true);
  const [post2, setPost] = useState(true);
  const [follow, setFollow] = useState(true);
  const [creatorPush, setCreatorPush] = useState(true);
  const [backgroundApnsOn, setBackgroundApnsOn] = useState(
    user?.backgroundApnsOn,
  );
  const [soundOn, setSoundOn] = useState(user?.soundOn);

  useEffect(() => {
    async function fetchData() {
      try {
        await api.get("/alarm/getMyAlarmSetting").then(res => {
          const alarmSetting = res.data.alarmSetting;
          setNews(alarmSetting?.news);
          setComment(alarmSetting?.comment);
          setCall(alarmSetting?.call);
          setGift(alarmSetting?.gift);
          setChat(alarmSetting?.chat);
          setPost(alarmSetting?.post);
          setFollow(alarmSetting?.follow);
          setCreatorPush(alarmSetting.creatorPush);
        });
      } catch (err) {}
    }
    fetchData();
  }, []);
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
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                //navigation.replace("Setting");
                navigation.navigate("Setting");
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
                  //fontWeight: "bold",
                  fontWeight: "400",
                  fontSize: 18,
                  color: "black",
                }}>
                {country === "ko"
                  ? "알림 설정"
                  : country === "ja"
                  ? "通知設定"
                  : country === "es"
                  ? "Configuración de notificaciones"
                  : country === "fr"
                  ? "Paramètres de notification"
                  : country === "id"
                  ? "Pengaturan pemberitahuan"
                  : country === "zh"
                  ? "通知设置"
                  : "Notification settings"}
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
            paddingLeft: vw(4),
            paddingRight: vw(4),
            marginTop: vh(2),
          }}>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: vh(2),
            }}>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 16,
                color: "black",
              }}>
              {country === "ko"
                ? "크리에이터 추천"
                : country === "ja"
                ? "クリエイターの推薦"
                : country === "es"
                ? "Recomendación de creadores"
                : country === "fr"
                ? "Recommandation de créateurs"
                : country === "id"
                ? "Rekomendasi kreator"
                : country === "zh"
                ? "创作者推荐"
                : "Creator Recommendation"}
            </Text>
            <Switch
              trackColor={{false: "#a4a4a4", true: PALETTE.COLOR_NAVY}}
              thumbColor={creatorPush ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#a4a4a4"
              onValueChange={async () => {
                await api.post("/alarm/updateAlarmSetting/v3", {
                  news,
                  comment,
                  call,
                  gift,
                  post: post2,
                  chat,
                  follow,
                  creatorPush: !creatorPush,
                });
                setCreatorPush(!creatorPush);
              }}
              value={creatorPush}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: vh(2),
            }}>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 16,
                color: "black",
              }}>
              {country === "ko"
                ? "댓글"
                : country === "ja"
                ? "コメント"
                : country === "es"
                ? "Comentario"
                : country === "fr"
                ? "Commentaire"
                : country === "id"
                ? "Komentar"
                : country === "zh"
                ? "评论"
                : "Comment"}
            </Text>
            <Switch
              trackColor={{false: "#a4a4a4", true: PALETTE.COLOR_NAVY}}
              thumbColor={comment ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#a4a4a4"
              onValueChange={async () => {
                await api.post("/alarm/updateAlarmSetting/v3", {
                  news,
                  comment: !comment,
                  call,
                  gift,
                  post: post2,
                  chat,
                  follow,
                  creatorPush,
                });
                setComment(!comment);
              }}
              value={comment}
            />
          </View>

          {Platform.OS === "ios" && (
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: vh(2),
              }}>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: 16,
                  color: "black",
                }}>
                {country === "ko"
                  ? "백그라운드 통화 허용 여부"
                  : country === "ja"
                  ? "バックグラウンド通話を許可するか"
                  : country === "es"
                  ? "Permitir llamadas en segundo plano"
                  : country === "fr"
                  ? "Autoriser les appels en arrière-plan"
                  : country === "id"
                  ? "Izinkan panggilan latar belakang"
                  : country === "zh"
                  ? "允许后台通话"
                  : "Allow background calls"}
              </Text>
              <Switch
                trackColor={{false: "#a4a4a4", true: PALETTE.COLOR_NAVY}}
                thumbColor={backgroundApnsOn ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#a4a4a4"
                onValueChange={async () => {
                  await api.post("/alarm/backgroundApnsOn", {
                    backgroundApnsOn: !backgroundApnsOn,
                  });
                  setBackgroundApnsOn(!backgroundApnsOn);
                  updateUser({
                    ...user,
                    backgroundApnsOn: !backgroundApnsOn,
                  });
                }}
                value={backgroundApnsOn}
              />
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: vh(2),
            }}>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 16,
                color: "black",
              }}>
              {country === "ko"
                ? "영상통화 허용 여부"
                : country === "ja"
                ? "ビデオ通話の許可"
                : country === "es"
                ? "Permitir videollamadas"
                : country === "fr"
                ? "Autorisation de l'appel vidéo"
                : country === "id"
                ? "Izin panggilan video"
                : country === "zh"
                ? "视频通话允许状态"
                : "Video Call Permission"}
            </Text>
            <Switch
              trackColor={{false: "#a4a4a4", true: PALETTE.COLOR_NAVY}}
              thumbColor={call ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#a4a4a4"
              onValueChange={async () => {
                await api.post("/alarm/updateAlarmSetting/v3", {
                  news,
                  comment,
                  call: !call,
                  gift,
                  post: post2,
                  chat,
                  follow,
                  creatorPush,
                });
                setCall(!call);
              }}
              value={call}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: vh(2),
            }}>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 16,
                color: "black",
              }}>
              {country === "ko"
                ? "영상통화 소리 여부"
                : country === "ja"
                ? "ビデオ通話の音の有無"
                : country === "es"
                ? "Estado del sonido en videollamada"
                : country === "fr"
                ? "Statut du son lors d'un appel vidéo"
                : country === "id"
                ? "Status suara pada panggilan video"
                : country === "zh"
                ? "视频通话声音状态"
                : "Sound status in video call"}
            </Text>
            <Switch
              trackColor={{false: "#a4a4a4", true: PALETTE.COLOR_NAVY}}
              thumbColor={soundOn ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#a4a4a4"
              onValueChange={async () => {
                await api.post("/alarm/updateAlarmSettingSoundOn", {
                  soundOn: !soundOn,
                });
                updateUser({
                  ...user,
                  soundOn: !soundOn,
                });
                setSoundOn(!soundOn);
              }}
              value={soundOn}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: vh(2),
            }}>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 16,
                color: "black",
              }}>
              {country === "ko"
                ? "선물"
                : country === "ja"
                ? "ギフト"
                : country === "es"
                ? "Regalo"
                : country === "fr"
                ? "Cadeau"
                : country === "id"
                ? "Hadiah"
                : country === "zh"
                ? "礼物"
                : "Gift"}
            </Text>
            <Switch
              trackColor={{false: "#a4a4a4", true: PALETTE.COLOR_NAVY}}
              thumbColor={gift ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#a4a4a4"
              onValueChange={async () => {
                await api.post("/alarm/updateAlarmSetting/v3", {
                  news,
                  comment,
                  call,
                  gift: !gift,
                  post: post2,
                  chat,
                  follow,
                  creatorPush,
                });
                setGift(!gift);
              }}
              value={gift}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: vh(2),
            }}>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 16,
                color: "black",
              }}>
              {country === "ko"
                ? "채팅"
                : country === "ja"
                ? "チャット"
                : country === "es"
                ? "Chat"
                : country === "fr"
                ? "Chat"
                : country === "id"
                ? "Obrolan"
                : country === "zh"
                ? "聊天"
                : "Chat"}
            </Text>
            <Switch
              trackColor={{false: "#a4a4a4", true: PALETTE.COLOR_NAVY}}
              thumbColor={chat ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#a4a4a4"
              onValueChange={async () => {
                await api.post("/alarm/updateAlarmSetting/v3", {
                  news,
                  comment,
                  call,
                  gift,
                  post: post2,
                  chat: !chat,
                  follow,
                  creatorPush,
                });
                setChat(!chat);
              }}
              value={chat}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: vh(2),
            }}>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 16,
                color: "black",
              }}>
              {country === "ko"
                ? "포스팅"
                : country === "ja"
                ? "投稿"
                : country === "es"
                ? "Publicación"
                : country === "fr"
                ? "Publication"
                : country === "id"
                ? "Postingan"
                : country === "zh"
                ? "发布"
                : "Post"}
            </Text>
            <Switch
              trackColor={{false: "#a4a4a4", true: PALETTE.COLOR_NAVY}}
              thumbColor={post2 ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#a4a4a4"
              onValueChange={async () => {
                await api.post("/alarm/updateAlarmSetting/v3", {
                  news,
                  comment,
                  call,
                  gift,
                  post: !post2,
                  chat,
                  follow,
                  creatorPush,
                });
                setPost(!post2);
              }}
              value={post2}
            />
          </View>
          {/*
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: vh(2),
            }}>
            <Text
              style={{
                fontWeight: "400",
                fontSize: 16,
                color: "black",
              }}>
              팔로잉 로그인시 알림
            </Text>
            <Switch
              trackColor={{false: "#a4a4a4", true: PALETTE.COLOR_NAVY}}
              thumbColor={post2 ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#a4a4a4"
              onValueChange={async () => {
                await api.post("/alarm/updateAlarmSetting", {
                  news,
                  comment,
                  call,
                  gift,
                  post: post2,
                  chat,
                  follow: !follow,
                });
                setFollow(!follow);
              }}
              value={follow}
            />
          </View>
            */}
        </View>
      </View>
    </NotchView>
  );
}
