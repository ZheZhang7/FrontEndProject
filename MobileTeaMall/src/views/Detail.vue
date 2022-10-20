<template>
    <div class="detail">
        <header>
            <div class="header-returns" v-show="isShow">
                <div @click="goBack"><i class="iconfont icon-fanhui"></i></div>
                <div><i class="iconfont icon-home"></i></div>
            </div>
            <div class='header-bar' v-show="!isShow" :style="styleOption">
                <div @click="goBack">
                    <i class='iconfont icon-fanhui'></i>
                </div>
                <div>
                    <span>商品详情</span>
                    <span>商品评价</span>
                </div>
                <div>
                    <i class='iconfont icon-home'></i>
                </div>
            </div>
        </header>
        <section ref='wrapper'>
            <div>
                <div class='swiper-main'>
                    <swiper :options="swiperOption">
                        <swiper-slide v-for="(item, index) in swiperList" :key="index">
                            <img :src="item.imgUrl" alt="">
                        </swiper-slide>
                    </swiper>
                    <div class="swiper-pagination"></div>
                </div>
                <div class='goods-name'>
                    <h1>{{goods.name}}</h1>
                    <div>{{goods.name}}</div>
                </div>
                <div class='goods-price'>
                    <div class='oprice'>
                        <span>¥</span>
                        <b>{{goods.price}}</b>
                    </div>
                    <div class='pprice'>
                        <span>价格:</span>
                        <del>¥139</del>
                    </div>
                </div>

                <div>
                    <img style="width:100%;height: 500px;" :src="goods.imgUrl" alt="">
                    <img style="width:100%;height: 500px;" :src="goods.imgUrl" alt="">
                </div>
            </div>

        </section>
        <footer>
            <div class='add-cart' @click="addCart">加入购物车</div>
            <div>立即购买</div>
        </footer>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import BetterScroll from 'better-scroll'
import http from '@/common/api/request.js'
import { Toast } from 'mint-ui';
export default {
    name: 'Detail',
    data() {
        return {
            id: 0,
            goods: {},
            styleOption: {},
            BetterScroll: '',
            isShow: true,
            swiperOption: {//swiper3
                autoplay: 3000,
                speed: 1000,
                pagination: {
                    el: '.swiper-pagination',
                    type: 'fraction'
                }
            },
            swiperList: [
                {
                    imgUrl: './images/goods-list1.jpeg'
                },
                {
                    imgUrl: './images/goods-list1.jpeg'
                },
                {
                    imgUrl: './images/goods-list1.jpeg'
                }
            ]
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    created() {

        this.getData()
        this.id = this.$route.query.id;
    },
    mounted() {
        this.$nextTick(() => {
            this.BetterScroll = new BetterScroll(this.$refs.wrapper, {
                movable: true,
                zoom: true,
                click: true,
                probeType: 3,
                bounce: false
            }),
                this.BetterScroll.on('scroll', (pos) => {
                    let posY = Math.abs(pos.y)
                    // 透明度
                    let opacity = posY / 180;
                    opacity = opacity > 1 ? 1 : opacity;
                    this.styleOption = {
                        opacity: opacity
                    }
                    if (posY >= 100) {
                        this.isShow = false
                    } else {
                        this.isShow = true
                    }
                })
        })
    },
    // keep-alive 多出的生命周期
    // 每次请求都会执行，无论是否缓存
    // 在添加keep-alive后，由于缓存  created  mounted 不会再次执行
    activated() {
        // 判断当前url的id和之前的id是否一致
        if (this.$route.query.id != this.id) {
            this.getData()
            this.id = this.$route.query.id
        }
    },
    methods: {
        async getData() {
            let id = this.$route.query.id;
            let res = await http.$axios({
                url: '/api/goods/id',
                params: {
                    id
                }
            })
            this.goods = res
        },
        // 加入购物车
        addCart() {
            let id = this.$route.query.id;
            http.$axios({
                url: '/api/addCart',
                method: "post",
                data: {
                    goodsId: id
                },
                headers: {
                    token: true
                }
            }).then(res => {
                if (res.success) {
                    Toast('添加购物车成功');
                }
            })
        },
        goBack() {
            this.$router.back();
        }
    },
}
</script>

<style scoped>
.detail {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

header {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 1.173333rem;
}

header .header-returns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 1.173333rem;
}

header .header-returns div {
    margin: 0 0.266666rem;
    width: 0.933333rem;
    line-height: 0.906666rem;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
}

header .header-returns div {
    margin: 0 .2667rem;
    width: .9067rem;
    height: .9067rem;
    line-height: .9067rem;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
}

header .header-returns div i {
    font-size: .64rem;
    color: #fff;
}

.header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 1.173333rem;
    font-size: 0.426666rem;
    background-color: #fff;

}

.header-bar span {
    padding: 0 0.266666rem;
}

.header-bar i {
    padding: 0 0.266666rem;
    font-size: 0.586666rem;
}

section {
    flex: 1;
    overflow: hidden;
}

.swiper-main {
    position: relative;
    width: 100%;
    height: 10rem;
    overflow: hidden;
}

.swiper-container {
    width: 100%;
    height: 10rem;
}

.swiper-container img {
    width: 100%;
    height: 10rem;
}

.swiper-pagination {
    bottom: 0.266666rem;
    width: 100%;
    text-align: right;
    color: #FFFFFF;
    font-size: 0.426666rem;

}

.swiper-pagination-fraction,
.swiper-pagination-custom,
.swiper-container-horizontal>.swiper-pagination-bullets {
    left: -0.533333rem;
}

.goods-name {
    padding: 0.533333rem 0.266666rem;
    border-bottom: 1px solid #CCCCCC;
}

.goods-name h1 {
    font-size: 0.533333rem;
    font-weight: 500;
}

.goods-name div {
    padding: 0.08rem 0;
    font-size: 0.373333rem;
    color: #999999;
}

.goods-price {
    padding: 0.533333rem 0.266666rem;
}

.goods-price .oprice {
    color: red;
}

.goods-price .oprice span {
    font-size: 0.32rem;
}

.goods-price .pprice {
    color: #999999;
    font-size: 0.373333rem;
}

footer {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.306666rem;
    border-top: 1px solid #ccc;
    background-color: #fff;
}

footer div {
    width: 50%;
    line-height: 1.306666rem;
    font-size: 0.426666rem;
    text-align: center;
    color: #fff;
    background-color: red;
}

.add-cart {
    background-color: #FF9500;
}
</style>