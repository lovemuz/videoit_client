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
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Loading from "../reusable/loading";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ToastComponent } from "../reusable/useToast";

export default function EditProfile({
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
  const [nick, setNick] = useState(user?.nick);
  const [link, setLink] = useState(user?.link);

  const [urlFormData, setUrlFormData] = useState(null);
  const [possibleLink, setPossibleLink] = useState(true);
  const [introduce, setIntroduce] = useState(user?.introduce);
  const [profile, setProfile] = useState(user?.profile);

  const [urlBackFormData, setUrlBackFormData] = useState(null);
  const [background, setBackground] = useState(user?.background);

  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["bottom"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={Platform.OS === "ios" ? "light-content" : "dark-content"}
      />
      {loading === true && <Loading></Loading>}
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            marginTop: Platform.OS === "ios" ? vh(2) : insets.top,
          }}>
          <View
            style={{
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
              flexDirection: "row",
              height: vh(6),
              paddingLeft: vw(4),
              paddingRight: vw(4),
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
                  ? "프로필 수정하기"
                  : country === "ja"
                    ? "プロフィールの編集"
                    : country === "es"
                      ? "Editar perfil"
                      : country === "fr"
                        ? "Modifier le profil"
                        : country === "id"
                          ? "Edit profil"
                          : country === "zh"
                            ? "编辑个人资料"
                            : "Edit Profile"}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={async e => {
                const regExp = /^[@|a-z|A-Z|0-9|_|]+$/;
                if (!regExp.test(link)) {
                  Alert.alert(
                    country === "ko"
                      ? "가능한 유저네임을 입력해주세요."
                      : country === "ja"
                        ? "利用可能なユーザーネームを入力してください。"
                        : country === "es"
                          ? "Por favor, ingrese un nombre de usuario disponible."
                          : country === "fr"
                            ? "Veuillez entrer un nom d'utilisateur disponible."
                            : country === "id"
                              ? "Silakan masukkan username yang tersedia."
                              : country === "zh"
                                ? "请输入可用的用户名。"
                                : "Please enter an available username.",
                  );

                  return;
                }

                if (!possibleLink) {
                  Alert.alert(
                    country === "ko"
                      ? "가능한 유저네임을 입력해주세요."
                      : country === "ja"
                        ? "利用可能なユーザーネームを入力してください。"
                        : country === "es"
                          ? "Por favor, ingrese un nombre de usuario disponible."
                          : country === "fr"
                            ? "Veuillez entrer un nom d'utilisateur disponible."
                            : country === "id"
                              ? "Silakan masukkan username yang tersedia."
                              : country === "zh"
                                ? "请输入可用的用户名。"
                                : "Please enter an available username.",
                  );

                  return;
                } else if (nick.length < 1) {
                  Alert.alert(
                    country === "ko"
                      ? "닉네임을 입력해주세요."
                      : country === "ja"
                        ? "ニックネームを入力してください。"
                        : country === "es"
                          ? "Ingrese un apodo."
                          : country === "fr"
                            ? "Veuillez entrer un surnom."
                            : country === "id"
                              ? "Masukkan nama panggilan."
                              : country === "zh"
                                ? "请输入昵称。"
                                : "Please enter a nickname.",
                  );

                  return;
                } else if (link.length < 2) {
                  Alert.alert(
                    country === "ko"
                      ? "유저네임을 입력해주세요."
                      : country === "ja"
                        ? "ユーザーネームを入力してください。"
                        : country === "es"
                          ? "Ingrese un nombre de usuario."
                          : country === "fr"
                            ? "Veuillez entrer un nom d'utilisateur."
                            : country === "id"
                              ? "Masukkan nama pengguna."
                              : country === "zh"
                                ? "请输入用户名。"
                                : "Please enter a username.",
                  );

                  return;
                }

                setLoading(true);
                let profileURL: any = profile;
                if (urlFormData) {
                  await api
                    .post(`/etc/addimg/auth`, urlFormData, {
                      headers: { "Content-Type": "multipart/form-data" },
                    })
                    .then(async res => {
                      profileURL = res.data.url;
                    });
                }
                let backgroundURL: any = background;
                if (urlBackFormData) {
                  await api
                    .post(`/etc/addimg/auth`, urlBackFormData, {
                      headers: { "Content-Type": "multipart/form-data" },
                    })
                    .then(async res => {
                      backgroundURL = res.data.url;
                    });
                }
                await api
                  .put("/user/updateIntroduce", {
                    nick,
                    link,
                    introduce,
                    profile: profileURL,
                    background: backgroundURL,
                  })
                  .then(res => {
                    if (res.data.status === "true") {
                      updateUser({
                        ...user,
                        nick,
                        link,
                        introduce,
                        profile: profileURL,
                        background: backgroundURL,
                        linkChange: link !== user.link ? true : false,
                      });
                      Alert.alert(
                        country === "ko"
                          ? "변경 되었습니다."
                          : country === "ja"
                            ? "変更されました。"
                            : country === "es"
                              ? "Cambiado con éxito."
                              : country === "fr"
                                ? "Changé avec succès."
                                : country === "id"
                                  ? "Berhasil diubah."
                                  : country === "zh"
                                    ? "更改成功。"
                                    : "Changed successfully.",
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
                setLoading(false);
              }}>
              <Text
                style={{
                  color: PALETTE.COLOR_SKY,
                  fontSize: 18,
                }}>
                {country === "ko"
                  ? "완료"
                  : country === "ja"
                    ? "完了"
                    : country === "es"
                      ? "Completado"
                      : country === "fr"
                        ? "Terminé"
                        : country === "id"
                          ? "Selesai"
                          : country === "zh"
                            ? "完成"
                            : "Completed"}
              </Text>
            </TouchableOpacity>
          </View>
          <KeyboardAwareScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            enableAutomaticScroll={true}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  paddingLeft: vw(4),
                  paddingRight: vw(4),
                }}>
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    marginTop: vh(2),
                    marginBottom: vh(2),
                  }}>
                  <TouchableOpacity
                    style={{
                      //paddingLeft: -vw(4),
                      //marginRight: -vw(4),
                      //width: vw(100),
                      marginBottom: vh(2),
                    }}
                    onPress={async e => {
                      const result: any = await launchImageLibrary({
                        mediaType: "photo", //'mixed',
                        maxHeight: 400,
                        quality: 0.2,
                      });
                      if (result.didCancel === true) return;
                      //setLoadingState(true);
                      setBackground(result.assets[0].uri);
                      const formData: any = new FormData();
                      formData.append("file", {
                        uri: result.assets[0].uri,
                        name: result.assets[0].uri,
                        type: result.assets[0].type,
                      });
                      setUrlBackFormData(formData);
                    }}>
                    <FastImage
                      source={{
                        uri: background,
                        priority: FastImage.priority.normal,
                      }}
                      style={{
                        width: vw(100),
                        height: 220,
                      }}
                      resizeMode={FastImage.resizeMode.cover}></FastImage>
                    <View
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        height: 40,
                        width: 40,
                        borderRadius: 100,
                        position: "absolute",
                        zIndex: 2,
                        right: vw(6),
                        top: vh(1),
                      }}>
                      <Image
                        source={require("../../assets/setting/add.png")}
                        style={{
                          width: 40,
                          height: 40,
                        }}></Image>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                   style={{
                          marginTop: -vw(17),
                        }}
                    onPress={async e => {
                      const result: any = await launchImageLibrary({
                        mediaType: "photo", //'mixed',
                        maxHeight: 400,
                        quality: 0.2,
                      });
                      if (result.didCancel === true) return;
                      //setLoadingState(true);
                      setProfile(result.assets[0].uri);
                      const formData: any = new FormData();
                      formData.append("file", {
                        uri: result.assets[0].uri,
                        name: result.assets[0].uri,
                        type: result.assets[0].type,
                      });
                      setUrlFormData(formData);

                      Alert.alert(
                        country === "ko"
                          ? "커뮤니티 위반 사진을 프로필 사진으로 적용시 즉각 형사 소송 절차에 들어가게 됩니다. 유의 바랍니다."
                          : country === "ja"
                            ? "コミュニティ違反の写真をプロフィール写真として適用すると、すぐに刑事訴訟手続きに入ります。注意してください。"
                            : country === "es"
                              ? "Si utiliza una foto de violación de la comunidad como su foto de perfil, estará sujeto a un proceso penal inmediato. Tenga en cuenta."
                              : country === "fr"
                                ? "Si vous utilisez une photo de violation de la communauté comme photo de profil, vous serez soumis à des poursuites pénales immédiates. Veuillez noter."
                                : country === "id"
                                  ? "Jika Anda menggunakan foto pelanggaran komunitas sebagai foto profil Anda, Anda akan segera dikenakan proses pidana. Tolong dicatat."
                                  : country === "zh"
                                    ? "如果您使用社区违规照片作为个人资料照片，您将立即受到刑事诉讼。请注意。"
                                    : "If you use a community violation photo as your profile photo, you will be subject to immediate criminal proceedings. Please note..",
                      );
                    }}>
                    <FastImage
                      source={{
                        uri: profile,
                        priority: FastImage.priority.normal,
                      }}
                      style={{
                        width: vw(25),
                        height: vw(25),
                        borderRadius: 100,
                      }}
                      resizeMode={FastImage.resizeMode.cover}></FastImage>
                    <View
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        height: 40,
                        width: 40,
                        borderRadius: 100,
                        position: "absolute",
                        zIndex: 2,
                        right: -5,
                      }}>
                      <Image
                        source={require("../../assets/setting/add.png")}
                        style={{
                          width: 40,
                          height: 40,
                        }}></Image>
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      marginTop: 10,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}></View>
                </View>
              </View>

              <View
                style={{
                  paddingLeft: vw(4),
                  paddingRight: vw(4),
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    color: "black",
                  }}>
                  {country === "ko"
                    ? "닉네임"
                    : country === "ja"
                      ? "ニックネーム"
                      : country === "es"
                        ? "Apodo"
                        : country === "fr"
                          ? "Pseudo"
                          : country === "id"
                            ? "Nama panggilan"
                            : country === "zh"
                              ? "昵称"
                              : "Nickname"}
                </Text>
                <TextInput
                  style={{
                    color: "black",
                    borderWidth: 1,
                    borderColor: PALETTE.COLOR_BORDER,
                    padding: 10,
                    width: "100%",
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                  value={nick}
                  onChangeText={(e: any) => {
                    if (e.length >= 40) return;
                    setNick(e);
                  }}></TextInput>
                <Text
                  style={{
                    fontSize: 12,
                    marginTop: 5,
                    marginBottom: 5,
                    color: "#838383",
                  }}>
                  {country === "ko"
                    ? "한글, 영문, 숫자, 특수문자, 이모티콘 입력이 가능합니다."
                    : country === "ja"
                      ? "ひらがな、カタカナ、漢字、英数字、特殊文字、絵文字が入力できます。"
                      : country === "es"
                        ? "Se permiten caracteres en coreano, inglés, números, caracteres especiales y emojis."
                        : country === "fr"
                          ? "Les caractères en coréen, en anglais, les chiffres, les caractères spéciaux et les emojis sont autorisés."
                          : country === "id"
                            ? "Karakter dalam bahasa Korea, Inggris, angka, karakter khusus, dan emoji diperbolehkan."
                            : country === "zh"
                              ? "可以输入韩文、英文、数字、特殊字符和表情符号。"
                              : "Korean, English, numbers, special characters, and emojis are allowed."}
                </Text>

                <Text
                  style={{
                    marginTop: vh(2),
                    fontSize: 18,
                    fontWeight: "500",
                    color: "black",
                  }}>
                  {country === "ko"
                    ? "유저네임"
                    : country === "ja"
                      ? "ユーザーネーム"
                      : country === "es"
                        ? "Nombre de usuario"
                        : country === "fr"
                          ? "Nom d'utilisateur"
                          : country === "id"
                            ? "Nama pengguna"
                            : country === "zh"
                              ? "用户名"
                              : "Username"}
                </Text>
                {user?.linkChange === false ? (
                  <TextInput
                    style={{
                      color: "black",
                      borderWidth: 1,
                      borderColor: PALETTE.COLOR_BORDER,
                      padding: 10,
                      width: "100%",
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                    value={link}
                    onChangeText={async (e: any) => {
                      if (e.length >= 30) return;
                      let parseE = e;
                      if (e.slice(0, 1) !== "@") {
                        parseE = "@" + parseE;
                      }
                      const regExp = /^[@|a-z|A-Z|0-9|_|]+$/;
                      if (!regExp.test(parseE)) return;

                      await api
                        .get("/user/possibleLinkCheck", {
                          params: {
                            link: parseE,
                          },
                        })
                        .then(res => {
                          if (res.data.status === "true") {
                            if (res.data.result === true) setPossibleLink(true);
                            else setPossibleLink(false);
                          }
                        });
                      setLink(parseE);
                    }}></TextInput>
                ) : (
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: PALETTE.COLOR_BORDER,
                      padding: 10,
                      width: "100%",
                      borderRadius: 10,
                      marginTop: 10,
                    }}>
                    <Text
                      style={{
                        color: "black",
                      }}>
                      {user?.link}
                    </Text>
                  </View>
                )}
                {possibleLink === false && (
                  <Text
                    style={{
                      color: "red",
                      marginTop: 5,
                      marginBottom: 5,
                      fontSize: 12,
                    }}>
                    {country === "ko"
                      ? "사용할 수 없는 유저네임입니다."
                      : country === "ja"
                        ? "使用できないユーザーネームです。"
                        : country === "es"
                          ? "Nombre de usuario no disponible."
                          : country === "fr"
                            ? "Nom d'utilisateur non disponible."
                            : country === "id"
                              ? "Nama pengguna tidak tersedia."
                              : country === "zh"
                                ? "用户名不可用。"
                                : "Username is not available."}
                  </Text>
                )}

                <Text
                  style={{
                    fontSize: 12,
                    marginTop: 5,
                    marginBottom: 2,
                    color: "#838383",
                  }}>
                  {country === "ko"
                    ? "영문, 숫자만 입력 가능합니다."
                    : country === "ja"
                      ? "英数字のみが入力できます。"
                      : country === "es"
                        ? "Solo se pueden ingresar letras y números."
                        : country === "fr"
                          ? "Seuls les lettres et les chiffres sont autorisés."
                          : country === "id"
                            ? "Hanya huruf dan angka yang dapat dimasukkan."
                            : country === "zh"
                              ? "只能输入英文字母和数字。"
                              : "Only letters and numbers are allowed."}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#838383",
                  }}>
                  {country === "ko"
                    ? `유저네임은 1회 변경이 가능합니다.`
                    : country === "ja"
                      ? `ユーザーネームは1回変更が可能です。`
                      : country === "es"
                        ? `Puedes cambiar tu nombre de usuario una vez.`
                        : country === "fr"
                          ? `Vous pouvez modifier votre nom d'utilisateur une fois.`
                          : country === "id"
                            ? `Anda dapat mengubah nama pengguna Anda satu kali.`
                            : country === "zh"
                              ? `您可以更改一次用户名。`
                              : `You can change your username once.`}
                </Text>

                <Text
                  style={{
                    marginTop: vh(2),
                    fontSize: 18,
                    fontWeight: "500",
                    color: "black",
                  }}>
                  {country === "ko"
                    ? `자기소개`
                    : country === "ja"
                      ? `自己紹介`
                      : country === "es"
                        ? `Acerca de mí`
                        : country === "fr"
                          ? `Sur moi`
                          : country === "id"
                            ? `Tentang saya`
                            : country === "zh"
                              ? `关于我`
                              : `About Me`}
                </Text>
                <TextInput
                  multiline={true}
                  textAlignVertical="top"
                  style={{
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    borderWidth: 1,
                    borderColor: PALETTE.COLOR_BORDER,
                    paddingTop: 15,
                    paddingBottom: 15,
                    padding: 10,
                    width: "100%",
                    minHeight: 200,
                    borderRadius: 10,
                    marginTop: 10,
                    color: "black",
                  }}
                  value={introduce}
                  onChangeText={(e: any) => {
                    if (e.length >= 300) return;
                    setIntroduce(e);
                  }}
                  placeholder={
                    country === "ko"
                      ? `자기소개를 입력하세요.`
                      : country === "ja"
                        ? `自己紹介を入力してください。`
                        : country === "es"
                          ? `Por favor ingrese su autopresentación.`
                          : country === "fr"
                            ? `Veuillez entrer votre auto-présentation.`
                            : country === "id"
                              ? `Silakan masukkan perkenalan diri Anda.`
                              : country === "zh"
                                ? `请输入您的自我介绍。`
                                : `Please enter your self-introduction.`
                  }></TextInput>
              </View>
              <View
                style={{
                  height: vh(20),
                  width: vh(100),
                }}></View>
            </ScrollView>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </NotchView>
  );
}
