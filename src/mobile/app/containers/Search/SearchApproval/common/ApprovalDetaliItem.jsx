import React, { PropTypes } from 'react'
import { fromJS } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Amount } from 'app/components'
import { showAccountState } from 'app/containers/Search/SearchApproval/common/common.js'
import { receiptList, hideCategoryCanSelect } from 'app/containers/Config/Approval/components/common.js'
import { DateLib } from 'app/utils'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'
import { runningPreviewActions } from 'app/redux/Edit/RunningPreview'

@immutableRenderDecorator
export default
    class ApprovalAllItemChild extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        const { item, dispatch, editLrAccountPermission, history, jrUuidList, multiOperationType, accountSelectList } = this.props
        

        let canReceive = false // 可否收款
        let canPay = false // 可否收款
        let canAccount = false // 可否挂帐
		let canBookkeeping = false // 可否记帐

        if (!item.get('dealState')) {

            if (hideCategoryCanSelect.indexOf(item.get('jrCategoryType')) > -1) {
                canBookkeeping = true
            } else {
                canAccount = true
                if (receiptList.indexOf(item.get('jrCategoryType')) > -1) {
                    if (item.get('jrAmount') > 0) {
                        canReceive = true
                    } else if (item.get('jrAmount') < 0) {
                        canPay = true
                    }
                } else {
                    if (item.get('jrAmount') > 0) {
                        canPay = true
                    } else if (item.get('jrAmount') < 0) {
                        canReceive = true
                    }
                }     
            } 
        }

        return (
            <div className="approval-all-item-child-item needsclick">
                <div
                    className="approval-all-item-child-title-wrap"
                    onClick={() => {
                        if (multiOperationType) {
                            return
                        };
                        dispatch(searchApprovalActions.changeSearchApprovalString('', 'jrUuidList', jrUuidList))
                        dispatch(searchApprovalActions.getApprovalProcessDetailInfo(item.get('id'), () => {
                            history.push('/searchapproval/approvalpreview')
                        }))
                    }}
                >
                    <span className="approval-all-item-child-title-type">{item.get('detailType')}</span>
                    <span className="approval-all-item-child-title-amount"><Amount showZero={true}>{item.get('jrAmount')}</Amount></span>
                </div>
                <div className="approval-all-item-child-title-date">{item.get('jrDate').substr(0, 10)}</div>
                {
                    item.get('dealState') ?
                        <div className="approval-all-item-child-handled-tit-wrap">
                            <div className="approval-all-item-child-handled-tit">
                                {
                                    item.get('jrIndex') ?
                                        <span className="approval-all-item-child-handled-tit-left" onClick={() => {
                                            if (multiOperationType) {
                                                return
                                            };
                                            dispatch(runningPreviewActions.getRunningPreviewBusinessFetch(item.get('jrOriUuid'), item, jrUuidList, 'search', history))
                                        }}>
                                            <Icon type="liushui" style={{ fontSize: '.14rem' }} />&nbsp;<span>{item.get('jrIndex')}号</span>
                                        </span>
                                        :
                                        <span className="approval-all-item-child-handled-tit-left"></span>
                                }
                                <span
                                    className="approval-all-item-child-handled-tit-rigth"
                                    onClick={() => {
                                        if (multiOperationType) {
                                            return
                                        };
                                        if (editLrAccountPermission) {
                                            dispatch(searchApprovalActions.cancelApprovalProcessDetailInfo([item.get('id')], () => { }))
                                        }
                                    }}
                                >
                                    <span>{showAccountState[item.get('dealState')]}</span>&nbsp;<Icon type="chexiao" style={{ color: editLrAccountPermission ? '#5e81d1' : '#999' }} />
                                </span>
                            </div>
                            <div className="approval-all-item-child-operate_username">
                                <span>{item.get('oriDate')}</span><i className="approval-all-item-child-separate" style={{ display: item.get('jrIndex') ? '' : 'none' }}>|</i><span>记账员：{item.get('operateUserName')}</span>
                            </div>
                        </div> :
                        <div className="approval-all-item-child-btn-wrap">
                            <span
                                className={editLrAccountPermission ? "approval-all-item-child-btn" : "approval-all-item-child-btn approval-all-item-child-btn-disabled"}
                                style={{ display: canBookkeeping ? '' : 'none' }}
                                onClick={(e) => {
                                    if (multiOperationType) {
                                        return
                                    };
                                    if (editLrAccountPermission) {
                                        if (item.getIn(['outputAccount', 'accountUuid'])) { // 如果有账户，要把账户信息填入收款信息里
                                            
                                            const accountItem = accountSelectList.find(v => v.get('uuid') === item.getIn(['outputAccount', 'accountUuid']));
                                            const jrAmount = item.get('jrAmount')

                                            if (accountItem) {
                                                const poundageObj = { needPoundage: accountItem.get('needPoundage'), poundage: accountItem.get('poundage'), poundageRate: accountItem.get('poundageRate') }
                                                const poundage = poundageObj.poundage
                                                const poundageRate = poundageObj.poundageRate
                                                
                                                const amount = jrAmount > 0 ? jrAmount : -jrAmount
                                                const sxAmount = ((Math.abs(amount || 0) * poundageRate / 1000 > poundage) && poundage > 0) ? poundage : Math.abs(amount || 0) * poundageRate / 1000
        
                                                dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', fromJS({
                                                    accountName: accountItem.get('name'),
                                                    accountUuid: accountItem.get('uuid'),
                                                    poundage: poundageObj,
                                                    poundageAmount: (sxAmount || 0).toFixed(2),
                                                })))
                                                dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('receiveAmount', jrAmount > 0 ? jrAmount : -jrAmount))
                                            }
                                        }
        
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('fromPage', ''))
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS([item.get('id')])))
        
                                        history.push('/searchapproval/bookKeepingapproval')
                                    }
                                }}
                            >
                                核记
                            </span>
                            <span
                                className={editLrAccountPermission ? "approval-all-item-child-btn" : "approval-all-item-child-btn approval-all-item-child-btn-disabled"}
                                style={{ display: canAccount ? '' : 'none' }}
                                onClick={(e) => {
                                    if (multiOperationType) {
                                        return
                                    };
                                    if (editLrAccountPermission) {
                                        dispatch(searchApprovalActions.getSearchRunningJrCategoryDate(item.get('jrCategoryUuid'), item.get('id'), () => {
                                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('fromPage', ''))
                                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS([item.get('id')])))
                                            history.push('/searchapproval/accountapproval')
                                        }))
                                    }
                                }}
                            >
                                挂账
                            </span>
                            <span
                                className={editLrAccountPermission ? "approval-all-item-child-btn" : "approval-all-item-child-btn approval-all-item-child-btn-disabled"}
                                style={{ display: canReceive ? '' : 'none' }}
                                onClick={(e) => {
                                    if (multiOperationType) {
                                        return
                                    };
                                    if (editLrAccountPermission) {
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('fromPage', ''))
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS([item.get('id')])))
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('receiveAmount', item.get('jrAmount') > 0 ? item.get('jrAmount') : -item.get('jrAmount')))
                                        history.push('/searchapproval/receiveapproval')
                                    }
                                }}
                            >
                                收款
                            </span>
                            <span
                                className={editLrAccountPermission ? "approval-all-item-child-btn" : "approval-all-item-child-btn approval-all-item-child-btn-disabled"}
                                style={{ display: canPay ? '' : 'none' }}
                                onClick={(e) => {
                                    if (multiOperationType) {
                                        return
                                    };
                                    if (editLrAccountPermission) {
                                        dispatch(searchApprovalActions.getSearchRunningJrCategoryDate(item.get('jrCategoryUuid'), item.get('id'), () => {
                                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('fromPage', ''))
                                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS([item.get('id')])))
                                            history.push('/searchapproval/payapproval')
                                        }))
                                    }
                                }}
                            >
                                付款
                            </span>
                            <span
                                className={editLrAccountPermission ? "approval-all-item-child-btn" : "approval-all-item-child-btn approval-all-item-child-btn-disabled"}
                                onClick={(e) => {
                                    if (multiOperationType) {
                                        return
                                    };
                                    if (editLrAccountPermission) {
                                        dispatch(searchApprovalActions.disuseApprovalProcessDetailInfo([item.get('id')], () => { }))
                                    }
                                }}
                            >
                                作废
                        </span>
                    </div>
                }
            </div>
        )
    }
}