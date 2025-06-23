<template>
  <h2 @click="resetAll" class="clickable-title">{{ title }}</h2>

  <!-- Input row -->
  <div class="grid-header">
    <input class="grid-input" v-model="titleField" placeholder="Title" type="text" @input="titleError = ''" />
    <input class="grid-input" v-model.number="yearField" placeholder="Year" type="number" />
    <GenreDropdown v-model="genreField" :options="genreOptions" />
    <input class="grid-input" v-model.number="ratingField" placeholder="Rating (0-10)" type="number" step="0.1" min="0" max="10" />
    <label class="grid-checkbox"><input type="checkbox" v-model="watchedField" /> Watched</label>
    <label class="grid-checkbox"><input type="checkbox" v-model="favoriteField" /> Favorite</label>

    <div class="button-pair">
      <button class="button-primary" @click="saveFilm">
        {{ editingFilmId !== null ? 'Update Film' : 'Add Film' }}
      </button>
      <button v-if="editingFilmId === null" class="button-danger" @click="removeAllFilms">Delete All</button>
    </div>
  </div>

  <div class="edit-indicator">
    <template v-if="titleError">
      <span class="error-message">{{ titleError }}</span>
    </template>
    <template v-else-if="editingFilmId !== null">
      Editing film: {{ currentEditingTitle }}
    </template>
  </div>

  <!-- Filter buttons -->
  <FilmFilter :selected="selectedFilter" @change-filter="val => selectedFilter = val" />

  <!-- Column headers with dropdown filters -->
  <div v-if="filteredFilms.length" class="grid-labels">
    <DataFilterSortMenu
      label="Title"
      :values="Array.from(new Set(films.map(f => f.title)))"
      :selected="titleFilter"
      @update:selected="val => titleFilter = val"
    />
    <DataFilterSortMenu
      label="Year"
      :values="Array.from(new Set(films.map(f => f.year)))"
      :selected="yearFilter"
      @update:selected="val => yearFilter = val"
    />
    <DataFilterSortMenu
      label="Genre"
      :values="Array.from(new Set(films.flatMap(f => f.genre?.split(',').map(g => g.trim()) || [])))"
      :selected="genreFilter"
      @update:selected="val => genreFilter = val"
    />
    <DataFilterSortMenu
      label="Rating"
      :values="Array.from(new Set(films.map(f => f.rating)))"
      :selected="ratingFilter"
      @update:selected="val => ratingFilter = val"
    />
    <div>Watched</div>
    <div>Favorite</div>
    <div>Action</div>
  </div>

  <!-- Film rows -->
  <div v-if="filteredFilms.length" class="grid-data">
    <template v-for="film in filteredFilms" :key="film.id">
      <div class="grid-cell">{{ film.title }}</div>
      <div class="grid-cell">{{ film.year }}</div>
      <div class="grid-cell">{{ film.genre }}</div>
      <div class="grid-cell">{{ film.rating.toFixed(1) }}</div>
      <div class="grid-cell">{{ film.watched ? 'Yes' : 'No' }}</div>
      <div class="grid-cell">{{ film.favorite ? 'Yes' : 'No' }}</div>
      <div class="grid-cell">
        <div class="button-group">
          <button class="button-primary" @click="startEdit(film)">Edit</button>
          <button class="button-danger" @click="removeFilm(film.id)">Delete</button>
        </div>
      </div>
    </template>
  </div>

  <div v-else class="no-films">No films yet!</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios'
import FilmFilter from './FilmFilter.vue'
import GenreDropdown from './GenreDropdown.vue'
import genreOptions from '@/data/genres'
import DataFilterSortMenu from './DataFilterSortMenu.vue'

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

const selectedFilter = ref('all')

const films: Ref<Film[]> = ref([])

const titleField = ref('')
const yearField = ref<number | null>(null)
const genreField = ref<string[]>([])
const ratingField = ref<number | null>(null)
const watchedField = ref(false)
const favoriteField = ref(false)

const editingFilmId = ref<number | null>(null)
const currentEditingTitle = ref('')
const titleError = ref('')
const loading = ref(false)

// Filter dropdown states
const titleFilter = ref<string[]>([])
const yearFilter = ref<number[]>([])
const genreFilter = ref<string[]>([])
const ratingFilter = ref<number[]>([])

