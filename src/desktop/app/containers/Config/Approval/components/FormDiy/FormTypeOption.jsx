import React from 'react'
import { fromJS } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { formDiyList, componentName } from '../common'
import { Input, Checkbox, Radio, Icon, message } from 'antd'


const ComponentSelectInput = ({ jrComponentType, selectValueList, onChange, addOption, deleteOption, canModify }) => {

	if (jrComponentType) {
		return (
			<div>
				<div className="approval-form-input-wrap">
					<span className="approval-form-input-tip">选项：</span>
					<span className="approval-form-input">系统设置</span>
				</div>
			</div>
		)
	} else {
		return (
			<div>
				{
					selectValueList && selectValueList.map((v, i) => {
						const name = (jrComponentType === Limit.LSLB_COMPONENT_TYPE || jrComponentType === Limit.ZH_COMPONENT_TYPE) ? v.split(Limit.APPROVAL_JOIN_STR)[1] : v
						return (
							<div className="approval-form-input-wrap" key={i}>
								<span className="approval-form-input-tip">{i === 0 ? '选项：' : ''}</span>
								<span className="approval-form-input">
									<Input
										disabled={!canModify}
										value={name}
										onChange={e => onChange(i, e.target.value)}
										placeholder='最多50字'
									/>
								</span>
								<Icon
									type="minus-circle"
									className="approval-form-input-add-icon"
									onClick={() => {
										if (selectValueList.size > 1 && canModify) {
											deleteOption(i)
										}
									}}
								/>
								<Icon
									type="plus-circle"
									className="approval-form-input-delete-icon"
									onClick={() => {
										if (selectValueList.size < 200 && canModify) {
											addOption(i+1)
										}
									}}
								/>
							</div>
						)
					})
				}
			</div>	
		)
	}
}

const TopTip = ({ type, jrComponentType }) => {

	if (type === 'common') {
		return (
			<div className="approval-form-modify-tip">
				<p>
					<span style={{color: '#cc0000'}}>*</span><span>流水必填字段，不可删除</span>
				</p>
			</div>
		)
	} else {
		const confName = {
			'FYXZ': '费用性质',
			'XM': '项目',
			'WLDW': '往来单位',
			'LSLB': '关联流水类别',
			'ZY': '摘要'
		}
		return (
			<div className="approval-form-modify-tip">
				<p>
					<span style={{color: '#cc0000'}}>*</span><span>系统字段，不可删除</span>
				</p>
				<p>可在“基础设置”{confName[jrComponentType] ? `-“${confName[jrComponentType]}”` : ''}中关闭</p>
			</div>
		)
	}
}

const ComponentType = ({ type }) => {
	return (
		<div className="approval-form-input-wrap">
			<span className="approval-form-input-tip">组件类型：</span>
			<span className="approval-form-input">
				{componentName[type]}
			</span>
		</div>
	)
}

const ComponentName = ({ name, onChange, tip }) => {
	return (
		<div className="approval-form-input-wrap">
			<span className="approval-form-input-tip">{tip ? tip : '标题：'}</span>
			<span className="approval-form-input">
				<Input
					disabled={false}
					value={name}
					onChange={onChange}
					placeholder='最多20字'
				/>
			</span>
		</div>
	)
}

const ComponentLabel = ({ tip, label, onChange, placeholder }) => {
	return (
		<div className="approval-form-input-wrap">
			<span className="approval-form-input-tip">{tip}</span>
			<span className="approval-form-input">
				<Input
					disabled={false}
					value={label}
					onChange={onChange}
					placeholder={placeholder ? placeholder : '最多50字'}
				/>
			</span>
		</div>
	)
}

const ComponentCheckbox = ({ tip, checked, onClick, text, subText, canModify }) => {
	return (
		<div className="approval-form-input-wrap">
			<span className="approval-form-input-tip">{tip}</span>
			<span className="approval-form-input">
				<span onClick={() => {
					if (canModify === false) {
						message.info('不可修改')
					} else {
						onClick()
					}
				}}><Checkbox disabled={canModify===false} checked={checked}></Checkbox> {text}<span>{subText ? `(${subText})` : ''}</span></span>
			</span>
		</div>
	)
}



@immutableRenderDecorator
export class TextField extends React.Component {

