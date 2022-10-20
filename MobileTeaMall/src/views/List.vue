<template>
	<div class='list'>
		<Header></Header>
		<section>
			<div class='list-l' ref="left">
				<ul class='l-item'>
					<li :class="{active:index == currentIndex}" v-for="(item,index) in leftData" :key="index"
						@click="goScroll(index)">
						{{item.name}}
					</li>
				</ul>
			</div>

			<div class='list-r' ref="right">
				<div>
					<ul v-for="(item, index) in rightData" :key="index">
						<li class='shop-list' v-for="(k, i) in item" :key="i">
							<h2>{{k.name}}</h2>
							<ul class='r-content'>
								<li v-for="(j, idx) in k.list" :key="idx">
									<img :src="j.imgUrl" alt="">
									<span>{{j.name}}</span>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</section>
		<Tabbar></Tabbar>
	</div>
</template>

<script>
import Tabbar from '@/components/common/Tabbar.vue'
import Header from '@/components/list/Header.vue'
import http from "@/common/api/request.js"
import BetterScroll from 'better-scroll'
export default {
	name: "List",
	data() {
		return {
			leftData: [],
			rightData: [],
			rightBScroll: '', //右侧滑动数据
			allHeight: [], //右侧每一块的高度值
			scrollY: '', //右侧滚动距离
		}
	},
	computed: {
		currentIndex() {
			return this.allHeight.findIndex((item, index) => {
				return this.scrollY >= item && this.scrollY < this.allHeight[index + 1]
			})
		}
	},
	components: {
		Tabbar,
		Header,
	},
	methods: {
		goScroll(index) {
			this.rightBScroll.scrollTo(0, -this.allHeight[index])
		}
	},
	async created() {
		let res = await http.$axios({
			url: '/api/goods/list'
		})

		let leftArr = []
		let rightArr = []

		res.forEach(v => {
			leftArr.push({
				id: v.id,
				name: v.name
			})
			rightArr.push(v.data);
		})

		this.leftData = leftArr;
		this.rightData = rightArr;

		this.$nextTick(() => {
			// 左侧滑动
			this.oBetterScroll = new BetterScroll(this.$refs.left, {
				click: true
			})
			// 右侧划动
			this.rightBScroll = new BetterScroll(this.$refs.right, {
				click: true,
				probeType: 3
			})
			// 统计右侧滑动距离
			let height = 0;
			this.allHeight.push(height);
			let uls = this.$refs.right.getElementsByClassName("shop-list");
			// 将dom对象转为真数组
			Array.from(uls).forEach(v => {
				height += v.clientHeight
				this.allHeight.push(height);
			})

			// 右侧滑动距离
			this.rightBScroll.on('scroll', (pos) => {
				this.scrollY = Math.abs(pos.y)
			})
		})
	},
};
</script>
<style scoped>
.list {
	display: flex;
	flex-direction: column;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}

.list section {
	display: flex;
	flex: 1;
	overflow: hidden;
}

.list-l {
	width: 2.48rem;
	background-color: #fff;
	border-right: 1px solid #CCCCCC;
	overflow: hidden;
}

.list-l .l-item {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.list-l .l-item li {
	width: 100%;
	line-height: 1.333333rem;
	text-align: center;
	font-size: 0.373333rem;

}

.active {
	color: #b54f4a;
	border-left: 6px solid #b54f4a;
}

.list-r {
	flex: 1;
	overflow: hidden;
}

.list-r .shop-list {
	text-align: center;
}

.list-r .shop-list h2 {
	padding: 0.533333rem 0;
	font-size: 0.64rem;
	font-weight: 400;
}

.list-r .shop-list .r-content {
	display: flex;
	flex-wrap: wrap;
}

.list-r .shop-list .r-content li {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 33.33%;
	padding: 0.266666rem 0;
}

.list-r .shop-list .r-content li img {
	width: 1.413333rem;
	height: 1.413333rem;
}

.list-r .shop-list .r-content li span {
	font-size: 0.426666rem;
}

::v-deep.tabbar {
	border-top: 1px solid #CCCCCC;
}
</style>


