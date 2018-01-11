import Vue, { VueConstructor, ComponentOptions } from 'vue'
import { mapValues } from './utils'

export interface Class<Instance> {
  new (...args: any[]): Instance
}

export type MutationMethod<P> = (payload: P) => void
export type ActionMethod<P> = (payload: P) => Promise<any>

export interface BoundClass<Instance extends Vue, State, Getters, Mutations, Actions> extends VueConstructor {
  state<Key extends keyof State>(map: Key[]): this & Class<{ [K in Key]: State[K] }>
  state<Map extends Record<string, keyof State>>(map: Map): this & Class<{ [K in keyof Map]: State[Map[K]] }>
}

export function bindStore<State, Getters, Mutations, Actions>(namespace?: string): BoundClass<Vue, State, Getters, Mutations, Actions> {
  const BoundClass: BoundClass<Vue, State, Getters, Mutations, Actions> & { options: ComponentOptions<never> } = Vue.extend() as any

  BoundClass.state = function state(map: string[] | Record<string, string>) {
    BoundClass.options.computed = mapPoly(map, value => {
      return makeComputed(value, 'state')
    })
    return BoundClass
  }

  return BoundClass
}

function mapPoly<R>(
  map: string[] | Record<string, string>,
  fn: (value: string, key: string) => R
): Record<string, R> {
  if (Array.isArray(map)) {
    map = map.reduce<Record<string, string>>((acc, value) => {
      acc[value] = value
      return acc
    }, {})
  }

  return mapValues(map, fn)
}

function makeComputed(key: string, type: 'state' | 'getters'): () => any {
  return function boundComputed (this: Vue): any {
    return this.$store[type][key]
  }
}
