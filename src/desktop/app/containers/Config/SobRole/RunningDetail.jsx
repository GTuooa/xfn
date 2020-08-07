import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS } from 'immutable'

import Title from './Title'
import ModuleItem from './ModuleItem'
import CheckboxItem from './CheckboxItem'
import RolePick from './RolePick'
import ProjectPick from './ProjectPick'
import ProcessModelPick from './ProcessModelPick'
import { Icon, Checkbox, Button, Radio, Tooltip }	from 'antd'

import * as sobRoleActions from 'app/redux/Config/SobRole/sobRole.action.js'

@immutableRenderDecorator
export default
class RunningDetail extends React.Component {

	render() {

        const { dispatch, roleModuleTemp, roleTemp, haveChanged, categoryRange, allCardListL, modalCategoryList, modalCardList, selectCardList, processModelList, sobId } = this.props
        
        const moduleList = roleModuleTemp.get('moduleList')

        const INITIATE_PROCESS = moduleList.get('INITIATE_PROCESS') ? moduleList.get('INITIATE_PROCESS') : fromJS([])
        const SAVE_JR = moduleList.get('SAVE_JR') ? moduleList.get('SAVE_JR') : fromJS([])
        const QUERY_JR = moduleList.get('QUERY_JR') ? moduleList.get('QUERY_JR') : fromJS([])
        const BALANCE_DETAIL = moduleList.get('BALANCE_DETAIL') ? moduleList.get('BALANCE_DETAIL') : fromJS([])
        const MANAGER = moduleList.get('MANAGER') ? moduleList.get('MANAGER') : fromJS([])
        const QUERY_PROCESS = moduleList.get('QUERY_PROCESS') ? moduleList.get('QUERY_PROCESS') : fromJS([])
        const QUERY_VC = moduleList.get('QUERY_VC') ? moduleList.get('QUERY_VC') : fromJS([])
        const REPORT = moduleList.get('REPORT') ? moduleList.get('REPORT') : fromJS([])

        const isSystem = roleTemp.get('roleInfo') === 'admin' 

		return (
			<div className="sob-role-detail-wrap">
                <Title
                    dispatch={dispatch}
                    roleModuleTemp={roleModuleTemp}
                    isSystem={isSystem}
                    isMidify={roleModuleTemp.get('roleId')}
                    haveChanged={haveChanged}
                />
                <div className="sob-role-detail-list-wrap">
                    <ul>
                        {/* 发起审批 */}
                        <ModuleItem
                            dispatch={dispatch}
                            moduleItem={INITIATE_PROCESS}
                            moduleItemName={'INITIATE_PROCESS'}
                            disabled={isSystem}
                            rangeDisabled={false} // 功能是否开放
                            rangeNotAvailable={INITIATE_PROCESS.get('limitAuthority') !== '部分权限' || INITIATE_PROCESS.getIn(['rangeList', 'MODEL'])}
                            addRange={() => {
                                dispatch(sobRoleActions.setSobRoleModuleListValue(['INITIATE_PROCESS', 'rangeList', 'MODEL'], fromJS({
                                    in: [],
                                    out: [],
                                    rangeCtgy: 'MODEL'
                                })))
                            }}
                            extraCallback={() => {
                                dispatch(sobRoleActions.setSobRoleModuleListValue(['INITIATE_PROCESS', 'preDetailList', 'INITIATE_PROCESS', 'open'], true))
                            }}
                        >
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    disabled={true}
                                    dispatch={dispatch}
                                    moduleItem={INITIATE_PROCESS}
                                    moduleItemName={'INITIATE_PROCESS'}
                                    name="发起审批"
                                    placement={['preDetailList', 'INITIATE_PROCESS', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={INITIATE_PROCESS}
                                    moduleItemName={'INITIATE_PROCESS'}
                                    name="更新模板"
                                    placement={['preDetailList', 'UPDATE_MODEL', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={INITIATE_PROCESS}
                                    moduleItemName={'INITIATE_PROCESS'}
                                    name="新增账户"
                                    placement={['preDetailList', 'UPDATE_MODEL', 'detailList', 'SAVE_ACCOUNT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={INITIATE_PROCESS}
                                    moduleItemName={'INITIATE_PROCESS'}
                                    name="新增往来"
                                    placement={['preDetailList', 'UPDATE_MODEL', 'detailList', 'SAVE_CONTACT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={INITIATE_PROCESS}
                                    moduleItemName={'INITIATE_PROCESS'}
                                    name="新增项目"
                                    placement={['preDetailList', 'UPDATE_MODEL', 'detailList', 'SAVE_PROJECT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={INITIATE_PROCESS}
                                    moduleItemName={'INITIATE_PROCESS'}
                                    name="新增存货"
                                    placement={['preDetailList', 'UPDATE_MODEL', 'detailList', 'SAVE_STOCK', 'open']}
                                />
                            </div>
                            {
                                INITIATE_PROCESS.getIn(['rangeList', 'MODEL']) ?
                                <ProcessModelPick
                                    moduleItemName={'INITIATE_PROCESS'}
                                    placement={['rangeList', 'MODEL']}
                                    title="审批模板范围"
                                    dispatch={dispatch}
                                    processModelList={processModelList}
                                    rangeList={INITIATE_PROCESS.getIn(['rangeList', 'MODEL'])}
                                    deleteAllRange={() => {
                                        const newRange = INITIATE_PROCESS.get('rangeList').delete('MODEL')
                                        dispatch(sobRoleActions.setSobRoleModuleListValue(['INITIATE_PROCESS', 'rangeList'], newRange))
                                    }}
                                />
                                : null
                            }
                        </ModuleItem>

                        {/* 录入流水 */}
                        <ModuleItem
                            dispatch={dispatch}
                            moduleItem={SAVE_JR}
                            moduleItemName={'SAVE_JR'}
                            disabled={isSystem}
                            rangeDisabled={true}
                            addRange={() => {}}
                            extraCallback={() => {
                                dispatch(sobRoleActions.setSobRoleModuleListValue(['SAVE_JR', 'preDetailList', 'RUD_JR', 'open'], true))
                            }}
                        >
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={SAVE_JR}
                                    moduleItemName={'SAVE_JR'}
                                    disabled={true}
                                    name="增/删/改流水"
                                    placement={['preDetailList', 'RUD_JR', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={SAVE_JR}
                                    moduleItemName={'SAVE_JR'}
                                    name="快捷管理"
                                    placement={['preDetailList', 'QUICK_MANAGER', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={SAVE_JR}
                                    moduleItemName={'SAVE_JR'}
                                    name="新增账户"
                                    placement={['preDetailList', 'QUICK_MANAGER', 'detailList', 'SAVE_ACCOUNT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={SAVE_JR}
                                    moduleItemName={'SAVE_JR'}
                                    name="新增往来"
                                    placement={['preDetailList', 'QUICK_MANAGER', 'detailList', 'SAVE_CONTACT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={SAVE_JR}
                                    moduleItemName={'SAVE_JR'}
                                    name="新增项目"
                                    placement={['preDetailList', 'QUICK_MANAGER', 'detailList', 'SAVE_PROJECT', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox" style={{display: SAVE_JR && SAVE_JR.getIn(['preDetailList', 'QUICK_MANAGER', 'open']) ? '' : 'none'}}>
                                <span className="sob-role-detail-item-placehoder" style={{width: '125px'}}></span>
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={SAVE_JR}
                                    moduleItemName={'SAVE_JR'}
                                    name="新增存货"
                                    placement={['preDetailList', 'QUICK_MANAGER', 'detailList', 'SAVE_STOCK', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={SAVE_JR}
                                    moduleItemName={'SAVE_JR'}
                                    name="新增仓库"
                                    placement={['preDetailList', 'QUICK_MANAGER', 'detailList', 'SAVE_WAREHOUSE', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={SAVE_JR}
                                    moduleItemName={'SAVE_JR'}
                                    name="修改存货默认价格"
                                    placement={['preDetailList', 'QUICK_MANAGER', 'detailList', 'MODIFY_STOCK_PRICE', 'open']}
                                />
                            </div>
                        </ModuleItem>

                        {/* 查询审批 */}
                        <ModuleItem
                            dispatch={dispatch}
                            moduleItem={QUERY_PROCESS}
                            moduleItemName={'QUERY_PROCESS'}
                            disabled={isSystem}
                            rangeDisabled={true}
                            addRange={() => {}}
                            extraCallback={() => {
                                dispatch(sobRoleActions.setSobRoleModuleListValue(['QUERY_PROCESS', 'preDetailList', 'QUERY_PROCESS', 'open'], true))
                            }}
                        >
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    disabled={true}
                                    moduleItem={QUERY_PROCESS}
                                    moduleItemName={'QUERY_PROCESS'}
                                    name="查看审批"
                                    placement={['preDetailList', 'QUERY_PROCESS', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_PROCESS}
                                    moduleItemName={'QUERY_PROCESS'}
                                    name="记账/反记账"
                                    placement={['preDetailList', 'CHARGE_ACCOUNT', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_PROCESS}
                                    moduleItemName={'QUERY_PROCESS'}
                                    name="调整"
                                    placement={['preDetailList', 'ADJUST', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_PROCESS}
                                    moduleItemName={'QUERY_PROCESS'}
                                    name="快捷操作"
                                    placement={['preDetailList', 'QUICK_OPERATION', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_PROCESS}
                                    moduleItemName={'QUERY_PROCESS'}
                                    name="收款"
                                    placement={['preDetailList', 'QUICK_OPERATION', 'detailList', 'COLLECTION', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_PROCESS}
                                    moduleItemName={'QUERY_PROCESS'}
                                    name="付款"
                                    placement={['preDetailList', 'QUICK_OPERATION', 'detailList', 'PAYMENT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_PROCESS}
                                    moduleItemName={'QUERY_PROCESS'}
                                    name="收入退款"
                                    placement={['preDetailList', 'QUICK_OPERATION', 'detailList', 'INCOME_REFUND', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_PROCESS}
                                    moduleItemName={'QUERY_PROCESS'}
                                    name="支出退款"
                                    placement={['preDetailList', 'QUICK_OPERATION', 'detailList', 'PAYMENT_REFUND', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox" style={{display: QUERY_PROCESS && QUERY_PROCESS.getIn(['preDetailList', 'QUICK_OPERATION', 'open']) ? '' : 'none'}}>
                                <span className="sob-role-detail-item-placehoder"  style={{width: '125px'}}></span>
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_PROCESS}
                                    moduleItemName={'QUERY_PROCESS'}
                                    name="处置损益"
                                    placement={['preDetailList', 'QUICK_OPERATION', 'detailList', 'DISPOSAL_PROFIT_LOSS', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_PROCESS}
                                    moduleItemName={'QUERY_PROCESS'}
                                    name="发票部分"
                                    placement={['preDetailList', 'QUICK_OPERATION', 'detailList', 'INVOICE', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_PROCESS}
                                    moduleItemName={'QUERY_PROCESS'}
                                    name="快捷管理"
                                    placement={['preDetailList', 'QUICK_MANAGER', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_PROCESS}
                                    moduleItemName={'QUERY_PROCESS'}
                                    name="新增往来"
                                    placement={['preDetailList', 'QUICK_MANAGER', 'detailList', 'SAVE_CONTACT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_PROCESS}
                                    moduleItemName={'QUERY_PROCESS'}
                                    name="新增项目"
                                    placement={['preDetailList', 'QUICK_MANAGER', 'detailList', 'SAVE_PROJECT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_PROCESS}
                                    moduleItemName={'QUERY_PROCESS'}
                                    name="新增存货"
                                    placement={['preDetailList', 'QUICK_MANAGER', 'detailList', 'SAVE_STOCK', 'open']}
                                />
                            </div>
                        </ModuleItem>
                        
                        {/* 查询流水 */}
                        <ModuleItem
                            dispatch={dispatch}
                            moduleItem={QUERY_JR}
                            moduleItemName={'QUERY_JR'}
                            disabled={isSystem}
                            rangeDisabled={false} // 功能是否开放
                            rangeNotAvailable={QUERY_JR.get('limitAuthority') !== '部分权限' || QUERY_JR.getIn(['rangeList', 'MAKER'])}
                            addRange={() => {
                                dispatch(sobRoleActions.setSobRoleModuleListValue(['QUERY_JR', 'rangeList', 'MAKER'], fromJS({
                                    in: [],
                                    out: [],
                                    rangeCtgy: 'MAKER'
                                })))
                            }}
                            extraCallback={() => {
                                dispatch(sobRoleActions.setSobRoleModuleListValue(['QUERY_JR', 'preDetailList', 'QUERY_JR', 'open'], true))
                            }}
                        >
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    disabled={true}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="查看流水"
                                    placement={['preDetailList', 'QUERY_JR', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="修改流水"
                                    placement={['preDetailList', 'MODIFY_JR', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="全量整理"
                                    placement={['preDetailList', 'FULL_FINISHING','open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="删除流水"
                                    placement={['preDetailList', 'DELETE_JR', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="批量删除"
                                    placement={['preDetailList', 'DELETE_JR', 'detailList', 'FULL_DELETE','open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="快捷操作"
                                    placement={['preDetailList', 'QUICK_OPERATION', 'open']}
                                />

                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="收款"
                                    placement={['preDetailList', 'QUICK_OPERATION', 'detailList', 'COLLECTION', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="付款"
                                    placement={['preDetailList', 'QUICK_OPERATION', 'detailList', 'PAYMENT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="收入退款"
                                    placement={['preDetailList', 'QUICK_OPERATION', 'detailList', 'INCOME_REFUND', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="支出退款"
                                    placement={['preDetailList', 'QUICK_OPERATION', 'detailList', 'PAYMENT_REFUND', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox" style={{display: QUERY_JR && QUERY_JR.getIn(['preDetailList', 'QUICK_OPERATION', 'open']) ? '' : 'none'}}>
                                <span className="sob-role-detail-item-placehoder" style={{width: '125px'}}></span>
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="处置损益"
                                    placement={['preDetailList', 'QUICK_OPERATION', 'detailList', 'DISPOSAL_PROFIT_LOSS', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="发票部分"
                                    placement={['preDetailList', 'QUICK_OPERATION', 'detailList', 'INVOICE', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="审核"
                                    placement={['preDetailList', 'AUDIT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="批量审核"
                                    placement={['preDetailList', 'AUDIT', 'detailList', 'BATCH_AUDIT', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="反审核"
                                    placement={['preDetailList', 'CANCEL_AUDIT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="批量反审核"
                                    placement={['preDetailList', 'CANCEL_AUDIT', 'detailList', 'BATCH_AUDIT', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="附件管理"
                                    placement={['preDetailList', 'ATTACHMENT_MANAGER', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="批量删除"
                                    placement={['preDetailList', 'ATTACHMENT_MANAGER', 'detailList', 'BATCH_DELETE', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="管理附件标签"
                                    placement={['preDetailList', 'ATTACHMENT_MANAGER', 'detailList', 'ATTACHMENT_LABEL_MANAGER', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="导出/导出记录"
                                    placement={['preDetailList', 'ATTACHMENT_MANAGER', 'detailList', 'EXPORT_AND_RECORD', 'open']}
                                />
                            </div>
                            <div className="sob-role-detail-item-checkbox">
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="打印"
                                    placement={['preDetailList', 'PRINT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={QUERY_JR}
                                    moduleItemName={'QUERY_JR'}
                                    name="批量打印"
                                    placement={['preDetailList', 'PRINT', 'detailList', 'BATCH_PRINT', 'open']}
                                />
                            </div>
                            {
                                QUERY_JR.getIn(['rangeList', 'MAKER']) || QUERY_JR.get('oneself') ?
                                <RolePick
                                    moduleItemName={'QUERY_JR'}
                                    placement={['rangeList', 'MAKER']}
                                    title="制单人范围"
                                    dispatch={dispatch}
                                    rangeList={QUERY_JR.getIn(['rangeList', 'MAKER'])}
                                    checkedSelf={QUERY_JR.get('oneself')}
                                    deleteAllRange={(name) => {
                                        const newRange = QUERY_JR.get('rangeList').delete('MAKER')
                                        dispatch(sobRoleActions.setSobRoleModuleListValue(['QUERY_JR', 'rangeList'], newRange))
                                        dispatch(sobRoleActions.setSobRoleModuleListValue(['QUERY_JR', 'oneself'], false))
                                    }}
                                />
                                : null
                            }
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
                                    name="批量导出Excel"
                                    placement={['preDetailList', 'BATCH_EXPORT_EXCEL', 'open']}
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
                                    name="阿米巴损益表"
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
                                <span className={!REPORT.getIn(['preDetailList', 'AMB_PROFIT_LOSS_REPORT', 'open']) || REPORT.getIn(['preDetailList', 'AMB_PROFIT_LOSS_REPORT', 'rangeList', 'PROJECT']) ? "sob-role-detail-item-range sob-role-detail-item-range-disabled" : "sob-role-detail-item-range"} onClick={() => {
                                    if (REPORT.getIn(['preDetailList', 'AMB_PROFIT_LOSS_REPORT', 'open']) && !REPORT.getIn(['preDetailList', 'AMB_PROFIT_LOSS_REPORT', 'rangeList', 'PROJECT'])) {
                                        dispatch(sobRoleActions.getProjectAllCard(sobId, () => {
                                            dispatch(sobRoleActions.setSobRoleModuleListValue(['REPORT', 'preDetailList', 'AMB_PROFIT_LOSS_REPORT', 'rangeList', 'PROJECT'], fromJS({
                                                in: [],
                                                out: [],
                                                rangeCtgy: 'PROJECT'
                                            })))
                                        }))
                                    }
                                }}>
                                    添加限制范围
                                </span>
                            </div>
                            {
                                REPORT.getIn(['preDetailList', 'AMB_PROFIT_LOSS_REPORT', 'rangeList', 'PROJECT']) ?
                                <ProjectPick
                                    moduleItemName={'REPORT'}
                                    placement={['preDetailList', 'AMB_PROFIT_LOSS_REPORT', 'rangeList', 'PROJECT']}
                                    title="项目范围"
                                    dispatch={dispatch}
                                    categoryRange={categoryRange}
                                    allCardListL={allCardListL}
                                    modalCategoryList={modalCategoryList}
                                    modalCardList={modalCardList}
                                    selectCardList={selectCardList}
                                    rangeList={REPORT.getIn(['preDetailList', 'AMB_PROFIT_LOSS_REPORT', 'rangeList', 'PROJECT'])}
                                    deleteAllRange={(name) => {
                                        const newRange = REPORT.getIn(['preDetailList', 'AMB_PROFIT_LOSS_REPORT', 'rangeList']).delete(name)
                                        dispatch(sobRoleActions.setSobRoleModuleListValue(['REPORT', 'preDetailList', 'AMB_PROFIT_LOSS_REPORT', 'rangeList'], newRange))
                                    }}
                                />
                                : null
                            }
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
                                    name="账户余额/明细表"
                                    placement={['preDetailList', 'ACCOUNT_BALANCE_STATEMENT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出余额表"
                                    placement={['preDetailList', 'ACCOUNT_BALANCE_STATEMENT', 'detailList', 'EXPORT_BALANCE', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出明细表"
                                    placement={['preDetailList', 'ACCOUNT_BALANCE_STATEMENT', 'detailList', 'EXPORT_STATEMENT', 'open']}
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
                                    name="往来余额/明细表"
                                    placement={['preDetailList', 'CONTACT_BALANCE_STATEMENT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出余额表"
                                    placement={['preDetailList', 'CONTACT_BALANCE_STATEMENT', 'detailList', 'EXPORT_BALANCE', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出明细表"
                                    placement={['preDetailList', 'CONTACT_BALANCE_STATEMENT', 'detailList', 'EXPORT_STATEMENT', 'open']}
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
                                    name="项目余额/明细表"
                                    placement={['preDetailList', 'PROJECT_BALANCE_STATEMENT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出余额表"
                                    placement={['preDetailList', 'PROJECT_BALANCE_STATEMENT', 'detailList', 'EXPORT_BALANCE', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出明细表"
                                    placement={['preDetailList', 'PROJECT_BALANCE_STATEMENT', 'detailList', 'EXPORT_STATEMENT', 'open']}
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
                                    name="存货余额/明细表"
                                    placement={['preDetailList', 'STOCK_BALANCE_STATEMENT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出余额表"
                                    placement={['preDetailList', 'STOCK_BALANCE_STATEMENT', 'detailList', 'EXPORT_BALANCE', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出明细表"
                                    placement={['preDetailList', 'STOCK_BALANCE_STATEMENT', 'detailList', 'EXPORT_STATEMENT', 'open']}
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
                                    name="收支余额/明细表"
                                    placement={['preDetailList', 'INCOMING_OUTGOING_BALANCE_STATEMENT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出余额表"
                                    placement={['preDetailList', 'INCOMING_OUTGOING_BALANCE_STATEMENT', 'detailList', 'EXPORT_BALANCE', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出明细表"
                                    placement={['preDetailList', 'INCOMING_OUTGOING_BALANCE_STATEMENT', 'detailList', 'EXPORT_STATEMENT', 'open']}
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
                                    name="类型余额/明细表"
                                    placement={['preDetailList', 'BALANCE_STATEMENT', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出余额表"
                                    placement={['preDetailList', 'BALANCE_STATEMENT', 'detailList', 'EXPORT_BALANCE', 'open']}
                                />
                                <CheckboxItem
                                    dispatch={dispatch}
                                    moduleItem={BALANCE_DETAIL}
                                    moduleItemName={'BALANCE_DETAIL'}
                                    name="导出明细表"
                                    placement={['preDetailList', 'BALANCE_STATEMENT', 'detailList', 'EXPORT_STATEMENT', 'open']}
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
                                        name="流水设置"
                                        placement={['preDetailList', 'JR_SETTING', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增/删/改"
                                        placement={['preDetailList', 'JR_SETTING', 'detailList', 'CUD_JR_CATEGORY', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="反悔模式"
                                        placement={['preDetailList', 'JR_SETTING', 'detailList', 'REGRET_MODEL', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="启/禁用"
                                        placement={['preDetailList', 'JR_SETTING', 'detailList', 'ENABLE_DISABLE', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="修改税费设置"
                                        placement={['preDetailList', 'JR_SETTING', 'detailList', 'TAX_SETTING', 'open']}
                                    />
                                </div>
                                <div className="sob-role-detail-item-checkbox" style={{display: MANAGER && MANAGER.getIn(['preDetailList', 'JR_SETTING', 'open']) ? '' : 'none'}}>
                                    <span className="sob-role-detail-item-placehoder" style={{width: '125px'}}></span>
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="修改/清空期初值"
                                        placement={['preDetailList', 'JR_SETTING', 'detailList', 'BEGIN_VALUE_SETTING', 'open']}
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
                                        name="账户设置"
                                        placement={['preDetailList', 'ACCOUNT_SETTING', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增/删/改"
                                        placement={['preDetailList', 'ACCOUNT_SETTING', 'detailList', 'CUD_ACCOUNT', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="启/禁用"
                                        placement={['preDetailList', 'ACCOUNT_SETTING', 'detailList', 'ENABLE_DISABLE', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="反悔模式"
                                        placement={['preDetailList', 'ACCOUNT_SETTING', 'detailList', 'REGRET_MODEL', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="手续费设置"
                                        placement={['preDetailList', 'ACCOUNT_SETTING', 'detailList', 'SERVICE_CHARGE_SETTING', 'open']}
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
                                        name="往来设置"
                                        placement={['preDetailList', 'CONTACT_SETTING', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增/删/改"
                                        placement={['preDetailList', 'CONTACT_SETTING', 'detailList', 'CUD_CONTACT_CARD', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="批量调整"
                                        placement={['preDetailList', 'CONTACT_SETTING', 'detailList', 'BATCH_ADJUST_CARD', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="启/禁用"
                                        placement={['preDetailList', 'CONTACT_SETTING', 'detailList', 'ENABLE_DISABLE_CARD', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="反悔模式"
                                        placement={['preDetailList', 'CONTACT_SETTING', 'detailList', 'REGRET_MODEL', 'open']}
                                    />
                                </div>
                                <div className="sob-role-detail-item-checkbox" style={{display: MANAGER && MANAGER.getIn(['preDetailList', 'CONTACT_SETTING', 'open']) ? '' : 'none'}}>
                                    <span className="sob-role-detail-item-placehoder" style={{width: '125px'}}></span>
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="导入往来"
                                        placement={['preDetailList', 'CONTACT_SETTING', 'detailList', 'IMPORT_CARD', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="导出往来"
                                        placement={['preDetailList', 'CONTACT_SETTING', 'detailList', 'EXPORT_CARD', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增/删/改顶级类别"
                                        placement={['preDetailList', 'CONTACT_SETTING', 'detailList', 'CUD_TOP_CATEGORY', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增/删/改往来类别"
                                        placement={['preDetailList', 'CONTACT_SETTING', 'detailList', 'CUD_CARD_CATEGORY', 'open']}
                                    />
                                </div>
                                <div className="sob-role-detail-item-checkbox" style={{display: MANAGER && MANAGER.getIn(['preDetailList', 'CONTACT_SETTING', 'open']) ? '' : 'none'}}>
                                    <span className="sob-role-detail-item-placehoder" style={{width: '125px'}}></span>
                                    <span className="sob-role-detail-item-range sob-role-detail-item-range-disabled">
                                        添加限制范围
                                    </span>
                                </div>

                                <div className="sob-role-detail-item-checkbox">
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="项目设置"
                                        placement={['preDetailList', 'PROJECT_SETTING', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增/删/改"
                                        placement={['preDetailList', 'PROJECT_SETTING', 'detailList', 'CUD_CARD', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="启/禁用"
                                        placement={['preDetailList', 'PROJECT_SETTING', 'detailList', 'ENABLE_DISABLE_CARD', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="反悔模式"
                                        placement={['preDetailList', 'PROJECT_SETTING', 'detailList', 'REGRET_MODEL', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增/删/改项目类别"
                                        placement={['preDetailList', 'PROJECT_SETTING', 'detailList', 'CUD_CARD_CATEGORY', 'open']}
                                    />
                                </div>
                                <div className="sob-role-detail-item-checkbox" style={{display: MANAGER && MANAGER.getIn(['preDetailList', 'PROJECT_SETTING', 'open']) ? '' : 'none'}}>
                                    <span className="sob-role-detail-item-placehoder" style={{width: '125px'}}></span>
                                    <span className="sob-role-detail-item-range sob-role-detail-item-range-disabled">
                                        添加限制范围
                                    </span>
                                </div>

                                <div className="sob-role-detail-item-checkbox">
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="存货设置"
                                        placement={['preDetailList', 'STOCK_SETTING', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增/删/改"
                                        placement={['preDetailList', 'STOCK_SETTING', 'detailList', 'CUD_CARD', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="批量调整"
                                        placement={['preDetailList', 'STOCK_SETTING', 'detailList', 'BATCH_ADJUST_CARD', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="启/禁用"
                                        placement={['preDetailList', 'STOCK_SETTING', 'detailList', 'ENABLE_DISABLE_CARD', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="反悔模式"
                                        placement={['preDetailList', 'STOCK_SETTING', 'detailList', 'REGRET_MODEL', 'open']}
                                    />
                                </div>
                                <div className="sob-role-detail-item-checkbox" style={{display: MANAGER && MANAGER.getIn(['preDetailList', 'STOCK_SETTING', 'open']) ? '' : 'none'}}>
                                    <span className="sob-role-detail-item-placehoder" style={{width: '125px'}}></span>
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="导入存货/期初值"
                                        placement={['preDetailList', 'STOCK_SETTING', 'detailList', 'IMPORT_CARD_AND_BEING_VALUE', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="导出存货/期初值"
                                        placement={['preDetailList', 'STOCK_SETTING', 'detailList', 'EXPORT_CARD_AND_BEING_VALUE', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增/删/改顶级类别"
                                        placement={['preDetailList', 'STOCK_SETTING', 'detailList', 'CUD_TOP_CATEGORY', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增/删/改存货类别"
                                        placement={['preDetailList', 'STOCK_SETTING', 'detailList', 'CUD_CARD_CATEGORY', 'open']}
                                    />
                                </div>
                                <div className="sob-role-detail-item-checkbox" style={{display: MANAGER && MANAGER.getIn(['preDetailList', 'STOCK_SETTING', 'open']) ? '' : 'none'}}>
                                    <span className="sob-role-detail-item-placehoder" style={{width: '125px'}}></span>
                                    <span className="sob-role-detail-item-range sob-role-detail-item-range-disabled">
                                        添加限制范围
                                    </span>
                                </div>

                                <div className="sob-role-detail-item-checkbox">
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="仓库设置"
                                        placement={['preDetailList', 'WAREHOUSE_SETTING', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增/删/改"
                                        placement={['preDetailList', 'WAREHOUSE_SETTING', 'detailList', 'CUD_CARD', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="启/禁用"
                                        placement={['preDetailList', 'WAREHOUSE_SETTING', 'detailList', 'ENABLE_DISABLE_CARD', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="导入仓库"
                                        placement={['preDetailList', 'WAREHOUSE_SETTING', 'detailList', 'IMPORT_CARD', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="导出仓库"
                                        placement={['preDetailList', 'WAREHOUSE_SETTING', 'detailList', 'EXPORT_CARD', 'open']}
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
                                        name="审批设置"
                                        placement={['preDetailList', 'PROCESS_SETTING', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增/删/改模版"
                                        placement={['preDetailList', 'PROCESS_SETTING', 'detailList', 'CUD_PROCESS_MODEL', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="更新模版"
                                        placement={['preDetailList', 'PROCESS_SETTING', 'detailList', 'UPDATE_PROCESS_MODEL', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="启/禁用"
                                        placement={['preDetailList', 'PROCESS_SETTING', 'detailList', 'ENABLE_DISABLE_MODEL', 'open']}
                                    />
                                    <CheckboxItem
                                        dispatch={dispatch}
                                        moduleItem={MANAGER}
                                        moduleItemName={'MANAGER'}
                                        name="增/删/改明细"
                                        placement={['preDetailList', 'PROCESS_SETTING', 'detailList', 'CUD_PROCESS_DETAIL', 'open']}
                                    />
                                </div>
                                <div className="sob-role-detail-item-checkbox" style={{display: MANAGER && MANAGER.getIn(['preDetailList', 'PROCESS_SETTING', 'open']) ? '' : 'none'}}>
                                    <span className="sob-role-detail-item-placehoder" style={{width: '125px'}}></span>
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
