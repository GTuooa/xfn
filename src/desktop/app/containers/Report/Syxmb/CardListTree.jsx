import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS } from 'immutable'

import * as Limit from 'app/constants/Limit'
import { TreeSelect } from 'antd'
const TreeNode = TreeSelect.TreeNode

@immutableRenderDecorator
export default
class CardListTree extends React.Component{
    render(){
        const {className,cardList,onChange,value,disabled,style}=this.props
        const loop = (data) => data.map((item, i) => {

            if (item.categoryList.length || item.cardList.length) {

                return <TreeNode
					title={item.name}
					value={item.uuid}
					key={item.uuid}
					>
                    {loop(item.cardList.length?item.cardList:item.categoryList)}
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
                disabled={disabled}
                className={className}
                style={style}
                //dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                onChange={onChange}
                value={value}
            >
                {/*<TreeNode
                    title={cardList[0].name}
                    value={cardList[0].uuid}
                    key={cardList[0].uuid}
                />*/}
                {cardList.length && loop(cardList, 0 )}
            </TreeSelect>
        )
    }
}
