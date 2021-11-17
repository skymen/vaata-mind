<template>
  <v-btn
    :href="`https://api.notion.com/v1/oauth/authorize?client_id=5302e0ee-222a-4c66-89cf-0960e715db67&redirect_uri=${redirectURL}&response_type=code&owner=user`"
  >
    Login with Notion
  </v-btn>
</template>

<script>

export default {
  data() {
    return {
      redirectURL: `${window.location.origin}/oauth/callback`,
    };
  },

};
</script>

<style>

</style>
