/* ------------------------------------ */
/* Constants					*/
/* ------------------------------------ */

export const CONSTANTS = {
  MODULE_ID: "creature-loot-crafting-and-gathering",
  PATH: `modules/creature-loot-crafting-and-gathering/`,
  PACK_UUID_ITEMS: "creature-loot-crafting-and-gathering.creature-loot-crafting-and-gathering-items",
  PACK_UUID_ROLLTABLES: "creature-loot-crafting-and-gathering.creature-loot-crafting-and-gathering-tables",
  PACK_UUID_JOURNALS: "creature-loot-crafting-and-gathering.creature-loot-crafting-and-gathering-journals",
  MODULE_FOLDER: `modules/creature-loot-crafting-and-gathering/assets/recipes`,
  GATHERER_MODULE_ID: "gatherer",
};

/* ------------------------------------ */
/* Settings					*/
/* ------------------------------------ */

const SETTINGS = {
  // Client settings

  // Module Settings
  booksImported: "booksImported",

  // Style settings

  // System Settings

  // Hidden settings
};

export const registerSettings = function () {
  game.settings.register(CONSTANTS.MODULE_ID, SETTINGS.booksImported, {
    name: "Import Content on startup",
    hint: "",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });
};

/* ------------------------------------ */
/* API					*/
/* ------------------------------------ */

const API = {
  // You can put here some code and call on a macro
  // with game.modules.get("creature-loot-crafting-and-gathering").api
};

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once("init", async () => {
  // Register custom module settings
  registerSettings();
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once("setup", function () {
  // Do anything after initialization but before ready

  const data = game.modules.get(CONSTANTS.MODULE_ID);
  data.api = API;
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once("ready", async () => {
  // Do anything once the module is ready
  if (!game.user.isGM || !game.settings.get(CONSTANTS.MODULE_ID, SETTINGS.booksImported)) {
    return;
  }

  Dialog.confirm({
    title: game.modules.get(CONSTANTS.MODULE_ID).title, // "Potion Crafting & Gathering",
    content: "Do you want to import all tables, journals and recipes?",
    yes: () => {
      if (!game.modules.get(CONSTANTS.GATHERER_MODULE_ID)?.active && game.user?.isGM) {
        ui.notifications.warn(
          `You need to install and activate the module premium '${CONSTANTS.GATHERER_MODULE_ID}' for this`
        );
        ui.notifications.warn(`You can still use the compendiums anyway as normal`);
      } else {
        importAll();
      }
    },
    no: () => {
      game.settings.set(CONSTANTS.MODULE_ID, SETTINGS.booksImported, false);
    },
    defaultYes: true,
  });
});

/* ------------------------------------ */
/* Other Hooks							*/
/* ------------------------------------ */

Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(CONSTANTS.MODULE_ID);
});

async function importAll() {
  const ROOT = CONSTANTS.MODULE_FOLDER;
  const BOOKS = (await FilePicker.browse("user", ROOT)).files.filter((f) => f.endsWith(".json"));
  for (let book of BOOKS) {
    const bookData = await fetch(book).then((r) => r.json());
    const bookObj = new ui.RecipeApp.RecipeBook(bookData);
    await bookObj.saveData();
  }
  ui.notifications.notify("Creature Loot Crafting & Gathering - Recipe Books Imported");
  // await game.packs.get(CONSTANTS.PACK_UUID_ITEMS).importAll({ keepId: true });
  await game.packs.get(CONSTANTS.PACK_UUID_ROLLTABLES).importAll({ keepId: true });
  await game.packs.get(CONSTANTS.PACK_UUID_JOURNALS).importAll({ keepId: true });
  new ui.RecipeApp().render(true);
  await game.settings.set(CONSTANTS.MODULE_ID, SETTINGS.booksImported, false);
}
