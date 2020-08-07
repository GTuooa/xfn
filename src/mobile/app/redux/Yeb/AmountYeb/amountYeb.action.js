import { showMessage } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant'
import * as allActions from 'app/redux/Home/All/other.action'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'

export const getPeriodAndCountListFetch = () => dispatch => {

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi('getCountList', 'POST', JSON.stringify({
        year: '',
        month: '',
        getPeriod: 'true'
    }), json => {
		if (showMessage(json)) {
            thirdParty.toast.hide()
            const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
            const issuedateNew = openedissuedate
            const countList = {data: json.data.jsonArray}
            dispatch(freshAmountKmyeb(countList, issuedateNew, ''))
            dispatch(changeShortData('assCategoryList', json.data.assCategoryList))
		}
	})

}

export const getAmountKmyebListFetch = (issuedate, endissuedate, queryByAss, moreAss) => (dispatch, getState) => {
    const assObject = getState().amountYebState.get('assObject')

    let url = ''
	let options = {}
    let isGetCountList = false//为true时字段需要更改

	if (!endissuedate) {//单账期
		url = 'getCountList'
        isGetCountList = true
		options = {
			year: issuedate ? issuedate.substr(0, 4) : '',
			month: issuedate ? issuedate.substr(5, 2) : '',
		}
        if (queryByAss) {
            url = 'getAmountKmyueList'
            isGetCountList = false
            options.assObject = {
                assCategory: assObject.get('assCategory'),
                queryBySingleAc: assObject.get('queryBySingleAc'),
                acId: assObject.get('acId')
            }
        }
        if (moreAss) {//多辅助核算
            url = 'getAmountAssTwoKmyueList'
            isGetCountList = false
            options.beginYear = issuedate ? issuedate.substr(0, 4) : ''
            options.beginMonth = issuedate ? issuedate.substr(5, 2) : ''
            options.endYear = ''
            options.endMonth = ''
            options.assObject.assSecondCategory = assObject.get('assSecondCategory')
            options.assObject.secondAssKey = assObject.get('secondAssKey')
        }

	} else {//跨账期
		url = 'getMoreCountList'
        isGetCountList = true
        const beginYear = issuedate ? issuedate.substr(0, 4) : ''
        const beginMonth = issuedate ? issuedate.substr(5, 2) : ''
        const endYear = endissuedate ? endissuedate.substr(0, 4) : beginYear
        const endMonth = endissuedate ? endissuedate.substr(5, 2) : beginMonth
		options = {
			beginYear,
			beginMonth,
			endYear,
			endMonth,
		}
        if (queryByAss) {
            url = 'getMoreAmountKmyueList'
            isGetCountList = false
            options.assObject = {
                assCategory: assObject.get('assCategory'),
                queryBySingleAc: assObject.get('queryBySingleAc'),
                acId: assObject.get('acId')
            }
        }
        if (moreAss) {//多辅助核算
            url = 'getAmountAssTwoKmyueList'
            isGetCountList = false
            options.assObject.assSecondCategory = assObject.get('assSecondCategory')
            options.assObject.secondAssKey = assObject.get('secondAssKey')
        }
	}

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(url, 'POST', JSON.stringify(options), json => {
		if (showMessage(json)) {
            thirdParty.toast.hide()
            dispatch(freshAmountKmyeb(json, issuedate, endissuedate, isGetCountList))
		}
	})
}

const freshAmountKmyeb = (json, issuedate, endissuedate, isGetCountList) => dispatch => {
    dispatch({
        type: ActionTypes.GET_PERIOD_AND_COUNT_LIST_FETCH,
        receivedData: isGetCountList ? json.data.baList : json.data,
        issuedate,
        endissuedate
    })
}

export const toggleLowerAmountYeb = (acid, queryByAss) => ({
    type: ActionTypes.TOGGLE_LOWER_AMOUNTYEB,
    acid,
    queryByAss
})

//初始化
export const initAmountYeb = () => ({
	type: ActionTypes.INIT_AMOUNTYEB
})

export const changeData = (dataType, value) => ({
    type: ActionTypes.CHANGE_DATA_AMOUNTYEB,
    dataType,
    value
})

export const changeShortData = (dataType, value) => ({
    type: ActionTypes.CHANGE_SHORT_DATA_AMOUNTYEB,
    dataType,
    value
})

//获取科目树
export const getAmountKmTree = (issuedate, endissuedate, assCategory) => dispatch => {

    const beginYear = issuedate ? issuedate.substr(0, 4) : ''
    const beginMonth = issuedate ? issuedate.substr(5, 2) : ''
    const endYear = endissuedate ? endissuedate.substr(0, 4) : beginYear
    const endMonth = endissuedate ? endissuedate.substr(5, 2) : beginMonth

    dispatch(changeData(['assObject', 'acId'], ''))
    dispatch(changeData(['assObject', 'acKey'], ''))
    dispatch(changeData(['assObject', 'acName'], '全部科目'))

    fetchApi('getAmountKmTree', 'POST', JSON.stringify({
        begin: `${beginYear}${beginMonth}`,
        end: `${endYear}${endMonth}`,
        assCategory
    }), json => {
		if (showMessage(json)) {
            let acTree = [{key: '', label: '全部科目', acid: '', acname: '全部科目', ackey: '', childList: []}]
            json.data.forEach(v => {
                v['key'] = v['acid']
                v['label'] = `${v['acid']} ${v['acname']}`
                v['childList'] = []
                acTree.push(v)
            })
            dispatch(changeShortData('acTree', acTree))

		}
	})
}

//获取辅助类别树
export const getAmountAssTwoTree = (issuedate, endissuedate, assCategory, acId, acKey) => dispatch => {

    const beginYear = issuedate ? issuedate.substr(0, 4) : ''
    const beginMonth = issuedate ? issuedate.substr(5, 2) : ''
    const endYear = endissuedate ? endissuedate.substr(0, 4) : beginYear
    const endMonth = endissuedate ? endissuedate.substr(5, 2) : beginMonth

    dispatch(changeData(['assObject', 'secondAssKey'], ''))
    dispatch(changeData(['assObject', 'secondAssName'], '全部'))
    dispatch(changeData(['assObject', 'secondAssId'], ''))

    fetchApi('getAmountAssTwoTree', 'POST', JSON.stringify({
        begin: `${beginYear}${beginMonth}`,
        end: `${endYear}${endMonth}`,
        assCategory,
        acId,
        acKey
    }), json => {
		if (showMessage(json)) {
            let assTree = [{uuid: '', name: '全部', asskey: '', assname: '全部'}]
            json.data.assList.forEach(v => {
                v['uuid'] = v['asskey']
                v['name'] = v['assname']
                assTree.push(v)
            })
            dispatch(changeData(['assObject', 'assSecondCategory'], json.data.assCategory))
            dispatch(changeShortData('assTree', assTree))

		}
	})
}
