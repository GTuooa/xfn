import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as Limit from 'app/constants/Limit'

import { Select } from 'antd'
const Option = Select.Option
import { toJS } from 'immutable'

@immutableRenderDecorator
export default
class ZjtxCategorySelect extends React.Component{
	render() {
		const { className, treeData, value, placeholder, onChange, parentDisabled, disabled } = this.props
		let list = []
        const loop = (data, upperIndex) => data.map((item, i) => {

            if (item.childList && item.childList.length) {
                    {loop(item.childList, upperIndex + '_' + i)}
            }else if (item.level != 1 || item.beSpecial) {
				list.push(
					<Option
					// disabled={!item.acAvailable}
					disabled={(!item.acAvailable && (name!='内部转账' && upperIndex!=0)) || item.name =='长期资产' || item.level === 1 && !item.beSpecial }
					value={`${item.name}${Limit.TREE_JOIN_STR}${item.propertyCostList.join('+')}${Limit.TREE_JOIN_STR}${item.projectRange.join('+')}${Limit.TREE_JOIN_STR}${item.uuid}${Limit.TREE_JOIN_STR}${item.beProject}`}
					key={item.uuid}
					>
						{item.name}
					</Option>
				)
			}
        })
		loop( treeData.getIn([0, 'childList']).toJS(), 0 )
		return (
			<Select
				combobox
				showSearch
				disabled={disabled}
                placeholder={placeholder}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                value={[value]}
                onChange={onChange}
                >
                {list}
            </Select>
		)
	}
}
