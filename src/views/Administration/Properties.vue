<template>
  <div class="property" v-if="property.type === 'people'">
    <div class="name">{{ name }}</div>
    <div class="value">
      <template v-if="property.people.length > 0">
        <v-chip v-for="people in property.people" :key="people.id">
          <v-avatar left>
              <v-img :src="people.avatar_url"></v-img>
            </v-avatar>
            {{ people.name }}
        </v-chip>
      </template>
      <v-chip v-else><i>Vide</i></v-chip>
    </div>
  </div>
  <div class="property" v-else-if="property.type === 'title'">
    <!-- Do not display type title -->
  </div>
  <div class="property"  v-else-if="property.type === 'select'">
    <div class="name">{{ name }}</div>
    <div class="value">
      <v-chip
        v-if="property.select"
        :class="{ [property.select.color]: true }"
      >
        {{ property.select.name }}
      </v-chip>
      <v-chip v-else>Vide</v-chip>
    </div>
  </div>
  <div class="property" v-else>
    <div class="name">{{ name }}</div>
    <div class="value">
      <div>{{ property }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'Property',

  props: {
    name: {
      type: String,
      required: true,
    },
    property: {
      type: Object as PropType<any>,
      required: true,
    },
  },

  data() {
    return {
    };
  },

  methods: {

  },
});
</script>

<style lang="scss" scoped>
.property {
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  align-items: center;

  & > .name {
    padding-right: 8px;
    flex-basis: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    font-weight: 800;
  }

  & > .value {
    flex: 1;
  }
}
</style>
