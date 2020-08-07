import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Input, Select, Modal, Button } from 'antd'
import * as Limit from 'app/constants/Limit.js'
const Option = Select.Option

@immutableRenderDecorator
export default
class AcouontAcSelect extends React.Component {
	constructor() {
		super()
		this.state = {show: false}
	}

	render() {
		const { acId, acName, assCategoryList, debitAssList, lrAclist, onChange, className, tipText, disabled } = this.props
		const { show } = this.state

		return (
			<Select
				className={className ? className : ''}
				showSearch
				disabled={disabled}
				optionFilterProp={"children"}
				notFoundContent="无法找到相应科目"
				searchPlaceholder={tipText}
				value={acId && `${acId}_${acName}${assCategoryList && assCategoryList.size ? '(已关联' + assCategoryList.join('/') + ')' : ''}`}
				onChange={value => value || onChange(value)}
				onSelect={onChange}
				onFocus={() => this.setState({show: true})}
				onBlur={() => this.setState({show: false})}
				>
				{lrAclist.map((v, i) =>
					<Option key={i} value={`${v.get('acid')}${Limit.TREE_JOIN_STR}${v.get('acname')}`}>
						{`${v.get('acid')} ${v.get('acfullname')}`}
					</Option>
				)}
			</Select>

		)
	}
}
