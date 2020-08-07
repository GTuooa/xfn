import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import { numberTest } from 'app/utils'
import { Select, Icon, Divider, Switch, Checkbox } from 'antd'
import Input from 'app/components/Input'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import XfnSelect from 'app/components/XfnSelect'
import { systemProJectCodeCommon } from 'app/containers/Config/Approval/components/common.js'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

// 核算里的收款的手续费
@immutableRenderDecorator
export default
class CalculatePandge extends React.Component {

    componentDidMount() {
        const uuid = this.props.accountPoundage.get('categoryUuid')
        const canUsed = this.props.accountPoundage.get('canUsed')
        if (uuid && canUsed) {
            this.props.dispatch(searchApprovalActions.getSearchApprovalAccountRunningCate(uuid))
        }
    }

    componentWillReceiveProps(nextprops) {

        const amount = nextprops.modalTemp.get('amount')
        if (!nextprops.modalTemp.get('accounts')) {
            return
        }
        const accounts = nextprops.modalTemp.get('accounts')
        const poundage = accounts.getIn([0,'poundage','poundage'])
        const oldAmount = this.props.modalTemp.get('amount')

        if (amount !== oldAmount) {
            const sxAmount = Math.abs(amount || 0)*accounts.getIn([0,'poundage','poundageRate'])/1000> poundage && poundage > 0
                ? poundage
                : Math.abs(amount || 0)*accounts.getIn([0,'poundage','poundageRate'])/1000
            this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'accounts',0,'poundageAmount'],(sxAmount || 0).toFixed(2)))
        }
    }

    render() {
        const {
            dispatch,
            accountPoundage,
            flags,
            modalTemp,
            projectCardList,
            contactCardList,
        } = this.props

        const poundageCurrentCardList = modalTemp.get('poundageCurrentCardList') || fromJS([])
        const poundageProjectCardList = modalTemp.get('poundageProjectCardList') || fromJS([])
        const needUsedPoundage = modalTemp.get('needUsedPoundage')
        const accountProjectRange = flags.get('accountProjectRange')
		const accountContactsRange = flags.get('accountContactsRange')
        const poundageAmount = modalTemp.getIn(['accounts',0,'poundageAmount'])
        const accountUuid = modalTemp.getIn(['accounts',0,'accountUuid'])
        const poundage = modalTemp.getIn(['accounts',0,'poundage']) || fromJS({})
        const needPoundage = poundage.get('needPoundage')
        const canUsed = accountPoundage.get('canUsed')

        return(
            <div style={{display:needPoundage && accountUuid && canUsed?'':'none'}}>
                <div style={{marginBottom:'10px'}}>
                    <span>
                        <Checkbox
                            style={{width:'auto',fontSize:'12px'}}
                            checked={needUsedPoundage}
                            onChange={(e) => {
                                dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'needUsedPoundage'], !needUsedPoundage))
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
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'poundageCurrentCardList'], fromJS([])))
                                } else {
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'poundageCurrentCardList'], fromJS([{}])))
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
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'poundageProjectCardList'], fromJS([])))
                                } else {
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'poundageProjectCardList'], fromJS([{}])))
                                }
                            }}
                        />:''
                    }
                </div>
                {
                    poundageCurrentCardList.size && needUsedPoundage?
                    <div className="manager-item">
                        <label>往来单位：</label>
                        <XfnSelect
                            combobox
                            showSearch
                            onDropdownVisibleChange={(open) => {
                                open && dispatch(searchApprovalActions.getApprovalRelativeCardList(accountContactsRange))
                            }}
                            value={`${poundageCurrentCardList && poundageCurrentCardList.getIn([0,'code'])?poundageCurrentCardList.getIn([0,'code']):''} ${poundageCurrentCardList && poundageCurrentCardList.getIn([0,'name'])?poundageCurrentCardList.getIn([0,'name']):''}`}
                            onChange={value => {
                                const valueList = value.split(Limit.TREE_JOIN_STR)
                                const cardUuid = valueList[0]
                                const code = valueList[1]
                                const name = valueList[2]
                                dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'poundageCurrentCardList',0], fromJS({cardUuid,name,code})))
                            }}
                        >
                            {
                                contactCardList.map((v, i) => <Option   key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{`${v.get('code')} ${v.get('name')}`}</Option>)
                            }
                        </XfnSelect>
                    </div>:''
                }
                {
                    poundageProjectCardList.size && needUsedPoundage?
                    <div className="manager-item" >
                        <label>项目：</label>
                            <XfnSelect
                                combobox
                                showSearch
                                value={poundageProjectCardList && poundageProjectCardList.getIn([0,'code']) ? (systemProJectCodeCommon.indexOf(poundageProjectCardList.getIn([0,'code'])) === -1 ? `${poundageProjectCardList.getIn([0,'code'])} ${poundageProjectCardList.getIn([0,'name'])}` : `${poundageProjectCardList.getIn([0,'name'])}`) : ''}
                                onDropdownVisibleChange={(open) => {
                                    open && dispatch(searchApprovalActions.getApprovalProjectCardList(accountProjectRange))
                                }}
                                onChange={value => {
                                   const valueList = value.split(Limit.TREE_JOIN_STR)
                                   const uuid = valueList[0]
                                   const code = valueList[1]
                                   const name = valueList[2]
                                   dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp', 'poundageProjectCardList',0], fromJS({cardUuid:uuid,name,code})))
                               }}
                               >
                                {
                                    projectCardList.map((v, i) =>
                                        <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>
                                            {`${systemProJectCodeCommon.indexOf(v.get('code')) === -1 ? v.get('code') : ''} ${v.get('name')}`}
                                        </Option>
                                    )
                                }
                            </XfnSelect>
                        </div>:''
                }
                {
                    needUsedPoundage?
                    <div style={{display:'flex'}} className='manager-item'>
                        <label>支出金额：</label>
                            <Input
                                placeholder=""
                                value={poundageAmount}
                                onChange={(e) => {
                                    numberTest(e,(value) => {
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['modalTemp','accounts',0,'poundageAmount'], value))
                                    })
                                }}
                            />
                    </div>:''
                }
            </div>
        )
    }
}
