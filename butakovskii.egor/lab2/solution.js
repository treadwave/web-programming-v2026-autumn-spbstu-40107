// Экспортируйте отсюда функцию с именем из контракта вашего варианта.
function zipArrays(...arrays) {
  for (const arr of arrays) {
    if (!Array.isArray(arr)) {
      throw new TypeError('All arguments must be arrays');
    }
  }

  if (arrays.length === 0) {
    return [];
  }

  const maxLength = Math.max(...arrays.map((arr) => arr.length));
  const result = [];

  for (let i = 0; i < maxLength; i++) {
    result.push(arrays.map((arr) => arr[i]));
  }

  return result;
}

export {zipArrays};
