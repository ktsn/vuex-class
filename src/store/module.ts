import { AMapper } from './action'
import { MMapper } from './mutation'

export type GMapper<G, S, G1, RG> = {
  [K in keyof G]: (state: S, getters: G1, rootState: any, rootGetters: RG) => G[K]
} & {
  [key: string]: (state: S, getters: G1, rootState: any, rootGetters: RG) => any
}

export interface Dep <G, A, M, C> {
  and <G1, A1, M1, C1> (m: Module<any, G1, A1, M1, C1>): Dep<G & G1, A & A1, M & M1, C & C1>
  create <S, G1, A1, M1> (im: InputModule<S, G1, A1, M1, G, A, M>): Module<S, G1, A1, M1, {}>
  create <S, G1, A1, M1> (im: InputModuleN<S, G1, A1, M1, {}, {}, {}, G, A, M>): ModuleN<S, G1, A1, M1, {}, G, A, M>
}

export interface InputModule <S, G, A, M, DG, DA, DM> {
  namespaced?: false,
  state?: S,
  getters?: GMapper<G, S, DG, never>,
  actions?: AMapper<A, S, DG, DA, DM, never, never, never>,
  mutations?: MMapper<M, S>
}

export interface InputModuleN <S, G, A, M, DG, DA, DM, RG, RA, RM> {
  namespaced: true,
  state?: S,
  getters?: GMapper<G, S, DG, RG>,
  actions?: AMapper<A, S, DG, DA, DM, RG, RA, RM>,
  mutations?: MMapper<M, S>
}

export interface AbsModule <S, G, A, M, C> {
  state: S
  getters: G
  actions: A
  mutations: M
  _children: C
}

export interface Module <S, G, A, M, C> extends AbsModule <S, G, A, M, C> {
  namespaced: false
  assign <S1, G1, A1, M1> (im: InputModule<S1, G1, A1, M1, G, A, M>): Module<S & S1, G & G1, A & A1, M & M1, C>
  module <K extends string, S1, G1, A1, M1, C1> (key: K, m: ModuleN<S1, G1, A1, M1, C1, any, any, any>): Module<S, G, A, M, C & { [K1 in K]: Module<S1, G1, A1, M1, C1> }>
  module <K extends string, S1, G1, A1, M1, C1> (key: K, m: Module<S1, G1, A1, M1, C1>): Module<S, G & G1, A & A1, M & M1, C & C1>
}

export interface ModuleN <S, G, A, M, C, RG, RA, RM> extends AbsModule <S, G, A, M, C> {
  namespaced: true
  assign <S1, G1, A1, M1> (im: InputModuleN<S1, G1, A1, M1, G, A, M, RG, RA, RM>): ModuleN<S & S1, G & G1, A & A1, M & M1, C, RG, RA, RM>
  module <K extends string, S1, G1, A1, M1, C1> (key: K, m: ModuleN<S1, G1, A1, M1, C1, any, any, any>): ModuleN<S, G, A, M, C & { [K1 in K]: Module<S1, G1, A1, M1, C1> }, RG, RA, RM>
  module <K extends string, S1, G1, A1, M1, C1> (key: K, m: Module<S1, G1, A1, M1, C1>): ModuleN<S, G & G1, A & A1, M & M1, C & C1, RG, RA, RM>
}
