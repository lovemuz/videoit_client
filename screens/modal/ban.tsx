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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ToastComponent } from "../reusable/useToast";

export default function Ban({
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
  const pageNum: any = useRef(0);
  const pageSize: any = useRef(20);
  const [banList, setBanList] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [firstRender, setFirstRender] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await api
      .get("/user/myBanList", {
        params: {
          pageNum: 0,
          pageSize: pageSize.current,
        },
      })
      .then(res => {
        pageNum.current = 1;
        setBanList(res.data.banList[0].Bannings);
      });
    setRefreshing(false);
  }, [user]);

  const ref: any = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        await api
          .get("/user/myBanList", {
            params: {
              pageNum: 0,
              pageSize: pageSize.current,
            },
          })
          .then(res => {
            pageNum.current = 1;
            if (res.data.banList[0] && res.data.banList[0].Bannings) {
              setBanList(res.data.banList[0].Bannings);
              setFirstRender(true);
            }
          });
      } catch (err) { }
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
                  ? `차단목록`
                  : country === "ja"
                    ? `ブロックされたアカウント`
                    : country === "es"
                      ? `cuenta bloqueada`
                      : country === "fr"
                        ? `compte bloqué`
                        : country === "id"
                          ? `akun yang diblokir`
                          : country === "zh"
                            ? `帐户被冻结`
                            : `blocked account`}
              </Text>
            </View>
            <View
              style={{
                width: 30,
                height: 30,
              }}></View>
          </View>
        </View>
        {banList && firstRender && (
          <FlatList
            ref={ref}
            contentContainerStyle={{
              marginTop: vh(2),
              paddingLeft: vw(4),
              paddingRight: vw(4),
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            scrollEnabled
            onEndReached={async e => {
              await api
                .get("/user/myBanList", {
                  params: {
                    pageNum: pageNum.current,
                    pageSize: pageSize.current,
                  },
                })
                .then(res => {
                  if (res.data.banList[0]?.Bannings) {
                    pageNum.current = pageNum.current + 1;
                    setBanList(banList.concat(res.data.banList[0]?.Bannings));
                  }
                });
            }}
            //horizontal={true}
            keyExtractor={(item: any) => item.id}
            data={banList}
            numColumns={1}
            decelerationRate={"fast"}
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
                    ? `차단 목록이 없습니다.`
                    : country === "ja"
                      ? `ブロックリストはありません。`
                      : country === "es"
                        ? `No hay lista de bloqueo.`
                        : country === "fr"
                          ? `Il n'y a pas de liste de blocage.`
                          : country === "id"
                            ? `Tidak ada daftar blokir.`
                            : country === "zh"
                              ? `没有阻止列表。`
                              : `There is no block list.`}
                </Text>
              </View>
            )}
            renderItem={(props: any) => (
              <TouchableOpacity
                activeOpacity={1}
                key={props.index}
                onPress={async () => {
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
                    uri: props.item?.profile,
                    priority: FastImage.priority.normal,
                  }}
                  style={{
                    width: vh(6.5),
                    height: vh(6.5),
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
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontWeight: "bold",
                        marginBottom: 2,
                        fontSize: 12,
                        color: "black",
                        marginRight: 4, // 텍스트와 이미지 사이 간격
                      }}>
                      {props.item?.nick}
                    </Text>

                    <Image
                      source={require("../../assets/setting/badge.png")}
                      style={{
                        width: 15,
                        height: 15,
                      }}
                    />
                  </View>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#838383",
                      fontSize: 10,
                    }}>
                    {props.item?.link}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                  }}>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      backgroundColor: PALETTE.COLOR_WHITE,
                      padding: 10,
                      borderRadius: 10,
                    }}
                    onPress={async e => {
                      await api
                        .delete("/user/removeBan", {
                          data: {
                            YouId: props.item?.id,
                          },
                        })
                        .then(res => {
                          if (res.data.status === "true") {
                            Alert.alert(
                              country === "ko"
                                ? `차단 해제`
                                : country === "ja"
                                  ? `ブロック解除`
                                  : country === "es"
                                    ? `desatascar`
                                    : country === "fr"
                                      ? `Débloquer`
                                      : country === "id"
                                        ? `buka blokir`
                                        : country === "zh"
                                          ? `解锁`
                                          : `unblock`,
                              country === "ko"
                                ? `차단이 해제 되었습니다.`
                                : country === "ja"
                                  ? `ブロックが解除されました。`
                                  : country === "es"
                                    ? `Se ha levantado el bloqueo.`
                                    : country === "fr"
                                      ? `Le blocage a été levé.`
                                      : country === "id"
                                        ? `Pemblokiran telah dicabut.`
                                        : country === "zh"
                                          ? `封锁已解除。`
                                          : `Blocking has been lifted.`,
                            );
                            setBanList(
                              banList.filter(
                                (item: any) => item.id !== props.item?.id,
                              ),
                            );
                          }
                        });
                    }}>
                    <Text
                      style={{
                        color: PALETTE.COLOR_BLACK,
                      }}>
                      {country === "ko"
                        ? `차단 해제`
                        : country === "ja"
                          ? `ブロック解除`
                          : country === "es"
                            ? `desatascar`
                            : country === "fr"
                              ? `Débloquer`
                              : country === "id"
                                ? `buka blokir`
                                : country === "zh"
                                  ? `解锁`
                                  : `unblock`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </NotchView>
  );
}