	render() {

		const { changeOptionString, currentSetting, page } = this.props

		const canModify = currentSetting.get('canModify')
		const canDelete = currentSetting.get('canDelete')

		return (
			<div className="approval-form-config-wrap">
				{
					currentSetting.get('jrComponentType') ?
					<TopTip jrComponentType={currentSetting.get('jrComponentType')} />
					: null
				}
				<ComponentType type='TextField' />
				<ComponentName
					name={currentSetting.get('label')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'label', e.target.value)}}
				/>
				<ComponentLabel
					tip={'提示文字：'}
					label={currentSetting.get('placeHolder')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'placeHolder', e.target.value)}}
				/>
				<ComponentCheckbox
					tip={''}
					canModify={canModify}
					checked={currentSetting.get('required')}
					onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'required', !currentSetting.get('required'))}} text='必填'
				/>
				<div className="approval-form-break"></div>
				{
					page === 'MX' ? null :
					<ComponentCheckbox
						tip={'打印：'}
						checked={currentSetting.get('print')}
						onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'print', !currentSetting.get('print'))}} text='参与打印' subText={'如不勾选，打印时不显示该项'}
					/>
				}
			</div>
		)
	}
}

export class TextareaField extends React.Component {

	render() {

		const { changeOptionString, currentSetting, page } = this.props

		const canModify = currentSetting.get('canModify')

		return (
			<div className="approval-form-config-wrap">
				<ComponentType type='TextareaField' />
				<ComponentName
					name={currentSetting.get('label')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'label', e.target.value)}}
				/>
				<ComponentLabel
					tip={'提示文字：'}
					label={currentSetting.get('placeHolder')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'placeHolder', e.target.value)}}
				/>
				<ComponentCheckbox
					tip={''}
					canModify={canModify}
					checked={currentSetting.get('required')}
					onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'required', !currentSetting.get('required'))}} text='必填'
				/>
				<div className="approval-form-break"></div>
				{
					page === 'MX' ? null :
					<ComponentCheckbox
						tip={'打印：'}
						checked={currentSetting.get('print')}
						onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'print', !currentSetting.get('print'))}} text='参与打印' subText={'如不勾选，打印时不显示该项'}
					/>
				}
			</div>
		)
	}
}

export class TableField extends React.Component {

	render() {

		const { changeOptionString, currentSetting, page } = this.props

		const canModify = currentSetting.get('canModify')
		const canDelete = currentSetting.get('canDelete')

		return (
			<div className="approval-form-config-wrap">
				{
					canDelete ? null :
					<TopTip type='common' />
				}
				<ComponentType type='TableField' />
				<ComponentName
					name={currentSetting.get('label')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'label', e.target.value)}}
				/>
				<ComponentLabel
					tip={'动作名称：'}
					label={currentSetting.get('placeHolder')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'placeHolder', e.target.value)}}
				/>
				<ComponentCheckbox
					tip={''}
					canModify={canModify}
					checked={currentSetting.get('required')}
					onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'required', !currentSetting.get('required'))}} text='必填'
				/>
				<div className="approval-form-break"></div>
				<ComponentCheckbox
					tip={'额外信息：'}
					checked={currentSetting.get('extraInfo')}
					onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'extraInfo', !currentSetting.get('extraInfo'))}} text='显示额外信息'
				/>
				{
				// <div className="approval-form-input-wrap">
				// 	<span className="approval-form-input-tip">打印格式：</span>
				// 	<span className="approval-form-input-tip">
				// 		<Radio.Group
				// 			// onChange={(e) => dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('use', e.target.value))}
				// 			value={'HX'}
				// 		>
				// 			<Radio value={'HX'} key="1">横向打印</Radio>
				// 			<Radio value={'ZX'} key="2">纵向打印</Radio>
				// 		</Radio.Group>
				// 	</span>
				// </div>
				}
			</div>
		)
	}
}

export class MoneyField extends React.Component {

