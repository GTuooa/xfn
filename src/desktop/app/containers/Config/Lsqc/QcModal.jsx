import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { toJS, fromJS } from 'immutable'

import { Checkbox, message, Input, Modal, Tag } from 'antd'
import { TableBody, TableItem, TableAll, TablePagination, Icon } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

import TreeContains from './TreeContains.jsx'

import * as lsqcActions	from 'app/redux/Config/Lsqc/lsqc.action.js'

@immutableRenderDecorator
export default
class QcModal extends React.Component {

    static displayName = 'QcModal'

    constructor() {
		super()
		this.state = {
            selectTreeUuid: '',
            selectTreeLevel: 0,
		}
	}

    render() {
        const {
            dispatch,
			contactsCategory,
			curCategory,
			hideCategoryList,
            MemberList,
            thingsList,
            showContactsModal,
            selectList,
            selectItem,
            searchCardContent,
            searchList,
            changeInputValue,
            curModal,
            addItemProperty,
            addItemInventoryNature,
            cantChooseList,
            hasSearchContent,
            isDefinite,
            changeQcList,
            isCheckOut,
            flags,
            cardPageObj,
        } = this.props
        const { selectTreeUuid, selectTreeLevel } = this.state
        const getNum = (v)=>{
            let amountNum
            switch(addItemProperty){
                case 'NEEDIN':
                    amountNum = v.get('receivableOpened')
                    break
                case 'PREIN':
                    amountNum = v.get('advanceOpened')
                    break
                case 'NEEDPAY':
                    amountNum = v.get('payableOpened')
                    break
                case 'PREPAY':
                    amountNum = v.get('prepaidOpened')
                    break
                case 'stock':
                    amountNum = v.get('opened')
                    break
                case 'CARD_PROPERTY_BASIC':
                    amountNum = v.get('basicProductOpen')
                    break
                case 'CARD_PROPERTY_CONTRACT_COST':
                    amountNum = v.get('contractCostOpen')
                    break
                case 'CARD_PROPERTY_CONTRACT_PROFIT':
                    amountNum = v.get('contractProfitOpen')
                    break
                case 'CARD_PROPERTY_ENGINEER':
                    amountNum = v.get('engineeringSettlementOpen')
                    break
                default:
            }
            return amountNum
        }

		const addShowChilidUuid = flags.getIn(['notClearItem','relationUuid'])

        let cantLists = [],//已在新增列表
            deleteLists = []//已在删除列表
        let newCantChooseList = cantChooseList
        changeQcList.map(item => {
            if(item.get('operateType') === '1' && (curModal === 'Contacts' && item.get('property') == addItemProperty || curModal === 'Stock' && item.get('inventoryNature') == addItemInventoryNature || curModal === 'Project' && item.get('property') == addItemProperty)){
                cantLists.push(item.get('uuid'))
            }
            if(item.get('operateType') === '2' && cantChooseList.indexOf(item.get('relationUuid')) > -1 ){
                deleteLists.push(item.get('relationUuid'))
            }
        })


        const curmemberList = curModal === 'Contacts' ? MemberList : thingsList //当前卡片列表
        const curmemberName = curModal === 'Contacts' ? 'MemberList' : 'thingsList' //当前卡片列表
        let intersection = curmemberList.filter(v => cantLists.indexOf(v.get('uuid')) === -1).filter(k => {
            let amountNum = getNum(k)
            return !(amountNum != 0 && !isCheckOut)
        })

        cantLists = fromJS(cantLists)
        deleteLists = fromJS(deleteLists)

        const showMemberList = hasSearchContent  ? searchList : curmemberList
        let selectSize = cantChooseList.size ? curmemberList.size - cantChooseList.size + deleteLists.size : curmemberList.size
        let selectAcAllSize = cantLists.size ? selectSize - cantLists.size : selectSize
        let curPageSelectList = []
        showMemberList && showMemberList.map(item =>{
            if(selectList.size && (selectList.indexOf(item.get('uuid')) > -1)){
                curPageSelectList.push(item.get('uuid'))
            }
        })
        const selectAcAll = curmemberList.size ?  curPageSelectList.length && curPageSelectList.length === selectAcAllSize || cantChooseList.size === curmemberList.size || (selectList.size && intersection.every(v => selectList.indexOf(v.get('uuid')) > -1))  : false

        const curTopTitle = curModal === 'Contacts' ? '往来单位' : curModal === 'Project' ? '项目' : '存货'

        return (
            <Modal
                className='select-modal'
                visible={showContactsModal}
                title={`选择${curTopTitle}`}
                onOk={() => {
                    if(selectList.size){
                        dispatch(lsqcActions.addRunningBeginItem(curModal,isDefinite,addShowChilidUuid))
                    }else{
                        message.error(`请选择${curTopTitle}`);
                    }
                }}
                onCancel={() => {
                    changeInputValue('')
                    dispatch(lsqcActions.showContactsModal(false))
                }}
                width="800px"
            >
                <div className='lsqc-contacts-card-top'>
                    <TreeContains
                          hideCategoryList={hideCategoryList}
                          dispatch={dispatch}
                          property={addItemProperty}
                          inventoryNature={addItemInventoryNature}
                          curCategory={curCategory}
                          contactsCategory={contactsCategory}
                          curModal={curModal}
                          showMemberList={showMemberList}
                          searchCardContent={searchCardContent}
                          parent={this}
                    />
                    <TableAll className="contacts-table-right" shadowTop="40px"  style={{height:showMemberList.size > 5?'461px':'286px'}}>
                        <span className="lsqc-serch">
                            <Icon className="lsqc-serch-icon" type="search"
                                onClick={() => {
                                    dispatch(lsqcActions.searchCardList(curModal,searchCardContent))
                                }}
                            />
                            <Input placeholder="搜索"
                                className="lsqc-serch-input"
                                value={searchCardContent}
                                onChange={e => {
                                    changeInputValue(e.target.value)
                                    dispatch(lsqcActions.searchCardList(curModal,e.target.value))
                                }}
                                onKeyDown={(e) => {
                                    if (e.keyCode == Limit.ENTER_KEY_CODE){
                                        changeInputValue(searchCardContent)
                                        dispatch(lsqcActions.searchCardList(curModal,e.target.value))
                                    }
                                }}
                            />
                        </span>
                        <div className="table-title-wrap">
                            <ul className="table-title table-title-charge">
                                <li
                                    onClick={() => {
                                        dispatch(lsqcActions.contactsItemCheckboxCheckAll(selectAcAll, curmemberName,addItemProperty,showMemberList))
                                    }}
                                >
                                    <Checkbox
                                        disabled={cantChooseList.size  === curmemberList.size && deleteLists.size === 0 || cantChooseList.size + cantLists.size  === curmemberList.size && deleteLists.size === 0 }
                                        checked={selectAcAll}
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
                        <TableBody style={{height:thingsList && thingsList.toJS() > 5?'374px':'286px'}}>
                            {
                                showMemberList.map(v => {
                                    let amountNum = getNum(v)
                                    const checked = selectList.indexOf(v.get('uuid')) > -1 || (amountNum != 0 && !isCheckOut) && !(deleteLists.indexOf(v.get('uuid')) > -1) || cantLists.indexOf(v.get('uuid')) > -1
                                    return <TableItem className='contacts-table-width-charge' key={v.get('uuid')}>
                                        <li
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                dispatch(lsqcActions.contactsItemCheckboxCheck(checked, v.get('uuid'),v.get('name'),v.get('code')))
                                            }}
                                        >
                                            <Checkbox
                                                disabled={(amountNum != 0 && !isCheckOut) && !(deleteLists.indexOf(v.get('uuid')) > -1)|| cantLists.indexOf(v.get('uuid')) > -1}
                                                checked={checked}
                                            />
                                        </li>
                                        <li>{v.get('code') === 'UDFNCRD' || v.get('code') === 'IDFNCRD' ? '' : v.get('code')}</li>
                                        <li>{v.get('name')}</li>
                                    </TableItem>
                                })
                            }
                        </TableBody>
                        {
                            cardPageObj ?
                            <TablePagination
                                className='lsqc-card-modal-pagination'
                                currentPage={cardPageObj.get('currentPage')}
                                pageCount={cardPageObj.get('pages')}
                                paginationCallBack={(value) => {
                                    dispatch(lsqcActions.getContactsMember(curModal,selectTreeUuid,sessionStorage.getItem('psiSobId'),addItemProperty,selectTreeLevel,addItemInventoryNature,searchCardContent,value))
                                }}
                            /> : ''
                        }
                    </TableAll>

                </div>
                <div className='charge-chosen-project'>
                    选择{curTopTitle}：
                    {
                        selectItem && selectItem.size && selectItem.map(v =>{
                            return <Tag closable visible={true} onClose={() => {
                                dispatch(lsqcActions.contactsItemCheckboxCheck(true, v.get('uuid')))
                            }}>{v.get('oriCode') === 'UDFNCRD' || v.get('oriCode') === 'IDFNCRD' ? '' : v.get('oriCode')} {v.get('oriName')}</Tag>
                        }) || ''
                    }
                </div>
                <div style={{display:selectItem.size>0?'':'none',margin:'0 0 10px 20px'}}>
                    {selectItem.size}个存货
                </div>

            </Modal>
        )
    }
}
