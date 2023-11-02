import { RouteLocationNormalized } from 'vue-router';

export function saveCurrentRoute(to: RouteLocationNormalized, from: RouteLocationNormalized): void {
  localStorage.setItem('savedRoute', to.path);
}