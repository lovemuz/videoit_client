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
import ReactNativeZoomableView from "@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView";
import GestureRecognizer from "react-native-swipe-gestures";
import FastImage from "react-native-fast-image";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Modal from "react-native-modal";
import EncryptedStorage from "react-native-encrypted-storage";

export default function ImageModal({
  imgUrl,
  isVisible,
  setIsVisible,
  screenModal,
  country,
  modalText,
  setModalText,
}: {
  country: any;
  imgUrl: any;
  isVisible: any;
  setIsVisible: any;
  screenModal: any;
  modalText?: any;
  setModalText?: any;
}): JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    if (Platform.OS === "android") {
      const backAction = () => {
        if (isVisible) {
          setIsVisible(false);
          return true;
        } else return false;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );

      return () => backHandler.remove();
    }
  }, [isVisible]);

  return (
    <Modal
      animationIn="slideInUp"
      animationOut={"slideInDown"}
      swipeDirection="down"
      onSwipeComplete={() => {
        setIsVisible(false);
        setModalText(null);
      }}
      isVisible={isVisible}
      //animationOutTiming
      onBackButtonPress={() => {
        setIsVisible(false);
        setModalText(null);
      }}
      style={{
        position: "absolute",
        width: vw(100),
        marginLeft: 0,
        marginTop: 0,
        marginBottom: 0,
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: PALETTE.COLOR_BLACK,
          paddingTop: screenModal ? vh(2) : insets.top,
          paddingBottom: screenModal ? vh(2) : insets.bottom,
          height: vh(100),
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}>
        <View
          style={{
            marginBottom: 20,
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            paddingLeft: vw(4),
            paddingRight: vw(4),
            width: "100%",
          }}>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              marginRight: 20,
            }}
            onPress={() => {
              setIsVisible(false);
              setModalText(null);
            }}>
            <Image
              source={require("../../assets/live/closeW.png")}
              style={{
                width: 25,
                height: 25,
              }}></Image>
          </TouchableOpacity>
          <View>
            <Text
              style={{
                color: PALETTE.COLOR_WHITE,
                fontSize: 12,
              }}>
              {country === "ko"
                ? `무단으로 해당 자료를 캡쳐 혹은 유포할 경우`
                : country === "ja"
                ? `無断で該当データをキャプチャーまたは共有する場合`
                : country === "es"
                ? `En caso de capturar o compartir este material sin autorización`
                : country === "fr"
                ? `En cas de capture ou de diffusion non autorisée de ces données`
                : country === "id"
                ? `Jika menangkap atau berbagi materi ini tanpa izin`
                : country === "zh"
                ? `未经许可捕捉或分享此材料的情况下`
                : `Unauthorized capture or sharing of this material`}
            </Text>
            <Text
              style={{
                color: PALETTE.COLOR_RED,
                fontSize: 12,
              }}>
              {country === "ko"
                ? `추적시스템에 의하여 수사 대상이 될 수 있습니다.`
                : country === "ja"
                ? `トラッキングシステムによって捜査対象となる可能性があります。`
                : country === "es"
                ? `Puede ser objeto de investigación mediante un sistema de seguimiento.`
                : country === "fr"
                ? `Vous pourriez faire l'objet d'une enquête grâce à un système de suivi.`
                : country === "id"
                ? `Anda mungkin menjadi sasaran penyelidikan melalui sistem pelacakan.`
                : country === "zh"
                ? `您可能会因跟踪系统而成为调查对象。`
                : `You may be subject to investigation through a tracking system.`}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}>
          <ReactNativeZoomableView
            maxZoom={3}
            minZoom={0.5}
            zoomStep={0.5}
            initialZoom={1}>
            <FastImage
              source={{
                uri: imgUrl,
                priority: FastImage.priority.normal,
              }}
              style={{
                flex: 1,
                width: vw(100),
                height: vh(100),
              }}
              resizeMode={FastImage.resizeMode.contain}></FastImage>
          </ReactNativeZoomableView>
        </View>
        {modalText && (
          <View
            style={{
              position: "absolute",
              bottom: vh(0),
              width: vw(92),
              height: vh(12),
              backgroundColor: "rgba(30,30,30,0.8)",
              borderRadius: 15,
              padding: 10,
            }}>
            <Text
              numberOfLines={3}
              style={{
                color: "white",
              }}>
              {modalText}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}
