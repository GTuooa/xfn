
export function getNumberPlaces(value, decimalPlaces) {
    const num = String(value).split('.')[0]
    return Number(num.length) + Number(decimalPlaces)
}

export function isShowTooltip(value,decimalPlaces,maxNum){
    return getNumberPlaces(value,decimalPlaces) > Number(maxNum)
}
