import React from 'react'
import { toJS, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Checkbox, Radio, Tooltip } from 'antd'
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'

@immutableRenderDecorator
export default class BusinessWater extends React.Component {

    static displayName = 'BusinessWater'

    render(){
        const {
            flags,
            dispatch,
            showModal,
            insertOrModify,
            runningTemp,
            runningCategory,
            BusinessWter,
            direction,
            categoryTypeObj,
            newJr,
            enableInventory
        } = this.props

        const property = runningTemp.get('property')
        const level = runningTemp.get('level')
        const propertyCarryover = runningTemp.get('propertyCarryover')
        const categoryType = runningTemp.get('categoryType')
        const allStockRange = runningTemp.getIn([categoryTypeObj,'allStockRange'])
        const stockRange = runningTemp.getIn([categoryTypeObj,'stockRange'])
        const currentStockRange = runningTemp.getIn([categoryTypeObj,'currentStockRange'])
        const canModifyProperty = runningTemp.getIn([categoryTypeObj,'canModifyProperty'])
        let acBusinessAc, acBusinessFunc
        if(direction === 'debit') {
            acBusinessAc = runningTemp.getIn(['acBusinessIncome', 'incomeAc'])
            acBusinessFunc = ['acBusinessIncome' , 'incomeAc']
        }else{
            acBusinessAc = runningTemp.getIn(['acBusinessExpense', 'payAc'])
            acBusinessFunc = ['acBusinessExpense' , 'payAc']
        }
        const acBusinessIncomeList = acBusinessAc ? acBusinessAc.map(u => `${u.get('acId')} ${u.get('acFullName')}`) : fromJS([])

        return(
            categoryType === 'LB_YYSR' || categoryType === 'LB_YYZC' ?
            <div  className='accountConf-modal-list-blockitem no-margin' >
                <div className="accountConf-modal-list-blockitem small-margin">
                    <span>{`${direction === 'debit'?'收入':'成本'}属性：`}</span>
                    <RadioGroup
                        onChange={(e) => {
                            dispatch(runningConfActions.changeRunningConfCommonString('running', 'propertyCarryover' ,e.target.value))
                            if (e.target.value === 'SX_HW' || e.target.value === 'SX_HW_FW') {
                                if (!stockRange.size && allStockRange.size) {
                                    dispatch(runningConfActions.changeCardCheckboxArr(categoryTypeObj, 'stockRange', allStockRange.getIn([0, 'uuid']), true))
                                }
                            }
                        }}
                        disabled={insertOrModify === 'insert' && level !== 1 || insertOrModify === 'modify' && !canModifyProperty}
                        value={propertyCarryover}
                    >
                        <Tooltip placement="topLeft" title={`${!enableInventory?'账套没有启用存货管理':''}`}><Radio key="a" value='SX_HW' disabled={!enableInventory}>货物</Radio></Tooltip>
                        <Radio key="b" value='SX_FW'>服务</Radio>
                        {
                            categoryType === 'LB_YYSR' && newJr && enableInventory?
                            <Radio key="c" value='SX_HW_FW'>货物 + 服务</Radio>:''
                        }
                   </RadioGroup>
                </div>
                <div className='accountConf-modal-list-blockitem small-margin' style={{display:propertyCarryover === 'SX_HW' || propertyCarryover === 'SX_HW_FW' ? '' : 'none'}}>
                    <span>存货范围：</span>
                    {
                       allStockRange.map(v =>
                            <span>
                                <Checkbox
                                    checked={stockRange.find(w => w === v.get('uuid'))}
                                    // disabled={(insertOrModify == 'insert' && !currentStockRange.find(w => w === v.get('uuid')) || insertOrModify == 'modify' && !v.get('canUse')) && level !== 1 }
                                    onChange={(e) => {
                                        dispatch(runningConfActions.changeCardCheckboxArr(categoryTypeObj, 'stockRange', v.get('uuid'),e.target.checked))
                                    }}
                                />
                                {v.get('name')}
                                {/* <Tooltip placement="topLeft" title={`${(insertOrModify == 'insert' && !currentStockRange.find(w => w === v.get('uuid'))|| insertOrModify == 'modify' && !v.get('canUse')) && level !== 1?'上级未启用':''}`}>{v.get('name')}</Tooltip> */}
                            </span>
                        )
                    }
                </div>
            </div> : null
        )
    }
}
