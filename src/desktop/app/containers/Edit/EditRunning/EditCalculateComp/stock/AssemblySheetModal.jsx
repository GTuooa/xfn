import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Checkbox, Input, Modal, Tag, Tree, message } from 'antd'
const TreeNode = Tree.TreeNode
import {TableBody, TableItem, ItemTriangle, TableOver,Amount, TableAll, TablePagination } from 'app/components'

import { formatMoney, numberCalculate, numberFourTest, formatFour } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import { toJS ,fromJS } from 'immutable'
import { numberTest } from '../component/numberTest'
import InputFour from 'app/components/InputFour'
import XfIcon from 'app/components/Icon'
import InventorySerialModal from 'app/containers/Config/Inventory/SerialModal.jsx'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'

@immutableRenderDecorator
export default
class AssemblySheetModal extends React.Component {
    state = {
        inputValue:'',
        showEditSerial: false,
        curIndex: -1,
        curItem: fromJS([]),
        curItemSerialList: fromJS([])
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
            assemblySheet,
            temp,
            oriState,
            oriDate,
            selectTreeFunc,
            showSelectAll,
            assemblyNumber,
            cardPageObj,
            paginationCallBack,
        } = this.props
        const { showEditSerial, curIndex, curItem, curItemSerialList } = this.state
        const showThingsList = hasSearchContent  ? searchList : MemberList
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
        let selectThingList = []
        const newThinglist = thingsList.toJS().filter(v => this.state.inputValue ? v.code.indexOf(this.state.inputValue)> -1 || v.name.indexOf(this.state.inputValue)> -1 : true)
        const checkedAll = newThinglist.every(v => selectList.some(w => w === v.productUuid)) && newThinglist.length
        const thingsListSize = selectItem && selectItem.size || 0


        return (
            <Modal
                className='select-modal'
                title={'选择组装单'}
                visible={showCommonChargeModal}
                onCancel={() => {
                    cancel()
                    dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectedKeys', [`all${Limit.TREE_JOIN_STR}1`]))
                    dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectList', fromJS([])))
                    dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectItem', fromJS([])))
                }}
                onOk={() => {
                    let canSave = true
                    selectItem && selectItem.size && selectItem.map(item => {
                        if(!Number(item.get('curQuantity'))){
                            canSave = false
                        }
                    })
                    if(canSave){
                        cancel()
                        callback(assemblySheet,selectItem)
                        dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectedKeys', [`all${Limit.TREE_JOIN_STR}1`]))
                        dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectList', fromJS([])))
                        dispatch(editCalculateActions.changeEditCalculateCommonState('commonCardObj', 'selectItem', fromJS([])))
                    }else{
                        message.info('请输入勾选组装单的数量')
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
                                        this.setState({inputValue:e.target.value})
                                    }}
                                />
                      </span>
                      <div className="table-title-wrap">
                          <ul className="table-title table-title-stock">
                              <li
                                  onClick={(e) => {
                                      e.stopPropagation()
                                      dispatch(editCalculateActions.changeItemCheckboxCheckAll(checkedAll,newThinglist,thingsList, true))
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
                              <li>
                                  <span>数量</span>
                              </li>
                              <li>
                                  <span>单位</span>
                              </li>
                          </ul>
                      </div>
                      <TableBody>
                          {
                              thingsList && thingsList.toJS().map((v,index) => {
                                  const cardUuid =  v.productUuid
                                  const checked = selectList.indexOf(cardUuid) > -1
                                  const string = `${v.code} ${v.name}`
                                  let curQuantity = '', curSerialList= curItemSerialList
                                  selectItem.map( (item,k) => {
                                      if(item.get('index') === index){
                                          curQuantity = item.get('curQuantity')
                                          curSerialList = item.get('serialList')
                                      }
                                  })


                                  return (string.indexOf(this.state.inputValue)>-1 || string.indexOf(this.state.inputValue.toUpperCase())>-1 || string.indexOf(this.state.inputValue.toLowerCase())>-1) ?
                                  <TableItem
                                      className='contacts-table-width-stock'
                                      key={cardUuid}
                                      onClick={(e) => {
                                          e.stopPropagation()

                                      }}
                                      >

                                      <li
                                          onClick={(e) => {
                                              e.stopPropagation()
                                              dispatch(editCalculateActions.changeItemCheckboxCheck(checked, v,true,index))
                                          }}
                                      >
                                          <Checkbox
                                              checked={checked }
                                          />
                                      </li>
                                      <li>{v.code}</li>
                                      <li>{v.name}</li>
                                      <li>
                                        {
                                            v.financialInfo && v.financialInfo.openSerial && checked ?
                                            <span
                                                onClick={() => {
                                                    this.setState({
                                                        showEditSerial:true,
                                                        curIndex: index,
                                                        curItem: fromJS(v),
                                                        curItemSerialList: curSerialList,
                                                    })

                                                }}
                                                style={{color: '#1790ff'}}
                                                className={''}
                                                >
                                                {Number(curQuantity) ? formatFour(Number(curQuantity)) : '点击输入'}
                                                <XfIcon type='edit-pen'/>
                                            </span> :
                                             <InputFour
                                                 disabled={!checked}
                                                 value={curQuantity}
                                                 onChange={(e)=>{
                                                     numberFourTest(e, (value) => {
                                                         selectItem.map( (item,k) => {
                                                             if(item.get('index') === index){
                                                                 dispatch(editCalculateActions.changeEditCalculateCommonString('',['commonCardObj','selectItem',k,'curQuantity'],value))
                                                             }
                                                         })

                                                     })
                                                 }}
                                                 PointDisabled={true}
                                             />
                                        }

                                      </li>
                                      <li>{v.unitName}</li>

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
                            return <div style={{display: 'inline-block',marginRight: '10px'}}>
                                <Tag closable onClose={(e) => {
                                    e.preventDefault();
                                    dispatch(editCalculateActions.changeItemCheckboxCheck(true, v.toJS()))
                                }}>{v.get('code')} {v.get('name')}</Tag>
                                <Icon type="close" />{v.get('curQuantity') ? v.get('curQuantity') : 0} {v.get('unitName') ? v.get('unitName') : ''}

                            </div>
                        })
                    }
                </div>
                <div style={{display:thingsListSize>0?'':'none',margin:'0 0 10px 20px'}}>
                    {thingsListSize}个组装单
                </div>
                {
                    showEditSerial ?
                    <InventorySerialModal
                        visible={true}
                        dispatch={dispatch}
                        serialList={curItemSerialList || fromJS([])}
                        item={curItem}
                        onClose={()=>{this.setState({showEditSerial: false})}}
                        onOk={curSerialList => {
                            selectItem.map( (item,k) => {
                                if(item.get('index') === curIndex){
                                    dispatch(editCalculateActions.changeEditCalculateCommonString('',['commonCardObj','selectItem',k,'curQuantity'],curSerialList.length))
                                    dispatch(editCalculateActions.changeEditCalculateCommonString('',['commonCardObj','selectItem',k,'serialList'],fromJS(curSerialList)))
                                }
                            })
                        }}
                    /> : ''
                }
            </Modal>
            )
    }

}
