import React, { Fragment } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { formatMoney, numberCalculate, formatDate } from 'app/utils'
import { DatePicker, Input, Select, message, Tree, Icon, Button, Radio } from 'antd'
const RadioGroup = Radio.Group
import NumberInput from 'app/components/Input'
import XfIcon from 'app/components/Icon'
import { XfInput } from 'app/components'
const Option = Select.Option
import { fromJS } from 'immutable'
import moment from 'moment'

import * as Limit from 'app/constants/Limit.js'
import { Amount, TableBody, TableTitle, TableItem, TableAll, TableOver, TableBottomPage } from 'app/components'
import StockModal from './component/StockModal'
import StockSingleModal from './component/StockSingleModal'
import CategorySelect from './component/CategorySelect'
import Inventory from './stock/Inventory'
import { numberTest } from './component/numberTest'
import { getUuidList } from './component/CommonFun'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'

@immutableRenderDecorator
export default
    class Xmjz extends React.Component {

    static displayName = 'Xmjz'

    constructor() {
        super()
        this.state = {
            showCommonChargeModal: false,
            showSingleModal: false,
            selectTreeUuid: 'all',
            selectTreeLevel: 0,
        }
    }
    componentDidMount() {
        const oriDate = this.props.oriDate
        // this.props.dispatch(editCalculateActions.getChargeProjectCard('STATE_XMJZ', 'ProjectCarryoverTemp'))
        // this.props.dispatch(editCalculateActions.getCostCarryoverStockList(oriDate,'STATE_YYSR_ZJ','','ProjectCarryoverTemp'))
        // this.props.dispatch(editCalculateActions.getCanUseWarehouseCardList('ProjectCarryoverTemp'))
    }
    render() {
        const {
            dispatch,
            ProjectCarryoverTemp,
            hideCategoryList,
            insertOrModify,
            paymentType,
            disabledDate,
            commonCardObj,
            calculateViews,
            enableWarehouse,
            openQuantity,
			disabledBeginDate,
            serialList,
        } = this.props
        const { showSingleModal, selectTreeUuid, selectTreeLevel } = this.state
        const reg = /^-{0,1}\d*\.?\d{0,2}$/
        const paymentTypeStr = calculateViews.get('paymentTypeStr')
        const position = "ProjectCarryoverTemp"

        const modify = insertOrModify === 'modify' ? true : false
        const oriDate = this.props.oriDate
        const oriAbstract = ProjectCarryoverTemp.get('oriAbstract')
        const jrIndex = ProjectCarryoverTemp.get('jrIndex')
        const amount = ProjectCarryoverTemp.get('amount') ? ProjectCarryoverTemp.get('amount') : 0
        const receiveAmount = ProjectCarryoverTemp.get('receiveAmount')
        const currentAmount = ProjectCarryoverTemp.get('currentAmount')
        const stockCardList = ProjectCarryoverTemp.get('stockCardList')
        const allStockCardList = ProjectCarryoverTemp.get('allStockCardList')
        const allWareHouseCardList = ProjectCarryoverTemp.get('allWareHouseCardList')
        const stockCardUuidList = ProjectCarryoverTemp.get('stockCardUuidList')
        const wareHouseCardList = ProjectCarryoverTemp.get('wareHouseCardList')
        const projectCard = ProjectCarryoverTemp.get('projectCard')
        const projectList = ProjectCarryoverTemp.get('projectList')
        const stockRange = ProjectCarryoverTemp.get('stockRange')
        const categoryTypeObj = ProjectCarryoverTemp.get('categoryTypeObj')
        const projectRange = ProjectCarryoverTemp.get('projectRange')
        const oriState = ProjectCarryoverTemp.get('oriState')
        const carryoverList = ProjectCarryoverTemp.get('carryoverList')
        const allHappenAmount = ProjectCarryoverTemp.get('allHappenAmount')
        const allStoreAmount = ProjectCarryoverTemp.get('allStoreAmount')
        const oriUuid = ProjectCarryoverTemp.get('oriUuid')
		const pageSize = ProjectCarryoverTemp.get('pageSize')
		const totalNumber = ProjectCarryoverTemp.get('totalNumber')
        const modifycurrentPage = ProjectCarryoverTemp.get('modifycurrentPage')
		const cardPages = ProjectCarryoverTemp.get('cardPages')
		const start = (modifycurrentPage - 1) * pageSize
		const end = modifycurrentPage * pageSize
        const showList = projectCard.get('projectProperty') === 'XZ_CONSTRUCTION' ? carryoverList.slice(start,end) : carryoverList
        const selectI = calculateViews.get('selectI')

        const memberList = commonCardObj.get('memberList')
        const thingsList = commonCardObj.get('thingsList')
        const selectItem = commonCardObj.get('selectItem')
        const selectList = commonCardObj.get('selectList')
        const selectedKeys = commonCardObj.get('selectedKeys')
        const cardPageObj = commonCardObj.get('cardPageObj')
        const modalName = commonCardObj.get('modalName')

        let detailDate = formatDate().slice(0,10)
        let curDateTime = 0
        if (carryoverList && carryoverList.size) {
            carryoverList.forEach((v, index) => {
                const itemDate = new Date(v.get('oriDate')).getTime()
                // 不能早于前置流水最晚日期
                detailDate = curDateTime > itemDate ? detailDate : v.get('oriDate')
                curDateTime = new Date(detailDate).getTime()
            })
        }

        let totalCbAmount = 0.00

        let costStockOption = [], stockCardIdList = [],selectUuidForPrice = []
        stockCardList.map(v => {
            stockCardIdList.push(v.get('cardUuid'))
            totalCbAmount = numberCalculate(totalCbAmount,v.get('amount'))
            if(v.get('isOpenedQuantity')){
                selectUuidForPrice.push({
                    cardUuid:v.get('cardUuid'),
                    isUniformPrice: v.get('isUniformPrice'),
                    assistList: v.get('assistList'),
                    batchUuid: v.get('batchUuid'),
                })
            }

        })
        const singlethingsList = thingsList.size ? thingsList.filter(item => stockCardIdList.indexOf(item.get('uuid')) === -1) : fromJS([])
        if (allStockCardList && allStockCardList.size) {
            allStockCardList.forEach((v, i) => {
                if (stockCardIdList.indexOf(v.get('uuid')) === -1) {
                    const itemCard = v.toJS();
                    const unit = itemCard.unit ? JSON.stringify(itemCard.unit) : JSON.stringify({ unitList: [] })
                    costStockOption.push(
                        <Option key={v.get('code')} value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('isOpenedQuantity')}${Limit.TREE_JOIN_STR}${v.get('isUniformPrice')}${Limit.TREE_JOIN_STR}${unit}`}>
                            {`${v.get('code')} ${v.get('name')}`}
                        </Option>
                    )
                }

            })
        }
        const disabledDateFun = function (current, modify, detailDate) {
			if (modify) {
				return current && (moment(disabledBeginDate) > current || current < moment(detailDate))
			}
			return current && (moment(disabledBeginDate) > current)
		}

        const otherComp = <div className='table-bottom-select'>
							<p><span>待确认收入净额：</span><span>待确认成本净额：</span></p>
							<p><Amount showZero={true}>{allHappenAmount}</Amount><Amount showZero={true}>{allStoreAmount}</Amount></p>
						</div>

        const titleList = projectCard.get('projectProperty') === 'XZ_PRODUCE' ? ['日期', '流水号', '流水类别', '摘要','类型', '发生金额', '已入库金额'] : ['日期', '流水号', '流水类别', '摘要','类型', '待确认/已确认收入', '待确认/已确认成本']

        const stockTotalAmount = stockCardList.reduce((pre,cur) => pre += Number(cur.get('amount') || 0),0)

        const finalUuidList = getUuidList(showList) // 上下条

        return (
            <div className="accountConf-modal-list">
                {
                    insertOrModify === 'modify' ?
                        <div className="edit-running-modal-list-item">
                            <label>流水号：</label>
                            <div>
                                <Input
                                    style={{ width: '70px', marginRight: '5px' }}
                                    value={jrIndex}
                                    onChange={(e) => {
                                        if (/^\d{0,6}$/.test(e.target.value)) {
                                            dispatch(editCalculateActions.changeEditCalculateCommonState('ProjectCarryoverTemp', 'jrIndex', e.target.value))
                                        } else {
                                            message.info('流水号不能超过6位')
                                        }
                                    }}
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
                        <DatePicker
                            allowClear={false}
                            disabledDate={(current) => {
								if (modify && oriState !== 'STATE_XMJZ_JZRK' && oriState !== 'STATE_XMJZ_QRSRCB') {
									return disabledDateFun(current, modify, detailDate)
								} else {
									return disabledDateFun(current)
								}
							}}
                            value={moment(oriDate)}
                            onChange={value => {
                                const date = value.format('YYYY-MM-DD')
                                selectUuidForPrice && selectUuidForPrice.length && dispatch(editCalculateActions.getStockBuildUpPrice(date,selectUuidForPrice, 0,'ProjectCarryover','notFinish'))
                                dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
                                projectCard.get('cardUuid') && dispatch(editCalculateActions.getProjectCarryoverList(date,projectCard.get('cardUuid')))
                                dispatch(editCalculateActions.getProjectCarryoverCard({
                                    oriDate: date,
                                    categoryUuid: '',
                                    level: '',
                                    justCard: true,
                                    needLeft: false
                                }))
                            }} />
                    </div>
                </div>
                <CategorySelect
                    dispatch={dispatch}
                    insertOrModify={insertOrModify}
                    paymentTypeStr={paymentTypeStr}
                    hideCategoryList={hideCategoryList}
                />
                {
                    <div className="edit-running-modal-list-item" >
						<label>项目：</label>
						<div className='chosen-right'>
							<Select
								combobox
								showSearch
                                disabled={insertOrModify === 'modify'}
								value={`${projectCard.get('code') !== 'COMNCRD' && projectCard.get('code') ? projectCard.get('code') : ''} ${projectCard.get('name') ? projectCard.get('name') : ''}`}
								onChange={(value,options) => {
									const valueList = value.split(Limit.TREE_JOIN_STR)
									const cardUuid = options.props.uuid
									const code = valueList[0]
									const name = valueList[1]
									const projectProperty = options.props.projectProperty
									dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'projectCard', fromJS({ cardUuid, name, code, projectProperty })))
                                    dispatch(editCalculateActions.getProjectCarryoverList(oriDate,cardUuid,'',projectProperty))
                                    if(projectProperty === 'XZ_PRODUCE'){
                                        dispatch(innerCalculateActions.changeEditCalculateCommonString('ProjectCarryover', 'oriState', 'STATE_XMJZ_JZRK'))
                                        dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriAbstract', '结转入库存货'))
                                        dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'receiveAmount', ''))
                                        dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'currentAmount', ''))
                                    }else{
                                        dispatch(innerCalculateActions.changeEditCalculateCommonString('ProjectCarryover', 'oriState', 'STATE_XMJZ_QRSRCB'))
                                        dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriAbstract', '确认收入成本'))
                                    }
								}}
							>
								{projectList && projectList.filter(v => v.get('code') !== 'COMNCRD').map((v, i) =>
									<Option
                                        key={i}
                                        value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                        uuid={v.get('uuid')}
                                        projectProperty={v.get('projectProperty')}
                                    >
										{`${v.get('code') !== 'COMNCRD' ? v.get('code') : ''} ${v.get('name')}`}
									</Option>
								)}
							</Select>
							{
                                insertOrModify === 'insert' ?
								<div className='chosen-word'
									onClick={() => {
                                        dispatch(editCalculateActions.getProjectCarryoverCard({
                                            oriDate,
                                            categoryUuid: '',
                                            level: '',
                                            justCard: true,
                                            needLeft: true,
                                            currentPage: 1,
                                        }))
                                        this.setState({
                                            showSingleModal: true
                                        })

									}}>选择</div> : null
							}
						</div>
					</div>

                }
                {
                    <div className="edit-running-modal-list-item">
                        <label></label>
                        <div>
                            <RadioGroup
                                value={oriState}
                                disabled={insertOrModify === 'modify'}
                                onChange={e => {
                                    dispatch(innerCalculateActions.changeEditCalculateCommonString('ProjectCarryover', 'oriState', e.target.value))
                                    dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriAbstract', { STATE_XMJZ_JZRK: '结转入库存货', STATE_XMJZ_XMJQ: '项目结清', STATE_XMJZ_QRSRCB: '确认收入成本'}[e.target.value]))
                                    dispatch(innerCalculateActions.changeEditCalculateCommonString('ProjectCarryover', 'stockCardList', fromJS([{}])))
                                }}>
                                {
                                    projectCard.get('projectProperty') === 'XZ_PRODUCE' ?
                                    <Radio key="a" value={'STATE_XMJZ_JZRK'}>结转入库</Radio> :
                                    null
                                }
                                {
                                    projectCard.get('projectProperty') === 'XZ_CONSTRUCTION' ?
                                    <Radio key="a" value={'STATE_XMJZ_QRSRCB'}>确认收入成本</Radio> :
                                    null
                                }

                                <Radio key="b" value={'STATE_XMJZ_XMJQ'}>项目结清</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                }
                <div className='accountConf-separator'></div>

                <div className="edit-running-modal-list-item">
                    <label>摘要：</label>
                    <div>
                        <Input className="focus-input"
                            onFocus={(e) => {
                                document.getElementsByClassName('focus-input')[0].select();
                            }}
                            value={oriAbstract}
                            onChange={(e) => {
                                dispatch(innerCalculateActions.changeEditCalculateCommonString('ProjectCarryover', 'oriAbstract', e.target.value))
                            }}
                        />
                    </div>
                </div>
                {
                    projectCard.get('projectProperty') === 'XZ_CONSTRUCTION' && (oriState === 'STATE_XMJZ_QRSRCB' || oriState === 'STATE_XMJZ_XMJQ' && (Number(allStoreAmount) !== Number(allHappenAmount) )) ?
                    <Fragment>
                        <div className="edit-running-modal-list-item">
                            <label>收入金额：</label>
                            <div>
                                <XfInput
                                    mode='amount'
                                    value={receiveAmount}
                                    negativeAllowed={true}
                                    onChange={(e) =>{
                                        dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'receiveAmount', e.target.value))
                                    }}
                                    onKeyDown={(e)=>{
                                        if(e.keyCode === Limit.EQUAL_KEY_CODE && projectCard.get('projectProperty') === 'XZ_CONSTRUCTION'){
                                            const willDealAmount = numberCalculate(allHappenAmount,allStoreAmount,2,'subtract')
                                            const value = numberCalculate(willDealAmount,currentAmount)
                                            dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'receiveAmount', value))
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="edit-running-modal-list-item">
                            <label>成本金额：</label>
                            <div>
                                <XfInput
                                    mode='amount'
                                    value={currentAmount}
                                    negativeAllowed={true}
                                    onChange={(e) =>{
                                        dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'currentAmount', e.target.value))
                                    }}
                                    onKeyDown={(e)=>{
                                        if(e.keyCode === Limit.EQUAL_KEY_CODE && projectCard.get('projectProperty') === 'XZ_CONSTRUCTION'){
                                            const willDealAmount = numberCalculate(allHappenAmount,allStoreAmount,2,'subtract')
                                            const value = numberCalculate(receiveAmount,willDealAmount,2,'subtract')
                                            dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'currentAmount', value))
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="edit-running-modal-list-item">
                            <label>合同毛利：{numberCalculate(receiveAmount,currentAmount,2,'subtract')}</label>
                        </div>
                    </Fragment> : null
                }

                {
                    (oriState === 'STATE_XMJZ_JZRK' || allHappenAmount > allStoreAmount)  && projectCard.get('projectProperty') !== 'XZ_CONSTRUCTION' ?
                    <Inventory
                        dispatch={dispatch}
                        stockCardList={stockCardList}
                        stockList={allStockCardList}
                        stockRange={[]}
                        oriState={oriState}
                        amount={amount}
                        oriDate={oriDate}
                        oriUuid={oriUuid}
                        MemberList={memberList}
                        thingsList={thingsList}
                        // categoryTypeObj={categoryTypeObj}
                        carryoverCardList={allWareHouseCardList}
                        currentCardType={'stock'}
                        selectedKeys={selectedKeys}
                        warehouseList={wareHouseCardList}
                        insertOrModify={insertOrModify}
                        enableWarehouse={enableWarehouse}
                        openQuantity={openQuantity}
                        selectList={selectList}
                        // showStockModal={showStockModal}
                        selectItem={selectItem}
                        stockTitleName={'存货'}
                        stockTemplate={'stockCardList'}
                        oriStockTemplate={'oriStockCardList'}
                        sectionTemp={'ProjectCarryover'}
                        amountDisable={false}
                        isCardUuid={true}
                        needHidePrice={false}
                        serialList={serialList}
                        selectTreeCallBack={(uuid,level)=>{
                            if (uuid === 'all') {
                                dispatch(editCalculateActions.getStockCardList('ProjectCarryoverTemp'))
                            } else {
                                dispatch(editCalculateActions.getStockSomeCardList({uuid, level}))
                            }
                        }}
                        callback={()=> {
                            const chooseIndex = stockCardList.size
                            let selectUuidList = []
                            selectItem && selectItem.size && selectItem.map((item, index) => {
                                selectUuidList.push({
                                    cardUuid: item.get('uuid'),
                                    storeUuid: '',
                                    assistList: item.get('assistList'),
                                    batchUuid: item.get('batchUuid'),
                                    isUniformPrice: item.get('isUniformPrice'),
                                    index: chooseIndex + index,
                                    noNeedPrice: true,
                                    moreUnit: item.getIn(['unit','unitList']) && item.getIn(['unit','unitList']).size
                                })

                            })
                            if(selectUuidList.length > 0){
                                dispatch(editCalculateActions.getStockBuildUpPrice(oriDate,selectUuidList, chooseIndex,'ProjectCarryover','notFinish'))
                            }
                        }}
                        amountOnKeyDown={(callBackObj)=>{
                            const { keyCode, curAmount, curQuantity, curIndex } = callBackObj
                            if(keyCode === Limit.EQUAL_KEY_CODE){
                                const needDealAmount = numberCalculate(allHappenAmount,allStoreAmount,2,'subtract')
                                const allAmount = numberCalculate(stockTotalAmount,curAmount,2,'subtract')
                                const value = numberCalculate(needDealAmount,allAmount,2,'subtract')
                                if(value > 0){
                                    dispatch(editCalculateActions.changeEditCalculateCommonString('ProjectCarryover', ['stockCardList',curIndex,'amount'], value))
                                    if (curQuantity > 0 ) {
                                        const price = numberCalculate(value, curQuantity,4,'divide',4)
                                        dispatch(editCalculateActions.changeEditCalculateCommonString('ProjectCarryover', ['stockCardList',curIndex,'price'], price))
                                    }
                                }
                            }
                        }}
                    /> : null
                }

                <div className='accountConf-separator'></div>

                {
                    (oriState === 'STATE_XMJZ_JZRK' || allHappenAmount > allStoreAmount ) && projectCard.get('projectProperty') !== 'XZ_CONSTRUCTION'?
                    <div className='editRunning-detail-title-single'>
                        <div className='editRunning-detail-title-bottom'>

                            <span>入库金额：{totalCbAmount}</span>
                            <span>待入库金额：{numberCalculate(allHappenAmount,allStoreAmount,2,'subtract')}</span>

                        </div>
                    </div> : null
                }
                {
                    projectCard.get('projectProperty') === 'XZ_CONSTRUCTION' && (oriState === 'STATE_XMJZ_QRSRCB' || oriState === 'STATE_XMJZ_XMJQ' && insertOrModify === 'insert') ?
                        <div className='editRunning-detail-title-single'>
                            {
                                // <div className='editRunning-detail-title-top'></div>
                            }

                            <div className='editRunning-detail-title-bottom'>
                                <span></span>
                                <span></span>
                                {
                                    <span>
                                    待确认合同毛利：<span>{numberCalculate(allHappenAmount,allStoreAmount,2,'subtract')}</span>
                                    </span>
                                }
                            </div>
                        </div> : null
                }
                <TableAll className="lrAccount-table account-xmjz-table-select">
                    <TableTitle
                        className="account-xmjz-table-width"
                        titleList={titleList}
                    />
                    <TableBody>
                        {
                            showList && showList.map((v,i) => {
                                return <TableItem className="account-xmjz-table-width">
                                    <li>{v.get('oriDate')}</li>
                                    <TableOver
                                        textAlign='left'
                                        className='account-flowNumber'
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            dispatch(previewRunningActions.getPreviewRunningBusinessFetch(v, 'lrls', fromJS(finalUuidList), ()=>{
                                                projectCard.get('cardUuid') && dispatch(editCalculateActions.getProjectCarryoverList(oriDate,projectCard.get('cardUuid')))
                                            }))
                                        }}
                                    >
                                        <span>{v.get('jrIndex') ? `${v.get('jrIndex')}号` : ''}</span>
                                    </TableOver>
                                    <li>{v.get('categoryName')}</li>
                                    <li><span>{v.get('oriAbstract')}</span></li>
                                    <li><span>{v.get('jrJvTypeName') ? v.get('jrJvTypeName') : ''}</span></li>
                                    {
                                        projectCard.get('projectProperty') === 'XZ_CONSTRUCTION' ?
                                        <Fragment>
                                            <li><p style={{textAlign: v.get('direction') === 'debit' ? 'left' : 'right',paddingLeft:'4px'}}>{v.get('happenAmount') ? formatMoney(v.get('happenAmount'), 2, '') : ''}</p></li>
                                            <li><p style={{textAlign: v.get('direction') === 'debit' ? 'left' : 'right',paddingLeft:'4px'}}>{v.get('storeAmount') ? formatMoney(v.get('storeAmount'), 2, '') : ''}</p></li>
                                        </Fragment> :
                                        <Fragment>
                                            <li><p>{v.get('happenAmount') ? formatMoney(v.get('happenAmount'), 2, '') : ''}</p></li>
                                            <li><p>{v.get('storeAmount') ? formatMoney(v.get('storeAmount'), 2, '') : ''}</p></li>
                                        </Fragment>
                                    }

                                </TableItem>
                            })
                        }
                        {
                            projectCard.get('projectProperty') !== 'XZ_CONSTRUCTION' ?
                            <TableItem className="account-xmjz-table-width">
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li>合计</li>
                                <li><p>{allHappenAmount ? formatMoney(allHappenAmount, 2, '') : ''}</p></li>
                                <li><p>{allStoreAmount ? formatMoney(allStoreAmount, 2, '') : ''}</p></li>
                            </TableItem> : null
                        }


                    </TableBody>
                    {
                        projectCard.get('projectProperty') === 'XZ_CONSTRUCTION' ?
                        <TableBottomPage
                            otherComp={otherComp}
                            total={totalNumber === 0 ? 1 : totalNumber}
                            current={modifycurrentPage}
                            onChange={(page) => {
                                dispatch(editCalculateActions.changeEditCalculateCommonState('ProjectCarryoverTemp', 'modifycurrentPage', page))

                            }}
                            totalPages={cardPages}
                            pageSize={pageSize}
                            showSizeChanger={true}
                            hideOnSinglePage={false}
                            onShowSizeChange={(curPageSize) => {
                                dispatch(editCalculateActions.changeEditCalculateCommonState('ProjectCarryoverTemp', 'pageSize', curPageSize))
                                dispatch(editCalculateActions.changeEditCalculateCommonState('ProjectCarryoverTemp', 'modifycurrentPage', 1))
                                dispatch(editCalculateActions.changeEditCalculateCommonState('ProjectCarryoverTemp', 'cardPages', Math.ceil(totalNumber/curPageSize)))

                            }}
                            className={'payment-table-select' }
                        /> : null
                    }


                </TableAll>

                <StockSingleModal
                    dispatch={dispatch}
                    showSingleModal={showSingleModal}
                    MemberList={memberList}
                    thingsList={thingsList}
                    selectedKeys={selectedKeys === '' ? [`all${Limit.TREE_JOIN_STR}1`] : selectedKeys}
                    stockCardList={fromJS([projectCard.toJS()])}
                    title={'选择项目'}
                    selectFunc={(item, cardUuid) => {
                        const code = item.code
                        const name = item.name
                        const projectProperty = item.projectProperty
                        dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'projectCard', fromJS({ cardUuid, name, code, projectProperty })))
                        dispatch(editCalculateActions.getProjectCarryoverList(oriDate,cardUuid))

                        if(projectProperty === 'XZ_PRODUCE'){
                            dispatch(innerCalculateActions.changeEditCalculateCommonString('ProjectCarryover', 'oriState', 'STATE_XMJZ_JZRK'))
                            dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriAbstract', '结转入库存货'))
                        }else{
                            dispatch(innerCalculateActions.changeEditCalculateCommonString('ProjectCarryover', 'oriState', 'STATE_XMJZ_QRSRCB'))
                            dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'oriAbstract', '确认收入成本'))
                        }
                        this.setState({
                            showSingleModal: false
                        })
                    }}

                    selectListFunc={(uuid, level) => {
                        if (uuid === 'all') {
                            dispatch(editCalculateActions.getProjectCarryoverCard({
                                oriDate,
                                categoryUuid: '',
                                level: '',
                                justCard: true,
                                needLeft: false,
                                currentPage: 1,
                            }))
                        } else {
                            dispatch(editCalculateActions.getProjectCarryoverCard({
                                oriDate,
                                categoryUuid: uuid,
                                level,
                                justCard: false,
                                needLeft: false,
                                currentPage: 1,
                            }))
                        }
                        this.setState({
                            selectTreeUuid: uuid,
                            selectTreeLevel: level
                        })

                    }}
                    cancel={() => {
                        this.setState({
                            showSingleModal: false
                        })
                    }}
                    cardPageObj={cardPageObj}
                    paginationCallBack={(value)=>{
                        if (selectTreeUuid === 'all') {
                            dispatch(editCalculateActions.getProjectCarryoverCard({
                                oriDate,
                                categoryUuid: '',
                                level: '',
                                justCard: true,
                                needLeft: false,
                                currentPage: value,
                            }))
                        } else {
                            dispatch(editCalculateActions.getProjectCarryoverCard({
                                oriDate,
                                categoryUuid: selectTreeUuid,
                                level: selectTreeLevel,
                                justCard: false,
                                needLeft: false,
                                currentPage: value,
                            }))
                        }
                    }}
                />

            </div>
        )
    }
}
