import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Checkbox, Input, Modal, Tag, Tree } from 'antd'
const TreeNode = Tree.TreeNode
import {TableBody, TableItem, ItemTriangle, TableOver,Amount, TableAll} from 'app/components'

import * as Limit from 'app/constants/Limit.js'
import { toJS ,fromJS } from 'immutable'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

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
            selectTreeFunc,
            showSelectAll,
            stockTemplate,
            stockCardIdList,
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
        // const stringCombo = thingsList && thingsList.map(v => {
        //     return {
        //         string:`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`,
        //         uuid:v.get('uuid')
        //     }
        // })
        // let selectThingList = []
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
                    // cancel()
                    // dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectedKeys', [`all${Limit.TREE_JOIN_STR}1`]))
                    // dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectList', fromJS([])))
                    // dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectItem', fromJS([])))

                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['views', 'showStockModal'], false))
                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectedKeys', [`all${Limit.TREE_JOIN_STR}1`]))
                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS([])))
                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectItem', fromJS([])))
                }}
                onOk={() => {
                    // cancel()
                    // const newStockList = needSpliceChoosedStock ? selectItem : stockCard.concat(selectItem)
                    selectItem.size && dispatch(searchApprovalActions.changeSelectStock(stockCard.concat(selectItem),temp,stockTemplate))
                    callback()
                    // dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectedKeys', [`all${Limit.TREE_JOIN_STR}1`]))
                    // dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectList', fromJS([])))
                    // dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectItem', fromJS([])))

                    // dispatch(searchApprovalActions.changeSearchApprovalCommonChargeInvnetory(stockCardList,selectItem))

                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString(['views', 'showStockModal'], false))
                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectedKeys', [`all${Limit.TREE_JOIN_STR}1`]))
                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS([])))
                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectItem', fromJS([])))
                }}
                width="800px"
            >
                <div className='lsqc-contacts-card-top'>
                    <div className="table-tree-container" style={{height:newThinglist.length > 5?'461px':'249px'}}>
                          <Tree
                              defaultExpandAll={true}
                              onSelect={value => {

                                  if (value[0]) {
                                      const valueList = value[0].split(Limit.TREE_JOIN_STR)
                                      const uuid = valueList[0]
                                      const level = valueList[2]
                                      selectTreeFunc(uuid,level)
                                      dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectedKeys', value))
                                    //   dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectedKeys',value))
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
                  <TableAll className="contacts-table-right" style={{height:newThinglist.length > 5?'461px':'249px'}}>
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
                                    //   showSelectAll && dispatch(editCalculateActions.changeItemCheckboxCheckAll(checkedAll,allThingsList,thingsList,false,isCardUuid))
                                      showSelectAll && dispatch(searchApprovalActions.changeSearchApprovalhideCategoryItemCheckboxCheckAll(checkedAll,allThingsList,thingsList,false,isCardUuid))

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
                                      >

                                      <li
                                          onClick={(e) => {
                                              e.stopPropagation()
                                            //   !disabled && dispatch(editCalculateActions.changeItemCheckboxCheck(checked, v))
                                              !disabled && dispatch(searchApprovalActions.changeSearchApprovalhideCategoryItemCheckboxCheck(checked, v))
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
