import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import { ChosenPicker, Row, Icon } from 'app/components'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import * as thirdParty from 'app/thirdParty'

const loop = (data) => {
    data.forEach(v => {
        v['key'] = v['uuid']
        v['label'] = v['name']
        if (v['childList'].length) {
            loop(v['childList'])
        }
    })
}

//流水状态组件
export default class HandleCategory extends Component {
    render () {
        const { dispatch, categoryType, disabled, categoryList, uuid, name, beProject, showJzcb, oriState } = this.props

        let showHandleCategory = false
        let onChange = null
        let parentDisabled = true

        let categoryListTree = categoryList.toJS()
        loop(categoryListTree)

        switch (categoryType) {
            case 'LB_JZSY': {
                showHandleCategory = true
                onChange = (item) => {
                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'relationCategoryUuid'], item['uuid']))
                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'relationCategoryName'], item['name']))
                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'beProject'], item['beProject']))
                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedProject'], item['beProject']))
                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'projectRange'], fromJS(item['projectRange'])))
                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'projectCardList'], fromJS([{amount: ''}])))
                    dispatch(editRunningActions.getJzsyList())
                    if (item['beProject']) {
                        dispatch(editRunningActions.getProjectCardList(item['projectRange']))
                        dispatch(editRunningActions.getProjectTreeList())
                    }
                }
                break
            }
            case 'LB_ZJTX': {
                showHandleCategory = true
                onChange = (item) => {
                    dispatch(editRunningActions.zjtxSelectCategory(fromJS(item)))
                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'projectRange'], fromJS(item['projectRange'])))
                    if (item['beProject']) {
                        dispatch(editRunningActions.getProjectCardList(item['projectRange']))
                        dispatch(editRunningActions.getProjectTreeList())
                    }
                }
                break
            }
            case 'LB_JZCB': {
                showHandleCategory = showJzcb
                onChange = (item) => {
                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'relationCategoryUuid'], item['uuid']))
                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'relationCategoryName'], item['name']))
                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'relationCategoryType'], item['categoryType']))
                    dispatch(editRunningActions.getCostStockByCategory('', true))
                    dispatch(editRunningActions.getCostStockCategory())

                    if (oriState == 'STATE_YYSR_ZJ') {
                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'beProject'], item['beProject']))
                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedProject'], item['beProject']))
                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'projectCardList'], fromJS([{}])))
                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'projectRange'], fromJS(item['projectRange'])))
                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'propertyCostList'], fromJS(item['propertyCostList'])))
                        if (item['beProject']) {
                            dispatch(editRunningActions.getProjectCardList(item['projectRange']))
                            dispatch(editRunningActions.getProjectTreeList())
                        }
                        let propertyCost=''
                        if (item['propertyCostList'] && item['propertyCostList'].length > 0) {
                            propertyCost = item['propertyCostList'][0]
                        }
                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'propertyCost'], propertyCost))
                    } else {
                        dispatch(editRunningActions.changeLrlsData(['oriTemp', 'usedProject'], false))
                    }

                }
                break
            }
            case 'LB_JXSEZC': {
                showHandleCategory = true
                onChange = (item) => {
                    dispatch(editRunningActions.changeHandleCategory(item))
                }
                break
            }
            default: null
        }



        return showHandleCategory ? (
            <Row className={showJzcb ? 'lrls-more-card' : 'lrls-more-card lrls-margin-top'}>
                <label>处理类别: </label>
                <div className='antd-single-picker'>
                    <ChosenPicker
                        district={categoryListTree}
                        parentDisabled={parentDisabled}
                        value={uuid}
                        disabled={disabled}
                        onChange={(item) => {
                            onChange(item)
                        }}
                    >
                        <Row className='lrls-padding lrls-category'
                            onClick={(e) => {
                                if (categoryList.size==0 && ['LB_JZSY', 'LB_ZJTX'].includes(categoryType)) {
                                    e.stopPropagation()
                                    return thirdParty.toast.info('无处理类别，请在流水设置-长期资产中新建', 2)
                                }
                                if (categoryList.size==0 && showJzcb) {
                                    e.stopPropagation()
                                    return thirdParty.toast.info('无匹配的处理类别', 2)
                                }
                            }}
                        >
                            <span className={name =='请选择处理类别' ? 'lrls-placeholder' : ''}>{name}</span>
                            <Icon type="triangle" style={{color: disabled ? '#ccc' : ''}}/>
                        </Row>
                    </ChosenPicker>
                </div>
            </Row>
        ) : null
    }

}
