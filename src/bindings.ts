import Vue from 'vue'
import { createDecorator } from 'vue-class-component'
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations,
  Dictionary
} from 'vuex'

export type VuexDecorator = <V extends Vue> (proto: V, key: string) => void

export type StateTransformer = (state: any, getters: any) => any

export type MapHelper = typeof mapState | typeof mapGetters
  | typeof mapActions | typeof mapMutations

export interface BindingOptions {
  namespace?: string,
  args?: any[]
}

export interface BindingHelper {
  <V extends Vue> (proto: V, key: string): void
  (type: string, options?: BindingOptions): VuexDecorator
}

export interface StateBindingHelper extends BindingHelper {
  (type: StateTransformer, options?: BindingOptions): VuexDecorator
}

export interface BindingHelpers {
  State: StateBindingHelper
  Getter: BindingHelper
  Mutation: BindingHelper
  Action: BindingHelper
}

export const State = createBindingHelper('computed', mapState) as StateBindingHelper


const curriedMapGetters = <R>(args: any[]) => {

  function map(map: string[]): Dictionary<R>
  function map(map: Dictionary<string>): Dictionary<R>
  function map(namespace: string, map: string[]): Dictionary<R>
  function map(namespace: string, map: Dictionary<string>): Dictionary<R>
  function map(...mapArgs: any[]): Dictionary<R> {


    const mappedGetters = (mapGetters as any)(...mapArgs)

    const entries: ([string, any])[] = Object.keys(mappedGetters).map(k => ([k, mappedGetters[k]]))

    return entries.reduce(
        (acc, [getter, fn]) => ({
        ...acc,
        [getter]: (state: any) =>
            fn.call(state)(...(Array.isArray(args) ? args : [args]))
        }),
        {}
    )
  }

  return map
}

export const Getter = createBindingHelper('computed', mapGetters, curriedMapGetters)

export const Action = createBindingHelper('methods', mapActions)

export const Mutation = createBindingHelper('methods', mapMutations)

export function namespace (namespace: string): BindingHelpers
export function namespace <T extends BindingHelper> (
  namespace: string,
  helper: T
): T
export function namespace <T extends BindingHelper> (
  namespace: string,
  helper?: T
): any {
  function createNamespacedHelper (helper: T): T {
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

  if (helper) {
    console.warn('[vuex-class] passing the 2nd argument to `namespace` function is deprecated. pass only namespace string instead.')
    return createNamespacedHelper(helper)
  }

  return {
    State: createNamespacedHelper(State as any),
    Getter: createNamespacedHelper(createBindingHelper('computed', mapGetters, curriedMapGetters) as any),
    Mutation: createNamespacedHelper(Mutation as any),
    Action: createNamespacedHelper(Action as any)
  }
}

function createBindingHelper (
  bindTo: 'computed' | 'methods',
  mapFn: MapHelper,
  curriedMapFn?: (...args: any[]) => MapHelper
): BindingHelper {
  function makeDecorator (map: any, namespace: string | undefined, args: any[] = []) {
    return createDecorator((componentOptions, key) => {
      if (!componentOptions[bindTo]) {
        componentOptions[bindTo] = {}
      }

      const mapObject = { [key]: map }

      if (args.length > 0 && curriedMapFn) {
        mapFn = curriedMapFn(args)
      }

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
    const args = extractArgs(b)
    const type = a
    return makeDecorator(type, namespace, args)
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

function extractArgs(options: BindingOptions | undefined): any[] {
  const args = options && options.args

  if (args != null) {
    return args
  }

  return []
}

function merge <T, U> (a: T, b: U): T & U {
  const res: any = {}
  ;[a, b].forEach((obj: any) => {
    Object.keys(obj).forEach(key => {
      res[key] = obj[key]
    })
  })
  return res
}
