import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'

import { message, Input, Modal, Tree } from 'antd'
import { Icon } from 'app/components'
const TreeNode = Tree.TreeNode
import { TableBody, TableItem, TableAll, TablePagination } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
const { Search } = Input

@immutableRenderDecorator
export default
class SingleModal extends React.Component {
    state = {
        searchContent:'',
        currentPage:1,
        uuid:'all'
    }
    render() {

        const {
            dispatch,
            showSingleModal,
            title,
            MemberList,
            thingsList,
            selectedKeys,
            selectFunc,
            selectListFunc,
            pageCount=1
        } = this.props
        const { searchContent, currentPage, level, uuid, name } = this.state
        const loop = (data, defaultExpandedKeys,level) => data && data.map((item, i) => {

            if (item.childList && item.childList.length) {
                return (
                    <TreeNode
                        key={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${level}`}
                        title={item.name}
                        // className='click-disabled'
                    >
                        {loop(item.childList,defaultExpandedKeys,level+1)}
                    </TreeNode>
                )
            } else {
                return (
                    <TreeNode
                        key={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${level}`}
                        title={item.name}
                        checkable
                        // className={item.canDelete?'':'click-disabled'}
                    />
                )
            }
        })
        let defaultExpandedKeys = ['全部']
        const treeList = MemberList ? loop(MemberList.toJS(), defaultExpandedKeys, 1) : ''
        const stringCombo = thingsList.map(v => {
            return {
                string: `${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`,
                uuid: v.get('uuid')
            }
        })
        const newThinglist = thingsList.toJS()
                            // .filter(v => searchContent ? v.code.indexOf(searchContent)> -1 || v.name.indexOf(searchContent)> -1 : true)
        return (
            <Modal
                className='no-foot select-modal'
                title={title}
                visible={showSingleModal}
                onCancel={() => {
                    dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'showSingleModal'], false))
                    dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'selectedKeys'], ''))
                }}
                width="800px"
            >
                <div className='lsqc-contacts-card-top'>
                    <div className="table-tree-container" style={{height:newThinglist.length > 5?'634px':'249px'}}>
                        <Tree
                            defaultExpandAll={true}
                            onSelect={value => {
                                if (!value[0]) {
                                    return
                                }

                                const valueList = value[0].split(Limit.TREE_JOIN_STR)
                                const uuid = valueList[0]
                                const name = valueList[1]
                                const level = valueList[2]
                                selectListFunc(uuid,level,1,'')
                                dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'selectedKeys'], value[0]))
                                this.setState({searchContent:'',uuid,level,name,currentPage:1})
                            }}
                            selectedKeys={[selectedKeys ? selectedKeys : 'all-:-1']}
                        >
                            <TreeNode
                                key={`all${Limit.TREE_JOIN_STR}1`}
                                title={'全部'}
                                checkable
                                // className='click-disabled'
                            />
                            {treeList}
                        </Tree>
                    </div>
                    <TableAll className="contacts-table-right" style={{height:newThinglist.length > 5?'634px':'249px'}}>
                        <span className="lsqc-serch">
                            {/* <span className="lsqc-icon">搜索</span> */}
                                {/* <Icon className="lsqc-serch-icon" type="search"/> */}
                                <Search
                                    placeholder="搜索"
                                    className="lsqc-serch-input"
                                    value={searchContent}
                                    onChange={e => {
                                        this.setState({searchContent:e.target.value})
                                    }}
                                    onSearch={value => {
                                        selectListFunc(uuid,level,1,searchContent)
                                        this.setState({currentPage:1})
                                    }}
                                />
                        </span>
                        <div className="table-title-wrap">
                            <ul className="table-title">
                                <li>
                                    <span>编号</span>
                                </li>
                                <li>
                                    <span>名称</span>
                                </li>
                            </ul>
                        </div>
                        <TableBody>
                        {
                            newThinglist.map(v => {
                                const uuid = v.uuid ? v.uuid : v.cardUuid
                                return (
                                    <TableItem
                                        className='contacts-table-width cursor'
                                        key={v.uuid}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            selectFunc(v.code,v.name,uuid,v.projectProperty)
                                        }}
                                    >
                                        <li>{v.code}</li>
                                        <li>{v.name}</li>
                                    </TableItem>
                                )
                            })
                        }
                        </TableBody>
                        <TablePagination
                            size='small'
                            style={{marginTop:'10px'}}
                            currentPage={currentPage}
                            pageCount={pageCount}
                            paginationCallBack={(value) => {
                                selectListFunc(uuid,level,value,searchContent)
                                this.setState({currentPage:value})

                            }}
                        />
                    </TableAll>
                </div>
            </Modal>
        )
    }
}
