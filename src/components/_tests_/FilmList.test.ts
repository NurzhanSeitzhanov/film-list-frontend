import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import FilmList from '@/components/FilmList.vue'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

describe('FilmList.vue', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render title and load films', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { id: 1, title: 'Lion King', year: 1994, genre: 'Family', rating: 9.0, watched: true, favorite: true },
        { id: 2, title: 'Matrix', year: 1999, genre: 'Action', rating: 7.5, watched: true, favorite: false }
      ]
    })

    const wrapper = shallowMount(FilmList, { props: { title: 'My Films' } })
    await flushPromises()

    expect(wrapper.text()).toContain('My Films')
    expect(wrapper.text()).toContain('Lion King')
    expect(wrapper.text()).toContain('Matrix')
  })

  it('adds a film using saveFilm', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: [] })
    mockedAxios.post = vi.fn().mockResolvedValue({
      data: {
        id: 3,
        title: 'Django Unchained',
        year: 2012,
        genre: 'Western',
        rating: 8.0,
        watched: true,
        favorite: true
      }
    })

    const wrapper = shallowMount(FilmList, {
      props: { title: 'Add Film Test' }
    })

    wrapper.vm.titleField = 'Django Unchained'
    wrapper.vm.yearField = 2012
    wrapper.vm.genreField = ['Western']
    wrapper.vm.ratingField = 8.0
    wrapper.vm.watchedField = true
    wrapper.vm.favoriteField = true

    await wrapper.vm.saveFilm()
    await wrapper.vm.$nextTick()

    expect(mockedAxios.post).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Django Unchained')
  })

  it('edits a film using saveFilm', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({
      data: [
        { id: 1, title: 'Lion King', year: 1994, genre: 'Family', rating: 8.0, watched: true, favorite: false }
      ]
    })

    mockedAxios.put = vi.fn().mockResolvedValue({
      data: {
        id: 1,
        title: 'Lion King',
        year: 1994,
        genre: 'Family',
        rating: 8.0,
        watched: true,
        favorite: false
      }
    })

    const wrapper = shallowMount(FilmList, {
      props: { title: 'Edit Test' }
    })

    await flushPromises()

    const film = wrapper.vm.films[0]
    wrapper.vm.startEdit(film)
    wrapper.vm.ratingField = 8.0
    wrapper.vm.favoriteField = false

    await wrapper.vm.saveFilm()
    await wrapper.vm.$nextTick()

    expect(mockedAxios.put).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Lion King')
  })

  it('deletes a film using removeFilm', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({
      data: [
        { id: 1, title: 'To Be Deleted', year: 2000, genre: 'Drama', rating: 7.0, watched: false, favorite: false }
      ]
    })
    mockedAxios.delete = vi.fn().mockResolvedValue({ status: 200 })

    const wrapper = shallowMount(FilmList, {
      props: { title: 'Delete Test' }
    })

    await flushPromises()

    await wrapper.vm.removeFilm(1)
    await wrapper.vm.$nextTick()

    expect(mockedAxios.delete).toHaveBeenCalled()
    expect(wrapper.text()).not.toContain('To Be Deleted')
  })
})
