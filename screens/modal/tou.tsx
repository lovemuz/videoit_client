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
    text: `Service Terms of Use
`,
  },
  {
    bold: true,
    text: `Chapter 1: General Provisions`,
  },
  {
    bold: true,
    text: `Article 1: Purpose`,
  },
  {
    bold: false,
    text: `These Terms and Conditions set forth the rights and obligations of members regarding the VIDEOIT application and website, and aim to stipulate the conditions and procedures for using the service as well as other necessary matters.`,
  },
  {
    bold: true,
    text: `Article 2: Effectiveness and Amendments
`,
  },
  {
    bold: false,
    text: `These Terms and Conditions will take effect upon being posted online.
The Company may amend these Terms and Conditions in the same manner if significant business reasons or reasons for changes stipulated by relevant laws arise. In such cases, the conditions for using the service will follow the updated content.`,
  },
  {
    bold: true,
    text: `Article 3: Company's Notifications`,
  },
  {
    bold: false,
    text: `The Company will notify members of necessary matters from time to time through methods deemed appropriate, including displaying information online.
The notification in the preceding paragraph will take effect at the earlier of the time the Company displays the notification online or the time the notification reaches the member.`,
  },
  {
    bold: true,
    text: `Chapter 2: Membership Registration and Service Use`,
  },
  {
    bold: true,
    text: `Article 4: Establishment of Membership Contract
`,
  },
  {
    bold: false,
    text: `Using the service is considered as applying for membership registration by installing the VIDEOIT application, accessing the website, executing the application, and creating a profile.
A person applying for a membership contract (hereinafter referred to as the "Applicant") is deemed to have accepted the terms of this Agreement at the time of application.
The Company may accept the application for membership after going through the necessary procedures. However, the Company may refuse to accept the application if it determines that the Applicant is not suitable for membership.
The membership contract is established at the time the Company accepts the application as mentioned in the preceding paragraph.`,
  },
  {
    bold: true,
    text: `Article 5: Service Use`,
  },
  {
    bold: false,
    text: `The service is generally operated 24 hours a day, unless there are special business or technical difficulties on the part of the Company.
The service is limited to commercial purposes and personal use.
The service can only be used by individuals aged 14 and older. However, minors must have the consent of a parent or other legal guardian to use the service.
It is prohibited to use the application in violation of these Terms and Conditions.
`,
  },
  {
    bold: true,
    text: `Chapter 3: Obligations and Rights`,
  },
  {
    bold: true,
    text: `Article 6: Company's Obligations`,
  },
  {
    bold: false,
    text: `The Company shall issue a member account to the member and permit the setting of profiles, such as nicknames, unless there are special circumstances.
The Company will provide the service continuously and stably in accordance with the provisions of these Terms and Conditions.`,
  },
  {
    bold: true,
    text: `Article 7: Member's Obligations
`,
  },
  {
    bold: false,
    text: `The Company shall not be liable for any damages incurred by a member due to the use or alteration of the member's account, username, and registration information by a third party (including family members), regardless of the member's intent or negligence.
If there are any changes to the information registered with the Company, the member must report the changes to the Company immediately.
`,
  },
  {
    bold: true,
    text: `Article 8: Prohibited Activities
`,
  },
  {
    bold: false,
    text: `Members are prohibited from engaging in the following activities while using the service:`,
  },
  {
    bold: false,
    text: `Actions that violate public order and social norms
Activities planned or executed with the intent to undermine public interest
Actions that violate laws, regulations, or other legal provisions
Posting threatening, defamatory, obscene, scandalous, or inciting materials
Damaging the reputation of other members or third parties or causing them disadvantage
Sending advertising emails or computer viruses
Multiple registrations
Using another person's account or information without authorization
Selling or renting member accounts
Trading points
Posting copyrighted material without authorization
Posting content that violates Article 44-7 of the Act on Promotion of Information and Communications Network Utilization and Information Protection
Any other actions deemed inappropriate by the company`,
  },
  {
    bold: true,
    text: `Article 9: Rights and Responsibilities of Members`,
  },
  {
    bold: false,
    text: `Members may withdraw their consent to these terms at any time and may terminate the membership agreement in accordance with the procedures specified in Article 11.
Members may request access to their personal information at any time and may request corrections if there are errors in their personal information.`,
  },
  {
    bold: true,
    text: `Chapter 4: Restrictions on Use, Termination, and Cancellation of Services`,
  },
  {
    bold: true,
    text: `Article 10: Restrictions on Use`,
  },
  {
    bold: false,
    text: `The company may restrict a member's use of the service without the member's consent if the member falls under any of the following categories or if the company determines that there is a possibility of such circumstances occurring.`,
  },
  {
    bold: false,
    text: `If it is determined that there is false information in the personal information requested by the company
If the company is unable to contact the member using all available contact methods, including the phone number listed in the personal information
If, considering the usage circumstances and information obtained by the company, it is suspected that the member's account or username has been used without authorization by a third party
If the member is deemed to have engaged in activities that violate relevant laws and these terms
If the company determines that there is an urgent need to restrict the member's use beyond the above circumstances
`,
  },
  {
    bold: false,
    text: `The company shall not be held responsible for any damages incurred by the member due to the inability to use the service as a result of the actions taken as specified in the previous section.
    `,
  },
  {
    bold: true,
    text: `Article 11: Termination`,
  },
  {
    bold: false,
    text: ` When a member wishes to terminate the membership agreement, they must submit a termination request through the withdrawal procedure specified by the company. The company will process this in accordance with relevant laws and regulations.
    `,
  },
  {
    bold: true,
    text: `Article 12: Termination`,
  },
  {
    bold: false,
    text: `The company may delete the member's posts and terminate the membership agreement without prior notice if there are defects in the information provided at the time of application as stipulated in Article 4, if the member fails to fulfill the obligations specified in Article 7, if the member violates the prohibitions outlined in Article 8, or if the member violates these terms or other related provisions.
    `,
  },
  {
    bold: true,
    text: `Article 13: Loss of Membership Eligibility`,
  },
  {
    bold: false,
    text: `If the membership agreement is terminated in accordance with the provisions of Article 11 or Article 12, the member will lose their membership eligibility.
The member's contact information will be removed from the company's member list from the date they lose their membership eligibility. Additionally, the member data stored in the company's database will be deleted after a certain period.`,
  },
  {
    bold: true,
    text: `Article 14: Temporary Suspension of Services`,
  },
  {
    bold: false,
    text: `The company may temporarily suspend the service without prior notice to members if any of the following circumstances apply. In such cases, the company shall not be liable for any damages incurred by members or third parties due to the suspension of the service.
    `,
  },
  {
    bold: false,
    text: `When conducting regular or emergency maintenance, inspection, repair, or modification of the service system
When the service cannot be provided due to fires, power outages, or other similar events
When the service cannot be provided due to natural disasters such as earthquakes, eruptions, floods, or tsunamis
When the service cannot be provided due to war, disturbances, riots, unrest, labor disputes, or similar circumstances
When the company deems it necessary to temporarily suspend the service for other operational or technical reasons`,
  },
  {
    bold: false,
    text: `Even in cases where the provision of the service is delayed or suspended for reasons not listed in the previous section, the company shall not be liable for any damages incurred by members or third parties due to such reasons.
    `,
  },
  {
    bold: true,
    text: `Article 15: Termination of Service Provision`,
  },
  {
    bold: false,
    text: `The company may terminate the provision of all or part of the service without prior notice.
The company shall not be liable for any responsibilities arising from the termination of the service provision.
The provisions of Article 7, Section 6, and Articles 20 to 24 shall continue to be effective even after the termination of the service. Other provisions that are expected to remain in effect due to the nature of the content will also apply similarly after the termination of the service.`,
  },
  {
    bold: true,
    text: `Chapter 5: Management of Personal Information`,
  },
  {
    bold: true,
    text: `Article 16: Collection and Handling of Personal Information`,
  },
  {
    bold: false,
    text: `The company makes every effort to protect members' personal information in accordance with relevant laws and regulations. The protection and use of members' personal information are subject to applicable laws and the company's privacy policy. However, the company's privacy policy does not apply to linked content other than the company's official application. Additionally, the company shall not be responsible for any information disclosed due to the user's fault.
The collected personal information is handled by a limited number of company personnel, and measures are taken to ensure its safety to prevent loss, theft, leakage, alteration, or damage.
In principle, the collected personal information will be destroyed without delay once the purpose of collection and use has been achieved. For example, the company may collect members' date of birth for age verification, but this information will be destroyed immediately after the verification is completed.
The collected personal information will primarily be used for content provision and will not be provided to third parties. However, in the following cases, it may be provided to third parties within the limits permitted by law.`,
  },
  {
    bold: false,
    text: `When the company receives a request for information from investigative agencies or other government authorities due to a violation of relevant laws by the member in relation to service use
When necessary for information protection tasks, including confirming the member's legal violations or violations of the terms of service
In other cases as stipulated by law
• For more details, please refer to the company's privacy policy.`,
  },
  {
    bold: true,
    text: `Article 17: Provision of Advertisements`,
  },
  {
    bold: false,
    text: `The company may display advertisements within the service in connection with the operation of the service. Additionally, advertisements may be sent to members who have consented to receive them via methods such as push notifications. In this case, members may refuse to receive such information at any time, and the company will not send advertising information if the member opts out.`,
  },
  {
    bold: true,
    text: `Chapter 6: Points/Cash`,
  },
  {
    bold: true,
    text: `Article 18: Points/Cash`,
  },
  {
    bold: false,
    text: `Members can purchase or acquire points using the payment methods designated by the company to access certain paid content.
The company shall not be liable for any deduction of points or usage of paid content caused by leaks of member registration information, mistakes, or any other reason, regardless of intent or negligence. Any taxes, fees incurred from points earned, taxes imposed on purchased products or services, and other costs will be the responsibility of the member.
Members can earn cash provided by the company by accepting video calls, and they can convert this cash into points for making video calls through the designated method within the service.`,
  },
  {
    bold: true,
    text: `Article 19: Expiration of Points/Cash`,
  },
  {
    bold: false,
    text: `If a user provides false, fraudulent, or outdated information, the company may, under its regulations, cancel the accumulation of points/cash or revoke points owned, as well as confiscate cash.
If a member acquires cash and does not engage in any activities for more than six months (i.e., if there is no login record), the cash may expire.
The cash earned by a member may expire simultaneously with the loss of membership eligibility as stipulated in Article 13.
If the service is terminated, any cash acquired will also be forfeited at that time. In such cases, the company will not refund any points held by the member.`,
  },
  {
    bold: true,
    text: `Chapter 7: Compensation for Damages`,
  },
  {
    bold: true,
    text: `Article 20: Disclaimer`,
  },
  {
    bold: false,
    text: `The use of this service, including the use of content, is done at the member's own risk. The service and all content are provided "as is" and to the extent available, without any guarantees regarding their content or quality.
The company shall not be liable for any damages arising from matters not addressed in the privacy policy related to the use of the service.
The company shall not be responsible for any information exchanged between members through this service or for any actions taken as a result of such exchanges.
The company shall not be liable for any damages incurred by the member in relation to the use of this service, except in cases of willful misconduct or gross negligence by the company.
Regarding points service affiliate sites, the company does not guarantee or assume any responsibility for the stability, accuracy, legality, or suitability of those sites.
If the company deletes information registered or posted by the member, resulting in the suspension or termination of the member's eligibility and the interruption or suspension of the service, the company shall not be liable for any damages, regardless of the reason.
The company reserves the right to set, change, or terminate the amounts of points awarded and the conversion fees for cash at any time.
The company shall not be liable for any loss or theft of points converted into cash.
If purchased points are not used, the company shall not be responsible for compensating for unused points.
The company shall not be responsible for the criteria set by affiliate sites. If a member's performance is not approved or is canceled or adjusted based on those criteria, resulting in any damages or costs to the member, the company shall not compensate for such matters.
    `,
  },
  {
    bold: true,
    text: `Chapter 8: Personal Information`,
  },
  {
    bold: true,
    text: `Article 21: Handling of Personal Information`,
  },
  {
    bold: false,
    text: `The company handles personal information appropriately in accordance with the privacy policy posted separately online.

The company processes personal information within the following purposes:

Improving the quality of the content and the service itself provided by the company
Informing members about new services offered by the company
Other uses within the scope agreed upon by the member
    `,
  },
  {
    bold: true,
    text: `Chapter 9: Miscellaneous`,
  },
  {
    bold: true,
    text: `Article 22: Attribution of Intellectual Property Rights`,
  },
  {
    bold: false,
    text: `Members are deemed to have granted the company and its affiliated companies a royalty-free, non-exclusive, perpetual, irrevocable, and fully sublicensable right regarding their user content. This includes the right for the company to use, reproduce, modify, change, publish, translate, or create derivative works of the user content, as well as to transmit, perform, and display it across all media worldwide, without the need for individual approval from the member or compensation to the member.`,
  },
  {
    bold: true,
    text: `Article 23: Links`,
  },
  {
    bold: false,
    text: `The company does not guarantee any services, products, or offerings advertised, provided, or sold by third-party organizations' websites/applications. The company does not verify third-party organizations' websites/applications. Furthermore, the company assumes no responsibility for the privacy practices and operational procedures of third-party organizations, nor for the content included on their websites/applications. The company provides no explicit or implied warranties regarding the operations, ownership, privacy practices, and the products and services of the third-party organizations’ websites/applications.`,
  },
  {
    bold: true,
    text: `Article 24: Jurisdiction`,
  },
  {
    bold: false,
    text: `The court of jurisdiction for any litigation related to these terms and conditions shall be the court that has jurisdiction over the location of VIDEOIT.
`,
  },
  {
    bold: true,
    text: `Supplementary Provisions`,
  },
  {
    bold: false,
    text: `These terms and conditions shall take effect from October 8, 2024.`,
  },
  {
    bold: true,
    text: `VIDEOIT's Intellectual Property Rights Policy`,
  },
  {
    bold: false,
    text: `This intellectual property rights policy aims to protect the rights of intellectual property holders and related rights, while promoting the fair use of works to contribute to the enhancement and development of culture and related industries. The meanings of the terms used in this policy are as follows:
    `,
  },
  {
    bold: false,
    text: `a. “Work” refers to a creation that expresses human thoughts or emotions.

b. “Author” refers to the person who created the work.

c. “Performance” refers to publicly presenting a work or a performance, recording, broadcast, or other means, including transmission (excluding transmission by means of communication) that occurs within a connected space belonging to the same person.

d. “Performer” refers to a person who expresses a work through acting, dancing, performing, singing, narrating, or other artistic methods, and includes those who conduct, direct, or supervise the performance, as well as those expressing something similar that is not a work.

e. “Public Transmission” refers to transmitting or providing access to works, performances, recordings, broadcasts, or databases (hereinafter referred to as “Works, etc.”) to the public by means of wireless or wired communication for the purpose of enabling the public to receive or access them.

f. “Broadcasting” refers to transmitting sound and images or sound and visuals so that the public can receive them simultaneously during public transmission.

g. “Transmission” refers to providing access to works, etc. in a manner that allows members of the public to access them individually at a chosen time and place during public transmission, including the transmission that occurs accordingly.

h. “Audio-visual Work” refers to a creation that contains continuous images (regardless of the presence of sound) that can be viewed or heard through a mechanical or electronic device.

i. “Video Producer” refers to the person who plans and is responsible for the entire production of the audio-visual work.

j. “Reproduction” refers to fixing or reproducing a work in a tangible form temporarily or permanently through methods such as printing, photography, copying, recording, or filming, and in the case of buildings, it includes constructing according to models or blueprints for the building.

k. “Distribution” refers to the act of transferring or lending the original or copies of works, etc. to the public, whether for compensation or not.`,
  },
  {
    bold: false,
    text: `VIDEOIT respects the intellectual property rights of others and expects users to do the same. VIDEOIT's intellectual property rights policy prohibits users from posting, sharing, or transmitting content that infringes on the copyrights, trademarks, or other intellectual property rights of others. Users may utilize works as long as it does not conflict with the ordinary methods of use and does not unfairly harm the legitimate interests of the author.
    `,
  },
  {
    bold: true,
    text: `1. Copyright`,
  },
  {
    bold: false,
    text: `Copyright is the legal right held by the author of an original work, aimed at protecting the author. Generally, copyright protects the originality of ideas (e.g., the original expression of a video or music) but does not protect the reproduction of those original ideas. In other words, copyright is typically recognized for the person who provides the idea, but not for the person who reproduces that idea as it is.
    `,
  },
  {
    bold: false,
    text: `Author

A person is presumed to hold copyright as the author of a work if they fall under one of the following categories:

a. A person whose real name or widely recognized pseudonym (such as a stage name, pen name, or abbreviation) is indicated on the original work or its copies in a commonly accepted manner.

b. A person whose real name or widely recognized pseudonym is indicated when the work is performed or publicly transmitted.

In cases where a work lacks an indication of authorship as described above, the publisher, performer, or person who made the work public is presumed to hold the copyright.`,
  },
  {
    bold: true,
    text: `Copyright Infringement`,
  },
  {
    bold: false,
    text: `VIDEOIT does not allow any content that infringes on copyright. Using content owned by others without appropriate permission or a legally valid reason may violate VIDEOIT's policies. However, not all uses of copyrighted content without permission constitute copyright infringement. Many countries allow exceptions for the use of works without permission. This includes activities permitted under the fair use doctrine in the United States and the fair dealing provisions in the European Union, as well as corresponding exceptions under local laws in other countries.`,
  },
  {
    bold: true,
    text: `Deletion of Content, Temporary Suspension, or Termination of Account`,
  },
  {
    bold: false,
    text: `User content that infringes on the copyrights of others may be deleted. In cases of multiple copyright violations related to the use of the VIDEOIT site or app, the user's account may be temporarily suspended or terminated. VIDEOIT reserves the right to prevent users from creating new accounts on its site or app in serious cases of improper account usage.`,
  },
  {
    bold: true,
    text: `Notification for Copyright Holders: Copyright Infringement Notice`,
  },
  {
    bold: false,
    text: `
Copyright holders can contact infringing users directly to resolve complaints more quickly and effectively. Alternatively, they can submit a copyright infringement report to VIDEOIT requesting the removal of content suspected of infringement.

All infringement reports must include the necessary information as outlined in the VIDEOIT online copyright infringement report form. Failure to provide required information may limit VIDEOIT's investigation of the infringement report and may lead to rejection of the report.

VIDEOIT may provide the account owner's contact information, including your email address, the name of the copyright owner, and/or details of the complaint to the suspected infringing account owner.

Please note that submitting a report with intentionally misleading or fraudulent information may result in liability for damages under Section 512(f) of the U.S. Digital Millennium Copyright Act (DMCA) or similar laws in other countries.

Upon submitting a report to VIDEOIT, the reporting party may be contacted if additional questions arise regarding the report. VIDEOIT may not be in a position to adjudicate disputes between third parties, and therefore may not delete reported content or terminate the infringer's account. Alternatively, copyright holders may choose to contact the suspected infringer directly to attempt to resolve the issue.`,
  },
  {
    bold: true,
    text: `EU Copyright Directive`,
  },
  {
    bold: false,
    text: `Under Article 17 of the Copyright Directive (EU 2019/790), if you wish to grant VIDEOIT the authority to use copyrighted works, please use the specific form provided by VIDEOIT for inquiries. After reviewing your request, we will contact you. To prevent music or audiovisual works from being used in the EU, this form must be submitted. For VIDEOIT to process these requests, you must provide the necessary information. Once this information is received and the request is verified, VIDEOIT will do its best to ensure that your works are not used in the EU VIDEOIT.

VIDEOIT provides a mechanism for resolving copyright infringement disputes to users and rights holders in accordance with legal obligations, but rights holders retain the freedom to assert their rights in court.
    `,
  },
  {
    bold: true,
    text: `Information for Users: Counter-Notification of Copyright Infringement

If you are a resident outside the European Union:`,
  },
  {
    bold: false,
    text: `When you receive a copyright infringement notice and believe there is an error in the notice or that you have the right to use the content, you can contact the copyright owner directly to request a retraction.

You may also submit a counter-notification through the VIDEOIT counter-notification form. All counter-notifications must include the necessary information required in the counter-notification form. If the required information is not provided, VIDEOIT's ability to investigate the notice may be limited, and the counter-notification may be denied.

Please be patient as the counter-notification process may take some time. During this period, the copyright claimant may file a lawsuit seeking a court order to temporarily suspend the posting of content under the U.S. Digital Millennium Copyright Act (DMCA) or similar laws in other countries. If necessary and legally permissible, VIDEOIT may forward the entire counter-notification, including the contact information you provided, to the original complainant. The complainant may use this information to take legal action against you.

If VIDEOIT does not receive notice that the complainant is seeking a court order to prevent further infringement of the material, and if the content does not infringe on third-party copyrights, VIDEOIT may reinstate or stop the deactivation of access to the removed content. The decision to republish the material is at the sole discretion of VIDEOIT.`,
  },
  {
    bold: true,
    text: `If you are a resident of the European Union:`,
  },
  {
    bold: false,
    text: `If you receive a copyright infringement notice and believe you have the right to post the content in question, you can fill out the counter-notification form.

Under EU law, users may use copyrighted works without the copyright owner's permission for the purposes of quotation, criticism, review, and caricature, parody, or pastiche, as long as it falls under fair use. EU member states may also apply additional exceptions. For more details on copyright exceptions and limitations applicable in the EU, please refer to the information below.
    `,
  },
  {
    bold: true,
    text: `2. Trademark Rights`,
  },
  {
    bold: false,
    text: `Trademark rights are the rights associated with marks that distinguish a company's goods or services from those of other companies in the marketplace. Therefore, it is essential for a trademark to possess uniqueness or distinctiveness, meaning it should be able to identify the source of the business. Trademark rights encompass words, symbols, slogans, designs, or a combination of these that identify the source of a product or service and distinguish it from other products or services.`,
  },
  {
    bold: true,
    text: `Trademark Infringement`,
  },
  {
    bold: false,
    text: `Trademark law prohibits trademark infringement, which generally involves the unauthorized use of a trademark or service mark in a way that can cause confusion, deception, or mistake regarding the source, origin, sponsorship, or affiliation of goods or services.`,
  },
  {
    bold: true,
    text: `Removal of Content, Temporary Suspension, or Termination of Account`,
  },
  {
    bold: false,
    text: `Content that infringes on another person's trademark rights may be removed. If there are multiple violations of trademark rights or other breaches of the terms of service and community guidelines related to the use of the VIDEOIT site or app, the account may be temporarily suspended or terminated. We reserve the right to prevent account owners who have used their accounts for inappropriate activities from creating new accounts on the VIDEOIT site, app, or any location hosted by VIDEOIT.`,
  },
  {
    bold: true,
    text: `Trademark Complaints and Reporting`,
  },
  {
    bold: false,
    text: `You can resolve complaints more quickly and in a manner that is more beneficial for yourself, other users, and our community by contacting users directly. You may submit a trademark infringement complaint.

All complaint submissions must include the necessary information required in our online trademark infringement complaint form. If the required information is not provided, our ability to investigate the complaint may be limited, and the complaint may be denied.

We may share your contact information, including your email address, the name of the trademark owner, and/or details of the complaint with the account owner in accordance with our terms of service and privacy policy.

Before submitting a complaint, please be aware that intentionally submitting misleading or fraudulent complaints may result in liability for damages under laws applicable in certain countries.`,
  },
  {
    bold: true,
    text: `Counter-Notification of Trademark Infringement`,
  },
  {
    bold: false,
    text: `If you receive a trademark infringement notice and believe there is an error in the notice or that you have the right to use the content, you can contact the trademark owner directly to request a retraction.

You may also submit a counter-notification through our counter-notification form. All counter-notifications must include the necessary information required in the counter-notification form. If the required information is not provided, our ability to investigate the complaint may be limited, and the counter-notification may be denied.`,
  },
  {
    bold: true,
    text: `General Information`,
  },
  {
    bold: false,
    text: `VIDEOIT users are responsible for the content they post. If you have questions regarding whether your content or the use of someone else's or a brand's name infringes or violates another's rights, you may consult a lawyer regarding copyright or trademark law. If you are unsure whether the material you wish to report infringes or violates another's rights, it is advisable to seek legal counsel before reporting the content.`,
  },
  {
    bold: true,
    text: `User-Generated Content (UGC)`,
  },
  {
    bold: false,
    text: `VIDEOIT may include means for certain members to share content (“UGC”: User Generated Content) with other members. To the maximum extent permitted by applicable law, VIDEOIT automatically holds the rights and licenses to use, reproduce, modify, adapt, publish, translate, reuse, permit, create derivative works, and distribute the UGC generated by members (including but not limited to images, videos, customer service requests, idea submissions, suggestions, and message postings). The rights held by VIDEOIT are non-cancelable, non-exclusive rights that are not limited by region and do not require separate fees. Members agree that these rights allow VIDEOIT to use the UGC for all purposes, including commercial purposes, without separate compensation to the member. Additionally, members agree to waive any moral rights or similar rights they may have regarding the UGC they create and not to assert such rights.

VIDEOIT may monitor, approve, verify, or pre-block UGC posted by members. VIDEOIT reserves the right, at its discretion, to remove, block, edit, move, or deactivate members' UGC. Specifically, if a member posts inappropriate UGC on VIDEOIT, VIDEOIT may delete the UGC as quickly as possible (within a maximum of 24 hours). Members can also report inappropriate UGC from other members to the VIDEOIT monitoring team. If a member's UGC contains links to content outside the website, the member must ensure that the content of the links and the external website are appropriate for the community. This rule applies not only to "embedded links" where videos automatically play upon clicking but also to simple links that indicate the location or path of a website. Simply posting a link can facilitate copyright infringement (Supreme Court ruling 2017Do19025, September 9, 2021). Therefore, if the links or referenced websites you post are inappropriate, VIDEOIT may delete them immediately. VIDEOIT will monitor, edit, or remove members' UGC only to the maximum extent permitted by applicable law. Members agree not to hold VIDEOIT liable for damages arising from UGC related to themselves or other members (including but not limited to defamation, harassment, or losses/damages related to false warranties).

Members agree that the UGC they provide (i) does not currently or in the future infringe on any third party's intellectual property rights or rights of others (including but not limited to moral rights), and (ii) that when using the UGC in the manner specified in this agreement, they will not need to pay any royalties or consider third parties in the future. Members may not upload or post UGC that infringes on third-party copyrights, trademarks, or other intellectual property rights, nor may they upload UGC that infringes on third-party privacy or publicity rights, and members cannot be required to pay royalties or consider other matters to third parties regarding their UGC. Members are responsible for all of their UGC, including the transmission, posting, or other provision of text, files, links, software, photos, videos, sounds, music, or other information or materials. Members may only upload UGC that they have created themselves. Do not upload someone else's UGC to VIDEOIT.

Members agree to grant VIDEOIT the right to allow all VIDEOIT members to access and use their UGC without additional notice, attribution, or compensation to the member, to the extent that they permit access and use to other members.

VIDEOIT collects content, communications, and other information provided by members when they use VIDEOIT (including account registration, content creation or sharing, messaging, or communication with others). This may include information related to the content provided by the member, such as the location where a photo was taken or the date a file was created (metadata). It may also include information displayed through features provided by VIDEOIT, such as cameras.

Members may share information about themselves on VIDEOIT. In this case, any VIDEOIT member can access that information and associate it with the member who posted it. VIDEOIT does not guarantee the accuracy, efficacy, or truthfulness of the UGC created by members. Such features may include UGC uploads or submissions, comparison of statistics/personal bests/rankings with themselves and other users, and searching for other users by username. However, if UGC such as statistics/personal bests/rankings created by members violates VIDEOIT’s UGC policy, VIDEOIT may delete such UGC at any time.`,
  },
  {
    bold: true,
    text: `Content That Should Not Be Posted`,
  },
  {
    bold: true,
    text: `1. Child sexual abuse, exploitation, and nude images.`,
  },
  {
    bold: true,
    text: `Child Sexual Abuse`,
  },
  {
    bold: false,
    text: `The following content related to child sexual abuse is strictly prohibited:

Threatening, depicting, praising, supporting, or providing guidance regarding the sexual abuse of children (actual or virtual minors, infants), including but not limited to activities or content that:

Sexual Intercourse:

Explicit sexual intercourse or oral sex defined as the insertion or contact of a mouth or genitals with another person's genitals or anus, with at least one person's genitals exposed.
Implicit sexual intercourse or oral sex, including situations where contact is imminent or not directly visible.
Stimulation of genitals or anus, including situations where such activity is imminent or not directly visible.
Presence of byproducts resulting from sexual acts.
Any of the above activities involving animals.
When a child is depicted with sexual elements, including but not limited to:

Acts of bondage.
Focus on the genitals.
Presence of sexually aroused adults.
Presence of sexual toys.
Sexualized clothing.
Undressing.
Staged environments (e.g., on a bed) or professionally staged photography (quality/focus/angle).
Open-mouthed kissing.
Content depicting children in sexual fetish situations.
Content that supports, promotes, advocates, or incites pedophilia (excluding neutral discussions in academic or verified medical contexts).
Content that identifies or mocks children presumed to be victims of sexual abuse by name or image.`,
  },
  {
    bold: true,
    text: `Requests`,
  },
  {
    bold: false,
    text: `Content requested

• Child Sexual Abuse Materials (CSAM)
• Nude images of children
• Sexualized images of children.
• Actual sexual contact with a child`,
  },
  {
    bold: true,
    text: `Inappropriate Interaction with Children`,
  },
  {
    bold: false,
    text: `Content that constitutes or promotes inappropriate interaction with children. Examples:

Soliciting or planning actual sexual contact with children.
Intentionally exposing children to sexually explicit material or subjects.
Inducing children to engage in implicit sexual conversations through private messages.
Obtaining or requesting sexual material from children via private messages.`,
  },
  {
    bold: true,
    text: `Sexual Exploitation for Exploitative Purposes and Non-Physical Coercion`,
  },
  {
    bold: false,
    text: `Content that attempts to exploit minors in the following ways:

Threatening to expose images or information that would cause sexual shame to the parties involved, while coercing them for money, favors, or images that induce sexual shame.
Threatening to share or expressing the intention to share private sexual conversations or private images.`,
  },
  {
    bold: true,
    text: `Sexual Objectification of Children`,
  },
  {
    bold: false,
    text: `Content that requests images of child sexual abuse, images of nude children, or sexually explicit images or videos.

• Content depicting children in sexual situations (including photos, videos, live art, digital content, and verbal descriptions)
• Groups, pages and profiles aimed at sexual objectification of children.`,
  },
  {
    bold: true,
    text: `Nude images of children`,
  },
  {
    bold: false,
    text: `Content depicting nudity of children (nudity images are defined as follows):

• Close-up images of children’s genitals.
• Nude images of infants and toddlers, such as:
    
• Exposure of genitals (even when covered or obscured by transparent clothing)
• Close-up images of fully exposed anus and/or nude buttocks.
    
• Nudity images of minors, including:
    
• Exposure of genitals (including pubic hair or when covered only by transparent clothing)
• Close-up images of fully exposed anus and/or nude buttocks.
• Exposed female nipples.
• Nude from neck to knees – even if no genitals or female nipples are visible.
• Digital depiction of nude images of minors or infants, except for medical or educational purposes;`,
  },
  {
    bold: true,
    text: `Child Abuse That Is Not Sexual Abuse`,
  },
  {
    bold: false,
    text: `Images Depicting Child Abuse That Is Not Sexual Abuse

Images that depict child abuse that is not sexual in nature, regardless of the intent to share.
Content that praises, supports, promotes, advocates for, guides, or encourages participation in non-sexual child abuse.
For the following types of content, a warning screen will indicate that it is restricted to adults aged 19 and older due to potentially disturbing nature:

Videos or photos depicting police officers or soldiers committing non-sexual child abuse without sexual elements.
Images of non-sexual child abuse (if requested to remain on the platform for explicit purposes to ensure the safety of children by law enforcement, child protection agencies, or trusted safety partners).
For the following types of content, a sensitive content warning screen will be included to indicate that it may contain disturbing material:

Videos or photos depicting a child being vigorously soaked in a religious ritual context.
Additional information and/or context may be required for enforcement according to community guidelines.
VIDEOIT will insert warning labels on content that may be sensitive, such as:

Images depicting naked children in the context of famine, genocide, war crimes, or humanitarian crimes, posted by news organizations (unless a violation caption has been inserted or shared in relation to a violation, in which case the content will be removed).
Furthermore, upon receiving reports from news media partners, NGOs, or other trusted safety partners, images depicting the aftermath of non-sexual child abuse may be removed.`,
  },
  {
    bold: true,
    text: `2. sexual abuse of adults`,
  },
  {
    bold: true,
    text: `Policy basis`,
  },
  {
    bold: false,
    text: `As stated in Article 8 of our community guidelines regarding sexual abuse against adults, VIDEOIT may be used to discuss sexual violence and exploitation and to raise awareness on these topics. We recognize the importance of these discussions and hope for active dialogue. We also wish to discuss the advocacy for sex workers' rights and regulations related to sex work. However, any content that promotes, encourages, or facilitates sexual encounters or commercial sexual services will be rejected. This is a measure to prevent the activation of transactions that may relate to trafficking, coercion, and non-consensual sexual acts.

Additionally, we restrict explicit sexual expressions that may lead to solicitation for sex work. This type of content may be sensitive for some users within the global community and could hinder communication with friends or the broader community.

Content not allowed:

Content that offers or requests adult commercial services, such as soliciting or providing fees for escort services, or paid sexual fetishes or domination services (content that persuades or suggests third-party sex work to others will be considered separately under the trafficking policy).

Attempts to solicit or promote sexual acts between adults for that purpose, except when promoting an event or location (including but not limited to):

Recording sexual acts
Pornographic acts, strip club shows, live sex performances, or suggestive dancing
Sexual, obscene, or tantric massages
Acts that explicitly solicit sex work by offering or requesting items, including but not limited to:

Offering or requesting sexual intercourse or sexual partners (including partners sharing fetishes or sexual interests)
Chatting or conversing about sexual intercourse
Nude photos/videos/images/sexual fetish items
Sexual slang
VIDEOIT allows the expression of desires for sexual acts, the promotion of sex education, discussions about sexual acts or experiences, teaching sexual skills, or providing classes or programs to discuss sex, provided they imply or indirectly offer or request solicitation for sex work while meeting all the following criteria. If both criteria are not met, it will be considered a violation. For example, if a hand-drawn image depicts a sexual act but does not request or offer solicitation for sex work, it will not violate this provision.
`,
  },
  {
    bold: true,
    text: `• Criterion 1: Offer or Request`,
  },
  {
    bold: false,
    text: `• Content that implicitly or indirectly offers or requests sex work (typically by providing a method of contact).`,
  },
  {
    bold: true,
    text: `• Criterion 2: Sensational Elements`,
  },
  {
    bold: false,
    text: `• Content that provides or requests the aforementioned items using one or more sensational elements as follows:

Sexual slang commonly used in the region
Mentioning or describing sexual acts, such as sexual roles, positions, fetish scenarios, states of arousal, sexual intercourse, or sexual acts (including genital penetration or masturbation), using emoticons commonly known for sexual expression
Content that includes images of adult nudity and depicts sexual acts as defined by the sexual conduct policy (including hand-drawn content, digital, or real art)
Positions
Audio or other content depicting sexual acts that violate the sexual conduct policy with images of adult nudity
Providing or requesting pornography (including, but not limited to, sharing links to external pornographic websites)

Content that includes sexually explicit language detailing and vividly describing the following, beyond mere references:

States of sexual arousal (e.g., wetness or erection)
Acts of sexual intercourse (e.g., acts of sexual penetration, masturbation, or performing fetish scenarios)
Content shared with sexual metaphors or sexual insults in a humorous, satirical, or educational context is excluded
Additional information and/or context may be needed for enforcement under the following community guidelines:

• If content is identified as satirical, it may be permitted even if it violates community guidelines. Content is allowed only if its violating elements are satirical or attributed to another object or person and used to mimic or criticize that object or person.`,
  },
  {
    bold: true,
    text: `3. Trafficking`,
  },
  {
    bold: true,
    text: `Policy Basis`,
  },
  {
    bold: false,
    text: `In consultation with external experts from around the world, we have consolidated our existing exploitation policy, which was previously scattered across various provisions of the community guidelines, into a single clause focused on human trafficking to address the wide range of harmful activities that may appear on our platform. According to experts, these issues can be considered under the single category of “human trafficking.”

To prevent and block harm, we will delete content that promotes and facilitates human exploitation, including trafficking. We define trafficking as a business that deprives others of their freedom for profit. Forcing someone against their will to participate in commercial sex, labor, or other activities constitutes human exploitation. Human trafficking relies on deception, physical force, and coercion, depriving others of their freedom and undermining human dignity for economic or material gain.

Human trafficking occurs multifaceted across the globe, affecting individuals regardless of age, socioeconomic background, race, gender, or region. Its forms are diverse and can escalate in severity depending on the situation. Due to its coercive nature, victims often have no choice.

While it is important to differentiate between human trafficking and human exploitation, they can appear in related or overlapping forms. The UN defines human trafficking as the facilitation or promotion of illegal entry into another country across borders. In these cases, even without coercion or physical force, vulnerable individuals seeking a better life may be exposed to exploitation. Human trafficking is a crime against the individual, while trafficking is a crime against the state related to movement.

Content not allowed:

Content or actions that may lead to human exploitation, including but not limited to:

Sex work involving minors and adults
Child trafficking or illegal adoption
Orphanage trafficking and orphanage volunteer tourism
Forced marriage
Labor exploitation (including debt bondage)
Domestic servitude
Trafficking of non-regenerative organs
Coercion into criminal activities (e.g., forced begging, drug trafficking)
Recruitment of child soldiers
Content for the purpose of:

Recruiting potential victims through physical force, deception, coercion, seduction, trickery, intimidation, or other non-consensual acts
Facilitating human exploitation by coordinating, transporting, moving, hiding, or brokering victims before or during exploitation
Promoting, depicting, or advocating for human exploitation
Content that provides or promotes smuggling.`,
  },
  {
    bold: true,
    text: `Community Guidelines`,
  },
  {
    bold: false,
    text: `VIDEOIT removes content that has the potential to cause real harm. This includes the sale of adult products, hate speech, harassment and bullying, as well as misinformation that poses a risk of immediate violence or physical injury. Actions are taken in accordance with VIDEOIT’s policies.

`,
  },
  {
    bold: true,
    text: `Summary`,
  },
  {
    bold: false,
    text: `VIDEOIT is a space where people can freely express themselves and inspire each other. Please help us continue to create a safe and trustworthy VIDEOIT together. You can only post photos and videos that you own, and you must always comply with the law. Respect other VIDEOIT users and do not send spam or post nude images.`,
  },
  {
    bold: true,
    text: `Main Text`,
  },
  {
    bold: false,
    text: `VIDEOIT Community Guidelines

VIDEOIT is a space created by people from diverse cultures, ages, and beliefs. We always strive to thoughtfully consider various perspectives to create a space where everyone from different backgrounds can safely and enjoyably participate.

The community guidelines are policies established to keep our valuable community safe and protected. By using VIDEOIT, you agree to these guidelines and terms of service. Please help ensure that everyone can enjoy VIDEOIT. Violations of these guidelines may result in content removal or account deactivation.

For this reason, content that may be shareable or serve the public interest may be permitted even if it somewhat contradicts the VIDEOIT community guidelines, depending on the circumstances. However, VIDEOIT will allow such content after carefully weighing its public interest value against the potential risks of harm, referencing international human rights regulations for judgment.

Share only photos and videos that you have taken or have permission to share.
You always retain ownership of the content you post on VIDEOIT. You must post original content and cannot post content that you do not have the right to copy or gather from the internet. Learn more about intellectual property rights.

Post photos and videos that everyone can enjoy.
While there may be instances where individuals wish to share nude images for artistic or creative expression, VIDEOIT does not permit nude images for various reasons. This includes photos and videos depicting sexual acts or genitalia, close-ups of fully exposed buttocks, and digital creations. Photos of women's nipples are also included. Images of paintings or sculptures that depict nudity are not permitted.

People often want to share photos or videos of their children. However, for safety reasons, VIDEOIT may delete images or partial images of children's nudity. This is because such content can be utilized by others in unexpected ways, even if shared with good intentions.

Participate in meaningful and genuine interactions.
Help make VIDEOIT free of spam. Avoid artificially collecting likes, followers, or shares, repeatedly flooding comments or content, or contacting people repeatedly for commercial purposes without consent. You should not offer money or gifts in exchange for likes, follows, comments, or other engagements. You must not engage in or promote content that provides, solicits, or facilitates misleading or deceptive user reviews or ratings.

While VIDEOIT does not require you to use your real name, VIDEOIT users must provide accurate and up-to-date information. Do not impersonate others or create accounts with the intention of violating the guidelines or causing misunderstandings.

Comply with the law.
VIDEOIT is not a space that advocates for or supports terrorist organizations, criminal organizations, or hostile groups based on race/religion. The provision of sexual services, the sale or purchase of weapons, alcohol, or tobacco products between individuals, and the sale and purchase of non-medical or prescription drugs are also not permitted. Furthermore, content attempting to trade, facilitate, donate, gift, or request non-medical drugs, and content acknowledging the personal use of non-medical drugs (except when used for recovery) will be removed. VIDEOIT also prohibits the sale of live animals between individuals, though retailers may provide such sales. There can be no facilitation of poaching or the sale of endangered species or their parts.

Always remember that any sale or purchase of regulated products must comply with the law. Accounts promoting online gambling, online skill games with cash transactions, or online lottery must obtain written permission before using the products.

Sharing sexual content involving minors or threatening to post images that could cause sexual humiliation to participants is strictly prohibited under any circumstances.

Respect your fellow community members who use VIDEOIT.
VIDEOIT aims to foster a positive and diverse community culture. Accordingly, we will delete content that includes threats or hate speech, content that defames or shames specific individuals, exposure of personal information for the purpose of extortion or harassment, and unwanted repetitive messages. Intense discussions about individuals who receive public attention due to their profession or specific activities are generally permitted.

Acts of violence or attacks against someone based on their race, ethnicity, nationality, gender, age, gender identity, sexual orientation, religion, disability, or illness are never permitted. However, hate speech shared with the clear intention of opposing or raising awareness may be permitted.

Do not glorify self-harm; provide support.
VIDEOIT is a caring community where individuals with difficult issues, such as eating disorders and self-harm, can come together to recognize problems or seek help. VIDEOIT strives to support education for these individuals on the app and provide related information through customer service to ensure they can receive the necessary assistance.

Encouraging or promoting self-harm is a behavior that exacerbates the problem, and accounts may be deleted or deactivated upon receipt of reports related to this issue. Additionally, content that exposes or mocks the identity of individuals who self-harm will be removed.

Be cautious when posting significant events.
Many people use VIDEOIT to share events that can become significant issues. Such events may often include provocative images. Since VIDEOIT is a space for people of various ages and backgrounds with differing ethnicities, values, and genders, videos containing provocative or violent scenes will be removed to ensure that everyone can use the platform comfortably.

Of course, there may be instances where individuals wish to share such content to raise awareness, critique, or educate. If you share content for such purposes, please include a warning regarding violent images with the photos. Sharing provocative images for the sake of sadistic enjoyment or glorifying violence is not permitted under any circumstances.

Help create a healthy community.

The VIDEOIT community is a place where valuable people come together. If you discover a post that violates the guidelines, please use the reporting options provided. The global team reviews reports to delete non-compliant content as quickly as possible. You can submit a report even if you do not have an VIDEOIT account. When filling out a report, please provide as much detailed information as possible, such as links, usernames, and descriptions of the content, to help us locate and review it quickly. If images or related phrases do not adhere to the guidelines, the entire post may be removed.

Simply disliking content does not constitute a violation of community guidelines. If you encounter content you dislike, you can unfollow or block the person who posted it. If you dislike a comment on a post, you can delete that comment.

Direct communication between community members often resolves disputes or misunderstandings. If someone else has posted your photos or videos, request their removal by commenting on the post. If that does not resolve the issue, please submit a copyright infringement report. If you believe someone has infringed upon your trademark, you may submit a trademark report. Avoid actions that draw attention to the poster, such as posting screenshots targeting that person, as this can be seen as harassment.

VIDEOIT may cooperate with judicial authorities to take appropriate action if there is a suspicion of physical threats against others or direct threats to public safety.`,
  },
  {
    bold: true,
    text: `Virtual Item Policy`,
  },
  {
    bold: false,
    text: `
The VIDEOIT program (hereinafter referred to as "the Program") is provided on VIDEOIT (hereinafter referred to as "the Platform") to allow users to access content and utilize text, video, and voice chat functions among users. This Program is available to users aged 18 and older who utilize this service, and the following conditions of this virtual item policy apply. If you are under 18 years of age, you may not participate in this Program.

Users eligible to participate in this Program are as follows:

Users who are at least 18 years old (or of the age of majority in your jurisdiction) can participate in the Program.
Only users who are at least 18 years old (or of the age of majority in your jurisdiction) may purchase points or use points to purchase gifts to send to other users.`,
  },
  {
    bold: true,
    text: `Point`,
  },
  {
    bold: true,
    text: `Who can purchase points?`,
  },
  {
    bold: false,
    text: `Users aged 18 and older (or of the age of majority in your jurisdiction) who use this service may purchase virtual points (hereinafter referred to as "Points") from us by using authorized payment methods and payment services provided and approved by us.
`,
  },
  {
    bold: true,
    text: `Point purchase information`,
  },
  {
    bold: false,
    text: `The price of Points will be disclosed at the time of purchase. All charges and payments for Points will be processed in the currency specified at the time of purchase through the relevant payment methods. Currency exchange settlements, international transaction fees, and payment channel fees are based on the agreement between you and the relevant payment service provider.
You are responsible for the payment actions related to your Point purchases. Once the purchase is completed, your user account will be credited with Points.
If you wish to make changes to your purchase, please contact us at the email address specified below. Please note that such changes may affect the price and other elements related to your purchase. If you reside in the European Union, you have the right to withdraw from the purchase according to the Consumer Rights Directive and related laws. However, by purchasing Points, you acknowledge and agree that we will begin supplying Points to you immediately upon completion of the purchase, and at that point, you will lose your right to cancel or withdraw from the contract.`,
  },
  {
    bold: true,
    text: `Point usage information`,
  },
  {
    bold: false,
    text: `Points can be used to purchase virtual gifts. Points cannot be exchanged for cash, legal currency, currency commonly used in other states, regions, or administrative districts, or other types of credits.
Points are only available for use on the Platform and solely as part of this service. Unless specified by us, they cannot be combined or used with other promotions, coupons, discounts, or special events.
Points cannot be transferred or assigned to other users of this service or third parties without our explicit written consent. Any sale, exchange, transfer, or other disposal of Points by anyone other than us is strictly prohibited.
Accumulated Points are not considered property and will not be transferred due to (a) death, (b) family-related circumstances, or (c) the operation of any other laws.
All Points that are transferred, sold, or assigned without our explicit written consent are invalid. Users of this service who violate the aforementioned restrictions will have their accounts terminated by us, and Points will be forfeited from the user’s account, with the user being responsible for damages, legal costs, and transaction fees.
All Points belonging to the user will automatically expire if the user’s account is terminated for any reason.
You agree that we have the absolute right to manage, regulate, control, modify, and/or remove Points, and that we will not be liable to you for exercising this right if we have reasonable grounds to do so under normal or specific circumstances. If we decide to completely eliminate Points from this service, we will provide you with reasonable notice.`,
  },
  {
    bold: true,
    text: `Gift`,
  },
  {
    bold: true,
    text: `Who can buy a gift?`,
  },
  {
    bold: false,
    text: `
Users aged 18 and older (or of the age of majority in your jurisdiction) who use this service can exchange Points to purchase virtual gifts (hereinafter referred to as "Gifts"). Gift Purchase Guidelines:
Gifts represent a limited license for you to use certain features of digital products and this service. The exchange rate between Points and Gifts will be posted on the Platform at the time of exchange.
The published price includes taxes unless otherwise required by applicable law in your jurisdiction. If a sales tax applies to Gifts in your jurisdiction and you do not pay that sales tax to us, you will be responsible for paying the sales tax and any associated fines or interest to the relevant tax authorities.
You agree that we have the absolute right to manage, regulate, control, modify, and/or remove the exchange rate at our sole discretion if we deem it appropriate under normal or specific circumstances, and we will not be liable to you for exercising this right.
If you wish to make changes to your purchase, please contact us at the email address specified below. We will inform you whether changes are possible. Please note that such changes may affect the price and other elements related to your purchase.
Unless otherwise specified in this virtual item policy, all Gift sales are final, and we do not provide refunds for any Gifts sold. When you exchange Points for a Gift, those Points will be considered used from your user account. Instead, your user account will be credited with the Gift.
Gifts cannot be converted or exchanged for Points or cash and are non-refundable or redeemable for any reason.
Gifts exchanged or received from users are not considered property and will not be transferred due to (a) death, (b) family-related circumstances, or (c) the operation of any other laws.
We may replace an exchanged Gift or a Gift received from a user if we determine that there is an error or other damage to the previously exchanged Gift at our sole discretion. We will not charge any additional fees for reissuing Gifts that have errors or are otherwise damaged. If you receive an erroneous or damaged Gift, please contact us at traveltofindlife@gmail.com.
We reserve the right to terminate the account of any user we determine is abusing this provision or to take other appropriate actions at our sole and absolute discretion.`,
  },
  {
    bold: true,
    text: `Gift usage information`,
  },
  {
    bold: false,
    text: `In relation to content works, you may donate Gifts to allow other users (hereinafter referred to as "Content Providers") to evaluate or express appreciation for user content items uploaded or created through video chat.
If this feature is available in the service, you can donate a Gift to user content by clicking "Gift" below the corresponding user content.
When you donate a Gift to a user content item, that Gift will be considered used from your account and credited to the Content Provider's account.
Please be aware that when you provide Gifts to other users, this action is public, and the recipient of the Gift in this service will be able to see the history of Gifts you have provided.`,
  },
  {
    bold: true,
    text: `Subscription payment`,
  },
  {
    bold: true,
    text: `Who can purchase subscription payments?`,
  },
  {
    bold: false,
    text: `Subscription payments can be set by creator members, and the price will be disclosed at the time of purchase. All charges and payments for subscription payments will be processed in the currency specified at the time of purchase through the relevant payment methods. Currency exchange settlements, international transaction fees, and payment channel fees are based on the agreement between you and the relevant payment service provider.
Subscription payments mean that payment will be automatically charged every 30 days from the date of payment, granting you membership privileges for one month from the payment date (e.g., payment on October 7, 2023, will grant membership privileges until November 6, 2023).
If 30 days have passed after the subscription payment and the user has not canceled the subscription, an automatic payment request will occur daily for five days.
Membership privileges refer to the rights set by the creator, allowing you to access content corresponding to those membership privileges (e.g., community posts).
You are responsible for the payment actions related to your subscription payments. Once the purchase is completed, your user account will be granted membership privileges.
If you wish to make changes to your purchase, please contact us at the email address specified below. Please note that such changes may affect the price and other elements related to your purchase. However, refunds are not available for viewing content accessible under an active subscription membership. If you reside in the European Union, you have the right to withdraw from the purchase according to the Consumer Rights Directive and related laws. However, by purchasing a subscription payment, you acknowledge and agree that we will begin supplying membership privileges to you immediately upon completion of the purchase, and at that point, you will lose your right to cancel or withdraw from the contract.`,
  },
  {
    bold: true,
    text: `Subscription payment instructions`,
  },
  {
    bold: false,
    text: `1. To smoothly use the paid services provided by the "Company," members must comply with the following conditions after applying for paid services:

Members applying for paid services must diligently pay the usage fees.
Members applying for paid services must make the payment immediately after applying.
2. The method of using paid services is available through payment methods provided by the "Company," such as credit card or mobile phone payment. However, if there is a separate provider operating each payment method, members must follow the procedures presented by the payment method provider before using that payment method.

3. Subscriptions for viewing "Creators'" digital content can be canceled at any time, and upon cancellation, the subscription service will automatically stop from the next payment date (the day corresponding to one month after the first payment date).

5. The "Company" can increase or decrease the prices of all regular and one-time payment content purchased by "Members" within the service only in the following cases. However, for refund requests arising from insufficient prior notice by the Creator or lack of awareness by the Member, the Company may request the Creator to deduct or reimburse the amount from the settlement amount.

If the "Company," which had not collected VAT, needs to collect 10% VAT on the existing payment amount due to incorporation.
If the "Creator" requests it for the smooth operation of their "Page."
6. The "Company" can decrease the prices of all regular and one-time payment content purchased by "Members" within the service.

7. The provision dates for individual paid services are as follows:

One-time payment paid content will be unlocked immediately upon payment and can be viewed.
Membership products for regular payments will grant membership privileges immediately upon payment.
8. The "Company" may provide the following information, which the "Member" entered during the payment process, to a third party ("Creator") solely for the purpose of delivering the purchased product:

Contact information such as email for providing digital products, mobile phone number, and social network service (SNS) ID.
Delivery information such as name, contact information, and shipping address for providing physical products.
Request information necessary for custom production of products and service provision.`,
  },
  {
    bold: true,
    text: `Terms of Service - Creators`,
  },
  {
    bold: true,
    text: `Article 1 (Purpose)`,
  },
  {
    bold: false,
    text: `This agreement is aimed at defining the rights, obligations, and responsibilities between creators (including all forms of content creators hereinafter referred to as "Creators") and Fantasy Innovation Ltd. (hereinafter referred to as "Company") regarding the use of the "VIDEOIT service" provided on the Internet (applications). Therefore, the following contract (hereinafter referred to as "this Agreement") is established.
`,
  },
  {
    bold: true,
    text: `Article 2 (Definitions of Terms)`,
  },
  {
    bold: false,
    text: `“VIDEOIT Service” refers to the service provided by the "Company" that allows "Creators" to receive credits from an unspecified number of users who purchase their creations through the online platform operated by the "Company."

“User” refers to an individual who agrees to these terms and is granted the eligibility to use the services provided by the "Company."

“Purchase” refers to the act of a user paying "Creators" with bouquets using the method specified by the "Company" in order to access paid content offered by the "Creators."

“Charging” refers to the act of a user converting points into bouquets using the in-app payment methods provided by the service to make content purchases.

“Refund” refers to the act of a user receiving points back from the bouquets they charged.

“Settlement” refers to the act of converting bouquets received by the "Creators" into cash.

“Creator” refers to a user who provides content such as photos or videos in their story.

“Settlement Amount” refers to the amount paid by the "Company" to the "Creator" after deducting platform fees and other taxes from the bouquets.

“Payment Institution” refers to banks, credit card companies, issuing institutions for prepaid payment methods, etc.

“Content” refers to the overall services provided or sold on web and app platforms, meaning any materials or information expressed in codes, characters, sounds, audio, images, or videos used in the information and communications network as defined in Article 2, Section 1, Subsection 1 of the Act on Promotion of Information and Communications Network Utilization and Information Protection.

“Subscription Payment” refers to the purchase of a service that automatically charges the amount corresponding to the amount set by the "Creator" every month from the date of purchase.


`,
  },
  {
    bold: true,
    text: `Article 3 (Interpretation and Application of Terms)`,
  },
  {
    bold: false,
    text: `Regarding matters not specified in this contract, separate detailed terms, customary practices, the company's announcements, user guides, and applicable laws shall apply. However, if the "Creator" enters into a separate contract with the "Company" to use the services, the separate contract shall take precedence.`,
  },
  {
    bold: true,
    text: `Article 4 (Specification, Effectiveness, and Revision of Terms)`,
  },
  {
    bold: false,
    text: `The Company specifies the contents of these terms in the terms of use. The Company may revise these terms within the limits that do not violate relevant laws, such as the "Act on the Regulation of Terms and Conditions" and the "Act on Promotion of Information and Communications Network Utilization and Information Protection."

In the event of changes to the terms, the Company will determine the content of the revised terms and the effective date, and will announce them for at least 7 days prior to the effective date (or 30 days for changes that are unfavorable or significant to users). The revised terms shall take effect from the announced effective date.

Creators have the right to disagree with the revised terms, and if they do not express their intention to refuse during this period, they will be deemed to have agreed to the changes based on the effective date. If a Creator does not agree to the revised terms, they may terminate the service agreement.`,
  },
  {
    bold: true,
    text: `Article 5 (Contents of Payment Services and Obligations of Both Parties)`,
  },
  {
    bold: false,
    text: `① The Company shall provide the "VIDEOIT Service" on a continuous basis as a principle.
② The Company's obligations are as follows:

Technical measures necessary for the continuous provision of the VIDEOIT service, including system construction, improvement, and system integration. However, in the event of any of the following circumstances, the Company may temporarily suspend the provision of all or part of the service without prior notice. In such cases, the Company will promptly notify users of the reason and duration of the suspension.
(1) If the Company needs to conduct urgent system checks, expansions, replacements, maintenance, or construction.
(2) If the Company deems it necessary to replace the service system with a new one.
(3) If normal service provision is impossible due to failures in the system or other service facilities, or due to wired and wireless network failures.
(4) If there are force majeure events beyond the Company’s control, such as natural disasters, national emergencies, or power outages.

Rapid recovery in case of system failures.
Settlement for Creators.
③ The obligations of the Creator are as follows:

Payment of platform fees and other charges to the Company.
Provision of information for settlement processing.
Compliance with the content and usage guidelines stated in the "VIDEOIT Operating Policy."
All income generated from the "VIDEOIT Service" and the responsibility for reporting and taxes related to it shall rest with the Creator.
④ The Creator must not collect or induce payments from users in the following ways:

Collecting or inducing payments without using the VIDEOIT service.
Collecting or inducing payments for the purpose of selling products.
Collecting or inducing payments with the intent to refund the payment amount after currency exchange.
Receiving or inducing payments through methods that include any unlawful reasons under current laws.
⑤ If the Creator violates paragraphs 3 or 4 of this Article, the Company may take the following actions:

Termination of the contract if the other party breaches the contract without justifiable reason and fails to rectify the breach within 7 business days from the date of receiving a written (including email) correction request.
Cancellation of all transactions arising from the above reasons.
Suspension of the payment amount regardless of the settlement provisions of this contract.
Legal actions for damages against the Creator in case of any losses incurred by the Company, including civil and criminal claims.`,
  },
  {
    bold: true,
    text: `Article 6 (Transaction Cancellation, Refund of Purchase Amount, Termination of Contract, etc.)`,
  },
  {
    bold: false,
    text: `The Company complies with relevant laws, including the Act on the Protection of Consumers in Electronic Commerce, regarding payment cancellations and refund regulations.

If a user of the Creator files a claim with the Company directly or through a payment agency, relevant organization, or association (including claims related to fraudulent transactions where third parties misuse payment information), and if the claim is deemed reasonable, the Company may take the following actions:

Provide transaction records related to the claim.
Withhold payment amounts corresponding to the claimed amount.
Temporarily suspend (restrict) the provision of payment services or terminate the contract.
Cancel transactions or refund purchase amounts related to the claim.
If the membership purchase amount has already been transferred to the Creator and the Company requests a cancellation or refund of in-app payments, resulting in a refund to the user, the Company may demand the Creator to settle the amount refunded and any associated fees from the amount received.

In this case, the settlement procedures and amounts will be discussed with the Creator according to the criteria announced within the platform.`,
  },
  {
    bold: true,
    text: `Article 7 (Fees)`,
  },
  {
    bold: false,
    text: `Fees are divided into platform fees, payment fees, and subscription fees. The platform fee is a fee necessary for operating the VIDEOIT service and is determined by a contract agreed upon with the Creator before using the service; if not agreed upon, the default rate is set at 70%. The details of specific plans and fee rates follow the separate "VIDEOIT Service Plan." The Company may change the contents and fee rates of the VIDEOIT Service Plan specified in paragraph 2.

Notwithstanding the provisions of paragraph 2, if there is a separate contract stipulating a different platform fee rate or a discount rate for partner contracts, the platform fee rate and discount rate specified in that contract will apply. If the Creator’s fee is changed, the new platform fee will apply to purchases made from the date prior to the change, starting from the time of membership registration.

The payment fee refers to the fees charged by payment agencies for processing transactions, amounting to 30% of the total payment amount. The subscription fee refers to the currency exchange fee on the amount obtained by the Creator through subscription payments and follows the contract agreed upon with the Creator before using the service; if not agreed upon, the default rate is set at 70%.

All fees are subject to value-added tax. However, if the Creator does not upload posts for more than one month, the account may change to a dormant status, and earnings will not be added during the dormant period.

Additionally, if the Creator uses subscription-based platforms like "라이키", "팬트리", or "팬딩" simultaneously with VIDEOIT, the VIDEOIT platform fee may increase up to 95%.
`,
  },
  {
    bold: true,
    text: `Article 8 (Settlement Method)`,
  },
  {
    bold: false,
    text: `The settlement and payment methods for the amounts due under this contract shall be determined as follows. However, the Company may change the settlement method and will notify at least 7 days in advance of the effective date.

The settlement period shall be conducted monthly. Settlement for point or subscription income exchange requests will occur on the 15th of the following month (however, if the Creator has not applied for an exchange, the settlement will be postponed). If necessary due to circumstances of the Company or payment agency, a different settlement period may be determined based on the policies of the Company and payment agency.

If the amount due for settlement for the Creator is below a certain threshold, the Company may defer the settlement and combine it with the next settlement amount. If there are discrepancies in the payment details received from the Creator by both the Company and the Creator, both parties may compare their records to agree on the settlement amount, referring to the information from the payment agency where the transaction occurred. If agreement is delayed, the Company may execute the settlement based on the lesser amount claimed by either party. In this case, the Company shall not be liable for any delays in the payment of the settlement amount until an agreement is reached.

The Company must provide the Creator with materials related to the settlement if requested. The payment date for the settlement amount accrued during the settlement period shall be on the Friday of the settlement period (however, if it falls on a weekend or public holiday based on business days, it may be settled on the next business day after that weekend or holiday).

On the payment date, the Company will transfer the settlement amount (the amount received after deducting platform fees and payment fees) to the Creator's designated settlement account. If the Creator is serving in the military, the exchange of purchase amounts during the service period may be restricted upon separate request from the Military Manpower Administration.

The Company may notify the Creator by email or phone and exclude amounts paid through fraudulent transactions or illegal use from the Creator’s settlement amount. Additionally, for amounts suspected to have been obtained through illegal means, the Company may cancel the exchange of those amounts without prior notice and may refuse payment until the Creator's explanation regarding the suspected situation is concluded.

To facilitate personal verification and smooth settlements, the Creator must register their ID (or business registration certificate), bankbook copy, and mobile number for cash receipt issuance, and can only withdraw settlement amounts to a domestic bank account in the name specified on the submitted ID (or business registration certificate). If the Creator is under 14 years of age or is a limited competency person, they may enter into a settlement contract with the consent of their legal representative (such as a parent) and must provide usage consent in the manner specified and guided by the "Company."

The platform fees will be notified through separate announcements and may be adjusted based on the circumstances of the payment agency.

In the event that the Company is unable to receive the payment from Apple, Google, or any other payment gateway provider (PG), the corresponding settlement amount to the Creator may be withheld or not paid.

Additionally, if the VIDEOIT service is terminated, any outstanding balance of points or subscription money may not be paid out, and the Company shall not be liable for any unpaid settlement amount resulting from such termination.
    `,
  },
  {
    bold: true,
    text: `Article 9 (Contract Duration)`,
  },
  {
    bold: false,
    text: `The validity period of this contract shall follow the contract duration previously agreed upon with each Creator. If the parties wish to extend the contract, they may do so through mutual agreement. If there is no agreed contract duration, the default period shall be 2 years.
`,
  },
  {
    bold: true,
    text: `Article 10 (Cancellation or Termination of Contract)`,
  },
  {
    bold: false,
    text: `① The Company or the Creator may terminate this contract by written notice in the following cases:

If the other party breaches any significant provision of this contract without justifiable reason and fails to rectify the breach within 7 business days from the date of receiving a written (including email) request for correction.
If there are court proceedings initiated regarding the preservation of major assets of the Company or the Creator, such as injunctions, compulsory execution, tax collection procedures, rehabilitation procedures, bankruptcy procedures, or other similar legal proceedings, making it difficult to maintain the contract.
If there are legal defects due to the lack of necessary licenses related to the business of the Company or the Creator.
If significant reasons arise that make it difficult to maintain this contract.
② The termination under this Article does not affect any rights to claims or damages that have already arisen.`,
  },
  {
    bold: true,
    text: `Article 11 (Obligations of Users)`,
  },
  {
    bold: false,
    text: `Creators and users must not engage in any of the following activities:

Stealing another user's account or someone else's payment information.
Transferring their account to another person.
Impersonating a Company administrator.
Falsely stating information while using the service to disrupt service operations.
Reproducing or transmitting information or content obtained during the use of the service without the prior consent of the Company, or using it for purposes other than those specified in this agreement or for commercial purposes.
Broadcasting or posting content that contains fraudulent, obscene, gambling-related, hateful messages or audio.
Engaging in actions that interfere with other users' normal use of the service, such as defamation, insult, cyberbullying, stalking, or violent acts.
Infringing on the Company’s or third parties’ rights, such as intellectual property rights or portrait rights.
Collecting, storing, distributing, or using others’ personal information without consent.
Manipulating data in an unusual manner to disrupt the Company’s service operations.
Transmitting, posting, distributing, or using materials that contain software viruses, or other computer codes, files, or programs designed to interfere with or destroy the normal operation of computer software, hardware, or telecommunications equipment.
Changing the service or using it in a manner not specified by the Company through server hacking, data leakage, bugs, etc.
Violating relevant laws, service terms of use, operational policies, or announcements.
Engaging in other actions that violate public order, good morals, or illegal and unjust behavior.
If a user suspects another user of violating any of the provisions listed in paragraph 1, they must report it via email or by other means.

The Company may restrict service use or terminate the service contract without prior notice if a user violates any of the provisions listed in paragraph 1, causing disruptions to the Company’s service. The Company shall not be liable for any damages incurred by the user due to the restrictions on use or termination of the service contract as per the preceding paragraph.
    `,
  },
  {
    bold: true,
    text: `Article 12 (Copyright of Posts)`,
  },
  {
    bold: false,
    text: `The copyright of content posted by users within the service belongs to the users themselves.
Users must not engage in actions that infringe upon third parties' copyrights or other rights while using the service. If they violate this, users must resolve the matter at their own expense and liability and compensate the Company for any damages incurred as a result.

The Company may use the content posted by users for promotional purposes both domestically and internationally without charge. For this purpose, the Company may reproduce, modify, display, transmit, distribute, publish, or create derivative works from the content.

If the Company wishes to use the content posted by users for commercial purposes or in a manner not specified in paragraph 3, it must obtain the user's consent.`,
  },
  {
    bold: true,
    text: `Article 13 (Deletion of Posts)`,
  },
  {
    bold: false,
    text: `The Company may delete or hide content posted by users without prior notice if it determines that the content violates any of the following provisions:

If the content is recognized as infringing upon a third party's copyright.
If the content contains information that invades a third party's privacy.
If the content falls under illegal information as specified in Article 44-7, Paragraph 1 of the Act on Promotion of Information and Communications Network Utilization and Information Protection.
If the content includes illegal recordings as specified in Article 44-9, Paragraph 1 of the same Act.
Users may file an objection along with supporting materials in cases mentioned in the preceding paragraph. If the Company recognizes the user's objection as valid, it may restore the content in question.
    `,
  },
  {
    bold: true,
    text: `Article 14 (Prohibition of Assignment, etc.)`,
  },
  {
    bold: false,
    text: `The Company and the Creator may not assign or provide the rights or obligations under this contract to a third party without prior written consent from the other party.
    `,
  },
  {
    bold: true,
    text: `Article 15 (Confidentiality)`,
  },
  {
    bold: false,
    text: `The Company and the Creator must not disclose the secrets and customer information of the other party learned during the course of this contract to a third party without written consent from the other party, both during the contract period and after its termination. They also must not use such information for any purposes other than the performance of this contract and shall impose the same obligations on their employees, agents, servants, and other related parties.

Even after the termination or cancellation of this contract, the Company and the Creator must handle the settlement amount within the scope of their obligations with the diligence of a good manager.
    `,
  },
  {
    bold: true,
    text: `Youth Protection Policy`,
  },
  {
    bold: false,
    text: `VIDEOIT (hereinafter referred to as "the Company") has established and implemented a youth protection policy to ensure that young people can grow into healthy individuals.
The Company is taking measures to prevent adolescents from accessing harmful information and will inform you of the actions being taken for youth protection through this youth protection policy.
    `,
  },
  {
    bold: true,
    text: `1. Restrictions and Management Measures for Adolescent Access to Harmful Information
`,
  },
  {
    bold: false,
    text: `- The Company has established and implemented separate verification measures to ensure that adolescents are not exposed to harmful information without any restrictions, and it takes preventive measures to avoid exposure to harmful information for young people.
`,
  },
  {
    bold: true,
    text: `2. Training of Personnel Responsible for Protecting Adolescents from Harmful Information
    `,
  },
  {
    bold: false,
    text: `- The Company provides training for personnel engaged in information and communication tasks on laws and regulations related to youth protection, standards for sanctions, response methods for discovering harmful information, and reporting procedures for handling violations.`,
  },
  {
    bold: true,
    text: `3. Counseling and Grievance Handling for Damage Caused by Harmful Information`,
  },
  {
    bold: false,
    text: `The Company has assigned specialized personnel to handle counseling and grievance processing related to damages caused by harmful information, ensuring that such damages do not spread.
Users can refer to the section "4. Contact Information of the Youth Protection Officer and Responsible Personnel" below to request counseling and grievance handling.
    `,
  },
  {
    bold: true,
    text: `4. Contact Information of the Youth Protection Officer and Responsible Personnel`,
  },
  {
    bold: false,
    text: `VIDEOIT is committed to ensuring that adolescents can safely access quality information.
Youth Protection Officer
Name: KWON GUK WON
Department: Operations Management Team
Email: traveltofindlife@gmail.com
`,
  },
];

export default function Tou({
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
                Terms of Use
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
