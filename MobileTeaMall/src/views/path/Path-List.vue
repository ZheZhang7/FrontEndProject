<template>
    <div class="path-index">
        <Header>
            <span v-if="pathStatus">添加地址</span>
            <span v-else>编辑地址</span>
        </Header>
        <section>
            <van-address-edit v-if="pathStatus" :area-list="areaList" show-set-default @save="onAdd" />
            <van-address-edit v-else :area-list="areaList" show-delete show-set-default @save="onUpdate"
                @delete="onDelete" @change-detail="onChangeDetail" :address-info="AddressInfo" />
        </section>
        <Tabbar></Tabbar>
    </div>
</template>

<script>
import Header from '@/components/path/Header.vue';
import Tabbar from '@/components/common/Tabbar.vue';
import http from "@/common/api/request.js"
import { Toast } from 'vant';
export default {
    name: "Path-List",
    data() {
        return {
            pathStatus: false,
            areaList: {
                province_list: {
                    110000: '北京市',
                    120000: '天津市',
                },
                city_list: {
                    110100: '北京市',
                    120100: '天津市',
                },
                county_list: {
                    110101: '东城区',
                    110102: '西城区',
                },
            },
        };
    },
    components: { Header, Tabbar },
    created() {
        let key = JSON.parse(this.$route.params.key)
        // 添加进来的
        if (key === 'add') {
            this.pathStatus = true
        } else {   // 编辑进来的
            this.AddressInfo = key;
            this.AddressInfo.isDefault = this.AddressInfo.isDefault === 1 ? true : false
            console.log(key);

        }
    },
    methods: {
        // 保存时触发新增
        onAdd(content) {
            // 将是否为默认地址 存为1/0   方便数据库存储
            content.isDefault = content.isDefault === true ? 1 : 0;
            http.$axios({
                url: '/api/addAddress',
                method: 'POST',
                headers: {
                    token: true
                },
                data: {
                    ...content
                }

            }).then(
                res => {
                    if (res.success) {
                        Toast(res.msg)
                    }
                    this.$router.push('/path');
                }
            )

        },
        // 点击保存触发修改
        onUpdate(content) {
            content.isDefault = content.isDefault === true ? 1 : 0;
            http.$axios({
                url: '/api/updateAddress',
                method: 'POST',
                headers: {
                    token: true
                },
                data: {
                    ...content
                }

            }).then(
                res => {
                    if (res.success) {
                        Toast(res.msg)
                    }
                    this.$router.push('/path');
                }
            )
        },
        onDelete(content) {
            http.$axios({
                url: '/api/deleteAddress',
                method: 'POST',
                headers: {
                    token: true
                },
                data: {
                    id: content.id
                }
            }).then(
                res => {
                    if (!res.success) return;
                    Toast(res.msg)
                    this.$router.push('/path');
                }
            )
        }
    },

}
</script>

<style scoped>
section {
    background-color: #F7F7F7;
}

section .van-address-edit {
    padding: 0px;
}

::v-deep .van-button--danger {
    background-color: #b0352f;
    border: 1px solid #b0352f;
}

::v-deep .van-button--danger {
    width: 8rem;
    height: 1.066666rem;
    background-color: #b0352f;
    flex-wrap: wrap;
}

::v-deep .van-button--default {
    width: 8rem;
    height: 1.066666rem;
}

::v-deep .tabbar {
    border-top: 1px solid #ccc;
}
</style>