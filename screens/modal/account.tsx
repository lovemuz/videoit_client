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
import EncryptedStorage from "react-native-encrypted-storage";
import Share from "react-native-share";
import FastImage from "react-native-fast-image";
import Clipboard from "@react-native-clipboard/clipboard";
import api from "../../lib/api/api";
import { PALETTE } from "../../lib/constant/palette";
import serverURL from "../../lib/constant/serverURL";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { USER_ROLE } from "../../lib/constant/user-constant";
import {
  GoogleSignin,
  isSuccessResponse,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

export default function Account({
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
  const insets = useSafeAreaInsets();
  return (
    <NotchView top={"#ffffff"} bottom={"#f4f4f4"} edges={["bottom"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={Platform.OS === "ios" ? "light-content" : "dark-content"}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: "#f4f4f4",
        }}>
        <View
          style={{
            paddingTop: Platform.OS === "ios" ? vh(2) : insets.top,
            paddingLeft: vw(4),
            paddingRight: vw(4),
            backgroundColor: PALETTE.COLOR_WHITE,
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
                  ? "계정 설정"
                  : country === "ja"
                    ? "アカウント設定"
                    : country === "es"
                      ? "Configuración de la cuenta"
                      : country === "fr"
                        ? "Paramètres du compte"
                        : country === "id"
                          ? "Pengaturan akun"
                          : country === "zh"
                            ? "帐户设置"
                            : "Account settings"}
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
            backgroundColor: PALETTE.COLOR_WHITE,
            marginTop: vh(2),
          }}>
          <View style={{}}>
            <TouchableOpacity
              style={{
                paddingTop: vh(2),
                paddingBottom: vh(2),
              }}
              onPress={async () => {
                Alert.alert(
                  country === "ko"
                    ? `계정을 삭제하시겠습니까?`
                    : country === "ja"
                      ? `アカウントを削除してもよろしいですか？`
                      : country === "es"
                        ? `¿Estás seguro de que quieres eliminar tu cuenta?`
                        : country === "fr"
                          ? `Êtes-vous sûr de vouloir supprimer votre compte ?`
                          : country === "id"
                            ? `Apakah Anda yakin ingin menghapus akun Anda?`
                            : country === "zh"
                              ? `您确定要删除您的帐户吗？`
                              : `Are you sure you want to delete your account?`,
                  country === "ko"
                    ? "계정 삭제시 보유 포인트는 전부 소멸 됩니다. 동의하시면 확인을 눌러 주세요."
                    : country === "ja"
                      ? "アカウントを削除するとポイントはすべて失われます。同意する場合は確認ボタンをクリックしてください。"
                      : country === "es"
                        ? "Si elimina su cuenta, todos sus puntos se perderán. Si está de acuerdo, haga clic en Aceptar."
                        : country === "fr"
                          ? "La suppression de votre compte entraînera la perte de tous vos points. Cliquez sur OK si vous êtes d'accord."
                          : country === "id"
                            ? "Menghapus akun akan mengakibatkan kehilangan semua poin Anda. Jika Anda setuju, silakan tekan tombol konfirmasi."
                            : country === "zh"
                              ? "删除帐户将导致您所有的积分丧失。如果您同意，请点击确认按钮。"
                              : "Deleting your account will result in the loss of all your points. Click 'Confirm' if you agree.",
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
                      },
                    },
                  ],
                );
              }}>
              <Text
                style={{
                  fontWeight: "400",
                  color: "red",
                }}>
                {country === "ko"
                  ? `회원 탈퇴`
                  : country === "ja"
                    ? `会員退会`
                    : country === "es"
                      ? `Darse de baja como miembro`
                      : country === "fr"
                        ? `Résilier l'adhésion`
                        : country === "id"
                          ? `Berhenti menjadi anggota`
                          : country === "zh"
                            ? `取消会员资格`
                            : `Withdraw membership`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </NotchView>
  );
}
