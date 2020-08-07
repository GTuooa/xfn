export default function numberCalculate(a, b, digits=2, op='add',returnDigits = 2){
    // digits小数位数，,默认2位，op(add,subtract,multiply,divide)加减乘除
    const number1 = a === '-' ? 0 : (a ? parseFloat(a,digits) : 0)
    const number2 = b === '-' ? 0 : (b ? parseFloat(b,digits) : 0)

    const operation = (a, b, digits, op) => {
        const value1 = a * Math.pow(10,digits)
        const value2 = b * Math.pow(10,digits)

        switch (op) {
            case 'add':
                return ( value1 + value2 ) / Math.pow(10,digits)
            case 'subtract':
                return ( value1 - value2 ) / Math.pow(10,digits)
            case 'multiply':
                return  ( value1 * value2 ) / Math.pow(10,2 * digits)
            case 'divide':
                return  value2 === 0 ? 0 : value1 / value2
        }
    }
    const result = operation(number1, number2, digits, op)

    return (Math.round(result*Math.pow(10,returnDigits))/Math.pow(10,returnDigits)).toFixed(returnDigits)

}
