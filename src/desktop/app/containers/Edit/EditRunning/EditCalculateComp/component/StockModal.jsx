import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Checkbox, Input, Modal, Tag, Tree, message } from 'antd'
const TreeNode = Tree.TreeNode
import {TableBody, TableItem, ItemTriangle, TableOver,Amount, TableAll, TablePagination } from 'app/components'

import * as Limit from 'app/constants/Limit.js'
import { toJS ,fromJS } from 'immutable'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'

@immutableRenderDecorator
export default
class StockModal extends React.Component {
    state = {
        inputValue:''
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
            stockAllLength,
            temp,
            oriState,
            oriDate,
            selectTreeFunc,
            showSelectAll,
            stockTemplate,
            needSpliceChoosedStock,
            stockCardIdList,
            cardPageObj,
            paginationCallBack,
        } = this.props
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
        const uuidString = temp === 'CostTransfer' ? 'cardUuid' : 'uuid'
        const canChooseThingsList = (temp === 'CostTransfer') && stockCardIdList ? newThinglist.filter(v => stockCardIdList.indexOf(v[uuidString]))  : newThinglist
        const checkedAll = canChooseThingsList.every(v => selectList.some(w => w === v[uuidString])) && (canChooseThingsList.length || newThinglist.length )
        return (
            <Modal
                className='select-modal'
                title={'选择存货'}
                visible={showCommonChargeModal}
                onCancel={() => {
                    cancel()
                    dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectedKeys', [`all${Limit.TREE_JOIN_STR}1`]))
                    dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectList', fromJS([])))
                    dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectItem', fromJS([])))
                }}
                onOk={() => {
                    const newList = stockCard.concat(selectItem)
                    const maxSize = oriState === 'STATE_CHDB' ? Limit.STOCK_MAX_NUMBER_ONE : Limit.STOCK_MAX_NUMBER_TWO
                    const stockLength  = oriState === 'STATE_CHZZ_ZZCX' ? stockAllLength : newList.size
                    if(thingsListSize <= maxSize ){
                        cancel()
                        const newStockList = needSpliceChoosedStock ? selectItem : stockCard.concat(selectItem)
                        selectItem.size && dispatch(editCalculateActions.changeSelectStock(stockCard.concat(selectItem),temp,stockTemplate))
                        callback(stockCard.concat(selectItem))
                        dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectedKeys', [`all${Limit.TREE_JOIN_STR}1`]))
                        dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectList', fromJS([])))
                        dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectItem', fromJS([])))
                    }else{
                        message.info(`所选存货总数不可超过${maxSize}个`)
                    }

                }}
                width="800px"
            >
                <div className='lsqc-contacts-card-top'>
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
                                  }
                              }}
                              selectedKeys={selectedKeys}
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
                  <TableAll className="contacts-table-right" style={{height:newThinglist.length > 5?'461px':'286px'}}>
                      <span className="lsqc-serch">
                                <Icon className="lsqc-serch-icon" type="search"
                                    onClick={() => {
                                        // dispatch(lsqcActions.searchCardList(searchCardContent))
                                }}/>
                                <Input placeholder="搜索"
                                    className="lsqc-serch-input"
                                    // value={searchCardContent}
                                    onChange={e => {
                                        // if(e.target.value) {
                                        //     let selectList = stringCombo.filter(v => v.string.indexOf(e.target.value)>-1)
                                        //     dispatch(lrAccountActions.searchCardList(true,selectList))
                                        // } else {
                                        //     dispatch(lrAccountActions.searchCardList(false,thingsList))
                                        // }
                                        this.setState({inputValue:e.target.value})
                                    }}
                                />
                      </span>
                      <div className="table-title-wrap">
                          <ul className="table-title table-title-charge">
                              <li
                                  onClick={(e) => {
                                      e.stopPropagation()
                                      const isCardUuid = temp === 'CostTransfer' ? true : false

                                      const allThingsList = (temp === 'CostTransfer') && stockCardIdList ? newThinglist.filter(v => stockCardIdList.indexOf(v[uuidString]))  : newThinglist
                                      showSelectAll && dispatch(editCalculateActions.changeItemCheckboxCheckAll(checkedAll,allThingsList,thingsList,false,isCardUuid))
                                  }}
                              >
                              {
                                  showSelectAll ?
                                  <Checkbox
                                    disabled={stockCardIdList && stockCardIdList.length === newThinglist.length}
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
                                  const cardUuid = temp === 'Stock' || temp === 'Balance' || temp === 'StockBuildUp' || temp === 'StockIntoProject' || temp === 'ProjectCarryover'  ? v.uuid : v.cardUuid
                                  const checked = selectList.indexOf(cardUuid) > -1
                                  const disabled = oriState === 'STATE_YYSR_ZJ' || temp === 'StockBuildUp' || temp === 'StockIntoProject' || temp === 'ProjectCarryover' || temp === 'Balance' || temp === 'Stock' ? false : stockCard.some(w => w.get('cardUuid') === cardUuid)
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
                                              !disabled && dispatch(editCalculateActions.changeItemCheckboxCheck(checked, v))
                                          }}
                                      >
                                          <Checkbox
                                              disabled={disabled}
                                              checked={checked || disabled}
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
                    className='charge-chosen-project'
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
