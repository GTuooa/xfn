import React from 'react'
import * as Limit from 'app/constants/Limit'
import { toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Select } from 'antd'
const { Option } = Select

@immutableRenderDecorator
export default class SelectType extends React.Component{

	static displayName = 'RunningConfSelectType'

	render() {
		const { className, treeData, value, placeholder, onChange, parentDisabled, disabled } = this.props
		return (
			<Select
				disabled={disabled}
                placeholder={placeholder}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                value={[value]}
                onChange={onChange}
				onClick={(e) => {
					e.stopPropagation()
				}}
            >
				{
					treeData.toJS().map((item,i) =>
						<Option
							value={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.type}`}
							key={`${item.uuid}${i}`}
							modifyJudge={item.modifyJudge}
						>
							{item.name}
						</Option>
					)
				}
            </Select>
		)
	}
}
