function maxSlidingWindow(arr, k) {
  if (!Array.isArray(arr)) {
    throw new TypeError('First argument must be an Array');
  }
  if (typeof k !== 'number' || !Number.isInteger(k)) {
    throw new TypeError('Window size k must be an integer');
  }
  if (k <= 0) {
    throw new RangeError('Window size k must be greater than 0');
  }

  const n = arr.length;
  if (n === 0 || k > n) {
    return [];
  }

  const result = new Array(n - k + 1);
  const deque = [];
  let head = 0;

  for (let i = 0; i < n; i++) {
    const val = arr[i];
    if (typeof val !== 'number' || Number.isNaN(val)) {
      throw new TypeError(`Element at index ${i} is not a valid number`);
    }

    if (head < deque.length && deque[head] < i - k + 1) {
      head++;
    }

    while (deque.length > head && arr[deque[deque.length - 1]] <= val) {
      deque.pop();
    }

    deque.push(i);

    if (head > 2048 && head > deque.length >> 1) {
      deque.splice(0, head);
      head = 0;
    }

    if (i >= k - 1) {
      result[i - k + 1] = arr[deque[head]];
    }
  }

  return result;
}

export {maxSlidingWindow};
