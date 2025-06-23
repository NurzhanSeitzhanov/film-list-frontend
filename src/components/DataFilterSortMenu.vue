<template>
  <div class="header-cell">
    <div class="header-label" @click="toggleDropdown">
      {{ label }}
    </div>
    <div v-if="dropdownOpen" class="dropdown">
      <input v-model="search" class="dropdown-search" placeholder="Search..." />

      <div class="dropdown-options">
        <label v-for="option in filteredOptions" :key="option" class="dropdown-option">
          <input type="checkbox" v-model="localSelected" :value="option" />
          {{ option }}
        </label>
      </div>

      <div class="dropdown-actions">
        <button @click="apply">Apply</button>
        <button @click="reset">Reset</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  label: string;
  values: (string | number)[];
  selected: (string | number)[];
}>();

const emit = defineEmits(['update:selected']);

const dropdownOpen = ref(false);
const search = ref('');
const localSelected = ref<(string | number)[]>([...props.selected]);

const filteredOptions = computed(() =>
  props.values.filter(val =>
    val.toString().toLowerCase().includes(search.value.toLowerCase())
  )
);

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}
function apply() {
  emit('update:selected', [...localSelected.value]);
  dropdownOpen.value = false;
}

function reset() {
  localSelected.value = [];
  emit('update:selected', []);
  dropdownOpen.value = false;
}
</script>

<style scoped>

.header-cell {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-label {
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-label::after {
  content: '▼';
  font-size: 0.7rem;
  margin-left: 4px;
}


.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 250px;
  background: white;
  border: 1px solid #ccc;
  padding: 8px;
  box-sizing: border-box;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.dropdown-search {
  width: 100%;
  margin-bottom: 6px;
  padding: 4px 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.dropdown-options {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 8px;
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  height: 26px;
  padding-left: 4px;
  box-sizing: border-box;
  cursor: pointer;
  white-space: nowrap;
}

.dropdown-option input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #007bff;
  cursor: pointer;
}

.dropdown-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
}

.dropdown-actions button {
  padding: 4px 10px;
  font-size: 0.85rem;
  cursor: pointer;
}
</style>

