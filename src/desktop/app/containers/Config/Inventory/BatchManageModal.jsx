import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../components/common.less'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'

import moment from 'moment'
import { jxcConfigCheck, DateLib } from 'app/utils'
import placeholderText from 'app/containers/Config/placehoderText'
import XfnSelect from './XfnSelect'
import BatchModal from './BatchModal'
import BatchDrop from './BatchDrop'
import { batchReg, batchMessage } from './common'

import { UpperClassSelect, SelectAc, NumberInput, TableAll, TableBody, TableItem, Tab, TablePagination } from 'app/components'
import { Modal, message, Radio, Icon, Tree, Input, Button, Checkbox, Switch, DatePicker } from 'antd'
const { TreeNode } = Tree
const { confirm } = Modal
const { Search } = Input
import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'
export default
class BatchManageModal extends React.Component {
	state={
		orderBy:'BATCH',
		isAsc:false,
		condition:'',
		curPage:1,
		modifyBatch:false,
		modifyBatchUuid:'',
		batch:'',
		modifyBatchDate:'',
		checkList:[],
		batchDrop:false,
		modifyExpirationDate:''
	}
	getCurShelfLife = (startDate,endDate) => {
		const sDate1 = Date.parse(startDate)
		const sDate2 = Date.parse(endDate)
		return sDate2 > sDate1 ? Math.floor((sDate2 - sDate1) / (24 * 3600 * 1000)):null
	}
	chooseBatchItem = item => {
		this.setState({modifyBatch:true,modifyBatchUuid:item.get('batchUuid'),batch:item.get('batch'),modifyBatchDate:item.get('productionDate'),modifyExpirationDate:item.get('expirationDate'),shelfLife:item.get('shelfLife')})
	}
	render() {
		const {
			batchList,
			batchUuid,
			onClose,
			visible,
			onOk,
			dispatch,
			openShelfLife,
			shelfLife
		} = this.props
		const {
			curPage,
			condition,
			orderBy,
			isAsc,
			modifyBatch,
			modifyBatchUuid,
			batch,
			modifyBatchDate,
			checkList,
			batchDrop,
			modifyExpirationDate,
		} = this.state
		const pageCount = Math.ceil((batchList.size || 1)/100)
		const checkedAll = batchList.every(v => checkList.some(w => w === v.get('batchUuid')))
		return (
			<Modal
				destroyOnClose
				className='serial-modal'
				width={'480px'}
				visible={visible}
				maskClosable={false}
				title={'批次管理'}
				footer={[
					<Button
						style={checkList.length?{borderColor:'#fd5458',color:'#fd5458'}:{}}
						disabled={!checkList.length}
						onClick={() => {
							Modal.confirm({
							title:'提示',
							content:'确认删除选中的批次号吗？',
							onOk:() => {
								dispatch(editInventoryCardActions.deleteBatch(batchUuid,checkList,curPage,condition,orderBy,isAsc,() => this.setState({checkList:[]})))
							}
						})
					}}>删除</Button>

				]}
				onCancel={() => {
					dispatch(editInventoryCardActions.changeInventoryCardViews('batchManageModal',false))

				}}
			>
				<div className='bach-manage-modal'>
					<div style={{marginBottom:'12px'}}>
						<Search
							onSearch={value => {
								dispatch(editInventoryCardActions.getBatchList(batchUuid,curPage,value,orderBy,() => this.setState({condition:value})))
							}}
							placeholder="搜索批次"
							style={{ width: '100%'}}
						/>
					</div>
					<div className={`${openShelfLife?'bach-manage-shelf-list':'bach-manage-list'}`}>
						<div className='bach-manage-title'>
							<span><Checkbox
								checked={checkedAll}
								onChange={e => {
									if (e.target.checked) {
										batchList.forEach(v => {
											checkList.every(w => w !== v.get('batchUuid')) && checkList.push(v.get('batchUuid'))
										})
										this.setState({checkList})
									} else {
										this.setState({checkList:[]})
									}
								}}
							/></span>
							<span>
								批次号
								<span className='icon-sort' onClick={() => {
									dispatch(editInventoryCardActions.getBatchList(batchUuid,curPage,condition,'BATCH',orderBy === 'BATCH'?!isAsc:isAsc,() => this.setState({orderBy:'BATCH',isAsc:orderBy === 'BATCH'?!isAsc:isAsc})))
								}}></span>
							</span>
							<span
								style={{display:openShelfLife?'':'none'}}
								>
								生产日期
								<span className='icon-sort' onClick={() => {
									dispatch(editInventoryCardActions.getBatchList(batchUuid,curPage,condition,'PRODUCTION_DATE',orderBy === 'PRODUCTION_DATE'?!isAsc:isAsc,() => this.setState({orderBy:'PRODUCTION_DATE',isAsc:orderBy === 'PRODUCTION_DATE'?!isAsc:isAsc})))
								}}></span>
							</span>
							<span
								style={{display:openShelfLife?'':'none'}}
								>
								截止日期
								<span className='icon-sort' onClick={() => {
									dispatch(editInventoryCardActions.getBatchList(batchUuid,curPage,condition,'EXPIRATION_DATE',orderBy === 'EXPIRATION_DATE'?!isAsc:isAsc,() => this.setState({orderBy:'EXPIRATION_DATE',isAsc:orderBy === 'EXPIRATION_DATE'?!isAsc:isAsc})))
								}}></span>
							</span>
							<span>
								启/停用
								<span className='icon-sort' onClick={() => {
									dispatch(editInventoryCardActions.getBatchList(batchUuid,curPage,condition,'CAN_USE',orderBy === 'CAN_USE'?!isAsc:isAsc,() => this.setState({orderBy:'CAN_USE',isAsc:orderBy === 'CAN_USE'?!isAsc:isAsc})))
								}}></span>
							</span>
						</div>
						{
							batchList.map((v,index) =>
								<div key={v.get('batchUuid')} className='bach-manage-item'>
									<span><Checkbox
										checked={checkList.some(w => w === v.get('batchUuid'))}
										onChange={e => {
											e.target.checked?
											checkList.push(v.get('batchUuid'))
											:
											checkList.splice(checkList.findIndex(w => w === v.get('batchUuid')),1)
											this.setState({checkList})
										}}
									/></span>
									<span
										onClick={() => {
											this.chooseBatchItem(v)
										}}
										>{v.get('batch')}</span>
									<span
										style={{display:openShelfLife?'':'none'}}
										onClick={() => {
											this.chooseBatchItem(v)
										}}
										>{v.get('productionDate')}
									</span>
									<span
										style={{display:openShelfLife?'':'none'}}
										onClick={() => {
											this.chooseBatchItem(v)
										}}
										>{v.get('expirationDate')}</span>
									<span><Switch checked={v.get('canUse')} onChange={checked => {
										dispatch(editInventoryCardActions.toggleBatch(batchUuid,v.get('batchUuid'),checked,curPage,condition,orderBy,isAsc,() => {
											dispatch(editInventoryCardActions.changeInventoryCardViews('batchList',batchList.setIn([index,'canUse'],checked)))
										}))
									}}/></span>
								</div>
							)
						}
					</div>
					<div className='bach-manage-bottom'>
						<Button
							onClick={() => {
								this.setState({batchDrop:true})
							}}
							type='primary'
							><Icon type="plus" />新增批次</Button>
						<TablePagination
							size='small'
							currentPage={curPage}
							pageCount={pageCount}
							paginationCallBack={(value) => {
								dispatch(editInventoryCardActions.getBatchList(batchUuid,value,condition,orderBy,() => this.setState({curPage:value})))

							}}
						/>
					</div>
					{
						modifyBatch?
						<Modal
							title='修改批次号'
							visible={modifyBatch}
							onCancel={() => {
								this.setState({modifyBatch:false})
							}}
							onOk={() => {
								dispatch(editInventoryCardActions.modifyBatch(batch,modifyBatchUuid,openShelfLife?modifyBatchDate:'',modifyExpirationDate,batchUuid,() => {
									dispatch(editInventoryCardActions.getBatchList(batchUuid,curPage,condition,orderBy))
									this.setState({modifyBatch:false})
								}))
							}}

						>
							<div className='batch-modal'>
								<div>
									<span><span style={{color:'red'}}>*</span>批次号：</span>
									<div><Input
										value={batch}
										placeholder='请输入批次号'
										onChange={(e) => {
											e.preventDefault()
											if (batchReg.test(e.target.value)) {
												this.setState({batch:e.target.value})

											} else {
												message.info(batchMessage)
											}
										}}
									/></div>
								</div>
								{
									openShelfLife?
									<div>
										<span>生产日期：</span>
										<div><DatePicker
											allowClear={false}
											dropdownClassName={`inventory-are-for-dom`}
											value={modifyBatchDate?moment(modifyBatchDate):''}
											onChange={value => {
												const date = value.format('YYYY-MM-DD')
												this.setState({modifyBatchDate:date})
												// dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
											}}/></div>
									</div>:''
								}
								{
									openShelfLife?
									<div>
										<span><span style={{color:'red'}}>*</span>截止日期</span>
										<div><DatePicker
											allowClear={false}
											dropdownClassName={`inventory-are-for-dom`}
											value={modifyExpirationDate?moment(modifyExpirationDate):''}
											onChange={value => {
												const date = value.format('YYYY-MM-DD')
												this.setState({modifyExpirationDate:date})
												// dispatch(editRunningActions.changeLrAccountCommonString('ori', 'oriDate', date))
											}}/></div>
									</div>:''
								}
								{
									openShelfLife && (shelfLife || modifyBatchDate && modifyExpirationDate)?
									<div>
										<span></span>
										<div>{`(${shelfLife?`默认保质期：${shelfLife}天 `:''}${this.getCurShelfLife(modifyBatchDate,modifyExpirationDate)?`实际保质期：${this.getCurShelfLife(modifyBatchDate,modifyExpirationDate)}天`:''})`}</div>
									</div>:''
								}
							</div>
						</Modal>
						:''
					}
					{
						batchDrop?
						<BatchDrop
							shelfLife={shelfLife}
							visible={batchDrop}
							dispatch={dispatch}
							uuid={batchUuid}
							openShelfLife={openShelfLife}
							close={() => {
								this.setState({batchDrop:false})
							}}
							onOk={(batchNumber,batchDate,expirationDate,close) => {
								dispatch(editInventoryCardActions.insertInventoryBatch(batchNumber,openShelfLife?batchDate:'',openShelfLife?expirationDate:'',batchUuid,condition,orderBy,curPage,isAsc,close))
							}}
						/>:''
					}
				</div>
			</Modal>
		)
	}
}
