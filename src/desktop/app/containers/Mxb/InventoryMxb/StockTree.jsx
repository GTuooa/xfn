import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS, Map, List } from 'immutable'

import { Select, Icon, Menu, Pagination,Tree }  from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { TableTree, XfnIcon } from 'app/components'
const TreeNode = Tree.TreeNode
import * as inventoryMxbActions from 'app/redux/Mxb/InventoryMxb/inventoryMxb.action.js'
@immutableRenderDecorator
export default
class StockTree extends React.Component {
    constructor() {
        super()
        this.state = {
            value: '',
        }
    }
    componentDidMount(){
        this.setState({value:`${this.props.stockStoreList[0].uuid}-${this.props.stockStoreList[0].name}`})
    }
    componentWillReceiveProps(props){
        let name=''
        const loop = (data) => data.map(item => {
            if(item.uuid == props.stockStoreValue){
                name = item.name
            }
            if(item.childList.length > 0){
                loop(item.childList)
            }
        })
        loop(props.stockStoreList)
        this.setState({value:`${props.stockStoreValue}-${name}`})
    }
    render(){
        const {dispatch,stockStoreList,stockStoreValue,onClick}=this.props
        const loop = (data,level) => data.map((item,index) => {
            if (item.childList.length>0){
                return (
                    <TreeNode title={item.name} key={`${item.uuid}-${item.name}`} >
                        {loop(item.childList,level+1)}
                    </TreeNode>
                )
            }else{
                return <TreeNode title={item.name} key={`${item.uuid}-${item.name}`} />
            }
        })
        return(
            <div>
                <Tree
                    selectedKeys={[this.state.value]}
                    onSelect={(item)=>{
                        if(item.length===0){
                            return
                        }
                        onClick(item[0].split('-')[0],item[0].split('-')[1])
                        this.setState({value:item[0]})
                }}>
                    <TreeNode title={stockStoreList[0].name} key={`${stockStoreList[0].uuid}-${stockStoreList[0].name}`} />
                    {stockStoreList[0].childList.length &&loop(stockStoreList[0].childList,0)}
                </Tree>
            </div>
        )
    }

}
