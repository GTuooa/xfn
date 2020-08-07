import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS } from 'immutable'

import * as Limit from 'app/constants/Limit'
import { TreeSelect } from 'antd'
const TreeNode = TreeSelect.TreeNode

@immutableRenderDecorator
export default
class StockTree extends React.Component{
    render(){
        const {className,quantityList,onChange,value}=this.props
        const loop = (data, upperIndex) => data.map((item, i) => {
            return <TreeNode
                title={item.name}
                value={item.quantity}
                key={item.quantity}
            />
        })
        return(
            <TreeSelect
                className={className}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                onChange={onChange}
                value={value}
            >

                {quantityList.length && loop(quantityList, 0 )}
            </TreeSelect>
        )
    }
}
