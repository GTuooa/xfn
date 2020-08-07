import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Checkbox, Input, Modal, Tag, Tree } from 'antd'
import { Icon } from 'app/components'
const TreeNode = Tree.TreeNode
import {TableBody, TableItem, ItemTriangle, TableOver,Amount, TableAll, TablePagination } from 'app/components'

import * as Limit from 'app/constants/Limit.js'
import { toJS ,fromJS } from 'immutable'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'

@immutableRenderDecorator
export default
class CountStockModal extends React.Component {
    constructor() {
		super()
		this.state = {
            inputValue:'',
            uuid:'all',
            level:''
		}
	}
    render() {
        const {
            dispatch,
            MemberList,
            searchCardContent,
            searchList,
            hasSearchContent,
            thingsList,
            selectedKeys,
            showCommonChargeModal,
            selectItem,
            selectList,
            cancel,
            callback,
            stockCard,
            temp,
            oriState,
            oriDate,
            selectTreeFunc,
            showSelectAll,
            stockTemplate,
            needSpliceChoosedStock,
            notNeedChangeStockItem,
            hasNumber,
            getNumberCallback,
            needConcat,
            cardPageObj,
            paginationCallBack,
        } = this.props
        const { uuid,level } = this.state
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
        const stringCombo = thingsList && thingsList.map(v => {
            return {
                string:`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`,
                uuid:v.get('uuid')
            }
        })
        let selectThingList = []
        const newThinglist = thingsList.toJS().filter(v => this.state.inputValue ? v.code.indexOf(this.state.inputValue)> -1 || v.name.indexOf(this.state.inputValue)> -1 : true)
        const uuidString = 'uuid'
        const checkedAll = newThinglist.every(v => selectList.some(w => w === v[uuidString]))
        return (
            <Modal
                className='select-modal'
                title={'选择存货'}
                visible={showCommonChargeModal}
                onCancel={() => {
                    cancel()
                    dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectedKeys', [`all${Limit.TREE_JOIN_STR}1`]))
                    dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectList', fromJS(selectList)))
                    dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectItem', fromJS(selectItem)))
                    dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'hasNumber', true))
                }}
                onOk={() => {
                    cancel()
                    const newStockList = needConcat ? stockCard.concat(selectItem) : selectItem
                    !notNeedChangeStockItem && dispatch(editCalculateActions.changeSelectStock(newStockList,temp,stockTemplate,true))

                    callback(selectItem)
                    dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectedKeys', [`all${Limit.TREE_JOIN_STR}1`]))
                    dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'hasNumber', true))
                }}
                width="800px"
            >
                <div className='lsqc-contacts-card-top count-stock-modal'>
                    <div className="table-tree-container" style={{height:newThinglist.length > 5?'461px':'286px'}}>
                          <Tree
                              defaultExpandAll={true}
                              onSelect={value => {

                                  if (value[0]) {
                                      const valueList = value[0].split(Limit.TREE_JOIN_STR)
                                      const uuid = valueList[0]
                                      const level = valueList[2]
                                      selectTreeFunc(uuid,level)
                                      dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectedKeys',value))
                                      this.setState({
                                          uuid,level
                                      })
                                  }
                              }}
                              selectedKeys={selectedKeys}
                              >
                                  <TreeNode
                                            key={`all${Limit.TREE_JOIN_STR}1`}
                                            title={'全部'}
                                            checkable
                                        />
                                  {treeList}
                          </Tree>
                    </div>
                  <TableAll className="contacts-table-right" style={{height:newThinglist.length > 5?'461px':'286px'}}>
                      <span className="lsqc-serch">
                        <span className='count-search'>
                            <Icon className="lsqc-serch-icon" type="search" />
                            <Input placeholder="搜索"
                                className="lsqc-serch-input"
                                onChange={e => {
                                    this.setState({inputValue:e.target.value})
                                }}
                            />
                        </span>
                        <span className='count-number' onClick={()=> {
                            getNumberCallback(!hasNumber,uuid,level)
                            dispatch(editCalculateActions.changeEditCalculateCommonState('views', 'hasNumber', !hasNumber))
                        }}>
                            <Checkbox checked={hasNumber} />&nbsp;
                            仅显示有数量的存货
                        </span>
                      </span>
                      <div className="table-title-wrap">
                          <ul className="table-title table-title-charge">
                              <li
                                  onClick={(e) => {
                                      e.stopPropagation()
                                      const isCardUuid = false
                                      showSelectAll && dispatch(editCalculateActions.changeItemCheckboxCheckAll(checkedAll,newThinglist,thingsList,false,isCardUuid))
                                  }}
                              >
                              {
                                  showSelectAll ?
                                  <Checkbox
                                    checked={checkedAll}
                                  /> : null
                              }
                              </li>
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
                              thingsList && thingsList.toJS().map(v => {
                                  const cardUuid =  v.uuid
                                  const checked = selectList.indexOf(cardUuid) > -1
                                  const string = `${v.code} ${v.name}`

                                  return (string.indexOf(this.state.inputValue)>-1 || string.indexOf(this.state.inputValue.toUpperCase())>-1 || string.indexOf(this.state.inputValue.toLowerCase())>-1) ? <TableItem
                                      className='contacts-table-width-charge'
                                      key={cardUuid}
                                      onClick={(e) => {
                                          e.stopPropagation()

                                      }}
                                      >

                                      <li
                                          onClick={(e) => {
                                              e.stopPropagation()
                                              dispatch(editCalculateActions.changeItemCheckboxCheck(checked, v))
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
                <div
                    style={{margin:'0 0 10px 20px'}}
                    >
                    选择存货：
                    {
                        selectItem && selectItem.map(v =>{
                            return <Tag closable onClose={(e) => {
                                e.preventDefault();
                                dispatch(editCalculateActions.changeItemCheckboxCheck(true, v.toJS()))
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
