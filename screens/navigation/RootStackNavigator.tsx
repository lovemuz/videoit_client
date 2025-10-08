import React, {useEffect, useState} from "react";
import {NavigationContainer} from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import MainTabNavigator from "./MainTabNavigator";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import Call from "../chat/call";
import Login from "../auth/login";
import FindPassword from "../auth/findPassword";
import Alarm from "../modal/alarm";
import Ban from "../modal/ban";
import Exchange from "../modal/exchange";
import Store from "../modal/store";
import Chat from "../chat/chat";
import MakeFeed from "../modal/makeFeed";
import Profile from "../home/profile";
import Gallery from "../modal/gallery";
import Comment from "../modal/commnet";
import Privcacy from "../modal/privacy";
import Tou from "../modal/tou";
import Account from "../modal/account";
import AlarmSetting from "../modal/alarmSetting";
import SelfCamera from "../setting/selfCamera";
import Email from "../modal/email";
import EditProfile from "../modal/editProfile";
import PurchaseHistory from "../modal/purchaseHistory";
import Gift from "../modal/gift";
import Info from "../auth/info";
import BanUser from "../auth/banUser";
import SplashScreen from "react-native-splash-screen";
import {useDispatch, useSelector} from "react-redux";
import {getUser} from "../../reduxModules/user";
import {USER_ROLE} from "../../lib/constant/user-constant";
import EmailLogin from "../auth/emailLogin";
import PhoneLogin from "../auth/phoneLogin";
import PhoneVerify from "../auth/phoneVerify";
import SubScribe from "../home/subscribe";
import MakeSubscribe from "../modal/makeSubscribe";
import MySubscribe from "../modal/mySubscribe";
import Search from "../setting/search";
import Certification from "../auth/certification";
import api from "../../lib/api/api";
import VideoCallPrice from "../modal/videoCallPrice";
import UpdateFeed from "../modal/updateFeed";
import AllChat from "../modal/allChat";
import ChangePassword from "../modal/changePassword";
import Mcn from "../modal/mcn";
import CertificationIn from "../auth/certificationIn";
import Donation from "../modal/donation";

/**
 * StackNavigator를 이용하여서 앱에 대한 페이지 이동을 관리합니다.
 */
