<template>
  <div class="stats-view">
    <h2> Film Statistics</h2>
    <FilmStats />
  </div>
</template>

<script setup lang="ts">
import FilmStats from '../components/FilmStats.vue'
</script>

<style scoped>
.stats-view {
  max-width: 900px;
  margin: 2rem auto;
  text-align: center;
}
</style>
