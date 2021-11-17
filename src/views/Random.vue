<template>
  <v-app>
    <v-main class="main">
      <v-container class="d-flex h100 flex-column">
      <!-- <v-treeview
        selectable
        item-text="text"
        item-key="id"
        :items="selector"
      ></v-treeview> -->

        <v-row>
          <v-col>
            <v-autocomplete
              chips
              dense
              solo
              label="Select a project..."
              v-model="currentProject"
              :items="selector"
              item-text="name"
              item-value="id"
              multiple
              :loading="isProjectsLoading"
              return-object
              hide-details
            >
            </v-autocomplete>
          </v-col>
        </v-row>

        <v-row v-if="!isProjectsLoading">
          <v-col>
            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="6"
                lg="4"
                v-for="(item, key) in properties" :key="key"
              >
                <v-autocomplete
                  chips
                  dense
                  solo
                  v-model="selection[key]"
                  :label="item.name"
                  :items="item.values"
                  item-text="name"
                  item-value="id"
                  multiple
                  return-object
                  hide-details
                >
                  <template #item="data">
                    <template v-if="item.type === 'people'">
                      <v-list-item-avatar v-if="data.item.avatar_url">
                        <img :src="data.item.avatar_url">
                      </v-list-item-avatar>
                      <v-list-item-content>
                        {{ data.item.id === selfId ? 'Moi' : data.item.name }}
                      </v-list-item-content>
                    </template>
                    <template v-else-if="item.type === 'select'">
                      <v-list-item-icon v-if="data.item.color">
                        <v-icon :color="data.item.color">mdi-square</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>{{ data.item.name }}</v-list-item-content>
                    </template>
                    <template v-else>
                      <v-list-item-content>{{ data.item.name }}</v-list-item-content>
                    </template>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-skeleton-loader
          v-else
          type="text@3"
          class="my-4"
        ></v-skeleton-loader>

        <div class="my-2 text-center">{{ filteredTasksFromProject.length }} taches disponibles</div>

        <v-row class="h100">
          <v-col class="h100 d-flex flex-column hide-overflow">
            <Viewer
              v-if="filteredTasksFromProject.length > 0 || isTaskLoading"
              class="flex-grow-1 h100 hide-overflow"
              :task="currentTask"
              :isLoading="isTaskLoading"
              :doingMode="doingMode"

              @accept="accept"
              @reject="reject"
              @done="done"
              @cancel="cancel"
            ></Viewer>
            <v-card v-else>
              <v-card-title>
                Plus aucune tache disponible !
              </v-card-title>
              <v-card-text class="card-text text-center">
                <v-btn color="success" class="mx-2" @click="resetFilters">
                  Réinitialiser les filtres
                </v-btn>
                <v-btn color="success" class="mx-2" @click="resetTasks">
                  Réinitialiser les taches
                </v-btn>
              </v-card-text>
            </v-card>
            <div ></div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { SearchResponse } from '@notionhq/client/build/src/api-endpoints';
import Viewer from '@/views/Administration/Viewer.vue';
import { api } from '@/wrapper/api';
import {
  Category, Elements, ICategory, IProject, isCategory, isProject, isTask, Project, Task,
} from '@/models/project';

type PropsDefinition = Record<string, { name: string, values: any[], type: string }>

