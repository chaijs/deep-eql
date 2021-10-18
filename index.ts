const TypedArray = Object.getPrototypeOf(Int8Array)

const map = new WeakMap<object, WeakMap<object, boolean>>()

function deepEqual(left: unknown, right: unknown, comparator = Object.is): boolean {
  // 1. Call comparator on the given objects to optimize for early positive
  // equality returns
  let result = comparator(left, right)
  if (result) {
    return true
  }

  // 2. If they are primitives, they have no keys to iterate on so we must
  // return false as they didn't pass through step 1.
  if (typeof left !== 'object' || left === null) return false
  if (typeof right !== 'object' || right === null) return false
  
  if (!map.has(left)) {
    map.set(left, new WeakMap())
  }
  if (!map.has(right)) {
    map.set(right, new WeakMap())
  }

  const results = map.get(right)?.get(left)
  if (typeof results === 'boolean') {
    console.log('returning early', results)
    return results
  }

  // Temporarily set the operands in the memoize object to prevent blowing the stack
  map.get(left)?.set(right, true);
  map.get(right)?.set(left, true);

  // 3. Consider mismatched classes to be unequal.
  if (!comparator(Object.getPrototypeOf(left), Object.getPrototypeOf(right))) {
    map.get(right)?.set(left, false)
    map.get(left)?.set(right, false)
    return false
  }

  // 4. If they are non-iterable classes (Promise, Symbol, Function, WeakMap,
  // WeakSet), they have no keys to iterate so we must return false as they
  // didn't pass through step 1.
  if (left instanceof Promise || left instanceof Symbol || left instanceof Function || left instanceof WeakMap || left instanceof WeakSet) {
    map.get(right)?.set(left, false)
    map.get(left)?.set(right, false)
    return false
  }

  // 5. "Unboxing" primitives.
  
  // 5.1. If they are "boxed primitives" (String, Number, Boolean & Date), we
  // "unpack" them using `.valueOf`. Re-run the comparator check with the
  // unpacked primitives.  See step 2.
  if ((left instanceof String || left instanceof Number || left instanceof Boolean || left instanceof Date)) {
    const x =  comparator(left.valueOf(), right.valueOf())
    map.get(right)?.set(left, x)
    map.get(left)?.set(right, x)
    return x
  }
 
  // 5.2. Edge Case: RegExp are similar to "boxed primitives" in that they have
  // an underlying value which is access with `.toString` as opposed to
  // `.valueOf`.
  if (left instanceof RegExp) {
    const x = comparator(left.toString(), right.toString())
    map.get(right)?.set(left, x)
    map.get(left)?.set(right, x)
    return x
  }


  // 6. Iterating object entries.
  let leftEntries: Iterable<unknown> | null = null
  let rightEntries: Iterable<unknown> | null = null

  // 6.1. Edge Case: Errors has no enumerable keys so we need to emulate them.
  // A error stacktrace will always be unique so we skip that property as well.
  if (left instanceof Error) {
    leftEntries = [['name', left.name], ['message', left.message], ['code', (left as any).code]]
    rightEntries = [['name', (right as Error).name], ['message', (right as Error).message], ['code', (right as any).code]]
  }
  
  // 6.2. Edge Case: DataView is not iterable, we can unpack the DataView into
  // an ArrayBuffer and let the ArrayBuffers drop down into step 6.4 to be
  // processed further.
  if (left instanceof DataView) {
    leftEntries = new Uint8Array(left.buffer)
    rightEntries = new Uint8Array((right as DataView).buffer)
  }
  
  // 6.3. Edge Case: ArrayBuffer is not iterable since it doesn't have a width.
  // We can assume a width to make it iterable. We assume a width of 8 since
  // that's the smallest typed array there is. By packing the ArrayBuffer into
  // an Uint8Array we make it iterable and can continue on. The size of the
  // typed array doesn't concern us since we are simply interested in the bytes
  // to byte comparison.
  if (left instanceof ArrayBuffer) {
    leftEntries = new Uint8Array(left)
    rightEntries = new Uint8Array(right as ArrayBuffer)
  }
  
  // 6.4. Performance: Arrays are already iterable so there is no need to unpack them.
  if(Array.isArray(left) || left instanceof TypedArray) {
    leftEntries = left as Array<unknown>
    rightEntries = right as Array<unknown>
  }
  
  // 6.5. Capture everything that isn't iterable and we haven't already
  // processed.
  if (!leftEntries && !(Symbol.iterator in (left as any))) {
    leftEntries = Object.entries((left as object))
    rightEntries = Object.entries((right as object))
  }

  const leftIter = (leftEntries || (left as Iterable<unknown>))[Symbol.iterator]()
  const rightIter = (rightEntries || (right as Iterable<unknown>))[Symbol.iterator]()

  let leftCount = 0
  let rightCount = 0

  const leftMap = new Map()
  const rightMap = new Map()

  while (true) {
    const leftStep = leftIter.next()
    const rightStep = rightIter.next()

    if (leftStep.done && rightStep.done) {
      break
    }

    if (!leftStep.done) {
      leftCount += 1
    }
    if (!rightStep.done) {
      rightCount += 1
    }
  

    // Probably entry result
    if (Array.isArray(leftStep.value) && leftStep.value.length === 2) {
      leftMap.set(leftStep.value[0], leftStep.value[1]) 
      rightMap.set(rightStep.value[0], rightStep.value[1]) 
    } else {
      const result = deepEqual(leftStep.value, rightStep.value, comparator)
      if (!result) {
        map.get(right as object)?.set(left as object, false)
        map.get(left as object)?.set(right as object, false)
        return false 
      }
    }
  }
  
  // 7. If we didn't iterate over any keys, return false.
  if (leftCount !== rightCount) {
    map.get(right as object)?.set(left as object, false)
    map.get(left as object)?.set(right as object, false)
    return false
  }

  // 8. ???
  for (const item of leftMap) {
    console.log(left)
    console.log(  right)
    console.log(  item[0])
    console.log(  item[1])
    console.log(  rightMap.get(item[0]))
    if (!deepEqual(item[1], rightMap.get(item[0]), comparator)) {
      map.get(right as object)?.set(left as object, false)
      map.get(left as object)?.set(right as object, false)
      return false
    }
  }
  

  // 8. TODO: What is this?
  // for (const item of leftMap) {
  //   const a = item[1]
  //   const b = rightMap.get(item[0])


  //   if (typeof a !== 'object' || typeof b !== 'object') {
  //     if (!deepEqual(a, b, comparator)) {
  //       map.get(right)?.set(left, false)
  //       map.get(left)?.set(right, false)
  //       return false
  //     } else  {
  //       continue
  //     }
  //   }
  // }

  map.get(right)?.set(left, true)
  map.get(left)?.set(right, true)
  return true
}

export {deepEqual}
