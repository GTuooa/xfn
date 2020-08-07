import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../components/common.less'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'

import { jxcConfigCheck } from 'app/utils'
import placeholderText from 'app/containers/Config/placehoderText'
import XfnSelect from './XfnSelect'
import { UpperClassSelect, SelectAc, NumberInput, TableAll, TableBody, TableItem, Tab, TablePagination, Icon } from 'app/components'
import { Modal, message, Radio, Tree, Input, Button, Checkbox } from 'antd'
const { TreeNode } = Tree
const { confirm } = Modal
import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'
const reg = new RegExp('^[^\u4e00-\u9fa5]{0,16}$')
export default
class SerialModal extends React.Component {
	state={
		curSerialList:this.props.serialList.toJS() || [],
		preWords:'',
		openNumber:'',
		increase:'',
		addNumber:'',
		curPage:1,
		sortIndex:1
	}
	matchMath = (string) => {
		return string.match(/\d+$/) ? string.match(/\d+$/)[0] : ''
	}
	render() {
		const {
			assistModal,
			allAssistClassificationList,
			assistClassificationList,
			onClose,
			visible,
			onOk,
			fromPage
		} = this.props
		const {
			curSerialList,
			curPage,
			preWords,
			addNumber,
			openNumber,
			increase,
			sortIndex
		} = this.state
		const pageCount = Math.ceil((curSerialList.length || 1)/20)
		const showList = curSerialList.filter((v,index )=> index < curPage*20 && index >= (curPage -1)*20)
		return (
			<Modal
				destroyOnClose
				className='serial-modal'
				width={'480px'}
				visible={visible}
				maskClosable={false}
				title={'序列号录入'}
				footer={[
					<Button
						style={!curSerialList.length?{}:{borderColor:'#fd5458',color:'#fd5458'}}
						disabled={!curSerialList.length}
						onClick={() => {
							if (curSerialList.some(v => v.serialUuid && !v.canModify)) {
								message.info('存在序列号已出库，不允许清空')
								return
							}
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
					<Button onClick={onClose}>取消</Button>,
					<Button
						type='primary'
						onClick={() => {
							let longWordArr = []
							let newSerialList = curSerialList.map(v => ({...v,serialNumber:(v.serialNumber||'').trim()}))
							newSerialList.forEach((v,i) => {
								const serialNumber = v.serialNumber || ''
								serialNumber.length > 16 && longWordArr.push(i+1)
							})
							if (newSerialList.length > 1000) {
								message.info('序列号数量不能超过1000个！')
								return;
							} else if (newSerialList.some(v => !v.serialNumber)) {
								message.info('序列号不能为空！')
								return;
							} else if (longWordArr.length) {
								const word = longWordArr
								message.info(`序号${word.join('、')}的序列号不可超过16字符`)
								return;
							} else if (fromPage === 'inventory' && curSerialList.length > 1000) {
								message.info('序列号不能超过1000个')
								return
							} else if (fromPage !== 'inventory' && curSerialList.length > 100) {
								message.info('序列号不能超过100个')

							} else {
								let repeatArr = []
								let tipArr = []
								newSerialList.map((v,i) => {
									const serialNumber = v.serialNumber
									const index = curSerialList.findIndex((w,ii) => serialNumber === w.serialNumber && i < ii)
									if (index > -1) {
										repeatArr.push(i+1)
										tipArr = tipArr.concat([index+1,i+1])
									}
								})
								if (repeatArr.length) {
									const word = Array.from(new Set(tipArr)).sort((a,b) => a - b).join('、')
									confirm({
										title:'提示',
										okText:'自动去重',
										cancelText: '取消',
										content:`序号${word}序列号重复！`,
										onOk:() => {
											let newCurSerialList = newSerialList.filter((v,index)=> !repeatArr.some((w)=> w === index + 1))
											this.setState({curSerialList:newCurSerialList})
										}
									})
									return;
								}
							}
							onOk(newSerialList)
							onClose()
						}}
					>
						确定
					</Button>
				]}
				onCancel={onClose}
			>
				<div>
					<div className='serial-condition'>
						<div><span>前缀：</span>
						<Input
							onChange={e => {
								if (reg.test(e.target.value)) {
									this.setState({preWords:e.target.value})
								} else {
									message.info('前缀仅支持16位数字、字母和符号')
								}
							}}
							value={preWords}
						/>
					</div>
						<div>
							<span>起始号：</span>
							<NumberInput
								type='roundNumber'
								onChange={value => {
									this.setState({openNumber:value})
								}}
								value={openNumber}
							/>
						</div>
					</div>
					<div className='serial-condition'>
						<div>
							<span>递增量：</span>
							<NumberInput
								type='roundNumber'
								onChange={value => {
									this.setState({increase:value})
								}}
								value={increase}
							/>
						</div>
						<div className='special'><span>个数：</span><NumberInput
							type='roundNumber'
							onChange={value => {
								if (value <= 1000) {
									this.setState({addNumber:value})
								} else {
									message.info('个数不可大于1000')
								}
							}}
							value={addNumber}
						/><Button
							type='primary'
							disabled={!openNumber || !increase || !addNumber}
							onClick={() => {
								let preW = preWords || ''
								const code =(preW+ openNumber).trim()
								let arr = [{serialNumber:code}]
								for (let i=1;i<Number(addNumber);i++) {
									const number = Number(openNumber)
									const totalLength = openNumber.length
									const numberLength = String(number).length
									const zeroLength = totalLength - numberLength
									const numberPart = String(number + Number(increase) * i)
									const zeroPartLength = zeroLength - numberPart.length + numberLength
									let zeroPart = ''
									for (let j = 1;j <= zeroPartLength;j++ ) {
										zeroPart = zeroPart + '0'
									}
									arr.push({serialNumber:(preW + zeroPart + numberPart).trim()})

								}
								const allList = curSerialList.concat(arr)
								if (allList.some( v => v.serialNumber && v.serialNumber.length > 16)) {
									message.info('序列号不可超过16个字符')
									return;
								}
								this.setState({
									curSerialList:curSerialList.concat(arr),
								})
							// dispatch(editInventoryCardActions.)
						}}>新增</Button></div>
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
													if (v.serialUuid &&!v.canModify) {
														message.info('该序列号已出库,无法删除')
														return
													}
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
											<li><Input
												value={v.serialNumber}
												onChange={e => {
													if (!reg.test(e.target.value)) {
														message.info('序列号仅支持数字、字母和符号')
													} else if (curSerialList.length) {
														curSerialList[(curPage -1) * 20 + index].serialNumber = e.target.value
														this.setState({curSerialList})
													} else {
														this.setState({curSerialList:[{serialNumber:e.target.value}]})
													}

												}}
											/></li>
										</TableItem>
									)
								}
							</TableBody>
							<TablePagination
								size='small'
								currentPage={curPage}
								pageCount={pageCount}
								paginationCallBack={(value) => this.setState({curPage:value})}
							/>
						</TableAll>
					</div>
				</div>
			</Modal>
		)
	}
}
