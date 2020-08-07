import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import XfnSelect from 'app/components/XfnSelect'

import { jxcConfigCheck } from 'app/utils'
import placeholderText from 'app/containers/Config/placehoderText'
import { UpperClassSelect, SelectAc, NumberInput, TableAll, TableBody, TableItem, Tab, TablePagination } from 'app/components'
import { Modal, message, Radio, Tree, Input, Button, Checkbox, Select } from 'antd'
import { Icon } from 'app/components'
const { TreeNode } = Tree
const { confirm } = Modal
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import MultiSerialModal  from './MultiSerialModal'

export default
class SerialModal extends React.Component {
	state={
		curPage:1,
		multiModal:false,
		curSerialList:this.props.curSerialList,
		sortIndex:1
	}
	componentDidMount() {
		this.props.dispatch(editRunningActions.getInSerialList(this.props.item,this.props.oriUuid,this.props.oriState))
	}
	render() {
		const {
			dispatch,
			onClose,
			visible,
			serialList,
			stockIndex,
			onOK,
			item,
			taxRate,
			selectedList

		} = this.props
		const {
			curPage,
			multiModal,
			curSerialList,
			sortIndex
		} = this.state
		const pageCount = Math.ceil((curSerialList.length || 1)/20)
		const showList = curSerialList.filter((v,index )=> index < curPage*20 && index >= (curPage -1)*20)
										.filter(v => !selectedList.some(w => w.serialNumber === v.serialNumber))
		const assistList = item.get('assistList') || fromJS([])
		return (
			<Modal
				destroyOnClose
				className='serial-modal lr-serial-modal'
				width={'480px'}
				visible={visible}
				maskClosable={false}
				title={'选择序列号'}
				footer={[
					<Button
						style={!curSerialList.length?{}:{borderColor:'#fd5458',color:'#fd5458'}}
						disabled={!curSerialList.length}
						onClick={() => {
							curSerialList.length && Modal.confirm({
							title:'提示',
							content:'确认清空当前序列号吗？',
							onOk:() => {
								this.setState({
									curSerialList:[],
									curPage:1
								})
							}
						})
					}}>清空</Button>,
					<Button onClick={() => {
						onClose()
					}}>取消</Button>,
					<Button
						type='primary'
						onClick={() => {
							onClose()
							if(onOK){
								onOK(curSerialList)
							}else{
								const list = curSerialList.filter(v => v.serialNumber)
								dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',stockIndex,'serialList'],fromJS(list)))
								dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',stockIndex,'quantity'],list.length))
								dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',stockIndex,'isModify'],true))
								if (item.get('price') > 0) {
									const amount = (list.length * item.get('price')).toFixed(2)
									dispatch(editRunningActions.changeLrAccountCommonString('ori', ['stockCardList',stockIndex,'amount'], amount))
									dispatch(editRunningActions.autoCalculateStockAmount())
									taxRate && dispatch(editRunningActions.changeAccountTaxRate())

								}
							}
						}}
					>
						确定
					</Button>
				]}
				onCancel={() => {
					onClose()
				}}
			>
				<div>
					<div className='serial-modal-title'>
						{
						`${item.get('warehouseCardName')?`仓库：${item.get('warehouseCardName')};`:''}${assistList.some(w => w.get('propertyName'))? '属性：' + assistList.map(w => w.get('propertyName')).join():''}${item.get('batch')?'批次：' + item.get('batch'):''}`
						}
					</div>
					<div style={{overflow:'hidden'}}>
						<TableAll className={`serial-table`}>
							<div className="table-title-wrap">
							<ul className={`serial-table-item serial-table-title table-title`} line={2}>
								<li>操作</li>
								<li>序列</li>
								<li>序列号<span className='icon-sort' onClick={() => {
									this.setState({curSerialList:curSerialList.sort((a,b) => a.serialNumber > b.serialNumber ?sortIndex:-sortIndex),sortIndex:-sortIndex})
								}}></span></li>
							</ul>
							</div>
							<TableBody>
								{
									(showList.length?showList:[{}]).map((v,index) =>
										<TableItem  className={`serial-table-item`} line={index+1} key={index}>
											<li>
												<span><XfIcon type='big-plus'  onClick={() => {
													if (curSerialList.length === 0) {
														this.setState({
															curSerialList:[{},{}]
														})
													} else {
														curSerialList.splice((curPage -1) * 20 + index + 1,0,{})
														this.setState({
															curSerialList,
														})
													}
												}}/></span>
												<span><Icon type='close' onClick={() => {
													if (curSerialList.length === 0) {
														this.setState({
															curSerialList:[]
														})
													} else {
														curSerialList.splice((curPage -1) * 20 + index,1)
														this.setState({
															curSerialList,
															curPage:(showList.length === 0 || showList.length === 1) && pageCount > 1?curPage-1:curPage
														})
													}
												}}/></span>
											</li>
											<li>{(curPage -1) * 20 + index + 1}</li>
											<li>
												<XfnSelect
													// value={(curSerialList.find(v => v.index === (curPage -1) * 20 + index + 1) || {}).serialNumber}
													value={v.serialNumber}
													showSearch
													onChange={value => {
														const valueList = value.split(Limit.TREE_JOIN_STR)
														const serialUuid = valueList[0]
														const serialNumber = valueList[1]
														if (curSerialList.length) {
															curSerialList[(curPage -1) * 20 + index] = {serialUuid,serialNumber}
															this.setState({curSerialList})
														} else {
															this.setState({curSerialList:[{serialNumber,serialUuid}]})
														}
													}}
													>
													{
														serialList.filter(v => curSerialList.every(w => w.serialNumber !== v.get('serialNumber')))
														.filter(v => selectedList.every(w => w.serialNumber !== v.get('serialNumber')))
														.map(v =>
															<Option key={v.get('serialNumber')} value={`${v.get('serialUuid')}${Limit.TREE_JOIN_STR}${v.get('serialNumber')}`}>
																{v.get('serialNumber')}
															</Option>
														)
													}
												</XfnSelect>
											</li>
										</TableItem>
									)
								}
							</TableBody>
							<div className='serial-modal-bottom'>
								<Button type='primary' onClick={() => this.setState({multiModal:true})}>批量选择</Button>
								<TablePagination
									size='small'
									currentPage={curPage}
									pageCount={pageCount}
									paginationCallBack={(value) => this.setState({curPage:value})}
								/>
							</div>
						</TableAll>
					</div>
				</div>
				{
					multiModal?
					<MultiSerialModal
						visible={multiModal}
						dispatch={dispatch}
						serialList={serialList.toJS()}
						curSerialList={curSerialList.filter(v => v.serialNumber)}
						close={() => this.setState({multiModal:false})}
						closePre={onClose}
						stockIndex={stockIndex}
						item={item}
						taxRate={taxRate}
						selectedList={selectedList}
						onOk={list => {
							this.setState({curSerialList:list})
						}}
						multiSelectOnok={onOK}
					/>:''
				}
			</Modal>
		)
	}
}
