const TypedArray = Object.getPrototypeOf(Int8Array);
const map = new WeakMap();
function deepEqual(left, right, comparator = Object.is) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    let result = comparator(left, right);
    if (result) {
        return true;
    }
    if (typeof left !== 'object' || left === null)
        return false;
    if (typeof right !== 'object' || right === null)
        return false;
    if (!map.has(left)) {
        map.set(left, new WeakMap());
    }
    if (!map.has(right)) {
        map.set(right, new WeakMap());
    }
    const results = (_a = map.get(right)) === null || _a === void 0 ? void 0 : _a.get(left);
    if (typeof results === 'boolean') {
        console.log('returning early', results);
        return results;
    }
    (_b = map.get(left)) === null || _b === void 0 ? void 0 : _b.set(right, true);
    (_c = map.get(right)) === null || _c === void 0 ? void 0 : _c.set(left, true);
    if (!comparator(Object.getPrototypeOf(left), Object.getPrototypeOf(right))) {
        (_d = map.get(right)) === null || _d === void 0 ? void 0 : _d.set(left, false);
        (_e = map.get(left)) === null || _e === void 0 ? void 0 : _e.set(right, false);
        return false;
    }
    if (left instanceof Promise || left instanceof Symbol || left instanceof Function || left instanceof WeakMap || left instanceof WeakSet) {
        (_f = map.get(right)) === null || _f === void 0 ? void 0 : _f.set(left, false);
        (_g = map.get(left)) === null || _g === void 0 ? void 0 : _g.set(right, false);
        return false;
    }
    if ((left instanceof String || left instanceof Number || left instanceof Boolean || left instanceof Date)) {
        const x = comparator(left.valueOf(), right.valueOf());
        (_h = map.get(right)) === null || _h === void 0 ? void 0 : _h.set(left, x);
        (_j = map.get(left)) === null || _j === void 0 ? void 0 : _j.set(right, x);
        return x;
    }
    if (left instanceof RegExp) {
        const x = comparator(left.toString(), right.toString());
        (_k = map.get(right)) === null || _k === void 0 ? void 0 : _k.set(left, x);
        (_l = map.get(left)) === null || _l === void 0 ? void 0 : _l.set(right, x);
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
        }
        else {
            const result = deepEqual(leftStep.value, rightStep.value, comparator);
            if (!result) {
                (_m = map.get(right)) === null || _m === void 0 ? void 0 : _m.set(left, false);
                (_o = map.get(left)) === null || _o === void 0 ? void 0 : _o.set(right, false);
                return false;
            }
        }
    }
    if (leftCount !== rightCount) {
        (_p = map.get(right)) === null || _p === void 0 ? void 0 : _p.set(left, false);
        (_q = map.get(left)) === null || _q === void 0 ? void 0 : _q.set(right, false);
        return false;
    }
    for (const item of leftMap) {
        console.log(left);
        console.log(right);
        console.log(item[0]);
        console.log(item[1]);
        console.log(rightMap.get(item[0]));
        if (!deepEqual(item[1], rightMap.get(item[0]), comparator)) {
            (_r = map.get(right)) === null || _r === void 0 ? void 0 : _r.set(left, false);
            (_s = map.get(left)) === null || _s === void 0 ? void 0 : _s.set(right, false);
            return false;
        }
    }
    (_t = map.get(right)) === null || _t === void 0 ? void 0 : _t.set(left, true);
    (_u = map.get(left)) === null || _u === void 0 ? void 0 : _u.set(right, true);
    return true;
}
export { deepEqual };
