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
  ActivityIndicator,
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
import {launchCamera, launchImageLibrary} from "react-native-image-picker";
import axios from "axios";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ToastComponent} from "../reusable/useToast";
import {Picker} from "@react-native-picker/picker";
import {CHAT_TYPE} from "../../lib/constant/chat-constant";
import {POST_TYPE} from "../../lib/constant/post-constant";
import {createThumbnail} from "react-native-create-thumbnail";
import DatePicker from "react-native-date-picker";

export default function AllChat({
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
  const [content, setContent] = useState("");
  const [url, setUrl]: any = useState(null);
  const [urlFormData, setUrlFormData] = useState(null);
  const [thumbnailFormData, setThumbnailFormData] = useState(null);
  //const [free, setFree] = useState(false);
  const [lock, setLock] = useState(false);
  const [adult, setAdult] = useState(false);
  //const [contentSecret, setContentSecret] = useState(false);
  const [price, setPrice] = useState(1000);

  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  //const [possibleStep, setPossibleStep]: any = useState(null);
  //const [step, setStep] = useState(11);
  const [urlType, setUrlType] = useState(null);
  const [time, setTime] = useState(null);
  const [timePossible, setTimePossible] = useState(false);
  const [purchasePossibledAt, setPurchasePossibledAt]: any = useState(
    new Date(),
  );
  const [modal, setModal] = useState(false);
  const [toWhom, setToWhom] = useState("follow"); //'follow','all','subscribe'

  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["bottom"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={Platform.OS === "ios" ? "light-content" : "dark-content"}
      />

      {loading === true && (
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "absolute",
            width: vw(100),
            height: vh(100),
            zIndex: 3,
          }}>
          <ActivityIndicator size={"large"} color="white"></ActivityIndicator>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
        }}
        //keyboardVerticalOffset={vh(6.5)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    marginRight: -20,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "black",
                      fontWeight: "400",
                      fontSize: 16,
                    }}>
                    {country === "ko"
                      ? "전체 채팅"
                      : country === "ja"
                      ? "フルチャット"
                      : country === "es"
                      ? "chat completo"
                      : country === "fr"
                      ? "discussion complète"
                      : country === "id"
                      ? "obrolan penuh"
                      : country === "zh"
                      ? "完整聊天"
                      : "full chat"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    //backgroundColor: "red",
                    height: "100%",
                    paddingLeft: 20,
                  }}
                  onPress={async e => {
                    if (!url && !content) {
                      Alert.alert(
                        country === "ko"
                          ? "내용 혹은 사진, 영상을 입력 해주세요."
                          : country === "ja"
                          ? "内容や写真、映像を入力してください。"
                          : country === "es"
                          ? "Por favor ingrese contenido, fotos o video."
                          : country === "fr"
                          ? "Veuillez saisir du contenu, des photos ou une vidéo."
                          : country === "id"
                          ? "Silakan masukkan konten, foto, atau video."
                          : country === "zh"
                          ? "请输入内容、照片或视频。"
                          : "Please enter content, photos, or video.",
                      );
                      return;
                    }

                    if (url && lock && price < 100) {
                      Alert.alert(
                        country === "ko"
                          ? "채팅 가격은 100P 보다 높아야 합니다."
                          : country === "ja"
                          ? "チャット価格は100Pより高くなければなりません。"
                          : country === "es"
                          ? "El precio del chat debe ser superior a 100P."
                          : country === "fr"
                          ? "Le prix du chat doit être supérieur à 100P."
                          : country === "id"
                          ? "Harga chat harus lebih tinggi dari 100P."
                          : country === "zh"
                          ? "聊天价格必须高于100P。"
                          : "Chat price must be higher than 100P.",
                      );
                      return;
                    }
                    setLoading(true);

                    let profileURL: any;
                    let thumbnail: any;
                    if (urlFormData) {
                      if (urlType === "video") {
                        await api
                          .post(`/etc/addImgSecureImage/auth`, urlFormData, {
                            headers: {"Content-Type": "multipart/form-data"},
                          })
                          .then(async res => {
                            profileURL = res.data.url;
                          });
                        await api
                          .post(
                            `/etc/addImgSecureImage/auth`,
                            thumbnailFormData,
                            {
                              headers: {"Content-Type": "multipart/form-data"},
                            },
                          )
                          .then(async res => {
                            thumbnail = res.data.url;
                          });
                      } else if (urlType === "image") {
                        await api
                          .post(`/etc/addImgSecureImage/auth`, urlFormData, {
                            headers: {"Content-Type": "multipart/form-data"},
                          })
                          .then(async res => {
                            profileURL = res.data.url;
                          });
                      }
                    }
                    await api
                      .post("/chat/createAllChat", {
                        type:
                          urlType === "video"
                            ? CHAT_TYPE.CHAT_VIDEO
                            : urlType === "image"
                            ? CHAT_TYPE.CHAT_IMAGE
                            : CHAT_TYPE.CHAT_NORMAL,
                        content,
                        url: profileURL,
                        lock,
                        cost: !lock ? 0 : price,
                        thumbnail,
                        adult,
                        toWhom,
                        purchasePossibledAt: !lock ? null : purchasePossibledAt,
                        timePossible: !lock ? false : timePossible,
                      })
                      .then(res => {
                        if (res.data.status === "true") {
                          const realRoom = res.data.realRoom;
                          Alert.alert(
                            country === "ko"
                              ? "채팅 전송이 완료되었습니다."
                              : country === "ja"
                              ? "チャット転送が完了しました。"
                              : country === "es"
                              ? "La transferencia del chat se ha completado."
                              : country === "fr"
                              ? "Le transfert du chat est terminé."
                              : country === "id"
                              ? "Transfer obrolan telah selesai."
                              : country === "zh"
                              ? "聊天转移已完成。"
                              : "Chat transfer has been completed.",
                          );
                          updateRoom(realRoom);
                          //채팅 보내고 나서 어떻게 해야할지 생객하기
                          navigation.goBack();
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
                    setLoading(false);
                  }}>
                  <Text
                    style={{
                      color: PALETTE.COLOR_SKY,
                      fontWeight: "400",
                    }}>
                    {country === "ko"
                      ? "전송"
                      : country === "ja"
                      ? "転送"
                      : country === "es"
                      ? "enviar"
                      : country === "fr"
                      ? "envoyer"
                      : country === "id"
                      ? "mengirim"
                      : country === "zh"
                      ? "发送"
                      : "send"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              enableAutomaticScroll={true}>
              <ScrollView
                style={{
                  paddingLeft: vw(4),
                  paddingRight: vw(4),
                }}>
                <View
                  style={{
                    marginTop: vh(2),
                  }}>
                  <Text
                    style={{
                      fontWeight: "400",
                      fontSize: 18,
                      color: "black",
                    }}>
                    보낼 대상
                  </Text>
                  <View
                    style={{
                      marginTop: vh(2),
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                    }}>
                    <TouchableOpacity
                      style={{
                        borderRadius: 10,
                        width: 70,
                        height: 40,
                        backgroundColor: PALETTE.COLOR_BACK,
                        borderWidth: toWhom === "follow" ? 1 : 0,
                        borderColor: "black",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        marginRight: vw(2),
                      }}
                      onPress={() => {
                        setToWhom("follow");
                      }}>
                      <Text
                        style={{
                          color: "black",
                        }}>
                        팔로우
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        borderRadius: 10,
                        width: 70,
                        height: 40,
                        backgroundColor: PALETTE.COLOR_BACK,
                        borderWidth: toWhom === "subscribe" ? 1 : 0,
                        borderColor: "black",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setToWhom("subscribe");
                      }}>
                      <Text
                        style={{
                          color: "black",
                        }}>
                        구독자
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TextInput
                  multiline={true}
                  style={{
                    color: "black",
                    marginTop: vh(4),
                  }}
                  value={content}
                  onChangeText={e => {
                    setContent(e);
                  }}
                  placeholderTextColor="#a4a4a4"
                  placeholder={
                    country === "ko"
                      ? "내용을 입력하세요..."
                      : country === "ja"
                      ? "内容を入力してください..."
                      : country === "es"
                      ? "Por favor, introduce el contenido..."
                      : country === "fr"
                      ? "Veuillez entrer le contenu..."
                      : country === "id"
                      ? "Silakan masukkan kontennya..."
                      : country === "zh"
                      ? "请输入内容..."
                      : "Please enter the content..."
                  }></TextInput>

                {url ? (
                  <TouchableOpacity activeOpacity={1}>
                    {urlType === "video" ? (
                      <>
                        <Video
                          controls={true}
                          paused={true}
                          source={{
                            uri: url,
                          }}
                          style={{
                            marginTop: 20,
                            width: vw(100),
                            height: vw(100),
                            marginLeft: -vw(4),
                          }}></Video>
                        <TouchableOpacity
                          style={{
                            marginTop: 20,
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            width: 35,
                            height: 35,
                            borderRadius: 100,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            position: "absolute",
                            right: vw(4),
                            top: vw(4),
                          }}
                          onPress={() => {
                            setUrl(null);
                            setUrlFormData(null);
                            //setFree(false);
                            setPrice(0);
                            //setContentSecret(false);
                            setAdult(false);
                          }}>
                          <Image
                            source={require("../../assets/home/close.png")}
                            style={{
                              width: 25,
                              height: 25,
                            }}></Image>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <ImageBackground
                        source={{uri: url}}
                        style={{
                          marginTop: 20,
                          width: vw(100),
                          height: vw(100),
                          marginLeft: -vw(4),
                        }}>
                        <TouchableOpacity
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            width: 35,
                            height: 35,
                            borderRadius: 100,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            position: "absolute",
                            right: vw(4),
                            top: vw(4),
                          }}
                          onPress={() => {
                            setUrl(null);
                            setUrlFormData(null);
                            //setFree(false);
                            setPrice(0);
                            setAdult(false);
                          }}>
                          <Image
                            source={require("../../assets/home/close.png")}
                            style={{
                              width: 25,
                              height: 25,
                            }}></Image>
                        </TouchableOpacity>
                      </ImageBackground>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      marginTop: 20,
                    }}
                    onPress={async e => {
                      const result: any = await launchImageLibrary({
                        mediaType: "mixed", //'mixed',
                        maxHeight: 800,
                        videoQuality: "medium",
                        quality: 0.6,
                      });
                      if (result.didCancel === true) return;
                      //setLoadingState(true);

                      const typeResult = result.assets[0].type.slice(0, 5);
                      if (typeResult !== "video" && typeResult !== "image") {
                        Alert.alert(
                          country === "ko"
                            ? `사진/동영상 만 업로드 가능합니다.`
                            : country === "ja"
                            ? `写真/ビデオのみアップロードできます。`
                            : country === "es"
                            ? `Solo se pueden cargar fotos/videos.`
                            : country === "fr"
                            ? `Seules les photos/vidéos peuvent être téléchargées.`
                            : country === "id"
                            ? `Hanya foto/video yang dapat diunggah.`
                            : country === "zh"
                            ? `只能上传照片/视频。`
                            : `Only photos/videos can be uploaded.`,
                        );
                        return;
                      }
                      if (typeResult === "video") {
                        const formDataThumbnail: any = new FormData();
                        createThumbnail({
                          url: result.assets[0].uri,
                          timeStamp: 0,
                        }).then(res => {
                          formDataThumbnail.append("file", {
                            uri: res.path,
                            name: res.path,
                            type: res.mime,
                          });
                          setThumbnailFormData(formDataThumbnail);
                        });
                      }
                      setUrlType(typeResult);
                      setUrl(result.assets[0].uri);
                      const formData: any = new FormData();
                      formData.append("file", {
                        uri: result.assets[0].uri,
                        name: result.assets[0].uri,
                        type: result.assets[0].type,
                      });
                      setUrlFormData(formData);
                    }}>
                    <Image
                      source={require("../../assets/home/clip.png")}
                      style={{
                        width: 25,
                        height: 25,
                      }}></Image>
                  </TouchableOpacity>
                )}

                {url && (
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      marginTop: vh(2),
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "400",
                        color: "black",
                      }}>
                      {country === "ko"
                        ? "성인 이상 공개"
                        : country === "ja"
                        ? "大人以上公開"
                        : country === "es"
                        ? "Abierto a adultos y mayores."
                        : country === "fr"
                        ? "Ouvert aux adultes et aux plus âgés"
                        : country === "id"
                        ? "Terbuka untuk orang dewasa dan lebih tua"
                        : country === "zh"
                        ? "向成人和老年人开放"
                        : "Open to adults and older"}
                    </Text>
                    <Switch
                      trackColor={{false: "#a4a4a4", true: PALETTE.COLOR_NAVY}}
                      thumbColor={adult ? "#f4f3f4" : "#f4f3f4"}
                      ios_backgroundColor="#a4a4a4"
                      onValueChange={() => {
                        setAdult(!adult);
                      }}
                      value={adult}
                    />
                  </TouchableOpacity>
                )}
                {url && (
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      marginTop: vh(2),
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "400",
                        color: "black",
                      }}>
                      {country === "ko"
                        ? "유료 공개"
                        : country === "ja"
                        ? "有料公開"
                        : country === "es"
                        ? "Público pagado"
                        : country === "fr"
                        ? "Public payant"
                        : country === "id"
                        ? "Publik berbayar"
                        : country === "zh"
                        ? "付费公众"
                        : "Paid public"}
                    </Text>
                    <Switch
                      trackColor={{false: "#a4a4a4", true: PALETTE.COLOR_NAVY}}
                      thumbColor={lock ? "#f4f3f4" : "#f4f3f4"}
                      ios_backgroundColor="#a4a4a4"
                      onValueChange={() => {
                        setLock(!lock);
                      }}
                      value={lock}
                    />
                  </TouchableOpacity>
                )}
                {/*url && lock && (
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      marginTop: vh(2),
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "400",
                        color: "black",
                      }}>
                      {country === "ko"
                        ? "구매 가능 시간 제한"
                        : country === "ja"
                        ? "購入可能な時間制限"
                        : country === "es"
                        ? "Tiempo limitado disponible para la compra."
                        : country === "fr"
                        ? "Temps limité disponible à l'achat"
                        : country === "id"
                        ? "Waktu terbatas tersedia untuk pembelian"
                        : country === "zh"
                        ? "限时购买"
                        : "Limited time available for purchase"}
                    </Text>
                    <Switch
                      trackColor={{false: "#a4a4a4", true: PALETTE.COLOR_NAVY}}
                      thumbColor={timePossible ? "#f4f3f4" : "#f4f3f4"}
                      ios_backgroundColor="#a4a4a4"
                      onValueChange={() => {
                        setTimePossible(!timePossible);
                      }}
                      value={timePossible}
                    />
                  </TouchableOpacity>
                    )*/}
                {/*timePossible && lock && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: vh(2),
                    }}
                    //activeOpacity={1}
                  >
                    <Text
                      style={{
                        color: "black",
                      }}>
                      {country === "ko"
                        ? "날짜를 선택해 주세요."
                        : country === "ja"
                        ? "日付を選択してください。"
                        : country === "es"
                        ? "Por favor seleccione una fecha."
                        : country === "fr"
                        ? "Veuillez sélectionner une date."
                        : country === "id"
                        ? "Silakan pilih tanggal."
                        : country === "zh"
                        ? "请选择日期。"
                        : "Please select a date."}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setModal(true);
                      }}>
                      <Text
                        style={{
                          color: "#838383",
                          fontSize: 16,
                        }}>
                        {new Date(purchasePossibledAt).toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                  </View>
                    )*/}

                {timePossible && lock && (
                  <DatePicker
                    modal
                    open={modal}
                    date={purchasePossibledAt}
                    onConfirm={date => {
                      setModal(false);
                      //setTimePossible(false)
                      setPurchasePossibledAt(date);
                    }}
                    onCancel={() => {
                      setModal(false);
                    }}
                  />
                )}

                {url && lock && (
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      marginTop: vh(2),
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        marginBottom: 10,
                        color: "black",
                      }}>
                      {country === "ko"
                        ? "채팅 열람 가격"
                        : country === "ja"
                        ? "チャット閲覧価格"
                        : country === "es"
                        ? "Precio de visualización del chat"
                        : country === "fr"
                        ? "Prix ​​de visualisation du chat"
                        : country === "id"
                        ? "Harga menonton obrolan"
                        : country === "zh"
                        ? "聊天查看价格"
                        : "Chat viewing price"}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                      }}>
                      <TextInput
                        maxLength={7}
                        style={{
                          backgroundColor: "#f4f4f4",
                          padding: 10,
                          borderRadius: 15,
                          color: "black",
                        }}
                        keyboardType="number-pad"
                        value={price.toString()}
                        onBlur={(e: any) => {
                          if (price <= 100) setPrice(100);
                          if (price >= 10000000) setPrice(10000000);
                        }}
                        onChangeText={(e: any) => {
                          setPrice(e);
                          // if (e <= 1) setPrice(1);
                          // else setPrice(e);
                        }}></TextInput>
                      <Image
                        source={require("../../assets/setting/point.png")}
                        style={{
                          marginLeft: 5,
                          width: 25,
                          height: 25,
                        }}></Image>
                    </View>
                  </TouchableOpacity>
                )}

                <View
                  style={{
                    height: vh(8),
                  }}></View>
              </ScrollView>
            </KeyboardAwareScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </NotchView>
  );
}
