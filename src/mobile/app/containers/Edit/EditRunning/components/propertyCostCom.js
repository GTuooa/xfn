import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import { Row, Single, Icon } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'

//费用性质
export default class PropertyCostCom extends Component {
    //费用性质列表
    costList = (propertyCostList) => {
        let propertyList = []
        propertyCostList.forEach(v => {
            if (v == 'XZ_SALE') {
                propertyList.push({key: '销售费用', value: 'XZ_SALE'})
            } else if (v == 'XZ_MANAGE') {
                propertyList.push({key: '管理费用', value: 'XZ_MANAGE'})
            } else if (v == 'XZ_FINANCE') {
                propertyList.push({key: '财务费用', value: 'XZ_FINANCE'})
            }
        })

        return propertyList
    }

    render () {
        const { dispatch, categoryType, oriState, propertyCostList, propertyCost, beAccrued, hasSelect, isHandleCategory } = this.props

        //费用性质
		const propertyList = propertyCostList ? this.costList(propertyCostList.toJS()) : []
		let propertyCostName = '请选择费用性质'
        if (propertyCost) {
            propertyCostName = {'XZ_SALE': '销售费用', 'XZ_MANAGE': '管理费用', 'XZ_FINANCE': '财务费用', 'XZ_SCCB': '生产成本', 'XZ_FZSCCB': '辅助生产成本', 'XZ_ZZFY': '制造费用', 'XZ_HTCB': '合同成本', 'XZ_JJFY': '间接费用', 'XZ_JXZY': '机械作业',}[propertyCost]
        }

        let showProperty = false
        switch (categoryType) {
            case 'LB_FYZC': {
                showProperty = propertyList.length > 1 && oriState != 'STATE_FY_DJ' ? true : false
                if (isHandleCategory) {
                    showProperty = false
                }
                break
            }
            case 'LB_XCZC': {
                if (hasSelect && ['STATE_XC_FF', 'STATE_XC_JN'].includes(oriState)) {
                    showProperty = false
                } else {
                    showProperty = propertyList.length > 1 ? true : false
                }
                if (['STATE_XC_DK', 'STATE_XC_DJ'].includes(oriState)) {
                    showProperty = false
                }
                if (isHandleCategory) {
                    showProperty = false
                }
                break
            }
            case 'LB_ZJTX': {
                showProperty = isHandleCategory && propertyList.length > 1 ? true : false
                break
            }
            case 'LB_JZCB': {
                showProperty = isHandleCategory && oriState == 'STATE_YYSR_ZJ' && propertyList.length > 1 ? true : false
                break
            }
            case 'LB_JXSEZC': {
                showProperty = propertyList.length > 1 ? true : false
                if (isHandleCategory) {
                    showProperty = false
                }
                break
            }
            default: null
        }


        return showProperty ? (
                    <Row className={isHandleCategory ? 'lrls-more-card lrls-margin-top lrls-bottom' : 'lrls-more-card lrls-margin-top'}>
                        <label>费用性质: </label>
                        <Single
                            className='lrls-single'
                            district={propertyList}
                            value={propertyCost}
                            disabled={['XZ_SCCB', 'XZ_FZSCCB', 'XZ_ZZFY', 'XZ_HTCB', 'XZ_JJFY', 'XZ_JXZY'].includes(propertyCost)}
                            onOk={value => {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'propertyCost'], value.value))
                            }}
                        >
                            <Row className='lrls-padding lrls-category'>
                                <span className={['请选择费用性质', '生产成本', '辅助生产成本', '制造费用', '合同成本', '间接费用', '机械作业'].includes(propertyCostName) ? 'lrls-placeholder' : ''}>
                                    { propertyCostName }
                                </span>
                                <Icon type="triangle" />
                            </Row>
                        </Single>
                    </Row>
                ) : null
    }

}
