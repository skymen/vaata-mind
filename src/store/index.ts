import Vue from 'vue';
import Vuex from 'vuex';

import {
  useAccessor,
  getterTree,
  mutationTree,
  actionTree,
} from 'typed-vuex';
import { Note, Project, Task } from '@/models/project';
import { dataDB } from '@/database';

Vue.use(Vuex);

const baseState = () => ({
  drawer: true,
  currentProject: null as Project | null,
  currentItem: null as Note | Task | null,
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
  SET_CURRENT_PROJECT(state, project: Project | null) {
    state.currentProject = project;
  },
  SET_CURRENT_ITEM(state, item: Task | Note) {
    state.currentItem = item;
  },
  SET_PROJECTS(state, projects: Project[]) {
    state.projects = projects;
  },
  SET_TASKS(state, tasks: Task[]) {
    state.tasks = tasks;
  },
  SET_NOTES(state, notes: Note[]) {
    state.notes = notes;
  },

  PUT_PROJECT(state, project: Project) {
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

    async createProject({ commit }, project: Project) {
      commit('PUT_PROJECT', project);
    },

    async load({ commit }) {
      const db = await dataDB();
      const projects = await db.getAll('projects');
      const tasks = await db.getAll('tasks');
      const notes = await db.getAll('notes');

      commit('SET_PROJECTS', projects);
      commit('SET_TASKS', tasks);
      commit('SET_NOTES', notes);
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

  state.notes.forEach((note) => {
    db.put('notes', note);
  });

  state.tasks.forEach((task) => {
    db.put('tasks', task);
  });
});

export const accessor = useAccessor(store, storePattern);

// Optionally, inject accessor globally
Vue.prototype.$accessor = accessor;

export default store;
