<template>
  <div class="page-container">
    <div class="card-grid">
      <div class="card" v-for="stat in stats" :key="stat.label">
        <div class="icon">{{ stat.icon }}</div>
        <div class="label">{{ stat.label }}</div>
        <div class="value">{{ stat.value }}</div>
      </div>
    </div>

    <div v-if="Object.keys(topGenres).length" class="card genre-card">
      <div class="label">🍿 Top Genres</div>
      <ul class="genre-list">
        <li v-for="(count, genre) in topGenres" :key="genre">
          {{ genre }} ({{ count }})
        </li>
      </ul>
    </div>
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

const validFilms = computed(() => films.value.filter(f => f.rating > 0))

const avgRating = computed(() => {
  if (!validFilms.value.length) return '–'
  const total = validFilms.value.reduce((sum, f) => sum + f.rating, 0)
  return (total / validFilms.value.length).toFixed(1)
})

const favoriteCount = computed(() => films.value.filter(f => f.favorite).length)
const highRatedCount = computed(() => films.value.filter(f => f.rating >= 7.0).length)

const highestRatedFilm = computed(() => {
  const highest = validFilms.value.reduce((a, b) => (a.rating > b.rating ? a : b), { title: '–', rating: -1 } as Film)
  return highest.title || '–'
})

const lowestRatedFilm = computed(() => {
  const lowest = validFilms.value.reduce((a, b) => (a.rating < b.rating ? a : b), { title: '–', rating: 999 } as Film)
  return lowest.title || '–'
})

const earliestYear = computed(() => {
  const years = films.value.map(f => f.year).filter(y => y > 0)
  return years.length ? Math.min(...years) : '–'
})

const latestYear = computed(() => {
  const years = films.value.map(f => f.year).filter(y => y > 0)
  return years.length ? Math.max(...years) : '–'
})

const allGenres = computed(() => films.value.flatMap(f => f.genre.split(',').map(g => g.trim())).filter(Boolean))

const topGenres = computed(() => {
  const counts: Record<string, number> = {}
  allGenres.value.forEach(g => counts[g] = (counts[g] || 0) + 1)
  return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6))
})

const stats = computed(() => [
  { label: 'Total Films', value: films.value.length, icon: '🎞️' },
  { label: 'Avg Rating', value: avgRating.value, icon: '⭐' },
  { label: 'Highest Rated Film', value: highestRatedFilm.value, icon: '🏆' },
  { label: 'Lowest Rated Film', value: lowestRatedFilm.value, icon: '📉' },
  { label: 'Favorites', value: favoriteCount.value, icon: '❤️' },
  { label: 'High Rated (≥7.0)', value: highRatedCount.value, icon: '⬆️' },
  { label: 'Earliest Year', value: earliestYear.value, icon: '📅' },
  { label: 'Latest Year', value: latestYear.value, icon: '📆' }
])
</script>

<style scoped>

.page-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
  text-align: center;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  justify-items: center;
}

.card {
  background: #ffffff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 200px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card.genre-card {
  grid-column: span 4;
  max-width: 100%;
  padding: 1.5rem 1.2rem 1rem;
  margin-top: 1rem; /* adds spacing like other cards */
}

.icon {
  font-size: 1.6rem;
  margin-bottom: 0.4rem;
}

.label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.2rem;
  font-size: 0.95rem;
  text-align: center;
}

.card.genre-card .label {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.8rem;
  color: #222;
}

.value {
  font-size: 1.3rem;
  font-weight: bold;
  color: #1a1a1a;
}

.genre-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.genre-list li {
  font-size: 0.95rem;
  background-color: #f0f0f0;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-weight: 500;
}

</style>