	render() {

		const { changeOptionString, currentSetting, page } = this.props

		const canModify = currentSetting.get('canModify')
		const canDelete = currentSetting.get('canDelete')

		return (
			<div className="approval-form-config-wrap">
				{
					canDelete ? null :
					<TopTip type='common' />
				}
				<ComponentType type='MoneyField' />
				<ComponentName
					name={currentSetting.get('label')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'label', e.target.value)}}
				/>
				<ComponentLabel
					tip={'提示文字：'}
					label={currentSetting.get('placeHolder')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'placeHolder', e.target.value)}}
				/>
				<ComponentCheckbox
					tip={''}
					canModify={canModify}
					checked={currentSetting.get('required')}
					onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'required', !currentSetting.get('required'))}} text='必填'
				/>
				<div className="approval-form-break"></div>
				<ComponentCheckbox
					tip={'大写：'}
					checked={currentSetting.get('upper')}
					onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'upper', !currentSetting.get('upper'))}} text='显示大写'
				/>
				{
					page === 'MX' ? null :
					<ComponentCheckbox
						tip={'打印：'}
						checked={currentSetting.get('print')}
						onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'print', !currentSetting.get('print'))}} text='参与打印' subText={'如不勾选，打印时不显示该项'}
					/>
				}
			</div>
		)
	}
}

export class NumberField extends React.Component {

	render() {

		const { changeOptionString, currentSetting, page } = this.props

		const canModify = currentSetting.get('canModify')

		// "componentId":"NumberField-ZJ00C292",
        // "componentType":"NumberField",
        // "label":"数字输入框",
        // "placeHolder":"请输入数字",
        // "required":false,
        // "print":true,
        // "orderValue":3,
        // "canDelete":false,
        // "canModify":false,
        // "unit":""

		return (
			<div className="approval-form-config-wrap">
				<ComponentType type='NumberField' />
				<ComponentName
					name={currentSetting.get('label')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'label', e.target.value)}}
				/>
				<ComponentLabel
					tip={'提示文字：'}
					label={currentSetting.get('placeHolder')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'placeHolder', e.target.value)}}
				/>
				<ComponentLabel
					tip={'单位：'}
					label={currentSetting.get('unit')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'unit', e.target.value)}}
					placeholder={'最多20字'}
				/>
				<ComponentCheckbox
					tip={''}
					canModify={canModify}
					checked={currentSetting.get('required')}
					onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'required', !currentSetting.get('required'))}} text='必填'
				/>
				<div className="approval-form-break"></div>
				{
					page === 'MX' ? null :				
					<ComponentCheckbox
						tip={'打印：'}
						checked={currentSetting.get('print')}
						onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'print', !currentSetting.get('print'))}} text='参与打印' subText={'如不勾选，打印时不显示该项'}
					/>
				}
			</div>
		)
	}
}

export class DDDateField extends React.Component {

	render() {

		const { changeOptionString, currentSetting, page } = this.props

		const canModify = currentSetting.get('canModify')
		const canDelete = currentSetting.get('canDelete')

		// "componentId":"DDDateField-ZJ6A1E0B",
        // "componentType":"DDDateField",
        // "label":"日期",
        // "placeHolder":"请选择",
        // "required":false,
        // "print":true,
        // "orderValue":7,
        // "canDelete":false,
        // "canModify":false,
        // "jrComponentType":"",
        // "unit":"小时",
        // "dateFormat":"yyyy-MM-dd hh:mm"

		return (
			<div className="approval-form-config-wrap">
				{
					canDelete ? null :
					<TopTip type='common' />
				}
				<ComponentType type='DDDateField' />
				<ComponentName
					name={currentSetting.get('label')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'label', e.target.value)}}
				/>
				<ComponentCheckbox
					tip={''}
					canModify={canModify}
					checked={currentSetting.get('required')}
					onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'required', !currentSetting.get('required'))}} text='必填'
				/>
				<div className="approval-form-break"></div>
				<div className="approval-form-input-wrap">
					<span className="approval-form-input-tip">日期类型：</span>
					<span className="approval-form-input">
						<Radio.Group
							onChange={(e) => {
								changeOptionString(currentSetting.get('orderValue'), 'dateFormat', e.target.value)
								changeOptionString(currentSetting.get('orderValue'), 'unit', e.target.value === 'yyyy-MM-dd' ? '天' : '小时')
							}}
							value={currentSetting.get('dateFormat')}
						>
							<Radio value={'yyyy-MM-dd'} key="2">年-月-日</Radio>
							<Radio value={'yyyy-MM-dd hh:mm'} key="1">年-月-日时：分</Radio>
						</Radio.Group>
					</span>
				</div>
				{
					page === 'MX' ? null :
					<ComponentCheckbox
						tip={'打印：'}
						page={page}
						checked={currentSetting.get('print')}
						onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'print', !currentSetting.get('print'))}} text='参与打印' subText={'如不勾选，打印时不显示该项'}
					/>
				}
			</div>
		)
	}
}


