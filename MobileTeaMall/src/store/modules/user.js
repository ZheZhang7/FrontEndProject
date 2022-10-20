import { USER_LOGIN, INIT_USER } from "./mutations-types"
export default {
    state: {
        // 登录状态
        loginStatus: false,
        // token
        token: null,
        // 用户信息： 用户头像|用户nick
        userInfo: {},

    },
    getters: {

    },
    mutations: {
        //设置
        [USER_LOGIN](state, user) {
            // user为用户所有信息
            // 利用user修改state
            // 所有信息都保存在了state中
            state.loginStatus = true;
            state.token = user.token;
            state.userInfo = user;
            //持久化存储==》本地存储
            localStorage.setItem('teaUserInfo', JSON.stringify(user));
        },
        //读取
        [INIT_USER](state) {
            let userInfo = JSON.parse(localStorage.getItem('teaUserInfo'));
            if (userInfo) {
                state.loginStatus = true;
                state.token = userInfo.token;
                state.userInfo = userInfo;
            }
        },
        loginOut(state) {
            state.loginStatus = false;
            state.token = null;
            state.userInfo = {};
            localStorage.removeItem('teaUserInfo');
        }
    },
    actions: {

    }
}