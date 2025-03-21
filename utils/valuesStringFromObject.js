
export const valuesStringFromObject = (item)=>{
    const itemKeys = Object.keys(item);
    const values = itemKeys.reduce((res, curr, index) => {
        if (index == itemKeys.length - 1) {
      res += `"${item[curr]}"`;
      return res;
    }
    res += `"${item[curr]}",`;
    return res;
}, '');

return values
}