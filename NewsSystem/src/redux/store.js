import { legacy_createStore as createStore, combineReducers } from "redux";
import { CollapsedReducer } from './reducers/CollapsedReducer'
// 状态持久化
// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
// import { LoadingReducer } from "./reducers/LoadingReducer";

// 正常的reducer可以传递一个reducer，不止一个的时候使用combineReducers进行合并
const reducer = combineReducers({
    CollapsedReducer,
    // LoadingReducer
})

// const persistConfig = {
// 存到本地中key: 'persist'的值里面
// key: 'persist',
// storage,
// 这里是黑名单，表示不会被持久化的
// blacklist: ['LoadingReducer']
// }
// 将合并后的reducer作持久化，经过persistedReducer生成store
// const persistedReducer = persistReducer(persistConfig, reducer)


// persistedReducer是为store服务的reducer，再将persistedReducer生成store
// const store = createStore(persistedReducer);
// const persistor = persistStore(store)
// export {
//     store,
//     persistor
// }


const store = createStore(reducer)

export default store;
