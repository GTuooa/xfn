import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Button, Input, Checkbox, Tree, Modal } from 'antd'
const TreeNode = Tree.TreeNode
import { Icon } from 'app/components'

import * as Limit from 'app/constants/Limit.js'
import { toJS ,fromJS } from 'immutable'


import './index.less'

@immutableRenderDecorator
export default
class CommonTreeModal extends React.Component {
    state = {
        inputValue:''
    }
    render() {
        const {
            dispatch,
            modalStyle,
            modalName,
            cardList,
            curSelectUuid,
            cancel,
            allCheckBoxClick,
            onOkCallback,
            onCheck,
            checkedKeys,
            nameString,
            uuidString,
        } = this.props
        const { inputValue } = this.state
        const list = cardList && cardList.size ? cardList : fromJS([])
        const categoryName = nameString ? nameString : 'jrCategoryName'
        const categoryUuid = uuidString ? uuidString : 'jrCategoryUuid'

        let newList = {[categoryName]:'全部',[categoryUuid]:'',childList: list.toJS()}

        let allUUidList = []
        const setFlag = (item) => {
            allUUidList.push(item[categoryUuid])
            if (item.childList && item.childList.length) {

                let selected = false;
                for (let v of item.childList) {
                    selected = setFlag(v) || selected;
                }
                item.selected = selected
                return selected

            }
            if (!item.childList || item.childList.length === 0) {
                if (item[categoryName] && item[categoryName].indexOf(inputValue) > -1) {
                    item.selected = true;
                    return true;
                } else {
                    item.selected = false;
                    return false;
                }
            }

        }
        setFlag(newList)

        const formatTree = node => {
            if (!node.selected) {
              delete node.selected;
            }
            if (node.childList) {
                node.childList = node.childList.filter(item => item.selected) || [];
                for (let item of node.childList) {
                    formatTree(item);
                }
            }

        }
        formatTree(newList)

        const loop = (itemList) => itemList.map((item, i) => {
            let dataKey = `${item.get(categoryUuid)}`
            let title = `${item.get(categoryName)}`
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

		// const selectedKeys = `${currentTreeSelectItem.get('jrCategoryUuid')}${Limit.TREE_JOIN_STR}${currentTreeSelectItem.get('jrCategoryName')}${Limit.TREE_JOIN_STR}${currentTreeSelectItem.get('direction')}`

        return (
            <div className='mxb-common-modal' style={modalStyle}>

                <div className="mxb-common-modal-title">
                    <span
                        className='title-icon'
                        onClick={(e)=>{
                            e.stopPropagation()
                            cancel()
                        }}
                    >
                        <Icon type="close" />
                    </span>

                </div>
                <div className="mxb-common-modal-content">
                    <div className='common-modal-serch'>
                    {
                        inputValue ?
                        <Icon className="search-delete" type="close-circle" theme='filled'
                            onClick={() => {
                                this.setState({inputValue:''})
                            }}
                        /> : null
                    }
                        <Icon
                            className="serch-icon"
                            type="search"
                            onClick={(e) => {
                                // this.setState({inputValue:e.target.value})
                            }}
                        />
                        <Input
                            className="serch-input"
                            placeholder={`筛选${modalName}`}
                            value={inputValue}
                            onChange={e => {
                                this.setState({inputValue:e.target.value})
                            }}
                        />
                    </div>
                    <div className="common-mocal-card-list">
                        <div className='mxb-common-modal-tree'>
                        <Tree
                            checkable
                            onCheck={(info,e)=>{
                                onCheck(info,e,allUUidList)
                            }}
                            checkedKeys={checkedKeys}
                            style={{position:'relative'}}
                        >
                            {
                                '(全选)'.indexOf(inputValue) > -1 ?
                                <TreeNode
                                    key={`all`}
                                    title={'(全选)'}
                                    checkable
                                    // className='click-disabled'
                                >
                                </TreeNode> : ''
                            }

                            {newList.childList.length ? loop(fromJS(newList.childList)) : ''}
                        </Tree>
                        </div>

                    </div>

                </div>
                <div className="mxb-common-modal-bottom">
                    <Button
                        type="primary"
                        onClick={(e)=>{
                            e.stopPropagation()
                            cancel()
                            onOkCallback()
                        }}
                    >确定</Button>

                </div>



            </div>

            )
    }

}
