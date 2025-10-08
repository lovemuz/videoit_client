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

const textList = [
  {
    bold: true,
    text: "Privacy Policy",
  },
  {
    bold: false,
    text: `
NMOMENT (hereinafter referred to as "the Company") takes the protection of users' personal information very seriously and complies with personal information protection regulations under laws such as the Personal Information Protection Act and the Act on Promotion of Information and Communications Network Utilization and Information Protection, etc. The Company clearly states its Privacy Policy below to inform users of how their personal information provided to the Company is used and what measures are taken to protect it.

The Company's Privacy Policy may be subject to change in accordance with amendments to laws and regulations, or changes to the Company’s terms and internal policies. In the event of such changes, the Company will notify users by posting the revised policy on the service screen or through individual notices.

Users have the right to refuse consent regarding the collection, use, provision, and delegation of their personal information as outlined below. However, please note that if you refuse to consent, you may not be able to use all or part of the services. We encourage users to regularly check the application or website for updates.

`,
  },
  {
    bold: true,
    text: "1. Purpose of Collecting and Using Personal Information",
  },
  {
    bold: false,
    text: `The Company collects only the minimum amount of personal information necessary to provide its services for general members and creator members (hereinafter referred to as "users"). Users are classified into general members, who sign up for the An Moment platform to access An Moment content, and creator members, who create content and provide or share it on the An Moment platform.`,
  },
  {
    bold: false,
    text: `Personal information refers to information related to a living individual that can identify the user, including information that, when combined with other easily accessible data, could identify a specific person even if the information alone may not. The personal information collected by the Company is used for the following purposes:`,
  },
  {
    bold: false,
    text: `1) Provision of Services and Billing
The personal information is used to provide services, supply content, process purchases and payments, deliver notifications, and resolve technical issues such as service errors.`,
  },
  {
    bold: false,
    text: `2) Member Management
The information is used for identifying individual users, preventing the fraudulent use of services by unauthorized or problematic users, confirming users' intention to sign up, managing membership limits, retaining records for dispute resolution, handling complaints, delivering notifications, and confirming users’ intention to withdraw membership.`,
  },
  {
    bold: true,
    text: "2. Items of Personal Information Collected and Methods of Collection",
  },
  {
    bold: false,
    text: `
[Items of Personal Information Collected]

1) The Company may collect the following personal information from users during their use of the services:
    `,
  },
  {
    bold: false,
    text: `○ Methods of Collection: App, email, written forms, phone, etc.
○ Items Collected: Nickname, gender, age, profile picture, app usage and access records, payment records, access timestamp, login IP and cookies, records of inappropriate use, service usage records (such as correct and incorrect answer rates), settlement account (for creator members), resident registration number (for creator members)`,
  },
  {
    bold: false,
    text: `○ Items Collected During Google and Apple Login: Email, phone number, gender, date of birth
    `,
  },
  {
    bold: false,
    text: `Email - Used for account registration and policy notifications.
Phone Number - Collected to apply restrictions in cases where users attempt to register with the intent of illegal activities such as posting unsolicited advertisements. It is also used as an alternative for identity verification and to prevent duplicate registrations.
Gender - Used to categorize members according to service operations and to recommend relevant content to members.
Date of Birth - Used to verify whether a user is of an age that allows access to certain features and content, such as live streaming or account verification, and in other situations that require verification.
    `,
  },
  {
    bold: false,
    text: `○ Optional Information and Other Data: The "Location Services Activation" feature is required for video recording and uploading, but location information is not collected or used.`,
  },
  {
    bold: false,
    text: `2) This service supports logging in with a Google account. Additionally, we do not collect personal information from your Google account and use it solely for member identification purposes.`,
  },
  {
    bold: true,
    text: `3. Retention and Use Period of Collected Personal Information`,
  },
  {
    bold: false,
    text: `In principle, personal information is destroyed without delay after the purpose of collection and use has been achieved. However, the following information will be retained for the specified periods for the reasons outlined below.

`,
  },
  {
    bold: false,
    text: `1) Retained Personal Information Related to Transactions
`,
  },
  {
    bold: false,
    text: `① Items Retained: Transaction history
② Legal Basis for Retention: Commercial Act, Act on Consumer Protection in Electronic Commerce
③ Retention Period:

Records related to contracts or withdrawal of offers: 5 years
Records related to payment and supply of goods: 5 years
Records related to consumer complaints or dispute resolution: 3 years`,
  },
  {
    bold: false,
    text: `2) Retained Personal Information Related to Log Records
`,
  },
  {
    bold: false,
    text: `① Items Retained: Access logs
② Legal Basis for Retention: Act on the Protection of Communications Secrets
③ Retention Period: 3 months
`,
  },
  {
    bold: false,
    text: `3) Retained Personal Information Related to Electronic Financial Transaction Records
`,
  },
  {
    bold: false,
    text: `① Items Retained: Records related to electronic financial transactions
② Legal Basis for Retention: Act on Electronic Financial Transactions
③ Retention Period: 5 years
`,
  },
  {
    bold: true,
    text: `4. Procedures and Methods for Destruction of Personal Information
`,
  },
  {
    bold: false,
    text: `The Company will destroy the relevant information without delay once the purpose of collection and use of personal information has been achieved or the retention and use period has expired.
However, in accordance with the Act on Promotion of Information and Communications Network Utilization and Information Protection, if a member has not used the service for one year, their information will be securely stored separately from the personal information of active members, and some of the member's personal information will be destroyed if they have not used the service for one year.
The procedures and methods for the destruction of personal information are as follows.
    `,
  },
  {
    bold: false,
    text: `
1) Destruction Procedure: The information entered by the user for membership registration, etc., will be destroyed after the purpose of use has been achieved. However, according to the law (refer to the retention and use period), it may be stored for a certain period before destruction. Personal information will not be used for any purpose other than retention as mandated by law.
`,
  },
  {
    bold: false,
    text: `2) Destruction Method: Personal information printed on paper (such as documents) will be destroyed by shredding or incineration, and personal information stored in electronic file formats will be permanently deleted in a way that makes recovery impossible.


    `,
  },
  {
    bold: true,
    text: `5. Provision and Sharing of Personal Information
`,
  },
  {
    bold: false,
    text: `In principle, the Company uses users' personal information solely for the purposes of collection and use, and does not disclose it to others or to third-party companies or institutions. However, exceptions apply in the following cases:


    `,
  },
  {
    bold: false,
    text: `① When the user has given prior consent
② When necessary for billing related to the provision of services
③ When required by relevant laws such as the Framework Act on Telecommunications and the Telecommunications Business Act, or when requested by investigative agencies according to legal procedures and methods for investigative purposes
④ When necessary for statistical purposes, academic research, or market research, provided that the information is processed and provided in a form that cannot identify specific individuals

`,
  },
  {
    bold: true,
    text: `6. Technical and Managerial Measures for Personal Information Protection`,
  },
  {
    bold: false,
    text: `1) Technical Measures`,
  },
  {
    bold: false,
    text: `① The Company securely protects users' personal information through security features in accordance with relevant legal regulations and internal policies.
② The Company takes measures to prevent damage from computer viruses by using antivirus programs. These antivirus programs are regularly updated, and in the event of sudden virus outbreaks, the Company promptly applies updates to prevent personal information from being compromised.
③ The Company encrypts and manages users' passwords and employs security devices to safely transmit personal information over the network.
④ To prevent users' personal information from being leaked due to hacking or other incidents, the Company uses devices to block intrusions from external sources and monitors for intrusions 24 hours a day, 365 days a year.

`,
  },
  {
    bold: false,
    text: `2) Managerial Measures`,
  },
  {
    bold: false,
    text: `① The Company limits access to users' personal information to the minimum number of personnel, and those personnel include the following:

    `,
  },
  {
    bold: false,
    text: `- Individuals who perform marketing, events, customer support, and service operation tasks directly related to users
- Individuals responsible for managing personal information, such as the Personal Information Protection Officer
- Other individuals whose job responsibilities inevitably involve handling personal information
`,
  },
  {
    bold: false,
    text: `② The Company has a dedicated department for personal information protection that checks compliance with the personal information processing policy and internal regulations, and makes efforts to promptly rectify any issues identified.
③ The Company is not responsible for any issues arising from the disclosure of personal information such as name or password due to the user's negligence or problems on the Internet.`,
  },
  {
    bold: true,
    text: `7. User Rights and How to Exercise Them`,
  },
  {
    bold: false,
    text: `Users can view or modify their registered personal information at any time and can also request membership termination.
To view or modify personal information, users can do so through the "My Information" section under "Member Information." For membership termination, users can click "Contact Us" to convey their intention to withdraw, after which they can proceed with the termination.
Alternatively, users can proceed with termination through the app's "Withdraw" option and contact us via "Contact Us" within the app for prompt action.
If a user requests correction of erroneous personal information, the Company will not use or provide that personal information until the correction is completed. Additionally, if incorrect personal information has already been provided to a third party, the Company will promptly notify the third party of the correction results to ensure that the correction is made.
The Company processes personal information that has been terminated or deleted at the user's request in accordance with the "Retention and Use Period of Personal Information Collected by the Company" and ensures that it cannot be accessed or used for any other purpose.


    `,
  },
  {
    bold: true,
    text: `8. Personal Information Protection Officer and Consultation/Reporting
`,
  },

  {
    bold: false,
    text: `To protect users' personal information and address any complaints related to personal information, the Company has appointed a Personal Information Protection Officer.
If you have any inquiries regarding users' personal information, please contact the Personal Information Protection Officer or the Personal Information Protection Administrator listed below.`,
  },
  {
    bold: false,
    text: `
Personal Information Protection Officer: KWON GUK WON
Email: traveltofindlife@gmail.com
`,
  },
  {
    bold: false,
    text: `If you need consultation regarding personal information breaches, you can contact the Personal Information Breach Reporting Center, the Cyber Crime Investigation Department of the Supreme Prosecutor's Office, or the Cyber Safety Bureau of the National Police Agency.

    `,
  },
  {
    bold: false,
    text: `[Personal Information Breach Reporting Center] 118 | URL: privacy.kisa.or.kr
[Cyber Crime Investigation Department of the Supreme Prosecutor's Office] 1301 | URL: www.spo.go.kr
[Cyber Safety Bureau of the National Police Agency] 182 | URL: cyberbureau.police.go.kr

`,
  },
  {
    bold: true,
    text: `9. Supplementary Provisions`,
  },
  {
    bold: false,
    text: `1) If the Company makes changes to this personal information processing policy, it will notify users of the reasons for the changes and the effective date at least 10 days prior to the effective date on the service screen along with the current personal information processing policy. However, if there are significant changes that affect users' rights or obligations, notice will be provided at least 30 days in advance.
2) If the Company notifies users of the changes as stated in paragraph 1 and indicates that if users do not express their intention to refuse by the effective date, it will be considered as an expression of intention, and if users do not explicitly express their refusal, it will be deemed that they agree to the changes.
3) Notwithstanding paragraph 2, if the Company collects additional personal information from users or provides it to third parties, it will obtain separate consent from the users themselves. This personal information processing policy will take effect on October 7, 2024.
`,
  },
  {
    bold: false,
    text: `Date of Announcement for Changes to the Personal Information Processing Policy: October 7, 2024
Effective Date of the Personal Information Processing Policy: October 7, 2024

`,
  },
];

export default function Privcacy({
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
    <NotchView top={"#ffffff"} bottom={"#ffffff"} edges={["bottom"]}>
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
                flex: 1,
                alignItems: "flex-start",
                justifyContent: "center",
                alignContent: "center",
              }}
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={require("../../assets/setting/back.png")}
                style={{
                  width: 30,
                  height: 30,
                }}></Image>
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontWeight: "400",
                  fontSize: 16,
                  color: "black",
                }}>
                Privacy Policy
              </Text>
            </View>
            <View
              style={{
                flex: 1,
              }}></View>
          </View>
        </View>
        <ScrollView
          style={{
            flex: 1,
            paddingLeft: vw(4),
            paddingRight: vw(4),
            paddingTop: vh(2),
            paddingBottom: vh(2),
          }}>
          {textList.map((list: any, idx: number) => (
            <Text
              key={idx}
              style={
                list.bold === true
                  ? {
                      fontWeight: "bold",
                      fontSize: 18,
                      marginBottom: 20,
                      color: "black",
                    }
                  : {
                      fontSize: 14,
                      color: "black",
                      marginBottom: 20,
                    }
              }>
              {list.text}
            </Text>
          ))}
        </ScrollView>
      </View>
    </NotchView>
  );
}
