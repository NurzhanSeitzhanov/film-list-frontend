<template>
  <div class="stats-grid">
    <div class="stat-card">Total Films: <strong>{{ films.length }}</strong></div>
    <div class="stat-card">Avg Rating: <strong>{{ avgRating }}</strong></div>
    <div class="stat-card">Favorites: <strong>{{ favoriteCount }}</strong></div>
    <div class="stat-card">Watched: <strong>{{ watchedCount }}</strong></div>
    <div class="stat-card">High Ratings (≥ 7): <strong>{{ highRatedCount }}</strong></div>
    <div class="stat-card">Earliest Year: <strong>{{ earliestYear }}</strong></div>
    <div class="stat-card">Latest Year: <strong>{{ latestYear }}</strong></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

type Film = {
  id?: number
  title: string
  year: number
  genre: string
  rating: number
  watched: boolean
  favorite: boolean
}

const films = ref<Film[]>([])

onMounted(async () => {
  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  try {
    const response = await axios.get<Film[]>(`${baseUrl}/movies`)
    films.value = response.data
  } catch (err) {
    console.error('Failed to load films:', err)
  }
})

const avgRating = computed(() => {
  if (!films.value.length) return '–'
  const total = films.value.reduce((sum, f) => sum + f.rating, 0)
  return (total / films.value.length).toFixed(1)
})

const favoriteCount = computed(() =>
  films.value.filter(f => f.favorite).length
)

const watchedCount = computed(() =>
  films.value.filter(f => f.watched).length
)

const highRatedCount = computed(() =>
  films.value.filter(f => f.rating >= 7).length
)

const earliestYear = computed(() => {
  const years = films.value.map(f => f.year).filter(y => y > 0)
  return years.length ? Math.min(...years) : '–'
})

const latestYear = computed(() => {
  const years = films.value.map(f => f.year).filter(y => y > 0)
  return years.length ? Math.max(...years) : '–'
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.stat-card {
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  font-size: 1.1rem;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
</style>
