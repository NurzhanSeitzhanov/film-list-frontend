<template>
  <h2>{{ title }}</h2>

  <!-- Input row -->
  <div class="grid-header">
    <input class="grid-input" v-model="titleField" placeholder="Title" type="text" />
    <input class="grid-input" v-model.number="yearField" placeholder="Year" type="number" />
    <input class="grid-input" v-model="genreField" placeholder="Genre" type="text" />
    <input class="grid-input" v-model.number="ratingField" placeholder="Rating (0-10)" type="number" step="0.1" min="0" max="10" />
    <label class="grid-checkbox"><input type="checkbox" v-model="watchedField" /> Watched</label>
    <label class="grid-checkbox"><input type="checkbox" v-model="favoriteField" /> Favorite</label>
    <button class="grid-button" @click="saveFilm">Add Film</button>
  </div>

  <!-- Column labels -->
  <div v-if="films.length" class="grid-labels">
    <div>Title</div>
    <div>Year</div>
    <div>Genre</div>
    <div>Rating</div>
    <div>Watched</div>
    <div>Favorite</div>
    <div>Action</div>
  </div>

  <!-- Film rows -->
  <div v-if="films.length" class="grid-data">
    <template v-for="film in films" :key="film.id">
      <div class="grid-cell">{{ film.title }}</div>
      <div class="grid-cell">{{ film.year }}</div>
      <div class="grid-cell">{{ film.genre }}</div>
      <div class="grid-cell">{{ film.rating.toFixed(1) }}</div>
      <div class="grid-cell">{{ film.watched ? 'Yes' : 'No' }}</div>
      <div class="grid-cell">{{ film.favorite ? 'Yes' : 'No' }}</div>
      <div class="grid-cell"><button class="delete-btn" @click="removeFilm(film.id)">Delete</button></div>
    </template>
  </div>

  <div v-else class="no-films">No films yet!</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'

defineProps<{ title: string }>()

type Film = {
  id?: number
  title: string
  year: number
  genre: string
  rating: number
  watched: boolean
  favorite: boolean
}

const films: Ref<Film[]> = ref([])

const titleField = ref('')
const yearField = ref<number | null>(null)
const genreField = ref('')
const ratingField = ref<number | null>(null)
const watchedField = ref(false)
const favoriteField = ref(false)

function loadFilms() {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  const endpoint = baseUrl + '/movies'

  fetch(endpoint, { method: 'GET' })
    .then(response => response.json())
    .then((result: Film[]) => {
      films.value = result
    })
    .catch(error => console.error('Error loading films:', error))
}

function saveFilm() {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  const endpoint = baseUrl + '/movies'

  const newFilm: Film = {
    title: titleField.value,
    year: yearField.value ?? 0,
    genre: genreField.value,
    rating: ratingField.value ?? 0,
    watched: watchedField.value,
    favorite: favoriteField.value
  }

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newFilm)
  })
    .then(response => response.json())
    .then((savedFilm: Film) => {
      films.value.push(savedFilm)
      // Reset form
      titleField.value = ''
      yearField.value = null
      genreField.value = ''
      ratingField.value = null
      watchedField.value = false
      favoriteField.value = false
    })
    .catch(error => console.error('Error saving film:', error))
}

function removeFilm(id?: number) {
  if (id == null) return
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  const endpoint = `${baseUrl}/movies/${id}`

  fetch(endpoint, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to delete film')
      films.value = films.value.filter(f => f.id !== id)
    })
    .catch(error => console.error('Error deleting film:', error))
}

// Auto-load films on component mount
onMounted(() => {
  loadFilms()
})
</script>



<style scoped>
h2 {
  text-align: center;
  margin: 2rem 0 1rem;
  font-size: 2rem;
  color: #222;
}

.grid-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 12px;
  margin: 0 auto 1.5rem;
  max-width: 1200px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.grid-labels {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-weight: 600;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 10px;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.grid-data {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  padding: 10px 0;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.grid-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.95rem;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.grid-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  font-size: 0.95rem;
}

.grid-cell {
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;
  text-align: center;
  font-size: 0.95rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.grid-button {
  padding: 10px 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.2s ease;
}
.grid-button:hover {
  background-color: #0056b3;
}

.delete-btn {
  padding: 8px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}
.delete-btn:hover {
  background-color: #b52b3d;
}

.no-films {
  text-align: center;
  color: #666;
  font-style: italic;
  margin-top: 2rem;
  font-size: 1.1rem;
}

</style>
