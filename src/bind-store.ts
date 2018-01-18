import Vue, { VueConstructor, ComponentOptions } from 'vue'
import { merge, mapValues } from './utils'

export interface Class<Instance> {
  new (...args: any[]): Instance
}

export type MutationMethod<P> = (payload: P) => void
export type ActionMethod<P> = (payload: P) => Promise<any>

export interface StoreBinder<Instance extends Vue, State, Getters, Mutations, Actions> {
  create(): Class<Instance> & typeof Vue

  state<Key extends keyof State>(map: Key[]): StoreBinder<Instance & { [K in Key]: State[K] }, State, Getters, Mutations, Actions>
  state<Map extends Record<string, keyof State>>(map: Map): StoreBinder<Instance & { [K in keyof Map]: State[Map[K]] }, State, Getters, Mutations, Actions>

  getters<Key extends keyof Getters>(map: Key[]): StoreBinder<Instance & { [K in Key]: Getters[K] }, State, Getters, Mutations, Actions>
  getters<Map extends Record<string, keyof Getters>>(map: Map): StoreBinder<Instance & { [K in keyof Map]: Getters[Map[K]] }, State, Getters, Mutations, Actions>
}

export function bindStore<State, Getters, Mutations, Actions>(namespace?: string): StoreBinder<Vue, State, Getters, Mutations, Actions> {
  return createBinder({})
}

function createBinder(options: ComponentOptions<Vue>): StoreBinder<Vue, {}, {}, {}, {}> {
  return {
    state(map: string[] | Record<string, string>) {
      const computed = merge(
        options.computed || {},
        mapPoly(map, value => makeComputed(value, 'state'))
      )

      const newOptions = merge(options, { computed })

      return createBinder(newOptions)
    },

    getters(map: string[] | Record<string, string>) {
      const computed = merge(
        options.computed || {},
        mapPoly(map, value => makeComputed(value, 'getters'))
      )

      const newOptions = merge(options, { computed })

      return createBinder(newOptions)
    },

    create() {
      return Vue.extend(options)
    }
  }
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
