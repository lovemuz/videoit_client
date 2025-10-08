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
import EncryptedStorage from "react-native-encrypted-storage";
import Share from "react-native-share";
import FastImage from "react-native-fast-image";
import Clipboard from "@react-native-clipboard/clipboard";
import api from "../../lib/api/api";
import {PALETTE} from "../../lib/constant/palette";
import serverURL from "../../lib/constant/serverURL";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ToastComponent} from "../reusable/useToast";
import RNIap, {
  initConnection,
  //InAppPurchase,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  finishTransaction,
  SubscriptionPurchase,
  validateReceiptIos,
  validateReceiptAndroid,
  getReceiptIOS,
  flushFailedPurchasesCachedAsPendingAndroid,
  clearTransactionIOS,
  getProducts,
  requestPurchase,
  requestSubscription,
  getSubscriptions,
} from "react-native-iap";
//import CryptoJS from "crypto-js";
import CryptoJS from "react-native-crypto-js"; //이건 encrpt용
import Loading from "../reusable/loading";
import {useIsFocused} from "@react-navigation/native";
import {USER_GENDER} from "../../lib/constant/user-constant";
import InAppReview from "react-native-in-app-review";
import axios from "axios";

const pointList: any = [
  {
    point: "4,000",
    price: `₩ 8,000`,
    sku: "nmoment4000",
  },
  {
    point: "8,000",
    price: `₩ 14,500`,
    sku: "nmoment8000",
  },
  {
    point: "15,000",
    price: `₩ 25,000`,
    sku: "nmoment15000",
  },
  {
    point: "30,000",
    price: `₩ 48,000`,
    sku: "nmoment30000",
  },
  {
    point: "60,000",
    price: `₩ 96,000`,
    sku: "nmoment60000",
  },
  {
    point: "100,000",
    price: `₩ 160,000`,
    sku: "nmoment100000",
  },
  {
    point: "200,000",
    price: `₩ 320,000`,
    sku: "nmoment200000",
  },
  {
    point: "300,000",
    price: `₩ 480,000`,
    sku: "nmoment300000",
  },
];

const itemSkus: any = Platform.select({
  ios: [
    "nmoment4000",
    "nmoment8000",
    "nmoment15000",
    "nmoment30000",
    "nmoment60000",
    "nmoment100000",
    "nmoment200000",
    "nmoment300000",
  ],
  android: [
    "nmoment4000",
    "nmoment8000",
    "nmoment15000",
    "nmoment30000",
    "nmoment60000",
    "nmoment100000",
    "nmoment200000",
    "nmoment300000",
  ],
});

const itemSubs: any = Platform.select({
  ios: [],
  android: [],
});

