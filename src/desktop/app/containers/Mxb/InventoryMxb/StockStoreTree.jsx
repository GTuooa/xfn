import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS } from 'immutable'

import * as Limit from 'app/constants/Limit'
import { TreeSelect } from 'antd'
const TreeNode = TreeSelect.TreeNode

@immutableRenderDecorator
export default
class StockStoreTree extends React.Component{
    render(){
        const {className,stockStoreList,onChange,value}=this.props
        const loop = (data, upperIndex) => data.map((item, i) => {

            if (item.childList && item.childList.length) {

                return <TreeNode
					title={item.name}
					value={item.uuid}
					key={item.uuid}
					>
                    {loop(item.childList, upperIndex + '_' + i)}
                </TreeNode>
            }

            return <TreeNode
                title={item.name}
                value={item.uuid}
                key={item.uuid}
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
                <TreeNode
                    title={stockStoreList[0].name}
                    value={stockStoreList[0].uuid}
                    key={stockStoreList[0].uuid}
                />
                {stockStoreList[0].childList.length && loop(stockStoreList[0].childList, 0 )}
            </TreeSelect>
        )
    }
}
