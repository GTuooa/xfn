import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS } from 'immutable'

import * as Limit from 'app/constants/Limit'
import { TreeSelect } from 'antd'
const TreeNode = TreeSelect.TreeNode
@immutableRenderDecorator
export default
class CategorySelect extends React.Component{
    render(){
        const { categoryList, onChange, className,value } = this.props

        const loop = (data, upperUuid) => data.map((item, i) => {

            if (item.childList && item.childList.length) {

                return <TreeNode
					title={item.name}
					value={`${upperUuid}-${item.uuid}`}
					key={item.uuid}
					// disabled={parentDisabled}
					>
                    {loop(item.childList,`${upperUuid}-${item.uuid}`)}
                </TreeNode>
            }

            return <TreeNode
                title={item.name}
                value={`${upperUuid}-${item.uuid}`}
                key={item.uuid}
            />
        })

		return (
            <TreeSelect
                className={className}
				value={value}
				notFoundContent="无法找到相应科目"
				// disabled={disabled}
                // placeholder={placeholder}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                dropdownMatchSelectWidth={155}
                onChange={onChange}
            >
				<TreeNode
					title={'全部'}
					value={'全部'}
					key={'全部'}
				/>
                {loop( categoryList, '')}
            </TreeSelect>
        )
    }
}
