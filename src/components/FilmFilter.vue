<template>
  <div class="filter-buttons">
    <button class="filter-button" :class="{ active: selected === 'all' }" @click="$emit('change-filter', 'all')">All</button>
    <button class="filter-button" :class="{ active: selected === 'watched' }" @click="$emit('change-filter', 'watched')">Watched</button>
    <button class="filter-button" :class="{ active: selected === 'favorite' }" @click="$emit('change-filter', 'favorite')">Favorite</button>
  </div>
</template>

<script setup lang="ts">
defineProps(['selected'])
defineEmits(['change-filter'])
</script>

<style scoped>
.filter-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.filter-button {
  padding: 4px 12px;
  height: 34px;
  font-size: 0.85rem;
  border-radius: 6px;
  font-weight: 500;
  background-color: #f5f5f5;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-sizing: border-box;
}

.filter-button:hover {
  background-color: #eaeaea;
}

.filter-button.active {
  background-color: #a3a3a3;
  color: white;
}
</style>
