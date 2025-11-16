import React, { useContext } from "react";
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
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { NotchProvider, NotchView } from "react-native-notchclear";
import AsyncStorage from "@react-native-async-storage/async-storage";

import serverURL from "../../lib/constant/serverURL";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { vw, vh, vmin, vmax } from "react-native-css-vh-vw";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { PALETTE } from "../../lib/constant/palette";
import Modal from "react-native-modal";
import { LIVE_CONSTANT } from "../../lib/constant/live-constant";
import FastImage from "react-native-fast-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../../lib/api/api";
import { CALL_TYPE } from "../../lib/constant/call-constant";
import { USER_GENDER } from "../../lib/constant/user-constant";
import { CallContext } from "../../contexts/CallContext";

function useInterval(callback: any, delay: any) {
  const savedCallback: any = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function ProfileModal({
  country,
  selectedUser,
  user,
  navigation,
  connectSocket,
  calling,
  setCalling,
  timer,
  setTimer,
  isRunning,
  setIsRunning,
  callEndByMe,
  modalState,
  setModalState,
}: {
  calling: any;
  setCalling: any;
  timer: any;
  setTimer: any;
  isRunning: any;
  setIsRunning: any;
  callEndByMe: any;
  modalState: any;
  setModalState: any;
  country: any;
  selectedUser: any;
  user: any;
  navigation: any;
  connectSocket: any;
}): JSX.Element {
  const callContext = useContext(CallContext);
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const [call, setCall] = useState(null);
  const [delay, setDelay] = useState(1000);

  useInterval(
    async () => {
      if (timer === 0) {
        if (calling) {
          try {
            await api.post("/call/stopCall", {
              YouId: selectedUser.id,
              calling: true,
            });
          } catch (err) { }
          try {
            connectSocket.current.emit("stopCall", {
              YouId: selectedUser.id,
            });
          } catch (err) { }
        }
        setCalling(false);
        setIsRunning(false);
        setTimer(15);
        callContext.endCall();
      } else {
        setTimer(timer - 1);
      }
    },
    isRunning ? delay : null,
  );

  const [girlMyCallPrice, setGirlMyCallPrice] = useState(1000);
  const [rankList, setRankList]: any = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        await api.get("/user/getCreatorAuth").then(res => {
          if (res.data.status === "true") {
            setGirlMyCallPrice(res.data.creatorAuth?.callPrice);
          }
        });
      } catch (err) { }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        await api
          .get("/room/getMyDonation3", {
            params: {
              YouId: selectedUser?.id,
            },
          })
          .then(res => {
            setRankList(res.data.rankList);
          });
      } catch (err) { }
    }
    fetchData();
  }, [selectedUser]);

  const isFocused = useIsFocused();

  const handleClose = async () => {
    callEndByMe.current = true;
    setCalling(false);
    setIsRunning(false);
    setTimer(15);
    setModalState(LIVE_CONSTANT.MODAL_STATE_DEFAULT);
    if (calling) {
      await api.post("/call/stopCall", {
        YouId: selectedUser.id,
        calling: true,
      });
      connectSocket.current.emit("stopCall", {
        YouId: selectedUser.id,
      });
      callContext.endCall();
    }
  };

  const handleVideoCall = async () => {
    if (selectedUser.id === user.id) return;
    if (selectedUser.gender === user.gender) {
      Alert.alert(
        country === "ko"
          ? "영상통화 성별"
          : country === "ja"
            ? "ビデオ通話の性別"
            : country === "es"
              ? "Sexo en videollamadas"
              : country === "fr"
                ? "Sexe en appels vidéo"
                : country === "id"
                  ? "Jenis Kelamin dalam Panggilan Video"
                  : country === "zh"
                    ? "视频通话性别"
                    : "Video Call Gender",
        country === "ko"
          ? "통화는 성별이 달라야 이용 가능합니다."
          : country === "ja"
            ? "通話は異なる性別でのみ利用できます。"
            : country === "es"
              ? "Las videollamadas solo están disponibles para diferentes géneros."
              : country === "fr"
                ? "Les appels vidéo ne sont disponibles que pour des sexes différents."
                : country === "id"
                  ? "Panggilan video hanya tersedia untuk jenis kelamin yang berbeda."
                  : country === "zh"
                    ? "通话仅限异性之间。"
                    : "Video calls are available only for different genders.",
      );
      return;
    }

    await api
      .post("/call/createCall/v2", {
        YouId: selectedUser.id,
        calling,
      })
      .then(async res => {
        console.log(res.data);
        if (res.data.status === "stopOnlySelf") {
          callEndByMe.current = true;
          setCalling(false);
          setIsRunning(false);
          setTimer(15);
          await api.post("/call/stopCallOnlySelf", {
            YouId: selectedUser.id,
            calling: true,
          });
          callContext.endCall();
          return;
        }
        if (calling === true) {
          callEndByMe.current = true;
          setCalling(false);
          setIsRunning(false);
          setTimer(15);
          await api.post("/call/stopCall", {
            YouId: selectedUser.id,
            calling: true,
          });
          connectSocket.current.emit("stopCall", {
            YouId: selectedUser.id,
          });
          callContext.endCall();
          return;
        }

        if (res.data.status === "true") {
          const chat = res.data?.chat;
          const currentRoom = res.data.currentRoom;

          setCalling(true);
          const RoomId: number = res.data.RoomId;
          const vip: boolean = res.data.vip;
          setCall(res.data.call);
          connectSocket.current.emit("tryConnectCall", {
            RoomId: RoomId,
            YouId: selectedUser?.id,
            you: res.data?.user,
            gender: user?.gender,
            avgTime: res.data?.user?.avgTime,
            avgScore: res.data?.user?.avgScore,
            vip,
          });
          connectSocket.current.emit("newChat", {
            YouId: selectedUser?.id,
            MeId: user.id,
            room: {
              ...currentRoom,
              Chats: [chat],
            },
            admin: false,
            notShow: true,
          });
          setIsRunning(true);
        } else if (res.data.status === "point") {
          if (user.gender === USER_GENDER.BOY) {
            Alert.alert(
              country === "ko"
                ? "포인트 부족"
                : country === "ja"
                  ? "ポイントが不足しています"
                  : country === "es"
                    ? "Puntos insuficientes"
                    : country === "fr"
                      ? "Points insuffisants"
                      : country === "id"
                        ? "Poin kurang"
                        : country === "zh"
                          ? "积分不足"
                          : "Insufficient points",
              country === "ko"
                ? `${Number(
                  selectedUser?.CreatorAuth?.callPrice,
                ).toLocaleString()} 포인트 이상 보유시 부터 통화 가능합니다.`
                : country === "ja"
                  ? `${Number(
                    selectedUser?.CreatorAuth?.callPrice,
                  ).toLocaleString()} ポイント以上所有している場合に通話が可能です。`
                  : country === "es"
                    ? `Es posible llamar cuando tienes más de ${Number(
                      selectedUser?.CreatorAuth?.callPrice,
                    ).toLocaleString()} puntos.`
                    : country === "fr"
                      ? `Vous pouvez appeler dès que vous avez plus de ${Number(
                        selectedUser?.CreatorAuth?.callPrice,
                      ).toLocaleString()} points.`
                      : country === "id"
                        ? `Panggilan tersedia ketika Anda memiliki lebih dari ${Number(
                          selectedUser?.CreatorAuth?.callPrice,
                        ).toLocaleString()} poin.`
                        : country === "zh"
                          ? `当您拥有 ${Number(
                            selectedUser?.CreatorAuth?.callPrice,
                          ).toLocaleString()} 点或更多积分时，您就可以开始拨打电话。`
                          : `You can make calls when you have more than ${Number(
                            selectedUser?.CreatorAuth?.callPrice,
                          ).toLocaleString()} points.`,
            );
            setModalState(LIVE_CONSTANT.MODAL_STATE_DEFAULT);
            navigation.navigate("Store");
          } else if (user.gender === USER_GENDER.GIRL) {
            Alert.alert(
              country === "ko"
                ? "포인트 부족"
                : country === "ja"
                  ? "ポイントが不足しています"
                  : country === "es"
                    ? "Puntos insuficientes"
                    : country === "fr"
                      ? "Points insuffisants"
                      : country === "id"
                        ? "Poin kurang"
                        : country === "zh"
                          ? "积分不足"
                          : "Insufficient points",
              country === "ko"
                ? "상대방의 포인트가 부족합니다."
                : country === "ja"
                  ? "相手のポイントが不足しています"
                  : country === "es"
                    ? "Puntos insuficientes por parte del otro usuario"
                    : country === "fr"
                      ? "Points insuffisants chez l'autre utilisateur"
                      : country === "id"
                        ? "Poin pengguna lain kurang"
                        : country === "zh"
                          ? "对方积分不足"
                          : "Insufficient points for the other user",
            );
          }
        } else if (res.data.status === "calling") {
          setCalling(false);
          Alert.alert(
            country === "ko"
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
                        : `In a call...`,
            country === "ko"
              ? "상대방이 통화중입니다."
              : country === "ja"
                ? "相手は通話中です"
                : country === "es"
                  ? "La otra persona está en una llamada"
                  : country === "fr"
                    ? "L'autre personne est en communication"
                    : country === "id"
                      ? "Pihak lain sedang berbicara"
                      : country === "zh"
                        ? "对方正在通话중"
                        : "The other person is on a call",
          );
        }
      });
  };

  return isFocused ? (
    <Modal
      key={selectedUser?.id}
      animationIn="fadeIn"
      animationOut="fadeOut"
      isVisible={modalState === LIVE_CONSTANT.MODAL_STATE_PROFILE}
      onBackButtonPress={handleClose}
      style={{
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
          onPress={handleClose}
          activeOpacity={1}
        />

        <View style={{
          backgroundColor: 'white',
          width: vw(85),
          maxHeight: vh(80),
          borderRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
          {/* 고정 헤더 - 스크롤되지 않음 */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 25,
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#EFEFEF',
          }}>
            <TouchableOpacity onPress={() => {
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
                          YouId: selectedUser?.id,
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
                            navigation.goBack();
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
              <Text style={{
                fontSize: 16,
                color: PALETTE.COLOR_RED,
              }}>
                {country === "ko"
                  ? `차단하기`
                  : country === "ja"
                    ? `ブロック`
                    : country === "es"
                      ? `Bloquear`
                      : country === "fr"
                        ? `Bloquer`
                        : country === "id"
                          ? `Blokir`
                          : country === "zh"
                            ? `屏蔽`
                            : `Block`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClose}>
              <Image
                source={require("../../assets/rank/close.png")}
                style={{
                  width: 24,
                  height: 24,
                }}></Image>
            </TouchableOpacity>
          </View>

          {/* 스크롤 가능한 콘텐츠 영역 */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingVertical: 20,
              alignItems: 'center',
            }}
          >
            {/* 별점 */}
            <View style={{
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 10,
            }}>
              <Image
                source={require("../../assets/rank/star.png")}
                style={{
                  width: 24,
                  height: 24,
                  marginBottom: 3,
                }}></Image>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#F7A409',
              }}>{Number(selectedUser?.avgScore).toFixed(1)}</Text>
            </View>

            {/* 프로필 이미지 */}
            <FastImage
              source={{
                uri: selectedUser?.profile || "",
                priority: FastImage.priority.normal,
              }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                marginBottom: 15,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />

            {/* 사용자 이름 */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 15,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#333',
              }}>
                {selectedUser?.nick || "사용자"}
              </Text>
              <Image
                source={require("../../assets/setting/badge.png")}
                style={{
                  width: 16,
                  height: 16,
                }}></Image>
            </View>

            {/* 후원 순위 섹션 */}
            <View style={{
              width: '100%',
              backgroundColor: '#F8F8F8',
              borderWidth: 2,
              borderColor: '#EFEFEF',
              borderRadius: 8,
              padding: 15,
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: '#535353',
                textAlign: 'center',
                marginBottom: 15,
              }}>
                {country === "ko" ? "후원 순위" : "Sponsor Ranking"}
              </Text>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
                {/* 1등 */}
                {rankList?.length >= 1 && rankList[0] && (
                  <View style={{ alignItems: 'center' }}>
                    <FastImage
                      source={{
                        uri: rankList[0]?.User?.profile,
                        priority: FastImage.priority.normal,
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#F5D162',
                        marginBottom: 5,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 2
                    }}>
                      <Image
                        source={require("../../assets/rank/medal1.png")}
                        style={{
                          width: 16,
                          height: 16,
                          marginRight: 3,
                        }}
                      />
                      <Text style={{ fontSize: 12, color: '#151515' }} numberOfLines={1}>
                        {rankList[0]?.User?.nick}
                      </Text>
                    </View>
                  </View>
                )}

                {/* 2등 */}
                {rankList?.length >= 2 && rankList[1] && (
                  <View style={{ alignItems: 'center' }}>
                    <FastImage
                      source={{
                        uri: rankList[1]?.User?.profile,
                        priority: FastImage.priority.normal,
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#8DC3F4',
                        marginBottom: 5,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 2
                    }}>
                      <Image
                        source={require("../../assets/rank/medal2.png")}
                        style={{
                          width: 16,
                          height: 16,
                          marginRight: 3,
                        }}
                      />
                      <Text style={{ fontSize: 12, color: '#151515' }} numberOfLines={1}>
                        {rankList[1]?.User?.nick}
                      </Text>
                    </View>
                  </View>
                )}

                {/* 3등 */}
                {rankList?.length >= 3 && rankList[2] && (
                  <View style={{ alignItems: 'center' }}>
                    <FastImage
                      source={{
                        uri: rankList[2]?.User?.profile,
                        priority: FastImage.priority.normal,
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: '#CD7F32',
                        marginBottom: 5,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 2
                    }}>
                      <Image
                        source={require("../../assets/rank/medal3.png")}
                        style={{
                          width: 16,
                          height: 16,
                          marginRight: 3,
                        }}
                      />
                      <Text style={{ fontSize: 12, color: '#151515' }} numberOfLines={1}>
                        {rankList[2]?.User?.nick}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* 통화 평균시간 */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginBottom: 10,
            }}>
              <Text style={{
                fontSize: 14,
                color: '#151515',
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
              <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: '#3B82F6',
              }}>
                {Number(selectedUser?.avgTime).toFixed(1)}
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

            <View style={{
              width: '100%',
              height: 1,
              backgroundColor: '#EFEFEF',
              marginBottom: 10,
            }} />

            {/* 통계 그리드 */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 25,
            }}>
              {[
                {
                  label: country === "ko" ? "15초 미만" : country === "ja" ? "15未満の秒" : "Less than 15 seconds",
                  value: selectedUser?.Score?.time1 || 0
                },
                {
                  label: country === "ko" ? "1분 미만" : country === "ja" ? "1分未満" : "Less than 1 minute",
                  value: selectedUser?.Score?.time2 || 0
                },
                {
                  label: country === "ko" ? "3분 미만" : country === "ja" ? "3分未満" : "Less than 3 minutes",
                  value: selectedUser?.Score?.time3 || 0
                },
                {
                  label: country === "ko" ? "3분 이상" : country === "ja" ? "3分以上" : "3 minutes or more",
                  value: selectedUser?.Score?.time4 || 0
                }
              ].map((item, index) => (
                <View key={index} style={{
                  flex: 1,
                  backgroundColor: '#F8F8F8',
                  borderRadius: 8,
                  padding: 10,
                  alignItems: 'center',
                  marginHorizontal: index === 0 ? 0 : 3,
                  marginLeft: index === 0 ? 0 : 3,
                }}>
                  <Text style={{ fontSize: 12, color: '#535353', marginBottom: 3, textAlign: 'center' }} numberOfLines={2}>{item.label}</Text>
                  <View style={{
                    width: '80%',
                    height: 1,
                    backgroundColor: '#EFEFEF',
                    marginBottom: 3,
                  }} />
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#4C2508' }}>{item.value}</Text>
                </View>
              ))}
            </View>


            {calling && (
              <View style={{
                alignItems: 'center',
                marginBottom: 20,
                padding: 15,
                backgroundColor: '#F5F5F5',
                borderRadius: 10,
                width: '100%',
              }}>
                <Text style={{
                  color: '#333',
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                  {country === "ko"
                    ? "상대방에게 연결중입니다..."
                    : country === "ja"
                      ? "相手に接続中..."
                      : country === "es"
                        ? "Conectando con el otro usuario..."
                        : country === "fr"
                          ? "Connexion à l'autre utilisateur en cours..."
                          : country === "id"
                            ? "Menghubungkan ke pengguna lain..."
                            : country === "zh"
                              ? "连接到对方中..."
                              : "Connecting to the other user..."}
                </Text>
                <Text style={{
                  fontSize: 30,
                  color: PALETTE.COLOR_MAIN,
                  fontWeight: 'bold',
                }}>
                  {timer}
                </Text>
              </View>
            )}

            {/* 하단 버튼들 */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
            }}>
              {/* 영상통화 버튼 */}
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  flex: 1,
                  marginHorizontal: 5,
                }}
                onPress={handleVideoCall}
              >
                <View style={{
                  width: 24,
                  height: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                  {calling ? (
                    <ActivityIndicator color={PALETTE.COLOR_MAIN} size="small" />
                  ) : (
                    <Image
                      source={require("../../assets/rank/movie.png")}
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    />
                  )}
                </View>
                <Text style={{ fontSize: 14, color: '#4C2508' }}>
                  {country === "ko" ? "영상통화" : "Video Call"}
                </Text>
                {/*user?.gender === USER_GENDER.BOY && (
                  <Text style={{ fontSize: 10, color: '#666', marginTop: 2 }}>
                    {Number(selectedUser?.CreatorAuth?.callPrice).toLocaleString()}P
                  </Text>
                )*/}
              </TouchableOpacity>

              {/* 채팅 버튼 */}
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  flex: 1,
                  marginHorizontal: 5,
                }}
                onPress={async () => {
                  if (user?.id === selectedUser?.id) return;
                  if (calling === true) {
                    setCalling(false);
                    setIsRunning(false);
                    setTimer(15);
                    await api.post("/call/stopCall", {
                      YouId: selectedUser.id,
                      calling: true,
                    });
                    connectSocket.current.emit("stopCall", {
                      YouId: selectedUser.id,
                    });
                    callContext.endCall();
                  }
                  await api
                    .post("/room/createRoom", {
                      YouId: selectedUser?.id,
                    })
                    .then(async (res: any) => {
                      if (res.data.status === "true") {
                        const RoomId: number = res.data.RoomId;
                        setModalState(LIVE_CONSTANT.MODAL_STATE_DEFAULT);
                        navigation.navigate("Chat", {
                          RoomId,
                        });
                      }
                    });
                }}
              >
                <View style={{
                  width: 24,
                  height: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                  <Image
                    source={require("../../assets/rank/chat.png")}
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                </View>
                <Text style={{ fontSize: 14, color: '#4C2508' }}>
                  {country === "ko" ? "채팅" : "Chat"}
                </Text>
              </TouchableOpacity>

              {/* 프로필 버튼 */}
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  flex: 1,
                  marginHorizontal: 5,
                }}
                onPress={async () => {
                  setModalState(LIVE_CONSTANT.MODAL_STATE_DEFAULT);
                  if (calling === true) {
                    setCalling(false);
                    setIsRunning(false);
                    setTimer(15);
                    await api.post("/call/stopCall", {
                      YouId: selectedUser.id,
                      calling: true,
                    });
                    connectSocket.current.emit("stopCall", {
                      YouId: selectedUser.id,
                    });
                    callContext.endCall();
                  }
                  if (route.name !== "Profile") {
                    navigation.navigate("Profile", {
                      YouId: selectedUser?.id,
                    });
                  }
                }}
              >
                <View style={{
                  width: 24,
                  height: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                  <Image
                    source={require("../../assets/rank/profile.png")}
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                </View>
                <Text style={{ fontSize: 14, color: '#4C2508' }}>
                  {country === "ko" ? "프로필" : "Profile"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  ) : (
    <View></View>
  );
}