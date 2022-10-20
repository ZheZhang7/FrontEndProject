<template>
    <div class="like">
        <Card>
            <span>猜你喜欢</span>
        </Card>
        <ul>
            <li v-for="(item, index) in likeList" :key="index" @click="goDetail(item.id)">
                <h2>
                    <img v-lazy="item.imgUrl" alt="">
                </h2>
                <h3>{{item.name}}</h3>
                <div>
                    <span>￥</span>
                    <b>{{item.price}}</b>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import Vue from "vue";
// 懒加载
import { Lazyload } from 'mint-ui';
import Card from './Card.vue';
Vue.use(Lazyload);
export default {
    name: "Like",
    props: {
        likeList: Array
    },
    methods: {
        goDetail(id) {
            this.$router.push({
                path: '/detail',
                query: {
                    id
                }
            })
        }
    },
    components: { Card }
}
</script>

<style scoped>
.like ul {
    display: flex;
    flex-wrap: wrap;
}

.like ul li {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
}

.like h3 {
    padding: 0 .16rem;
    width: 93%;
    font-size: .3733rem;
    font-weight: 400;
    color: #222;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}

.like ul li>div {
    padding: 0 .16rem;
    width: 93%;
    text-align: left;
    color: #ff0000;
}

.like ul li>div span {
    font-size: .3733rem;
}

.like ul li>div b {
    font-weight: 600;
    font-size: .4267rem;
}

.like img {
    width: 4.6933rem;
    height: 4.6933rem;
}
</style>