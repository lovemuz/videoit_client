import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import Chat from "../chat/chat";
import Home from "../home/home";
import Rank from "../rank/rank";
import Setting from "../setting/setting";
import Live from "../live/live";
import Room from "../chat/room";
/*
import EditProfile from "../setting/editProfile";
import Account from "../setting/account";
import AlarmSetting from "../setting/alarmSetting";
import Ban from "../setting/ban";
import Camera from "../setting/camera";
import Email from "../setting/email";
import Privcacy from "../setting/privacy";
import PurchaseHistory from "../setting/purchaseHistory";
import Tou from "../setting/tou";*/

export default function SharedStack({
  screenName,
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
  backgroundChk?: any;
  navigationRoot?: any;
  backgroundCheck?: any;
  reToken: any;
  setReToken: any;
  endCall?: any;
  youIdByCall?: any;
  calling: any;
  setCalling: any;
  timer: any;
  setTimer: any;
  isRunning: any;
  setIsRunning: any;
  callEndByMe: any;
  modalState: any;
  setModalState: any;
  myFollowing?: any;
  setMyFollowing?: any;
  adminRoom?: any;
  updateAdminRoom?: any;
  chatCount?: any;
  setChatCount?: any;
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
  screenName: "HomeTab" | "RoomTab" | "LiveTab" | "RankTab" | "SettingTab";
  country: any;
}) {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Live">
      {screenName === "HomeTab" ? (
        <Stack.Screen options={{headerShown: false}} name={"Home"}>
          {props => (
            <Home
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
        </Stack.Screen>
      ) : null}
      {screenName === "RoomTab" ? (
        <Stack.Screen options={{headerShown: false}} name={"Room"}>
          {props => (
            <Room
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
        </Stack.Screen>
      ) : null}

      {screenName === "LiveTab" ? (
        <Stack.Screen options={{headerShown: false}} name={"Live"}>
          {props => (
            <Live
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
            />
          )}
        </Stack.Screen>
      ) : null}
      {screenName === "RankTab" ? (
        <Stack.Screen options={{headerShown: false}} name={"Rank"}>
          {props => (
            <Rank
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
        </Stack.Screen>
      ) : null}

      {screenName === "SettingTab" ? (
        <Stack.Screen options={{headerShown: false}} name={"Setting"}>
          {props => (
            <Setting
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
              setCountry={setCountry}
            />
          )}
        </Stack.Screen>
      ) : null}
    </Stack.Navigator>
  );
}
