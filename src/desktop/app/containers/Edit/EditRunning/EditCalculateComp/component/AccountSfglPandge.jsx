import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import { Select, Icon, Divider, Switch, Checkbox } from 'antd'
import Input from 'app/components/Input'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import XfnSelect from 'app/components/XfnSelect'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney, numberCalculate } from 'app/utils'
import { getCategorynameByType, numberTest, regNegative, reg, CommonProjectTest } from '../../common/common'

import * as accountConfigActions from 'app/redux/Config/AccountConfig/accountConfig.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'

@immutableRenderDecorator
export default
class AccountSfglPandge extends React.Component {
    static displayName = 'AccountSfglPandge'
    render() {
        const {
            dispatch,
            accountPoundage,
            someTemp,
            projectList,
            insertOrModify,
            chooseFirstWay,
            amount,
            poundageRate,
            position,
            needAccount,
            accounts,
        } = this.props
        const poundageCurrentCardList = someTemp.get('poundageCurrentCardList')
        const poundageProjectCardList = someTemp.get('poundageProjectCardList')
        const needUsedPoundage = someTemp.get('needUsedPoundage')
        const accountProjectRange = someTemp.get('accountProjectRange')
		const accountContactsRange = someTemp.get('accountContactsRange')
		const accountContactsRangeList = someTemp.get('accountContactsRangeList')
		const accountProjectList = someTemp.get('accountProjectList')
        const accountName = someTemp.get('accountName')
        const accountUuid = position === 'Sfgl'? (needAccount ? accounts.some(v => v.get('accountUuid')) : someTemp.get('accountUuid')):someTemp.get('fromAccountName')
        const poundage = position === 'Sfgl' && needAccount ? accounts.getIn([0,'poundage','poundage']): someTemp.get('poundage')
        const needPoundage = position === 'Sfgl' && needAccount ? accounts.some(v => v.getIn(['poundage','needPoundage'])) : poundage.get('needPoundage')
        const poundageAmount = someTemp.get('poundageAmount')
        return(
            <div style={{display:needPoundage && accountUuid && accountPoundage.get('canUsed') && insertOrModify === 'insert'?'':'none'}}>
                <div style={{marginBottom:'10px'}}>
                    <span style={{margin:'0 10px 0 10px'}}>
                        <Checkbox
                            checked={needUsedPoundage}
                            onChange={(e) => {
                                if(position === 'InternalTransfer' && e.target.checked && amount){
                                    let sxAmount = 0
                                    if(chooseFirstWay){
                                        const curPoundageAmount = numberCalculate(amount,Number(poundageRate)/1000,2,'multiply')
                                        sxAmount =  curPoundageAmount > poundage.get('poundage') && poundage.get('poundage') > 0 ? poundage.get('poundage') :curPoundageAmount
                                    }else{
                                        const curPoundageAmount = numberCalculate(numberCalculate(amount,1+(Number(poundageRate)/1000),4,'divide'),Number(poundageRate)/1000,2,'multiply')
                                        sxAmount =  curPoundageAmount > poundage.get('poundage') && poundage.get('poundage') > 0 ? poundage.get('poundage') :curPoundageAmount
                                    }
                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'poundageAmount', sxAmount))
                                }
                                dispatch(editCalculateActions.changeEditCalculateCommonString(position,'needUsedPoundage',!needUsedPoundage))
                                !needUsedPoundage && dispatch(editCalculateActions.getAccountRunningCate(accountPoundage.get('categoryUuid'),position))

                            }}
                        >
                            账户手续费
                        </Checkbox>
                    </span>
                    {
                        accountPoundage.get('poundageNeedCurrent') && needUsedPoundage?
                        <Switch
                            className="use-unuse-style edit-running-switch"
                            checked={poundageCurrentCardList.size}
                            checkedChildren={'往来'}
                            unCheckedChildren={'往来'}
                            onChange={() => {
                                if (poundageCurrentCardList.size) {
                                    dispatch(editCalculateActions.changeEditCalculateCommonString(position,'poundageCurrentCardList',fromJS([])))
                                } else {
                                    dispatch(editCalculateActions.changeEditCalculateCommonString(position,'poundageCurrentCardList',fromJS([{}])))
                                }
                            }}
                        />:''
                    }
                    {
                        accountPoundage.get('poundageNeedProject') && needUsedPoundage?
                        <Switch
                            className="use-unuse-style edit-running-switch"
                            checked={poundageProjectCardList.size}
                            checkedChildren={'项目'}
                            unCheckedChildren={'项目'}
                            style={{marginLeft:'10px'}}
                            onChange={() => {
                                if (poundageProjectCardList.size) {
                                    dispatch(editCalculateActions.changeEditCalculateCommonString(position,'poundageProjectCardList',fromJS([])))
                                } else {
                                    dispatch(editCalculateActions.changeEditCalculateCommonString(position,'poundageProjectCardList',fromJS([{}])))
                                }
                            }}
                        />:''
                    }
                </div>
                {
                    poundageCurrentCardList.size && needUsedPoundage?
                    <div className="edit-running-modal-list-item">
                        <label>往来单位：</label>
                        <XfnSelect
                            combobox
                            showSearch
                            onDropdownVisibleChange={(open) => {
                                open && dispatch(editCalculateActions.getAccountContactsCardList(accountContactsRange,position))
                            }}
                            value={`${poundageCurrentCardList && poundageCurrentCardList.getIn([0,'code'])?poundageCurrentCardList.getIn([0,'code']):''} ${poundageCurrentCardList && poundageCurrentCardList.getIn([0,'name'])?poundageCurrentCardList.getIn([0,'name']):''}`}
                            onChange={value => {
                                const valueList = value.split(Limit.TREE_JOIN_STR)
                                const cardUuid = valueList[0]
                                const code = valueList[1]
                                const name = valueList[2]
                                dispatch(editCalculateActions.changeEditCalculateCommonString(position, ['poundageCurrentCardList',0], fromJS({cardUuid,name,code})))
                            }}
                        >
                            {
                                accountContactsRangeList.map((v, i) => <Option   key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{`${v.get('code')} ${v.get('name')}`}</Option>)
                            }
                        </XfnSelect>
                    </div>:''
                }
                {
                    poundageProjectCardList.size && needUsedPoundage?
                    <div className="edit-running-modal-list-item" >
                        <label>项目：</label>
                        <div className='chosen-right'>
                                <XfnSelect
                                    combobox
                                    showSearch
                                    value={`${poundageProjectCardList && poundageProjectCardList.getIn([0,'code']) && poundageProjectCardList.getIn([0,'code']) !== 'COMNCRD' && poundageProjectCardList.getIn([0,'code']) !== 'ASSIST' && poundageProjectCardList.getIn([0,'code']) !== 'MAKE' && poundageProjectCardList.getIn([0,'code']) !== 'INDIRECT' && poundageProjectCardList.getIn([0,'code']) !== 'MECHANICAL' ? poundageProjectCardList.getIn([0,'code']):''} ${poundageProjectCardList && poundageProjectCardList.getIn([0,'name'])?poundageProjectCardList.getIn([0,'name']):''}`}
                                    onDropdownVisibleChange={(open) => {
                                        open && dispatch(editCalculateActions.getAccountProjectCardList(accountProjectRange,position))
                                    }}
                                    onChange={value => {
                                       const valueList = value.split(Limit.TREE_JOIN_STR)
                                       const uuid = valueList[0]
                                       const code = valueList[1]
                                       const name = valueList[2]
                                       dispatch(editCalculateActions.changeEditCalculateCommonString(position, ['poundageProjectCardList',0], fromJS({cardUuid:uuid,name,code})))
                                   }}
                                   >
                                    {
                                        accountProjectList.map((v, i) =>
                                            <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>
                                                {`${v.get('code') !== 'COMNCRD' && v.get('code') !== 'ASSIST' && v.get('code') !== 'MAKE' && v.get('code') !== 'INDIRECT' && v.get('code') !== 'MECHANICAL' ?v.get('code'):''} ${v.get('name')}`}
                                            </Option>
                                    )}
                                </XfnSelect>
                            </div>
                        </div>:''
                }
                {
                    needUsedPoundage?
                    position === 'Sfgl' && accounts.size > 1 && needAccount ?
                    accounts.map((v,i) => {
                        const sxAmount = Math.abs(v.get('amount') || 0)*v.getIn(['poundage','poundageRate'])/1000>v.getIn(['poundage','poundage']) && v.getIn(['poundage','poundage']) !== -1?v.getIn(['poundage','poundage']):Math.abs(v.get('amount') || 0)*v.getIn(['poundage','poundageRate'])/1000
                        return(
                            <div style={{display:v.get('accountUuid') && v.getIn(['poundage','needPoundage'])?'':'none'}}>
                                <div className="edit-running-modal-list-item">
                                    <label>账户{i+1}：</label>
                                    <div>
                                        {v.get('accountName')}
                                    </div>
                                </div>
                                <div className="edit-running-modal-list-item">
                                    <label>支出金额：</label>
                                    <div>
                                        <Input
                                        className="lrls-account-box"
                                        placeholder=""
                                        value={v.get('poundageAmount')}
                                        onChange={(e) => {
                                            numberTest(e,(value) => {
                                                dispatch(editCalculateActions.changeEditCalculateCommonString(position,['accounts',i,'poundageAmount'],value))
                                            })
                                        }}
                                    />
                                        {/* {formatMoney(sxAmount)}<span style={{color:'#ccc'}}>(收款净额：{formatMoney(Math.abs(v.get('amount')) - Math.abs(sxAmount))})</span> */}
                                    </div>
                                </div>
                            </div>
                        )
                    }) :
                    <div className="edit-running-modal-list-item">
                        <label>{position === 'InternalTransfer' ? '手续费：' : '支出金额：'}</label>
                        <div>
                            <Input
                                className="lrls-account-box"
                                placeholder=""
                                value={poundageAmount}
                                onChange={(e) => {
                                    numberTest(e,(value) => {
                                        dispatch(editCalculateActions.changeEditCalculateCommonString(position, 'poundageAmount', value))
                                    })
                                }}
                            />
                            {/* {formatMoney(sxAmount)}<span style={{color:'#ccc'}}>(账户：{accountName},收款净额：{formatMoney(Math.abs(handlingAmount) - Math.abs(sxAmount))})</span> */}
                        </div>
                    </div>:''
                }
            </div>
        )
    }
}
