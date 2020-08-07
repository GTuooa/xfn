import { toJS, fromJS } from 'immutable'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import fetchApi from 'app/constants/fetch.running.js'

import { editRunningTemp } from '../template.js'
import { check } from './check.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import * as editRunning from 'app/constants/editRunning.js'

export function save (dispatch, state, scale, saveAndNew, isOpenedWarehouse, showRepeatJrindex) {
    const oriTemp = state.get('oriTemp').toJS()
    const categoryType = oriTemp['categoryType']
    const oriState = oriTemp['oriState']
    const isInsert = state.getIn(['views', 'insertOrModify']) === 'insert' ? true : false
    const isCopy = state.getIn(['views', 'ylType']) === 'COPY' ? true : false
    const url = (isInsert || isCopy) ? editRunning.urlInsert[categoryType] : editRunning.urlModify[categoryType]

    //附件
    // const oldEnclosureList = state.get('enclosureList').toJS()
    // const needDeleteUrl = state.get('needDeleteUrl').toJS()
    const enclosureList = state.get('enclosureList').toJS()

    let data = {}
    for (let key in editRunningTemp[categoryType][oriState]) {
        data[key] = oriTemp[key]
    }

    //校验
    const errorList = check(state.get('oriTemp'), data, scale, isInsert, isCopy, isOpenedWarehouse)
    if (errorList.length) {
        return thirdParty.toast.info(errorList[0])
    }

    if (!isInsert && !isCopy) {//修改多两个参数
        data['oriUuid'] = oriTemp['oriUuid']
        data['jrUuid'] = oriTemp['jrUuid']
        data['jrIndex'] = oriTemp['jrIndex']
        data['encodeType'] = oriTemp['encodeType']
        if (oriTemp['jrIndex']=='' || oriTemp['jrIndex'].length > 6) {
            return thirdParty.toast.info('流水号不能为空且不能超过6位')
        }
    }

    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    fetchApi(url, 'POST', JSON.stringify({
        ...data,
        projectCardList: data['usedProject'] ? data['projectCardList'] : undefined,
        enclosureList,
    }), json => {
        thirdParty.toast.hide()
        if (json.code !== 0) {
            thirdParty.toast.fail(`${json.code} ${json.message}`)
        } else {

            if (!isInsert && json.data.encodeType) {
                let encodeList = [
                    {key:'1',value:'系统自动编号'},
                    {key:'2',value:'插入流水号'}
                ]
                if (json.data.encodeType=='1') {
                    encodeList = [{key:'1',value:'系统自动编号'}]
                }
                if (json.data.encodeType=='2') {
                    encodeList = [{key:'2',value:'插入流水号'}]
                }
                showRepeatJrindex(json.data.encodeType=='2' ? '2' : '1', encodeList)
                return
            }

            if (json.data.jrIndexList) {
                thirdParty.toast.success(`已生成如下流水：记 ${json.data.jrIndex} 号${json.data.jrIndexList.map((v,i) => `、记 ${v} 号`)}`, 2)
            } else if (isInsert && json.data.jrIndex) {
                thirdParty.toast.success(`已生成如下流水：记 ${json.data.jrIndex} 号`, 2)
            } else {
                thirdParty.toast.success('保存成功', 2)
            }

            if (saveAndNew) { //保存并新增
                dispatch(editRunningActions.getCardDetail(oriTemp['categoryUuid']))
                dispatch(editRunningActions.changeLrlsEnclosureList())
            } else { //保存--重新获取流水
                const oriUuid = (isInsert || isCopy) ? json.data.oriUuid : data['oriUuid']
                dispatch(editRunningActions.getOriRunning(oriUuid))
            }
        }


    })





}
