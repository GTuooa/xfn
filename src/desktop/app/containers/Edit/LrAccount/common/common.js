export function getCategorynameByType (categoryType) {
    let  propertyShow, categoryTypeObj
    let direction = 'debit'
    let showInvoice = false
    let isShowAbout = false
    let specialState = false
    ;({
        'LB_YYSR': () => {
            propertyShow = '营业收入'
            categoryTypeObj = 'acBusinessIncome'
        },
        'LB_YYZC': () => {
            propertyShow = '营业支出'
            categoryTypeObj = 'acBusinessExpense'
            direction = 'credit'
        },
        'LB_YYWSR': () => {
            propertyShow = '营业外收入'
            categoryTypeObj = 'acBusinessOutIncome'
            isShowAbout = true
            direction = 'debit'
        },
        'LB_YYWZC': () => {
            propertyShow = '营业外支出'
            categoryTypeObj = 'acBusinessOutExpense'
            direction = 'credit'
            isShowAbout = true
            direction = 'credit'
        },
        'LB_JK': () => {
            propertyShow = '借款'
            categoryTypeObj = 'acLoan'
            specialState = true
        },
        'LB_TZ': () => {
            propertyShow = '投资'
            categoryTypeObj = 'acInvest'
            specialState = true
        },
        'LB_ZB': () => {
            propertyShow = '资本'
            categoryTypeObj = 'acCapital'
            specialState = true
        },
        'LB_CQZC': () => {
            propertyShow = '长期资产'
            categoryTypeObj = 'acAssets',
            direction = 'debit'
        },
        'LB_FYZC': () => {
            propertyShow = '费用支出'
            categoryTypeObj = 'acCost',
            direction = 'credit'
        },
        'LB_ZSKX': () => {
            propertyShow = '暂收款项'
            categoryTypeObj = 'acTemporaryReceipt'
            isShowAbout = true
        },
        'LB_ZFKX': () => {
            propertyShow = '暂付款项'
            categoryTypeObj = 'acTemporaryPay'
            isShowAbout = true
        },
        'LB_XCZC': () => {
            propertyShow = '薪酬支出'
            categoryTypeObj = 'acPayment',
            direction = 'credit'
            specialState = true
        },
        'LB_SFZC': () => {
            propertyShow = '税费支出'
            categoryTypeObj = 'acTax',
            direction = 'credit'
            specialState = true
        }
    }[categoryType] || (() => ''))()
    return {
        propertyShow,
        categoryTypeObj,
        direction,
        showInvoice,
        isShowAbout,
        specialState,
    }
}
