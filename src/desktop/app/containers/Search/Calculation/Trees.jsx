import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import * as lsmxActions from 'app/redux/Mxb/LsMxb/lsMxb.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'

import { Tree } from 'antd'
const TreeNode = Tree.TreeNode
import * as Limit from 'app/constants/Limit.js'
import { fromJS, toJS } from 'immutable'

const loop = (data, defaultExpandedKeys, runningInsertOrModify) => data.map((item, i) => {
    if (item.childList.length) {
		return (
			<TreeNode
                key={`${item.uuid}`}
                title={item.name}
                // className='click-disabled'
            >
				{loop(item.childList,defaultExpandedKeys, runningInsertOrModify)}
			</TreeNode>
		)
	}

	return <TreeNode
            key={`${item.uuid}`}
            title={item.name}
            checkable
            // className={item.canDelete?'':'click-disabled'}
          />
})

@immutableRenderDecorator
export default
class Trees extends React.Component {
    state = {
        expandedKeys: [],
        autoExpandParent: true,
      }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  componentWillReceiveProps(nextprops){
          let keys = []
          nextprops.category.toJS().map((item,i) => {
              keys.push(`${item.uuid}`)
          })
          this.setState({
            expandedKeys: keys
          });
  }

	render() {
		const {
      category,
      onSelect,
      selectedKeys,
      flags,
      dispatch,
      // hideCategoryList,
      // disabledChangeCategory,
      // cardTemp,
      className
    } = this.props
    const {expandedKeys,autoExpandParent} = this.state

        let defaultExpandedKeys = ['全部']
        const runningInsertOrModify = flags.get('runningInsertOrModify')
        const treeList = loop(category.toJS(), defaultExpandedKeys, runningInsertOrModify)

        return (
            <Tree
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onSelect={value => onSelect(value)}
                selectedKeys={selectedKeys}
                >
                    {treeList}
            </Tree>
		)
	}
}
