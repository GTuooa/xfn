import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Checkbox, Button, message, Tooltip, Input, Modal, Tag, Tree } from 'antd'
const TreeNode = Tree.TreeNode
import {TableBody, TableItem, ItemTriangle, TableOver,Amount, TableAll} from 'app/components'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import * as accountConfActions from 'app/redux/Config/Account/account.action'
import * as lrCalculateActions from 'app/redux/Edit/LrAccount/lrCalculate/lrCalculate.action'

import * as lsqcActions	from 'app/redux/Config/Lsqc/lsqc.action.js'
import { formatNum } from 'app/utils'
import TreeContain from './TreeContain.jsx'
import * as Limit from 'app/constants/Limit.js'
import { toJS, is ,fromJS } from 'immutable'
const InputGroup = Input.Group;

@immutableRenderDecorator
export default
class QcModal extends React.Component {

  render() {
    const {
        dispatch,
        contactsCategory,
        curCategory,
        curAccountUuid,
        issuedate,
        main,
        currentPage,
        pageCount,
        // taxRateTemp,
        flags,
        hideCategoryList,
        disabledChangeCategory,
        // cardTemp,
        PageTab,
        MemberList,
        showContactsModal,
        selectList,
        searchCardContent,
        searchList,
        changeInputValue,
        hasSearchContent,
        thingsList,
        selectThingsList,
        currentCardType,
        palceTemp,
        modalName,
        runningState,
        categoryTypeObj,
        fromCarryOver,
        categoryUuid,
        runningDate,
        contactsRange,
        stockRange,
        selectedKeys,
        projectRange,
        index,
        curAmount,
        fromDepreciation,
        DepreciationTemp
    } = this.props
    const cardRange = currentCardType === 'stock' ? stockRange : contactsRange
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
      const stringCombo = thingsList.map(v => {
          return {
              string:`${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`,
              uuid:v.get('uuid')
          }
      })
      let selectThingList = []
    return (
      <Modal
        className='no-foot select-modal'
        title={`选择${currentCardType === 'stock'?'存货':currentCardType === 'project'?'项目':'往来单位'}`}
        visible={showContactsModal}
        onCancel={() => {
            dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'showContactsModal'], false))
            dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'selectedKeys'], ''))
        }}
        width="474px"
        height="346px"
        >
          <div className='lsqc-contacts-card-top'>
            {/* <TreeContain
              flags={flags}
              currentPage={currentPage}
              curAccountUuid={curAccountUuid}
              issuedate={issuedate}
              pageCount={pageCount}
              hideCategoryList={hideCategoryList}
              dispatch={dispatch}
              curCategory={curCategory}
              contactsCategory={contactsCategory}
              PageTab={PageTab}
            /> */}
				<div className="table-tree-container">
                    <Tree
                        defaultExpandAll={true}
                        onSelect={value => {

                            if (value[0]) {
                                const valueList = value[0].split(Limit.TREE_JOIN_STR)
                                const uuid = valueList[0]
                                const level = valueList[2]
                                if(palceTemp === 'calculate'){
                                    if(uuid === 'all'){
                                        dispatch(lrAccountActions.getAllManagesCardList(currentCardType,runningState,cardRange,modalName))
                                    }else{
                                        dispatch(lrAccountActions.getCalculateCardList(runningDate,uuid,level))
                                    }
                                }else{
                                    if(fromCarryOver){

                                        if(uuid === 'all'){
                                            dispatch(lrAccountActions.getCostStockList(runningDate,runningState))
                                        } else {
                                            dispatch(lrAccountActions.getCostCardTypeList(runningDate,runningState,uuid,level))
                                        }
                                    }else{
                                        if (currentCardType === 'project') {
                                            if(uuid === 'all'){
                                                dispatch(lrAccountActions.getProjectAllCardList(projectRange,modalName,true))
                                            } else {
                                                dispatch(lrAccountActions.getProjectSomeCardList(uuid,level))
                                            }
                                        } else {
                                            if(uuid === 'all'){
                                                dispatch(lrAccountActions.getAllCardList(currentCardType,runningState,cardRange,modalName))
                                            } else {
                                                dispatch(lrAccountActions.getCurrentCardList(currentCardType,runningState,uuid,level))
                                            }
                                        }

                                    }
                                }

                                dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'selectedKeys'], value[0]))
                            }
                        }}
                        selectedKeys={[selectedKeys]}
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
            <TableAll className="contacts-table-right">
              <span className="lsqc-serch">
                  <span className="lsqc-icon">搜索</span>
                        <Icon className="lsqc-serch-icon" type="search"
                            onClick={() => {
                                dispatch(lsqcActions.searchCardList(searchCardContent))
                            }}/>
                            <Input placeholder=""
                                className="lsqc-serch-input"
                                // value={searchCardContent}
                                onChange={e => {
                                if(e.target.value) {
                                    let selectList = stringCombo.filter(v => v.string.indexOf(e.target.value)>-1)
                                    dispatch(lrAccountActions.searchCardList(true,selectList))
                                } else {
                                    dispatch(lrAccountActions.searchCardList(false,thingsList))
                                }
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
                      selectThingsList.toJS().map(v => {
                          return <TableItem
                                    className='contacts-table-width cursor'
                                    key={v.uuid}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        const place = currentCardType === 'stock' ? [categoryTypeObj,'stockCardList',index] : [categoryTypeObj,'contactsCardRange']
                                        if (palceTemp === 'calculate') {

                                            dispatch(lrAccountActions.changeLrAccountCommonString(palceTemp, 'usedCard' ,fromJS({uuid:v.uuid,name:v.name,code:v.code})))
                                            dispatch(lrAccountActions.changeLrAccountCommonString(palceTemp, 'cardUuid' , v.uuid))
                                            if(runningDate) {
                                                dispatch(lrAccountActions.getBusinessList(runningDate,  v.uuid))
                                            }
                                        } else {
                                            if (currentCardType === 'project') {
                                                if(fromDepreciation){
                                                    const amount = DepreciationTemp.get('amount')
                                                    dispatch(lrCalculateActions.changeLrCalculateCommonState('DepreciationTemp', 'projectCard', fromJS({uuid:v.uuid,name:v.name,code:v.code,amount})))
                                                } else if (palceTemp === 'Cqzc') {
                                                  dispatch(lrAccountActions.changeLrAccountCommonString(palceTemp,['detail','projectCard',index] ,fromJS({uuid:v.uuid,name:v.name,code:v.code,amount:curAmount})))
                                                } else{
                                                    dispatch(lrAccountActions.changeLrAccountCommonString(palceTemp,['projectCard',index] ,fromJS({uuid:v.uuid,name:v.name,code:v.code,amount:curAmount})))
                                                }

                                            } else if (currentCardType === 'stock') {
                                                dispatch(lrAccountActions.changeLrAccountCommonString(palceTemp, place ,fromJS({uuid:v.uuid,name:v.name,code:v.code,amount:curAmount})))
                                                dispatch(lrAccountActions.changeLrAccountCommonString('card', [categoryTypeObj, 'carryoverCardList', index] , fromJS({uuid:v.uuid,name:v.name,code:v.code})))
                                            } else {
                                                dispatch(lrAccountActions.changeLrAccountCommonString(palceTemp, place ,fromJS({uuid:v.uuid,name:v.name,code:v.code})))
                                            }
                                            if(fromCarryOver){
                                                const amount = v.amount
                                                const uuid = v.uuid
                                                const name = v.name
                                                const code = v.code
                                                dispatch(lrCalculateActions.changeCalculateCommonString('costTransfer', 'cardUuid', v.uuid))
												dispatch(lrCalculateActions.changeCalculateCommonString('costTransfer',['stockCardList',index], fromJS({uuid:v.uuid,name:v.name,code:v.code})))
                                                dispatch(lrCalculateActions.changeCalculateCommonString('costTransfer', 'stockCardRange', fromJS({uuid:v.uuid,name:v.name,code:v.code})))
                                                dispatch(lrCalculateActions.getCostTransferList(runningState, runningDate))
												dispatch(lrCalculateActions.changeCalculateCommonString('costTransfer', ['stockCardList',index,'amount'], ''))
                                            }
                                        }
                                        dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', modalName], false))
                                    }}
                                >
                                <li>{v.code}</li>
                                <li>{v.name}</li>
                                </TableItem>
                            })
                    }
                </TableBody>
            </TableAll>
        </div>




      </Modal>
  )
  }
}
