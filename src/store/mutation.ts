import {
  CommitOptions as _CommitOptions
} from 'vuex'

export interface CommitOptions <T extends boolean> extends _CommitOptions {
  global?: T
}

export interface Commit <M, RM> {
  <K extends keyof M> (type: K, payload: M[K], options?: CommitOptions<false>): void
  <K extends keyof M> (payload: M[K] & { type: K }, options?: CommitOptions<false>): void
  <K extends keyof RM> (type: K, payload: RM[K], options: CommitOptions<true>): void
  <K extends keyof RM> (payload: RM[K] & { type: K }, options: CommitOptions<true>): void
}

export type MMapper <M, S> = {
  [K in keyof M]: (state: S, payload: M[K]) => void
} & {
  [key: string]: (state: S, payload: any) => void
}
