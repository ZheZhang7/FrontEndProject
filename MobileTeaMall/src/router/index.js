import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/",
    redirect: '/home'
  },
  {
    path: "/list",
    name: "List",
    component: () =>
      import("../views/List.vue"),
  },
  {
    path: "/cart",
    name: "Cart",
    component: () =>
      import("../views/Cart.vue"),
  },
  {
    path: "/my",
    name: "My",
    component: () =>
      import("../views/My.vue"),
  },
  {
    path: "/search",
    name: "Search",
    children: [
      {
        path: "/",
        name: "Search-index",
        component: () => import("../views/search/Search-index.vue")
      },
      {
        path: "list",
        name: "list",
        component: () =>
          import("../views/search/Search-list.vue"),
      }
    ],
    component: () =>
      import("../views/Search.vue"),
  },
  {
    path: "/detail",
    name: "Detail",
    meta: {
      keepAlive: true    //设置被缓存的组件
    },
    component: () =>
      import("../views/Detail.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import("../views/login/Login.vue"),
  },
  {
    path: "/userLogin",
    name: "UserLogin",
    component: () =>
      import("../views/login/UserLogin.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import("../views/login/Register.vue"),
  },
  {
    path: "/recovery",
    name: "Recovery",
    children: [
      {
        path: "/",
        name: "index",
        component: () => import("../views/recovery/RecoveryIndex.vue")
      },
      {
        path: "btn",
        name: "btn",
        component: () =>
          import("../views/recovery/RecoveryBtn.vue"),
      }
    ],
    component: () =>
      import("../views/recovery/Recovery.vue"),
  },
  {
    path: "/path",
    name: "Path",
    children: [
      {
        path: "/",
        name: "pathIndex",
        component: () => import("../views/path/Path-Index.vue")
      },
      {
        path: "/pathlist",
        name: "pathList",
        component: () => import("../views/path/Path-List.vue")
      },
    ],
    component: () =>
      import("../views/Path.vue"),
  },
  {
    path: "/order",
    name: "Order",
    meta: {
      keepAlive: true    //设置被缓存的组件
    },
    component: () =>
      import("../views/Order.vue"),
  },
  {
    path: "/payment",
    name: "Payment",
    component: () =>
      import("../views/Payment.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 哪些页面是没有登录不可以进去的，提前拦截
  let nextRoute = ['Payment', 'Cart', 'Path', 'Order', 'pathIndex', 'pathList'];
  // 判断是否是登录状态
  let userInfo = JSON.parse(localStorage.getItem('teaUserInfo'))

  // 当前进入的页面，是不是需要验证的页面
  if (nextRoute.indexOf(to.name) >= 0) {
    if (!userInfo) {
      router.push('/login')
    }
  }

  next();

})

export default router;
