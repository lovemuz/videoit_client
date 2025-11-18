import React from "react";
import {
  useState,
  useEffect,
  useRef,
  createContext,
  PropsWithChildren,
} from "react";
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
  ActivityIndicator,
  ImageBackground,
  AppState,
} from "react-native";
import {NotchProvider, NotchView} from "react-native-notchclear";
import AsyncStorage from "@react-native-async-storage/async-storage";

import serverURL from "../../lib/constant/serverURL";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {vw, vh, vmin, vmax} from "react-native-css-vh-vw";
import {useNavigation, useRoute} from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import {PALETTE} from "../../lib/constant/palette";
import Toast, {BaseToast, ErrorToast} from "react-native-toast-message";
import FastImage from "react-native-fast-image";
import {BlurView} from "@react-native-community/blur";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import api from "../../lib/api/api";
import {USER_GENDER} from "../../lib/constant/user-constant";
import SoundPlayer from "react-native-sound-player";
import {COUNTRY_LIST} from "../../lib/constant/country-constant";

export const ToastContext = createContext({
  showToast({result}: {result: any}) {},
  showCall({result}: {result: any}) {},
});

const hideShow = () => {
  Toast.hide();
};
const showChat = ({result}: {result: any}) => {
  //이거 Toast 맨밑에 있어야 토스트가 가장 위로뜸
  //const navigation: any = useNavigation();

  Toast.show({
    type: "onChat",
    autoHide: true,
    //activeOpacity: 1,
    props: {
      RoomId: result?.RoomId,
      url: result?.url,
      title: result?.title,
      content: result?.content,
    },
  });
};

const showPost = ({result}: {result: any}) => {
  //이거 Toast 맨밑에 있어야 토스트가 가장 위로뜸
  //const navigation: any = useNavigation();

  Toast.show({
    type: "onPost",
    autoHide: true,
    //activeOpacity: 1,
    props: {
      you: result?.you,
    },
  });
};

const showCheck = ({result}: {result: any}) => {
  //이거 Toast 맨밑에 있어야 토스트가 가장 위로뜸
  Toast.show({
    position: "bottom",
    type: "attendanceCheck",
    //activeOpacity: 1,
    //autoHide: true,
    // visibilityTime: 1000,
    props: {
      content:
        result.good === true
          ? result.country === "ko"
            ? `출석체크 되셨습니다.🎉 ${result?.price}P 를 드립니다~!`
            : result.country === "ja"
            ? `出席チェックが完了しました。🎉 ${result?.price}ポイントをプレゼントします~！`
            : result.country === "es"
            ? `¡Se ha registrado! 🎉 ¡Te regalamos ${result?.price} puntos~!`
            : result.country === "fr"
            ? `Votre présence est confirmée ! 🎉 Vous recevez ${result?.price} points~ !`
            : result.country === "id"
            ? `Anda sudah check-in! 🎉 Anda mendapatkan ${result?.price} Poin~!`
            : result.country === "zh"
            ? `签到成功！🎉 赠送10积分~！`
            : `Check-in complete! 🎉 We're giving you ${result?.price} points~!`
          : result.country === "ko"
          ? "오늘은 출석체크를 완료했어요.🥲"
          : result.country === "ja"
          ? "今日は出席確認が完了しました。🥲"
          : result.country === "es"
          ? "Hoy completé el registro de asistencia.🥲"
          : result.country === "fr"
          ? "Aujourd'hui, j'ai terminé la vérification de la présence.🥲"
          : result.country === "id"
          ? "Hari ini saya menyelesaikan pemeriksaan kehadiran.🥲"
          : result.country === "zh"
          ? "今天我完成了签到。🥲"
          : "I completed the attendance check today.🥲",
    },
  });
};

let first = false;

const showCall = ({result}: {result: any}) => {
  //이거 Toast 맨밑에 있어야 토스트가 가장 위로뜸
  //const navigation: any = useNavigation();
  Toast.show({
    type: "onCall",
    onHide: async () => {
      const callAcceptCopy = result.callAccept.current;
      if (!callAcceptCopy && first) {
        await api.post("/call/stopCall", {
          YouId: result?.you?.id,
          calling: false,
        });
        SoundPlayer.stop();
        result?.connectSocket.current?.emit("denyConnectCall", {
          YouId: result?.you?.id,
        });
      }
      first = false;
    },

    autoHide: true,
    visibilityTime: 15000,
    //activeOpacity: 1,
    props: {
      callAccept: result?.callAccept,
      RoomId: result?.RoomId,
      you: result?.you,
      avgTime: result?.avgTime,
      avgScore: result?.avgScore,
      vip: result?.vip,
      gender: result?.gender,
    },
  });
};

