import * as Vue from 'vue'
import { createDecorator } from 'vue-class-component'
import {
  mapState
} from 'vuex'

export type StateTransformer = (state: any, getters: any) => any

export interface BindingOptions {
  namespace?: string
}

export interface BindingHelper {
  (type: string, options?: BindingOptions): PropertyDecorator
}

export interface StateBindingHelper extends BindingHelper {
  (type: StateTransformer, options?: BindingOptions): PropertyDecorator
}

export const State: StateBindingHelper = (
  value: any,
  options?: BindingOptions
): PropertyDecorator => {
  const namespace = options && options.namespace

  return createDecorator((componentOptions, key) => {
    if (!componentOptions.computed) {
      componentOptions.computed = {}
    }

    const mapObject = { [key]: value }

    componentOptions.computed[key] = namespace !== undefined
      ? mapState(namespace, mapObject)[key]
      : mapState(mapObject)[key]
  })
}

export const Getter = createBindingHelper('computed', type => {
  return function () {
    return this.$store.getters[type]
  }
})

export const Action = createBindingHelper('methods', type => {
  return function (payload: any) {
    return this.$store.dispatch(type, payload)
  }
})

export const Mutation = createBindingHelper('methods', type => {
  return function (payload: any) {
    return this.$store.commit(type, payload)
  }
})

export function namespace <T extends BindingHelper> (
  namespace: string,
  helper: T
): (type: string) => PropertyDecorator {
  return (typeOrFn: any) => {
    return helper(typeOrFn, { namespace })
  }
}

function createBindingHelper (
  bindTo: 'computed' | 'methods',
  fn: (type: string) => (this: Vue, ...args: any[]) => any
): BindingHelper {
  return (type, options?) => {
    const namespace = extractNamespace(options)

    return createDecorator((componentOptions, key) => {
      if (!componentOptions[bindTo]) {
        componentOptions[bindTo] = {}
      }
      componentOptions[bindTo]![key] = fn(namespace + type)
    })
  }
}

function extractNamespace (options: BindingOptions | undefined): string {
  const n = options && options.namespace

  if (typeof n !== 'string') {
    return ''
  }

  if (n[n.length - 1] !== '/') {
    return n + '/'
  }

  return n
}
