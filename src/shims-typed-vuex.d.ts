import { accessor } from './store';

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessor
  }
}
