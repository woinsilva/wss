type MessageResolver = (value: unknown) => string

function resolveMessages(value: unknown, resolve: MessageResolver): unknown {
  if (Array.isArray(value)) return value.map(item => resolveMessages(item, resolve))
  if (value && typeof value === 'object') {
    if ('type' in value && typeof value.type === 'number') return resolve(value)
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveMessages(item, resolve)]))
  }
  return value
}

export function useTranslatedContent<T>(key: string | (() => string)) {
  const { locale, rt, tm } = useI18n()
  return computed(() => {
    void locale.value
    const resolvedKey = typeof key === 'function' ? key() : key
    return resolveMessages(tm(resolvedKey), value => rt(value as never)) as T
  })
}
