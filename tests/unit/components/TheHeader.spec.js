import { shallowMount } from '@vue/test-utils'
import TheHeader from '@/components/TheHeader.vue'

describe('components/TheHeader.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(TheHeader)
  })

  it('init', () => {
    expect(wrapper).toBeTruthy()
  })
})
