import React from 'react'
import { connect } from 'react-redux'
import { toJS, is ,fromJS } from 'immutable'

import { Select, Switch, Checkbox, Tooltip, message } from 'antd'
import { numberTest } from 'app/containers/Edit/EditRunning/common/common.js'
import { decimal, numberCalculate, formatMoney } from 'app/utils'
import Input from 'app/components/Input'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import XfnSelect from 'app/components/XfnSelect'
import { systemProJectCodeCommon } from 'app/containers/Config/Approval/components/common.js'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@connect(state => state)
export default
class AccountPandge extends React.Component {

    componentDidMount() {
		const uuid = this.props.allState.get('accountPoundage').get('categoryUuid')
		if (uuid) {
			this.props.dispatch(searchApprovalActions.getSearchApprovalAccountRunningCate(uuid))
		}
    }
    
    render() {
        const {
            type,
            dispatch,
            allState,
            receiveTotalMoney,
            editRunningModalState,
            approalCalculateState,
            poundage,
            poundageAmount,
            needUsedPoundage,
            handlingFeeType,
        } = this.props

        const poundageCurrentCardList = approalCalculateState.get('poundageCurrentCardList')
        const poundageProjectCardList = approalCalculateState.get('poundageProjectCardList')

        const accountPoundage = allState.get('accountPoundage')
        const projectCardList = editRunningModalState.get('projectCardList')
        const contactCardList = editRunningModalState.get('contactCardList')
        const accountProjectRange = approalCalculateState.getIn(['views', 'accountProjectRange'])
        const accountContactsRange = approalCalculateState.getIn(['views', 'accountContactsRange'])

        let transferOutAmount = 0, arriveAmount = 0
        if (type === '核记') {
            if (handlingFeeType === 'INCLUDE') {
                transferOutAmount = numberCalculate(receiveTotalMoney, poundageAmount)
                arriveAmount = receiveTotalMoney
            } else {
                transferOutAmount = receiveTotalMoney
                arriveAmount = numberCalculate(receiveTotalMoney, poundageAmount, 2, 'subtract')
            }
        }

        return(
            <div>
                <div className="approval-running-card-input-wrap">
                    <span>
                        <Checkbox
                            checked={needUsedPoundage}
                            onClick={() => {
                                dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('needUsedPoundage', !needUsedPoundage))
                            }}> 账户手续费</Checkbox>
                        {
                            accountPoundage.get('poundageNeedCurrent') && needUsedPoundage?
                            <Switch
                                className="use-unuse-style edit-running-switch"
                                checked={poundageCurrentCardList.size}
                                checkedChildren={'往来'}
                                unCheckedChildren={'往来'}
                                // disabled={strongList.size}
                                onChange={() => {
                                    if (poundageCurrentCardList.size) {
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
                                    } else {
                                        dispatch(searchApprovalActions.getApprovalRelativeCardList(accountContactsRange))
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([{}])))
                                    }
                                }}
                            />:''
                        }
                        {
                            accountPoundage.get('poundageNeedProject') && needUsedPoundage?
                            <Switch
                                className="use-unuse-style edit-running-switch"
                                checked={poundageProjectCardList.size}
                                // disabled={strongList.size}
                                checkedChildren={'项目'}
                                unCheckedChildren={'项目'}
                                style={{marginLeft:'10px'}}
                                onChange={() => {
                                    if (poundageProjectCardList.size) {
                                        // dispatch(editRunningActions.changeLrAccountCommonString('ori','poundageProjectCardList',fromJS([])))
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))
                                    } else {
                                        dispatch(searchApprovalActions.getApprovalProjectCardList(accountProjectRange))
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([{}])))
                                    }
                                }}
                            />:''
                        }
                    </span>
                </div>
                {
                    poundageCurrentCardList.size && needUsedPoundage?
                    <div className="approval-running-card-input-wrap">
                        <span className="approval-running-card-input-tip">往来单位：</span>
                        <span className="approval-running-card-input">
                            <XfnSelect
                                combobox
                                showSearch
                                value={`${poundageCurrentCardList && poundageCurrentCardList.getIn([0,'code'])?poundageCurrentCardList.getIn([0,'code']):''} ${poundageCurrentCardList && poundageCurrentCardList.getIn([0,'name'])?poundageCurrentCardList.getIn([0,'name']):''}`}
                                onChange={value => {
                                    const valueList = value.split(Limit.TREE_JOIN_STR)
                                    const cardUuid = valueList[0]
                                    const code = valueList[1]
                                    const name = valueList[2]
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([{cardUuid,name,code}])))
                                }}
                            >
                                {
                                    contactCardList.map((v, i) => <Option   key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{`${v.get('code')} ${v.get('name')}`}</Option>)
                                }
                            </XfnSelect>
                        </span>
                    </div>:''
                }
                {
                    poundageProjectCardList.size && needUsedPoundage ?
                    <div className="approval-running-card-input-wrap">
                        <span className="approval-running-card-input-tip">项目：</span>
                        <span className="approval-running-card-input">
                            <XfnSelect
                                combobox
                                showSearch
                                value={poundageProjectCardList && poundageProjectCardList.getIn([0,'code']) ? (systemProJectCodeCommon.indexOf(poundageProjectCardList.getIn([0,'code'])) === -1 ? `${poundageProjectCardList.getIn([0,'code'])} ${poundageProjectCardList.getIn([0,'name'])}` : `${poundageProjectCardList.getIn([0,'name'])}`) : ''}
                                onChange={value => {
                                    const valueList = value.split(Limit.TREE_JOIN_STR)
                                    const uuid = valueList[0]
                                    const code = valueList[1]
                                    const name = valueList[2]
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([{cardUuid:uuid,name,code}])))
                                }}
                            >
                                {
                                    projectCardList.map((v, i) =>
                                        <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>
                                            {`${systemProJectCodeCommon.indexOf(v.get('code')) === -1 ? v.get('code') : ''} ${v.get('name')}`}
                                        </Option>
                                )}
                            </XfnSelect>
                        </span> 
                    </div>: ''
                }
                {
                    needUsedPoundage ? 
                    <div>
                        <div className="approval-running-card-input-wrap" style={{display: type === '核记' ? 'none' : ''}}>
                            <span className="approval-running-card-input-tip">
                                收款金额：
                            </span>
                            <span className="approval-running-card-input">{receiveTotalMoney}</span>
                        </div>
                        <div className="approval-running-card-input-wrap">
                            <span className="approval-running-card-input-tip">手续费：</span>
                            <span className="approval-running-card-input">
                                <Input
                                    value={poundageAmount}
                                    onChange={(e) => {
                                        numberTest(e, (value) => {

                                            if (poundage && poundage.get('poundage') > 0 && Number(value) > poundage.get('poundage')) {
                                                return message.info('输入金额不可大于手续费上限')
                                            }
                                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['account', 'poundageAmount'], value))
                                        })
                                    }}
                                />
                            </span>
                        </div>
                        <div className="approval-running-card-input-wrap" style={{display: type === '核记' ? '' : 'none'}}>
                            <span className="approval-running-card-input-tip"></span>
                            <span className="approval-running-card-text">
                                {`转出金额:${formatMoney(transferOutAmount)}  到账金额:${formatMoney(arriveAmount)}  手续费：${formatMoney(poundageAmount)}`}
                            </span>
                            <Tooltip title="切换手续费计费方式">
                                <Switch
                                    className="use-unuse-style edit-running-switch lend-bg" 
                                    checked={handlingFeeType==='INCLUDE'}
                                    checkedChildren={''}
                                    unCheckedChildren={''}
                                    // disabled={strongList.size}
                                    onChange={() => {
                                        let newHandlingFeeType = handlingFeeType === 'INCLUDE' ? 'EXCLUDE' : 'INCLUDE'

                                        let sxAmount = 0
                                        if (newHandlingFeeType === 'INCLUDE') {
                                            const curPoundageAmount = numberCalculate(receiveTotalMoney, Number(poundage.get('poundageRate'))/1000,2,'multiply')
                                            sxAmount =  curPoundageAmount > poundage.get('poundage') && poundage.get('poundage') > 0 ? poundage.get('poundage') :curPoundageAmount
                                        } else {
                                            const curPoundageAmount = numberCalculate(numberCalculate(receiveTotalMoney,1+(Number(poundage.get('poundageRate'))/1000),4,'divide'),Number(poundage.get('poundageRate'))/1000,2,'multiply')
                                            sxAmount =  curPoundageAmount > poundage.get('poundage') && poundage.get('poundage') > 0 ? poundage.get('poundage') :curPoundageAmount
                                        }
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['account', 'poundageAmount'], sxAmount))
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('handlingFeeType', newHandlingFeeType))
                                    }}
                                />
                            </Tooltip>
                        </div>
                    </div>
                    : null
                }
            </div>
        )
    }
}