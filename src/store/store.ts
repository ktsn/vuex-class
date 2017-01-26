import {
  Dep,
  InputModule,
  InputModuleN,
  Module,
  ModuleN
} from './module'

declare const dep: Dep<{}, {}, {}, {}>['and']
declare const create: Dep<{}, {}, {}, {}>['create']

const m = create({
  state: {
    value: 1
  },
  getters: {
    foo: (state, getters) => state.value,
    bar: (state, getters) => getters
  },
  actions: {
    foo (ctx, payload: number) {
      const a = ctx.state.value + payload
    },

    bar (ctx, payload: { count: number }) {
      ctx.commit('baz', payload.count)
    }
  },
  mutations: {
    baz (state, p: number) {
      state.value += p
    }
  }
})

const m1 = dep(m)
  .create({
    namespaced: true,
    state: {
      test: 'test'
    },
    getters: {
      f: (state, _, __, rootGetters) => rootGetters.foo
    },
    actions: {
      g (ctx, p: string) {
        const a = ctx.getters.f
      }
    },
    mutations: {
      h (state, p: string) {
        state.test = p
      }
    }
  })
  .module('child', m)
