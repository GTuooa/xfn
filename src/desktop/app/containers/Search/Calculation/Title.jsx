import React, {PropTypes} from 'react'
import {immutableRenderDecorator} from 'react-immutable-render-mixin'

import { Select, TreeSelect, Button, Input, Checkbox, Modal, DatePicker} from 'antd'
const Option = Select.Option
import {Amount, TableItem, Icon } from 'app/components'
import { accountTreeData, formatDate, numberTest } from 'app/utils'
import CalculateModel from './CalculateModel'
import moment from 'moment'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import * as calculationActions from 'app/redux/Search/Calculation/calculation.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import {fromJS, toJS} from 'immutable'
import * as Limit from 'app/constants/Limit.js'
import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as lrCalculateActions from 'app/redux/Edit/LrAccount/lrCalculate/lrCalculate.action'
@immutableRenderDecorator
export default
class Title extends React.Component {
    state = {
		manageModal:false,//单笔流水核算弹窗
		carryoverModal:false,//单笔成本结转流水弹窗
		invioceModal:false,//单笔开具发票弹窗
		defineModal:false,//单笔发票认证弹窗
        visible: false
	}

  render() {
    const {
      ass,
      isCheck,
      accountingType,
      dispatch,
      issues,
      issuedate,
      curCategory,
      assId,
      assCategory,
      acId,
      selectList,
      // mediumAcAssList,
      selectDate,
      totalAmount,
      handlingAmount,
      accountName,
      searchType,
      inputValue,
      changeInputValue,
      invoicingType,
      billMakeOutType,
      certifiedType,
      billAuthType,
      costTransferType,
      runningState,
      cardList,
      acList,
      usedCard,
      stockCard,
      cardUuid,
      editLrAccountPermission,
      cxlsState,
      accountList,
      stockThingsList,
      payManageList,
      flags,
      mainSouce,
      stockUuid
    } = this.props
    const {
		manageModal,//单笔流水核算弹窗
		carryoverModal,//单笔成本结转流水弹窗
		invioceModal,//单笔开具发票弹窗
		defineModal,//单笔发票认证弹窗
	} = this.state
    const modalTemp = cxlsState.get('modalTemp')
    const uuidList = modalTemp.get('uuidList')
    const managerCategoryList = cxlsState.getIn(['flags','managerCategoryList'])
    let  acAndAssList =[
        <Option key={'全部'} value={`全部${Limit.TREE_JOIN_STR}${Limit.TREE_JOIN_STR}`}>
            全部
        </Option>
    ]
    if(cardList && cardList.size) {
        cardList.forEach((v, i) => {
            acAndAssList.push(
                <Option key={v.get('code')} value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('uuid')}`}>
                {`${v.get('code')} ${v.get('name')}`}
            </Option>
    )
    })
    }
    if(acList && acList.size) {
        acList.map((v, i) => {
            acAndAssList.push(
                <Option key={v.get('acId')} value={`${v.get('acId')}${Limit.TREE_JOIN_STR}${v.get('acFullName')}${Limit.TREE_JOIN_STR}ac`}>
                    {v.get('acFullName')}
                </Option>
            )
    })
    }
    const happenSouce = [
      {
        value: true,
        key: '已发生'
      }, {
        value: false,
        key: '未发生'
      }
    ]

    // const mainSouce = [
    //   {
    //     value: 'manages',
    //     key: '收付管理'
    //   },
    //   {
    //     value: 'costTransfer',
    //     key: '成本结转'
    //   },
    //   {
    //     value: 'certification',
    //     key: '发票认证'
    //   },
    //   {
    //     value: 'invoicing',
    //     key: '开具发票'
    //   }
    // ]

    const mainStr = ({
      'manages': () => '收付管理',
      'costTransfer': () => '成本结转',
      'certification': () => '发票认证',
      'invoicing': () => '开具发票'
    }[accountingType])()

// 发票认证
		const certifiedTypeStr = [
      {
        value: '',
        key: '全部'
      }, {
        value: 'BILL_AUTH_TYPE_CG',
        key: '进项发票认证'
      }, {
        value: 'BILL_AUTH_TYPE_TG',
        key: '退购发票认证'
      }
    ]
    const showCertifiedType = ({
      '': () => '全部',
      'BILL_AUTH_TYPE_CG': () => '进项发票认证',
      'BILL_AUTH_TYPE_TG': () => '退购发票认证'
    }[certifiedType])()

// 开具发票
		const invoicingTypeStr = [
			{
				value: '',
				key: '全部'
			}, {
				value: 'BILL_MAKE_OUT_TYPE_XS',
				key: '销项开票'
			}, {
				value: 'BILL_MAKE_OUT_TYPE_TS',
				key: '退销开票'
			}
		]
    const showInvoicingType = ({
      '': () => '全部',
      'BILL_MAKE_OUT_TYPE_XS': () => '销项开票',
      'BILL_MAKE_OUT_TYPE_TS': () => '退销开票'
    }[invoicingType])()

// 结转成本
    const transferTypeStr = [
      {
        value: '',
        key: '全部'
      }, {
        value: 'STATE_YYSR_XS',
        key: '销售结转成本'
      }, {
        value: 'STATE_YYSR_TS',
        key: '退销结转成本'
      }
    ]
    const showCostType = ({
      '': () => '全部',
      'STATE_YYSR_XS': () => '销售结转成本',
      'STATE_YYSR_TS': () => '退销结转成本'
    }[runningState])()

      const searchTypeStr = [
        {
          value: 'SEARCH_TYPE_DATE',
          key: '日期'
        },
        {
          value: 'SEARCH_TYPE_ABSTRACT',
          key: '摘要'
        },
        {
          value: 'SEARCH_TYPE_RUNNING_TYPE',
          key: '类型'
        },
        {
          value: 'SEARCH_TYPE_AMOUNT',
          key: '金额'
        }
      ]
      const searchStr = ({
          'SEARCH_TYPE_DATE': () => '日期',
          'SEARCH_TYPE_ABSTRACT': () => '摘要',
          'SEARCH_TYPE_RUNNING_TYPE': () => '类型',
          'SEARCH_TYPE_AMOUNT': () => '金额'
      }[searchType])()

    return (<div className="title">
      <span className="title-date-margin-right">
        {<Select style={{
                width: 86
              }} value={mainStr} onChange={(value) => {
                  changeInputValue('')
                  dispatch(calculationActions.changeSearchType(['flags', 'accountingType'], value))
              }}
              >

        {mainSouce.map((v, i) => <Option key={v.key} value={v.value}>{v.key}</Option>)}
      </Select>
			}

    </span>
      {
      accountingType === 'manages'
        ? <span className="title-date-margin-right">
            <span>往来单位：</span>

            <Select
                showSearch
                style={{
                    width: 200
                }}
                value={`${usedCard.get('code')?usedCard.get('code'):''} ${usedCard.get('name')?usedCard.get('name'):''}`}
                showSearch
                searchPlaceholder="搜索往来单位"
                className="table-right-table-input"
                optionFilterProp="children"
                notFoundContent="无法找到相应往来单位"
                onSelect={value => {

                    const valueList = value.split(Limit.TREE_JOIN_STR)
                    const curIsCheck = valueList[0] == '全部' ?  false : false
                    const code =  valueList[0] == '全部' ? '全部' : valueList[0]
                    const name = valueList[1] == '全部' ? '全部' : valueList[1]
                    const uuid = valueList[2]
                    dispatch(calculationActions.changeCalculateCommonString('calculate', 'cardUuid', uuid))
                    dispatch(calculationActions.changeCalculateCommonString('calculate', ['usedCard','code'], code))
                    dispatch(calculationActions.changeCalculateCommonString('calculate', ['usedCard','name'], name))
                    dispatch(calculationActions.getCalculateList(
                      issuedate, accountingType, '', curCategory,
                      uuid,
                      curIsCheck,
                    ))

                    dispatch(calculationActions.changeSearchType(['flags', 'searchType'], 'SEARCH_TYPE_DATE'))
                }}
                showArrow={false}
                >
                {acAndAssList}
            </Select>

          </span>
        : ''
    }

    {
      accountingType === 'manages' && usedCard.get('code') !== '全部' ?
      <span className="title-date-margin-right check-account">
        <Checkbox
          defaultChecked={false}
          checked={isCheck === null ? false : isCheck }
          onChange = {(e) => {
          dispatch(calculationActions.getCalculateList(issuedate,accountingType,'',curCategory, cardUuid, e.target.checked))
        }} />&nbsp;
        查看已核销流水
      </span>
      : ''
    }
      {
      accountingType === 'costTransfer'
        ? <span className="title-date-margin-right">
            <span>结转类型：</span>
            <Select style={{
                width: 120
              }}
              value={showCostType}
              onChange={(value) => {
                   changeInputValue('')
                   dispatch(calculationActions.changeSearchType(['flags', 'costTransferType'], value))
                   dispatch(calculationActions.getCalculateCarryoverList('',value,'','',''))
                   dispatch(calculationActions.changeCalculateCommonString('calculate', 'stockUuid', ''))
                   dispatch(calculationActions.changeCalculateCommonString('calculate', ['stockCard','code'], ''))
                   dispatch(calculationActions.changeCalculateCommonString('calculate', ['stockCard','name'], '全部'))

              }}
              >
							{transferTypeStr.map((v, i) => <Option key={v.key} value={v.value}>{v.key}</Option>)}
						</Select>
          </span>
        : ''
    }
    {
        accountingType === 'costTransfer' && showCostType !== '全部' ?
        <span className="title-date-margin-right">
            <span>存货：</span>
            <Select  style={{
                width: 120
              }}
                showSearch
                combobox
                value={`${stockCard?stockCard.get('code'):''} ${stockCard?stockCard.get('name'):''}`}
                onChange={value => {
                    const valueList = value.split(Limit.TREE_JOIN_STR)
                    const uuid = valueList[0]
                    const code = valueList[1]
                    const name = valueList[2]
                    dispatch(calculationActions.changeCalculateCommonString('calculate', 'stockUuid', uuid))
                    dispatch(calculationActions.changeCalculateCommonString('calculate', ['stockCard','code'], code))
                    dispatch(calculationActions.changeCalculateCommonString('calculate', ['stockCard','name'], name))
                    dispatch(cxlsActions.changeCxAccountCommonString('modal',['stockCardList',0], {uuid,name,code,amount:''}))

                    dispatch(calculationActions.getCalculateCarryoverList(issuedate,runningState, inputValue,'',uuid))
                }}
                // onSelect={value => dispatch(lrAccountActions.changeLrAccountAccountName('card', 'accountUuid', 'accountName', value))}
                >
                {stockThingsList.map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{`${v.get('code')} ${v.get('name')}`}</Option>)}
            </Select>
        </span>
        : ''
    }
    {
      accountingType === 'certification'
        ? <span className="title-date-margin-right">
            <span>认证类型：</span>
						<Select style={{
                width: 120
              }}
              value={showCertifiedType}
              onChange={(value) => {
                   changeInputValue('')
                   dispatch(calculationActions.changeSearchType(['flags', 'certifiedType'], value))
                   dispatch(calculationActions.getCalculateCertificationList('','',value,''))
              }}
              >
							{certifiedTypeStr.map((v, i) => <Option key={v.key} value={v.value}>{v.key}</Option>)}
						</Select>
          </span>
        : ''
    } {
      accountingType === 'invoicing'
        ? <span className="title-date-margin-right">
            <span>开票类型：</span>
						<Select style={{
								width: 120
							}}
               value={showInvoicingType}
               onChange={(value) => {
                    changeInputValue('')
                    dispatch(calculationActions.changeSearchType(['flags', 'invoicingType'], value))
                    dispatch(calculationActions.getCalculateInvoicingList('','',value,''))
               }}
              >

							{invoicingTypeStr.map((v, i) => <Option key={v.key} value={v.value}>{v.key}</Option>)}
						</Select>
          </span>
        : ''
    }
    {
    //     accountingType === 'costTransfer' ? '' :
    //     <span className="cxls-sfgl-serch">
    //       <Select style={{
    //               width: 60
    //             }}
    //             className="cxls-type-choose"
    //         // combobox
    //         defaultValue="流水类别"
    //         value={searchStr}
    //         onChange={value =>{
    //           dispatch(calculationActions.changeCalculateCommonString('',['flags','searchType'],value))
    //         }}
    //         onSelect={value => dispatch(calculationActions.changeCalculateCommonString('',['flags','searchType'],value))}
    //         >
    //           {searchTypeStr.map((v, i) => <Option key={v.key} value={v.value}>{v.key}</Option>)}
    //
    //       </Select>
    //       <Icon className="cxpz-serch-icon" type="search"
    //         onClick={() => {
    //           switch(accountingType){
    //             case 'manages':
    //               dispatch(calculationActions.getCalculateList(issuedate, accountingType,'',curCategory,cardUuid, isCheck,inputValue))
    //               break
    //             case 'invoicing':
    //               dispatch(calculationActions.getCalculateInvoicingList(issuedate,curCategory,billMakeOutType, inputValue))
    //               break
    //             case 'certification':
    //               dispatch(calculationActions.getCalculateCertificationList(issuedate,curCategory,billAuthType, inputValue))
    //               break
    //             case 'costTransfer':
    //               dispatch(calculationActions.getCalculateCarryoverList(issuedate,curCategory,runningState, inputValue))
    //               break
    //             default:
    //
    //           }
    //       }}
    //     />
    //       <Input placeholder="搜索流水"
    //         className="cxls-serch-input"
    //         value={inputValue}
    //         onChange={e => changeInputValue(e.target.value)}
    //         onKeyDown={(e) => {
    //           if (e.keyCode == Limit.ENTER_KEY_CODE){
    //             changeInputValue(inputValue)
    //             switch(accountingType){
    //               case 'manages':
    //                 dispatch(calculationActions.getCalculateList(issuedate, accountingType,'',curCategory,cardUuid, isCheck,inputValue))
    //                 break
    //               case 'invoicing':
    //                 dispatch(calculationActions.getCalculateInvoicingList(issuedate,curCategory,billMakeOutType, inputValue))
    //                 break
    //                 case 'certification':
    //                   dispatch(calculationActions.getCalculateCertificationList(issuedate,curCategory,billAuthType, inputValue))
    //                   break
    //                 case 'costTransfer':
    //                   dispatch(calculationActions.getCalculateCarryoverList(issuedate,curCategory,runningState, inputValue))
    //                   break
    //                 default:
    //
    //             }
    //
    //           }
    //         }}
    //       />
    //     </span>
    }

    <Button type = "ghost" className = "title-right" onClick = {
      () => {
        switch(accountingType){
          case 'manages':
             dispatch(calculationActions.getCalculateList(issuedate, accountingType,'',curCategory,cardUuid, isCheck,inputValue))
             break
           case 'invoicing':
             dispatch(calculationActions.getCalculateInvoicingList(issuedate,curCategory,billMakeOutType, inputValue))
             break
          case 'certification':
            dispatch(calculationActions.getCalculateCertificationList(issuedate,curCategory,billAuthType, inputValue))
            break
          case 'costTransfer':
            dispatch(calculationActions.getCalculateCarryoverList(issuedate,runningState, inputValue,'',cardUuid))
            break
          default:

         }
      }
    } > 刷新 </Button>
    <Button type = "ghost" className = "title-right" onClick={() => {
        dispatch(homeActions.addPageTabPane('SearchPanes', 'Cxls', 'Cxls', '查询流水'))
        dispatch(homeActions.addHomeTabpane('Search', 'Cxls', '查询流水'))
    }}>
        返回
    </Button>
      <Button type="ghost" disabled={!selectList.size || !editLrAccountPermission} className="title-right" onClick={() => {
          dispatch(calculationActions.deleteAccountItemCardAndRunning(accountingType))
        }}>
        删除
      </Button>
      {
          accountingType === 'manages' && cardUuid?
              <Button
                type="ghost"
                className="title-right"
                disabled={!selectList.size}
                onClick={() => {
                    selectList.size && selectList.map((v,i) => {
                        let idx,assType
                        payManageList.get('childList').some((item,index) => {
                            if (item.get('uuid') === v && item.get('beOpened') && !item.get('runningType')) {
                                idx = i
                                assType = item.get('assType')
                                dispatch(cxlsActions.getManagerCategoryList(idx,assType))
                                return true
                            }
                            return false
                        })
                    })
                    dispatch(cxlsActions.setManageMadalInitState())
                    this.setState({
                        manageModal:true
                    })
                }}>
                一键收/付
            </Button>:null
      }
      {
          accountingType === 'costTransfer' && runningState  && stockUuid ?
              <Button
                  type="ghost"
                  className="title-right"
                  disabled={!selectList.size}
                  onClick={() => {
                      dispatch(cxlsActions.setCarryoverMadalInitState())
                      this.setState({
                          carryoverModal:true
                      })
                }}>
                一键结转
            </Button>:null

      }
      {
          accountingType === 'certification' && certifiedType?
              <Button
                  type="ghost"
                  className="title-right"
                  disabled={!selectList.size}
                  onClick={() => {
                      dispatch(cxlsActions.setDefineMadalInitState())
                      this.setState({
                          defineModal:true
                      })
                }}>
                发票认证
            </Button>:null
      }
      {
          accountingType === 'invoicing' && invoicingType?
              <Button
                  type="ghost"
                  className="title-right"
                  disabled={!selectList.size}
                  onClick={() => {
                  dispatch(cxlsActions.setInvioceMadalInitState())
                  this.setState({
                      invioceModal:true
                  })
                }}>
                开具发票
            </Button>:null

      }
      <Modal
          visible={manageModal}
          onCancel={() => {
              this.setState({'manageModal':false})
              dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
          }}
          className='single-manager'
          title={`${modalTemp.get('handlingAmount')>0?'收款':'付款'}核销`}
          okText='保存'
          onOk={() => {
              dispatch(cxlsActions.insertManagerModal(()=>this.setState({'manageModal':false}),inputValue))
          }}
          >
              <div className='manager-content'>
              <div>
                  <label>往来单位：</label>
                  {`${usedCard.get('code')?usedCard.get('code'):''} ${usedCard.get('name')?usedCard.get('name'):''}`}
              </div>
              <div className='manager-item'><label>日期：</label>
              <DatePicker
                  value={modalTemp.get('runningDate')?moment(modalTemp.get('runningDate')):''}
                  onChange={value => {
                  const date = value.format('YYYY-MM-DD')
                      dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningDate'], date))
                  }}
              />
              </div>
              <div className='manager-item'>
                  <label>摘要：</label>
                  <Input
                      value={modalTemp.get('runningAbstract')}
                      onChange={(e) => {
                          dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningAbstract'], e.target.value))
                      }}
                  />
              </div>
              <div className='manager-item'>
                  <label>{`${modalTemp.get('handlingAmount')>0?'收款':'付款'}金额：`}</label>
                  <Input
                      value={Math.abs(modalTemp.get('handlingAmount'))}
                      onChange={(e) => {
                          numberTest(e,(value) => {
                              dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'handlingAmount'], value))
                          })
                      }}
                  />
              </div>
              <div className='manager-item'>
                  <label>账户：</label>
                  <Select
                      // combobox
                      value={modalTemp.get('accountName')}
                      onChange={value => {
                          const uuid = value.split(Limit.TREE_JOIN_STR)[0]
                          const accountName = value.split(Limit.TREE_JOIN_STR)[1]
                          dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'accountName'], value))
                          dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'accountUuid'], uuid))
                      }}
                      >
                      {accountList.getIn([0, 'childList']).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
                  </Select>
              </div>
              {
                  selectList.size && selectList.map((v,i) => {
                      let idx, assType, curItem
                      const hasQc =  payManageList.get('childList').some((item,index) => {
                          if (item.get('uuid') === v && item.get('runningAbstract') === '期初余额' && !item.get('runningType')) {
                             idx = index
                             curItem = item
                             assType = item.get('assType')
                              return true
                          }

                          return false
                      })
                      const name = {
                          AC_AR:'应收期初类别:',
                          AC_AP:'应付期初类别:',
                          AC_PP:'预收期初类别:',
                          AC_ADV:'预付期初类别:'
                      }[assType]
                      return (
                          hasQc?
                          <div className='manager-item'>
                              <label>{name}</label>
                              <Select
                              value={uuidList && uuidList.getIn([i,'categoryName'])?uuidList.getIn([i,'categoryName']):''}
                              onSelect={value =>dispatch(cxlsActions.changeBeforeAmount(curItem,value,i ))}
                              >
                              {managerCategoryList.get(i) && managerCategoryList.get(i).map((w, ii) => <Option key={ii} value={`${w.get('code')}${Limit.TREE_JOIN_STR}${w.get('name')}${Limit.TREE_JOIN_STR}${w.get('uuid')}`}>{w.get('name')}</Option>)}
                            </Select>
                        </div>:''
                      )

                  })
              }
          </div>
      </Modal>
      <Modal
          visible={carryoverModal}
          onCancel={() => {
              this.setState({'carryoverModal':false})
              dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
          }}
          className='single-manager'
          title='成本结转'
          okText='保存'
          onOk={() => {
              dispatch(cxlsActions.insertlrAccountCarryoverModal(()=>this.setState({'carryoverModal':false}),'fromcalCultion'))
          }}
      >
          <div className='manager-content'>
              <div className='manager-item'><label>日期：</label>
              <DatePicker
                  value={modalTemp.get('runningDate')?moment(modalTemp.get('runningDate')):''}
                  onChange={value => {
                  const date = value.format('YYYY-MM-DD')
                      dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningDate'], date))
                  }}
              />
              </div>
              <div className='manager-item'>
                  <label>摘要：</label>
                  <Input
                      value={modalTemp.get('runningAbstract')}
                      onChange={(e) => {
                          dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningAbstract'], e.target.value))
                      }}
                  />
              </div>
              <div className='manager-item'>
                  <label>金额：</label>
                  <Input
                      value={modalTemp.get('carryoverAmount')}
                      onChange={(e) => {
                          numberTest(e,(value) => {
                              dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'carryoverAmount'], value))
                          })
                      }}
                  />
              </div>

          </div>

      </Modal>
      <Modal
          visible={invioceModal}
          onCancel={() => {
              this.setState({'invioceModal':false})
              dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
          }}
          className='single-manager'
          title='开具发票'
          okText='保存'
          onOk={() => {
              dispatch(cxlsActions.insertlrAccountInvioceModal(()=>this.setState({'invioceModal':false}),'fromcalCultion'))
          }}
      >
          <div className='manager-content'>
          <div className='manager-item'><label>日期：</label>
          <DatePicker
              value={modalTemp.get('runningDate')?moment(modalTemp.get('runningDate')):''}
              onChange={value => {
              const date = value.format('YYYY-MM-DD')
                  dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningDate'], date))
              }}
          />
          </div>
          <div className='manager-item'>
              <label>摘要：</label>
              <Input
                  value={modalTemp.get('runningAbstract')}
                  onChange={(e) => {
                      dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningAbstract'], e.target.value))
                  }}
              />
          </div>
      </div>
      </Modal>
      <Modal
          visible={defineModal}
          onCancel={() => {
              this.setState({'defineModal':false})
              dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
          }}
          className='single-manager'
          title='发票认证'
          okText='保存'
          onOk={() => {
              dispatch(cxlsActions.insertlrAccountInvioceDefineModal(()=>this.setState({'defineModal':false}),'fromcalCultion'))
          }}
      >
          <div className='manager-content'>
          <div className='manager-item'><label>日期：</label>
          <DatePicker
              value={modalTemp.get('runningDate')?moment(modalTemp.get('runningDate')):''}
              onChange={value => {
              const date = value.format('YYYY-MM-DD')
                  dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningDate'], date))
              }}
          />
          </div>
          <div className='manager-item'>
              <label>摘要：</label>
              <Input
                  value={modalTemp.get('runningAbstract')}
                  onChange={(e) => {
                      dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningAbstract'], e.target.value))
                  }}
              />
          </div>
      </div>
      </Modal>
	</div>)
  }
}
