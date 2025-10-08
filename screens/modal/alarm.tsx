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
  RefreshControl,
  FlatList,
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
import {ALARM_TYPE} from "../../lib/constant/alarm-constant";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ToastComponent} from "../reusable/useToast";

export default function Alarm({
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
  const [alarmList, setAlarmList]: any = useState([]);
  const pageNum: any = useRef(0);
  const pageSize: any = useRef(10);
  const [firstRender, setFirstRender] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        await api
          .get("/alarm/getMyAlarm", {
            params: {
              pageNum: 0,
              pageSize: pageSize.current,
            },
          })
          .then(res => {
            pageNum.current = pageNum.current + 1;
            setAlarmList((prev: any) => prev?.concat(res.data.alarmList));
          });
      } catch (err) {}
      setFirstRender(true);
    }
    fetchData();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await api
      .get("/alarm/getMyAlarm", {
        params: {
          pageNum: 0,
          pageSize: pageSize.current,
        },
      })
      .then(res => {
        pageNum.current = pageNum.current + 1;
        setAlarmList(res.data.alarmList);
      });
    setRefreshing(false);
  }, [user]);
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
                  fontWeight: "bold",
                  fontSize: 18,
                }}>
                {country === "ko"
                  ? "알림"
                  : country === "ja"
                  ? "通知"
                  : country === "es"
                  ? "Notificaciones"
                  : country === "fr"
                  ? "Notifications"
                  : country === "id"
                  ? "Notifikasi"
                  : country === "zh"
                  ? "通知"
                  : "Notifications"}
              </Text>
            </View>
            <View
              style={{
                width: 30,
                height: 30,
              }}></View>
          </View>
        </View>
        {alarmList && firstRender === true && (
          <FlatList
            contentContainerStyle={{
              flexGrow: 1,
              marginTop: vh(2),
              paddingLeft: vw(4),
              paddingRight: vw(4),
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEnabled
            onEndReached={async (e: any) => {
              await api
                .get("/alarm/getMyAlarm", {
                  params: {
                    pageNum: pageNum.current,
                    pageSize: pageSize.current,
                  },
                })
                .then(res => {
                  pageNum.current = pageNum.current + 1;
                  //setAlarmList(alarmList.concat(res.data.alarmList));
                  setAlarmList((prev: any) => prev?.concat(res.data.alarmList));
                });
            }}
            //horizontal={true}
            keyExtractor={(item: any) => item.id}
            data={alarmList}
            numColumns={1}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <Text
                  style={{
                    color: "#838383",
                  }}>
                  {country === "ko"
                    ? "알림 목록이 없습니다."
                    : country === "ja"
                    ? "通知リストはありません。"
                    : country === "es"
                    ? "No hay notificaciones en la lista."
                    : country === "fr"
                    ? "Pas de notifications dans la liste."
                    : country === "id"
                    ? "Tidak ada pemberitahuan dalam daftar."
                    : country === "zh"
                    ? "通知列表为空。"
                    : "No notifications in the list."}
                </Text>
              </View>
            )}
            decelerationRate={"fast"}
            renderItem={(props: any) => (
              <TouchableOpacity
                activeOpacity={1}
                key={props.index}
                onPress={async () => {
                  //읽음 표시
                  await api
                    .put("/alarm/readAlarm", {
                      AlarmId: props.item?.id,
                    })
                    .then(res => {
                      if (res.data.status === "true") {
                        setAlarmList(
                          alarmList.map((list: any) =>
                            list.id === props.item.id
                              ? {
                                  ...list,
                                  read: true,
                                }
                              : list,
                          ),
                        );
                      }
                    });
                  if (props.item?.type === ALARM_TYPE.ALARM_POST) {
                    navigation.navigate("Comment", {
                      PostId: props.item?.PostId,
                    });
                  } else if (props.item?.type === ALARM_TYPE.ALARM_GIFT) {
                    navigation.navigate("Chat", {
                      RoomId: props.item?.RoomId,
                    });
                  } else if (props.item?.type === ALARM_TYPE.ALARM_SUBSCRIBE) {
                    navigation.navigate("Profile", {
                      YouId: props.item?.YouId,
                    });
                    return;
                  }
                  //navigation.push("Chat");
                }}
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                  marginBottom: vh(2),
                  flexDirection: "row",
                }}>
                <FastImage
                  source={{
                    uri: props.item?.User?.profile,
                    priority: FastImage.priority.normal,
                  }}
                  style={{
                    width: vw(12),
                    height: vw(12),
                    borderRadius: 100,
                  }}
                  resizeMode={FastImage.resizeMode.cover}></FastImage>
                <View
                  style={{
                    alignContent: "center",
                    alignItems: "flex-start",
                    paddingLeft: 10,
                    flex: 1,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      marginBottom: 5,
                      fontSize: 12,
                      color: "#838383",
                    }}>
                    {props.item?.type === ALARM_TYPE.ALARM_POST
                      ? country === "ko"
                        ? "포스트 구매"
                        : country === "ja"
                        ? "ポスト購入"
                        : country === "es"
                        ? "Compra de publicaciones"
                        : country === "fr"
                        ? "Achat de publications"
                        : country === "id"
                        ? "Pembelian posting"
                        : country === "zh"
                        ? "购买帖子"
                        : "Post purchase"
                      : props.item?.type === ALARM_TYPE.ALARM_GIFT
                      ? country === "ko"
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
                        : "Gift"
                      : props.item?.type === ALARM_TYPE.ALARM_SUBSCRIBE
                      ? country === "ko"
                        ? "구독"
                        : country === "ja"
                        ? "サブスクリプション"
                        : country === "es"
                        ? "Suscripción"
                        : country === "fr"
                        ? "Abonnement"
                        : country === "id"
                        ? "Berlangganan"
                        : country === "zh"
                        ? "订阅"
                        : "Subscription"
                      : props.item?.type === ALARM_TYPE.ALARM_NOTIFICATION &&
                        country === "ko"
                      ? "공지"
                      : country === "ja"
                      ? "お知らせ"
                      : country === "es"
                      ? "Noticias"
                      : country === "fr"
                      ? "Annonces"
                      : country === "id"
                      ? "Pengumuman"
                      : country === "zh"
                      ? "通知"
                      : "Announcements"}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "black",
                      fontSize: 13,
                    }}>
                    {props.item?.content}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                  }}>
                  <Text
                    style={{
                      marginBottom: 5,
                      fontSize: 12,
                      color: "#838383",
                    }}>
                    {new Date(props.item?.createdAt).toLocaleTimeString()}
                  </Text>
                  {props.item?.read === false && (
                    <View
                      style={{
                        backgroundColor: PALETTE.COLOR_RED,
                        borderRadius: 100,
                        width: 10,
                        height: 10,
                        alignSelf: "flex-end",
                      }}></View>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </NotchView>
  );
}
