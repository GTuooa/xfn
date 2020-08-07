import React, { Fragment } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Button, Dropdown, Icon, message, Modal,Tooltip,TreeSelect, Select  } from 'antd'
const { TreeNode } = TreeSelect;
import { fromJS } from 'immutable'

import thirdParty from 'app/thirdParty'
import { Export } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import { numberCalculate ,formatFour, numberFourTest} from 'app/utils'
import { ROOTPKT } from 'app/constants/fetch.constant.js'
import XfIcon from 'app/components/Icon'
import XfnSelect from 'app/components/XfnSelect'
import WarehouseTreeModal from './WarehouseTreeModal'
import CountStockModal from './CountStockModal'
import AdjustWayModal from '../stockAssistFile/AdjustWayModal'
import CommonAssist from '../stockAssistFile/CommonAssist'
import InputFour from 'app/components/InputFour'
import SerialModal  from '../../SerialModal'
import InventorySerialModal from 'app/containers/Config/Inventory/SerialModal.jsx'

import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'
import * as allActions from 'app/redux/Home/All/all.action'

@immutableRenderDecorator
export default
class BalanceAdjustment extends React.Component{
	static displayName = 'Chye/Cbjz BalanceAdjustment'
	constructor() {
		super()
		this.state = {
			showWarehouseModal: false,
			showStockModal: false,
			showSingleModal: false,
			checkable: false,
            showSerial: false,
            showEditSerial: false,
            showAdjustWayModal: false,
            curStockItem:[],
            curStockIndex: -1,
		}
	}
	render() {
		const {
			dispatch,
			returnBackFun,
			calculateViews,
			oriDate,
			dateFromTemp,
			insertOrModify,
			commonCardObj,
			enableWarehouse,
			homeState,
			needHidePrice,
			enclosureCountUser,
			tempName,
			serialList,
		} = this.props
		const { showWarehouseModal, showStockModal, showSingleModal,checkable,showSerial, showEditSerial,showAdjustWayModal, curStockItem, curStockIndex } = this.state

		const warehouseTreeList = calculateViews.get('warehouseTreeList')

		const showCount = calculateViews.get('showCount')
		const stockTitleName = calculateViews.get('stockTitleName')
		const selectI = calculateViews.get('selectI')
        const countInsert = calculateViews.get('countInsert')
        const pdfInsertFirst = calculateViews.get('pdfInsertFirst')//首次保存pdf
        const hasNumber = calculateViews.get('hasNumber')
        const singleUrl = calculateViews.get('singleUrl')

		const countStockCardList = dateFromTemp.get('countStockCardList')
		const chooseIndex = countStockCardList.size
		const oriState = dateFromTemp.get('oriState')
		const wareHouseCardList = dateFromTemp.get('wareHouseCardList') //所有仓库
		const allStockCardList = dateFromTemp.get('allStockCardList') //所有存货
		const stockCardList = dateFromTemp.get('stockCardList') //已选存货
		const chooseWareHouseCard = dateFromTemp.get('chooseWareHouseCard') //单选仓库
        const chooseStockCard = dateFromTemp.get('chooseStockCard') // 单选存货

        const warehouseSelectedKeys = dateFromTemp.get('warehouseSelectedKeys')
        const countWarehouseList = dateFromTemp.get('countWarehouseList')
        const wareHouseNoChild = dateFromTemp.get('wareHouseNoChild')
        const dealTypeUuid = dateFromTemp.get('dealTypeUuid')

		// 存货弹框
		const memberList = commonCardObj.get('memberList')
        const thingsList = commonCardObj.get('thingsList')
        const selectItem = commonCardObj.get('selectItem')
        const selectList = commonCardObj.get('selectList')
        const stockSelectedKeys = commonCardObj.get('selectedKeys')
        const wareHouseList = dateFromTemp.get('wareHouseList')

		const uuidName = 'uuid'
		const titleName = oriState === 'STATE_YYSR_ZJ' ? '结转' : '调整'
		// 导出
		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
        const isPlay = homeState.getIn(['views', 'isPlay'])
        const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])

		const selectedKeys = enableWarehouse ? oriState === 'STATE_CHYE_CH' ? warehouseSelectedKeys.toJS() : chooseWareHouseCard ? [`${chooseWareHouseCard.get('cardUuid')}${Limit.TREE_JOIN_STR}${chooseWareHouseCard.get('name')}${Limit.TREE_JOIN_STR}${chooseWareHouseCard.get('isUniform')}`] : [] : []

		let stockCardIdList = []
        stockCardList.map(v => stockCardIdList.push(v.get('cardUuid')))
		const singlethingsList = thingsList.size ? thingsList.filter(item => stockCardIdList.indexOf(item.get('uuid')) === -1) : fromJS([])

		const initChooseWareHouseCard = {
			cardUuid: '',
			name: '全部',
			isOpenedQuantity: false,
			isUniformPrice: false,
		}

		let countstockCardIdList = []
        countStockCardList && countStockCardList.map(v => {
            countstockCardIdList.push(v.get('cardUuid'))
        })

		let selectChildList = []
		const loop = (data, upperIndex,selectUuid) => data.map((item, i) => {
			if(selectUuid === item.uuid){
				selectChildList = item.childList ? item.childList : []
			}

            if (item.childList && item.childList.length) {

                return <TreeNode
					title={item.name}
					value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.code}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.isUniform}`}
					key={item.uuid}
					// disabled={parentDisabled}
					>
                    {loop(item.childList, upperIndex + '_' + i,selectUuid)}
                </TreeNode>
            }

            return <TreeNode
                title={item.name}
                value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.code}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.isUniform}${Limit.TREE_JOIN_STR}${true}`}
                key={item.uuid}
            />
        })
		const className = enableWarehouse ? 'count-inventory-area-warehouse' : 'count-inventory-no-warehouse'

		return (
			<div className="count-adjustment-mask import-mask" style={{display: showCount ? 'block' : 'none'}}>
				<div className='count-container'>
					<div className='count-inventory'>
						{
							(
								<div className={'count-inventory-or-warehouse'} style={{marginBottom:'10px',justifyContent: enableWarehouse ? '' : 'flex-end'}}>
								{
									enableWarehouse ?
									<Fragment>
										<span style={{display: 'flex',width: '65px',alignItems: 'center'}}>仓库：</span>
										<span className='count-select-choose'>
										<TreeSelect
											className={''}
											style={{width: '100%'}}
											value={chooseWareHouseCard ? chooseWareHouseCard.get('name') : ''}
											placeholder={'请选择仓库'}
											dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
											treeDefaultExpandAll
											showArrow={false}
											disabled={!countInsert}
											onChange={value =>{
												const valueList = value.split(Limit.TREE_JOIN_STR)
												const uuid = valueList[0]
												const name = valueList[1] !== 'ALLCRD' ?  `${valueList[1]} ${valueList[2]}` : valueList[2]
												const isUniform = valueList[3] === 'true' ? true : false
												const notHasChild = valueList[4] === 'true' ? true : false
												if(!notHasChild){//有子集
													loop(warehouseTreeList.toJS(),'',uuid)
												}else{
													selectChildList = [{
														uuid,
														name: valueList[2],
														isUniform,
														code:valueList[1],
													}]
												}
												let warehouseList = []
												const selectLoop = (data) => data && data.map(item => {
													if(item.childList && item.childList.length){
														selectLoop(item.childList)
													}else{
														warehouseList.push(item)
													}
												})

												if(valueList[2] === '全部'){
													selectLoop(warehouseTreeList.toJS())
												}else{
													selectLoop(selectChildList)
												}


												if(countStockCardList && countStockCardList.size > 0){
													Modal.confirm({
														title: '切换仓库后，列表数据将被清空!',
														content: '',
														okText: '确认',
														cancelText: '取消',
														onOk:()=>{
															dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['chooseWareHouseCard', 'cardUuid'], uuid))
															dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['chooseWareHouseCard', 'name'], name))
															dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['chooseWareHouseCard', 'isUniform'], isUniform))
															dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, 'wareHouseNoChild', notHasChild))
															dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, 'countStockCardList', fromJS([])))
															dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, 'countWarehouseList', fromJS(warehouseList)))

														}
													})
												}else{
													dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['chooseWareHouseCard', 'cardUuid'], uuid))
													dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['chooseWareHouseCard', 'name'], name))
													dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['chooseWareHouseCard', 'isUniform'], isUniform))
													dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, 'wareHouseNoChild', notHasChild))
													dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, 'countWarehouseList', fromJS(warehouseList)))
												}
											}}
										>

											{loop( warehouseTreeList.toJS(), 0 )}
										</TreeSelect>
										{
											countInsert ?
											<span className='count-chosen-word'
												onClick={() => {
													this.setState({
														showWarehouseModal: true
													})
													dispatch(editCalculateActions.getWarehouseCardTree({
														haveQuantity: false,
														inventoryUuid: '',
														oriDate,
														tempName: tempName,
														isNeedHaveQuantity: false
													}))
											}}>选择</span> : null
										}

										</span>
									</Fragment> : null
								}
								<span className="count-export-btn">
									<XfIcon type='download'/> &nbsp;
									<Export
										type={''}
										exportButtonName={'盘点导出'}
										isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
										exportDisable={!oriDate || isPlay}

										excelDownloadUrl={`${ROOTPKT}/data/export/jr/inventory/adjustment?${URL_POSTFIX}&warehouseUuid=${chooseWareHouseCard ? chooseWareHouseCard.get('cardUuid') : ''}&oriDate=${oriDate}`}
										ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendExcelStockAdjustment', {inventoryUuid:chooseStockCard ? chooseStockCard.get('cardUuid') : '', warehouseUuid:chooseWareHouseCard ? chooseWareHouseCard.get('cardUuid') : '', oriDate:oriDate}))}

										PDFDownloadUrl={`${ROOTPKT}/pdf/export/jr/inventory/adjustment?${URL_POSTFIX}&warehouseUuid=${chooseWareHouseCard ? chooseWareHouseCard.get('cardUuid') : ''}&oriDate=${oriDate}`}
										ddPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendPdfStockAdjustment', {inventoryUuid:chooseStockCard ? chooseStockCard.get('cardUuid') : '', warehouseUuid:chooseWareHouseCard ? chooseWareHouseCard.get('cardUuid') : '', oriDate:oriDate}))}

										onErrorSendMsg={(type, valueFirst, valueSecond) => {
											dispatch(allActions.sendMessageToDeveloper({
												title: '导出发送钉钉文件异常',
												message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
												remark: '盘点导出',
											}))
										}}
									/>
								</span>

								<Button
									disabled={!countInsert}
									style={{width:88,marginLeft:10,background:'#5e81d1',color:'#fff',opacity: countInsert ? '1' : '0.5'}}
									onClick={() => {
										dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'showall', true))
										dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'isCount', true))
									}}
								>
									<XfIcon type='upload'/> &nbsp;盘点导入
								</Button>
								</div>
							)
					}

						<div className='count-inventory-content inventory-content '>
							<div className={`${className} count-inventory-area-warehouse-title`}>
								<span>{'存货'}</span>
								<span></span>
								{
									enableWarehouse ?
									<span>{'仓库'}</span> : null
								}
								<span>{titleName}前数量</span>
								<span>盘点数量</span>
								<span>{titleName}数量</span>
								<span></span>
							</div>


							{
								countStockCardList && countStockCardList.map((item,index) => {
									const assistList = item.get('assistList') || fromJS([])
									const serialList = item.get('serialList') || fromJS([])
									const selectedList = countStockCardList.filter((w,i) => w.get('cardUuid') === item.get('cardUuid') && i !== index).toJS().reduce((pre,cur) => pre.concat(cur.serialList || []),[])
									return <div className={`${className}  count-inventory-childList`}>
										<span className="stock-serial-number" style={{lineHeight: '27px'}}>
											({index+1})
										</span>
										{
											// <span>
												// {
													countInsert ?
														<Fragment>
															<CommonAssist
																item={item}
																index={index}
																stockCardList={stockCardList}
																oriDate={oriDate}
																stockList={allStockCardList}
																dispatch={dispatch}
																type='count'
																stockTitleName={stockTitleName}
																stockTemplate={'countStockCardList'}
																sectionTemp={tempName}
																needHidePrice={needHidePrice}
																oriState={oriState}
																cardUuidName={uuidName}
																onSelectChange={(value,options) => {

																	const valueList = value.split(Limit.TREE_JOIN_STR)
																	const cardUuid = valueList[0]
																	const code = valueList[1]
																	const name = valueList[2]
																	const isOpenedQuantity = valueList[3] === 'true' ? true : false
																	const isUniformPrice = valueList[4] === 'true' ? true : false
																	const amount = item.get('amount')
																	const warehouseCardUuid = item.get('warehouseCardUuid')
																	const warehouseCardCode = item.get('warehouseCardCode')
																	const warehouseCardName = item.get('warehouseCardName')
																	const unit = options.props.unit ? options.props.unit.toJS() : []
																	const financialInfo = options.props.financialInfo
																	const obj = {
																		cardUuid,
																		name,
																		code,
																		amount,
																		isOpenedQuantity,
																		isUniformPrice,
																		warehouseCardUuid,
																		warehouseCardCode,
																		warehouseCardName,
																		unit,
																		unitUuid: unit.uuid,
																		unitName: unit.name,
																		quantity: '',
																		afterQuantity: '',
																		financialInfo,
																	}
																	dispatch(editCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList',index], fromJS({
																		...obj
																	})))
																	let noNeedPrice = false,moreUnit = false
																	// if(needHidePrice){
																	// 	noNeedPrice = true
																	// 	moreUnit = !(isOpenedQuantity === 'true' && options.props.unit && !options.props.unit.get('unitList').size)
																	// }
																	dispatch(editCalculateActions.getStockBuildUpPrice(oriDate, [
																		{
																			cardUuid:cardUuid,
																			storeUuid: warehouseCardUuid,
																			assistList: item.get('assistList'),
																			batchUuid: item.get('batchUuid'),
																			noNeedPrice,
																			moreUnit
																		}
																	],index,tempName,'count'))

																}}
															/>
														</Fragment>:
														<span className='count-modify-color'>{`${item.get('code')} ${item.get('name')}`}</span>
												// }

											// </span>
										}
                                        {
                                            enableWarehouse ?
												countInsert ?
												<span className='warehouse-select'>
												<XfnSelect
													placeholder='请选择'
													combobox
													showSearch
													value={item.get('warehouseCardName') ?`${item.get('warehouseCardCode') ? item.get('warehouseCardCode'):''} ${item.get('warehouseCardName') ? item.get('warehouseCardName') : ''}`:undefined}
													dropdownRender={menu => (
														<div>
															{menu}
														</div>
													)}
													onChange={value => {
														const valueList = value.split(Limit.TREE_JOIN_STR)
														const cardUuid = valueList[0]
														const code = valueList[1]
														const name = valueList[2]
														const amount = item.get('amount')
														dispatch(editCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList',index,'warehouseCardUuid'], cardUuid))
														dispatch(editCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList',index,'warehouseCardCode'], code))
														dispatch(editCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList',index,'warehouseCardName'], name))
														dispatch(editCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList',index,'quantity'], ''))
														dispatch(editCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList',index,'afterQuantity'], ''))
														let noNeedPrice = false,moreUnit = false
														dispatch(editCalculateActions.getStockBuildUpPrice(oriDate, [
															{
																cardUuid:item.get('cardUuid'),
																storeUuid: cardUuid,
																assistList: item.get('assistList'),
																batchUuid: item.get('batchUuid'),
																noNeedPrice,
																moreUnit
															}
														],index,tempName,'count'))
													}}
													>
													{
														countWarehouseList.map((v, i) => {
															return (
																<Option
																	key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
																>
																	{`${v.get('code')} ${v.get('name')}`}
																</Option>
															)
														})
													}
													</XfnSelect>
												</span> :
												<span className='count-modify-color'>{item.get('warehouseCardCode') ? `${item.get('warehouseCardCode')} ${item.get('warehouseCardName')}` : item.get('warehouseCardName')}</span>
                                            :''
                                        }
										<span>{`${item.get('referenceQuantity') ? formatFour(item.get('referenceQuantity')) : ''} ${item.get('unitName') ? item.get('unitName') : (item.getIn(['unit','name']) ? item.getIn(['unit','name']) : '')}`}</span>
										<span>
											<Tooltip title={item.getIn(['financialInfo','openSerial']) ? '在调整数量中输入对应序列号' : ''}>
												<InputFour
													placeholder='请输入数量'
													showZero={true}
													disabled={!countInsert || item.getIn(['financialInfo','openSerial'])}
													value={item.get('afterQuantity')}
													onChange={(e) => {
														numberFourTest(e, (value) => {

															const afterQuantity = value
															const quantity = oriState === 'STATE_YYSR_ZJ' ? numberCalculate(item.get('referenceQuantity'),afterQuantity,4, 'subtract',4) : numberCalculate(afterQuantity, item.get('referenceQuantity'), 4, 'subtract',4)
															const amount = numberCalculate(quantity, item.get('price'), 4, 'multiply')

															dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList', index, 'afterQuantity'], afterQuantity))
															dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList', index, 'quantity'], quantity))
															dispatch(editCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList', index, 'amount'], amount))

														}, true)
													}}
												/>
											</Tooltip>

											{
												countInsert ?
												<Tooltip title={`与${titleName}前数量一致`}>
													<XfIcon type='count-same'
														onClick={()=>{
															dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList', index, 'afterQuantity'], item.get('referenceQuantity')))
															dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList', index, 'quantity'], 0))
														}}
													/>
												</Tooltip> : null
											}


										</span>
										<span>
											{
												item.getIn(['financialInfo','openSerial'])?
												<span
													onClick={() => {
														if (enableWarehouse && !item.get('warehouseCardUuid')) {
															message.info('请先填写仓库')
															return
														} else if (item.getIn(['financialInfo','openAssist']) && (assistList.some(v => !v.get('propertyName')) || item.getIn(['financialInfo','assistClassificationList']).size !== assistList.size)) {
															message.info('请先填写辅助属性')
															return
														} else if (item.getIn(['financialInfo','openBatch']) && !item.get('batchUuid')) {
															message.info('请先填写批次')
															return
														}
														this.setState({
															showAdjustWayModal:true,
															curStockItem: item.toJS(),
															curStockIndex: index,
														})
													}}
													className={'serial-number-count'}
													>
													{Number(item.get('quantity')) ? formatFour(Number(item.get('quantity'))) : '点击输入'}
													<XfIcon type='edit-pen'/>
												</span> :
												<InputFour
													placeholder='请输入数量'
													showZero={true}
													disabled={!countInsert}
													value={item.get('quantity')}
													onChange={(e) => {
														numberFourTest(e, (value) => {
															const quantity = value
															const afterQuantity = oriState === 'STATE_YYSR_ZJ' ?  numberCalculate(item.get('referenceQuantity'),quantity,4, 'subtract',4) : numberCalculate(quantity, item.get('referenceQuantity'),4,'add',4)
															const amount = numberCalculate(quantity, item.get('price'),4, 'multiply')

															dispatch(editCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList', index, 'amount'], amount))
															dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList', index, 'quantity'], quantity))
															dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList', index, 'afterQuantity'], afterQuantity))

														}, true)
													}}

												/>
											}
										</span>
										<span>
										{
											countStockCardList.size > 1 ?
												<XfIcon
													type="bigDel"
													theme="outlined"
													onClick={() => {
														dispatch(editCalculateActions.deleteStockList(countStockCardList, index, 'delete',tempName,'countStockCardList'))
													}}
												/>
												: ''
										}
										</span>

										{
											showSerial && curStockIndex == index?
											<SerialModal
												visible={true}
												dispatch={dispatch}
												serialList={this.props.serialList}
												curSerialList={serialList.toJS()}
												item={item}
												onClose={()=>{this.setState({showSerial: false})}}
												selectedList={selectedList}
												onOK={(curSerialList)=>{
													const list = curSerialList.filter(v => v.serialNumber)
													const quantity = (oriState === 'STATE_CHYE_CH' || oriState === 'STATE_CHYE_CK') ? -list.length  : list.length
													const afterQuantity = oriState === 'STATE_YYSR_ZJ' ?  numberCalculate(item.get('referenceQuantity'),quantity,4, 'subtract',4) : numberCalculate(quantity, item.get('referenceQuantity'),4,'add',4)
													const amount = numberCalculate(quantity, item.get('price'),4, 'multiply')

													dispatch(editCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList', index, 'amount'], amount))
													dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList', index, 'quantity'], quantity))
													dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList', index, 'afterQuantity'], afterQuantity))

													dispatch(editCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList',index,'serialList'],fromJS(list) ))
												}}
											/> : ''
										}
										{
											showEditSerial && curStockIndex === index ?
											<InventorySerialModal
												visible={true}
												dispatch={dispatch}
												serialList={serialList}
												item={item}
												onClose={()=>{this.setState({showEditSerial: false})}}
												onOk={curSerialList => {
													const quantity = curSerialList.length
													const amount = numberCalculate(quantity, item.get('price'),4, 'multiply')
													const afterQuantity = oriState === 'STATE_YYSR_ZJ' ?  numberCalculate(item.get('referenceQuantity'),quantity,4, 'subtract',4) : numberCalculate(quantity, item.get('referenceQuantity'),4,'add',4)
													dispatch(editCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList', index, 'amount'], amount))
													dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList', index, 'afterQuantity'], afterQuantity))
													dispatch(editCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList',index,'quantity'],quantity ))
													dispatch(editCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList',index,'serialList'],fromJS(curSerialList) ))
												}}
											/> : ''
										}

									</div>
								})
							}

							{

								<div className='count-inventory-button'>
								{
									countInsert ?
									<Button
										onClick={() => {
											dispatch(editCalculateActions.deleteStockList(countStockCardList, countStockCardList.size -1, 'add',tempName,'countStockCardList'))
										}}
									>
										<XfIcon type='big-plus'/>{`添加${stockTitleName}明细`}
									</Button> : null
								}
								{
									countInsert ?
									<Button
										onClick={() => {
											this.setState({
												showStockModal: true
											})
											dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectList', fromJS([])))
											dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectItem', fromJS([])))
											dispatch(editCalculateActions.getStockCardCategoryAndList({
												isUniform: null,
												openQuantity: true,
												warehouseUuid: chooseWareHouseCard.get('cardUuid'),
												oriDate,
												haveQuantity: hasNumber,
												type: 'count'
											}))

										}}
									>
										<XfIcon type='editPlus'/>{`批量添加存货`}
									</Button> : null
								}


								</div>
							}

						</div>

						<div className="count-bottom-btn title-right">
						{
							!countInsert ?
							<Button key="print" type="ghost" size="large"
								onClick={() => {
									if(singleUrl){
										thirdParty.openLink({
											url: singleUrl
										})
									}else{
										message.info('暂无可打印的内容')
									}
								}}
							>
								打印
							</Button> : null
						}
						{
							countInsert ?
							<Tooltip title={!countStockCardList.size ? '请录入盘点数据' : '保存后将生成PDF文件'}>
								<Button
									className="count-adjustment-mask-btn"
									disabled={!countStockCardList.size}
									onClick={() => {
										let canSave = true,messageList = '', noRepeatList = []
										countStockCardList.map(item => {
											if(enableWarehouse){
												if(!item.get('warehouseCardUuid')){
													canSave = false,
													messageList = `请选择【${item.get('code')} ${item.get('name')}】的仓库`
													return
												}
												if(noRepeatList.indexOf(`${item.get('warehouseCardUuid')}+${item.get('cardUuid')}`) > -1){
													canSave = false,
													messageList = `【${item.get('code')} ${item.get('name')}】和【${item.get('warehouseCardName')}】的${titleName}数据重复 `
													return
												}else{
													noRepeatList.push(`${item.get('warehouseCardUuid')}+${item.get('cardUuid')}`)
												}

											}else{
												if(noRepeatList.indexOf(item.get('cardUuid')) > -1){
													canSave = false,
													messageList = `【${item.get('code')} ${item.get('name')}】的${titleName}数据重复 `
													return
												}else{
													noRepeatList.push(item.get('cardUuid'))
												}
											}

											if(item.get('afterQuantity') === ''){
												canSave = false,
												messageList = '盘点数量未填写完整'
												return
											}
										})

										if(canSave){
											const cantSave = enclosureCountUser > 8 ? true : false
											dispatch(editCalculateActions.saveAdjustmentEnclosure(countStockCardList,oriDate,pdfInsertFirst,cantSave,(url)=>{
												Modal.confirm({
													title: '保存失败',
													content: "流水附件达到上限9个，无法新增附件，您可通过'打印'保存盘点单",
													okText: '打印',
													cancelText: '取消',
													onOk:()=>{
														thirdParty.openLink({
															url: url
														})

													}
												})
											}))
											dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'countInsert', false))
											dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'pdfInsertFirst', false))


										}else{
											message.info(messageList)
										}

									}}>
									保存盘点单
								</Button>
							</Tooltip> :
							<Button
								className="count-adjustment-mask-btn"
								onClick={() => {
									dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'countInsert', true))
								}}>
								修改盘点单
							</Button>
						}

							<Button
								className="count-adjustment-mask-btn"
								onClick={() => {
									dispatch(innerCalculateActions.saveCountList([],initChooseWareHouseCard,false))
									if(oriState ==='STATE_YYSR_ZJ'){
										dispatch(editCalculateActions.getCostCarryoverStockList(oriDate, oriState, dealTypeUuid))
									}else{
										dispatch(editCalculateActions.getStockCardList('BalanceTemp'))
										dispatch(editCalculateActions.getCanUseWarehouseCardList({temp:'BalanceTemp'}))
									}
									this.setState({
										checkable: false
									})
									returnBackFun()
								}}>
								取消
							</Button>
							<Button
								className="count-adjustment-mask-btn"
								onClick={() => {
									let newCountStockCardList = [], hasNoQuantity = false
									let canSave = true,messageList = '', noRepeatList = []
									countStockCardList && countStockCardList.size &&  countStockCardList.toJS().map(item => {
										if(enableWarehouse){
											if(!item.warehouseCardUuid){
												canSave = false,
												messageList = `请选择【${item.code} ${item.name}】的仓库`
												return
											}
											if(noRepeatList.indexOf(`${item.warehouseCardUuid}+${item.cardUuid}`) > -1){
												canSave = false,
												messageList = `【${item.code} ${item.name}】和【${item.warehouseCardName}】的${titleName}数据重复 `
												return
											}else{
												noRepeatList.push(`${item.warehouseCardUuid}+${item.cardUuid}`)
											}
										}else{
											if(noRepeatList.indexOf(item.cardUuid) > -1){
												canSave = false,
												messageList = `【${item.code} ${item.name}】的${titleName}数据重复 `
												return
											}else{
												noRepeatList.push(item.cardUuid)
											}
										}
										// if(oriState === 'STATE_YYSR_ZJ' && Number(item.quantity) < 0){
										// 	canSave = false,
										// 	messageList = `【${item.code} ${item.name}】结转数量不可为负数 `
										// 	return
										// }
										if(item.afterQuantity === ''){
											canSave = false,
											messageList = '盘点数量未填写完整'
											return
										}

										if(Number(item.quantity)){
											newCountStockCardList.push(item)
										}else{
											hasNoQuantity = true
										}

									})
									if(newCountStockCardList.length === 0){
										newCountStockCardList = [{}]
									}
									if(canSave){
										if(!pdfInsertFirst && countInsert){
											Modal.confirm({
												title: '盘点单未保存，是否保存盘点单',
												content: '',
												okText: '确认',
												cancelText: '取消',
												onCancel:()=>{
													if(hasNoQuantity){
														message.info(`${titleName}数量为0的存货明细不需要${titleName}`)
													}

													dispatch(innerCalculateActions.saveCountList(newCountStockCardList,initChooseWareHouseCard,true))
													if(oriState ==='STATE_YYSR_ZJ'){
														dispatch(editCalculateActions.getCostCarryoverStockList(oriDate, oriState, dealTypeUuid))
													}else{
														dispatch(editCalculateActions.getStockCardList('BalanceTemp'))
														dispatch(editCalculateActions.getCanUseWarehouseCardList({temp:'BalanceTemp'}))
													}
													this.setState({
														checkable: false
													})
													returnBackFun()
												},
												onOk:()=>{
													dispatch(editCalculateActions.saveAdjustmentEnclosure(countStockCardList,oriDate,false))

													if(hasNoQuantity){
														message.info(`${titleName}数量为0的存货明细不需要${titleName}`)
													}
													dispatch(innerCalculateActions.saveCountList(newCountStockCardList,initChooseWareHouseCard,true))
													if(oriState ==='STATE_YYSR_ZJ'){
														dispatch(editCalculateActions.getCostCarryoverStockList(oriDate, oriState, dealTypeUuid))
													}else{
														dispatch(editCalculateActions.getStockCardList('BalanceTemp'))
														dispatch(editCalculateActions.getCanUseWarehouseCardList({temp:'BalanceTemp'}))
													}

													this.setState({
														checkable: false
													})
													returnBackFun()
												}
											})
										}else{
											if(hasNoQuantity){
												message.info(`${titleName}数量为0的存货明细不需要${titleName}`)
											}
											const temp = oriState === 'STATE_YYSR_ZJ' ? 'CostTransferTemp' : 'BalanceTemp'
											dispatch(innerCalculateActions.saveCountList(newCountStockCardList,initChooseWareHouseCard,true,temp))
											if(oriState ==='STATE_YYSR_ZJ'){
												dispatch(editCalculateActions.getCostCarryoverStockList(oriDate, oriState, dealTypeUuid))
											}else{
												dispatch(editCalculateActions.getStockCardList('BalanceTemp'))
												dispatch(editCalculateActions.getCanUseWarehouseCardList({temp:'BalanceTemp'}))
											}
											this.setState({
												checkable: false
											})
											returnBackFun()
										}

									}else{
										message.info(messageList)
									}
								}}>
								确定
							</Button>
						</div>
					</div>
					<div className='count-right'></div>

				</div>



				<WarehouseTreeModal
					treeList={warehouseTreeList}
					showWarehouseModal={showWarehouseModal}
					onClose={() => this.setState({showWarehouseModal:false})}
					dispatch={dispatch}
					selectedKeys={selectedKeys}
					countStockCardList={countStockCardList}
					countstockCardIdList={countstockCardIdList}
					checkable={checkable}
					canClick={true}
					needTotal={true}
					onSelect={(uuid,code,name,isUniform,selectChildList,price,notHasChild)=>{
						this.setState({
							checkable: false
						})
						let warehouseList = []
						const loop = (data) => data && data.map(item => {
							if(item.childList && item.childList.length){
								loop(item.childList)
							}else{
								warehouseList.push(item)
							}
						})

						if(name === '全部'){
							loop(warehouseTreeList.toJS())
						}else{
							loop(selectChildList)
						}

						if(countStockCardList && countStockCardList.size > 0 ){
							Modal.confirm({
								title: '切换仓库后，列表数据将被清空!',
								content: '',
								okText: '确认',
								cancelText: '取消',
								onOk:()=>{
									dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['chooseWareHouseCard', 'cardUuid'], uuid))
									dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['chooseWareHouseCard', 'name'], `${code} ${name}`))
									dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['chooseWareHouseCard', 'isUniform'], isUniform))
									dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, 'wareHouseNoChild', notHasChild))
									dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, 'countStockCardList', fromJS([])))
									dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, 'countWarehouseList', fromJS(warehouseList)))
								}
							})
						}else{
							dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['chooseWareHouseCard', 'cardUuid'], uuid))
							dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['chooseWareHouseCard', 'name'], code ? `${code} ${name}` : name))
							dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, ['chooseWareHouseCard', 'isUniform'], isUniform))
							dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, 'wareHouseNoChild', notHasChild))
							dispatch(innerCalculateActions.changeEditCalculateCommonString(tempName, 'countWarehouseList', fromJS(warehouseList)))
						}
					}}
					onCheck={()=>{}}

				/>
				<CountStockModal
					showCommonChargeModal={this.state.showStockModal}
					MemberList={memberList}
					thingsList={thingsList}
					dispatch={dispatch}
					oriDate={oriDate}
					oriState={oriState}
					// categoryTypeObj={categoryTypeObj}
					selectedKeys={stockSelectedKeys}
					selectItem={selectItem}
					selectList={selectList}
					stockCard={countStockCardList}
					stockCardIdList={countstockCardIdList}
					showSelectAll={true}
					needConcat={true}
					temp={tempName}
					hasNumber={hasNumber}
					stockTemplate={'countStockCardList'}
					cancel={() => {
						this.setState({ showStockModal: false })
					}}
					getNumberCallback={(haveQuantity,uuid,level)=>{
						if (uuid === 'all') {
							dispatch(editCalculateActions.getStockCardCategoryAndList({
								isUniform: null,
								openQuantity: true,
								warehouseUuid: chooseWareHouseCard.get('cardUuid'),
								oriDate,
								haveQuantity,
								type: 'count'
							}))
						} else {
							dispatch(editCalculateActions.getStockSomeCardList({uuid, level, isUniform: null, openQuantity: true,warehouseUuid:chooseWareHouseCard.get('cardUuid'),haveQuantity,type:'count'}))
						}
					}}
					selectTreeFunc={(uuid, level) => {
						if (uuid === 'all') {
							dispatch(editCalculateActions.getStockCardCategoryAndList({
								isUniform: null,
								openQuantity: true,
								warehouseUuid: chooseWareHouseCard.get('cardUuid'),
								oriDate,
								haveQuantity: hasNumber,
								type: 'count'
							}))
						} else {
							dispatch(editCalculateActions.getStockSomeCardList({uuid, level, isUniform: null, openQuantity: true,warehouseUuid:chooseWareHouseCard.get('cardUuid'),haveQuantity: hasNumber,type:'count'}))
						}
					}}
					callback={(selectItem) => {
						const chooseWareHouseCardUuid = !enableWarehouse  ? '' : chooseWareHouseCard.get('cardUuid')
						let selectUuidList = []
						const chooseSize = countStockCardList.size

						selectItem && selectItem.size && selectItem.map((item, index) => {
							const name = `${item.get('code')} ${item.get('name')}`
							const storeUuid = wareHouseNoChild ?  chooseWareHouseCard.get('cardUuid') : item.get('warehouseCardUuid')
							selectUuidList.push({
								cardUuid: item.get('uuid') || item.get('cardUuid'),
								storeUuid,
                                assistList: item.get('assistList'),
                                batchUuid: item.get('batchUuid'),
								isUniformPrice: item.get('isUniformPrice'),
								index: chooseSize + index
							})

						})
						if(selectUuidList.length > 0){

							dispatch(editCalculateActions.getBalanceAdjustPrice(oriDate,selectUuidList, 'countStockCardList', tempName,true,true))
						}

					}}

				/>
				<AdjustWayModal
                    showAdjustWayModal={showAdjustWayModal}
					clearSerialList={()=>{
                        dispatch(editCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList',curStockIndex,'serialList'], fromJS([])))
                    }}
					onOk={(adjustWay)=>{
                        this.setState({ showAdjustWayModal: false})
                        if(adjustWay === 'add'){ //录入序列号
                            this.setState({
								showEditSerial: true
							})
                        }else{ //选择序列号
                            const assistList = curStockItem.assistList || []
                            if (enableWarehouse && !curStockItem.warehouseCardUuid) {
                                message.info('请先填写仓库')
                                return
                            } else if (curStockItem['financialInfo','openAssist'] && (assistList.some(v => !v.get('propertyName')) || curStockItem['financialInfo','assistClassificationList'].length !== assistList.size)) {
                                message.info('请先填写辅助属性')
                                return
                            } else if (curStockItem['financialInfo','openBatch'] && !curStockItem.batchUuid) {
                                message.info('请先填写批次')
                                return
                            }else{
                                if (insertOrModify === 'modify') {
                                    dispatch(innerCalculateActions.getSerialList(curStockItem,curStockIndex,'out',(data) => {
                                        dispatch(editCalculateActions.changeEditCalculateCommonString(tempName, ['countStockCardList',curStockIndex,'serialList'], fromJS(data)))
                                        this.setState({showSerial:true})
                                    }))
                                } else {
                                    this.setState({showSerial:true})
                                }
                            }

                        }
                    }}
                    onCancel={()=>{
                        this.setState({ showAdjustWayModal: false})
                    }}
                />
			</div>
		)
	}
}
