import { fromJS }	from 'immutable'
import * as editRunning from 'app/constants/editRunning.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import { abstractFunc } from './abstractFunc'
import { showProject } from './showProject'

export function oriStateFunc (dispatch, state) {
    const oriTemp = state.get('oriTemp')
    const categoryType = state.getIn(['oriTemp', 'categoryType'])
    const oriState = state.getIn(['oriTemp', 'oriState'])
    const oriDate = state.getIn(['oriTemp', 'oriDate'])
    const beAccrued = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beAccrued'])//是否开启计提
    const contactsManagement = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'contactsManagement'])//是否开启往来管理
    const beManagemented = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beManagemented'])//是否开启收付管理

    //修改项目
    const beProject = state.getIn(['oriTemp', 'beProject'])
    if (beProject) {//类别开启了项目
        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedProject'], showProject(oriTemp)))
    }
    //修改摘要
    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'oriAbstract'], abstractFunc(oriState, state.get('oriTemp'))))

    if (contactsManagement) {
        dispatch(editRunningActions.getCardList('contactsRange'))
        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedCurrent'], true))
    }

    switch (categoryType) {
		case 'LB_ZSKX': {
            if (oriState === 'STATE_ZS_TH') {
                dispatch(editRunningActions.getZskxPaymentList())
                dispatch(editRunningActions.getSfglCardList())
            }
			break
		}
        case 'LB_ZFKX': {
            if (oriState === 'STATE_ZF_SH') {
                dispatch(editRunningActions.getZskxPaymentList())
                dispatch(editRunningActions.getSfglCardList())
            }
			break
		}
        case 'LB_JK': {
            if (beAccrued && oriState === 'STATE_JK_ZFLX') {
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedCurrent'], false))
                dispatch(editRunningActions.getJkPendingStrongList())
            }
			break
		}
        case 'LB_TZ': {
            if (beAccrued && (oriState === 'STATE_TZ_SRGL' || oriState === 'STATE_TZ_SRLX')) {
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedCurrent'], false))
                dispatch(editRunningActions.getTzPendingStrongList())
            }
			break
		}
        case 'LB_ZB': {
            if (beAccrued && oriState === 'STATE_ZB_ZFLR') {
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedCurrent'], false))
                dispatch(editRunningActions.getZbPendingStrongList())
            }
			break
		}
        case 'LB_YYSR': {
            if (beManagemented) {
                dispatch(editRunningActions.getYysrYyzcAmount())
            }
            const propertyCarryover = oriTemp.get('propertyCarryover')
            if (propertyCarryover == 'SX_HW_FW' && oriTemp.getIn(['acBusinessIncome', 'stockRange']).size && ['STATE_YYSR_XS', 'STATE_YYSR_TS'].includes(oriState)) {
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedStock'], true))
            }

			break
		}
        case 'LB_YYZC': {
            if (beManagemented) {
                dispatch(editRunningActions.getYysrYyzcAmount())
            }
			break
		}
        case 'LB_FYZC': {
            if (beManagemented) {
                dispatch(editRunningActions.getYysrYyzcAmount())
            }
			break
		}
        case 'LB_SFZC': {
            const propertyTax = oriTemp.get('propertyTax')
            if (propertyTax == 'SX_ZZS' && oriState == 'STATE_SF_JN') {
                dispatch(editRunningActions.getSfzcZzsList())
                dispatch(editRunningActions.getSfzcNotPayList())
            }
            if (beAccrued && (propertyTax == 'SX_QTSF' || propertyTax == 'SX_QYSDS') && oriState == 'STATE_SF_JN') {
                dispatch(editRunningActions.getSfzcNotPayList())
            }
            if (oriState == 'STATE_SF_ZCWJZZS') {
                dispatch(editRunningActions.getSfzcTransferAmount())
            }
			break
		}
        case 'LB_XCZC': {
            const propertyPay = oriTemp.get('propertyPay')
            const beWelfare = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beWelfare'])// 是否过渡福利费
            if ((oriState == 'STATE_XC_JN' || oriState == 'STATE_XC_FF') && (beAccrued || beWelfare)) {
                dispatch(editRunningActions.getXczcPaymentList())
            }
            if (propertyPay == 'SX_GZXJ' && beAccrued && oriState == 'STATE_XC_FF') {
                dispatch(editRunningActions.getPaymentInfo())
                dispatch(editRunningActions.getSfzcNotHandleAmount())
            }
            if (['SX_SHBX', 'SX_ZFGJJ'].includes(propertyPay) && beAccrued && oriState == 'STATE_XC_JN') {
                dispatch(editRunningActions.getPaymentInfo())
            }
			break
		}
        case 'LB_KJFP': {
            const billType = oriState == 'STATE_KJFP_XS' ? 'BILL_MAKE_OUT_TYPE_XS' : 'BILL_MAKE_OUT_TYPE_TS'
            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'billType'], billType))
            dispatch(editRunningActions.getKjfpList())

			break
		}
        case 'LB_FPRZ': {
            const billType = oriState == 'STATE_FPRZ_CG' ? 'BILL_AUTH_TYPE_CG' : 'BILL_AUTH_TYPE_TG'
            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'billType'], billType))
            dispatch(editRunningActions.getFprzList())

			break
		}
        case 'LB_JZCB': {
            const oriAbstract = {
                'STATE_YYSR_XS': '销售存货结转成本',
                'STATE_YYSR_TS': '销货退回结转成本',
                'STATE_YYSR_ZJ': '直接结转成本'
            }[oriState]
            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'oriAbstract'], oriAbstract))
            dispatch(editRunningActions.getJzcbCategoryList())

            if (oriState != 'STATE_YYSR_ZJ') {
                dispatch(editRunningActions.changeLrlsData(['cardAllList', 'stockCardList'], fromJS([])))
                dispatch(editRunningActions.changeLrlsData(['cardAllList', 'warehouseCardList'], fromJS([])))
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'relationCategoryUuid'], ''))
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'stockCardList'], fromJS([])))
                dispatch(editRunningActions.getJzcbList())
                dispatch(editRunningActions.getCostStockByCategory('', true))
                dispatch(editRunningActions.getCostStockCategory())
                dispatch(editRunningActions.getJzcbWarehouseList())
            }
			break
		}
        case 'LB_CHYE': {
            dispatch(editRunningActions.getCardList('stockRange'))
            if (oriState=='STATE_CHYE_CH') {
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'warehouseCardList'], fromJS([{}])))
            }
            if (oriState=='STATE_CHYE_TYDJ') {
                dispatch(editRunningActions.getWarehouseCardList('STATE_CHYE_TYDJ'))
            }
			break
		}
        case 'LB_CHZZ': {
            if (oriState=='STATE_CHZZ_ZZD') {
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'stockCardList'], fromJS([])))
            }
			break
		}
        case 'LB_GGFYFT': {
            dispatch(editRunningActions.getGgfyftProjectList())
            dispatch(editRunningActions.getProjectTreeList())
            dispatch(editRunningActions.getGgfyftList())
            break
        }
        case 'LB_XMJZ': {
            if (oriState=='STATE_XMJZ_QRSRCB') {
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'amount'], ''))
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'currentAmount'], ''))
            } else {
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'stockCardList'], fromJS([{amount: ''}])))
            }
            break
        }

		default: null
	}
}
