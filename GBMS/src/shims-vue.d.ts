declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
// declare module XXX {} 是用来做一些第三方库没有支持ts的
// 通过declare module,让我们在代码中可以import进来,从而使用它
declare module 'echarts'
declare module '*.js'
