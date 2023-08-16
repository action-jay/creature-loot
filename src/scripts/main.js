import { setApi } from "../module.js";
import API from "./API/api.js";
import CONSTANTS from "./constants/constants.js";
export const initHooks = () => {
  // warn("Init Hooks processing");
  // setup all the hooks
  //   Hooks.once("socketlib.ready", registerSocket);
  //   registerSocket();
};

export const setupHooks = () => {
  // warn("Setup Hooks processing");
  setApi(API);
};

export const readyHooks = async () => {
  //
};
