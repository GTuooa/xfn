import { fromJS, toJS }	from 'immutable'
import { abstractFunc } from './abstractFunc'
import { showProject } from './showProject'

export function setDefault (state, isOpenedWarehouse) {
    const oriTemp = state.get('oriTemp')
    const categoryType = oriTemp.get('categoryType')
    let beProject = oriTemp.get('beProject')//项目

    let oriState = ''
    let oriAbstract = oriTemp.get('runningAbstract')

    switch (categoryType) {
        case 'LB_YYSR': {
            oriState = 'STATE_YYSR_XS'
            if (oriTemp.get('propertyCarryover') == 'SX_HW_FW' && oriTemp.getIn(['acBusinessIncome', 'stockRange']).size) {
                state = state.setIn(['oriTemp', 'usedStock'], true)
            }
			break
		}
        case 'LB_YYZC': {
            oriState = 'STATE_YYZC_GJ'
			break
		}
        case 'LB_FYZC': {
            oriState = 'STATE_FY'
            let propertyCost = ''
            const propertyCostList = oriTemp.get('propertyCostList')
            if (propertyCostList.size == 1) {
                propertyCost = propertyCostList.get(0)
            }
            state = state.setIn(['oriTemp', 'propertyCost'], propertyCost)

			break
		}
        case 'LB_XCZC': {
            const propertyPay = oriTemp.get('propertyPay')
            oriState = 'STATE_XC_FF'
            if (propertyPay === 'SX_SHBX' || propertyPay === 'SX_ZFGJJ') {
                oriState = 'STATE_XC_JN'
            }

            let propertyCost = ''
            const propertyCostList = oriTemp.get('propertyCostList')
            if (propertyCostList.size == 1) {
                propertyCost = propertyCostList.get(0)
            }
            state = state.setIn(['oriTemp', 'propertyCost'], propertyCost)
			break
		}
        case 'LB_SFZC': {
            oriState = 'STATE_SF_JN'
			break
		}
        case 'LB_CQZC': {
            oriState = 'STATE_CQZC_YF'
            state = state.setIn(['oriTemp', 'handleType'], 'JR_HANDLE_GJ')

			break
		}
        case 'LB_YYWSR': {
            oriState = 'STATE_YYWSR'
			break
		}
        case 'LB_YYWZC': {
            oriState = 'STATE_YYWZC'
			break
		}
        case 'LB_ZSKX': {
            oriState = 'STATE_ZS_SQ'
			break
		}
        case 'LB_ZFKX': {
            oriState = 'STATE_ZF_FC'
			break
		}
        case 'LB_JK': {
            oriState = 'STATE_JK_YS'
            state = state.setIn(['oriTemp', 'handleType'], 'JR_HANDLE_QDJK')

			break
		}
        case 'LB_TZ': {
            oriState = 'STATE_TZ_YF'
            state = state.setIn(['oriTemp', 'handleType'], 'JR_HANDLE_DWTZ')
			break
		}
        case 'LB_ZB': {
            oriState = 'STATE_ZB_ZZ'
            state = state.setIn(['oriTemp', 'handleType'], 'JR_HANDLE_ZZ')
			break
		}
        case 'LB_ZZ': {
            oriState = 'STATE_ZZ'
			break
		}
        case 'LB_KJFP': {
            oriState = 'STATE_KJFP_XS'
            state = state.setIn(['oriTemp', 'billType'], 'BILL_MAKE_OUT_TYPE_XS')
			break
		}
        case 'LB_FPRZ': {
            oriState = 'STATE_FPRZ_CG'
            state = state.setIn(['oriTemp', 'billType'], 'BILL_AUTH_TYPE_CG')
			break
		}
        case 'LB_JZSY': {
            oriState = 'STATE_CQZC_JZSY'
			break
		}
        case 'LB_ZJTX': {
            oriState = 'STATE_CQZC_ZJTX'
			break
		}
        case 'LB_ZCWJZZS': {
            oriState = 'STATE_ZCWJZZS'
			break
		}
        case 'LB_SFGL': {
            oriState = 'STATE_SFGL'
			break
		}
        case 'LB_JZCB': {
            oriState = 'STATE_YYSR_XS'
            state = state.setIn(['oriTemp', 'stockCardList'], fromJS([]))
			break
		}
        case 'LB_GGFYFT': {
            oriState = 'STATE_GGFYFT'
            break
        }
        case 'LB_CHDB': {
            oriState = 'STATE_CHDB'
            break
        }
        case 'LB_CHYE': {
            oriState = isOpenedWarehouse ? 'STATE_CHYE_CK' : 'STATE_CHYE'
            break
        }
        case 'LB_JXSEZC': {
            oriState = 'STATE_JXSEZC_FS'
            break
        }
        case 'LB_CHZZ': {
            oriState = 'STATE_CHZZ_ZZCX'
            break
        }
        case 'LB_CHTRXM': {
            oriState = 'STATE_CHTRXM'
            beProject = true
            state = state.setIn(['oriTemp', 'beProject'], true)
            break
        }
        case 'LB_XMJZ': {
            oriState = 'STATE_XMJZ_JZRK'
            beProject = true
            state = state.setIn(['oriTemp', 'beProject'], true)
            break
        }


		default: console.log('设置初始值')
	}

    //摘要
    if (oriState) {
        oriAbstract = abstractFunc(oriState, oriTemp)
    }
    if (categoryType == 'LB_JZCB') {//结转成本的oriState与营业收入的重合所以要特殊处理
        oriAbstract = '销售存货结转成本'
    }


    //公有的状态
    state = state.setIn(['oriTemp' ,'oriState'], oriState)
                .setIn(['oriTemp' ,'oriAbstract'], oriAbstract)

    return state.setIn(['oriTemp' ,'usedProject'], beProject ? showProject(state.get('oriTemp')) : false)
}
