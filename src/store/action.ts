import {
  ActionContext as _ActionContext,
  DispatchOptions as _DispatchOptions
} from 'vuex'

import { Commit } from './mutation'

export interface DispatchOptions <T extends boolean> extends _DispatchOptions {
  global?: T
}

export type Dispatch <A, RA> = {
  <K extends keyof A> (type: K, payload: A[K], options?: DispatchOptions<false>): Promise<any>
  <K extends keyof A> (payload: A[K] & { type: K }, options?: DispatchOptions<false>): Promise<any>
  <K extends keyof RA> (type: K, payload: RA[K], options: DispatchOptions<true>): Promise<any>
  <K extends keyof RA> (payload: RA[K] & { type: K }, options: DispatchOptions<true>): Promise<any>
}

export interface ActionContext <S, G, A, M, RG, RA, RM> extends _ActionContext<S, any> {
  dispatch: Dispatch<A, RA>
  commit: Commit<M, RM>
  rootState: any
  rootGetters: RG
}

export type AMapper <A, S, G, A1, M, RG, RA, RM> = {
  [K in keyof A]: (context: ActionContext<S, G, A1, M, RG, RA, RM>, payload: A[K]) => Promise<any> | void
} & {
  [key: string]: (context: ActionContext<S, G, A1, M, RG, RA, RM>, payload: any) => Promise<any> | void
}
