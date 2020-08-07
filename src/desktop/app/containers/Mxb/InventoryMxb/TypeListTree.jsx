import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS, Map, List } from 'immutable'
import {  Tree }  from 'antd'
import { TableTree, XfnIcon } from 'app/components'
const TreeNode = Tree.TreeNode
import * as inventoryMxbActions from 'app/redux/Mxb/InventoryMxb/inventoryMxb.action.js'
@immutableRenderDecorator
export default
class TypeListTree extends React.Component {
    render(){
        const {dispatch,typeList,typeListValue,onClick}=this.props
        const loop = (data) => data.map((item,index) => {
            if (item.childList.length>0){
                return (
                    <TreeNode title={item.name} key={item.acId} >
                        {loop(item.childList)}
                    </TreeNode>
                )
            }else{
                return <TreeNode title={item.name} key={item.acId} />
            }
        })
        return(
            <Tree
                selectedKeys={[typeListValue]}
                onSelect={(item)=>{
                    onClick(item)
            }}>
                <TreeNode title="全部" key="全部" />
                {loop(typeList)}
            </Tree>
        )
    }

}
