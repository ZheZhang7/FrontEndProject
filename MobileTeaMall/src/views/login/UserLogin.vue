<template>
    <div>
        <Header></Header>
        <section>
            <div class="login-tel">
                <input type="text" v-model='userTel' placeholder="请输入手机号" pattern="[0-9]*">
            </div>
            <div class="login-tel">
                <input type="password" v-model="userPwd" placeholder="请输入密码" pattern="[0-9]*">
            </div>
            <div class="login-btn" @click="login">登录</div>
            <div class="tab">
                <span @click="goLogin">短信登录</span>
                <span @click="goRecovery">找回密码</span>
                <span @click="goRegister">快速注册</span>
            </div>
        </section>
        <Tabbar></Tabbar>
    </div>
</template>

<script>
import Tabbar from '../../components/common/Tabbar.vue';
import Header from './Header.vue';
import { Toast } from 'mint-ui';
import http from '@/common/api/request.js'
import { mapMutations } from 'vuex';
export default {
    name: "Login",
    data() {
        return {
            // 用户输入的手机号和密码
            userTel: '',
            userPwd: '',
            // 验证规则
            rules: {
                // 手机号验证
                userTel: {
                    rule: /^1[23456789]\d{9}$/,
                    msg: '手机号不能为空,并且是11位数'
                },
                userPwd: {
                    rule: /^\w{6,12}$/,
                    msg: '密码不能为空,并且是6-12位'
                }
            }
        }
    },
    components: { Tabbar, Header },
    methods: {
        ...mapMutations(['USER_LOGIN']),
        // 短信登录
        goLogin() {
            this.$router.push('/login')
        },
        //注册
        goRegister() {
            this.$router.push('/register')
        },
        // 找回密码
        goRecovery() {
            this.$router.push('/recovery')
        },
        login() {
            // 前端验证，匹配正则
            if (!this.validate('userTel')) return;
            if (!this.validate('userPwd')) return;
            // 通过前端正则验证，向后端发送请求，后端验证数据库
            http.$axios({
                url: '/api/login',
                method: 'POST',
                data: {
                    userTel: this.userTel,
                    userPwd: this.userPwd
                }
            }).then(res => {
                //提示信息
                Toast(res.msg);
                // 登录失败
                if (!res.success) return;
                // 将所有信息通过参数的方式传给state
                this.USER_LOGIN(res.data);

                // 登录成功   跳转页面
                this.$router.push('/my')
            })

        },
        // 验证信息提示
        validate(key) {
            let bool = true;
            if (!this.rules[key].rule.test(this[key])) {
                //提示信息
                Toast(this.rules[key].msg);
                bool = false;
                return false;
            }
            return bool;
        }

    },
}
</script>

<style scoped>
section {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f5f5;
    font-size: .32rem;
}

section div {
    margin: 0.266666rem 0;
    width: 8.933333rem;
    height: 1.173333rem;
}

section input {
    box-sizing: border-box;
    padding: 0 0.266666rem;
    line-height: 1.173333rem;
    background-color: #FFFFFF;
    border: 1px solid #ccc;
    border-radius: 6px;
}

section .login-tel {
    margin-top: 0.8rem;
}

section .login-tel input {
    width: 8.933333rem;
}

/* section .login-code {
    display: flex;

}

section .login-code input {
    flex: 1;
}

section .login-code button {
    padding: 0 0.533333rem;
    line-height: 1.173333rem;
    color: #fff;
    background-color: #b0352f;
    border: 0;
    border-radius: 6px;
} */

section .login-btn {
    line-height: 44px;
    color: #fff;
    text-align: center;
    background-color: #b0352f;
    border-radius: 6px;
    font-size: .48rem;
}

section .tab {
    display: flex;
    justify-content: space-between;
    font-size: 0.373333rem;
}
</style>