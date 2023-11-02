import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from './../Pages/Home.vue';
import UsersManagement from '../Pages/UsersManagement.vue';
import Support from '../Pages/Support.vue'
import UserDetails from './../Pages/UserDetails.vue';
import NotFound from './../Pages/NotFound.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/users-management',
    name: 'UsersManagement',
    component: UsersManagement,
  },
  {
    path: '/support',
    name: 'Support',
    component: Support,
  },
  {
    path: '/user/:id',
    name: 'UserDetails',
    component: UserDetails,
    props: true,
  },
  { 
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
    props: true,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
