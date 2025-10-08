import React from "react";

import {createStore} from "redux";
import {Provider} from "react-redux";
import rootReducer from "./reduxModules/index";
import App from "./App";
import codePush from "react-native-code-push";
import {CallContextProvider} from "./contexts/CallContext";

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  updateDialog: {
    title: "New Version",
    optionalUpdateMessage: "Please Update App",
    optionalInstallButtonLabel: "Update.",
    optionalIgnoreButtonLabel: "No.",
  },
  installMode: codePush.InstallMode.IMMEDIATE,
};
const RApp = () => {
  const store = createStore(rootReducer);

  return (
    <Provider store={store}>
      <CallContextProvider>
        <App></App>
      </CallContextProvider>
    </Provider>
  );
};

export default codePush(codePushOptions)(RApp);
