import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as Limit from 'app/constants/Limit'

import { TreeSelect } from 'antd'
const TreeNode = TreeSelect.TreeNode
const { SHOW_PARENT } = TreeSelect;
import { toJS, is } from 'immutable'

@immutableRenderDecorator
export default
class PayCategorySelect extends React.Component{
	constructor() {
		super()
		this.state = {
			expandedKeys: []
		}
	}
	componentDidMount() {
		const uuidName = this.props.isCardUuid ? 'cardUuid' : 'uuid'
		let expandedKeys = []
		const loop = data => data && data.length && data.map(item =>{
			expandedKeys.push(item[uuidName])
			if(item.childList && item.childList.length){
				loop(item.childList)
			}
		})
		loop(this.props.treeData.toJS())
		this.setState({
			expandedKeys:expandedKeys
		})
    }

    componentWillReceiveProps(nextprops) {
		const uuidName = nextprops.isCardUuid ? 'cardUuid' : 'uuid'
		if(!is(nextprops.treeData,this.props.treeData) && nextprops.treeData && nextprops.treeData.size) {
			let expandedKeys = []
			const loop = data => data && data.map(item =>{
				expandedKeys.push(item[uuidName])
				if(item.childList && item.childList.length){
					loop(item.childList)
				}
			})
			loop(nextprops.treeData.toJS())
			this.setState({
				expandedKeys:expandedKeys
			})
		}


    }

    onExpand = (expandedKeys) => {
        this.setState({
          expandedKeys,
        });
    }


	render() {
		const { className, treeData, value, placeholder, onChange, parentsDisable, disabled, showSearch,allowClear,multiple, treeCheckable,id,size,isCardUuid, chooseAll  } = this.props
		const { expandedKeys } = this.state
		const popId = id ? id : 'root'
		const uuidName = isCardUuid ? 'cardUuid' : 'uuid'
		const loop = (data, leve) =>data && data.length && data.map((item, i) => {
            if (item.childList && item.childList.length) {
                return <TreeNode
					disabled={parentsDisable}
					title={item.code ? `${item.code} ${item.name}` : item.name}
					value={`${item[uuidName]}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.code}`}
					key={item[uuidName]}
					>
                    {loop(item.childList, leve+1)}
                </TreeNode>
            }

            return <TreeNode
                title={item.code ? `${item.code} ${item.name}` : item.name}
                value={`${item[uuidName]}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.code}`}
                key={item[uuidName]}
            />
        })
		return (
			<TreeSelect
				showSearch={showSearch ? true : false}
				className={className}
                placeholder={placeholder}
				disabled={disabled}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll={true}
                value={value}
				size={size?size:'default'}
				treeCheckable={treeCheckable}
				showCheckedStrategy={SHOW_PARENT}
				treeCheckStrictly={!chooseAll}
				// getPopupContainer={()=>document.getElementById(id)}
				// maxTagCount={1}
				// maxTagPlaceholder={'...'}
				treeNodeFilterProp={'title'}
                onChange={onChange}
				treeExpandedKeys={expandedKeys}
				onTreeExpand={this.onExpand}
            >
				{treeData.size ? loop( treeData.toJS(), 1 ) : []}
            </TreeSelect>
		)
	}
}
