import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Checkbox, Input, Modal, Tag, Tree } from 'antd'
const TreeNode = Tree.TreeNode
import {TableBody, TableItem, ItemTriangle, TableOver,Amount, TableAll} from 'app/components'

import * as Limit from 'app/constants/Limit.js'
import { toJS ,fromJS } from 'immutable'

import * as editInventoryCardActions from 'app/redux/Config/Inventory/editInventoryCard.action.js'

@immutableRenderDecorator
export default
class MultipleModal extends React.Component {
    state = {
        inputValue:''
    }
    closeModal = () => {
        this.props.dispatch(editInventoryCardActions.changeInventoryCardViews('showStockModal', false))
        this.props.dispatch(editInventoryCardActions.changeInventoryCardViews('materialSelectedKeys', ''))
        this.props.dispatch(editInventoryCardActions.changeInventoryCardViews('selectList', fromJS([])))
        this.props.dispatch(editInventoryCardActions.changeInventoryCardViews('selectItem', fromJS([])))
    }
    render() {
        const {
            dispatch,
            MemberList,
            searchCardContent,
            searchList,
            hasSearchContent,
            thingsList,
            materialSelectedKeys,
            showModal,
            selectItem,
            selectList,
            cancel,
            materialList,
            categoryList,
            code
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
        const stringCombo = thingsList.map(v => {
            return {
                string:`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`,
                uuid:v.get('uuid')
            }
        })
        let selectThingList = []
        const newThinglist = thingsList.toJS().filter(v => this.state.inputValue ? v.code.indexOf(this.state.inputValue)> -1 || v.name.indexOf(this.state.inputValue)> -1 : true).filter(v => v.code !== code)
        const checkedAll = newThinglist.every(v => selectList.some(w => w === v.uuid)) && newThinglist.length
        return (
            <Modal
              className='select-modal'
              title={'选择存货'}
              visible={showModal}
              onCancel={() => {
                  this.closeModal()
              }}
              onOk={() => {
                  let materialListJ = materialList.toJS()
                  let selectItemJ = selectItem.toJS().map(v => {
                      v.materialUuid = v.uuid
                      if (v.unitList.length ===1) {
                          v.unitUuid = v.unitList[0].uuid
                          v.unitName = v.unitList[0].name
                      }
                      return v
                  })
                  this.closeModal()
                  dispatch(editInventoryCardActions.changeInventoryInnerSrting(['assemblySheet','materialList'],  fromJS(materialListJ.concat(selectItemJ))))
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
                                          dispatch(editInventoryCardActions.changeInventoryCardViews('materialSelectedKeys', `all`))
                                          dispatch(editInventoryCardActions.getInventoryAllCardList([],'showStockModal'))
                                      } else {
                                          dispatch(editInventoryCardActions.changeInventoryCardViews('materialSelectedKeys', `${uuid}${Limit.TREE_JOIN_STR}${name}${Limit.TREE_JOIN_STR}${level}`))
                                          dispatch(editInventoryCardActions.getInventorySomeCardList(uuid,level))
                                      }
                                  }
                              }}
                              selectedKeys={[(materialSelectedKeys || `all`)]}
                              >
                                  <TreeNode
                                            key={`all`}
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
                                <Icon className="lsqc-serch-icon" type="search"
                                    onClick={() => {
                                        // dispatch(lsqcActions.searchCardList(searchCardContent))
                                }}/>
                                <Input placeholder="搜索"
                                    className="lsqc-serch-input"
                                    style={{paddingLeft: 10}}
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
                                      dispatch(editInventoryCardActions.chargeItemCheckboxCheckAll(checkedAll,newThinglist,thingsList))
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
                      <TableBody>
                          {
                              newThinglist && newThinglist.map(v => {
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
                                              let unitList = v.unit.unitList || []
                                              unitList.unshift({uuid:v.unit.uuid,name:v.unit.name})
                                              dispatch(editInventoryCardActions.chargeItemCheckboxCheck(checked, v.uuid,v.code,v.name,unitList))
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
                            return <Tag closable onClose={() => {
                                dispatch(editInventoryCardActions.chargeItemCheckboxCheck(true, v.get('uuid')))
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
