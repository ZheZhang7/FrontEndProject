<template>
	<div class='my container'>
		<header>

			<div class='user-info' v-if='loginStatus'>
				<img :src="userInfo.imgUrl" alt="">
				<span>{{userInfo.nickName}}</span>
			</div>
			<div v-else class='login' @click='goLogin'>登录/注册</div>
		</header>
		<section>
			<ul>
				<li @click="goPath">地址管理</li>
				<li v-if="loginStatus" @click="loginOut">退出登录</li>
			</ul>
		</section>
		<Tabbar></Tabbar>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Tabbar from '@/components/common/Tabbar.vue';
export default {
	name: "My",
	computed: {
		...mapState({
			loginStatus: state => state.user.loginStatus,
			userInfo: state => state.user.userInfo
		})
	},
	components: {
		Tabbar
	},
	methods: {
		//退出登录
		...mapMutations(['loginOut']),
		goLogin() {
			this.$router.push('/login');
		},
		// 地址管理
		goPath() {
			this.$router.push('/path');
		}
	},
};
</script>

<style scoped>
header {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 4.266666rem;
	background-color: #B0352F;
}

header .login {
	padding: 0.16rem 0.4rem;
	font-size: 0.426666rem;
	color: #fff;
	background-color: #F6AB32;
	border-radius: 6px;
}

header .user-info {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

header .user-info img {
	width: 1.76rem;
	height: 1.76rem;
	border-radius: 50%;
}

header .user-info span {
	padding: 0.533333rem 0;
	font-size: 0.48rem;
	color: #fff;
}

section {
	flex: 1;
	overflow: hidden;
}

section ul li {
	padding: 0.4rem;
	font-size: 0.426666rem;
}
</style>
