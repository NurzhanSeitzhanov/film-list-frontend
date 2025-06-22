import { mount, flushPromises } from '@vue/test-utils'
import FilmStats from '@/components/FilmStats.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('axios')

const mockFilms = [
  { id: 1, title: 'A', genre: 'Action', rating: 7, year: 2000, watched: true, favorite: false },
  { id: 2, title: 'B', genre: 'Comedy, Romance', rating: 6.5, year: 2010, watched: false, favorite: true },
  { id: 3, title: 'C', genre: 'Fantasy', rating: 0, year: 1990, watched: true, favorite: true },
]

describe('FilmStats.vue', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('loads and displays correct statistics', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockFilms })

    const wrapper = mount(FilmStats)
    await new Promise(resolve => setTimeout(resolve))

    expect(wrapper.text()).toContain('Total Films')
    expect(wrapper.text()).toContain('3')
    expect(wrapper.text()).toContain('Avg Rating')
    expect(wrapper.text()).toContain('6.8') // Excludes 0
    expect(wrapper.text()).toContain('Highest Rated Film')
    expect(wrapper.text()).toContain('A')
    expect(wrapper.text()).toContain('Favorites')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('Top Genres')

    const genreList = wrapper.findAll('.genre-list li').map(li => li.text())
    expect(genreList).toContain('Action (1)')
    expect(genreList).toContain('Comedy (1)')
    expect(genreList).toContain('Romance (1)')
    expect(genreList).toContain('Fantasy (1)')
  })


  it('does not show genres when none exist', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: [{ id: 1, title: 'X', genre: '', rating: 5, year: 2005, watched: true, favorite: false }]
    })

    const wrapper = mount(FilmStats)
    await flushPromises()

    expect(wrapper.text()).not.toContain('Top Genres')
  })
})
