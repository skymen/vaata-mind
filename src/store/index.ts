import Vue from 'vue';
import Vuex from 'vuex';

import {
  useAccessor,
  getterTree,
  mutationTree,
  actionTree,
} from 'typed-vuex';
import { Note, Project, Task } from '@/models/project';

Vue.use(Vuex);

const baseState = () => ({
  drawer: true,
  currentProject: null as Project | null,
  tasks: [] as Task[],
  notes: [] as Note[],
  projects: [] as Project[],
});

export type State = ReturnType<typeof baseState>;

const getters = getterTree(baseState, {});

const mutations = mutationTree(baseState, {
  SET_DRAWER(state, drawer: boolean) {
    state.drawer = drawer;
  },
});

const actions = actionTree(
  { state: baseState, getters, mutations },
  {
    load() {
      // load projects from localstorage
    },
    save() {
      // save projects to localstorage
    },
  },
);

const storePattern = {
  state: baseState,
  mutations,
  actions,
};

const store = new Vuex.Store(storePattern);

export const accessor = useAccessor(store, storePattern);

// Optionally, inject accessor globally
Vue.prototype.$accessor = accessor;

export default store;