export default Vue.extend({
  name: 'Random',

  components: {
    Viewer,
  },

  computed: {
    selector(): (IProject | ICategory)[] {
      // console.log('this.projects', this.projects);
      // console.log('this.categories', this.categories);
      return this.projects;
    },
    tasksFromProject(): Task[] {
      const selectedProject = this.currentProject?.map((p) => p.id);
      return this.tasks
        .filter((task) => selectedProject?.includes(task.parent))
        .filter((task) => !this.denyList.includes(task.id));
    },

    filteredTasksFromProject(): Task[] {
      let filteredTasks = this.tasksFromProject;
      Object.entries(this.selection).forEach(([key, value]) => {
        const ids = value.map((v: any) => v.id);
        // console.log('ids', ids);

        filteredTasks = filteredTasks.filter((task) => {
          const taskValue = task.properties[key][this.properties[key].type];
          // console.log('task', task);
          // console.log('this.properties[key].type', this.properties[key].type);

          const arrayTaskValue = Array.isArray(taskValue) ? taskValue : [taskValue];

          // console.log('arrayTaskValue', arrayTaskValue);

          if (ids.includes('nothing') && arrayTaskValue.length === 0) {
            return true;
          }

          return arrayTaskValue.some((v) => {
            const id = v?.id ?? 'nothing';
            // console.log('id', id);
            if (
              ids.includes(id)
            ) {
              // console.log('true', id);
              return true;
            }
            // console.log('false', id);
            return false;
          });
        });
        console.log('------');
      });

      // console.log('filteredTasks', filteredTasks);
      return filteredTasks;
    },
    tasks(): Task[] {
      // @ts-ignore
      return this.elements.filter((e) => isTask(e));
    },
    projects(): IProject[] {
      // @ts-ignore
      return this.elements.filter((e) => isProject(e));
    },
    categories(): ICategory[] {
      // @ts-ignore
      return this.elements.filter((e) => isCategory(e));
    },
  },

  data() {
    return {
      doingMode: false,
      currentProject: null as IProject[] | null,
      currentTask: null as null | Task,

      elements: [] as Elements[],
      denyList: [] as string[],

      isTaskLoading: true,
      isProjectsLoading: true,
      selection: {} as Record<string, any>,
      properties: {} as PropsDefinition,
      selfId: '',
    };
  },

  methods: {
    generateProperties() {
      const props: PropsDefinition = {};

      this.tasksFromProject.forEach((task) => {
        const propsForTask = task.properties;
        Object.entries(propsForTask).forEach(([key, value]) => {
          // @ts-ignore
          if (!props[key] && value.type !== 'title') {
            props[key] = {
              name: key,
              values: [],
              // @ts-ignore
              type: value.type,
            };
          }

          const propForTask = propsForTask[key];
          if (
            propForTask.type === 'select'
            && propForTask.select
            && !props[key].values.find((prop) => prop.id === propForTask.select.id)
          ) {
            props[key].values.push(propForTask.select);
          } else if (
            propForTask.type === 'people'
            && propForTask.people
          ) {
            // @ts-ignore
            propForTask.people.forEach((person) => {
              if (!props[key].values.find((prop) => prop.id === person.id)) {
                props[key].values.push(person);
              }
            });
          } else if (
            propForTask.type === 'title'
          ) {
            // Do nothing
          }
        });
      });

      Object.keys(props).forEach((key) => {
        props[key].values.push({
          name: 'Sans valeur',
          id: 'nothing',
        });
      });

      Object.keys(props).forEach((key) => {
        this.selection[key] = [];
      });

      this.$set(this, 'properties', props);
    },
    shuffle(myArray: any[]) {
      let currentIndex = myArray.length; let
        randomIndex;

      // While there remain elements to shuffle...
      while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        // eslint-disable-next-line no-param-reassign
        [myArray[currentIndex], myArray[randomIndex]] = [
          myArray[randomIndex], myArray[currentIndex]];
      }

      return myArray;
    },
    async resetFilters(): Promise<void> {
      Object.entries(this.properties).forEach(([key, values]) => {
        this.$set(this.selection, key, values.values);
      });

      await this.selectNextTask();
    },
    async resetTasks(): Promise<void> {
      this.denyList = [];

      await this.selectNextTask();
    },
    setTaskContent(taskId: Task['id'], content: any) {
      const task = this.tasks.find((t) => t.id === taskId);
      if (task) {
        task.content = content;
      }
    },

    async preloadNextTasks(): Promise<void> {
      const tasks = this.filteredTasksFromProject;

      if (tasks.length === 0) {
        return;
      }

      // load next 3 tasks
      let index = 0;
      for await (const task of tasks) {
        if (!task.content) {
          console.log(`Loading task ${task.name} in background`);

          const content = await api.getPageContent(task.id);

          this.setTaskContent(task.id, content.results);
        }

        index += 1;

        if (index > 5) {
          break;
        }
      }
    },
    async loadTask(index: number): Promise<void> {
      const tasks = this.filteredTasksFromProject;

      if (tasks.length === 0) {
        return;
      }

      if (!tasks[0].content) {
        const content = await api.getPageContent(tasks[index].id);

        this.setTaskContent(tasks[index].id, content.results);
      }
    },
    async selectNextTask(): Promise<void> {
      this.isTaskLoading = true;
      const tasks = this.filteredTasksFromProject;

      await this.loadTask(0);

      // Pick next task
      const newTask = tasks[0];

      this.currentTask = newTask;
      this.isTaskLoading = false;

      this.preloadNextTasks();
    },
    reject() {
      if (this.currentTask) {
        this.denyList.push(this.currentTask.id);
        this.selectNextTask();
      }
    },
    accept() {
      this.doingMode = true;
    },
    done() {
      this.doingMode = false;
    },
    cancel() {
      this.doingMode = false;
    },
  },

  async mounted() {
    const rawAuth = localStorage.getItem('notion-auth');

    if (!rawAuth) {
      this.$router.push('/login');
    } else {
      const auth = JSON.parse(rawAuth);
      console.log('auth', auth);
      this.selfId = auth.owner.user.id;
      api.setToken(auth.access_token);

      const data: SearchResponse['results'] = [];
      let hasMore = true;
      let nextCursor = '';

      while (hasMore) {
      // eslint-disable-next-line no-await-in-loop
        const { has_more, next_cursor, results } = await api.fetchElements(nextCursor);

        if (has_more && next_cursor) {
          nextCursor = next_cursor;
        }

        hasMore = has_more;

        data.push(...results);
      }

      for await (const element of data) {
        if (element.object === 'page') {
          if (element.parent.type === 'workspace') {
            // Workspaces
            let cover = '';
            let text = '';

            if (
              element.cover?.type === 'external'
            ) {
              cover = element.cover.external.url;
            } else {
              cover = element.cover?.file.url ?? '';
            }

            if (element.properties.title.type === 'title') {
              if (Array.isArray(element.properties.title.title)) {
                text = element.properties.title.title.map((t) => t.plain_text).join(' ');
              }
            }

            this.elements.push(new Category({
              id: element.id,
              cover,
              archived: element.archived,
              text,
              parent: '',
              url: element.url,
            }));
          } else {
            // Tasks
            this.elements.push(new Task({
              // @ts-ignore
              name: element.properties?.Name?.title?.[0]?.plain_text ?? 'No Title',
              // @ts-ignore
              parent: element.parent.database_id,
              id: element.id,
              content: null,
              archived: element.archived,
              properties: element.properties,
              url: element.url,
            }));

            // console.log('b', element);
            // console.log('b', element.properties.Name.title[0].plain_text);
          }
        } else if (element.object === 'database') {
          // Projects
          this.elements.push(new Project({
            id: element.id,
            name: element.title[0].plain_text,
            // @ts-ignore
            parent: element.parent.page_id,
            properties: element.properties,
            url: element.url,
          }));
        }
      }

      this.elements = this.shuffle(this.elements);

      this.currentProject = this.projects;

      this.isProjectsLoading = false;

      this.generateProperties();

      this.resetFilters();
      await this.selectNextTask();
    }
  },
});
</script>

<style lang="scss" scoped>
.h100 {
  height: 100%;
}

.main {
  height: 100vh;
}
</style>
