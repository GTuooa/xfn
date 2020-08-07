import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import { Collapse, Icon } from 'antd'
import { formatNum, formatMoney } from 'app/utils'
const Panel = Collapse.Panel
import JournalDetail from './JournalDetail'

import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action'

@immutableRenderDecorator
export default
class Journal extends React.Component {
    render() {
        const { lsItemData, dispatch, editLrAccountPermission, categoryType, searchRunningState, accountList, intelligentStatus, isCurrentRunning, showRelatedRunning, lrPermissionInfo, enclosureList, label, enCanUse, uploadKeyJson, checkMoreFj} = this.props
        const jrFlowList = lsItemData.get('jrFlowList')
        const total = jrFlowList.get(jrFlowList.size-1) || fromJS([])

        return (
            <div className="ylls-item-child-list">
                <div className='ylls-journ-title ylls-journ-split ylls-juron-overwidth'>
                    <span>流水类型</span>
                    <span>借方金额</span>
                    <span>贷方金额</span>
                    <span>状态</span>
                </div>
                <div className='ylls-journ-total'>
                    {
                        jrFlowList && jrFlowList.size?
                        jrFlowList.map((item,i) =>
                                <JournalDetail
                                    dispatch={dispatch}
                                    jrFlowList={jrFlowList}
                                    item={item}
                                    i={i}
                                    categoryType={categoryType}
									editLrAccountPermission={editLrAccountPermission}
                                    searchRunningState={searchRunningState}
                                    accountList={accountList}
                                    intelligentStatus={intelligentStatus}
                                    isCurrentRunning={isCurrentRunning}
                                    showRelatedRunning={showRelatedRunning}
                                    lrPermissionInfo={lrPermissionInfo}
                                    enclosureList={enclosureList}
                                    label={label}
                                    enCanUse={enCanUse}
                                    uploadKeyJson={uploadKeyJson}
                                    checkMoreFj={checkMoreFj}
                                />
                            ):''
                    }


                    <div className='ylls-journ-title ylls-journ-split ylls-juron-overwidth' style={{marginBottom:'15px'}}>
                        <span>合计</span>
                        <span><b>{total.get('debitAmount') !== null ? formatMoney(total.get('debitAmount')) : ''}</b></span>
                        <span><b>{total.get('creditAmount') !== null ? formatMoney(total.get('creditAmount')) : ''}</b></span>
                        <span></span>
                    </div>
                </div>
            </div>
        )
    }
}
