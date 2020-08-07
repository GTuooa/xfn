import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'

import { message, Input, Modal, Tree, Checkbox, Button, Tag } from 'antd'
import { Icon } from 'app/components'
const TreeNode = Tree.TreeNode
import { TableBody, TableItem, TableAll } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class SingleModal extends React.Component {

    constructor(props) {
        super(props)

        let selectList = this.props.selectList
        // let selectList = this.props.selectList.map(v => {
        //     // const index = v.indexOf(Limit.APPROVAL_JOIN_STR)
        //     return {
        //         code: v.substr(0, index),
        //         name: v.substr(index+1)
        //     }
        // })
        // let checkedKeys = []
        // this.props.selectList.forEach(v => {

        // })

		this.state = {
			searchContent: '',
            selectedKeys: '',
            selectCardList: selectList,
		}
	}
    render() {

        const {
            dispatch,
            showSingleModal,
            title,
            modalCategoryList,
            modalCardList,
            onOk,
            selectListFunc,
            closeModal,
            selectList,
            showCheckBox
        } = this.props
        
        const { searchContent, selectedKeys, selectCardList } = this.state

        const loop = (data, defaultExpandedKeys) => data && data.map((item, i) => {
            if (item.childList && item.childList.length) {
                return (
                    <TreeNode
                        key={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.top ? true : false}`}
                        title={item.name}
                        // className='click-disabled'
                    >
                        {loop(item.childList,defaultExpandedKeys)}
                    </TreeNode>
                )
            } else {
                return (
                    <TreeNode
                        key={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.top ? true : false}`}
                        title={item.name}
                        checkable
                        // className={item.canDelete?'':'click-disabled'}
                    />
                )
            }
        })
        let defaultExpandedKeys = ['全部']
        const treeList = modalCategoryList ? loop(modalCategoryList.toJS(), defaultExpandedKeys) : ''

        const showList = modalCardList.toJS().filter(v => searchContent ? v.code.indexOf(searchContent)> -1 || v.name.indexOf(searchContent)> -1 : true)
        const isSelectAll = showList.every(v => selectCardList.findIndex(w => w.code === v.code && w.name === v.name) > -1)

        return (
            <Modal
                className='select-modal'
                title={title}
                visible={true}
                onCancel={() => {
                    closeModal()
                    this.setState({selectedKeys: ''})
                }}
                width="800px"
                height="319px"
                footer={[
                    <Button
                        key="cancel"
                        type="ghost"
                        onClick={() => {
                            closeModal()
                            this.setState({selectedKeys: ''})
                        }}
                    >
                        取 消
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        onClick={() => {
                            onOk(selectCardList)
                            closeModal()
                            this.setState({selectedKeys: ''})
                        }}
                    >
                        保 存
                    </Button>,
                ]}
            >
                <div className='lsqc-contacts-card-top'>
                    <div className="table-tree-container" style={{height: showList.length > 5?'634px':'249px'}}>
                        <Tree
                            // checkable={showCheckBox}
                            checkable
                            checkStrictly={true}
                            // checkedKeys={selectCardList.map(v => `${v.uuid}${Limit.TREE_JOIN_STR}${v.name}${Limit.TREE_JOIN_STR}${v.top}`)}
                            onCheck={(result, e) => {
                                const checked = e.checked // 勾选还是勾除
                                const checkedkey = e.node.props.eventKey
                                
                                let newList = selectCardList

                                const valueList = checkedkey.split(Limit.TREE_JOIN_STR)
                                const uuid = valueList[0]
                                const name = valueList[1]
                                const level = valueList[2]

                                if (checked) {
                                    newList.push({
                                        code: '',
                                        name: name,
                                        type: "CTGY",
                                        top: level === 'true' ? true : false,
                                        uuid: uuid
                                    })
                                    this.setState({selectCardList: newList})
                                } else {
                                    newList = newList.filter(w => !(uuid === w.uuid))
                                    this.setState({selectCardList: newList})
                                }
                            }}
                            defaultExpandAll={true}
                            onSelect={value => {
                                if (!value[0]) {
                                    return
                                }

                                const valueList = value[0].split(Limit.TREE_JOIN_STR)
                                const uuid = valueList[0]
                                const name = valueList[1]
                                const level = valueList[2]
                                selectListFunc(uuid, level === 'true' ? 1 : '')
                                this.setState({searchContent: '', selectedKeys: value[0]})
                            }}
                            selectedKeys={[selectedKeys ? selectedKeys : `all${Limit.TREE_JOIN_STR}全部${Limit.TREE_JOIN_STR}true`]}
                        >
                            <TreeNode
                                key={`all${Limit.TREE_JOIN_STR}全部${Limit.TREE_JOIN_STR}true`}
                                title={'全部'}
                                checkable
                                // className='click-disabled'
                            > 
                            </TreeNode>
                            {treeList}
                        </Tree>
                    </div>
                    <TableAll className="contacts-table-right" style={{height:showList.length > 5?'634px':'249px'}}>
                        <span className="lsqc-serch">
                            <span className="lsqc-icon">搜索</span>
                            <Icon className="lsqc-serch-icon" type="search"/>
                            <Input
                                placeholder=""
                                className="lsqc-serch-input"
                                value={searchContent}
                                onChange={e => {
                                    this.setState({searchContent:e.target.value})
                                }}
                            />
                        </span>

                        <div className="table-title-wrap">
                            <ul className="table-title table-title-charge">
                                <li onClick={() => {
                                    if (isSelectAll) {
                                        let newList = selectCardList
                                        showList.forEach(v => {
                                            newList = newList.filter(w => !(v.code === w.code && v.name === w.name))
                                        })
                                        this.setState({selectCardList: newList})
                                    } else {
                                        let newList = selectCardList.concat(showList.map(v => {
                                            v.type = "CARD"
                                            v.top = false
                                            return v
                                        }))
                                        newList = newList.filter((v, i) => newList.findIndex(w => w.code === v.code && w.name === v.name) === i) // 去重
                                        this.setState({selectCardList: newList})
                                    }
                                }} >
                                    <Checkbox checked={isSelectAll} />
                                </li>
                                <li>
                                    <span>编号</span>
                                </li>
                                <li>
                                    <span>名称</span>
                                </li>
                            </ul>
                        </div>
                        <TableBody style={{height:showList && showList.length > 5?'374px':'249px'}}>
                            {
                                showList && showList.map(v => {
                                    const uuid = v.uuid ? v.uuid : v.cardUuid
                                    const checked = selectCardList.some(w => v.name === w.name && v.code === w.code)

                                    return (
                                        <TableItem
                                            className='contacts-table-width-charge'
                                            key={v.uuid}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                let newList = selectCardList
                                                if (checked) {
                                                    newList = newList.filter(w => !(v.code === w.code && v.name === w.name))
                                                    this.setState({selectCardList: newList})
                                                } else {
                                                    newList.push({
                                                        code: v.code,
                                                        name: v.name,
                                                        type: "CARD",
                                                        top: false,
                                                        uuid: uuid
                                                    })
                                                    this.setState({selectCardList: newList})
                                                }
                                            }}
                                        >
                                            <li><Checkbox checked={checked} /></li>
                                            <li>{v.code}</li>
                                            <li>{v.name}</li>
                                        </TableItem>
                                    )
                                })
                            }
                        </TableBody>
                    </TableAll>
                </div>
                <div className="charge-chosen-project">      
                    <span>已选类别或卡片：</span>
                    {
                        selectCardList && selectCardList.map((v, i) => {
                            return (
                                <Tag closable onClose={(e) => {
                                    e.preventDefault();
                                    selectCardList.splice(i, 1)
                                    this.setState({selectCardList: selectCardList})
                                }}>{`${v.code ? v.code + Limit.APPROVAL_JOIN_STR : ''}` + v.name}</Tag>
                            )
                        })
                    } 
                </div>
                <div style={{display:selectCardList.length>0?'':'none',margin:'0 0 10px 20px'}}>
                    {selectCardList.length}个类别或卡片
                </div>
            </Modal>
        )
    }
}