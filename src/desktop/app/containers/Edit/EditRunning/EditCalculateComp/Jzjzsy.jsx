import React, { Fragment } from 'react'
import {immutableRenderDecorator} from 'react-immutable-render-mixin'
import moment from 'moment'
import { fromJS } from 'immutable'
import { formatMoney, numberCalculate } from 'app/utils'
import { DatePicker, Input, Select, Icon, Divider,message, Radio } from 'antd'
import { TableBody, TableTitle, TableItem, TableAll, TableOver, TableBottomPage } from 'app/components'
import XfIcon from 'app/components/Icon'
import NumberInput from 'app/components/Input'
const MonthPicker = DatePicker.MonthPicker
const Option = Select.Option
const RadioGroup = Radio.Group
import * as Limit from 'app/constants/Limit.js'

import CategorySelect from './component/CategorySelect'
import { getUuidList } from './component/CommonFun'
import CommonModal from 'app/containers/Mxb/MxbModal/CommonModal'
import CommonTreeModal from 'app/containers/Mxb//MxbModal/CommonTreeModal'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'


@immutableRenderDecorator
export default
class Jzjzsy extends React.Component {

    static displayName = 'Jzjzsy'

    constructor() {
        super()
        this.state = {
            showModal: false
        }
    }

    render() {

        const {
          JzjzsyTemp,
          dispatch,
          disabledDate,
          insertOrModify,
          hideCategoryList,
          accountList,
          isCheckOut,
          calculateViews
        } = this.props

        const { showModal } = this.state

        const oriDate = this.props.oriDate
        const oriAbstract = JzjzsyTemp.get('oriAbstract')
        const amount = JzjzsyTemp.get('amount')
        const jrIndex = JzjzsyTemp.get('jrIndex')
        const oriState = JzjzsyTemp.get('oriState')
        const cardPages = JzjzsyTemp.get('cardPages')
        const currentPage = JzjzsyTemp.get('currentPage')
        const pageSize = JzjzsyTemp.get('pageSize')
        // 筛选
        const chooseProjectCard = JzjzsyTemp.get('chooseProjectCard')
        const curSelectProjectUuid = JzjzsyTemp.get('curSelectProjectUuid')
        const projectCardList = JzjzsyTemp.get('projectCardList')
        const chooseJrCategoryCard = JzjzsyTemp.get('chooseJrCategoryCard')
        const curSelectJrCategoryUuid = JzjzsyTemp.get('curSelectJrCategoryUuid')
        const jrCategoryList = JzjzsyTemp.get('jrCategoryList')
        const modalName = JzjzsyTemp.get('modalName')
        const pendingProfitAndLossCarryoverList = JzjzsyTemp.get('pendingProfitAndLossCarryoverList')
        const projectFilterList = (chooseProjectCard.size === projectCardList.size + 1 ) || !chooseProjectCard.size  ? pendingProfitAndLossCarryoverList :
                            pendingProfitAndLossCarryoverList.filter(v => {
                                return chooseProjectCard.indexOf('空白') > -1 ? (chooseProjectCard.indexOf(v.get('projectCardUuid')) > -1 || !v.get('projectCardUuid')) :
                                chooseProjectCard.indexOf(v.get('projectCardUuid')) > -1
                            })
        const filterList =  chooseJrCategoryCard.size ?  projectFilterList.filter(v=> chooseJrCategoryCard.indexOf(v.get('categoryUuid')) > -1)  :   projectFilterList

        const start = (currentPage - 1) * pageSize
		const end = currentPage * pageSize
		const showList =  filterList.slice(start,end)

        let allAmount = 0, allDebitAmount = 0, allCreditAmount = 0
        pendingProfitAndLossCarryoverList && pendingProfitAndLossCarryoverList.map(v => {
            allAmount = numberCalculate(allAmount,v.get('amount'))
            allDebitAmount = numberCalculate(allDebitAmount,v.get('debitAmount'))
            allCreditAmount = numberCalculate(allCreditAmount,v.get('creditAmount'))
        })


        const amountName = {
            'STATE_SYJZ_JZSR':'收入',
            'STATE_SYJZ_JZCBFY':'成本费用',
            'STATE_SYJZ_JZBNLR':'本年利润',
            '':'金额'
        }[oriState]

        const paymentTypeStr = calculateViews.get('paymentTypeStr')
        const position = "JzjzsyTemp"

        const jzjzsyClassName = oriState === 'STATE_SYJZ_JZSR' || oriState === 'STATE_SYJZ_JZCBFY' ? "account-jzjzsy-table-width" : 'account-jzbnlr-table-width'

        const finalUuidList = getUuidList(showList) // 上下条

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
                <div className="edit-running-modal-list-item">
                    <label>日期：</label>
                    <div>
                        <DatePicker allowClear={false} disabledDate={disabledDate} value={oriDate?moment(oriDate):''} onChange={value => {
                            const date = value.format('YYYY-MM-DD')
                            dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
                        }}/>
                    </div>
                </div>
                <CategorySelect
					dispatch={dispatch}
					insertOrModify={insertOrModify}
					paymentTypeStr={paymentTypeStr}
					hideCategoryList={hideCategoryList}
				/>
                {
                    <div className="edit-running-modal-list-item">
                        <label></label>
                        <div>
                            <RadioGroup
                                value={oriState}
                                disabled={insertOrModify === 'modify'}
                            >
                                <Radio key="a" value={'STATE_SYJZ_JZSR'}>结转收入</Radio>
                                <Radio key="a" value={'STATE_SYJZ_JZCBFY'}>结转成本费用</Radio>
                                <Radio key="b" value={'STATE_SYJZ_JZBNLR'}>结转本年利润</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                }
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
                    <label>{amountName}：</label>
                    <div>
                        <NumberInput
                            value={amount}
                            disabled={true}
                        />
                    </div>
                </div>

                <TableAll className="lrAccount-table">
                    <div className="table-title-wrap">
                        <ul className={jzjzsyClassName ? `${jzjzsyClassName} table-title` : "table-title"}>
                            <li><span>日期</span></li>
                            <li><span>流水号</span></li>
                            {
                                oriState === 'STATE_SYJZ_JZSR' || oriState === 'STATE_SYJZ_JZCBFY' ?
                                <Fragment>
                                    <li
										className={'position-item'}
										onClick={()=>{
											if(modalName === ''){
                                                dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'curSelectJrCategoryUuid',chooseJrCategoryCard))
                                                dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'modalName','流水类别'))
											}
										}}
									>
                                        <span>
                                            流水类别
                                            {
                                                chooseJrCategoryCard.size ?
                                                <XfIcon type='filter'/> : <XfIcon  type='not-filter'/>
                                            }
                                        </span>

                                        {
                                            <Fragment>
                                                <div
                                                    className="common-modal-mask"
                                                    style={{display: modalName ===  '流水类别' ? 'block' : 'none'}}
                                                    onClick={(e)=>{
                                                        e.stopPropagation()
                                                        dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'curSelectJrCategoryUuid',fromJS([])))
                                                        dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'modalName',''))
                                                    }}
                                                ></div>
                                                <div className={'position-item-modal'}>
                                                    <CommonTreeModal
                                                        modalStyle={{display: modalName ===  '流水类别' ? 'block' : 'none'}}
                                                        modalName={modalName}
                                                        cardList={modalName === '流水类别' ? jrCategoryList : fromJS()}
                                                        curSelectUuid={modalName ===  '流水类别' ? curSelectJrCategoryUuid : fromJS([])}
                                                        dispatch={dispatch}
                                                        cancel={() => {
                                                            dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'curSelectJrCategoryUuid',fromJS([])))
                                                            dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'modalName',''))
                                                        }}
                                                        checkedKeys={curSelectJrCategoryUuid.toJS() || []}
                                                        onCheck={(info,e,allUUidList)=>{
                                                            const isChecked = e.checked
                                                            const notAllList = info.filter(v => v !== 'all')
                                                            if(isChecked){
                                                                if(notAllList.length === allUUidList.length || !notAllList.length || e.node.props.title === '(全选)'){
                                                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'curSelectJrCategoryUuid',fromJS(['all'].concat(allUUidList))))
                                                                }else{
                                                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'curSelectJrCategoryUuid',fromJS(notAllList)))
                                                                }
                                                            }else{
                                                                if(notAllList.length === allUUidList.length){
                                                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'curSelectJrCategoryUuid',fromJS([])))
                                                                }else{
                                                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'curSelectJrCategoryUuid',fromJS(notAllList)))
                                                                }

                                                            }
                                                        }}
                                                        onOkCallback={() => {
                                                            dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'chooseJrCategoryCard',curSelectJrCategoryUuid))
                                                        }}
                                                        allCheckBoxClick={(checkedAll,allList)=>{
                                                            // dispatch(relativeMxbActions.changeItemCheckboxCheckAll(checkedAll,allList,curSelectUuidName))
                                                        }}
                                                        nameString='name'
                                                        uuidString='uuid'
                                                    />
                                                </div>


                                            </Fragment>
                                        }

                                    </li>
                                    <li><span>摘要</span></li>
                                    <li className={'position-item'}>
                                        <span>类型</span>
                                    </li>
                                </Fragment> : null
                            }

                            <li
                                className={'position-item'}
                                onClick={()=>{
                                    if(modalName === ''){
                                        dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'curSelectProjectUuid',chooseProjectCard))
                                        dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'modalName','项目'))
                                    }
                                }}
                            >
                                <span>
                                    项目
                                    {
                                        chooseProjectCard.size ?
                                        <XfIcon type='filter'/> : <XfIcon  type='not-filter'/>
                                    }
                                </span>

                                {
                                    <Fragment>
                                        <div
                                            className="common-modal-mask"
                                            style={{display: modalName ===  '项目' ? 'block' : 'none'}}
                                            onClick={(e)=>{
                                                e.stopPropagation()
                                                dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'modalName',''))
                                                dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'curSelectProjectUuid',fromJS([])))
                                            }}
                                        ></div>
                                        <div className={'position-item-modal'}>
                                            <CommonModal
                                                modalStyle={{display: modalName === '项目'  ? 'block' : 'none',right:'12.5%',top:'36px;'}}
                                                modalName={modalName}
                                                cardList={modalName === '项目' ? projectCardList  : fromJS()}
                                                curSelectUuid={ modalName === '项目' ? curSelectProjectUuid : fromJS([])}
                                                isCardUuid={true}
                                                dispatch={dispatch}
                                                cancel={() => {
                                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'modalName',''))
                                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'curSelectProjectUuid',fromJS([])))
                                                }}
                                                onOkCallback={(curSelectUuid) => {
                                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'chooseProjectCard',curSelectUuid))

                                                    const filterList = curSelectUuid.size ? pendingProfitAndLossCarryoverList.filter(v => curSelectUuid.indexOf(v.get('projectCardUuid')) > -1) : pendingProfitAndLossCarryoverList
                                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'currentPage',1))
                                                    dispatch(editCalculateActions.changeEditCalculateCommonState('JzjzsyTemp', 'cardPages', Math.ceil(filterList.size/pageSize)))

                                                }}
                                                singleCheckBoxClick={(checked,uuid)=>{
                                                    dispatch(editCalculateActions.changeJzFilterModalCheck(checked,uuid))
                                                }}
                                                allCheckBoxClick={(checkedAll,allList)=>{
                                                    dispatch(editCalculateActions.changeJzFilterModalCheck(checkedAll,'',allList,true))
                                                }}
                                            />
                                        </div>


                                    </Fragment>
                                }
                            </li>
                            {
                                oriState === 'STATE_SYJZ_JZSR' || oriState === 'STATE_SYJZ_JZCBFY' ?
                                <li><span>发生金额</span></li> :
                                <Fragment>
                                    <li><span>借方金额</span></li>
                                    <li><span>贷方金额</span></li>
                                </Fragment>
                            }


                        </ul>
                    </div>
                    <TableBody>
                        {
                            showList && showList.map((v,i) => {
                                return <TableItem className={jzjzsyClassName}>
                                    <li>{v.get('oriDate')}</li>
                                    <TableOver
                                        textAlign='left'
                                        className={v.get('jrIndex') ? 'account-flowNumber' : ''}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            dispatch(previewRunningActions.getPreviewRunningBusinessFetch(v, 'lrls',fromJS(finalUuidList),()=>{
                                                dispatch(editCalculateActions.getAssetsList('LB_JZSY', 'CqzcTemp'))
                                            }))
                                        }}
                                    >
                                        <span>{v.get('jrIndex') ? `${v.get('jrIndex')}号` : '期初余额'}</span>
                                    </TableOver>
                                    {
                                        oriState === 'STATE_SYJZ_JZSR' || oriState === 'STATE_SYJZ_JZCBFY' ?
                                        <Fragment>
                                            <li>{v.get('categoryName')}</li>
                                            <li><span>{v.get('oriAbstract')}</span></li>
                                            <li><p>{v.get('jrJvTypeName') ? v.get('jrJvTypeName') : ''}</p></li>
                                        </Fragment> : null
                                    }

                                    <li><p>{`${v.get('projectCardCode') ? v.get('projectCardCode') : ''} ${v.get('projectCardName') ? v.get('projectCardName') : ''}`}</p></li>
                                    {
                                        oriState === 'STATE_SYJZ_JZSR' || oriState === 'STATE_SYJZ_JZCBFY' ?
                                        <li><p>{v.get('amount') ? formatMoney(v.get('amount'), 2, '') : ''}</p></li> :
                                        <Fragment>
                                            <li><p>{v.get('debitAmount') ? formatMoney(v.get('debitAmount'), 2, '') : ''}</p></li>
                                            <li><p>{v.get('creditAmount') ? formatMoney(v.get('creditAmount'), 2, '') : ''}</p></li>
                                        </Fragment>
                                    }

                                </TableItem>
                            })
                        }
                        <TableItem className={jzjzsyClassName}>
                            <li></li>
                            {
                                oriState === 'STATE_SYJZ_JZSR' || oriState === 'STATE_SYJZ_JZCBFY' ?
                                <Fragment>
                                    <li></li>
                                    <li></li>
                                </Fragment> : null

                            }
                            <li>合计</li>
                            {
                                oriState === 'STATE_SYJZ_JZSR' || oriState === 'STATE_SYJZ_JZCBFY' ?
                                <Fragment>
                                    <li></li>
                                    <li></li>
                                    <li><p>{allAmount ? allAmount : ''}</p></li>
                                </Fragment> :
                                <Fragment>
                                    <li></li>
                                    <li><p>{allDebitAmount ? allDebitAmount : ''}</p></li>
                                    <li><p>{allCreditAmount ? allCreditAmount : ''}</p></li>
                                </Fragment>

                            }
                        </TableItem>

                    </TableBody>
                    <TableBottomPage
                        total={filterList.size === 0 ? 1 : filterList.size}
                        current={currentPage}
                        onChange={(page) => {
                            dispatch(editCalculateActions.changeEditCalculateCommonState('JzjzsyTemp', 'currentPage', page))
                        }}
                        totalPages={cardPages}
                        pageSize={pageSize}
                        showSizeChanger={true}
                        hideOnSinglePage={false}
                        onShowSizeChange={(curPageSize) => {
                            dispatch(editCalculateActions.changeEditCalculateCommonState('JzjzsyTemp', 'pageSize', curPageSize))
                            dispatch(editCalculateActions.changeEditCalculateCommonState('JzjzsyTemp', 'currentPage', 1))
                            dispatch(editCalculateActions.changeEditCalculateCommonState('JzjzsyTemp', 'cardPages', Math.ceil(pendingProfitAndLossCarryoverList.size/curPageSize)))

                        }}
                        className={'payment-table-select' }
                    />
                </TableAll>
            </div>
        )
    }
}
