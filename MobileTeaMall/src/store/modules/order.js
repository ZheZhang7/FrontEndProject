import { INIT_ORDER } from "./mutations-types";
export default {
    state: {
        list: [],
        orderId: localStorage.getItem('tea_order') || ''
    },
    mutations: {
        [INIT_ORDER](state, orderId) {
            state.list = orderId;
            // 存储订单号
            state.orderId = orderId[0].order_id;

            // 设置id号
            localStorage.setItem('tea_order', orderId[0].order_id)

        }
    }
}