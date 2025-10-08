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
  ActivityIndicator,
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
import SelectDropdown from "react-native-select-dropdown";

import { useScrollToTop } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { USER_GENDER } from "../../lib/constant/user-constant";
import { LIVE_CONSTANT } from "../../lib/constant/live-constant";
import Modal from "react-native-modal";
import { BlurView } from "@react-native-community/blur";
import { RANK_TYPE } from "../../lib/constant/rank-constant";
import ProfileModal from "../reusable/profileModal";
import { CALL_TYPE } from "../../lib/constant/call-constant";
import APP_VERSION from "../../lib/constant/APP_VERSION";
export default function Rank({
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
  const ref = useRef(null);
  useScrollToTop(ref);

  const [firstRender, setFirstRender] = useState(false);
  // const [date, setDate]: any = useState(RANK_TYPE.RANK_MONTH); //1일일킹, 2 주간랭킹, 3월간랭킹
  // const [gender, setGender] = useState(USER_GENDER.GIRL);
  const date = useRef(RANK_TYPE.RANK_MONTH);
  const gender = useRef(USER_GENDER.GIRL);

  const pageNum: any = useRef(0);
  const pageSize: any = useRef(40);

  const [selectedUser, setSelectedUser]: any = useState(null);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await api
      .get("/rank/rankList", {
        params: {
          APP_VERSION,
          date: date.current,
          gender: gender.current,
          pageNum: 0,
          pageSize: pageSize.current,
          country,
        },
      })
      .then(res => {
        const rankList = res.data.rankList;
        pageNum.current = 1;
        updateRank(rankList);
      });
    setRefreshing(false);
  }, [user]);

  useEffect(() => {
    async function fetchData() {
      try {
        await api
          .get("/rank/rankList", {
            params: {
              APP_VERSION,
              date: date.current,
              gender: gender.current,
              pageNum: 0,
              pageSize: pageSize.current,
              country,
              platform: Platform.OS,
            },
          })
          .then(res => {
            const rankList = res.data.rankList;
            pageNum.current = 1;
            updateRank(rankList);
          });
      } catch (err) { }
      setFirstRender(true);
    }
    fetchData();
  }, []);

  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["top", "bottom"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={"dark-content"}
      />
      {selectedUser && (
        <ProfileModal
          country={country}
          connectSocket={connectSocket}
          user={user}
          navigation={navigation}
          calling={calling}
          setCalling={setCalling}
          timer={timer}
          setTimer={setTimer}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          callEndByMe={callEndByMe}
          modalState={modalState}
          setModalState={setModalState}
          selectedUser={selectedUser}></ProfileModal>
      )}

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
                ? `랭킹`
                : country === "ja"
                  ? `ランキング`
                  : country === "es"
                    ? `Clasificación`
                    : country === "fr"
                      ? `Classement`
                      : country === "id"
                        ? `Peringkat`
                        : country === "zh"
                          ? `排行榜`
                          : `Ranking`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
              }}>
              <TouchableOpacity
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
                  navigation.navigate("Store");
                }}>
                <Image
                  source={require("../../assets/setting/point.png")}
                  style={{
                    backgroundColor: PALETTE.COLOR_WHITE,
                    borderRadius: 100,
                    width: 24,
                    height: 24,
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
                      color: "#535353",
                    }}>
                    {Number(point?.amount).toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  navigation.navigate("Search");
                }}>
                <Image
                  source={require("../../assets/nav/search.png")}
                  style={{
                    marginLeft: 15,
                    width: 24,
                    height: 24,
                  }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  navigation.navigate("Alarm");
                }}>
                <Image
                  source={require("../../assets/live/bell.png")}
                  style={{
                    marginLeft: 15,
                    width: 24,
                    height: 24,
                  }}></Image>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {rank && firstRender && (
          <FlatList
            ref={ref}
            contentContainerStyle={{
              paddingLeft: vw(4),
              paddingRight: vw(4),
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            scrollEnabled
            onEndReachedThreshold={0.8}
            onEndReached={async e => {
              await api
                .get("/rank/rankList", {
                  params: {
                    APP_VERSION,
                    date: date.current,
                    gender: gender.current,
                    pageNum: pageNum.current,
                    pageSize: pageSize.current,
                    country,
                    platform: Platform.OS,
                  },
                })
                .then(res => {
                  const rankList = res.data.rankList;
                  pageNum.current = pageNum.current + 1;
                  updateRank(rank.concat(rankList));
                });
            }}
            //horizontal={true}
            keyExtractor={(item: any) => item.id}
            data={rank?.slice(3)}
            ListHeaderComponent={() => (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                  }}>
                  <SelectDropdown
                    defaultButtonText={
                      date.current === RANK_TYPE.RANK_TODAY
                        ? country === "ko"
                          ? `일일랭킹`
                          : country === "ja"
                            ? `デイリーランキング`
                            : country === "es"
                              ? `Clasificación diaria`
                              : country === "fr"
                                ? `Classement quotidien`
                                : country === "id"
                                  ? `Peringkat Harian`
                                  : country === "zh"
                                    ? `每日排行榜`
                                    : `Daily Ranking`
                        : date.current === RANK_TYPE.RANK_WEEK
                          ? country === "ko"
                            ? `주간랭킹`
                            : country === "ja"
                              ? `週間ランキング`
                              : country === "es"
                                ? `Clasificación semanal`
                                : country === "fr"
                                  ? `Classement hebdomadaire`
                                  : country === "id"
                                    ? `Peringkat Mingguan`
                                    : country === "zh"
                                      ? `每周排行榜`
                                      : `Weekly Ranking`
                          : country === "ko"
                            ? `월간랭킹`
                            : country === "ja"
                              ? `月間ランキング`
                              : country === "es"
                                ? `Clasificación mensual`
                                : country === "fr"
                                  ? `Classement mensuel`
                                  : country === "id"
                                    ? `Peringkat Bulanan`
                                    : country === "zh"
                                      ? `月度排行榜`
                                      : `Monthly Ranking`
                    }
                    buttonStyle={{
                      borderRadius: 8,
                      flex: 1,
                      height: 40,
                      backgroundColor: PALETTE.COLOR_WHITE,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                      borderWidth: 1,
                      borderColor: "#E0E0E0",
                      marginRight: 10,
                      paddingVertical: 0,
                    }}
                    dropdownStyle={{
                      borderRadius: 12,
                      marginTop: 3,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 3,
                      },
                      shadowOpacity: 0.12,
                      shadowRadius: 4,
                      elevation: 6,
                    }}
                    rowStyle={{
                      backgroundColor: PALETTE.COLOR_WHITE,
                      borderWidth: 0,
                      paddingVertical: 12,
                    }}
                    rowTextStyle={{
                      fontSize: 14,
                      color: "#333",
                      textAlign: "center",
                    }}
                    buttonTextStyle={{
                      fontSize: 14,
                      color: "#333",
                      fontWeight: "400",
                    }}
                    renderDropdownIcon={() => (
                      <Text
                        style={{
                          color: "#999",
                          fontSize: 12,
                          marginLeft: 6,
                        }}>
                        ▼
                      </Text>
                    )}
                    data={[
                      country === "ko"
                        ? `일일랭킹`
                        : country === "ja"
                          ? `デイリーランキング`
                          : country === "es"
                            ? `Clasificación diaria`
                            : country === "fr"
                              ? `Classement quotidien`
                              : country === "id"
                                ? `Peringkat Harian`
                                : country === "zh"
                                  ? `每日排行榜`
                                  : `Daily Ranking`,
                      country === "ko"
                        ? `주간랭킹`
                        : country === "ja"
                          ? `週間ランキング`
                          : country === "es"
                            ? `Clasificación semanal`
                            : country === "fr"
                              ? `Classement hebdomadaire`
                              : country === "id"
                                ? `Peringkat Mingguan`
                                : country === "zh"
                                  ? `每周排行榜`
                                  : `Weekly Ranking`,
                      country === "ko"
                        ? `월간랭킹`
                        : country === "ja"
                          ? `月間ランキング`
                          : country === "es"
                            ? `Clasificación mensual`
                            : country === "fr"
                              ? `Classement mensuel`
                              : country === "id"
                                ? `Peringkat Bulanan`
                                : country === "zh"
                                  ? `月度排行榜`
                                  : `Monthly Ranking`,
                    ]}
                    onSelect={async (selectedItem, index) => {
                      let dateTmp;
                      if (index === 0) {
                        date.current = RANK_TYPE.RANK_TODAY;
                        dateTmp = RANK_TYPE.RANK_TODAY;
                      } else if (index === 1) {
                        date.current = RANK_TYPE.RANK_WEEK;
                        dateTmp = RANK_TYPE.RANK_WEEK;
                      } else if (index === 2) {
                        date.current = RANK_TYPE.RANK_MONTH;
                        dateTmp = RANK_TYPE.RANK_MONTH;
                      }
                      await api
                        .get("/rank/rankList", {
                          params: {
                            APP_VERSION,
                            date: dateTmp,
                            gender: gender.current,
                            pageNum: 0,
                            pageSize: pageSize.current,
                            country,
                            platform: Platform.OS,
                          },
                        })
                        .then(res => {
                          const rankList = res.data.rankList;
                          pageNum.current = 1;
                          updateRank(rankList);
                        });
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                  />

                  {/* 성별 이미지 토글 버튼 */}
                  <TouchableOpacity
                    style={{
                      width: 80,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={async () => {
                      const newGender = gender.current === USER_GENDER.GIRL ? USER_GENDER.BOY : USER_GENDER.GIRL;
                      gender.current = newGender;

                      await api
                        .get("/rank/rankList", {
                          params: {
                            APP_VERSION,
                            date: date.current,
                            gender: newGender,
                            pageNum: 0,
                            pageSize: pageSize.current,
                            country,
                            platform: Platform.OS,
                          },
                        })
                        .then(res => {
                          const rankList = res.data.rankList;
                          pageNum.current = 1;
                          updateRank(rankList);
                        });
                    }}>
                    <Image
                      source={
                        gender.current === USER_GENDER.GIRL
                          ? require("../../assets/live/girl.png")
                          : require("../../assets/live/man.png")
                      }
                      style={{
                        width: 80,
                        height: 50,
                        borderRadius: 8,
                        marginTop: 7,
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    marginTop: 10,
                    width: vw(92),
                    height: "auto",
                    backgroundColor: PALETTE.COLOR_WHITE,
                    //borderWidth: 0.5,
                    //borderColor: PALETTE.COLOR_BORDER,
                    padding: vw(4),
                    borderRadius: 20,
                    marginBottom: vh(1),
                    justifyContent: "space-between",
                    ...Platform.select({
                      ios: {
                        shadowColor: "#d3d3d3",
                        shadowOffset: {
                          width: 2,
                          height: 2,
                        },
                        shadowOpacity: 5,
                        shadowRadius: 5,
                      },
                      android: {
                        elevation: 5,
                      },
                    }),
                  }}>
                  <View>
                    <Text
                      style={{
                        color: "#F7A409",
                        fontWeight: "bold",
                      }}>
                      {country === "ko"
                        ? `명예의 전당`
                        : country === "ja"
                          ? `栄誉の殿堂`
                          : country === "es"
                            ? `Salón de la Fama`
                            : country === "fr"
                              ? `Temple de la renommée`
                              : country === "id"
                                ? `Hall of Fame`
                                : country === "zh"
                                  ? `名人堂`
                                  : `Hall of Fame`}
                    </Text>
                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "black",
                      }}>
                      {country === "ko"
                        ? `랭킹순위가 높으면 추가적인`
                        : country === "ja"
                          ? `ランキングが高いほど追加が発生します`
                          : country === "es"
                            ? `A medida que sube en el ranking, habrá ventajas adicionales`
                            : country === "fr"
                              ? `Plus votre classement est élevé, plus vous bénéficierez d'avantages supplémentaires`
                              : country === "id"
                                ? `Semakin tinggi peringkat, semakin banyak keuntungan tambahan`
                                : country === "zh"
                                  ? `排名越高，将获得额外的优势`
                                  : `The higher your ranking, the more additional benefits`}
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "black",
                      }}>
                      {country === "ko"
                        ? `혜택이 주어집니다.`
                        : country === "ja"
                          ? `特典が提供されます。`
                          : country === "es"
                            ? `Se otorgan beneficios.`
                            : country === "fr"
                              ? `Des avantages sont accordés.`
                              : country === "id"
                                ? `Keuntungan diberikan.`
                                : country === "zh"
                                  ? `提供了福利。`
                                  : `Benefits are provided.`}
                    </Text>
                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: 12,
                        color: "#838383",
                      }}>
                      {country === "ko"
                        ? `영상통화를 많이하면 랭킹이 올라가요.`
                        : country === "ja"
                          ? `ビデオ通話をたくさんするとランキングが上がります。`
                          : country === "es"
                            ? `Realizar muchas videollamadas aumenta tu clasificación.`
                            : country === "fr"
                              ? `Faire beaucoup d'appels vidéo fait monter votre classement.`
                              : country === "id"
                                ? `Melakukan banyak panggilan video akan meningkatkan peringkat Anda.`
                                : country === "zh"
                                  ? `进行更多视频通话将提高您的排名。`
                                  : `Having many video calls will increase your ranking.`}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      height: 1,
                      backgroundColor: '#E0E0E0',
                      marginVertical: 20,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <View
                      style={{
                        width: "30%",
                        marginRight: vw(2),
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                      }}>
                      <TouchableOpacity
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          if (!rank[1]) return;
                          setSelectedUser(rank[1]);
                          setModalState(LIVE_CONSTANT.MODAL_STATE_PROFILE);
                        }}>
                        <View style={{ position: 'relative' }}>
                          <FastImage
                            source={{
                              uri: rank[1]?.profile,
                              priority: FastImage.priority.normal,
                            }}
                            style={{
                              width: vw(20),
                              height: vw(20),
                              borderRadius: 100,
                            }}
                            resizeMode={FastImage.resizeMode.cover}>
                            {rank[1]?.callState === CALL_TYPE.CALL_ING && (
                              <View
                                style={{
                                  position: "absolute",
                                  justifyContent: "center",
                                  alignContent: "center",
                                  alignItems: "center",
                                  width: "100%",
                                  height: "100%",
                                  zIndex: 2,
                                  backgroundColor: "rgba(0,0,0,0.4)",
                                  borderRadius: 100,
                                }}>
                                <Image
                                  source={require("../../assets/live/ing.png")}
                                  style={{
                                    width: vw(8),
                                    height: vw(8),
                                    maxWidth: 50,
                                    maxHeight: 50,
                                  }}></Image>
                                <Text
                                  style={{
                                    marginTop: 5,
                                    fontSize: 8,
                                    fontWeight: "bold",
                                    color: PALETTE.COLOR_RED,
                                  }}>
                                  {country === "ko"
                                    ? `통화중..`
                                    : country === "ja"
                                      ? `通話中...`
                                      : country === "es"
                                        ? `En llamada...`
                                        : country === "fr"
                                          ? `En communication...`
                                          : country === "id"
                                            ? `Sedang berbicara...`
                                            : country === "zh"
                                              ? `通话中...`
                                              : `In a call...`}
                                </Text>
                              </View>
                            )}
                          </FastImage>
                          <LinearGradient
                            colors={['#B6DDFB', '#8DC3F4']}
                            style={{
                              position: 'absolute',
                              top: -5,
                              left: 0,
                              width: 24,
                              height: 24,
                              borderRadius: 12,
                              justifyContent: 'center',
                              alignItems: 'center',
                              zIndex: 3,
                            }}>
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: 'bold',
                                color: 'white',
                              }}>
                              2
                            </Text>
                          </LinearGradient>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            marginTop: 10,
                          }}>
                          <Text
                            style={{
                              color: "black",
                              fontSize: 16,
                              fontWeight: "bold",
                              marginRight: 5,
                            }}
                            numberOfLines={1}>
                            {rank[1]?.nick}
                          </Text>
                          <Image
                            source={require("../../assets/setting/badge.png")}
                            style={{
                              width: 16,
                              height: 16,
                            }}></Image>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            marginBottom: 5,
                          }}>
                          {rank[1]?.country === "ko" ? (
                            <Image
                              source={require("../../assets/live/ko.png")}
                              style={{
                                width: 14,
                                height: 14,
                                marginRight: 2,
                              }}></Image>
                          ) : rank[1]?.country === "ja" ? (
                            <Image
                              source={require("../../assets/live/ja.png")}
                              style={{
                                width: 14,
                                height: 14,
                                marginRight: 2,
                              }}></Image>
                          ) : rank[1]?.country === "es" ? (
                            <Image
                              source={require("../../assets/live/es.png")}
                              style={{
                                width: 14,
                                height: 14,
                                marginRight: 2,
                              }}></Image>
                          ) : rank[1]?.country === "fr" ? (
                            <Image
                              source={require("../../assets/live/fr.png")}
                              style={{
                                width: 14,
                                height: 14,
                                marginRight: 2,
                              }}></Image>
                          ) : rank[1]?.country === "id" ? (
                            <Image
                              source={require("../../assets/live/id.png")}
                              style={{
                                width: 14,
                                height: 14,
                                marginRight: 2,
                              }}></Image>
                          ) : rank[1]?.country === "zh" ? (
                            <Image
                              source={require("../../assets/live/zh.png")}
                              style={{
                                width: 14,
                                height: 14,
                                marginRight: 2,
                              }}></Image>
                          ) : (
                            <Image
                              source={require("../../assets/live/en.png")}
                              style={{
                                width: 14,
                                height: 14,
                                marginRight: 2,
                              }}></Image>
                          )}
                          <Text
                            style={{
                              fontSize: 12,
                              color: PALETTE.COLOR_BLACK,
                            }}>
                            {rank[1]?.country === "ko"
                              ? country === "ko"
                                ? `대한민국 |`
                                : country === "ja"
                                  ? `日本 |`
                                  : country === "es"
                                    ? `España |`
                                    : country === "fr"
                                      ? `France |`
                                      : country === "id"
                                        ? `Indonesia |`
                                        : country === "zh"
                                          ? `中国 |`
                                          : `Korea |`
                              : rank[1]?.country === "ja"
                                ? country === "ko"
                                  ? `일본 | `
                                  : country === "ja"
                                    ? `日本`
                                    : country === "es"
                                      ? `Japón |`
                                      : country === "fr"
                                        ? `Japon |`
                                        : country === "id"
                                          ? `Jepang |`
                                          : country === "zh"
                                            ? `日本 |`
                                            : `Japan |`
                                : rank[1]?.country === "es"
                                  ? country === "ko"
                                    ? `스페인 | `
                                    : country === "ja"
                                      ? `スペイン`
                                      : country === "es"
                                        ? `España |`
                                        : country === "fr"
                                          ? `Espagne |`
                                          : country === "id"
                                            ? `Spanyol |`
                                            : country === "zh"
                                              ? `西班牙 |`
                                              : `Spain |`
                                  : rank[1]?.country === "fr"
                                    ? country === "ko"
                                      ? `프랑스 | `
                                      : country === "ja"
                                        ? `フランス|`
                                        : country === "es"
                                          ? `Francia |`
                                          : country === "fr"
                                            ? `France |`
                                            : country === "id"
                                              ? `Perancis |`
                                              : country === "zh"
                                                ? `法国 |`
                                                : `France |`
                                    : rank[1]?.country === "id"
                                      ? country === "ko"
                                        ? `인도 | `
                                        : country === "ja"
                                          ? `インド`
                                          : country === "es"
                                            ? `India |`
                                            : country === "fr"
                                              ? `Inde |`
                                              : country === "id"
                                                ? `India |`
                                                : country === "zh"
                                                  ? `印度 |`
                                                  : `India |`
                                      : rank[1]?.country === "zh"
                                        ? country === "ko"
                                          ? `중국 | `
                                          : country === "ja"
                                            ? `中国|`
                                            : country === "es"
                                              ? `China |`
                                              : country === "fr"
                                                ? `Chine |`
                                                : country === "id"
                                                  ? `Cina |`
                                                  : country === "zh"
                                                    ? `中国 |`
                                                    : `China |`
                                        : country === "ko"
                                          ? `미국 | `
                                          : country === "ja"
                                            ? `アメリカ|`
                                            : country === "es"
                                              ? `Estados Unidos |`
                                              : country === "fr"
                                                ? `États-Unis |`
                                                : country === "id"
                                                  ? `Amerika Serikat |`
                                                  : country === "zh"
                                                    ? `美国 |`
                                                    : `USA |`}
                            {rank[1]?.age}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        width: "30%",
                        marginRight: vw(2),
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                      }}>
                      <TouchableOpacity
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          //backgroundColor: "red",
                        }}
                        onPress={() => {
                          if (!rank[0]) return;
                          setSelectedUser(rank[0]);
                          setModalState(LIVE_CONSTANT.MODAL_STATE_PROFILE);
                        }}>
                        <View style={{ position: 'relative' }}>
                          <FastImage
                            source={{
                              uri: rank[0]?.profile,
                              priority: FastImage.priority.normal,
                            }}
                            style={{
                              width: vw(25),
                              height: vw(25),
                              borderRadius: 100,
                            }}
                            resizeMode={FastImage.resizeMode.cover}>
                            {rank[0]?.callState === CALL_TYPE.CALL_ING && (
                              <View
                                style={{
                                  position: "absolute",
                                  justifyContent: "center",
                                  alignContent: "center",
                                  alignItems: "center",
                                  width: "100%",
                                  height: "100%",
                                  zIndex: 2,
                                  backgroundColor: "rgba(0,0,0,0.4)",
                                  borderRadius: 100,
                                }}>
                                <Image
                                  source={require("../../assets/live/ing.png")}
                                  style={{
                                    width: vw(8),
                                    height: vw(8),
                                    maxWidth: 50,
                                    maxHeight: 50,
                                  }}></Image>
                                <Text
                                  style={{
                                    marginTop: 5,
                                    fontSize: 8,
                                    fontWeight: "bold",
                                    color: PALETTE.COLOR_RED,
                                  }}>
                                  {country === "ko"
                                    ? `통화중..`
                                    : country === "ja"
                                      ? `通話中...`
                                      : country === "es"
                                        ? `En llamada...`
                                        : country === "fr"
                                          ? `En communication...`
                                          : country === "id"
                                            ? `Sedang berbicara...`
                                            : country === "zh"
                                              ? `通话中...`
                                              : `In a call...`}
                                </Text>
                              </View>
                            )}
                          </FastImage>
                          <LinearGradient
                            colors={['#F5D162', '#EAA63A']}
                            style={{
                              position: 'absolute',
                              top: -5,
                              left: 0,
                              width: 24,
                              height: 24,
                              borderRadius: 12,
                              justifyContent: 'center',
                              alignItems: 'center',
                              zIndex: 3,
                            }}>
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: 'bold',
                                color: 'white',
                              }}>
                              1
                            </Text>
                          </LinearGradient>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            marginTop: 10,
                          }}>
                          <Text
                            style={{
                              color: "black",
                              fontSize: 16,
                              fontWeight: "bold",
                              marginRight: 5,
                            }}
                            numberOfLines={1}>
                            {rank[0]?.nick}
                          </Text>
                          <Image
                            source={require("../../assets/setting/badge.png")}
                            style={{
                              width: 16,
                              height: 16,
                            }}></Image>
                        </View>
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "center",
                          marginBottom: 5,
                        }}>
                        {rank[0]?.country === "ko" ? (
                          <Image
                            source={require("../../assets/live/ko.png")}
                            style={{
                              width: 14,
                              height: 14,
                              marginRight: 2,
                            }}></Image>
                        ) : rank[0]?.country === "ja" ? (
                          <Image
                            source={require("../../assets/live/ja.png")}
                            style={{
                              width: 14,
                              height: 14,
                              marginRight: 2,
                            }}></Image>
                        ) : rank[0]?.country === "es" ? (
                          <Image
                            source={require("../../assets/live/es.png")}
                            style={{
                              width: 14,
                              height: 14,
                              marginRight: 2,
                            }}></Image>
                        ) : rank[0]?.country === "fr" ? (
                          <Image
                            source={require("../../assets/live/fr.png")}
                            style={{
                              width: 14,
                              height: 14,
                              marginRight: 2,
                            }}></Image>
                        ) : rank[0]?.country === "id" ? (
                          <Image
                            source={require("../../assets/live/id.png")}
                            style={{
                              width: 14,
                              height: 14,
                              marginRight: 2,
                            }}></Image>
                        ) : rank[0]?.country === "zh" ? (
                          <Image
                            source={require("../../assets/live/zh.png")}
                            style={{
                              width: 14,
                              height: 14,
                              marginRight: 2,
                            }}></Image>
                        ) : (
                          <Image
                            source={require("../../assets/live/en.png")}
                            style={{
                              width: 14,
                              height: 14,
                              marginRight: 2,
                            }}></Image>
                        )}
                        <Text
                          style={{
                            fontSize: 12,
                            color: PALETTE.COLOR_BLACK,
                          }}>
                          {rank[0]?.country === "ko"
                            ? country === "ko"
                              ? `대한민국 |`
                              : country === "ja"
                                ? `日本 |`
                                : country === "es"
                                  ? `España |`
                                  : country === "fr"
                                    ? `France |`
                                    : country === "id"
                                      ? `Indonesia |`
                                      : country === "zh"
                                        ? `中国 |`
                                        : `Korea |`
                            : rank[0]?.country === "ja"
                              ? country === "ko"
                                ? `일본 | `
                                : country === "ja"
                                  ? `日本`
                                  : country === "es"
                                    ? `Japón |`
                                    : country === "fr"
                                      ? `Japon |`
                                      : country === "id"
                                        ? `Jepang |`
                                        : country === "zh"
                                          ? `日本 |`
                                          : `Japan |`
                              : rank[0]?.country === "es"
                                ? country === "ko"
                                  ? `스페인 | `
                                  : country === "ja"
                                    ? `スペイン`
                                    : country === "es"
                                      ? `España |`
                                      : country === "fr"
                                        ? `Espagne |`
                                        : country === "id"
                                          ? `Spanyol |`
                                          : country === "zh"
                                            ? `西班牙 |`
                                            : `Spain |`
                                : rank[0]?.country === "fr"
                                  ? country === "ko"
                                    ? `프랑스 | `
                                    : country === "ja"
                                      ? `フランス|`
                                      : country === "es"
                                        ? `Francia |`
                                        : country === "fr"
                                          ? `France |`
                                          : country === "id"
                                            ? `Perancis |`
                                            : country === "zh"
                                              ? `法国 |`
                                              : `France |`
                                  : rank[0]?.country === "id"
                                    ? country === "ko"
                                      ? `인도 | `
                                      : country === "ja"
                                        ? `インド`
                                        : country === "es"
                                          ? `India |`
                                          : country === "fr"
                                            ? `Inde |`
                                            : country === "id"
                                              ? `India |`
                                              : country === "zh"
                                                ? `印度 |`
                                                : `India |`
                                    : rank[0]?.country === "zh"
                                      ? country === "ko"
                                        ? `중국 | `
                                        : country === "ja"
                                          ? `中国|`
                                          : country === "es"
                                            ? `China |`
                                            : country === "fr"
                                              ? `Chine |`
                                              : country === "id"
                                                ? `Cina |`
                                                : country === "zh"
                                                  ? `中国 |`
                                                  : `China |`
                                      : country === "ko"
                                        ? `미국 | `
                                        : country === "ja"
                                          ? `アメリカ|`
                                          : country === "es"
                                            ? `Estados Unidos |`
                                            : country === "fr"
                                              ? `États-Unis |`
                                              : country === "id"
                                                ? `Amerika Serikat |`
                                                : country === "zh"
                                                  ? `美国 |`
                                                  : `USA |`}
                          {rank[0]?.age}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        width: "30%",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                      }}>
                      <TouchableOpacity
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          if (!rank[2]) return;
                          setSelectedUser(rank[2]);
                          setModalState(LIVE_CONSTANT.MODAL_STATE_PROFILE);
                        }}>
                        <View style={{ position: 'relative' }}>
                          <FastImage
                            source={{
                              uri: rank[2]?.profile,
                              priority: FastImage.priority.normal,
                            }}
                            style={{
                              width: vw(20),
                              height: vw(20),
                              borderRadius: 100,
                            }}
                            resizeMode={FastImage.resizeMode.cover}>
                            {rank[2]?.callState === CALL_TYPE.CALL_ING && (
                              <View
                                style={{
                                  position: "absolute",
                                  justifyContent: "center",
                                  alignContent: "center",
                                  alignItems: "center",
                                  width: "100%",
                                  height: "100%",
                                  zIndex: 2,
                                  backgroundColor: "rgba(0,0,0,0.4)",
                                  borderRadius: 100,
                                }}>
                                <Image
                                  source={require("../../assets/live/ing.png")}
                                  style={{
                                    width: vw(8),
                                    height: vw(8),
                                    maxWidth: 50,
                                    maxHeight: 50,
                                  }}></Image>
                                <Text
                                  style={{
                                    marginTop: 5,
                                    fontSize: 8,
                                    fontWeight: "bold",
                                    color: PALETTE.COLOR_RED,
                                  }}>
                                  {country === "ko"
                                    ? `통화중..`
                                    : country === "ja"
                                      ? `通話中...`
                                      : country === "es"
                                        ? `En llamada...`
                                        : country === "fr"
                                          ? `En communication...`
                                          : country === "id"
                                            ? `Sedang berbicara...`
                                            : country === "zh"
                                              ? `通话中...`
                                              : `In a call...`}
                                </Text>
                              </View>
                            )}
                          </FastImage>
                          <LinearGradient
                            colors={['#EDB089', '#DE764B']}
                            style={{
                              position: 'absolute',
                              top: -5,
                              left: 0,
                              width: 24,
                              height: 24,
                              borderRadius: 12,
                              justifyContent: 'center',
                              alignItems: 'center',
                              zIndex: 3,
                            }}>
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: 'bold',
                                color: 'white',
                              }}>
                              3
                            </Text>
                          </LinearGradient>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            marginTop: 10,
                          }}>
                          <Text
                            style={{
                              color: "black",
                              fontSize: 16,
                              fontWeight: "bold",
                              marginRight: 5,
                            }}
                            numberOfLines={1}>
                            {rank[2]?.nick}
                          </Text>
                          <Image
                            source={require("../../assets/setting/badge.png")}
                            style={{
                              width: 16,
                              height: 16,
                            }}></Image>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            marginBottom: 5,
                          }}>
                          {rank[2]?.country === "ko" ? (
                            <Image
                              source={require("../../assets/live/ko.png")}
                              style={{
                                width: 14,
                                height: 14,
                                marginRight: 2,
                              }}></Image>
                          ) : rank[2]?.country === "ja" ? (
                            <Image
                              source={require("../../assets/live/ja.png")}
                              style={{
                                width: 14,
                                height: 14,
                                marginRight: 2,
                              }}></Image>
                          ) : rank[2]?.country === "es" ? (
                            <Image
                              source={require("../../assets/live/es.png")}
                              style={{
                                width: 14,
                                height: 14,
                                marginRight: 2,
                              }}></Image>
                          ) : rank[2]?.country === "fr" ? (
                            <Image
                              source={require("../../assets/live/fr.png")}
                              style={{
                                width: 14,
                                height: 14,
                                marginRight: 2,
                              }}></Image>
                          ) : rank[2]?.country === "id" ? (
                            <Image
                              source={require("../../assets/live/id.png")}
                              style={{
                                width: 14,
                                height: 14,
                                marginRight: 2,
                              }}></Image>
                          ) : rank[2]?.country === "zh" ? (
                            <Image
                              source={require("../../assets/live/zh.png")}
                              style={{
                                width: 14,
                                height: 14,
                                marginRight: 2,
                              }}></Image>
                          ) : (
                            <Image
                              source={require("../../assets/live/en.png")}
                              style={{
                                width: 14,
                                height: 14,
                                marginRight: 2,
                              }}></Image>
                          )}
                          <Text
                            style={{
                              fontSize: 12,
                              color: PALETTE.COLOR_BLACK,
                            }}>
                            {rank[2]?.country === "ko"
                              ? country === "ko"
                                ? `대한민국 |`
                                : country === "ja"
                                  ? `日本 |`
                                  : country === "es"
                                    ? `España |`
                                    : country === "fr"
                                      ? `France |`
                                      : country === "id"
                                        ? `Indonesia |`
                                        : country === "zh"
                                          ? `中国 |`
                                          : `Korea |`
                              : rank[2]?.country === "ja"
                                ? country === "ko"
                                  ? `일본 | `
                                  : country === "ja"
                                    ? `日本`
                                    : country === "es"
                                      ? `Japón |`
                                      : country === "fr"
                                        ? `Japon |`
                                        : country === "id"
                                          ? `Jepang |`
                                          : country === "zh"
                                            ? `日本 |`
                                            : `Japan |`
                                : rank[2]?.country === "es"
                                  ? country === "ko"
                                    ? `스페인 | `
                                    : country === "ja"
                                      ? `スペイン`
                                      : country === "es"
                                        ? `España |`
                                        : country === "fr"
                                          ? `Espagne |`
                                          : country === "id"
                                            ? `Spanyol |`
                                            : country === "zh"
                                              ? `西班牙 |`
                                              : `Spain |`
                                  : rank[2]?.country === "fr"
                                    ? country === "ko"
                                      ? `프랑스 | `
                                      : country === "ja"
                                        ? `フランス|`
                                        : country === "es"
                                          ? `Francia |`
                                          : country === "fr"
                                            ? `France |`
                                            : country === "id"
                                              ? `Perancis |`
                                              : country === "zh"
                                                ? `法国 |`
                                                : `France |`
                                    : rank[2]?.country === "id"
                                      ? country === "ko"
                                        ? `인도 | `
                                        : country === "ja"
                                          ? `インド`
                                          : country === "es"
                                            ? `India |`
                                            : country === "fr"
                                              ? `Inde |`
                                              : country === "id"
                                                ? `India |`
                                                : country === "zh"
                                                  ? `印度 |`
                                                  : `India |`
                                      : rank[2]?.country === "zh"
                                        ? country === "ko"
                                          ? `중국 | `
                                          : country === "ja"
                                            ? `中国|`
                                            : country === "es"
                                              ? `China |`
                                              : country === "fr"
                                                ? `Chine |`
                                                : country === "id"
                                                  ? `Cina |`
                                                  : country === "zh"
                                                    ? `中国 |`
                                                    : `China |`
                                        : country === "ko"
                                          ? `미국 | `
                                          : country === "ja"
                                            ? `アメリカ|`
                                            : country === "es"
                                              ? `Estados Unidos |`
                                              : country === "fr"
                                                ? `États-Unis |`
                                                : country === "id"
                                                  ? `Amerika Serikat |`
                                                  : country === "zh"
                                                    ? `美国 |`
                                                    : `USA |`}
                            {rank[2]?.age}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
            decelerationRate={"fast"}
            renderItem={(props: any) => (
              <TouchableOpacity
                activeOpacity={0.8}
                key={props.index}
                onPress={() => {
                  setSelectedUser(props.item);
                  setModalState(LIVE_CONSTANT.MODAL_STATE_PROFILE);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  backgroundColor: (props.index + 4) % 2 === 0 ? '#F8F8F8' : '#FFFFFF',
                }}>

                {/* 순위 번호 */}
                <View style={{
                  width: 30,
                  alignItems: 'center',
                  marginRight: 15,
                }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#999',
                  }}>
                    {props.index + 4}
                  </Text>
                </View>

                {/* 프로필 이미지 */}
                <View style={{ marginRight: 15 }}>
                  <FastImage
                    removeClippedSubviews={true}
                    source={{
                      uri: props.item?.profile,
                      priority: FastImage.priority.normal,
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                    }}
                    resizeMode={FastImage.resizeMode.cover}>

                    {props.item?.callState === CALL_TYPE.CALL_ING && (
                      <View style={{
                        position: "absolute",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.4)",
                        borderRadius: 25,
                      }}>
                        <Image
                          source={require("../../assets/live/ing.png")}
                          style={{
                            width: 20,
                            height: 20,
                          }}
                        />
                        <Text style={{
                          marginTop: 2,
                          fontSize: 6,
                          fontWeight: "bold",
                          color: PALETTE.COLOR_RED,
                        }}>
                          {country === "ko"
                            ? `통화중`
                            : country === "ja"
                              ? `通話中`
                              : country === "es"
                                ? `En llamada`
                                : country === "fr"
                                  ? `En communication`
                                  : country === "id"
                                    ? `Sedang berbicara`
                                    : country === "zh"
                                      ? `通话中`
                                      : `In a call`}
                        </Text>
                      </View>
                    )}
                  </FastImage>
                </View>

                {/* 사용자 정보 */}
                <View style={{ flex: 1 }}>
                  {/* 이름과 배지 */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 5,
                  }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#333',
                      marginRight: 8,
                    }} numberOfLines={1}>
                      {props.item?.nick}
                    </Text>
                    <Image
                      source={require("../../assets/setting/badge.png")}
                      style={{
                        width: 16,
                        height: 16,
                      }}
                    />
                  </View>

                  {/* 국가 정보 */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                    {props.item?.country === "ko" ? (
                      <Image
                        source={require("../../assets/live/ko.png")}
                        style={{
                          width: 16,
                          height: 16,
                          marginRight: 6,
                        }}
                      />
                    ) : props.item?.country === "ja" ? (
                      <Image
                        source={require("../../assets/live/ja.png")}
                        style={{
                          width: 16,
                          height: 16,
                          marginRight: 6,
                        }}
                      />
                    ) : props.item?.country === "es" ? (
                      <Image
                        source={require("../../assets/live/es.png")}
                        style={{
                          width: 16,
                          height: 16,
                          marginRight: 6,
                        }}
                      />
                    ) : props.item?.country === "fr" ? (
                      <Image
                        source={require("../../assets/live/fr.png")}
                        style={{
                          width: 16,
                          height: 16,
                          marginRight: 6,
                        }}
                      />
                    ) : props.item?.country === "id" ? (
                      <Image
                        source={require("../../assets/live/id.png")}
                        style={{
                          width: 16,
                          height: 16,
                          marginRight: 6,
                        }}
                      />
                    ) : props.item?.country === "zh" ? (
                      <Image
                        source={require("../../assets/live/zh.png")}
                        style={{
                          width: 16,
                          height: 16,
                          marginRight: 6,
                        }}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/live/en.png")}
                        style={{
                          width: 16,
                          height: 16,
                          marginRight: 6,
                        }}
                      />
                    )}

                    <Text style={{
                      fontSize: 14,
                      color: '#666',
                    }} numberOfLines={1}>
                      {props.item?.country === "ko"
                        ? country === "ko"
                          ? `대한민국 |`
                          : country === "ja"
                            ? `日本 |`
                            : country === "es"
                              ? `España |`
                              : country === "fr"
                                ? `France |`
                                : country === "id"
                                  ? `Indonesia |`
                                  : country === "zh"
                                    ? `中国 |`
                                    : `Korea |`
                        : props.item?.country === "ja"
                          ? country === "ko"
                            ? `일본 | `
                            : country === "ja"
                              ? `日本 |`
                              : country === "es"
                                ? `Japón |`
                                : country === "fr"
                                  ? `Japon |`
                                  : country === "id"
                                    ? `Jepang |`
                                    : country === "zh"
                                      ? `日本 |`
                                      : `Japan |`
                          : props.item?.country === "es"
                            ? country === "ko"
                              ? `스페인 | `
                              : country === "ja"
                                ? `スペイン |`
                                : country === "es"
                                  ? `España |`
                                  : country === "fr"
                                    ? `Espagne |`
                                    : country === "id"
                                      ? `Spanyol |`
                                      : country === "zh"
                                        ? `西班牙 |`
                                        : `Spain |`
                            : props.item?.country === "fr"
                              ? country === "ko"
                                ? `프랑스 | `
                                : country === "ja"
                                  ? `フランス |`
                                  : country === "es"
                                    ? `Francia |`
                                    : country === "fr"
                                      ? `France |`
                                      : country === "id"
                                        ? `Perancis |`
                                        : country === "zh"
                                          ? `法国 |`
                                          : `France |`
                              : props.item?.country === "id"
                                ? country === "ko"
                                  ? `인도네시아 | `
                                  : country === "ja"
                                    ? `インドネシア |`
                                    : country === "es"
                                      ? `Indonesia |`
                                      : country === "fr"
                                        ? `Indonésie |`
                                        : country === "id"
                                          ? `Indonesia |`
                                          : country === "zh"
                                            ? `印度尼西亚 |`
                                            : `Indonesia |`
                                : props.item?.country === "zh"
                                  ? country === "ko"
                                    ? `중국 | `
                                    : country === "ja"
                                      ? `中国 |`
                                      : country === "es"
                                        ? `China |`
                                        : country === "fr"
                                          ? `Chine |`
                                          : country === "id"
                                            ? `Cina |`
                                            : country === "zh"
                                              ? `中国 |`
                                              : `China |`
                                  : country === "ko"
                                    ? `미국 | `
                                    : country === "ja"
                                      ? `アメリカ |`
                                      : country === "es"
                                        ? `Estados Unidos |`
                                        : country === "fr"
                                          ? `États-Unis |`
                                          : country === "id"
                                            ? `Amerika Serikat |`
                                            : country === "zh"
                                              ? `美国 |`
                                              : `USA |`}
                      {props.item?.age}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
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
