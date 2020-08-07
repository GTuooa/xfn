import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import { Input, Select, Divider, Button, message } from 'antd'
import { Icon } from 'app/components'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import XfnSelect from 'app/components/XfnSelect'
import XfIcon from 'app/components/Icon'
import { XfInput } from 'app/components'
import { formatNum, DateLib, formatMoney, decimal, numberCalculate } from 'app/utils'
import { numberTest } from './numberTest'

import AccountModifyModal from 'app/containers/Config/AccountConfig/AccountModifyModal'

import * as accountConfigActions from 'app/redux/Config/AccountConfig/accountConfig.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'

@immutableRenderDecorator
export default
class MultiAccountComp extends React.Component {

    constructor() {
		super()
		this.state = {
			showModal: false
		}
	}

    render() {
        const {
            accounts,
            accountList,
            dispatch,
            isCheckOut,
            accountOnChange,
            amountOnChange,
            amountOnFocus,
            amountOnKeyDown,
        } = this.props
        const { showModal } = this.state
        const totalAmount = accounts.reduce((pre,cur) => pre += Number(cur.get('amount') || 0),0)
        return(
            <div className='account-content'>
                <div className='account-content-area' style={{marginBottom:'10px'}}>
                    <span>账户</span>
                    <span>金额</span>
                    <span></span>
                </div>
                {
                    accounts.map((v,i) =>
                        <div key={i} className='account-content-area' style={accounts.size>1 ? {} : {border:'none',marginBottom:'0'}}>
                            <span>
                                <span className='account-content-number' style={{lineHeight: '27px'}}>({i+1})</span>
                                <XfnSelect
                                    showSearch
                                    combobox
                                    placeholder='请选择账户'
                                    value={v.get('accountName')||undefined}
                                    dropdownRender={menu => (
                                        <div>
                                            {menu}
                                            <Divider style={{ margin: '4px 0' }} />
                                            <div
                                                style={{ padding: '8px', cursor: 'pointer' }}
                                                onMouseDown={() => {
                                                    dispatch(accountConfigActions.beforeInsertAccountConf())
                                                    this.setState({showModal: true})
                                                }}
                                            >
                                                <Icon type="plus" /> 新增账户
                                            </div>
                                        </div>
                                    )}
                                    onChange={(value,options) => {
                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                        const accountUuid = valueList[0]
                                        const accountName = valueList[1]
                                        const poundageObj = options.props.poundage
                                        const poundage = poundageObj.get('poundage')
                                        const poundageRate = poundageObj.get('poundageRate')
                                        const amount = v.get('amount')
                                        const sxAmount = Math.abs(v.get('amount') || 0)*poundageRate/1000>poundage && poundage !== -1 ?
                                        poundage : Math.abs(v.get('amount') || 0)*poundageRate/1000
                                        const accountObj = {
                                            poundageAmount: sxAmount.toFixed(2),
                                            accountUuid,
                                            accountName,
                                            poundage: options.props.poundage.toJS()
                                        }
                                        accountOnChange(accountObj,i)
                                    }}
                                >
                                    {
                                        accountList.getIn([0, 'childList']).map((v, i) =>
                                            <Option
                                                key={i}
                                                value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                                poundage={fromJS({needPoundage:v.get('needPoundage'),poundage:v.get('poundage'),poundageRate:v.get('poundageRate')})}
                                            >
                                                {v.get('name')
                                    }
                                    </Option>)}
                                </XfnSelect>
                            </span>
                            <span>
                                <XfInput
                                    mode="amount"
                                    value={v.get('amount')}
                                    placeholder='请输入金额'
                                    onFocus={() => {
                                        amountOnFocus && amountOnFocus(v,totalAmount,i)
                                    }}
                                    onChange={(e) => {
                                        amountOnChange(e,v,i)
                                    }}
                                    onKeyDown={(e)=>{
                                        if(e.keyCode === Limit.EQUAL_KEY_CODE){
                                            const allAmount = numberCalculate(totalAmount,v.get('amount'),2,'subtract')
                                            amountOnKeyDown && amountOnKeyDown(v,allAmount,i)
                                        }

                                    }}
                                />
                            </span>
                            <span>
                                {
                                    accounts.size > 2 ?
                                    <span>
                                        <XfIcon
                                            type="bigDel"
                                            theme="outlined"
                                            onClick={() => {
                                                dispatch(editCalculateActions.deleteAccounts(accounts, i))
                                            }}
                                        />
                                    </span> : ''
                                }
                            </span>
                    </div>
                    )
                }
                <AccountModifyModal
                    dispatch={dispatch}
                    showModal={showModal}
                    onClose={() => this.setState({showModal: false})}
                    fromPage='otherPage'
                    isCheckOut={isCheckOut}
                />
                <div className='account-button'>
                    <Button
                        onClick={() => {
                            if (accounts.size >= Limit.ACCOUNT_MAX_NUMBER) {
                                message.info(`多账户不可超过${Limit.ACCOUNT_MAX_NUMBER}个账户`)
                            }else{
                                dispatch(editCalculateActions.addAccounts(accounts,accounts.size-1))
                            }

                        }}
                        >
                        <XfIcon type='big-plus'/>添加账户明细
                    </Button>
                    <div className="account-amount" style={{marginBottom:5}}>
                        <label>金额合计：</label>
                        <div>{totalAmount.toFixed(2)}</div>
                    </div>
                </div>


        </div>
        )
    }
}
