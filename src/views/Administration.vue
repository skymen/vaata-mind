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

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            disabled
            icon
            v-bind="attrs"
            v-on="on"
            @click="createProject"
          >
            <v-icon>
              mdi-plus-circle
            </v-icon>
          </v-btn>
        </template>
        <span>Nouveau projet</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            to="/random"
            class="no-active"
          >
            <v-icon>
              mdi-dice-multiple
            </v-icon>
          </v-btn>
        </template>
        <span>Tâche au hasard</span>
      </v-tooltip>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
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

// import { nanoid } from 'nanoid';
// import Vue from 'vue';
// import { GetPageResponse } from '@notionhq/client/build/src/api-endpoints';
// import { Project, Task } from '../models/project';
// import { State } from '../store';
// import { getTasks } from '../wrapper/api';

// export default Vue.extend({
//   name: 'App',

//   async created() {
//     // await this.$accessor.load();
//   },

//   async mounted() {
//     // const project = this.$accessor.projects[0];
//     // this.$accessor.SET_CURRENT_PROJECT(project);

//     const projects = (await ((await fetch('/api/getPages', {
//       method: 'POST',
//       body: JSON.stringify({
//         type: 'projects',
//       }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })).json())).results as GetPageResponse[];

//     const notes = (await ((await fetch('/api/getPages', {
//       method: 'POST',
//       body: JSON.stringify({
//         type: 'notes',
//       }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })).json())).results as GetPageResponse[];

//     console.log('projects', projects);
//     console.log('notes', notes);

//     const blocksNotes: (() => Promise<any>)[] = [];

//     notes.forEach(async (note) => {
//       blocksNotes.push(async () => {
//         const blocks = (await ((await fetch('/api/getPageDetails', {
//           method: 'POST',
//           body: JSON.stringify({
//             page: note.id,
//           }),
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         })).json()));

//         return blocks;
//       });
//     });

//     const notesBlocsResult = await Promise.all(blocksNotes.map((x) => x()));

//     this.$accessor.SET_PROJECTS(projects.map((p, index) => {
//       const myProject = new Project();
//       myProject.id = p.id;

//       const name = p.properties.Name;
//       if (name.type === 'title') {
//         const title = name.title[0];
//         if (title.type === 'text') {
//           myProject.name = title.text.content;
//         }
//       }
//       myProject.description = '';

//       return myProject;
//     }));

//     const tasks = await getTasks();
//     this.$accessor.SET_TASKS(tasks);

//     this.$accessor.SET_NOTES(notes.map((p, index) => {
//       const myNotes = new Note();
//       myNotes.id = p.id;
//       myNotes.content = '';
//       myNotes.name = p.properties.Name.title[0].text.content;
//       myNotes.project = p.properties.Project.relation[0].id;
//       myNotes.content = notesBlocsResult[index].results;

//       return myNotes;
//     }));

//     this.isLoading = false;
//   },

//   computed: {
//     drawer: {
//       get() {
//         return this.$accessor.drawer;
//       },
//       set(val: boolean) {
//         this.$accessor.SET_DRAWER(val);
//       },
//     },
//     currentProject: {
//       get(): State['currentProject'] {
//         return this.$accessor.currentProject;
//       },
//       set(val: State['currentProject']) {
//         this.$accessor.SET_CURRENT_PROJECT(val);
//       },
//     },
//     projects(): State['projects'] {
//       return this.$accessor.projects;
//     },
//     tasks(): State['tasks'] {
//       const project = this.currentProject;
//       if (!project) {
//         return [];
//       }

//       const tasks = this.$accessor.tasks.filter(
//         (task) => task.project === project.id,
//       );

//       return tasks;
//     },
//     notes(): State['notes'] {
//       const project = this.currentProject;
//       if (!project) {
//         return [];
//       }

//       const notes = this.$accessor.notes.filter(
//         (note) => note.project === project.id,
//       );

//       return notes;
//     },
//   },

//   methods: {
//     getRouterPath(projectId: string, itemId: string | null = null) {
//       if (itemId) {
//         return `/admin/${projectId}/${itemId}`;
//       }
//       return `/admin/${projectId}`;
//     },
//     getRouterPathCurrentProject(itemId: string | null = null) {
//       if (!this.currentProject) {
//         return '/admin';
//       }

//       return this.getRouterPath(this.currentProject.id, itemId);
//     },
//     onProjectSelected(project: Project) {
//       const p = this.getRouterPath(project.id, null);
//       this.$router.replace(p);
//     },
//     selectItem(item: Task | Note) {
//       if (this.currentProject) {
//         const p = this.getRouterPath(this.currentProject.id, item.id);
//         this.$router.replace(p);
//       }
//     },
//     createProject() {
//       this.$accessor.createProject({
//         id: nanoid(),
//         name: 'New project',
//         description: '',
//       });
//     },
//   },

//   data: () => ({
//     isLoading: true,
//   }),
// });
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
