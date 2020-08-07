import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import * as sobRoleActions from 'app/redux/Config/SobRole/sobRole.action.js'

import Title from './Title'
import ModuleItem from './ModuleItem'
import CheckboxItem from './CheckboxItem'
import RolePick from './RolePick'

import { Icon, Checkbox, Button, Radio }	from 'antd'

@immutableRenderDecorator
export default
class GLDetail extends React.Component {

	render() {

		const { dispatch, roleModuleTemp, roleTemp, haveChanged } = this.props

        const isSystem = roleTemp.get('roleInfo') === 'admin'
        const moduleList = roleModuleTemp.get('moduleList')

        const BALANCE_DETAIL = moduleList.get('BALANCE_DETAIL') ? moduleList.get('BALANCE_DETAIL'): fromJS([])
        const MANAGER = moduleList.get('MANAGER') ? moduleList.get('MANAGER') : fromJS([])
        const QUERY_VC = moduleList.get('QUERY_VC') ? moduleList.get('QUERY_VC') : fromJS([])
        const REPORT = moduleList.get('REPORT') ? moduleList.get('REPORT') : fromJS([])
        const SAVE_VC = moduleList.get('SAVE_VC') ? moduleList.get('SAVE_VC') : fromJS([])

		return (
			<div className="sob-role-detail-wrap">
                <Title
                    dispatch={dispatch}
                    roleModuleTemp={roleModuleTemp}
                    isSystem={isSystem}
                    haveChanged={haveChanged}
                    isMidify={roleModuleTemp.get('roleId')}
                />
                <div className="sob-role-detail-list-wrap">
                    <ul>

                        {/* 录入凭证 */}
                        <ModuleItem
                            dispatch={dispatch}
                            moduleItem={SAVE_VC}
                            moduleItemName={'SAVE_VC'}
                            disabled={isSystem}
                            rangeDisabled={true}
                            addRange={() => {}}
                            extraCallback={() => {
                                dispatch(sobRoleActions.setSobRoleModuleListValue(['SAVE_VC', 'preDetailList', 'RUD_VC', 'open'], true))
                            }}
                        >
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={SAVE_VC}
                                    moduleItemName={'SAVE_VC'}
                                    name="增/删/改凭证"
                                    disabled={true}
                                    placement={['preDetailList', 'RUD_VC', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={SAVE_VC}
                                    moduleItemName={'SAVE_VC'}
                                    name="快捷管理"
                                    placement={['preDetailList', 'QUICK_MANAGER', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={SAVE_VC}
                                    moduleItemName={'SAVE_VC'}
                                    name="新增科目"
                                    placement={['preDetailList', 'QUICK_MANAGER', 'detailList', 'SAVE_AC', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={SAVE_VC}
                                    moduleItemName={'SAVE_VC'}
                                    name="新增辅助"
                                    placement={['preDetailList', 'QUICK_MANAGER', 'detailList', 'SAVE_ASS', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={SAVE_VC}
                                    moduleItemName={'SAVE_VC'}
                                    name="草稿箱"
                                    placement={['preDetailList', 'DRAFT_BOX', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={SAVE_VC}
                                    moduleItemName={'SAVE_VC'}
                                    name="锁定草稿"
                                    placement={['preDetailList', 'DRAFT_BOX', 'detailList', 'LOCKING_DRAFT_BOX', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={SAVE_VC}
                                    moduleItemName={'SAVE_VC'}
                                    name="解锁草稿"
                                    placement={['preDetailList', 'DRAFT_BOX', 'detailList', 'UNLOCKING_DRAFT_BOX', 'open']}
                                />
                                {/*
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={SAVE_VC}
                                        moduleItemName={'SAVE_VC'}
                                        name="批量转凭证"
                                        placement={['preDetailList', 'DRAFT_BOX', 'detailList', 'BATCH_TRANSFER_VOUCHER', 'open']}
                                    />
                                */}
                            </div>
                        </ModuleItem>

                        {/* 查询凭证 */}
                        <ModuleItem
                            dispatch={dispatch}
                            moduleItem={QUERY_VC}
                            moduleItemName={'QUERY_VC'}
                            disabled={isSystem}
                            rangeDisabled={false} // 功能是否开放
                            rangeNotAvailable={QUERY_VC.get('limitAuthority') !== '部分权限' || QUERY_VC.getIn(['rangeList', 'MAKER'])}
                            addRange={() => {
                                dispatch(sobRoleActions.setSobRoleModuleListValue(['QUERY_VC', 'rangeList', 'MAKER'], fromJS({
                                    in: [],
                                    out: [],
                                    rangeCtgy: 'MAKER'
                                })))
                            }}
                            extraCallback={() => {
                                dispatch(sobRoleActions.setSobRoleModuleListValue(['QUERY_VC', 'preDetailList', 'QUERY_VC', 'open'], true))
                            }}
                        >
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    disabled={true}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="查看凭证"
                                    placement={['preDetailList', 'QUERY_VC', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="修改凭证"
                                    placement={['preDetailList', 'MODIFY_VC', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="批量转草稿"
                                    placement={['preDetailList', 'MODIFY_VC', 'detailList', 'BATCH_TRANSFER_DRAFT', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="删除凭证"
                                    placement={['preDetailList', 'DELETE_VC', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="批量删除"
                                    placement={['preDetailList', 'DELETE_VC', 'detailList', 'BATCH_DELETE', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="批量导出Excel"
                                    placement={['preDetailList', 'BATCH_EXPORT_EXCEL', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="全量整理"
                                    placement={['preDetailList', 'FULL_FINISHING', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="审核"
                                    placement={['preDetailList', 'AUDIT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="批量审核"
                                    placement={['preDetailList', 'AUDIT', 'detailList', 'BATCH_AUDIT', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="反审核"
                                    placement={['preDetailList', 'CANCEL_AUDIT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="批量反审核"
                                    placement={['preDetailList', 'CANCEL_AUDIT', 'detailList', 'BATCH_CANCEL_AUDIT', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="打印"
                                    placement={['preDetailList', 'PRINT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="批量打印/导出PDF"
                                    placement={['preDetailList', 'PRINT', 'detailList', 'BATCH_PRINT_AND_EXPORT_PDF', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="附件管理"
                                    placement={['preDetailList', 'ATTACHMENT_MANAGER', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="批量删除"
                                    placement={['preDetailList', 'ATTACHMENT_MANAGER', 'detailList', 'BATCH_DELETE', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="下载/导出记录"
                                    placement={['preDetailList', 'ATTACHMENT_MANAGER', 'detailList', 'EXPORT_AND_RECORD', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_VC}
                                    moduleItemName={'QUERY_VC'}
                                    name="管理附件标签"
                                    placement={['preDetailList', 'ATTACHMENT_MANAGER', 'detailList', 'ATTACHMENT_LABEL_MANAGER', 'open']}
                                />
                            </div>
                            {
                                QUERY_VC.getIn(['rangeList', 'MAKER']) || QUERY_VC.get('oneself') ?
                                <RolePick
                                    moduleItemName={'QUERY_VC'}
                                    placement={['rangeList', 'MAKER']}
                                    title="制单人范围"
                                    dispatch={dispatch}
                                    rangeList={QUERY_VC.getIn(['rangeList', 'MAKER'])}
                                    checkedSelf={QUERY_VC.get('oneself')}
                                    deleteAllRange={(name) => {
                                        const newRange = QUERY_VC.get('rangeList').delete('MAKER')
                                        dispatch(sobRoleActions.setSobRoleModuleListValue(['QUERY_VC', 'rangeList'], newRange))
                                        dispatch(sobRoleActions.setSobRoleModuleListValue(['QUERY_VC', 'oneself'], false))
                                    }}
                                />
                                : null
                            }
                        </ModuleItem>

                        {/* 报表 */}
                        <ModuleItem
                            dispatch={dispatch}
                            moduleItem={REPORT}
                            moduleItemName={'REPORT'}
                            disabled={isSystem}
                            rangeDisabled={true}
                            addRange={() => {}}
                        >
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="利润表"
                                    placement={['preDetailList', 'PROFIT_REPORT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="导出Excel"
                                    placement={['preDetailList', 'PROFIT_REPORT', 'detailList', 'EXPORT_EXCEL', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="导出PDF/打印"
                                    placement={['preDetailList', 'PROFIT_REPORT', 'detailList', 'EXPORT_PDF', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="调整"
                                    placement={['preDetailList', 'PROFIT_REPORT', 'detailList', 'ADJUST', 'open']}
                                />
                            </div> 
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="资产负债表"
                                    placement={['preDetailList', 'BALANCE_SHEET', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="导出Excel"
                                    placement={['preDetailList', 'BALANCE_SHEET', 'detailList', 'EXPORT_EXCEL', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="导出PDF/打印"
                                    placement={['preDetailList', 'BALANCE_SHEET', 'detailList', 'EXPORT_PDF', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="调整"
                                    placement={['preDetailList', 'BALANCE_SHEET', 'detailList', 'ADJUST', 'open']}
                                />
                            </div> 
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="现金流量表"
                                    placement={['preDetailList', 'CASH_FLOW_REPORT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="导出Excel"
                                    placement={['preDetailList', 'CASH_FLOW_REPORT', 'detailList', 'EXPORT_EXCEL', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="导出PDF/打印"
                                    placement={['preDetailList', 'CASH_FLOW_REPORT', 'detailList', 'EXPORT_PDF', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="调整"
                                    placement={['preDetailList', 'CASH_FLOW_REPORT', 'detailList', 'ADJUST', 'open']}
                                />
                            </div> 
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="应交税费表"
                                    placement={['preDetailList', 'TAX_PAYABLE_REPORT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="导出Excel"
                                    placement={['preDetailList', 'TAX_PAYABLE_REPORT', 'detailList', 'EXPORT_EXCEL', 'open']}
                                />
                                {/* 
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={REPORT}
                                        moduleItemName={'REPORT'}
                                        name="导出PDF/打印"
                                        placement={['preDetailList', 'TAX_PAYABLE_REPORT', 'detailList', 'EXPORT_PDF', 'open']}
                                    />  
                                */}
                            </div> 
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="阿米巴报表"
                                    placement={['preDetailList', 'AMB_PROFIT_LOSS_REPORT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="导出Excel"
                                    placement={['preDetailList', 'AMB_PROFIT_LOSS_REPORT', 'detailList', 'EXPORT_EXCEL', 'open']}
                                />
                                {/*
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={REPORT}
                                        moduleItemName={'REPORT'}
                                        name="导出PDF/打印"
                                        placement={['preDetailList', 'AMB_PROFIT_LOSS_REPORT', 'detailList', 'EXPORT_PDF', 'open']}
                                    />  
                                */}
                            </div> 
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={REPORT}
                                    moduleItemName={'REPORT'}
                                    name="老板表"
                                    placement={['preDetailList', 'BOSS_REPORT', 'open']}
                                />
                                {/*
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={REPORT}
                                        moduleItemName={'REPORT'}
                                        name="导出Excel"
                                        placement={['preDetailList', 'BOSS_REPORT', 'detailList', 'EXPORT_EXCEL', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={REPORT}
                                        moduleItemName={'REPORT'}
                                        name="导出PDF/打印"
                                        placement={['preDetailList', 'TAX_PAYABLE_REPORT', 'detailList', 'EXPORT_PDF', 'open']}
                                    />
                                */}
                            </div>
                        </ModuleItem>
                        
                        {/* 余额/明细表 */}
                        <ModuleItem
                            dispatch={dispatch}
                            moduleItem={BALANCE_DETAIL}
                            moduleItemName={'BALANCE_DETAIL'}
                            disabled={isSystem}
                            noRange={true}
                            rangeDisabled={true}
                            addRange={() => {}}
                        >
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="科目余额/明细表"
                                    placement={['preDetailList', 'AC_BALANCE_STATEMENT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出Excel-余额表"
                                    placement={['preDetailList', 'AC_BALANCE_STATEMENT', 'detailList', 'EXPORT_BALANCE_EXCEL', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出PDF-余额表"
                                    placement={['preDetailList', 'AC_BALANCE_STATEMENT', 'detailList', 'EXPORT_BALANCE_PDF', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出Excel-当前明细"
                                    placement={['preDetailList', 'AC_BALANCE_STATEMENT', 'detailList', 'EXPORT_CURRENT_STATEMENT_EXCEL', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox" style={{display: BALANCE_DETAIL && BALANCE_DETAIL.getIn(['preDetailList', 'AC_BALANCE_STATEMENT', 'open']) ? '' : 'none'}}>
                                <span className="sob-role-detail-item-placehoder"></span>
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出Excel-所有明细"
                                    placement={['preDetailList', 'AC_BALANCE_STATEMENT', 'detailList', 'EXPORT_ALL_STATEMENT_EXCEL', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出Excel-总账"
                                    placement={['preDetailList', 'AC_BALANCE_STATEMENT', 'detailList', 'EXPORT_GL_EXCEL', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出PDF-当前明细"
                                    placement={['preDetailList', 'AC_BALANCE_STATEMENT', 'detailList', 'EXPORT_CURRENT_STATEMENT_PDF', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox" style={{display: BALANCE_DETAIL && BALANCE_DETAIL.getIn(['preDetailList', 'AC_BALANCE_STATEMENT', 'open']) ? '' : 'none'}}>
                                <span className="sob-role-detail-item-placehoder"></span>
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出PDF-所有明细"
                                    placement={['preDetailList', 'AC_BALANCE_STATEMENT', 'detailList', 'EXPORT_ALL_STATEMENT_PDF', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出PDF-总账"
                                    placement={['preDetailList', 'AC_BALANCE_STATEMENT', 'detailList', 'EXPORT_GL_PDF', 'open']}
                                />
                                <span className="sob-role-detail-item-range sob-role-detail-item-range-disabled">
                                    添加限制范围
                                </span>
                            </div>

                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="辅助余额/明细表"
                                    placement={['preDetailList', 'ASS_BALANCE_STATEMENT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出Excel-余额表"
                                    placement={['preDetailList', 'ASS_BALANCE_STATEMENT', 'detailList', 'EXPORT_BALANCE_EXCEL', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出PDF-余额表"
                                    placement={['preDetailList', 'ASS_BALANCE_STATEMENT', 'detailList', 'EXPORT_BALANCE_PDF', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出Excel-明细表"
                                    placement={['preDetailList', 'ASS_BALANCE_STATEMENT', 'detailList', 'EXPORT_STATEMENT_EXCEL', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox" style={{display: BALANCE_DETAIL && BALANCE_DETAIL.getIn(['preDetailList', 'ASS_BALANCE_STATEMENT', 'open']) ? '' : 'none'}}>
                                <span className="sob-role-detail-item-placehoder"></span>
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出PDF-明细表"
                                    placement={['preDetailList', 'ASS_BALANCE_STATEMENT', 'detailList', 'EXPORT_STATEMENT_PDF', 'open']}
                                />
                                <span className="sob-role-detail-item-range sob-role-detail-item-range-disabled">
                                    添加限制范围
                                </span>
                            </div>

                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="资产余额/明细表"
                                    placement={['preDetailList', 'ASSETS_BALANCE_STATEMENT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出Excel-余额表"
                                    placement={['preDetailList', 'ASSETS_BALANCE_STATEMENT', 'detailList', 'EXPORT_BALANCE_EXCEL', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出PDF-余额表"
                                    placement={['preDetailList', 'ASSETS_BALANCE_STATEMENT', 'detailList', 'EXPORT_BALANCE_PDF', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出Excel-明细表"
                                    placement={['preDetailList', 'ASSETS_BALANCE_STATEMENT', 'detailList', 'EXPORT_STATEMENT_EXCEL', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox" style={{display: BALANCE_DETAIL && BALANCE_DETAIL.getIn(['preDetailList', 'ASSETS_BALANCE_STATEMENT', 'open']) ? '' : 'none'}}>
                                <span className="sob-role-detail-item-placehoder"></span>
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出PDF-明细表"
                                    placement={['preDetailList', 'ASSETS_BALANCE_STATEMENT', 'detailList', 'EXPORT_STATEMENT_PDF', 'open']}
                                />
                                <span className="sob-role-detail-item-range sob-role-detail-item-range-disabled">
                                    添加限制范围
                                </span>
                            </div>

                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="外币余额/明细表"
                                    placement={['preDetailList', 'FOREIGN_CURRENCY_BALANCE_STATEMENT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出Excel-余额表"
                                    placement={['preDetailList', 'FOREIGN_CURRENCY_BALANCE_STATEMENT', 'detailList', 'EXPORT_BALANCE_EXCEL', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出PDF-余额表"
                                    placement={['preDetailList', 'FOREIGN_CURRENCY_BALANCE_STATEMENT', 'detailList', 'EXPORT_BALANCE_PDF', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出Excel-明细表"
                                    placement={['preDetailList', 'FOREIGN_CURRENCY_BALANCE_STATEMENT', 'detailList', 'EXPORT_STATEMENT_EXCEL', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox" style={{display: BALANCE_DETAIL && BALANCE_DETAIL.getIn(['preDetailList', 'FOREIGN_CURRENCY_BALANCE_STATEMENT', 'open']) ? '' : 'none'}}>
                                <span className="sob-role-detail-item-placehoder"></span>
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出PDF-明细表"
                                    placement={['preDetailList', 'FOREIGN_CURRENCY_BALANCE_STATEMENT', 'detailList', 'EXPORT_STATEMENT_PDF', 'open']}
                                />
                                <span className="sob-role-detail-item-range sob-role-detail-item-range-disabled">
                                    添加限制范围
                                </span>
                            </div>

                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="数量余额/明细表"
                                    placement={['preDetailList', 'NUMBER_BALANCE_STATEMENT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出Excel-余额表"
                                    placement={['preDetailList', 'NUMBER_BALANCE_STATEMENT', 'detailList', 'EXPORT_BALANCE_EXCEL', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出PDF-余额表"
                                    placement={['preDetailList', 'NUMBER_BALANCE_STATEMENT', 'detailList', 'EXPORT_BALANCE_PDF', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出Excel-当前明细表"
                                    placement={['preDetailList', 'NUMBER_BALANCE_STATEMENT', 'detailList', 'EXPORT_CURRENT_STATEMENT_EXCEL', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox" style={{display: BALANCE_DETAIL && BALANCE_DETAIL.getIn(['preDetailList', 'NUMBER_BALANCE_STATEMENT', 'open']) ? '' : 'none'}}>
                                <span className="sob-role-detail-item-placehoder"></span>
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出Excel-所有明细"
                                    placement={['preDetailList', 'NUMBER_BALANCE_STATEMENT', 'detailList', 'EXPORT_STATEMENT_EXCEL', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出PDF-明细表"
                                    placement={['preDetailList', 'NUMBER_BALANCE_STATEMENT', 'detailList', 'EXPORT_STATEMENT_PDF', 'open']}
                                />
                                <span className="sob-role-detail-item-range sob-role-detail-item-range-disabled">
                                    添加限制范围
                                </span>
                            </div>
                        </ModuleItem>
                        {
                            MANAGER ?
                            <ModuleItem
                                dispatch={dispatch}
                                moduleItem={MANAGER}
                                moduleItemName={'MANAGER'}
                                disabled={isSystem}
                                noRange={true}
                                rangeDisabled={true}
                                addRange={() => {}}
                            >
                                <div className="sob-role-detail-item-checkbox">
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="科目设置"
                                        placement={['preDetailList', 'AC_SETTING', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增删改科目"
                                        placement={['preDetailList', 'AC_SETTING', 'detailList', 'CUD_AC_SETTING', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="导入科目"
                                        placement={['preDetailList', 'AC_SETTING', 'detailList', 'IMPORT_AC', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="导出科目"
                                        placement={['preDetailList', 'AC_SETTING', 'detailList', 'EXPORT_AC', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="反悔模式"
                                        placement={['preDetailList', 'AC_SETTING', 'detailList', 'REGRET_MODEL', 'open']}
                                    />
                                </div>
                                <div className="sob-role-detail-item-checkbox" style={{display: MANAGER && MANAGER.getIn(['preDetailList', 'AC_SETTING', 'open']) ? '' : 'none'}}>
                                    <span className="sob-role-detail-item-placehoder" style={{width: '125px'}}></span>
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="设置计算单位"
                                        placement={['preDetailList', 'AC_SETTING', 'detailList', 'UNIT_SETTING', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="保存/清空期初值"
                                        placement={['preDetailList', 'AC_SETTING', 'detailList', 'BEGIN_VALUE_SETTING', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="导入期初值"
                                        placement={['preDetailList', 'AC_SETTING', 'detailList', 'IMPORT_BEGIN_VALUE', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="导出期初值"
                                        placement={['preDetailList', 'AC_SETTING', 'detailList', 'EXPORT_BEGIN_VALUE', 'open']}
                                    />
                                </div>
                                <div className="sob-role-detail-item-checkbox" style={{display: MANAGER && MANAGER.getIn(['preDetailList', 'AC_SETTING', 'open']) ? '' : 'none'}}>
                                    <span className="sob-role-detail-item-placehoder" style={{width: '125px'}}></span>
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="试算平衡"
                                        placement={['preDetailList', 'AC_SETTING', 'detailList', 'TRIAL_BALANCE', 'open']}
                                    />
                                    <span className="sob-role-detail-item-range sob-role-detail-item-range-disabled">
                                        添加限制范围
                                    </span>
                                </div>

                                <div className="sob-role-detail-item-checkbox">
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="辅助设置"
                                        placement={['preDetailList', 'ASS_SETTING', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增删改辅助核算"
                                        placement={['preDetailList', 'ASS_SETTING', 'detailList', 'CUD_ASS', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="阿米巴模式"
                                        placement={['preDetailList', 'ASS_SETTING', 'detailList', 'AMB_MODEL', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="导入辅助核算"
                                        placement={['preDetailList', 'ASS_SETTING', 'detailList', 'IMPORT_ASS', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        
                                        name="导出辅助核算"
                                        placement={['preDetailList', 'ASS_SETTING', 'detailList', 'EXPORT_ASS', 'open']}
                                    />
                                </div>
                                <div className="sob-role-detail-item-checkbox" style={{display: MANAGER && MANAGER.getIn(['preDetailList', 'ASS_SETTING', 'open']) ? '' : 'none'}}>
                                    <span className="sob-role-detail-item-placehoder" style={{width: '125px'}}></span>
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="反悔模式"
                                        placement={['preDetailList', 'ASS_SETTING', 'detailList', 'REGRET_MODEL', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="关联科目"
                                        placement={['preDetailList', 'ASS_SETTING', 'detailList', 'RELATE_AC', 'open']}
                                    />
                                    <span className="sob-role-detail-item-range sob-role-detail-item-range-disabled">
                                        添加限制范围
                                    </span>
                                </div>

                                <div className="sob-role-detail-item-checkbox">
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="外币设置"
                                        placement={['preDetailList', 'FOREIGN_CURRENCY_SETTING', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增删改币别"
                                        placement={['preDetailList', 'FOREIGN_CURRENCY_SETTING', 'detailList', 'CUD_FOREIGN_CURRENCY', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="关联科目"
                                        placement={['preDetailList', 'FOREIGN_CURRENCY_SETTING', 'detailList', 'RELATE_AC', 'open']}
                                    />
                                    <span className="sob-role-detail-item-range sob-role-detail-item-range-disabled">
                                        添加限制范围
                                    </span>
                                </div>

                                <div className="sob-role-detail-item-checkbox">
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="资产设置"
                                        placement={['preDetailList', 'ASSETS_SETTING', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增删改资产类别"
                                        placement={['preDetailList', 'ASSETS_SETTING', 'detailList', 'CUD_ASSETS', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="导入资产类别"
                                        placement={['preDetailList', 'ASSETS_SETTING', 'detailList', 'IMPORT_ASSETS_CATEGORY', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="导出资产类别"
                                        placement={['preDetailList', 'ASSETS_SETTING', 'detailList', 'EXPORT_ASSETS_CATEGORY', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增删改资产卡片"
                                        placement={['preDetailList', 'ASSETS_SETTING', 'detailList', 'CUD_ASSETS_CARD', 'open']}
                                    />
                                </div>
                                <div className="sob-role-detail-item-checkbox" style={{display: MANAGER && MANAGER.getIn(['preDetailList', 'ASSETS_SETTING', 'open']) ? '' : 'none'}}>
                                    <span className="sob-role-detail-item-placehoder" style={{width: '125px'}}></span>
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="导入资产卡片"
                                        placement={['preDetailList', 'ASSETS_SETTING', 'detailList', 'IMPORT_ASSETS_CARD', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="导出资产卡片"
                                        placement={['preDetailList', 'ASSETS_SETTING', 'detailList', 'EXPORT_ASSETS_CARD', 'open']}
                                    />
                                    <span className="sob-role-detail-item-range sob-role-detail-item-range-disabled">
                                        添加限制范围
                                    </span>
                                </div>

                                <div className="sob-role-detail-item-checkbox">
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="结账"
                                        placement={['preDetailList', 'CLOSE_SOB', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="结账操作"
                                        placement={['preDetailList', 'CLOSE_SOB', 'detailList', 'CLOSING', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="反结账操作"
                                        placement={['preDetailList', 'CLOSE_SOB', 'detailList', 'OPENING', 'open']}
                                    />
                                </div>
                            </ModuleItem>
                            : null
                        }
                    </ul>
                </div>
            </div>
		)
	}
}
