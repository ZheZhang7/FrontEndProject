<template>
    <header>
        <div class='returns'>
            <i class='iconfont icon-fanhui'></i>
        </div>
        <div class='search'>
            <i class='iconfont icon-fangdajing'></i>
            <span>搜您喜欢的...</span>
        </div>
        <div class='go-home'>
            <i class="iconfont icon-home"></i>
        </div>
    </header>
</template>

<script>
export default {
    name: 'Header',
}
</script>

<style scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.173333rem;
    background-color: #b0352f;
}

header .returns {
    line-height: 1.173333rem;
    padding: 0 0.533333rem;
}

header .returns i {
    color: #fff;
    font-size: .64rem;
}

header .search {
    display: flex;
    align-items: center;
    flex: 1;
    padding: 0.16rem 0.266666rem;
    background-color: #FFFFFF;
    border-radius: 0.64rem;
}

header .search i {
    padding-right: 0.16rem;
    color: #666;
    font-size: 0.48rem;
}

header .search span {
    color: #666;
    font-size: 0.373333rem;
}

header .go-home {
    padding: 0 .4267rem;
    line-height: 1.173333rem;
}

header .go-home i {
    font-size: .64rem;
    color: #fff;
}
</style>

