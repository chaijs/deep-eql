const TypedArray = Object.getPrototypeOf(Int8Array)

const cache = new WeakMap<object, WeakMap<object, boolean>>()

function deepEqual(left: unknown, right: unknown, comparator = Object.is): boolean {
  // 1. Optimize for early positive equality returns
  const result = comparator(left, right)
  if (result) return true

  // 2. Primitives have no keys. Treat them as unequal given step 1.
  if (typeof left !== 'object' || left === null) return false
  if (typeof right !== 'object' || right === null) return false
 
  // Set up the cache chain
  if (!cache.has(left)) cache.set(left, new WeakMap())
  if (!cache.has(right)) cache.set(right, new WeakMap())

  const cacheResult = cache.get(right)!.get(left) ?? cache.get(left)!.get(right)
  if (cacheResult != null) return cacheResult

  // Populate the cache to prevent too much recursion with circular references.
  cache.get(left)!.set(right, true);

  // 3. Consider mismatched classes to be unequal.
  if (!comparator(Object.getPrototypeOf(left), Object.getPrototypeOf(right))) {
    cache.get(left)!.set(right, false)
    return false
  }

  // 4. Consider uniterable classes opaque. Treat them as unequal given step 1.
  if (left instanceof Promise || left instanceof Symbol || left instanceof Function || left instanceof WeakMap || left instanceof WeakSet) {
    cache.get(left)!.set(right, false)
    return false
  }

  // 5. "Unboxing" primitives.
  // 5.1. Compare unpacked "boxed primitives" using `.valueOf`. See step 2.
  if ((left instanceof String || left instanceof Number || left instanceof Boolean || left instanceof Date)) {
    const x =  comparator(left.valueOf(), right.valueOf())
    cache.get(left)!.set(right, x)
    return x
  }

  // 5.2. Compare unpacked RegExp using `.toString`. See step 2.
  if (left instanceof RegExp) {
    const x = comparator(left.toString(), right.toString())
    cache.get(left)!.set(right, x)
    return x
  }

  // 6. "Unboxing" iterables
  let leftEntries: Iterable<unknown> | null = null
  let rightEntries: Iterable<unknown> | null = null

  // 6.1. Construct entries from Errors as they have no enumerable keys.
  if (left instanceof Error) {
    leftEntries = [['name', left.name], ['message', left.message], ['code', (left as any).code]]
    rightEntries = [['name', (right as Error).name], ['message', (right as Error).message], ['code', (right as any).code]]
  }
  
  // 6.2. Construct entries from DataViews as they are uniterable.
  if (left instanceof DataView) {
    leftEntries = new Uint8Array(left.buffer)
    rightEntries = new Uint8Array((right as DataView).buffer)
  }
  
  // 6.3. Construct entries from ArrayBuffer as they are uniterable.
  if (left instanceof ArrayBuffer) {
    leftEntries = new Uint8Array(left)
    rightEntries = new Uint8Array(right as ArrayBuffer)
  }
  
  // 6.4. Arrays are already iterable so there is no need to unbox them.
  if(Array.isArray(left) || left instanceof TypedArray) {
    leftEntries = left as Array<unknown>
    rightEntries = right as Array<unknown>
  }

  // 6.5. Generic iterables.
  if (!leftEntries && Symbol.iterator in left) {
    leftEntries = left as Iterable<unknown>
    rightEntries = right as Iterable<unknown>
  }
  
  // 6.6. Default case.
  if (!leftEntries || !rightEntries) {
    leftEntries = Object.entries((left as object))
    rightEntries = Object.entries((right as object))
  }

  const leftIter = leftEntries[Symbol.iterator]()
  const rightIter = rightEntries[Symbol.iterator]()
  const leftMap = new Map()
  const rightMap = new Map()

  // TODO: Add a test for this.
  let isEntries = true
  let iterResult = null

  while (true) {
    const leftStep = leftIter.next()
    const rightStep = rightIter.next()
    
    if (leftStep.done !== rightStep.done) {
      cache.get(left)!.set(right, false)
      return false
    }

    if (leftStep.done && rightStep.done) {
      break
    }

    isEntries = isEntries && Array.isArray(leftStep.value) && leftStep.value.length === 2

    // Probably entry result
    if (isEntries) {
      leftMap.set(leftStep.value[0], leftStep.value[1]) 
      rightMap.set(rightStep.value[0], rightStep.value[1]) 
    }

    iterResult = iterResult && deepEqual(leftStep.value, rightStep.value, comparator)
    if (!isEntries && !iterResult) {
      cache.get(left)!.set(right, false)
      return false 
    }
  }

  // 8. Iterate over the constructed map to compare entries.
  for (const item of leftMap) {
    if (!deepEqual(item[1], rightMap.get(item[0]), comparator)) {
      cache.get(left)!.set(right, false)
      return false
    }
  }

  cache.get(left)!.set(right, true)
  return true
}

export {deepEqual}
