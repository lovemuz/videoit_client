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
import {WebView} from "react-native-webview";
import Share from "react-native-share";
import FastImage from "react-native-fast-image";
import Clipboard from "@react-native-clipboard/clipboard";
import api from "../../lib/api/api";
import {PALETTE} from "../../lib/constant/palette";
import serverURL from "../../lib/constant/serverURL";
import ImageModal from "../reusable/imageModal";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ToastComponent} from "../reusable/useToast";
import VideoModal from "../reusable/videoModal";
import {POST_TYPE} from "../../lib/constant/post-constant";
import {useIsFocused} from "@react-navigation/native";
import EncryptedStorage from "react-native-encrypted-storage";
import {CHAT_TYPE} from "../../lib/constant/chat-constant";

export default function Gallery({
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
  const type = route.params?.type; //profile, chat
  const YouId = route.params?.YouId;
  const RoomId = route.params?.RoomId;
  const pageNum: any = useRef(0);
  const pageSize: any = useRef(30);
  const [galleryList, setGalleryList]: any = useState([]);
  const [imgUrl, setImgUrl]: any = useState(null);
  const [imgVisible, setImgVisible] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [modalText, setModalText]: any = useState(null);

  const [refreshing, setRefreshing] = React.useState(false);

  const [firstRender, setFirstRender] = useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await api
      .get("/post/getPostAndChatGalleryAll", {
        params: {
          pageNum: 0,
          pageSize: pageSize.current,
          YouId,
        },
      })
      .then(res => {
        pageNum.current = 1;
        setGalleryList(res.data.galleryList);
      });
    setRefreshing(false);
  }, [user]);
  useEffect(() => {
    async function fetchData() {
      try {
        await api
          .get("/post/getPostAndChatGalleryAll", {
            params: {
              pageNum: 0,
              pageSize: pageSize.current,
              YouId,
            },
          })
          .then(res => {
            pageNum.current = 1;
            setGalleryList(res.data.galleryList);
          });
      } catch (err) {}
      setFirstRender(true);
    }
    fetchData();
  }, []);
  const insets = useSafeAreaInsets();
  const [videoId, setVideoId]: any = useState(null);
  const [videoType, setVideoType]: any = useState(null);
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

  useEffect(() => {
    async function fetchData() {
      try {
        await api.get("/point/getMyPoint").then(res => {
          updatePoint(res.data.point);
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
      {imgVisible === true && (
        <ImageModal
          country={country}
          screenModal={false}
          isVisible={imgVisible}
          imgUrl={imgUrl}
          setIsVisible={setImgVisible}
          modalText={modalText}
          setModalText={setModalText}></ImageModal>
      )}
      {videoVisible === true && (
        <VideoModal
          country={country}
          screenModal={false}
          isVisible={videoVisible}
          videoId={videoId}
          videoType={videoType}
          setIsVisible={setVideoVisible}
          modalText={modalText}
          setModalText={setModalText}></VideoModal>
      )}
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
                  fontWeight: "400",
                  fontSize: 16,
                  color: "black",
                }}>
                {country === "ko"
                  ? "갤러리"
                  : country === "ja"
                  ? "ギャラリー"
                  : country === "es"
                  ? "Galería"
                  : country === "fr"
                  ? "Galerie"
                  : country === "id"
                  ? "Galeri"
                  : country === "zh"
                  ? "画廊"
                  : "Gallery"}
              </Text>
            </View>
            <View
              style={{
                width: 30,
                height: 30,
              }}></View>
          </View>
        </View>
        {galleryList && firstRender && (
          <FlatList
            contentContainerStyle={{
              marginTop: vh(2),
              paddingBottom: vh(4),
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            scrollEnabled
            onEndReached={async e => {
              await api
                .get("/post/getPostAndChatGalleryAll", {
                  params: {
                    pageNum: pageNum.current,
                    pageSize: pageSize.current,
                    YouId,
                  },
                })
                .then(res => {
                  pageNum.current = pageNum.current + 1;
                  setGalleryList(galleryList.concat(res.data.galleryList));
                });
            }}
            //horizontal={true}
            keyExtractor={(item: any) => item?.id}
            data={galleryList}
            numColumns={3}
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
                    ? "컨텐츠가 없습니다."
                    : country === "ja"
                    ? "コンテンツはありません。"
                    : country === "es"
                    ? "No hay contenido."
                    : country === "fr"
                    ? "Aucun contenu."
                    : country === "id"
                    ? "Tidak ada konten."
                    : country === "zh"
                    ? "没有内容。"
                    : "No content available."}
                </Text>
              </View>
            )}
            renderItem={(props: any) => (
              <TouchableOpacity
                activeOpacity={1}
                key={props.index}
                onPress={async () => {
                  if (!props.item?.url) {
                    navigation.navigate("Comment", {
                      PostId: props.item?.id,
                    });
                    return;
                  }
                  if (props.item?.RoomId && props.item?.lock === true) {
                    if (point?.amount < props.item?.cost) {
                      Alert.alert(
                        country === "ko"
                          ? `포인트가 부족합니다.`
                          : country === "ja"
                          ? `ポイントが不足しています。`
                          : country === "es"
                          ? `Puntos insuficientes.`
                          : country === "fr"
                          ? `Points insuffisants.`
                          : country === "id"
                          ? `Poin tidak mencukupi.`
                          : country === "zh"
                          ? `积分不足。`
                          : `Insufficient points.`,
                      );
                      navigation.navigate("Store");
                      return;
                    }

                    Alert.alert(
                      country === "ko"
                        ? `해당 채팅 열람권을 구매하시겠습니까?`
                        : country === "ja"
                        ? `そのチャット閲覧券を購入しますか？`
                        : country === "es"
                        ? `¿Le gustaría comprar una entrada para ver este chat?`
                        : country === "fr"
                        ? `Souhaitez-vous acheter un ticket pour voir ce chat ?`
                        : country === "id"
                        ? `Apakah Anda ingin membeli tiket untuk melihat obrolan ini?`
                        : country === "zh"
                        ? `您想购买门票来观看此聊天吗？`
                        : `Would you like to purchase a ticket to view this chat?`,
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
                              .post("/chat/purchaseChat", {
                                ChatId: props.item?.id,
                              })
                              .then(res => {
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
                                  const chat = res.data.chat;
                                  setGalleryList(
                                    galleryList?.map((item: any, idx: number) =>
                                      item.id === props.item?.id
                                        ? {
                                            ...item,
                                            lock: false,
                                          }
                                        : item,
                                    ),
                                  );

                                  updatePoint({
                                    ...point,
                                    amount: point.amount - props.item?.cost,
                                  });
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
                          },
                        },
                      ],
                    );
                    return;
                  }
                  //if (props.item?.RoomId) {

                  //}

                  setModalText(
                    props.item?.contentSecret === false ||
                      !props.item?.contentSecret
                      ? props.item?.content
                      : country === "ko"
                      ? `구매시 확인 가능합니다.`
                      : country === "ja"
                      ? `購入時に確認可能です。`
                      : country === "es"
                      ? `Puedes comprobarlo al realizar la compra.`
                      : country === "fr"
                      ? `Vous pouvez le vérifier lors de l'achat.`
                      : country === "id"
                      ? `Anda dapat memeriksanya saat membeli.`
                      : country === "zh"
                      ? `您可以在购买时检查这一点。`
                      : `You can check this upon purchase.`,
                  );
                  if (props.item?.type === POST_TYPE.POST_VIDEO) {
                    setVideoVisible(true);
                    setVideoId(props.item?.id);
                    if (props.item?.RoomId) {
                      setVideoType("chat");
                    } else {
                      setVideoType("post");
                    }
                  } else {
                    setImgVisible(true);
                    if (props.item?.RoomId) {
                      setImgUrl(
                        `https://api.nmoment.live/secure/chat/image/${props.item?.id}`,
                      );
                    } else {
                      setImgUrl(
                        `https://api.nmoment.live/secure/post/image/${props.item?.id}`,
                      );
                    }
                  }
                }}
                style={{
                  width: vw(33.333333),
                  height: vw(33.333333),
                  borderWidth: 1,
                  borderColor: PALETTE.COLOR_WHITE,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}>
                {!props.item?.url && props.item?.cost >= -1 ? (
                  <View
                    style={{
                      width: vw(33),
                      height: vw(33),
                      backgroundColor: PALETTE.COLOR_BACK,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}>
                    <Image
                      source={require("../../assets/home/lock.png")}
                      style={{
                        width: vw(8),
                        height: vw(8),
                      }}></Image>
                  </View>
                ) : props.item?.url ? (
                  props.item?.UserId !== user?.id &&
                  props.item?.adult === true &&
                  user?.country === "ko" &&
                  (!user?.real_birthday ||
                    parseInt(user?.real_birthday) >
                      Number(new Date().getFullYear() - 19)) ? (
                    <TouchableOpacity
                      style={{
                        width: vw(33),
                        height: vw(33),
                        backgroundColor: PALETTE.COLOR_BACK,
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        navigation.navigate("CertificationIn");
                      }}>
                      <Image
                        source={require("../../assets/home/adult.png")}
                        style={{
                          position: "absolute",
                          width: vw(10),
                          height: vw(10),
                        }}></Image>
                    </TouchableOpacity>
                  ) : props.item?.RoomId && props.item?.lock === true ? (
                    <LinearGradient
                      start={{x: 0.2, y: 0.2}}
                      end={{x: 1, y: 1}}
                      colors={["#272E38", "#FC4B4E"]}
                      style={{
                        width: vw(33),
                        height: vw(33),
                        backgroundColor: PALETTE.COLOR_BACK,
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                      }}>
                      <Image
                        source={require("../../assets/home/lockW.png")}
                        style={{
                          width: vw(8),
                          height: vw(8),
                        }}></Image>

                      <View
                        style={{
                          marginTop: vh(2),
                          backgroundColor: "rgba(0,0,0,0.5)",
                          borderRadius: 50,
                          padding: 5,
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "center",
                        }}>
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: "white",
                            fontSize: 10,
                          }}>
                          {Number(props?.item?.cost).toLocaleString()}
                        </Text>
                        <Image
                          source={require("../../assets/setting/point.png")}
                          style={{
                            backgroundColor: PALETTE.COLOR_WHITE,
                            borderRadius: 100,
                            width: 10,
                            height: 10,
                            marginLeft: 5,
                          }}></Image>
                      </View>
                    </LinearGradient>
                  ) : props.item?.type === POST_TYPE.POST_IMAGE ? (
                    <FastImage
                      source={{
                        uri: props.item?.RoomId
                          ? `${serverURL}/secure/chat/image/${props.item?.id}` //`https://api.nmoment.live/secure/chat/image/${props.item?.id}`
                          : `${serverURL}/secure/post/image/${props.item?.id}`, //`https://api.nmoment.live/secure/post/image/${props.item?.id}`,
                        headers: {
                          authorization: `Bearer ${accessToken}`,
                          refreshToken: `Bearer ${refreshToken}`,
                        },
                        priority: FastImage.priority.normal,
                      }}
                      style={{
                        width: vw(33),
                        height: vw(33),
                      }}
                      resizeMode={FastImage.resizeMode.cover}></FastImage>
                  ) : (
                    <>
                      <FastImage
                        source={{
                          uri: props.item?.RoomId
                            ? `https://api.nmoment.live/secure/chat/video/${props.item?.id}`
                            : `https://api.nmoment.live/secure/post/video/${props.item?.id}`,
                          priority: FastImage.priority.normal,
                          headers: {
                            authorization: `Bearer ${accessToken}`,
                            refreshToken: `Bearer ${refreshToken}`,
                          },
                        }}
                        style={{
                          width: vw(33),
                          height: vw(33),
                        }}
                        resizeMode={FastImage.resizeMode.cover}></FastImage>
                      <Image
                        source={require("../../assets/home/play.png")}
                        style={{
                          position: "absolute",
                          width: vw(10),
                          height: vw(10),
                        }}></Image>
                    </>
                  )
                ) : (
                  <View></View>
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </NotchView>
  );
}
