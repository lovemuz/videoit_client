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
import {Dropdown} from "react-native-element-dropdown";
import {DECLARATION_TYPE} from "../../lib/constant/declaration-constant";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Modal from "react-native-modal";
import {ToastComponent} from "../reusable/useToast";
import ImageModal from "../reusable/imageModal";
import VideoModal from "../reusable/videoModal";
import {POST_TYPE} from "../../lib/constant/post-constant";
import {useIsFocused} from "@react-navigation/native";
import EncryptedStorage from "react-native-encrypted-storage";

export default function Comment({
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
  const PostId: number = route.params.PostId;
  const [content, setContent] = useState("");

  const [postOne, setPostOne]: any = useState(null);
  const [loading, setLoading]: any = useState(false);

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
        await api
          .get("/post/postDetail", {
            params: {
              PostId,
            },
          })
          .then(res => {
            setPostOne(res.data.post);
          });
      } catch (err) {}
    }
    fetchData();
  }, []);

  const insets = useSafeAreaInsets();
  const [selectUrl, setSelectUrl]: any = useState(null);
  const [selectType, setSelectType] = useState("photo"); // photo or video
  const [modalContent, setModalContent] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseType, setPurchaseType]: any = useState("membership"); //point , membership
  const [purchaseOneSelect, setPurchaseOneSelect]: any = useState(null);

  const [modalText, setModalText]: any = useState(null);
  const [modalState, setModalState]: any = useState(false);
  const [imgUrl, setImgUrl]: any = useState(null);
  const [imgVisible, setImgVisible] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [videoId, setVideoId]: any = useState(null);
  const [videoType, setVideoType]: any = useState(null);

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

      <Modal
        animationIn="slideInUp"
        animationOut={"slideInDown"}
        swipeDirection="down"
        onSwipeComplete={() => {
          setShowPurchaseModal(false);
        }}
        isVisible={showPurchaseModal}
        //animationOutTiming
        onBackButtonPress={() => {
          setShowPurchaseModal(false);
        }}
        style={{
          position: "absolute",
          width: vw(100),
          marginLeft: 0,
          marginTop: 0,
          marginBottom: 0,
          justifyContent: "space-between",
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            //marginTop: -insets.top,
            //paddingTop: insets.top,
            height: vh(60),
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
          onPress={() => {
            setShowPurchaseModal(false);
          }}></TouchableOpacity>
        <View
          style={{
            flex: 1,
            height: vh(40),
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            backgroundColor: PALETTE.COLOR_WHITE,
            paddingBottom: insets.bottom,
            paddingTop: vh(3),
            justifyContent: "space-between",
          }}>
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 17,
                color: "black",
              }}>
              {country === "ko"
                ? `포스트 열람권 구매`
                : country === "ja"
                ? `投稿閲覧権購入`
                : country === "es"
                ? `Compra de derecho de acceso a la publicación`
                : country === "fr"
                ? `Achat du droit d'accès à la publication`
                : country === "id"
                ? `Pembelian hak akses ke posting`
                : country === "zh"
                ? `购买帖子访问权`
                : `Purchase post access right`}
            </Text>
          </View>
          <View
            style={{
              marginLeft: vw(6),
              marginRight: vw(6),
            }}>
            <View
              style={{
                marginBottom: vh(2),
              }}>
              {purchaseOneSelect?.cost !== -1 && (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor:
                      purchaseType === "point"
                        ? PALETTE.COLOR_BLACK
                        : PALETTE.COLOR_BORDER,
                    borderRadius: 10,
                    height: 60,
                    padding: 10,
                  }}
                  onPress={() => setPurchaseType("point")}>
                  <Text
                    style={{
                      color: "black",
                    }}>
                    {country === "ko"
                      ? `포인트로 구매하기`
                      : country === "ja"
                      ? `ポイントで購入する`
                      : country === "es"
                      ? `Comprar con puntos`
                      : country === "fr"
                      ? `Acheter avec des points`
                      : country === "id"
                      ? `Beli dengan poin`
                      : country === "zh"
                      ? `使用积分购买`
                      : `Purchase with points`}
                  </Text>
                  <View
                    style={{
                      marginLeft: 10,
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      backgroundColor: PALETTE.COLOR_BACK,
                      borderRadius: 10,
                      padding: 8,
                    }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#838383",
                        fontSize: 14,
                      }}>
                      {purchaseOneSelect?.cost}
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
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor:
                    purchaseType === "point"
                      ? PALETTE.COLOR_BORDER
                      : PALETTE.COLOR_BLACK,
                  borderRadius: 10,
                  height: 60,
                  padding: 10,
                }}
                onPress={() => setPurchaseType("membership")}>
                <Text
                  style={{
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `멤버십 구매하기`
                    : country === "ja"
                    ? `メンバーシップを購入する`
                    : country === "es"
                    ? `Comprar membresía`
                    : country === "fr"
                    ? `Acheter un abonnement`
                    : country === "id"
                    ? `Beli keanggotaan`
                    : country === "zh"
                    ? `购买会员`
                    : `Purchase membership`}
                </Text>
                <View
                  style={{
                    marginLeft: 10,
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    backgroundColor: PALETTE.COLOR_BACK,
                    borderRadius: 10,
                    padding: 8,
                  }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#838383",
                      fontSize: 14,
                    }}>
                    VIP {purchaseOneSelect?.step}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: PALETTE.COLOR_BACK,
                  width: vw(42),
                  height: vh(6),
                  borderRadius: 50,
                }}>
                <Text
                  style={{
                    color: "black",
                    fontWeight: "bold",
                  }}>
                  {country === "ko"
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
                    : `cancellation`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: PALETTE.COLOR_NAVY,
                  width: vw(42),
                  height: vh(6),
                  borderRadius: 50,
                }}
                onPress={async () => {
                  setShowPurchaseModal(false);
                  if (purchaseType === "point") {
                    if (purchaseOneSelect?.cost <= -1) return;
                    if (point?.amount < purchaseOneSelect?.cost) {
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
                        ? `해당 게시글 열람권을 구매하시겠습니까?`
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
                              .post("/post/purchasePost", {
                                PostId: postOne?.id,
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
                                  const postAfter = res.data.post;
                                  setPostOne({
                                    ...postOne,
                                    url: postAfter.url,
                                    contentSecret: false,
                                  });
                                  updatePoint({
                                    ...point,
                                    amount: point.amount - postOne?.cost,
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
                  } else {
                    navigation.navigate("Profile", {
                      membership: true,
                    });
                  }
                }}>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
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
          </View>
        </View>
      </Modal>
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
        keyboardVerticalOffset={Platform.OS === "ios" ? vh(6.5) : 0}>
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
                      fontWeight: "400",
                      fontSize: 16,
                      color: "black",
                    }}>
                    {postOne?.User.nick}
                    {country === "ko"
                      ? `님의 포스트`
                      : country === "ja"
                      ? `さんの投稿`
                      : country === "es"
                      ? `la publicación`
                      : country === "fr"
                      ? `le message`
                      : country === "id"
                      ? `posting`
                      : country === "zh"
                      ? `的帖子`
                      : `'s post`}
                  </Text>
                </View>
                <View
                  style={{
                    width: 30,
                    height: 30,
                  }}></View>
              </View>
            </View>

            <ScrollView
              style={{
                flex: 1,
              }}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  paddingLeft: vw(4),
                  paddingRight: vw(4),
                  width: "100%",
                  paddingTop: vh(2),
                  paddingBottom: vh(3),
                  //borderBottomColor: PALETTE.COLOR_BORDER,
                  //borderBottomWidth: 0.5,
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: vh(2),
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Profile", {
                          YouId: postOne?.User?.id,
                        });
                      }}>
                      <FastImage
                        source={{
                          uri: postOne?.User?.profile,
                          priority: FastImage.priority.normal,
                        }}
                        style={{
                          width: vw(10),
                          height: vw(10),
                          borderRadius: 100,
                        }}
                        resizeMode={FastImage.resizeMode.cover}></FastImage>
                    </TouchableOpacity>
                    <View
                      style={{
                        marginLeft: 5,
                      }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignContent: "center",
                          alignItems: "center",
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            marginRight: 5,
                            color: "black",
                          }}>
                          {postOne?.User?.nick}
                        </Text>
                        <Image
                          source={require("../../assets/setting/badge.png")}
                          style={{
                            width: 12,
                            height: 12,
                          }}></Image>
                      </View>
                      <Text
                        style={{
                          marginTop: 2,
                          color: "#838383",
                          fontSize: 10,
                        }}>
                        {postOne?.User?.link}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}>
                    <Dropdown
                      style={{
                        //width: "100%",
                        minWidth: 95,
                        flexDirection: "row-reverse",
                        justifyContent: "flex-start",

                        backgroundColor: "white",
                      }}
                      itemContainerStyle={{
                        alignContent: "center",
                        alignItems: "center",
                        backgroundColor: "white",
                        justifyContent: "center",
                      }}
                      activeColor="white"
                      itemTextStyle={{
                        fontSize: 14,
                        width: "100%",
                        height: "100%",
                      }}
                      selectedTextStyle={{
                        fontSize: 14,
                      }}
                      inputSearchStyle={{
                        width: 0,
                        height: 0,
                        borderWidth: 0,
                      }}
                      iconStyle={{
                        width: 0,
                      }}
                      data={
                        Number(post?.UserId) !== Number(user.id)
                          ? [
                              {
                                label:
                                  country === "ko"
                                    ? `신고하기`
                                    : country === "ja"
                                    ? `通報する`
                                    : country === "es"
                                    ? `Denunciar`
                                    : country === "fr"
                                    ? `Signaler`
                                    : country === "id"
                                    ? `Laporkan`
                                    : country === "zh"
                                    ? `举报`
                                    : `Report`,
                                value: 1,
                              },
                            ]
                          : [
                              {
                                label:
                                  country === "ko"
                                    ? `신고하기`
                                    : country === "ja"
                                    ? `通報する`
                                    : country === "es"
                                    ? `Denunciar`
                                    : country === "fr"
                                    ? `Signaler`
                                    : country === "id"
                                    ? `Laporkan`
                                    : country === "zh"
                                    ? `举报`
                                    : `Report`,
                                value: 1,
                              },
                              {
                                label:
                                  country === "ko"
                                    ? `수정하기`
                                    : country === "ja"
                                    ? `修正する`
                                    : country === "es"
                                    ? `Editar`
                                    : country === "fr"
                                    ? `Modifier`
                                    : country === "id"
                                    ? `Sunting`
                                    : country === "zh"
                                    ? `编辑`
                                    : `Edit`,
                                value: 2,
                              },
                              {
                                label:
                                  country === "ko"
                                    ? `삭제하기`
                                    : country === "ja"
                                    ? `削除`
                                    : country === "es"
                                    ? `Eliminar`
                                    : country === "fr"
                                    ? `Supprimer`
                                    : country === "id"
                                    ? `Hapus`
                                    : country === "zh"
                                    ? `删除`
                                    : `Delete`,
                                value: 3,
                              },
                            ]
                      }
                      labelField="label"
                      valueField="value"
                      onChange={async item => {
                        if (item.value === 1) {
                          //신고하기
                          await api
                            .post("/etc/declaration", {
                              UserId: post?.UserId,
                              PostId: post?.id,
                              url: post?.url,
                              type: DECLARATION_TYPE.DECLARATION_POST,
                            })
                            .then(res => {
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
                              }
                            });
                        } else if (item.value === 2) {
                          //삭제
                          navigation.navigate("UpdateFeed", {
                            post: post,
                          });
                        } else if (item.value === 3) {
                          //삭제
                          Alert.alert(
                            country === "ko"
                              ? `해당 게시글을 삭제하시겠습니까?`
                              : country === "ja"
                              ? `この投稿を削除しますか？`
                              : country === "es"
                              ? `¿Desea eliminar esta publicación?`
                              : country === "fr"
                              ? `Voulez-vous supprimer cette publication ?`
                              : country === "id"
                              ? `Apakah Anda ingin menghapus postingan ini?`
                              : country === "zh"
                              ? `您要删除此帖子吗？`
                              : `Do you want to delete this post?`,
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
                                    .delete("/post/removePost", {
                                      data: {
                                        PostId: post?.id,
                                      },
                                    })
                                    .then(res => {
                                      if (res.data.status === "true") {
                                        Alert.alert(
                                          country === "ko"
                                            ? `삭제 완료되었습니다.`
                                            : country === "ja"
                                            ? `削除が完了しました。`
                                            : country === "es"
                                            ? `Eliminación completada.`
                                            : country === "fr"
                                            ? `Suppression terminée.`
                                            : country === "id"
                                            ? `Penghapusan selesai.`
                                            : country === "zh"
                                            ? `删除成功。`
                                            : `Deletion completed.`,
                                        );
                                        navigation.goBack();
                                      } else if (res.data.status === "claim") {
                                        Alert.alert(
                                          country === "ko"
                                            ? "삭제 요청"
                                            : country === "ja"
                                            ? "削除リクエスト"
                                            : country === "es"
                                            ? "Solicitud de eliminación"
                                            : country === "fr"
                                            ? "Demande de suppression"
                                            : country === "id"
                                            ? "Permintaan penghapusan"
                                            : country === "zh"
                                            ? "删除请求"
                                            : "Delete request",
                                          country === "ko"
                                            ? "환불 방지를 위해 관리자 확인 후 삭제 처리 진행됩니다"
                                            : country === "ja"
                                            ? "返金防止のため、管理者が確認後に削除処理が進行されます"
                                            : country === "es"
                                            ? "Para evitar reembolsos, la eliminación se procesará después de la verificación del administrador"
                                            : country === "fr"
                                            ? "Pour éviter les remboursements, la suppression sera traitée après vérification par l'administrateur"
                                            : country === "id"
                                            ? "Untuk mencegah pengembalian dana, penghapusan akan diproses setelah verifikasi oleh admin"
                                            : country === "zh"
                                            ? "为防止退款，管理员确认后将进行删除处理"
                                            : "To prevent refunds, deletion will proceed after admin verification",
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
                        }
                      }}
                      renderLeftIcon={() => (
                        <View
                          style={{
                            height: "100%",
                            width: 50,
                            justifyContent: "center",
                            alignItems: "flex-end",
                          }}>
                          <Image
                            source={require("../../assets/home/menuG.png")}
                            style={{
                              width: 18,
                              height: 18,
                            }}></Image>
                        </View>
                      )}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      color: postOne?.contentSecret ? "#838383" : "black",
                    }}>
                    {postOne?.contentSecret === false
                      ? postOne?.content
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
                      : `You can check this upon purchase.`}
                  </Text>
                </View>
                {!postOne?.url && postOne?.cost >= -1 && postOne?.cost !== 0 ? (
                  <View
                    style={{
                      marginLeft: -vw(4),
                      marginRight: -vw(4),
                      width: vw(100),
                      height: vw(100),
                      backgroundColor: PALETTE.COLOR_BACK,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        top: vw(4),
                        left: vw(4),
                      }}>
                      {postOne?.cost !== -1 && (
                        <View
                          style={{
                            marginRight: 10,
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            backgroundColor: PALETTE.COLOR_WHITE,
                            borderRadius: 10,
                            padding: 8,
                          }}>
                          <Text
                            style={{
                              fontWeight: "bold",
                              color: "#838383",
                              fontSize: 14,
                            }}>
                            {postOne?.cost}
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
                      )}

                      {postOne.step !== 0 && postOne.step !== 11 && (
                        <View
                          style={{
                            marginRight: 10,
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            backgroundColor: PALETTE.COLOR_WHITE,
                            borderRadius: 10,
                            padding: 8,
                          }}>
                          <Text
                            style={{
                              fontWeight: "bold",
                              color: "#838383",
                              fontSize: 14,
                            }}>
                            VIP {postOne?.step}
                          </Text>
                        </View>
                      )}
                      {postOne?.type === POST_TYPE.POST_IMAGE && (
                        <View
                          style={{
                            marginRight: 10,
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            backgroundColor: PALETTE.COLOR_WHITE,
                            borderRadius: 10,
                            padding: 8,
                          }}>
                          <Image
                            style={{
                              width: 15,
                              height: 15,
                            }}
                            source={require("../../assets/home/photo.png")}
                          />
                        </View>
                      )}
                      {postOne?.type === POST_TYPE.POST_VIDEO && (
                        <View
                          style={{
                            marginRight: 10,
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            backgroundColor: PALETTE.COLOR_WHITE,
                            borderRadius: 10,
                            padding: 8,
                          }}>
                          <Image
                            style={{
                              width: 15,
                              height: 15,
                            }}
                            source={require("../../assets/home/videoPlay.png")}
                          />
                        </View>
                      )}
                      {postOne?.adult && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignContent: "center",
                            alignItems: "center",
                            backgroundColor: PALETTE.COLOR_WHITE,
                            borderRadius: 10,
                            padding: 8,
                          }}>
                          <Image
                            source={require("../../assets/home/adult.png")}
                            style={{
                              width: 20,
                              height: 20,
                            }}></Image>
                        </View>
                      )}
                    </View>
                    <Image
                      source={require("../../assets/home/lock.png")}
                      style={{
                        width: vw(15),
                        height: vw(15),
                      }}></Image>

                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        marginTop: vh(3),
                        backgroundColor: PALETTE.COLOR_NAVY,
                        //width: vw(40),
                        paddingLeft: 20,
                        paddingRight: 20,
                        height: vh(6),
                        borderRadius: 50,
                        flexDirection: "row",
                      }}
                      onPress={async () => {
                        if (postOne?.cost === -1) {
                          navigation.navigate("Profile", {
                            membership: true,
                          });
                          return;
                        }
                        if (postOne?.step === 11 || postOne?.step === 0) {
                          if (point?.amount < postOne?.cost) {
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
                              ? `해당 게시글 열람권을 구매하시겠습니까?`
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
                                    .post("/post/purchasePost", {
                                      PostId: postOne?.id,
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
                                        const postAfter = res.data.post;
                                        setPostOne({
                                          ...postOne,
                                          url: postAfter.url,
                                          contentSecret: false,
                                        });
                                        updatePoint({
                                          ...point,
                                          amount: point.amount - postOne?.cost,
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
                        } else {
                          setShowPurchaseModal(true);
                          setPurchaseOneSelect(postOne);
                        }
                      }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "white",
                        }}>
                        {country === "ko"
                          ? `포스트 열람권 구매`
                          : country === "ja"
                          ? `投稿閲覧権購入`
                          : country === "es"
                          ? `Compra de derecho de acceso a la publicación`
                          : country === "fr"
                          ? `Achat du droit d'accès à la publication`
                          : country === "id"
                          ? `Pembelian hak akses ke posting`
                          : country === "zh"
                          ? `购买帖子访问权`
                          : `Purchase post access right`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : postOne?.url &&
                  postOne?.UserId !== user?.id &&
                  postOne?.adult === true &&
                  user?.country === "ko" &&
                  (!user?.real_birthday ||
                    parseInt(user?.real_birthday) >
                      Number(new Date().getFullYear() - 19)) ? (
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      width: "108%",
                      backgroundColor: PALETTE.COLOR_BACK,
                      aspectRatio: "1/1",
                      marginLeft: -vw(4),
                    }}
                    activeOpacity={1}
                    onPress={() => {}}>
                    <Image
                      source={require("../../assets/home/adult.png")}
                      style={{
                        width: 100,
                        height: 100,
                      }}></Image>

                    {!user?.real_birthday && (
                      <TouchableOpacity
                        style={{
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          marginTop: vh(3),
                          backgroundColor: PALETTE.COLOR_NAVY,
                          paddingLeft: 20,
                          paddingRight: 20,
                          height: vh(6),
                          borderRadius: 50,
                          flexDirection: "row",
                        }}
                        onPress={() => {
                          navigation.navigate("CertificationIn");
                        }}>
                        <Text
                          style={{
                            color: "white",
                          }}>
                          {country === "ko"
                            ? `성인인증 하기`
                            : country === "ja"
                            ? `成人認証する`
                            : country === "es"
                            ? `Verificación de adultos`
                            : country === "fr"
                            ? `Vérification des adultes`
                            : country === "id"
                            ? `Verifikasi dewasa`
                            : country === "zh"
                            ? `成人验证`
                            : `Adult verification`}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                ) : (
                  postOne?.url && (
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                      }}
                      activeOpacity={1}
                      onPress={() => {
                        setModalText(postOne?.content);
                        if (postOne?.type === POST_TYPE.POST_VIDEO) {
                          setVideoVisible(true);
                          setVideoId(postOne?.id);
                          setVideoType("post");
                        } else {
                          setImgVisible(true);
                          setImgUrl(
                            `https://api.nmoment.live/secure/post/image/${postOne?.id}`,
                          );
                        }
                      }}>
                      {postOne?.type === POST_TYPE.POST_IMAGE ? (
                        <FastImage
                          source={{
                            uri: `https://api.nmoment.live/secure/post/image/${postOne?.id}`,
                            headers: {
                              authorization: `Bearer ${accessToken}`,
                              refreshToken: `Bearer ${refreshToken}`,
                            },
                            priority: FastImage.priority.normal,
                          }}
                          style={{
                            marginLeft: -vw(4),
                            marginRight: -vw(4),
                            width: vw(100),
                            height: vw(100),
                          }}
                          resizeMode={FastImage.resizeMode.cover}></FastImage>
                      ) : (
                        <>
                          <FastImage
                            source={{
                              uri: `https://api.nmoment.live/secure/post/video/${postOne?.id}`,
                              priority: FastImage.priority.normal,
                              headers: {
                                authorization: `Bearer ${accessToken}`,
                                refreshToken: `Bearer ${refreshToken}`,
                              },
                            }}
                            style={{
                              width: vw(100),
                              height: vw(100),
                            }}
                            resizeMode={FastImage.resizeMode.cover}></FastImage>
                          <Image
                            source={require("../../assets/home/play.png")}
                            style={{
                              position: "absolute",
                              width: vw(15),
                              height: vw(15),
                            }}></Image>
                        </>
                      )}
                    </TouchableOpacity>
                  )
                )}

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
                    }}
                    onPress={async () => {
                      if (postOne?.wishCheck === true) {
                        //좋아요 있을때
                        await api
                          .delete("/post/removeWish", {
                            data: {
                              PostId: postOne?.id,
                            },
                          })
                          .then(res => {
                            if (res.data.status === "true") {
                              const WishId = res.data.WishId;

                              setPostOne({
                                ...postOne,
                                Wishes: postOne.Wishes.filter(
                                  (item: any) => item.id !== WishId,
                                ),
                                wishCheck: false,
                              });
                            }
                          });
                      } else {
                        //없을때
                        await api
                          .post("/post/createWish", {
                            PostId: postOne?.id,
                          })
                          .then(res => {
                            if (res.data.status === "true") {
                              const wish = res.data.wish;
                              setPostOne({
                                ...postOne,
                                Wishes: postOne.Wishes.concat(wish),
                                wishCheck: true,
                              });
                            }
                          });
                      }
                    }}>
                    <Image
                      source={
                        postOne?.wishCheck === true
                          ? require("../../assets/home/heartR.png")
                          : require("../../assets/home/heartG.png")
                      }
                      style={{
                        width: 25,
                        height: 25,
                      }}></Image>
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginLeft: 10,
                      marginRight: 15,
                    }}>
                    {postOne?.Wishes?.length}
                  </Text>

                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}>
                    <Image
                      source={require("../../assets/home/comment.png")}
                      style={{
                        width: 25,
                        height: 25,
                      }}></Image>
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginLeft: 10,
                    }}>
                    {postOne?.Comments?.length}
                  </Text>
                </View>
              </TouchableOpacity>

              {postOne?.Comments?.map((list: any, idx: number) => (
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    width: "92%",
                    marginLeft: vw(4),
                    marginRight: vw(4),
                    alignItems: "flex-start",
                    marginBottom: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Profile", {
                        YouId: list?.User?.id,
                      });
                    }}>
                    <FastImage
                      source={{
                        uri: list?.User?.profile,
                        priority: FastImage.priority.normal,
                      }}
                      style={{
                        width: vw(8),
                        height: vw(8),
                        borderRadius: 100,
                      }}
                      resizeMode={FastImage.resizeMode.cover}></FastImage>
                  </TouchableOpacity>
                  <View
                    style={{
                      marginLeft: 10,
                      width: "85%",
                      //backgroundColor: "red",
                    }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: vw(100) - vw(16) - 10,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontWeight: "bold",
                          fontSize: 14,
                          width: "70%",
                          color: "black",
                        }}>
                        {list?.User?.nick}
                      </Text>
                      {(list?.UserId === user?.id ||
                        postOne?.UserId === user?.id) && (
                        <Dropdown
                          style={{
                            minWidth: 95,
                            height: 20,
                            flexDirection: "row-reverse",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                          itemContainerStyle={{
                            alignContent: "center",
                            alignItems: "center",
                            backgroundColor: "white",
                            justifyContent: "center",
                          }}
                          activeColor="white"
                          itemTextStyle={{
                            fontSize: 14,
                            width: "100%",
                            height: "100%",
                          }}
                          selectedTextStyle={{
                            fontSize: 14,
                          }}
                          inputSearchStyle={{
                            width: 0,
                            height: 0,
                            borderWidth: 0,
                          }}
                          iconStyle={{
                            width: 0,
                          }}
                          data={[
                            {
                              label:
                                country === "ko"
                                  ? `삭제하기`
                                  : country === "ja"
                                  ? `削除`
                                  : country === "es"
                                  ? `Eliminar`
                                  : country === "fr"
                                  ? `Supprimer`
                                  : country === "id"
                                  ? `Hapus`
                                  : country === "zh"
                                  ? `删除`
                                  : `Delete`,
                              value: 1,
                            },
                          ]}
                          labelField="label"
                          valueField="value"
                          onChange={async item => {
                            if (item.value === 1) {
                              Alert.alert(
                                country === "ko"
                                  ? `해당 댓글을 삭제하시겠습니까?`
                                  : country === "ja"
                                  ? `そのコメントを削除してもよろしいですか？`
                                  : country === "es"
                                  ? `¿Estás seguro de que quieres eliminar este comentario?`
                                  : country === "fr"
                                  ? `êtes-vous sûr de vouloir supprimer ce commentaire?`
                                  : country === "id"
                                  ? `Apakah Anda yakin ingin menghapus komentar ini?`
                                  : country === "zh"
                                  ? `你确定要删除此评论吗？`
                                  : `Are you sure you want to delete this comment?`,
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
                                        .post("/post/removeComment", {
                                          CommentId: list?.id,
                                        })
                                        .then(res => {
                                          if (res.data.status === "true") {
                                            Alert.alert(
                                              country === "ko"
                                                ? `삭제 완료되었습니다.`
                                                : country === "ja"
                                                ? `削除が完了しました。`
                                                : country === "es"
                                                ? `Eliminación completada.`
                                                : country === "fr"
                                                ? `Suppression terminée.`
                                                : country === "id"
                                                ? `Penghapusan selesai.`
                                                : country === "zh"
                                                ? `删除成功。`
                                                : `Deletion completed.`,
                                            );
                                            setPostOne({
                                              ...postOne,
                                              Comments:
                                                postOne?.Comments.filter(
                                                  (item: any) =>
                                                    item.id !== list.id,
                                                ),
                                            });
                                            //navigation.goBack();
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
                            }
                          }}
                          renderLeftIcon={() => (
                            <View
                              style={{
                                height: "100%",
                                width: 50,
                                justifyContent: "center",
                                alignItems: "flex-end",
                              }}>
                              <Image
                                source={require("../../assets/home/menuG.png")}
                                style={{
                                  width: 18,
                                  height: 18,
                                }}></Image>
                            </View>
                          )}
                        />
                      )}
                    </View>
                    <Text
                      style={{
                        color: "black",
                      }}>
                      {list?.content}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                      }}>
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#a4a4a4",
                          fontWeight: "400",
                        }}>
                        {new Date(list?.createdAt).toLocaleString()}
                      </Text>
                    </View>
                    {/*
                      <View
                        style={{
                          marginTop: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignContent: "center",
                            width: "100%",
                            alignItems: "flex-start",
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate("Profile");
                            }}>
                            <FastImage
                              source={{
                                uri: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA3MjFfMjEz%2FMDAxNjg5OTQ1Nzk1OTA4.HORCFdHuUibCHHmDexcHbwRTgHDggCMGeMxLlF-IC0Yg.NcemIj7pJMzUQsI2JOIuyWNkCB5LIayHHLPMupPkhuAg.JPEG.mssixx%2FIMG_1006.JPG&type=a340",
                                priority: FastImage.priority.normal,
                              }}
                              style={{
                                width: vw(8),
                                height: vw(8),
                                borderRadius: 100,
                              }}
                              resizeMode={FastImage.resizeMode.cover}></FastImage>
                          </TouchableOpacity>
                          <View
                            style={{
                              marginLeft: 10,
                              width: "85%",
                              //backgroundColor: "red",
                            }}>
                            <Text
                              numberOfLines={1}
                              style={{
                                fontWeight: "bold",
                                fontSize: 14,
                              }}>
                              사랑해
                            </Text>
                            <Text>
                              adskmalsdaskdnaskldnsalkdnaklndlakndlandkslandalskndaklndsalkndkalsndalkndklandlka
                            </Text>
    
                            <View
                              style={{
                                flexDirection: "row",
                                alignContent: "center",
                                alignItems: "center",
                              }}>
                              <Text
                                style={{
                                  fontSize: 13,
                                  color: "#a4a4a4",
                                  fontWeight: "400",
                                }}>
                                8월 31일 오후 11:31 ·
                              </Text>
                              <TouchableOpacity
                                style={{
                                  marginLeft: 5,
                                  justifyContent: "center",
                                  alignContent: "center",
                                  alignItems: "center",
                                }}>
                                <Text
                                  style={{
                                    fontSize: 13,
                                    color: "#838383",
                                    fontWeight: "bold",
                                  }}>
                                  답글 달기
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>
                      */}
                  </View>
                </TouchableOpacity>
              ))}

              <View
                style={{
                  height: vh(2),
                }}></View>
            </ScrollView>

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
                  style={{
                    color: "black",
                    width: "75%",
                  }}
                  onChangeText={e => {
                    setContent(e);
                  }}
                  placeholder={
                    country === "ko"
                      ? `댓글 달기...`
                      : country === "ja"
                      ? `コメントする...`
                      : country === "es"
                      ? `Deja un comentario...`
                      : country === "fr"
                      ? `Laissez un commentaire...`
                      : country === "id"
                      ? `Tinggalkan komentar...`
                      : country === "zh"
                      ? `发表评论...`
                      : `Leave a comment...`
                  }
                />
              </View>
              <TouchableOpacity
                onPress={async e => {
                  setLoading(true);
                  if (content === "" || !content) {
                    Alert.alert(
                      country === "ko"
                        ? `내용을 입력해주세요.`
                        : country === "ja"
                        ? `内容を入力してください。`
                        : country === "es"
                        ? `Por favor ingrese sus datos.`
                        : country === "fr"
                        ? `Veuillez entrer vos coordonnées.`
                        : country === "id"
                        ? `Silakan masukkan detail Anda.`
                        : country === "zh"
                        ? `请输入您的详细信息。`
                        : `Please enter your details.`,
                    );
                  }
                  await api
                    .post("/post/createComment", {
                      content,
                      PostId,
                    })
                    .then(res => {
                      setPostOne({
                        ...postOne,
                        Comments: postOne.Comments.concat({
                          ...res.data.comment,
                          User: user,
                        }),
                      });
                      setContent("");
                    });
                  Keyboard.dismiss();
                  setLoading(false);
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
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </NotchView>
  );
}
