const TypedArray = Object.getPrototypeOf(Int8Array);
function deepEqual(left, right, comparator = Object.is) {
  const result = comparator(left, right);
  if (result) {
    return true;
  }
  if (typeof left !== 'object' || left === null) {
    return false;
  }
  if (typeof right !== 'object' || right === null) {
    return false;
  }
  if (!comparator(Object.getPrototypeOf(left), Object.getPrototypeOf(right))) {
    return false;
  }
  if (left instanceof Promise || left instanceof Symbol || left instanceof Function || left instanceof WeakMap || left instanceof WeakSet) {
    return false;
  }
  if ((left instanceof String || left instanceof Number || left instanceof Boolean || left instanceof Date)) {
    return comparator(left.valueOf(), right.valueOf());
  }
  if (left instanceof RegExp) {
    return comparator(left.toString(), right.toString());
  }
  let leftEntries = null;
  let rightEntries = null;
  if (left instanceof Error) {
    leftEntries = [ [ 'name', left.name ], [ 'message', left.message ], [ 'code', left.code ] ];
    rightEntries = [ [ 'name', right.name ], [ 'message', right.message ], [ 'code', right.code ] ];
  }
  if (left instanceof DataView) {
    left = left.buffer;
    right = right.buffer;
  }
  if (left instanceof ArrayBuffer) {
    left = new Uint8Array(left);
    right = new Uint8Array(right);
  }
  if (Array.isArray(left) || left instanceof TypedArray) {
    leftEntries = left;
    rightEntries = right;
  }
  if (!leftEntries && !(Symbol.iterator in left)) {
    leftEntries = Object.entries(left);
    rightEntries = Object.entries(right);
  }
  const leftIter = (leftEntries || left)[Symbol.iterator]();
  const rightIter = (rightEntries || right)[Symbol.iterator]();
  let leftCount = 0;
  let rightCount = 0;
  const leftMap = new Map();
  const rightMap = new Map();
  while (true) {
    const leftStep = leftIter.next();
    const rightStep = rightIter.next();
    if (leftStep.done && rightStep.done) {
      break;
    }
    if (!leftStep.done) {
      leftCount += 1;
    }
    if (!rightStep.done) {
      rightCount += 1;
    }
    if (Array.isArray(leftStep.value) && leftStep.value.length === 2) {
      leftMap.set(leftStep.value[0], leftStep.value[1]);
      rightMap.set(rightStep.value[0], rightStep.value[1]);
    } else {
      const result = deepEqual(leftStep.value, rightStep.value, comparator);
      if (!result) {
        return false;
      }
    }
  }
  for (const item of leftMap) {
    if (!deepEqual(item[1], rightMap.get(item[0]), comparator)) {
      return false;
    }
  }
  if (leftCount !== rightCount) {
    return false;
  }
  return true;
}
export { deepEqual };
