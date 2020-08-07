import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import { Input, Select, Icon, Divider, Button, message } from 'antd'
import NumberInput from 'app/components/Input'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import XfnSelect from 'app/components/XfnSelect'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney, decimal } from 'app/utils'
import { getCategorynameByType, numberTest, regNegative, reg } from './common/common'

import AccountModifyModal from 'app/containers/Config/AccountConfig/AccountModifyModal'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as accountConfigActions from 'app/redux/Config/AccountConfig/accountConfig.action'

@immutableRenderDecorator
export default
class MultiAccountComp extends React.Component {

    constructor() {
		super()
		this.state = {
			showModal: false
		}
	}
    calculatePoundage = (aomunt,v,i) => {
        const sxAmount = Math.abs(aomunt || 0)*v.getIn(['poundage','poundageRate'])/1000>v.getIn(['poundage','poundage']) && v.getIn(['poundage','poundage']) !== -1?
        v.getIn(['poundage','poundage'])
        :Math.abs(aomunt || 0)*v.getIn(['poundage','poundageRate'])/1000
        if (this.props.insertOrModify === 'insert') {
            this.props.dispatch(editRunningActions.changeLrAccountCommonString('ori',['accounts',i,'poundageAmount'],(sxAmount || 0).toFixed(2)))
        }

    }
    render() {
        const {
            accounts,
            accountList,
            dispatch,
            isCheckOut,
            beManagemented,
            oriTemp,
            insertOrModify
        } = this.props
        const { showModal } = this.state
        const amount = oriTemp.get('amount')
        const totalAmount = accounts.reduce((pre,cur) => pre += Number(cur.get('amount') || 0),0)
        let newAccounts = accounts.size === 1 ? accounts.push(fromJS({})) : accounts
        return(
            <div className='account-content'>
                <div className='account-content-area' style={{marginBottom:'10px'}}>
                    <span>账户</span>
                    <span>金额</span>
                    <span></span>
                </div>
                {
                    newAccounts.map((v,i) =>
                        <div key={i} className='account-content-area' style={accounts.size>1 ? {} : {border:'none',marginBottom:'0'}}>
                            <span style={{display:'flex',lineHeight:'27px'}}>
                                <span style={{width:'30px'}}>({i+1})</span>
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
                                                    // const showModal = () => {
                                                    //     this.setState({showModal: true})
                                                    // }
                                                    dispatch(accountConfigActions.beforeInsertAccountConf())
                                                    this.setState({showModal: true})
                                                    // showModal()
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
                                        const sxAmount = Math.abs(v.get('amount') || 0)*poundageRate/1000>poundage && poundage !== -1?
                                        poundage
                                        :Math.abs(v.get('amount') || 0)*poundageRate/1000
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori',['accounts',i,'poundageAmount'],sxAmount.toFixed(2)))
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori', ['accounts',i,'accountUuid'], accountUuid))
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori', ['accounts',i,'accountName'], accountName))
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori', ['accounts',i,'poundage'], options.props.poundage))
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
                                <NumberInput
                                    className='key-calculate'
                                    value={v.get('amount')}
                                    placeholder='请输入金额'
                                    onFocus={() => {
                                        if (!v.get('amount') && totalAmount < amount) {
                                            const ReAmount = decimal(Number(amount) - (Number(totalAmount) || 0))
                                            this.calculatePoundage(ReAmount,v,i)
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori', ['accounts',i,'amount'], ReAmount))
                                        }
                                    }}
                                    onChange={(e) => {
                                        const poundage = v.getIn(['poundage','poundage'])
                                        const poundageRate = v.getIn(['poundage','poundageRate'])
                                        if (e.target.value && e.target.value.indexOf('=') > -1) {
                                            let totalAmount = 0
                                            accounts.map((item,index) => totalAmount += (index !== i ? Number(item.get('amount')) : 0))
                                            if (totalAmount < amount) {
                                                const ReAmount = decimal(Number(amount) - (Number(totalAmount) || 0))
                                                this.calculatePoundage(ReAmount,v,i)
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori', ['accounts',i,'amount'], ReAmount))
                                            }
                                        } else {
                                            numberTest(e, (value) => {
                                                const sxAmount = this.calculatePoundage(value,v,i)
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori', ['accounts',i,'amount'], value))
                                                beManagemented && dispatch(editRunningActions.calculateCurAmount())
                                            })
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
                                                dispatch(editRunningActions.deleteAccounts(accounts, i))
                                            }}
                                        />
                                    </span> : ''
                                }
                            </span>
                        {/* <div className="edit-running-modal-list-item">
                            <label>账户：</label>
                            <div className="chosen-right">
                                <XfnSelect
                                    showSearch
                                    value={v.get('accountName')||''}
                                    dropdownRender={menu => (
                                        <div>
                                            {menu}
                                            <Divider style={{ margin: '4px 0' }} />
                                            <div
                                                style={{ padding: '8px', cursor: 'pointer' }}
                                                onMouseDown={() => {
                                                    // const showModal = () => {
                                                    //     this.setState({showModal: true})
                                                    // }
                                                    dispatch(accountConfigActions.beforeInsertAccountConf())
                                                    this.setState({showModal: true})
                                                    // showModal()
                                                }}
                                            >
                                                <Icon type="plus" /> 新增账户
                                            </div>
                                        </div>
                                    )}
                                    onSelect={(value,options) => {
                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                        const accountUuid = valueList[0]
                                        const accountName = valueList[1]
                                        const poundageObj = options.props.poundage
                                        const poundage = poundageObj.get('poundage')
                                        const poundageRate = poundageObj.get('poundageRate')
                                        const amount = v.get('amount')
                                        const sxAmount = Math.abs(v.get('amount') || 0)*poundageRate/1000>poundage && poundage !== -1?
                                        poundage
                                        :Math.abs(v.get('amount') || 0)*poundageRate/1000
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori',['accounts',i,'poundageAmount'],sxAmount.toFixed(2)))
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori', ['accounts',i,'accountUuid'], accountUuid))
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori', ['accounts',i,'accountName'], accountName))
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori', ['accounts',i,'poundage'], options.props.poundage))
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
                            </div>
                            <span className='icon-content'>
                                <span>
                                    <XfIcon
                                        type="simple-plus"
                                        theme="outlined"
                                        onClick={() => {
                                            dispatch(editRunningActions.addAccounts(accounts,i))
                                        }}
                                    />
                                </span>
                                {
                                    accounts.size > 2 ?
                                    <span>
                                        <XfIcon
                                            type="sob-delete"
                                            theme="outlined"
                                            onClick={() => {
                                                dispatch(editRunningActions.deleteAccounts(accounts, i))
                                            }}
                                        />
                                    </span> : ''
                                }
                            </span>

                            <AccountModifyModal
                                dispatch={dispatch}
                                showModal={showModal}
                                onClose={() => this.setState({showModal: false})}
                                fromPage='otherPage'
                                isCheckOut={isCheckOut}
                            />
                        </div> */}
                        {/* <div className="edit-running-modal-list-item">
                            <label>金额：</label>
                            <NumberInput
                                value={v.get('amount')}
                                onChange={(e) => {
                                    numberTest(e, (value) => {
                                        if (insertOrModify === 'insert') {
                                            const poundage = v.getIn(['poundage','poundage'])
                                            const poundageRate = v.getIn(['poundage','poundageRate'])
                                            const sxAmount = Math.abs(value || 0)*v.getIn(['poundage','poundageRate'])/1000>v.getIn(['poundage','poundage']) && v.getIn(['poundage','poundage']) !== -1?
                                            v.getIn(['poundage','poundage'])
                                            :Math.abs(value || 0)*v.getIn(['poundage','poundageRate'])/1000
                                            dispatch(editRunningActions.changeLrAccountCommonString('ori',['accounts',i,'poundageAmount'],(sxAmount || 0).toFixed(2)))
                                        }
                                        dispatch(editRunningActions.changeLrAccountCommonString('ori', ['accounts',i,'amount'], value))
                                        beManagemented && dispatch(editRunningActions.calculateCurAmount())
                                    })
                                }}
                            />
                        </div> */}
                    </div>
                    )
                }
                <AccountModifyModal
                    dispatch={dispatch}
                    showModal={showModal}
                    onClose={() => this.setState({showModal: false})}
                    fromPage='editRunning'
                    isCheckOut={isCheckOut}
                />
                <div className='account-button'>
                    <Button
                        onClick={() => {
                            if (accounts.size >=32) {
                                message.info('多账户不可超过32个账户')
                                return
                            }
                            dispatch(editRunningActions.addAccounts(accounts,accounts.size-1))
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
