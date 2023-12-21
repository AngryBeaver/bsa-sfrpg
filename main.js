import {sfrpg} from "./sfrpg.js";

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new sfrpg());
});