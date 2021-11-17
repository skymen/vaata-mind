<template>
  <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>
  <div v-else>
    <v-btn to="/">Back to home</v-btn>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      isLoading: true,
    };
  },
  async mounted() {
    // @ts-ignore
    const { code } = this.$route.query;

    console.log('code', code);

    const repsonse = await fetch('/api/oauth/getToken', {
      method: 'POST',
      body: JSON.stringify({
        code,
        redirect_uri: `${window.location.origin}/oauth/callback`,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const auth = await repsonse.json();

    console.log('auth', auth);
    if (auth.error) {
      console.error('Auth error');
    } else {
      localStorage.setItem('notion-auth', JSON.stringify(auth));
    }
    // @ts-ignore
    this.isLoading = false;
  },
};
</script>

<style>

</style>
