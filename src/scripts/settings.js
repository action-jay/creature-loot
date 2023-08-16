import { debug, log, warn, i18n } from "./lib/lib.js";
import CONSTANTS from "./constants/constants.js";
import SETTINGS from "./constants/settings.js";

export const registerSettings = function () {
  // ========================================================================

  game.settings.register(CONSTANTS.MODULE_ID, SETTINGS.debug, {
    name: `${CONSTANTS.MODULE_ID}.setting.debug.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.debug.hint`,
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
  });
};
