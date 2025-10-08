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
  FlatList,
  RefreshControl,
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

export default function MySubscribe({
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
  const pageNum: any = useRef(0);
  const pageSize: any = useRef(20);
  const [subscribingList, setSubscribingList]: any = useState([]);
  const [subscriberList, setSubscriberList]: any = useState([]);
  const [subscribeType, setSubscribetype] = useState("subscribing");

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (subscribeType === "subscribing") {
      await api
        .get("/subscribe/getMySubscribing", {
          params: {
            pageNum: 0,
            pageSize: pageSize.current,
          },
        })
        .then(res => {
          pageNum.current = 1;
          if (res.data.subscribing[0] && res.data.subscribing[0].Subscribings) {
            setSubscribingList(res.data.subscribing[0].Subscribings);
          }
        });
    } else if (subscribeType === "subscriber") {
      await api
        .get("/subscribe/getMySubscriber", {
          params: {
            pageNum: 0,
            pageSize: pageSize.current,
          },
        })
        .then(res => {
          pageNum.current = 1;
          if (res.data.subscriber[0] && res.data.subscriber[0].Subscribers) {
            setSubscriberList(res.data.subscriber[0].Subscribers);
          }
        });
    }

    setRefreshing(false);
  }, [user]);

  const ref: any = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        await api
          .get("/subscribe/getMySubscribing", {
            params: {
              pageNum: 0,
              pageSize: pageSize.current,
            },
          })
          .then(res => {
            pageNum.current = 1;
            if (
              res.data.subscribing[0] &&
              res.data.subscribing[0].Subscribings
            ) {
              setSubscribingList(res.data.subscribing[0].Subscribings);
            }
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
                  ? "내 구독 리스트"
                  : country === "ja"
                  ? "私の購読リスト"
                  : country === "es"
                  ? "Mi lista de suscripciones"
                  : country === "fr"
                  ? "Ma liste d'abonnements"
                  : country === "id"
                  ? "Daftar langganan saya"
                  : country === "zh"
                  ? "我的订阅列表"
                  : "My Subscription List"}
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
            marginBottom: vh(2),
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
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
            onPress={async () => {
              setSubscribetype("subscribing");
              await api
                .get("/subscribe/getMySubscribing", {
                  params: {
                    pageNum: 0,
                    pageSize: pageSize.current,
                  },
                })
                .then(res => {
                  pageNum.current = 1;
                  if (
                    res.data.subscribing[0] &&
                    res.data.subscribing[0].Subscribings
                  ) {
                    setSubscribingList(res.data.subscribing[0].Subscribings);
                  }
                });
            }}>
            <Text
              style={{
                color: "black",
                fontSize: 12,
              }}>
              {country === "ko"
                ? "구독중"
                : country === "ja"
                ? "購読中"
                : country === "es"
                ? "Suscrito"
                : country === "fr"
                ? "Abonné"
                : country === "id"
                ? "Terlangganan"
                : country === "zh"
                ? "订阅中"
                : "Subscribed"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginLeft: 10,
              borderRadius: 10,
              width: 70,
              height: 40,
              backgroundColor: PALETTE.COLOR_BACK,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
            onPress={async () => {
              setSubscribetype("subscriber");
              await api
                .get("/subscribe/getMySubscriber", {
                  params: {
                    pageNum: 0,
                    pageSize: pageSize.current,
                  },
                })
                .then(res => {
                  pageNum.current = 1;
                  if (
                    res.data.subscriber[0] &&
                    res.data.subscriber[0].Subscribers
                  ) {
                    setSubscriberList(res.data.subscriber[0].Subscribers);
                  }
                });
            }}>
            <Text
              style={{
                color: "black",
                fontSize: 12,
              }}>
              {country === "ko"
                ? "구독자"
                : country === "ja"
                ? "購読者"
                : country === "es"
                ? "Suscriptores"
                : country === "fr"
                ? "Abonnés"
                : country === "id"
                ? "Pelanggan"
                : country === "zh"
                ? "订阅者"
                : "Subscribers"}
            </Text>
          </TouchableOpacity>
        </View>
        {subscribeType && subscriberList && subscribingList && (
          <FlatList
            ref={ref}
            contentContainerStyle={{
              marginTop: vh(2),
              paddingLeft: vw(4),
              paddingRight: vw(4),
              //flex: 1,
              //paddingBottom: vh(10),
              //flexGrow: 1,
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            scrollEnabled
            onEndReached={async e => {
              if (subscribeType === "subscribing") {
                await api
                  .get("/subscribe/getMySubscribing", {
                    params: {
                      pageNum: pageNum.current,
                      pageSize: pageSize.current,
                    },
                  })
                  .then(res => {
                    pageNum.current = pageNum.current + 1;
                    if (res.data?.subscribing[0]?.Subscribings) {
                      setSubscribingList(
                        subscribingList.concat(
                          res.data.subscribing[0].Subscribings,
                        ),

                        /*(prev: any) => [
                        ...prev,
                        ...res.data.subscribing[0].Subscribings,
                      ]*/
                      );
                    }
                  });
              } else if (subscribeType === "subscriber") {
                await api
                  .get("/subscribe/getMySubscriber", {
                    params: {
                      pageNum: pageNum.current,
                      pageSize: pageSize.current,
                    },
                  })
                  .then(res => {
                    pageNum.current = pageNum.current + 1;
                    if (res.data?.subscriber[0]?.Subscribers) {
                      setSubscriberList(
                        subscriberList.concat(
                          res.data.subscriber[0].Subscribers,
                        ),

                        /*(prev: any) => [
                        ...prev,
                        ...res.data.subscriber[0].Subscribers,
                      ]*/
                      );
                    }
                  });
              }
            }}
            //horizontal={true}
            keyExtractor={(item: any) => item.id}
            data={
              subscribeType === "subscribing" ? subscribingList : subscriberList
            }
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
                  {country === "ko"
                    ? "구독 목록이 없습니다."
                    : country === "ja"
                    ? "購読リストがありません。"
                    : country === "es"
                    ? "No hay lista de suscripción."
                    : country === "fr"
                    ? "Pas de liste d'abonnements."
                    : country === "id"
                    ? "Tidak ada daftar langganan."
                    : country === "zh"
                    ? "没有订阅列表。"
                    : "No subscription list available."}
                </Text>
              </View>
            )}
            /*
            ListHeaderComponent={() => (
      
            )}
            */
            renderItem={(props: any) => (
              <TouchableOpacity
                activeOpacity={1}
                key={props.index}
                onPress={async () => {
                  navigation.navigate("Profile", {
                    YouId: props.item.id,
                  });
                }}
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                  marginBottom: vh(2),
                  flexDirection: "row",
                }}>
                <FastImage
                  source={{
                    uri: props.item?.profile,
                    priority: FastImage.priority.normal,
                  }}
                  style={{
                    width: vh(6.5),
                    height: vh(6.5),
                    borderRadius: 100,
                  }}
                  resizeMode={FastImage.resizeMode.cover}></FastImage>
                <View
                  style={{
                    alignContent: "center",
                    alignItems: "flex-start",
                    paddingLeft: 10,
                    flex: 1,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#838383",
                      fontSize: 10,
                      fontWeight: "bold",
                      marginBottom: 2,
                    }}>
                    VIP {props.item?.Subscribe?.step}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontWeight: "bold",
                      marginBottom: 2,
                      fontSize: 12,
                      color: "black",
                    }}>
                    {props.item?.nick}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#838383",
                      fontSize: 10,
                      marginBottom: 2,
                    }}>
                    {props.item?.link}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#838383",
                      fontSize: 10,
                      marginBottom: 2,
                    }}>
                    {country === "ko"
                      ? "마지막 구독 날짜"
                      : country === "ja"
                      ? "最終購読日"
                      : country === "es"
                      ? "Fecha de última suscripción"
                      : country === "fr"
                      ? "Date de la dernière souscription"
                      : country === "id"
                      ? "Tanggal langganan terakhir"
                      : country === "zh"
                      ? "最后订阅日期"
                      : "Last Subscription Date"}{" "}
                    -{" "}
                    {new Date(
                      props.item?.Subscribe?.subscribedAt,
                    ).toLocaleDateString()}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#838383",
                      fontSize: 10,
                    }}>
                    {country === "ko"
                      ? "구독 횟수"
                      : country === "ja"
                      ? "購読回数"
                      : country === "es"
                      ? "Número de suscripciones"
                      : country === "fr"
                      ? "Nombre d'abonnements"
                      : country === "id"
                      ? "Jumlah pelanggan"
                      : country === "zh"
                      ? "订阅次数"
                      : "Number of Subscriptions"}{" "}
                    -{props.item?.Subscribe?.subscribeCount}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                  }}>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      backgroundColor: PALETTE.COLOR_NAVY,
                      padding: 10,
                      borderRadius: 10,
                    }}
                    onPress={async e => {
                      if (subscribeType === "subscribing") {
                        if (props.item?.Subscribe.subscribeState === true) {
                          //구독중 -> 구독취소
                          await api
                            .put("/subscribe/cancelSubscribing", {
                              YouId: props.item?.id,
                            })
                            .then(res => {
                              if (res.data.status === "true") {
                                Alert.alert(
                                  country === "ko"
                                    ? "구독 취소"
                                    : country === "ja"
                                    ? "購読キャンセル"
                                    : country === "es"
                                    ? "Cancelar suscripción"
                                    : country === "fr"
                                    ? "Annuler l'abonnement"
                                    : country === "id"
                                    ? "Batalkan langganan"
                                    : country === "zh"
                                    ? "取消订阅"
                                    : "Unsubscribe",
                                  country === "ko"
                                    ? "다음달에 자동결제 되지 않습니다."
                                    : country === "ja"
                                    ? "来月に自動支払いは行われません。"
                                    : country === "es"
                                    ? "No se realizará el pago automático el próximo mes."
                                    : country === "fr"
                                    ? "Le paiement automatique ne sera pas effectué le mois prochain."
                                    : country === "id"
                                    ? "Pembayaran otomatis tidak akan dilakukan bulan depan."
                                    : country === "zh"
                                    ? "下个月不会自动付款。"
                                    : "Automatic payment will not be made next month.",
                                );
                                setSubscribingList(
                                  subscribingList.map(
                                    (list: any, idx: number) =>
                                      list?.id === props.item?.id
                                        ? {
                                            ...list,
                                            Subscribe: {
                                              ...list.Subscribe,
                                              subscribeState: false,
                                            },
                                          }
                                        : list,
                                  ),
                                );
                              }
                            });
                        } else {
                          //구독취소 -> 구독중
                          await api
                            .put("/subscribe/reSubscribing", {
                              YouId: props.item?.id,
                            })
                            .then(res => {
                              if (res.data.status === "true") {
                                Alert.alert(
                                  country === "ko"
                                    ? "구독 유지"
                                    : country === "ja"
                                    ? "サブスクリプションを続ける"
                                    : country === "es"
                                    ? "Mantener la suscripción"
                                    : country === "fr"
                                    ? "Maintenir l'abonnement"
                                    : country === "id"
                                    ? "Pertahankan langganan"
                                    : country === "zh"
                                    ? "继续订阅"
                                    : "Maintain subscription",
                                  country === "ko"
                                    ? "다음달에 자동결제 됩니다."
                                    : country === "ja"
                                    ? "来月に自動請求されます。"
                                    : country === "es"
                                    ? "Se cargará automáticamente el próximo mes."
                                    : country === "fr"
                                    ? "La facturation automatique commencera le mois prochain."
                                    : country === "id"
                                    ? "Pembayaran otomatis akan dilakukan bulan depan."
                                    : country === "zh"
                                    ? "下个月将自动扣款。"
                                    : "Automatic billing will start next month.",
                                );
                                setSubscribingList(
                                  subscribingList.map(
                                    (list: any, idx: number) =>
                                      list?.id === props.item?.id
                                        ? {
                                            ...list,
                                            Subscribe: {
                                              ...list.Subscribe,
                                              subscribeState: true,
                                            },
                                          }
                                        : list,
                                  ),
                                );
                              }
                            });
                        }
                      } else if (subscribeType === "subscriber") {
                        navigation.navigate("Profile", {
                          YouId: props.item.id,
                        });
                      }
                    }}>
                    <Text
                      style={{
                        color: PALETTE.COLOR_WHITE,
                      }}>
                      {subscribeType === "subscribing"
                        ? props.item?.Subscribe.subscribeState === true
                          ? country === "ko"
                            ? "구독 해제"
                            : country === "ja"
                            ? "購読を解除"
                            : country === "es"
                            ? "Cancelar suscripción"
                            : country === "fr"
                            ? "Annuler l'abonnement"
                            : country === "id"
                            ? "Batalkan langganan"
                            : country === "zh"
                            ? "取消订阅"
                            : "Unsubscribe"
                          : country === "ko"
                          ? "재구독"
                          : country === "ja"
                          ? "再購読"
                          : country === "es"
                          ? "Volver a suscribirse"
                          : country === "fr"
                          ? "Se réabonner"
                          : country === "id"
                          ? "Resubscribe"
                          : country === "zh"
                          ? "重新订阅"
                          : "Resubscribe"
                        : country === "ko"
                        ? "프로필"
                        : country === "ja"
                        ? "プロフィール"
                        : country === "es"
                        ? "Perfil"
                        : country === "fr"
                        ? "Profil"
                        : country === "id"
                        ? "Profil"
                        : country === "zh"
                        ? "个人资料"
                        : "Profile"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </NotchView>
  );
}
