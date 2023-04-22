//create a function formatter for an nummber and 2 deciamls
export const twoDecimals = (num: number) => {
   return num.toFixed(2);
}
export const currencyFormatter = (num: number) => {
   return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
   }).format(num);
}
export const percentageFormatter = (num: number) => {
   return new Intl.NumberFormat('nl-NL', {
      style: 'percent',
      minimumFractionDigits: 2,
   }).format(num / 100);
}

export const numberFormatter = (num: number) => {
   return new Intl.NumberFormat('nl-NL', {
      minimumFractionDigits: 2,
   }).format(num);
}
