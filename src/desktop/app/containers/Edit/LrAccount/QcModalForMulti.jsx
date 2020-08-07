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
class MultipleModal extends React.Component {
    state = {
        inputValue:''
    }
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
        showCommonChargeModal,
        selectItem,
        selectList,
        cancel,
        projectCard
    } = this.props
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
        className='select-modal'
        title={'选择项目'}
        visible={showCommonChargeModal}
        onCancel={() => {
            cancel()
            dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'selectedKeys'], ''))
            dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'selectList'], fromJS([])))
            dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'selectItem'], fromJS([])))
        }}
        onOk={() => {
            cancel()
            dispatch(lrAccountActions.changeLrAccountCommonString('commonCharge','projectCard',projectCard.concat(selectItem)))
            dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'selectedKeys'], ''))
            dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'selectList'], fromJS([])))
            dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'selectItem'], fromJS([])))
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
                                if(uuid === 'all'){
                                    dispatch(lrAccountActions.getChargeProjectCard())
                                } else {
                                    dispatch(lrAccountActions.getProjectSomeCardList(uuid,level))
                                }
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
                  <li></li>
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
      						selectThingsList && selectThingsList.toJS().map(v => {
                                const checked = selectList.indexOf(v.uuid) > -1
                                const disabled = projectCard.some(w => w.get('uuid') === v.uuid)
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
                                            !disabled && dispatch(lrAccountActions.chargeItemCheckboxCheck(checked, v.uuid,v.code,v.name))
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
              className='charge-chosen-project'
              >
              选择项目：
              {
                  selectThingsList.map(v =>{
                      const showTag = selectList.indexOf(v.get('uuid')) > -1
                      return showTag ? <Tag closable onClose={() => {
                          dispatch(lrAccountActions.chargeItemCheckboxCheck(true, v.get('uuid')))
                      }}>{v.get('code')} {v.get('name')}</Tag> : ''
                  })
              }
          </div>




      </Modal>
  )
  }
}
