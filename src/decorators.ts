import Vue from 'vue'
import { createDecorator } from 'vue-class-component'
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex'
import { merge } from './utils'

export type VuexDecorator = <V extends Vue> (proto: V, key: string) => void

export type StateTransformer = (state: any, getters: any) => any

export interface MapHelper {
  (map: string[] | Record<string, string>): Record<string, any>
  (namespace: string, map: string[] | Record<string, string>): Record<string, any>
}

export interface BindingOptions {
  namespace?: string
}

export interface BindingHelper {
  <V extends Vue> (proto: V, key: string): void
  (type: string, options?: BindingOptions): VuexDecorator
}

export interface StateBindingHelper extends BindingHelper {
  (type: StateTransformer, options?: BindingOptions): VuexDecorator
}

export const State = createBindingHelper('computed', mapState) as StateBindingHelper

export const Getter = createBindingHelper('computed', mapGetters)

export const Action = createBindingHelper('methods', mapActions)

export const Mutation = createBindingHelper('methods', mapMutations)

export function namespace <T extends BindingHelper> (
  namespace: string,
  helper: T
): T {
  // T is BindingHelper or StateBindingHelper
  function namespacedHelper (proto: Vue, key: string): void
  function namespacedHelper (type: any, options?: BindingOptions): VuexDecorator
  function namespacedHelper (a: Vue | any, b?: string | BindingOptions): VuexDecorator | void {
    if (typeof b === 'string') {
      const key: string = b
      const proto: Vue = a
      return helper(key, { namespace })(proto, key)
    }

    const type = a
    const options = merge(b || {}, { namespace })
    return helper(type, options)
  }

  return namespacedHelper as T
}

function createBindingHelper (
  bindTo: 'computed' | 'methods',
  mapFn: MapHelper
): BindingHelper {
  function makeDecorator (map: any, namespace: string | undefined) {
    return createDecorator((componentOptions, key) => {
      if (!componentOptions[bindTo]) {
        componentOptions[bindTo] = {}
      }

      const mapObject = { [key]: map }

      componentOptions[bindTo]![key] = namespace !== undefined
        ? mapFn(namespace, mapObject)[key]
        : mapFn(mapObject)[key]
    })
  }

  function helper (proto: Vue, key: string): void
  function helper (type: any, options?: BindingOptions): VuexDecorator
  function helper (a: Vue | any, b?: string | BindingOptions): VuexDecorator | void {
    if (typeof b === 'string') {
      const key: string = b
      const proto: Vue = a
      return makeDecorator(key, undefined)(proto, key)
    }

    const namespace = extractNamespace(b)
    const type = a
    return makeDecorator(type, namespace)
  }

  return helper
}

function extractNamespace (options: BindingOptions | undefined): string | undefined {
  const n = options && options.namespace

  if (typeof n !== 'string') {
    return undefined
  }

  if (n[n.length - 1] !== '/') {
    return n + '/'
  }

  return n
}
