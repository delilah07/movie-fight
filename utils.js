export const debounce = (func, delay = 1000) => {
  let timeoutId;

  return (...arg) => {
    if (timeoutId) {
      clearInterval(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, arg);
    }, delay);
  };
};
