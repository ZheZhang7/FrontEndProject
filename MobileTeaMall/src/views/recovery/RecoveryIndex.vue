<template>
    <div>
        <Header>
            <span>找回密码</span>
        </Header>
        <section>
            <div class="login-tel">
                <input type="text" v-model="userTel" placeholder="请输入手机号" pattern="[0-9]*">
            </div>
            <div class="login-code">
                <input type="text" v-model="userCode" placeholder="请输入短信验证码" pattern="[0-9]*">
                <button :disabled="disabled" @click="sendCode">{{codeMsg}}</button>
            </div>
            <div class="login-btn" @click="next">下一步</div>
        </section>
        <Tabbar></Tabbar>
    </div>
</template>

<script>
import Tabbar from '@/components/common/Tabbar.vue';
import Header from '@/views/login/Header.vue';
import { Toast } from 'mint-ui';
import http from '@/common/api/request.js'

export default {
    name: "Login",
    data() {
        return {
            userTel: '',
            disabled: false,
            // 验证规则
            rules: {
                // 手机号验证
                userTel: {
                    rule: /^1[23456789]\d{9}$/,
                    msg: '手机号不能为空,并且是11位数'
                }
            },
            codeNum: 60,
            codeMsg: `获取验证码`,
            code: '',
            userCode: ''
        }
    },
    components: { Tabbar, Header },
    methods: {

        // 发送短信验证码
        sendCode() {
            // 前端验证，匹配正则
            if (!this.validate('userTel')) return;

            // 发送请求，短信验证码接口
            http.$axios({
                url: '/api/code',
                method: 'POST',
                data: {
                    phone: this.userTel,
                }
            }).then(res => {
                // 保存验证码
                if (res.success) {
                    this.code = res.data
                }
            })


            // 禁用按钮
            this.disabled = true;
            // 倒计时
            let timer = setInterval(() => {
                --this.codeNum;
                this.codeMsg = `重新获取 ${this.codeNum}`
            }, 1000)

            setTimeout(() => {
                clearInterval(timer);
                this.codeNum = 60
                this.disabled = false;
                this.codeMsg = `获取验证码`

            }, 60000)


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
        },
        // 点击登录
        next() {
            //如果验证码不正确
            if (this.code != this.userCode) {
                Toast("验证码不正确");
                return;
            }

            // 如果验证码正确， 判断数据库中是否存在该用户
            http.$axios({
                url: '/api/selectUser',
                method: 'POST',
                data: {
                    phone: this.userTel
                }
            }).then(
                res => {
                    if (!res.success) {
                        Toast("用户不存在");
                        return;
                    }

                    this.$router.push({
                        name: 'btn',
                        query: {
                            phone: this.userTel
                        }
                    })
                }
            )
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

section .login-code {
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
}

section .login-btn {
    line-height: 44px;
    color: #fff;
    text-align: center;
    background-color: #b0352f;
    border-radius: 6px;
    font-size: .48rem;
}
</style>