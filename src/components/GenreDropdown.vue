<template>
  <div class="dropdown-container" ref="dropdownRef">
    <button class="dropdown-toggle" @click="toggleDropdown">
      Select genres <span class="arrow">&#9662;</span>
    </button>

    <div v-if="isOpen" class="dropdown-menu">
      <div v-for="option in options" :key="option" class="dropdown-option">
        <label>
          <input
            type="checkbox"
            :value="option"
            v-model="localSelected"
            :disabled="isDisabled(option)"
          />
          {{ option }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: string[] // prop from parent
  options: string[]
}>()

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const localSelected = ref<string[]>([])

watch(() => props.modelValue, (val) => {
  // Clone the array to avoid direct mutation
  localSelected.value = Array.isArray(val) ? [...val] : []
}, { immediate: true })

watch(localSelected, (val) => {
  emit('update:modelValue', [...val])
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function isDisabled(option: string) {
  return !localSelected.value.includes(option) && localSelected.value.length >= 2
}

const dropdownRef = ref<HTMLElement | null>(null)

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
  padding: 5px;
  font-size: 0.95rem;
  cursor: pointer;
}

.dropdown-option:hover {
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>
