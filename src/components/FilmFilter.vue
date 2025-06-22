<template>
  <div class="filter-buttons">
  <button :class="{ active: selected === 'all' }" @click="$emit('change-filter', 'all')">All</button>
  <button :class="{ active: selected === 'watched' }" @click="$emit('change-filter', 'watched')">Watched</button>
  <button :class="{ active: selected === 'favorite' }" @click="$emit('change-filter', 'favorite')">Favorite</button>
  </div>
  </template>

<script setup lang="ts">
defineProps(['selected'])
defineEmits(['change-filter'])
</script>

<style scoped>
.filter-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  gap: 10px;
}

.filter-buttons button {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background-color: #f5f5f5;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}

.filter-buttons button:hover {
  background-color: #eaeaea;
}

.filter-buttons button.active {
  background-color: #a3a3a3;
  color: white;
}
</style>


