import assert = require('power-assert')
import sinon = require('sinon')
import Vue from 'vue'
import Vuex from 'vuex'
import Component from 'vue-class-component'
import {
  State,
  Getter,
  Action,
  Mutation,
  namespace,
  BindingHelpers
} from '../src/bindings'

Vue.config.productionTip = false
Vue.config.devtools = false

describe('binding helpers', () => {
  Vue.use(Vuex)

  it('State: type', () => {
    const store = new Vuex.Store({
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
    const store = new Vuex.Store({
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

  it('State: implicit state name', () => {
    const store = new Vuex.Store({
      state: { value: 1 }
    })

    @Component
    class MyComp extends Vue {
      @State value: number
    }

    const c = new MyComp({ store })
    assert(c.value === 1)
  })

  it('State: namespace', () => {
    type ComplexNumber = {
      real: number
      imaginary: number
    }

    type FooState = ComplexNumber

    const store = new Vuex.Store({
      modules: {
        foo: {
          namespaced: true,
          state: {
            real: 1,
            imaginary: 2
          } as FooState
        }
      }
    })

    const foo = namespace<BindingHelpers<FooState, any>>('foo')

    @Component
    class MyComp extends Vue {
      @foo.State('real')
      bar: number

      @foo.State real: number

      @foo.State((state) => {
        return {
          real: -state.real,
          imaginary: -state.imaginary
        }
      })
      negative: ComplexNumber
    }

    const c = new MyComp({ store })
    assert(c.bar === 1)
    assert(c.real === 1)
    assert(c.negative.real === -1)
    assert(c.negative.imaginary === -2)
  })

  it('Getter: type', () => {
    const store = new Vuex.Store({
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

  it('Getter: implicit getter type', () => {
    const store = new Vuex.Store({
      state: { value: 1 },
      getters: {
        foo: state => state.value + 1
      }
    })

    @Component
    class MyComp extends Vue {
      @Getter foo: number
    }

    const c = new MyComp({ store })
    assert(c.foo === 2)
  })

  it('Getter: namespace', () => {
    const store = new Vuex.Store({
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

    const foo = namespace('foo')

    @Component
    class MyComp extends Vue {
      @foo.Getter('bar')
      baz: number

      @foo.Getter bar: number
    }

    const c = new MyComp({ store })
    assert(c.baz === 2)
    assert(c.bar === 2)
  })

  it('Action: type', () => {
    const spy = sinon.spy()

    const store = new Vuex.Store({
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

  it('Action: implicity action type', () => {
    const spy = sinon.spy()

    const store = new Vuex.Store({
      actions: {
        foo: spy
      }
    })

    @Component
    class MyComp extends Vue {
      @Action foo: () => void
    }

    const c = new MyComp({ store })
    c.foo()
    assert(spy.called)
  })

  it('Action: namespace', () => {
    const spy = sinon.spy()

    const store = new Vuex.Store({
      modules: {
        foo: {
          namespaced: true,
          actions: {
            bar: spy
          }
        }
      }
    })

    const foo = namespace('foo')

    @Component
    class MyComp extends Vue {
      @foo.Action('bar')
      baz: (payload: { value: number }) => void

      @foo.Action
      bar: (payload: { value: number }) => void
    }

    const c = new MyComp({ store })
    c.baz({ value: 1 })
    assert.deepStrictEqual(spy.getCall(0).args[1], { value: 1 })
    c.bar({ value: 2 })
    assert.deepStrictEqual(spy.getCall(1).args[1], { value: 2 })
  })

  it('Mutation: type', () => {
    const spy = sinon.spy()

    const store = new Vuex.Store({
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

  it('Mutation: implicit mutation type', () => {
    const spy = sinon.spy()

    const store = new Vuex.Store({
      mutations: {
        foo: spy
      }
    })

    @Component
    class MyComp extends Vue {
      @Mutation foo: () => void
    }

    const c = new MyComp({ store })
    c.foo()
    assert(spy.called)
  })

  it('Mutation: namespace', () => {
    const spy = sinon.spy()

    const store = new Vuex.Store({
      modules: {
        foo: {
          namespaced: true,
          mutations: {
            bar: spy
          }
        }
      }
    })

    const foo = namespace('foo')

    @Component
    class MyComp extends Vue {
      @foo.Mutation('bar')
      baz: (payload: { value: number }) => void

      @foo.Mutation
      bar: (payload: { value: number }) => void
    }

    const c = new MyComp({ store })
    c.baz({ value: 1 })
    assert.deepStrictEqual(spy.getCall(0).args[1], { value: 1 })
    c.bar({ value: 2 })
    assert.deepStrictEqual(spy.getCall(1).args[1], { value: 2 })
  })
})
