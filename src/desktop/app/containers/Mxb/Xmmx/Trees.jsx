import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS, is } from 'immutable'

import { Tree, Input } from 'antd'
const TreeNode = Tree.TreeNode
const Search = Input.Search
import * as Limit from 'app/constants/Limit.js'



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

  componentDidMount() {
      // let keys = []
      // this.props.category.toJS().map(item =>  {
      //     keys.push(`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.propertyCost}`)
      // })
      // this.setState({
      //   expandedKeys: keys
      // })
  }
  componentWillReceiveProps(nextprops) {
      // if(!is(nextprops.category,this.props.category.getIn([0, 'childList'])) && nextprops.category.getIn([0, 'childList']) && nextprops.category.getIn([0, 'childList']).size) {
      //     let keys = []
      //     const loop = (data) => {
      //         data.map(item =>  {
      //             keys.push(`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.propertyCost}`)
      //             if (item.childList.length) {
      //                loop(item.childList)
      //             }
      //         })
      //     }
      //     loop(nextprops.category.toJS())
      //     this.setState({
      //       expandedKeys: keys
      //     })
      // }

  }

	render() {

		const {
            category,
            onSelect,
            selectedKeys,
            flags,
            dispatch,
            className
        } = this.props
        const {expandedKeys, autoExpandParent} = this.state

        const loop = (data) => data.map((item, i) => {
            let title =  <span>{item.name}</span>
            if (item.childList.length) {
                return (
                    <TreeNode
                        key={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.propertyCost}`}
                        title={title}
                    >
                        {loop(item.childList)}
                    </TreeNode>
                )
            }

            return <TreeNode
                key={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.propertyCost}`}
                title={title}
                checkable
                // className={item.canDelete?'':'click-disabled'}
            />
        })
        const categoryJS = category.get(0).toJS()
        const treeList = categoryJS.childList && categoryJS.childList.length?loop(categoryJS.childList):[]
        return (
            <div>
                <Tree
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onSelect={value => onSelect(value)}
                    selectedKeys={selectedKeys}
                >
                    <TreeNode
                        key={`${categoryJS.uuid}${Limit.TREE_JOIN_STR}${categoryJS.name}${Limit.TREE_JOIN_STR}${categoryJS.propertyCost}`}
                        title={<span>{categoryJS.name}</span>}
                        checkable
                        // className={item.canDelete?'':'click-disabled'}
                    />
                    {treeList}
                </Tree>
            </div>

		)
	}
}
