import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS, is } from 'immutable'

import { Tree, Input } from 'antd'
const TreeNode = Tree.TreeNode
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class Trees extends React.Component {

	render() {

		const {
            data,
            onSelect,
            currentTreeSelectItem,
            accountDetailType
        } = this.props

        const loop = (itemList, parentFullname) => itemList.map((item, i) => {
            let dataKey = ''
            let title = `${item.get('name')}`
			let fullname = parentFullname ? `${parentFullname}_${item.get('name')}` : item.get('name')
            if (accountDetailType === 'OTHER_TYPE') {
				dataKey = `${item.get('uuid')}${Limit.TREE_JOIN_STR}${item.get('direction')}${Limit.TREE_JOIN_STR}${fullname}${Limit.TREE_JOIN_STR}${item.get('name')}`
            } else {
                dataKey = `${item.get('uuid')}${Limit.TREE_JOIN_STR}${undefined}${Limit.TREE_JOIN_STR}${fullname}${Limit.TREE_JOIN_STR}${item.get('name')}`
            }

            if (item.get('childList') && item.get('childList').size) {
                return (
                    <TreeNode
                        key={dataKey}
                        title={title}
                    >
                        {loop(item.get('childList'), fullname)}
                    </TreeNode>
                )
            } else {
                return (
                    <TreeNode
                        key={dataKey}
                        title={title}
                    />
                )
            }
        })

		const selectedKeys = `${currentTreeSelectItem.get('uuid')}${currentTreeSelectItem.get('direction') ? Limit.TREE_JOIN_STR+currentTreeSelectItem.get('direction')+Limit.TREE_JOIN_STR+currentTreeSelectItem.get('fullname')+Limit.TREE_JOIN_STR+currentTreeSelectItem.get('name') : Limit.TREE_JOIN_STR+undefined+Limit.TREE_JOIN_STR+currentTreeSelectItem.get('fullname')+Limit.TREE_JOIN_STR+currentTreeSelectItem.get('name')}`

        return (
            <div>
                <Tree
                    // onExpand={this.onExpand}
                    // expandedKeys={expandedKeys}
                    // autoExpandParent={autoExpandParent}
                    onSelect={value => onSelect(value)}
                    selectedKeys={[selectedKeys]}
                >
					<TreeNode
						key={`${Limit.TREE_JOIN_STR}${undefined}${Limit.TREE_JOIN_STR}全部${Limit.TREE_JOIN_STR}全部`}
						title={'全部'}
						checkable
					/>
                    {data.get('childList') && data.get('childList').size ? loop(data.get('childList')) : ''}
                </Tree>
            </div>
		)
	}
}
