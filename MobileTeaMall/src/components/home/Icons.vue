<template>
    <ul class="icons">
        <li v-for="(item, index) in iconList" :key="index">
            <img :src="item.imgUrl" alt="">
            <span>{{item.title}}</span>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'Icons',
    props: {
        iconList: Array
    }
}
</script>

<style scoped>
.icons {
    display: flex;
    justify-content: space-around;
    padding: .2667rem 0;
}

.icons li {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.icons img {
    width: 1.0133rem;
    height: 1.0133rem;
}

.icons span {
    padding: .16rem 0;
    font-size: .4267rem;
}
</style>