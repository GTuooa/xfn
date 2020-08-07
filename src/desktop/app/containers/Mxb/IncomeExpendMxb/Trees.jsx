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
        searchValue: '',
        autoExpandParent: true,
      }



  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  componentWillReceiveProps(nextprops){
      // if(!is(this.props.category,nextprops.category) && nextprops.category && nextprops.category.size){
      //     const nextCategory = nextprops.category.toJS()
      //     let keys = []
      //     nextCategory.map((item,i) => {
      //          keys.push(`${item.jrCategoryUuid}${Limit.TREE_JOIN_STR}${item.jrCategoryName}`)
      //      })
      //      this.setState({
      //        expandedKeys: keys
      //      });
      // }
  }
  onChange = (value,dataList,category) => {
      let chooseList = []
      dataList.map((item) => {
          if (item.key.indexOf(value) > -1) {
            chooseList.push(item.value)
          }
      })
      const expandedKeys = chooseList

      this.setState({
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
  }

	render() {
		const {
            category,
            onSelect,
            selectedKeys,
            dispatch,
            className
        } = this.props
        const {expandedKeys,searchValue, autoExpandParent} = this.state
        const loop = (data, dataList) => data.map((item, i) => {
            let dataKey = `${item.jrCategoryName}`
            let title = dataKey.indexOf(searchValue) > -1 && searchValue!='' ? <span style={{color: '#f50'}}>{item.jrCategoryName}</span> : <span>{item.jrCategoryName}</span>
            if (item.childList.length) {
                dataList.push({
                    key:`${item.jrCategoryName}`,
                    value:`${item.jrCategoryUuid}${Limit.TREE_JOIN_STR}${item.jrCategoryName}${Limit.TREE_JOIN_STR}${item.jrCategoryCompleteName}`
                })
                return (
                    <TreeNode
                        key={`${item.jrCategoryUuid}${Limit.TREE_JOIN_STR}${item.jrCategoryName}${Limit.TREE_JOIN_STR}${item.jrCategoryCompleteName}`}
                        title={title}
                    >
                        {loop(item.childList,dataList)}
                    </TreeNode>
                )
            }
            dataList.push({
                key:`${item.jrCategoryName}`,
                value:`${item.jrCategoryUuid}${Limit.TREE_JOIN_STR}${item.jrCategoryName}${Limit.TREE_JOIN_STR}${item.jrCategoryCompleteName}`
            })
            return <TreeNode
                key={`${item.jrCategoryUuid}${Limit.TREE_JOIN_STR}${item.jrCategoryName}${Limit.TREE_JOIN_STR}${item.jrCategoryCompleteName}`}
                title={title}
                checkable
            />
        })
        let dataList = []
        const treeList = loop(category.toJS(), dataList)
        return (
            <div className="incomeExpend-right-tree">
                <div className="incomeExpend-tree-title-handle">
                    <Search placeholder="搜索"  onSearch={(value) =>this.onChange(value,dataList,category.getIn([0, 'childList']).toJS())}/>
                </div>
                <Tree
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onSelect={value => onSelect(value)}
                    selectedKeys={selectedKeys}
                >
                    {treeList}
                </Tree>
            </div>

		)
	}
}
