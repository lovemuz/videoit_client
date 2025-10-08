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
  FlatList,
  RefreshControl,
} from "react-native";
import { NotchProvider, NotchView } from "react-native-notchclear";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
import { POINT_HISTORY } from "../../lib/constant/point-constant";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ToastComponent } from "../reusable/useToast";

export default function PurchaseHistory({
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
  const [historyList, setHistoryList] = useState([]);
  const pageNum: any = useRef(0);
  const pageSize: any = useRef(30);
  const [firstRender, setFirstRender] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        await api
          .get("/point/getHistory", {
            params: {
              pageNum: 0,
              pageSize: pageSize.current,
            },
          })
          .then(res => {
            pageNum.current = 1;
            setHistoryList(res.data.historyList);
            setFirstRender(true);
          });
      } catch (err) { }
      try {
        await api.get("/point/getMyPoint").then(res => {
          const point = res.data.point;
          updatePoint(point);
        });
      } catch (err) { }
    }
    fetchData();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await api
      .get("/point/getHistory", {
        params: {
          pageNum: 0,
          pageSize: pageSize.current,
        },
      })
      .then(res => {
        pageNum.current = 1;
        setHistoryList(res.data.historyList);
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
                  ? `포인트 사용내역`
                  : country === "ja"
                    ? `ポイント使用履歴`
                    : country === "es"
                      ? `Historial de uso de puntos`
                      : country === "fr"
                        ? `Historique d'utilisation des points`
                        : country === "id"
                          ? `Riwayat penggunaan poin`
                          : country === "zh"
                            ? `积分使用历史`
                            : `Point usage history`}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "flex-end",
              }}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  borderRadius: 100,
                  paddingLeft: 4,
                  paddingRight: 2,
                  paddingTop: 2,
                  paddingBottom: 2,
                  backgroundColor: PALETTE.COLOR_WHITE,
                }}
                onPress={() => {
                  //navigation.navigate("Store");
                }}>
                <Image
                  source={require("../../assets/setting/point.png")}
                  style={{
                    backgroundColor: PALETTE.COLOR_WHITE,
                    borderRadius: 100,
                    width: 25,
                    height: 25,
                    marginRight: 2,
                  }}></Image>
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    backgroundColor: PALETTE.COLOR_WHITE,
                    borderRadius: 100,
                    paddingTop: 9,
                    paddingBottom: 9,
                    paddingLeft: 5,
                    paddingRight: 5,
                    minWidth: 30,
                  }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      color: "black",
                    }}>
                    {Number(point?.amount).toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {historyList && firstRender && (
          <FlatList
            contentContainerStyle={{
              //flex: 1,
              marginTop: vh(2),
              paddingLeft: vw(4),
              paddingRight: vw(4),
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
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
                    ? `포인트 사용내역이 없습니다.`
                    : country === "ja"
                      ? `ポイント使用履歴がありません。`
                      : country === "es"
                        ? `No hay ningún historial de uso de puntos.`
                        : country === "fr"
                          ? `Il n’y a aucun historique d’utilisation utile.`
                          : country === "id"
                            ? `Tidak ada riwayat penggunaan poin.`
                            : country === "zh"
                              ? `没有积分使用历史。`
                              : `There is no point usage history.`}
                </Text>
              </View>
            )}
            scrollEnabled
            onEndReached={async e => {
              await api
                .get("/point/getHistory", {
                  params: {
                    pageNum: pageNum.current,
                    pageSize: pageSize.current,
                  },
                })
                .then(res => {
                  pageNum.current = pageNum.current + 1;
                  setHistoryList(historyList.concat(res.data.historyList));
                });
            }}
            //horizontal={true}
            keyExtractor={(item: any) => item.id}
            data={historyList}
            numColumns={1}
            decelerationRate={"fast"}
            renderItem={(props: any) => (
              <TouchableOpacity
                activeOpacity={1}
                key={props.index}
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                  marginBottom: vh(2),
                  flexDirection: "row",
                }}>
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
                      fontWeight: "bold",
                      marginBottom: 5,
                      color: "black",
                    }}>
                    {POINT_HISTORY.TYPE_ATTENDANCE === props.item?.type
                      ? country === "ko"
                        ? "출석체크"
                        : country === "ja"
                          ? "出席確認"
                          : country === "es"
                            ? "Chequeo de asistencia"
                            : country === "fr"
                              ? "Vérification de la présence"
                              : country === "id"
                                ? "Check-in"
                                : country === "zh"
                                  ? "签到"
                                  : "Attendance check"
                      : POINT_HISTORY.TYPE_CALL === props.item?.type
                        ? country === "ko"
                          ? "영상통화"
                          : country === "ja"
                            ? "ビデオ通話"
                            : country === "es"
                              ? "Videollamada"
                              : country === "fr"
                                ? "Appel vidéo"
                                : country === "id"
                                  ? "Video call"
                                  : country === "zh"
                                    ? "视频通话"
                                    : "Video call"
                        : POINT_HISTORY.TYPE_CHAT === props.item?.type
                          ? country === "ko"
                            ? "채팅"
                            : country === "ja"
                              ? "チャット"
                              : country === "es"
                                ? "Chat"
                                : country === "fr"
                                  ? "Discussion"
                                  : country === "id"
                                    ? "Obrolan"
                                    : country === "zh"
                                      ? "聊天"
                                      : "Chat"
                          : POINT_HISTORY.TYPE_EXCHANGE === props.item?.type
                            ? country === "ko"
                              ? "환전"
                              : country === "ja"
                                ? "両替"
                                : country === "es"
                                  ? "Intercambio"
                                  : country === "fr"
                                    ? "Échange"
                                    : country === "id"
                                      ? "Tukar"
                                      : country === "zh"
                                        ? "兑换"
                                        : "Exchange"
                            : POINT_HISTORY.TYPE_GIFT === props.item?.type
                              ? country === "ko"
                                ? "선물"
                                : country === "ja"
                                  ? "プレゼント"
                                  : country === "es"
                                    ? "Regalo"
                                    : country === "fr"
                                      ? "Cadeau"
                                      : country === "id"
                                        ? "Hadiah"
                                        : country === "zh"
                                          ? "礼物"
                                          : "Gift"
                              : POINT_HISTORY.TYPE_POST === props.item?.type
                                ? country === "ko"
                                  ? "게시글 구매"
                                  : country === "ja"
                                    ? "投稿の購入"
                                    : country === "es"
                                      ? "Compra de publicación"
                                      : country === "fr"
                                        ? "Achat de publication"
                                        : country === "id"
                                          ? "Pembelian posting"
                                          : country === "zh"
                                            ? "购买帖子"
                                            : "Purchase Post"
                                : POINT_HISTORY.TYPE_PAYMENT === props.item?.type &&
                                  country === "ko"
                                  ? "포인트 구매"
                                  : country === "ja"
                                    ? "ポイント購入"
                                    : country === "es"
                                      ? "Comprar puntos"
                                      : country === "fr"
                                        ? "Acheter des points"
                                        : country === "id"
                                          ? "Beli Poin"
                                          : country === "zh"
                                            ? "购买积分"
                                            : "Buy Points"}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      marginTop: 5,
                    }}>
                    <Image
                      source={require("../../assets/setting/point.png")}
                      style={{
                        marginLeft: 5,
                        width: 16,
                        height: 16,
                      }}></Image>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: "black",
                      }}>
                      {props.item?.plusOrMinus === POINT_HISTORY.MINUS
                        ? "- "
                        : "+ "}
                      {props.item?.amount}
                    </Text>
                  </View>
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
                    {new Date(props.item?.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </NotchView>
  );
}
