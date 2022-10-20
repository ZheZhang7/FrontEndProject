<template>
    <div class="path-index">
        <Header></Header>
        <section>
            <ul v-if="item.length > 0">
                <li @click="goList(item)" v-for="(item, index) in list" :key="index">
                    <div>
                        <span>{{item.name}}</span>
                        <span>{{item.tel}}</span>
                    </div>
                    <div class="city">
                        <span class='active' v-if="item.isDefault === 1">[默认]</span>
                        <span>{{item.province}}</span>
                        <span>{{item.city}}</span>
                        <span>{{item.country}}</span>
                        <span>{{item.addressDetail}}</span>
                    </div>
                </li>
            </ul>
            <h1 v-else>暂无数据,请添加地址</h1>
            <div class='add-path' @click="goList(add)">添加地址</div>
        </section>
        <Tabbar></Tabbar>
    </div>
</template>

<script>
import Header from '@/components/path/Header.vue';
import Tabbar from '@/components/common/Tabbar.vue';
import http from "@/common/api/request.js";
import { mapState, mapMutations } from 'vuex';
import bus from '@/common/bus.js'
export default {
    data() {
        return {
            pathStatus: false
        }
    },
    name: "Path-Index",
    components: { Header, Tabbar },
    created() {

        // 从订单页面进来的
        if (this.$route.query.type == 'select') {
            this.pathStatus = true;
        }

        this.getDate();
    },
    computed: {
        ...mapState({
            list: state => state.path.list
        })
    },
    methods: {
        ...mapMutations(['initData']),
        goList(option) {

            // this.pathStatus为true代表从订单页面进入：选择状态
            // 还需要将地址传到订单页面，但是back无法传值，可以使用push,在这里使用bus
            if (this.pathStatus) {
                bus.$emit('selectPath', JSON.stringify(option));
                this.$route.back()
                return;
            }

            this.$router.push({
                name: '/pathlist',
                params: {
                    key: JSON.stringify(option)
                }
            })
        },
        getDate() {
            http.$axios({
                url: '/api/selectAddress',
                method: 'POST',
                headers: {
                    token: true
                }
            }).then(
                res => {
                    this.initData(res.data);
                    console.log(res)
                }
            )
        }
    },
}
</script>

<style scoped>
section {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #F7F7F7;
}

section ul {
    width: 100%;
}

section ul li {
    padding: 0.266666rem 0.4rem;
    margin: 0.16rem 0;
    background-color: #FFFFFF;
}

section ul li span {
    padding-right: 0.4rem;
    font-size: 0.426666rem;
}

.active {
    color: #b0352f;
}

section .add-path {
    margin-top: 0.8rem;
    width: 3.2rem;
    line-height: 1.066666rem;
    font-size: 0.48rem;
    text-align: center;
    color: #FFFFFF;
    background-color: #b0352f;
    border-radius: 6px;
}

.city span {
    padding-right: .16rem;
}

::v-deep .tabbar {
    border-top: 1px solid #ccc;
}
</style>