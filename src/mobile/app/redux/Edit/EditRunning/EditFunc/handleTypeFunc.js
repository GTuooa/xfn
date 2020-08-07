import { fromJS }	from 'immutable'
import * as editRunning from 'app/constants/editRunning.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import { abstractFunc } from './abstractFunc'
import { showProject } from './showProject'

export function handleTypeFunc (dispatch, state) {
    const oriTemp = state.get('oriTemp')
    const categoryType = state.getIn(['oriTemp', 'categoryType'])
    const oriState = state.getIn(['oriTemp', 'oriState'])
    const oriDate = state.getIn(['oriTemp', 'oriDate'])
    const handleType = oriTemp.get('handleType')//处理类型
    const beAccrued = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'beAccrued'])//是否开启计提

    //修改项目
    const beProject = state.getIn(['oriTemp', 'beProject'])
    if (beProject) {//类别开启了项目
        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedProject'], showProject(oriTemp)))
    }
    //修改摘要
    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'oriAbstract'], abstractFunc(oriState, state.get('oriTemp'))))

    //往来
    const contactsManagement = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'contactsManagement'])//往来管理
    if (contactsManagement) {
        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedCurrent'], true))
    }


    switch (categoryType) {
		case 'LB_JK': {
            if (beAccrued && handleType === 'JR_HANDLE_CHLX') {
                dispatch(editRunningActions.getJkPendingStrongList())
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedCurrent'], false))
            }
			break
		}
        case 'LB_TZ': {
            if (beAccrued && handleType === 'JR_HANDLE_QDSY') {
                dispatch(editRunningActions.getTzPendingStrongList())
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedCurrent'], false))
            }
			break
		}
        case 'LB_ZB': {
            if (beAccrued && handleType === 'JR_HANDLE_LRFP') {
                dispatch(editRunningActions.getZbPendingStrongList())
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedCurrent'], false))
            }
			break
		}
        case 'LB_CQZC': {
            const contactsManagement = oriTemp.getIn([editRunning.categoryTypeObj[categoryType], 'contactsManagement'])//是否开启收付管理
            if (contactsManagement) {
                dispatch(editRunningActions.getCardList('contactsRange'))
                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedCurrent'], true))
            }
            break
        }

		default: null
	}
}
