import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Checkbox, Input, Modal, Tag, Tree } from 'antd'
const TreeNode = Tree.TreeNode
import {TableBody, TableItem, ItemTriangle, TableOver,Amount, TableAll, Icon} from 'app/components'

import * as Limit from 'app/constants/Limit.js'
import { toJS ,fromJS } from 'immutable'

// import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
// import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'
import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@immutableRenderDecorator
export default
class MultipleModal extends React.Component {
    state = {
        inputValue:''
    }
    render() {
        const {
            dispatch,
            MemberList,
            searchList,
            hasSearchContent,
            thingsList,   
            selectedKeys,
            showModal,
            selectItem,
            selectList,
            stockCardList,
            categoryList
        } = this.props
        // const showThingsList = hasSearchContent  ? searchList : MemberList
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
        // const stringCombo = thingsList.map(v => {
        //     return {
        //         string:`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`,
        //         uuid:v.get('uuid')
        //     }
        // })
        // let selectThingList = []

        const newThinglist = thingsList.toJS().filter(v => this.state.inputValue ? v.code.indexOf(this.state.inputValue)> -1 || v.name.indexOf(this.state.inputValue)> -1 : true)
        const checkedAll = newThinglist.every(v => selectList.some(w => w === v.uuid)) && newThinglist.length

        return (
            <Modal
              className='select-modal'
              title={'选择存货'}
              visible={showModal}
              onCancel={() => {
                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['views', 'showStockModal'], false))
                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectedKeys', ''))
                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS([])))
                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectItem', fromJS([])))
              }}
              onOk={() => {
                  dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['views', 'showStockModal'], false))
                  dispatch(searchApprovalActions.changeSearchApprovalCommonChargeInvnetory(stockCardList,selectItem))
                  dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectedKeys', ''))
                  dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS([])))
                  dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectItem', fromJS([])))
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
                                          dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectedKeys', `all${Limit.TREE_JOIN_STR}1`))
                                          dispatch(searchApprovalActions.getInventoryAllCardList(categoryList,'showStockModal'))
                                      } else {
                                          dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectedKeys', `${uuid}${Limit.TREE_JOIN_STR}${name}${Limit.TREE_JOIN_STR}${level}`))
                                          dispatch(searchApprovalActions.getInventorySomeCardList(uuid,level))
                                      }
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
                                <Icon className="lsqc-serch-icon" type="search"/>
                                <Input placeholder="搜索"
                                    className="lsqc-serch-input"
                                    style={{paddingLeft: 10}}
                                    onChange={e => {
                                        this.setState({inputValue:e.target.value})
                                    }}
                                />
                      </span>
                      <div className="table-title-wrap">
                          <ul className="table-title table-title-charge">
                              <li
                                  onClick={(e) => {
                                      e.stopPropagation()
                                      dispatch(searchApprovalActions.chargeSearchApprovalItemCheckboxCheckAll(checkedAll,newThinglist,thingsList))
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

                                  return string.indexOf(this.state.inputValue)>-1?<TableItem
                                      className='contacts-table-width-charge'
                                      key={v.uuid}
                                      onClick={(e) => {
                                          e.stopPropagation()

                                      }}
                                      >

                                      <li
                                          onClick={(e) => {
                                              e.stopPropagation()
                                              dispatch(searchApprovalActions.chargeSearchApprovalItemCheckboxCheck(checked, v.uuid,v.code,v.name,v.isOpenQuantity,v.unitPriceList,v.unit))
                                          }}
                                      >
                                          <Checkbox
                                              checked={checked}
                                          />
                                      </li>
                                      <li>{v.code}</li>
                                      <li>{v.name}</li>
                                  </TableItem>:''
                              })

                          }
                      </TableBody>
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
                                dispatch(searchApprovalActions.chargeSearchApprovalItemCheckboxCheck(true, v.get('uuid')))
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