export default function Store({
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
  const productId: any = useRef(null);
  const [real, setReal] = useState(false);

  const isLoadingRef = useRef(false);

  useEffect(() => {
    async function fetchData() {
      try {
        await api.get("/point/getMyPoint").then(res => {
          updatePoint(res.data.point);
        });
      } catch (err) {}
      try {
        await api.get("/real").then(res => {
          setReal(res.data.real);
        });
      } catch (err) {}
      /*
      const googleAndApple = user?.email.split("@")[1];
      if (
        user?.email === "test@gmail.com" ||
        googleAndApple === "accounts.google.com" ||
        googleAndApple === "icloud.com" ||
        googleAndApple === "privaterelay.appleid.com" ||
        googleAndApple === "google.com" ||
        googleAndApple === "email.apple.com" ||
        googleAndApple === "insideapple.apple.com"
      ) {
        setRealByEmail(false);
      }
      */
    }
    fetchData();
  }, []);

  const insets = useSafeAreaInsets();

  let purchaseUpdateSubscription: any;
  let purchaseErrorSubscription: any;
  const [loading, setLoading] = useState(false);

  const [firstRender, setFirstRender] = useState(false);

  let delayButton = false;

  useEffect(() => {
    const connection = async () => {
      try {
        const init = await initConnection();
        const initCompleted = init === true;
        if (initCompleted) {
          if (Platform.OS === "android") {
            await flushFailedPurchasesCachedAsPendingAndroid();
          } else {
            await clearTransactionIOS();
          }
        }
        // success listener
        purchaseUpdateSubscription = purchaseUpdatedListener(
          async (purchase: any) => {
            const receipt = purchase.transactionReceipt
              ? purchase.transactionReceipt
              : purchase.purchaseToken;

            if (receipt) {
              try {
                // if (isLoadingRef.current) return;
                // isLoadingRef.current = true;
                setLoading(false);

                if (Platform.OS === "ios") {
                  await api
                    .post("/payment/ios/validatePayment", {
                      receiptData: receipt,
                      platform: Platform.OS,
                    })
                    .then(async res => {
                      if (res.data.status === "true") {
                        await finishTransaction({
                          purchase,
                          isConsumable: true,
                        });
                        updatePoint(res.data.point);
                        Alert.alert(
                          country === "id"
                            ? `Pembayaran berhasil`
                            : country === "fr"
                            ? `Paiement réussi`
                            : country === "es"
                            ? `Pago exitoso`
                            : country === "zh"
                            ? `支付成功`
                            : country === "ja"
                            ? `お支払いの成功`
                            : country === "ko"
                            ? `결제 성공`
                            : `Payment successful`,
                        );
                        const review = InAppReview.isAvailable();
                        if (review) {
                          InAppReview.RequestInAppReview()
                            .then(hasFlowFinishedSuccessfully => {
                              // 3- another option:
                              if (hasFlowFinishedSuccessfully) {
                                // do something for ios
                                // do something for android
                              }
                            })
                            .catch(error => {
                              console.log(error);
                            });
                        }
                      }
                    });
                } else if (Platform.OS === "android") {
                  await api
                    .post("/payment/android/validatePayment", {
                      purchaseToken: receipt /*?.purchaseToken*/,
                      productId: productId.current,
                      platform: Platform.OS,
                      secretCode: CryptoJS.AES.encrypt(
                        `${user.id}:${
                          productId.current
                        }:${new Date().getTime()}`,
                        process.env.CRYPTO_SECRET as string,
                      ).toString(),
                    })
                    .then(async res => {
                      if (res.data.status === "true") {
                        await finishTransaction({
                          purchase,
                          isConsumable: true,
                        });
                        updatePoint(res.data.point);
                        Alert.alert(
                          country === "id"
                            ? `Pembayaran berhasil`
                            : country === "fr"
                            ? `Paiement réussi`
                            : country === "es"
                            ? `Pago exitoso`
                            : country === "zh"
                            ? `支付成功`
                            : country === "ja"
                            ? `お支払いの成功`
                            : country === "ko"
                            ? `결제 성공`
                            : `Payment successful`,
                        );
                        const review = InAppReview.isAvailable();
                        if (review) {
                          InAppReview.RequestInAppReview()
                            .then(hasFlowFinishedSuccessfully => {
                              // 3- another option:
                              if (hasFlowFinishedSuccessfully) {
                                // do something for ios
                                // do something for android
                              }
                            })
                            .catch(error => {
                              console.log(error);
                            });
                        }
                      }
                    });
                }
                /*
                await finishTransaction({
                  purchase,
                  isConsumable: true,
                });
                */
                // isLoadingRef.current = false;

                //AsyncStorage.setItem("receipt", receipt);
                // 구매이력 저장 및 상태 갱신
                // if (purchase) {}
              } catch (error) {
                // isLoadingRef.current = false;
                console.log("ackError: ", error);
              }
            }
          },
        );

        purchaseErrorSubscription = purchaseErrorListener((error: any) => {
          // isLoadingRef.current = false;
          setLoading(false);
          // 정상적인 에러상황 대응
          const USER_CANCEL = "E_USER_CANCELED";
          if (error && error.code === USER_CANCEL) {
            Alert.alert(
              country === "id"
                ? `Batalkan Pembelian`
                : country === "fr"
                ? `annuler l'achat`
                : country === "es"
                ? `Cancelar compra`
                : country === "zh"
                ? `取消购买`
                : country === "ja"
                ? `購入をキャンセル`
                : country === "ko"
                ? `구매 취소`
                : `cancel purchase`,
              country === "id"
                ? `Anda membatalkan pembelian.`
                : country === "fr"
                ? `Vous avez annulé votre achat.`
                : country === "es"
                ? `Cancelaste tu compra.`
                : country === "zh"
                ? `您取消了购买。`
                : country === "ja"
                ? `購入をキャンセルしました。`
                : country === "ko"
                ? `구매를 취소하셨습니다.`
                : `You canceled your purchase.`,
            );
          } else {
            Alert.alert(
              country === "id"
                ? `pembelian gagal`
                : country === "fr"
                ? `achat raté`
                : country === "es"
                ? `la compra falló`
                : country === "zh"
                ? `购买失败`
                : country === "ja"
                ? `購入失敗`
                : country === "ko"
                ? `구매 실패`
                : `purchase failed`,
              country === "id"
                ? `Terjadi kesalahan selama pembelian.`
                : country === "fr"
                ? `Une erreur s'est produite lors de l'achat.`
                : country === "es"
                ? `Ocurrió un error durante la compra.`
                : country === "zh"
                ? `购买时发生错误。`
                : country === "ja"
                ? `購入中にエラーが発生しました。`
                : country === "ko"
                ? `구매 중 오류가 발생하였습니다.`
                : `An error occurred during purchase.`,
            );
          }
        });

        getItems();
        //getSubscription();
        //if (Platform.OS === "ios") checkReceiptIOS();
        //else checkReceiptAndroid();
      } catch (error) {
        console.log("connection error: ", error);
      }
    };
    connection();

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
      RNIap?.endConnection();
    };
  }, []);
  const getItems = async () => {
    try {
      // console.log("itemSkus");
      // console.log(itemSkus);
      const items = await getProducts({skus: itemSkus});
      // console.log("items");
      // console.log(items);
      // items 저장
      ///...
      setFirstRender(true);
    } catch (error) {
      console.log("get item error: ", error);
    }
  };

  const getSubscription = async () => {
    try {
      const subscriptions = await getSubscriptions(itemSubs);

      console.log(subscriptions);
      // subscriptions 저장
      ///...
    } catch (error) {
      console.log("get subscriptions error: ", error);
    }
  };
  const requestItemPurchase = async (sku: any) => {
    try {
      if (!sku && !productId.current) return;
      if (delayButton === true) return;
      delayButton = true;
      setLoading(true);
      if (Platform.OS === "ios") {
        await requestPurchase({sku: sku});
      } else {
        await requestPurchase({skus: [sku]});
      }
      delayButton = false;
    } catch (error: any) {
      console.log("request purchase error: ", error);
      Alert.alert(error.message);
    }
  };
  const requestSubscriptionPurchase = async (sub: any) => {
    try {
      setLoading(false);
      await requestSubscription({sku: sub});
    } catch (error: any) {
      console.log("request purchase error: ", error);
      Alert.alert(error.message);
    }
  };

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

  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={[""]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={Platform.OS === "ios" ? "light-content" : "dark-content"}
      />
      {loading && <Loading></Loading>}
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
                  fontSize: 16,
                  color: "black",
                }}>
                {country === "ko"
                  ? `충전하기`
                  : country === "ja"
                  ? `充電する`
                  : country === "es"
                  ? `Cargar`
                  : country === "fr"
                  ? `Charge`
                  : country === "id"
                  ? `Mengenakan biaya`
                  : country === "zh"
                  ? `收费`
                  : `Charge`}
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
                      fontWeight: "bold",
                      color: "black",
                    }}>
                    {Number(point?.amount).toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {firstRender && (
          <ScrollView
            style={{
              flex: 1,
            }}>
            <View
              style={{
                marginLeft: vw(4),
                marginRight: vw(4),
                marginTop: 10,
                backgroundColor: PALETTE.COLOR_WHITE,
                padding: vw(2),
                paddingTop: vh(1.8),
                paddingBottom: vh(1.8),
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
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <Text
                  style={{
                    color: "black",
                    fontSize: 13,
                  }}>
                  {user?.gender === USER_GENDER.GIRL
                    ? country === "ko"
                      ? "영상통화로 수익을 획득후 환전하세요!"
                      : country === "ja"
                      ? "ビデオ通話で収益を獲得した後、両替してください！"
                      : country === "es"
                      ? "¡Gana dinero a través de videollamadas y luego canjéalos!"
                      : country === "fr"
                      ? "Gagnez de l'argent grâce aux appels vidéo, puis échangez-les !"
                      : country === "id"
                      ? "Hasilkan uang melalui panggilan video lalu tukarkan!"
                      : country === "zh"
                      ? "通过视频通话赚钱，然后兑换！"
                      : "Earn money through video calls and then exchange them!"
                    : country === "ko"
                    ? "영상통화는 최초 연결완료 이후 부터"
                    : country === "ja"
                    ? "ビデオ通話は最初の接続が完了してから"
                    : country === "es"
                    ? "Las videollamadas comienzan después de que se completa la conexión inicial."
                    : country === "fr"
                    ? "Les appels vidéo commencent une fois la connexion initiale établie."
                    : country === "id"
                    ? "Panggilan video dimulai setelah koneksi awal selesai."
                    : country === "zh"
                    ? "初始连接完成后开始视频通话。"
                    : "Video calls begin after the initial connection is completed."}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  marginTop: 2,
                }}>
                <Text
                  style={{
                    color: "black",
                    fontSize: 13,
                  }}>
                  {country === "ko"
                    ? `30초마다`
                    : country === "ja"
                    ? `30秒ごと`
                    : country === "es"
                    ? `cada 30 segundos`
                    : country === "fr"
                    ? `toutes les 30 secondes`
                    : country === "id"
                    ? `setiap 30 detik`
                    : country === "zh"
                    ? `每 30 秒`
                    : `every 30 seconds`}
                </Text>
                <Text
                  style={{
                    color: PALETTE.COLOR_RED,
                    marginLeft: 2,
                    marginRight: 2,
                    fontSize: 13,
                  }}>
                  {country === "ko"
                    ? `1,000 + α 포인트`
                    : country === "ja"
                    ? `1,000 + α ポイント`
                    : country === "es"
                    ? `1,000 + α puntos`
                    : country === "fr"
                    ? `1,000 + α points`
                    : country === "id"
                    ? `1,000 + α poin`
                    : country === "zh"
                    ? `1,000 + α 点`
                    : `1,000 + α points`}
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontSize: 13,
                  }}>
                  {user?.gender === USER_GENDER.GIRL
                    ? country === "ko"
                      ? "를 획득합니다."
                      : country === "ja"
                      ? "を獲得します。"
                      : country === "es"
                      ? "obtener."
                      : country === "fr"
                      ? "obtenir."
                      : country === "id"
                      ? "memperoleh."
                      : country === "zh"
                      ? "获得。"
                      : "obtain."
                    : country === "ko"
                    ? "가 소진됩니다."
                    : country === "ja"
                    ? "がなくなります。"
                    : country === "es"
                    ? "está agotado."
                    : country === "fr"
                    ? "est épuisé."
                    : country === "id"
                    ? "habis."
                    : country === "zh"
                    ? "已经筋疲力尽了。"
                    : "is exhausted."}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginLeft: vw(4),
                marginRight: vw(4),
              }}>
              {real && user?.email !== "test@gmail.com" && (
                <TouchableOpacity
                  onPress={async () => {
                    await Linking.openURL(
                      `https://nmoment.live/apptoweb?accessToken=${accessToken}&refreshToken=${refreshToken}`,
                    );
                  }}>
                  <Image
                    style={{
                      marginTop: vh(1.5),
                      width: "100%",
                      height: vh(7),
                      //borderRadius: 10,
                    }}
                    resizeMode="cover"
                    source={require("../../assets/setting/event.png")}></Image>
                </TouchableOpacity>
              )}
              {pointList.map((list: any, idx: number) => (
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    marginTop: vh(1.5),
                    justifyContent: "space-between",
                    alignContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: PALETTE.COLOR_BORDER,
                    paddingLeft: vw(4),
                    paddingRight: vw(4),
                    paddingTop: vh(1.5),
                    paddingBottom: vh(1.5),
                  }}
                  onPress={() => {
                    productId.current = list?.sku;
                    requestItemPurchase(list?.sku);
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                    }}>
                    <Image
                      source={require("../../assets/setting/point.png")}
                      style={{
                        width: 30,
                        height: 30,
                      }}></Image>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontWeight: "bold",
                        fontSize: 16,
                        color: "black",
                      }}>
                      {list?.point}{" "}
                      {country === "ko"
                        ? ` 포인트`
                        : country === "ja"
                        ? ` ポイント`
                        : country === "es"
                        ? ` puntos`
                        : country === "fr"
                        ? ` points`
                        : country === "id"
                        ? ` poin`
                        : country === "zh"
                        ? ` 点`
                        : ` points`}
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
                        //fontWeight: "bold",
                        fontSize: 12,
                        color: PALETTE.COLOR_RED,
                        marginRight: 5,
                      }}>
                      {list?.price}
                    </Text>
                    <Image
                      source={require("../../assets/setting/rightR.png")}
                      style={{
                        width: 20,
                        height: 20,
                      }}></Image>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View
              style={{
                height: vh(8),
              }}></View>
          </ScrollView>
        )}
      </View>
    </NotchView>
  );
}
