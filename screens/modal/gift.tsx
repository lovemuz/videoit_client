import React from "react";
import { useState, useEffect, useRef } from "react";
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
import { NotchProvider, NotchView } from "react-native-notchclear";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { vw, vh, vmin, vmax } from "react-native-css-vh-vw";
import LinearGradient from "react-native-linear-gradient";
import Video from "react-native-video";
//import {LinearTextGradient} from "react-native-text-gradient";
import SplashScreen from "react-native-splash-screen";

import Share from "react-native-share";
import FastImage from "react-native-fast-image";
import Clipboard from "@react-native-clipboard/clipboard";
import api from "../../lib/api/api";
import { PALETTE } from "../../lib/constant/palette";
import serverURL from "../../lib/constant/serverURL";
import Dialog from "react-native-dialog";
import { ITEM_LIST } from "../../lib/constant/item-constant";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ToastComponent } from "../reusable/useToast";

export default function Gift({
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
  const beforeChat = route?.params?.beforeChat;

  const [item, setItem]: any = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectItem, setSelectItem]: any = useState(null);
  const [selectPrice, setSelectPrice]: any = useState(null);
  const [count, setCount]: any = useState(1);

  const [selectReverseItem, setSelectReverseItem]: any = useState(null);
  const [selectReversePrice, setSelectReversePrice]: any = useState(null);
  const [countReverse, setCountReverse]: any = useState(1);
  const [itemCountReverse, setItemCountReverse]: any = useState(0);
  const [visibleReverse, setVisibleReverse] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        await api.get("/point/getMyItem").then(res => {
          setItem(res.data.item);
        });
      } catch (err) { }
      try {
        await api.get("/point/getMyPoint").then(res => {
          updatePoint(res.data.point);
        });
      } catch (err) { }
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
      <Dialog.Container visible={visible}>
        <Dialog.Title>
          {country === "ko"
            ? "구매하시겠습니까?"
            : country === "ja"
              ? "購入しますか？"
              : country === "es"
                ? "¿Desea comprar?"
                : country === "fr"
                  ? "Voulez-vous acheter ?"
                  : country === "id"
                    ? "Mau beli?"
                    : country === "zh"
                      ? "是否购买？"
                      : "Do you want to purchase?"}
        </Dialog.Title>
        <Dialog.Description>
          {country === "ko"
            ? "구매수량을 입력해주세요."
            : country === "ja"
              ? "購入数量を入力してください。"
              : country === "es"
                ? "Por favor, introduzca la cantidad de compra."
                : country === "fr"
                  ? "Veuillez entrer la quantité d'achat."
                  : country === "id"
                    ? "Masukkan jumlah pembelian."
                    : country === "zh"
                      ? "请输入购买数量。"
                      : "Please enter the purchase quantity."}
        </Dialog.Description>
        <Dialog.Input
          keyboardType="decimal-pad"
          onChangeText={(e: any) => {
            if (isNaN(e)) {
              setCount(1);
              return;
            } else if (parseInt(e) <= 1) {
              setCount(1);
              return;
            } else {
              setCount(e);
            }
          }}>
          {count}
        </Dialog.Input>
        <Dialog.Button
          label={
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
                        : `cancellation`
          }
          color="red"
          onPress={() => {
            setVisible(false);
            //after
            setCount(1);
          }}
        />
        <Dialog.Button
          label={
            country === "ko"
              ? "구매"
              : country === "ja"
                ? "購入"
                : country === "es"
                  ? "Comprar"
                  : country === "fr"
                    ? "Acheter"
                    : country === "id"
                      ? "Membeli"
                      : country === "zh"
                        ? "购买"
                        : "Purchase"
          }
          onPress={async () => {
            if (count * selectPrice > point?.amount) {
              //포인트 부족

              Alert.alert(
                country === "ko"
                  ? "포인트가 부족합니다."
                  : country === "ja"
                    ? "ポイントが不足しています。"
                    : country === "es"
                      ? "Puntos insuficientes."
                      : country === "fr"
                        ? "Points insuffisants."
                        : country === "id"
                          ? "Poin tidak mencukupi."
                          : country === "zh"
                            ? "积分不足。"
                            : "Insufficient points.",
              );
              return;
            } else {
              await api
                .post("/point/purchaseItem", {
                  code: selectItem,
                  count,
                })
                .then(res => {
                  if (res.data.status === "true") {
                    const item = res.data.item;
                    Alert.alert(
                      country === "ko"
                        ? "구매 완료"
                        : country === "ja"
                          ? "購入完了"
                          : country === "es"
                            ? "Compra completada"
                            : country === "fr"
                              ? "Achat terminé"
                              : country === "id"
                                ? "Pembelian selesai"
                                : country === "zh"
                                  ? "购买完成"
                                  : "Purchase completed",
                    );
                    updatePoint({
                      ...point,
                      amount: point.amount - count * selectPrice,
                    });
                    setItem(item);
                  }
                });
            }
            //after
            setVisible(false);
            setCount(1);
          }}
        />
      </Dialog.Container>
      <Dialog.Container visible={visibleReverse}>
        <Dialog.Title>
          {country === "ko"
            ? "포인트로 교환하시겠습니까?"
            : country === "ja"
              ? "ポイントで交換しますか？"
              : country === "es"
                ? "¿Desea canjearlo por puntos?"
                : country === "fr"
                  ? "Souhaitez-vous l'échanger contre des points ?"
                  : country === "id"
                    ? "Apakah Anda ingin menukarnya dengan poin?"
                    : country === "zh"
                      ? "是否要用积分兑换？"
                      : "Do you want to exchange it for points?"}
        </Dialog.Title>
        <Dialog.Description>
          {country === "ko"
            ? "교환수량을 입력해주세요."
            : country === "ja"
              ? "交換数量を入力してください。"
              : country === "es"
                ? "Ingrese la cantidad a canjear."
                : country === "fr"
                  ? "Veuillez entrer la quantité à échanger."
                  : country === "id"
                    ? "Masukkan jumlah yang ingin ditukar."
                    : country === "zh"
                      ? "请输入要兑换的数量。"
                      : "Please enter the exchange quantity."}
        </Dialog.Description>
        <Dialog.Input
          keyboardType="decimal-pad"
          onChangeText={(e: any) => {
            if (isNaN(e)) {
              setCountReverse(1);
              return;
            } else if (parseInt(e) <= 1) {
              setCountReverse(1);
              return;
            } else if (parseInt(e) > itemCountReverse) {
              setCountReverse(itemCountReverse);
            } else {
              setCountReverse(e);
            }
          }}>
          {countReverse}
        </Dialog.Input>
        <Dialog.Button
          label={
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
                        : `cancellation`
          }
          color="red"
          onPress={() => {
            setVisibleReverse(false);
            //after
            setCountReverse(1);
          }}
        />
        <Dialog.Button
          label={
            country === "ko"
              ? "교환"
              : country === "ja"
                ? "交換"
                : country === "es"
                  ? "Canje"
                  : country === "fr"
                    ? "Échange"
                    : country === "id"
                      ? "Tukar"
                      : country === "zh"
                        ? "兑换"
                        : "Exchange"
          }
          onPress={async () => {
            if (countReverse > itemCountReverse) {
              //포인트 부족

              Alert.alert(
                country === "ko"
                  ? "아이템 개수가 부족합니다."
                  : country === "ja"
                    ? "アイテムが不足しています。"
                    : country === "es"
                      ? "No tienes suficientes artículos."
                      : country === "fr"
                        ? "Le nombre d'articles est insuffisant."
                        : country === "id"
                          ? "Jumlah item tidak mencukupi."
                          : country === "zh"
                            ? "物品数量不足。"
                            : "Not enough items.",
              );
              return;
            } else {
              await api
                .post("/point/reverseItem", {
                  code: selectReverseItem,
                  count: countReverse,
                })
                .then(res => {
                  if (res.data.status === "true") {
                    const item = res.data.item;

                    Alert.alert(
                      country === "ko"
                        ? "교환 완료"
                        : country === "ja"
                          ? "交換完了"
                          : country === "es"
                            ? "Intercambio completado"
                            : country === "fr"
                              ? "Échange terminé"
                              : country === "id"
                                ? "Pertukaran selesai"
                                : country === "zh"
                                  ? "兑换完成"
                                  : "Exchange completed",
                    );
                    updatePoint({
                      ...point,
                      amount: point.amount + countReverse * selectReversePrice,
                    });
                    setItem(item);
                  }
                });
            }
            //after
            setVisibleReverse(false);
            setCountReverse(1);
          }}
        />
      </Dialog.Container>
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
                if (beforeChat) {
                  navigation.navigate("Chat", {
                    afterGift: true,
                  });
                } else {
                  navigation.goBack();
                }
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
                  ? "내아이템"
                  : country === "ja"
                    ? "所有アイテム"
                    : country === "es"
                      ? "Artículos en posesión"
                      : country === "fr"
                        ? "Articles détenus"
                        : country === "id"
                          ? "Item yang Dimiliki"
                          : country === "zh"
                            ? "拥有的物品"
                            : "Owned items"}
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
        <ScrollView
          style={{
            flex: 1,
            paddingLeft: vw(4),
            paddingRight: vw(4),
          }}>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              marginTop: vh(2),
              justifyContent: "space-between",
              backgroundColor: PALETTE.COLOR_BACK,
              borderRadius: 10,
              //marginLeft: -vw(4),
              //marginRight: -vw(4),
              paddingLeft: vw(4),
              paddingRight: vw(4),
              paddingTop: vh(2),
              paddingBottom: vh(2),
            }}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setVisibleReverse(true);
                setSelectReverseItem(ITEM_LIST.ITEM_CANDY.code);
                setSelectReversePrice(ITEM_LIST.ITEM_CANDY.price);
                setItemCountReverse(item?.candy_count);
              }}>
              <Image
                source={require("../../assets/setting/store-candy.png")}
                style={{
                  width: vw(10),
                  height: vw(10),
                  marginBottom: 5,
                }}></Image>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 12,
                  color: "black",
                }}>
                x{item?.candy_count}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setVisibleReverse(true);
                setSelectReverseItem(ITEM_LIST.ITEM_ROSE.code);
                setSelectReversePrice(ITEM_LIST.ITEM_ROSE.price);
                setItemCountReverse(item?.rose_count);
              }}>
              <Image
                source={require("../../assets/setting/store-rose.png")}
                style={{
                  width: vw(10),
                  height: vw(10),
                  marginBottom: 5,
                }}></Image>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 12,
                  color: "black",
                }}>
                x{item?.rose_count}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setVisibleReverse(true);
                setSelectReverseItem(ITEM_LIST.ITEM_CAKE.code);
                setSelectReversePrice(ITEM_LIST.ITEM_CAKE.price);
                setItemCountReverse(item?.cake_count);
              }}>
              <Image
                source={require("../../assets/setting/store-cake.png")}
                style={{
                  width: vw(10),
                  height: vw(10),
                  marginBottom: 5,
                }}></Image>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 12,
                  color: "black",
                }}>
                x{item?.cake_count}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setVisibleReverse(true);
                setSelectReverseItem(ITEM_LIST.ITEM_RING.code);
                setSelectReversePrice(ITEM_LIST.ITEM_RING.price);
                setItemCountReverse(item?.ring_count);
              }}>
              <Image
                source={require("../../assets/setting/store-ring.png")}
                style={{
                  width: vw(10),
                  height: vw(10),
                  marginBottom: 5,
                }}></Image>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 12,
                  color: "black",
                }}>
                x{item?.ring_count}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setVisibleReverse(true);
                setSelectReverseItem(ITEM_LIST.ITEM_CROWN.code);
                setSelectReversePrice(ITEM_LIST.ITEM_CROWN.price);
                setItemCountReverse(item?.crown_count);
              }}>
              <Image
                source={require("../../assets/setting/store-crown.png")}
                style={{
                  width: vw(10),
                  height: vw(10),
                  marginBottom: 5,
                }}></Image>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 12,
                  color: "black",
                }}>
                x{item?.crown_count}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setVisibleReverse(true);
                setSelectReverseItem(ITEM_LIST.ITEM_HEART.code);
                setSelectReversePrice(ITEM_LIST.ITEM_HEART.price);
                setItemCountReverse(item?.heart_count);
              }}>
              <Image
                source={require("../../assets/setting/store-heart.png")}
                style={{
                  width: vw(10),
                  height: vw(10),
                  marginBottom: 5,
                }}></Image>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 12,
                  color: "black",
                }}>
                x{item?.heart_count}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: vh(4),
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
                source={require("../../assets/setting/store-candy.png")}
                style={{
                  width: 50,
                  height: 50,
                }}></Image>
              <View
                style={{
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `캔디바`
                    : country === "ja"
                      ? `キャンディーバー`
                      : country === "es"
                        ? `barra de chocolate`
                        : country === "fr"
                          ? `barre chocolatée`
                          : country === "id"
                            ? `permen batangan`
                            : country === "zh"
                              ? `糖果条`
                              : `candy bar`}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    marginTop: 5,
                  }}>
                  <Image
                    source={require("../../assets/setting/point.png")}
                    style={{
                      marginLeft: 2,
                      width: 16,
                      height: 16,
                    }}></Image>
                  <Text
                    style={{
                      color: "black",
                    }}>
                    100
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                height: 40,
                padding: 10,
                borderRadius: 10,
                backgroundColor: PALETTE.COLOR_WHITE,
              }}
              onPress={() => {
                setVisible(true);
                setSelectItem(ITEM_LIST.ITEM_CANDY.code);
                setSelectPrice(ITEM_LIST.ITEM_CANDY.price);
              }}>
              <Text
                style={{
                  color: PALETTE.COLOR_ORANGE,
                }}>
                {country === "ko"
                  ? "구매하기"
                  : country === "ja"
                    ? "購入"
                    : country === "es"
                      ? "Comprar"
                      : country === "fr"
                        ? "Acheter"
                        : country === "id"
                          ? "Membeli"
                          : country === "zh"
                            ? "购买"
                            : "Buy"}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: vh(2),
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
                source={require("../../assets/setting/store-rose.png")}
                style={{
                  width: 50,
                  height: 50,
                }}></Image>
              <View
                style={{
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `장미꽃`
                    : country === "ja"
                      ? `バラの花`
                      : country === "es"
                        ? `Rosa`
                        : country === "fr"
                          ? `Rose`
                          : country === "id"
                            ? `Mawar`
                            : country === "zh"
                              ? `玫瑰`
                              : `Rose`}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    marginTop: 5,
                  }}>
                  <Image
                    source={require("../../assets/setting/point.png")}
                    style={{
                      marginLeft: 2,
                      width: 16,
                      height: 16,
                    }}></Image>
                  <Text
                    style={{
                      color: "black",
                    }}>
                    {" "}
                    300
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                height: 40,
                padding: 10,
                borderRadius: 10,
                backgroundColor: PALETTE.COLOR_WHITE,
              }}
              onPress={() => {
                setVisible(true);
                setSelectItem(ITEM_LIST.ITEM_ROSE.code);
                setSelectPrice(ITEM_LIST.ITEM_ROSE.price);
              }}>
              <Text
                style={{
                  color: PALETTE.COLOR_ORANGE,
                }}>
                {country === "ko"
                  ? "구매하기"
                  : country === "ja"
                    ? "購入"
                    : country === "es"
                      ? "Comprar"
                      : country === "fr"
                        ? "Acheter"
                        : country === "id"
                          ? "Membeli"
                          : country === "zh"
                            ? "购买"
                            : "Buy"}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: vh(2),
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
                source={require("../../assets/setting/store-cake.png")}
                style={{
                  width: 50,
                  height: 50,
                }}></Image>
              <View
                style={{
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `케이크`
                    : country === "ja"
                      ? `ケーキ`
                      : country === "es"
                        ? `pastel`
                        : country === "fr"
                          ? `gâteau`
                          : country === "id"
                            ? `kue`
                            : country === "zh"
                              ? `蛋糕`
                              : `cake`}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    marginTop: 5,
                  }}>
                  <Image
                    source={require("../../assets/setting/point.png")}
                    style={{
                      marginLeft: 2,
                      width: 16,
                      height: 16,
                    }}></Image>
                  <Text
                    style={{
                      color: "black",
                    }}>
                    1,000
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                height: 40,
                padding: 10,
                borderRadius: 10,
                backgroundColor: PALETTE.COLOR_WHITE,
              }}
              onPress={() => {
                setVisible(true);
                setSelectItem(ITEM_LIST.ITEM_CAKE.code);
                setSelectPrice(ITEM_LIST.ITEM_CAKE.price);
              }}>
              <Text
                style={{
                  color: PALETTE.COLOR_ORANGE,
                }}>
                {country === "ko"
                  ? "구매하기"
                  : country === "ja"
                    ? "購入"
                    : country === "es"
                      ? "Comprar"
                      : country === "fr"
                        ? "Acheter"
                        : country === "id"
                          ? "Membeli"
                          : country === "zh"
                            ? "购买"
                            : "Buy"}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: vh(2),
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
                source={require("../../assets/setting/store-ring.png")}
                style={{
                  width: 50,
                  height: 50,
                }}></Image>
              <View
                style={{
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `다이아몬드 링`
                    : country === "ja"
                      ? `ダイヤモンドリング`
                      : country === "es"
                        ? `anillo de diamantes`
                        : country === "fr"
                          ? `bague de diamant`
                          : country === "id"
                            ? `cincin berlian`
                            : country === "zh"
                              ? `钻戒`
                              : `diamond ring`}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    marginTop: 5,
                  }}>
                  <Image
                    source={require("../../assets/setting/point.png")}
                    style={{
                      marginLeft: 2,
                      width: 16,
                      height: 16,
                    }}></Image>
                  <Text
                    style={{
                      color: "black",
                    }}>
                    3,000
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                height: 40,
                padding: 10,
                borderRadius: 10,
                backgroundColor: PALETTE.COLOR_WHITE,
              }}
              onPress={() => {
                setVisible(true);
                setSelectItem(ITEM_LIST.ITEM_RING.code);
                setSelectPrice(ITEM_LIST.ITEM_RING.price);
              }}>
              <Text
                style={{
                  color: PALETTE.COLOR_ORANGE,
                }}>
                {country === "ko"
                  ? "구매하기"
                  : country === "ja"
                    ? "購入"
                    : country === "es"
                      ? "Comprar"
                      : country === "fr"
                        ? "Acheter"
                        : country === "id"
                          ? "Membeli"
                          : country === "zh"
                            ? "购买"
                            : "Buy"}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: vh(2),
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
                source={require("../../assets/setting/store-crown.png")}
                style={{
                  width: 50,
                  height: 50,
                }}></Image>
              <View
                style={{
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `보석 왕관`
                    : country === "ja"
                      ? `ジュエリークラウン`
                      : country === "es"
                        ? `corona de joyas`
                        : country === "fr"
                          ? `couronne de bijoux`
                          : country === "id"
                            ? `mahkota permata`
                            : country === "zh"
                              ? `宝石皇冠`
                              : `jewel crown`}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    marginTop: 5,
                  }}>
                  <Image
                    source={require("../../assets/setting/point.png")}
                    style={{
                      marginLeft: 2,
                      width: 16,
                      height: 16,
                    }}></Image>
                  <Text
                    style={{
                      color: "black",
                    }}>
                    9,000
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                height: 40,
                padding: 10,
                borderRadius: 10,
                backgroundColor: PALETTE.COLOR_WHITE,
              }}
              onPress={() => {
                setVisible(true);
                setSelectItem(ITEM_LIST.ITEM_CROWN.code);
                setSelectPrice(ITEM_LIST.ITEM_CROWN.price);
              }}>
              <Text
                style={{
                  color: PALETTE.COLOR_ORANGE,
                }}>
                {country === "ko"
                  ? "구매하기"
                  : country === "ja"
                    ? "購入"
                    : country === "es"
                      ? "Comprar"
                      : country === "fr"
                        ? "Acheter"
                        : country === "id"
                          ? "Membeli"
                          : country === "zh"
                            ? "购买"
                            : "Buy"}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: vh(2),
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
                source={require("../../assets/setting/store-heart.png")}
                style={{
                  width: 50,
                  height: 50,
                }}></Image>
              <View
                style={{
                  marginLeft: 10,
                }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `메가하트`
                    : country === "ja"
                      ? `メガハート`
                      : country === "es"
                        ? `mega corazon`
                        : country === "fr"
                          ? `Méga coeur`
                          : country === "id"
                            ? `Mega Hati`
                            : country === "zh"
                              ? `超级之心`
                              : `Mega Heart`}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    marginTop: 5,
                  }}>
                  <Image
                    source={require("../../assets/setting/point.png")}
                    style={{
                      marginLeft: 2,
                      width: 16,
                      height: 16,
                    }}></Image>
                  <Text
                    style={{
                      color: "black",
                    }}>
                    18,000
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                height: 40,
                padding: 10,
                borderRadius: 10,
                backgroundColor: PALETTE.COLOR_WHITE,
              }}
              onPress={() => {
                setVisible(true);
                setSelectItem(ITEM_LIST.ITEM_HEART.code);
                setSelectPrice(ITEM_LIST.ITEM_HEART.price);
              }}>
              <Text
                style={{
                  color: PALETTE.COLOR_ORANGE,
                }}>
                {country === "ko"
                  ? "구매하기"
                  : country === "ja"
                    ? "購入"
                    : country === "es"
                      ? "Comprar"
                      : country === "fr"
                        ? "Acheter"
                        : country === "id"
                          ? "Membeli"
                          : country === "zh"
                            ? "购买"
                            : "Buy"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </NotchView>
  );
}
