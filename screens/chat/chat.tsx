import React, { useLayoutEffect } from "react";
import { useState, useEffect, useRef } from "react";
import {
  Platform,
  SafeAreaView,
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
} from "react-native";
import { NotchProvider, NotchView } from "react-native-notchclear";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { vw, vh, vmin, vmax } from "react-native-css-vh-vw";
//import LinearGradient from "react-native-linear-gradient";
import Video from "react-native-video";
//import {LinearTextGradient} from "react-native-text-gradient";
import SplashScreen from "react-native-splash-screen";

import Share from "react-native-share";
import FastImage from "react-native-fast-image";
import Clipboard from "@react-native-clipboard/clipboard";
import api from "../../lib/api/api";
import { PALETTE } from "../../lib/constant/palette";
import serverURL from "../../lib/constant/serverURL";
import Modal from "react-native-modal";
import { CHAT_TYPE } from "../../lib/constant/chat-constant";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import SocketIOClient from "socket.io-client";
import { BlurView } from "@react-native-community/blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DECLARATION_TYPE } from "../../lib/constant/declaration-constant";
import axios from "axios";
import Loading from "../reusable/loading";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImageModal from "../reusable/imageModal";
import ProfileModal from "../reusable/profileModal";
import { LIVE_CONSTANT } from "../../lib/constant/live-constant";
import EncryptedStorage from "react-native-encrypted-storage";
import VideoModal from "../reusable/videoModal";
import Dialog from "react-native-dialog";
import { ITEM_LIST } from "../../lib/constant/item-constant";
import { useIsFocused } from "@react-navigation/native";
import { createThumbnail } from "react-native-create-thumbnail";
import { USER_GENDER, USER_ROLE } from "../../lib/constant/user-constant";
import LinearGradient from "react-native-linear-gradient";
import ChatModal from "../reusable/chatModal";
import { CHAT_CS_TYPE } from "../../lib/constant/cs-constant";

