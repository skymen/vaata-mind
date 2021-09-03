<template>
  <v-app>

    <img src="@/assets/mockups/home.png" id="mockup-home" />

    <v-navigation-drawer
      v-model="drawer"
      width="700"
      app
    >
      <v-sheet
        color="grey lighten-4"
        class="pa-4"
      >
        <v-text-field
          label="Your landing page"
          persistent-hint
          outlined
        ></v-text-field>
      </v-sheet>

      <v-divider></v-divider>

      <v-list dense>
        <v-subheader>Taches</v-subheader>
        <v-list-item-group
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in tasks"
            :key="i"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-subheader>Notes</v-subheader>
        <v-list-item-group
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in notes"
            :key="i"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { State } from './store';

export default Vue.extend({
  name: 'App',

  computed: {
    drawer: {
      get() {
        return this.$accessor.drawer;
      },
      set(val: boolean) {
        this.$accessor.SET_DRAWER(val);
      },
    },
    currentProject(): State['currentProject'] {
      return this.$accessor.currentProject;
    },
    tasks(): State['tasks'] {
      const project = this.currentProject;
      if (project === null) {
        return [];
      }

      const tasks = this.$accessor.tasks.filter(
        (task) => task.projectId === project.id,
      );
      return tasks;
    },
    notes(): State['notes'] {
      const project = this.currentProject;
      if (project === null) {
        return [];
      }

      const notes = this.$accessor.notes.filter(
        (note) => note.projectId === project.id,
      );
      return notes;
    },
  },

  data: () => ({
    //
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
</style>
