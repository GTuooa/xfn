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
      // if(!is(nextprops.category.get('childList'),this.props.category.get('childList')) && nextprops.category.get('childList') && nextprops.category.get('childList').size) {
      //     let keys = []
      //     const nextCategory = nextprops.category.get('childList')
      //     nextCategory.toJS().map((item,i) => {
      //         keys.push(`${item.acId}${Limit.TREE_JOIN_STR}${item.acName}`)
      //     })
      //     this.setState({
      //       expandedKeys: keys
      //     });
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
        const loop = (data, dataList) => data && data.map((item, i) => {
            let dataKey = `${item.acName}`
            let title = dataKey.indexOf(searchValue) > -1 && searchValue!='' ? <span style={{color: '#f50'}}>{item.acName}</span> : <span>{item.acName}</span>
            if (item.childList.length) {
                dataList.push({
                    key:`${item.acName}`,
                    value:`${item.acId}${Limit.TREE_JOIN_STR}${item.acName}${Limit.TREE_JOIN_STR}${item.mergeName}`
                })
                return (
                    <TreeNode
                        key={`${item.acId}${Limit.TREE_JOIN_STR}${item.acName}${Limit.TREE_JOIN_STR}${item.mergeName}`}
                        title={title}
                    >
                        {loop(item.childList,dataList)}
                    </TreeNode>
                )
            }
            dataList.push({
                key:`${item.acName}`,
                value:`${item.acId}${Limit.TREE_JOIN_STR}${item.acName}${Limit.TREE_JOIN_STR}${item.mergeName}`
            })
            return <TreeNode
                key={`${item.acId}${Limit.TREE_JOIN_STR}${item.acName}${Limit.TREE_JOIN_STR}${item.mergeName}`}
                title={title}
                checkable
            />
        })
        let dataList = []
        const treeList = loop(category.get('childList') && category.get('childList').toJS(), dataList)
        return (
            <div className="runningType-right-tree">
                <div className="runningType-tree-title-handle">
                    <Search placeholder="搜索"  onSearch={(value) =>this.onChange(value,dataList,category.get('childList').toJS())}/>
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
