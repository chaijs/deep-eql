const TypedArray = Object.getPrototypeOf(Int8Array);
const cache = new WeakMap();
function deepEqual(left, right, comparator = Object.is) {
    var _a;
    const result = comparator(left, right);
    if (result)
        return true;
    if (typeof left !== 'object' || left === null)
        return false;
    if (typeof right !== 'object' || right === null)
        return false;
    if (!cache.has(left))
        cache.set(left, new WeakMap());
    if (!cache.has(right))
        cache.set(right, new WeakMap());
    const cacheResult = (_a = cache.get(right).get(left)) !== null && _a !== void 0 ? _a : cache.get(left).get(right);
    if (cacheResult != null)
        return cacheResult;
    cache.get(left).set(right, true);
    if (!comparator(Object.getPrototypeOf(left), Object.getPrototypeOf(right))) {
        cache.get(left).set(right, false);
        return false;
    }
    if (left instanceof Promise || left instanceof Symbol || left instanceof Function || left instanceof WeakMap || left instanceof WeakSet) {
        cache.get(left).set(right, false);
        return false;
    }
    if ((left instanceof String || left instanceof Number || left instanceof Boolean || left instanceof Date)) {
        const x = comparator(left.valueOf(), right.valueOf());
        cache.get(left).set(right, x);
        return x;
    }
    if (left instanceof RegExp) {
        const x = comparator(left.toString(), right.toString());
        cache.get(left).set(right, x);
        return x;
    }
    let leftEntries = null;
    let rightEntries = null;
    if (left instanceof Error) {
        leftEntries = [['name', left.name], ['message', left.message], ['code', left.code]];
        rightEntries = [['name', right.name], ['message', right.message], ['code', right.code]];
    }
    if (left instanceof DataView) {
        leftEntries = new Uint8Array(left.buffer);
        rightEntries = new Uint8Array(right.buffer);
    }
    if (left instanceof ArrayBuffer) {
        leftEntries = new Uint8Array(left);
        rightEntries = new Uint8Array(right);
    }
    if (Array.isArray(left) || left instanceof TypedArray) {
        leftEntries = left;
        rightEntries = right;
    }
    if (!leftEntries && Symbol.iterator in left) {
        leftEntries = left;
        rightEntries = right;
    }
    if (!leftEntries || !rightEntries) {
        leftEntries = Object.entries(left);
        rightEntries = Object.entries(right);
    }
    const leftIter = leftEntries[Symbol.iterator]();
    const rightIter = rightEntries[Symbol.iterator]();
    const leftMap = new Map();
    const rightMap = new Map();
    while (true) {
        const leftStep = leftIter.next();
        const rightStep = rightIter.next();
        if (leftStep.done !== rightStep.done) {
            cache.get(left).set(right, false);
            return false;
        }
        if (leftStep.done && rightStep.done) {
            break;
        }
        if (Array.isArray(leftStep.value) && leftStep.value.length === 2) {
            leftMap.set(leftStep.value[0], leftStep.value[1]);
            rightMap.set(rightStep.value[0], rightStep.value[1]);
        }
        else {
            const result = deepEqual(leftStep.value, rightStep.value, comparator);
            if (!result) {
                cache.get(left).set(right, false);
                return false;
            }
        }
    }
    for (const item of leftMap) {
        if (!deepEqual(item[1], rightMap.get(item[0]), comparator)) {
            cache.get(left).set(right, false);
            return false;
        }
    }
    cache.get(left).set(right, true);
    return true;
}
export { deepEqual };
