import decimal from './decimal.js'
export default
function formatMoney(number, decimalPlaces, moneySymbol = '', decimalZero=true) {
    number = String(number).replace(/[^\d\\.-]/g, '') || '0';
    decimalPlaces = !isNaN(decimalPlaces = Math.abs(decimalPlaces)) ? decimalPlaces : 2;
    const thousand = ",";
    // const decimalSymbol = ".";
    //moneySymbol 金钱符号列如 ￥ $等
    //decimalZero是否显示小数点后无意义的0 true显示 false的话.3030 表示为.303

    let negative = number < 0 ? "-" : "",
    i = parseInt(number = Math.abs(+number || 0).toFixed(decimalPlaces), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;

    let decimalNumber = `${String(decimal(Math.abs(number - i), decimalPlaces, decimalZero)).slice(1)}`
    if (!decimalZero) {//不显示小数点后无意义的0
        decimalNumber = `${String(Number(decimal(Math.abs(number - i), decimalPlaces))).slice(1)}`
        console.log('decimalNumber', decimalNumber);
        
    }

    return moneySymbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (decimalPlaces ? decimalNumber : "");
  }
