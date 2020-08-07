import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import { Single, Row, Icon } from 'app/components'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'

//流水状态组件
export default class HandleType extends Component {
    render () {
        const { dispatch, categoryType, disabled, handleType } = this.props

        let radioList = []
        let showHandleType = false
        let handleTypeList = []//处理类别列表
        let handleTypeName = ''

        switch (categoryType) {
            case 'LB_JK': {
                showHandleType = true
                handleTypeList = [
                    {key: '取得借款', value: 'JR_HANDLE_QDJK'},
                    {key: '偿还利息', value: 'JR_HANDLE_CHLX'},
                    {key: '偿还本金', value: 'JR_HANDLE_CHBJ'}
                ]
                handleTypeName = {JR_HANDLE_QDJK: '取得借款', JR_HANDLE_CHLX: '偿还利息', JR_HANDLE_CHBJ: '偿还本金'}[handleType]
                break
            }
            case 'LB_TZ': {
                showHandleType = true
                handleTypeList = [
                    {key: '对外投资', value: 'JR_HANDLE_DWTZ'},
                    {key: '取得收益', value: 'JR_HANDLE_QDSY'},
                    {key: '收回投资', value: 'JR_HANDLE_SHTZ'}
                ]
                handleTypeName = {JR_HANDLE_DWTZ: '对外投资', JR_HANDLE_QDSY: '取得收益', JR_HANDLE_SHTZ: '收回投资'}[handleType]
                break
            }
            case 'LB_ZB': {
                showHandleType = true
                handleTypeList = [
                    {key: '实收资本', value: 'JR_HANDLE_ZZ'},
                    {key: '资本溢价', value: 'JR_HANDLE_ZBYJ'},
                    {key: '利润分配', value: 'JR_HANDLE_LRFP'},
                    {key: '减资', value: 'JR_HANDLE_JZ'}
                ]
                handleTypeName = {JR_HANDLE_ZZ: '实收资本', JR_HANDLE_LRFP: '利润分配', JR_HANDLE_JZ: '减资', JR_HANDLE_ZBYJ: '资本溢价'}[handleType]
                break
            }
            case 'LB_CQZC': {
                showHandleType = true
                handleTypeList = [
                    {key: '购进资产', value: 'JR_HANDLE_GJ'},
                    {key: '处置', value: 'JR_HANDLE_CZ'}
                ]
                handleTypeName = {JR_HANDLE_GJ: '购进资产', JR_HANDLE_CZ: '处置'}[handleType]
                break
            }
            default: null
        }


        
        return showHandleType ? (
            <div className='lrls-more-card lrls-margin-top'>
                <label>处理类型:</label>
                <Single
                    className='lrls-single'
                    disabled={disabled}
                    district={handleTypeList}
                    value={handleType}
                    onOk={value => {
                        dispatch(editRunningActions.changeHandleType(value.value))
                    }}
                >
                    <Row className='lrls-padding lrls-category'>
                        <span>
                            { handleTypeName }
                        </span>
                        <Icon type="triangle" style={{color: disabled ? '#ccc' : ''}}/>
                    </Row>
                </Single>
            </div>
        ) : null
    }

}
