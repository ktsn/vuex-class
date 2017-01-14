import assert = require('power-assert')
import sinon = require('sinon')
import Vue = require('vue')
import { Store, install } from 'vuex'
import Component from 'vue-class-component'
import {
  State,
  Getter,
  Action,
  Mutation,
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

  it('Getter: type', () => {
    const store = new Store({
      state: { value: 1 },
      getters: {
        foo: state => state.value + 1
      }
    })

    @Component
    class MyComp extends Vue {
      @Getter('foo')
      bar: number
    }

    const c = new MyComp({ store })
    assert(c.bar === 2)
  })

  it('Getter: namespace', () => {
    const store = new Store({
      modules: {
        foo: {
          namespaced: true,
          state: { value: 1 },
          getters: {
            bar: state => state.value + 1
          }
        }
      }
    })

    const FooGetter = namespace('foo', Getter)

    @Component
    class MyComp extends Vue {
      @FooGetter('bar')
      baz: number
    }

    const c = new MyComp({ store })
    assert(c.baz === 2)
  })

  it('Action: type', () => {
    const spy = sinon.spy()

    const store = new Store({
      actions: {
        foo: spy
      }
    })

    @Component
    class MyComp extends Vue {
      @Action('foo')
      bar: (payload: { value: number }) => void
    }

    const c = new MyComp({ store })
    c.bar({ value: 1 })
    assert.deepStrictEqual(spy.getCall(0).args[1], { value: 1 })
  })

  it('Action: namespace', () => {
    const spy = sinon.spy()

    const store = new Store({
      modules: {
        foo: {
          namespaced: true,
          actions: {
            bar: spy
          }
        }
      }
    })

    const FooAction = namespace('foo', Action)

    @Component
    class MyComp extends Vue {
      @FooAction('bar')
      baz: (payload: { value: number }) => void
    }

    const c = new MyComp({ store })
    c.baz({ value: 1 })
    assert.deepStrictEqual(spy.getCall(0).args[1], { value: 1 })
  })

  it('Mutation: type', () => {
    const spy = sinon.spy()

    const store = new Store({
      mutations: {
        foo: spy
      }
    })

    @Component
    class MyComp extends Vue {
      @Mutation('foo')
      bar: (payload: { value: number }) => void
    }

    const c = new MyComp({ store })
    c.bar({ value: 1 })
    assert.deepStrictEqual(spy.getCall(0).args[1], { value: 1 })
  })

  it('Mutation: namespace', () => {
    const spy = sinon.spy()

    const store = new Store({
      modules: {
        foo: {
          namespaced: true,
          mutations: {
            bar: spy
          }
        }
      }
    })

    const FooMutation = namespace('foo', Mutation)

    @Component
    class MyComp extends Vue {
      @FooMutation('bar')
      baz: (payload: { value: 1 }) => void
    }

    const c = new MyComp({ store })
    c.baz({ value: 1 })
    assert.deepStrictEqual(spy.getCall(0).args[1], { value: 1 })
  })
})
