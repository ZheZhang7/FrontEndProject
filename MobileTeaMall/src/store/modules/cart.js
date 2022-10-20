import { CART_LIST, CHECK_ALL, UN_CHECK_ALL, CHECK_ITEM } from './mutations-types.js'
import { Toast, Dialog } from 'vant';
import http from '@/common/api/request.js'
export default {
    state: {
        // 购物车的数据（总数）
        list: [],
        // 选中的数据   selected：true
        selectList: []
    },
    getters: {
        // 判断什么时候全选/全不选
        isCheckedAll(state) {
            return state.list.length === state.selectList.length;
        },
        // 计算底部的总计价格
        total(state) {
            let total = {
                num: 0,
                price: 0
            }
            state.list.forEach(v => {
                if (v.checked) {
                    total.num += parseInt(v.goods_num);
                    total.price += v.goods_num * v.goods_price
                }
            })
            return total;
        }
    },
    mutations: {
        [CART_LIST](state, cartArr) {
            state.list = cartArr;

            // selectList里面存储的是id
            state.selectList = state.list.map(v => {
                return v.id;
            })
        },
        // 全选
        [CHECK_ALL](state) {
            state.selectList = state.list.map(v => {
                v.checked = true;
                return v.id;
            })
        },
        // 全不选
        [UN_CHECK_ALL](state) {
            state.list.forEach(v => {
                v.checked = false;
            })
            state.selectList = [];
        },
        // 单选
        [CHECK_ITEM](state, index) {
            let id = state.list[index].id;
            let i = state.selectList.indexOf(id);

            // 能在selectList中找到对应的id，就删除
            if (i > -1) {
                return state.selectList.splice(i, 1)
            }
            // 没有找到，就给selectList中添加一个进去
            state.selectList.push(id);
        },
        //删除
        delGoods(state) {
            state.list = state.list.filter(v => {
                return state.selectList.indexOf(v.id) == -1
            })
        }
    },
    actions: {
        // 进行提交什么时候全选/全不选
        checkAllFn({ commit, getters }) {
            // 如果isCheckedAll返回值是true，再次点击则为全不选
            getters.isCheckedAll ? commit('unCheckAll') : commit('checkAll')
        },
        // 删除购物车的商品
        delGoodsFn({ commit, state }, id) {
            // 没选中则提示信息
            if (state.selectList.length === 0) {
                Toast('请选择商品');
            }

            let arrCart = [];
            Dialog.confirm({
                title: '标题',
                message: '确定删除这些商品吗？',
            }).then(() => {
                // on confirm
                // 在删除中包含单独删除和多选删除
                if (typeof id == 'number') {
                    //单个删除
                    arrCart = [id];
                    let index = state.list.findIndex(v => {
                        return v.id == id
                    })
                    state.list.splice(index, 1);
                } else {
                    //多选删除
                    arrCart = state.selectList;
                    commit('delGoods');
                }

                http.$axios({
                    url: '/api/deleteCart',
                    method: 'post',
                    data: {
                        arrId: arrCart
                    }
                }).then(res => {
                    if (res.success) {
                        Toast(res.msg)
                    }
                })
            })
        }
    }
}