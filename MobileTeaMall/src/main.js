import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//全局引入 mint-ui的使用
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(MintUI)

//公共css文件
import '@/assets/css/common.css'
//字体图标css文件
import '@/assets/css/iconfont.css'
//淘宝无线适配
import '@/assets/js/flexible'

//ly-tab插件
import LyTab from 'ly-tab'
Vue.use(LyTab)

// vant ui组件库
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");


