import React from 'react'
import { toJS, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as configActions from 'app/redux/Config/Ac/acConfig.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

import ModifyUnitModal from './ModifyUnitModal'
import * as Limit from 'app/constants/Limit.js'
import { Switch, Input, Select, Checkbox, Button, Modal, message } from 'antd'
import { debounce } from 'app/utils/mutiClick.js'
//引入校验方式
import { judgePermission } from 'app/utils'
const Option = Select.Option

import './style/index.less'

@immutableRenderDecorator
export default
class AcOption extends React.Component {

	constructor() {
		super()
		this.state = {reviseModal: false, acunitModify: false, acName: '', acId: ''}
	}

	componentWillReceiveProps(nextprops) {
		if (nextprops.acConfigMode === 'modify' && sessionStorage.getItem('changeAcInfo')) {
			this.setState({acName: nextprops.tempAcItem.get('acname'), acId: nextprops.tempAcItem.get('acid')})
			sessionStorage.setItem('changeAcInfo', false)
		} else if (nextprops.acConfigMode !== 'modify') {
			this.setState({acName: nextprops.tempAcItem.get('acname') ? nextprops.tempAcItem.get('acname') : '', acId: nextprops.tempAcItem.get('acid') ? nextprops.tempAcItem.get('acid') : ''})
		}
	}

	render() {
		const {
			moduleInfo,
			acSelectedIndex,
			tempAcItem,
			dispatch,
			aclist,
			acTags,
			acConfigMode,
			modalDisplay,
			// configPermissionInfo,
			lrpzKmPermission,
			configState,
			tabSelectedIndex,
			acid,
			onCancel,
			onClickSave,
			onChangeAcId,
			onChangeAcText,
			onSelect,
			disabled,
			onChangeSwitch,
			changeAmountCheckbox,
			changeAmountInput,
			CUD_AC_SETTING ,

		} = this.props

		const { reviseModal, acunitModify, acName, acId } = this.state
		const acidlist = [tempAcItem.get('acid')]
		// const disabled = !!tempAcItem.get('asscategorylist').size || tempAcItem.get('nextac')
		
		

		let unitDisabled = false //单位输入框是否可用
		let unitChanged = false //修改单位的显示状态
		if (tempAcItem.get('acunitOpen') == '1') { //开启数量核算
			if (acConfigMode == 'modify') { //从修改进来
				if (tempAcItem.get('acunit')) { //且数量单位有值
					unitDisabled = true //则数量单位的输入框灰掉
				} else { //且没值
					unitChanged = true //则修改单位消失掉
				}
			}
		} else { //未开启
			unitChanged = true //则修改单位消失掉
		}
		// const categorys = ['流动资产', '非流动资产', '流动负债', '非流动负债', '所有者权益', '成本', '营业收入', '其他收益', '营业成本', '营业税金及附加', '期间费用', '其他损失', '所得税费用']
		const disabledCategory = !!tempAcItem.get('asscategorylist').size || tempAcItem.get('nextac') || !!tempAcItem.get('upperid')
		const oldAcunit = tempAcItem.get('oldAcunit')

		return (
			<Modal
				okText="保存"
				visible={modalDisplay}
				maskClosable={false}
				title={acConfigMode == 'insert' || acConfigMode == 'insertLrpz' ? '新增科目' : '编辑科目'}
				onCancel={onCancel}
				// onCancel={() => dispatch(configActions.changeModalDisplay()) && dispatch(configActions.cancelEnterAcItemFetch())}
				footer={[
					<Button key="cancel" type="ghost"
						style={{display: acConfigMode == 'insertLrpz' ? 'none' : 'inline-block'}}
						onClick={() => {
							dispatch(configActions.changeModalDisplay()); dispatch(configActions.cancelEnterAcItemFetch());
							this.setState({acunitModify: false})
						}}>
						取 消
					</Button>,
					<Button key="ok"
						// disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
						//管理权限修改  如果display为show就显示按钮
						// disabled={judgePermission(CUD_AC_SETTING).disabled}
						disabled={acConfigMode == 'insertLrpz' ? judgePermission(lrpzKmPermission).disabled : judgePermission(CUD_AC_SETTING).disabled}
						type={acConfigMode == 'insert' ? 'ghost' : 'primary'}
						onClick={() => debounce(() => {
								this.setState({acunitModify: false})
								onClickSave(tempAcItem, configState)
							})()
						}
						// onClick={() => {
						// 	if(tempAcItem.get('acunitOpen') == '1' && !tempAcItem.get('acunit')){
						// 		return message.warn('请输入计量单位');
						// 	}
						// 	dispatch(allActions.enterAcItemFetch(configState.get('tempAcItem'), configState.get('acConfigMode'), tabSelectedIndex))
						//
						// 	this.setState({acunitModify: false})
						// }}
						>
						保 存
					</Button>,
					<Button key="addNextAc" type="primary"
						// disabled={!configPermissionInfo.getIn(['edit', 'permission']) || (acConfigMode == 'insertLrpz' ? '' : acid.substr(acid.length - 2) == '99')}
						//管理权限修改  如果display为show就显示按钮
						disabled={judgePermission(CUD_AC_SETTING).disabled || (acConfigMode == 'insertLrpz' ? '' : acid.substr(acid.length - 2) == '99')}
						style={{display: acConfigMode == 'insert' ? 'inline-block' : 'none'}}
						onClick={() => {

							if(tempAcItem.get('acunitOpen') == '1' && !tempAcItem.get('acunit')){
								return message.warn('请输入计量单位');
							}

							const isChinese = /[\u4e00-\u9fa5]/g
							const isChineseSign = /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]/g
							// ： 。 ；  ， ： “ ”（ ） 、 ？ 《 》

							let acnameLimitLength = Limit.AC_CHINESE_NAME_LENGTH
							if (!isChinese.test(tempAcItem.get('acname')) && !isChineseSign.test(tempAcItem.get('acname'))) {
								acnameLimitLength = Limit.AC_NAME_LENGTH
							}

							if( tempAcItem.get('acname').length > acnameLimitLength){
								return message.warn(`科目名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；否则，长度不能超过${Limit.AC_NAME_LENGTH}位`)
							}

							let nextacid = Number(tempAcItem.get('acid')) + 1
							aclist.forEach(v => v.get('acid') == nextacid ? nextacid++ : nextacid)
							dispatch(allActions.enterAcItemFetch('acConfig', configState.get('tempAcItem'), configState.get('acConfigMode'), tabSelectedIndex, nextacid + ''))

							//this.setState({acunit: ''})
							this.setState({acunitModify: false})
						}}>
						保存并新增
					</Button>
				]}
			>

				<div className="pconfig-kmset">
					<div className="pconfig-kmset-item">
						<label>科目编码：</label>
						<Input
							placeholder="科目编码长度分别为4/6/8/10位数字"
							// disabled={disabled}
							disabled={acConfigMode == 'insertLrpz' ? false : disabled}
							// value={tempAcItem.get('acid')}
							// onChange={e => dispatch(configActions.changeAcCodeText(e.target.value, aclist))}
							// onChange={e => onChangeAcId(e)}
							value={acId}
							onChange={(e) => {
								const acid = e.target.value
								const len = acid.length
								const limit = tempAcItem.get('limitLength')
								const maxLength = limit || 10
								const minLength = limit == 4 ? 1 : limit - 2
								if (!/^\d*$/.test(acid) || (!len && limit) || len == 11)
									return
								if (limit) {
									return len > maxLength || len < minLength ? false : this.setState({acId: e.target.value})
								} else {
									this.setState({acId: e.target.value})
								}
							}}
							onBlur={e => onChangeAcId(e)}

						/>
					</div>
					<ul className="uses-tip">
						<li>科目编码支持最长四级，一级科目必须以1（资产）/2（负债）/3（权益）/4（成本）/5（损益）开头,科目编码长度分别为4/6/8/10位数字；</li>
					</ul>
					<div className="pconfig-kmset-item">
						<label>科目名称：</label>
						<Input
							placeholder={`包含中文最长${Limit.AC_CHINESE_NAME_LENGTH}个字符，否则最长${Limit.AC_NAME_LENGTH}个`}
							type="text"
							// value={tempAcItem.get('acname')}
							// onChange={e => dispatch(configActions.changeAcNameText(e.target.value))}
							// onChange={onChangeAcText}
							value={acName}
							onChange={(e) => this.setState({acName: e.target.value})}
							onBlur={onChangeAcText}
						/>
					</div>
					<div className="pconfig-kmset-item">
						<label>上级科目：</label>
						<Input
							type="text"
							value={tempAcItem.get('upperinfo')}
							disabled={true}
						/>
					</div>
					<div className="pconfig-kmset-item">
						<label>科目类别：</label>
						<Select
							className="pconfig-kmset-item-select"
							value={tempAcItem.get('category')}
							// onSelect={value => dispatch(configActions.changeCategoryText(value))}
							onSelect={value => onSelect(value)}
							disabled={disabledCategory}
							style={{width: 150}}
							>
							{/* {acTags.map(v => v.get('sub').map(n => <Option key={n} value={n}>{n}</Option>))} */}
							{acTags.filter((v, i) => i === tempAcItem.get('acid').substr(0, 1) - 1).map(v => v.get('sub').map(n => <Option key={n} value={n}>{n}</Option>))}
						</Select>
					</div>
					<ul className="uses-tip">
						<li>科目类别已根据国家小企业会计准则预置，不支持自定义类别；</li>
						<li>新增子科目时，子科目将自动继承上级科目的余额方向、类别；</li>
					</ul>
					<div className="pconfig-kmset-item">
						<label>余额方向：</label>
						<Switch
							className="use-unuse-style lend-bg"
							checked={tempAcItem.get('direction') == 'credit'}
							checkedChildren="贷"
							unCheckedChildren="借"
							// style={{width: 50}}
							style={{width: 43}}
							// onChange={() => disabled || dispatch(configActions.changeAcDirectionText())}
							onChange={onChangeSwitch}
						/>
					</div>
					{
						moduleInfo && moduleInfo.indexOf('NUMBER') > -1 ?
						<div className="pconfig-kmset-amount">
							<label>
								<Checkbox
									style={{marginRight:'10px'}}
									disabled={tempAcItem.get('upperAcunit') == '1' ? true : false}
									checked={tempAcItem.get('acunitOpen') == '1' ? true : false}
									onChange={changeAmountCheckbox}
									// onChange={()=>{
									// 	dispatch(configActions.changeAcAmountStateText(acConfigMode))
									// }}
								/>
									数量核算
							</label>
							<label>计算单位</label>
							{
								acConfigMode === 'insert' ||acConfigMode === 'insertLrpz' ?
								<Input
									className="pconfig-kmset-item-select"
									disabled={(tempAcItem.get('acunitOpen') == '1' ? false : true)}
									type="text"
									value={tempAcItem.get('acunitOpen') == '1' ? tempAcItem.get('acunit') : ''}
									onChange={e => {
										if(acConfigMode == 'insertLrpz'){
											return changeAmountInput(e)
										}
										this.setState({acunitModify: true})
										dispatch(configActions.changeAcconfigAcunit(e.target.value))
									}}
								/> :
								<Input//modify进来
									className="pconfig-kmset-item-select"
									disabled={tempAcItem.get('acunitOpen') == '1' ? (tempAcItem.get('acunit') ? !acunitModify : false) : true}
									type="text"
									value={tempAcItem.get('acunitOpen') == '1' ? tempAcItem.get('acunit') : ''}
									onChange={e => {
										this.setState({acunitModify: true})
										dispatch(configActions.changeAcconfigAcunit(e.target.value))
									}}
								/>
							}
							<Button
								type="ghost"
								disabled={tempAcItem.get('acunitOpen') == '1' ? false : true}
								style={{marginLeft: 10, display: (acConfigMode == 'insert'||acConfigMode === 'insertLrpz' || acunitModify || unitChanged) ? 'none' : ''}}
								onClick={() =>this.setState({reviseModal: true})}>
								修改单位
							</Button>
						</div>
					: '' }
					{
						moduleInfo && moduleInfo.indexOf('NUMBER') > -1 ?
						<ModifyUnitModal
							reviseModal={reviseModal}
							dispatch={dispatch}
							tempAcItem={tempAcItem}
							closeAcModal={() => this.setState({reviseModal: false})}
							oldAcunit={oldAcunit}
						/>
						: ''
					}
				</div>
			</Modal>
		)
	}
}
