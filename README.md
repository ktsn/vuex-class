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

## Usage

### State

#### Flat state

```js
import Vue from 'vue'
import Component from 'vue-class-component'
import { State } from 'vuex-class'

@Component
export class MyComp extends Vue {
  @State('foo') stateFoo

  // If the argument is omitted, use the state property name
  @State bar

  created () {
    this.stateFoo // -> store.state.foo
    this.bar // -> store.state.bar
  }
}
```

#### Nested state

Using the dot notation to access a nested state property doesn't work.

```js
@State('state.bar') stateBar
```

Why doesn't the library support this feature?

- It's impossible to type check.
- It would provide poor error message if there is typo on property name.

You need to use a lambda function instead.

```js
import Vue from 'vue'
import Component from 'vue-class-component'
import { State } from 'vuex-class'

@Component
export class MyComp extends Vue {
  @State(state => state.bar) stateBar

  created () {
    this.stateBar // -> store.state.bar
  }
}
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

## Issue Reporting Guideline

### Questions

For general usage question which is not related to vuex-class should be posted to [StackOverflow](https://stackoverflow.com/) or other Q&A forum. Such questions will be closed without an answer.

### Bug Reports

Please make sure to provide minimal and self-contained reproduction when you report a bug. Otherwise the issue will be closed immediately.

## License

MIT
