<template>
    <div class='order container'>
        <header>
            <i class='iconfont icon-fanhui' @click='$router.back()'></i>
            <span>提交订单</span>
            <i class='iconfont icon-home'></i>
        </header>
        <section>
            <div class='path'>
                <h3 class='path-title'>收货信息</h3>
                <div class='path-content' @click="goPath">
                    <div>
                        <span>{{path.name}}</span>
                        <span>{{path.tel}}</span>
                    </div>
                    <div>
                        <span>{{path.province}}</span>
                        <span>{{path.city}}</span>
                        <span>{{path.county}}</span>
                        <span>{{path.addressDetail}}</span>
                    </div>
                </div>
            </div>
            <div class='payment'>
                <div class='payment-title'>支付方式：</div>
                <van-radio-group v-model="radioPayment">
                    <van-radio name="wx">微信支付</van-radio>
                    <van-radio name="ali">支付宝支付</van-radio>
                </van-radio-group>
            </div>
            <div class='goods'>
                <ul>
                    <li v-for='(item,index) in goodsList' :key='index'>
                        <div>
                            <img :src="item.goods_imgUrl" alt="">
                        </div>
                        <div class='goods-content'>
                            <h4>{{item.goods_name}}</h4>
                            <div class='goods-total'>
                                <span>¥{{item.goods_price}}</span>
                                <span>x{{item.goods_num}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
        <footer>
            <div class='order-total'>
                <span>共</span>
                <b>{{total.num}}</b>
                <span>件,</span>
                <span>总金额：</span>
                <em>¥{{total.price}}</em>
            </div>
            <div class='order-topay' @click="goPayment">
                提交订单
            </div>
        </footer>
    </div>
</template>
<script>
import { Toast } from 'mint-ui';
import http from '@/common/api/request.js'
import { mapState, mapGetters, mapMutations } from 'vuex'
import bus from '@/common/bus.js';
import qs from 'qs'
export default {
    data() {
        return {
            radioPayment: 'wx',
            path: {},
            item: [],
            total: {
                price: 0,
                num: 0
            }
        }
    },
    computed: {
        ...mapState({
            order_id: state => state.order.order_id,
            selectList: state => state.cart.selectList
        }),
        ...mapGetters(['defaultPath']),

    },
    created() {
        this.goodsList = JSON.parse(this.$route.query.goodsList)
        // 查询地址
        this.selectAddress();

    },
    activated() {
        // 接收地址页传过来的值, 在这个生命周期中进行缓存组件
        bus.$on('selectPath', function (data) {
            this.path = JSON.parse(data);
        }.bind(this))
        //选中的商品id号
        this.item = JSON.parse(this.$route.query.detail)
        // 选中的商品信息
        this.goodsList = JSON.parse(this.$route.query.goodsList)

        // 查询订单
        this.selectOrder()
    },
    methods: {
        ...mapMutations(['initData', 'initOrder']),
        // 查询地址
        selectAddress() {
            // 查询到地址
            http.$axios({
                url: '/api/selectAddress',
                method: "post",
                headers: {
                    token: true
                }
            }).then(res => {
                this.initData(res.data);
                //有默认收货地址
                if (this.defaultPath.length) {
                    this.path = this.defaultPath[0];
                } else {
                    this.path = res.data[0];
                }
            })
        },
        // 查询订单
        selectOrder() {
            // 查询订单
            http.$axios({
                url: '/api/selectOrder',
                method: "post",
                headers: {
                    token: true
                },
                data: {
                    orderId: this.order_id
                }
            }).then(res => {
                this.initOrder(res.data);
                this.total = {
                    price: res.data[0].goods_price,
                    num: res.data[0].goods_num
                }
            })
        },
        // 选择收货地址
        goPath() {
            this.$router.push({
                path: '/path',
                query: {
                    type: 'select'
                }
            })
        },
        // 提交订单
        goPayment() {
            // 判断是否选择了收货地址
            if (!this.path) return Toast("请选择收货地址")
            // 发送请求 ----> 修改订单状态值 并  删除购物车数据
            http.$axios({
                url: '/api/submitOrder',
                method: "post",
                headers: {
                    token: true,
                },
                data: {
                    orderId: this.order_id,
                    // 购物车选中的商品id
                    shopArr: this.selectList
                }
            }).then(res => {

                let newArr = [];
                this.goodsList.forEach(v => {
                    newArr.push(v.goods_name);
                })

                // 支付时传递的参数
                let dataOrder = {
                    orderId: this.order_id,
                    name: newArr.join(''),
                    price: this.total.price
                }


                if (res.success) {
                    // 发送去支付的请求
                    http.$axios({
                        url: '/api/payment',
                        method: "post",
                        headers: {
                            token: true,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        // qs增加安全性
                        data: qs.stringify(dataOrder)
                    }).then(
                        res => {
                            if (res.success) {
                                // 打开支付页面
                                window.location.href = res.paymentUrl
                            }
                        }
                    )
                }
            })
        },
    }
}
</script>

<style scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 1.173333rem;
    color: #fff;
    background-color: #b0352f;
}

header i {
    padding: 0 0.4rem;
    font-size: 0.586666rem;
}

header span {
    font-weight: 300;
    font-size: 0.48rem;
}

section {
    background-color: #f7f7f7;
}

section .path-title {
    padding: 0.4rem;
    font-size: 0.48rem;
}

section .path-content {
    padding: 0.16rem 0.4rem;
    font-size: 0.373333rem;
    background-color: #FFFFFF;
}

section .path-content span {
    padding-right: 0.16rem;
}


section .payment {
    padding: 0.16rem 0.4rem;
    margin-top: 0.4rem;
    font-size: 0.426666rem;
    background-color: #FFFFFF;
}

section .payment .van-radio-group {
    display: flex;
    padding: 0.16rem 0;
}

section .payment .van-radio-group .van-radio {
    padding-right: 0.266666rem;
}

section .goods {
    padding: 0.16rem 0.4rem;
    margin-top: 0.4rem;
    font-size: 0.426666rem;
    background-color: #FFFFFF;
}

section .goods ul {
    width: 100%;
}

section .goods ul li {
    display: flex;
    width: 100%;
}

section .goods ul li img {
    width: 1.973333rem;
    height: 1.973333rem;
}

section .goods ul li .goods-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 0.4rem;
}

section .goods ul li .goods-content .goods-total {
    display: flex;
    justify-content: space-between;
}

footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 1.2rem;
    border-top: 1px solid #ccc;
}

footer .order-total {
    font-size: 0.426666rem;
}

footer .order-total span {
    padding: 0 0.16rem;
}

footer .order-total b {
    color: #b0352f;
}

footer .order-total em {
    font-size: 0.48rem;
    color: #b0352f;
}

footer .order-topay {
    width: 3.2rem;
    line-height: 1.2rem;
    color: #fff;
    font-size: 0.426666rem;
    text-align: center;
    background-color: #b0352f;
}
</style>