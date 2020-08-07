import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { XfnIcon } from 'app/components'
import { Icon, Modal, DatePicker, Switch, Input, Select, message, Button, Tooltip } from 'antd'
import { categoryTypeAll, type, business, beforejumpCxToLr, runningStateType, categoryTypeName } from 'app/containers/components/moduleConstants/common'
const Option = Select.Option
import { formatMoney, formatDate, showImg } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import moment from 'moment'

import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as middleActions from 'app/redux/Home/middle.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as printActions from 'app/redux/Edit/FilePrint/filePrint.actions.js'

@immutableRenderDecorator
export default
class ButtonBar extends React.Component {

    render() {

        const {
            dispatch,
            fromPage,
            canCreateVc,
            currentItem,
            isClose,
            jrOri,
            // lsItemData,
            deleteYear,
            deleteMonth,
            deleteVcId,
            issuedate,
            inputValue,
            showDrawer,
            panes,
            lsItemData,
            uuid,
            editLrAccountPermission,
            beBusiness,
            oriState,
            isCurrentRunning,
            categoryType,
            showRelatedRunning,
            reviewLrAccountPermission,
            refreshList,
            onClose,
            currentOri,
            pageActive
        } = this.props
        const uuidList = this.props.uuidList || fromJS([])
        const modelNo = lsItemData.get('modelNo') || ''
        const isPs = modelNo.charAt(0) === 'X' || modelNo === 'Y56#0-00-0' || modelNo === 'Y57#0-00-0'
        return (
            <div className="ylls-opration-wrap">
                {
                    uuidList && uuidList.size?
                        <div key='x6' className='ylls-title-btn'>
                            <Button
                                type='ghost'
                                className='ylls-btn'
                                disabled={uuidList.some((v, i)=> v.get('oriUuid') === uuid && i === 0)}
                                onClick={() => {

                                    if (uuidList.some((v, i)=> v.get('oriUuid') === uuid && i === 0)) {
                                        return
                                    }

                                    const index = uuidList.findIndex(v => v.get('oriUuid') === uuid) -1
                                    const nextItem = uuidList.get(index)
                                    if (isCurrentRunning) {
                                        nextItem && dispatch(previewRunningActions.getPreviewNextRunningBusinessFetch(nextItem))
                                    } else {
                                        dispatch(previewRunningActions.getPreviewRelatedRunningBusinessFetch(nextItem.get('oriUuid'),uuidList , () => showRelatedRunning()))
                                    }
                                }}
                            >
                                    <Icon type="caret-left" />
                            </Button>
                        </div>
                        :''
                }

                {/* {
                    fromPage.indexOf('search') > -1  ?
                    getCarrayOver(lsItemData)
                    : ''
                } */}

                <div key='z6' className='ylls-title-btn'>
                    <Button
                        type='ghost'
                        className='handle-btn'
                        disabled={!editLrAccountPermission || lsItemData.get('beCertificate') && (oriState !== 'STATE_SYJZ_JZSR' && oriState !== 'STATE_SYJZ_JZCBFY' && oriState !== 'STATE_SYJZ_JZBNLR')}
                        onClick={() => {
                            if (editLrAccountPermission && !lsItemData.get('beCertificate') || (oriState === 'STATE_SYJZ_JZSR' || oriState === 'STATE_SYJZ_JZCBFY' || oriState === 'STATE_SYJZ_JZBNLR') && lsItemData.get('beCertificate')) {

                                // dispatch(middleActions.getEditSettingInfo())
                                dispatch(middleActions.initEditRunning())
                                dispatch(searchRunningActions.getSearchRunningItem(currentItem, 'modify', uuidList))

                                dispatch(previewRunningActions.closePreviewRunning(false))
                            }
                        }}
                    >
                            修改
                    </Button>
                </div>
                <div key='z9' className='ylls-title-btn'>
                    <Tooltip title={isPs?'有关联流水，不可复制':''}>
                    <Button
                        type='ghost'
                        className='handle-btn'
                        disabled={!reviewLrAccountPermission || isPs}
                        onClick={() => {
                            dispatch(middleActions.initEditRunning())
                            dispatch(searchRunningActions.getSearchRunningItem(currentItem, 'insert', fromJS([]),'','',true))

                            dispatch(previewRunningActions.closePreviewRunning(false))
                        }}
                    >
                            <span>复制</span>
                    </Button>
                    </Tooltip>
                </div>
                {
                        <div key='z5' className='ylls-title-btn'>
                            <Button
                                type='ghost'
                                className='handle-btn'
                                disabled={lsItemData.get('beCertificate') || !editLrAccountPermission}
                                onClick={() => {
                                    if (!editLrAccountPermission || isClose || lsItemData.get('beCertificate')) return;
                                    // 删除本条成功之后显示什么内容
                                    if (uuidList.some((v, i)=> v.get('oriUuid') === uuid && i === uuidList.size-1)) {
                                        // 最后一条关闭
                                        dispatch(searchRunningActions.deleteSingleFlow(uuid, () =>{
                                            if (typeof onClose === 'function') {
                                                refreshList && isCurrentRunning && refreshList()
                                                isCurrentRunning ?
                                                dispatch(previewRunningActions.closePreviewRunning(false))
                                                :
                                                dispatch(previewRunningActions.getPreviewNextRunningBusinessFetch(currentOri,() => {
                                                    pageActive === 'SearchRunning'&& dispatch(searchRunningActions.afterModifyAccountAllList())
                                                }))
                                                onClose()
                                            } else {
                                                refreshList && isCurrentRunning && refreshList()
                                                dispatch(previewRunningActions.closePreviewRunning(false))
                                            }
                                        }))
                                    } else {
                                        const index = uuidList.findIndex(v => v.get('oriUuid') === uuid) +1

                                        dispatch(searchRunningActions.deleteSingleFlow(uuid, () => {
                                            const nextItem = uuidList.get(index)
                                            if (isCurrentRunning) {
                                                dispatch(previewRunningActions.getPreviewNextRunningBusinessFetch(nextItem, () => {
                                                    refreshList && refreshList()
                                                }))
                                            } else {
                                                dispatch(previewRunningActions.getPreviewRelatedRunningBusinessFetch(nextItem.get('oriUuid'),uuidList.splice(index-1,1), () => {
                                                    showRelatedRunning()
                                                    dispatch(previewRunningActions.getPreviewNextRunningBusinessFetch(currentOri))
                                                    pageActive === 'SearchRunning' && dispatch(searchRunningActions.afterModifyAccountAllList())
                                                }))

                                            }

                                        }))
                                    }
                                }}
                            >
                                删除
                            </Button>
                    </div>
                }
                {
                    <div key='z8' className='ylls-title-btn'>
                        <Button
                            type='ghost'
                            className='handle-btn'
                            disabled={!reviewLrAccountPermission || isClose || (oriState === 'STATE_SYJZ_JZSR' || oriState === 'STATE_SYJZ_JZCBFY' || oriState === 'STATE_SYJZ_JZBNLR')}
                            onClick={() => {
                                if (lsItemData.get('beCertificate')) {
                                    dispatch(searchRunningActions.deleteVcItemFetch('runningPreview', deleteYear, deleteMonth, deleteVcId, issuedate, inputValue,true,currentOri,() => {
                                        refreshList && refreshList()
                                        pageActive === 'SearchRunning' && !isCurrentRunning && dispatch(searchRunningActions.afterModifyAccountAllList())
                                    }))
                                } else {
                                    dispatch(searchRunningActions.runningInsertOrModifyVc('runningPreview', fromJS([{oriUuid: lsItemData.get('oriUuid'), jrNumber: lsItemData.get('jrIndex')}]), 'insert', issuedate, inputValue,true,currentOri,() => {
                                        refreshList && refreshList()
                                        pageActive === 'SearchRunning' && !isCurrentRunning && dispatch(searchRunningActions.afterModifyAccountAllList())
                                    }))
                                }
                            }}
                        >
                            {!lsItemData.get('beCertificate') ? '审核': '反审核'}
                        </Button>
                    </div>
                }

                <Button
                    type="ghost"
                    disabled={!reviewLrAccountPermission}
                    className="title-right"
                    onClick={() => {
                        dispatch(allActions.handlePrintModalVisible(true))
                        sessionStorage.setItem('fromPos', 'searchRunningPreview')
                        dispatch(printActions.setPrintString('fromPage','cxls'))
                        dispatch(printActions.setPrintString('oriUuid',[currentItem.get('oriUuid')]))
                    }}
                    >
                    打印
                </Button>
                {
                    uuidList && uuidList.size?
                        <div key='z9' className='ylls-title-btn'>
                            <Button
                                type='ghost'
                                className='ylls-btn'
                                disabled={uuidList.some((v, i) => v.get('oriUuid') === uuid && i === uuidList.size-1)}
                                onClick={() => {

                                    if (uuidList.some((v, i)=> v.get('oriUuid') === uuid && i === uuidList.size-1)) {
                                        return
                                    }

                                    const index = uuidList.findIndex(v => v.get('oriUuid') === uuid) +1
                                    const nextItem = uuidList.get(index)
                                    if (isCurrentRunning) {
                                        dispatch(previewRunningActions.getPreviewNextRunningBusinessFetch(nextItem))
                                    } else {
                                        dispatch(previewRunningActions.getPreviewRelatedRunningBusinessFetch(nextItem.get('oriUuid'),uuidList , () => showRelatedRunning()))
                                    }
                                }}
                            >
                                <Icon type="caret-right" />
                            </Button>
                        </div>:''
                }
            </div>
        )
    }
}
