import Vue from 'vue';
import Vuex from 'vuex';

import {
  useAccessor,
  getterTree,
  mutationTree,
  actionTree,
} from 'typed-vuex';
import { IProject, Task } from '@/models/project';
import { dataDB } from '@/database';

Vue.use(Vuex);

const baseState = () => ({
  drawer: true,
  currentProject: null as IProject | null,
  tasks: [] as Task[],
  projects: [] as IProject[],
});

export type State = ReturnType<typeof baseState>;

const getters = getterTree(baseState, {
});

const mutations = mutationTree(baseState, {
  SET_DRAWER(state, drawer: boolean) {
    state.drawer = drawer;
  },
  SET_CURRENT_PROJECT(state, project: IProject | null) {
    state.currentProject = project;
  },
  SET_PROJECTS(state, projects: IProject[]) {
    state.projects = projects;
  },
  SET_TASKS(state, tasks: Task[]) {
    state.tasks = tasks;
  },

  PUT_PROJECT(state, project: IProject) {
    const foundIndex = state.projects.findIndex(
      (p) => p.id === project.id,
    );
    if (foundIndex > -1) {
      Vue.set(state.projects, foundIndex, project);
    } else {
      state.projects.push(project);
    }
  },
});

const actions = actionTree(
  { state: baseState, getters, mutations },
  {

    async createProject({ commit }, project: IProject) {
      commit('PUT_PROJECT', project);
    },

    async load({ commit }) {
      const db = await dataDB();
      const projects = await db.getAll('projects');
      const tasks = await db.getAll('tasks');

      commit('SET_PROJECTS', projects);
      commit('SET_TASKS', tasks);
    },
    save() {
      // save projects to localstorage
    },
  },
);

const storePattern = {
  state: baseState,
  mutations,
  getters,
  actions,
};

const store = new Vuex.Store(storePattern);

export const unsubscribe = store.subscribe(async (
  mutation,
  state,
) => {
  console.log('mutation', mutation);
  console.log('state', state);

  const db = await dataDB();

  state.projects.forEach((project) => {
    db.put('projects', project);
  });

  state.tasks.forEach((task) => {
    db.put('tasks', task);
  });
});

export const accessor = useAccessor(store, storePattern);

// Optionally, inject accessor globally
Vue.prototype.$accessor = accessor;

export default store;
