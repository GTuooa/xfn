import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import * as Limit from 'app/constants/Limit.js'
import { Tree } from 'antd'
const TreeNode = Tree.TreeNode

import * as lsmxActions from 'app/redux/Mxb/LsMxb/lsMxb.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'

@immutableRenderDecorator
export default
class Trees extends React.Component {

	static displayName = 'QCTree'

	render() {
		const {
            category,
            onSelect,
            selectedKeys,
            dispatch,
            className,
            curModal
        } = this.props

        let level = 0
        const loop = (data, defaultExpandedKeys) => data.map((item, i) => {
            if(item.top){
                if (item.childList.length) {
                    return (
                        <TreeNode
                            key={`0${Limit.TREE_JOIN_STR}${item.uuid}`}
                            title={item.name}
                            // className='click-disabled'
                        >
                            {loop(item.childList,defaultExpandedKeys)}
                        </TreeNode>
                    )
                }

                return <TreeNode
                        key={`0${Limit.TREE_JOIN_STR}${item.uuid}`}
                        title={item.name}
                        checkable
                        // className={item.canDelete?'':'click-disabled'}
                      />
            }else{
                if (item.childList.length) {
                    return (
                        <TreeNode
                            key={`1${Limit.TREE_JOIN_STR}${item.uuid}`}
                            title={item.name}
                            // className='click-disabled'
                        >
                            {loop(item.childList,defaultExpandedKeys)}
                        </TreeNode>
                    )
                }
                return <TreeNode
                        key={`1${Limit.TREE_JOIN_STR}${item.uuid}`}
                        title={item.name}
                        checkable
                        // className={item.canDelete?'':'click-disabled'}
                      />
            }
        })

        let defaultExpandedKeys = ['全部']
        const treeList = loop(category.toJS(), defaultExpandedKeys)
        const curTitle = curModal === 'Contacts' ? '全部往来单位' : curModal === 'Project' ? '全部项目' : '全部存货'

        return (
            <Tree
                defaultExpandAll={true}
                onSelect={value => onSelect(value)}
                selectedKeys={selectedKeys}
            >
                <TreeNode
                    key={`0${Limit.TREE_JOIN_STR}`}
                    title={curTitle}
                    checkable
                    // className='click-disabled'
                />
                {treeList}
            </Tree>
        )
	}
}
