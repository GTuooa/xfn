export default
function formatMoney(number, decimalPlaces, moneySymbol, thousand, decimalSymbol, getNumber) {
      number = String(number).replace(/[^\d\.-]/g, '') || '0';
      decimalPlaces = !isNaN(decimalPlaces = Math.abs(decimalPlaces)) ? decimalPlaces : 2;
      moneySymbol = moneySymbol ? moneySymbol : "";
      thousand = thousand || ",";
      decimalSymbol = decimalSymbol || ".";
    //   getNumber = getNumber !== undefined ? getNumber : true
      let negative = number < 0 ? "-" : "",
          i = parseInt(number = Math.abs(+number || 0).toFixed(decimalPlaces), 10) + "",
          j = (j = i.length) > 3 ? j % 3 : 0;
      return moneySymbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (decimalPlaces ? decimalSymbol + Math.abs(number - i).toFixed(decimalPlaces).slice(2) : "");
    //   let decimalSymbolIndex = number === '' ? 0 : number.findIndex('.'),
    //       integer = decimalSymbolIndex ? number.substr(0, decimalSymbolIndex) : '',
    //       decimal = decimalSymbolIndex ? number.substr(decimalSymbolIndex + 1,) : '';
    //   return moneySymbol + negative + integer.substr(0, integer.length%3)
  }
