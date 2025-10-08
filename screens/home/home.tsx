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
import {useIsFocused, useScrollToTop} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Dropdown} from "react-native-element-dropdown";
import {DECLARATION_TYPE} from "../../lib/constant/declaration-constant";
import Modal from "react-native-modal";
import {BlurView} from "@react-native-community/blur";
import {LIVE_CONSTANT} from "../../lib/constant/live-constant";
import ProfileModal from "../reusable/profileModal";
import {POST_TYPE} from "../../lib/constant/post-constant";
import VideoPlayer from "react-native-video-controls";
import ImageModal from "../reusable/imageModal";
import VideoModal from "../reusable/videoModal";
import {getStyle} from "react-native-svg/lib/typescript/xml";
import EncryptedStorage from "react-native-encrypted-storage";
import CryptoJS from "crypto-js";
import {CRYPTO_SECRET} from "@env";
import {WebView} from "react-native-webview";
import {CALL_TYPE} from "../../lib/constant/call-constant";
import {PERMISSIONS, RESULTS, request} from "react-native-permissions";
import {USER_GENDER, USER_ROLE} from "../../lib/constant/user-constant";
import APP_VERSION from "../../lib/constant/APP_VERSION";

export default function Home({
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
  myFollowing,
  setMyFollowing,
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
  myFollowing: any;
  setMyFollowing: any;
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
  const insets = useSafeAreaInsets();

  const pageNum: any = useRef(0);
  const pageSize: any = useRef(5);

  const pageNumUser: any = useRef(0);
  const pageSizeUser: any = useRef(20);
  //const [myFollowing, setMyFollowing]: any = useState([]);
  const [selectedUser, setSelectedUser]: any = useState(null);

  /*
  const [modalState, setModalState] = useState(
    LIVE_CONSTANT.MODAL_STATE_DEFAULT,
  );
  */
  const [postType, setPostType] = useState(0); //0 팔로잉, 1전체
  const isFocused = useIsFocused();
  const [accessToken, setAccessToken]: any = useState(null);
  const [refreshToken, setRefreshToken]: any = useState(null);
  const [firstRender, setFirstRender] = useState(false);

  useEffect(() => {
    async function getSecureToken() {
      setAccessToken(await EncryptedStorage.getItem("accessToken"));
      setRefreshToken(await EncryptedStorage.getItem("refreshToken"));
    }
    if (isFocused || reToken) {
      getSecureToken();
    }
  }, [isFocused, reToken]);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await api
        .get("/post/postList/v2", {
          params: {
            APP_VERSION,
            pageNum: 0,
            pageSize: pageSize.current,
            country,
            postType: 0,
            platform: Platform.OS,
          },
        })
        .then(res => {
          updatePost(res.data.postList);
          pageNum.current = 1;
        });
    } catch (err) {}
    try {
      await api
        .get("/user/myFollowing", {
          params: {
            APP_VERSION,
            pageNum: 0,
            pageSize: pageSizeUser.current,
            country,
            platform: Platform.OS,
          },
        })
        .then(res => {
          pageNumUser.current = 0;
          setMyFollowing(res.data?.myFollowing[0]?.Followings);
        });
    } catch (err) {}
    setRefreshing(false);
  }, [user]);

  const ref = useRef(null);
  useScrollToTop(ref);

  useEffect(() => {
    async function fetchData() {
      try {
        await api
          .get("/post/postList/v2", {
            params: {
              APP_VERSION,
              pageNum: 0,
              pageSize: pageSize.current,
              country,
              postType: 0,
              platform: Platform.OS,
            },
          })
          .then(res => {
            updatePost(res.data.postList);
            pageNum.current = 1;
          });
      } catch (err) {}
      try {
        await api
          .get("/user/myFollowing", {
            params: {
              APP_VERSION,
              pageNum: 0,
              pageSize: pageSizeUser.current,
              country,
              platform: Platform.OS,
            },
          })
          .then(res => {
            pageNumUser.current = 1;
            if (res.data?.myFollowing[0]?.Followings)
              setMyFollowing(res.data?.myFollowing[0]?.Followings);
          });
      } catch (err) {}
      setFirstRender(true);
    }
    fetchData();
  }, []);
  const [modalText, setModalText]: any = useState(null);
  const [imgUrl, setImgUrl]: any = useState(null);
  const [imgVisible, setImgVisible] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [videoId, setVideoId]: any = useState(null);
  const [videoType, setVideoType]: any = useState(null);

  const [selectUrl, setSelectUrl]: any = useState(null);
  const [selectType, setSelectType] = useState("photo"); // photo or video
  const [modalContent, setModalContent] = useState(false);

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: {
    layoutMeasurement: any;
    contentOffset: any;
    contentSize: any;
  }) => {
    const paddingToBottom = 40;
    return (
      layoutMeasurement.width + contentOffset.x >=
      contentSize.width - paddingToBottom
    );
  };

  const [currentHeight, setCurrentHeight] = useState(0);
  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["bottom"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={"dark-content"}
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
          modalText={modalText}
          setModalText={setModalText}
          country={country}
          screenModal={false}
          isVisible={videoVisible}
          videoId={videoId}
          videoType={videoType}
          setIsVisible={setVideoVisible}></VideoModal>
      )}
      {isFocused && selectedUser && (
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
          selectedUser={selectedUser}></ProfileModal>
      )}
      <View
        style={{
          paddingTop: currentHeight < vh(10) ? insets.top : 0,
          flex: 1,
        }}>
        {currentHeight < vh(10) && (
          <View
            style={{
              marginTop: vh(2),
              paddingLeft: vw(4),
              paddingRight: vw(4),
            }}>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: vh(2),
              }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 22,
                  color: "black",
                }}>
                {country === "ko"
                  ? `피드`
                  : country === "ja"
                  ? `フィード`
                  : country === "es"
                  ? `Noticias`
                  : country === "fr"
                  ? `Fil d'actualités`
                  : country === "id"
                  ? `Berita`
                  : country === "zh"
                  ? `动态`
                  : `Feed`}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}>
                {user.gender !== USER_GENDER.BOY && (
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      marginBottom: -12,
                    }}
                    onPress={() => {
                      if (user?.country === "ko" && !user?.real_birthday) {
                        navigation.push("CertificationIn");
                      } else {
                        navigation.navigate("MakeFeed");
                      }
                    }}>
                    <Image
                      source={require("../../assets/home/plus.png")}
                      style={{
                        marginLeft: 15,
                        width: 30,
                        height: 30,
                      }}></Image>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    marginBottom: -12,
                  }}
                  onPress={() => {
                    navigation.navigate("Search");
                  }}>
                  <Image
                    source={require("../../assets/nav/search.png")}
                    style={{
                      marginLeft: 15,
                      width: 22,
                      height: 22,
                    }}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    marginBottom: -12,
                  }}
                  onPress={() => {
                    navigation.navigate("Alarm");
                  }}>
                  <Image
                    source={require("../../assets/live/bell.png")}
                    style={{
                      marginLeft: 15,
                      width: 25,
                      height: 25,
                    }}></Image>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {post && firstRender && (
          <FlatList
            onScroll={e => {
              const {contentSize, layoutMeasurement, contentOffset} =
                e.nativeEvent;
              setCurrentHeight(contentOffset.y);
            }}
            ref={ref}
            contentContainerStyle={
              {
                //flex: 1,
                //flexGrow: 1,
                //backgroundColor: "red",
              }
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsHorizontalScrollIndicator={false}
            scrollEnabled
            //onEndReachedThreshold={0.9}
            //onEndReachedThreshold={0.01}
            onEndReached={async e => {
              await api
                .get("/post/postList/v2", {
                  params: {
                    APP_VERSION,
                    pageNum: pageNum.current,
                    pageSize: pageSize.current,
                    country,
                    postType: 0,
                    platform: Platform.OS,
                  },
                })
                .then(res => {
                  updatePost([...post, ...res.data?.postList]);
                  pageNum.current = pageNum.current + 1;
                });
            }}
            //horizontal={true}
            keyExtractor={(item: any) => item.id}
            data={post}
            numColumns={1}
            decelerationRate={"fast"}
            //stickyHeaderIndices={[0]}
            ListHeaderComponent={() => (
              <ScrollView
                onScroll={async ({nativeEvent}) => {
                  if (isCloseToBottom(nativeEvent) && myFollowing?.length > 4) {
                    //enableSomeButton();
                    await api
                      .get("/user/myFollowing", {
                        params: {
                          APP_VERSION,
                          pageNum: pageNumUser.current,
                          pageSize: pageSizeUser.current,
                          country,
                          platform: Platform.OS,
                        },
                      })
                      .then(res => {
                        pageNumUser.current = pageNumUser.current + 1;
                        if (res.data?.myFollowing[0]?.Followings) {
                          setMyFollowing((prev: any) => [
                            ...prev,
                            ...res.data?.myFollowing[0]?.Followings,
                          ]);
                        }
                      });
                  }
                }}
                scrollEventThrottle={400}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                style={{
                  backgroundColor: "white",
                  paddingTop: vh(1),
                  paddingBottom: vh(1),
                  paddingLeft: vw(4),
                  paddingRight: vw(4),
                }}>
                {myFollowing?.map((list: any, index: number) => (
                  <TouchableOpacity
                    key={list?.id}
                    style={{
                      marginRight: vw(2),
                      width: vw(18) + 10,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                    onPress={async e => {
                      setSelectedUser(list);
                      setModalState(LIVE_CONSTANT.MODAL_STATE_PROFILE);
                    }}>
                    <View
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        width: vw(18) + 8,
                        height: vw(18) + 8,
                        borderWidth: 1,
                        borderColor: PALETTE.COLOR_BORDER,
                        borderRadius: 100,
                      }}>
                      {list?.callState === CALL_TYPE.CALL_ING && (
                        <View
                          style={{
                            position: "absolute",
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                            zIndex: 2,
                            backgroundColor: "rgba(0,0,0,0.4)",
                            borderRadius: 100,
                          }}>
                          <Image
                            source={require("../../assets/live/ing.png")}
                            style={{
                              width: vw(8),
                              height: vw(8),
                              maxWidth: 50,
                              maxHeight: 50,
                            }}></Image>
                          <Text
                            style={{
                              marginTop: 5,
                              fontSize: 8,
                              fontWeight: "bold",
                              color: PALETTE.COLOR_RED,
                            }}>
                            {country === "ko"
                              ? `통화중..`
                              : country === "ja"
                              ? `通話中...`
                              : country === "es"
                              ? `En llamada...`
                              : country === "fr"
                              ? `En communication...`
                              : country === "id"
                              ? `Sedang berbicara...`
                              : country === "zh"
                              ? `通话中...`
                              : `In a call...`}
                          </Text>
                        </View>
                      )}
                      <FastImage
                        source={{
                          uri: list?.profile,
                          priority: FastImage.priority.normal,
                        }}
                        style={{
                          width: vw(18),
                          height: vw(18),
                          borderRadius: 100,
                        }}
                        resizeMode={FastImage.resizeMode.cover}></FastImage>
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        marginTop: 4,
                        color: "black",
                      }}
                      numberOfLines={1}>
                      {list?.nick}
                    </Text>
                  </TouchableOpacity>
                ))}
                <View
                  style={{
                    width: vw(4),
                  }}></View>
              </ScrollView>
            )}
            //stickyHeaderHiddenOnScroll
            //stickyHeaderIndices={[0]} // 0번째 index 로지정
            showsVerticalScrollIndicator={false}
            renderItem={(props: any) => (
              <TouchableOpacity
                activeOpacity={1}
                key={props.item?.id}
                style={{
                  paddingLeft: vw(4),
                  paddingRight: vw(4),
                  width: "100%",
                  backgroundColor: PALETTE.COLOR_WHITE,
                  paddingTop: vh(2),
                  paddingBottom: vh(2),
                  ...Platform.select({
                    ios: {
                      shadowColor: "#d3d3d3",
                      shadowOffset: {
                        width: 2,
                        height: 5,
                      },
                      shadowOpacity: 5,
                      shadowRadius: 5,
                    },
                    android: {
                      elevation: 5,
                    },
                  }),
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
                          YouId: props.item?.User.id,
                        });
                      }}>
                      <FastImage
                        source={{
                          uri: props.item?.User?.profile,
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
                          {props.item?.User?.nick}
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
                        {props.item?.User?.link}
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
                        props.item?.UserId !== user.id
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
                              UserId: props.item?.UserId,
                              PostId: props.item?.id,
                              url: props.item?.url,
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
                            post: props.item,
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
                                        PostId: props.item?.id,
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
                                        updatePost(
                                          post.filter(
                                            (list: any, idx: number) =>
                                              list.id !== props.item?.id,
                                          ),
                                        );
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
                      color: "black",
                    }}
                    numberOfLines={8}>
                    {props.item?.content}
                  </Text>
                </View>
                {!props.item?.url && props.item?.cost > 0 ? (
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
                                    PostId: props.item?.id,
                                  })
                                  .then(res => {
                                    if (res.data.status === "true") {
                                      const postAfter = res.data.post;
                                      updatePost(
                                        post.map((list: any, idx: number) =>
                                          list.id === props.item?.id
                                            ? {
                                                ...list,
                                                url: postAfter.url,
                                              }
                                            : list,
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
                      }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "white",
                        }}>
                        {Number(props.item?.cost).toLocaleString()}
                      </Text>
                      <Image
                        source={require("../../assets/setting/point.png")}
                        style={{
                          backgroundColor: PALETTE.COLOR_WHITE,
                          borderRadius: 100,
                          width: 25,
                          height: 25,
                          marginLeft: 5,
                          marginRight: 5,
                        }}></Image>
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "white",
                        }}>
                        구매하기
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  props.item?.url && (
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setModalText(props.item?.content);
                        if (props.item?.type === POST_TYPE.POST_VIDEO) {
                          setVideoVisible(true);
                          setVideoId(props.item?.id);
                          setVideoType("post");
                        } else {
                          setImgVisible(true);
                          setImgUrl(
                            `${serverURL}/secure/post/image/${props.item?.id}`,
                          );
                        }
                      }}>
                      <View
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          zIndex: 10,
                        }}></View>
                      {props.item?.type === POST_TYPE.POST_IMAGE ? (
                        <FastImage
                          removeClippedSubviews={true}
                          source={{
                            uri: `${serverURL}/secure/post/image/${props.item?.id}`, //props.item?.url,
                            priority: FastImage.priority.normal,
                            headers: {
                              authorization: `Bearer ${accessToken}`,
                              refreshToken: `Bearer ${refreshToken}`,
                            },
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
                            removeClippedSubviews={true}
                            source={{
                              uri: `${serverURL}/secure/post/video/${props.item?.id}`,
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
                      if (props.item?.wishCheck === true) {
                        //좋아요 있을때
                        await api
                          .delete("/post/removeWish", {
                            data: {
                              PostId: props.item?.id,
                            },
                          })
                          .then(res => {
                            if (res.data.status === "true") {
                              const WishId = res.data.WishId;
                              updatePost(
                                post.map((list: any, idx: number) =>
                                  list.id === props.item.id
                                    ? {
                                        ...list,
                                        Wishes: list.Wishes.filter(
                                          (item: any) => item.id !== WishId,
                                        ),
                                        wishCheck: false,
                                      }
                                    : list,
                                ),
                              );
                            }
                          });
                      } else {
                        //없을때
                        await api
                          .post("/post/createWish", {
                            PostId: props.item?.id,
                          })
                          .then(res => {
                            if (res.data.status === "true") {
                              const wish = res.data.wish;
                              updatePost(
                                post.map((list: any, idx: number) =>
                                  list.id === props.item.id
                                    ? {
                                        ...list,
                                        Wishes: list.Wishes.concat(wish),
                                        wishCheck: true,
                                      }
                                    : list,
                                ),
                              );
                            }
                          });
                      }
                    }}>
                    <Image
                      source={
                        props.item?.wishCheck === true
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
                    {Number(props.item?.Wishes.length)}
                  </Text>

                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      navigation.navigate("Comment", {
                        PostId: props.item?.id,
                      });
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
                    {Number(props.item?.Comments?.length)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        <View
          style={{
            height: vh(6),
            width: vw(100),
          }}></View>
      </View>
    </NotchView>
  );
}
