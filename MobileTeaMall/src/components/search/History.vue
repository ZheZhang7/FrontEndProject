<template>
    <div>
        <div class="search-history" v-if="searchArr.length">
            <h2>
                <i class="iconfont icon-shijian"></i>
                <span>历史搜索</span>
                <span @click="deleteStorage">清空历史记录</span>
            </h2>
            <ul>
                <li v-for="(item, index) in searchArr" :key="index" @click="goSearchList(item)">{{item}}</li>
            </ul>
        </div>
        <div v-else>暂无搜索记录</div>
    </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
export default {
    name: "History",
    data() {
        return {
            searchArr: []
        }
    },
    created() {
        this.searchArr = JSON.parse(localStorage.getItem('searchList')) || [];
    },
    methods: {
        deleteStorage() {
            MessageBox({
                title: '提示',
                message: '确定执行此操作?',
                showCancelButton: true
            }).then(
                response => {
                    if (response === 'confirm') {
                        // 确认删除
                        localStorage.removeItem('searchList')
                        this.searchArr = []
                    }
                }
            )
        },
        goSearchList(item) {
            this.$router.push({
                name: 'list',
                // 通过query参数传参
                query: {
                    key: item
                }
            })
        }
    },
}
</script>

<style scoped>
.search-history {
    padding: 0 .5333rem;
}

.search-history h2 {
    position: relative;
    padding: .2667rem 0.533333rem;
    font-weight: 400;
    font-size: .48rem;
}

.search-history h2 span:last-child {
    position: absolute;
    font-weight: 600;
    right: .5333rem;
    top: .2667rem;
}

.search-history h2 i {
    padding-right: .08rem;
    color: #b0352f;
}

.search-history ul {
    display: flex;
    flex-wrap: wrap;
    padding: .2667rem 0.266666rem;
}

.search-history ul li {
    font-size: .3733rem;
    padding: .0533rem .1333rem;
    border: 1px solid #ccc;
    margin: .08rem .2667rem;
}
</style>