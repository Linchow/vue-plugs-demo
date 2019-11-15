import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home')
    },
    {
      path: '/flowChart-gojs',
      name: 'flowChart-gojs',
      component: () => import('./views/FlowChart-gojs')
    },
    {
      path: '/flowChart-dagreD3',
      name: 'flowChart-dagreD3',
      component: () => import('./views/FlowChart-dagreD3')
    },
    {
      path: '/print',
      name: 'print',
      component: () => import('./views/Print')
    },
  ]
})
