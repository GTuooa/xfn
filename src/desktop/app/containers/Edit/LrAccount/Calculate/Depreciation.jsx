import React from 'react'
import {immutableRenderDecorator} from 'react-immutable-render-mixin'
import moment from 'moment'
import * as Limit from 'app/constants/Limit.js'
import { DateLib, formatMoney } from 'app/utils'
import { Switch } from 'antd'
import { fromJS }	from 'immutable'

import {
  DatePicker,
  Input,
  Select,
  Checkbox,
  Button,
  Modal,
  message,
  Radio
} from 'antd'
const MonthPicker = DatePicker.MonthPicker
import SelectAss from './SelectAss'
import ZjtxCategorySelect from './ZjtxCategorySelect'
const RadioGroup = Radio.Group
import {
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
import  QcModal  from '../QcModal'

@immutableRenderDecorator
export default
class Depreciation extends React.Component {
  constructor() {
    super()
    this.state = {}
  }
  componentDidMount() {
      
      if(this.props.insertOrModify === 'modify'){
          const cflags = this.props.lrCalculateState.get('flags')
          const projectRange = cflags.get('projectRange')
          this.props.dispatch(lrCalculateActions.getProjectCardList(projectRange))
      }else{
          this.props.dispatch(lrCalculateActions.getAssetsList('LB_ZJTX'))
      }

  }
  render() {

    const {
      lrCalculateState,
      lrAccountState,
      dispatch,
      flags,
      disabledDate,
    //   accountConfState,
      insertOrModify,
      allasscategorylist,
      hideCategoryList,
      configPermissionInfo
    } = this.props

    const DepreciationTemp = lrCalculateState.get('DepreciationTemp')
    const runningDate = DepreciationTemp.get('runningDate')
    const runningState = DepreciationTemp.get('runningState')
    const runningAbstract = DepreciationTemp.get('runningAbstract')
    const amount = DepreciationTemp.get('amount')
		const flowNumber = DepreciationTemp.get('flowNumber') ? DepreciationTemp.get('flowNumber')
                      : lrAccountState.getIn(['cardTemp', 'flowNumber'])
    const fromAccount = lrCalculateState.getIn(['DepreciationTemp', 'fromAccountName'])
    const toAccount = lrCalculateState.getIn(['DepreciationTemp', 'toAccountName'])
    const usedProject = lrCalculateState.getIn(['DepreciationTemp', 'usedProject'])
    const dealTypeList = lrCalculateState.getIn(['DepreciationTemp', 'dealTypeList'])
    const dealType = lrCalculateState.getIn(['flags', 'dealType'])
    const dealCategory = lrCalculateState.getIn(['flags', 'dealCategory'])
    const cflags = lrCalculateState.get('flags')
    const projectList = cflags.get('projectList')?cflags.get('projectList'):fromJS([])
    const projectRange = cflags.get('projectRange')
    const beProject = cflags.get('beProject')
    const projectCard = lrCalculateState.getIn(['DepreciationTemp', 'projectCard'])
    // const accountList = accountConfState.get('accountList')

    const propertyCostList = lrCalculateState.getIn(['flags', 'propertyCostList'])
    const propertyCost = lrCalculateState.getIn(['DepreciationTemp', 'propertyCost'])

    const showContactsModal = flags.get('showContactsModal')
    const MemberList = flags.get('MemberList')
    const thingsList = flags.get('thingsList')
    const selectThingsList = flags.get('selectThingsList')
    const currentCardType = flags.get('currentCardType')
    const selectedKeys = flags.get('selectedKeys')

    const propertyCostName = {
        XZ_SALE:'销售费用',
        XZ_MANAGE:'管理费用',
        'XZ_FINANCE':'财务费用',
        '':''
    }[propertyCost]


    const paymentTypeStr = "长期资产折旧摊销"
    const position = "DepreciationTemp"

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
      <div className="accountConf-modal-list-item" >
          <label>处理类别：</label>
          <div className="list-item-box">
              <ZjtxCategorySelect
                  disabled={insertOrModify === 'modify'}
                  treeData={dealTypeList}
                  value={dealType}
                  placeholder=""
                  parentDisabled={true}
                  onChange={(value,label,extra) => {
                      const valueList = value.split(Limit.TREE_JOIN_STR)
                      const projectRange = valueList[2].split('+')
                      const propertyCostList = valueList[1].split('+')
                      const beProject = valueList[4] === 'true' ? true : false
                      dispatch(lrCalculateActions.changeLrCalculateCommonState('flags', 'dealType', valueList[0]))
                      dispatch(lrCalculateActions.changeLrCalculateCommonState('flags', 'projectRange', projectRange))
                      dispatch(lrCalculateActions.changeLrCalculateCommonState('flags', 'propertyCostList', fromJS(propertyCostList)))
                      dispatch(lrCalculateActions.changeLrCalculateCommonState('flags', 'beProject',beProject))
                      if(propertyCostList.length === 1){
                          dispatch(lrCalculateActions.changeLrCalculateCommonState(position,'propertyCost',propertyCostList[0]))
                      }
                      dispatch(lrCalculateActions.changeLrCalculateCommonState(position, 'categoryUuid', valueList[3]))
                      dispatch(lrCalculateActions.getProjectCardList(projectRange))
                  }}
              />
              {
                  dealType && beProject ?
                  <Switch
                      className="use-unuse-style"
                      style={{marginLeft:'.2rem'}}
                      checked={usedProject}
                      checkedChildren={'项目'}
                      onChange={() => {
                          if (!usedProject) {
                              dispatch(lrCalculateActions.changeLrCalculateCommonState(position,'projectCard',fromJS([{name:'',code:'',uuid:'',amount:''}])))
                          }
                          dispatch(lrCalculateActions.changeLrCalculateCommonState(position,'usedProject',!usedProject))
                      }}
                  /> : ''
              }

          </div>
      </div>
      {
          propertyCostList && propertyCostList.size > 1 ?
          <div className="accountConf-modal-list-item">
              <label>费用性质：</label>
              <div>
                  <Select
                      value={propertyCostName}
                      onChange={value => {
                          dispatch(lrCalculateActions.changeLrCalculateCommonState(position,'propertyCost',value))
                      }}
                      >
                          {
                              propertyCostList && propertyCostList.size?
                              propertyCostList.map((v, i) =>{
                                  const name ={
                                      XZ_SALE:'销售费用',
                                      XZ_MANAGE:'管理费用',
                                      'XZ_FINANCE':'财务费用'
                                  }[v]
                                  return <Option key={i} value={v}>
                                      {name}
                                  </Option>
                              })
                              :
                              null
                      }

                  </Select>
              </div>
          </div> : ''
      }

      <div className='calculate-separator'></div>
      <div className="accountConf-modal-list-item">
        <label>摘要：</label>
        <div>
          <Input value={runningAbstract} onChange={(e) => {
              dispatch(lrCalculateActions.changeLrCalculateCommonState(position, 'runningAbstract', e.target.value))
            }}/>
        </div>
      </div>
      {
          usedProject && beProject?
          <div className="accountConf-modal-list-item" >
              <label>项目：</label>
              <div className='chosen-right'>
                  {
                      <Select
                          combobox
                          showSearch
                          value={`${projectCard.get('code') !== 'COMNCRD' && projectCard.get('code')?projectCard.get('code'):''} ${projectCard.get('name')?projectCard.get('name'):''}`}
                          onChange={value => {
                              const valueList = value.split(Limit.TREE_JOIN_STR)
                              const uuid = valueList[0]
                              const code = valueList[1]
                              const name = valueList[2]
                              const amount = projectCard.get('amount')
                              dispatch(lrCalculateActions.changeLrCalculateCommonState(position, 'projectCard', fromJS({uuid,name,code,amount})))
                          }}
                          >
                          {projectList.map((v, i) =>
                              <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>
                                  {`${v.get('code') !== 'COMNCRD'?v.get('code'):''} ${v.get('name')}`}
                              </Option>
                          )}
                      </Select>

                  }
                  <div className='chosen-word'
                      onClick={() => {
                          dispatch(lrAccountActions.getProjectAllCardList(projectRange,'showContactsModal'))
                          dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'currentCardType'], 'project'))

                  }}>选择</div>
              </div>

          </div> : ''
      }
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


      <div className='accountConf-separator'></div>

      <QcModal
          showContactsModal={showContactsModal}
          MemberList={MemberList}
          thingsList={thingsList}
          selectThingsList={selectThingsList}
          dispatch={dispatch}
          currentCardType={currentCardType}
          modalName={'showContactsModal'}
          palceTemp={'card'}
          fromDepreciation={true}
          runningState={runningState}
          categoryTypeObj={'acBusinessIncome'}
          selectedKeys={selectedKeys}
          projectRange={projectRange}
          index={this.state.index}
          curAmount={this.state.curAmount}
          lrCalculateState={lrCalculateState}
      />

    </div>)
  }
}