export default function Chat({
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
  chatCount,
  setChatCount,
  adminRoom,
  updateAdminRoom,
  calling,
  setCalling,
  timer,
  setTimer,
  isRunning,
  setIsRunning,
  callEndByMe,
  modalState,
  setModalState,
  reToken,
  setReToken,
}: {
  reToken: any;
  setReToken: any;
  calling: any;
  setCalling: any;
  timer: any;
  setTimer: any;
  isRunning: any;
  setIsRunning: any;
  callEndByMe: any;
  modalState: any;
  setModalState: any;
  adminRoom: any;
  updateAdminRoom: any;
  chatCount: any;
  setChatCount: any;
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
  const RoomId: number = route.params?.RoomId;
  const admin: Boolean = route.params?.admin;
  const afterGift = route?.params?.afterGift;

  const [you, setYou]: any = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [content, setContent] = useState("");

  const [chatList, setChatList]: any = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const pageNum: any = useRef(0);
  const pageSize: any = useRef(150);
  const scroll: any = useRef();
  const [firstScroll, setFirstScroll] = useState(false);

  const [currentRoom, setCurrentRoom]: any = useState(null);
  const currentHeight: any = useRef(0);
  const totalHeight: any = useRef(0);
  const [newChatAlert, setNewChatAlert] = useState(false);
  const [lastReadIndex, setLastReadIndex] = useState(-1);

  const [gitShow, setGiftShow]: any = useState(false);
  const [item, setItem]: any = useState(null);
  const [modalText, setModalText]: any = useState(null);

  const isLoadingRef = useRef(false);

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
  }, [afterGift]);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await api
        .get("/chat/getMyChat", {
          params: {
            pageNum: pageNum.current,
            pageSize: pageSize.current,
            RoomId,
          },
        })
        .then(res => {
          pageNum.current = pageNum.current + 1;
          setChatList((prevList: any) => [...prevList, ...res.data.chatList]);
          // chatList.concat(res.data.chatList));
        });
    } catch (err) { }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    async function chatSocketInit() {
      const accessToken = await EncryptedStorage.getItem("accessToken");
      chatSocket.current = SocketIOClient(`${serverURL}/chat`, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
        forceNew: true,
        query: {
          RoomId: RoomId,
          accessToken,
        },
      });
      chatSocket.current.on("readPropagation", (data: any) => {
        try {
          const MeId: number = data.MeId;
          const lastRead: number = data.lastRead;
          if (MeId !== user.id) {
            setLastReadIndex(lastRead);
          }
        } catch (err) {
          console.error(err);
        }
      });

      chatSocket.current.on("updateChat", async (data: any) => {
        try {
          const chat: any = data.chat;
          // const
          if (chat?.UserId !== user?.id) {
            setChatList((prevChat: any) => [chat, ...prevChat]);
          }
          if (chat?.UserId === user?.id) {
            scroll?.current?.scrollToEnd();
            setTimeout(() => {
              scroll?.current?.scrollToEnd();
            }, 500);
          } else if (currentHeight.current < totalHeight.current - vh(120)) {
            setNewChatAlert(true);
          }
          if (admin) {
            updateAdminRoom({
              ...adminRoom,
              read: true,
            });
          } else {
            updateRoom((prev: any) =>
              prev.map((item: any, index: number) =>
                item?.id === RoomId
                  ? {
                    ...item,
                    read: true,
                  }
                  : item,
              ),
            );
          }
          try {
            await api
              .put("/room/roomReadChat", {
                RoomId,
                ChatId: chat.id,
              })
              .then(res => {
                if (res.data.status === "true") {
                  //setLastReadIndex(res.data?.youLastReadChatId);
                }
              });
          } catch (err) { }
          chatSocket.current.emit("readPropagation", {
            lastRead: chat.id,
            MeId: user?.id,
          });
        } catch (err) {
          console.error(err);
        }
      });

      return () => {
        //chatSocket.current?.disconnect();
        chatSocket.current.off("updateChat");
        chatSocket.current.off("readPropagation");
        chatSocket.current?.close();
      };
    }
    chatSocketInit();
  }, []);

  const [subscribe, setSubsribe]: any = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        await api
          .get("/room/getRoomOne/v2", {
            params: {
              RoomId,
            },
          })
          .then(res => {
            setYou(res.data.user);
            setCurrentRoom(res.data.room);
            setSubsribe(res.data.subscribe);
          });
      } catch (err) { }
      try {
        await api
          .get("/chat/getMyChat", {
            params: {
              pageNum: 0,
              pageSize: pageSize.current,
              RoomId,
            },
          })
          .then(async res => {
            /*res.data?.chatList[0].id lastRead */
            setChatList(res.data?.chatList);
            pageNum.current = 1;
            if (res.data?.chatList[0]) {
              await api
                .put("/room/roomReadChat", {
                  RoomId,
                  ChatId: res.data?.chatList[0]?.id,
                })
                .then(res => {
                  if (res.data.status === "true") {
                    setLastReadIndex(res.data?.youLastReadChatId);

                    //chatSocket.emit('readPropagation',{})
                    if (admin) {
                      updateAdminRoom({
                        ...adminRoom,
                        read: true,
                      });
                    } else {
                      updateRoom((prev: any) =>
                        prev.map((item: any, index: number) =>
                          item?.id === RoomId
                            ? {
                              ...item,
                              read: true,
                            }
                            : item,
                        ),
                      );
                    }
                  }
                });
              chatSocket.current.emit("readPropagation", {
                lastRead: res.data?.chatList[0].id,
                MeId: user?.id,
              });
            }
          });
      } catch (err) { }
    }

    fetchData();
  }, []);

  const insets = useSafeAreaInsets();
  const [selectUrl, setSelectUrl]: any = useState(null);
  const [selectType, setSelectType] = useState("photo"); // photo or video
  const [modalContent, setModalContent] = useState(false);
  const [loadingState, setLoadingState]: any = useState(false);

  const [videoVisible, setVideoVisible]: any = useState(false);
  const [imgVisible, setImgVisible]: any = useState(false);
  const [imgUrl, setImgUrl]: any = useState(null);

  //const [modalState, setModalState]: any = useState(false);

  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(1);
  const [selectCount, setSelectCount] = useState(0);
  const [selectCode, setSelectCode]: any = useState(null);

  const isFocused = useIsFocused();
  const [accessToken, setAccessToken]: any = useState(null);
  const [refreshToken, setRefreshToken]: any = useState(null);

  useEffect(() => {
    async function getSecureToken() {
      setAccessToken(await EncryptedStorage.getItem("accessToken"));
      setRefreshToken(await EncryptedStorage.getItem("refreshToken"));
      setReToken(false);
    }
    if (isFocused || reToken) {
      getSecureToken();
    }
  }, [isFocused, reToken]);

  const [videoId, setVideoId]: any = useState(null);
  const [videoType, setVideoType]: any = useState(null);

  const [chatModalState, setChatModalState] = useState(false);

  const [adultChk, setAdultChk] = useState(false);

  useEffect(() => {
    async function adultFetch() {
      if (
        you?.adultPage === true &&
        parseInt(you?.id) !== parseInt(user?.id) &&
        (user?.real_birthday === null ||
          (user?.real_birthday &&
            Number(user?.real_birthday) >
            Number(new Date().getFullYear() - 19)))
      ) {
        setAdultChk(true);
      }
    }
    adultFetch();
  }, [you]);

  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["top", "bottom"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={"dark-content"}
      />

      {chatModalState && (
        <ChatModal
          setChatList={setChatList}
          currentRoom={currentRoom}
          setCurrentRoom={setCurrentRoom}
          RoomId={route.params?.RoomId}
          you={you}
          user={user}
          connectSocket={connectSocket}
          chatSocket={chatSocket}
          country={country}
          screenModal={false}
          isVisible={chatModalState}
          setIsVisible={setChatModalState}></ChatModal>
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
      {loadingState === true && <Loading></Loading>}

      <Dialog.Container visible={visible}>
        <Dialog.Title>
          {country === "ko"
            ? `선물 하시겠습니까? `
            : country === "ja"
              ? `プレゼントしますか？ `
              : country === "es"
                ? `¿Quieres regalarlo? `
                : country === "fr"
                  ? `Vous souhaitez l'offrir en cadeau ? `
                  : country === "id"
                    ? `Apakah Anda ingin memberikannya sebagai hadiah? `
                    : country === "zh"
                      ? `您想把它作为礼物送给您吗？ `
                      : `Would you like to give it as a gift? `}
        </Dialog.Title>
        <Dialog.Description>
          {country === "ko"
            ? `선물수량을 입력해주세요. `
            : country === "ja"
              ? `ギフト数量を入力してください。 `
              : country === "es"
                ? `Por favor ingrese la cantidad del regalo.`
                : country === "fr"
                  ? `Veuillez entrer la quantité du cadeau. `
                  : country === "id"
                    ? `Silakan masukkan jumlah hadiah.`
                    : country === "zh"
                      ? `请输入礼品数量。 `
                      : `Please enter the gift quantity. `}
        </Dialog.Description>
        <Dialog.Input
          keyboardType="decimal-pad"
          onChangeText={(e: any) => {
            if (isNaN(e)) {
              setCount(1);
              return;
            } else if (parseInt(e) >= selectCount) {
              setCount(selectCount);
              return;
            } else if (parseInt(e) <= 0) {
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
              ? `선물`
              : country === "ja"
                ? `贈り物`
                : country === "es"
                  ? `regalo`
                  : country === "fr"
                    ? `cadeau`
                    : country === "id"
                      ? `hadiah`
                      : country === "zh"
                        ? `礼物`
                        : `gift`
          }
          onPress={async () => {
            if (count === 0) return;
            if (count > selectCount) {
              //선물개수 부족
              Alert.alert(
                country === "ko"
                  ? `선물개수가 부족합니다.`
                  : country === "ja"
                    ? `ギフト数が足りません。`
                    : country === "es"
                      ? `No hay suficientes regalos.`
                      : country === "fr"
                        ? `Il n'y a pas assez de cadeaux.`
                        : country === "id"
                          ? `Hadiahnya tidak cukup.`
                          : country === "zh"
                            ? `礼物不够。`
                            : `There are not enough gifts.`,
              );
              navigation.navigate("Gift", {
                beforeChat: true,
              });
              return;
            } else {
              await api
                .post("/point/giftItem", {
                  code: selectCode,
                  count,
                  YouId: you.id,
                })
                .then(res => {
                  if (res.data.status === "true") {
                    const item = res.data.item;
                    Alert.alert(
                      country === "ko"
                        ? `선물 완료`
                        : country === "ja"
                          ? `プレゼント完了`
                          : country === "es"
                            ? `regalo completo`
                            : country === "fr"
                              ? `cadeau complet`
                              : country === "id"
                                ? `hadiah lengkap`
                                : country === "zh"
                                  ? `礼物完成`
                                  : `gift complete`,
                    );

                    setItem(item);
                    const chatTemp = res.data.chat;
                    setChatList((prevChat: any) => [chatTemp, ...prevChat]);
                    chatSocket.current.emit("updateChat", {
                      chat: chatTemp,
                    });
                    connectSocket.current.emit("newChat", {
                      YouId: you?.id,
                      MeId: user.id,
                      room: {
                        ...currentRoom,
                        Chats: [chatTemp],
                      },
                      admin,
                    });
                  } else if (res.data.status === "ban") {
                    Alert.alert(
                      country === "ko"
                        ? `차단된 방입니다.`
                        : country === "ja"
                          ? `ブロックされた部屋です。`
                          : country === "es"
                            ? `Esta es una habitación bloqueada.`
                            : country === "fr"
                              ? `C'est une pièce bloquée.`
                              : country === "id"
                                ? `Ini adalah ruangan yang diblokir.`
                                : country === "zh"
                                  ? `这是一个被封锁的房间。`
                                  : `This is a blocked room.`,
                      country === "ko"
                        ? `차단 해제후 채팅 가능합니다.`
                        : country === "ja"
                          ? `ブロック解除後チャット可能です。`
                          : country === "es"
                            ? `Puedes chatear después de desbloquear.`
                            : country === "fr"
                              ? `Vous pouvez discuter après le déblocage.`
                              : country === "id"
                                ? `Anda dapat mengobrol setelah membuka blokir.`
                                : country === "zh"
                                  ? `解封后就可以聊天了。`
                                  : `You can chat after unblocking.`,
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
            }
            //after
            setVisible(false);
            setCount(1);
          }}
        />
      </Dialog.Container>
      {isFocused && you && (
        <ProfileModal
          country={country}
          connectSocket={connectSocket}
          user={user}
          navigation={navigation}
          calling={calling}
          setCalling={setCalling}
          timer={timer}
          setTimer={setTimer}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          callEndByMe={callEndByMe}
          modalState={modalState}
          setModalState={setModalState}
          selectedUser={you}></ProfileModal>
      )}
      {newChatAlert === true && (
        <TouchableOpacity
          style={{
            position: "absolute",
            zIndex: 1,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            backgroundColor: PALETTE.COLOR_BACK,
            borderRadius: 100,
            width: 40,
            height: 40,
            bottom: vh(8),
            left: vw(50) - 20,
            borderWidth: 1,
            borderColor: "#f4f4f4",
          }}
          onPress={() => {
            scroll?.current?.scrollToEnd();
            setNewChatAlert(false);
          }}>
          <Image
            source={require("../../assets/chat/down.png")}
            style={{
              width: 15,
              height: 15,
            }}></Image>
        </TouchableOpacity>
      )}

      {country === "ko" && adultChk === true && (
        <View
          style={{
            width: vw(100),
            height: vh(100),
            position: "absolute",
            zIndex: 214748666,
            top: 0,
            backgroundColor: "rgba(0,0,0,0.2)",
          }}>
          <View
            style={{
              width: vw(100),
              height: vh(100),
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}>
            <View
              style={{
                width: vw(80),
                height: vh(40),
                backgroundColor: "white",
                borderRadius: 20,
                paddingTop: 10,
                justifyContent: "space-between",
              }}>
              <View
                style={{
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <Image
                  style={{
                    width: vh(10),
                    height: vh(10),
                    marginBottom: 20,
                  }}
                  source={require("../../assets/home/adult.png")}></Image>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 24,
                    marginTop: 5,
                  }}>
                  {country === "ko"
                    ? "성인인증이 필요한"
                    : country === "ja"
                      ? "成人認証が必要"
                      : country === "es"
                        ? "Se requiere autenticación de adulto"
                        : "Adult authentication required"}
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 24,
                    marginTop: 5,
                  }}>
                  {country === "ko"
                    ? "콘텐츠입니다."
                    : country === "ja"
                      ? "コンテンツです。"
                      : country === "es"
                        ? "Contenido."
                        : "Content."}
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 14,
                  }}>
                  {country === "ko"
                    ? "해당 콘텐츠는 19세 이상 이용제한이 설정된"
                    : country === "ja"
                      ? "このコンテンツは19歳以上の利用制限が設定されています"
                      : country === "es"
                        ? "El contenido está restringido para su uso por personas mayores de 19 años."
                        : "The content is restricted for use by people over the age of 19."}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                  }}>
                  {country === "ko"
                    ? "콘텐츠 입니다. 최초 1번 인증 완료 이후에는 추가"
                    : country === "ja"
                      ? "コンテンツです。最初の1回認証料金の後に追加"
                      : country === "es"
                        ? "es contenido Después de la primera cuota de autenticación, adicional"
                        : "It is content. After the first authentication fee, additional"}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                  }}>
                  {country === "ko"
                    ? "인증 없이 사용 가능합니다."
                    : country === "ja"
                      ? "認証なしで利用可能です。"
                      : country === "es"
                        ? "Se puede utilizar sin autenticación."
                        : "Can be used without authentication."}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <TouchableOpacity
                  style={{
                    width: vw(40),
                    height: vh(5),
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    backgroundColor: "#eb0000",
                  }}
                  onPress={() => {
                    navigation.replace("CertificationIn");
                  }}>
                  <Text
                    style={{
                      color: "white",
                    }}>
                    {country === "ko"
                      ? "확인"
                      : country === "ja"
                        ? "確認"
                        : country === "es"
                          ? "Confirmar"
                          : "Confirm"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: vw(40),
                    height: vh(5),
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f4f4f4",
                  }}
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Text>
                    {country === "ko"
                      ? "취소"
                      : country === "ja"
                        ? "キャンセル"
                        : country === "es"
                          ? "cancelación"
                          : "cancellation"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      <Modal
        animationIn="slideInRight"
        animationOut={"slideOutRight"}
        swipeDirection="right"
        onSwipeComplete={() => {
          setModalVisible(false);
        }}
        isVisible={isModalVisible}
        onBackButtonPress={() => {
          setModalVisible(false);
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignContent: "center",
          }}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
            activeOpacity={1}
            style={{
              width: vw(25),
              height: vh(100),
              //backgroundColor: "rgba(0,0,0,0.5)",
            }}></TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              width: vw(75),
              /*
              marginTop: Platform.OS === "android" ? -insets.top : 0,
              paddingTop: Platform.OS === "android" ? 0 : insets.top,
              */
              height: vh(100),
              backgroundColor: "white",
              justifyContent: "space-between",
            }}>
            <View
              style={{
                paddingLeft: 20,
                paddingRight: 40,
                paddingTop: 40,
              }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 15,
                  color: "black",
                }}>
                {country === "ko"
                  ? `채팅방 메뉴`
                  : country === "ja"
                    ? `チャットルームメニュー`
                    : country === "es"
                      ? `Menú de la sala de chat`
                      : country === "fr"
                        ? `Menu du salon de discussion`
                        : country === "id"
                          ? `Menu ruang obrolan`
                          : country === "zh"
                            ? `聊天室菜单`
                            : `Chat room menu`}
              </Text>
              <View
                style={{
                  paddingBottom: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: PALETTE.COLOR_BORDER,
                  marginLeft: -20,
                  marginRight: -40,
                }}></View>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("Gallery", {
                    type: "chat",
                    YouId: you.id,
                  });
                }}
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `사진/동영상`
                    : country === "ja"
                      ? `写真/動画`
                      : country === "es"
                        ? `Fotos y Videos`
                        : country === "fr"
                          ? `Photos/Vidéos`
                          : country === "id"
                            ? `Foto/Video`
                            : country === "zh"
                              ? `照片/视频`
                              : `Photos/Videos`}
                </Text>
                <Image
                  source={require("../../assets/setting/right.png")}
                  style={{
                    width: 20,
                    height: 20,
                  }}></Image>
              </TouchableOpacity>
              <View
                style={{
                  marginTop: 20,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `채팅 참여자`
                    : country === "ja"
                      ? `チャット参加者`
                      : country === "es"
                        ? `participante del chat`
                        : country === "fr"
                          ? `participant au chat`
                          : country === "id"
                            ? `peserta obrolan`
                            : country === "zh"
                              ? `聊天参与者`
                              : `chat participant`}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                    marginBottom: 5,
                  }}>
                  <FastImage
                    source={{
                      uri: user?.profile,
                      priority: FastImage.priority.normal,
                    }}
                    style={{
                      width: vh(5),
                      height: vh(5),
                      borderRadius: 100,
                    }}
                    resizeMode={FastImage.resizeMode.cover}></FastImage>
                  <View
                    style={{
                      marginLeft: 10,
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        marginBottom: 2,
                        fontWeight: "bold",
                        color: "black",
                      }}>
                      {user?.nick}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: "#838383",
                      }}>
                      {user?.link}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}>
                  <FastImage
                    source={{
                      uri: you?.profile,
                      priority: FastImage.priority.normal,
                    }}
                    style={{
                      width: vh(5),
                      height: vh(5),
                      borderRadius: 100,
                    }}
                    resizeMode={FastImage.resizeMode.cover}></FastImage>
                  <View
                    style={{
                      marginLeft: 10,
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        marginBottom: 2,
                        fontWeight: "bold",
                        color: "black",
                      }}>
                      {you?.nick}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: "#838383",
                      }}>
                      {you?.link}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                backgroundColor: PALETTE.COLOR_BACK,
                height: vh(12),
                paddingLeft: 20,
                paddingRight: 40,
                paddingBottom: 40,
                justifyContent: "space-between",
              }}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
                onPress={async () => {
                  if (admin) return;
                  Alert.alert(
                    country === "ko"
                      ? "방을 나가시겠습니까?"
                      : country === "ja"
                        ? `部屋から出ますか？`
                        : country === "es"
                          ? `¿Quieres salir de la habitación?`
                          : country === "fr"
                            ? `Souhaitez-vous quitter la pièce ?`
                            : country === "id"
                              ? `Apakah Anda ingin meninggalkan ruangan?`
                              : country === "zh"
                                ? `您想离开房间吗？`
                                : `Would you like to leave the room?`,
                    country === "ko"
                      ? "방을 나가도 상대방에게는 채팅내역이 유지됩니다."
                      : country === "ja"
                        ? `部屋を出ても相手にはチャット履歴が維持されます。`
                        : country === "es"
                          ? `Incluso si sales de la sala, tu historial de chat permanecerá con la otra persona.`
                          : country === "fr"
                            ? `Même si vous quittez la pièce, votre historique de discussion restera avec l'autre personne.`
                            : country === "id"
                              ? `Bahkan jika Anda meninggalkan ruangan, riwayat obrolan Anda akan tetap ada pada orang lain.`
                              : country === "zh"
                                ? `即使您离开房间，您的聊天记录也会保留在对方身上。`
                                : `Even if you leave the room, your chat history will remain with the other person.`,
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
                            .put("/room/outRoom", {
                              RoomId,
                            })
                            .then((res: any) => {
                              if (res.data.status === "true") {
                                navigation.goBack();
                                updateRoom((prevRoom: any) =>
                                  prevRoom.filter(
                                    (item: any) => item.id !== RoomId,
                                  ),
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
                        },
                      },
                    ],
                  );
                }}>
                <Image
                  source={require("../../assets/chat/out.png")}
                  style={{
                    width: 18,
                    height: 18,
                  }}></Image>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                  onPress={async () => {
                    if (admin) return;

                    Alert.alert(
                      country === "ko"
                        ? `차단 하시겠습니까?`
                        : country === "ja"
                          ? `ブロックしますか？`
                          : country === "es"
                            ? `¿Quieres bloquear?`
                            : country === "fr"
                              ? `Voulez-vous bloquer?`
                              : country === "id"
                                ? `Apakah Anda ingin memblokir?`
                                : country === "zh"
                                  ? `你想阻止吗？`
                                  : `Do you want to block?`,
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
                              .post("/user/createBan", {
                                YouId: you.id,
                              })
                              .then((res: any) => {
                                if (res.data.status === "true") {
                                  Alert.alert(
                                    country === "ko"
                                      ? `차단 완료`
                                      : country === "ja"
                                        ? `ブロック完了`
                                        : country === "es"
                                          ? `Obstruido`
                                          : country === "fr"
                                            ? `Bloqué`
                                            : country === "id"
                                              ? `Diblokir`
                                              : country === "zh"
                                                ? `被阻止`
                                                : `Blocked`,
                                    country === "ko"
                                      ? `차단 되었습니다.`
                                      : country === "ja"
                                        ? `ブロックされました。`
                                        : country === "es"
                                          ? `Has sido bloqueado.`
                                          : country === "fr"
                                            ? `Vous avez été bloqué.`
                                            : country === "id"
                                              ? `Anda telah diblokir.`
                                              : country === "zh"
                                                ? `您已被阻止。`
                                                : `You have been blocked.`,
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
                          },
                        },
                      ],
                    );
                  }}>
                  <Image
                    source={require("../../assets/chat/ban.png")}
                    style={{
                      width: 18,
                      height: 18,
                      marginRight: 5,
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#838383",
                      marginRight: 10,
                    }}>
                    {country === "ko"
                      ? `차단`
                      : country === "ja"
                        ? `ブロック`
                        : country === "es"
                          ? `bloquear`
                          : country === "fr"
                            ? `bloc`
                            : country === "id"
                              ? `memblokir`
                              : country === "zh"
                                ? `堵塞`
                                : `block`}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#838383",
                    }}>
                    |
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginLeft: 10,
                  }}
                  onPress={async () => {
                    if (admin) return;

                    Alert.alert(
                      country === "ko"
                        ? `신고 하시겠습니까?`
                        : country === "ja"
                          ? `報告しますか？`
                          : country === "es"
                            ? `¿Quieres denunciarlo?`
                            : country === "fr"
                              ? `Souhaitez-vous le signaler ?`
                              : country === "id"
                                ? `Apakah Anda ingin melaporkannya?`
                                : country === "zh"
                                  ? `您想举报吗？`
                                  : `Would you like to report it?`,
                      country === "ko"
                        ? `해당 신고 내역은 확인후 조취하도록 하겠습니다.`
                        : country === "ja"
                          ? `当該届出の内訳は確認後、お早めにさせていただきます。`
                          : country === "es"
                            ? `Tomaremos medidas después de verificar los detalles del informe.`
                            : country === "fr"
                              ? `Nous prendrons des mesures après avoir vérifié les détails du rapport.`
                              : country === "id"
                                ? `Kami akan mengambil tindakan setelah memeriksa rincian laporan.`
                                : country === "zh"
                                  ? `我们将在检查报告的详细信息后采取行动。`
                                  : `We will take action after checking the details of the report.`,
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
                                        : `check`,
                          onPress: async () => {
                            await api
                              .post("/etc/declaration", {
                                RoomId,
                                UserId: you.id,
                                type: DECLARATION_TYPE.DECLARATION_CHAT,
                              })
                              .then((res: any) => {
                                if (res.data.status === "true") {
                                  Alert.alert(
                                    country === "ko"
                                      ? `신고 완료`
                                      : country === "ja"
                                        ? `報告完了`
                                        : country === "es"
                                          ? `Informe completado`
                                          : country === "fr"
                                            ? `Rapport terminé`
                                            : country === "id"
                                              ? `Laporan selesai`
                                              : country === "zh"
                                                ? `报告完成`
                                                : `Report completed`,
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
                          },
                        },
                      ],
                    );
                  }}>
                  <Image
                    source={require("../../assets/chat/warning.png")}
                    style={{
                      width: 18,
                      height: 18,
                      marginRight: 5,
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#838383",
                    }}>
                    {country === "ko"
                      ? `신고`
                      : country === "ja"
                        ? `報告`
                        : country === "es"
                          ? `Declaración`
                          : country === "fr"
                            ? `Déclaration`
                            : country === "id"
                              ? `Pernyataan`
                              : country === "zh"
                                ? `宣言`
                                : `Declaration`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
        }}
        keyboardVerticalOffset={Platform.OS === "ios" ? vh(6.5) : vh(6.5)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
            }}>
            <View>
              <View
                style={{
                  height: vh(6),
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingLeft: vw(4),
                  paddingRight: vw(4),
                  //borderBottomWidth: 1,
                  //borderBottomColor: PALETTE.COLOR_BORDER,
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    maxWidth: "80%",
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
                        width: 35,
                        height: 35,
                        marginRight: 20,
                      }}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      height: "100%",
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      maxWidth: "45%",
                    }}
                    onPress={() => {
                      setGiftShow(false);
                      navigation.navigate("Profile", {
                        YouId: you.id,
                      });
                    }}>
                    <FastImage
                      source={{
                        uri: you?.profile,
                        priority: FastImage.priority.normal,
                      }}
                      style={{
                        width: vh(4),
                        height: vh(4),
                        borderRadius: 100,
                      }}
                      resizeMode={FastImage.resizeMode.cover}></FastImage>
                    <Text
                      numberOfLines={1}
                      style={{
                        marginLeft: 10,
                        color: "black",
                      }}>
                      {you?.nick}
                    </Text>
                  </TouchableOpacity>
                  {subscribe && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        backgroundColor: PALETTE.COLOR_BACK,
                        paddingTop: 4,
                        paddingBottom: 4,
                        paddingRight: 10,
                        paddingLeft: 6,
                        justifyContent: "space-between",
                        borderRadius: 10,
                        marginLeft: 10,
                      }}>
                      <Image
                        source={require("../../assets/chat/vip.png")}
                        style={{
                          width: 25,
                          height: 25,
                        }}></Image>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 10,
                          marginLeft: 0,
                          color: "black",
                        }}>
                        VIP {subscribe?.step}
                      </Text>
                    </View>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setGiftShow(false);
                      if (admin) return;

                      setModalState(LIVE_CONSTANT.MODAL_STATE_PROFILE);
                      //navigation.navigate("Call");
                    }}>
                    <Image
                      source={require("../../assets/auth/phone.png")}
                      style={{
                        width: 24,
                        height: 24,
                        marginRight: 20,
                      }}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(true);
                      setGiftShow(false);
                    }}>
                    <Image
                      source={require("../../assets/setting/menu.png")}
                      style={{
                        width: 25,
                        height: 25,
                      }}></Image>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 1,
              }}>
              {chatList.length > 0 && chatList && (
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  onScroll={e => {
                    currentHeight.current = e.nativeEvent.contentOffset.y;
                    totalHeight.current = e.nativeEvent.contentSize.height;
                    if (currentHeight.current > totalHeight.current - vh(120)) {
                      setNewChatAlert(false);
                    }
                  }}
                  //inverted
                  onLayout={() => {
                    scroll?.current?.scrollToEnd();
                  }}
                  //initialScrollIndex={chatList.length}
                  onContentSizeChange={(width, height) => {
                    if (currentHeight.current > height - vh(100)) {
                      scroll?.current?.scrollToEnd();
                    }
                  }}
                  contentContainerStyle={{
                    paddingLeft: vw(4),
                    paddingRight: vw(4),
                    paddingTop: vh(2),
                    flexGrow: 1,
                    flexDirection: "column-reverse",
                  }}
                  ref={scroll}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  decelerationRate={"fast"}>
                  {chatList?.map((list: any, idx: number) =>
                    list.type === CHAT_TYPE.CHAT_ALERT ? (
                      <TouchableOpacity
                        activeOpacity={1}
                        key={idx}
                        onPress={() => {
                          setGiftShow(false);
                        }}
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                        }}>
                        <Text
                          style={{
                            marginTop: 15,
                            marginBottom: 15,
                            color: "#838383",
                            fontSize: 10,
                          }}>
                          {new Date(parseInt(list?.content)).toLocaleString()}
                        </Text>
                      </TouchableOpacity>
                    ) : list?.UserId === user?.id ? (
                      <TouchableOpacity
                        activeOpacity={1}
                        key={idx}
                        onPress={() => {
                          setGiftShow(false);
                        }}
                        onLongPress={() => {
                          if (admin) return;
                          Alert.alert(
                            country === "ko"
                              ? `해당 채팅을 삭제하시겠습니까?`
                              : country === "ja"
                                ? `このチャットを削除しますか？`
                                : country === "es"
                                  ? `¿Desea eliminar este chat?`
                                  : country === "fr"
                                    ? `Souhaitez-vous supprimer cette discussion ?`
                                    : country === "id"
                                      ? `Apakah Anda ingin menghapus obrolan ini?`
                                      : country === "zh"
                                        ? `您想删除此聊天吗？`
                                        : `Do you want to delete this chat?`,
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
                                    .delete("/chat/removeChat", {
                                      data: {
                                        ChatId: list?.id,
                                      },
                                    })
                                    .then(res => {
                                      if (res.data.status === "true") {
                                        setChatList(
                                          chatList.filter(
                                            (item: any) => item.id !== list.id,
                                          ),
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
                                },
                              },
                            ],
                          );
                        }}
                        style={{
                          width: "100%",
                          marginBottom: vh(2),
                          alignItems: "flex-end",
                        }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                          }}>
                          <Text
                            style={{
                              color: "#838383",
                              fontSize: 10,
                            }}>
                            {new Date(list?.createdAt).toLocaleTimeString()}
                          </Text>

                          {list.type === CHAT_TYPE.CHAT_NORMAL ? (
                            <View
                              style={{
                                backgroundColor: "#0F0D14",
                                borderRadius: 20,
                                padding: 15,
                                maxWidth: "70%",
                                marginLeft: 10,
                              }}>
                              <Text
                                style={{
                                  color: "white",
                                }}>
                                {list?.content}
                              </Text>
                            </View>
                          ) : list?.type === CHAT_TYPE.CHAT_GIFT ? (
                            <View
                              style={{
                                maxWidth: "70%",
                                marginLeft: 10,
                              }}>
                              <View
                                style={{
                                  borderRadius: 20,
                                  width: "100%",
                                  justifyContent: "center",
                                  alignContent: "center",
                                  alignItems: "center",
                                }}>
                                {list?.url === ITEM_LIST.ITEM_CAKE.code ? (
                                  <Image
                                    source={require("../../assets/setting/store-cake.png")}
                                    style={{
                                      width: vw(30),
                                      height: vw(30),
                                    }}></Image>
                                ) : list?.url === ITEM_LIST.ITEM_CANDY.code ? (
                                  <Image
                                    source={require("../../assets/setting/store-candy.png")}
                                    style={{
                                      width: vw(30),
                                      height: vw(30),
                                    }}></Image>
                                ) : list?.url === ITEM_LIST.ITEM_CROWN.code ? (
                                  <Image
                                    source={require("../../assets/setting/store-crown.png")}
                                    style={{
                                      width: vw(30),
                                      height: vw(30),
                                    }}></Image>
                                ) : list?.url === ITEM_LIST.ITEM_HEART.code ? (
                                  <Image
                                    source={require("../../assets/setting/store-heart.png")}
                                    style={{
                                      width: vw(30),
                                      height: vw(30),
                                    }}></Image>
                                ) : list?.url === ITEM_LIST.ITEM_RING.code ? (
                                  <Image
                                    source={require("../../assets/setting/store-ring.png")}
                                    style={{
                                      width: vw(30),
                                      height: vw(30),
                                    }}></Image>
                                ) : (
                                  list?.url === ITEM_LIST.ITEM_ROSE.code && (
                                    <Image
                                      source={require("../../assets/setting/store-rose.png")}
                                      style={{
                                        width: vw(30),
                                        height: vw(30),
                                      }}></Image>
                                  )
                                )}
                              </View>
                              <View
                                style={{
                                  backgroundColor: "#0F0D14",
                                  borderRadius: 20,
                                  width: "100%",
                                  padding: 15,
                                }}>
                                <Text
                                  style={{
                                    color: "white",
                                  }}>
                                  {list?.content}
                                </Text>
                              </View>
                            </View>
                          ) : list?.type === CHAT_TYPE.CHAT_IMAGE ? (
                            <View
                              style={{
                                maxWidth: "70%",
                                alignItems: "flex-end",
                                marginLeft: 10,
                              }}>
                              <TouchableOpacity
                                style={{
                                  borderRadius: 20,
                                  maxWidth: "100%",
                                }}
                                onPress={() => {
                                  setImgUrl(
                                    `https://api.nmoment.live/secure/chat/image/${list?.id}`,
                                  );
                                  setModalText(list?.content);
                                  setImgVisible(true);
                                }}
                                onLongPress={() => {
                                  Alert.alert(
                                    country === "ko"
                                      ? `해당 채팅을 삭제하시겠습니까?`
                                      : country === "ja"
                                        ? `このチャットを削除しますか？`
                                        : country === "es"
                                          ? `¿Desea eliminar este chat?`
                                          : country === "fr"
                                            ? `Souhaitez-vous supprimer cette discussion ?`
                                            : country === "id"
                                              ? `Apakah Anda ingin menghapus obrolan ini?`
                                              : country === "zh"
                                                ? `您想删除此聊天吗？`
                                                : `Do you want to delete this chat?`,
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
                                            .delete("/chat/removeChat", {
                                              data: {
                                                ChatId: list?.id,
                                              },
                                            })
                                            .then(res => {
                                              if (res.data.status === "true") {
                                                setChatList(
                                                  chatList.filter(
                                                    (item: any) =>
                                                      item.id !== list.id,
                                                  ),
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
                                        },
                                      },
                                    ],
                                  );
                                }}>
                                <FastImage
                                  removeClippedSubviews={true}
                                  source={{
                                    uri: `${serverURL}/secure/chat/image/${list?.id}`,
                                    headers: {
                                      authorization: `Bearer ${accessToken}`,
                                      refreshToken: `Bearer ${refreshToken}`,
                                    },
                                    priority: FastImage.priority.normal,
                                  }}
                                  style={{
                                    width: vw(60),
                                    height: vw(75),
                                    borderRadius: 20,
                                  }}
                                  resizeMode={
                                    FastImage.resizeMode.cover
                                  }></FastImage>
                              </TouchableOpacity>
                              <View
                                style={{
                                  backgroundColor: "#0F0D14",
                                  marginTop: 10,
                                  borderRadius: 20,
                                  padding: 15,
                                  maxWidth: "80%",
                                }}>
                                <Text
                                  style={{
                                    color: "white",
                                  }}>
                                  {list?.content}
                                </Text>
                              </View>
                            </View>
                          ) : (
                            list?.type === CHAT_TYPE.CHAT_VIDEO && (
                              <View
                                style={{
                                  maxWidth: "70%",
                                  alignItems: "flex-end",
                                  marginLeft: 10,
                                }}>
                                <TouchableOpacity
                                  style={{
                                    borderRadius: 20,
                                    maxWidth: "100%",
                                    backgroundColor: "black",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    alignItems: "center",
                                  }}
                                  onPress={() => {
                                    setVideoId(list.id);
                                    setVideoType("chat");
                                    setVideoVisible(true);
                                  }}
                                  onLongPress={() => {
                                    Alert.alert(
                                      country === "ko"
                                        ? `해당 채팅을 삭제하시겠습니까?`
                                        : country === "ja"
                                          ? `このチャットを削除しますか？`
                                          : country === "es"
                                            ? `¿Desea eliminar este chat?`
                                            : country === "fr"
                                              ? `Souhaitez-vous supprimer cette discussion ?`
                                              : country === "id"
                                                ? `Apakah Anda ingin menghapus obrolan ini?`
                                                : country === "zh"
                                                  ? `您想删除此聊天吗？`
                                                  : `Do you want to delete this chat?`,
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
                                              .delete("/chat/removeChat", {
                                                data: {
                                                  ChatId: list?.id,
                                                },
                                              })
                                              .then(res => {
                                                if (
                                                  res.data.status === "true"
                                                ) {
                                                  setChatList(
                                                    chatList.filter(
                                                      (item: any) =>
                                                        item.id !== list.id,
                                                    ),
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
                                          },
                                        },
                                      ],
                                    );
                                  }}>
                                  <FastImage
                                    removeClippedSubviews={true}
                                    source={{
                                      uri: `${serverURL}/secure/chat/video/${list?.id}`,
                                      priority: FastImage.priority.normal,
                                      headers: {
                                        authorization: `Bearer ${accessToken}`,
                                        refreshToken: `Bearer ${refreshToken}`,
                                      },
                                    }}
                                    style={{
                                      width: vw(60),
                                      height: vw(75),
                                      borderRadius: 20,
                                    }}
                                    resizeMode={
                                      FastImage.resizeMode.cover
                                    }></FastImage>
                                  <Image
                                    source={require("../../assets/home/play.png")}
                                    style={{
                                      position: "absolute",
                                      width: vw(10),
                                      height: vw(10),
                                    }}></Image>
                                </TouchableOpacity>
                                <View
                                  style={{
                                    backgroundColor: "#0F0D14",
                                    marginTop: 10,
                                    borderRadius: 20,
                                    padding: 15,
                                    maxWidth: "80%",
                                  }}>
                                  <Text
                                    style={{
                                      color: "white",
                                    }}>
                                    {list?.content}
                                  </Text>
                                </View>
                              </View>
                            )
                          )}
                        </View>
                        {/*마지막 이고 똑같을때  */}
                        {lastReadIndex === list?.id && (
                          <Text
                            style={{
                              fontSize: 10,
                              color: "#838383",
                              marginTop: 10,
                            }}>
                            {country === "ko"
                              ? `읽음`
                              : country === "ja"
                                ? `既読`
                                : country === "es"
                                  ? `Leído`
                                  : country === "fr"
                                    ? `Lu`
                                    : country === "id"
                                      ? `Dibaca`
                                      : country === "zh"
                                        ? `已读`
                                        : `Read`}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          setGiftShow(false);
                        }}
                        key={idx}
                        style={{
                          width: "100%",
                          marginBottom: vh(2),
                          flexDirection: "row",
                          alignItems: "flex-end",
                        }}>
                        <FastImage
                          source={{
                            uri: you?.profile,
                            priority: FastImage.priority.normal,
                          }}
                          style={{
                            width: vh(4),
                            height: vh(4),
                            borderRadius: 100,
                          }}
                          resizeMode={FastImage.resizeMode.cover}></FastImage>
                        {list.type === CHAT_TYPE.CHAT_NORMAL ? (
                          <View
                            style={{
                              backgroundColor: "#F0F0F7",
                              borderRadius: 20,
                              padding: 15,
                              maxWidth: "70%",
                              marginLeft: 10,
                            }}>
                            <Text
                              style={{
                                //color: "white",
                                color: "black",
                              }}>
                              {list?.content}
                            </Text>
                          </View>
                        ) : list?.type === CHAT_TYPE.CHAT_GIFT ? (
                          <View
                            style={{
                              maxWidth: "70%",
                              marginLeft: 10,
                            }}>
                            <View
                              style={{
                                borderRadius: 20,
                                width: "100%",
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                              }}>
                              {list?.url === ITEM_LIST.ITEM_CAKE.code ? (
                                <Image
                                  source={require("../../assets/setting/store-cake.png")}
                                  style={{
                                    width: vw(30),
                                    height: vw(30),
                                  }}></Image>
                              ) : list?.url === ITEM_LIST.ITEM_CANDY.code ? (
                                <Image
                                  source={require("../../assets/setting/store-candy.png")}
                                  style={{
                                    width: vw(30),
                                    height: vw(30),
                                  }}></Image>
                              ) : list?.url === ITEM_LIST.ITEM_CROWN.code ? (
                                <Image
                                  source={require("../../assets/setting/store-crown.png")}
                                  style={{
                                    width: vw(30),
                                    height: vw(30),
                                  }}></Image>
                              ) : list?.url === ITEM_LIST.ITEM_HEART.code ? (
                                <Image
                                  source={require("../../assets/setting/store-heart.png")}
                                  style={{
                                    width: vw(30),
                                    height: vw(30),
                                  }}></Image>
                              ) : list?.url === ITEM_LIST.ITEM_RING.code ? (
                                <Image
                                  source={require("../../assets/setting/store-ring.png")}
                                  style={{
                                    width: vw(30),
                                    height: vw(30),
                                  }}></Image>
                              ) : (
                                list?.url === ITEM_LIST.ITEM_ROSE.code && (
                                  <Image
                                    source={require("../../assets/setting/store-rose.png")}
                                    style={{
                                      width: vw(30),
                                      height: vw(30),
                                    }}></Image>
                                )
                              )}
                            </View>
                            <View
                              style={{
                                backgroundColor: "#F0F0F7",
                                borderRadius: 20,
                                width: "100%",
                                padding: 15,
                              }}>
                              <Text
                                style={{
                                  color: "black",
                                }}>
                                {list?.content}
                              </Text>
                            </View>
                          </View>
                        ) : list.type === CHAT_TYPE.CHAT_IMAGE ? (
                          <View
                            style={{
                              alignItems: "flex-start",
                              maxWidth: "70%",
                              marginLeft: 10,
                            }}>
                            <TouchableOpacity
                              style={{
                                borderRadius: 20,
                                maxWidth: "100%",
                              }}
                              onPress={() => {
                                if (list?.lock) {
                                  return;
                                }
                                setImgUrl(
                                  `https://api.nmoment.live/secure/chat/image/${list?.id}`,
                                );
                                setModalText(list?.content);
                                setImgVisible(true);
                              }}>
                              {list?.lock ? (
                                <LinearGradient
                                  start={{ x: 0.2, y: 0.2 }}
                                  end={{ x: 1, y: 1 }}
                                  colors={["#272E38", "#FC4B4E"]}
                                  style={{
                                    borderRadius: 20,
                                    width: vw(60),
                                    height: vw(75),
                                    justifyContent: "center",
                                    alignContent: "center",
                                    alignItems: "center",
                                  }}>
                                  <Image
                                    source={require("../../assets/home/lockW.png")}
                                    style={{
                                      width: vw(10),
                                      height: vw(10),
                                      marginBottom: vh(2),
                                    }}></Image>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignContent: "center",
                                      alignItems: "center",
                                      borderRadius: 10,
                                      padding: 5,
                                      //width: "100%",
                                      marginBottom: vh(2),
                                    }}>
                                    <View
                                      style={{
                                        backgroundColor: "rgba(0,0,0,0.5)",

                                        borderRadius: 10,
                                        padding: 5,
                                        flexDirection: "row",
                                        alignContent: "center",
                                        alignItems: "center",
                                      }}>
                                      <Text
                                        style={{
                                          fontWeight: "bold",
                                          color: "white",
                                          fontSize: 14,
                                        }}>
                                        {Number(list?.cost).toLocaleString()}
                                      </Text>
                                      <Image
                                        source={require("../../assets/setting/point.png")}
                                        style={{
                                          backgroundColor: PALETTE.COLOR_WHITE,
                                          borderRadius: 100,
                                          width: 14,
                                          height: 14,
                                          marginLeft: 5,
                                        }}></Image>
                                    </View>
                                    {list?.type === CHAT_TYPE.CHAT_IMAGE && (
                                      <View
                                        style={{
                                          backgroundColor: "rgba(0,0,0,0.5)",
                                          marginLeft: 10,
                                          borderRadius: 10,
                                          padding: 5,
                                        }}>
                                        <Image
                                          source={require("../../assets/home/photoW.png")}
                                          style={{
                                            width: 18,
                                            height: 18,
                                          }}></Image>
                                      </View>
                                    )}

                                    {list?.adult === true &&
                                      user?.country === "ko" &&
                                      (!user?.real_birthday ||
                                        parseInt(user?.real_birthday) >
                                        Number(
                                          new Date().getFullYear() - 19,
                                        )) && (
                                        <View
                                          style={{
                                            backgroundColor: "rgba(0,0,0,0.5)",
                                            marginLeft: 10,
                                            borderRadius: 10,
                                            padding: 5,
                                          }}>
                                          <Image
                                            source={require("../../assets/home/adult.png")}
                                            style={{
                                              width: 18,
                                              height: 18,
                                            }}></Image>
                                        </View>
                                      )}
                                  </View>
                                  <View></View>
                                  <TouchableOpacity
                                    style={{
                                      backgroundColor: PALETTE.COLOR_NAVY,
                                      justifyContent: "center",
                                      alignContent: "center",
                                      alignItems: "center",
                                      padding: 10,
                                      paddingLeft: vw(6),
                                      paddingRight: vw(6),
                                      borderRadius: 50,
                                    }}
                                    onPress={() => {
                                      if (
                                        list?.adult === true &&
                                        user?.country === "ko" &&
                                        (!user?.real_birthday ||
                                          parseInt(user?.real_birthday) >
                                          Number(
                                            new Date().getFullYear() - 19,
                                          ))
                                      ) {
                                        if (!user?.real_birthday)
                                          navigation.navigate(
                                            "CertificationIn",
                                          );
                                      } else {
                                        //구매
                                        //포인트 적으면 스토어 이동
                                        if (point?.amount < list?.cost) {
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
                                                    ChatId: list?.id,
                                                  })
                                                  .then(res => {
                                                    if (
                                                      res.data.status === "true"
                                                    ) {
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
                                                      const chat =
                                                        res.data.chat;
                                                      setChatList(
                                                        chatList?.map(
                                                          (
                                                            item: any,
                                                            idx: number,
                                                          ) =>
                                                            item.id === list?.id
                                                              ? {
                                                                ...item,
                                                                lock: false,
                                                              }
                                                              : item,
                                                        ),
                                                      );
                                                      updatePoint({
                                                        ...point,
                                                        amount:
                                                          point.amount -
                                                          list?.cost,
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
                                        //purchaseChat
                                      }
                                    }}>
                                    <Text
                                      style={{
                                        color: "white",
                                      }}>
                                      {list?.adult === true &&
                                        user?.country === "ko" &&
                                        (!user?.real_birthday ||
                                          parseInt(user?.real_birthday) >
                                          Number(new Date().getFullYear() - 19))
                                        ? country === "ko"
                                          ? `성인인증`
                                          : country === "ja"
                                            ? `成人認証`
                                            : country === "es"
                                              ? `Verificación de adultos`
                                              : country === "fr"
                                                ? `Vérification des adultes`
                                                : country === "id"
                                                  ? `Verifikasi dewasa`
                                                  : country === "zh"
                                                    ? `成人验证`
                                                    : `Adult verification`
                                        : country === "ko"
                                          ? `구매하기`
                                          : country === "ja"
                                            ? `購入する`
                                            : country === "es"
                                              ? `compra`
                                              : country === "fr"
                                                ? `achat`
                                                : country === "id"
                                                  ? `pembelian`
                                                  : country === "zh"
                                                    ? `购买`
                                                    : `purchase`}
                                    </Text>
                                  </TouchableOpacity>
                                </LinearGradient>
                              ) : (
                                <FastImage
                                  removeClippedSubviews={true}
                                  source={{
                                    uri: `${serverURL}/secure/chat/image/${list?.id}`,
                                    headers: {
                                      authorization: `Bearer ${accessToken}`,
                                      refreshToken: `Bearer ${refreshToken}`,
                                    },
                                    priority: FastImage.priority.normal,
                                  }}
                                  style={{
                                    width: vw(60),
                                    height: vw(75),
                                    borderRadius: 20,
                                  }}
                                  resizeMode={
                                    FastImage.resizeMode.cover
                                  }></FastImage>
                              )}
                            </TouchableOpacity>
                            <View
                              style={{
                                backgroundColor: "#F0F0F7",
                                marginTop: 10,
                                borderRadius: 20,
                                padding: 15,
                                maxWidth: "80%",
                              }}>
                              <Text
                                style={{
                                  color: "black",
                                }}>
                                {list?.content}
                              </Text>
                            </View>
                          </View>
                        ) : (
                          list?.type === CHAT_TYPE.CHAT_VIDEO && (
                            <View
                              style={{
                                alignItems: "flex-start",
                                maxWidth: "70%",
                                marginLeft: 10,
                              }}>
                              <TouchableOpacity
                                style={{
                                  borderRadius: 20,
                                  maxWidth: "100%",
                                  marginLeft: 10,
                                  backgroundColor: "black",
                                  justifyContent: "center",
                                  alignContent: "center",
                                  alignItems: "center",
                                }}
                                onPress={() => {
                                  if (list?.lock) {
                                    return;
                                  }
                                  setVideoId(list.id);
                                  setVideoType("chat");
                                  setVideoVisible(true);
                                }}>
                                {list?.lock ? (
                                  <LinearGradient
                                    start={{ x: 0.2, y: 0.2 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={["#272E38", "#FC4B4E"]}
                                    style={{
                                      borderRadius: 20,
                                      width: vw(60),
                                      height: vw(75),
                                      justifyContent: "center",
                                      alignContent: "center",
                                      alignItems: "center",
                                    }}>
                                    <Image
                                      source={require("../../assets/home/lockW.png")}
                                      style={{
                                        width: vw(10),
                                        height: vw(10),
                                        marginBottom: vh(2),
                                      }}></Image>
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        alignContent: "center",
                                        alignItems: "center",
                                        borderRadius: 10,
                                        padding: 5,
                                        //width: "100%",
                                        marginBottom: vh(2),
                                      }}>
                                      <View
                                        style={{
                                          backgroundColor: "rgba(0,0,0,0.5)",

                                          borderRadius: 10,
                                          padding: 5,
                                          flexDirection: "row",
                                          alignContent: "center",
                                          alignItems: "center",
                                        }}>
                                        <Text
                                          style={{
                                            fontWeight: "bold",
                                            color: "white",
                                            fontSize: 14,
                                          }}>
                                          {Number(list?.cost).toLocaleString()}
                                        </Text>
                                        <Image
                                          source={require("../../assets/setting/point.png")}
                                          style={{
                                            backgroundColor:
                                              PALETTE.COLOR_WHITE,
                                            borderRadius: 100,
                                            width: 14,
                                            height: 14,
                                            marginLeft: 5,
                                          }}></Image>
                                      </View>

                                      {list?.type === CHAT_TYPE.CHAT_VIDEO && (
                                        <View
                                          style={{
                                            backgroundColor: "rgba(0,0,0,0.5)",
                                            marginLeft: 10,
                                            borderRadius: 10,
                                            padding: 5,
                                          }}>
                                          <Image
                                            source={require("../../assets/home/videoPlayW.png")}
                                            style={{
                                              width: 18,
                                              height: 18,
                                            }}></Image>
                                        </View>
                                      )}
                                      {list?.adult === true &&
                                        user?.country === "ko" &&
                                        (!user?.real_birthday ||
                                          parseInt(user?.real_birthday) >
                                          Number(
                                            new Date().getFullYear() - 19,
                                          )) && (
                                          <View
                                            style={{
                                              backgroundColor:
                                                "rgba(0,0,0,0.5)",
                                              marginLeft: 10,
                                              borderRadius: 10,
                                              padding: 5,
                                            }}>
                                            <Image
                                              source={require("../../assets/home/adult.png")}
                                              style={{
                                                width: 18,
                                                height: 18,
                                              }}></Image>
                                          </View>
                                        )}
                                    </View>
                                    <View></View>
                                    <TouchableOpacity
                                      style={{
                                        backgroundColor: PALETTE.COLOR_NAVY,
                                        justifyContent: "center",
                                        alignContent: "center",
                                        alignItems: "center",
                                        padding: 10,
                                        paddingLeft: vw(6),
                                        paddingRight: vw(6),
                                        borderRadius: 50,
                                      }}
                                      onPress={() => {
                                        if (
                                          list?.adult === true &&
                                          user?.country === "ko" &&
                                          (!user?.real_birthday ||
                                            parseInt(user?.real_birthday) >
                                            Number(
                                              new Date().getFullYear() - 19,
                                            ))
                                        ) {
                                          if (!user?.real_birthday)
                                            navigation.navigate(
                                              "CertificationIn",
                                            );
                                        } else {
                                          //구매
                                          //포인트 적으면 스토어 이동
                                          if (point?.amount < list?.cost) {
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
                                                    .post(
                                                      "/chat/purchaseChat",
                                                      {
                                                        ChatId: list?.id,
                                                      },
                                                    )
                                                    .then(res => {
                                                      if (
                                                        res.data.status ===
                                                        "true"
                                                      ) {
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
                                                        const chat =
                                                          res.data.chat;
                                                        setChatList(
                                                          chatList?.map(
                                                            (
                                                              item: any,
                                                              idx: number,
                                                            ) =>
                                                              item.id ===
                                                                list?.id
                                                                ? {
                                                                  ...item,
                                                                  lock: false,
                                                                }
                                                                : item,
                                                          ),
                                                        );
                                                        updatePoint({
                                                          ...point,
                                                          amount:
                                                            point.amount -
                                                            list?.cost,
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
                                          //purchaseChat
                                        }
                                      }}>
                                      <Text
                                        style={{
                                          color: "white",
                                        }}>
                                        {list?.adult === true &&
                                          user?.country === "ko" &&
                                          (!user?.real_birthday ||
                                            parseInt(user?.real_birthday) >
                                            Number(
                                              new Date().getFullYear() - 19,
                                            ))
                                          ? country === "ko"
                                            ? `성인인증`
                                            : country === "ja"
                                              ? `成人認証`
                                              : country === "es"
                                                ? `Verificación de adultos`
                                                : country === "fr"
                                                  ? `Vérification des adultes`
                                                  : country === "id"
                                                    ? `Verifikasi dewasa`
                                                    : country === "zh"
                                                      ? `成人验证`
                                                      : `Adult verification`
                                          : country === "ko"
                                            ? `구매하기`
                                            : country === "ja"
                                              ? `購入する`
                                              : country === "es"
                                                ? `compra`
                                                : country === "fr"
                                                  ? `achat`
                                                  : country === "id"
                                                    ? `pembelian`
                                                    : country === "zh"
                                                      ? `购买`
                                                      : `purchase`}
                                      </Text>
                                    </TouchableOpacity>
                                  </LinearGradient>
                                ) : (
                                  <>
                                    <FastImage
                                      removeClippedSubviews={true}
                                      source={{
                                        uri: `${serverURL}/secure/chat/video/${list?.id}`,
                                        priority: FastImage.priority.normal,
                                        headers: {
                                          authorization: `Bearer ${accessToken}`,
                                          refreshToken: `Bearer ${refreshToken}`,
                                        },
                                      }}
                                      style={{
                                        width: vw(60),
                                        height: vw(75),
                                        borderRadius: 20,
                                      }}
                                      resizeMode={
                                        FastImage.resizeMode.cover
                                      }></FastImage>
                                    <Image
                                      source={require("../../assets/home/play.png")}
                                      style={{
                                        position: "absolute",
                                        width: vw(10),
                                        height: vw(10),
                                      }}></Image>
                                  </>
                                )}
                              </TouchableOpacity>

                              <View
                                style={{
                                  backgroundColor: "#F0F0F7",
                                  marginTop: 10,
                                  borderRadius: 20,
                                  padding: 15,
                                  maxWidth: "80%",
                                }}>
                                <Text
                                  style={{
                                    //color: "white",
                                    color: "black",
                                  }}>
                                  {list?.content}
                                </Text>
                              </View>
                            </View>
                          )
                        )}
                        <Text
                          style={{
                            color: "#838383",
                            fontSize: 10,
                          }}>
                          {new Date(list?.createdAt).toLocaleTimeString()}
                        </Text>
                      </TouchableOpacity>
                    ),
                  )}

                  {chatList?.length > 0 &&
                    admin &&
                    user?.roles !== USER_ROLE.ADMIN_USER &&
                    user?.roles !== USER_ROLE.CS_USER && (
                      <View
                        // onPress={() => {
                        // setGiftShow(false);
                        // }}
                        style={{
                          width: "100%",
                          marginTop: vh(2),
                          alignItems: "flex-end",
                        }}>
                        {/* 환불 문의 */}
                        {user?.gender === USER_GENDER.BOY && (
                          <TouchableOpacity
                            style={{
                              width: "100%",
                              marginBottom: vh(2),
                              flexDirection: "row",
                              alignItems: "flex-end",
                            }}
                            onPress={async e => {
                              await api
                                .post("/chat/answerCs", {
                                  type: CHAT_CS_TYPE.REFUND,
                                  country,
                                  RoomId,
                                })
                                .then(res => {
                                  if (res.data.status === "true") {
                                    const chatTemp = res.data.chat;
                                    chatSocket.current.emit("updateChat", {
                                      chat: chatTemp,
                                    });
                                    connectSocket.current.emit("newChat", {
                                      YouId: you?.id,
                                      MeId: user.id,
                                      room: {
                                        ...currentRoom,
                                        Chats: [chatTemp],
                                      },
                                      admin,
                                      notShow: true,
                                    });
                                  }
                                });
                            }}>
                            <FastImage
                              source={{
                                uri: you?.profile,
                                priority: FastImage.priority.normal,
                              }}
                              style={{
                                width: vh(4),
                                height: vh(4),
                                borderRadius: 100,
                              }}
                              resizeMode={
                                FastImage.resizeMode.cover
                              }></FastImage>
                            <View
                              style={{
                                backgroundColor: "#F0F0F7",
                                borderRadius: 20,
                                padding: 15,
                                maxWidth: "70%",
                                marginLeft: 10,
                              }}>
                              <Text
                                style={{
                                  //color: "white",
                                  color: "black",
                                }}>
                                {country === "ko"
                                  ? "환불 문의"
                                  : country === "ja"
                                    ? "返金に関するお問い合わせ"
                                    : country === "es"
                                      ? "Consulta sobre reembolsos"
                                      : country === "fr"
                                        ? "Demande de remboursement"
                                        : country === "id"
                                          ? "Pertanyaan tentang pengembalian dana"
                                          : country === "zh"
                                            ? "退款咨询"
                                            : "Refund inquiry"}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                        {/* 결제오류 문의 */}
                        {user?.gender === USER_GENDER.BOY && (
                          <TouchableOpacity
                            style={{
                              width: "100%",
                              marginBottom: vh(2), // "2vh",
                              flexDirection: "row",
                              alignItems: "flex-end",
                            }}
                            onPress={async e => {
                              await api
                                .post("/chat/answerCs", {
                                  type: CHAT_CS_TYPE.PAYMENT,
                                  country,
                                  RoomId,
                                })
                                .then(res => {
                                  if (res.data.status === "true") {
                                    const chatTemp = res.data.chat;
                                    chatSocket.current.emit("updateChat", {
                                      chat: chatTemp,
                                    });
                                    connectSocket.current.emit("newChat", {
                                      YouId: you?.id,
                                      MeId: user.id,
                                      room: {
                                        ...currentRoom,
                                        Chats: [chatTemp],
                                      },
                                      admin,
                                      notShow: true,
                                    });
                                  }
                                });
                            }}>
                            <View
                              style={{
                                width: vh(4),
                                height: vh(4),
                              }}></View>
                            <View
                              style={{
                                backgroundColor: "#F0F0F7",
                                borderRadius: 20,
                                padding: 15,
                                maxWidth: "70%",
                                marginLeft: 10,
                              }}>
                              <Text
                                style={{
                                  //color: "white",
                                  color: "black",
                                }}>
                                {country === "ko"
                                  ? "결제오류 문의"
                                  : country === "ja"
                                    ? "支払いエラーのお問い合わせ"
                                    : country === "es"
                                      ? "Consulta sobre errores de pago"
                                      : country === "fr"
                                        ? "Demande concernant une erreur de paiement"
                                        : country === "id"
                                          ? "Pertanyaan tentang kesalahan pembayaran"
                                          : country === "zh"
                                            ? "支付错误咨询"
                                            : "Payment error inquiry"}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                        {/* 환전 문의 */}
                        {user?.gender === USER_GENDER.GIRL && (
                          <TouchableOpacity
                            style={{
                              width: "100%",
                              marginBottom: vh(2), //"2vh",
                              flexDirection: "row",
                              alignItems: "flex-end",
                            }}
                            onPress={async e => {
                              await api
                                .post("/chat/answerCs", {
                                  type: CHAT_CS_TYPE.EXCHANGE,
                                  country,
                                  RoomId,
                                })
                                .then(res => {
                                  if (res.data.status === "true") {
                                    const chatTemp = res.data.chat;
                                    chatSocket.current.emit("updateChat", {
                                      chat: chatTemp,
                                    });
                                    connectSocket.current.emit("newChat", {
                                      YouId: you?.id,
                                      MeId: user.id,
                                      room: {
                                        ...currentRoom,
                                        Chats: [chatTemp],
                                      },
                                      admin,
                                      notShow: true,
                                    });
                                  }
                                });
                            }}>
                            <FastImage
                              source={{
                                uri: you?.profile,
                                priority: FastImage.priority.normal,
                              }}
                              style={{
                                width: vh(4),
                                height: vh(4),
                                borderRadius: 100,
                              }}
                              resizeMode={
                                FastImage.resizeMode.cover
                              }></FastImage>
                            <View
                              style={{
                                backgroundColor: "#F0F0F7",
                                borderRadius: 20,
                                padding: 15,
                                maxWidth: "70%",
                                marginLeft: 10,
                              }}>
                              <Text
                                style={{
                                  //color: "white",
                                  color: "black",
                                }}>
                                {country === "ko"
                                  ? "환전 문의"
                                  : country === "ja"
                                    ? "両替に関するお問い合わせ"
                                    : country === "es"
                                      ? "Consulta sobre cambio de divisas"
                                      : country === "fr"
                                        ? "Demande concernant un échange de devises"
                                        : country === "id"
                                          ? "Pertanyaan tentang penukaran uang"
                                          : country === "zh"
                                            ? "兑换咨询"
                                            : "Currency exchange inquiry"}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}

                        {/* 이용방법 */}
                        {user?.gender === USER_GENDER.GIRL && (
                          <TouchableOpacity
                            style={{
                              width: "100%",
                              marginBottom: vh(2), //"2vh",
                              flexDirection: "row",
                              alignItems: "flex-end",
                            }}
                            onPress={async e => {
                              await api
                                .post("/chat/answerCs", {
                                  type: CHAT_CS_TYPE.USE,
                                  country,
                                  RoomId,
                                })
                                .then(res => {
                                  if (res.data.status === "true") {
                                    const chatTemp = res.data.chat;
                                    chatSocket.current.emit("updateChat", {
                                      chat: chatTemp,
                                    });
                                    connectSocket.current.emit("newChat", {
                                      YouId: you?.id,
                                      MeId: user.id,
                                      room: {
                                        ...currentRoom,
                                        Chats: [chatTemp],
                                      },
                                      admin,
                                      notShow: true,
                                    });
                                  }
                                });
                            }}>
                            <View
                              style={{
                                width: vh(4), // "4vh",
                                height: vh(4), // "4vh",
                              }}></View>
                            <View
                              style={{
                                backgroundColor: "#F0F0F7",
                                borderRadius: 20,
                                padding: 15,
                                maxWidth: "70%",
                                marginLeft: 10,
                              }}>
                              <Text
                                style={{
                                  //color: "white",
                                  color: "black",
                                }}>
                                {country === "ko"
                                  ? "이용 방법"
                                  : country === "ja"
                                    ? "利用方法"
                                    : country === "es"
                                      ? "Cómo utilizar"
                                      : country === "fr"
                                        ? "Comment utiliser"
                                        : country === "id"
                                          ? "Cara menggunakan"
                                          : country === "zh"
                                            ? "使用方法"
                                            : "How to use"}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}

                        {/* 오류문의 */}
                        <TouchableOpacity
                          style={{
                            width: "100%",
                            marginBottom: vh(2), //"2vh",
                            flexDirection: "row",
                            alignItems: "flex-end",
                          }}
                          onPress={async e => {
                            await api
                              .post("/chat/answerCs", {
                                type: CHAT_CS_TYPE.ERROR,
                                country,
                                RoomId,
                              })
                              .then(res => {
                                if (res.data.status === "true") {
                                  const chatTemp = res.data.chat;
                                  chatSocket.current.emit("updateChat", {
                                    chat: chatTemp,
                                  });
                                  connectSocket.current.emit("newChat", {
                                    YouId: you?.id,
                                    MeId: user.id,
                                    room: {
                                      ...currentRoom,
                                      Chats: [chatTemp],
                                    },
                                    admin,
                                    notShow: true,
                                  });
                                }
                              });
                          }}>
                          <View
                            style={{
                              width: vh(4), // "4vh",
                              height: vh(4), // "4vh",
                            }}></View>
                          <View
                            style={{
                              backgroundColor: "#F0F0F7",
                              borderRadius: 20,
                              padding: 15,
                              maxWidth: "70%",
                              marginLeft: 10,
                            }}>
                            <Text
                              style={{
                                //color: "white",
                                color: "black",
                              }}>
                              {country === "ko"
                                ? "오류 문의"
                                : country === "ja"
                                  ? "エラーに関するお問い合わせ"
                                  : country === "es"
                                    ? "Consulta de errores"
                                    : country === "fr"
                                      ? "Demande d'erreur"
                                      : country === "id"
                                        ? "Pertanyaan kesalahan"
                                        : country === "zh"
                                          ? "错误咨询"
                                          : "Error inquiry"}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}

                  {chatList.length > 0 && (
                    <View
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        marginBottom: 20,
                        flexDirection: "row",
                        paddingLeft: vw(4),
                        paddingRight: vw(4),
                      }}>
                      <Image
                        source={require("../../assets/chat/megaphone.png")}
                        style={{
                          width: 20,
                          height: 20,
                          marginRight: 10,
                        }}></Image>
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#838383",
                        }}>
                        {country === "ko"
                          ? "외부 SNS, 계좌 유도시 밴 처리 되오니 주의 바랍니다."
                          : country === "ja"
                            ? "外部SNSや口座誘導はBANの対象となりますのでご注意ください。"
                            : country === "es"
                              ? "Tenga en cuenta que inducir a SNS externos o cuentas resultará en un baneo."
                              : country === "fr"
                                ? "Soyez attentif, toute incitation à utiliser des SNS externes ou des comptes bancaires entraînera un bannissement."
                                : country === "id"
                                  ? "Hati-hati, mengarahkan ke SNS eksternal atau akun akan menyebabkan pemblokiran."
                                  : country === "zh"
                                    ? "请注意，诱导外部SNS或账户将被封禁。"
                                    : "Please be aware that directing to external SNS or accounts will result in a ban."}
                      </Text>
                    </View>
                  )}
                </ScrollView>
              )}

              {chatList?.length === 0 && (
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                    flexDirection: "row",
                    width: vw(100),
                    paddingLeft: vw(8),
                    paddingRight: vw(8),
                  }}>
                  <Image
                    source={require("../../assets/chat/megaphone.png")}
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 10,
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#838383",
                    }}>
                    {country === "ko"
                      ? "외부 SNS, 계좌 유도시 밴 처리 되오니 주의 바랍니다."
                      : country === "ja"
                        ? "外部SNSや口座誘導はBANの対象となりますのでご注意ください。"
                        : country === "es"
                          ? "Tenga en cuenta que inducir a SNS externos o cuentas resultará en un baneo."
                          : country === "fr"
                            ? "Soyez attentif, toute incitation à utiliser des SNS externes ou des comptes bancaires entraînera un bannissement."
                            : country === "id"
                              ? "Hati-hati, mengarahkan ke SNS eksternal atau akun akan menyebabkan pemblokiran."
                              : country === "zh"
                                ? "请注意，诱导外部SNS或账户将被封禁。"
                                : "Please be aware that directing to external SNS or accounts will result in a ban."}
                  </Text>
                </View>
              )}
              {chatList?.length === 0 &&
                admin &&
                user?.roles !== USER_ROLE.ADMIN_USER &&
                user?.roles !== USER_ROLE.CS_USER && (
                  <View
                    // onPress={() => {
                    // setGiftShow(false);
                    // }}
                    style={{
                      marginLeft: vw(4),
                      width: "100%",
                      marginTop: vh(2),
                      alignItems: "flex-end",
                    }}>
                    {/* 환불 문의 */}
                    {user?.gender === USER_GENDER.BOY && (
                      <TouchableOpacity
                        style={{
                          width: "100%",
                          marginBottom: vh(2),
                          flexDirection: "row",
                          alignItems: "flex-end",
                        }}
                        onPress={async e => {
                          await api
                            .post("/chat/answerCs", {
                              type: CHAT_CS_TYPE.REFUND,
                              country,
                              RoomId,
                            })
                            .then(res => {
                              if (res.data.status === "true") {
                                const chatTemp = res.data.chat;
                                chatSocket.current.emit("updateChat", {
                                  chat: chatTemp,
                                });
                                connectSocket.current.emit("newChat", {
                                  YouId: you?.id,
                                  MeId: user.id,
                                  room: {
                                    ...currentRoom,
                                    Chats: [chatTemp],
                                  },
                                  admin,
                                  notShow: true,
                                });
                              }
                            });
                        }}>
                        <FastImage
                          source={{
                            uri: you?.profile,
                            priority: FastImage.priority.normal,
                          }}
                          style={{
                            width: vh(4),
                            height: vh(4),
                            borderRadius: 100,
                          }}
                          resizeMode={FastImage.resizeMode.cover}></FastImage>
                        <View
                          style={{
                            backgroundColor: "#F0F0F7",
                            borderRadius: 20,
                            padding: 15,
                            maxWidth: "70%",
                            marginLeft: 10,
                          }}>
                          <Text
                            style={{
                              //color: "white",
                              color: "black",
                            }}>
                            {country === "ko"
                              ? "환불 문의"
                              : country === "ja"
                                ? "返金に関するお問い合わせ"
                                : country === "es"
                                  ? "Consulta sobre reembolsos"
                                  : country === "fr"
                                    ? "Demande de remboursement"
                                    : country === "id"
                                      ? "Pertanyaan tentang pengembalian dana"
                                      : country === "zh"
                                        ? "退款咨询"
                                        : "Refund inquiry"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    {/* 결제오류 문의 */}
                    {user?.gender === USER_GENDER.BOY && (
                      <TouchableOpacity
                        style={{
                          width: "100%",
                          marginBottom: vh(2), // "2vh",
                          flexDirection: "row",
                          alignItems: "flex-end",
                        }}
                        onPress={async e => {
                          await api
                            .post("/chat/answerCs", {
                              type: CHAT_CS_TYPE.PAYMENT,
                              country,
                              RoomId,
                            })
                            .then(res => {
                              if (res.data.status === "true") {
                                const chatTemp = res.data.chat;
                                chatSocket.current.emit("updateChat", {
                                  chat: chatTemp,
                                });
                                connectSocket.current.emit("newChat", {
                                  YouId: you?.id,
                                  MeId: user.id,
                                  room: {
                                    ...currentRoom,
                                    Chats: [chatTemp],
                                  },
                                  admin,
                                  notShow: true,
                                });
                              }
                            });
                        }}>
                        <View
                          style={{
                            width: vh(4),
                            height: vh(4),
                          }}></View>
                        <View
                          style={{
                            backgroundColor: "#F0F0F7",
                            borderRadius: 20,
                            padding: 15,
                            maxWidth: "70%",
                            marginLeft: 10,
                          }}>
                          <Text
                            style={{
                              //color: "white",
                              color: "black",
                            }}>
                            {country === "ko"
                              ? "결제오류 문의"
                              : country === "ja"
                                ? "支払いエラーのお問い合わせ"
                                : country === "es"
                                  ? "Consulta sobre errores de pago"
                                  : country === "fr"
                                    ? "Demande concernant une erreur de paiement"
                                    : country === "id"
                                      ? "Pertanyaan tentang kesalahan pembayaran"
                                      : country === "zh"
                                        ? "支付错误咨询"
                                        : "Payment error inquiry"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    {/* 환전 문의 */}
                    {user?.gender === USER_GENDER.GIRL && (
                      <TouchableOpacity
                        style={{
                          width: "100%",
                          marginBottom: vh(2), //"2vh",
                          flexDirection: "row",
                          alignItems: "flex-end",
                        }}
                        onPress={async e => {
                          await api
                            .post("/chat/answerCs", {
                              type: CHAT_CS_TYPE.EXCHANGE,
                              country,
                              RoomId,
                            })
                            .then(res => {
                              if (res.data.status === "true") {
                                const chatTemp = res.data.chat;
                                chatSocket.current.emit("updateChat", {
                                  chat: chatTemp,
                                });
                                connectSocket.current.emit("newChat", {
                                  YouId: you?.id,
                                  MeId: user.id,
                                  room: {
                                    ...currentRoom,
                                    Chats: [chatTemp],
                                  },
                                  admin,
                                  notShow: true,
                                });
                              }
                            });
                        }}>
                        <FastImage
                          source={{
                            uri: you?.profile,
                            priority: FastImage.priority.normal,
                          }}
                          style={{
                            width: vh(4),
                            height: vh(4),
                            borderRadius: 100,
                          }}
                          resizeMode={FastImage.resizeMode.cover}></FastImage>
                        <View
                          style={{
                            backgroundColor: "#F0F0F7",
                            borderRadius: 20,
                            padding: 15,
                            maxWidth: "70%",
                            marginLeft: 10,
                          }}>
                          <Text
                            style={{
                              //color: "white",
                              color: "black",
                            }}>
                            {country === "ko"
                              ? "환전 문의"
                              : country === "ja"
                                ? "両替に関するお問い合わせ"
                                : country === "es"
                                  ? "Consulta sobre cambio de divisas"
                                  : country === "fr"
                                    ? "Demande concernant un échange de devises"
                                    : country === "id"
                                      ? "Pertanyaan tentang penukaran uang"
                                      : country === "zh"
                                        ? "兑换咨询"
                                        : "Currency exchange inquiry"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    {/* 이용방법 */}
                    {user?.gender === USER_GENDER.GIRL && (
                      <TouchableOpacity
                        style={{
                          width: "100%",
                          marginBottom: vh(2), //"2vh",
                          flexDirection: "row",
                          alignItems: "flex-end",
                        }}
                        onPress={async e => {
                          await api
                            .post("/chat/answerCs", {
                              type: CHAT_CS_TYPE.USE,
                              country,
                              RoomId,
                            })
                            .then(res => {
                              if (res.data.status === "true") {
                                const chatTemp = res.data.chat;
                                chatSocket.current.emit("updateChat", {
                                  chat: chatTemp,
                                });
                                connectSocket.current.emit("newChat", {
                                  YouId: you?.id,
                                  MeId: user.id,
                                  room: {
                                    ...currentRoom,
                                    Chats: [chatTemp],
                                  },
                                  admin,
                                  notShow: true,
                                });
                              }
                            });
                        }}>
                        <View
                          style={{
                            width: vh(4), // "4vh",
                            height: vh(4), // "4vh",
                          }}></View>
                        <View
                          style={{
                            backgroundColor: "#F0F0F7",
                            borderRadius: 20,
                            padding: 15,
                            maxWidth: "70%",
                            marginLeft: 10,
                          }}>
                          <Text
                            style={{
                              //color: "white",
                              color: "black",
                            }}>
                            {country === "ko"
                              ? "이용 방법"
                              : country === "ja"
                                ? "利用方法"
                                : country === "es"
                                  ? "Cómo utilizar"
                                  : country === "fr"
                                    ? "Comment utiliser"
                                    : country === "id"
                                      ? "Cara menggunakan"
                                      : country === "zh"
                                        ? "使用方法"
                                        : "How to use"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    {/* 오류문의 */}
                    <TouchableOpacity
                      style={{
                        width: "100%",
                        marginBottom: vh(2), //"2vh",
                        flexDirection: "row",
                        alignItems: "flex-end",
                      }}
                      onPress={async e => {
                        await api
                          .post("/chat/answerCs", {
                            type: CHAT_CS_TYPE.ERROR,
                            country,
                            RoomId,
                          })
                          .then(res => {
                            if (res.data.status === "true") {
                              const chatTemp = res.data.chat;
                              chatSocket.current.emit("updateChat", {
                                chat: chatTemp,
                              });
                              connectSocket.current.emit("newChat", {
                                YouId: you?.id,
                                MeId: user.id,
                                room: {
                                  ...currentRoom,
                                  Chats: [chatTemp],
                                },
                                admin,
                                notShow: true,
                              });
                            }
                          });
                      }}>
                      <View
                        style={{
                          width: vh(4), // "4vh",
                          height: vh(4), // "4vh",
                        }}></View>
                      <View
                        style={{
                          backgroundColor: "#F0F0F7",
                          borderRadius: 20,
                          padding: 15,
                          maxWidth: "70%",
                          marginLeft: 10,
                        }}>
                        <Text
                          style={{
                            //color: "white",
                            color: "black",
                          }}>
                          {country === "ko"
                            ? "오류 문의"
                            : country === "ja"
                              ? "エラーに関するお問い合わせ"
                              : country === "es"
                                ? "Consulta de errores"
                                : country === "fr"
                                  ? "Demande d'erreur"
                                  : country === "id"
                                    ? "Pertanyaan kesalahan"
                                    : country === "zh"
                                      ? "错误咨询"
                                      : "Error inquiry"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
            </View>

            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                width: "100%",
                height: vh(6),
                backgroundColor: "white",
                justifyContent: "space-between",
                paddingLeft: vw(4),
                paddingRight: vw(4),
              }}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  //position: "absolute",
                  zIndex: 10,
                  left: gitShow === true ? 10 : 0,
                }}
                onPress={() => {
                  setGiftShow(!gitShow);
                }}>
                {gitShow === true && (
                  <View
                    style={{
                      transform: [{ translateY: -10 }, { translateX: 10 }],
                      position: "absolute",
                      //height: vh(70),
                      backgroundColor: "rgba(0,0,0,0.5)",
                      bottom: -10,
                      width: vw(20),
                      borderRadius: 20,
                      padding: 5,
                      paddingTop: 10,
                      justifyContent: "space-between",
                      paddingBottom: vh(6),
                    }}>
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        marginBottom: vh(1),
                      }}
                      onPress={async () => {
                        setGiftShow(false);
                        setVisible(true);
                        setSelectCode(ITEM_LIST.ITEM_CANDY.code);
                        setSelectCount(item?.candy_count);
                      }}>
                      <Image
                        source={require("../../assets/setting/store-candy.png")}
                        style={{
                          width: vh(4),
                          height: vh(4),
                        }}></Image>
                      <Text
                        style={{
                          marginTop: 5,
                          color: "white",
                          fontSize: 10,
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
                      <Text
                        style={{
                          color: "white",
                          fontSize: 12,
                        }}>
                        x{item?.candy_count}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        marginBottom: vh(1),
                      }}
                      onPress={async () => {
                        setGiftShow(false);
                        setVisible(true);
                        setSelectCode(ITEM_LIST.ITEM_ROSE.code);
                        setSelectCount(item?.rose_count);
                      }}>
                      <Image
                        source={require("../../assets/setting/store-rose.png")}
                        style={{
                          width: vh(4),
                          height: vh(4),
                        }}></Image>
                      <Text
                        style={{
                          marginTop: 5,
                          color: "white",
                          fontSize: 10,
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
                      <Text
                        style={{
                          color: "white",
                          fontSize: 12,
                        }}>
                        x{item?.rose_count}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        marginBottom: vh(1),
                      }}
                      onPress={async () => {
                        setGiftShow(false);
                        setVisible(true);
                        setSelectCode(ITEM_LIST.ITEM_CAKE.code);
                        setSelectCount(item?.cake_count);
                      }}>
                      <Image
                        source={require("../../assets/setting/store-cake.png")}
                        style={{
                          width: vh(4),
                          height: vh(4),
                        }}></Image>
                      <Text
                        style={{
                          marginTop: 5,
                          color: "white",
                          fontSize: 10,
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
                      <Text
                        style={{
                          color: "white",
                          fontSize: 12,
                        }}>
                        x{item?.cake_count}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        marginBottom: vh(1),
                      }}
                      onPress={async () => {
                        setGiftShow(false);
                        setVisible(true);
                        setSelectCode(ITEM_LIST.ITEM_RING.code);
                        setSelectCount(item?.ring_count);
                      }}>
                      <Image
                        source={require("../../assets/setting/store-ring.png")}
                        style={{
                          width: vh(4),
                          height: vh(4),
                        }}></Image>
                      <Text
                        style={{
                          marginTop: 5,
                          color: "white",
                          fontSize: 10,
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
                      <Text
                        style={{
                          color: "white",
                          fontSize: 12,
                        }}>
                        x{item?.ring_count}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        marginBottom: vh(1),
                      }}
                      onPress={async () => {
                        setGiftShow(false);
                        setVisible(true);
                        setSelectCode(ITEM_LIST.ITEM_CROWN.code);
                        setSelectCount(item?.crown_count);
                      }}>
                      <Image
                        source={require("../../assets/setting/store-crown.png")}
                        style={{
                          width: vh(4),
                          height: vh(4),
                        }}></Image>
                      <Text
                        style={{
                          marginTop: 5,
                          color: "white",
                          fontSize: 10,
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
                      <Text
                        style={{
                          color: "white",
                          fontSize: 12,
                        }}>
                        x{item?.crown_count}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        marginBottom: vh(1),
                      }}
                      onPress={async () => {
                        setGiftShow(false);
                        setVisible(true);
                        setSelectCode(ITEM_LIST.ITEM_HEART.code);
                        setSelectCount(item?.heart_count);
                      }}>
                      <Image
                        source={require("../../assets/setting/store-heart.png")}
                        style={{
                          width: vh(4),
                          height: vh(4),
                        }}></Image>
                      <Text
                        style={{
                          marginTop: 5,
                          color: "white",
                          fontSize: 10,
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
                      <Text
                        style={{
                          color: "white",
                          fontSize: 12,
                        }}>
                        x{item?.heart_count}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <Image
                  source={
                    gitShow === true
                      ? require("../../assets/chat/gift.png")
                      : require("../../assets/chat/gift_small.png")
                  }
                  style={
                    gitShow === true
                      ? {
                        transform: [{ translateY: -10 }, { translateX: 10 }],
                        width: vh(4),
                        height: vh(4),
                      }
                      : {
                        width: vh(4),
                        height: vh(4),
                        borderColor: "#EFEFEF",
                        borderWidth: 1,
                        borderRadius: 8,
                      }
                  }
                />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: "#F0F0F7",
                  borderRadius: 30,
                  height: "90%",
                  paddingLeft: 10,
                  paddingRight: 10,
                  flex: 1,
                  marginLeft: 10,
                  marginRight: 10,
                  justifyContent: "space-between",
                }}>
                <TextInput
                  textAlignVertical="center"
                  value={content}
                  multiline={true}
                  placeholderTextColor="#8D8D8D"
                  style={{
                    color: "black",
                    flex: 1,
                  }}
                  onFocus={() => {
                    setGiftShow(false);
                  }}
                  onChangeText={e => {
                    setContent(e);
                  }}
                  placeholder={
                    currentRoom?.firstCost === true ||
                      user?.gender === USER_GENDER.GIRL ||
                      admin
                      ? country === "ko"
                        ? `메시지를 입력하세요.`
                        : country === "ja"
                          ? `メッセージを入力してください。`
                          : country === "es"
                            ? `Por favor, ingrese un mensaje.`
                            : country === "fr"
                              ? `Veuillez entrer un message.`
                              : country === "id"
                                ? `Silakan masukkan pesan.`
                                : country === "zh"
                                  ? `请输入消息。`
                                  : `Please enter a message.`
                      : country === "ko"
                        ? `첫 채팅에는 50P 가 소모됩니다.`
                        : country === "ja"
                          ? `最初のチャットには50Pが消費されます。`
                          : country === "es"
                            ? `La primera conversación costará 50P.`
                            : country === "fr"
                              ? `Les 50 points seront déduits lors de la première discussion.`
                              : country === "id"
                                ? `Pertama kali chatting akan memotong 50P.`
                                : country === "zh"
                                  ? `第一次聊天将消耗50P。`
                                  : `The first chat will cost 50P.`
                  }
                />
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {user?.gender === USER_GENDER.GIRL && (
                    <TouchableOpacity
                      style={{ marginRight: 10 }}
                      onPress={async () => {
                        setGiftShow(false);
                        if (admin) return;

                        if (user?.gender === USER_GENDER.GIRL) {
                          setChatModalState(true);
                          return;
                        }
                        const result = await launchImageLibrary({
                          mediaType: "mixed",
                          maxHeight: 800,
                          videoQuality: "medium",
                          quality: 0.6,
                        });
                        if (result.didCancel === true) return;
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
                        }
                        setLoadingState(true);
                        const formData = new FormData();
                        formData.append("file", {
                          uri: result.assets[0].uri,
                          name: result.assets[0].uri,
                          type: result.assets[0].type,
                        });
                        let profileURL = null;
                        let thumbnail = null;
                        if (typeResult === "video") {
                          const formDataThumbnail = new FormData();
                          createThumbnail({
                            url: result.assets[0].uri,
                            timeStamp: 0,
                          }).then(async res => {
                            formDataThumbnail.append("file", {
                              uri: res.path,
                              name: res.path,
                              type: res.mime,
                            });
                            await api
                              .post(
                                `/etc/addImgSecureImage/auth`,
                                formDataThumbnail,
                                {
                                  headers: {
                                    "Content-Type": "multipart/form-data",
                                  },
                                },
                              )
                              .then(async res => {
                                thumbnail = res.data.url;
                              });
                            await api
                              .post(`/etc/addImgSecureImage/auth`, formData, {
                                headers: {
                                  "Content-Type": "multipart/form-data",
                                },
                              })
                              .then(async res => {
                                profileURL = res.data.url;
                              });

                            await api
                              .post("/chat/createChat", {
                                type:
                                  typeResult === "video"
                                    ? CHAT_TYPE.CHAT_VIDEO
                                    : CHAT_TYPE.CHAT_IMAGE,
                                RoomId,
                                content:
                                  typeResult === "video" ? "동영상" : "사진",
                                url: profileURL,
                                thumbnail,
                              })
                              .then(res => {
                                if (res.data.status === "short") {
                                  Alert.alert(
                                    country === "ko"
                                      ? `첫 채팅에는 50P가 소모됩니다.`
                                      : country === "ja"
                                        ? `最初のチャットには50Pが必요です。`
                                        : country === "es"
                                          ? `El primer chat costará 50P.`
                                          : country === "fr"
                                            ? `Les 50P seront déduits lors du premier chat.`
                                            : country === "id"
                                              ? `Pertama kali chatting akan menghabiskan 50P.`
                                              : country === "zh"
                                                ? `第一次聊天将消耗50P。`
                                                : `The first chat will cost 50P.`,
                                  );
                                } else if (res.data.status === "gender") {
                                  Alert.alert(
                                    country === "ko"
                                      ? "채팅은 다른 성별끼리만 진행할 수 있습니다."
                                      : country === "ja"
                                        ? "チャットは異なる性別同士でのみ行えます。"
                                        : country === "es"
                                          ? "El chat solo puede realizarse entre géneros diferentes."
                                          : country === "fr"
                                            ? "Le chat ne peut se faire qu'entre genres différents."
                                            : country === "id"
                                              ? "Obrolan hanya dapat dilakukan antara jenis kelamin yang berbeda."
                                              : country === "zh"
                                                ? "聊天只能在不同性别之间进行。"
                                                : "Chatting is only allowed between different genders.",
                                  );
                                } else if (res.data.status === "true") {
                                  setCurrentRoom({
                                    ...currentRoom,
                                    firstCost: true,
                                  });
                                  const chatTemp = res.data.chat;
                                  setChatList((prevChat) => [
                                    chatTemp,
                                    ...prevChat,
                                  ]);
                                  chatSocket.current.emit("updateChat", {
                                    chat: chatTemp,
                                  });
                                  connectSocket.current.emit("newChat", {
                                    YouId: you?.id,
                                    MeId: user.id,
                                    room: {
                                      ...currentRoom,
                                      Chats: [chatTemp],
                                    },
                                    admin,
                                  });
                                } else if (res.data.status === "ban") {
                                  Alert.alert(
                                    country === "ko"
                                      ? `차단된 방입니다.`
                                      : country === "ja"
                                        ? `ブロックされた部屋です。`
                                        : country === "es"
                                          ? `Esta es una habitación bloqueada.`
                                          : country === "fr"
                                            ? `C'est une pièce bloquée.`
                                            : country === "id"
                                              ? `Ini adalah ruangan yang diblokir.`
                                              : country === "zh"
                                                ? `这是一个被封锁的房间。`
                                                : `This is a blocked room.`,
                                    country === "ko"
                                      ? `차단 해제후 채팅 가능합니다.`
                                      : country === "ja"
                                        ? `ブロック解除後チャット可能です。`
                                        : country === "es"
                                          ? `Puedes chatear después de desbloquear.`
                                          : country === "fr"
                                            ? `Vous pouvez discuter après le déblocage.`
                                            : country === "id"
                                              ? `Anda dapat mengobrol setelah membuka blokir.`
                                              : country === "zh"
                                                ? `解封后就可以聊天了。`
                                                : `You can chat after unblocking.`,
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
                          });
                        } else if (typeResult === "image") {
                          await api
                            .post(`/etc/addImgSecureImage/auth`, formData, {
                              headers: { "Content-Type": "multipart/form-data" },
                            })
                            .then(async res => {
                              profileURL = res.data.url;
                            });
                          await api
                            .post("/chat/createChat", {
                              type:
                                typeResult === "video"
                                  ? CHAT_TYPE.CHAT_VIDEO
                                  : CHAT_TYPE.CHAT_IMAGE,
                              RoomId,
                              content: typeResult === "video" ? "동영상" : "사진",
                              url: profileURL,
                            })
                            .then(res => {
                              if (res.data.status === "short") {
                                Alert.alert(
                                  country === "ko"
                                    ? `첫 채팅에는 50P가 소모됩니다.`
                                    : country === "ja"
                                      ? `最初のチャットには50Pが必요です。`
                                      : country === "es"
                                        ? `El primer chat costará 50P.`
                                        : country === "fr"
                                          ? `Les 50P seront déduits lors du premier chat.`
                                          : country === "id"
                                            ? `Pertama kali chatting akan menghabiskan 50P.`
                                            : country === "zh"
                                              ? `第一次聊天将消耗50P。`
                                              : `The first chat will cost 50P.`,
                                );
                              } else if (res.data.status === "gender") {
                                Alert.alert(
                                  country === "ko"
                                    ? "채팅은 다른 성별끼리만 진행할 수 있습니다."
                                    : country === "ja"
                                      ? "チャットは異なる性別同士でのみ行えます。"
                                      : country === "es"
                                        ? "El chat solo puede realizarse entre géneros diferentes."
                                        : country === "fr"
                                          ? "Le chat ne peut se faire qu'entre genres différents."
                                          : country === "id"
                                            ? "Obrolan hanya dapat dilakukan antara jenis kelamin yang berbeda."
                                            : country === "zh"
                                              ? "聊天只能在不同性别之间进行。"
                                              : "Chatting is only allowed between different genders.",
                                );
                              } else if (res.data.status === "true") {
                                setCurrentRoom({
                                  ...currentRoom,
                                  firstCost: true,
                                });
                                const chatTemp = res.data.chat;
                                setChatList((prevChat) => [
                                  chatTemp,
                                  ...prevChat,
                                ]);
                                chatSocket.current.emit("updateChat", {
                                  chat: chatTemp,
                                });
                                connectSocket.current.emit("newChat", {
                                  YouId: you?.id,
                                  MeId: user.id,
                                  room: {
                                    ...currentRoom,
                                    Chats: [chatTemp],
                                  },
                                  admin,
                                });
                              } else if (res.data.status === "ban") {
                                Alert.alert(
                                  country === "ko"
                                    ? `차단된 방입니다.`
                                    : country === "ja"
                                      ? `ブロックされた部屋です。`
                                      : country === "es"
                                        ? `Esta es una habitación bloqueada.`
                                        : country === "fr"
                                          ? `C'est une pièce bloquée.`
                                          : country === "id"
                                            ? `Ini adalah ruangan yang diblokir.`
                                            : country === "zh"
                                              ? `这是一个被封锁的房间。`
                                              : `This is a blocked room.`,
                                  country === "ko"
                                    ? `차단 해제후 채팅 가능합니다.`
                                    : country === "ja"
                                      ? `ブロック解除後チャット可能です。`
                                      : country === "es"
                                        ? `Puedes chatear después de desbloquear.`
                                        : country === "fr"
                                          ? `Vous pouvez discuter après le déblocage.`
                                          : country === "id"
                                            ? `Anda dapat mengobrol setelah membuka blokir.`
                                            : country === "zh"
                                              ? `解封后就可以聊天了。`
                                              : `You can chat after unblocking.`,
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
                        }

                        setLoadingState(false);
                      }}>
                      <Image
                        source={require("../../assets/chat/camera.png")}
                        style={{
                          width: 25,
                          height: 25,
                        }}></Image>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={async () => {
                      setGiftShow(false);
                      if (content === "" || content === null) return;
                      setContent("");

                      if (isLoadingRef.current) return;
                      isLoadingRef.current = true;

                      await api
                        .post("/chat/createChat", {
                          type: CHAT_TYPE.CHAT_NORMAL,
                          RoomId,
                          content,
                          admin,
                        })
                        .then(res => {
                          if (res.data.status === "short") {
                            Alert.alert(
                              country === "ko"
                                ? `첫 채팅에는 50P가 소모됩니다.`
                                : country === "ja"
                                  ? `最初のチャットには50Pが必要です。`
                                  : country === "es"
                                    ? `El primer chat costará 50P.`
                                    : country === "fr"
                                      ? `Les 50P seront déduits lors du premier chat.`
                                      : country === "id"
                                        ? `Pertama kali chatting akan menghabiskan 50P.`
                                        : country === "zh"
                                          ? `第一次聊天将消耗50P。`
                                          : `The first chat will cost 50P.`,
                            );
                            isLoadingRef.current = false;
                          } else if (res.data.status === "gender") {
                            Alert.alert(
                              country === "ko"
                                ? "채팅은 다른 성별끼리만 진행할 수 있습니다."
                                : country === "ja"
                                  ? "チャットは異なる性別同士でのみ行えます。"
                                  : country === "es"
                                    ? "El chat solo puede realizarse entre géneros diferentes."
                                    : country === "fr"
                                      ? "Le chat ne peut se faire qu'entre genres différents."
                                      : country === "id"
                                        ? "Obrolan hanya dapat dilakukan antara jenis kelamin yang berbeda."
                                        : country === "zh"
                                          ? "聊天只能在不同性别之间进行。"
                                          : "Chatting is only allowed between different genders.",
                            );
                            isLoadingRef.current = false;
                          } else if (res.data.status === "true") {
                            setCurrentRoom({
                              ...currentRoom,
                              firstCost: true,
                            });
                            const chatTemp = res.data.chat;
                            setChatList((prevChat) => [chatTemp, ...prevChat]);
                            chatSocket.current.emit("updateChat", {
                              chat: chatTemp,
                            });
                            connectSocket.current.emit("newChat", {
                              YouId: you?.id,
                              MeId: user.id,
                              room: {
                                ...currentRoom,
                                Chats: [chatTemp],
                              },
                              admin,
                            });
                            isLoadingRef.current = false;
                          } else if (res.data.status === "ban") {
                            Alert.alert(
                              country === "ko"
                                ? `차단된 방입니다.`
                                : country === "ja"
                                  ? `ブロックされた部屋です。`
                                  : country === "es"
                                    ? `Esta es una habitación bloqueada.`
                                    : country === "fr"
                                      ? `C'est une pièce bloquée.`
                                      : country === "id"
                                        ? `Ini adalah ruangan yang diblokir.`
                                        : country === "zh"
                                          ? `这是一个被封锁的房间。`
                                          : `This is a blocked room.`,
                              country === "ko"
                                ? `차단 해제후 채팅 가능합니다.`
                                : country === "ja"
                                  ? `ブロック解除後チャット可能です。`
                                  : country === "es"
                                    ? `Puedes chatear después de desbloquear.`
                                    : country === "fr"
                                      ? `Vous pouvez discuter après le déblocage.`
                                      : country === "id"
                                        ? `Anda dapat mengobrol setelah membuka blokir.`
                                        : country === "zh"
                                          ? `解封后就可以聊天了。`
                                          : `You can chat after unblocking.`,
                            );
                            isLoadingRef.current = false;
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
                            isLoadingRef.current = false;
                          }
                        });
                      isLoadingRef.current = false;
                    }}>
                    <Image
                      source={require("../../assets/chat/chat.png")}
                      style={{
                        width: 35,
                        height: 35,
                      }}></Image>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={async () => {
                  setGiftShow(false);
                  if (content === "" || content === null) return;
                  setContent("");

                  if (isLoadingRef.current) return;
                  isLoadingRef.current = true;

                  await api
                    .post("/chat/createChat", {
                      type: CHAT_TYPE.CHAT_NORMAL,
                      RoomId,
                      content,
                      admin,
                    })
                    .then(res => {
                      if (res.data.status === "short") {
                        Alert.alert(
                          country === "ko"
                            ? `첫 채팅에는 50P가 소모됩니다.`
                            : country === "ja"
                              ? `最初のチャットには50Pが必要です。`
                              : country === "es"
                                ? `El primer chat costará 50P.`
                                : country === "fr"
                                  ? `Les 50P seront déduits lors du premier chat.`
                                  : country === "id"
                                    ? `Pertama kali chatting akan menghabiskan 50P.`
                                    : country === "zh"
                                      ? `第一次聊天将消耗50P。`
                                      : `The first chat will cost 50P.`,
                        );
                        isLoadingRef.current = false;
                      } else if (res.data.status === "gender") {
                        Alert.alert(
                          country === "ko"
                            ? "채팅은 다른 성별끼리만 진행할 수 있습니다."
                            : country === "ja"
                              ? "チャットは異なる性別同士でのみ行えます。"
                              : country === "es"
                                ? "El chat solo puede realizarse entre géneros diferentes."
                                : country === "fr"
                                  ? "Le chat ne peut se faire qu'entre genres différents."
                                  : country === "id"
                                    ? "Obrolan hanya dapat dilakukan antara jenis kelamin yang berbeda."
                                    : country === "zh"
                                      ? "聊天只能在不同性别之间进行。"
                                      : "Chatting is only allowed between different genders.",
                        );
                        isLoadingRef.current = false;
                      } else if (res.data.status === "true") {
                        setCurrentRoom({
                          ...currentRoom,
                          firstCost: true,
                        });
                        const chatTemp = res.data.chat;
                        setChatList((prevChat: any) => [chatTemp, ...prevChat]);
                        chatSocket.current.emit("updateChat", {
                          chat: chatTemp,
                        });
                        connectSocket.current.emit("newChat", {
                          YouId: you?.id,
                          MeId: user.id,
                          room: {
                            ...currentRoom,
                            Chats: [chatTemp],
                          },
                          admin,
                        });
                        isLoadingRef.current = false;
                        //scroll?.current?.scrollToEnd();
                      } else if (res.data.status === "ban") {
                        Alert.alert(
                          country === "ko"
                            ? `차단된 방입니다.`
                            : country === "ja"
                              ? `ブロックされた部屋です。`
                              : country === "es"
                                ? `Esta es una habitación bloqueada.`
                                : country === "fr"
                                  ? `C'est une pièce bloquée.`
                                  : country === "id"
                                    ? `Ini adalah ruangan yang diblokir.`
                                    : country === "zh"
                                      ? `这是一个被封锁的房间。`
                                      : `This is a blocked room.`,
                          country === "ko"
                            ? `차단 해제후 채팅 가능합니다.`
                            : country === "ja"
                              ? `ブロック解除後チャット可能です。`
                              : country === "es"
                                ? `Puedes chatear después de desbloquear.`
                                : country === "fr"
                                  ? `Vous pouvez discuter après le déblocage.`
                                  : country === "id"
                                    ? `Anda dapat mengobrol setelah membuka blokir.`
                                    : country === "zh"
                                      ? `解封后就可以聊天了。`
                                      : `You can chat after unblocking.`,
                        );
                        isLoadingRef.current = false;
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
                        isLoadingRef.current = false;
                      }
                    });
                  isLoadingRef.current = false;
                }}>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </NotchView>
  );
}
