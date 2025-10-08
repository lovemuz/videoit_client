import React, {useEffect, useState, useRef} from "react";
import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  NativeEventEmitter,
  NativeModules,
  Linking,
} from "react-native";
import SocketIOClient from "socket.io-client";
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from "react-native-webrtc";
import {NotchProvider, NotchView} from "react-native-notchclear";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {vw, vh, vmin, vmax} from "react-native-css-vh-vw";
import api from "../../lib/api/api";
import {PALETTE} from "../../lib/constant/palette";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import Loading from "../reusable/loading";
import {useIsFocused} from "@react-navigation/native";

export default function SelfCamera({
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
  const [timer, setTimer] = useState(0);

  const [showFilterModal, setShowFilterModal] = useState(true);
  const [currentType, setCurrentType] = useState("bright");

  const [brightValue, setBrightValue] = useState(10);
  const [skinValue, setSkinValue] = useState(10);
  const [noseValue, setNoseValue] = useState(10);
  const [eyeValue, setEyeValue] = useState(10);
  const [headValue, setHeadValue] = useState(10);

  useEffect(() => {
    async function getFilterValue() {
      setBrightValue(Number(await AsyncStorage.getItem("brightValue")));
      setSkinValue(Number(await AsyncStorage.getItem("skinValue")));
      setNoseValue(Number(await AsyncStorage.getItem("noseValue")));
      setEyeValue(Number(await AsyncStorage.getItem("eyeValue")));
      setHeadValue(Number(await AsyncStorage.getItem("headValue")));
    }
    getFilterValue();
  }, []);

  useEffect(() => {
    async function fetchData() {
      await api.get("/point/getMyPoint").then(res => {
        updatePoint(res.data.point);
      });
    }
    fetchData();
  }, []);

  const [localStream, setlocalStream]: any = useState(null);

  useEffect(() => {
    async function mediaDeviceInit() {
      let isFront = true;
      await mediaDevices.enumerateDevices().then(async (sourceInfos: any) => {
        let videoSourceId;
        for (let i = 0; i < sourceInfos.length; i++) {
          const sourceInfo = sourceInfos[i];
          if (
            sourceInfo?.kind == "videoinput" &&
            sourceInfo?.facing == (isFront ? "user" : "environment")
          ) {
            videoSourceId = sourceInfo?.deviceId;
          }
        }
        await mediaDevices
          .getUserMedia({
            audio: true,
            video: {
              mandatory: {
                minWidth: vw(100), // Provide your own width, height and frame rate here
                minHeight: vh(100),
                minFrameRate: 60,
              },
              facingMode: isFront ? "user" : "environment",
              optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
            },
          })
          .then(async (stream: any) => {
            console.log();
            console.log(stream);
            console.log(stream?.path);
            console.log();
            setlocalStream(stream);
          })
          .catch(error => {
            console.log("stream error");
            console.error(error);
          });
      });
    }
    mediaDeviceInit();
  }, []);

  function switchCamera() {
    localStream.getVideoTracks().forEach((track: any) => {
      track._switchCamera();
    });
  }

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) {
      async function outFetch() {
        setlocalStream(null);
      }
      outFetch();
    }
  }, [isFocused]);

  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["left"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={"light-content"}
      />

      {showFilterModal && (
        <View
          style={{
            position: "absolute",
            zIndex: 5,
            bottom: 0,
            height: vh(35),
            width: vw(100),
            justifyContent: "space-between",
          }}>
          <View
            style={{
              height: "20%",
              paddingLeft: vw(4),
              paddingRight: vw(4),
              // justifyContent:'center',
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}>
            <View
              style={{
                width: "10%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}>
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                }}
                onPress={() => {
                  if (currentType === "bright") {
                    setBrightValue(10);
                    AsyncStorage.setItem("brightValue", String(10));
                  } else if (currentType === "skin") {
                    setSkinValue(10);
                    AsyncStorage.setItem("skinValue", String(10));
                  } else if (currentType === "eye") {
                    setEyeValue(10);
                    AsyncStorage.setItem("eyeValue", String(10));
                  } else if (currentType === "nose") {
                    setNoseValue(10);
                    AsyncStorage.setItem("noseValue", String(10));
                  } else if (currentType === "head") {
                    setHeadValue(10);
                    AsyncStorage.setItem("headValue", String(10));
                  }
                }}>
                <Image
                  source={require("../../assets/setting/refreshW.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingLeft: vw(2),
                paddingRight: vw(2),
                width: "80%",
                height: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}>
              <Slider
                style={{width: "100%"}}
                minimumValue={0}
                maximumValue={100}
                thumbTintColor={"#ffffff"}
                value={
                  currentType === "bright"
                    ? brightValue
                    : currentType === "skin"
                    ? skinValue
                    : currentType === "eye"
                    ? eyeValue
                    : currentType === "nose"
                    ? noseValue
                    : headValue
                }
                onValueChange={e => {
                  if (currentType === "bright") {
                    setBrightValue(e);
                    AsyncStorage.setItem("brightValue", String(e.toFixed()));
                  } else if (currentType === "skin") {
                    setSkinValue(e);
                    AsyncStorage.setItem("skinValue", String(e.toFixed()));
                  } else if (currentType === "eye") {
                    setEyeValue(e);
                    AsyncStorage.setItem("eyeValue", String(e.toFixed()));
                  } else if (currentType === "nose") {
                    setNoseValue(e);
                    AsyncStorage.setItem("noseValue", String(e.toFixed()));
                  } else if (currentType === "head") {
                    setHeadValue(e);
                    AsyncStorage.setItem("headValue", String(e.toFixed()));
                  }
                }}
                minimumTrackTintColor={PALETTE.COLOR_RED}
                maximumTrackTintColor={PALETTE.COLOR_ICON}
              />
            </View>
            <View
              style={{
                width: "10%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}></View>
          </View>
          <View
            style={{
              height: "80%",
              backgroundColor: PALETTE.COLOR_WHITE,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingLeft: vw(4),
              paddingRight: vw(4),
            }}>
            <View
              style={{
                height: "35%",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 18,
                }}>
                {country === "ko"
                  ? "AI 필터"
                  : country === "ja"
                  ? "AIフィルター"
                  : country === "es"
                  ? "Filtro de IA"
                  : country === "fr"
                  ? "Filtre AI"
                  : country === "id"
                  ? "Filter AI"
                  : country === "zh"
                  ? "AI过滤器"
                  : "AI filter"}
              </Text>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  setShowFilterModal(false);
                }}>
                <Image
                  source={require("../../assets/setting/downG.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}></Image>
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: "45%",
                justifyContent: "space-between",
                flexDirection: "row",
                alignContent: "center",
                alignItems: "flex-start",
                width: "100%",
              }}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  width: vw(15),
                }}
                onPress={() => {
                  setCurrentType("bright");
                }}>
                <View
                  style={
                    currentType === "bright"
                      ? {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                          borderRadius: 100,
                          borderWidth: 2,
                          borderColor: PALETTE.COLOR_RED,
                        }
                      : {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                        }
                  }>
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      width: vw(13),
                      height: vw(13),
                      backgroundColor: PALETTE.COLOR_BACK,
                      borderRadius: 100,
                    }}>
                    <Image
                      source={require("../../assets/chat/bright.png")}
                      style={{
                        width: vw(8),
                        height: vw(8),
                      }}></Image>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "500",
                  }}>
                  {country === "ko"
                    ? "밝기"
                    : country === "ja"
                    ? "明るさ"
                    : country === "es"
                    ? "Brillo"
                    : country === "fr"
                    ? "Luminosité"
                    : country === "id"
                    ? "Kecerahan"
                    : country === "zh"
                    ? "亮度"
                    : "Brightness"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  width: vw(15),
                }}
                onPress={() => {
                  setCurrentType("skin");
                }}>
                <View
                  style={
                    currentType === "skin"
                      ? {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                          borderRadius: 100,
                          borderWidth: 2,
                          borderColor: PALETTE.COLOR_RED,
                        }
                      : {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                        }
                  }>
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      width: vw(13),
                      height: vw(13),
                      backgroundColor: PALETTE.COLOR_BACK,
                      borderRadius: 100,
                    }}>
                    <Image
                      source={require("../../assets/chat/skin.png")}
                      style={{
                        width: vw(6.5),
                        height: vw(6.5),
                      }}></Image>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "500",
                  }}>
                  {country === "ko"
                    ? "피부"
                    : country === "ja"
                    ? "肌"
                    : country === "es"
                    ? "Piel"
                    : country === "fr"
                    ? "Peau"
                    : country === "id"
                    ? "Kulit"
                    : country === "zh"
                    ? "皮肤"
                    : "Skin"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  width: vw(15),
                }}
                onPress={() => {
                  setCurrentType("eye");
                }}>
                <View
                  style={
                    currentType === "eye"
                      ? {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                          borderRadius: 100,
                          borderWidth: 2,
                          borderColor: PALETTE.COLOR_RED,
                        }
                      : {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                        }
                  }>
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      width: vw(13),
                      height: vw(13),
                      backgroundColor: PALETTE.COLOR_BACK,
                      borderRadius: 100,
                    }}>
                    <Image
                      source={require("../../assets/chat/eye.png")}
                      style={{
                        width: vw(6.5),
                        height: vw(6.5),
                      }}></Image>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "500",
                  }}>
                  {country === "ko"
                    ? "눈"
                    : country === "ja"
                    ? "目"
                    : country === "es"
                    ? "Ojos"
                    : country === "fr"
                    ? "Yeux"
                    : country === "id"
                    ? "Mata"
                    : country === "zh"
                    ? "眼睛"
                    : "Eyes"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  width: vw(15),
                }}
                onPress={() => {
                  setCurrentType("nose");
                }}>
                <View
                  style={
                    currentType === "nose"
                      ? {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                          borderRadius: 100,
                          borderWidth: 2,
                          borderColor: PALETTE.COLOR_RED,
                        }
                      : {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                        }
                  }>
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      width: vw(13),
                      height: vw(13),
                      backgroundColor: PALETTE.COLOR_BACK,
                      borderRadius: 100,
                    }}>
                    <Image
                      source={require("../../assets/chat/nose.png")}
                      style={{
                        width: vw(6.5),
                        height: vw(6.5),
                      }}></Image>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "500",
                  }}>
                  {country === "ko"
                    ? "코"
                    : country === "ja"
                    ? "鼻"
                    : country === "es"
                    ? "Nariz"
                    : country === "fr"
                    ? "Nez"
                    : country === "id"
                    ? "Hidung"
                    : country === "zh"
                    ? "鼻子"
                    : "Nose"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  width: vw(15),
                }}
                onPress={() => {
                  setCurrentType("head");
                }}>
                <View
                  style={
                    currentType === "head"
                      ? {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                          borderRadius: 100,
                          borderWidth: 2,
                          borderColor: PALETTE.COLOR_RED,
                        }
                      : {
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          width: vw(15),
                          height: vw(15),
                        }
                  }>
                  <View
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      width: vw(13),
                      height: vw(13),
                      backgroundColor: PALETTE.COLOR_BACK,
                      borderRadius: 100,
                    }}>
                    <Image
                      source={require("../../assets/chat/head.png")}
                      style={{
                        width: vw(8),
                        height: vw(8),
                      }}></Image>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    color: "black",
                    fontSize: 11,
                    fontWeight: "500",
                  }}>
                  {country === "ko"
                    ? "얼굴"
                    : country === "ja"
                    ? "顔"
                    : country === "es"
                    ? "Rostro"
                    : country === "fr"
                    ? "Visage"
                    : country === "id"
                    ? "Wajah"
                    : country === "zh"
                    ? "脸"
                    : "Face"}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: "20%",
              }}></View>
          </View>
        </View>
      )}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          // setGiftShow(false);
          setShowFilterModal(false);
        }}
        style={{
          flex: 1,
          backgroundColor: PALETTE.COLOR_BLACK,
        }}>
        {/*카메라*/}

        {localStream ? (
          <RTCView
            mirror={true}
            objectFit={"cover"}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 1,
            }}
            streamURL={localStream && localStream?.toURL()}
          />
        ) : (
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "black",
              zIndex: 1,
            }}></View>
        )}
        <View
          style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: 2,
            justifyContent: "space-between",
            paddingLeft: vw(2),
            paddingRight: vw(2),
          }}>
          <View
            style={{
              width: "100%",
              alignItems: "flex-end",
            }}>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                borderRadius: 100,
                paddingLeft: 4,
                paddingRight: 2,
                paddingTop: 2,
                paddingBottom: 2,
                backgroundColor: PALETTE.COLOR_RED,
                marginBottom: vh(2),
                marginTop: vh(2),
              }}>
              <Image
                source={require("../../assets/setting/point.png")}
                style={{
                  backgroundColor: PALETTE.COLOR_WHITE,
                  borderRadius: 100,
                  width: 25,
                  height: 25,
                  marginRight: 2,
                }}></Image>
              <View
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: PALETTE.COLOR_WHITE,
                  borderRadius: 100,
                  paddingTop: 9,
                  paddingBottom: 9,
                  paddingLeft: 5,
                  paddingRight: 5,
                  minWidth: 30,
                }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color: "black",
                  }}>
                  {Number(point?.amount).toLocaleString()}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={{
                width: vw(20),
                height: vw(35),
                zIndex: 2,
              }}
              onPress={() => {}}>
              <View
                style={{
                  width: vw(20),
                  height: vw(35),
                  borderRadius: 20,
                  borderColor: PALETTE.COLOR_WHITE,
                  borderWidth: 1,
                  backgroundColor: PALETTE.COLOR_BLACK,
                }}></View>
            </TouchableOpacity>

            <View
              style={{
                marginTop: vh(2),
                borderRadius: 100,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                minWidth: 80,
                paddingLeft: 4,
                paddingRight: 4,
                height: 30,
                backgroundColor: "rgba(0,0,0,0.5)",
              }}>
              <Text
                style={{
                  color: PALETTE.COLOR_WHITE,
                  fontWeight: "bold",
                }}>
                {Math.floor(timer / 60)}:{timer % 60}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                marginTop: vh(1.5),
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                borderRadius: 100,
                width: 35,
                height: 35,
              }}
              onPress={() => {
                switchCamera();
              }}>
              <Image
                source={require("../../assets/chat/cameraSwitch.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              paddingLeft: vw(6),
              paddingRight: vw(6),
              justifyContent: "space-between",
              marginBottom: vh(2),
            }}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                zIndex: 10,
                width: 30,
                height: 30,
              }}
              onPress={() => {
                return;
              }}>
              {/*
              <Image
                source={require("../../assets/chat/gift.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
                */}
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                // leave();
                navigation.goBack();
              }}>
              <Image
                source={require("../../assets/chat/outCall.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                borderRadius: 100,
              }}
              onPress={() => {
                setShowFilterModal(true);
              }}>
              <Image
                source={require("../../assets/setting/facew.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </NotchView>
  );
}
