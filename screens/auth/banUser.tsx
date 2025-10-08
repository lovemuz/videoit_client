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

export default function BanUser({
  FCMToken,
  country,
  navigation,
  route,
  chatPlus,
  setChatPlus,
  appState,
  user,
  updateUser,
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
  user: any;
  updateUser: any;
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
  navigation?: any;
  route?: any;
  appState?: any;
}): JSX.Element {
  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["top", "bottom"]}>
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
            }}></View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </NotchView>
  );
}
