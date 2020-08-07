import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Checkbox, Input, Modal, Tag, Tree } from 'antd'
import { Icon } from 'app/components'
const TreeNode = Tree.TreeNode
import {TableBody, TableItem, ItemTriangle, TableOver,Amount, TableAll, TablePagination } from 'app/components'

import * as Limit from 'app/constants/Limit.js'
import { fromJS } from 'immutable'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
const { Search } = Input

@immutableRenderDecorator
export default
class MultipleModal extends React.Component {
    state = {
        searchContent:'',
        currentPage:1,
        uuid:'all'
    }
    render() {
        const {
            dispatch,
            MemberList,
            searchCardContent,
            searchList,
            hasSearchContent,
            thingsList,
            selectThingsList,
            selectedKeys,
            showModal,
            selectItem,
            selectList,
            cancel,
            stockCardList,
            oriState,
            categoryList,
            pageCount=1
        } = this.props
        const { searchContent, currentPage, level, uuid, name } = this.state
        const showThingsList = hasSearchContent  ? searchList : MemberList
        const thingsListSize = selectItem && selectItem.size || 0
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
            }

            return (<TreeNode
                      key={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${level}`}
                      title={item.name}
                      checkable
                      // className={item.canDelete?'':'click-disabled'}
                    />)
        })
        let defaultExpandedKeys = ['全部']
        const treeList = MemberList ? loop(MemberList.toJS(), defaultExpandedKeys,1) : ''
        const stringCombo = thingsList.map(v => {
            return {
                string:`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`,
                uuid:v.get('uuid')
            }
        })
        let selectThingList = []
        const newThinglist = thingsList.toJS()
        // .filter(v => this.state.inputValue ? v.code.indexOf(this.state.inputValue)> -1 || v.name.indexOf(this.state.inputValue)> -1 : true)
        const checkedAll = newThinglist.every(v => selectList.some(w => w === v.uuid)) && newThinglist.length
        return (
            <Modal
              className='select-modal'
              title={'选择存货'}
              visible={showModal}
              onCancel={() => {
                  dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'showStockModal'], false))
                  dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'selectedKeys'], ''))
                  dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'selectList'], fromJS([])))
                  dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'selectItem'], fromJS([])))
              }}
              onOk={() => {
                  dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'showStockModal'], false))
                  // dispatch(editCalculateActions.changeEditCalculateCommonString('CommonCharge','projectCardList',projectCard.concat(selectItem)))
                  dispatch(editRunningActions.changeCommonChargeInvnetory(stockCardList,selectItem))
                  dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'selectedKeys'], ''))
                  dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'selectList'], fromJS([])))
                  dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'selectItem'], fromJS([])))
              }}
              width="800px"
              >
                <div className='lsqc-contacts-card-top'>
                    <div className="table-tree-container"  style={{height:newThinglist.length > 5?'461px':'249px'}}>
                          <Tree
                              defaultExpandAll={true}
                              onSelect={value => {

                                  if (value[0]) {
                                      const valueList = value[0].split(Limit.TREE_JOIN_STR)
                                      const uuid = valueList[0]
                                      const name = valueList[1]
                                      const level = valueList[2]
                                      if(uuid === 'all'){
                                          dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'selectedKeys'], `all${Limit.TREE_JOIN_STR}1`))
                                          dispatch(editRunningActions.getInventoryAllCardList(categoryList,'showStockModal',true,1,''))
                                      } else {
                                          dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'selectedKeys'], `${uuid}${Limit.TREE_JOIN_STR}${name}${Limit.TREE_JOIN_STR}${level}`))
                                          dispatch(editRunningActions.getInventorySomeCardList(uuid,level,1,''))
                                      }
                                      this.setState({searchContent:'',uuid,level,name,currentPage:1})
                                  }
                              }}
                              selectedKeys={[(selectedKeys || `all${Limit.TREE_JOIN_STR}1`)]}
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
                  <TableAll className="contacts-table-right" style={{height:newThinglist.length > 5?'461px':'249px'}}>
                      <span className="lsqc-serch">
                                {/* <span className="lsqc-icon">搜索</span> */}
                                {/* <Icon className="lsqc-serch-icon" type="search"
                                    onClick={() => {
                                        // dispatch(lsqcActions.searchCardList(searchCardContent))
                                }}/> */}
                                <Search
                                    placeholder="搜索"
                                    className="lsqc-serch-input"
                                    value={searchContent}
                                    onChange={e => {
                                        this.setState({searchContent:e.target.value})
                                    }}
                                    onSearch={value => {
                                        if(uuid === 'all'){
                                            dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'selectedKeys'], `all${Limit.TREE_JOIN_STR}1`))
                                            dispatch(editRunningActions.getInventoryAllCardList(categoryList,'showStockModal',true,1,searchContent))
                                        } else {
                                            dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'selectedKeys'], `${uuid}${Limit.TREE_JOIN_STR}${name}${Limit.TREE_JOIN_STR}${level}`))
                                            dispatch(editRunningActions.getInventorySomeCardList(uuid,level,1,searchContent))
                                        }
                                        this.setState({currentPage:1})
                                    }}
                                />
                      </span>
                      <div className="table-title-wrap">
                          <ul className="table-title table-title-charge">
                              <li
                                  onClick={(e) => {
                                      e.stopPropagation()
                                      dispatch(editRunningActions.chargeItemCheckboxCheckAll(checkedAll,newThinglist,thingsList))
                                  }}
                              >
                                  <Checkbox
                                      checked={checkedAll}
                                  />
                              </li>
                              <li>
                                  <span>编号</span>
                              </li>
                              <li>
                                  <span>名称</span>
                              </li>
                          </ul>
                      </div>
                      <TableBody style={{height:thingsList && thingsList.toJS() > 5?'374px':'249px'}}>
                          {
                              thingsList && thingsList.toJS().map(v => {
                                  const checked = selectList.indexOf(v.uuid) > -1
                                  const string = `${v.code} ${v.name}`

                                  return <TableItem
                                      className='contacts-table-width-charge'
                                      key={v.uuid}
                                      onClick={(e) => {
                                          e.stopPropagation()

                                      }}
                                      >

                                      <li
                                          onClick={(e) => {
                                              e.stopPropagation()
                                              dispatch(editRunningActions.chargeItemCheckboxCheck(checked,v))
                                          }}
                                      >
                                          <Checkbox
                                              checked={checked}
                                          />
                                      </li>
                                      <li>{v.code}</li>
                                      <li>{v.name}</li>
                                  </TableItem>
                              })

                          }
                      </TableBody>
                      <TablePagination
                          size='small'
                          style={{marginTop:'10px'}}
                          currentPage={currentPage}
                          pageCount={pageCount}
                          paginationCallBack={(value) => {
                              if(uuid === 'all'){
                                  dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'selectedKeys'], `all${Limit.TREE_JOIN_STR}1`))
                                  dispatch(editRunningActions.getInventoryAllCardList(categoryList,'showStockModal',true,value,searchContent))
                              } else {
                                  dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'selectedKeys'], `${uuid}${Limit.TREE_JOIN_STR}${name}${Limit.TREE_JOIN_STR}${level}`))
                                  dispatch(editRunningActions.getInventorySomeCardList(uuid,level,value,searchContent))
                              }
                              this.setState({currentPage:value})
                          }}
                      />
                  </TableAll>
                </div>
                <div
                    className='charge-chosen-project'
                    >
                    选择存货：
                    {
                        selectItem && selectItem.map(v =>{
                            return <Tag closable onClose={(e) => {
                                e.preventDefault();
                                dispatch(editRunningActions.chargeItemCheckboxCheck(true, v.toJS()))
                            }}>{v.get('code')} {v.get('name')}</Tag>
                        })
                    }
                </div>
                <div style={{display:thingsListSize>0?'':'none',margin:'0 0 10px 20px'}}>
                    {thingsListSize}个存货
                </div>
            </Modal>
            )
    }

}
