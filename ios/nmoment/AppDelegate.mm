#import <React/RCTLinkingManager.h> // 딥링킹
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>

#import <CodePush/CodePush.h>
#import "AppDelegate.h"
#import "RNCallKeep.h"

#import <React/RCTBundleURLProvider.h>
#import <Firebase.h>
#import "RNSplashScreen.h"  // here
// #import "RNFBMessagingModule.h"
#import <WebRTC/RTCAudioSessionConfiguration.h>
#import <AuthenticationServices/AuthenticationServices.h>
#import <SafariServices/SafariServices.h>
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>

#import <PushKit/PushKit.h>


#import "nmoment-Swift.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [[NMCallKitBridge instance] configureCallKit];
  [[NMCallKitBridge instance] configurePushKit];
  
  [[FBSDKApplicationDelegate sharedInstance] application:application
                       didFinishLaunchingWithOptions:launchOptions];

  if ([FIRApp defaultApp] == nil) {
     [FIRApp configure];
   }
  self.moduleName = @"nmoment";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.

  self.initialProps = @{};
  // self.initialProps = [RNFBMessagingModule addCustomPropsToUserProps:nil withLaunchOptions:launchOptions];

  //RNCAllkeep
  self.bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

  /*
  [RNCallKeep setup:@{
    @"appName": @"NMOMENT",
    @"maximumCallGroups": @1,
    @"maximumCallsPerCallGroup": @1,
    @"supportsVideo": @YES,
  }];
   */
  //

  [super application:application didFinishLaunchingWithOptions:launchOptions];
  [RNSplashScreen show];  // here

  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;  
  RTCAudioSessionConfiguration *webRTCConfiguration = [RTCAudioSessionConfiguration webRTCConfiguration];

  webRTCConfiguration.categoryOptions = (
    AVAudioSessionCategoryOptionAllowBluetooth | 
    AVAudioSessionCategoryOptionDefaultToSpeaker
  );
  //return [super application:application didFinishLaunchingWithOptions:launchOptions];
  return YES;
}


//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

/*

// Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
    completionHandler(UNNotificationPresentationOptionNone);
}
*/

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [CodePush bundleURL];
#endif
}


// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}


// ios 에서 화면 멀티태스킹으로 올라갔을때 컨텐츠 가리는법 start, splash.png 만 변경하면된다.
- (void)controllPrivateScreen:(bool)isBackground {
  int TAG_PRIVATE_SCREEN = -101;
   
  UIViewController *privateScreenController = (UIViewController *)[[self.window viewWithTag:TAG_PRIVATE_SCREEN] nextResponder];
  NSLog(@"controllPrivateScreen is call %d ", privateScreenController == nil);
  if (isBackground) {
    if (privateScreenController == nil){
      NSLog(@"controllPrivateScreen is created");
      UIViewController *uiViewController = [[UIViewController alloc] init];
      uiViewController.view.tag = TAG_PRIVATE_SCREEN;
      
      UIImageView *imageView =  [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"splashIcon.png"]];
      imageView.frame = self.window.frame;
      imageView.contentMode =UIViewContentModeCenter;// UIViewContentModeScaleAspectFit;-> 화면꽉차게
      [uiViewController.view addSubview:imageView];
      [uiViewController.view setBackgroundColor:[UIColor colorWithRed:255.0/255.0 green:13.0/255.0 blue:69.0/255.0 alpha:1.0]];
      
      [self.window.rootViewController addChildViewController:uiViewController];
      [self.window.rootViewController.view addSubview:uiViewController.view];
      [self.window makeKeyAndVisible];
      [uiViewController didMoveToParentViewController:self.window.rootViewController];
    }
  } else {
    if (privateScreenController != nil) {
      NSLog(@"controllPrivateScreen is removed");
      [privateScreenController willMoveToParentViewController:nil];
      [privateScreenController.view removeFromSuperview];
      [privateScreenController removeFromParentViewController];
    }
  }
};
- (void)applicationWillResignActive:(UIApplication *)application{
  [self controllPrivateScreen:true];
}

- (void)applicationDidEnterBackground:(UIApplication *)application{
  [self controllPrivateScreen:true];
}

- (void)applicationWillEnterForeground:(UIApplication *)application{
  [self controllPrivateScreen:false];
}

- (void)applicationDidBecomeActive:(UIApplication *)application{
  [self controllPrivateScreen:false];
}
// ios 에서 화면 멀티태스킹으로 올라갔을때 컨텐츠 가리는법 end

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
   if ([[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options]) {
    return YES;
  }
  if ([RCTLinkingManager application:application openURL:url options:options]) {
    // return [RCTLinkingManager application:application openURL:url options:options];
    return YES;
  }

  return NO;
}//딥링킹


/*
- (BOOL)application:(UIApplication *)application
  continueUserActivity:(NSUserActivity *)userActivity
  restorationHandler:(void(^)(NSArray<id<UIUserActivityRestoring>> * __nullable restorableObjects))restorationHandler
{
  return [RNCallKeep application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
  return true;
}
 */

@end