export class DDDateRangeField extends React.Component {

	render() {

		const { changeOptionString, currentSetting, page } = this.props

		const canModify = currentSetting.get('canModify')

		// "componentId":"DDDateRangeField-ZJC5DC4E",
        // "componentType":"DDDateRangeField",
        // "label":"",
        // "placeHolder":"请选择",
        // "required":false,
        // "print":true,
        // "orderValue":8,
        // "canDelete":false,
        // "canModify":false,
        // "dateRangeLabelFirst":"开始时间",
        // "dateRangeLabelLast":"结束时间",
        // "unit":"小时",
        // "dateFormat":"yyyy-MM-dd hh:mm"

		return (
			<div className="approval-form-config-wrap">
				<ComponentType type='DDDateRangeField' />
				<ComponentName
					tip={'标题1：'}
					name={currentSetting.get('dateRangeLabelFirst')}
					onChange={(e) => {
						changeOptionString(currentSetting.get('orderValue'), 'dateRangeLabelFirst', e.target.value)
						changeOptionString(currentSetting.get('orderValue'), 'label', e.target.value + '/' + currentSetting.get('dateRangeLabelLast'))
					}}
				/>
				<ComponentName
					tip={'标题2：'}
					name={currentSetting.get('dateRangeLabelLast')}
					onChange={(e) => {
						changeOptionString(currentSetting.get('orderValue'), 'dateRangeLabelLast', e.target.value)
						changeOptionString(currentSetting.get('orderValue'), 'label', currentSetting.get('dateRangeLabelFirst') + '/' + e.target.value)
					}}
				/>
				<ComponentLabel
					tip={'提示文字：'}
					label={currentSetting.get('placeHolder')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'placeHolder', e.target.value)}}
				/>
				<div className="approval-form-input-wrap">
					<span className="approval-form-input-tip">日期类型：</span>
					<span className="approval-form-input">
						<Radio.Group
							onChange={(e) => {
								changeOptionString(currentSetting.get('orderValue'), 'dateFormat', e.target.value)
								changeOptionString(currentSetting.get('orderValue'), 'unit', e.target.value === 'yyyy-MM-dd' ? '天' : '小时')
							}}
							value={currentSetting.get('dateFormat')}
						>
							<Radio value={'yyyy-MM-dd'} key="2">年-月-日</Radio>
							<Radio value={'yyyy-MM-dd hh:mm'} key="1">年-月-日时：分</Radio>
						</Radio.Group>
					</span>
				</div>
				<ComponentCheckbox
					tip={''}
					canModify={canModify}
					checked={currentSetting.get('required')}
					onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'required', !currentSetting.get('required'))}} text='必填'
				/>
				<div className="approval-form-break"></div>			
				{
					// <ComponentCheckbox
					// 	tip={''}
					// 	canModify={canModify}
					// 	// checked={currentSetting.get('required')}
					// 	checked={false}
					// 	onClick={() => {}} text='自动计算时长'
					// />
				}
				{
					page === 'MX' ? null :
					<ComponentCheckbox
						tip={'打印：'}
						checked={currentSetting.get('print')}
						onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'print', !currentSetting.get('print'))}} text='参与打印' subText={'如不勾选，打印时不显示该项'}
					/>
				}
			</div>
		)
	}
}

export class DDSelectField extends React.Component {

