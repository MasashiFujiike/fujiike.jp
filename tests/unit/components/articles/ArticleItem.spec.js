import { shallowMount } from '@vue/test-utils'
import ArticleItem from '@/components/articles/ArticleItem.vue'

describe('components/articles/ArticleItem.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ArticleItem)
  })

  it('init', () => {
    expect(wrapper).toBeTruthy()
  })
})
