//
//  UI for IVPN Client Desktop
//  https://github.com/ivpn/desktop-app-ui-beta
//
//  Created by Stelnykovych Alexandr.
//  Copyright (c) 2020 Privatus Limited.
//
//  This file is part of the UI for IVPN Client Desktop.
//
//  The UI for IVPN Client Desktop is free software: you can redistribute it and/or
//  modify it under the terms of the GNU General Public License as published by the Free
//  Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//  The UI for IVPN Client Desktop is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
//  or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
//  details.
//
//  You should have received a copy of the GNU General Public License
//  along with the UI for IVPN Client Desktop. If not, see <https://www.gnu.org/licenses/>.
//

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

require("./main_style.js");

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

const electron = window.require("electron");
const { ipcRenderer } = electron;
ipcRenderer.on("change-view-request", (event, arg) => {
  try {
    // Avoid error:'Avoided redundant navigation to current location: ...'
    // That error can happen when navigating to a current route
    if (arg === router.history.current.path) return;
  } catch (e) {
    console.error(e);
  }
  router.push(arg);
});

// After initialized, ask main thread about initial route
async function getInitRouteArgs() {
  return await ipcRenderer.invoke("renderer-request-ui-initial-route-args");
}

setTimeout(async () => {
  let initRouteArgs = await getInitRouteArgs();
  if (initRouteArgs != null) router.push(initRouteArgs);
}, 0);
