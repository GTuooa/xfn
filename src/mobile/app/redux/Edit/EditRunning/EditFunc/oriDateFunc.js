import { toJS, fromJS } from 'immutable'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import * as editRunning from 'app/constants/editRunning.js'


export function oriDateFunc (dispatch, state) {
    const oriTemp = state.get('oriTemp')
    const categoryType = state.getIn(['oriTemp', 'categoryType'])
    const oriState = state.getIn(['oriTemp', 'oriState'])
    const oriDate = state.getIn(['oriTemp', 'oriDate'])
    const beAccrued = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beAccrued'])//是否开启计提
    const beManagemented = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beManagemented'])//是否开启收付管理

    switch (categoryType) {
        case 'LB_ZSKX': {
            if (oriState === 'STATE_ZS_TH') {
                dispatch(editRunningActions.getZskxPaymentList())
            }
			break
		}
        case 'LB_ZFKX': {
            if (oriState === 'STATE_ZF_SH') {
                dispatch(editRunningActions.getZskxPaymentList())
            }
			break
		}
        case 'LB_JK': {
            if (beAccrued && oriState === 'STATE_JK_ZFLX') {
                dispatch(editRunningActions.getJkPendingStrongList())
            }
			break
		}
        case 'LB_TZ': {
            if (beAccrued && (oriState === 'STATE_TZ_SRGL' || oriState === 'STATE_TZ_SRLX')) {
                dispatch(editRunningActions.getTzPendingStrongList())
            }
			break
		}
        case 'LB_ZB': {
            if (beAccrued && oriState === 'STATE_ZB_ZFLR') {
                dispatch(editRunningActions.getZbPendingStrongList())
            }
			break
		}
        case 'LB_SFZC': {
            const propertyTax = oriTemp.get('propertyTax')
            if (propertyTax == 'SX_ZZS' && oriState == 'STATE_SF_JN') {
                dispatch(editRunningActions.getSfzcZzsList())
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
            if ((oriState == 'STATE_XC_JN' || oriState == 'STATE_XC_FF') && beAccrued) {
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
        case 'LB_YYSR': {
            if (oriState != 'STATE_YYSR_DJ' && beManagemented) {
                dispatch(editRunningActions.getYysrYyzcAmount())
            }
            break
        }
        case 'LB_YYZC': {
            if (oriState != 'STATE_YYZC_DJ' && beManagemented) {
                dispatch(editRunningActions.getYysrYyzcAmount())
            }
            break
        }
        case 'LB_FYZC': {
            if (oriState != 'STATE_FY_DJ' && beManagemented) {
                dispatch(editRunningActions.getYysrYyzcAmount())
            }
            break
        }
        case 'LB_KJFP': {
            dispatch(editRunningActions.getKjfpList())
			break
		}
        case 'LB_FPRZ': {
            dispatch(editRunningActions.getFprzList())
			break
		}
        case 'LB_JZSY': {
            dispatch(editRunningActions.getJzsyList())
			break
		}
        case 'LB_JZCB': {
            // dispatch(editRunningActions.getCostStockByCategory('', true))
            // dispatch(editRunningActions.getJzcbCategoryList())
            // dispatch(editRunningActions.getJzcbWarehouseList())
            // dispatch(editRunningActions.getCostStockCategory())
            if (oriState == 'STATE_YYSR_ZJ') {
                dispatch(editRunningActions.getJzcbCategoryList())
            } else {
                dispatch(editRunningActions.changeLrlsData(['cardAllList', 'stockCardList'], fromJS([])))
                dispatch(editRunningActions.changeLrlsData(['cardAllList', 'warehouseCardList'], fromJS([])))
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'relationCategoryUuid'], ''))
                dispatch(editRunningActions.getJzcbList(true))
                dispatch(editRunningActions.getCostStockByCategory('', true))
                dispatch(editRunningActions.getJzcbWarehouseList())
                dispatch(editRunningActions.getCostStockCategory())
                dispatch(editRunningActions.getJzcbCategoryList())
            }
			break
		}
        case 'LB_GGFYFT': {
            dispatch(editRunningActions.getGgfyftList())
			break
		}
        case 'LB_SFGL': {
            dispatch(editRunningActions.getSfglCardList())
            dispatch(editRunningActions.getSfglCategoryList())
            break
        }
        case 'LB_XMJZ': {
            dispatch(editRunningActions.getXmjzList())
            break
        }

		default: null
	}
}
