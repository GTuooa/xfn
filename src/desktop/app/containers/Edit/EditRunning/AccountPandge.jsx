import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import { Select, Icon, Divider, Switch, Checkbox } from 'antd'
import { getCategorynameByType, numberTest, regNegative, reg, projectCodeTest } from './common/common'
import Input from 'app/components/Input'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import XfnSelect from 'app/components/XfnSelect'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney } from 'app/utils'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as accountConfigActions from 'app/redux/Config/AccountConfig/accountConfig.action'

@immutableRenderDecorator
export default
class AccountComp extends React.Component {
    componentDidMount() {
        const uuid = this.props.accountPoundage.get('categoryUuid')
        if (uuid && this.props.insertOrModify === 'insert') {
            this.props.dispatch(editRunningActions.getAccountRunningCate(uuid))
        }
    }
    componentWillReceiveProps(nextprops) {
        const amount = nextprops.amount || nextprops.oriTemp.get('amount')
        const accounts = nextprops.oriTemp.get('accounts')
        const usedAccounts = nextprops.oriTemp.get('usedAccounts')
        const insertOrModify = nextprops.insertOrModify
        const poundage = accounts.getIn([0,'poundage','poundage'])
        const oldAmount = this.props.amount || this.props.oriTemp.get('amount')
        if (amount !== oldAmount && !usedAccounts && insertOrModify === 'insert') {
            const sxAmount = Math.abs(amount || 0)*accounts.getIn([0,'poundage','poundageRate'])/1000> poundage && poundage > 0
                ? poundage
                : Math.abs(amount || 0)*accounts.getIn([0,'poundage','poundageRate'])/1000
            this.props.dispatch(editRunningActions.changeLrAccountCommonString('ori',['accounts',0,'poundageAmount'],(sxAmount || 0).toFixed(2)))
        }

    }
    render() {
        const {
            accounts,
            dispatch,
            accountPoundage,
            oriTemp,
            projectList,
            accountContactsRangeList,
            accountProjectList,
            accountProjectRange,
            accountContactsRange,
            insertOrModify,
        } = this.props
        const poundageCurrentCardList = oriTemp.get('poundageCurrentCardList')
        const poundageProjectCardList = oriTemp.get('poundageProjectCardList')
        const needUsedPoundage = oriTemp.get('needUsedPoundage')
        const strongList = oriTemp.get('strongList')
        const oriState = oriTemp.get('oriState')
        const categoryType = oriTemp.get('categoryType')
        const usedAccounts = oriTemp.get('usedAccounts')
        const amount = this.props.amount || oriTemp.get('amount')
        const code = poundageProjectCardList.getIn([0,'code'])
        const poundage = accounts.getIn([0,'poundage','poundage'])
        const sxAmount = Math.abs(amount || 0)*accounts.getIn([0,'poundage','poundageRate'])/1000> poundage && poundage > 0
            ? poundage
            : Math.abs(amount || 0)*accounts.getIn([0,'poundage','poundageRate'])/1000
        return(
            <div style={{display:accounts.some(v => v.getIn(['poundage','needPoundage'])) && accounts.some(v => v.get('accountUuid')) && accountPoundage.get('canUsed') && insertOrModify === 'insert'?'':'none'}}>
                <div style={{marginBottom:'10px'}}>
                    <span style={{margin:'0 10px 0 0'}}>
                        <Checkbox
                            checked={needUsedPoundage}
                            onChange={(e) => {
                                dispatch(editRunningActions.changeLrAccountCommonString('ori','needUsedPoundage',!needUsedPoundage))
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
                            disabled={strongList.size}
                            onChange={() => {
                                if (poundageCurrentCardList.size) {
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','poundageCurrentCardList',fromJS([])))
                                } else {
                                    dispatch(editRunningActions.getAccountContactsCardList(accountContactsRange))
                                    // dispatch(editRunningActions.changeLrAccountCommonString('ori','poundageCurrentCardList',fromJS([{}])))
                                }
                            }}
                        />:''
                    }
                    {
                        accountPoundage.get('poundageNeedProject') && needUsedPoundage?
                        <Switch
                            className="use-unuse-style edit-running-switch"
                            checked={poundageProjectCardList.size}
                            disabled={strongList.size}
                            checkedChildren={'项目'}
                            unCheckedChildren={'项目'}
                            style={{marginLeft:'10px'}}
                            onChange={() => {
                                if (poundageProjectCardList.size) {
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','poundageProjectCardList',fromJS([])))
                                } else {
                                    // dispatch(editRunningActions.changeLrAccountCommonString('ori','poundageProjectCardList',fromJS([{}])))
                                    dispatch(editRunningActions.getAccountProjectCardList(accountProjectRange))
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
                            value={`${poundageCurrentCardList && poundageCurrentCardList.getIn([0,'code'])?poundageCurrentCardList.getIn([0,'code']):''} ${poundageCurrentCardList && poundageCurrentCardList.getIn([0,'name'])?poundageCurrentCardList.getIn([0,'name']):''}`}
                            onChange={value => {
                                const valueList = value.split(Limit.TREE_JOIN_STR)
                                const cardUuid = valueList[0]
                                const code = valueList[1]
                                const name = valueList[2]
                                dispatch(editRunningActions.changeLrAccountCommonString('ori', ['poundageCurrentCardList',0], fromJS({cardUuid,name,code})))
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
                                    value={`${poundageProjectCardList && projectCodeTest(code)?code:''} ${poundageProjectCardList && poundageProjectCardList.getIn([0,'name'])?poundageProjectCardList.getIn([0,'name']):''}`}
                                    onChange={value => {
                                       const valueList = value.split(Limit.TREE_JOIN_STR)
                                       const uuid = valueList[0]
                                       const code = valueList[1]
                                       const name = valueList[2]
                                       dispatch(editRunningActions.changeLrAccountCommonString('ori', ['poundageProjectCardList',0], fromJS({cardUuid:uuid,name,code})))
                                   }}
                                   >
                                    {
                                        accountProjectList.map((v, i) =>
                                            <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>
                                                {`${projectCodeTest(v.get('code'))} ${v.get('name')}`}
                                            </Option>
                                    )}
                                </XfnSelect>
                            </div>
                        </div>:''
                }
                {
                    needUsedPoundage?
                    accounts.size > 1 && usedAccounts?
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
                                                    dispatch(editRunningActions.changeLrAccountCommonString('ori',['accounts',i,'poundageAmount'],value))
                                                })
                                            }}
                                        />
                                            {/* {formatMoney(sxAmount)}<span style={{color:'#ccc'}}>(收款净额：{formatMoney(Math.abs(v.get('amount')) - Math.abs(sxAmount))})</span> */}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <div className="edit-running-modal-list-item">
                            <label>支出金额：</label>
                            <div>
                                <Input
                                    className="lrls-account-box"
                                    placeholder=""
                                    value={accounts.getIn([0,'poundageAmount'])}
                                    onChange={(e) => {
                                        numberTest(e,(value) => {
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori',['accounts',0,'poundageAmount'],value))
                                        })
                                    }}
                                />
                                {/* {formatMoney(sxAmount)}<span style={{color:'#ccc'}}>(账户：{accounts.getIn([0,'accountName'])},收款净额：{formatMoney(Math.abs(amount) - Math.abs(sxAmount))})</span> */}
                            </div>
                        </div>
                    :''
                }
            </div>
        )
    }
}
