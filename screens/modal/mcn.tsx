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

import Share from "react-native-share";
import FastImage from "react-native-fast-image";
import Clipboard from "@react-native-clipboard/clipboard";
import api from "../../lib/api/api";
import {PALETTE} from "../../lib/constant/palette";
import serverURL from "../../lib/constant/serverURL";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ToastComponent} from "../reusable/useToast";

export default function Mcn({
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
  const pageNum: any = useRef(0);
  const pageSize: any = useRef(20);
  const [mcnList, setMcnList]: any = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const [firstRender, setFirstRender] = useState(false);
  const [content, setContent] = useState("");

  const [menyType, setMenuType] = useState(1); //1,2,3

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [earnMoney, setEarnMoney] = useState(0);

  const [mcnerLink, setMcnerLink]: any = useState(null);
  const [mcningLink, setMcningLink]: any = useState(null);
  const [creatorCharge, setCreatorCharge]: any = useState(0);
  const [creatorList, setCreatorList]: any = useState([]);
  const [exchangeSelf, setExchangeSelf] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await api
      .get("/mcn/myMcnList", {
        params: {
          pageNum: 0,
          pageSize: pageSize.current,
        },
      })
      .then(res => {
        pageNum.current = 1;
        setMcnList(res.data.mcnList[0].Mcners);
      });
    setRefreshing(false);
  }, [user]);

  const ref: any = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        await api.get("/mcn/exchangeSelf").then(res => {
          setExchangeSelf(res.data?.exchangeSelf);
        });
      } catch (err) {}
      try {
        await api
          .get("/mcn/myMcnList", {
            params: {
              pageNum: 0,
              pageSize: pageSize.current,
            },
          })
          .then(res => {
            pageNum.current = 1;
            if (res.data.mcnList[0] && res.data.mcnList[0].Mcners) {
              setMcnList(res.data.mcnList[0].Mcners);
            }
          });
      } catch (err) {}
      setFirstRender(true);
    }
    fetchData();
  }, []);
  const insets = useSafeAreaInsets();
  return (
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["left"]}>
      <StatusBar
        backgroundColor={"transparent"}
        translucent={true}
        barStyle={Platform.OS === "ios" ? "light-content" : "dark-content"}
      />
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
                Mcn 크리에이터 관리
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
            marginLeft: 16,
            marginRight: 16,
          }}>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              marginTop: vh(2),
              marginBottom: vh(2),
              //overflow: "scroll",
              width: "100%",
            }}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                backgroundColor: PALETTE.COLOR_BACK,
                padding: 12,
                marginRight: 10,
                borderRadius: 10,
              }}
              onPress={async () => {
                setMenuType(1);
                await api
                  .get("/mcn/myMcnList", {
                    params: {
                      pageNum: 0,
                      pageSize: pageSize.current,
                    },
                  })
                  .then(res => {
                    pageNum.current = 1;
                    if (res.data.mcnList[0] && res.data.mcnList[0].Mcners) {
                      setMcnList(res.data.mcnList[0].Mcners);
                    }
                  });
              }}>
              <Text
                style={{
                  color: "black",
                }}>
                크리에이터 목록
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                backgroundColor: PALETTE.COLOR_BACK,
                padding: 12,
                marginRight: 10,
                borderRadius: 10,
              }}
              onPress={async () => {
                setMenuType(2);
                await api
                  .get("/mcn/earnMoney", {
                    params: {
                      year,
                      month,
                    },
                  })
                  .then(res => {
                    setEarnMoney(res.data.earnMoney);
                    setCreatorList(res.data.creatorList);
                  });
              }}>
              <Text
                style={{
                  color: "black",
                }}>
                매출 확인
              </Text>
            </TouchableOpacity>
            {(user?.id === 4613 || user?.id === 34390) && (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  backgroundColor: PALETTE.COLOR_BACK,
                  padding: 12,
                  marginRight: 10,
                  borderRadius: 10,
                }}
                onPress={() => {
                  setMenuType(3);
                }}>
                <Text
                  style={{
                    color: "black",
                  }}>
                  크리에이터 추가
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {Number(menyType) === 1 && mcnList && firstRender && (
          <FlatList
            ref={ref}
            contentContainerStyle={{
              marginTop: vh(2),
              paddingLeft: vw(4),
              paddingRight: vw(4),
              paddingBottom: vh(10),
              //flex: 1,
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            scrollEnabled
            onEndReached={async e => {
              /*
              if (mcnList.length < 3) return;
              console.log(pageNum.current);
              await api
                .get("/mcn/myMcnList", {
                  params: {
                    pageNum: pageNum.current,
                    pageSize: pageSize.current,
                  },
                })
                .then(res => {
                  pageNum.current = pageNum.current + 1;
                  console.log(pageNum.current);
                  //updatePost([...post, ...res.data?.postList]);
                  setMcnList([...mcnList, ...res.data.mcnList[0].Mcners]);
                  //setMcnList(mcnList.concat(res.data.mcnList[0].Mcners));
                });
                */
            }}
            //horizontal={true}
            keyExtractor={(item: any) => item.id}
            data={mcnList}
            numColumns={1}
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
                  크리에이터 목록이 없습니다.
                </Text>
              </View>
            )}
            renderItem={(props: any) => (
              <TouchableOpacity
                activeOpacity={1}
                key={props.index}
                onPress={async () => {
                  //navigation.push("Chat");
                }}
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                  marginBottom: vh(5),
                  flexDirection: "row",
                }}>
                <FastImage
                  source={{
                    uri: props.item?.profile,
                    priority: FastImage.priority.normal,
                  }}
                  style={{
                    width: vh(6.5),
                    height: vh(6.5),
                    borderRadius: 100,
                  }}
                  resizeMode={FastImage.resizeMode.cover}></FastImage>
                <View
                  style={{
                    alignContent: "center",
                    alignItems: "flex-start",
                    paddingLeft: 10,
                    flex: 1,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontWeight: "bold",
                      marginBottom: 2,
                      fontSize: 12,
                      color: "black",
                    }}>
                    {props.item?.nick}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#838383",
                      fontSize: 10,
                      marginBottom: 5,
                    }}>
                    {props.item?.link}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      // fontWeight: "bold",
                      color: "black",
                      marginBottom: 2,
                    }}>
                    현재 보유 포인트-{" "}
                    {Number(props.item?.Point?.amount).toLocaleString()}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      // fontWeight: "bold",
                      color: "black",
                      marginBottom: 10,
                    }}>
                    포인트 수수료 -{" "}
                    {props.item?.CreatorAuth?.platformPointCharge}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      // fontWeight: "bold",
                      color: "black",
                      marginBottom: 2,
                    }}>
                    현재 보유 구독머니 -{" "}
                    {Number(props.item?.Money?.amount).toLocaleString()}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      // fontWeight: "bold",
                      color: "black",
                      marginBottom: 2,
                    }}>
                    구독 수수료 -{" "}
                    {props.item?.CreatorAuth?.platformSubscribeCharge}
                  </Text>
                  {(user?.id === 4613 || user?.id === 34390) && (
                    <Text
                      style={{
                        fontSize: 12,
                        // fontWeight: "bold",
                        color: "black",
                      }}>
                      크리에이터 나이 - {props.item?.real_birthday}
                    </Text>
                  )}

                  <Text
                    style={{
                      fontSize: 12,
                      // fontWeight: "bold",
                      color: "black",
                      marginTop: 15,
                    }}>
                    Mcn 수수료 - {props.item?.Mcn.creatorCharge}
                  </Text>

                  {exchangeSelf && (
                    <View
                      style={{
                        marginTop: 10,
                        marginBottom: 2,
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "black",
                          fontWeight: "bold",
                        }}>
                        포인트 + 구독 수수료 반영 총 환전 금액 :
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "black",
                          fontWeight: "bold",
                        }}>
                        {Number(
                          Number(
                            props.item?.Point?.amount *
                              0.01 *
                              (100 -
                                props.item?.CreatorAuth?.platformPointCharge),
                          ) +
                            Number(
                              props.item?.Money?.amount *
                                0.01 *
                                (100 -
                                  props.item?.CreatorAuth
                                    ?.platformSubscribeCharge),
                            ),
                        ).toLocaleString()}
                      </Text>
                    </View>
                  )}
                </View>
                <View
                  style={{
                    alignItems: "center",
                  }}>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      backgroundColor: PALETTE.COLOR_BACK,
                      padding: 10,
                      borderRadius: 10,
                    }}
                    onPress={async e => {
                      navigation.navigate("Profile", {
                        YouId: props.item?.id,
                      });
                    }}>
                    <Text
                      style={{
                        color: PALETTE.COLOR_BLACK,
                      }}>
                      프로필
                    </Text>
                  </TouchableOpacity>
                  {exchangeSelf && (
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        backgroundColor: PALETTE.COLOR_NAVY,
                        // color: "white",
                        padding: 10,
                        marginTop: 10,
                        borderRadius: 10,
                      }}
                      onPress={async e => {
                        /*
                          const chk = window.confirm(
                            "정말 환전하시겠습니까? 환전시 크리에이터의 포인트,구독이 0 이 됩니다. "
                          );
                          if (!chk) return;
                          */

                        Alert.alert(
                          "크리에이터 환전",
                          "정말 환전하시겠습니까? 환전시 크리에이터의 포인트,구독이 0 이 됩니다.",
                          [
                            {
                              text: "취소",
                              style: "cancel",
                            },
                            {
                              text: "확인",
                              onPress: async () => {
                                await api
                                  .post("/mcn/exchangeCreatorOne", {
                                    UserId: props.item?.id,
                                  })
                                  .then(res => {
                                    if (res.data.status === "true") {
                                      Alert.alert("완료 되었습니다.");
                                      setMcnList(
                                        mcnList?.map((item: any) =>
                                          props.item?.id === item?.id
                                            ? {
                                                ...item,
                                                Point: {
                                                  ...item?.Point,
                                                  amount: 0,
                                                },
                                                Money: {
                                                  ...item?.Money,
                                                  amount: 0,
                                                },
                                              }
                                            : item,
                                        ),
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
                          color: PALETTE.COLOR_WHITE,
                        }}>
                        환전하기
                      </Text>
                    </TouchableOpacity>
                  )}
                  {(user?.id === 4613 || user?.id === 34390) && (
                    <View>
                      <TextInput
                        value={content}
                        onChangeText={(e: any) => {
                          setContent(e);
                        }}
                        placeholder="알림내용을 입력해주세요."></TextInput>
                    </View>
                  )}
                  {(user?.id === 4613 || user?.id === 34390) && (
                    <TouchableOpacity
                      style={{
                        marginTop: 20,
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        backgroundColor: PALETTE.COLOR_BLACK,

                        padding: 10,
                        borderRadius: 10,
                      }}
                      onPress={async e => {
                        await api
                          .post("/mcn/creatorPush", {
                            UserId: props.item?.id,
                            content,
                          })
                          .then(res => {
                            if (res.data.status === "true") {
                              Alert.alert("완료되었습니다.");
                            }
                          });
                        setContent("");
                      }}>
                      <Text
                        style={{
                          color: "white",
                        }}>
                        전체알림
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        {Number(menyType) === 2 && creatorList && firstRender && (
          <ScrollView
            style={{
              marginTop: vh(2),
              paddingLeft: 16,
              paddingRight: 16,
              //overflow: "scroll",
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: PALETTE.COLOR_BACK,
                  padding: 10,
                  borderRadius: 10,
                }}
                onPress={async () => {
                  const tempYear = month === 1 ? year - 1 : year;
                  const tempMonth = month === 1 ? 12 : month - 1;

                  setYear(tempYear);
                  setMonth(tempMonth);
                  await api
                    .get("/mcn/earnMoney", {
                      params: {
                        year: tempYear,
                        month: tempMonth,
                      },
                    })
                    .then(res => {
                      setEarnMoney(res.data.earnMoney);
                      setCreatorList(res.data.creatorList);
                    });
                }}>
                <Text
                  style={{
                    color: "black",
                  }}>
                  {"<"}
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  color: "black",
                  marginLeft: 10,
                  marginRight: 10,
                  fontWeight: "bold",
                  fontSize: 25,
                }}>
                {year} {month}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: PALETTE.COLOR_BACK,
                  padding: 10,
                  borderRadius: 10,
                }}
                onPress={async () => {
                  const tempYear = month === 12 ? year + 1 : year;
                  const tempMonth = month === 12 ? 1 : month + 1;

                  setYear(tempYear);
                  setMonth(tempMonth);
                  await api
                    .get("/mcn/earnMoney", {
                      params: {
                        year: tempYear,
                        month: tempMonth,
                      },
                    })
                    .then(res => {
                      setEarnMoney(res.data.earnMoney);
                      setCreatorList(res.data.creatorList);
                    });
                }}>
                <Text
                  style={{
                    color: "black",
                  }}>
                  {">"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                marginTop: 20,
                marginBottom: 20,
                color: "black",
              }}>
              해당달 수익 - {Number(earnMoney).toLocaleString()}
            </Text>

            {creatorList?.map((list: any, idx: number) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  marginBottom: vh(2),
                }}>
                <FastImage
                  source={{
                    uri: list?.User?.profile,
                    priority: FastImage.priority.normal,
                  }}
                  style={{
                    width: vh(6.5),
                    height: vh(6.5),
                    borderRadius: 100,
                  }}
                  resizeMode={FastImage.resizeMode.cover}></FastImage>
                <View
                  style={{
                    marginLeft: 10,
                  }}>
                  <Text
                    //numberOfLines={1}
                    style={{
                      fontWeight: "bold",
                      marginBottom: 2,
                      fontSize: 12,
                      color: "black",
                    }}>
                    {list?.User?.nick}
                  </Text>
                  <Text
                    //numberOfLines={1}
                    style={{
                      color: "#838383",
                      fontSize: 10,
                      marginBottom: 5,
                    }}>
                    {list?.User?.link}
                  </Text>
                  <Text
                    //numberOfLines={1}
                    style={{
                      fontWeight: "bold",
                      marginBottom: 2,
                      fontSize: 12,
                      color: "black",
                    }}>
                    해당달 수익 - {list?.earn}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {Number(menyType) === 3 &&
          (user?.id === 4613 || user?.id === 34390) && (
            <View
              style={{
                marginTop: vh(2),
                paddingLeft: 16,
                paddingRight: 16,
                //overflow: "scroll",
                flex: 1,
              }}>
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  marginBottom: 30,
                }}>
                mcn 크리에이터 추가하기
              </Text>
              <Text
                style={{
                  color: "black",
                }}>
                링크 mcnerLink - 크리에이터
              </Text>
              <TextInput
                placeholder={"@~~~~"}
                style={{
                  borderRadius: 10,
                  height: 40,
                  borderWidth: 1,
                  borderColor: "#d3d3d3",
                  //border: "1px solid #d3d3d3",
                  marginBottom: 10,
                  marginTop: 10,
                }}
                value={mcnerLink}
                onChangeText={e => {
                  setMcnerLink(e);
                }}></TextInput>
              <Text
                style={{
                  color: "black",
                }}>
                링크 mcningLink - 엠씨엔
              </Text>
              <TextInput
                placeholder={"@~~~~"}
                style={{
                  borderRadius: 10,
                  height: 40,
                  borderWidth: 1,
                  borderColor: "#d3d3d3",
                  marginBottom: 10,
                  marginTop: 10,
                }}
                value={mcningLink}
                onChangeText={e => {
                  setMcningLink(e);
                }}></TextInput>
              <Text
                style={{
                  color: "black",
                }}>
                mcn 수수료
              </Text>
              <TextInput
                placeholder={"15"}
                style={{
                  borderRadius: 10,
                  height: 40,
                  borderWidth: 1,
                  borderColor: "#d3d3d3",
                  marginBottom: 10,
                  marginTop: 10,
                }}
                value={creatorCharge}
                onChangeText={e => {
                  setCreatorCharge(e);
                }}></TextInput>
              <View
                style={{
                  marginBottom: 40,
                }}>
                <Text
                  style={{
                    color: "black",
                  }}>
                  수수료 계산하는법
                </Text>
                <Text
                  style={{
                    color: "black",
                  }}>
                  VIDEO IT = 10%{" "}
                </Text>
                <Text
                  style={{
                    color: "black",
                  }}>
                  크리에이터 = 65%
                </Text>
                <Text
                  style={{
                    color: "black",
                  }}>
                  카드사 수수료, 크리에이터 수수료 = 7%
                </Text>
                <Text
                  style={{
                    color: "black",
                  }}>
                  Mcn 수수료 = x%{" "}
                </Text>
                <Text
                  style={{
                    color: "black",
                  }}>
                  x(Mcn) + 7(카드사,크리에이터 수수료) + 65(크리에이터 실지급)
                  +10(VIDEO IT) = 100 이 되야함
                </Text>
                <Text
                  style={{
                    color: "black",
                  }}>
                  * x=18
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 40,
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: PALETTE.COLOR_BACK,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    padding: 10,
                  }}
                  onPress={async () => {
                    await api
                      .post("/mcn/addMcnCreator", {
                        mcnerLink,
                        mcningLink,
                        creatorCharge,
                      })
                      .then(res => {
                        if (res.data.status === "true") {
                          Alert.alert("완료됨");
                        } else {
                          Alert.alert("실패함");
                        }
                      });
                  }}>
                  <Text
                    style={{
                      color: "black",
                    }}>
                    추가하기
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
      </View>
    </NotchView>
  );
}
