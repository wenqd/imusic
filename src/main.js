import Vue from "vue";
import Vuex from "vuex";
import Antd from "ant-design-vue";
import App from "./App.vue";
import "ant-design-vue/dist/antd.css";

import "xe-utils";
import VXETable from "vxe-table";
import "vxe-table/lib/index.css";

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(Antd);
Vue.use(VXETable);
new Vue({
    render: (h) => h(App),
}).$mount("#app");
