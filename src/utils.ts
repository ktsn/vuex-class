export function merge <T, U> (a: T, b: U): T & U {
  const res: any = {}
  ;[a, b].forEach((obj: any) => {
    Object.keys(obj).forEach(key => {
      res[key] = obj[key]
    })
  })
  return res
}

export function mapValues<T, R>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => R
): Record<string, R> {
  const res: Record<string, R> = {}
  Object.keys(obj).forEach(key => {
    res[key] = fn(obj[key], key)
  })
  return res
}