	render() {

		const { changeOptionString, currentSetting, page } = this.props

		const selectValueList = currentSetting.get('selectValueList')
		const canModify = currentSetting.get('canModify')
		const jrComponentType = currentSetting.get('jrComponentType')

		return (
			<div className="approval-form-config-wrap">
				{
					currentSetting.get('jrComponentType') ?
					<TopTip jrComponentType={currentSetting.get('jrComponentType')} />
					: null
				}
				<ComponentType type='DDSelectField' />
				<ComponentName
					name={currentSetting.get('label')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'label', e.target.value)}}
				/>
				<ComponentLabel
					tip={'提示文字：'}
					label={currentSetting.get('placeHolder')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'placeHolder', e.target.value)}}
				/>
				<ComponentSelectInput
					jrComponentType={jrComponentType}
					selectValueList={selectValueList}
					canModify={canModify}
					onChange={(index, value) => {
						const newSelectValueList = selectValueList.set(index, value)
						changeOptionString(currentSetting.get('orderValue'), 'selectValueList', newSelectValueList)
					}}
					addOption={(index) => {
						const newSelectValueList = selectValueList.insert(index, '')
						changeOptionString(currentSetting.get('orderValue'), 'selectValueList', newSelectValueList)
					}}
					deleteOption={(index) => {
						const newSelectValueList = selectValueList.delete(index)
						changeOptionString(currentSetting.get('orderValue'), 'selectValueList', newSelectValueList)
					}}
				/>
				<ComponentCheckbox
					tip={''}
					checked={currentSetting.get('required')}
					canModify={canModify}
					onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'required', !currentSetting.get('required'))}} text='必填'
				/>
				<div className="approval-form-break"></div>
				{
					page === 'MX' ? null :
					<ComponentCheckbox
						tip={'打印：'}
						checked={currentSetting.get('print')}
						onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'print', !currentSetting.get('print'))}} text='参与打印' subText={'如不勾选，打印时不显示该项'}
					/>
				}
			</div>
		)
	}
}

export class DDMultiSelectField extends React.Component {

	render() {

		const { changeOptionString, currentSetting, page } = this.props

		const selectValueList = currentSetting.get('selectValueList')
		const canModify = currentSetting.get('canModify')


		// "componentId":"DDMultiSelectField-ZJFC8D72",
        // "componentType":"DDMultiSelectField",
        // "label":"多选框",
        // "placeHolder":"请选择",
        // "required":false,
        // "print":true,
        // "orderValue":6,
        // "canDelete":false,
        // "canModify":false,
        // "options":true,
		// "selectValueList":['', '', '']
		
		return (
			<div className="approval-form-config-wrap">
				<ComponentType type='DDMultiSelectField' />
				<ComponentName
					name={currentSetting.get('label')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'label', e.target.value)}}
				/>
				<ComponentLabel
					tip={'提示文字：'}
					label={currentSetting.get('placeHolder')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'placeHolder', e.target.value)}}
				/>
				<ComponentSelectInput
					selectValueList={selectValueList}
					canModify={canModify}
					onChange={(index, value) => {
						const newSelectValueList = selectValueList.set(index, value)
						changeOptionString(currentSetting.get('orderValue'), 'selectValueList', newSelectValueList)
					}}
					addOption={(index) => {
						const newSelectValueList = selectValueList.insert(index, '')
						changeOptionString(currentSetting.get('orderValue'), 'selectValueList', newSelectValueList)
					}}
					deleteOption={(index) => {
						const newSelectValueList = selectValueList.delete(index)
						changeOptionString(currentSetting.get('orderValue'), 'selectValueList', newSelectValueList)
					}}
				/>

				<ComponentCheckbox
					tip={''}
					checked={currentSetting.get('required')}
					canModify={canModify}
					onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'required', !currentSetting.get('required'))}} text='必填'
				/>
				<div className="approval-form-break"></div>
				{
					page === 'MX' ? null :
					<ComponentCheckbox
						tip={'打印：'}
						checked={currentSetting.get('print')}
						onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'print', !currentSetting.get('print'))}} text='参与打印' subText={'如不勾选，打印时不显示该项'}
					/>
				}
			</div>
		)
	}
}

export class InnerContactField extends React.Component {

