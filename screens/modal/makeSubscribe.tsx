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
import {FANSTEP_DURATION} from "../../lib/constant/fanStep-constant";
import {Picker} from "@react-native-picker/picker";

export default function MakeSubscribe({
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
  const [title, setTitle] = useState("");
  const [benifits, setBenifits] = useState([]);
  const [step, setStep] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration]: any = useState(0);
  const [showDuration, setShowDuration]: any = useState(false);
  const [possibleStep, setPossibleStep] = useState([]);
  const [show, setShow] = useState(false);
  const [content, setContent]: any = useState("");
  const [loading, setLoading] = useState(false);

  const [editIndex, setEditIndex] = useState(null);
  const [title2, setTitle2] = useState("");
  const [benifits2, setBenifits2]: any = useState([]);
  const [step2, setStep2] = useState("");
  const [price2, setPrice2] = useState("");
  const [show2, setShow2] = useState(false);
  const [content2, setContent2]: any = useState("");
  const [duration2, setDuration2]: any = useState(0);
  const [showDuration2, setShowDuration2]: any = useState(false);
  const [possibleStep2, setPossibleStep2] = useState([]);

  const insets = useSafeAreaInsets();

  const [fanStepList, setFanStepList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        await api.get("/subscribe/getMyFanStep").then(res => {
          setFanStepList(res.data?.fanStepList);
          setPossibleStep(res.data?.possibleStep);
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
            zIndex: 5,
            bottom: 0,
            backgroundColor: "rgba(255,255,255,0.95)",
            color: "black",
          }}
          selectedValue={step}
          onValueChange={(itemValue, itemIndex) => {
            setStep(itemValue);
            setShow(false);
          }}>
          {possibleStep.map((list, idx) => (
            <Picker.Item
              style={{
                color: "black",
              }}
              label={`VIP ${list}`}
              value={list}
            />
          ))}
        </Picker>
      )}
      {show2 === true && (
        <Picker
          style={{
            position: "absolute",
            width: vw(100),
            zIndex: 5,
            bottom: 0,
            backgroundColor: "rgba(255,255,255,0.95)",
            color: "black",
          }}
          selectedValue={step2}
          onValueChange={(itemValue, itemIndex) => {
            setStep2(itemValue);
            setShow2(false);
          }}>
          {possibleStep.map((list, idx) => (
            <Picker.Item
              style={{
                color: "black",
              }}
              label={`VIP ${list}`}
              value={list}
            />
          ))}
        </Picker>
      )}
      {/*showDuration === true && (
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
          selectedValue={step}
          onValueChange={(itemValue, itemIndex) => {
            setDuration(itemValue);
            setShowDuration(false);
          }}>
          <Picker.Item
            label="결제일 기준 30일 이전 포스트까지 열람 가능"
            value={FANSTEP_DURATION.DURATION_30}
          />
          <Picker.Item
            label="모든 기간의 포스트 열람가능"
            value={FANSTEP_DURATION.DURATION_ALL}
          />
        </Picker>
        )*/}
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
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "black",
                      fontWeight: "400",
                      fontSize: 16,
                    }}>
                    {country === "ko"
                      ? `멤버십 생성`
                      : country === "ja"
                      ? `メンバーシップの作成`
                      : country === "es"
                      ? `Crear membresía`
                      : country === "fr"
                      ? `Créer une adhésion`
                      : country === "id"
                      ? `Buat keanggotaan`
                      : country === "zh"
                      ? `创建会员资格`
                      : `Create membership`}
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
                    setLoading(true);
                    setLoading(false);
                  }}>
                  <Text
                    style={{
                      color: PALETTE.COLOR_SKY,
                      fontWeight: "400",
                    }}></Text>
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
                <TouchableOpacity
                  activeOpacity={1}
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
                          uri: user?.profile,
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
                          flex: 1,
                        }}>
                        <TextInput
                          numberOfLines={1}
                          style={{
                            fontWeight: "bold",
                            marginBottom: 10,
                            color: "black",
                            borderBottomColor: PALETTE.COLOR_BORDER,
                            borderBottomWidth: 1,
                          }}
                          value={title}
                          onChangeText={e => {
                            setTitle(e);
                          }}
                          placeholder={
                            country === "ko"
                              ? "플랜 제목을 입력해주세요..."
                              : country === "ja"
                              ? "プランのタイトルを入力してください..."
                              : country === "es"
                              ? "Ingrese el título del plan..."
                              : country === "fr"
                              ? "Entrez le titre du plan..."
                              : country === "id"
                              ? "Masukkan judul rencana..."
                              : country === "zh"
                              ? "请输入计划标题..."
                              : "Please enter the plan title..."
                          }
                        />

                        {Platform.OS === "ios" ? (
                          <TouchableOpacity
                            style={{
                              borderBottomWidth: 1,
                              borderBottomColor: PALETTE.COLOR_BORDER,
                            }}
                            onPress={() => {
                              setShow(true);
                            }}>
                            <Text
                              style={{
                                fontWeight: "bold",
                                color: "#838383",
                                borderBottomWidth: 1,
                                borderBottomColor: PALETTE.COLOR_BORDER,
                              }}>
                              {step
                                ? `VIP ${step}`
                                : country === "ko"
                                ? "VIP 단계를 설정해주세요..."
                                : country === "ja"
                                ? "VIPレベルを設定してください..."
                                : country === "es"
                                ? "Configure el nivel VIP..."
                                : country === "fr"
                                ? "Définissez le niveau VIP..."
                                : country === "id"
                                ? "Atur tingkat VIP..."
                                : country === "zh"
                                ? "设置VIP级别..."
                                : "Please set the VIP level..."}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <SelectDropdown
                            defaultButtonText={
                              step
                                ? `VIP ${step}`
                                : country === "ko"
                                ? "VIP 단계를 설정해주세요..."
                                : country === "ja"
                                ? "VIPレベルを設定してください..."
                                : country === "es"
                                ? "Configure el nivel VIP..."
                                : country === "fr"
                                ? "Définissez le niveau VIP..."
                                : country === "id"
                                ? "Atur tingkat VIP..."
                                : country === "zh"
                                ? "设置VIP级别..."
                                : "Please set the VIP level..."
                            }
                            buttonStyle={{
                              borderRadius: 10,
                              //width: 70,
                              //height: 40,
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
                              // text represented after item is selected
                              // if data array is an array of objects then return selectedItem.property to render after item is selected

                              const after = `VIP ${selectedItem}`;
                              return after;
                            }}
                            rowTextForSelection={(item, index) => {
                              const after = `VIP ${item}`;
                              return after;
                              // text represented for each item in dropdown
                              // if data array is an array of objects then return item.property to represent item in dropdown
                            }}
                          />
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                      }}>
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
                      </Text>
                      <TextInput
                        style={{
                          fontSize: 22,
                          marginBottom: 10,
                          fontWeight: "500",
                          color: PALETTE.COLOR_RED,
                          borderBottomWidth: 1,
                          borderBottomColor: PALETTE.COLOR_BORDER,
                          flex: 1,
                        }}
                        value={price}
                        keyboardType="number-pad"
                        onChangeText={(e: any) => {
                          if (e >= 1000000) {
                            setPrice("1000000");
                          } else if (e.length >= 4) {
                            setPrice(String(Math.floor(Number(e) / 100) * 100));
                          } else {
                            setPrice(e);
                          }
                        }}
                        placeholder={
                          country === "ko"
                            ? "구독 금액을 입력해주세요..."
                            : country === "ja"
                            ? "購読金額を入力してください..."
                            : country === "es"
                            ? "Ingrese la cantidad de la suscripción..."
                            : country === "fr"
                            ? "Veuillez entrer le montant de l'abonnement..."
                            : country === "id"
                            ? "Masukkan jumlah langganan..."
                            : country === "zh"
                            ? "请输入订阅金额..."
                            : "Please enter the subscription amount..."
                        }
                      />
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
                          ? `VIP ${step} 이하 단계 포스팅 열람가능`
                          : country === "ja"
                          ? `VIP ${step}以下のステージの投稿を閲覧可能`
                          : country === "es"
                          ? `Posibilidad de ver publicaciones de nivel VIP ${step} o inferior`
                          : country === "fr"
                          ? `Consultation des publications de niveau VIP ${step} ou inférieur`
                          : country === "id"
                          ? `Dapat melihat posting tingkat VIP ${step} atau lebih rendah`
                          : country === "zh"
                          ? `可以查看VIP ${step}或更低级别的帖子`
                          : `Able to view VIP ${step} or lower level posts`}
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
                        marginTop: 12,
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
                      <TouchableOpacity
                        style={{
                          borderBottomWidth: 1,
                          borderBlockColor: PALETTE.COLOR_BORDER,
                          flex: 1,
                        }}
                        onPress={() => {
                          setShowDuration(true);
                        }}>
                        <Text
                          style={{
                            color: "#838383",
                            fontWeight: "500",
                          }}
                          numberOfLines={1}>
                          {duration === FANSTEP_DURATION.DURATION_30
                            ? "결제일 기준 30일 이전 포스트까지 열람 가능"
                            : duration === FANSTEP_DURATION.DURATION_ALL
                            ? "모든 기간의 포스트 열람가능"
                            : "포스트 열람 가능 기간을 설정해주세요."}
                        </Text>
                      </TouchableOpacity>
                    </View>
                          */}
                    <View
                      style={{
                        marginTop: 12,
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
                      <View
                        style={{
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "center",
                          flex: 1,
                          justifyContent: "space-between",
                        }}>
                        <TextInput
                          style={{
                            color: "black",
                            fontWeight: "500",
                            borderBottomWidth: 1,
                            borderBottomColor: PALETTE.COLOR_BORDER,
                            flex: 1,
                          }}
                          value={content}
                          onChangeText={e => {
                            setContent(e);
                          }}
                          numberOfLines={1}
                          placeholder={
                            country === "ko"
                              ? "구독 혜택을 적어보세요!"
                              : country === "ja"
                              ? "購読の特典を書いてみてください！"
                              : country === "es"
                              ? "¡Escribe los beneficios de la suscripción!"
                              : country === "fr"
                              ? "Écrivez les avantages de l'abonnement !"
                              : country === "id"
                              ? "Tulis manfaat langganan!"
                              : country === "zh"
                              ? "写下订阅的好处！"
                              : "Write down the subscription benefits!"
                          }
                        />

                        <TouchableOpacity
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            marginLeft: 10,
                          }}
                          onPress={() => {
                            setBenifits(benifits.concat(content));
                            setContent("");
                          }}>
                          <Image
                            source={require("../../assets/setting/addNavy.png")}
                            style={{
                              width: 35,
                              height: 35,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    {benifits.map((list, idx) => (
                      <View
                        key={idx}
                        style={{
                          marginTop: 6,
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}>
                        <View
                          style={{
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
                            {list}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() => {
                            setBenifits(
                              benifits.filter((item, index) => idx !== index),
                            );
                          }}>
                          <Image
                            source={require("../../assets/setting/cancel.png")}
                            style={{
                              width: 30,
                              height: 30,
                            }}></Image>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                  <View
                    style={{
                      marginTop: vh(4),
                    }}>
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        backgroundColor: PALETTE.COLOR_NAVY,
                        height: 40,
                      }}
                      onPress={async () => {
                        //navigation.navigate("Subscribe");

                        if (title === "" || !title) {
                          Alert.alert(
                            country === "ko"
                              ? "플랜 제목을 입력해주세요."
                              : country === "ja"
                              ? "プランのタイトルを入力してください。"
                              : country === "es"
                              ? "Ingresa el título del plan."
                              : country === "fr"
                              ? "Entrez le titre du plan."
                              : country === "id"
                              ? "Masukkan judul rencana."
                              : country === "zh"
                              ? "请输入计划标题。"
                              : "Please enter the plan title.",
                          );
                          return;
                        } else if (step === "" || !step) {
                          Alert.alert(
                            country === "ko"
                              ? "VIP 단계를 설정해주세요."
                              : country === "ja"
                              ? "VIPレベルを設定してください。"
                              : country === "es"
                              ? "Configure el nivel VIP, por favor."
                              : country === "fr"
                              ? "Veuillez définir le niveau VIP."
                              : country === "id"
                              ? "Atur tingkat VIP, silakan."
                              : country === "zh"
                              ? "请设置VIP级别。"
                              : "Please set the VIP level.",
                          );
                          return;
                        } else if (price === "" || !price) {
                          Alert.alert(
                            country === "ko"
                              ? "구독 금액을 입력해주세요."
                              : country === "ja"
                              ? "定期購読料金を入力してください。"
                              : country === "es"
                              ? "Por favor, ingrese la tarifa de suscripción."
                              : country === "fr"
                              ? "Veuillez saisir le montant de l'abonnement."
                              : country === "id"
                              ? "Masukkan biaya berlangganan, silakan."
                              : country === "zh"
                              ? "请输入订阅费。"
                              : "Please enter the subscription fee.",
                          );
                          return;
                        } else if (Number(price) < 5000) {
                          Alert.alert(
                            country === "ko"
                              ? "구독 금액 설정은 최소 5천원 입니다."
                              : country === "ja"
                              ? "定期購読料金の設定は最低5000ウォンです。"
                              : country === "es"
                              ? "La configuración de la tarifa de suscripción es de al menos 5,000 won."
                              : country === "fr"
                              ? "Le montant de l'abonnement est fixé à un minimum de 5 000 wons."
                              : country === "id"
                              ? "Pengaturan biaya berlangganan minimum 5.000 won."
                              : country === "zh"
                              ? "订阅费最低设置为5000韩元。"
                              : "Subscription fee setting is a minimum of 5,000 won.",
                          );
                          return;
                        } /* else if (duration === "" || !duration) {
                          Alert.alert("포스트 열람 가능 기간을 설정 해주세요.");
                          return;
                        }*/
                        await api
                          .post("/subscribe/createFanStep", {
                            title,
                            step,
                            price,
                            benifits,
                            duration,
                          })
                          .then(res => {
                            if (res.data.status === "true") {
                              Alert.alert(
                                country === "ko"
                                  ? "생성 완료"
                                  : country === "ja"
                                  ? "生成完了"
                                  : country === "es"
                                  ? "Creación completa"
                                  : country === "fr"
                                  ? "Création terminée"
                                  : country === "id"
                                  ? "Pembuatan selesai"
                                  : country === "zh"
                                  ? "生成完成"
                                  : "Creation complete",
                                country === "ko"
                                  ? "새 멤버십이 생성 되었습니다!"
                                  : country === "ja"
                                  ? "新しいメンバーシップが作成されました！"
                                  : country === "es"
                                  ? "¡Se ha creado una nueva membresía!"
                                  : country === "fr"
                                  ? "Un nouvel abonnement a été créé !"
                                  : country === "id"
                                  ? "Keanggotaan baru telah dibuat!"
                                  : country === "zh"
                                  ? "新会员已创建！"
                                  : "A new membership has been created!",
                              );
                              setFanStepList(res.data?.fanStepList);
                              setPossibleStep(res.data?.possibleStep);
                              setTitle("");
                              setPrice("");
                              setStep("");
                              setContent("");
                              setBenifits([]);
                              setDuration(0);
                            } else if (res.data.status === "price") {
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
                                  ? "멤버십 금액은 1에서 10으로 갈수록 높은 금액으로 입력해주세요."
                                  : country === "ja"
                                  ? "メンバーシップの金額は1から10になるほど高い金額で入力してください。"
                                  : country === "es"
                                  ? "Ingrese el monto de la membresía en cantidades crecientes del 1 al 10."
                                  : country === "fr"
                                  ? "Veuillez saisir le montant de l'adhésion par montant croissant de 1 à 10."
                                  : country === "id"
                                  ? "Silakan masukkan jumlah keanggotaan dalam jumlah yang meningkat dari 1 menjadi 10."
                                  : country === "zh"
                                  ? "请按从 1 到 10 递增的顺序输入会员金额。"
                                  : "Please enter the membership amount in increasing amounts from 1 to 10.",
                              );
                            }
                          });
                      }}>
                      <Text
                        style={{
                          color: PALETTE.COLOR_WHITE,
                        }}>
                        {country === "ko"
                          ? "생성하기"
                          : country === "ja"
                          ? "作成する"
                          : country === "es"
                          ? "Crear"
                          : country === "fr"
                          ? "Créer"
                          : country === "id"
                          ? "Buat"
                          : country === "zh"
                          ? "创建"
                          : "Create"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {fanStepList.map((list: any, idx) =>
                  editIndex === list?.id ? (
                    <TouchableOpacity
                      activeOpacity={1}
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
                              uri: user?.profile,
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
                              flex: 1,
                            }}>
                            <TextInput
                              numberOfLines={1}
                              style={{
                                fontWeight: "bold",
                                marginBottom: 10,
                                color: "black",
                                borderBottomColor: PALETTE.COLOR_BORDER,
                                borderBottomWidth: 1,
                              }}
                              value={title2}
                              onChangeText={e => {
                                setTitle2(e);
                              }}
                              placeholder={
                                country === "ko"
                                  ? "플랜 제목을 입력해주세요..."
                                  : country === "ja"
                                  ? "プランのタイトルを入力してください..."
                                  : country === "es"
                                  ? "Ingrese el título del plan..."
                                  : country === "fr"
                                  ? "Entrez le titre du plan..."
                                  : country === "id"
                                  ? "Masukkan judul rencana..."
                                  : country === "zh"
                                  ? "请输入计划标题..."
                                  : "Please enter the plan title..."
                              }
                            />

                            {Platform.OS === "ios" ? (
                              <TouchableOpacity
                                style={{
                                  borderBottomWidth: 1,
                                  borderBottomColor: PALETTE.COLOR_BORDER,
                                }}
                                onPress={() => {
                                  setShow2(true);
                                }}>
                                <Text
                                  style={{
                                    fontWeight: "bold",
                                    color: "#838383",
                                    borderBottomWidth: 1,
                                    borderBottomColor: PALETTE.COLOR_BORDER,
                                  }}>
                                  {step2
                                    ? `VIP ${step2}`
                                    : country === "ko"
                                    ? "VIP 단계를 설정해주세요..."
                                    : country === "ja"
                                    ? "VIPレベルを設定してください..."
                                    : country === "es"
                                    ? "Configure el nivel VIP..."
                                    : country === "fr"
                                    ? "Définissez le niveau VIP..."
                                    : country === "id"
                                    ? "Atur tingkat VIP..."
                                    : country === "zh"
                                    ? "设置VIP级别..."
                                    : "Please set the VIP level..."}
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <SelectDropdown
                                defaultButtonText={
                                  step2
                                    ? `VIP ${step2}`
                                    : country === "ko"
                                    ? "VIP 단계를 설정해주세요..."
                                    : country === "ja"
                                    ? "VIPレベルを設定してください..."
                                    : country === "es"
                                    ? "Configure el nivel VIP..."
                                    : country === "fr"
                                    ? "Définissez le niveau VIP..."
                                    : country === "id"
                                    ? "Atur tingkat VIP..."
                                    : country === "zh"
                                    ? "设置VIP级别..."
                                    : "Please set the VIP level..."
                                }
                                buttonStyle={{
                                  borderRadius: 10,
                                  //width: 70,
                                  //height: 40,
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
                                  setStep2(selectedItem);
                                  setShow2(false);
                                }}
                                buttonTextAfterSelection={(
                                  selectedItem,
                                  index,
                                ) => {
                                  const after = `VIP ${selectedItem}`;
                                  return after;
                                  // text represented after item is selected
                                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                                  //return selectedItem;
                                }}
                                rowTextForSelection={(item, index) => {
                                  const after = `VIP ${item}`;
                                  return after;
                                  // text represented for each item in dropdown
                                  // if data array is an array of objects then return item.property to represent item in dropdown
                                  //return item;
                                }}
                              />
                            )}
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                          }}>
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
                            {Number(price2).toLocaleString()}
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
                              ? `VIP ${step2} 이하 단계 포스팅 열람가능`
                              : country === "ja"
                              ? `VIP ${step2}以下のステージの投稿を閲覧可能`
                              : country === "es"
                              ? `Posibilidad de ver publicaciones de nivel VIP ${step2} o inferior`
                              : country === "fr"
                              ? `Consultation des publications de niveau VIP ${step2} ou inférieur`
                              : country === "id"
                              ? `Dapat melihat posting tingkat VIP ${step2} atau lebih rendah`
                              : country === "zh"
                              ? `可以查看VIP ${step2}或更低级别的帖子`
                              : `Able to view VIP ${step2} or lower level posts`}
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
                        marginTop: 12,
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
                      <TouchableOpacity
                        style={{
                          borderBottomWidth: 1,
                          borderBlockColor: PALETTE.COLOR_BORDER,
                          flex: 1,
                        }}
                        onPress={() => {
                          setShowDuration(true);
                        }}>
                        <Text
                          style={{
                            color: "#838383",
                            fontWeight: "500",
                          }}
                          numberOfLines={1}>
                          {duration === FANSTEP_DURATION.DURATION_30
                            ? "결제일 기준 30일 이전 포스트까지 열람 가능"
                            : duration === FANSTEP_DURATION.DURATION_ALL
                            ? "모든 기간의 포스트 열람가능"
                            : "포스트 열람 가능 기간을 설정해주세요."}
                        </Text>
                      </TouchableOpacity>
                    </View>
                          */}
                        <View
                          style={{
                            marginTop: 12,
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
                          <View
                            style={{
                              flexDirection: "row",
                              alignContent: "center",
                              alignItems: "center",
                              flex: 1,
                              justifyContent: "space-between",
                            }}>
                            <TextInput
                              style={{
                                color: "black",
                                fontWeight: "500",
                                borderBottomWidth: 1,
                                borderBottomColor: PALETTE.COLOR_BORDER,
                                flex: 1,
                              }}
                              value={content2}
                              onChangeText={e => {
                                setContent2(e);
                              }}
                              numberOfLines={1}
                              placeholder={
                                country === "ko"
                                  ? "구독 혜택을 적어보세요!"
                                  : country === "ja"
                                  ? "購読の特典を書いてみてください！"
                                  : country === "es"
                                  ? "¡Escribe los beneficios de la suscripción!"
                                  : country === "fr"
                                  ? "Écrivez les avantages de l'abonnement !"
                                  : country === "id"
                                  ? "Tulis manfaat langganan!"
                                  : country === "zh"
                                  ? "写下订阅的好处！"
                                  : "Write down the subscription benefits!"
                              }
                            />

                            <TouchableOpacity
                              style={{
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                                marginLeft: 10,
                              }}
                              onPress={() => {
                                setBenifits2(
                                  benifits2.concat({
                                    content: content2,
                                  }),
                                );
                                setContent2("");
                              }}>
                              <Image
                                source={require("../../assets/setting/addNavy.png")}
                                style={{
                                  width: 35,
                                  height: 35,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        {benifits2.map((list: any, idx: number) => (
                          <View
                            key={idx}
                            style={{
                              marginTop: 6,
                              flexDirection: "row",
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}>
                            <View
                              style={{
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
                                {list?.content}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={{
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                              }}
                              onPress={() => {
                                setBenifits2(
                                  benifits2.filter(
                                    (item: any, index: number) => idx !== index,
                                  ),
                                );
                              }}>
                              <Image
                                source={require("../../assets/setting/cancel.png")}
                                style={{
                                  width: 30,
                                  height: 30,
                                }}></Image>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                      <View
                        style={{
                          marginTop: vh(4),
                        }}>
                        <TouchableOpacity
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                            backgroundColor: PALETTE.COLOR_NAVY,
                            height: 40,
                            marginBottom: 10,
                          }}
                          onPress={async () => {
                            //navigation.navigate("Subscribe");

                            if (title2 === "" || !title2) {
                              Alert.alert(
                                country === "ko"
                                  ? "플랜 제목을 입력해주세요."
                                  : country === "ja"
                                  ? "プランのタイトルを入力してください。"
                                  : country === "es"
                                  ? "Ingresa el título del plan."
                                  : country === "fr"
                                  ? "Entrez le titre du plan."
                                  : country === "id"
                                  ? "Masukkan judul rencana."
                                  : country === "zh"
                                  ? "请输入计划标题。"
                                  : "Please enter the plan title.",
                              );
                              return;
                            } else if (step2 === "" || !step2) {
                              Alert.alert(
                                country === "ko"
                                  ? "VIP 단계를 설정해주세요."
                                  : country === "ja"
                                  ? "VIPレベルを設定してください。"
                                  : country === "es"
                                  ? "Configure el nivel VIP, por favor."
                                  : country === "fr"
                                  ? "Veuillez définir le niveau VIP."
                                  : country === "id"
                                  ? "Atur tingkat VIP, silakan."
                                  : country === "zh"
                                  ? "请设置VIP级别。"
                                  : "Please set the VIP level.",
                              );
                              return;
                            } else if (price2 === "" || !price2) {
                              Alert.alert(
                                country === "ko"
                                  ? "구독 금액을 입력해주세요."
                                  : country === "ja"
                                  ? "定期購読料金を入力してください。"
                                  : country === "es"
                                  ? "Por favor, ingrese la tarifa de suscripción."
                                  : country === "fr"
                                  ? "Veuillez saisir le montant de l'abonnement."
                                  : country === "id"
                                  ? "Masukkan biaya berlangganan, silakan."
                                  : country === "zh"
                                  ? "请输入订阅费。"
                                  : "Please enter the subscription fee.",
                              );
                              return;
                            } else if (Number(price2) < 5000) {
                              Alert.alert(
                                country === "ko"
                                  ? "구독 금액 설정은 최소 5천원 입니다."
                                  : country === "ja"
                                  ? "定期購読料金の設定は最低5000ウォンです。"
                                  : country === "es"
                                  ? "La configuración de la tarifa de suscripción es de al menos 5,000 won."
                                  : country === "fr"
                                  ? "Le montant de l'abonnement est fixé à un minimum de 5 000 wons."
                                  : country === "id"
                                  ? "Pengaturan biaya berlangganan minimum 5.000 won."
                                  : country === "zh"
                                  ? "订阅费最低设置为5000韩元。"
                                  : "Subscription fee setting is a minimum of 5,000 won.",
                              );
                              return;
                            } else if (Number(price2) > 1000000) {
                              Alert.alert(
                                country === "ko"
                                  ? "구독 금액 설정은 최대 100만원 입니다."
                                  : country === "ja"
                                  ? "購読金額の設定は最大100万ウォンです。"
                                  : country === "es"
                                  ? "El monto de la suscripción se puede establecer en un máximo de 1 millón de wones."
                                  : country === "fr"
                                  ? "Le montant de la souscription peut être fixé à un maximum de 1 million de won."
                                  : country === "id"
                                  ? "Jumlah berlangganan dapat diatur hingga maksimum 1 juta won."
                                  : country === "zh"
                                  ? "认购金额最高可设定为100万韩元。"
                                  : "The subscription amount can be set to a maximum of 1 million won.",
                              );
                              return;
                            }

                            Alert.alert(
                              country === "ko"
                                ? `멤버십 단계 변경시 기존 멤버십단계와 동일한 단계의 게시글 또한 등급이 변경됩니다. 정말 변경하시겠습니까?`
                                : country === "ja"
                                ? `この投稿の閲覧権を購入しますか？`
                                : country === "es"
                                ? `¿Desea comprar el derecho de acceso a esta publicación?`
                                : country === "fr"
                                ? `Souhaitez-vous acheter le droit d'accès à cette publication ?`
                                : country === "id"
                                ? `Apakah Anda ingin membeli hak akses ke postingan ini?`
                                : country === "zh"
                                ? `您要购买此帖子的阅览权吗？`
                                : `Do you want to purchase the access right to this post?`,
                              "",
                              [
                                {
                                  text:
                                    country === "ko"
                                      ? `취소`
                                      : country === "ja"
                                      ? `キャンセル`
                                      : country === "es"
                                      ? `cancelación`
                                      : country === "fr"
                                      ? `annulation`
                                      : country === "id"
                                      ? `pembatalan`
                                      : country === "zh"
                                      ? `消除`
                                      : `cancellation`,
                                  style: "cancel",
                                },
                                {
                                  text:
                                    country === "ko"
                                      ? `확인`
                                      : country === "ja"
                                      ? `確認`
                                      : country === "es"
                                      ? `Confirmar`
                                      : country === "fr"
                                      ? `Confirmer`
                                      : country === "id"
                                      ? `Konfirmasi`
                                      : country === "zh"
                                      ? `确认`
                                      : `Confirm`,
                                  onPress: async () => {
                                    await api
                                      .post("/subscribe/updateFanStep", {
                                        FanStepId: list?.id,
                                        title: title2,
                                        step: step2,
                                        price: price2,
                                        benifits: benifits2,
                                        duration: duration2,
                                      })
                                      .then(res => {
                                        if (res.data.status === "true") {
                                          Alert.alert(
                                            country === "ko"
                                              ? "생성 완료"
                                              : country === "ja"
                                              ? "生成完了"
                                              : country === "es"
                                              ? "Creación completa"
                                              : country === "fr"
                                              ? "Création terminée"
                                              : country === "id"
                                              ? "Pembuatan selesai"
                                              : country === "zh"
                                              ? "生成完成"
                                              : "Creation complete",
                                            country === "ko"
                                              ? "새 멤버십이 생성 되었습니다!"
                                              : country === "ja"
                                              ? "新しいメンバーシップが作成されました！"
                                              : country === "es"
                                              ? "¡Se ha creado una nueva membresía!"
                                              : country === "fr"
                                              ? "Un nouvel abonnement a été créé !"
                                              : country === "id"
                                              ? "Keanggotaan baru telah dibuat!"
                                              : country === "zh"
                                              ? "新会员已创建！"
                                              : "A new membership has been created!",
                                          );
                                          setFanStepList(res.data?.fanStepList);
                                          setPossibleStep(
                                            res.data?.possibleStep,
                                          );
                                          setTitle2("");
                                          setPrice2("");
                                          setStep2("");
                                          setContent2("");
                                          setBenifits2([]);
                                          setDuration2(0);
                                          setEditIndex(null);
                                        } else if (
                                          res.data.status === "price"
                                        ) {
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
                                              ? "멤버십 금액은 1에서 10으로 갈수록 높은 금액으로 입력해주세요."
                                              : country === "ja"
                                              ? "メンバーシップの金額は1から10になるほど高い金額で入力してください。"
                                              : country === "es"
                                              ? "Ingrese el monto de la membresía en cantidades crecientes del 1 al 10."
                                              : country === "fr"
                                              ? "Veuillez saisir le montant de l'adhésion par montant croissant de 1 à 10."
                                              : country === "id"
                                              ? "Silakan masukkan jumlah keanggotaan dalam jumlah yang meningkat dari 1 menjadi 10."
                                              : country === "zh"
                                              ? "请按从 1 到 10 递增的顺序输入会员金额。"
                                              : "Please enter the membership amount in increasing amounts from 1 to 10.",
                                          );
                                        }
                                      });
                                  },
                                },
                              ],
                            );
                          }}>
                          <Text
                            style={{
                              color: PALETTE.COLOR_WHITE,
                            }}>
                            {country === "ko"
                              ? "변경하기"
                              : country === "ja"
                              ? "変更する"
                              : country === "es"
                              ? "cambiar"
                              : country === "fr"
                              ? "changement"
                              : country === "id"
                              ? "mengubah"
                              : country === "zh"
                              ? "改变"
                              : "change"}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                            backgroundColor: PALETTE.COLOR_NAVY,
                            height: 40,
                          }}
                          onPress={async () => {
                            //navigation.navigate("Subscribe");
                            setEditIndex(null);
                          }}>
                          <Text
                            style={{
                              color: PALETTE.COLOR_WHITE,
                            }}>
                            {country === "ko"
                              ? "취소하기"
                              : country === "ja"
                              ? "キャンセルする"
                              : country === "es"
                              ? "Cancelar"
                              : country === "fr"
                              ? "Annuler"
                              : country === "id"
                              ? "Membatalkan"
                              : country === "zh"
                              ? "取消"
                              : "Cancel"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={1}
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
                              uri: user?.profile,
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
                              {list?.title}
                            </Text>
                            <Text
                              style={{
                                fontWeight: "bold",
                                color: "#838383",
                              }}>
                              VIP {list?.step}
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
                          {Number(list?.price).toLocaleString()}
                        </Text>

                        {list?.Benifits.map((item: any, index: number) => (
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
                              ? `VIP ${list?.step} 이하 단계 포스팅 열람가능`
                              : country === "ja"
                              ? `VIP ${list?.step}以下のステージの投稿を閲覧可能`
                              : country === "es"
                              ? `Posibilidad de ver publicaciones de nivel VIP ${list?.step} o inferior`
                              : country === "fr"
                              ? `Consultation des publications de niveau VIP ${list?.step} ou inférieur`
                              : country === "id"
                              ? `Dapat melihat posting tingkat VIP ${list?.step} atau lebih rendah`
                              : country === "zh"
                              ? `可以查看VIP ${list?.step}或更低级别的帖子`
                              : `Able to view VIP ${list?.step} or lower level posts`}
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
                      </View>
                      <View
                        style={{
                          marginTop: vh(4),
                        }}>
                        <TouchableOpacity
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                            backgroundColor: PALETTE.COLOR_NAVY,
                            height: 40,
                            marginBottom: 10,
                          }}
                          onPress={async () => {
                            setEditIndex(list?.id);
                            setTitle2(list?.title);
                            setStep2(list?.step);
                            setPrice2(list?.price.toString());
                            setBenifits2(list?.Benifits);
                          }}>
                          <Text
                            style={{
                              color: PALETTE.COLOR_WHITE,
                            }}>
                            {country === "ko"
                              ? "수정하기"
                              : country === "ja"
                              ? "修正する"
                              : country === "es"
                              ? "Editar"
                              : country === "fr"
                              ? "Modifier"
                              : country === "id"
                              ? "Sunting"
                              : country === "zh"
                              ? "编辑"
                              : "Edit"}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                            backgroundColor: PALETTE.COLOR_NAVY,
                            height: 40,
                          }}
                          onPress={async () => {
                            //navigation.navigate("Subscribe");
                            Alert.alert(
                              country === "ko"
                                ? "멤버십 삭제시 기존 구매 유저들은 만료까지 유지되며, 재구독 되지 않습니다. 정말 삭제 하시겠습니까?"
                                : country === "ja"
                                ? "メンバーシップを削除すると、既存の購入ユーザーは期限切れまで維持され、再購読されません。本当に削除してもよろしいですか？"
                                : country === "es"
                                ? "Al eliminar la membresía, los usuarios compradores existentes permanecerán hasta el vencimiento y no podrán volver a suscribirse. ¿Estás seguro de que quieres eliminarlo?"
                                : country === "fr"
                                ? "Lors de la suppression de l'adhésion, les utilisateurs acheteurs existants resteront jusqu'à l'expiration et ne pourront pas se réabonner. Êtes-vous sûr de vouloir le supprimer ?"
                                : country === "id"
                                ? "Saat menghapus keanggotaan, pengguna pembelian yang ada akan tetap ada hingga habis masa berlakunya dan tidak akan dapat berlangganan kembali. Apakah Anda yakin ingin menghapusnya?"
                                : country === "zh"
                                ? "删除会员资格时，现有购买用户将保留至到期，并且无法重新订阅。您确定要删除它吗？"
                                : "When deleting membership, existing purchasing users will remain until expiration and will not be able to re-subscribe. Are you sure you want to delete it?",
                              "",
                              [
                                {
                                  text:
                                    country === "ko"
                                      ? `취소`
                                      : country === "ja"
                                      ? `キャンセル`
                                      : country === "es"
                                      ? `cancelación`
                                      : country === "fr"
                                      ? `annulation`
                                      : country === "id"
                                      ? `pembatalan`
                                      : country === "zh"
                                      ? `消除`
                                      : `cancellation`,
                                  style: "cancel",
                                },
                                {
                                  text:
                                    country === "ko"
                                      ? `확인`
                                      : country === "ja"
                                      ? `確認`
                                      : country === "es"
                                      ? `Confirmar`
                                      : country === "fr"
                                      ? `Confirmer`
                                      : country === "id"
                                      ? `Konfirmasi`
                                      : country === "zh"
                                      ? `确认`
                                      : `Confirm`,
                                  onPress: async () => {
                                    await api
                                      .delete("/subscribe/removeFanStep", {
                                        data: {
                                          FanStepId: list.id,
                                        },
                                      })
                                      .then(res => {
                                        if (res.data.status === "true") {
                                          Alert.alert(
                                            country === "ko"
                                              ? "삭제 완료"
                                              : country === "ja"
                                              ? "削除完了"
                                              : country === "es"
                                              ? "Eliminación completada"
                                              : country === "fr"
                                              ? "Suppression terminée"
                                              : country === "id"
                                              ? "Penghapusan selesai"
                                              : country === "zh"
                                              ? "删除成功"
                                              : "Deletion completed",
                                            country === "ko"
                                              ? "멤버십이 삭제 되었습니다."
                                              : country === "ja"
                                              ? "メンバーシップが削除されました。"
                                              : country === "es"
                                              ? "La membresía ha sido eliminada."
                                              : country === "fr"
                                              ? "L'adhésion a été supprimée."
                                              : country === "id"
                                              ? "Keanggotaan telah dihapus."
                                              : country === "zh"
                                              ? "会员资格已被删除。"
                                              : "Membership has been deleted.",
                                          );
                                          setFanStepList(res.data?.fanStepList);
                                          setPossibleStep(
                                            res.data?.possibleStep,
                                          );
                                        }
                                      });
                                  },
                                },
                              ],
                            );
                          }}>
                          <Text
                            style={{
                              color: PALETTE.COLOR_WHITE,
                            }}>
                            {country === "ko"
                              ? "삭제하기"
                              : country === "ja"
                              ? "削除"
                              : country === "es"
                              ? "Borrar"
                              : country === "fr"
                              ? "Supprimer"
                              : country === "id"
                              ? "Hapus"
                              : country === "zh"
                              ? "删除"
                              : "Delete"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ),
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
