/**
 * @format
 */

import { Alert, AppRegistry, Platform } from 'react-native';
import AppOut from './AppOut';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import { Settings } from "react-native-fbsdk-next";
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNNotificationCall from "react-native-full-screen-notification-incoming-call";
import api from "./lib/api/api";

Settings.initializeSDK();


messaging().getInitialNotification(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log("Message handled in the background!", remoteMessage);
    const data = remoteMessage.data;
    const screen = data.screen;
    // console.log("wow this");

    if (Platform.OS === "android" && screen === "Call") {

        const RoomIdCpy = data?.RoomId;
        const youCpy = JSON.parse(data?.you);
        /*
        const genderCpy = youCpy?.gender;
        const avgTimeCpy = youCpy?.avgTime;
        const avgScoreCpy = youCpy?.avgScore;
        const vipCpy = JSON.parse(data?.vip);
        const callTimeCpy = data?.callTime;
        */
        await AsyncStorage.setItem('RoomIdCpy', RoomIdCpy)
        await AsyncStorage.setItem('youCpy', data?.you)

        RNNotificationCall.displayNotification(
            "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
            youCpy?.profile,
            15000,
            {
                channelId: "com.beit.videoit",
                channelName: "VIDEOIT",
                notificationIcon: "ic_launcher", // mipmap
                notificationTitle: youCpy?.nick,
                notificationBody: "Incoming video call",
                answerText: "Answer",
                declineText: "Decline",
                notificationColor: "colorAccent",
                isVideo: true,
                // notificationSound: null, // raw
                // mainComponent: 'MyReactNativeApp', // AppRegistry.registerComponent('MyReactNativeApp', () => CustomIncomingCall);
                // payload: { name: 'Test', body: 'test' }
            },
        );
        return;
    }
});


function HeadlessCheck({ isHeadless }) {
    /*
    if (Platform.OS === 'android') {
        if (isHeadless) {
            // App has been launched in the background by iOS, ignore
            return null;
        }
        // Render the app component on foreground launch
        return <AppOut />;
    } else {*/
    return <AppOut />;
    //}
}



AppRegistry.registerComponent(appName, () => HeadlessCheck);
