<template>
    <header>
        <div @click="goBack">
            <i class='iconfont icon-fanhui'></i>
        </div>
        <div>
            <!-- 利用插槽，默认是登录，可以进行修改 -->
            <slot>
                <span>登录</span>
            </slot>
        </div>
        <div>
            <i class="iconfont icon-home"></i>
        </div>
    </header>
</template>

<script>
export default {
    name: 'Header',
    methods: {
        goBack() {
            this.$router.back();
        }
    },
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

header span {
    font-size: 0.48rem;
}

header i {
    padding: 0 0.4rem;
    font-size: 0.586666rem;
}
</style>