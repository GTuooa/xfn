import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'

import { jxcConfigCheck } from 'app/utils'
import placeholderText from 'app/containers/Config/placehoderText'
import { UpperClassSelect, SelectAc, NumberInput, TableAll, TableBody, TableItem, Tab, TablePagination } from 'app/components'
import { Modal, message, Radio, Tree, Input, Button, Checkbox, Tag } from 'antd'
import { Icon } from 'app/components'
const { TreeNode } = Tree
const { confirm } = Modal

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'

export default
class MultiSerialModal extends React.Component {
	state={
		curPage:1,
		multiModal:false,
		curSerialList:this.props.curSerialList || [],
		serachContent:''
	}
	render() {
		const {
			dispatch,
			close,
			closePre,
			visible,
			serialList,
			stockIndex,
			onOk,
			multiSelectOnok,
			item,
			taxRate,
			selectedList
		} = this.props
		const {
			curPage,
			curSerialList,
			serachContent
		} = this.state
		const showList = serialList.filter(v => serachContent ? String(v.serialNumber).indexOf(serachContent) > -1:true)
									.filter((v,index )=> index < curPage*20 && index >= (curPage -1)*20)
		const total = serialList
			.filter(v => serachContent ? String(v.serialNumber).indexOf(serachContent) > -1:true)
			.length
		const checkAll = showList.every(w => curSerialList.some(z => z.serialUuid === w.serialUuid)||selectedList.some(z => z.serialUuid === w.serialUuid))
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
						close()
						closePre()
					}}>取消</Button>,
					<Button
						type='primary'
						onClick={() => {
							close()
							closePre()
							if(multiSelectOnok){
								multiSelectOnok(curSerialList)
							}else{
								const list = curSerialList.filter(v => v.serialNumber)
								dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',stockIndex,'quantity'],list.length))
								dispatch(editRunningActions.changeLrAccountCommonString('ori',['stockCardList',stockIndex,'serialList'],fromJS(list)))
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
					close()
					closePre()
				}}
			>
				<div>
					<div className='multi-serial-modal-title'>
						<div>
							{
							`${item.get('warehouseCardName')?`仓库：${item.get('warehouseCardName')};`:''}${assistList.some(w => w.get('propertyName'))? '属性：' + assistList.map(w => w.get('propertyName')).join():''}${item.get('batch')?'批次：' + item.get('batch'):''}`
							}
						</div>
						<div>
							<Input
								value={serachContent}
								onChange={e => {
									this.setState({serachContent:e.target.value,curPage:1})
								}}
								placeholder='搜索'
								suffix={<Icon type="search" />}
							/>
						</div>
					</div>
					<div style={{overflow:'hidden'}}>
						<TableAll className={`serial-table serial-table-checkbox`}>
							<div className="table-title-wrap">
							<ul className={`serial-table-item serial-table-title table-title`} line={2}>
								<li
									onClick={(e)=>{
										e.stopPropagation()
										showList.forEach((v,index)=> {
											if (!checkAll) {
												if (curSerialList.some(w => w.serialNumber === v.serialNumber) || selectedList.some(w => w.serialNumber === v.serialNumber)) {
													return
												}
												curSerialList.push({serialUuid:v.serialUuid,serialNumber:v.serialNumber})
											} else {
												const curIndex = curSerialList.findIndex(w => w.serialNumber === v.serialNumber)
												curSerialList.splice(curIndex,1)
											}
										})
										this.setState({
											curSerialList,
										})
									}}
								>
									<Checkbox
										checked={checkAll}
										// onChange={e => {
										// 	showList.forEach((v,index)=> {
										// 		if (e.target.checked) {
										// 			if (curSerialList.some(w => w.serialNumber === v.serialNumber)) {
										// 				return
										// 			}
										// 			curSerialList.push({serialUuid:v.serialUuid,serialNumber:v.serialNumber})
										// 		} else {
										// 			const curIndex = curSerialList.findIndex(w => w.serialNumber === v.serialNumber)
										// 			curSerialList.splice(curIndex,1)
										// 		}
										// 	})
										// 	this.setState({
										// 		curSerialList,
										// 	})
										// }}
									/>
								</li>
								<li>序列</li>
								<li>序列号</li>
							</ul>
							</div>
							<TableBody>

								{
									showList.map((v,index) =>
										<TableItem  className={`serial-table-item`} line={index+1} key={index}>
											<li>
												<span
													onClick={(e)=>{
														e.stopPropagation()
														if (selectedList.some(w => w.serialUuid === v.serialUuid)) {
															return
														}
														if (!curSerialList.some(w => w.serialUuid === v.serialUuid)) {
															curSerialList.push({serialUuid:v.serialUuid,serialNumber:v.serialNumber})
														} else {
															const index = curSerialList.findIndex(w => w.serialUuid === v.serialUuid)
															curSerialList.splice(index,1)
														}
														this.setState({curSerialList})
													}}
													style={{borderRight:0}}
												>
													<Checkbox
														disabled={selectedList.some(w => w.serialUuid === v.serialUuid)}
														checked={curSerialList.some(w => w.serialUuid === v.serialUuid) || selectedList.some(w => w.serialUuid === v.serialUuid)}
													/>
												</span>
											</li>
											<li>{(curPage -1) * 20 + index + 1}</li>
											<li>{v.serialNumber}</li>
										</TableItem>
									)
								}
							</TableBody>
							<div className='serial-modal-bottom'>
								<Button
									onClick={() => {
										onOk(curSerialList)
										close()
									}}
									type='primary'
									><Icon type="search" />查看已选</Button>
								<TablePagination
									size='small'
									currentPage={curPage}
									pageCount={Math.ceil(total/20)}
									paginationCallBack={(value) => this.setState({curPage:value})}
								/>
							</div>
						</TableAll>
						<div className='serial-choose'>
							选择序列号：
							{
								curSerialList.map((v, index) =>
									<Tag
										key={index}
										closable={true} onClose={() => {
											curSerialList.splice(index,1)
											this.setState({curSerialList})
									}}>
										{v.serialNumber}
									</Tag>
								)
							}
						</div>
						<div style={{marginTop:'10px'}}>{curSerialList.length}个序列号</div>
					</div>
				</div>
			</Modal>
		)
	}
}