const ToastComponent = ({
  country,
  user,
  navigation,
  connectSocket,
}: {
  country: any;
  user: any;
  navigation: any;
  connectSocket: any;
}): JSX.Element => {
  //const navigation: any = useNavigation();

  const insets = useSafeAreaInsets();

  return (
    <Toast
      topOffset={insets.top}
      config={{
        onCall: ({props}) => (
          <View
            style={{
              width: vw(100),
              height: vh(40),
              backgroundColor: PALETTE.COLOR_WHITE,
              justifyContent: "space-between",
            }}>
            <ImageBackground
              source={{
                uri: props.you?.profile,
                //priority: FastImage.priority.normal,
              }}
              style={{
                marginTop: -insets.top,
                position: "absolute",
                flex: 1,
                width: "100%",
                height: vh(40) + insets.top,
              }}
              blurRadius={5}
              resizeMode={FastImage.resizeMode.cover}>
              <View
                style={{flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)"}}></View>
            </ImageBackground>

            <View
              style={{
                paddingLeft: vw(4),
                paddingRight: vw(4),
                height: vh(40),
                //backgroundColor: "red",
                justifyContent: "space-around",
              }}>
              <View
                style={{
                  //justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    marginTop: vh(2),
                  }}>
                  <View
                    style={{
                      width: vh(14),
                      height: vh(14),
                    }}>
                    <FastImage
                      source={{
                        uri: props.you?.profile,
                        priority: FastImage.priority.normal,
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor: PALETTE.COLOR_BORDER,
                        width: vh(12),
                        height: vh(12),
                        borderRadius: 100,
                      }}
                      resizeMode={FastImage.resizeMode.cover}></FastImage>
                    {props?.vip && (
                      <Image
                        source={require("../../assets/chat/vip.png")}
                        style={{
                          width: vh(5),
                          height: vh(5),
                          position: "absolute",
                          zIndex: 4,
                          //right: 0,
                          top: 0,
                        }}></Image>
                    )}
                  </View>
                  <Text
                    style={{
                      marginTop: 10,
                      fontWeight: "bold",
                      fontSize: 16,
                      marginBottom: 5,
                      color: PALETTE.COLOR_WHITE,
                    }}>
                    {props.you?.nick}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      marginBottom: 5,
                    }}>
                    {props.you?.country === "ko" ? (
                      <Image
                        source={require("../../assets/live/ko.png")}
                        style={{
                          width: 14,
                          height: 14,
                          marginRight: 2,
                        }}></Image>
                    ) : props.you?.country === "ja" ? (
                      <Image
                        source={require("../../assets/live/ja.png")}
                        style={{
                          width: 14,
                          height: 14,
                          marginRight: 2,
                        }}></Image>
                    ) : props.you?.country === "es" ? (
                      <Image
                        source={require("../../assets/live/es.png")}
                        style={{
                          width: 14,
                          height: 14,
                          marginRight: 2,
                        }}></Image>
                    ) : props.you?.country === "fr" ? (
                      <Image
                        source={require("../../assets/live/fr.png")}
                        style={{
                          width: 14,
                          height: 14,
                          marginRight: 2,
                        }}></Image>
                    ) : props.you?.country === "id" ? (
                      <Image
                        source={require("../../assets/live/id.png")}
                        style={{
                          width: 14,
                          height: 14,
                          marginRight: 2,
                        }}></Image>
                    ) : props.you?.country === "zh" ? (
                      <Image
                        source={require("../../assets/live/zh.png")}
                        style={{
                          width: 14,
                          height: 14,
                          marginRight: 2,
                        }}></Image>
                    ) : (
                      <Image
                        source={require("../../assets/live/en.png")}
                        style={{
                          width: 14,
                          height: 14,
                          marginRight: 2,
                        }}></Image>
                    )}
                    <Text
                      style={{
                        fontSize: 12,
                        color: PALETTE.COLOR_WHITE,
                      }}>
                      {props.you?.country === "ko"
                        ? country === "ko"
                          ? `대한민국 |`
                          : country === "ja"
                          ? `日本 |`
                          : country === "es"
                          ? `España |`
                          : country === "fr"
                          ? `France |`
                          : country === "id"
                          ? `Indonesia |`
                          : country === "zh"
                          ? `中国 |`
                          : `Korea |`
                        : props.you?.country === "ja"
                        ? country === "ko"
                          ? `일본 | `
                          : country === "ja"
                          ? `日本`
                          : country === "es"
                          ? `Japón |`
                          : country === "fr"
                          ? `Japon |`
                          : country === "id"
                          ? `Jepang |`
                          : country === "zh"
                          ? `日本 |`
                          : `Japan |`
                        : props.you?.country === "es"
                        ? country === "ko"
                          ? `스페인 | `
                          : country === "ja"
                          ? `スペイン`
                          : country === "es"
                          ? `España |`
                          : country === "fr"
                          ? `Espagne |`
                          : country === "id"
                          ? `Spanyol |`
                          : country === "zh"
                          ? `西班牙 |`
                          : `Spain |`
                        : props.you?.country === "fr"
                        ? country === "ko"
                          ? `프랑스 | `
                          : country === "ja"
                          ? `フランス|`
                          : country === "es"
                          ? `Francia |`
                          : country === "fr"
                          ? `France |`
                          : country === "id"
                          ? `Perancis |`
                          : country === "zh"
                          ? `法国 |`
                          : `France |`
                        : props.you?.country === "id"
                        ? country === "ko"
                          ? `인도 | `
                          : country === "ja"
                          ? `インド`
                          : country === "es"
                          ? `India |`
                          : country === "fr"
                          ? `Inde |`
                          : country === "id"
                          ? `India |`
                          : country === "zh"
                          ? `印度 |`
                          : `India |`
                        : props.you?.country === "zh"
                        ? country === "ko"
                          ? `중국 | `
                          : country === "ja"
                          ? `中国|`
                          : country === "es"
                          ? `China |`
                          : country === "fr"
                          ? `Chine |`
                          : country === "id"
                          ? `Cina |`
                          : country === "zh"
                          ? `中国 |`
                          : `China |`
                        : country === "ko"
                        ? `미국 | `
                        : country === "ja"
                        ? `アメリカ|`
                        : country === "es"
                        ? `Estados Unidos |`
                        : country === "fr"
                        ? `États-Unis |`
                        : country === "id"
                        ? `Amerika Serikat |`
                        : country === "zh"
                        ? `美国 |`
                        : `USA |`}
                      {props.you?.age}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <View>
                  <View
                    style={{
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
                      <Text
                        style={{
                          marginRight: 5,
                          color: "white",
                        }}>
                        {country === "ko"
                          ? "평균 영상점수"
                          : country === "ja"
                          ? "平均ビデオスコア"
                          : country === "es"
                          ? "Puntuación promedio de video"
                          : country === "fr"
                          ? "Score vidéo moyen"
                          : country === "id"
                          ? "Nilai rata-rata video"
                          : country === "zh"
                          ? "平均视频得分"
                          : "Average video score"}
                      </Text>
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: PALETTE.COLOR_RED,
                          marginRight: 10,
                        }}>
                        {Number(props?.avgScore).toFixed(1)}
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
                          marginRight: 5,
                          color: "white",
                        }}>
                        {country === "ko"
                          ? "평균 영상시간"
                          : country === "ja"
                          ? "平均ビデオ時間"
                          : country === "es"
                          ? "Duración media del video"
                          : country === "fr"
                          ? "Durée moyenne de la vidéo"
                          : country === "id"
                          ? "Durasi video rata-rata"
                          : country === "zh"
                          ? "平均视频时间"
                          : "Average video duration"}
                      </Text>
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: PALETTE.COLOR_RED,
                          marginRight: 10,
                        }}>
                        {Number(props?.avgTime).toFixed(1)}
                        {country === "ko"
                          ? "초"
                          : country === "ja"
                          ? "秒"
                          : country === "es"
                          ? "segundos"
                          : country === "fr"
                          ? "secondes"
                          : country === "id"
                          ? "detik"
                          : country === "zh"
                          ? "秒"
                          : "seconds"}
                      </Text>
                    </View>
                  </View>
                </View>
                {(AppState.currentState === "active" ||
                  !user?.backgroundApnsOn ||
                  user?.country === COUNTRY_LIST.중국 ||
                  Platform.OS !==
                    "ios") /* foreground일 때는 항상 버튼 표시. background일 때는 iOS에서 CallKit 팝업을 통해서 전화 받아야 합니다. */ && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingBottom: vh(2),
                      //backgroundColor: "red",
                      paddingTop: vh(2),
                    }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        width: "48%",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        height: vh(5),
                        borderRadius: 10,
                        backgroundColor: PALETTE.COLOR_SKY,
                        flexDirection: "row",
                      }}
                      onPress={() => {
                        props.callAccept.current = true;
                        SoundPlayer?.stop();
                        Toast?.hide();

                        connectSocket.current?.emit("acceptConnectCall", {
                          otherUserId: user.id,
                          YouId: props?.you?.id,
                          RoomId: props?.RoomId,
                        });
                        setTimeout(() => {
                          props.callAccept.current = false;
                        }, 5000);
                        setTimeout(() => {
                          navigation.current?.navigate("Call", {
                            RoomId: props?.RoomId,
                            otherUserId: props?.you?.id,
                            caller: false,
                            gender: props?.gender,
                            incoming: false,
                          });
                        }, 500);
                      }}>
                      <Image
                        source={require("../../assets/live/checkW.png")}
                        style={{
                          width: 18,
                          height: 18,
                          marginRight: 10,
                        }}></Image>
                      <Text
                        style={{
                          color: "white",
                        }}>
                        {country === "ko"
                          ? "수락하기"
                          : country === "ja"
                          ? "承諾する"
                          : country === "es"
                          ? "Aceptar"
                          : country === "fr"
                          ? "Accepter"
                          : country === "id"
                          ? "Terima"
                          : country === "zh"
                          ? "接受"
                          : "Accept"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        first = true;
                        SoundPlayer.stop();
                        Toast.hide();
                      }}
                      activeOpacity={1}
                      style={{
                        width: "48%",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        height: vh(5),
                        borderRadius: 10,
                        backgroundColor: PALETTE.COLOR_RED,
                        flexDirection: "row",
                      }}>
                      <Image
                        source={require("../../assets/live/closeW2.png")}
                        style={{
                          width: 18,
                          height: 18,
                          marginRight: 10,
                        }}></Image>
                      <Text
                        style={{
                          color: "white",
                        }}>
                        {country === "ko"
                          ? "거절하기"
                          : country === "ja"
                          ? "拒否する"
                          : country === "es"
                          ? "Rechazar"
                          : country === "fr"
                          ? "Rejeter"
                          : country === "id"
                          ? "Menolak"
                          : country === "zh"
                          ? "拒绝"
                          : "Reject"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        ),
        /*
        onChat: ({props}) => (
          <TouchableOpacity
            activeOpacity={1}
            style={{
              height: vh(9),
              justifyContent: "space-between",
              width: "96%",

              backgroundColor: "rgba(255,255,255,0.85)",
              borderRadius: 10,
              paddingLeft: vw(4),
              paddingRight: vw(4),
              paddingTop: vh(2),
              paddingBottom: vh(1),
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
            }}
            onPress={() => {
              navigation?.current?.navigate("Chat", {
                RoomId: props.RoomId,
              });
            }}>
            <View
              style={{
                flexDirection: "row",
                overflow: "hidden",
              }}>
              <FastImage
                source={{
                  uri: props.url,
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
                  justifyContent: "center",
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: "bold",
                    fontSize: 13,
                    marginBottom: 2,
                    color: "black",
                  }}>
                  {props?.title}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: "200",
                    fontSize: 13,
                    color: "black",
                  }}>
                  {props?.content}
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}>
              <View
                style={{
                  backgroundColor: PALETTE.COLOR_BORDER,
                  height: 4,
                  width: 50,
                  borderRadius: 100,
                }}></View>
            </View>
          </TouchableOpacity>
        ),
        onPost: ({props}) => (
          <TouchableOpacity
            activeOpacity={1}
            style={{
              height: vh(9),
              justifyContent: "space-between",
              width: "96%",
              backgroundColor: "rgba(255,255,255,0.85)",
              borderRadius: 10,
              paddingLeft: vw(4),
              paddingRight: vw(4),
              paddingTop: vh(2),
              paddingBottom: vh(1),
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
            }}
            onPress={() => {
              navigation?.current?.navigate("Profile", {
                YouId: props.you?.id,
              });
            }}>
            <View
              style={{
                flexDirection: "row",
                overflow: "hidden",
              }}>
              <FastImage
                source={{
                  uri: props.you?.profile,
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
                  justifyContent: "center",
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: "bold",
                    fontSize: 13,
                    marginBottom: 2,
                    color: "black",
                  }}>
                  {props?.you?.nick}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: "200",
                    fontSize: 13,
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `새로운 포스트를 업로드 했습니다.`
                    : country === "ja"
                    ? `新しい投稿をアップロードしました。`
                    : country === "es"
                    ? `Se ha subido una nueva publicación.`
                    : country === "fr"
                    ? `Un nouveau message a été téléchargé.`
                    : country === "id"
                    ? `Postingan baru telah diunggah.`
                    : country === "zh"
                    ? `已上传新帖子。`
                    : `A new post has been uploaded.`}
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}>
              <View
                style={{
                  backgroundColor: PALETTE.COLOR_BORDER,
                  height: 4,
                  width: 50,
                  borderRadius: 100,
                }}></View>
            </View>
          </TouchableOpacity>
        ),
        */
        attendanceCheck: ({props}) => (
          <View
            style={{
              width: "80%",
              height: 60,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              // width: "80%",
              // top: vh(75),
              backgroundColor: PALETTE.COLOR_BACK,
              borderRadius: 20,
              bottom: vh(8),
            }}>
            <Text
              style={{
                color: "black",
                fontWeight: "400",
              }}>
              {props.content}
            </Text>
          </View>
        ),
      }}
      position={"top"}
    />
  );
};

export {ToastComponent, showChat, showCall, showPost, showCheck, hideShow};
