<template>
    <header>
        <i class="iconfont icon-fanhui" @click="goBack"></i>
        <slot>
            <span>我的地址</span>
        </slot>
        <i class="iconfont icon-home" @click="goHome"></i>
    </header>

</template>

<script>

export default {
    name: "Header",
    methods: {
        goBack() {
            if (this.$route.name == 'path-list') {
                this.$router.replace('/path')
            }
            this.$router.push('/my');
        },
        goHome() {
            this.$router.push('/home')
        }
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
</style>