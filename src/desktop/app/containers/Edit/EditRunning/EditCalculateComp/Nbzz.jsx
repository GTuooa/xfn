import React from 'react'
import {immutableRenderDecorator} from 'react-immutable-render-mixin'
import moment from 'moment'
import { fromJS } from 'immutable'
import { DateLib, formatMoney, numberCalculate } from 'app/utils'
import { DatePicker, Input, Select, Modal, Divider,message, Tooltip, Switch } from 'antd'
import { Icon } from 'app/components'
import { Amount } from 'app/components'
import XfnSelect from 'app/components/XfnSelect'
import NumberInput from 'app/components/Input'
const MonthPicker = DatePicker.MonthPicker
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'

import AccountSfglPandge from './component/AccountSfglPandge'
import CategorySelect from './component/CategorySelect'
import AccountModifyModal from 'app/containers/Config/AccountConfig/AccountModifyModal'
import { numberTest } from '../common/common'

import * as accountConfigActions from 'app/redux/Config/AccountConfig/accountConfig.action'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'


@immutableRenderDecorator
export default
class Nbzz extends React.Component {

    static displayName = 'Nbzz'

    constructor() {
        super()
        this.state = {
            showModal: false
        }
    }

    render() {

        const {
          InternalTransferTemp,
          defaultFlowNumber,
          dispatch,
          disabledDate,
          insertOrModify,
          hideCategoryList,
          configPermission,
          accountList,
          isCheckOut,
          accountPoundage,
          calculateViews
        } = this.props

        const { showModal } = this.state

        // const oriDate = insertOrModify === 'insert'?this.props.oriDate:InternalTransferTemp.get('oriDate')
        const oriDate = this.props.oriDate
        const oriAbstract = InternalTransferTemp.get('oriAbstract')
        const amount = InternalTransferTemp.get('amount')
        const jrIndex = InternalTransferTemp.get('jrIndex')
        const fromAccount = InternalTransferTemp.get('fromAccountName');
        const toAccount = InternalTransferTemp.get('toAccountName');
        const chooseFirstWay = InternalTransferTemp.get('chooseFirstWay');

        const accountUuid = InternalTransferTemp.get('fromAccountName')
        const poundage = InternalTransferTemp.get('poundage')
        const needPoundage = poundage.get('needPoundage')
        const needUsedPoundage = InternalTransferTemp.get('needUsedPoundage')
        const poundageRate = InternalTransferTemp.get('poundageRate')
        const poundageAmount = InternalTransferTemp.get('poundageAmount')

        let transferOutAmount = 0, arriveAmount = 0
        if(chooseFirstWay){
            transferOutAmount = numberCalculate(amount,poundageAmount)
            arriveAmount = amount
        }else{
            transferOutAmount = amount
            arriveAmount = numberCalculate(amount,poundageAmount,2,'subtract')
        }

        const paymentTypeStr = calculateViews.get('paymentTypeStr')
        const position = "InternalTransferTemp"

        return (
            <div className="accountConf-modal-list">
            {
                insertOrModify === 'modify'?
                <div className="edit-running-modal-list-item">
                    <label>流水号：</label>
                    <div>
                        <NumberInput
                            style={{width:'70px',marginRight:'5px'}}
                            value={jrIndex}
                            onChange={(e) => {
                                if (/^\d{0,6}$/.test(e.target.value)) {
                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position,'jrIndex', e.target.value))
                                } else {
                                    message.info('流水号不能超过6位')
                                }
                            }}
                            PointDisabled={true}
                        />
                        号
                    </div>
                </div>
                :
                null
            }
            {
                // insertOrModify === 'modify' && jrIndex?
                // <div className="edit-running-modal-list-item">
                // <label>流水号：</label>
                // <div>{`${jrIndex}号`}</div>
                // </div> : ''
            }
                <div className="edit-running-modal-list-item">
                    <label>日期：</label>
                    <div>
                        <DatePicker allowClear={false} disabledDate={disabledDate} value={oriDate?moment(oriDate):''} onChange={value => {
                            const date = value.format('YYYY-MM-DD')
                            // if (insertOrModify === 'insert') {
                                dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
                            // } else {
                            //     dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriDate', date))
                            // }
                        }}/>
                    </div>
                </div>
                {/* <div className="edit-running-modal-list-item">
                    <label>流水类别：</label>
                    <div>
                        <Select  disabled={insertOrModify === 'modify'} value={paymentTypeStr} onChange={value => {
                            dispatch(editRunningActions.changeLrAccountCommonString('', [
                              'flags', 'paymentType'
                            ], value))
                          }}>
                          {
                            hideCategoryList.map((v, i) => {
                              return <Option key={i} value={v.get('categoryType')}>
                                {v.get('name')}
                              </Option>
                            })
                          }
                        </Select>
                    </div>
                </div> */}
                <CategorySelect
					dispatch={dispatch}
					insertOrModify={insertOrModify}
					paymentTypeStr={paymentTypeStr}
					hideCategoryList={hideCategoryList}
				/>
                <div className='accountConf-separator'></div>