const filteredFilms = computed(() => {
  const base = selectedFilter.value === 'watched'
    ? films.value.filter(f => f.watched)
    : selectedFilter.value === 'favorite'
      ? films.value.filter(f => f.favorite)
      : films.value

  return base.filter(f =>
    (titleFilter.value.length === 0 || titleFilter.value.includes(f.title)) &&
    (yearFilter.value.length === 0 || yearFilter.value.includes(f.year)) &&
    (genreFilter.value.length === 0 ||
      (f.genre === '' && genreFilter.value.includes('')) ||
      (f.genre && f.genre.split(',').some(g => genreFilter.value.includes(g.trim())))) &&
    (ratingFilter.value.length === 0 || ratingFilter.value.includes(f.rating))
  )
})

function resetForm() {
  editingFilmId.value = null
  currentEditingTitle.value = ''
  titleField.value = ''
  yearField.value = null
  genreField.value = []
  ratingField.value = null
  watchedField.value = false
  favoriteField.value = false
  titleError.value = ''
}

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
  titleError.value = ''

  if (!titleField.value.trim()) {
    titleError.value = 'Please enter the film title'
    return
  }

  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  const isEditing = editingFilmId.value !== null
  const endpoint = isEditing
    ? `${baseUrl}/movies/${editingFilmId.value}`
    : `${baseUrl}/movies`

  const newFilm: Film = {
    title: titleField.value.trim(),
    year: yearField.value ?? 0,
    genre: genreField.value.join(', '),
    rating: ratingField.value ?? 0,
    watched: watchedField.value,
    favorite: favoriteField.value
  }

  try {
    loading.value = true

    const response = isEditing
      ? await axios.put<Film>(endpoint, newFilm)
      : await axios.post<Film>(endpoint, newFilm)

    const savedFilm = response.data

    if (isEditing) {
      const index = films.value.findIndex(f => f.id === editingFilmId.value)
      if (index !== -1) films.value[index] = savedFilm
      editingFilmId.value = null
    } else {
      films.value.push(savedFilm)
    }

    resetForm()
  } catch (error) {
    console.error('Error saving film:', error)
    alert('Error saving film. Please try again.')
  } finally {
    loading.value = false
  }
}

function startEdit(film: Film) {
  titleError.value = ''
  titleField.value = film.title
  yearField.value = film.year
  genreField.value = film.genre
    .split(',')
    .map(g => g.trim())
    .filter(g => g.length > 0)
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

    if (editingFilmId.value === id) {
      resetForm()
    }
  } catch (error) {
    console.error('Error deleting film:', error)
  }
}

async function removeAllFilms() {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  const endpoint = `${baseUrl}/movies`

  try {
    await axios.delete(endpoint)
    films.value = []
    resetForm()
  } catch (error) {
    console.error('Error deleting all films:', error)
  }
}

function resetAll() {
  titleFilter.value = []
  yearFilter.value = []
  genreFilter.value = []
  ratingFilter.value = []
  selectedFilter.value = 'all'
  resetForm()
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

.grid-labels,
.grid-data {
  display: grid;
  grid-template-columns: repeat(6, 1fr) minmax(140px, 1.5fr);
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.grid-labels {
  font-weight: 600;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 10px;
}

.grid-data {
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
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

/* Unified Button Styles */
.button-primary,
.button-danger {
  padding: 8px 18px;
  font-size: 0.95rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: white;
  min-width: 100px;
  white-space: nowrap;
}

.button-primary {
  background-color: #007bff;
}
.button-primary:hover {
  background-color: #0056b3;
}

.button-danger {
  background-color: #dc3545;
}
.button-danger:hover {
  background-color: #b52b3d;
}

/* Button Layouts */
.button-group {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.button-pair {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.no-films {
  text-align: center;
  color: #666;
  font-style: italic;
  margin-top: 2rem;
  font-size: 1.1rem;
}

.error-message {
  color: red;
  text-align: center;
  font-weight: bold;
}

.clickable-title {
  cursor: pointer;
  text-align: center;
  margin: 2rem 0 1rem;
  font-size: 2rem;
  color: #222;
  transition: color 0.2s ease;
}

.clickable-title:hover {
  color: #007bff;
}

</style>
