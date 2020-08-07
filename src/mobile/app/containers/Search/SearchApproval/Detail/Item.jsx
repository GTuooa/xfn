import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Checkbox } from 'app/components'
import { receiptList, hideCategoryCanSelect } from 'app/containers/Config/Approval/components/common.js'
import thirdParty from 'app/thirdParty'

import ApprovalDetaliItem from '../common/ApprovalDetaliItem'

@immutableRenderDecorator
export default
    class ApprovalAllItemChild extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        const { item, dispatch, editLrAccountPermission, history, uuidList, accountingType, multiOperationType, addCheckDetailItem, deleteCheckDetailItem, selectList, accountSelectList } = this.props

        // ["收款", "付款", "挂账", "作废"]
        let canAccount = false // 可否挂帐
        let canBookKeeping = false // 可否挂帐
        let canPay = false // 可否付款
        let canReceive = false // 可否收款
        let canDisuse = false // 可否作废

        if (!item.get('dealState')) {
            canDisuse = true

            if (hideCategoryCanSelect.indexOf(item.get('jrCategoryType')) > -1) {
                canBookKeeping = true
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

        const canSelect = (operationType) => {
            if (operationType === '挂账') {
                return canAccount
            }
            if (operationType === '核记') {
                return canBookKeeping
            }
            if (operationType === '付款') {
                return canPay
            }
            if (operationType === '收款') {
                return canReceive
            }
            if (operationType === '作废') {
                return canDisuse
            }
            if (operationType === '') {
                return false
            }
        }

        return (
            <div className="approval-datail-list-item" onClick={() => {
                if (multiOperationType) {
                    if (canSelect(multiOperationType)) {
                        if (selectList.indexOf(item.get('id')) > -1) {
                            deleteCheckDetailItem([item.get('id')])
                        } else {
                            addCheckDetailItem([item.get('id')])
                        }
                    }
                }
            }}>
                <div className="approval-datail-item-title-wrap">
                    {
                        multiOperationType ?
                            <span
                                className="approval-datail-item-title-checkbox"
                                style={{ display: multiOperationType ? '' : 'none' }}
                            >
                                <Checkbox
                                    disabled={!canSelect(multiOperationType)}
                                    checked={selectList.indexOf(item.get('id')) > -1}
                                    // checkedColor="#fb6"
                                />
                            </span>
                            : null
                    }
                    <span className="approval-datail-item-title" onClick={() => {
                        if (multiOperationType) {
                            return
                        };
                        thirdParty.openLink({
                            url: `https://aflow.dingtalk.com/dingtalk/mobile/homepage.htm?dd_share=false&showmenu=true&dd_progress=false&back=native&corpid=${sessionStorage.getItem('corpId')}&swfrom=${'XFN'}#/approval?procInstId=${item.get('processInstanceId')}`
                        });
                    }}>{item.get('processTitle')}</span>
                    
                    <Icon className="approval-datail-item-title-icon" type="arrow-right" />
                </div>
                <div>
                    <ApprovalDetaliItem
                        item={item}
                        dispatch={dispatch}
                        editLrAccountPermission={editLrAccountPermission}
                        history={history}
                        jrUuidList={uuidList}
                        multiOperationType={multiOperationType}
                        accountSelectList={accountSelectList}
                    />
                </div>
            </div>
        )
    }
}