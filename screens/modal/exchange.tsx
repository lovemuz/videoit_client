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
import SelectDropdown from "react-native-select-dropdown";
import {
  EXCHANGE_STATE,
  EXCHANGE_TYPE,
} from "../../lib/constant/exchange-constant";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ToastComponent} from "../reusable/useToast";
import {USER_GENDER} from "../../lib/constant/user-constant";
import {COUNTRY_LIST} from "../../lib/constant/country-constant";

export default function Exchange({
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
  const isLoadingRef = useRef(false);

  const [exchangeList, setExchangeList]: any = useState([]);
  const pageNum: any = useRef(0);
  const pageSize: any = useRef(20);

  const [firstRender, setFirstRender] = useState(false);
  const [exchangeState, setExchangeState] = useState(
    user.gender === USER_GENDER.BOY ? "구독환전" : "환전신청",
  );
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountCode, setAccountCode] = useState(null);
  const [accountName, setAccountName] = useState("");
  const [registrationName, setRegistrationName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [money, setMoney]: any = useState(0);
  const [money2, setMoney2]: any = useState(0);
  const [type, setType] = useState(0); //0 주민등록번호, 1 사업자

  const [subMoney, setSubMoney]: any = useState(0);

  const [creatorAuth, setCreatorAuth]: any = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        await api.get("/user/getCreatorAuth").then(res => {
          setCreatorAuth(res.data.creatorAuth);
        });
      } catch (err) {}
      try {
        await api.get("/point/getMyPoint").then(res => {
          updatePoint(res.data.point);
        });
      } catch (err) {}
      try {
        await api.get("/point/getMyMoney").then(res => {
          setSubMoney(res.data.money);
        });
      } catch (err) {}
      try {
        await api.get("/exchange/getMyAccount").then(res => {
          const account = res.data.account;
          setAccountName(account?.accountName);
          setAccountNumber(account?.accountNumber);
          setAccountCode(account?.accountCode);
          setRegistrationName(account?.registrationName);
          setRegistrationNumber(account?.registrationNumber);
        });
      } catch (err) {}
      try {
        await api
          .get("/exchange/exchageList", {
            params: {
              pageNum: 0,
              pageSize: pageSize.current,
            },
          })
          .then(res => {
            pageNum.current = 1;
            setExchangeList(res.data.exchageList);
          });
      } catch (err) {}
      setFirstRender(true);
    }
    fetchData();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await api
      .get("/exchange/exchageList", {
        params: {
          pageNum: 0,
          pageSize: pageSize.current,
        },
      })
      .then(res => {
        pageNum.current = 1;
        setExchangeList(res.data.exchageList);
      });
    setRefreshing(false);
  }, [user]);
  const insets = useSafeAreaInsets();
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
                flex: 1,
                alignItems: "flex-start",
                justifyContent: "center",
                alignContent: "center",
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
                  fontWeight: "400",
                  fontSize: 15,
                  color: "black",
                }}>
                {country === "ko"
                  ? "환전하기"
                  : country === "ja"
                  ? "両替する"
                  : country === "es"
                  ? "Cambiar dinero"
                  : country === "fr"
                  ? "Échanger de l'argent"
                  : country === "id"
                  ? "Menukar uang"
                  : country === "zh"
                  ? "兑换货币"
                  : "Exchange money"}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "flex-end",
              }}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  borderRadius: 100,
                  paddingLeft: 4,
                  paddingRight: 2,
                  paddingTop: 2,
                  paddingBottom: 2,
                  backgroundColor: PALETTE.COLOR_WHITE,
                }}
                onPress={() => {
                  //navigation.navigate("Store");
                }}>
                <Image
                  source={require("../../assets/setting/point.png")}
                  style={{
                    backgroundColor: PALETTE.COLOR_WHITE,
                    borderRadius: 100,
                    width: 25,
                    height: 25,
                    marginRight: 2,
                  }}></Image>
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    backgroundColor: PALETTE.COLOR_WHITE,
                    borderRadius: 100,
                    paddingTop: 9,
                    paddingBottom: 9,
                    paddingLeft: 5,
                    paddingRight: 5,
                    minWidth: 30,
                  }}>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "black",
                      fontWeight: "bold",
                    }}>
                    {Number(point?.amount).toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            marginLeft: vw(4),
            marginRight: vw(4),
            marginTop: vh(2),
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
          }}>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              marginRight: 20,
            }}>
            <Text
              style={{
                color: "black",
                fontWeight: "bold",
                fontSize: 12,
                marginRight: 10,
              }}>
              {country === "ko"
                ? "포인트"
                : country === "ja"
                ? "ポイント"
                : country === "es"
                ? "Punto"
                : country === "fr"
                ? "Point"
                : country === "id"
                ? "Poin"
                : country === "zh"
                ? "积分"
                : "Point"}
            </Text>
            <Text
              style={{
                color: PALETTE.COLOR_RED,
                fontSize: 12,
                fontWeight: "bold",
              }}>
              {Number(point?.amount).toLocaleString()} P
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
                color: "black",
                fontWeight: "bold",
                fontSize: 12,
                marginRight: 10,
              }}>
              {country === "ko"
                ? "구독 수익"
                : country === "ja"
                ? "サブスクリプション収益"
                : country === "es"
                ? "Ingresos por suscripción"
                : country === "fr"
                ? "Revenus d'abonnement"
                : country === "id"
                ? "Pendapatan langganan"
                : country === "zh"
                ? "订阅收入"
                : "Subscription revenue"}
            </Text>
            <Text
              style={{
                color: PALETTE.COLOR_RED,
                fontSize: 12,
                fontWeight: "bold",
              }}>
              ₩ {Number(subMoney?.amount).toLocaleString()}
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingLeft: vw(4),
            paddingRight: vw(4),
            paddingTop: vh(2),
            paddingBottom: vh(2),
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
          }}>
          {user.gender !== USER_GENDER.BOY && (
            <TouchableOpacity
              style={{
                borderRadius: 10,
                width: 70,
                height: 40,
                backgroundColor: PALETTE.COLOR_BACK,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
              onPress={() => {
                setExchangeState("환전신청");
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: "black",
                }}>
                {country === "ko"
                  ? "환전신청"
                  : country === "ja"
                  ? "両替申請"
                  : country === "es"
                  ? "Solicitud de cambio"
                  : country === "fr"
                  ? "Demande de change"
                  : country === "id"
                  ? "Permohonan penukaran uang"
                  : country === "zh"
                  ? "兑换申请"
                  : "Exchange request"}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              borderRadius: 10,
              width: 70,
              height: 40,
              backgroundColor: PALETTE.COLOR_BACK,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
            onPress={() => {
              setExchangeState("구독환전");
            }}>
            <Text
              style={{
                fontSize: 12,
                color: "black",
              }}>
              {country === "ko"
                ? "구독환전"
                : country === "ja"
                ? "サブスクリプションの両替"
                : country === "es"
                ? "Cambio de suscripción"
                : country === "fr"
                ? "Échange d'abonnement"
                : country === "id"
                ? "Penukaran langganan"
                : country === "zh"
                ? "订阅兑换"
                : "Subscription exchange"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setExchangeState("환전내역");
            }}
            style={{
              borderRadius: 10,
              width: 70,
              height: 40,
              backgroundColor: PALETTE.COLOR_BACK,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}>
            <Text
              style={{
                fontSize: 12,
                color: "black",
              }}>
              {country === "ko"
                ? "환전내역"
                : country === "ja"
                ? "両替履歴"
                : country === "es"
                ? "Historial de cambio"
                : country === "fr"
                ? "Historique des échanges"
                : country === "id"
                ? "Riwayat penukaran uang"
                : country === "zh"
                ? "兑换记录"
                : "Exchange history"}
            </Text>
          </TouchableOpacity>
        </View>
        {exchangeState === "환전신청" ? (
          <KeyboardAwareScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            enableAutomaticScroll={true}>
            <ScrollView
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: PALETTE.COLOR_WHITE,
                  padding: vw(2),
                  marginLeft: vw(4),
                  marginRight: vw(4),
                  paddingTop: vh(2),
                  paddingBottom: vh(2),
                  borderRadius: 10,
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
                }}>
                <Text
                  style={{
                    marginBottom: 10,
                    color: "black",
                  }}>
                  {country === "ko"
                    ? "포인트환전"
                    : country === "ja"
                    ? "ポイント両替"
                    : country === "es"
                    ? "Cambio de puntos"
                    : country === "fr"
                    ? "Échange de points"
                    : country === "id"
                    ? "Penukaran poin"
                    : country === "zh"
                    ? "积分兑换"
                    : "Point exchange"}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <Text
                    style={{
                      color: "#838383",
                    }}>
                    1,000
                  </Text>
                  <Image
                    source={require("../../assets/setting/point.png")}
                    style={{
                      width: 16,
                      height: 16,
                      marginRight: 5,
                      marginLeft: 5,
                    }}></Image>
                  <Text
                    style={{
                      color: "#838383",
                    }}>
                    {" -> "}
                    {1000 * 0.01 * (100 - creatorAuth?.platformPointCharge)}
                  </Text>
                  <Image
                    source={require("../../assets/setting/money.png")}
                    style={{
                      width: 16,
                      height: 16,
                      marginLeft: 5,
                      marginRight: 5,
                    }}></Image>
                  <Text
                    style={{
                      color: "#838383",
                    }}>
                    {country === "ko"
                      ? "으로 환전 됩니다."
                      : country === "ja"
                      ? "に両替されます。"
                      : country === "es"
                      ? "se cambia por."
                      : country === "fr"
                      ? "est échangé contre."
                      : country === "id"
                      ? "ditukar menjadi."
                      : country === "zh"
                      ? "兑换成。"
                      : "is exchanged for."}
                  </Text>
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    color: "red",
                    fontSize: 12,
                  }}>
                  {country === "ko"
                    ? "성명 및 주민등록번호는 세금 납부 신고에만 쓰이며 절대 외부 유출 되지 않으니 걱정 안하셔도 됩니다."
                    : country === "ja"
                    ? "氏名と住民登録番号は税金申告のみに使用され、絶対に外部に漏れることはありませんので、ご心配ありません。"
                    : country === "es"
                    ? "El nombre y el número de identificación solo se utilizan para la declaración de impuestos y no se filtrarán al exterior, así que no se preocupe."
                    : country === "fr"
                    ? "Le nom et le numéro de sécurité sociale ne sont utilisés que pour la déclaration fiscale et ne seront absolument pas divulgués à l'extérieur, vous n'avez donc pas à vous inquiéter."
                    : country === "id"
                    ? "Nama dan nomor identitas hanya digunakan untuk pelaporan pajak dan tidak akan bocor ke pihak luar, jadi Anda tidak perlu khawatir."
                    : country === "zh"
                    ? "姓名和身份证号码仅用于税务申报，不会外泄，请不必担心。"
                    : "Name and identification number are used only for tax reporting and will not be leaked externally, so you don’t have to worry."}
                </Text>
              </View>

              <View
                style={{
                  marginLeft: vw(4),
                  marginRight: vw(4),
                }}>
                <Text
                  style={{
                    marginTop: vh(2),
                    fontSize: 14,
                    fontWeight: "400",
                    color: "black",
                  }}>
                  {country === "ko"
                    ? "개인 or 회사"
                    : country === "ja"
                    ? "個人または法人"
                    : country === "es"
                    ? "Individual o empresa"
                    : country === "fr"
                    ? "Personne ou entreprise"
                    : country === "id"
                    ? "Perorangan atau perusahaan"
                    : country === "zh"
                    ? "个人或公司"
                    : "Individual or company"}
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
                      width: 100,
                      height: 50,
                      backgroundColor: PALETTE.COLOR_BACK,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      marginRight: 10,
                      borderWidth: 1,
                      borderColor: type === 0 ? "black" : "white",
                    }}
                    onPress={() => {
                      setType(0);
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "black",
                      }}>
                      {country === "ko"
                        ? "프리랜서 (개인)"
                        : country === "ja"
                        ? "フリーランサー（個人）"
                        : country === "es"
                        ? "Freelancer (individual)"
                        : country === "fr"
                        ? "Freelance (individu)"
                        : country === "id"
                        ? "Freelancer (perorangan)"
                        : country === "zh"
                        ? "自由职业者（个人）"
                        : "Freelancer (individual)"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      borderRadius: 10,
                      width: 100,
                      height: 50,
                      marginRight: 10,
                      backgroundColor: PALETTE.COLOR_BACK,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: type === 1 ? "black" : "white",
                    }}
                    onPress={() => {
                      setType(1);
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "black",
                      }}>
                      {country === "ko"
                        ? "사업자"
                        : country === "ja"
                        ? "事業者"
                        : country === "es"
                        ? "Empresario"
                        : country === "fr"
                        ? "Entrepreneur"
                        : country === "id"
                        ? "Pengusaha"
                        : country === "zh"
                        ? "企业主"
                        : "Business owner"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      borderRadius: 10,
                      width: 100,
                      height: 50,
                      backgroundColor: PALETTE.COLOR_BACK,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: type === 2 ? "black" : "white",
                    }}
                    onPress={() => {
                      setType(2);
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "black",
                      }}>
                      {country === "ko"
                        ? "외국인"
                        : country === "ja"
                        ? "外国人"
                        : country === "es"
                        ? "Extranjero"
                        : country === "fr"
                        ? "Étranger"
                        : country === "id"
                        ? "WNA (Warga Negara Asing)"
                        : country === "zh"
                        ? "外国人"
                        : "Foreigner"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {type !== 2 && (
                  <Text
                    style={{
                      marginTop: vh(2),
                      fontSize: 14,
                      fontWeight: "400",
                      color: "black",
                    }}>
                    {type === 0
                      ? country === "ko"
                        ? "주민등록번호"
                        : country === "ja"
                        ? "住民登録番号"
                        : country === "es"
                        ? "Número de registro de residencia"
                        : country === "fr"
                        ? "Numéro de registre des résidents"
                        : country === "id"
                        ? "Nomor registrasi penduduk"
                        : country === "zh"
                        ? "居民身份证号码"
                        : "Resident registration number"
                      : country === "ko"
                      ? "사업자등록번호"
                      : country === "ja"
                      ? "事業者登録番号"
                      : country === "es"
                      ? "Número de registro de empresa"
                      : country === "fr"
                      ? "Numéro d'enregistrement de l'entreprise"
                      : country === "id"
                      ? "Nomor pendaftaran usaha"
                      : country === "zh"
                      ? "企业注册号"
                      : "Business registration number"}
                  </Text>
                )}
                {type !== 2 && (
                  <TextInput
                    value={registrationNumber}
                    onChangeText={e => {
                      setRegistrationNumber(e);
                    }}
                    style={{
                      color: "black",
                      borderBottomWidth: 1,
                      borderBottomColor: PALETTE.COLOR_BORDER,
                      paddingBottom: vh(1),
                      paddingTop: vh(1),
                      fontSize: 16,
                    }}
                    placeholder={
                      type === 0 ? "8905xx-1xxxxxx" : "420-xx-xxxxx"
                    }></TextInput>
                )}
                {type !== 2 && (
                  <Text
                    style={{
                      marginTop: vh(2),
                      fontSize: 14,
                      fontWeight: "400",
                      color: "black",
                    }}>
                    {type === 0
                      ? country === "ko"
                        ? "실명 이름"
                        : country === "ja"
                        ? "本名"
                        : country === "es"
                        ? "Nombre real"
                        : country === "fr"
                        ? "Nom réel"
                        : country === "id"
                        ? "Nama asli"
                        : country === "zh"
                        ? "真实姓名"
                        : "Real name"
                      : country === "ko"
                      ? "회사명"
                      : country === "ja"
                      ? "会社名"
                      : country === "es"
                      ? "Nombre de la empresa"
                      : country === "fr"
                      ? "Nom de l'entreprise"
                      : country === "id"
                      ? "Nama perusahaan"
                      : country === "zh"
                      ? "公司名称"
                      : "Company name"}
                  </Text>
                )}
                {type !== 2 && (
                  <TextInput
                    value={registrationName}
                    onChangeText={e => {
                      setRegistrationName(e);
                    }}
                    style={{
                      color: "black",
                      borderBottomWidth: 1,
                      borderBottomColor: PALETTE.COLOR_BORDER,
                      paddingBottom: vh(1),
                      paddingTop: vh(1),
                      fontSize: 16,
                    }}
                    placeholder={
                      country === "ko"
                        ? "홍길동"
                        : country === "ja"
                        ? "ホン・ギルドン"
                        : country === "es"
                        ? "Hong Gildong"
                        : country === "fr"
                        ? "Hong Gildong"
                        : country === "id"
                        ? "Hong Gildong"
                        : country === "zh"
                        ? "洪吉童"
                        : "Hong Gildong"
                    }></TextInput>
                )}
                <View
                  style={{
                    marginTop: vh(2),
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "400",
                      marginBottom: vh(1),
                      color: "black",
                    }}>
                    {country === "ko"
                      ? "계좌 은행 종류"
                      : country === "ja"
                      ? "口座の銀行の種類"
                      : country === "es"
                      ? "Tipo de banco de la cuenta"
                      : country === "fr"
                      ? "Type de banque du compte"
                      : country === "id"
                      ? "Jenis bank rekening"
                      : country === "zh"
                      ? "账户银行类型"
                      : "Account bank type"}
                  </Text>
                  <SelectDropdown
                    defaultButtonText={
                      accountCode
                        ? accountCode
                        : country === "ko"
                        ? "선택"
                        : country === "ja"
                        ? "選択"
                        : country === "es"
                        ? "Selección"
                        : country === "fr"
                        ? "Sélection"
                        : country === "id"
                        ? "Pilih"
                        : country === "zh"
                        ? "选择"
                        : "Select"
                    }
                    buttonStyle={{
                      borderRadius: 10,
                      width: 90,
                      height: 45,
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
                          fontSize: 12,
                          color: "black",
                        }}>
                        ▼
                      </Text>
                    )}
                    data={
                      type === 2
                        ? ["PayPal"]
                        : [
                            "카카오뱅크",
                            "카카오뱅크 mini",
                            "국민",
                            "신한",
                            "토스뱅크",
                            "우리",
                            "IBK기업",
                            "하나",
                            "새마을",
                            "부산",
                            "대구",
                            "케이뱅크",
                            "신협",
                            "우체국",
                            "SC제일",
                            "경남",
                            "광주",
                            "수협",
                            "전북",
                            "저축은행",
                            "제주",
                            "씨티",
                            "KDB산업",
                            "산림조합",
                            "SBI저축은행",
                            "BOA",
                            "중국",
                            "HSBC",
                            "중국공상",
                            "도이치",
                            "JP모건",
                            "BNP파리바",
                            "중국건설",
                          ]
                    }
                    onSelect={(selectedItem, index) => {
                      setAccountCode(selectedItem);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
                      return item;
                    }}
                  />
                  {type !== 2 && (
                    <Text
                      style={{
                        marginTop: vh(2),
                        fontSize: 16,
                        fontWeight: "400",
                        color: "black",
                      }}>
                      {country === "ko"
                        ? "계좌 이름"
                        : country === "ja"
                        ? "口座名"
                        : country === "es"
                        ? "Nombre de la cuenta"
                        : country === "fr"
                        ? "Nom du compte"
                        : country === "id"
                        ? "Nama rekening"
                        : country === "zh"
                        ? "账户名称"
                        : "Account name"}
                    </Text>
                  )}
                  {type !== 2 && (
                    <TextInput
                      value={accountName}
                      onChangeText={e => {
                        setAccountName(e);
                      }}
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: PALETTE.COLOR_BORDER,
                        paddingBottom: vh(1),
                        paddingTop: vh(1),
                        fontSize: 16,
                        color: "black",
                      }}
                      placeholder={
                        country === "ko"
                          ? "홍길동"
                          : country === "ja"
                          ? "ホン・ギルドン"
                          : country === "es"
                          ? "Hong Gildong"
                          : country === "fr"
                          ? "Hong Gildong"
                          : country === "id"
                          ? "Hong Gildong"
                          : country === "zh"
                          ? "洪吉童"
                          : "Hong Gildong"
                      }></TextInput>
                  )}
                  <Text
                    style={{
                      marginTop: vh(2),
                      fontSize: 16,
                      fontWeight: "400",
                      color: "black",
                    }}>
                    {type === 2
                      ? "paypal.me link"
                      : country === "ko"
                      ? "출금 계좌번호"
                      : country === "ja"
                      ? "引き出し口座番号"
                      : country === "es"
                      ? "Número de cuenta para retiros"
                      : country === "fr"
                      ? "Numéro de compte pour les retraits"
                      : country === "id"
                      ? "Nomor rekening untuk penarikan"
                      : country === "zh"
                      ? "提款账户号码"
                      : "Withdrawal account number"}
                  </Text>
                  <TextInput
                    value={accountNumber}
                    onChangeText={e => {
                      setAccountNumber(e);
                    }}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: PALETTE.COLOR_BORDER,
                      paddingBottom: vh(1),
                      paddingTop: vh(1),
                      fontSize: 16,
                      color: "black",
                    }}
                    placeholder={
                      type === 2
                        ? "https://www.paypal.me/abcd"
                        : "481111-02-23xxxx"
                    }></TextInput>
                  <Text
                    style={{
                      marginTop: 10,
                      color: "red",
                      fontSize: 12,
                    }}>
                    {country === "ko"
                      ? "출금 계좌정보를 잘못 기입시 환전 반려 처리됩니다. 정확한 정보 기입 바랍니다."
                      : country === "ja"
                      ? "出金口座情報が間違っている場合、換金申請が却下されます。正確な情報をご記入ください。"
                      : country === "es"
                      ? "Si se ingresan incorrectamente los datos de la cuenta de retiro, la solicitud de cambio será rechazada. Por favor, ingrese la información correcta."
                      : country === "fr"
                      ? "En cas de saisie incorrecte des informations du compte de retrait, la demande de change sera rejetée. Veuillez fournir les informations correctes."
                      : country === "id"
                      ? "Jika informasi rekening penarikan dimasukkan salah, permohonan penukaran akan ditolak. Harap masukkan informasi yang benar."
                      : country === "zh"
                      ? "如果出款账户信息填写错误，兑换申请将被拒绝处理。请填写准确的信息。"
                      : "If the withdrawal account information is entered incorrectly, the exchange request will be rejected. Please provide accurate information."}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: vh(4),
                  }}>
                  <Text
                    style={{
                      marginTop: vh(2),
                      fontSize: 16,
                      fontWeight: "400",
                      color: "black",
                    }}>
                    {country === "ko"
                      ? "출금할 포인트"
                      : country === "ja"
                      ? "出金するポイント"
                      : country === "es"
                      ? "Puntos a retirar"
                      : country === "fr"
                      ? "Points à retirer"
                      : country === "id"
                      ? "Poin yang akan ditarik"
                      : country === "zh"
                      ? "要提取的积分"
                      : "Points to withdraw"}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      borderBottomWidth: 1,
                      borderBottomColor: PALETTE.COLOR_BORDER,
                      paddingBottom: vh(1),
                      paddingTop: vh(1),
                    }}>
                    <TextInput
                      keyboardType="number-pad"
                      value={money}
                      onBlur={(e: any) => {
                        if (
                          Math.floor(Number(money) / 10000) * 10000 >
                          point.amount
                        ) {
                          setMoney(
                            String(
                              Math.floor(Number(point.amount) / 10000) * 10000,
                            ),
                          );
                        } else if (money >= 10000) {
                          //.length >= 5) {
                          setMoney(
                            String(Math.floor(Number(money) / 10000) * 10000),
                          );
                        } else {
                          setMoney(money);
                        }
                      }}
                      onChangeText={e => {
                        if (
                          Math.floor(Number(e) / 10000) * 10000 >
                          point.amount
                        ) {
                          setMoney(
                            String(
                              Math.floor(Number(point.amount) / 10000) * 10000,
                            ),
                          );
                        } else {
                          setMoney(e);
                        }
                      }}
                      style={{
                        color: "black",
                        fontSize: 16,
                      }}
                      placeholder="10000"></TextInput>
                    <Image
                      source={require("../../assets/setting/point.png")}
                      style={{
                        marginLeft: 5,
                        width: 20,
                        height: 20,
                      }}></Image>
                  </View>
                  <Text
                    style={{
                      marginTop: 10,
                      color: PALETTE.COLOR_SKY,
                      fontSize: 12,
                    }}>
                    {country === "ko"
                      ? "출금은 10,000 포인트부터 10,000 포인트 단위로 환전 가능합니다."
                      : country === "ja"
                      ? "出金は10,000ポイントから10,000ポイント単位で換金可能です。"
                      : country === "es"
                      ? "Las retiradas se pueden cambiar a partir de 10,000 puntos y en unidades de 10,000 puntos."
                      : country === "fr"
                      ? "Les retraits peuvent être échangés à partir de 10 000 points et par tranches de 10 000 points."
                      : country === "id"
                      ? "Penarikan dapat dilakukan mulai dari 10.000 poin dan dalam kelipatan 10.000 poin."
                      : country === "zh"
                      ? "提现从10,000积分开始，且以10,000积分为单位进行兑换。"
                      : "Withdrawals can be made starting from 10,000 points and in increments of 10,000 points."}
                  </Text>
                  <TouchableOpacity
                    style={{
                      marginTop: vh(2),
                      height: vh(6),
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderRadius: 20,
                      backgroundColor: PALETTE.COLOR_NAVY,
                    }}
                    onPress={async () => {
                      if (type !== 2 && !registrationNumber) {
                        Alert.alert(
                          country === "ko"
                            ? "주민등록 번호 혹은 사업자번호를 입력해주세요."
                            : country === "ja"
                            ? "住民登録番号または事業者番号を入力してください。"
                            : country === "es"
                            ? "Por favor, ingrese el número de registro de residencia o el número de empresa."
                            : country === "fr"
                            ? "Veuillez entrer le numéro de registre des résidents ou le numéro d'entreprise."
                            : country === "id"
                            ? "Silakan masukkan nomor registrasi penduduk atau nomor pendaftaran usaha."
                            : country === "zh"
                            ? "请输入居民身份证号码或企业注册号码。"
                            : "Please enter your resident registration number or business registration number.",
                        );
                        return;
                      } else if (type !== 2 && !registrationName) {
                        Alert.alert(
                          country === "ko"
                            ? "실명이름 혹은 상호를 입력해주세요."
                            : country === "ja"
                            ? "本名または会社名を入力してください。"
                            : country === "es"
                            ? "Por favor, ingrese el nombre real o el nombre de la empresa."
                            : country === "fr"
                            ? "Veuillez entrer votre nom réel ou le nom de l'entreprise."
                            : country === "id"
                            ? "Silakan masukkan nama asli atau nama perusahaan."
                            : country === "zh"
                            ? "请输入真实姓名或公司名称。"
                            : "Please enter your real name or the company name.",
                        );
                        return;
                      } else if (!accountCode) {
                        Alert.alert(
                          country === "ko"
                            ? "은행 종류를 선택해주세요."
                            : country === "ja"
                            ? "銀行の種類を選択してください。"
                            : country === "es"
                            ? "Por favor, seleccione el tipo de banco."
                            : country === "fr"
                            ? "Veuillez sélectionner le type de banque."
                            : country === "id"
                            ? "Silakan pilih jenis bank."
                            : country === "zh"
                            ? "请选择银行类型。"
                            : "Please select the bank type.",
                        );
                        return;
                      } else if (type !== 2 && !accountName) {
                        Alert.alert(
                          country === "ko"
                            ? "계좌 이름을 입력해주세요."
                            : country === "ja"
                            ? "口座名を入力してください。"
                            : country === "es"
                            ? "Por favor, ingrese el nombre de la cuenta."
                            : country === "fr"
                            ? "Veuillez entrer le nom du compte."
                            : country === "id"
                            ? "Silakan masukkan nama rekening."
                            : country === "zh"
                            ? "请输入账户名称。"
                            : "Please enter the account name.",
                        );
                        return;
                      } else if (!accountNumber) {
                        Alert.alert(
                          country === "ko"
                            ? "계좌 번호를 입력해주세요."
                            : country === "ja"
                            ? "口座番号を入力してください。"
                            : country === "es"
                            ? "Por favor, ingrese el número de cuenta."
                            : country === "fr"
                            ? "Veuillez entrer le numéro de compte."
                            : country === "id"
                            ? "Silakan masukkan nomor rekening."
                            : country === "zh"
                            ? "请输入账户号码。"
                            : "Please enter the account number.",
                        );
                        return;
                      } else if (!money) {
                        Alert.alert(
                          country === "ko"
                            ? "환전금액을 입력해주세요."
                            : country === "ja"
                            ? "換金額を入力してください。"
                            : country === "es"
                            ? "Por favor, ingrese el monto de cambio."
                            : country === "fr"
                            ? "Veuillez entrer le montant de l'échange."
                            : country === "id"
                            ? "Silakan masukkan jumlah penukaran."
                            : country === "zh"
                            ? "请输入兑换金额。"
                            : "Please enter the exchange amount.",
                        );
                        return;
                      }
                      if (money > point.amount) {
                        Alert.alert(
                          country === "ko"
                            ? "보유 포인트보다 많은 금액을 입력할 수 없습니다."
                            : country === "ja"
                            ? "保有ポイントより多くの金額を入力することはできません。"
                            : country === "es"
                            ? "No se puede ingresar una cantidad mayor que los puntos disponibles."
                            : country === "fr"
                            ? "Vous ne pouvez pas saisir un montant supérieur aux points disponibles."
                            : country === "id"
                            ? "Anda tidak dapat memasukkan jumlah yang lebih besar dari poin yang dimiliki."
                            : country === "zh"
                            ? "不能输入超过持有积分的金额。"
                            : "You cannot enter an amount greater than your available points.",
                        );
                        return;
                      }
                      Alert.alert(
                        country === "ko"
                          ? "환전 신청 하시겠습니까?"
                          : country === "ja"
                          ? "換金申請をしますか？"
                          : country === "es"
                          ? "¿Desea solicitar el cambio?"
                          : country === "fr"
                          ? "Souhaitez-vous faire une demande d'échange ?"
                          : country === "id"
                          ? "Apakah Anda ingin mengajukan permohonan penukaran?"
                          : country === "zh"
                          ? "您要申请兑换吗？"
                          : "Do you want to apply for an exchange?",
                        "",
                        [
                          {
                            text:
                              country === "ko"
                                ? "취소"
                                : country === "ja"
                                ? "キャンセル"
                                : country === "es"
                                ? "Cancelar"
                                : country === "fr"
                                ? "Annuler"
                                : country === "id"
                                ? "Batal"
                                : country === "zh"
                                ? "取消"
                                : "Cancel",
                            style: "cancel",
                          },
                          {
                            text:
                              country === "ko"
                                ? "확인"
                                : country === "ja"
                                ? "確認"
                                : country === "es"
                                ? "Confirmar"
                                : country === "fr"
                                ? "Confirmer"
                                : country === "id"
                                ? "Konfirmasi"
                                : country === "zh"
                                ? "确认"
                                : "Confirm",
                            onPress: async () => {
                              if (isLoadingRef.current) return;
                              isLoadingRef.current = true;
                              await api
                                .post("/exchange/apply", {
                                  type: EXCHANGE_TYPE.EXCHANGE_POINT,
                                  typeBusiness: type,
                                  point: money,
                                  accountName,
                                  accountNumber,
                                  accountCode,
                                  registrationName,
                                  registrationNumber,
                                })
                                .then(res => {
                                  if (res.data.status === "true") {
                                    const exchange: any = res.data.exchange;
                                    Alert.alert(
                                      country === "ko"
                                        ? "환전 신청 완료되었습니다."
                                        : country === "ja"
                                        ? "換金申請が完了しました。"
                                        : country === "es"
                                        ? "La solicitud de cambio ha sido completada."
                                        : country === "fr"
                                        ? "La demande d'échange a été complétée."
                                        : country === "id"
                                        ? "Permohonan penukaran telah selesai."
                                        : country === "zh"
                                        ? "兑换申请已完成。"
                                        : "The exchange request has been completed.",
                                      country === "ko"
                                        ? "환전 대기후 입금 처리 되실겁니다"
                                        : country === "ja"
                                        ? "両替待機後、入金処理が行われます"
                                        : country === "es"
                                        ? "Después de la espera de cambio, el depósito será procesado"
                                        : country === "fr"
                                        ? "Après l'attente de l'échange, le dépôt sera traité"
                                        : country === "id"
                                        ? "Setelah menunggu penukaran, setoran akan diproses"
                                        : country === "zh"
                                        ? "兑换等待后将处理存款"
                                        : "After exchange wait, the deposit will be processed",
                                    );
                                    setExchangeList((prev: any) => [
                                      exchange,
                                      ...prev,
                                    ]);
                                    updatePoint({
                                      ...point,
                                      amount: point.amount - money,
                                    });
                                  } else if (
                                    res.data.status === "nextMonthExchange"
                                  ) {
                                    Alert.alert(
                                      country === "ko"
                                        ? "환전 실패"
                                        : country === "ja"
                                        ? "両替失敗"
                                        : country === "es"
                                        ? "Fallo en el cambio de divisas"
                                        : country === "fr"
                                        ? "Échec de l'échange"
                                        : country === "id"
                                        ? "Gagal menukar"
                                        : country === "zh"
                                        ? "兑换失败"
                                        : "Exchange failed",
                                      country === "ko"
                                        ? "환전은 1일 ~ 15일 제외기간 신청 가능합니다"
                                        : country === "ja"
                                        ? "両替は1日～15日の除外期間に申請可能です"
                                        : country === "es"
                                        ? "El cambio de divisas solo se puede solicitar fuera del período del 1 al 15"
                                        : country === "fr"
                                        ? "Les échanges sont possibles uniquement en dehors de la période du 1er au 15"
                                        : country === "id"
                                        ? "Penukaran dapat diajukan di luar periode tanggal 1 hingga 15"
                                        : country === "zh"
                                        ? "兑换申请仅限于1日至15日以外的期间"
                                        : "Exchange requests are allowed only outside the exclusion period from the 1st to the 15th",
                                    );
                                  } else if (res.data.status === "mcn") {
                                    Alert.alert(
                                      country === "ko"
                                        ? "에이전시 타입"
                                        : country === "ja"
                                        ? "エージェンシータイプ"
                                        : country === "es"
                                        ? "Tipo de agencia"
                                        : country === "fr"
                                        ? "Type d'agence"
                                        : country === "id"
                                        ? "Jenis agen"
                                        : country === "zh"
                                        ? "代理类型"
                                        : "Agency type",
                                      country === "ko"
                                        ? "에이전시 회사에게 대급 지급 후 정산 처리 됩니다."
                                        : country === "ja"
                                        ? "エージェンシー会社に代金を支払った後、精算処理が行われます。"
                                        : country === "es"
                                        ? "El ajuste se procesará después de que se realice el pago a la empresa de la agencia."
                                        : country === "fr"
                                        ? "Le règlement sera traité après le paiement à l'agence."
                                        : country === "id"
                                        ? "Penyelesaian akan diproses setelah pembayaran kepada perusahaan agen."
                                        : country === "zh"
                                        ? "在支付给代理公司后，将进行结算处理。"
                                        : "Settlement will be processed after payment is made to the agency company.",
                                    );
                                  } else {
                                    Alert.alert(
                                      country === "ko"
                                        ? "오류 발생"
                                        : country === "ja"
                                        ? "エラーが発生しました"
                                        : country === "es"
                                        ? "Error ocurrido"
                                        : country === "fr"
                                        ? "Erreur survenue"
                                        : country === "id"
                                        ? "Terjadi kesalahan"
                                        : country === "zh"
                                        ? "发生错误"
                                        : "An error occurred",
                                      country === "ko"
                                        ? "다시 시도해주세요."
                                        : country === "ja"
                                        ? "もう一度試してください。"
                                        : country === "es"
                                        ? "Por favor, inténtelo de nuevo."
                                        : country === "fr"
                                        ? "Veuillez réessayer."
                                        : country === "id"
                                        ? "Silakan coba lagi."
                                        : country === "zh"
                                        ? "请再试一次。"
                                        : "Please try again.",
                                    );
                                  }
                                });
                              isLoadingRef.current = false;
                            },
                          },
                        ],
                      );
                    }}>
                    <Text
                      style={{
                        color: PALETTE.COLOR_WHITE,
                        fontSize: 16,
                        fontWeight: "500",
                      }}>
                      {country === "ko"
                        ? "출금신청"
                        : country === "ja"
                        ? "出金申請"
                        : country === "es"
                        ? "Solicitud de retiro"
                        : country === "fr"
                        ? "Demande de retrait"
                        : country === "id"
                        ? "Permohonan penarikan"
                        : country === "zh"
                        ? "提款申请"
                        : "Withdrawal request"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    height: vh(8),
                  }}></View>
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>
        ) : exchangeState === "구독환전" ? (
          <KeyboardAwareScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            enableAutomaticScroll={true}>
            <ScrollView
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  marginLeft: vw(4),
                  marginRight: vw(4),
                  marginTop: vh(2),
                  marginBottom: vh(2),
                }}>
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: 20,
                    marginBottom: 4,
                  }}>
                  {country === "ko"
                    ? "보유 구독 후원 금액"
                    : country === "ja"
                    ? "保有サブスクリプション支援金額"
                    : country === "es"
                    ? "Cantidad de apoyo de suscripción disponible"
                    : country === "fr"
                    ? "Montant de soutien à l'abonnement détenu"
                    : country === "id"
                    ? "Jumlah dukungan langganan yang tersedia"
                    : country === "zh"
                    ? "持有的订阅赞助金额"
                    : "Available subscription support amount"}
                </Text>
                <Text
                  style={{
                    color: PALETTE.COLOR_RED,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}>
                  ₩ {Number(subMoney?.amount).toLocaleString()}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: PALETTE.COLOR_WHITE,
                  padding: vw(2),
                  marginLeft: vw(4),
                  marginRight: vw(4),
                  paddingTop: vh(2),
                  paddingBottom: vh(2),
                  borderRadius: 10,
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
                }}>
                <Text
                  style={{
                    marginBottom: 10,
                    color: "black",
                  }}>
                  {country === "ko"
                    ? "구독환전"
                    : country === "ja"
                    ? "サブスクリプション交換"
                    : country === "es"
                    ? "Cambio de suscripción"
                    : country === "fr"
                    ? "Échange de souscription"
                    : country === "id"
                    ? "Penukaran langganan"
                    : country === "zh"
                    ? "订阅兑换"
                    : "Subscription exchange"}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <Text
                    style={{
                      color: "#838383",
                    }}>
                    1,000
                  </Text>
                  <Text
                    style={{
                      marginLeft: 5,
                      marginRight: 5,
                      color: PALETTE.COLOR_RED,
                    }}>
                    ₩
                  </Text>

                  <Text
                    style={{
                      color: "#838383",
                    }}>
                    {" -> "}
                    {1000 * 0.01 * (100 - creatorAuth?.platformPointCharge)}
                  </Text>
                  <Image
                    source={require("../../assets/setting/money.png")}
                    style={{
                      width: 16,
                      height: 16,
                      marginLeft: 5,
                      marginRight: 5,
                    }}></Image>
                  <Text
                    style={{
                      color: "#838383",
                    }}>
                    {country === "ko"
                      ? "으로 환전됩니다."
                      : country === "ja"
                      ? "に交換されます。"
                      : country === "es"
                      ? "se convertirá en."
                      : country === "fr"
                      ? "sera échangé en."
                      : country === "id"
                      ? "akan ditukar menjadi."
                      : country === "zh"
                      ? "将兑换为。"
                      : "will be exchanged into."}
                  </Text>
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    color: "red",
                    fontSize: 12,
                  }}>
                  {country === "ko"
                    ? "성명 및 주민등록번호는 세금 납부 신고에만 쓰이며 절대 외부 유출 되지 않으니 걱정 안하셔도 됩니다."
                    : country === "ja"
                    ? "氏名および住民登録番号は税金の申告にのみ使用され、絶対に外部に漏れることはありませんので、ご心配には及びません。"
                    : country === "es"
                    ? "El nombre y el número de identificación se utilizan únicamente para la declaración de impuestos y no se filtrarán al exterior, por lo que no tiene que preocuparse."
                    : country === "fr"
                    ? "Le nom et le numéro d'identification ne seront utilisés que pour la déclaration fiscale et ne seront jamais divulgués à des tiers, vous n'avez donc pas à vous inquiéter."
                    : country === "id"
                    ? "Nama dan nomor identitas hanya akan digunakan untuk pelaporan pajak dan tidak akan bocor ke pihak luar, jadi Anda tidak perlu khawatir."
                    : country === "zh"
                    ? "姓名和身份证号码仅用于税务申报，绝不会外泄，因此您不必担心。"
                    : "Name and identification number are used only for tax reporting and will not be leaked to external parties, so there is no need to worry."}
                </Text>
              </View>

              <View
                style={{
                  marginLeft: vw(4),
                  marginRight: vw(4),
                }}>
                <Text
                  style={{
                    marginTop: vh(2),
                    fontSize: 14,
                    fontWeight: "400",
                    color: "black",
                  }}>
                  {country === "ko"
                    ? "실명 이름"
                    : country === "ja"
                    ? "本名"
                    : country === "es"
                    ? "Nombre real"
                    : country === "fr"
                    ? "Nom réel"
                    : country === "id"
                    ? "Nama asli"
                    : country === "zh"
                    ? "真实姓名"
                    : "Full name"}
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
                      width: 100,
                      height: 50,
                      backgroundColor: PALETTE.COLOR_BACK,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      marginRight: 10,
                      borderWidth: 1,
                      borderColor: type === 0 ? "black" : "white",
                    }}
                    onPress={() => {
                      setType(0);
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "black",
                      }}>
                      {country === "ko"
                        ? "프리랜서 (개인)"
                        : country === "ja"
                        ? "フリーランス（個人）"
                        : country === "es"
                        ? "Freelancer (individual)"
                        : country === "fr"
                        ? "Freelance (individuel)"
                        : country === "id"
                        ? "Freelancer (individu)"
                        : country === "zh"
                        ? "自由职业者（个人）"
                        : "Freelancer (individual)"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      borderRadius: 10,
                      width: 100,
                      height: 50,
                      marginRight: 10,
                      backgroundColor: PALETTE.COLOR_BACK,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: type === 1 ? "black" : "white",
                    }}
                    onPress={() => {
                      setType(1);
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "black",
                      }}>
                      {country === "ko"
                        ? "사업자"
                        : country === "ja"
                        ? "事業者"
                        : country === "es"
                        ? "Empresario"
                        : country === "fr"
                        ? "Entrepreneur"
                        : country === "id"
                        ? "Pengusaha"
                        : country === "zh"
                        ? "企业主"
                        : "Business owner"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      borderRadius: 10,
                      width: 100,
                      height: 50,
                      backgroundColor: PALETTE.COLOR_BACK,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: type === 2 ? "black" : "white",
                    }}
                    onPress={() => {
                      setType(2);
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "black",
                      }}>
                      {country === "ko"
                        ? "외국인"
                        : country === "ja"
                        ? "外国人"
                        : country === "es"
                        ? "Extranjero"
                        : country === "fr"
                        ? "Étranger"
                        : country === "id"
                        ? "WNA (Warga Negara Asing)"
                        : country === "zh"
                        ? "外国人"
                        : "Foreigner"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {type !== 2 && (
                  <Text
                    style={{
                      marginTop: vh(2),
                      fontSize: 14,
                      fontWeight: "400",
                      color: "black",
                    }}>
                    {type === 0
                      ? country === "ko"
                        ? "주민등록번호"
                        : country === "ja"
                        ? "住民登録番号"
                        : country === "es"
                        ? "Número de registro de residente"
                        : country === "fr"
                        ? "Numéro d'enregistrement des résidents"
                        : country === "id"
                        ? "Nomor registrasi penduduk"
                        : country === "zh"
                        ? "居民身份证号码"
                        : "Resident registration number"
                      : country === "ko"
                      ? "사업자등록번호"
                      : country === "ja"
                      ? "事業者登録番号"
                      : country === "es"
                      ? "Número de registro del empresario"
                      : country === "fr"
                      ? "Numéro d'enregistrement de l'entreprise"
                      : country === "id"
                      ? "Nomor pendaftaran bisnis"
                      : country === "zh"
                      ? "企业注册号码"
                      : "Business registration number"}
                  </Text>
                )}
                {type !== 2 && (
                  <TextInput
                    value={registrationNumber}
                    onChangeText={e => {
                      setRegistrationNumber(e);
                    }}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: PALETTE.COLOR_BORDER,
                      paddingBottom: vh(1),
                      paddingTop: vh(1),
                      fontSize: 16,
                      color: "black",
                    }}
                    placeholder={
                      type === 0 ? "8905xx-1xxxxxx" : "420-xx-xxxxx"
                    }></TextInput>
                )}
                {type !== 2 && (
                  <Text
                    style={{
                      marginTop: vh(2),
                      fontSize: 14,
                      fontWeight: "400",
                      color: "black",
                    }}>
                    {type === 0
                      ? country === "ko"
                        ? "실명 이름"
                        : country === "ja"
                        ? "本名"
                        : country === "es"
                        ? "Nombre real"
                        : country === "fr"
                        ? "Nom complet"
                        : country === "id"
                        ? "Nama lengkap"
                        : country === "zh"
                        ? "真实姓名"
                        : "Full name"
                      : country === "ko"
                      ? "회사명"
                      : country === "ja"
                      ? "会社名"
                      : country === "es"
                      ? "Nombre de la empresa"
                      : country === "fr"
                      ? "Nom de l'entreprise"
                      : country === "id"
                      ? "Nama perusahaan"
                      : country === "zh"
                      ? "公司名称"
                      : "Company name"}
                  </Text>
                )}
                {type !== 2 && (
                  <TextInput
                    value={registrationName}
                    onChangeText={e => {
                      setRegistrationName(e);
                    }}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: PALETTE.COLOR_BORDER,
                      paddingBottom: vh(1),
                      paddingTop: vh(1),
                      fontSize: 16,
                      color: "black",
                    }}
                    placeholder={
                      country === "ko"
                        ? "홍길동"
                        : country === "ja"
                        ? "ホン・ギルドン"
                        : country === "es"
                        ? "Hong Gildong"
                        : country === "fr"
                        ? "Hong Gildong"
                        : country === "id"
                        ? "Hong Gildong"
                        : country === "zh"
                        ? "洪吉童"
                        : "Hong Gildong"
                    }></TextInput>
                )}
                <View
                  style={{
                    marginTop: vh(2),
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "400",
                      marginBottom: vh(1),
                      color: "black",
                    }}>
                    {country === "ko"
                      ? "계좌 은행 종류"
                      : country === "ja"
                      ? "銀行の種類"
                      : country === "es"
                      ? "Tipo de banco de la cuenta"
                      : country === "fr"
                      ? "Type de banque du compte"
                      : country === "id"
                      ? "Jenis bank rekening"
                      : country === "zh"
                      ? "账户银行类型"
                      : "Bank account type"}
                  </Text>
                  <SelectDropdown
                    defaultButtonText={
                      accountCode
                        ? accountCode
                        : country === "ko"
                        ? "선택"
                        : country === "ja"
                        ? "選択"
                        : country === "es"
                        ? "Selección"
                        : country === "fr"
                        ? "Sélection"
                        : country === "id"
                        ? "Pilih"
                        : country === "zh"
                        ? "选择"
                        : "Select"
                    }
                    buttonStyle={{
                      borderRadius: 10,
                      width: 90,
                      height: 45,
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
                    data={
                      type === 2
                        ? ["PayPal"]
                        : [
                            "NH농협",
                            "카카오뱅크",
                            "카카오뱅크 mini",
                            "국민",
                            "신한",
                            "토스뱅크",
                            "우리",
                            "IBK기업",
                            "하나",
                            "새마을",
                            "부산",
                            "대구",
                            "케이뱅크",
                            "신협",
                            "우체국",
                            "SC제일",
                            "경남",
                            "광주",
                            "수협",
                            "전북",
                            "저축은행",
                            "제주",
                            "씨티",
                            "KDB산업",
                            "산림조합",
                            "SBI저축은행",
                            "BOA",
                            "중국",
                            "HSBC",
                            "중국공상",
                            "도이치",
                            "JP모건",
                            "BNP파리바",
                            "중국건설",
                          ]
                    }
                    onSelect={(selectedItem, index) => {
                      setAccountCode(selectedItem);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      // text represented for each item in dropdown
                      // if data array is an array of objects then return item.property to represent item in dropdown
                      return item;
                    }}
                  />
                  {type !== 2 && (
                    <Text
                      style={{
                        marginTop: vh(2),
                        fontSize: 16,
                        fontWeight: "400",
                        color: "black",
                      }}>
                      {country === "ko"
                        ? "계좌 이름"
                        : country === "ja"
                        ? "口座名義"
                        : country === "es"
                        ? "Nombre de la cuenta"
                        : country === "fr"
                        ? "Nom du compte"
                        : country === "id"
                        ? "Nama rekening"
                        : country === "zh"
                        ? "账户名称"
                        : "Account name"}
                    </Text>
                  )}
                  {type !== 2 && (
                    <TextInput
                      value={accountName}
                      onChangeText={e => {
                        setAccountName(e);
                      }}
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: PALETTE.COLOR_BORDER,
                        paddingBottom: vh(1),
                        paddingTop: vh(1),
                        fontSize: 16,
                        color: "black",
                      }}
                      placeholder={
                        country === "ko"
                          ? "홍길동"
                          : country === "ja"
                          ? "ホン・ギルドン"
                          : country === "es"
                          ? "Hong Gildong"
                          : country === "fr"
                          ? "Hong Gildong"
                          : country === "id"
                          ? "Hong Gildong"
                          : country === "zh"
                          ? "洪吉童"
                          : "Hong Gildong"
                      }></TextInput>
                  )}
                  <Text
                    style={{
                      marginTop: vh(2),
                      fontSize: 16,
                      fontWeight: "400",
                      color: "black",
                    }}>
                    {type === 2
                      ? "paypal.me link"
                      : country === "ko"
                      ? "출금 계좌번호"
                      : country === "ja"
                      ? "引き出し口座番号"
                      : country === "es"
                      ? "Número de cuenta para retiros"
                      : country === "fr"
                      ? "Numéro de compte pour les retraits"
                      : country === "id"
                      ? "Nomor rekening untuk penarikan"
                      : country === "zh"
                      ? "提款账户号码"
                      : "Withdrawal account number"}
                  </Text>
                  <TextInput
                    value={accountNumber}
                    onChangeText={e => {
                      setAccountNumber(e);
                    }}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: PALETTE.COLOR_BORDER,
                      paddingBottom: vh(1),
                      paddingTop: vh(1),
                      fontSize: 16,
                      color: "black",
                    }}
                    placeholder={
                      type === 2
                        ? "https://www.paypal.me/abcd"
                        : "481111-02-23xxxx"
                    }></TextInput>
                  <Text
                    style={{
                      marginTop: 10,
                      color: "red",
                      fontSize: 12,
                    }}>
                    {country === "ko"
                      ? "출금 계좌정보를 잘못 기입시 환전 반려 처리됩니다. 정확한 정보 기입 바랍니다."
                      : country === "ja"
                      ? "引き出し口座情報が誤って入力された場合、換金申請が却下されます。正確な情報を入力してください。"
                      : country === "es"
                      ? "Si se ingresan incorrectamente los datos de la cuenta de retiro, la solicitud de cambio será rechazada. Por favor, ingrese la información correcta."
                      : country === "fr"
                      ? "Si les informations du compte de retrait sont incorrectes, la demande de conversion sera rejetée. Veuillez fournir des informations correctes."
                      : country === "id"
                      ? "Jika informasi rekening penarikan diinput dengan salah, permohonan penukaran akan ditolak. Harap masukkan informasi yang tepat."
                      : country === "zh"
                      ? "如果提款账户信息输入错误，兑换申请将被拒绝。请填写准确的信息。"
                      : "If the withdrawal account information is incorrectly entered, the exchange request will be rejected. Please provide accurate information."}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: vh(4),
                  }}>
                  <Text
                    style={{
                      marginTop: vh(2),
                      fontSize: 16,
                      fontWeight: "400",
                      color: "black",
                    }}>
                    {country === "ko"
                      ? "출금할 돈"
                      : country === "ja"
                      ? "引き出す金額"
                      : country === "es"
                      ? "Monto a retirar"
                      : country === "fr"
                      ? "Montant à retirer"
                      : country === "id"
                      ? "Jumlah yang akan ditarik"
                      : country === "zh"
                      ? "提款金额"
                      : "Amount to withdraw"}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      borderBottomWidth: 1,
                      borderBottomColor: PALETTE.COLOR_BORDER,
                      paddingBottom: vh(1),
                      paddingTop: vh(1),
                    }}>
                    <TextInput
                      keyboardType="number-pad"
                      value={money2}
                      onBlur={(e: any) => {
                        if (
                          Math.floor(Number(money2) / 10000) * 10000 >
                          subMoney.amount
                        ) {
                          setMoney2(
                            String(
                              Math.floor(Number(subMoney.amount) / 10000) *
                                10000,
                            ),
                          );
                        } else if (money2 >= 10000) {
                          setMoney2(
                            String(Math.floor(Number(money2) / 10000) * 10000),
                          );
                        } else {
                          setMoney2(money2);
                        }
                      }}
                      onChangeText={e => {
                        if (
                          Math.floor(Number(e) / 10000) * 10000 >
                          subMoney.amount
                        ) {
                          setMoney2(
                            String(
                              Math.floor(Number(subMoney.amount) / 10000) *
                                10000,
                            ),
                          );
                        } else {
                          setMoney2(e);
                        }
                      }}
                      style={{
                        color: "black",
                        fontSize: 16,
                      }}
                      placeholder="10000"></TextInput>
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: 20,
                        color: PALETTE.COLOR_RED,
                      }}>
                      ₩
                    </Text>
                  </View>
                  <Text
                    style={{
                      marginTop: 10,
                      color: PALETTE.COLOR_SKY,
                      fontSize: 12,
                    }}>
                    {country === "ko"
                      ? "출금은 10,000 ₩ 부터 10,000 ₩ 단위로 환전 가능합니다."
                      : country === "ja"
                      ? "出金は10,000円から10,000円単位で交換可能です。"
                      : country === "es"
                      ? "El retiro puede hacerse a partir de 10,000 ₩ y en múltiplos de 10,000 ₩."
                      : country === "fr"
                      ? "Les retraits peuvent être effectués à partir de 10 000 ₩ et par tranches de 10 000 ₩."
                      : country === "id"
                      ? "Penarikan dapat dilakukan mulai dari 10.000 ₩ dan dalam kelipatan 10.000 ₩."
                      : country === "zh"
                      ? "提款从 10,000 ₩ 起，且必须以 10,000 ₩ 的倍数进行兑换。"
                      : "Withdrawals can be made starting from 10,000 ₩ and in multiples of 10,000 ₩."}
                  </Text>
                  <TouchableOpacity
                    style={{
                      marginTop: vh(2),
                      height: vh(6),
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      borderRadius: 20,
                      backgroundColor: PALETTE.COLOR_NAVY,
                    }}
                    onPress={async () => {
                      if (type !== 2 && !registrationNumber) {
                        Alert.alert(
                          country === "ko"
                            ? "주민등록 번호 혹은 사업자번호를 입력해주세요."
                            : country === "ja"
                            ? "住民登録番号または事業者番号を入力してください。"
                            : country === "es"
                            ? "Por favor, ingrese el número de registro de residencia o el número de empresa."
                            : country === "fr"
                            ? "Veuillez entrer le numéro de registre des résidents ou le numéro d'entreprise."
                            : country === "id"
                            ? "Silakan masukkan nomor registrasi penduduk atau nomor pendaftaran usaha."
                            : country === "zh"
                            ? "请输入居民身份证号码或企业注册号码。"
                            : "Please enter your resident registration number or business registration number.",
                        );
                        return;
                      } else if (type !== 2 && !registrationName) {
                        Alert.alert(
                          country === "ko"
                            ? "실명이름 혹은 상호를 입력해주세요."
                            : country === "ja"
                            ? "本名または会社名を入力してください。"
                            : country === "es"
                            ? "Por favor, ingrese el nombre real o el nombre de la empresa."
                            : country === "fr"
                            ? "Veuillez entrer votre nom réel ou le nom de l'entreprise."
                            : country === "id"
                            ? "Silakan masukkan nama asli atau nama perusahaan."
                            : country === "zh"
                            ? "请输入真实姓名或公司名称。"
                            : "Please enter your real name or the company name.",
                        );
                        return;
                      } else if (!accountCode) {
                        Alert.alert(
                          country === "ko"
                            ? "은행 종류를 선택해주세요."
                            : country === "ja"
                            ? "銀行の種類を選択してください。"
                            : country === "es"
                            ? "Por favor, seleccione el tipo de banco."
                            : country === "fr"
                            ? "Veuillez sélectionner le type de banque."
                            : country === "id"
                            ? "Silakan pilih jenis bank."
                            : country === "zh"
                            ? "请选择银行类型。"
                            : "Please select the bank type.",
                        );
                        return;
                      } else if (type !== 2 && !accountName) {
                        Alert.alert(
                          country === "ko"
                            ? "계좌 이름을 입력해주세요."
                            : country === "ja"
                            ? "口座名を入力してください。"
                            : country === "es"
                            ? "Por favor, ingrese el nombre de la cuenta."
                            : country === "fr"
                            ? "Veuillez entrer le nom du compte."
                            : country === "id"
                            ? "Silakan masukkan nama rekening."
                            : country === "zh"
                            ? "请输入账户名称。"
                            : "Please enter the account name.",
                        );
                        return;
                      } else if (!accountNumber) {
                        Alert.alert(
                          country === "ko"
                            ? "계좌 번호를 입력해주세요."
                            : country === "ja"
                            ? "口座番号を入力してください。"
                            : country === "es"
                            ? "Por favor, ingrese el número de cuenta."
                            : country === "fr"
                            ? "Veuillez entrer le numéro de compte."
                            : country === "id"
                            ? "Silakan masukkan nomor rekening."
                            : country === "zh"
                            ? "请输入账户号码。"
                            : "Please enter the account number.",
                        );
                        return;
                      } else if (!money2) {
                        Alert.alert(
                          country === "ko"
                            ? "환전금액을 입력해주세요."
                            : country === "ja"
                            ? "換金額を入力してください。"
                            : country === "es"
                            ? "Por favor, ingrese el monto de cambio."
                            : country === "fr"
                            ? "Veuillez entrer le montant de l'échange."
                            : country === "id"
                            ? "Silakan masukkan jumlah penukaran."
                            : country === "zh"
                            ? "请输入兑换金额。"
                            : "Please enter the exchange amount.",
                        );
                        return;
                      }

                      if (money2 > subMoney.amount) {
                        Alert.alert(
                          country === "ko"
                            ? "보유 포인트 보다 많은 금액을 입력 할 수 없습니다."
                            : country === "ja"
                            ? "保有ポイントより多くの金額を入力することはできません。"
                            : country === "es"
                            ? "No se puede ingresar una cantidad mayor que los puntos disponibles."
                            : country === "fr"
                            ? "Il est impossible de saisir un montant supérieur aux points disponibles."
                            : country === "id"
                            ? "Anda tidak dapat memasukkan jumlah yang melebihi poin yang tersedia."
                            : country === "zh"
                            ? "不能输入超过您持有积分的金额。"
                            : "You cannot enter an amount greater than your available points.",
                        );
                        return;
                      }

                      Alert.alert(
                        country === "ko"
                          ? "환전 신청 하시겠습니까?"
                          : country === "ja"
                          ? "換金申請をしますか？"
                          : country === "es"
                          ? "¿Desea solicitar el cambio?"
                          : country === "fr"
                          ? "Souhaitez-vous faire une demande d'échange ?"
                          : country === "id"
                          ? "Apakah Anda ingin mengajukan permohonan penukaran?"
                          : country === "zh"
                          ? "您要申请兑换吗？"
                          : "Do you want to apply for an exchange?",
                        "",
                        [
                          {
                            text:
                              country === "ko"
                                ? "취소"
                                : country === "ja"
                                ? "キャンセル"
                                : country === "es"
                                ? "Cancelar"
                                : country === "fr"
                                ? "Annuler"
                                : country === "id"
                                ? "Batal"
                                : country === "zh"
                                ? "取消"
                                : "Cancel",
                            style: "cancel",
                          },
                          {
                            text:
                              country === "ko"
                                ? "확인"
                                : country === "ja"
                                ? "確認"
                                : country === "es"
                                ? "Confirmar"
                                : country === "fr"
                                ? "Confirmer"
                                : country === "id"
                                ? "Konfirmasi"
                                : country === "zh"
                                ? "确认"
                                : "Confirm",
                            onPress: async () => {
                              if (isLoadingRef.current) return;
                              isLoadingRef.current = true;

                              await api
                                .post("/exchange/apply", {
                                  type: EXCHANGE_TYPE.EXCHANGE_MONEY,
                                  typeBusiness: type,
                                  point: money2,
                                  accountName,
                                  accountNumber,
                                  accountCode,
                                  registrationName,
                                  registrationNumber,
                                })
                                .then(res => {
                                  if (res.data.status === "true") {
                                    const exchange: any = res.data.exchange;
                                    Alert.alert(
                                      country === "ko"
                                        ? "환전 신청 완료되었습니다."
                                        : country === "ja"
                                        ? "換金申請が完了しました。"
                                        : country === "es"
                                        ? "La solicitud de cambio ha sido completada."
                                        : country === "fr"
                                        ? "La demande d'échange a été complétée."
                                        : country === "id"
                                        ? "Permohonan penukaran telah selesai."
                                        : country === "zh"
                                        ? "兑换申请已完成。"
                                        : "The exchange request has been completed.",
                                      country === "ko"
                                        ? "환전 대기후 입금 처리 되실겁니다"
                                        : country === "ja"
                                        ? "両替待機後、入金処理が行われます"
                                        : country === "es"
                                        ? "Después de la espera de cambio, el depósito será procesado"
                                        : country === "fr"
                                        ? "Après l'attente de l'échange, le dépôt sera traité"
                                        : country === "id"
                                        ? "Setelah menunggu penukaran, setoran akan diproses"
                                        : country === "zh"
                                        ? "兑换等待后将处理存款"
                                        : "After exchange wait, the deposit will be processed",
                                    );
                                    setExchangeList((prev: any) => [
                                      exchange,
                                      ...prev,
                                    ]);
                                    setSubMoney({
                                      ...subMoney,
                                      amount: subMoney.amount - money2,
                                    });
                                  } else if (
                                    res.data.status === "nextMonthExchange"
                                  ) {
                                    Alert.alert(
                                      country === "ko"
                                        ? "환전 실패"
                                        : country === "ja"
                                        ? "両替失敗"
                                        : country === "es"
                                        ? "Fallo en el cambio de divisas"
                                        : country === "fr"
                                        ? "Échec de l'échange"
                                        : country === "id"
                                        ? "Gagal menukar"
                                        : country === "zh"
                                        ? "兑换失败"
                                        : "Exchange failed",
                                      country === "ko"
                                        ? "환전은 1일 ~ 15일 제외기간 신청 가능합니다"
                                        : country === "ja"
                                        ? "両替は1日～15日の除外期間に申請可能です"
                                        : country === "es"
                                        ? "El cambio de divisas solo se puede solicitar fuera del período del 1 al 15"
                                        : country === "fr"
                                        ? "Les échanges sont possibles uniquement en dehors de la période du 1er au 15"
                                        : country === "id"
                                        ? "Penukaran dapat diajukan di luar periode tanggal 1 hingga 15"
                                        : country === "zh"
                                        ? "兑换申请仅限于1日至15日以外的期间"
                                        : "Exchange requests are allowed only outside the exclusion period from the 1st to the 15th",
                                    );
                                  } else {
                                    Alert.alert(
                                      country === "ko"
                                        ? "오류 발생"
                                        : country === "ja"
                                        ? "エラーが発生しました"
                                        : country === "es"
                                        ? "Error ocurrido"
                                        : country === "fr"
                                        ? "Erreur survenue"
                                        : country === "id"
                                        ? "Terjadi kesalahan"
                                        : country === "zh"
                                        ? "发生错误"
                                        : "An error occurred",
                                      country === "ko"
                                        ? "다시 시도해주세요."
                                        : country === "ja"
                                        ? "もう一度試してください。"
                                        : country === "es"
                                        ? "Por favor, inténtelo de nuevo."
                                        : country === "fr"
                                        ? "Veuillez réessayer."
                                        : country === "id"
                                        ? "Silakan coba lagi."
                                        : country === "zh"
                                        ? "请再试一次。"
                                        : "Please try again.",
                                    );
                                  }
                                });
                              isLoadingRef.current = false;
                            },
                          },
                        ],
                      );
                    }}>
                    <Text
                      style={{
                        color: PALETTE.COLOR_WHITE,
                        fontSize: 16,
                        fontWeight: "500",
                      }}>
                      {country === "ko"
                        ? "출금신청"
                        : country === "ja"
                        ? "出金申請"
                        : country === "es"
                        ? "Solicitud de retiro"
                        : country === "fr"
                        ? "Demande de retrait"
                        : country === "id"
                        ? "Permohonan penarikan"
                        : country === "zh"
                        ? "提款申请"
                        : "Withdrawal request"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    height: vh(8),
                  }}></View>
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>
        ) : (
          exchangeList &&
          firstRender && (
            <FlatList
              contentContainerStyle={{
                paddingLeft: vw(4),
                paddingRight: vw(4),
                paddingBottom: vh(8),
              }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              scrollEnabled
              onEndReached={async e => {
                await api
                  .get("/exchange/exchageList", {
                    params: {
                      pageNum: pageNum.current,
                      pageSize: pageSize.current,
                    },
                  })
                  .then(res => {
                    pageNum.current = pageNum.current + 1;
                    setExchangeList(exchangeList.concat(res.data.exchageList));
                  });
              }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              //horizontal={true}
              keyExtractor={(item: any) => item.id}
              data={exchangeList}
              numColumns={1}
              decelerationRate={"fast"}
              ListEmptyComponent={() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <Text
                    style={{
                      color: "#838383",
                    }}>
                    {" "}
                    {country === "ko"
                      ? "환전 목록이 없습니다."
                      : country === "ja"
                      ? "交換履歴がありません。"
                      : country === "es"
                      ? "No hay lista de intercambios."
                      : country === "fr"
                      ? "Aucune liste d'échanges n'est disponible."
                      : country === "id"
                      ? "Daftar penukaran tidak ada."
                      : country === "zh"
                      ? "没有兑换记录。"
                      : "There is no exchange list."}
                  </Text>
                </View>
              )}
              renderItem={(props: any) => (
                <TouchableOpacity
                  activeOpacity={1}
                  key={props.index}
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    alignContent: "center",
                    alignItems: "center",
                    marginBottom: vh(2),
                    flexDirection: "row",
                    backgroundColor: PALETTE.COLOR_BACK,
                    padding: 10,
                    borderRadius: 10,
                  }}>
                  <View
                    style={{
                      alignContent: "center",
                      alignItems: "flex-start",
                      flex: 1,
                    }}>
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        backgroundColor: PALETTE.COLOR_NAVY,
                        padding: 10,
                        marginBottom: 10,
                      }}
                      activeOpacity={1}>
                      <Text
                        style={{
                          color: PALETTE.COLOR_WHITE,
                        }}>
                        {props.item?.state === EXCHANGE_STATE.EXCHANGE_WAIT
                          ? country === "ko"
                            ? "송금 대기"
                            : country === "ja"
                            ? "送金待機中"
                            : country === "es"
                            ? "En espera de transferencia"
                            : country === "fr"
                            ? "En attente de virement"
                            : country === "id"
                            ? "Menunggu transfer"
                            : country === "zh"
                            ? "转账待处理"
                            : "Awaiting transfer"
                          : props.item?.state === EXCHANGE_STATE.EXCHANGE_FAIL
                          ? country === "ko"
                            ? "환전 반려"
                            : country === "ja"
                            ? "換金申請却下"
                            : country === "es"
                            ? "Solicitud de cambio rechazada"
                            : country === "fr"
                            ? "Demande de conversion rejetée"
                            : country === "id"
                            ? "Permohonan penukaran ditolak"
                            : country === "zh"
                            ? "兑换申请被拒绝"
                            : "Exchange request rejected"
                          : props.item?.state ===
                            EXCHANGE_STATE.EXCHANGE_SUCCESS
                          ? country === "ko"
                            ? "송금 완료"
                            : country === "ja"
                            ? "送金完了"
                            : country === "es"
                            ? "Transferencia completada"
                            : country === "fr"
                            ? "Virement terminé"
                            : country === "id"
                            ? "Transfer selesai"
                            : country === "zh"
                            ? "转账完成"
                            : "Transfer completed"
                          : ""}
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: PALETTE.COLOR_BLACK,
                      }}>
                      {props.item?.type === EXCHANGE_TYPE.EXCHANGE_POINT
                        ? country === "ko"
                          ? "포인트 환전"
                          : country === "ja"
                          ? "ポイント交換"
                          : country === "es"
                          ? "Intercambio de puntos"
                          : country === "fr"
                          ? "Échange de points"
                          : country === "id"
                          ? "Penukaran poin"
                          : country === "zh"
                          ? "积分兑换"
                          : "Point exchange"
                        : props.item?.type === EXCHANGE_TYPE.EXCHANGE_MONEY
                        ? country === "ko"
                          ? "구독 환전"
                          : country === "ja"
                          ? "サブスクリプション交換"
                          : country === "es"
                          ? "Intercambio de suscripción"
                          : country === "fr"
                          ? "Échange d'abonnement"
                          : country === "id"
                          ? "Penukaran langganan"
                          : country === "zh"
                          ? "订阅兑换"
                          : "Subscription exchange"
                        : ""}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        marginTop: 5,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 12,
                          color: "black",
                        }}>
                        {Number(props.item?.point).toLocaleString()}
                      </Text>
                      <Image
                        source={require("../../assets/setting/point.png")}
                        style={{
                          marginLeft: 5,
                          width: 16,
                          height: 16,
                        }}></Image>

                      <Image
                        source={require("../../assets/setting/rightArrowB.png")}
                        style={{
                          marginLeft: 20,
                          marginRight: 20,
                          width: 20,
                          height: 20,
                        }}></Image>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 12,
                          color: "black",
                        }}>
                        {Number(props.item?.money).toLocaleString()}
                      </Text>
                      <Image
                        source={require("../../assets/setting/money.png")}
                        style={{
                          marginLeft: 5,
                          width: 16,
                          height: 16,
                        }}></Image>
                    </View>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                    }}>
                    <Text
                      style={{
                        marginBottom: 5,
                        fontSize: 12,
                        color: "#838383",
                      }}>
                      {new Date(props.item?.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )
        )}
      </View>
    </NotchView>
  );
}
