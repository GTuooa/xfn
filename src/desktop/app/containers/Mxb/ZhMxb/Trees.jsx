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
      if(!is(this.props.category,nextprops.category)){
          let keys = []
          nextprops.category.toJS().map((item,i) => {
              keys.push(`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.categoryType}${Limit.TREE_JOIN_STR}${item.propertyCost}`)
          })
          this.setState({
            expandedKeys: keys
          });
      }
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
            flags,
            dispatch,
            hideCategoryList,
            // disabledChangeCategory,
            // cardTemp,
            className
        } = this.props
        const {expandedKeys,searchValue, autoExpandParent} = this.state

        const loop = (data, runningInsertOrModify, dataList) => data.map((item, i) => {
            let dataKey = `${item.remark}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.runningAbstract}`
            let title = dataKey.indexOf(searchValue) > -1 && searchValue!='' ? <span style={{color: '#f50'}}>{item.name}</span> : <span>{item.name}</span>
            if (item.childList.length) {
                dataList.push({
                    key:`${item.remark}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.runningAbstract}`,
                    value:`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.categoryType}${Limit.TREE_JOIN_STR}${item.propertyCost}`
                })
        		return (
        			<TreeNode
                        key={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.categoryType}${Limit.TREE_JOIN_STR}${item.propertyCost}`}
                        title={title}
                    >
        				{loop(item.childList, runningInsertOrModify,dataList)}
        			</TreeNode>
        		)
        	}
            dataList.push({
                key:`${item.remark}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.runningAbstract}`,
                value:`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.categoryType}${Limit.TREE_JOIN_STR}${item.propertyCost}`
            })

        	return <TreeNode
                key={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.categoryType}${Limit.TREE_JOIN_STR}${item.propertyCost}`}
                title={title}
                checkable
                // className={item.canDelete?'':'click-disabled'}
            />
        })

        const PageTab = flags.get('PageTab')
        const accountType = flags.get('accountType')
        const paymentType = flags.get('paymentType')
        const issuedate = flags.get('issuedate')
        const currentPage = flags.get('currentPage')
        const modify = flags.get('modify')
        const runningInsertOrModify = flags.get('runningInsertOrModify')
        let dataList = []
        const treeList = loop(category.toJS(), runningInsertOrModify, dataList)
        return (
            <div className="zh-right-tree">
                <div className="zh-tree-title-handle">
                    <Search className='lrls-search-tree' placeholder="搜索"  onSearch={(value) =>this.onChange(value,dataList,category.getIn([0, 'childList']).toJS())}/>
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
