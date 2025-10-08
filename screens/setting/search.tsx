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
import { ToastComponent } from "../reusable/useToast";
import { USER_GENDER } from "../../lib/constant/user-constant";
import APP_VERSION from "../../lib/constant/APP_VERSION";

export default function Search({
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
  const [gender, setGender] = useState(
    user?.gender === USER_GENDER.GIRL ? USER_GENDER.BOY : USER_GENDER.GIRL,
  );
  const [searchList, setSearchList] = useState([]);
  const [searchSuccess, setSearchSuccess] = useState(true);
  const [suggestionList, setSuggestionList] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        await api
          .get("/user/suggestionList", {
            params: {
              APP_VERSION,
              pageNum: 0,
              pageSize: 6,
              country,
              global,
              gender,
              platform: Platform.OS,
            },
          })
          .then(res => {
            setSuggestionList(res.data?.suggestionList);
          });
      } catch (err) { }
    }
    fetchData();
  }, []);
  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["top"]}>
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
                marginTop: vh(1),
                marginLeft: vw(4),
                marginRight: vw(4),
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
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
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  source={require("../../assets/setting/back.png")}></Image>
              </TouchableOpacity>
              <View
                style={{
                  paddingLeft: vw(2),
                  paddingRight: vw(2),
                  borderRadius: 10,
                  backgroundColor: PALETTE.COLOR_BACK,
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  flex: 1,
                  marginRight: 10,
                  marginLeft: 5,
                }}>
                <TextInput
                  style={{
                    paddingTop: 12,
                    paddingBottom: 12,
                    height: "100%",
                    color: "black",

                  }}
                  placeholderTextColor="#999999"
                  //onSear
                  //keyboardType="web-search"
                  numberOfLines={1}
                  value={keyword}
                  onChangeText={e => {
                    setKeyword(e);
                  }}
                  placeholder={
                    country === "ko"
                      ? "이름 혹은 @아이디를 입력해주세요..."
                      : country === "ja"
                        ? "名前または@IDを入力してください..."
                        : country === "es"
                          ? "Por favor, ingrese un nombre o @ID..."
                          : country === "fr"
                            ? "Veuillez entrer un nom ou un @ID..."
                            : country === "id"
                              ? "Silakan masukkan nama atau @ID..."
                              : country === "zh"
                                ? "请输入姓名或@ID..."
                                : "Please enter a name or @ID..."
                  }></TextInput>
              </View>
              <TouchableOpacity
                style={{
                  //backgroundColor: PALETTE.COLOR_NAVY,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: PALETTE.COLOR_WHITE,
                  width: 40,
                  height: 40,
                }}
                onPress={async () => {
                  if (keyword === "" || !keyword) {
                    return;
                  }
                  Keyboard.dismiss();
                  await api
                    .get("/user/searchUser", {
                      params: {
                        keyword,
                      },
                    })
                    .then(res => {
                      if (res.data?.searchList.length < 1) {
                        setSearchSuccess(false);
                      } else setSearchSuccess(true);
                      setSearchList(res.data?.searchList);
                    });
                  setKeyword("");
                }}>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                  }}
                  source={require("../../assets/nav/search_new.png")}></Image>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{
                paddingLeft: vw(4),
                paddingRight: vw(4),
                marginTop: vh(2),
              }}>
              {searchSuccess === false && (
                <View
                  style={{
                    height: 200,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <Text
                    style={{
                      color: "#838383",
                    }}>
                    {country === "ko"
                      ? "검색 결과가 없습니다."
                      : country === "ja"
                        ? "検索結果がありません。"
                        : country === "es"
                          ? "No hay resultados de búsqueda."
                          : country === "fr"
                            ? "Aucun résultat de recherche."
                            : country === "id"
                              ? "Hasil pencarian tidak ditemukan."
                              : country === "zh"
                                ? "没有搜索结果。"
                                : "No search results found."}
                  </Text>
                </View>
              )}
              {searchList.map((list: any, idx) => (
                <TouchableOpacity
                  activeOpacity={1}
                  key={list?.id}
                  onPress={async () => {
                    navigation.navigate("Profile", {
                      YouId: list?.id,
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
                      uri: list?.profile,
                      priority: FastImage.priority.normal,
                    }}
                    style={{
                      width: 50,
                      height: 50,
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
                      {list?.nick}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: "black",
                      }}>
                      {list?.link}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: "flex-end",
                    }}></View>
                </TouchableOpacity>
              ))}
              {suggestionList.map((list: any, idx) => (
                <TouchableOpacity
                  activeOpacity={1}
                  key={list?.id}
                  onPress={async () => {
                    navigation.navigate("Profile", {
                      YouId: list?.id,
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
                      uri: list?.profile,
                      priority: FastImage.priority.normal,
                    }}
                    style={{
                      width: 50,
                      height: 50,
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
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontWeight: "bold",
                          marginBottom: 5,
                          color: "black",
                        }}>
                        {list?.nick}
                      </Text>
                      <Image
                        source={require("../../assets/setting/badge.png")}
                        style={{
                          width: 16,
                          height: 16,
                          marginLeft: 1, // 텍스트와 이미지 사이 간격
                          marginTop: -5, 
                        }}
                      />
                    </View>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: "black",
                      }}>
                      {list?.link}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: "flex-end",
                    }}></View>
                </TouchableOpacity>
              ))}
              <View
                style={{
                  height: vh(5),
                }}></View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </NotchView>
  );
}
