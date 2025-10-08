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
import SelectDropdown from "react-native-select-dropdown";
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
import {USER_GENDER, USER_ROLE} from "../../lib/constant/user-constant";

export default function MakeFeed({
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
  const [free, setFree] = useState(false);
  const [adult, setAdult] = useState(false);
  const [onlyMember, setOnlyMember] = useState(true);
  const [contentSecret, setContentSecret] = useState(false);
  const [price, setPrice] = useState(1000);

  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const [possibleStep, setPossibleStep]: any = useState(null);
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(-1);
  const [urlType, setUrlType] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        await api.get("/subscribe/getFanStepExistsStep").then(res => {
          if (res.data.status === "true") {
            setPossibleStep(res.data?.possibleStep);
          }
        });
      } catch (err) {}
    }
    fetchData();
  }, []);
  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["bottom"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={Platform.OS === "ios" ? "light-content" : "dark-content"}
      />
      {show === true && (
        <Picker
          style={{
            position: "absolute",
            width: vw(100),
            zIndex: 100,
            bottom: 0,
            backgroundColor: "rgba(255,255,255,0.95)",
          }}
          selectedValue={step}
          onValueChange={(itemValue, itemIndex) => {
            setStep(itemValue);
            setShow(false);
          }}>
          {possibleStep.map((list: any, idx: number) => (
            <Picker.Item
              label={
                list === 11
                  ? country === "ko"
                    ? "포인트 구매만 허용"
                    : country === "ja"
                    ? "ポイントの購入のみ許可"
                    : country === "es"
                    ? "Solo se permite la compra de puntos"
                    : country === "fr"
                    ? "Achat de points seulement autorisé"
                    : country === "id"
                    ? "Pembelian poin hanya diperbolehkan"
                    : country === "zh"
                    ? "仅允许购买积分"
                    : "Only point purchase allowed"
                  : `VIP ${list}`
              }
              value={list}
            />
          ))}
        </Picker>
      )}
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
                      ? "게시글 작성"
                      : country === "ja"
                      ? "投稿"
                      : country === "es"
                      ? "Publicar"
                      : country === "fr"
                      ? "Publication"
                      : country === "id"
                      ? "Tulis Postingan"
                      : country === "zh"
                      ? "发布"
                      : "Post"}
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
                    if (!content) {
                      Alert.alert(
                        country === "ko"
                          ? "내용을 입력해주세요."
                          : country === "ja"
                          ? "内容を入力してください。"
                          : country === "es"
                          ? "Por favor, ingrese contenido."
                          : country === "fr"
                          ? "Veuillez saisir le contenu."
                          : country === "id"
                          ? "Masukkan konten."
                          : country === "zh"
                          ? "请输入内容。"
                          : "Please enter content.",
                      );
                      return;
                    }
                    if (
                      url &&
                      free === true &&
                      step !== 11 &&
                      !onlyMember &&
                      price < 1000
                    ) {
                      Alert.alert(
                        country === "ko"
                          ? "게시글 가격은 1000P 보다 높아야 합니다."
                          : country === "ja"
                          ? "投稿価格は1000P以上である必要があります。"
                          : country === "es"
                          ? "El precio de la publicación debe ser superior a 1000P."
                          : country === "fr"
                          ? "Le prix de la publication doit être supérieur à 1000P."
                          : country === "id"
                          ? "Harga posting harus lebih dari 1000P."
                          : country === "zh"
                          ? "帖子价格必须高于1000P。"
                          : "The post price must be higher than 1000P.",
                      );
                      return;
                    }
                    if (url && free === true && step === -1) {
                      Alert.alert(
                        country === "ko"
                          ? "멤버쉽 단계를 선택해주세요."
                          : country === "ja"
                          ? "メンバーシップの段階を選択してください。"
                          : country === "es"
                          ? "Seleccione su nivel de membresía."
                          : country === "fr"
                          ? "Veuillez sélectionner votre niveau d'adhésion."
                          : country === "id"
                          ? "Silakan pilih tingkat keanggotaan Anda."
                          : country === "zh"
                          ? "请选择您的会员级别。"
                          : "Please select your membership level.",
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
                      .post("/post/createPost/v2", {
                        type:
                          urlType === "video"
                            ? POST_TYPE.POST_VIDEO
                            : urlType === "image"
                            ? POST_TYPE.POST_IMAGE
                            : POST_TYPE.POST_NORMAL,
                        content,
                        url: profileURL,
                        lock: free,
                        cost: free === false ? 0 : price,
                        step,
                        thumbnail,
                        adult,
                        contentSecret,
                        onlyMember,
                      })
                      .then(res => {
                        if (res.data.status === "true") {
                          Alert.alert(
                            country === "ko"
                              ? "게시글이 작성 되었습니다."
                              : country === "ja"
                              ? "投稿が作成されました。"
                              : country === "es"
                              ? "La publicación se ha creado."
                              : country === "fr"
                              ? "La publication a été créée."
                              : country === "id"
                              ? "Postingan telah dibuat."
                              : country === "zh"
                              ? "帖子已创建。"
                              : "The post has been created.",
                          );
                          const post = res.data.post;
                          if (!free && !post.adult) {
                            updatePost((prev: any) => [post, ...prev]);
                          }
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
                      ? "게시"
                      : country === "ja"
                      ? "投稿"
                      : country === "es"
                      ? "Publicar"
                      : country === "fr"
                      ? "Publier"
                      : country === "id"
                      ? "Posting"
                      : country === "zh"
                      ? "发布"
                      : "Post"}
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
                <TextInput
                  multiline={true}
                  style={{
                    color: "black",
                    marginTop: vh(2),
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
                            setFree(false);
                            setPrice(0);
                            setContentSecret(false);
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
                            setFree(false);
                            setPrice(0);
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
                  !(
                    user.gender === USER_GENDER.BOY &&
                    user?.roles === USER_ROLE.NORMAL_USER
                  ) && (
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
                  )
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
                        color: "black",
                        fontSize: 15,
                        fontWeight: "400",
                      }}>
                      {country === "ko"
                        ? "유료공개"
                        : country === "ja"
                        ? "有料で公開"
                        : country === "es"
                        ? "Publicación de pago"
                        : country === "fr"
                        ? "Publication payante"
                        : country === "id"
                        ? "Publikasi berbayar"
                        : country === "zh"
                        ? "付费发布"
                        : "Paid post"}
                    </Text>
                    <Switch
                      trackColor={{false: "#a4a4a4", true: PALETTE.COLOR_NAVY}}
                      thumbColor={free ? "#f4f3f4" : "#f4f3f4"}
                      ios_backgroundColor="#a4a4a4"
                      onValueChange={() => {
                        if (free === false) {
                          setPrice(0);
                        }
                        setFree(!free);
                      }}
                      value={free}
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
                        color: "black",
                        fontSize: 15,
                        fontWeight: "400",
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

                {url && free === true && (
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
                        color: "black",
                        fontSize: 15,
                        fontWeight: "400",
                      }}>
                      {country === "ko"
                        ? "내용(글자) 구매자만 확인"
                        : country === "ja"
                        ? "内容（文字）購入者のみ確認"
                        : country === "es"
                        ? "Contenido (texto) solo confirmado por el comprador"
                        : country === "fr"
                        ? "Contenu (texte) uniquement confirmé par l'acheteur"
                        : country === "id"
                        ? "Konten (teks) hanya dikonfirmasi oleh pembeli"
                        : country === "zh"
                        ? "内容（文字）仅由购买者确认"
                        : "Content (text) only confirmed by purchaser"}
                    </Text>
                    <Switch
                      trackColor={{false: "#a4a4a4", true: PALETTE.COLOR_NAVY}}
                      thumbColor={contentSecret ? "#f4f3f4" : "#f4f3f4"}
                      ios_backgroundColor="#a4a4a4"
                      onValueChange={() => {
                        setContentSecret(!contentSecret);
                      }}
                      value={contentSecret}
                    />
                  </TouchableOpacity>
                )}
                {url && free === true && (
                  <TouchableOpacity
                    style={{
                      marginTop: vh(2),
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    onPress={() => {
                      if (!possibleStep) navigation.navigate("MakeSubscribe");
                      else {
                        if (Platform.OS === "ios") {
                          setShow(true);
                        }
                      }
                    }}>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 16,
                        marginBottom: 10,
                      }}>
                      {country === "ko"
                        ? "멤버쉽 단계 설정"
                        : country === "ja"
                        ? "メンバーシップ段階設定"
                        : country === "es"
                        ? "Configuración del nivel de membresía"
                        : country === "fr"
                        ? "Paramètres de niveau d'adhésion"
                        : country === "id"
                        ? "Pengaturan tingkat keanggotaan"
                        : country === "zh"
                        ? "会员级别设置"
                        : "Membership level setting"}
                    </Text>

                    {Platform.OS === "ios" ? (
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "#838383",
                        }}>
                        {step === -1
                          ? country === "ko"
                            ? "멤버십을 선택해주세요."
                            : country === "ja"
                            ? "メンバーシップを選択してください。"
                            : country === "es"
                            ? "Por favor seleccione una membresía."
                            : country === "fr"
                            ? "Veuillez sélectionner une adhésion."
                            : country === "id"
                            ? "Silakan pilih keanggotaan."
                            : country === "zh"
                            ? "请选择会员资格。"
                            : "Please select a membership."
                          : step === 11
                          ? country === "ko"
                            ? "포인트 구매만 허용"
                            : country === "ja"
                            ? "ポイントの購入のみ許可"
                            : country === "es"
                            ? "Solo se permite la compra de puntos"
                            : country === "fr"
                            ? "Achat de points seulement autorisé"
                            : country === "id"
                            ? "Pembelian poin hanya diperbolehkan"
                            : country === "zh"
                            ? "仅允许购买积分"
                            : "Only point purchase allowed"
                          : `VIP ${step}`}
                      </Text>
                    ) : (
                      step && (
                        <SelectDropdown
                          defaultButtonText={
                            step === -1
                              ? country === "ko"
                                ? "멤버십을 선택해주세요."
                                : country === "ja"
                                ? "メンバーシップを選択してください。"
                                : country === "es"
                                ? "Por favor seleccione una membresía."
                                : country === "fr"
                                ? "Veuillez sélectionner une adhésion."
                                : country === "id"
                                ? "Silakan pilih keanggotaan."
                                : country === "zh"
                                ? "请选择会员资格。"
                                : "Please select a membership."
                              : step === 11
                              ? country === "ko"
                                ? "포인트 구매만 허용"
                                : country === "ja"
                                ? "ポイントの購入のみ許可"
                                : country === "es"
                                ? "Solo se permite la compra de puntos"
                                : country === "fr"
                                ? "Achat de points seulement autorisé"
                                : country === "id"
                                ? "Pembelian poin hanya diperbolehkan"
                                : country === "zh"
                                ? "仅允许购买积分"
                                : "Only point purchase allowed"
                              : `VIP ${step}`
                          }
                          buttonStyle={{
                            borderRadius: 10,
                            //width: 80,
                            height: 40,
                            backgroundColor: PALETTE.COLOR_BACK,
                          }}
                          dropdownStyle={{
                            borderRadius: 10,
                          }}
                          rowStyle={{
                            backgroundColor: PALETTE.COLOR_WHITE,
                            borderWidth: 0,
                          }}
                          rowTextStyle={{
                            fontSize: 12,
                          }}
                          buttonTextStyle={{
                            fontSize: 12,
                            backgroundColor: PALETTE.COLOR_BACK,
                          }}
                          renderDropdownIcon={() => (
                            <Text
                              style={{
                                color: "black",
                                fontSize: 12,
                              }}>
                              ▼
                            </Text>
                          )}
                          data={possibleStep}
                          onSelect={async (selectedItem, index) => {
                            setStep(selectedItem);
                            setShow(false);
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            const after =
                              selectedItem === -1
                                ? country === "ko"
                                  ? "멤버십을 선택해주세요."
                                  : country === "ja"
                                  ? "メンバーシップを選択してください。"
                                  : country === "es"
                                  ? "Por favor seleccione una membresía."
                                  : country === "fr"
                                  ? "Veuillez sélectionner une adhésion."
                                  : country === "id"
                                  ? "Silakan pilih keanggotaan."
                                  : country === "zh"
                                  ? "请选择会员资格。"
                                  : "Please select a membership."
                                : selectedItem === 11
                                ? country === "ko"
                                  ? "포인트 구매만 허용"
                                  : country === "ja"
                                  ? "ポイントの購入のみ許可"
                                  : country === "es"
                                  ? "Solo se permite la compra de puntos"
                                  : country === "fr"
                                  ? "Achat de points seulement autorisé"
                                  : country === "id"
                                  ? "Pembelian poin hanya diperbolehkan"
                                  : country === "zh"
                                  ? "仅允许购买积分"
                                  : "Only point purchase allowed"
                                : `VIP ${selectedItem}`;
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return after;
                          }}
                          rowTextForSelection={(item, index) => {
                            const after =
                              item === 11
                                ? country === "ko"
                                  ? "포인트 구매만 허용"
                                  : country === "ja"
                                  ? "ポイントの購入のみ許可"
                                  : country === "es"
                                  ? "Solo se permite la compra de puntos"
                                  : country === "fr"
                                  ? "Achat de points seulement autorisé"
                                  : country === "id"
                                  ? "Pembelian poin hanya diperbolehkan"
                                  : country === "zh"
                                  ? "仅允许购买积分"
                                  : "Only point purchase allowed"
                                : `VIP ${item}`;
                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            return after;
                          }}
                        />
                      )
                    )}
                  </TouchableOpacity>
                )}
                {url && free === true && step !== 11 && step !== -1 && (
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
                        color: "black",
                        fontSize: 15,
                        fontWeight: "400",
                      }}>
                      {country === "ko"
                        ? "멤버쉽 보유자만 공개"
                        : country === "ja"
                        ? "メンバーシップ保有者のみ公開"
                        : country === "es"
                        ? "Abierto sólo para titulares de membresías"
                        : country === "fr"
                        ? "Ouvert uniquement aux membres"
                        : country === "id"
                        ? "Terbuka hanya untuk pemegang keanggotaan"
                        : country === "zh"
                        ? "仅对会员持有者开放"
                        : "Open only to membership holders"}
                    </Text>
                    <Switch
                      trackColor={{false: "#a4a4a4", true: PALETTE.COLOR_NAVY}}
                      thumbColor={onlyMember ? "#f4f3f4" : "#f4f3f4"}
                      ios_backgroundColor="#a4a4a4"
                      onValueChange={() => {
                        setOnlyMember(!onlyMember);
                      }}
                      value={onlyMember}
                    />
                  </TouchableOpacity>
                )}
                {url && free === true && (step === 11 || !onlyMember) && (
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
                        color: "black",
                        fontSize: 16,
                        marginBottom: 10,
                      }}>
                      {country === "ko"
                        ? "포스트 열람 가격"
                        : country === "ja"
                        ? "投稿閲覧価格"
                        : country === "es"
                        ? "Precio de visualización de la publicación"
                        : country === "fr"
                        ? "Prix de visualisation du post"
                        : country === "id"
                        ? "Harga penampilan posting"
                        : country === "zh"
                        ? "帖子查看价格"
                        : "Post viewing price"}
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
                          color: "black",
                          backgroundColor: "#f4f4f4",
                          padding: 10,
                          borderRadius: 15,
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

                {user.country === "ko" &&
                  url &&
                  free === true &&
                  possibleStep?.length === 1 && (
                    <TouchableOpacity
                      style={{
                        marginTop: vh(2),
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      onPress={() => {
                        navigation.navigate("MakeSubscribe");
                      }}>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 16,
                          marginBottom: 10,
                        }}>
                        {country === "ko"
                          ? "멤버십 만들러가기"
                          : country === "ja"
                          ? "メンバーシップを作成する"
                          : country === "es"
                          ? "Crear membresía"
                          : country === "fr"
                          ? "Créer une adhésion"
                          : country === "id"
                          ? "Membuat keanggotaan"
                          : country === "zh"
                          ? "创建会员"
                          : "Create membership"}
                      </Text>
                      <Image
                        source={require("../../assets/setting/right.png")}
                        style={{
                          width: 25,
                          height: 25,
                        }}></Image>
                    </TouchableOpacity>
                  )}
                {url && free === true && (
                  <TouchableOpacity
                    style={{
                      marginTop: vh(2),
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: 10,
                        color: "red",
                      }}>
                      {country === "ko"
                        ? "포스팅은 포인트로 구매 혹은 멤버십 보유자가 열람 가능합니다."
                        : country === "ja"
                        ? "投稿はポイントで購入するか、メンバーシップ会員が閲覧できます。"
                        : country === "es"
                        ? "Las publicaciones se pueden comprar con puntos o ver por los miembros con membresía."
                        : country === "fr"
                        ? "Les publications peuvent être achetées avec des points ou consultées par les membres ayant une adhésion."
                        : country === "id"
                        ? "Posting dapat dibeli dengan poin atau dilihat oleh anggota yang memiliki keanggotaan."
                        : country === "zh"
                        ? "发布可以使用积分购买，也可以由会员持有会员资格查看。"
                        : "Posts can be purchased with points or viewed by members with membership."}
                    </Text>
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
