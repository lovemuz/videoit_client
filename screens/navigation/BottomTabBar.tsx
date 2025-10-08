import React, { useEffect, useState } from "react";

import {
  View,
  Pressable,
  Dimensions,
  StyleSheet,
  Text,
  Image,
  Platform,
} from "react-native";
import { PALETTE } from "../../lib/constant/palette";
//import NavigationIcon from './navigationIcon';
import { vw, vh, vmin, vmax } from "react-native-css-vh-vw";
import { useScrollToTop } from "@react-navigation/native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotchProvider, NotchView } from "react-native-notchclear";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../../lib/api/api";

const { width } = Dimensions.get("window");

const BottomTabBar = ({
  state,
  descriptors,
  navigation,
  chatCount,
  setChatCount,
  country,
}: any) => {
  const ref = React.useRef(null);
  const insets = useSafeAreaInsets();

  const bottomInfoList = [
    {
      id: 0,
      url: require("../../assets/nav/homeG.png"),
      urlFocus: require("../../assets/nav/homeB.png"),
      name:
        country === "ko"
          ? "VIDEO IT"
          : country === "ja"
            ? "VIDEO IT"
            : country === "es"
              ? "VIDEO IT"
              : country === "fr"
                ? "VIDEO IT"
                : country === "id"
                  ? "VIDEO IT"
                  : country === "zh"
                    ? "VIDEO IT"
                    : "VIDEO IT",
    },
    {
      id: 1,
      url: require("../../assets/nav/rankG.png"),
      urlFocus: require("../../assets/nav/rankB.png"),
      name:
        country === "ko"
          ? "랭킹"
          : country === "ja"
            ? "ランク"
            : country === "es"
              ? "Rango"
              : country === "fr"
                ? "Rang"
                : country === "id"
                  ? "Peringkat"
                  : country === "zh"
                    ? "等级"
                    : "Rank",
    },
    {
      id: 2,
      url: require("../../assets/nav/chatG.png"),
      urlFocus: require("../../assets/nav/chatB.png"),
      name:
        country === "ko"
          ? "메시지"
          : country === "ja"
            ? "メッセージ"
            : country === "es"
              ? "Mensaje"
              : country === "fr"
                ? "Message"
                : country === "id"
                  ? "Pesan"
                  : country === "zh"
                    ? "消息"
                    : "Message",
    },
    {
      id: 3,
      url: require("../../assets/nav/userG.png"),
      urlFocus: require("../../assets/nav/userB.png"),
      name:
        country === "ko"
          ? "설정"
          : country === "ja"
            ? "設定"
            : country === "es"
              ? "Configuración"
              : country === "fr"
                ? "Paramètres"
                : country === "id"
                  ? "Pengaturan"
                  : country === "zh"
                    ? "设置"
                    : "Settings",
    },
  ];

  return (
    <View
      style={{
        borderTopColor: PALETTE.COLOR_BACK,
        borderTopWidth: 0.5,
        height: vh(6) + insets.bottom,
        paddingBottom: insets.bottom,
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: PALETTE.COLOR_WHITE,
        bottom: 0,
        position: "absolute",
      }}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <View
            key={index}
            style={{
              width: vw(20),
              height: "100%",
            }}>
            <Pressable
              onPress={onPress}
              style={{
                width: "100%",
                height: "100%",
                //backgroundColor: isFocused ? "#030D16" : "#182028",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}>
              <View
                style={{
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  flex: 1,
                  alignContent: "center",
                }}>
                <Image
                  source={
                    isFocused
                      ? bottomInfoList[index].urlFocus
                      : bottomInfoList[index].url
                  }
                  style={{
                    width: vh(3),
                    height: vh(3),
                  }}></Image>
                <Text
                  style={{
                    fontSize: Platform.OS === "ios" ? 10 : 8,
                    color: isFocused ? PALETTE.COLOR_BROWN : PALETTE.COLOR_ICON,
                  }}>
                  {bottomInfoList[index].name}
                </Text>
                {chatCount > 0 && index === 3 && (
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderRadius: 100,
                      position: "absolute",
                      zIndex: 3,
                      width: 6,
                      height: 6,
                      backgroundColor: "red",
                      top: 2,
                      right: -6,
                    }}></View>
                )}
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

export default BottomTabBar;
