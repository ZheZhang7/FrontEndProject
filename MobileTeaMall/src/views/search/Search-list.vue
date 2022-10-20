<template>
    <div class="search-list">
        <div class="headers">
            <Header></Header>
            <ul>
                <li v-for="(item, index) in searchList.data" :key="index" @click="changeTab(index)">
                    <div :class="searchList.currentIndex === index ? 'active' : ''">{{item.name}}</div>
                    <div class="search-filter" v-if="index != 0">
                        <i class="iconfont icon-xiangshangjiantou" :class=' item.status == 1 ? "active" : ""'></i>
                        <i class="iconfont icon-xiangxiajiantou" :class=' item.status == 2 ? "active" : ""'></i>
                    </div>
                </li>
            </ul>

        </div>
        <section>
            <ul v-if="goodList.length">
                <li v-for="(item, index) in goodList" :key="index">
                    <img v-lazy="item.imgUrl" alt="">
                    <h3>{{item.name}}</h3>
                    <div class="price">
                        <div>
                            <span>￥</span>
                            <b>{{item.price}}</b>
                        </div>
                        <div>立即购买</div>
                    </div>
                </li>
            </ul>
            <h1 v-else>暂无数据...</h1>
        </section>

        <Tabbar></Tabbar>
    </div>
</template>

<script>
import Header from '@/components/search/Header.vue';
import Tabbar from '@/components/common/Tabbar.vue';
import http from '@/common/api/request.js'
import Vue from "vue";
// 懒加载
import { Lazyload } from 'mint-ui';
Vue.use(Lazyload);
export default {
    name: "Search-list",
    data() {
        return {
            goodList: [],
            // 控制箭头,可以让后端知道数据的排序情况
            searchList: {
                currentIndex: 0,
                data: [
                    /*
                        status: 0 都不亮
                        status：1 上箭头亮
                        status: 2 下箭头亮
                    */
                    { name: '综合', key: 'zh' },
                    { name: '价格', status: 0, key: 'price' },
                    { name: '销量', status: 0, key: 'num' },
                ]
            }
        }
    },
    components: { Header, Tabbar },
    created() {
        this.getData()
    },
    computed: {
        orderBy() {
            //知道当前是哪一个对象
            let obj = this.searchList.data[this.searchList.currentIndex];
            //针对于状态，判断是升序还是降序
            let val = obj.status == '1' ? 'asc' : 'desc';
            return {
                [obj.key]: val
            }
        }
    },
    methods: {
        getData() {
            http.$axios({
                url: '/api/goods/shopList',
                params: {
                    searchName: this.$route.query.key,
                    // 向后端传递升序还是降序信息
                    ...this.orderBy
                }
            }).then(response => {
                this.goodList = response
            })
        },
        changeTab(index) {
            this.searchList.currentIndex = index;
            // 获取点击对应的下标数据
            let item = this.searchList.data[index]
            // 取消所有状态值
            this.searchList.data.map((val, i) => {
                if (i !== index) {
                    val.status = 0
                }
            })
            // 当前点击的改变状态
            if (index === this.searchList.currentIndex) {
                item.status = item.status == 1 ? 2 : 1;
            }
            // 发送请求进行数据排序
            this.getData();
        }
    },
    // 监听路由改变
    watch: {
        $route() {
            this.getData()
        }
    }
}
</script>

<style scoped>
.search-list {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
}

.headers ul {
    display: flex;
    justify-content: space-around;
    padding: .32rem 0;
    font-size: .4267rem;
}

.headers ul li {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.headers ul li>div {
    padding: 0 .08rem;
}

.headers ul li .search-filter {
    display: flex;
    flex-direction: column;
}

.search-list section {
    flex: 1;
    overflow: hidden;
}

section {
    flex: 1;
    overflow: hidden;
}

section ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

section ul li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    padding: 0.266666rem;
    box-sizing: border-box;
}

section ul li img {
    width: 4.5333rem;
    height: 4.5333rem;
}

section ul li h3 {
    width: 100%;
    font-size: .3733rem;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #222;
}

section ul li .price {
    display: flex;
    justify-content: space-between;
    padding: 0.266666rem 0;
    width: 100%;
    font-size: 14px;
}

section ul li .price div:first-child span {
    font-size: 0.32rem;
    color: #b0352f;
}

section ul li .price div:first-child b {
    color: #b0352f;
    font-size: 0.426666rem;
}

section ul li .price div:last-child {
    padding: 0.08rem 0.16rem;
    color: #fff;
    background-color: #b0352f;
    border-radius: 0.16rem;
}

.search-filter i {
    font-size: .32rem;
    padding-left: .08rem;
}

/* 设置高亮 */
.active {
    color: red;
}
</style>