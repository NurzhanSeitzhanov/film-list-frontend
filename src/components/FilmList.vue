<template>
  <h2> {{ title }} </h2>

  <div class="grid-row">
    <input
      class="grid-input"
      v-model="titleField"
      placeholder="Film Title"
      type="text"
    />
    <input
      class="grid-input"
      v-model="yearField"
      placeholder="Year"
      type="text"
    />
    <input
      class="grid-input"
      v-model="genreField"
      placeholder="Genre"
      type="text"
    />
    <button class="grid-button" @click="addFilm()">Add Film</button>
  </div>


  <div v-if="films.length" class="grid-row">
    <template
      v-for="film in films" :key="film.id"
    >
      <div class="grid-cell">{{ film.title }}</div>
      <div class="grid-cell">{{ film.year }}</div>
      <div class="grid-cell">{{ film.genre }}</div>
      <button
        class="delete-btn"
        @click="removeFilm(film.id)"
      >Delete</button>
    </template>
  </div>


  <div v-else class="grid-row">
    <div class="no-films">No films yet!</div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'

defineProps<{
  title: string
}>()

type Film = { id: number; title: string; year: string; genre: string }

const films      = ref<Film[]>([])
const titleField = ref('')
const yearField  = ref('')
const genreField = ref('')
let currentId    = 1

function addFilm() {
  if (titleField.value && yearField.value && genreField.value) {
    films.value.push({
      id: currentId++,
      title: titleField.value,
      year:  yearField.value,
      genre: genreField.value
    })
    titleField.value = ''
    yearField.value  = ''
    genreField.value = ''
  }
}

function removeFilm(id: number) {
  films.value = films.value.filter(f => f.id !== id)
}
</script>

<style scoped>
h2 {
  text-align: center;
  margin: 1rem 0 0.5rem;
}


.grid-row {
  display: grid;
  grid-template-columns: repeat(4, 200px);
  gap: 10px;
  justify-content: center;
  margin: 0.5rem 0;
  align-items: center;
}

.grid-input {
  width: 100%;
  padding: 8px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}

.grid-button {
  width: 100%;
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.grid-button:hover {
  background-color: #0056b3;
}

.grid-cell {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
  border-radius: 6px;
  background: #fafafa;
}

.delete-btn {
  justify-self: end;
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.delete-btn:hover {
  background-color: #c82333;
}

.no-films {
  grid-column: 1 / -1;
  text-align: center;
  color: #666;
  font-style: italic;
}
</style>
