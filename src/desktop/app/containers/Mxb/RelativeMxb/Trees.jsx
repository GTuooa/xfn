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
            currentTreeSelectItem
        } = this.props

        const loop = (itemList) => itemList.map((item, i) => {
            let dataKey = `${item.get('jrCategoryUuid')}${Limit.TREE_JOIN_STR}${item.get('jrCategoryName')}${Limit.TREE_JOIN_STR}${item.get('direction')}`
            let title = `${item.get('jrCategoryName')}`

            if (item.get('childList') && item.get('childList').size) {
                return (
                    <TreeNode
                        key={dataKey}
                        title={title}
                    >
                        {loop(item.get('childList'))}
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

		const selectedKeys = `${currentTreeSelectItem.get('jrCategoryUuid')}${Limit.TREE_JOIN_STR}${currentTreeSelectItem.get('jrCategoryName')}${Limit.TREE_JOIN_STR}${currentTreeSelectItem.get('direction')}`

        return (
            <div>
                <Tree
                    // onExpand={this.onExpand}
                    // expandedKeys={expandedKeys}
                    // autoExpandParent={autoExpandParent}
                    onSelect={onSelect}
                    selectedKeys={[selectedKeys]}
                >
                    {data.size ? loop(data) : null}
                </Tree>
            </div>
		)
	}
}
