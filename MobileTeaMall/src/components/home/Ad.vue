<template>
    <div class="ad">
        <li v-for='(item,index) in AdList' :key='index'>
            <img :src="item.imgUrl" />
        </li>
    </div>
</template>

<script>

export default {
    name: 'Ad',
    props: {
        AdList: Array
    }
}
</script>

<style scoped>
.ad {
    width: 100%;
    /* height: 2.9867rem; */
}

.ad img {
    width: 100%;
    height: 100%;
}
</style>