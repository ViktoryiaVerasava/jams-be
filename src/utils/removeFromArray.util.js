/**
 * Returns source array after removing from it all values of valuesValue
 * @param {array} sourceArr
 * @param {array} valuesValue
 */
const removeFromArray = (sourceArr, valuesValue) => {
  valuesValue.forEach((el) => {
    const index = sourceArr.indexOf(el);
    if (index !== -1) {
      sourceArr.splice(index, 1);
    }
  });
  return sourceArr;
};
