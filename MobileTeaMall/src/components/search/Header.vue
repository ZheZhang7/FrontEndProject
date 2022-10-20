<template>
    <header>
        <div class="search-return" @click="goBack">
            <i class="iconfont icon-fanhui"></i>
        </div>
        <div class="search-main">
            <i class="iconfont icon-fangdajing"></i>
            <form action="" onsubmit="return false" @keyup.enter="goSearchList">
                <input type="search" placeholder="搜索您想要的" v-model="searchVal" />
            </form>
        </div>
        <div class="search-btn" @click="goSearchList">搜索</div>
    </header>
</template>

<script>
export default {
    name: 'Header',
    data() {
        return {
            searchVal: this.$route.query.key || "",
            searchArr: []
        }
    },
    methods: {
        goBack() {
            this.$router.back();
        },
        goSearchList() {
            // 如果搜索是空白，直接return
            if (!this.searchVal.trim()) return

            // 判断之前有没有搜索的本地存储
            if (!localStorage.getItem('searchList')) {
                // 没有
                localStorage.setItem('searchList', '[]')
            } else {
                this.searchArr = JSON.parse(localStorage.getItem('searchList'))
            }
            // 增加数据
            this.searchArr.unshift(this.searchVal)
            // 去重，es6,转化为对象，将对象转为真正的数组是Arrar.from
            let newArr = new Set(this.searchArr)
            // 赋值到本地存储
            localStorage.setItem('searchList', JSON.stringify(Array.from(newArr)))

            // 搜索关键词一致， 不进行跳转
            if (this.searchVal === this.$route.query.key) return;
            // 跳转页面
            this.$router.push({
                name: 'list',
                // 通过query参数传参
                query: {
                    key: this.searchVal
                }
            })
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
    height: 1.1733rem;
    background-color: #b0352f;
    color: #fff;
}

/* 左侧 */
.search-return,
.search-btn {
    padding: 0 .4rem;
}

.search-return i {
    font-size: .64rem;
}

/* 右侧 */
.search-btn {
    font-size: .48rem;
}

.search-main {
    display: flex;
    align-items: center;
    width: 6.4rem;
    height: .8rem;
    border-radius: .32rem;
    background-color: #fff;
}

.search-main i {
    padding: 0 .16rem;
    color: #666;
}

.search-main input {
    font-size: .4267rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>