<template>
  <div class="sort-dropdown" ref="dropdownRef">
    <button class="filter-button" @click="toggleMenu">
      Sort ▼
    </button>
    <ul v-if="showMenu" class="dropdown-menu">
      <li @click="sort('title')">By Title</li>
      <li @click="sort('year')">By Year</li>
      <li @click="sort('rating')">By Rating</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['sort'])

const showMenu = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function sort(option: string) {
  emit('sort', option)
  showMenu.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})


function reset() {
  showMenu.value = false
  emit('sort', '')
}

defineExpose({ reset })
</script>

<style scoped>
.filter-button {
  padding: 6px 14px;
  height: 38px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: #f5f5f5;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.filter-button:hover {
  background-color: #eaeaea;
}

.sort-dropdown {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  top: 110%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0;
  margin: 0;
  list-style: none;
  min-width: 120px;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.dropdown-menu li {
  padding: 8px 12px;
  cursor: pointer;
}
.dropdown-menu li:hover {
  background-color: #f0f0f0;
}
</style>
