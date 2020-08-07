import { fromJS }	from 'immutable'
import * as editRunningActions from '../editRunning.action.js'
import * as editRunning from 'app/constants/editRunning.js'
import { DateLib } from 'app/utils'

//获取卡片列表数据
export function getCard(data, dispatch, fromYl, ylType) {
    const categoryType = data.get('categoryType')
    const propertyCarryover = ['SX_HW', 'SX_HW_FW'].includes(data.get('propertyCarryover')) ? true : false
    const beManagemented = data.getIn([editRunning.categoryTypeObj[categoryType], 'beManagemented'])//收付管理
    const beAccrued = data.getIn([editRunning.categoryTypeObj[categoryType], 'beAccrued'])// 是否计提
    const contactsManagement = data.getIn([editRunning.categoryTypeObj[categoryType], 'contactsManagement'])//往来管理

    const beProject = data.get('beProject')
    //获取项目卡片
    if (beProject) {
        const projectRange = data.get('projectRange')
        dispatch(editRunningActions.getProjectCardList(projectRange))
        dispatch(editRunningActions.getProjectTreeList())
    } else {
        if (fromYl) {
            dispatch(editRunningActions.changeLrlsData('projectList', fromJS([]), true))
        }
    }

    //获取往来卡片
    if (contactsManagement) {
        dispatch(editRunningActions.getCardList('contactsRange'))
        dispatch(editRunningActions.getCurrentTree())
        if (!fromYl) {//新增
            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedCurrent'], true))
        }
    }

    if (!contactsManagement && fromYl) {
        dispatch(editRunningActions.changeLrlsData('currentList', fromJS([]), true))
    }

    switch (categoryType) {
		case 'LB_YYSR': {
            if (propertyCarryover) {
                dispatch(editRunningActions.getCardList('stockRange'))
                dispatch(editRunningActions.getCostStockCategory())
            }
            if (!fromYl && beManagemented) {
                dispatch(editRunningActions.getYysrYyzcAmount())
            }
			break
		}
        case 'LB_YYZC': {
            if (propertyCarryover) {
                dispatch(editRunningActions.getCardList('stockRange'))
                dispatch(editRunningActions.getCostStockCategory())
            }
            if (!fromYl && beManagemented) {
                dispatch(editRunningActions.getYysrYyzcAmount())
            }
			break
		}
        case 'LB_FYZC': {
            if (!fromYl && beManagemented) {
                dispatch(editRunningActions.getYysrYyzcAmount())
            }
			break
		}
        case 'LB_SFZC': {
            if (fromYl) { break }
            const propertyTax = data.get('propertyTax')
            if (propertyTax == 'SX_ZZS') {//新增
                dispatch(editRunningActions.getSfzcZzsList())
                dispatch(editRunningActions.getSfzcNotPayList())
            }
            if (beAccrued && (propertyTax == 'SX_QTSF' || propertyTax == 'SX_QYSDS')) {//新增
                dispatch(editRunningActions.getSfzcNotPayList())
            }
            if (propertyTax == 'SX_GRSF') {//获取个人税费未处理金额
                dispatch(editRunningActions.getSfzcNotHandleAmount())
            }
            break
        }
        case 'LB_XCZC': {
            const propertyPay = data.get('propertyPay')
            const beWelfare = data.getIn([editRunning.categoryTypeObj[categoryType], 'beWelfare'])// 是否过渡福利费
            if (propertyPay == 'SX_GZXJ' && beAccrued) {//新增或复制
                if (fromYl && ylType=='MODIFY') {
                    break
                }
                dispatch(editRunningActions.getPaymentInfo())
                dispatch(editRunningActions.getSfzcNotHandleAmount())
            }
            if (['SX_SHBX', 'SX_ZFGJJ'].includes(propertyPay)) {//&& beAccrued
                if (fromYl && ylType=='MODIFY') {
                    break
                }
                dispatch(editRunningActions.getPaymentInfo())
            }
            if (beAccrued || beWelfare) {//新增
                if (fromYl && ylType=='MODIFY') {
                    break
                }
                dispatch(editRunningActions.getXczcPaymentList())
            }
			break
		}
        case 'LB_JK': {
            if (fromYl && ylType=='COPY') {//复制时用
                dispatch(editRunningActions.getJkPendingStrongList())
            }
			break
		}
        case 'LB_TZ': {
            if (fromYl && ylType=='COPY') {
                dispatch(editRunningActions.getTzPendingStrongList())
            }
			break
		}
        case 'LB_ZB': {
            if (fromYl && ylType=='COPY') {
                dispatch(editRunningActions.getZbPendingStrongList())
            }
			break
		}
        case 'LB_SFGL': {
            if (fromYl) { break }
            dispatch(editRunningActions.getSfglCardList())
            dispatch(editRunningActions.getSfglCategoryList())
            dispatch(editRunningActions.getSfglList())
            break
        }
        case 'LB_JZCB': {
            if (fromYl) { break }
            dispatch(editRunningActions.getJzcbList())
            dispatch(editRunningActions.getJzcbCategoryList())
            dispatch(editRunningActions.getCostStockCategory())
            dispatch(editRunningActions.getCostStockByCategory('', true))
            dispatch(editRunningActions.getJzcbWarehouseList())
            break
        }
        case 'LB_ZCWJZZS': {
            if (fromYl) { break }
            let month = new DateLib().valueOf().slice(0,7)
            dispatch(editRunningActions.changeLrlsData(['oriTemp', 'handleMonth'], month))
            dispatch(editRunningActions.getWjzzsList(month))
            break
        }
        case 'LB_GGFYFT': {
            dispatch(editRunningActions.getGgfyftProjectList())
            dispatch(editRunningActions.getProjectTreeList())
            dispatch(editRunningActions.getProjectShareType())
            if (fromYl) { break }
            dispatch(editRunningActions.getGgfyftList())
            break
        }
        case 'LB_FPRZ': {
            if (fromYl) { break }
            dispatch(editRunningActions.getFprzList())
            break
        }
        case 'LB_KJFP': {
            if (fromYl) { break }
            dispatch(editRunningActions.getKjfpList())
            break
        }
        case 'LB_JZSY': {
            if (fromYl) { break }
            dispatch(editRunningActions.getCqzcCategoryList('LB_JZSY'))
            break
        }
        case 'LB_ZJTX': {
            if (fromYl) { break }
            dispatch(editRunningActions.getCqzcCategoryList('LB_ZJTX'))
            break
        }
        case 'LB_CHDB':
        case 'LB_CHYE': {
            dispatch(editRunningActions.getCardList('stockRange'))
            dispatch(editRunningActions.getCostStockCategory())
            break
        }
        case 'LB_JXSEZC': {
            if (fromYl) {
                if (propertyCarryover) {
                    dispatch(editRunningActions.getCardList('stockRange'))
                    dispatch(editRunningActions.getCostStockCategory())
                }
                break
            }
            dispatch(editRunningActions.getJxsezcCategory())
            break
        }
        case 'LB_CHZZ': {
            dispatch(editRunningActions.getCostStockCategory())
            dispatch(editRunningActions.getStockListByCategory({top: true, uuid: ''}, 'stockRange'))
            break
        }
        case 'LB_CHTRXM': {
            dispatch(editRunningActions.getProjectTreeList())
            dispatch(editRunningActions.getGgfyftProjectList())
            dispatch(editRunningActions.getCardList('stockRange'))
            dispatch(editRunningActions.getCostStockCategory())
            break
        }
        case 'LB_XMJZ': {
            dispatch(editRunningActions.getProjectTreeList())
            dispatch(editRunningActions.getXmjzProjectList())
            dispatch(editRunningActions.getCardList('stockRange'))
            dispatch(editRunningActions.getCostStockCategory())
            if (fromYl) {
                dispatch(editRunningActions.getXmjzList(true))
            }
            break
        }

		default: console.log('无需获取卡片')
	}
}
