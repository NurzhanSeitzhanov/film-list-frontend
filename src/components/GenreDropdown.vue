<template>
  <div class="dropdown-container" ref="dropdownRef">
    <button class="dropdown-toggle" @click="toggleDropdown">
      {{ selectedDisplay }} <span class="arrow">&#9662;</span>
    </button>

    <div v-if="isOpen" class="dropdown-menu">
      <label v-for="option in options" :key="option" class="dropdown-option">
        <input
          type="checkbox"
          :value="option"
          :checked="modelValue.includes(option)"
          @change="toggleOption(option)"
          :disabled="isMaxSelected && !modelValue.includes(option)"
        />
        {{ option }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: string[]
  options: string[]
}>()
const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const isMaxSelected = computed(() => props.modelValue.length >= 2)

const selectedDisplay = computed(() =>
  props.modelValue.length > 0 ? props.modelValue.join(', ') : 'Select genres'
)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function toggleOption(option: string) {
  const selected = [...props.modelValue]
  const index = selected.indexOf(option)

  if (index === -1) {
    if (selected.length < 2) selected.push(option)
  } else {
    selected.splice(index, 1)
  }

  emit('update:modelValue', selected)
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-container {
  position: relative;
  width: 100%;
}
.dropdown-toggle {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  font-size: 0.95rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #555;
  box-sizing: border-box;
}
.arrow {
  font-size: 0.75rem;
  margin-left: 8px;
}
.dropdown-menu {
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background: white;
  z-index: 999;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  max-height: 180px;
  overflow-y: auto;
}
.dropdown-option {
  display: flex;
  align-items: center;
  padding: 5px;
  font-size: 0.95rem;
  cursor: pointer;
}
.dropdown-option:hover {
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>
