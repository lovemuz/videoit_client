import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import Chat from "../chat/chat";
import Home from "../home/home";
import Rank from "../rank/rank";
import Setting from "../setting/setting";
import Talk from "../live/live";
import SharedStack from "./SharedStack";
import BottomTabBar from "./BottomTabBar";
import api from "../../lib/api/api";
const MainTabNavigator = ({
  navigation,
  route,
  country,
  user,
  updateUser,
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
  endCall,
  youIdByCall,
  reToken,
  setReToken,
  backgroundCheck,
  navigationRoot,
  backgroundChk,
  setCountry,
}: {
  setCountry?: any;
  backgroundChk: any;
  navigationRoot: any;
  backgroundCheck: any;
  reToken: any;
  setReToken: any;
  endCall: any;
  youIdByCall: any;
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
  adminRoom: any;
  updateAdminRoom: any;
  chatCount: any;
  setChatCount: any;
  point: any;
  updatePoint: any;
  connectSocket: any;
  callSocket: any;
  chatSocket: any;
  user: any;
  updateUser: any;
  post: any;
  updatePost: any;
  room: any;
  updateRoom: any;
  rank: any;
  updateRank: any;
  navigation: any;
  route: any;
  country: any;
}) => {
  const Tab = createBottomTabNavigator();

  /*
  const [real, setReal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await api.get("/real").then(res => {
        setReal(res.data.real);
      });
    }
    fetchData();
  }, []);
  */

  return (
    // TabBar의 UI는 BottomTabBar 화면에서 관리합니다.
    <Tab.Navigator
      initialRouteName="LiveTab"
      screenOptions={
        {
          //unmountOnBlur: true,
        }
      }
      tabBar={props => (
        <BottomTabBar {...props} chatCount={chatCount} country={country} />
      )}>

      <Tab.Screen options={{ headerShown: false }} name="HomeTab">
        {props => (
          <SharedStack
            screenName="LiveTab"
            backgroundChk={backgroundChk}
            backgroundCheck={backgroundCheck}
            navigationRoot={navigationRoot}
            navigation={navigation}
            route={route}
            country={country}
            user={user}
            updateUser={updateUser}
            post={post}
            updatePost={updatePost}
            room={room}
            updateRoom={updateRoom}
            rank={rank}
            updateRank={updateRank}
            point={point}
            updatePoint={updatePoint}
            connectSocket={connectSocket}
            callSocket={callSocket}
            chatSocket={chatSocket}
            myFollowing={myFollowing}
            setMyFollowing={setMyFollowing}
            calling={calling}
            setCalling={setCalling}
            timer={timer}
            setTimer={setTimer}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            callEndByMe={callEndByMe}
            modalState={modalState}
            setModalState={setModalState}
            endCall={endCall}
            youIdByCall={youIdByCall}
            reToken={reToken}
            setReToken={setReToken}
          />
        )}
      </Tab.Screen>

      <Tab.Screen options={{ headerShown: false }} name="RankTab">
        {props => (
          <SharedStack
            reToken={reToken}
            setReToken={setReToken}
            screenName="RankTab"
            navigationRoot={navigationRoot}
            navigation={navigation}
            route={route}
            country={country}
            user={user}
            updateUser={updateUser}
            post={post}
            updatePost={updatePost}
            room={room}
            updateRoom={updateRoom}
            rank={rank}
            updateRank={updateRank}
            point={point}
            updatePoint={updatePoint}
            connectSocket={connectSocket}
            callSocket={callSocket}
            chatSocket={chatSocket}
            myFollowing={myFollowing}
            setMyFollowing={setMyFollowing}
            calling={calling}
            setCalling={setCalling}
            timer={timer}
            setTimer={setTimer}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            callEndByMe={callEndByMe}
            modalState={modalState}
            setModalState={setModalState}
          />
        )}
      </Tab.Screen>
      <Tab.Screen options={{ headerShown: false }} name="RoomTab">
        {props => (
          <SharedStack
            screenName="RoomTab"
            navigationRoot={navigationRoot}
            navigation={navigation}
            route={route}
            country={country}
            user={user}
            updateUser={updateUser}
            post={post}
            updatePost={updatePost}
            room={room}
            updateRoom={updateRoom}
            rank={rank}
            updateRank={updateRank}
            point={point}
            updatePoint={updatePoint}
            connectSocket={connectSocket}
            callSocket={callSocket}
            chatSocket={chatSocket}
            chatCount={chatCount}
            setChatCount={setChatCount}
            adminRoom={adminRoom}
            updateAdminRoom={updateAdminRoom}
            myFollowing={myFollowing}
            setMyFollowing={setMyFollowing}
            calling={calling}
            setCalling={setCalling}
            timer={timer}
            setTimer={setTimer}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            callEndByMe={callEndByMe}
            modalState={modalState}
            setModalState={setModalState}
            reToken={reToken}
            setReToken={setReToken}
          />
        )}
      </Tab.Screen>

      <Tab.Screen options={{ headerShown: false }} name="SettingTab">
        {props => (
          <SharedStack
            screenName={"SettingTab"}
            navigationRoot={navigationRoot}
            navigation={navigation}
            route={route}
            country={country}
            user={user}
            updateUser={updateUser}
            post={post}
            updatePost={updatePost}
            room={room}
            updateRoom={updateRoom}
            rank={rank}
            updateRank={updateRank}
            point={point}
            updatePoint={updatePoint}
            connectSocket={connectSocket}
            callSocket={callSocket}
            chatSocket={chatSocket}
            myFollowing={myFollowing}
            setMyFollowing={setMyFollowing}
            calling={calling}
            setCalling={setCalling}
            timer={timer}
            setTimer={setTimer}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            callEndByMe={callEndByMe}
            modalState={modalState}
            setModalState={setModalState}
            reToken={reToken}
            setReToken={setReToken}
            setCountry={setCountry}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
export default MainTabNavigator;
