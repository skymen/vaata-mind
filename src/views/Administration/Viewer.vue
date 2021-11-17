<template>
  <v-card>
    <template v-if="!isLoading">
      <v-card-title>
        <span class="text-truncate">{{ task.name }}</span>
        <v-spacer></v-spacer>
        <v-btn :href="openInApp(task.url)" target="_blank" text icon class="hidden-sm-and-down">
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="card-text">
        <div>
          <Property
            v-for="(prop, key) in task.properties"
            :key="key"
            :name="key"
            :property="prop"
          >
          </Property>
        </div>
        <VueNotionRender
          v-if="task.content && task.content.length > 0"
          :unofficial="false"
          :data="task.content"
        ></VueNotionRender>
        <!-- <NotionRenderer v-if="blockMap" :blockMaps="blockMap" ></NotionRenderer> -->
        <div v-else>
          <i>No description</i>
        </div>
      </v-card-text>
    </template>
    <v-skeleton-loader
      v-else
      type="article"
      class="skeleton-loader"
    ></v-skeleton-loader>

    <v-card-actions v-if="!isLoading">
      <v-spacer></v-spacer>
      <template v-if="doingMode">
        <v-btn outlined @click="done">Terminer</v-btn>
        <v-btn outlined @click="cancel">Annuler</v-btn>
      </template>

      <template v-else>
        <v-btn outlined @click="reject" color="error">Rejecter</v-btn>
        <!-- <v-btn outlined @click="accept" color="success">Accepter</v-btn> -->
      </template>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import VueNotionRender from 'vue-notion-render';
import { Task } from '@/models/project';
import Property from '@/views/Administration/Properties.vue';

export default Vue.extend({
  name: 'Viewer',

  components: {
    VueNotionRender,
    Property,
  },

  props: {
    task: {
      type: Object as PropType<Task | null>,
      required: false,
    },
    isLoading: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: true,
    },
    doingMode: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      blockMap: null as null | any,
      name: '',
    };
  },

  methods: {
    openInApp(url: string) {
      return url.replace('https://', 'notion://');
    },
    accept() {
      this.$emit('accept');
    },
    reject() {
      this.$emit('reject');
    },

    done() {
      this.$emit('done');
    },
    cancel() {
      this.$emit('cancel');
    },
  },
});
</script>

<style lang="scss" scoped>
.card-text {
  height: calc(100% - 122px);
  overflow: auto;
}

.skeleton-loader {
  height: calc(100% - 54px);
  overflow: auto;
}
</style>
