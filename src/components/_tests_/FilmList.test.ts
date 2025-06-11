import { shallowMount } from '@vue/test-utils'
import FilmList from '@/components/FilmList.vue'
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('FilmList.vue', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => [
        { id: 1, title: 'Inception', year: 2010, genre: 'Sci-Fi', rating: 8.8, watched: true, favorite: false },
        { id: 2, title: 'Interstellar', year: 2014, genre: 'Adventure', rating: 9.0, watched: false, favorite: true }
      ]
    })
  })

  it('should render the title and load films', async () => {
    const wrapper = shallowMount(FilmList, {
      props: { title: 'My Films' }
    })

    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toMatch('My Films')
    expect(wrapper.text()).toMatch('Inception')
    expect(wrapper.text()).toMatch('Interstellar')
  })
})
