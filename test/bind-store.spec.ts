import * as assert from 'power-assert'
import * as td from 'testdouble'
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
    increment: td.function() as any
  },
  actions: {
    incrementAsync: td.function() as any
  }
}

describe('bindStore', () => {
  let store: Store<State>
  beforeEach(() => {
    // @ts-ignore
    store = new Store(counter)
  })

  it('binds states', () => {
    const Super = bindStore<State, Getters, Mutations, Actions>()
      .state(['count'])
      .create()

    @Component
    class Test extends Super {}

    const vm = new Test({ store })
    assert(vm.count === 0)
    store.state.count++
    assert(vm.count === 1)
  })

  it('binds state by using object mapper', () => {
    const Super = bindStore<State, Getters, Mutations, Actions>()
      .state({
        value: 'count'
      })
      .create()

    @Component
    class Test extends Super {}

    const vm = new Test({ store })
    assert(vm.value === 0)
    store.state.count++
    assert(vm.value === 1)
  })

  it('binds getters', () => {
    const Super = bindStore<State, Getters, Mutations, Actions>()
      .getters(['double'])
      .create()

    @Component
    class Test extends Super {}

    const vm = new Test({ store })
    assert(vm.double === 0)
    store.state.count++
    assert(vm.double === 2)
  })

  it('binds getters by using object mapper', () => {
    const Super = bindStore<State, Getters, Mutations, Actions>()
      .getters({
        multiply2: 'double'
      })
      .create()

    @Component
    class Test extends Super {}

    const vm = new Test({ store })
    assert(vm.multiply2 === 0)
    store.state.count++
    assert(vm.multiply2 === 2)
  })

  it('binds mutations', () => {
    const Super = bindStore<State, Getters, Mutations, Actions>()
      .mutations(['increment'])
      .create()

    @Component
    class Test extends Super {}

    const vm = new Test({ store })
    vm.increment(123)
    td.verify(counter.mutations!.increment(
      td.matchers.anything(),
      123
    ))
  })

  it('binds mutations by using object mapper', () => {
    const Super = bindStore<State, Getters, Mutations, Actions>()
      .mutations({
        plus: 'increment'
      })
      .create()

    @Component
    class Test extends Super {}

    const vm = new Test({ store })
    vm.plus(123)
    td.verify(counter.mutations!.increment(
      td.matchers.anything(),
      123
    ))
  })

  it('binds actions', () => {
    const Super = bindStore<State, Getters, Mutations, Actions>()
      .actions(['incrementAsync'])
      .create()

    @Component
    class Test extends Super {}

    const vm = new Test({ store })
    vm.incrementAsync({ delay: 100, amount: 42 })
    td.verify(counter.actions!.incrementAsync(
      td.matchers.anything(),
      { delay: 100, amount: 42 }
    ), {
      ignoreExtraArgs: true
    })
  })

  it('binds actions by using object mapper', () => {
    const Super = bindStore<State, Getters, Mutations, Actions>()
      .actions({
        delayedPlus: 'incrementAsync'
      })
      .create()

    @Component
    class Test extends Super {}

    const vm = new Test({ store })
    vm.delayedPlus({ delay: 100, amount: 42 })
    td.verify(counter.actions!.incrementAsync(
      td.matchers.anything(),
      { delay: 100, amount: 42 }
    ), {
      ignoreExtraArgs: true
    })
  })
})
