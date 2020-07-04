import { shallowMount } from '@vue/test-utils'
import Root from '@/views/Root.vue'

describe('views/Root.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Root)
  })

  it('init', () => {
    expect(wrapper).toBeTruthy()
  })
})
