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
  RefreshControl,
  FlatList,
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

import { useScrollToTop } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SocketIOClient from "socket.io-client";
import { ToastComponent } from "../reusable/useToast";
import { USER_GENDER } from "../../lib/constant/user-constant";
import APP_VERSION from "../../lib/constant/APP_VERSION";

export default function Room({
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
  chatCount,
  setChatCount,
  adminRoom,
  updateAdminRoom,
  calling,
  setCalling,
  timer,
  setTimer,
  isRunning,
  setIsRunning,
  callEndByMe,
  modalState,
  setModalState,
}: {
  calling: any;
  setCalling: any;
  timer: any;
  setTimer: any;
  isRunning: any;
  setIsRunning: any;
  callEndByMe: any;
  modalState: any;
  setModalState: any;
  adminRoom: any;
  updateAdminRoom: any;
  chatCount: any;
  setChatCount: any;
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
  const [firstRender, setFirstRender] = useState(false);
  const [secondRender, setSecondRender] = useState(false);

  const pageNum: any = useRef(0);
  const pageSize: any = useRef(30);
  const pageNum2: any = useRef(0);
  const pageSize2: any = useRef(30);
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);
  const [refreshing2, setRefreshing2] = React.useState(false);

  const [rankList, setRankList] = useState([]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await api
        .get("/room/getMyRoom", {
          params: {
            APP_VERSION,
            pageNum: 0,
            pageSize: pageSize.current,
            country,
            platform: Platform.OS,
          },
        })
        .then(res => {
          updateRoom(res.data?.roomList);
          pageNum.current = 1;
        }); //
    } catch (err) { }
    try {
      await api.get("/room/getMyRoomAdmin").then(res => {
        if (res.data.status !== "false") {
          updateAdminRoom(res.data.room);
        }
      });
    } catch (err) { }
    try {
      await api.get("/room/getNotReadRoomCount").then(res => {
        setChatCount(res.data?.count);
      });
    } catch (err) { }
    setRefreshing(false);
  }, [user]);

  const onRefresh2 = React.useCallback(async () => {
    setRefreshing2(true);

    setRefreshing2(false);
  }, [user]);

  const ref = useRef(null);
  useScrollToTop(ref);

  useEffect(() => {
    async function fetchData() {
      if (user?.gender === USER_GENDER.GIRL) {
        try {
          await api
            .get("/room/getMyRank", {
              params: {
                pageNum: 0,
                pageSize: pageSize2.current,
              },
            })
            .then(res => {
              pageNum2.current = 1;
              setRankList(res.data.rankList);
              setSecondRender(true);
            }); //
        } catch (err) { }
      }
      try {
        await api
          .get("/room/getMyRoom", {
            params: {
              APP_VERSION,
              pageNum: 0,
              pageSize: pageSize.current,
              country,
              platform: Platform.OS,
            },
          })
          .then(res => {
            pageNum.current = 1;
            updateRoom(res.data?.roomList);
            setFirstRender(true);
          });
      } catch (err) { }
      try {
        await api.get("/room/getMyRoomAdmin").then(res => {
          if (res.data.status !== "false") {
            updateAdminRoom(res.data.room);
          }
        });
      } catch (err) { }
      try {
        await api.get("/room/getNotReadRoomCount").then(res => {
          setChatCount(res.data?.count);
        });
      } catch (err) { }
    }
    fetchData();
  }, []);

  const [roomType, setRoomType] = useState("room"); //room , rank

  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["top", "bottom"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={"dark-content"}
      />
      <View
        style={{
          flex: 1,
        }}>
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
              justifyContent: "space-between",
              marginBottom: vh(2),
            }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 22,
                color: "black",
              }}>
              {country === "ko"
                ? `메시지`
                : country === "ja"
                  ? `メッセージ`
                  : country === "es"
                    ? `mensaje`
                    : country === "fr"
                      ? `message`
                      : country === "id"
                        ? `pesan`
                        : country === "zh"
                          ? `信息`
                          : `message`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
              }}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  marginBottom: -12,
                }}
                onPress={() => {
                  navigation.navigate("Search");
                }}>
                <Image
                  source={require("../../assets/nav/search.png")}
                  style={{
                    marginLeft: 15,
                    width: 22,
                    height: 22,
                  }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  marginBottom: -12,
                }}
                onPress={() => {
                  navigation.navigate("Alarm");
                }}>
                <Image
                  source={require("../../assets/live/bell.png")}
                  style={{
                    marginLeft: 10,
                    width: 25,
                    height: 25,
                  }}></Image>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {room && firstRender && roomType === "room" ? (
          <FlatList
            ref={ref}
            contentContainerStyle={
              room.length === 0
                ? {
                  paddingLeft: vw(4),
                  paddingRight: vw(4),
                  flex: 1,
                }
                : {
                  paddingLeft: vw(4),
                  paddingRight: vw(4),
                  //flexGrow: 1,
                }
            }
            ListHeaderComponent={() => (
              <View>
                {user?.gender === USER_GENDER.GIRL && (
                  <View
                    style={{
                      justifyContent: "space-between",
                      alignContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      marginBottom: vh(1),
                      //marginTop: vh(1),
                      //marginLeft: vw(4),
                      //marginRight: vw(4),
                    }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                      }}>
                      <TouchableOpacity
                        style={{
                          borderRadius: 10,
                          minWidth: 70,
                          height: 40,
                          backgroundColor: PALETTE.COLOR_BACK,
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          marginRight: 10,
                        }}
                        onPress={() => {
                          setRoomType("room");
                        }}>
                        <Text
                          style={{
                            color: "black",
                            fontWeight: "500",
                          }}>
                          {country === "ko"
                            ? `채팅`
                            : country === "ja"
                              ? `チャット`
                              : country === "zh"
                                ? `聊天`
                                : `chat`}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          borderRadius: 10,
                          minWidth: 70,
                          height: 40,
                          backgroundColor: PALETTE.COLOR_BACK,
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                        onPress={async () => {
                          await api
                            .get("/room/getMyRank", {
                              params: {
                                pageNum: 0,
                                pageSize: pageSize2.current,
                              },
                            })
                            .then(res => {
                              pageNum2.current = 1;
                              setRankList(res.data.rankList);
                            }); //
                          setRoomType("rank");
                        }}>
                        <Text
                          style={{
                            color: "black",
                            fontWeight: "500",
                          }}>
                          {country === "ko"
                            ? `랭킹`
                            : country === "ja"
                              ? `ランキング`
                              : country === "zh"
                                ? `排行`
                                : `ranking`}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View></View>
                  </View>
                )}
                {user?.gender === USER_GENDER.GIRL && (
                  <TouchableOpacity
                    activeOpacity={1}
                    key={-1}
                    onPress={async () => {
                      navigation.navigate("AllChat");
                    }}
                    style={{
                      width: "100%",
                      height: 70,
                      justifyContent: "space-between",
                      alignContent: "center",
                      alignItems: "center",
                      marginBottom: vh(1),
                      flexDirection: "row",
                    }}>
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        backgroundColor: PALETTE.COLOR_RED,
                        borderRadius: 100,
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                      }}>
                      <FastImage
                        source={{
                          uri: user?.profile,
                          priority: FastImage.priority.normal,
                        }}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 100,
                        }}
                        resizeMode={FastImage.resizeMode.cover}></FastImage>
                    </View>
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
                        {country === "ko"
                          ? ` 전체 채팅 보내기`
                          : country === "ja"
                            ? ` フルチャットを送信`
                            : country === "es"
                              ? ` Enviar chat completo`
                              : country === "fr"
                                ? ` Envoyer l'intégralité du chat`
                                : country === "id"
                                  ? ` Kirim seluruh obrolan`
                                  : country === "zh"
                                    ? ` 发送整个聊天记录`
                                    : ` Send entire chat`}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 12,
                          color: "black",
                        }}>
                        {country === "ko"
                          ? ` 채팅으로 컨텐츠 수익을 내보세요!`
                          : country === "ja"
                            ? ` チャットでコンテンツ収益を得る！`
                            : country === "es"
                              ? ` ¡Gana dinero con el contenido a través del chat!`
                              : country === "fr"
                                ? ` Gagnez de l'argent grâce au contenu via le chat !`
                                : country === "id"
                                  ? ` Hasilkan uang dari konten melalui obrolan!`
                                  : country === "zh"
                                    ? ` 通过聊天从内容中赚钱！`
                                    : ` Make money from content through chat!`}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignItems: "flex-end",
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          marginBottom: 5,
                          fontSize: 12,
                          color: "#838383",
                        }}>
                        {adminRoom?.Chats
                          ? new Date(
                            adminRoom?.lastChatDate,
                          ).toLocaleDateString()
                          : ""}
                      </Text>

                      {adminRoom?.read === false && (
                        <View
                          style={{
                            backgroundColor: PALETTE.COLOR_RED,
                            width: 10,
                            height: 10,
                            borderRadius: 100,
                          }}></View>
                      )}
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 100,
                        }}></View>
                    </View>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  activeOpacity={1}
                  key={-1}
                  onPress={async () => {
                    await api.post("/room/createRoomAdmin").then(async res => {
                      if (res.data.status === "true") {
                        const RoomId: number = res.data.RoomId;
                        if (adminRoom?.read === false)
                          setChatCount((prevNum: number) => prevNum - 1);
                        navigation.navigate("Chat", {
                          RoomId,
                          admin: true,
                        });
                      }
                    });
                  }}
                  style={{
                    width: "100%",
                    height: 70,
                    paddingLeft: 10,
                    paddingRight: 10,
                    justifyContent: "space-between",
                    alignContent: "center",
                    alignItems: "center",
                    marginBottom: vh(1),
                    flexDirection: "row",
                    backgroundColor: "black",
                    borderRadius: 10,
                  }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 100,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}>
                    <Image
                      source={require("../../assets/setting/black_icon.png")}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 100,
                      }}
                      resizeMode="cover"></Image>
                  </View>
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
                        color: "white",
                      }}>
                      VIDEO IT
                      {country === "ko"
                        ? ` 고객센터`
                        : country === "ja"
                          ? ` カスタマーセンター`
                          : country === "es"
                            ? ` centro de atención al cliente`
                            : country === "fr"
                              ? ` service client`
                              : country === "id"
                                ? ` Pusat Layanan Pelanggan`
                                : country === "zh"
                                  ? ` 客服中心`
                                  : ` customer center`}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: "white",
                      }}>
                      {adminRoom?.Chats ? adminRoom?.Chats[0]?.content : ""}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: "flex-end",
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        marginBottom: 5,
                        fontSize: 12,
                        color: "#838383",
                      }}>
                      {adminRoom?.Chats
                        ? new Date(adminRoom?.lastChatDate).toLocaleDateString()
                        : ""}
                    </Text>

                    {adminRoom?.read === false && (
                      <View
                        style={{
                          backgroundColor: PALETTE.COLOR_RED,
                          width: 10,
                          height: 10,
                          borderRadius: 100,
                        }}></View>
                    )}
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 100,
                      }}></View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
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
                    ? `대화 목록이 없습니다.`
                    : country === "ja"
                      ? `会話リストがありません。`
                      : country === "es"
                        ? `No hay lista de conversaciones.`
                        : country === "fr"
                          ? `Il n'y a pas de liste de conversations.`
                          : country === "id"
                            ? `Tidak ada daftar percakapan.`
                            : country === "zh"
                              ? `没有对话列表。`
                              : `There is no conversation list.`}
                </Text>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            scrollEnabled
            onEndReached={async e => {
              await api
                .get("/room/getMyRoom", {
                  params: {
                    APP_VERSION,
                    pageNum: pageNum.current,
                    pageSize: pageSize.current,
                    country,
                    platform: Platform.OS,
                  },
                })
                .then(res => {
                  if (room.length <= 3) {
                  } else {
                    updateRoom([...room, ...res.data?.roomList]);
                  }
                  pageNum.current = pageNum.current + 1;
                }); //
            }}
            //horizontal={true}
            keyExtractor={(item: any) => item?.id}
            data={room}
            numColumns={1}
            decelerationRate={"fast"}
            renderItem={(props: any) => (
              <>
                <TouchableOpacity
                  activeOpacity={1}
                  key={props?.index}
                  onPress={async () => {
                    if (props.item?.read === false)
                      setChatCount((prevNum: number) => prevNum - 1);
                    navigation.push("Chat", {
                      RoomId: props.item?.id,
                    });
                  }}
                  style={{
                    width: "100%",
                    height: 70,
                    justifyContent: "space-between",
                    alignContent: "center",
                    alignItems: "center",
                    marginBottom: vh(1),
                    flexDirection: "row",
                  }}>
                  <FastImage
                    source={{
                      uri: props.item?.profile,
                      priority: FastImage.priority.normal,
                    }}
                    style={{
                      width: 60,
                      height: 60,
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
                        fontWeight: "bold",
                        marginBottom: 5,
                        color: "black",
                      }}>
                      {props.item?.nick}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: "black",
                      }}>
                      {props.item?.Chats[0]?.content}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: "flex-end",
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        marginBottom: 5,
                        fontSize: 12,
                        color: "#838383",
                      }}>
                      {new Date(props.item?.lastChatDate).toLocaleDateString()}
                    </Text>
                    {props.item?.read === false && (
                      <View
                        style={{
                          backgroundColor: PALETTE.COLOR_ORANGE,
                          width: 10,
                          height: 10,
                          borderRadius: 100,
                        }}></View>
                    )}
                  </View>
                </TouchableOpacity>
              </>
            )}
          />
        ) : (
          rankList &&
          secondRender &&
          roomType === "rank" && (
            <FlatList
              ref={ref}
              contentContainerStyle={
                room.length === 0
                  ? {
                    paddingLeft: vw(4),
                    paddingRight: vw(4),
                    flex: 1,
                  }
                  : {
                    paddingLeft: vw(4),
                    paddingRight: vw(4),
                    //flexGrow: 1,
                  }
              }
              ListHeaderComponent={() => (
                <View>
                  {user?.gender === USER_GENDER.GIRL && (
                    <View
                      style={{
                        justifyContent: "space-between",
                        alignContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        marginBottom: vh(1),
                        //marginTop: vh(1),
                        //marginLeft: vw(4),
                        //marginRight: vw(4),
                      }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "center",
                        }}>
                        <TouchableOpacity
                          style={{
                            borderRadius: 10,
                            minWidth: 70,
                            height: 40,
                            backgroundColor: PALETTE.COLOR_BACK,
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            marginRight: 10,
                          }}
                          onPress={() => {
                            setRoomType("room");
                          }}>
                          <Text
                            style={{
                              color: "black",
                              fontWeight: "500",
                            }}>
                            {country === "ko"
                              ? `채팅`
                              : country === "ja"
                                ? `チャット`
                                : country === "zh"
                                  ? `聊天`
                                  : `chat`}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            borderRadius: 10,
                            minWidth: 70,
                            height: 40,
                            backgroundColor: PALETTE.COLOR_BACK,
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                          }}
                          onPress={async () => {
                            await api
                              .get("/room/getMyRank", {
                                params: {
                                  pageNum: 0,
                                  pageSize: pageSize2.current,
                                },
                              })
                              .then(res => {
                                pageNum2.current = 1;
                                setRankList(res.data.rankList);
                              }); //
                            setRoomType("rank");
                          }}>
                          <Text
                            style={{
                              color: "black",
                              fontWeight: "500",
                            }}>
                            {country === "ko"
                              ? `랭킹`
                              : country === "ja"
                                ? `ランキング`
                                : country === "zh"
                                  ? `排行`
                                  : `ranking`}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View></View>
                    </View>
                  )}
                </View>
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing2}
                  onRefresh={onRefresh2}
                />
              }
              scrollEnabled
              onEndReached={async e => {
                await api
                  .get("/room/getMyRank", {
                    params: {
                      pageNum: pageNum2.current,
                      pageSize: pageSize2.current,
                    },
                  })
                  .then(res => {
                    pageNum2.current = pageNum2.current + 1;
                    if (rankList.length <= 3) {
                    } else {
                      setRankList(rankList.concat(res.data.rankList));
                    }
                  }); //
              }}
              //horizontal={true}
              keyExtractor={(item: any) => item?.id}
              data={rankList}
              numColumns={1}
              decelerationRate={"fast"}
              renderItem={(props: any) => (
                <>
                  <TouchableOpacity
                    activeOpacity={1}
                    key={props?.index}
                    onPress={async () => {
                      if (props.item?.User?.id === user?.id) return;
                      await api
                        .post("/room/createRoom", {
                          YouId: props.item?.User?.id,
                        })
                        .then(async res => {
                          if (res.data.status === "true") {
                            const RoomId: number = res.data.RoomId;
                            //setModalState(LIVE_CONSTANT.MODAL_STATE_DEFAULT);
                            navigation.navigate("Chat", {
                              RoomId,
                            });
                          }
                        });
                    }}
                    style={{
                      width: "100%",
                      height: 70,
                      justifyContent: "space-between",
                      alignContent: "center",
                      alignItems: "center",
                      marginBottom: vh(1),
                      flexDirection: "row",
                    }}>
                    <FastImage
                      source={{
                        uri: props.item?.User?.profile,
                        priority: FastImage.priority.normal,
                      }}
                      style={{
                        width: 60,
                        height: 60,
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
                          fontWeight: "bold",
                          marginBottom: 5,
                          color: "black",
                        }}>
                        {props.item?.User?.nick}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 12,
                          color: "black",
                          marginBottom: 2,
                        }}>
                        {country === "ko"
                          ? `후원 금액 - ${Number(
                            props.item?.amount,
                          ).toLocaleString()}원`
                          : country === "ja"
                            ? `スポンサー金額 - ${Number(
                              props.item?.amount,
                            ).toLocaleString()}ウォン`
                            : country === "zh"
                              ? `赞助金额 - ${Number(
                                props.item?.amount,
                              ).toLocaleString()}韩元`
                              : `Sponsorship amount - ${Number(
                                props.item?.amount,
                              ).toLocaleString()} won`}
                      </Text>
                      {props.item?.Subscribe && (
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 12,
                            color: "black",
                          }}>
                          {country === "ko"
                            ? `구독 `
                            : country === "ja"
                              ? `購読 `
                              : country === "zh"
                                ? `订阅 `
                                : `subscribe `}
                          - VIP {props.item?.Subscribe?.step}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        alignItems: "flex-end",
                      }}>
                      {props.index === 0 ? (
                        <Image
                          source={require("../../assets/chat/medal1.png")}
                          style={{
                            width: 40,
                            height: 40,
                          }}></Image>
                      ) : props.index === 1 ? (
                        <Image
                          source={require("../../assets/chat/medal2.png")}
                          style={{
                            width: 40,
                            height: 40,
                          }}></Image>
                      ) : (
                        props.index === 2 && (
                          <Image
                            source={require("../../assets/chat/medal3.png")}
                            style={{
                              width: 40,
                              height: 40,
                            }}></Image>
                        )
                      )}
                    </View>
                  </TouchableOpacity>
                </>
              )}
            />
          )
        )}
        <View
          style={{
            height: vh(6),
            width: vw(100),
          }}></View>
      </View>
    </NotchView>
  );
}
