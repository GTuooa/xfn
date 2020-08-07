import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS } from 'immutable'

import { TreeSelect } from 'antd'
const TreeNode = TreeSelect.TreeNode

@immutableRenderDecorator
export default
class TypeListTree extends React.Component{
    render(){
        const {className,typeList,onChange,value}=this.props
        const loop = (data) => data.map((item, i) => {
            if (item.childList && item.childList.length) {
                return <TreeNode
					title={item.name}
					value={item.acId}
					key={item.acId}
					>
                    {loop(item.childList)}
                </TreeNode>
            }
            return <TreeNode
                title={item.name}
                value={item.acId}
                key={item.acId}
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
                    title={"全部"}
                    value={"全部"}
                    key={"全部"}
                />
                {typeList.length && loop(typeList )}
            </TreeSelect>
        )
    }
}
