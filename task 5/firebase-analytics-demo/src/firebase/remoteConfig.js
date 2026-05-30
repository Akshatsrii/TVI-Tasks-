import {
  fetchAndActivate,
  getValue
} from "firebase/remote-config";

import { remoteConfig } from "./firebase";

export const getNewUIFlag = async () => {
  await fetchAndActivate(remoteConfig);

  return getValue(
    remoteConfig,
    "new_ui_enabled"
  ).asBoolean();
};