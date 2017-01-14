import assert = require('power-assert')
import Vue = require('vue')
import { Store, install } from 'vuex'
import Component from 'vue-class-component'
import {
  State,
  namespace
} from '../src/bindings'

describe('binding helpers', () => {
  Vue.use(install)

  it('State: type', () => {
    const store = new Store({
      state: { value: 1 }
    })

    @Component
    class MyComp extends Vue {
      @State('value')
      foo: number
    }

    assert(new MyComp({ store }).foo === 1)
  })

  it('State: function', () => {
    const store = new Store({
      state: { value: 1 }
    })

    @Component
    class MyComp extends Vue {
      @State((state: { value: number }) => {
        return state.value + 10
      })
      foo: number
    }

    assert(new MyComp({ store }).foo === 11)
  })

  it('State: namespace', () => {
    const store = new Store({
      modules: {
        foo: {
          namespaced: true,
          state: { value: 1 }
        }
      }
    })

    const FooState = namespace('foo', State)

    @Component
    class MyComp extends Vue {
      @FooState('value')
      bar: number
    }

    assert(new MyComp({ store }).bar === 1)
  })
})