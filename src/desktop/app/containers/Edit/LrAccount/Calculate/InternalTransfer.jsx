import React from 'react'
import {immutableRenderDecorator} from 'react-immutable-render-mixin'
import moment from 'moment'
import * as Limit from 'app/constants/Limit.js'
import { DateLib, formatMoney } from 'app/utils'
import {
  DatePicker,
  Input,
  Select,
  Checkbox,
  Button,
  Modal,
  message,
  Radio,
  Icon,
  Divider
} from 'antd'
const MonthPicker = DatePicker.MonthPicker
import SelectAss from './SelectAss'
const RadioGroup = Radio.Group
import {
  RunCategorySelect,
  AcouontAcSelect,
  TableBody,
  TableTitle,
  TableItem,
  JxcTableAll,
  Amount
} from 'app/components'

import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import * as accountConfActions from 'app/redux/Config/Account/account.action'
import * as lrCalculateActions from 'app/redux/Edit/LrAccount/lrCalculate/lrCalculate.action'
import { toJS } from 'immutable'

@immutableRenderDecorator
export default
class InternalTransfer extends React.Component {
  constructor() {
    super()
    this.state = {
        accountInput:''
    }
  }
  componentDidMount() {}
  render() {

    const {
      lrCalculateState,
      lrAccountState,
      dispatch,
      disabledDate,
      accountConfState,
      insertOrModify,
      allasscategorylist,
      hideCategoryList,
      configPermissionInfo
    } = this.props

    const InternalTransferTemp = lrCalculateState.get('InternalTransferTemp')
    const runningDate = InternalTransferTemp.get('runningDate')
    const runningAbstract = InternalTransferTemp.get('runningAbstract')
    const amount = InternalTransferTemp.get('amount')
		const flowNumber = InternalTransferTemp.get('flowNumber') ? InternalTransferTemp.get('flowNumber')
                      : lrAccountState.getIn(['cardTemp', 'flowNumber'])
    const fromAccount = lrCalculateState.getIn(['InternalTransferTemp', 'fromAccountName']);
    const toAccount = lrCalculateState.getIn(['InternalTransferTemp', 'toAccountName']);
    const accountList = accountConfState.get('accountList')

    const paymentTypeStr = "内部转账"
    const position = "InternalTransferTemp"

    return (<div className="accountConf-modal-list">
      {
        insertOrModify === 'modify' && flowNumber ?
        <div className="accountConf-modal-list-item">
          <label>流水号：</label>
          <div>{flowNumber}</div>
        </div> : ''
      }
      <div className="accountConf-modal-list-item">
        <label>日期：</label>
        <div>
          <DatePicker allowClear={false} disabledDate={disabledDate} value={runningDate?moment(runningDate):''} onChange={value => {
              const date = value.format('YYYY-MM-DD')
              dispatch(lrCalculateActions.changeLrCalculateCommonState(position, 'runningDate', date))
            }}/>
        </div>
      </div>
      <div className="accountConf-modal-list-item">
        <label>流水类别：</label>
        <div>
          <Select  disabled={insertOrModify === 'modify'} value={paymentTypeStr} onChange={value => {
              dispatch(lrAccountActions.changeLrAccountCommonString('', [
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
      </div>
      <div className='accountConf-separator'></div>

      <div className="accountConf-modal-list-item">
        <label>摘要：</label>
        <div>
          <Input value={runningAbstract} onChange={(e) => {
              dispatch(lrCalculateActions.changeLrCalculateCommonState(position, 'runningAbstract', e.target.value))
            }}/>
        </div>
      </div>
      <div className="accountConf-modal-list-item">
        <label>金额：</label>
        <div>
          <Input value={amount} onChange={(e) => {
              if (/^[-\d]\d*\.?\d{0,2}$/g.test(e.target.value) || e.target.value === '') {
                dispatch(lrCalculateActions.changeLrCalculateCommonState(position, 'amount', e.target.value))
              }
            }}/>
        </div>
      </div>

      <div className="accountConf-modal-list-item">
        <label>转出账户：</label>
        <div className="lrls-account-box">
          <Select
              showSearch
              value={fromAccount?fromAccount:''}
              dropdownRender={menu => (
                <div>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <div  style={{ padding: '8px', cursor: 'pointer' }} onMouseDown={() => {
                      dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'showAccountModal'], true))
                      dispatch(accountConfActions.beforeInsertAccountConf('account','','fromLrAccount'))
                  }} >
                    <Icon type="plus" /> 新增账户
                  </div>
                </div>
              )}
              onSelect={value => {
              dispatch(lrCalculateActions.changeLrAccountAccountName('InternalTransfer', 'fromAccountUuid', 'fromAccountName', value))
          }}
          >
            {accountList.getIn([0, 'childList']).map((v, i) => <Option  key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
          </Select>
          {/* <Button
             disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
             className="title-right add-btn"
             type="ghost"
             onClick={()=>{
                 dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'showAccountModal'], true))
                 dispatch(accountConfActions.beforeInsertAccountConf('account','','fromLrAccount'))
             }}
             >
             新增
         </Button> */}
        </div>
      </div>
      <div className="accountConf-modal-list-item">
        <label>转入账户：</label>
        <div className="lrls-account-box">
          <Select
              showSearch
              value={toAccount?toAccount:''}
              dropdownRender={menu => (
                <div>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <div  style={{ padding: '8px', cursor: 'pointer' }} onMouseDown={() => {
                      dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'showAccountModal'], true))
                      dispatch(accountConfActions.beforeInsertAccountConf('account','','fromLrAccount'))
                  }} >
                    <Icon type="plus" /> 新增账户
                  </div>
                </div>
              )}
              onSelect={value => {
                  dispatch(lrCalculateActions.changeLrAccountAccountName('InternalTransfer', 'toAccountUuid', 'toAccountName', value))
              }}
          >
            {accountList.getIn([0, 'childList']).map((v, i) => <Option  key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
          </Select>
          {/* <Button
             disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
             className="title-right"
             type="ghost"
             onClick={()=>{
                 dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'showAccountModal'], true))
                 dispatch(accountConfActions.beforeInsertAccountConf('account','','fromLrAccount'))
             }}
             >
             新增
         </Button> */}
        </div>
      </div>

      <div className='accountConf-separator'></div>

    </div>)
  }
}
