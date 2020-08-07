import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'

import { Icon, message, Input, Modal, Tree } from 'antd'
const TreeNode = Tree.TreeNode
import { TableBody, TableItem, TableAll, TablePagination } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'

@immutableRenderDecorator
export default
class StockSingleModal extends React.Component {
    state = {
        searchContent:''
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
            stockCardList,
            cancel,
            isCardUuid,
            notNeedProduct,
            cardPageObj,
            paginationCallBack,
        } = this.props
        const { searchContent } = this.state
        const newMemberList = notNeedProduct ? MemberList.filter(v => v.get('name') !== '生产项目') : MemberList

        const cardUuidString = isCardUuid ? 'cardUuid' : 'uuid'
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
        const treeList = newMemberList ? loop(newMemberList.toJS(), defaultExpandedKeys, 1) : ''
        const stringCombo = thingsList.map(v => {
            return {
                string: `${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`,
                uuid: v.get('uuid')
            }
        })
        let chooseCardUuid = [],canChooseList = []
        stockCardList && stockCardList.size && stockCardList.map((item,index) => {
            chooseCardUuid.push(item.get('cardUuid'))
        })
        thingsList && thingsList && thingsList.toJS().map(item => {
            if(chooseCardUuid.indexOf(item[cardUuidString]) === -1){
                canChooseList.push(item)
            }

        })
        const newThinglist = thingsList.toJS().filter(v => searchContent ? v.code.indexOf(searchContent)> -1 || v.name.indexOf(searchContent)> -1 : true)
        return (
            <Modal
                className='no-foot select-modal'
                title={title}
                visible={showSingleModal}
                onCancel={() => {
                    cancel && cancel()
                    dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectedKeys', [`all${Limit.TREE_JOIN_STR}1`]))
                }}
                width="800px"
            >
                <div className='lsqc-contacts-card-top'>
                    <div className="table-tree-container" style={{height:newThinglist.length > 5?'634px':'286px'}}>
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
                                selectListFunc(uuid,level)
                                dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectedKeys', value))
                                this.setState({searchContent:''})
                            }}
                            selectedKeys={selectedKeys ? selectedKeys : ['all-:-1']}
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
                    <TableAll className="contacts-table-right" style={{height:newThinglist.length > 5?'634px':'286px'}}>
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
                                canChooseList.filter(v => searchContent ? (v.code.indexOf(searchContent)> -1 || v.code.indexOf(searchContent.toUpperCase())> -1 || v.code.indexOf(searchContent.toLowerCase())> -1) || (v.name.indexOf(searchContent)> -1 || v.name.indexOf(searchContent.toUpperCase())> -1 || v.name.indexOf(searchContent.toLowerCase())> -1) : true).map(v => {
                                    const uuid = v.uuid ? v.uuid : v.cardUuid
                                    return (
                                        <TableItem
                                            className='contacts-table-width cursor'
                                            key={uuid}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                selectFunc(v,uuid)
                                            }}
                                        >
                                            <li>{v.code}</li>
                                            <li>{v.name}</li>
                                        </TableItem>
                                    )
                                })
                            }
                        </TableBody>
                        {
                            cardPageObj ?
                            <TablePagination
                              className='editcalculate-card-modal-pagination'
                              currentPage={cardPageObj.get('currentPage')}
                              pageCount={cardPageObj.get('pages')}
                              paginationCallBack={(value) => paginationCallBack(value)}
                            /> : ''
                        }
                    </TableAll>
                </div>
            </Modal>
        )
    }
}
