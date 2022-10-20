<template>
    <div class="recommend">
        <Card></Card>
        <ul>
            <li v-for="(item, index) in recommendList" :key="index">
                <h2>
                    <img :src="item.imgUrl" alt="">
                </h2>
                <div>
                    <h3>{{item.name}}</h3>
                    <p>{{item.content}}</p>
                    <div class="price">
                        <span>￥</span>
                        <b>{{item.price}}</b>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import Card from './Card.vue';
export default {
    name: "Recommend",
    props: {
        recommendList: Array
    },
    components: { Card }
}
</script>

<style scoped>
.recommend ul li {
    position: relative;
}

.recommend ul li h2 {
    text-align: center;
}

.recommend ul li>div {
    position: absolute;
    right: 0;
    top: 0;
    padding: .5333rem;
}

.recommend ul li img {
    width: 9.6rem;
    height: 3.84rem;
    border-radius: .32rem;
}

.recommend ul li>div h3 {
    font-size: .3733rem;
}

.recommend ul li>div p {
    font-size: .32rem;
}

.price {
    margin-top: .5333rem;
    color: red;
    text-align: right;
}

.price span {
    font-size: .3733rem;
}
</style>