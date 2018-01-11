import * as assert from 'power-assert'
import Component from 'vue-class-component'
import { Store, DefineModule } from 'vuex'
import { bindStore } from '../src/bind-store'

interface State {
  count: number
}

interface Getters {
  double: number
}

interface Mutations {
  increment: number
}

interface Actions {
  incrementAsync: {
    delay: number
    amount: number
  }
}

const counter: DefineModule<State, Getters, Mutations, Actions> = {
  state: () => ({
    count: 0
  }),
  getters: {
    double: state => state.count * 2
  },
  mutations: {
    increment (state, n) {
      state.count += n
    }
  },
  actions: {
    incrementAsync ({ commit }, { delay, amount }) {
      setTimeout(() => {
        commit('increment', amount)
      }, delay)
    }
  }
}

describe('bindStore', () => {
  let store: Store<State>
  beforeEach(() => {
    // @ts-ignore
    store = new Store(counter)
  })

  it('binds states', () => {
    const Super = bindStore<State, Getters, Mutations, Actions>().state(['count'])

    @Component
    class Test extends Super {}

    const vm = new Test({ store })
    assert(vm.count === 0)
    store.state.count++
    assert(vm.count === 1)
  })

  it('binds state by using object mapper', () => {
    const Super = bindStore<State, Getters, Mutations, Actions>().state({
      value: 'count'
    })

    @Component
    class Test extends Super {}

    const vm = new Test({ store })
    assert(vm.value === 0)
    store.state.count++
    assert(vm.value === 1)
  })
})
