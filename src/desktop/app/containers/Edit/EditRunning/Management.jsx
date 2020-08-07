import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import { Input, Select, Divider } from 'antd'
import { Icon } from 'app/components'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import XfnSelect from 'app/components/XfnSelect'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney } from 'app/utils'
import { getCategorynameByType, numberTest, regNegative, reg } from './common/common'
import SingleModal  from './SingleModal'
import AddCardModal from 'app/containers/Config/Relative/AddCardModal.jsx'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'

@immutableRenderDecorator
export default
class Management extends React.Component {

    constructor(props) {
		super(props)
		this.state = {
			showCardModal: false,
		}
	}

    render() {
        const {
            currentCardList,
            dropManageFetchAllowed,
            oriState,
            contactsRange,
            dispatch,
            categoryTypeObj,
            selectedKeys,
            showSingleModal,
            MemberList,
            selectThingsList,
            thingsList,
            insertOrModify,
            strongList,
            contactsManagement,
            currentCardType,
            flags,
        } = this.props
        let { contactsList } = this.props
        const { showCardModal } = this.state
        const stockStrongList = this.props.stockStrongList || fromJS([])
        const carryoverStrongList = this.props.carryoverStrongList || fromJS([])
        const payOrReceive = {
            acBusinessIncome: 'receive',
            acBusinessOutIncome: 'receive',
            acTemporaryReceipt: 'receive',
            acBusinessExpense: 'pay',
            acBusinessOutExpense: 'pay',
            acTemporaryPay: 'pay',
            acCost: 'pay',
            acAssets: 'payAndReceive'
        }
        const pageCount = flags.get('pageCount')
        if (oriState === 'STATE_ZS_TH' || oriState === 'STATE_ZF_SH') {
            contactsList = contactsList.unshift(fromJS({uuid:'nothing',code:'',name:'不限制往来单位'}))
        }
        return(
            <div className="edit-running-modal-list-item" style={{display:contactsManagement || insertOrModify === 'modify' && currentCardList.size?'':'none'}}>
                <label>往来单位：</label>
                <div className='chosen-right' >
                    <XfnSelect
                        disabled={insertOrModify === 'modify' && (strongList.size || oriState === 'STATE_ZS_TH' || oriState === 'STATE_ZF_SH')}
                        combobox
                        showSearch
                        onDropdownVisibleChange={(open) => {
                            open && dropManageFetchAllowed && dispatch(editRunningActions.getFirstContactsCardList(contactsRange, oriState))
                        }}
                        value={`${currentCardList && currentCardList.getIn([0,'code'])?currentCardList.getIn([0,'code']):''} ${currentCardList && currentCardList.getIn([0,'name'])?currentCardList.getIn([0,'name']):''}`}
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                <Divider style={{ margin: '4px 0',display:contactsRange.size?'':'none' }} />
                                {
                                    contactsRange.size?
                                    <div
                                        style={{ padding: '8px', cursor: 'pointer' }}
                                        onMouseDown={() => {
                                            const showModal = () => {
                                                this.setState({showCardModal: true})
                                            }
                                            // const isPre = ['STATE_YYSR_DJ', 'STATE_YYZC_DJ', 'STATE_FY_DJ'].indexOf(oriState) > -1
                                            dispatch(configCallbackActions.beforeRunningAddRelativeCard(showModal, contactsRange,'lrls'))
                                        }}
                                    >
                                        <Icon type="plus" /> 新增往来单位
                                    </div>:''
                                }

                          </div>
                        )}
                        onChange={value => {
                            const valueList = value.split(Limit.TREE_JOIN_STR)
                            const cardUuid = valueList[0]
                            const code = valueList[1]
                            const name = valueList[2]
                            if (cardUuid === 'nothing') {
                                dispatch(editRunningActions.changeLrAccountCommonString('ori', 'currentCardList', fromJS([])))
                                return
                            }
                            dispatch(editRunningActions.changeLrAccountCommonString('ori', ['currentCardList',0], fromJS({cardUuid,name,code})))
                            dispatch(editRunningActions.changeLrAccountCommonString('ori', 'offsetAmount',0))
                        }}
                    >
                        {
                            contactsList.map((v, i) => <Option   key={v.get('uuid')} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{`${v.get('code')} ${v.get('name')}`}</Option>)
                        }
                    </XfnSelect>
                    <div className='chosen-word'
                        style={{cursor:insertOrModify === 'insert'?'pointer':'not-allowed'}}
                        onClick={() => {

                            if (insertOrModify === 'modify' && strongList.size)  {
                                return
                            }
                            dispatch(editRunningActions.getRelativeAllCardList(contactsRange, 'showSingleModal'))
                            dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'currentCardType'], 'contacts'))
                    }}>选择</div>
                </div>
                <AddCardModal
					showModal={showCardModal}
					closeModal={() => this.setState({showCardModal: false})}
					dispatch={dispatch}
                    fromPage='editRunning'
				/>
                {
                    showSingleModal && currentCardType === 'contacts'?
                    <SingleModal
                        pageCount={pageCount}
                        dispatch={dispatch}
                        showSingleModal={showSingleModal && currentCardType === 'contacts'}
                        MemberList={MemberList}
                        selectThingsList={selectThingsList}
                        thingsList={thingsList}
                        selectedKeys={selectedKeys}
                        title={'选择往来单位'}
                        selectFunc={(code, name, cardUuid) => {
                            dispatch(editRunningActions.changeLrAccountCommonString('ori', ['currentCardList', 0], fromJS({code, name, cardUuid})))
                            dispatch(editRunningActions.changeLrAccountCommonString('', ['flags', 'showSingleModal'], false))
                        }}
                        selectListFunc={(uuid, level,currentPage,condition) => {
                            if (uuid === 'all') {
                                dispatch(editRunningActions.getRelativeAllCardList(contactsRange, 'showSingleModal', true,currentPage,condition))
                            } else {
                                dispatch(editRunningActions.getRelativeSomeCardList(uuid, level,currentPage,condition))
                            }
                        }}
                    />:''
                }

            </div>
        )
    }
}
