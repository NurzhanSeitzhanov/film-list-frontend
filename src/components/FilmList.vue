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
    <button class="grid-button" @click="saveFilm">{{ editingFilmId !== null ? 'Update Film' : 'Add Film' }}</button>
  </div>

  <div v-if="editingFilmId !== null" class="edit-indicator">
    Editing film: {{ currentEditingTitle }}
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
      <div class="grid-cell">
        <div class="button-group">
          <button class="edit-btn" @click="startEdit(film)">Edit</button>
          <button class="delete-btn" @click="removeFilm(film.id)">Delete</button>
        </div>
      </div>
    </template>
  </div>

  <div v-else class="no-films">No films yet!</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios'

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

const editingFilmId = ref<number | null>(null)
const currentEditingTitle = ref('')

async function loadFilms() {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  const endpoint = baseUrl + '/movies'

  try {
    const response = await axios.get<Film[]>(endpoint)
    films.value = response.data
  } catch (error) {
    console.error('Error loading films:', error)
  }
}

async function saveFilm() {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  const isEditing = editingFilmId.value !== null
  const endpoint = isEditing
    ? `${baseUrl}/movies/${editingFilmId.value}`
    : `${baseUrl}/movies`

  const newFilm: Film = {
    title: titleField.value,
    year: yearField.value ?? 0,
    genre: genreField.value,
    rating: ratingField.value ?? 0,
    watched: watchedField.value,
    favorite: favoriteField.value
  }

  try {
    const response = isEditing
      ? await axios.put<Film>(endpoint, newFilm)
      : await axios.post<Film>(endpoint, newFilm)

    const savedFilm = response.data

    if (isEditing) {
      const index = films.value.findIndex(f => f.id === editingFilmId.value)
      if (index !== -1) films.value[index] = savedFilm
      editingFilmId.value = null
      currentEditingTitle.value = ''
    } else {
      films.value.push(savedFilm)
    }

    // Reset form
    titleField.value = ''
    yearField.value = null
    genreField.value = ''
    ratingField.value = null
    watchedField.value = false
    favoriteField.value = false
  } catch (error) {
    console.error('Error saving film:', error)
  }
}

function startEdit(film: Film) {
  titleField.value = film.title
  yearField.value = film.year
  genreField.value = film.genre
  ratingField.value = film.rating
  watchedField.value = film.watched
  favoriteField.value = film.favorite
  editingFilmId.value = film.id ?? null
  currentEditingTitle.value = film.title
}

async function removeFilm(id?: number) {
  if (id == null) return
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  const endpoint = `${baseUrl}/movies/${id}`

  try {
    await axios.delete(endpoint)
    films.value = films.value.filter(f => f.id !== id)
  } catch (error) {
    console.error('Error deleting film:', error)
  }
}

onMounted(() => {
  loadFilms()
})

defineExpose({
  titleField,
  yearField,
  genreField,
  ratingField,
  watchedField,
  favoriteField,
  editingFilmId,
  currentEditingTitle,
  films,
  startEdit,
  saveFilm,
  removeFilm
})

</script>


<style scoped>
h2 {
  text-align: center;
  margin: 2rem 0 1rem;
  font-size: 2rem;
  color: #222;
}

.edit-indicator {
  text-align: center;
  color: #888;
  font-style: italic;
  margin-bottom: 1rem;
}

/* Define as grid + wider last column for buttons */
.grid-labels,
.grid-data {
  display: grid;
  grid-template-columns: repeat(6, 1fr) minmax(140px, 1.5fr);
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

/* Column headers */
.grid-labels {
  font-weight: 600;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 10px;
}

/* Film row styling */
.grid-data {
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

/* Input row at top */
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

/* "Add/Update Film" button */
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

/* Action buttons layout */
.button-group {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.button-group button {
  min-width: 64px;
}

/* Edit button */
.edit-btn {
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}
.edit-btn:hover {
  background-color: #0056b3;
}

/* Delete button */
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

/* "No films yet" fallback */
.no-films {
  text-align: center;
  color: #666;
  font-style: italic;
  margin-top: 2rem;
  font-size: 1.1rem;
}
</style>
