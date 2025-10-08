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

export default function Donation({
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
  const [firstRender, setFirstRender] = useState(false);
  const YouId = route?.params?.YouId;

  const [secondRender, setSecondRender] = useState(false);

  const pageNum2: any = useRef(0);
  const pageSize2: any = useRef(30);
  const insets = useSafeAreaInsets();
  const [refreshing2, setRefreshing2] = React.useState(false);

  const [rankList, setRankList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        await api
          .get("/room/getMyDonation", {
            params: {
              pageNum: 0,
              pageSize: pageSize2.current,
              YouId,
            },
          })
          .then(res => {
            if (res.data.rankList) {
              pageNum2.current = 1;
              setRankList(res.data.rankList);
              setSecondRender(true);
            }
          }); //
      } catch (err) {}
    }
    fetchData();
  }, []);

  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["left"]}>
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
                  ? "후원 순위"
                  : country === "ja"
                  ? "支援ランキング"
                  : country === "es"
                  ? "Clasificación de patrocinadores"
                  : country === "fr"
                  ? "Classement des sponsors"
                  : country === "id"
                  ? "Peringkat sponsor"
                  : country === "zh"
                  ? "赞助排名"
                  : "Sponsorship ranking"}
              </Text>
            </View>
            <View
              style={{
                width: 30,
                height: 30,
              }}></View>
          </View>
        </View>
        {rankList?.length > 0 && secondRender && (
          <ScrollView
            onScrollEndDrag={async e => {
              await api
                .get("/room/getMyDonation", {
                  params: {
                    pageNum: pageNum2.current,
                    pageSize: pageSize2.current,
                    YouId,
                  },
                })
                .then(res => {
                  if (res.data.rankList) {
                    pageNum2.current = pageNum2.current + 1;
                    setRankList(rankList.concat(res.data.rankList));
                  }
                }); //
            }}
            contentContainerStyle={{
              paddingLeft: vw(4),
              paddingRight: vw(4),
              paddingBottom: vh(4),
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            decelerationRate={"fast"}>
            {rankList?.map((props: any, idx: number) => (
              <TouchableOpacity
                activeOpacity={1}
                key={idx}
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
                    uri: props?.User?.profile,
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
                    {props?.User?.nick}
                  </Text>
                </View>
                <View
                  style={
                    props?.index <= 2
                      ? {
                          alignItems: "flex-end",
                        }
                      : {
                          width: 40,
                          height: 40,
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                        }
                  }>
                  {idx === 0 ? (
                    <Image
                      source={require("../../assets/chat/medal1.png")}
                      style={{
                        width: 40,
                        height: 40,
                      }}></Image>
                  ) : idx === 1 ? (
                    <Image
                      source={require("../../assets/chat/medal2.png")}
                      style={{
                        width: 40,
                        height: 40,
                      }}></Image>
                  ) : idx === 2 ? (
                    <Image
                      source={require("../../assets/chat/medal3.png")}
                      style={{
                        width: 40,
                        height: 40,
                      }}></Image>
                  ) : (
                    <Text
                      style={{
                        color: "black",
                        fontSize: 20,
                        fontWeight: "bold",
                      }}>
                      {Number(idx + 1)}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </NotchView>
  );
}
