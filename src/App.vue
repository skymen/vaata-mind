<template>
  <v-app>
    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-autocomplete
        dense
        outlined
        label="Select a project..."
        v-model="currentProject"
        :items="projects"
        item-text="name"
        item-value="id"
        return-object
        @change="onProjectSelected"
        hide-details
      >
      </v-autocomplete>

      <v-btn icon>
        <v-icon
          @click="createProject"
        >
          mdi-plus-circle
        </v-icon>
      </v-btn>
    </v-app-bar>

    <img v-if="mockup" src="@/assets/mockups/home.png" id="mockup-home" />

    <v-checkbox class="show-mockup-checkbox" label="Mockup" v-model="mockup"></v-checkbox>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      clipped
      width="500"
      app
    >
      <v-list dense>
        <v-subheader>Taches</v-subheader>
        <v-list-item
          v-for="(item, i) in tasks"
          :key="`task-${i}`"
          :to="getRouterPathCurrentProject(item.id)"
        >
          <v-list-item-icon>
            <v-icon>mdi-check</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-subheader>Notes</v-subheader>
        <v-list-item
          v-for="(item, i) in notes"
          :key="`note-${i}`"
          :to="getRouterPathCurrentProject(item.id)"
        >
          <v-list-item-icon>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { nanoid } from 'nanoid';
import Vue from 'vue';
import { Note, Project, Task } from './models/project';
import { State } from './store';

export default Vue.extend({
  name: 'App',

  async created() {
    await this.$accessor.load();
  },

  mounted() {
    const project = this.$accessor.projects[0];
    this.$accessor.SET_CURRENT_PROJECT(project);
  },

  computed: {
    drawer: {
      get() {
        return this.$accessor.drawer;
      },
      set(val: boolean) {
        this.$accessor.SET_DRAWER(val);
      },
    },
    currentProject: {
      get(): State['currentProject'] {
        return this.$accessor.currentProject;
      },
      set(val: State['currentProject']) {
        this.$accessor.SET_CURRENT_PROJECT(val);
      },
    },
    projects(): State['projects'] {
      return this.$accessor.projects;
    },
    tasks(): State['tasks'] {
      const project = this.currentProject;
      console.log('project', project);
      if (!project) {
        return [];
      }

      const tasks = this.$accessor.tasks.filter(
        (task) => task.project === project.id,
      );

      tasks.push({
        description: '',
        status: '',
        tags: [],
        id: nanoid(),
        name: 'aaa',
        project: project.id,
      });

      return tasks;
    },
    notes(): State['notes'] {
      const project = this.currentProject;
      if (!project) {
        return [];
      }

      const notes = this.$accessor.notes.filter(
        (note) => note.project === project.id,
      );

      console.log('notes', notes);

      notes.push({
        content: 'bbb',
        id: nanoid(),
        name: 'aaa',
        project: project.id,
      });
      return notes;
    },
  },

  methods: {
    getRouterPath(projectId: string, itemId: string | null = null) {
      if (itemId) {
        return `/${projectId}/${itemId}`;
      }
      return `/${projectId}`;
    },
    getRouterPathCurrentProject(itemId: string | null = null) {
      if (!this.currentProject) {
        return '/';
      }

      return this.getRouterPath(this.currentProject.id, itemId);
    },
    onProjectSelected(project: Project) {
      const p = this.getRouterPath(project.id, null);
      this.$router.replace(p);
    },
    selectItem(item: Task | Note) {
      if (this.currentProject) {
        const p = this.getRouterPath(this.currentProject.id, item.id);
        this.$router.replace(p);
      }
    },
    createProject() {
      this.$accessor.createProject({
        id: nanoid(),
        name: 'New project',
        description: '',
      });
    },
  },

  data: () => ({
    mockup: false,
  }),
});
</script>

<style>
#mockup-home {
  height: 1080px;
  width: 1920px;
  position: fixed;
  z-index: 7;
  opacity: 0.1;
  pointer-events: none;
}

.show-mockup-checkbox {
  z-index: 8;
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
