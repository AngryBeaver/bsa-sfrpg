import {Sfrpg} from "./Sfrpg.js";
import {NAMESPACE,SfrpgSettings} from "./SfrpgSettings.js";

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new Sfrpg());
});
Hooks.on("beavers-system-interface.ready", async function(){
    game[NAMESPACE] = game[NAMESPACE] || {};
    game[NAMESPACE].Settings = new SfrpgSettings();
    import("./SkillTest.js");
    import("./AbilityTest.js");
})