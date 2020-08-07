import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS } from 'immutable'

import * as Limit from 'app/constants/Limit'
import { TreeSelect } from 'antd'
const TreeNode = TreeSelect.TreeNode

@immutableRenderDecorator
export default
class StockQuantityTree extends React.Component{
    render(){
        const {className,categoryList,onChange,value} = this.props
        const loop = (data, upperUuid) => data.map((item, i) => {

            if (item.childList && item.childList.length) {

                return <TreeNode
					title={item.name}
					value={`${upperUuid}-${item.uuid}`}
					key={item.uuid}
					>
                    {loop(item.childList, `${upperUuid}-${item.uuid}`)}
                </TreeNode>
            }

            return <TreeNode
                title={item.name}
                value={`${upperUuid}-${item.uuid}`}
                key={item.uuid}
            />
        })
        return(
            <TreeSelect
                className={className}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                value={value}
                onChange={onChange}
            >
                <TreeNode
                    title={'全部'}
                    value={'全部'}
                    key={''}
                />
                {loop( categoryList, '' )}
            </TreeSelect>
        )
    }
}