const RootStackNavigator = ({
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
  setChatcount,
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
  setChatcount: any;
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
  country: any;
}) => {
  //const user = useSelector((state: any) => state.user);

  // StackNavigation을 이용하여 페이지를 관리하며 각각 RootStackPageList에서 페이지를 관리합니다
  const Stack = createStackNavigator();

  return (
    // TabBar의 UI는 BottomTabBar 화면에서 관리합니다.
    <Stack.Navigator
      initialRouteName={
        user.roles === USER_ROLE.NORMAL_USER ||
        user.roles === USER_ROLE.CS_USER ||
        user.roles === USER_ROLE.ADMIN_USER ||
        user.roles === USER_ROLE.COMPANY_USER ||
        user.roles === USER_ROLE.REFERRAL_USER
          ? "MainTabNavigator"
          : user.roles === USER_ROLE.BAN_USER
          ? "BanUser"
          : "Login"
      }>
      {user.roles === USER_ROLE.NORMAL_USER ||
      user.roles === USER_ROLE.CS_USER ||
      user.roles === USER_ROLE.ADMIN_USER ||
      user.roles === USER_ROLE.COMPANY_USER ||
      user.roles === USER_ROLE.REFERRAL_USER ? (
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen
            name="MainTabNavigator"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <MainTabNavigator
                navigationRoot={navigationRoot}
                backgroundCheck={backgroundCheck}
                backgroundChk={backgroundChk}
                reToken={reToken}
                setReToken={setReToken}
                endCall={endCall}
                youIdByCall={youIdByCall}
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
                setChatCount={setChatcount}
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
                setCountry={setCountry}
              />
            )}
          />
          <Stack.Screen
            name="Call"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <Call
                endCall={endCall}
                youIdByCall={youIdByCall}
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
                setChatCount={setChatcount}
              />
            )}
          />

          <Stack.Screen
            name="Chat"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <Chat
                reToken={reToken}
                setReToken={setReToken}
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
                setChatCount={setChatcount}
                adminRoom={adminRoom}
                updateAdminRoom={updateAdminRoom}
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
          />

          <Stack.Screen
            name="Profile"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <Profile
                reToken={reToken}
                setReToken={setReToken}
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
          />
          <Stack.Screen
            name="Subscribe"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <SubScribe
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
          />
          <Stack.Screen
            name="CertificationIn"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <CertificationIn
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
              />
            )}
          />
          <Stack.Screen
            name="SelfCamera"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <SelfCamera
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
              />
            )}
          />
          <Stack.Screen
            name="Search"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <Search
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
              />
            )}
          />
        </Stack.Group>
      ) : user.roles === USER_ROLE.BAN_USER ? (
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen
            name="BanUser"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <BanUser
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
              />
            )}
          />
        </Stack.Group>
      ) : (
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen
            name="Login"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <Login
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
              />
            )}
          />
          <Stack.Screen
            name="Certification"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <Certification
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
              />
            )}
          />
          <Stack.Screen
            name="EmailLogin"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <EmailLogin
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
              />
            )}
          />
          <Stack.Screen
            name="PhoneLogin"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <PhoneLogin
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
              />
            )}
          />
          <Stack.Screen
            name="PhoneVerify"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <PhoneVerify
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
              />
            )}
          />

          <Stack.Screen
            name="Info"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <Info
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
              />
            )}
          />
          <Stack.Screen
            name="FindPassword"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <FindPassword
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
              />
            )}
          />
        </Stack.Group>
      )}
      <Stack.Group
        screenOptions={{
          presentation: "modal",
        }}>
        <Stack.Screen
          name="VideoCallPrice"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <VideoCallPrice
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
            />
          )}
        />
        <Stack.Screen
          name="ChangePassword"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <ChangePassword
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
            />
          )}
        />
        {user?.roles !== 0 && (
          <Stack.Screen
            name="Account"
            options={{headerShown: false}}
            children={({navigation, route}: {navigation: any; route: any}) => (
              <Account
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
              />
            )}
          />
        )}
        <Stack.Screen
          name="AlarmSetting"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <AlarmSetting
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
            />
          )}
        />
        <Stack.Screen
          name="Ban"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <Ban
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
            />
          )}
        />
        <Stack.Screen
          name="Mcn"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <Mcn
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
            />
          )}
        />

        <Stack.Screen
          name="Email"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <Email
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
            />
          )}
        />
        <Stack.Screen
          name="EditProfile"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <EditProfile
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
            />
          )}
        />

        <Stack.Screen
          name="PurchaseHistory"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <PurchaseHistory
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
            />
          )}
        />

        <Stack.Screen
          name="Privacy"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <Privcacy
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
            />
          )}
        />
        <Stack.Screen
          name="Tou"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <Tou
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
            />
          )}
        />

        <Stack.Screen
          name="AllChat"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <AllChat
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
            />
          )}
        />
        <Stack.Screen
          name="MakeFeed"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <MakeFeed
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
            />
          )}
        />
        <Stack.Screen
          name="UpdateFeed"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <UpdateFeed
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
            />
          )}
        />

        <Stack.Screen
          name="MakeSubscribe"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <MakeSubscribe
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
            />
          )}
        />
        <Stack.Screen
          name="MySubscribe"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <MySubscribe
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
            />
          )}
        />

        <Stack.Screen
          name="Alarm"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <Alarm
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
            />
          )}
        />
        <Stack.Screen
          name="Comment"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <Comment
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
            />
          )}
        />
        <Stack.Screen
          name="Exchange"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <Exchange
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
            />
          )}
        />
        <Stack.Screen
          name="Gift"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <Gift
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
            />
          )}
        />
        <Stack.Screen
          name="Donation"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <Donation
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
            />
          )}
        />
        <Stack.Screen
          name="Store"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <Store
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
            />
          )}
        />
        <Stack.Screen
          name="Gallery"
          options={{headerShown: false}}
          children={({navigation, route}: {navigation: any; route: any}) => (
            <Gallery
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
            />
          )}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
export default RootStackNavigator;
