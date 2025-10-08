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
  Switch,
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
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ToastComponent} from "../reusable/useToast";

export default function VideoCallPrice({
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
  const [callPrice, setCallPrice]: any = useState(1000);

  useEffect(() => {
    async function fetchData() {
      try {
        await api.get("/call/getMyCallPrice").then(res => {
          setCallPrice(res.data.callPrice);
        });
      } catch (err) {}
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
                  ? "영상통화 가격 설정"
                  : country === "ja"
                  ? "ビデオ通話価格設定"
                  : country === "es"
                  ? "Configuración de precios de videollamadas"
                  : country === "fr"
                  ? "Paramètres de tarification des appels vidéo"
                  : country === "id"
                  ? "Setelan harga panggilan video"
                  : country === "zh"
                  ? "视频通话定价设置"
                  : "Video call pricing settings"}
              </Text>
            </View>
            <View
              style={{
                width: 30,
                height: 30,
              }}></View>
          </View>
        </View>
        <View
          style={{
            paddingLeft: vw(4),
            paddingRight: vw(4),
            marginTop: vh(2),
          }}>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: vh(2),
              width: "100%",
            }}>
            <Text
              style={{
                color: "black",
              }}>
              {country === "ko"
                ? "영상통화 30초당 가격"
                : country === "ja"
                ? "ビデオ通話30秒あたりの価格"
                : country === "es"
                ? "Precio por 30 segundos de videollamada"
                : country === "fr"
                ? "Prix ​​par 30 secondes d'appel vidéo"
                : country === "id"
                ? "Harga per 30 detik panggilan video"
                : country === "zh"
                ? "每 30 秒视频通话的价格"
                : "Price per 30 seconds of video call"}
            </Text>

            <TextInput
              value={callPrice.toString()}
              onBlur={e => {
                if (callPrice < 1000) {
                  setCallPrice(1000);
                } else if (callPrice > 5000) {
                  setCallPrice(5000);
                } else {
                  setCallPrice(Math.floor(callPrice / 1000) * 1000);
                }
              }}
              onChangeText={e => {
                /*
                if (Number(e) <= 1000) {
                  setCallPrice(1000);
                  return;
                } 
                else
                */
                if (Number(e) > 5000) {
                  setCallPrice(50000);
                  return;
                } else if (Number(e) >= 1000) {
                  setCallPrice(Number(Math.floor(Number(e) / 1000) * 1000));
                } else {
                  setCallPrice(Number(e));
                }
              }}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: PALETTE.COLOR_BORDER,
                paddingBottom: vh(1),
                paddingTop: vh(1),
                fontSize: 16,
                textAlign: "right",
                width: 150,
                color: "black",
              }}
            />
          </View>
          <View
            style={{
              marginTop: vh(2),
              marginBottom: vh(2),
              backgroundColor: PALETTE.COLOR_BACK,
              padding: 20,
              borderRadius: 20,
            }}>
            <Text
              style={{
                color: PALETTE.COLOR_BLACK,
              }}>
              {country === "ko"
                ? "신규회원에게 2,000원 이하의 영상통화 가격에게 영상통화 티켓을 지급 중입니다."
                : country === "ja"
                ? "新規会員に2,000ウォン以下のビデオ通話価格に対してビデオ通話チケットを提供中です。"
                : country === "es"
                ? "Estamos ofreciendo boletos de videollamada a nuevos miembros para precios de videollamadas de hasta 2,000 won."
                : country === "fr"
                ? "Nous offrons des billets de visioconférence aux nouveaux membres pour un prix de visioconférence inférieur à 2 000 wons."
                : country === "id"
                ? "Kami sedang memberikan tiket panggilan video kepada anggota baru untuk harga panggilan video di bawah 2.000 won."
                : country === "zh"
                ? "我们正在向新会员发放视频通话票，价格在2000韩元以下。"
                : "We are offering video call tickets to new members for video call prices under 2,000 won."}
            </Text>
            <Text
              style={{
                marginTop: vh(1),
                color: PALETTE.COLOR_RED,
              }}>
              {country === "ko"
                ? "영상통화 가격은 2,000원 이하가 가장 좋습니다!"
                : country === "ja"
                ? "ビデオ通話の価格は2,000ウォン以下が最適です！"
                : country === "es"
                ? "¡El precio de la videollamada es mejor si es inferior a 2,000 won!"
                : country === "fr"
                ? "Le prix de la visioconférence est préférable s'il est inférieur à 2 000 wons!"
                : country === "id"
                ? "Harga panggilan video sebaiknya di bawah 2.000 won!"
                : country === "zh"
                ? "视频通话的价格最好在2000韩元以下！"
                : "The video call price is best if it’s under 2,000 won!"}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              marginTop: vh(2),
            }}
            onPress={async e => {
              if (isNaN(callPrice)) {
                Alert.alert(
                  country === "ko"
                    ? "올바른 금액을 입력해주세요"
                    : country === "ja"
                    ? "正しい金額を入力してください"
                    : country === "es"
                    ? "Por favor, ingrese una cantidad correcta"
                    : country === "fr"
                    ? "Veuillez entrer un montant correct"
                    : country === "id"
                    ? "Silakan masukkan jumlah yang benar"
                    : country === "zh"
                    ? "请输入正确的金额"
                    : "Please enter the correct amount",
                );
                return;
              }
              if (Number(callPrice) < 1000) {
                Alert.alert(
                  country === "ko"
                    ? `최소 가격 설정은 1,000 포인트 입니다.`
                    : country === "ja"
                    ? `最小価格設定は1,000ポイントです。`
                    : country === "es"
                    ? `El precio mínimo fijado es de 1.000 puntos.`
                    : country === "fr"
                    ? `Le prix minimum fixé est de 1 000 points.`
                    : country === "id"
                    ? `Pengaturan harga minimum adalah 1.000 poin.`
                    : country === "zh"
                    ? `最低价格设置为 1,000 点。`
                    : `The minimum price setting is 1,000 points.`,
                );

                return;
              }
              await api
                .put("/call/changeCallPrice", {
                  callPrice,
                })
                .then(res => {
                  if (res.data.status === "true") {
                    Alert.alert(
                      country === "ko"
                        ? `변경 되었습니다.`
                        : country === "ja"
                        ? `変更されました。`
                        : country === "es"
                        ? `Ha cambiado.`
                        : country === "fr"
                        ? `Cela a changé.`
                        : country === "id"
                        ? `Itu telah berubah.`
                        : country === "zh"
                        ? `它已经改变了。`
                        : `It has changed.`,
                    );
                  } else if (res.data.status === "price") {
                    Alert.alert(
                      country === "ko"
                        ? "최대금액은 5천원으로 설정 할 수 있습니다."
                        : country === "ja"
                        ? "最大金額は5000ウォンに設定できます。"
                        : country === "es"
                        ? "El monto máximo se puede configurar en 5,000 won."
                        : country === "fr"
                        ? "Le montant maximum peut être fixé à 5 000 wons."
                        : country === "id"
                        ? "Jumlah maksimum dapat diatur hingga 5.000 won."
                        : country === "zh"
                        ? "最高金额可以设置为5000韩元。"
                        : "The maximum amount can be set to 5,000 won.",
                    );
                  } else {
                    Alert.alert(
                      country === "ko"
                        ? `오류 발생`
                        : country === "ja"
                        ? `エラーが発生しました`
                        : country === "es"
                        ? `Error ocurrido`
                        : country === "fr"
                        ? `Erreur détectée`
                        : country === "id"
                        ? `Kesalahan terjadi`
                        : country === "zh"
                        ? `发生错误`
                        : `Error occurred`,
                      country === "ko"
                        ? `다시 시도해주세요`
                        : country === "ja"
                        ? `もう一度試してください`
                        : country === "es"
                        ? `Inténtelo de nuevo`
                        : country === "fr"
                        ? `Réessayez`
                        : country === "id"
                        ? `Coba lagi`
                        : country === "zh"
                        ? `请再试一次`
                        : `Please try again`,
                    );
                  }
                });
            }}>
            <Text
              style={{
                color: PALETTE.COLOR_SKY,
              }}>
              {country === "ko"
                ? "저장"
                : country === "ja"
                ? "保存"
                : country === "es"
                ? "ahorrar"
                : country === "fr"
                ? "sauvegarder"
                : country === "id"
                ? "menyimpan"
                : country === "zh"
                ? "节省"
                : "save"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </NotchView>
  );
}
