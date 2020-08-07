import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Input, Select } from 'antd'
const Option = Select.Option
import { formatMoney } from 'app/utils'

@immutableRenderDecorator
export default
class XfnSelect extends React.Component {
	render() {
		const {
			value,
			onChange,
			searchContent,
			onSelect,
			selectId,
			onSearch
		} = this.props
		const children = this.props.children || []
		return (
			selectId?
			<div id={selectId}>
			<Select
				{...this.props}
				onSearch={value => {
					const dom = document.getElementById(selectId)
					if (value && dom.className.indexOf('warehouse-select-hide') === -1) {
						dom.className += ' warehouse-select-hide'
						// const target = dom.querySelector('.ant-select-selection-selected-value')
					} else if (!value) {
						dom.className = dom.className.replace(/warehouse-select-hide/g,'')
					}
					onSearch && onSearch(value)
				}}
				onChange={(value,option) => {
					const dom = document.getElementById(selectId)
					dom.className = dom.className.replace(/warehouse-select-hide/g,'')
					if (onChange) {
						onChange(option.props.ITEM_FOR_VALUE,option)
					}
				}}
				onSelect={(value,option) => {
					const dom = document.getElementById(selectId)
					dom.className = dom.className.replace(/warehouse-select-hide/g,'')
					if (onSelect) {
						onSelect(option.props.ITEM_FOR_VALUE,option)
					}
				}}
            >
				{
					this.props.children.map(v =>
					<Option
						{...v.props}
						value={v.props.children}
						ITEM_FOR_VALUE={v.props.value}
					>
						{v.props.children}
					</Option>
				)}
            </Select>
			</div>
			:
			<Select
				{...this.props}
				onSearch={value => {
					if (selectId) {
						const dom = document.getElementById(selectId)
						if (value && dom.className.indexOf('warehouse-select-hide') === -1) {
							dom.className += ' warehouse-select-hide'
							// const target = dom.querySelector('.ant-select-selection-selected-value')
						} else if (!value) {
							dom.className = dom.className.replace(/warehouse-select-hide/g,'')
						}
					}
					onSearch && onSearch(value)
				}}
				onChange={(value,option) => {
					if (selectId) {
						const dom = document.getElementById(selectId)
						dom.className = dom.className.replace(/warehouse-select-hide/g,'')
					}
					if (onChange) {
						onChange(option.props.ITEM_FOR_VALUE,option)
					}
				}}
				onSelect={(value,option) => {
					if (selectId) {
						const dom = document.getElementById(selectId)
						dom.className = dom.className.replace(/warehouse-select-hide/g,'')
					}
					if (onSelect) {
						onSelect(option.props.ITEM_FOR_VALUE,option)
					}
				}}
            >
				{
					this.props.children.map((v,i) =>
					<Option
						key={i}
						{...v.props}
						value={v.props.children}
						ITEM_FOR_VALUE={v.props.value}
					>
						{v.props.children}
					</Option>
				)}
            </Select>
		)
	}
}