	render() {

		const { changeOptionString, currentSetting, page } = this.props

		const canModify = currentSetting.get('canModify')

		return (
			<div className="approval-form-config-wrap">
				<ComponentType type='InnerContactField' />
				<ComponentName
					name={currentSetting.get('label')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'label', e.target.value)}}
				/>
				<ComponentLabel
					tip={'提示文字：'}
					label={currentSetting.get('placeHolder')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'placeHolder', e.target.value)}}
				/>
				<ComponentCheckbox
					tip={''}
					canModify={canModify}
					checked={currentSetting.get('required')}
					onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'required', !currentSetting.get('required'))}} text='必填'
				/>
				<div className="approval-form-break"></div>
				<div className="approval-form-input-wrap">
					<span className="approval-form-input-tip">选项：</span>
					<span className="approval-form-input-tip">
						<Radio.Group
							onChange={(e) => {
								changeOptionString(currentSetting.get('orderValue'), 'choice', e.target.value === 'MUTI' ? true : false)
							}}
							value={currentSetting.get('choice') ? 'MUTI' : 'ONE'}
						>
							<Radio value={'ONE'} key="1">只能选一人</Radio>
							<Radio value={'MUTI'} key="2">可同时选多人</Radio>
						</Radio.Group>
					</span>
				</div>
				{
					page === 'MX' ? null :				
					<ComponentCheckbox
						tip={'打印：'}
						checked={currentSetting.get('print')}
						onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'print', !currentSetting.get('print'))}} text='参与打印' subText={'如不勾选，打印时不显示该项'}
					/>
				}
			</div>
		)
	}
}

export class DDPhotoField extends React.Component {

	render() {

		const { changeOptionString, currentSetting, page } = this.props

		const canModify = currentSetting.get('canModify')

		return (
			<div className="approval-form-config-wrap">
				<ComponentType type='DDPhotoField' />
				<ComponentName
					name={currentSetting.get('label')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'label', e.target.value)}}
				/>
				<span className="approval-form-sub-tip">图片最多可添加9张</span>
				<ComponentCheckbox
					tip={''}
					canModify={canModify}
					checked={currentSetting.get('required')}
					onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'required', !currentSetting.get('required'))}}
					text='必填'
				/>
				<div className="approval-form-break"></div>	
				{
					page === 'MX' ? null :		
					<ComponentCheckbox
						tip={'打印：'}
						checked={currentSetting.get('print')}
						onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'print', !currentSetting.get('print'))}}
						text='参与打印' subText={'如不勾选，打印时不显示该项'}
					/>
				}
				{
					// <ComponentCheckbox
					// 	tip={'水印照片：'}
					// 	checked={false}
					// 	onClick={() => {}}
					// 	text='开启后图片只能通过手机拍照方式'
					// />
				}
			</div>
		)
	}
}

export class DDAttachment extends React.Component {

	render() {

		const { changeOptionString, currentSetting, page } = this.props

		const canModify = currentSetting.get('canModify')

		return (
			<div className="approval-form-config-wrap">
				<ComponentType type='DDAttachment' />
				<ComponentName
					name={currentSetting.get('label')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'label', e.target.value)}}
				/>
				<ComponentCheckbox
					tip={''}
					canModify={canModify}
					checked={currentSetting.get('required')}
					onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'required', !currentSetting.get('required'))}}
					text='必填'
				/>
				<div className="approval-form-break"></div>
				{
					page === 'MX' ? null :
					<ComponentCheckbox
						tip={'打印：'}
						checked={currentSetting.get('print')}
						onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'print', !currentSetting.get('print'))}}
						text='参与打印' subText={'如不勾选，打印时不显示该项'}
					/>
				}		
			</div>
		)
	}
}

export class RelateField extends React.Component {

	render() {

		const { changeOptionString, currentSetting, page } = this.props

		const canModify = currentSetting.get('canModify')

		return (
			<div className="approval-form-config-wrap">
				<ComponentType type='RelateField' />
				<ComponentName
					name={currentSetting.get('label')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'label', e.target.value)}}
				/>
				<ComponentLabel
					tip={'提示文字：'}
					label={currentSetting.get('placeHolder')}
					onChange={(e) => {changeOptionString(currentSetting.get('orderValue'), 'placeHolder', e.target.value)}}
				/>
				<ComponentCheckbox
					tip={''}
					canModify={canModify}
					checked={currentSetting.get('required')}
					onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'required', !currentSetting.get('required'))}}
					text='必填'
				/>
				<div className="approval-form-break"></div>
				{
					// page === 'MX' ? null :
					// <ComponentCheckbox
					// 	tip={'打印：'}
					// 	checked={currentSetting.get('print')}
					// 	onClick={() => {changeOptionString(currentSetting.get('orderValue'), 'print', !currentSetting.get('print'))}}
					// 	text='参与打印' subText={'如不勾选，打印时不显示该项'}
					// />
				}		
			</div>
		)
	}
}

export class Nothing extends React.Component {

	render() {

		return (
			<div>
				请选择设置的组件
			</div>
		)
	}
}

