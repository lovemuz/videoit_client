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
  Modal,
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
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { showChat, showCheck } from "../reusable/useToast";
import InAppReview from "react-native-in-app-review";

import auth from "@react-native-firebase/auth";

import {
  RewardedAd,
  RewardedAdEventType,
  RewardedInterstitialAd,
  TestIds,
  RewardedAdReward,
} from "react-native-google-mobile-ads";
import { USER_GENDER, USER_ROLE } from "../../lib/constant/user-constant";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import EncryptedStorage from "react-native-encrypted-storage";

const adUnitId =
  Platform.select({
    ios: "ca-app-pub-5367490002791296/6136156214", //"ca-app-pub-5367490002791296/7771520131",
    android: "ca-app-pub-5367490002791296/4630954112", // "ca-app-pub-5367490002791296/7177172506",
  }) || "";

export default function Setting({
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
  calling,
  setCalling,
  timer,
  setTimer,
  isRunning,
  setIsRunning,
  callEndByMe,
  modalState,
  setModalState,
  setCountry,
}: {
  setCountry: any;
  calling: any;
  setCalling: any;
  timer: any;
  setTimer: any;
  isRunning: any;
  setIsRunning: any;
  callEndByMe: any;
  modalState: any;
  setModalState: any;
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

  const [countryModalOn, setCountryModalOn] = useState(false);
  // 회원탈퇴
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const rewardedRef = useRef<RewardedInterstitialAd | null>(null);

  useEffect(() => {
    // 광고 생성
    const rewarded = RewardedInterstitialAd.createForAdRequest(
      /*TestIds.REWARDED /*/ adUnitId,
      {
        requestNonPersonalizedAdsOnly: true, // 맞춤형 광고 여부
        //keywords: ["fashion", "clothing"], // 광고 카테고리 고르기
      },
    );
    //생성된 광고는 ref 변수로 관리
    rewardedRef.current = rewarded;

    // 광고 로드 이벤트 리스너
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    // 라워드를 받았을 때 이벤트 리스너
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async reward => {
        rewarded.removeAllListeners();
        //이벤트 성공시
        await api.put("/user/attendanceCheckAfter").then(res => {
          if (res.data.status === "true") {
            showCheck({
              result: { good: true, country, gender: user?.gender },
            });
          } else {
            showCheck({
              result: { good: false, country, gender: user?.gender },
            });
          }
        });
        //setCoin(prev => prev + reward.amount);
      },
    );

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  // 광고 열기
  const openAd = () => {
    if (rewardedRef.current !== null) {
      rewardedRef.current.show();
    }
  };

  const [snsCheck, setSnsCheck] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        await api.get("/user/snsUserExist").then(res => {
          if (res.data.snsCheck === true) {
            setSnsCheck(true);
          }
        });
      } catch (err) { }
    }
    fetchData();
  }, []);

  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["top", "bottom"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={"dark-content"}
      />
      <View
        style={{
          flex: 1,
        }}>
        {countryModalOn === true && (
          <View
            style={{
              // maxWidth: vw(100),
              zIndex: 99,
              position: "absolute",
              backgroundColor: "rgba(0,0,0,0.5)",
              width: "100%",
              height: "100%",
            }}>
            <TouchableOpacity
              style={{
                width: "100%",
                height: "35%",
              }}
              onPress={() => {
                setCountryModalOn(false);
              }}></TouchableOpacity>
            <View
              style={{
                width: "100%",
                height: "65%",
                backgroundColor: "white",
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: vh(2),
                paddingBottom: vh(8),
                justifyContent: "space-between",
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: PALETTE.COLOR_BACK,
                  padding: 8,
                  borderRadius: 10,
                }}
                onPress={async () => {
                  setCountryModalOn(false);
                  setCountry("ko");
                  await AsyncStorage.setItem("country", "ko");
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <Image
                    source={require("../../assets/live/ko.png")}
                    style={{
                      width: 30,
                      height: 30,
                    }}></Image>
                  <Text
                    style={{
                      color: "black",
                      marginLeft: 10,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}>
                    {country === "ko"
                      ? "한국어"
                      : country === "ja"
                        ? "韓国語"
                        : country === "es"
                          ? "Coreano"
                          : country === "fr"
                            ? "Coréen"
                            : country === "id"
                              ? "Korea"
                              : country === "zh"
                                ? "韩语"
                                : "Korean"}
                  </Text>
                </View>
                <Image
                  source={require("../../assets/setting/right.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: PALETTE.COLOR_BACK,
                  padding: 8,
                  borderRadius: 10,
                }}
                onPress={async () => {
                  setCountryModalOn(false);
                  setCountry("ja");
                  await AsyncStorage.setItem("country", "ja");
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <Image
                    source={require("../../assets/live/ja.png")}
                    style={{
                      width: 30,
                      height: 30,
                    }}></Image>
                  <Text
                    style={{
                      color: "black",
                      marginLeft: 10,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}>
                    {country === "ko"
                      ? "일본어"
                      : country === "ja"
                        ? "日本語"
                        : country === "es"
                          ? "Japonés"
                          : country === "fr"
                            ? "Japonais"
                            : country === "id"
                              ? "Jepang"
                              : country === "zh"
                                ? "日语"
                                : "Japanese"}
                  </Text>
                </View>
                <Image
                  source={require("../../assets/setting/right.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: PALETTE.COLOR_BACK,
                  padding: 8,
                  borderRadius: 10,
                }}
                onPress={async () => {
                  setCountryModalOn(false);
                  setCountry("es");
                  await AsyncStorage.setItem("country", "es");
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <Image
                    source={require("../../assets/live/es.png")}
                    style={{
                      width: 30,
                      height: 30,
                    }}></Image>
                  <Text
                    style={{
                      color: "black",
                      marginLeft: 10,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}>
                    {country === "ko"
                      ? "스페인어"
                      : country === "ja"
                        ? "スペイン語"
                        : country === "es"
                          ? "Español"
                          : country === "fr"
                            ? "Espagnol"
                            : country === "id"
                              ? "Spanyol"
                              : country === "zh"
                                ? "西班牙语"
                                : "Spanish"}
                  </Text>
                </View>
                <Image
                  source={require("../../assets/setting/right.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: PALETTE.COLOR_BACK,
                  padding: 8,
                  borderRadius: 10,
                }}
                onPress={async () => {
                  setCountryModalOn(false);
                  setCountry("fr");
                  await AsyncStorage.setItem("country", "fr");
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <Image
                    source={require("../../assets/live/fr.png")}
                    style={{
                      width: 30,
                      height: 30,
                    }}></Image>
                  <Text
                    style={{
                      color: "black",
                      marginLeft: 10,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}>
                    {country === "ko"
                      ? "프랑스어"
                      : country === "ja"
                        ? "フランス語"
                        : country === "es"
                          ? "Francés"
                          : country === "fr"
                            ? "Français"
                            : country === "id"
                              ? "Prancis"
                              : country === "zh"
                                ? "法语"
                                : "French"}
                  </Text>
                </View>
                <Image
                  source={require("../../assets/setting/right.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: PALETTE.COLOR_BACK,
                  padding: 8,
                  borderRadius: 10,
                }}
                onPress={async () => {
                  setCountryModalOn(false);
                  setCountry("id");
                  await AsyncStorage.setItem("country", "id");
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <Image
                    source={require("../../assets/live/id.png")}
                    style={{
                      width: 30,
                      height: 30,
                    }}></Image>
                  <Text
                    style={{
                      color: "black",
                      marginLeft: 10,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}>
                    {country === "ko"
                      ? "힌디어"
                      : country === "ja"
                        ? "ヒンディー語"
                        : country === "es"
                          ? "Hindi"
                          : country === "fr"
                            ? "Hindi"
                            : country === "id"
                              ? "Hindi"
                              : country === "zh"
                                ? "印地语"
                                : "Hindi"}
                  </Text>
                </View>
                <Image
                  source={require("../../assets/setting/right.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: PALETTE.COLOR_BACK,
                  padding: 8,
                  borderRadius: 10,
                }}
                onPress={async () => {
                  setCountryModalOn(false);
                  setCountry("zh");
                  await AsyncStorage.setItem("country", "zh");
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <Image
                    source={require("../../assets/live/zh.png")}
                    style={{
                      width: 30,
                      height: 30,
                    }}></Image>
                  <Text
                    style={{
                      color: "black",
                      marginLeft: 10,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}>
                    {country === "ko"
                      ? "중국어"
                      : country === "ja"
                        ? "中国語"
                        : country === "es"
                          ? "Chino"
                          : country === "fr"
                            ? "Chinois"
                            : country === "id"
                              ? "Mandarin"
                              : country === "zh"
                                ? "中文"
                                : "Chinese"}
                  </Text>
                </View>
                <Image
                  source={require("../../assets/setting/right.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: PALETTE.COLOR_BACK,
                  padding: 8,
                  borderRadius: 10,
                }}
                onPress={async () => {
                  setCountryModalOn(false);
                  setCountry("en");
                  await AsyncStorage.setItem("country", "en");
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  <Image
                    source={require("../../assets/live/en.png")}
                    style={{
                      width: 30,
                      height: 30,
                    }}></Image>
                  <Text
                    style={{
                      color: "black",
                      marginLeft: 10,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}>
                    {country === "ko"
                      ? "영어"
                      : country === "ja"
                        ? "英語"
                        : country === "es"
                          ? "Inglés"
                          : country === "fr"
                            ? "Anglais"
                            : country === "id"
                              ? "Inggris"
                              : country === "zh"
                                ? "英语"
                                : "English"}
                  </Text>
                </View>
                <Image
                  source={require("../../assets/setting/right.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 회원탈퇴 확인 모달 */}
        <Modal
          transparent={true}
          visible={showDeleteModal}
          animationType="fade"
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 30,
              width: '100%',
              maxWidth: 350,
              alignItems: 'center',
            }}>
              {/* 경고 아이콘 */}
              <View style={{
                width: 60,
                height: 60,
                backgroundColor: '#FF5555',
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
              }}>
                <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>!</Text>
              </View>

              {/* 제목 */}
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'black',
                marginBottom: 20,
                textAlign: 'center',
              }}>
                {country === "ko"
                  ? "정말 탈퇴하시겠어요?"
                  : country === "ja"
                    ? "本当に退会しますか？"
                    : country === "es"
                      ? "¿Realmente quieres eliminar tu cuenta?"
                      : country === "fr"
                        ? "Voulez-vous vraiment supprimer votre compte ?"
                        : country === "id"
                          ? "Apakah Anda benar-benar ingin menghapus akun?"
                          : country === "zh"
                            ? "您真的要删除账户吗？"
                            : "Do you really want to delete your account?"}
              </Text>

              {/* 설명 텍스트 */}
              <Text style={{
                fontSize: 14,
                color: '#666',
                textAlign: 'center',
                marginBottom: 30,
                lineHeight: 20,
              }}>
                {country === "ko"
                  ? "탈퇴 버튼 선택 시,\n계정은 삭제되며 복구되지 않습니다."
                  : country === "ja"
                    ? "退会ボタンを選択すると、\nアカウントは削除され復旧できません。"
                    : country === "es"
                      ? "Al seleccionar el botón de eliminación,\nla cuenta será eliminada y no se puede recuperar."
                      : country === "fr"
                        ? "En sélectionnant le bouton de suppression,\nle compte sera supprimé et ne peut pas être récupéré."
                        : country === "id"
                          ? "Dengan memilih tombol hapus,\nakun akan dihapus dan tidak dapat dipulihkan."
                          : country === "zh"
                            ? "选择删除按钮后，\n账户将被删除且无法恢复。"
                            : "By selecting the delete button,\nthe account will be deleted and cannot be recovered."}
              </Text>

              {/* 탈퇴 버튼 */}
              <TouchableOpacity
                onPress={async () => {
                  await api
                    .delete("/user/Withdrawal")
                    .then(async (res: any) => {
                      if (res.data.status === "true") {
                        updateUser({
                          id: null,
                          phone: null,
                          link: null,
                          linkChange: null,
                          password: null,
                          email: null,
                          name: null,
                          country: null,
                          nick: null,
                          profile: null,
                          introduce: null,
                          suggestion: null,
                          callState: null,
                          age: null,
                          gender: null,
                          lastVisit: null,
                          attendanceCheck: null,
                          roles: 0,
                          banReason: null,
                          refreshToken: null,
                          pushToken: null,
                          deletedAt: null,
                          createdAt: null,
                          updatedAt: null,
                        });
                        await AsyncStorage.clear();
                        await EncryptedStorage.clear();
                        try {
                          const currentUser = await GoogleSignin.getCurrentUser();
                          if (currentUser) {
                            await GoogleSignin.signOut();
                            console.log('로그아웃 성공');
                          }
                        } catch (error) {
                          console.error('로그아웃 에러:', error);
                        }
                        await auth()?.signOut();
                        navigation.navigate("Login");
                      } else if (res.data.status === "wait") {
                        Alert.alert(
                          country === "ko"
                            ? "탈퇴 신청 완료 되었습니다. 수익 이력이 있다면 1달 이후 탈퇴 신청 되실겁니다."
                            : country === "ja"
                              ? "退会申請が完了しました。収益履歴がある場合は、1か月後に退会申請が処理されます。"
                              : country === "es"
                                ? "La solicitud de cancelación se ha completado. Si tiene un historial de ganancias, la solicitud de cancelación se procesará después de un mes."
                                : country === "fr"
                                  ? "La demande de désinscription a été complétée. Si vous avez un historique de revenus, la demande de désinscription sera traitée après un mois."
                                  : country === "id"
                                    ? "Permohonan pengunduran diri telah selesai. Jika Anda memiliki riwayat pendapatan, permohonan pengunduran diri akan diproses setelah satu bulan."
                                    : country === "zh"
                                      ? "退出申请已完成。如果有收益记录，您的退出申请将在一个月后处理。"
                                      : "Your withdrawal application has been completed. If you have an earnings history, your withdrawal application will be processed after one month.",
                        );
                      }
                    });
                }}
                style={{
                  backgroundColor: '#FF5555',
                  borderRadius: 10,
                  paddingVertical: 15,
                  width: '100%',
                  marginBottom: 10,
                }}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                  {country === "ko"
                    ? "탈퇴"
                    : country === "ja"
                      ? "退会"
                      : country === "es"
                        ? "Eliminar"
                        : country === "fr"
                          ? "Supprimer"
                          : country === "id"
                            ? "Hapus"
                            : country === "zh"
                              ? "删除"
                              : "Delete"}
                </Text>
              </TouchableOpacity>

              {/* 취소 버튼 */}
              <TouchableOpacity
                onPress={() => setShowDeleteModal(false)}
                style={{
                  paddingVertical: 15,
                  width: '100%',
                }}
              >
                <Text style={{
                  color: '#666',
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                  {country === "ko"
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
                              : "Cancel"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View
          style={{
            paddingLeft: vw(4),
            paddingRight: vw(4),
            marginTop: vh(2),
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
                ? "설정"
                : country === "ja"
                  ? "設定"
                  : country === "es"
                    ? "Configuración"
                    : country === "fr"
                      ? "Paramètres"
                      : country === "id"
                        ? "Pengaturan"
                        : country === "zh"
                          ? "设置"
                          : "Settings"}
            </Text>
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
                  marginBottom: -12,
                }}
                onPress={() => {
                  navigation.navigate("Alarm");
                }}>
                <Image
                  source={require("../../assets/live/bell.png")}
                  style={{
                    marginLeft: 10,
                    width: 25,
                    height: 25,
                  }}></Image>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ScrollView
          style={{
            flex: 1,
          }}>
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}>
            <FastImage
              source={{
                uri: user?.profile,
                priority: FastImage.priority.normal,
                //method: 'GET',
              }}
              style={{
                width: vw(30),
                height: vw(30),
                borderRadius: 100,
              }}
              resizeMode={FastImage.resizeMode.cover}></FastImage>
            <View
              style={{
                marginTop: 10,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginRight: 5,
                    color: "black",
                  }}>
                  {user?.nick}
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
                {user?.link}
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  color: "#838383",
                  fontSize: 10,
                }}>
                {user?.email}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("EditProfile");
                }}
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  padding: 10,
                  backgroundColor: PALETTE.COLOR_BROWN,
                  borderRadius: 8,
                  marginTop: 10,
                  marginBottom: 20,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: "white",
                  }}>
                  {country === "ko"
                    ? "프로필 수정하기"
                    : country === "ja"
                      ? "プロフィール編集"
                      : country === "es"
                        ? "Editar perfil"
                        : country === "fr"
                          ? "Modifier le profil"
                          : country === "id"
                            ? "Edit Profil"
                            : country === "zh"
                              ? "编辑个人资料"
                              : "Edit Profile"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: vw(2),
              paddingLeft: vw(4),
              paddingRight: vw(4),
            }}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                padding: 10,
                backgroundColor: PALETTE.WHITE,
                borderRadius: 15,
                height: vh(7),
                flexDirection: "column",
              }}
              onPress={() => {
                navigation.navigate("Gift");
              }}>
              <Image
                source={require("../../assets/chat/gift.png")}
                style={{
                  width: 24,
                  height: 24,
                  marginBottom: 5,
                }}></Image>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "black",
                }}>
                {country === "ko"
                  ? "내아이템"
                  : country === "ja"
                    ? "所持アイテム"
                    : country === "es"
                      ? "Artículos en posesión"
                      : country === "fr"
                        ? "Articles détenus"
                        : country === "id"
                          ? "Item yang Dimiliki"
                          : country === "zh"
                            ? "拥有的物品"
                            : "Owned Items"}
              </Text>
            </TouchableOpacity>
            {user?.exchangeShow === false && (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  padding: 10,
                  backgroundColor: PALETTE.WHITE,
                  borderRadius: 15,
                  height: vh(7),
                }}
                onPress={() => {
                  navigation.navigate("Exchange");
                }}>
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}>
                  <Image
                    source={require("../../assets/setting/money.png")}
                    style={{
                      width: 24,
                      height: 24,
                      marginBottom: 5,
                    }}></Image>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "black",
                    }}>
                    {country === "ko"
                      ? "환전하기"
                      : country === "ja"
                        ? "両替する"
                        : country === "es"
                          ? "Cambiar"
                          : country === "fr"
                            ? "Échanger"
                            : country === "id"
                              ? "Tukar"
                              : country === "zh"
                                ? "兑换"
                                : "Exchange"}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                  }}>
                  {
                    /*
                     <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 10,
                    marginTop: 2,
                    color: PALETTE.COLOR_RED,
                  }}>
                  {country === "ko"
                    ? "실제 돈으로 환급 할수 있어요!"
                    : country === "ja"
                    ? "実際のお金で払い戻しできます！"
                    : country === "es"
                    ? "¡Puede reembolsar dinero real!"
                    : country === "fr"
                    ? "Vous pouvez obtenir un remboursement en argent réel !"
                    : country === "id"
                    ? "Anda dapat mengembalikan uang sungguhan!"
                    : country === "zh"
                    ? "您可以获得实际货币退还！"
                    : "You can get a real money refund!"}
                </Text>
                    */
                  }
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                padding: 10,
                backgroundColor: PALETTE.WHITE,
                borderRadius: 15,
                height: vh(7),
              }}
              onPress={() => {
                navigation.navigate("PurchaseHistory");
                //showPoint({result: {}});
              }}>
              <Image
                source={require("../../assets/setting/point.png")}
                style={{
                  width: 24,
                  height: 24,
                  marginBottom: 5,
                }}></Image>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "black",
                }}>
                {country === "ko"
                  ? "사용내역"
                  : country === "ja"
                    ? "ポイント"
                    : country === "es"
                      ? "Puntos"
                      : country === "fr"
                        ? "Points"
                        : country === "id"
                          ? "Poin"
                          : country === "zh"
                            ? "积分"
                            : "Points"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                padding: 10,
                backgroundColor: PALETTE.WHITE,
                borderRadius: 15,
                height: vh(7),
                flexDirection: "column",
              }}
              onPress={() => {
                navigation.navigate("Store");
              }}>
              <Image
                source={require("../../assets/setting/cart.png")}
                style={{
                  width: 24,
                  height: 24,
                  marginBottom: 5,
                }}></Image>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "black",
                }}>
                {country === "ko"
                  ? "충전하기"
                  : country === "ja"
                    ? "チャージ"
                    : country === "es"
                      ? "Recargar"
                      : country === "fr"
                        ? "Recharger"
                        : country === "id"
                          ? "Isi Ulang"
                          : country === "zh"
                            ? "充值"
                            : "Recharge"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                flexDirection: "column",
                padding: 10,
                backgroundColor: PALETTE.WHITE,
                borderRadius: 15,
                height: vh(7),
              }}
              onPress={async () => {
                await api.put("/user/attendanceCheck/v2").then(async res => {
                  if (res.data.status === "true") {
                    const androidUrl = res.data.androidUrl;
                    const iosUrl = res.data.iosUrl;
                    const webUrl = res.data.webUrl;
                    const price = res.data.price;
                    showCheck({
                      result: {
                        good: true,
                        country,
                        gender: user?.gender,
                        price,
                      },
                    });
                    if (price === 50) {
                      const review = InAppReview.isAvailable();
                      if (review) {
                        await InAppReview.RequestInAppReview()
                          .then(async hasFlowFinishedSuccessfully => {
                            // 3- another option:
                            if (hasFlowFinishedSuccessfully) {
                              // do something for ios
                            }
                          })
                          .catch(error => {
                            console.log(error);
                          });
                      }
                    } else {
                      const linkOrReview = Math.floor(Math.random() * 2);
                      if (linkOrReview) {
                        await InAppReview.RequestInAppReview()
                          .then(async hasFlowFinishedSuccessfully => {
                            // 3- another option:
                            if (hasFlowFinishedSuccessfully) {
                              // do something for ios
                            }
                          })
                          .catch(error => {
                            console.log(error);
                          });
                      } else {
                        if (webUrl) {
                          await Linking.openURL(webUrl);
                        } else if (androidUrl && iosUrl) {
                          if (Platform.OS === "android") {
                            await Linking.openURL(androidUrl);
                          } else {
                            await Linking.openURL(iosUrl);
                          }
                        }
                      }
                    }
                  } else {
                    showCheck({
                      result: {
                        good: false,
                        country,
                        gender: user?.gender,
                        price: 0,
                      },
                    });
                  }
                });
              }}>
              <Image
                source={require("../../assets/setting/celebration.png")}
                style={{
                  width: 24,
                  height: 24,
                  marginBottom: 5,
                }}></Image>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "black",
                }}>
                {country === "ko"
                  ? "출석체크"
                  : country === "ja"
                    ? "出席確認"
                    : country === "es"
                      ? "Chequeo de asistencia"
                      : country === "fr"
                        ? "Vérification de la présence"
                        : country === "id"
                          ? "Check-in"
                          : country === "zh"
                            ? "签到"
                            : "Attendance check"}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: vh(2),
              paddingLeft: vw(4),
              paddingRight: vw(4),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: vh(1),
                paddingBottom: vh(1),
              }}
              onPress={() => {
                setCountryModalOn(true);
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: "black",
                }}>
                {country === "ko"
                  ? "언어 선택"
                  : country === "ja"
                    ? "言語選択"
                    : country === "es"
                      ? "Seleccionar idioma"
                      : country === "fr"
                        ? "Choisir la langue"
                        : country === "id"
                          ? "Pilih bahasa"
                          : country === "zh"
                            ? "选择语言"
                            : "Language selection"}
              </Text>
              <Image
                source={require("../../assets/setting/right.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
            {user?.roles === USER_ROLE.COMPANY_USER && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: vh(1),
                  paddingBottom: vh(1),
                }}
                onPress={() => {
                  navigation.navigate("Mcn");
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: "black",
                  }}>
                  MCN 크리에이터 관리
                </Text>
                <Image
                  source={require("../../assets/setting/right.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
            )}
            {/*
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: vh(1),
                paddingBottom: vh(1),
              }}
              onPress={() => {
                navigation.navigate("SelfCamera");
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: "black",
                }}>
                {country === "ko"
                  ? "AI 필터 세팅"
                  : country === "ja"
                  ? "AIフィルター設定"
                  : country === "es"
                  ? "Configuración del filtro de IA"
                  : country === "fr"
                  ? "Paramétrage du filtre AI"
                  : country === "id"
                  ? "Pengaturan filter AI"
                  : country === "zh"
                  ? "AI过滤器设置"
                  : "AI filter setting"}
              </Text>
              <Image
                source={require("../../assets/setting/right.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
            */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: vh(1),
                paddingBottom: vh(1),
              }}
              onPress={() => {
                navigation.navigate("Profile", {
                  YouId: user?.id,
                });
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: "black",
                }}>
                {country === "ko"
                  ? "내 프로필"
                  : country === "ja"
                    ? "私のプロフィールページ"
                    : country === "es"
                      ? "mi pagina de perfil"
                      : country === "fr"
                        ? "ma page de profil"
                        : country === "id"
                          ? "halaman profil saya"
                          : country === "zh"
                            ? "我的个人资料页面"
                            : "my profile page"}
              </Text>
              <Image
                source={require("../../assets/setting/right.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
            {
              /*
              <TouchableOpacity
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: vh(1),
                paddingBottom: vh(1),
              }}
              onPress={() => {
                if (user.country === "ko" && !user?.real_birthday) {
                  navigation.push("CertificationIn");
                } else {
                  navigation.push("MakeSubscribe");
                }
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `멤버십 생성`
                    : country === "ja"
                      ? `メンバーシップの作成`
                      : country === "es"
                        ? `Crear membresía`
                        : country === "fr"
                          ? `Créer une adhésion`
                          : country === "id"
                            ? `Buat keanggotaan`
                            : country === "zh"
                              ? `创建会员资格`
                              : `Create membership`}
                </Text>
              </View>

              <Image
                source={require("../../assets/setting/right.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>

              */
            }
            {user?.gender === USER_GENDER.GIRL && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: vh(1),
                  paddingBottom: vh(1),
                }}
                onPress={() => {
                  navigation.push("VideoCallPrice");
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: "black",
                  }}>
                  {country === "ko"
                    ? "영상통화 가격 설정"
                    : country === "ja"
                      ? "ビデオ通話価格設定"
                      : country === "es"
                        ? "Configuración de precios de videollamadas"
                        : country === "fr"
                          ? "Paramètres de tarification des appels vidéo"
                          : country === "id"
                            ? "Setelan harga panggilan video"
                            : country === "zh"
                              ? "视频通话定价设置"
                              : "Video call pricing settings"}
                </Text>
                <Image
                  source={require("../../assets/setting/right.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
            )}
            {
              /*
              <TouchableOpacity
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: vh(1),
                paddingBottom: vh(1),
              }}
              onPress={() => {
                navigation.push("MySubscribe");
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: "black",
                }}>
                {country === "ko"
                  ? "내 구독 리스트"
                  : country === "ja"
                    ? "マイサブスクリプションリスト"
                    : country === "es"
                      ? "Mi lista de suscripciones"
                      : country === "fr"
                        ? "Ma liste d'abonnements"
                        : country === "id"
                          ? "Daftar berlangganan saya"
                          : country === "zh"
                            ? "我的订阅列表"
                            : "My subscription list"}
              </Text>
              <Image
                source={require("../../assets/setting/right.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
            
              */
            }
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: vh(1),
                paddingBottom: vh(1),
              }}
              onPress={() => {
                navigation.push("Ban");
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: "black",
                }}>
                {country === "ko"
                  ? "차단목록"
                  : country === "ja"
                    ? "ブロックリスト"
                    : country === "es"
                      ? "Lista de bloqueados"
                      : country === "fr"
                        ? "Liste de blocage"
                        : country === "id"
                          ? "Daftar Diblokir"
                          : country === "zh"
                            ? "封锁名单"
                            : "Block list"}
              </Text>
              <Image
                source={require("../../assets/setting/right.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: vh(1),
                paddingBottom: vh(1),
              }}
              onPress={() => {
                navigation.navigate("AlarmSetting");
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: "black",
                }}>
                {country === "ko"
                  ? "알림 설정"
                  : country === "ja"
                    ? "通知設定"
                    : country === "es"
                      ? "Configuración de notificaciones"
                      : country === "fr"
                        ? "Paramètres de notification"
                        : country === "id"
                          ? "Pengaturan Pemberitahuan"
                          : country === "zh"
                            ? "通知设置"
                            : "Notification Settings"}
              </Text>
              <Image
                source={require("../../assets/setting/right.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>

            {!snsCheck && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: vh(1),
                  paddingBottom: vh(1),
                }}
                onPress={() => {
                  navigation.navigate("ChangePassword");
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: "black",
                  }}>
                  {country === "ko"
                    ? "비밀번호 변경"
                    : country === "ja"
                      ? "パスワード変更"
                      : country === "es"
                        ? "Cambiar la contraseña"
                        : country === "fr"
                          ? "Changer le mot de passe"
                          : country === "id"
                            ? "Ganti kata sandi"
                            : country === "zh"
                              ? "更改密码"
                              : "Change Password"}
                </Text>
                <Image
                  source={require("../../assets/setting/right.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: vh(1),
                paddingBottom: vh(1),
              }}
              onPress={() => {
                navigation.push("Privacy");
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: "black",
                }}>
                {country === "ko"
                  ? "개인정보 처리방침"
                  : country === "ja"
                    ? "個人情報保護方針"
                    : country === "es"
                      ? "Política de privacidad"
                      : country === "fr"
                        ? "Politique de confidentialité"
                        : country === "id"
                          ? "Kebijakan Privasi"
                          : country === "zh"
                            ? "隐私政策"
                            : "Privacy Policy"}
              </Text>
              <Image
                source={require("../../assets/setting/right.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: vh(1),
                paddingBottom: vh(1),
              }}
              onPress={() => {
                navigation.push("Tou");
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: "black",
                }}>
                {country === "ko"
                  ? "이용약관"
                  : country === "ja"
                    ? "利用規約"
                    : country === "es"
                      ? "Términos de servicio"
                      : country === "fr"
                        ? "Conditions d'utilisation"
                        : country === "id"
                          ? "Syarat Penggunaan"
                          : country === "zh"
                            ? "使用条款"
                            : "Terms of Service"}
              </Text>
              <Image
                source={require("../../assets/setting/right.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: vh(1),
                paddingBottom: vh(1),
              }}
              onPress={async () => {
                await api.post("/room/createRoomAdmin").then(async res => {
                  if (res.data.status === "true") {
                    const RoomId: number = res.data.RoomId;
                    navigation.navigate("Chat", {
                      RoomId,
                      admin: true,
                    });
                  }
                });
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: "black",
                }}>
                {country === "ko"
                  ? "고객센터"
                  : country === "ja"
                    ? "カスタマーサービス"
                    : country === "es"
                      ? "Servicio al Cliente"
                      : country === "fr"
                        ? "Service Client"
                        : country === "id"
                          ? "Layanan Pelanggan"
                          : country === "zh"
                            ? "客服中心"
                            : "Customer Service"}
              </Text>
              <Image
                source={require("../../assets/setting/right.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: vh(1),
                paddingBottom: vh(1),
              }}
              onPress={() => {
                setShowDeleteModal(true);
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: "black",
                }}>
                {country === "ko"
                  ? "회원탈퇴"
                  : country === "ja"
                    ? "退会"
                    : country === "es"
                      ? "Eliminar cuenta"
                      : country === "fr"
                        ? "Supprimer le compte"
                        : country === "id"
                          ? "Hapus Akun"
                          : country === "zh"
                            ? "删除账户"
                            : "Delete Account"}
              </Text>
            </TouchableOpacity>
            {/*
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: vh(1),
                paddingBottom: vh(1),
              }}
              onPress={() => {
                navigation.push("Account");
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: "black",
                }}>
                {country === "ko"
                  ? "계정설정"
                  : country === "ja"
                    ? "アカウント設定"
                    : country === "es"
                      ? "Configuración de cuenta"
                      : country === "fr"
                        ? "Paramètres du compte"
                        : country === "id"
                          ? "Pengaturan Akun"
                          : country === "zh"
                            ? "帐户设置"
                            : "Account Settings"}
              </Text>
              <Image
                source={require("../../assets/setting/right.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
            */}
            {/*
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: vh(1),
                paddingBottom: vh(1),
              }}
              onPress={() => {}}>
              <Text
                style={{
                  fontSize: 16,
                }}>
                로그아웃
              </Text>
              <Image
                source={require("../../assets/setting/right.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
              */}
          </View>
          <View
            style={{
              height: 20,
            }}></View>
        </ScrollView>
        <View
          style={{
            height: vh(6),
            width: vw(100),
          }}></View>
      </View>
    </NotchView>
  );
}
