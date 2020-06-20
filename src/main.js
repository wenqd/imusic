import Vue from "vue";
import Antd from "ant-design-vue";
import App from "./App.vue";
import "ant-design-vue/dist/antd.css";

import "xe-utils";
import VXETable from "vxe-table";
import "vxe-table/lib/index.css";
Vue.config.productionTip = false;

Vue.use(Antd);
Vue.use(VXETable);
import store from "./store/store"
new Vue({
    store,
    render: (h) => h(App),
}).$mount("#app");
