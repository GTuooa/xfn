import React from 'react'
import PropTypes from 'prop-types'
import { toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../components/common.less'
import * as Limit from 'app/constants/Limit.js'

import { jxcConfigCheck } from 'app/utils'
import placeholderText from 'app/containers/Config/placehoderText'
import { UpperClassSelect, SelectAc, NumberInput } from 'app/components'
import { Switch, Input, Select, Checkbox, Button, Modal, message, Radio, Icon } from 'antd'
const { Option, OptGroup } = Select
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group;

import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'

export default
class XfnSelect extends React.Component {
	state={
		addUnit:false,
		name:'',
		uuid:'',
		isStandard:false
	}
	render() {
		const {
			dispatch,
			// type,  // 录入流水用
			// inventoryConfState,
			selectListOne,
			selectListTwo,
			onChange,
			name,
			onSwitch,
			style,
			disabled,
			addUnitdisabled

		} = this.props
		const { addUnit, value } = this.state
		return (
				!addUnit || addUnitdisabled?
				<Select
					disabled={disabled}
					style={style}
					value={name || ''}
					placeholder='请选择'
					dropdownRender={menu => (
						<div>
							{menu}
							{
								!addUnitdisabled?
								<div
									onMouseDown={e => e.preventDefault()}
									style={{ padding: '8px', cursor: 'pointer'}}
									onClick={() => {
										this.setState({addUnit:true})
										dispatch(editInventoryCardActions.changeInventoryCardContent('unit',fromJS({})))
									}}>
									<Icon type="plus" /> 新增单位
								</div>:''
							}
						</div>
					)}
					onChange={(value,option) => {
						const valueList = value.split(Limit.TREE_JOIN_STR)
						const uuid = valueList[0]
						const name = valueList[1]
						const isStandard = valueList[2]
						const unitList = valueList[3]
						const basicUnitUuid = valueList[4]
						const unitQuantity = valueList[5]
						onChange({uuid, name, isStandard,unitList,basicUnitUuid,unitQuantity},option)
					}}

				>
					{
						selectListTwo.size?
						<OptGroup label="自定义单位">
							{
								selectListTwo.map(v =>
									<Option key={v.get('uuid')}
										value={
										`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('isStandard')}${Limit.TREE_JOIN_STR}${JSON.stringify(v.get('unitList').toJS())}`
										}
										basicStandardUnitQuantityList={[v.get('basicStandardUnitQuantity'),...v.get('unitList').toJS().map(v => v.basicStandardUnitQuantity)]}
										basicStandardUnitUuidList={[v.get('basicStandardUnitUuid'),...v.get('unitList').toJS().map(v => v.basicStandardUnitUuid)]}
										isCustom={true}
									>
										{v.get('fullName')}
									</Option>
								)
							}
						</OptGroup>:''
					}
					<OptGroup label="标准单位">
						{
							selectListOne.map(v =>
								<Option
									key={v.get('uuid')}
									value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('isStandard')}${Limit.TREE_JOIN_STR}${''}${Limit.TREE_JOIN_STR}${v.get('basicUnitUuid')}${Limit.TREE_JOIN_STR}${v.get('basicUnitQuantity')}`}

								>
									{v.get('name')}
								</Option>
							)
						}
					</OptGroup>
				</Select>
				:
				<div className='inventory-xfn-input'>
					<Input
						disabled={disabled}
						placeholder='输入单位'
						value={name || ''}
						onChange={(e) => {
							const isStandard = false
							onChange({uuid:'',name:e.target.value,isStandard},{props:{}})
						}}
					/>
					{
						!disabled?
						<span>
							<Icon type='close' style={{cursor:'pointer'}} onClick={() => {
								this.setState({addUnit:false})
								onSwitch()
							}}/>
						</span>:''
					}

				</div>
		)
	}
}
