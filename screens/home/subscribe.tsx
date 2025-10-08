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
import {ToastComponent} from "../reusable/useToast";
import {FANSTEP_DURATION} from "../../lib/constant/fanStep-constant";
import {Picker} from "@react-native-picker/picker";
import {WebView} from "react-native-webview";
import {useIsFocused} from "@react-navigation/native";
import EncryptedStorage from "react-native-encrypted-storage";
import Loading from "../reusable/loading";

export default function SubScribe({
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
  const you = route.params?.you;
  const fanStep = route.params?.fanStep;
  const subscribeState = route.params?.subscribeState;
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(user?.phone);
  const [email, setEmail] = useState(user?.email);
  const [cardValidationYear, setCardValidationYear] = useState("");
  const [cardValidationMonth, setCardValidationMonth] = useState("");
  const [oversea, setOversea]: any = useState(
    /*country === "ko" ? false : true*/ false,
  );
  const cardValidationYearRef: any = useRef();
  const cardValidationMonthRef: any = useRef();
  let delayButton = false;
  const [overseasMethod, setOverseasMethod] = useState(0);
  const [canSeeCount, setCanSeeCount] = useState(0);

  const [show, setShow] = useState(false);
  const [paymentType, setPaymentType] = useState(0); //0 card,

  useEffect(() => {
    async function fetchData() {
      //볼수있는 사진 동영상 개수 ,
      /*
      await api.get('/post/canSeeListCount',{
        params:{
          YouId:you.id
        }
      })*/
      try {
        await api.get("/user/getMyCard").then(res => {
          const card = res.data.card;
          if (card) {
            if (card.phone) setPhone(card.phone);
            if (card.email) setEmail(card.email);
            setCardNumber(card.card_number);
            setName(card.name);
            setCardValidationMonth(card.expiry?.slice(0, 2));
            setCardValidationYear(card.expiry?.slice(2, 4));
          }
        });
      } catch (err) {}
    }
    fetchData();
  }, []);

  const isFocused = useIsFocused();
  const [accessToken, setAccessToken]: any = useState(null);
  const [refreshToken, setRefreshToken]: any = useState(null);

  useEffect(() => {
    async function getSecureToken() {
      setAccessToken(await EncryptedStorage.getItem("accessToken"));
      setRefreshToken(await EncryptedStorage.getItem("refreshToken"));
    }
    if (isFocused) {
      getSecureToken();
    }
  }, [isFocused]);

  const [loadingPaypal, setLoadinPaypal] = useState(false);

  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["top", "bottom"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={"dark-content"}
      />
      {loadingPaypal && <Loading></Loading>}
      {show === true && (
        <Picker
          style={{
            position: "absolute",
            width: vw(100),
            zIndex: 5,
            bottom: 0,
            backgroundColor: "rgba(255,255,255,0.95)",
          }}
          itemStyle={{
            fontSize: 15,
          }}
          selectedValue={oversea}
          onValueChange={(itemValue, itemIndex) => {
            setOversea(itemValue);
            setShow(false);
          }}>
          <Picker.Item
            label={
              country === "ko"
                ? `국내`
                : country === "ja"
                ? `国内`
                : country === "es"
                ? `doméstico`
                : country === "fr"
                ? `domestique`
                : country === "id"
                ? `lokal`
                : country === "zh"
                ? `国内的`
                : `domestic`
            }
            value={false}
          />
          {/*
          <Picker.Item
            label={
              country === "ko"
                ? `해외`
                : country === "ja"
                ? `海外`
                : country === "es"
                ? `En el extranjero`
                : country === "fr"
                ? `À l'étranger`
                : country === "id"
                ? `Luar negeri`
                : country === "zh"
                ? `海外`
                : `Overseas`
            }
            value={true}
          />
          */}
        </Picker>
      )}
      <View
        style={{
          flex: 1,
        }}>
        <ScrollView
          style={{
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
                  ? `결제`
                  : country === "ja"
                  ? `支払い`
                  : country === "es"
                  ? `Pago`
                  : country === "fr"
                  ? `Paiement`
                  : country === "id"
                  ? `Pembayaran`
                  : country === "zh"
                  ? `支付`
                  : `Payment`}
              </Text>
            </View>
            <View
              style={{
                width: 30,
                height: 30,
              }}></View>
          </View>
          <TouchableOpacity
            style={{
              padding: vw(4),
              width: vw(92),
              borderRadius: 10,
              marginTop: vh(2),
              justifyContent: "space-between",
              marginBottom: vh(2),
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
              backgroundColor: PALETTE.COLOR_WHITE,
            }}>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "flex-end",
                  marginBottom: vh(2),
                }}>
                <FastImage
                  source={{
                    uri: you?.profile,
                    priority: FastImage.priority.normal,
                  }}
                  style={{
                    width: vw(20),
                    height: vw(20),
                    borderRadius: 10,
                  }}
                  resizeMode={FastImage.resizeMode.cover}></FastImage>
                <View
                  style={{
                    marginLeft: 10,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontWeight: "bold",
                      marginBottom: 2,
                      color: "black",
                    }}>
                    {fanStep?.title}
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#838383",
                    }}>
                    VIP {fanStep?.step}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      marginTop: 5,
                    }}>
                    <View
                      style={{
                        borderRadius: 5,
                        backgroundColor: PALETTE.COLOR_NAVY,
                        padding: 6,
                      }}>
                      <Text
                        style={{
                          color: PALETTE.COLOR_WHITE,
                          fontSize: 12,
                        }}>
                        {country === "ko"
                          ? `모집중`
                          : country === "ja"
                          ? `募集中`
                          : country === "es"
                          ? `En reclutamiento`
                          : country === "fr"
                          ? `Recrutement en cours`
                          : country === "id"
                          ? `Sedang direkrut`
                          : country === "zh"
                          ? `招募中`
                          : `Recruiting`}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 5,
                        borderRadius: 5,
                        backgroundColor: PALETTE.COLOR_BACK,
                        padding: 6,
                      }}>
                      <Text
                        style={{
                          color: PALETTE.COLOR_BLACK,
                          fontSize: 12,
                        }}>
                        {country === "ko"
                          ? `즉시가입`
                          : country === "ja"
                          ? `即時登録`
                          : country === "es"
                          ? `Registro inmediato`
                          : country === "fr"
                          ? `Inscription immédiate`
                          : country === "id"
                          ? `Pendaftaran segera`
                          : country === "zh"
                          ? `立即注册`
                          : `Immediate registration`}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 22,
                  marginBottom: 10,
                  fontWeight: "500",
                  color: PALETTE.COLOR_RED,
                }}>
                {country === "ko"
                  ? `월`
                  : country === "ja"
                  ? `月`
                  : country === "es"
                  ? `Mes`
                  : country === "fr"
                  ? `Mois`
                  : country === "id"
                  ? `Bulan`
                  : country === "zh"
                  ? `月`
                  : `Month`}
                {``} ₩{` `}
                {Number(fanStep?.price).toLocaleString()}
              </Text>

              {fanStep?.Benifits?.map((item: any, index: number) => (
                <View
                  style={{
                    marginTop: 6,
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <Image
                    source={require("../../assets/home/diamond.png")}
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 5,
                    }}></Image>
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "500",
                    }}
                    numberOfLines={1}>
                    {item?.content}
                  </Text>
                </View>
              ))}
              <View
                style={{
                  marginTop: 6,
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <Image
                  source={require("../../assets/home/diamond.png")}
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 5,
                  }}></Image>
                <Text
                  style={{
                    color: "black",
                    fontWeight: "500",
                  }}
                  numberOfLines={1}>
                  {country === "ko"
                    ? `VIP ${fanStep?.step} 이하 단계 포스팅 열람가능`
                    : country === "ja"
                    ? `VIP ${fanStep?.step}以下のステージの投稿を閲覧可能`
                    : country === "es"
                    ? `Posibilidad de ver publicaciones de nivel VIP ${fanStep?.step} o inferior`
                    : country === "fr"
                    ? `Consultation des publications de niveau VIP ${fanStep?.step} ou inférieur`
                    : country === "id"
                    ? `Dapat melihat posting tingkat VIP ${fanStep?.step} atau lebih rendah`
                    : country === "zh"
                    ? `可以查看VIP ${fanStep?.step}或更低级别的帖子`
                    : `Able to view VIP ${fanStep?.step} or lower level posts`}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 6,
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <Image
                  source={require("../../assets/home/diamond.png")}
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 5,
                  }}></Image>
                <Text
                  style={{
                    color: "black",
                    fontWeight: "500",
                  }}
                  numberOfLines={1}>
                  {country === "ko"
                    ? `영상통화 신청시 구독자 마크 표시`
                    : country === "ja"
                    ? `ビデオ通話申し込み時にサブスクリプションマークを表示`
                    : country === "es"
                    ? `Mostrar la marca de suscriptor al solicitar una videollamada`
                    : country === "fr"
                    ? `Afficher le badge d'abonné lors de la demande d'appel vidéo`
                    : country === "id"
                    ? `Tampilkan tanda pelanggan saat mengajukan panggilan video`
                    : country === "zh"
                    ? `申请视频通话时显示订阅者标志`
                    : `Display subscriber badge when requesting video call`}
                </Text>
              </View>
              {/*
              <View
                style={{
                  marginTop: 6,
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <Image
                  source={require("../../assets/home/diamond.png")}
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 5,
                  }}></Image>
                <Text
                  style={{
                    fontWeight: "500",
                  }}
                  numberOfLines={1}>
                  {fanStep?.duration === FANSTEP_DURATION.DURATION_30
                    ? "결제일 기준 30일 이전 포스트까지 열람 가능"
                    : fanStep?.duration === FANSTEP_DURATION.DURATION_ALL &&
                      "모든 기간의 포스트 열람가능"}
                </Text>
              </View>
                  */}
            </View>
            {/*
            <View
              style={{
                marginTop: vh(4),
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 5,
                  backgroundColor: PALETTE.COLOR_BACK,
                  height: 35,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <Image
                    source={require("../../assets/home/gallery.png")}
                    style={{
                      width: 15,
                      height: 15,
                      marginRight: 5,
                    }}></Image>
                  <Text
                    style={{
                      color: PALETTE.COLOR_NAVY,
                    }}>
                    사진 · 동영상
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "black",
                      fontWeight: "bold",
                    }}>
                    11개
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: PALETTE.COLOR_PURPLE,
                      fontWeight: "bold",
                      marginLeft: 5,
                    }}>
                    즉시 공개
                  </Text>
                </View>
              </TouchableOpacity>
                  </View>*/}
          </TouchableOpacity>

          <View
            style={{
              marginTop: vh(2),
            }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: "black",
              }}>
              {country === "ko"
                ? `결제 수단`
                : country === "ja"
                ? `支払い方法`
                : country === "es"
                ? `Método de pago`
                : country === "fr"
                ? `Moyen de paiement`
                : country === "id"
                ? `Metode Pembayaran`
                : country === "zh"
                ? `支付方式`
                : `Payment Method`}
            </Text>
            {user?.email !== "test@gmail.com" && (
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  marginTop: vh(2),
                }}>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                    borderRadius: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 6,
                    paddingBottom: 6,
                    flexDirection: "row",

                    borderWidth: 1,
                    borderColor: paymentType === 0 ? "black" : "#d3d3d3",
                  }}
                  onPress={() => {
                    setPaymentType(0);
                  }}>
                  <Image
                    source={require("../../assets/setting/card.png")}
                    style={{
                      width: 30,
                      height: 30,
                      marginRight: 10,
                    }}></Image>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 14,
                    }}>
                    {country === "ko"
                      ? `카드`
                      : country === "ja"
                      ? `カード`
                      : country === "es"
                      ? `tarjeta`
                      : country === "fr"
                      ? `carte`
                      : country === "id"
                      ? `kartu`
                      : country === "zh"
                      ? `卡片`
                      : `card`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                    borderRadius: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 6,
                    paddingBottom: 6,
                    flexDirection: "row",
                    borderWidth: 1,
                    borderColor: paymentType === 1 ? "black" : "#d3d3d3",
                  }}
                  onPress={() => {
                    setPaymentType(1);
                  }}>
                  <Image
                    source={require("../../assets/setting/paypal.png")}
                    style={{
                      width: 60,
                      height: 30,
                      objectFit: "contain",
                    }}></Image>
                </TouchableOpacity>
              </View>
            )}
            {paymentType === 0 && (
              <View>
                <Text
                  style={{
                    marginTop: vh(2),
                    fontWeight: "bold",
                    color: "#838383",
                    fontSize: 16,
                  }}>
                  {country === "ko"
                    ? `카드 번호`
                    : country === "ja"
                    ? `カード番号`
                    : country === "es"
                    ? `Número de tarjeta`
                    : country === "fr"
                    ? `Numéro de carte`
                    : country === "id"
                    ? `Nomor Kartu`
                    : country === "zh"
                    ? `卡号`
                    : `Card Number`}
                </Text>
                <TextInput
                  keyboardType="decimal-pad"
                  placeholder="0000111122223333"
                  style={{
                    paddingBottom: 10,
                    paddingTop: 10,
                    borderBottomColor: PALETTE.COLOR_BORDER,
                    borderBottomWidth: 1,
                    color: "black",
                  }}
                  value={cardNumber}
                  onChangeText={e => {
                    setCardNumber(e.replaceAll(" ", "").replaceAll("-", ""));
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}>
                  <View
                    style={{
                      width: "45%",
                    }}>
                    <Text
                      style={{
                        marginTop: vh(2),
                        fontWeight: "bold",
                        color: "#838383",
                        fontSize: 16,
                      }}>
                      {country === "ko"
                        ? `유효 기간`
                        : country === "ja"
                        ? `有効期限`
                        : country === "es"
                        ? `Fecha de vencimiento`
                        : country === "fr"
                        ? `Date d'expiration`
                        : country === "id"
                        ? `Masa Berlaku`
                        : country === "zh"
                        ? `有效期限`
                        : `Expiration Date`}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        paddingBottom: 10,
                        paddingTop: 10,
                        borderBottomColor: PALETTE.COLOR_BORDER,
                        borderBottomWidth: 1,
                      }}>
                      <TextInput
                        style={{
                          color: "black",
                        }}
                        keyboardType="decimal-pad"
                        ref={cardValidationMonthRef}
                        placeholder="MM"
                        maxLength={2}
                        value={cardValidationMonth}
                        onChangeText={e => {
                          setCardValidationMonth(e);
                          if (e.length === 2)
                            cardValidationYearRef.current.focus();
                        }}
                      />
                      <Text
                        style={{
                          paddingLeft: 2,
                          paddingRight: 2,
                          color: "#d3d3d3",
                        }}>
                        /
                      </Text>
                      <TextInput
                        style={{
                          color: "black",
                        }}
                        keyboardType="decimal-pad"
                        ref={cardValidationYearRef}
                        placeholder="YY"
                        maxLength={2}
                        value={cardValidationYear}
                        onChangeText={e => {
                          if (e.length === 0 && cardValidationYear.length === 1)
                            cardValidationMonthRef.current.focus();
                          setCardValidationYear(e);
                        }}
                      />
                    </View>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: vh(2),
                    fontWeight: "bold",
                    color: "#838383",
                    fontSize: 16,
                  }}>
                  {country === "ko"
                    ? `이름`
                    : country === "ja"
                    ? `名前`
                    : country === "es"
                    ? `Nombre`
                    : country === "fr"
                    ? `Prénom`
                    : country === "id"
                    ? `Nama`
                    : country === "zh"
                    ? `名字`
                    : `Name`}
                </Text>
                <TextInput
                  placeholder="홍길동"
                  style={{
                    color: "black",
                    paddingBottom: 10,
                    paddingTop: 10,
                    borderBottomColor: PALETTE.COLOR_BORDER,
                    borderBottomWidth: 1,
                  }}
                  value={name}
                  onChangeText={e => {
                    setName(e);
                  }}
                />
                <Text
                  style={{
                    marginTop: vh(2),
                    fontWeight: "bold",
                    color: "#838383",
                    fontSize: 16,
                  }}>
                  {country === "ko"
                    ? `이메일`
                    : country === "ja"
                    ? `メールアドレス`
                    : country === "es"
                    ? `Correo electrónico`
                    : country === "fr"
                    ? `Adresse e-mail`
                    : country === "id"
                    ? `Surel`
                    : country === "zh"
                    ? `电子邮件`
                    : `Email`}
                </Text>
                <TextInput
                  placeholder={
                    country === "ko"
                      ? `이메일을 입력하세요`
                      : country === "ja"
                      ? `メールアドレスを入力してください`
                      : country === "es"
                      ? `Por favor, introduzca su correo electrónico`
                      : country === "fr"
                      ? `Veuillez entrer votre adresse e-mail`
                      : country === "id"
                      ? `Silakan masukkan email Anda`
                      : country === "zh"
                      ? `请输入您的电子邮件`
                      : `Please enter your email`
                  }
                  style={{
                    paddingBottom: 10,
                    paddingTop: 10,
                    borderBottomColor: PALETTE.COLOR_BORDER,
                    borderBottomWidth: 1,
                    color: "black",
                  }}
                  value={email}
                  onChangeText={e => {
                    setEmail(e);
                  }}
                />
                <>
                  <Text
                    style={{
                      marginTop: vh(2),
                      fontWeight: "bold",
                      color: "#838383",
                      fontSize: 16,
                    }}>
                    {country === "ko"
                      ? `전화번호 입력`
                      : country === "ja"
                      ? `電話番号を入力`
                      : country === "es"
                      ? `Ingresa número telefónico`
                      : country === "fr"
                      ? `Entrez le numéro de téléphone`
                      : country === "id"
                      ? `Masukkan nomor telepon`
                      : country === "zh"
                      ? `输入电话号码`
                      : `Enter phone number`}
                  </Text>
                  <TextInput
                    placeholder="+821012345678"
                    style={{
                      paddingBottom: 10,
                      paddingTop: 10,
                      borderBottomColor: PALETTE.COLOR_BORDER,
                      borderBottomWidth: 1,
                      color: "black",
                    }}
                    value={phone}
                    onChangeText={e => {
                      setPhone(e);
                    }}
                  />
                </>
              </View>
            )}
            {paymentType === 1 && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#ffc439",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  width: vw(92),
                  //paddingTop: vh(1),
                  height: 50,
                  borderRadius: 10,
                  marginTop: vh(2),
                }}
                onPress={() => {
                  //setLoadinPaypal(true);
                  Linking.openURL(
                    `https://nmoment.live/paypal/${fanStep.id}?accessToken=${accessToken}&refreshToken=${refreshToken}`,
                  );
                }}>
                <Image
                  source={require("../../assets/setting/paypalButton.png")}
                  style={{
                    width: vw(92),
                    //height: vh(4),
                    objectFit: "contain",
                  }}></Image>
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              marginTop: vh(6),
            }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: "black",
              }}>
              {country === "ko"
                ? `결제 상세`
                : country === "ja"
                ? `支払い詳細`
                : country === "es"
                ? `Detalles del pago`
                : country === "fr"
                ? `Détails du paiement`
                : country === "id"
                ? `Detail Pembayaran`
                : country === "zh"
                ? `支付明细`
                : `Payment Details`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                marginTop: vh(2),
              }}>
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                }}>
                {country === "ko"
                  ? `총 주문가격`
                  : country === "ja"
                  ? `合計注文金額`
                  : country === "es"
                  ? `Precio total del pedido`
                  : country === "fr"
                  ? `Prix total de la commande`
                  : country === "id"
                  ? `Total Harga Pesanan`
                  : country === "zh"
                  ? `总订单价格`
                  : `Total Order Price`}
              </Text>
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                }}>
                {paymentType === 0
                  ? `KRW ${
                      new Date(subscribeState?.subscribedAt).getTime() >=
                      new Date().setDate(new Date().getDate() - 7)
                        ? Number(
                            Math.max(
                              fanStep?.price - subscribeState?.lastPrice,
                              0,
                            ),
                          ).toLocaleString()
                        : Number(fanStep?.price).toLocaleString()
                    }`
                  : `USD ${
                      new Date(subscribeState?.subscribedAt).getTime() >=
                      new Date().setDate(new Date().getDate() - 7)
                        ? Number(
                            Math.max(
                              fanStep?.price - subscribeState?.lastPrice,
                              0,
                            ) / 1000,
                          ).toLocaleString()
                        : Number(fanStep?.price / 1000).toLocaleString()
                    }`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                marginTop: vh(1),
              }}>
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                }}>
                {country === "ko"
                  ? `부가세`
                  : country === "ja"
                  ? `消費税`
                  : country === "es"
                  ? `Impuesto al Valor Agregado (IVA)`
                  : country === "fr"
                  ? `Taxe sur la valeur ajoutée (TVA)`
                  : country === "id"
                  ? `Pajak Pertambahan Nilai (PPN)`
                  : country === "zh"
                  ? `增值税 (VAT)`
                  : `Value Added Tax (VAT)`}
              </Text>
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                }}>
                {paymentType === 0
                  ? `KRW ${
                      new Date(subscribeState?.subscribedAt).getTime() >=
                      new Date().setDate(new Date().getDate() - 7)
                        ? Number(
                            Math.max(
                              fanStep?.price / 10 -
                                subscribeState?.lastPrice / 10,
                              0,
                            ),
                          ).toLocaleString()
                        : Number(fanStep?.price / 10).toLocaleString()
                    }`
                  : `USD ${
                      new Date(subscribeState?.subscribedAt).getTime() >=
                      new Date().setDate(new Date().getDate() - 7)
                        ? Number(
                            Math.max(
                              fanStep?.price / 10 -
                                subscribeState?.lastPrice / 10,
                              0,
                            ) / 1000,
                          ).toLocaleString()
                        : Number(fanStep?.price / 10 / 1000).toLocaleString()
                    }`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                marginTop: vh(2),
                borderTopColor: PALETTE.COLOR_BORDER,
                borderTopWidth: 1,
                paddingTop: vh(2),
                paddingBottom: vh(2),
              }}>
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 20,
                }}>
                {country === "ko"
                  ? `최종 결제금액`
                  : country === "ja"
                  ? `最終支払金額`
                  : country === "es"
                  ? `Monto final del pago`
                  : country === "fr"
                  ? `Montant final du paiement`
                  : country === "id"
                  ? `Jumlah Pembayaran Akhir`
                  : country === "zh"
                  ? `最终付款金额`
                  : `Final Payment Amount`}
              </Text>
              <Text
                style={{
                  color: PALETTE.COLOR_RED,
                  fontWeight: "bold",
                  fontSize: 20,
                }}>
                {paymentType === 0
                  ? `KRW ${
                      new Date(subscribeState?.subscribedAt).getTime() >=
                      new Date().setDate(new Date().getDate() - 7)
                        ? Number(
                            Math.max(
                              fanStep?.price * 1.1 -
                                subscribeState?.lastPrice * 1.1,
                              0,
                            ),
                          ).toLocaleString()
                        : Number(fanStep?.price * 1.1).toLocaleString()
                    }`
                  : `USD ${
                      new Date(subscribeState?.subscribedAt).getTime() >=
                      new Date().setDate(new Date().getDate() - 7)
                        ? Number(
                            Math.max(
                              fanStep?.price * 1.1 -
                                subscribeState?.lastPrice * 1.1,
                              0,
                            ) / 1000,
                          ).toLocaleString()
                        : Number((fanStep?.price * 1.1) / 1000).toLocaleString()
                    }`}
              </Text>
            </View>
          </View>
          <View
            style={{
              borderRadius: 10,
              padding: vw(4),
              backgroundColor: PALETTE.COLOR_BACK,
            }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
                marginBottom: vh(1),
                color: "#838383",
              }}>
              {country === "ko"
                ? `멤버십 취소/환불 규정`
                : country === "ja"
                ? `メンバーシップキャンセル/返金ポリシー`
                : country === "es"
                ? `Política de Cancelación/Reembolso de Membresía`
                : country === "fr"
                ? `Politique d'Annulation/Remboursement d'Adhésion`
                : country === "id"
                ? `Kebijakan Pembatalan/Pengembalian Dana Keanggotaan`
                : country === "zh"
                ? `会员资格取消/退款政策`
                : `Membership Cancellation/Refund Policy`}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
                color: "red",
                marginTop: vh(0.5),
              }}>
              {country === "ko"
                ? `· 어떠한 경우에도 (크리에이터 탈퇴,게시글 삭제,채팅 삭제 등) 환불이 불가능하니 신중히 구매해 주세요.`
                : country === "ja"
                ? `· いかなる場合でも（クリエイターの退会、投稿の削除、チャットの削除など）払い戻しはできませんので、慎重に購入してください。`
                : country === "es"
                ? `· Los reembolsos no son posibles bajo ninguna circunstancia (retiro del creador, eliminación de publicaciones, eliminación de chat, etc.), así que compre con cuidado.`
                : country === "fr"
                ? `· Les remboursements ne sont en aucun cas possibles (retrait du créateur, suppression de publication, suppression de chat, etc.), veuillez donc acheter avec précaution.`
                : country === "id"
                ? `· Pengembalian dana tidak dapat dilakukan dalam keadaan apa pun (penarikan pembuat, penghapusan kiriman, penghapusan obrolan, dll.), jadi harap membeli dengan hati-hati.`
                : country === "zh"
                ? `· 任何情况下（作者撤回、删帖、删除聊天记录等）均无法退款，请谨慎购买。`
                : `· Refunds are not possible under any circumstances (creator withdrawal, post deletion, chat deletion, etc.), so please purchase carefully.`}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
                color: "#838383",
                marginTop: vh(0.5),
              }}>
              {country === "ko"
                ? `· 이 플랜은`
                : country === "ja"
                ? `· このプランは`
                : country === "es"
                ? `· Este plan es`
                : country === "fr"
                ? `· Ce plan est`
                : country === "id"
                ? `· Rencana ini adalah`
                : country === "zh"
                ? `· 这个计划是`
                : `· This plan is`}
              {new Date(
                new Date().setDate(new Date().getDate() + 30),
              ).toLocaleDateString()}
              {country === "ko"
                ? `에 자동 결제됩니다`
                : country === "ja"
                ? `に自動支払いされます`
                : country === "es"
                ? `se cobrará automáticamente en`
                : country === "fr"
                ? `sera facturé automatiquement en`
                : country === "id"
                ? `akan secara otomatis dikenakan biaya pada`
                : country === "zh"
                ? `将自动支付`
                : `will be automatically charged on`}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
                color: "#838383",
                marginTop: vh(0.5),
              }}>
              {country === "ko"
                ? `· 언제든지 플랜을 변경 또는 취소할 수 있습니다.`
                : country === "ja"
                ? `· いつでもプランを変更またはキャンセルできます。`
                : country === "es"
                ? `· Puede cambiar o cancelar el plan en cualquier momento.`
                : country === "fr"
                ? `· Vous pouvez changer ou annuler le plan à tout moment.`
                : country === "id"
                ? `· Anda dapat mengubah atau membatalkan rencana kapan saja.`
                : country === "zh"
                ? `· 您可以随时更改或取消计划。`
                : `· You can change or cancel the plan at any time.`}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
                color: "#838383",
                marginTop: vh(0.5),
              }}>
              {country === "ko"
                ? `· 가입일로부터 7일 이내에 플랜 업그레이드 시`
                : country === "ja"
                ? `· 加入日から7日以内にプランをアップグレードする場合`
                : country === "es"
                ? `· Si actualiza el plan dentro de los 7 días desde la fecha de registro`
                : country === "fr"
                ? `· Si vous mettez à niveau le plan dans les 7 jours suivant la date d'inscription`
                : country === "id"
                ? `· Jika Anda meningkatkan rencana dalam 7 hari sejak tanggal pendaftaran`
                : country === "zh"
                ? `· 如果在注册后7天内升级计划`
                : `· If you upgrade the plan within 7 days from the registration date`}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
                marginLeft: 7,
                color: "#838383",
              }}>
              {country === "ko"
                ? `차액결제후 바로 업그레이드된 플랜으로 구독합니다.`
                : country === "ja"
                ? `差額支払い後、すぐにアップグレードされたプランにサブスクライブします。`
                : country === "es"
                ? `Después del pago del importe adicional, se suscribirá al plan mejorado de inmediato.`
                : country === "fr"
                ? `Après le paiement de la différence, vous vous abonnerez immédiatement au plan amélioré.`
                : country === "id"
                ? `Setelah pembayaran selisih, Anda akan segera berlangganan ke rencana yang ditingkatkan.`
                : country === "zh"
                ? `差额付款后，立即订阅升级后的计划。`
                : `After making the differential payment, you will immediately subscribe to the upgraded plan.`}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
                color: "#838383",
                marginTop: vh(0.5),
              }}>
              {country === "ko"
                ? `· 등록한 카드로 결제되며 결제 이후 환불이 절대 불가능합니다.`
                : country === "ja"
                ? `· 登録したカードで支払われ、支払い後の返金は絶対に不可能です。`
                : country === "es"
                ? `· Se realizará el pago con la tarjeta registrada y no se podrán hacer reembolsos después del pago.`
                : country === "fr"
                ? `· Le paiement sera effectué avec la carte enregistrée et aucun remboursement ne sera possible après le paiement.`
                : country === "id"
                ? `· Pembayaran akan dilakukan dengan kartu yang terdaftar dan tidak akan ada pengembalian dana setelah pembayaran.`
                : country === "zh"
                ? `· 将使用已注册的卡进行付款，付款后将绝对不允许退款。`
                : `· Payment will be made with the registered card, and refunds are absolutely not possible after payment.`}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
                color: "#838383",
                marginTop: vh(0.5),
              }}>
              {country === "ko"
                ? `· 카드 등록 후 월 정기 구독료는 등록하신 카드로 자동 결제됩니다.`
                : country === "ja"
                ? `· カード登録後、月額定期購読料は登録したカードで自動的に支払われます。`
                : country === "es"
                ? `· Después de registrar la tarjeta, la tarifa de suscripción mensual se cargará automáticamente en la tarjeta registrada.`
                : country === "fr"
                ? `· Après l'enregistrement de la carte, les frais d'abonnement mensuels seront automatiquement débités sur la carte enregistrée.`
                : country === "id"
                ? `· Setelah mendaftarkan kartu, biaya langganan bulanan akan dibayar secara otomatis dengan kartu yang terdaftar.`
                : country === "zh"
                ? `· 注册卡后，每月定期订阅费将自动通过已注册的卡支付。`
                : `· After registering the card, the monthly subscription fee will be automatically charged to the registered card.`}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
                color: "#838383",
                marginTop: vh(0.5),
              }}>
              {country === "ko"
                ? `· 멤버쉽 해지는 설정 -> 내 구독 리스트 에서 가능합니다.`
                : country === "ja"
                ? `· メンバーシップの解除は設定→マイサブスクリプションリストから行えます。`
                : country === "es"
                ? `· La cancelación de la membresía se puede realizar en Configuración -> Mi lista de suscripciones.`
                : country === "fr"
                ? `· La résiliation de l'adhésion est possible dans Paramètres -> Ma liste d'abonnements.`
                : country === "id"
                ? `· Pembatalan keanggotaan dapat dilakukan di Pengaturan -> Daftar langganan saya.`
                : country === "zh"
                ? `· 会员资格取消在设置->我的订阅列表中可用。`
                : `· Membership cancellation is available in Settings -> My subscription list.`}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
                color: "#838383",
                marginTop: vh(0.5),
              }}>
              {country === "ko"
                ? `· 결제시 Dekina Pay의 이용약관에 동의하게 됩니다.`
                : country === "ja"
                ? `· 支払い時には Dekina Pay の利用規約に同意することになります。`
                : country === "es"
                ? `· Al realizar el pago, usted acepta los términos y condiciones de uso de Dekina Pay.`
                : country === "fr"
                ? `· Lors du paiement, vous acceptez les conditions d'utilisation de Dekina Pay.`
                : country === "id"
                ? `· Dengan melakukan pembayaran, Anda menyetujui ketentuan penggunaan Dekina Pay.`
                : country === "zh"
                ? `· 在付款时，您将同意 Dekina Pay 的使用条款。`
                : `· When making a payment, you agree to the terms and conditions of Dekina Pay.`}
            </Text>
          </View>
          {paymentType === 0 && (
            <View
              style={{
                marginTop: vh(6),
              }}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  backgroundColor: PALETTE.COLOR_NAVY,
                  height: 50,
                }}
                onPress={async () => {
                  if (!cardNumber) {
                    Alert.alert(
                      country === "ko"
                        ? `카드 번호를 입력해주세요.`
                        : country === "ja"
                        ? `カード番号を入力してください。`
                        : country === "es"
                        ? `Por favor ingrese su número de tarjeta.`
                        : country === "fr"
                        ? `Veuillez saisir votre numéro de carte.`
                        : country === "id"
                        ? `Silakan masukkan nomor kartu Anda.`
                        : country === "zh"
                        ? `请输入您的卡号。`
                        : `Please enter your card number.`,
                    );
                    return;
                  } else if (!cardValidationMonth) {
                    Alert.alert(
                      country === "ko"
                        ? `카드 유효기간을 입력해주세요.`
                        : country === "ja"
                        ? `カードの有効期間を入力してください。`
                        : country === "es"
                        ? `Por favor ingrese la fecha de vencimiento de la tarjeta.`
                        : country === "fr"
                        ? `Veuillez saisir la date d'expiration de la carte.`
                        : country === "id"
                        ? `Silakan masukkan tanggal kedaluwarsa kartu.`
                        : country === "zh"
                        ? `请输入卡的有效期。`
                        : `Please enter the card expiration date.`,
                    );
                    return;
                  } else if (!cardValidationYear) {
                    Alert.alert(
                      country === "ko"
                        ? `카드 유효기간을 입력해주세요.`
                        : country === "ja"
                        ? `カードの有効期間を入力してください。`
                        : country === "es"
                        ? `Por favor ingrese la fecha de vencimiento de la tarjeta.`
                        : country === "fr"
                        ? `Veuillez saisir la date d'expiration de la carte.`
                        : country === "id"
                        ? `Silakan masukkan tanggal kedaluwarsa kartu.`
                        : country === "zh"
                        ? `请输入卡的有效期。`
                        : `Please enter the card expiration date.`,
                    );
                    return;
                  } else if (!name) {
                    Alert.alert(
                      country === "ko"
                        ? `이름을 입력해주세요.`
                        : country === "ja"
                        ? `名前を入力してください。`
                        : country === "es"
                        ? `Introduzca su nombre, por favor.`
                        : country === "fr"
                        ? `Entrez votre nom, s'il vous plaît.`
                        : country === "id"
                        ? `Silakan masukkan nama Anda.`
                        : country === "zh"
                        ? `请输入您的名字。`
                        : `Input your name, please.`,
                    );
                    return;
                  } else if (!email) {
                    Alert.alert(
                      country === "ko"
                        ? `이메일을 입력해주세요.`
                        : country === "ja"
                        ? `メールを入力してください。`
                        : country === "es"
                        ? `Por favor introduzca su correo electrónico.`
                        : country === "fr"
                        ? `Veuillez entrer votre e-mail.`
                        : country === "id"
                        ? `Masukkan email Anda.`
                        : country === "zh"
                        ? `请输入您的电子邮件。`
                        : `Please enter your e-mail.`,
                    );
                    return;
                  } else if (!phone) {
                    Alert.alert(
                      country === "ko"
                        ? `전화번호를 입력해주세요.`
                        : country === "ja"
                        ? `電話番号を入力してください。`
                        : country === "es"
                        ? `Por favor, introduzca su número de teléfono.`
                        : country === "fr"
                        ? `Veuillez entrer votre numéro de téléphone.`
                        : country === "id"
                        ? `Masukkan nomor telepon anda.`
                        : country === "zh"
                        ? `请输入您的电话号码。`
                        : `Please enter your phone number.`,
                    );
                    return;
                  }
                  if (delayButton === true) return;
                  delayButton = true;

                  await api
                    .post("/payment/createSubscribe", {
                      cardNumber,
                      cardValidationYear,
                      cardValidationMonth,
                      amount: fanStep?.price * 1.1,
                      email,
                      name,
                      oversea,
                      overseasMethod,
                      phoneNumber: phone,
                      FanStepId: fanStep?.id,
                      YouId: you?.id,
                    })
                    .then(async res => {
                      if (res.data.status === "true") {
                        Alert.alert(
                          country === "ko"
                            ? `구매가 완료 되었습니다.`
                            : country === "ja"
                            ? `購入が完了しました。`
                            : country === "es"
                            ? `La compra se ha completado.`
                            : country === "fr"
                            ? `L'achat est terminé.`
                            : country === "id"
                            ? `Pembelian selesai.`
                            : country === "zh"
                            ? `购买完成。`
                            : `Purchase completed.`,
                        );
                        await AsyncStorage.setItem("subscribeEnd", "true");
                        navigation.navigate("Profile", {
                          YouId: you.id,
                          paymentSuccess: true,
                        });
                      } else if (res.data.bc) {
                        Alert.alert(
                          country === "ko"
                            ? `오류 발생 VIDEO IT 관리자 로 연락 바랍니다. (비씨카드, 우리은행이라면 다른카드로 부탁드립니다.)`
                            : country === "ja"
                            ? `エラーが発生したアンモメントマネージャに連絡してください。 （ビシーカード、ウリ銀行なら別カードでお願いします。）`
                            : country === "es"
                            ? `Se ha producido un error. Ponte en contacto con el administrador de &Moment. (Si es BC Card o Woori Bank, utilice una tarjeta diferente).`
                            : country === "fr"
                            ? `Une erreur s'est produite. Veuillez contacter l'administrateur de &Moment. (S'il s'agit de BC Card ou de Woori Bank, veuillez utiliser une autre carte.)`
                            : country === "id"
                            ? `Terjadi kesalahan. Silakan hubungi administrator &Moment. (Jika Kartu BC atau Bank Woori, harap gunakan kartu lain.)`
                            : country === "zh"
                            ? `发生错误，请联系&Moment管理员。 （如果是BC卡或友利银行，请使用其他卡。）`
                            : `An error has occurred. Please contact the &Moment administrator. (If it is BC Card or Woori Bank, please use a different card.)`,
                        );
                      } else {
                        Alert.alert(
                          country === "ko"
                            ? `오류 발생 VIDEO IT 관리자 로 연락 바랍니다.`
                            : country === "ja"
                            ? `エラーが発生しました nmoment管理者に連絡してください。`
                            : country === "es"
                            ? `Error ocurrido Comuníquese con el administrador de nmoment.`
                            : country === "fr"
                            ? `Erreur détectée Veuillez contacter le responsable nmoment.`
                            : country === "id"
                            ? `Kesalahan terjadi Silakan hubungi manajer nmoment.`
                            : country === "zh"
                            ? `发生错误 请联系nmoment经理。`
                            : `Error occurred Please contact nmoment manager.`,
                        );
                      }
                    });
                  delayButton = false;
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: PALETTE.COLOR_WHITE,
                  }}>
                  {country === "ko"
                    ? `구매하기`
                    : country === "ja"
                    ? `購入する`
                    : country === "es"
                    ? `Comprar`
                    : country === "fr"
                    ? `Acheter`
                    : country === "id"
                    ? `Beli`
                    : country === "zh"
                    ? `购买`
                    : `Purchase`}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              height: vh(8),
            }}></View>
        </ScrollView>
      </View>
    </NotchView>
  );
}
