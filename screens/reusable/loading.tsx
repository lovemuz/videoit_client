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
  ActivityIndicator,
} from "react-native";
import {NotchProvider, NotchView} from "react-native-notchclear";
import AsyncStorage from "@react-native-async-storage/async-storage";

import serverURL from "../../lib/constant/serverURL";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {vw, vh, vmin, vmax} from "react-native-css-vh-vw";
import {useNavigation, useRoute} from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import {PALETTE} from "../../lib/constant/palette";

export default function Loading({}): JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 19,
        width: vw(100),
        height: Platform.OS === "android" ? vh(105) : vh(100),
        backgroundColor: "rgba(0,0,0,0.6)",
      }}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}