                <div className="edit-running-modal-list-item">
                    <label>摘要：</label>
                    <div>
                        <Input  className="focus-input"
							onFocus={(e) => {
								document.getElementsByClassName('focus-input')[0].select();
							}}
                        value={oriAbstract} onChange={(e) => {
                            dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriAbstract', e.target.value))
                        }}/>
                    </div>
                </div>
                <div className="edit-running-modal-list-item">
                    <label>金额：</label>
                    <div>
                        <NumberInput value={amount}
                            onChange={(e) =>{
								numberTest(e,(value) => {
									dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'amount', value))
                                    let sxAmount = 0
                                    if(chooseFirstWay){
                                        const curPoundageAmount = numberCalculate(value,Number(poundageRate)/1000,2,'multiply')
                                        sxAmount =  curPoundageAmount > poundage.get('poundage') && poundage.get('poundage') > 0 ? poundage.get('poundage') :curPoundageAmount

                                    }else{
                                        const curPoundageAmount = numberCalculate(numberCalculate(value,1+(Number(poundageRate)/1000),4,'divide'),Number(poundageRate)/1000,2,'multiply')
                                        sxAmount =  curPoundageAmount > poundage.get('poundage') && poundage.get('poundage') > 0 ? poundage.get('poundage') :curPoundageAmount
                                    }
                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'poundageAmount', sxAmount))
								})
							}}
                        />
                    </div>
                </div>

                <div className="edit-running-modal-list-item">
                    <label>转出账户：</label>
                    <div className="lrls-account-box">
                        <XfnSelect
                            showSearch
                            value={fromAccount?fromAccount:''}
                            dropdownRender={menu => (
                                <div>
                                    {menu}
                                    <Divider style={{ margin: '4px 0' }} />
                                    <div
                                        style={{ padding: '8px', cursor: 'pointer' }}
                                        onMouseDown={() => {
                                            if (configPermission) {
                                                dispatch(accountConfigActions.beforeInsertAccountConf())
                                                this.setState({showModal: true})
                                            }
                                        }}
                                    >
                                        <Icon type="plus" /> 新增账户
                                    </div>
                                </div>
                            )}
                            onSelect={(value,options) => {
                                const poundage = options.props.poundage
                                const poundageRate = poundage.get('poundageRate')
                                let sxAmount = 0
                                // const sxAmount = Math.abs(amount || 0)*poundageRate/1000 > poundage.get('poundage') && poundage.get('poundage') > 0
                                //     ? poundage.get('poundage')
                                //     : Math.abs(amount || 0)*poundageRate/1000
                                if(chooseFirstWay){
                                    const curPoundageAmount = numberCalculate(amount,Number(poundageRate)/1000,2,'multiply')
                                    sxAmount =  curPoundageAmount > poundage.get('poundage') && poundage.get('poundage') > 0 ? poundage.get('poundage') :curPoundageAmount
                                }else{
                                    const curPoundageAmount = numberCalculate(numberCalculate(amount,1+(Number(poundageRate)/1000),4,'divide'),Number(poundageRate)/1000,2,'multiply')
                                    sxAmount =  curPoundageAmount > poundage.get('poundage') && poundage.get('poundage') > 0 ? poundage.get('poundage') :curPoundageAmount
                                }

                                dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'poundageAmount', sxAmount))

                                dispatch(editCalculateActions.changeEditCalculateCommonString('InternalTransfer', 'poundage', poundage))
                                dispatch(editCalculateActions.changeEditCalculateCommonString('InternalTransfer', 'poundageRate', poundage.get('poundageRate')))
                                dispatch(editCalculateActions.changeEditCalculateAccountName('InternalTransfer', 'fromAccountUuid', 'fromAccountName', value))
                        }}
                        >
                          {
                              accountList.size && accountList.getIn([0, 'childList']).map((v, i) =>
                              <Option
                                  key={i}
                                  value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                  poundage={fromJS({needPoundage:v.get('needPoundage'),poundage:v.get('poundage'),poundageRate:v.get('poundageRate')})}
                              >
                                  {v.get('name')}
                            </Option>)
                        }
                      </XfnSelect>
                    </div>
                </div>
                <div className="edit-running-modal-list-item">
                    <label>转入账户：</label>
                    <div className="lrls-account-box">
                        <XfnSelect
                            showSearch
                            value={toAccount?toAccount:''}
                            dropdownRender={menu => (
                                <div>
                                    {menu}
                                        <Divider style={{ margin: '4px 0' }} />
                                        <div
                                            style={{ padding: '8px', cursor: 'pointer' }}
                                            onMouseDown={() => {
                                                if (configPermission) {
                                                    dispatch(accountConfigActions.beforeInsertAccountConf())
                                                    this.setState({showModal: true})
                                                }
                                            }}
                                        >
                                        <Icon type="plus" /> 新增账户
                                    </div>
                                </div>
                            )}
                            onSelect={value => {
                                dispatch(editCalculateActions.changeEditCalculateAccountName('InternalTransfer', 'toAccountUuid', 'toAccountName', value))
                            }}
                        >
                          {accountList.size && accountList.getIn([0, 'childList']).map((v, i) => <Option  key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
                      </XfnSelect>
                    </div>
                </div>
                <AccountSfglPandge
                    dispatch={dispatch}
                    accountPoundage={accountPoundage}
                    someTemp={InternalTransferTemp}
                    insertOrModify={insertOrModify}
                    position={'InternalTransfer'}
                    chooseFirstWay={chooseFirstWay}
                    amount={amount}
                    poundageRate={poundageRate}
                    otherPage
                />
                {
                     needPoundage && accountUuid && accountPoundage.get('canUsed') && insertOrModify === 'insert' && needUsedPoundage ?
                     <div className="edit-running-modal-list-item edit-calculate-nbzz-amount">
                         <label></label>
                         <div>
                             <p className='nbzz-amount'>
                                 <span><label>转出金额：</label><span>{formatMoney(transferOutAmount)}</span></span>
                                 <span><label>到账金额：</label><span>{formatMoney(arriveAmount)}</span></span>
                                 <span><label>手续费：</label><span>{formatMoney(poundageAmount)}</span></span>
                             </p>
                             <Tooltip title='切换手续费计费方式'>
                                 <Switch
                                     className="use-unuse-style lend-bg"
                                     checked={chooseFirstWay}
                                     checkedChildren=""
                                     unCheckedChildren=""
                                     style={{width: 56}}
                                     onChange={(checked) => {
                                         let sxAmount = 0
                                         if(checked){
                                             const curPoundageAmount = numberCalculate(amount,Number(poundageRate)/1000,2,'multiply')
                                             sxAmount =  curPoundageAmount > poundage.get('poundage') && poundage.get('poundage') > 0 ? poundage.get('poundage') :curPoundageAmount
                                         }else{
                                             const curPoundageAmount = numberCalculate(numberCalculate(amount,1+(Number(poundageRate)/1000),4,'divide'),Number(poundageRate)/1000,2,'multiply')
                                             sxAmount =  curPoundageAmount > poundage.get('poundage') && poundage.get('poundage') > 0 ? poundage.get('poundage') :curPoundageAmount
                                         }
                                         dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'poundageAmount', sxAmount))
                                         dispatch(editCalculateActions.changeEditCalculateCommonString('InternalTransfer', 'chooseFirstWay', checked))
                                     }}
                                 />
                             </Tooltip>
                         </div>
                     </div> : null

                }

                <AccountModifyModal
					dispatch={dispatch}
					showModal={showModal}
					onClose={() => this.setState({showModal: false})}
                    fromPage='editRunning'
                    isCheckOut={isCheckOut}
				/>
                <div className='accountConf-separator'></div>
            </div>
        )
    }
}
