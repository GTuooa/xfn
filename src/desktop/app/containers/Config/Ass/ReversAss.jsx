import React from 'react'
import { fromJS, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { ROOT } from 'app/constants/fetch.constant.js'
import { Button, Menu, Select, Tooltip, Modal, Radio, Input, message } from 'antd'
import { Icon } from 'app/components'
const { Option } = Select;
const RadioGroup = Radio.Group
import { ImportModal, ExportModal } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'
import ReversAssDetail from './ReversAssDetail.jsx'

import * as allActions from 'app/redux/Home/All/all.action'
import * as fzhsActions from 'app/redux/Config/Ass/assConfig.action.js'
import { nameCheck } from 'app/utils'

@immutableRenderDecorator
export default
class ReversAss extends React.Component {
	constructor() {
		super()
		this.state = {
			reversType: 'id',
			showInfo: false,
		}
	}

	render() {
		const {
			tags,
			asslist,
			dispatch,
			allState,
			reversAss,
			assMessage,
			showReversModal,
			reversAssConfirmShow,
			activeAssCategory,
			oldName,
			newName,
			assCategoryModalVisible,
			ass
		} = this.props

		const { reversType, showInfo ,} = this.state

		const reversAssList = asslist.find(v => v.get('asscategory') === reversAss.get('assCategory'))
		const reserveTags = fromJS(['客户', '供应商', '职员', '项目', '部门'])
		let customTags = tags.filter(v => reserveTags.indexOf(v)<0 )
		return (
			<Modal
				visible={showReversModal}
				title="反悔模式"
				onCancel={() => {
					this.setState({showInfo : false})
					dispatch(fzhsActions.changeReversAssModal(false))
					dispatch(fzhsActions.changeReverseOldName(''))
					dispatch(fzhsActions.changeReverseNewName(''))
				}}
				footer={reversType==='id'?
				[<Button
					type="ghost"
					onClick={() => {
						this.setState({showInfo : false})
						dispatch(fzhsActions.changeReversAssModal(false))
						dispatch(fzhsActions.changeReverseOldName(''))
						dispatch(fzhsActions.changeReverseNewName(''))
					}}
					>
					取消
				</Button>,
				<Button
					type="primary"
					disabled={reversAss.get('assCategory') && reversAss.get('oldAssId') ? false : true}
					onClick={() => {
						if (!reversAss.get('assId')) {
							return thirdParty.Alert('未填写新编码')
						}
						if (showInfo) {
							return thirdParty.Alert('新编码已存在，不可修改')
						}
						dispatch(fzhsActions.changeReversAssConfirmShow(true))
					}}
					>
					信息确认
				</Button>
				]:[<Button
					type="ghost"
					onClick={() => {
						this.setState({showInfo : false})
						dispatch(fzhsActions.changeReversAssModal(false))
						dispatch(fzhsActions.changeReverseOldName(''))
						dispatch(fzhsActions.changeReverseNewName(''))
					}}
					>
					取消
				</Button>,<Button
					type="primary"
					disabled={newName==="" || oldName===''}
					onClick={() => {
						if(customTags.includes(newName) || reserveTags.includes(newName)){
							message.warning('已存在同名的辅助类别')
						}else{
							dispatch(fzhsActions.changeReversAssConfirmShow(true))
						}
					}}
					>
					信息确认
				</Button>]}
				width='480px'
				>
				<div>
					<div className="reverse-item">
						<span>反悔类型：</span>
						<RadioGroup
							onChange={e => {
								this.setState({reversType: e.target.value})
							}}
							value={reversType}
							>
                            <Radio key="a" value={'id'}>修改核算对象编码</Radio>
							<Radio key="b" value={'name'}>修改辅助类别名称</Radio>
                        </RadioGroup>
					</div>
					{reversType === "id" ?
						<div>
							<div className="reverse-item">
								<span>辅助类别：</span>
								<Select
									className="reverse-item-input"
									showSearch
									optionFilterProp="children"
									notFoundContent="无法找到相应类别"
									value={reversAss.get('assCategory')}
									onChange={(value) => {
										if (!value) {
											return dispatch(fzhsActions.changeReversCategory(''))
										}
									}}
									onSelect={(value) => {
										dispatch(fzhsActions.changeReversCategory(value))
										const asss = asslist.find(v => v.get('asscategory') === value)
										if (!asslist.find(v => v.get('asscategory') === value)) {
											return thirdParty.Alert('该辅助类别的核算对象不需要使用反悔模式')
										}
									}}
								>
									{(tags || []).map((v, i) => <Option key={i} value={v}>{v}</Option>)}
								</Select>
							</div>
							<div className="reverse-item">
								<span>核算对象：</span>
								<Select
									disabled={!reversAss.get('assCategory')}
									className="reverse-item-input"
									showSearch
									optionFilterProp="children"
									notFoundContent="无法找到相应辅助核算"
									value={`${reversAss.get('oldAssId')} ${reversAss.get('assName')}`}
									onChange={(value) => {
										if (!value) {
											dispatch(fzhsActions.clearReversAss(''))
										}
									}}
									onSelect={(value) => {
										if (!reversAss.get('assCategory')) {
											return thirdParty.Alert('请先选择辅助类别')
										}
										const info = value.split(Limit.TREE_JOIN_STR)
										dispatch(fzhsActions.selectReversAssCheck(reversAss.get('assCategory'),info[0], info[1]))
									}}
									>
									{(reversAssList ? reversAssList.get('asslist') : []).map((v, i) => <Option key={i} value={`${v.get('assid')}${Limit.TREE_JOIN_STR}${v.get('assname')}`}>{`${v.get('assid')} ${v.get('assname')}`}</Option>)}
									</Select>
							</div>
							<div className="reverse-item-line"></div>
							<div className="reverse-item reverse-item-show">
							<div className="reverse-item-show-title">该核算对象已使用的内容</div>
								<ul className="reverse-item-show-tip">
									{assMessage.map(u => <li>{u === 'vc' ? '有相关的凭证' : u}</li>)}
								</ul>
								</div>
							<ul className="uses-tip">
								<li>将统一修改以上内容的核算对象编码</li>
							</ul>
							<div className="reverse-item">
								<span className={reversAss.get('oldAssId') ? '' : 'revers-color'}>原编码：</span>
								<Input
									disabled={true}
									className="reverse-item-input"
									value={reversAss.get('oldAssId')}
								/>
							</div>
							<div className="reverse-item">
								<span className={reversAss.get('oldAssId') ? '' : 'revers-color'}>新编码：</span>
								<Input
									disabled={reversAss.get('oldAssId') ? false : true}
									className="reverse-item-input"
									value={reversAss.get('assId')}
									onChange={(e) => {
										if(e.target.value.length > Limit.CODE_LENGTH){
											return message.warn(`辅助核算编码位数不能超过${Limit.CODE_LENGTH}位`)
										}
										dispatch(fzhsActions.changeReversAssId(e.target.value))
										this.setState({
											showInfo: reversAssList.get('asslist').some(v => v.get('assid') === e.target.value)

										})
									}}
								/>
							</div>
							<div className="reverse-item" style={{display: showInfo ? '' : 'none'}}>
								<div className="reverse-item-icon"><Icon type="exclamation-circle-o" style={{marginRight: '5px'}} />辅助类别下该编码已存在</div>
							</div>
						</div>
						:
						<div>
							<div className="reverse-item">
								<span>辅助类别：</span>
								<Select
									showSearch
									optionFilterProp="children"
									notFoundContent="无法找到相应类别"
									className="reverse-item-input"
									value={oldName}
									onChange={(value) => {
										if (!value) {
											return dispatch(fzhsActions.changeReverseOldName(''))
										}
									}}
									onSelect={(value) => {
										dispatch(fzhsActions.changeReverseOldName(value))
									}}
								>
									{customTags.map(v => <Option value={v}>{v}</Option>)}
								</Select>
							</div>
							<div className="reverse-item">
								<span >修改后名称：</span>
								<Input
									className="reverse-item-input"
									value={newName}
									onChange={(e)=>{
										if(nameCheck(e.target.value)){
											return message.warn(`辅助类别名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
										}
										dispatch(fzhsActions.changeReverseNewName(e.target.value))
									}}
								/>
							</div>
						</div>
					}

				</div>

				<ReversAssDetail
					dispatch={dispatch}
					reversAss={reversAss}
					assMessage={assMessage}
					reversAssConfirmShow={reversAssConfirmShow}
					reversType={reversType}
					oldName={oldName}
					newName={newName}
					assCategoryModalVisible={assCategoryModalVisible}
					ass={ass}
				/>
			</Modal>
		)
	}
}
