export function showProject (oriTemp) {
    const categoryType = oriTemp.get('categoryType')
    const oriState = oriTemp.get('oriState')

    let isShow = false//是否显示项目按钮

    switch (categoryType) {
        case 'LB_YYSR': {
            isShow = true
			break
        }
        case 'LB_YYZC': {
            isShow = true
			break
        }
        case 'LB_FYZC': {
            isShow = true
            break
        }
        case 'LB_CQZC': {
            const newProjectRange = oriTemp.get('newProjectRange') ? oriTemp.get('newProjectRange') : []
            newProjectRange.map(v => {
                if (v.get('name')=='损益项目') {
                    isShow = true
                }
            })
            break
        }
        case 'LB_SFZC': {
            const propertyTax = oriTemp.get('propertyTax')
            const beAccrued = oriTemp.getIn(['acTax', 'beAccrued'])//是否计提
            if ((propertyTax == 'SX_QTSF' || propertyTax == 'SX_QYSDS') && !(beAccrued && oriState == 'STATE_SF_JN')) {
                isShow = true
            }
            if (oriState == 'STATE_SF_SFJM') {
                isShow = false
            }
            break
        }
        case 'LB_XCZC': {
            const propertyPay = oriTemp.get('propertyPay')
            const beAccrued = oriTemp.getIn(['acPayment', 'beAccrued'])//是否计提
            ;({
                'SX_GZXJ': () => {
                    if (!(beAccrued && oriState == 'STATE_XC_FF')) {
                        isShow = true
                    }
                    if (oriState == 'STATE_XC_DK') {
                        isShow = false
                    }
                },
                'SX_SHBX': () => {
                    if (!(beAccrued && oriState == 'STATE_XC_JN')) {
                        isShow = true
                    }
                    if (oriState == 'STATE_XC_DJ') {
                        isShow = false
                    }
                },
                'SX_ZFGJJ': () => {
                    if (!(beAccrued && oriState == 'STATE_XC_JN')) {
                        isShow = true
                    }
                    if (oriState == 'STATE_XC_DJ') {
                        isShow = false
                    }
                },
                'SX_FLF': () => {
                    const beWelfare = oriTemp.getIn(['acPayment', 'beWelfare'])
                    if (!(beWelfare && oriState == 'STATE_XC_FF')) {
                        isShow = true
                    }
                },
                'SX_QTXC': () => {
                    if (!(beAccrued && oriState == 'STATE_XC_FF')) {
                        isShow = true
                    }
                }
            }[propertyPay] || (() => null))()

            break
        }
        case 'LB_YYWSR': {
            isShow = true
            break
        }
        case 'LB_YYWZC': {
            isShow = true
            break
        }
        case 'LB_ZSKX': {
            if (oriState === 'STATE_ZS_SQ') {
                isShow = true
            }
			break
		}
        case 'LB_ZFKX': {
            if (oriState === 'STATE_ZF_FC') {
                isShow = true
            }
			break
		}

        case 'LB_JK': {
            const beAccrued = oriTemp.getIn(['acLoan', 'beAccrued'])//是否计提应付利息
            if (oriState == 'STATE_JK_JTLX' || (!beAccrued && oriState == 'STATE_JK_ZFLX')) {
                isShow = true
            }
			break
        }
        case 'LB_TZ': {
            const beAccrued = oriTemp.getIn(['acInvest', 'beAccrued'])//是否计提应付利息
            if ((oriState == 'STATE_TZ_JTGL' || oriState == 'STATE_TZ_JTLX') || (!beAccrued && (oriState == 'STATE_TZ_SRGL' || oriState == 'STATE_TZ_SRLX'))) {
                isShow = true
            }
			break
        }
        case 'LB_JZSY':
        case 'LB_ZJTX': {
            isShow = true
            break
        }
        case 'LB_JZCB': {
            if (oriState == 'STATE_YYSR_ZJ') {
                isShow = true
            }
            break
        }
        case 'LB_JXSEZC': {
            isShow = true
            break
        }
        case 'LB_CHTRXM': {
            isShow = true
            break
        }
        case 'LB_XMJZ': {
            isShow = true
            break
        }

		default: null
	}

    return isShow
}
