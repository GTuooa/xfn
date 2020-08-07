import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { formatMoney, numberCalculate } from 'app/utils'
import { DatePicker, Input, Select, message, Tree, Icon, Button } from 'antd'
import NumberInput from 'app/components/Input'
import XfIcon from 'app/components/Icon'
const Option = Select.Option
import { fromJS } from 'immutable'
import moment from 'moment'

import * as Limit from 'app/constants/Limit.js'
import { Amount } from 'app/components'
import StockModal from './component/StockModal'
import StockSingleModal from './component/StockSingleModal'
import CategorySelect from './component/CategorySelect'
import Inventory from './stock/Inventory'
import { numberTest } from './component/numberTest'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'

@immutableRenderDecorator
export default
    class Chtrxm extends React.Component {

    static displayName = 'Chtrxm'

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
    }
    render() {
        const {
            dispatch,
            StockIntoProjectTemp,
            hideCategoryList,
            insertOrModify,
            paymentType,
            disabledDate,
            commonCardObj,
            calculateViews,
            enableWarehouse,
            openQuantity,
            serialList,
        } = this.props
        const { showSingleModal, selectTreeUuid, selectTreeLevel } = this.state
        const reg = /^-{0,1}\d*\.?\d{0,2}$/
        const paymentTypeStr = calculateViews.get('paymentTypeStr')
        const position = "StockIntoProjectTemp"

        const modify = insertOrModify === 'modify' ? true : false
        const oriDate = this.props.oriDate
        const oriAbstract = StockIntoProjectTemp.get('oriAbstract')
        const jrIndex = StockIntoProjectTemp.get('jrIndex')
        const amount = StockIntoProjectTemp.get('amount') ? StockIntoProjectTemp.get('amount') : 0
        const stockCardList = StockIntoProjectTemp.get('stockCardList')
        const allStockCardList = StockIntoProjectTemp.get('allStockCardList')
        const allWareHouseCardList = StockIntoProjectTemp.get('allWareHouseCardList')
        const stockCardUuidList = StockIntoProjectTemp.get('stockCardUuidList')
        const wareHouseCardList = StockIntoProjectTemp.get('wareHouseCardList')
        const projectCard = StockIntoProjectTemp.get('projectCard')
        const projectList = StockIntoProjectTemp.get('projectList')
        const stockRange = StockIntoProjectTemp.get('stockRange')
        const categoryTypeObj = StockIntoProjectTemp.get('categoryTypeObj')
        const projectRange = StockIntoProjectTemp.get('projectRange')
        const oriState = StockIntoProjectTemp.get('oriState')
        const oriUuid = StockIntoProjectTemp.get('oriUuid')
        const selectI = calculateViews.get('selectI')

        // const showSingleModal = commonCardObj.get('showSingleModal')
        const memberList = commonCardObj.get('memberList')
        const thingsList = commonCardObj.get('thingsList')
        const selectItem = commonCardObj.get('selectItem')
        const selectList = commonCardObj.get('selectList')
        const selectedKeys = commonCardObj.get('selectedKeys')
        const cardPageObj = commonCardObj.get('cardPageObj')
        const modalName = commonCardObj.get('modalName')



        let totalCbAmount = 0.00

        let costStockOption = [], stockCardIdList = [],selectUuidForPrice = []
        stockCardList.map(v => {
            stockCardIdList.push(v.get('cardUuid'))
            totalCbAmount =  numberCalculate(totalCbAmount,v.get('amount'))

            selectUuidForPrice.push({
                cardUuid: v.get('cardUuid'),
                storeUuid: v.get('warehouseCardUuid'),
                assistList: v.get('assistList'),
                batchUuid: v.get('batchUuid'),
                isUniformPrice: v.get('isUniformPrice'),
                index: 0,
                noNeedPrice: false,
                moreUnit: v.getIn(['unit','unitList']) && v.getIn(['unit','unitList']).size
            })
        })
        const singlethingsList = thingsList.size ? thingsList.filter(item => stockCardIdList.indexOf(item.get('uuid')) === -1) : fromJS([])

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
                                            dispatch(editCalculateActions.changeEditCalculateCommonState('StockIntoProjectTemp', 'jrIndex', e.target.value))
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
                            disabledDate={disabledDate}
                            value={moment(oriDate)}
                            onChange={value => {
                                const date = value.format('YYYY-MM-DD')
                                dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
                                if(selectUuidForPrice.length > 0){
                                    dispatch(editCalculateActions.getStockBuildUpPrice(date,selectUuidForPrice, 0,'StockIntoProject','notFinish'))
                                }
                            }} />
                    </div>
                </div>
                <CategorySelect
                    dispatch={dispatch}
                    insertOrModify={insertOrModify}
                    paymentTypeStr={paymentTypeStr}
                    hideCategoryList={hideCategoryList}
                />
                <div className='accountConf-separator'></div>
                {
                    <div className="edit-running-modal-list-item" >
						<label>项目：</label>
						<div className='chosen-right'>
							<Select
								combobox
								showSearch
								value={`${projectCard.get('code') !== 'COMNCRD' && projectCard.get('code') !== 'ASSIST' && projectCard.get('code') !== 'MAKE' && projectCard.get('code') !== 'INDIRECT' && projectCard.get('code') !== 'MECHANICAL' && projectCard.get('code') ? projectCard.get('code') : ''} ${projectCard.get('name') ? projectCard.get('name') : ''}`}
								onChange={(value,options) => {
									const valueList = value.split(Limit.TREE_JOIN_STR)
									const cardUuid = options.props.uuid
									const code = valueList[0]
									const name = valueList[1]
									dispatch(editCalculateActions.changeEditCalculateCommonState(position, 'projectCard', fromJS({ cardUuid, name, code })))
								}}
							>
								{projectList && projectList.filter(v => v.get('code') !== 'COMNCRD').map((v, i) =>
									<Option
                                        key={v.get('uuid')}
                                        value={`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                                        uuid={v.get('uuid')}
                                    >
										{`${v.get('code') !== 'COMNCRD' && v.get('code') !== 'ASSIST' && v.get('code') !== 'MAKE' && v.get('code') !== 'INDIRECT' && v.get('code') !== 'MECHANICAL' ? v.get('code') : ''} ${v.get('name')}`}
									</Option>
								)}
							</Select>
							{
								<div className='chosen-word'
									onClick={() => {
                                        dispatch(editCalculateActions.getChargeProjectCard('STATE_CHTRXM','StockIntoProjectTemp',1))
                                        this.setState({
                                            showSingleModal: true
                                        })

									}}>选择</div>
							}
						</div>
					</div>

                }
                <div className="edit-running-modal-list-item">
                    <label>摘要：</label>
                    <div>
                        <Input className="focus-input"
                            onFocus={(e) => {
                                document.getElementsByClassName('focus-input')[0].select();
                            }}
                            value={oriAbstract}
                            onChange={(e) => {
                                dispatch(innerCalculateActions.changeEditCalculateCommonString('StockIntoProject', 'oriAbstract', e.target.value))
                            }}
                        />
                    </div>
                </div>

                <div className='accountConf-separator'></div>
                <Inventory
                    dispatch={dispatch}
                    stockCardList={stockCardList}
                    stockList={allStockCardList}
                    stockRange={[]}
                    amount={amount}
                    oriDate={oriDate}
                    oriUuid={oriUuid}
                    MemberList={memberList}
                    thingsList={thingsList}
                    carryoverCardList={allWareHouseCardList}
                    currentCardType={'stock'}
                    selectedKeys={selectedKeys}
                    warehouseList={wareHouseCardList}
                    insertOrModify={insertOrModify}
                    enableWarehouse={enableWarehouse}
                    openQuantity={openQuantity}
                    selectList={selectList}
                    selectItem={selectItem}
                    stockTitleName={'存货'}
                    stockTemplate={'stockCardList'}
                    oriStockTemplate={'oriStockCardList'}
                    sectionTemp={'StockIntoProject'}
                    amountDisable={false}
                    isCardUuid={true}
                    needHidePrice={false}
                    oriState={oriState}
                    serialList={serialList}
                    selectTreeCallBack={(uuid,level)=>{
                        if (uuid === 'all') {
                            dispatch(innerCalculateActions.getStockCardList({temp: 'StockIntoProjectTemp', currentPage: 1}))
                        } else {
                            dispatch(editCalculateActions.getStockSomeCardList({uuid, level, currentPage: 1}))
                        }
                        this.setState({
                            selectTreeUuid: uuid,
                            selectTreeLevel: level
                        })
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
                                noNeedPrice: false,
                                moreUnit: item.getIn(['unit','unitList']) && item.getIn(['unit','unitList']).size
                            })

                        })
                        if(selectUuidList.length > 0){
                            dispatch(editCalculateActions.getStockBuildUpPrice(oriDate,selectUuidList, chooseIndex,'StockIntoProject','notFinish'))
                        }
                    }}
                    cardPageObj={cardPageObj}
                    cardPaginationCallBack={(value)=>{
                        if (selectTreeUuid === 'all') {
                            dispatch(innerCalculateActions.getStockCardList({temp:'StockIntoProjectTemp',currentPage: value}))
                        } else {
                            dispatch(editCalculateActions.getStockSomeCardList(
                                {
                                    uuid: selectTreeUuid,
                                    level: selectTreeLevel,
                                    currentPage: value
                                }
                            ))
                        }
                    }}
                />

                <div className="edit-running-modal-list-item">
                    <label>合计金额：{formatMoney(totalCbAmount)}</label>
                </div>

                <StockSingleModal
                    dispatch={dispatch}
                    showSingleModal={showSingleModal}
                    MemberList={memberList}
                    thingsList={thingsList}
                    selectedKeys={selectedKeys === '' ? [`all${Limit.TREE_JOIN_STR}1`] : selectedKeys}
                    // stockCardList={stockCardList}
                    title={'选择项目'}
                    selectFunc={(item, cardUuid) => {
                        const code = item.code
                        const name = item.name
                        dispatch(editCalculateActions.changeEditCalculateCommonState('StockIntoProjectTemp', 'projectCard', fromJS({ cardUuid, name, code })))
                        this.setState({
                            showSingleModal: false
                        })
                    }}

                    selectListFunc={(uuid, level) => {
                        if (uuid === 'all') {
                            dispatch(editCalculateActions.getChargeProjectCard(oriState,'StockIntoProjectTemp',1))
                        } else {
                            dispatch(editCalculateActions.getProjectSomeCardList(uuid, level,oriState,1))
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
                            dispatch(editCalculateActions.getChargeProjectCard(oriState,'StockIntoProjectTemp',value))
                        } else {
                            dispatch(editCalculateActions.getProjectSomeCardList(selectTreeUuid, selectTreeLevel,oriState,value))
                        }
                    }}
                />

            </div>
        )
    }
}
