<template>
    <div class='login container'>
        <Header>
            <span>找回密码</span>
        </Header>
        <section>
            <div class='login-tel'>
                <input type="password" v-model='userPwd' placeholder="请输入新的密码">
            </div>
            <div class='login-btn' @click='submitBtn'>确认</div>
        </section>
        <Tabbar></Tabbar>
    </div>
</template>

<script>
import Tabbar from '@/components/common/Tabbar.vue'
import Header from '@/views/login/Header.vue'
import { Toast } from 'mint-ui';
import http from '@/common/api/request.js'
export default {
    data() {
        return {
            userPwd: '',
            //验证规则
            rules: {//手机号验证
                userPwd: {
                    rule: /^\w{6,12}$/,
                    msg: '密码不能为空,并且是6-12位'
                }
            },
        }
    },
    components: {
        Header,
        Tabbar
    },
    methods: {
        mounted() {
            console.log(this.$route.query)
        },
        submitBtn() {
            if (!this.validate('userPwd')) return;
            //确认修改
            http.$axios({
                url: '/api/recovery',
                method: 'POST',
                data: {
                    phone: this.$route.query.phone,
                    pwd: this.userPwd
                }
            }).then(res => {

                Toast('修改成功');

                if (res.success) {
                    this.$router.push({
                        path: '/login'
                    })
                }
            })
        },
        //验证信息提示
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
    }
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

section button {
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
