<template>
  <div id="app">
    <ImageGallery />
  </div>
</template>

<script>
import ImageGallery from './components/ImageGallery.vue';

export default {
  name: 'App',
  components: {
    ImageGallery,
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}

#app {
  text-align: center;
}
</style>
