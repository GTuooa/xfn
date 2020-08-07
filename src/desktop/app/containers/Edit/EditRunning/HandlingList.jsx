import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import { DatePicker, Input, Select, Checkbox, Button, message, Radio, Icon, Divider } from 'antd'
const { Search } = Input
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, TableAll, Amount, TableOver } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import { formatMoney, DateLib } from 'app/utils'
import { getCategorynameByType, numberTest, regNegative, reg } from './common/common'
import Project from './Project'
import AccountComp from './AccountComp'
import MultiManagement from './MultiManagement'
import XfnSelect from 'app/components/XfnSelect'

import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'

@immutableRenderDecorator
export default
class HandlingList extends React.Component {
    componentDidMount() {
        const { dispatch, contactsRange, oriState, categoryUuid, categoryType, oriDate } = this.props
        if (categoryType === 'LB_ZSKX' || categoryType === 'LB_ZFKX') {
            dispatch(editRunningActions.getPaymentCardList(oriDate, categoryUuid))

        }
    }
    render() {
        const {
            titleList,
            listTitle,
            pendingStrongList,
            modify,
            stateName,
            dispatch,
            extraFunc,
            currentCardList,
            insertOrModify,
            strongList,
            oriState,
            contactsRange,
            contactsList,
            contactsManagement,
            cardAllList,
            condition,
            oriDate,
            categoryUuid
        } = this.props
        const selectAcAll = pendingStrongList && pendingStrongList.size ? pendingStrongList.every(v => v.get('beSelect')):false
        let selectIndex = 0
        let totalNotHandleAmount = 0
        pendingStrongList && pendingStrongList.forEach(v => {if (v.get('beSelect')) {
                selectIndex++
                modify?
                totalNotHandleAmount += Number(v.get('notHandleAmount')) + Number(v.get('handleAmount'))
                :
                totalNotHandleAmount += Number(v.get('notHandleAmount'))

            }
        })
        let cardUuidList = []
        if ((cardAllList || []).some(v => v.get('label') === '无往来单位')) {
            cardUuidList = ['0']
        } else {
            cardUuidList = (cardAllList || []).map(v => v.get('value').split(Limit.TREE_JOIN_STR)[0])
        }
    return(
        <div className="accountConf-modal-list-hidden" style={{display:pendingStrongList.size || oriState === 'STATE_ZS_TH' || oriState === 'STATE_ZF_SH'?'':'none'}}>
            <div className='editRunning-detail-title'>
                <div className='editRunning-detail-title-top'>请勾选需要处理的流水：</div>
                <div className='editRunning-detail-title-bottom'>
                    <span>
                        已勾选流水：{selectIndex? selectIndex:''}条
                    </span>
                    <span>
                        {listTitle}<span>{formatMoney(Math.abs(totalNotHandleAmount))}</span>
                    </span>
                </div>
            </div>
            <TableAll className="editRunning-table">
                {
                    (oriState === 'STATE_ZS_TH' || oriState === 'STATE_ZF_SH') && insertOrModify === 'insert'?
                    <div className="zszf-table-top-select">
                        <MultiManagement
                            combobox
                            showSearch
                            placeholder='筛选往来单位...'
                            treeData={contactsList}
                            value={cardAllList.toJS()}
                            onChange={value => {
                                dispatch(editRunningActions.changeLrAccountCommonString('ori', 'cardAllList', fromJS(value)))
                            }}
                        />

                        <Search
                            placeholder="搜索摘要、金额..."
                            value={condition}
                            onSearch={value => {
                                dispatch(editRunningActions.getPaymentManageList(oriDate, cardUuidList,value,categoryUuid))

                            }}
                            onChange={e => {
                                dispatch(editRunningActions.changeLrAccountCommonString('ori', 'condition', e.target.value))
                            }}
                            style={{ width: 150,height: 32 }}
                        />
                    </div> : null
                }

                <TableTitle
                    className="editRunning-table-width"
                    titleList={titleList}
                        // disabled={runningIndex !== 0}
                        hasCheckbox={true}
                        selectAcAll={selectAcAll}
                        onClick={(e) => {
                                e.stopPropagation()
                                if (pendingStrongList.size > 160) {
                                    message.info('勾选的核销流水不能超过160条')
                                    return
                                }
                                pendingStrongList && pendingStrongList.forEach((item,index) => {
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori', ['pendingStrongList',index,'beSelect'],e.target.checked))
                                })
                                let totalNotHandleAmount = 0
                                if (e.target.checked) {
                                    if (modify) {
                                        pendingStrongList && pendingStrongList.forEach((v,i) => {
                                            totalNotHandleAmount += Number(v.get('handleAmount')) + Number(v.get('notHandleAmount'))
                                        })
                                    } else {
                                        pendingStrongList && pendingStrongList.forEach(v => totalNotHandleAmount +=  Number(v.get('notHandleAmount')))
                                    }

                                }
                                if (extraFunc && typeof extraFunc === 'function') {
                                    extraFunc(totalNotHandleAmount.toFixed(2))
                                } else {
                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','amount',Math.abs(totalNotHandleAmount).toFixed(2)))
                                }

                        }}
                />
                <TableBody>

                    {
                        pendingStrongList && pendingStrongList.map((item,index) => {
                            const handleAmount = item.get('handleAmount')
                            const notHandleAmount = item.get('notHandleAmount')
                            return <TableItem className='editRunning-table-width' key={item.get('jrUuid')}>
                                    <li>
                                        <Checkbox
                                            checked={item.get('beSelect')}
                                            onChange={(e) => {
                                                if (selectIndex >= 160) {
                                                    message.info('勾选的核销流水不能超过160条')
                                                    return
                                                }
                                                dispatch(editRunningActions.changeLrAccountCommonString('ori', ['pendingStrongList',index,'beSelect'],e.target.checked))
                                                let totalNotHandleAmount = 0
                                                if (modify) {
                                                    pendingStrongList && pendingStrongList.forEach((v,i) => {
                                                        if (index === i && e.target.checked || index !== i && v.get('beSelect')) {
                                                            totalNotHandleAmount += Number(v.get('handleAmount')) + Number(v.get('notHandleAmount'))
                                                        }
                                                    })
                                                } else {
                                                    pendingStrongList && pendingStrongList.forEach((v,i) => {
                                                        if (index === i && e.target.checked || index !== i && v.get('beSelect')) {
                                                            totalNotHandleAmount += Number(v.get('notHandleAmount'))
                                                        }
                                                    })
                                                }
                                                if (extraFunc && typeof extraFunc === 'function') {
                                                    extraFunc(totalNotHandleAmount.toFixed(2))
                                                } else {
                                                    dispatch(editRunningActions.changeLrAccountCommonString('ori','amount',Math.abs(totalNotHandleAmount).toFixed(2)))
                                                }
                                            }}
                                        />
                                    </li>
                                    <li	>{item.get('oriDate')}</li>
                                    <TableOver
                                        textAlign='left'
                                        className='account-flowNumber'
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            dispatch(previewRunningActions.getPreviewRunningBusinessFetch(item, 'lrls',pendingStrongList))
                                        }}
                                    >
                                        <span>{item.get('beOpened')?'':`${item.get('jrIndex')} 号`}</span>
                                    </TableOver>
                                    <li><span>{item.get('oriAbstract')}</span></li>
                                    <li><span>{item.get('jrJvTypeName')}</span></li>
                                    <li><p>{formatMoney(item.get('amount'))}</p></li>
                                    <li>
                                        <p>
                                                {
                                                    !modify ?
                                                        formatMoney(notHandleAmount.toFixed(2))
                                                        :
                                                        formatMoney((Number(notHandleAmount) + Number(handleAmount)).toFixed(2))
                                                }
                                        </p>
                                    </li>
                                </TableItem>
                        })

                    }
                    <TableItem className='editRunning-table-width' key='total'>
                        <li	></li>
                        <li	></li>
                        <li></li>
                        <li></li>
                        <li>合计</li>
                        <li></li>
                        <li>
                            <p>
                                {
                                    !modify?
                                    formatMoney(pendingStrongList.reduce((total,cur) => total + Number(cur.get('notHandleAmount')),0))
                                    :
                                    formatMoney(pendingStrongList.reduce((total,cur) => total + Number(cur.get('notHandleAmount')) + Number(cur.get('handleAmount')),0))
                                }
                            </p>
                        </li>
                        {/* <li><p>{totalAmount.toFixed(2)}</p></li> */}
                    </TableItem>
                </TableBody>
            </TableAll>
        </div>
    )
    }

}
