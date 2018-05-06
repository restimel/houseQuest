import Vue from 'vue'
import Menu from '@/components/Menu'

describe('HelloWorld.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(HelloWorld)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelectorAll('.menu a').length)
      .toBe(2)
  })
})
