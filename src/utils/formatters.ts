//create a function formatter for an nummber and 2 deciamls
export const twoDecimals = (num: number) => {
   return num.toFixed(2);
}
export const numberFormatter = (num: number) => {
   return new Intl.NumberFormat('nl-NL', {
      // 2 deciamls
      style: 'currency',
      currency: 'EUR',

      minimumFractionDigits: 2,
   }).format(num);
}
