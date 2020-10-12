# vuex-class

[![vuex-class Dev Token](https://badge.devtoken.rocks/vuex-class)](https://devtoken.rocks/package/vuex-class)

Binding helpers for Vuex and vue-class-component

## Dependencies

- [Vue](https://github.com/vuejs/vue)
- [Vuex](https://github.com/vuejs/vuex)
- [vue-class-component](https://github.com/vuejs/vue-class-component)

## Installation

```bash
$ npm install --save vuex-class
# or
$ yarn add vuex-class
```

## Example

```js
import Vue from 'vue'
import Component from 'vue-class-component'
import {
  State,
  Getter,
  Action,
  Mutation,
  namespace
} from 'vuex-class'

const someModule = namespace('path/to/module')

@Component
export class MyComp extends Vue {
  @State('foo') stateFoo
  @State(state => state.bar) stateBar
  @Getter('foo') getterFoo
  @Action('foo') actionFoo
  @Mutation('foo') mutationFoo
  @someModule.Getter('foo') moduleGetterFoo

  // If the argument is omitted, use the property name
  // for each state/getter/action/mutation type
  @State foo
  @Getter bar
  @Action baz
  @Mutation qux

  created () {
    this.stateFoo // -> store.state.foo
    this.stateBar // -> store.state.bar
    this.getterFoo // -> store.getters.foo
    this.actionFoo({ value: true }) // -> store.dispatch('foo', { value: true })
    this.mutationFoo({ value: true }) // -> store.commit('foo', { value: true })
    this.moduleGetterFoo // -> store.getters['path/to/module/foo']
  }
}
```

### Curried Getters

You might have a getter that returns a curried function in order to pass in parameters to your getter. E.g.:

```ts
const store = {
  state: {
    values: [
      { id: 1, value: "value 1" },
      { id: 2, value: "value 2" }
    ]
  },
  getters: {
    byId: state => id => state.values.filter(v => v.id === id)[0].value
  }
}

```

You could bind this getter to a function on your component class:

```ts
import Vue from 'vue'
import Component from 'vue-class-component'
import {
  Getter
} from 'vuex-class'


@Component
export class MyComp extends Vue {

  @Getter("byId") byId: (id: number) => string;
}
```

But you might have a static value that you want to bind to. In which case you can pass this to the args property of the binding options object:

```ts
import Vue from 'vue'
import Component from 'vue-class-component'
import {
  Getter
} from 'vuex-class'


@Component
export class MyComp extends Vue {

  @Getter("byId", { args: [1] }) value: string;
}
```

You might want to encapsulate this into your own decorator so you can strongly type the arguments:

```ts
import Vue from 'vue'
import Component from 'vue-class-component'
import {
  Getter
} from 'vuex-class'

const ByIdGetter = (id: number) => @Getter("byId", { args: [id] })

@Component
export class MyComp extends Vue {

  @ByIdGetter(1) byId: (id: number) => string;
}
```

## Issue Reporting Guideline

### Questions

For general usage question which is not related to vuex-class should be posted to [StackOverflow](https://stackoverflow.com/) or other Q&A forum. Such questions will be closed without an answer.

### Bug Reports

Please make sure to provide minimal and self-contained reproduction when you report a bug. Otherwise the issue will be closed immediately.

## License

MIT
