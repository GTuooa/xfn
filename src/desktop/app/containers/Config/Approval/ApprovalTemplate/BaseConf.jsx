import React from 'react'
import { fromJS } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Input, Radio, Checkbox, TreeSelect, Select } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { getSelectJrCategoryList, getSelectJrCategoryChildList, receiptList, hideCategoryCanSelect } from '../components/common.js'
import { getCategorynameByType } from 'app/containers/Edit/EditRunning/common/common.js'

import CategoryCom from './CategoryCom'
import HideCategory from './HideCategory'

import * as approvalTemplateActions from 'app/redux/Config/Approval/ApprovalTemplate/approvalTemplate.action.js'

@immutableRenderDecorator
export default
    class BaseConf extends React.Component {

    render() {

        const {
            dispatch,
            baseSetting,
            hideCategoryList,
            runningCategory,
            categoryData,
            detailList,
            projectCardList,
            contactCardList,
            stockCardList,
            warehouseCardList,
            modelComponentList,
            modalCategoryList,
            modalCardList,
            accountList,
            enableWarehouse,
            insertOrModify
        } = this.props

        const modelCode = baseSetting.get('modelCode')
        const modelName = baseSetting.get('modelName')
        const jrCategoryType = baseSetting.get('jrCategoryType')
        const jrCategoryId = baseSetting.get('jrCategoryId')
        const jrCategoryName = baseSetting.get('jrCategoryName')
        const remark = baseSetting.get('remark')
        const detailScope = baseSetting.get('detailScope')
        const use = baseSetting.get('use')
        const selectPerson = baseSetting.get('selectPerson')
        const nature = baseSetting.get('nature')
        const natureScope = baseSetting.get('natureScope')
        const jrAccount = baseSetting.get('jrAccount')
        const jrAccountScope = baseSetting.get('jrAccountScope')
        const jrAccountRequired = baseSetting.get('jrAccountRequired')
        const contact = baseSetting.get('contact')
        const contactScope = baseSetting.get('contactScope')
        const contactRequired = baseSetting.get('contactRequired')
        const depot = baseSetting.get('depot')
        const depotScope = baseSetting.get('depotScope')
        const stock = baseSetting.get('stock')
        const stockScope = baseSetting.get('stockScope')
        const project = baseSetting.get('project')
        const projectScope = baseSetting.get('projectScope')
        const projectRequired = baseSetting.get('projectRequired')
        const jrCategory = baseSetting.get('jrCategory')
        const jrCategoryScope = baseSetting.get('jrCategoryScope')
        const jrCategoryList = getSelectJrCategoryList(runningCategory, hideCategoryList, false, {})
        const digest = baseSetting.get('digest')
        const digestRequired = baseSetting.get('digestRequired')
        const outContactScope = baseSetting.get('outContactScope')
        const outProjectScope = baseSetting.get('outProjectScope')
        const outStockScope = baseSetting.get('outStockScope')
        const jrCategoryProperty = baseSetting.get('jrCategoryProperty')
        const incomeExpensesProperty = baseSetting.get('incomeExpensesProperty')

        const { categoryTypeObj } = getCategorynameByType(jrCategoryType)
        const contactsRange = categoryData.getIn([categoryTypeObj, 'contactsRange'])
        const stockRange = categoryData.getIn([categoryTypeObj, 'stockRange'])
        const beDeposited = categoryData.getIn([categoryTypeObj, 'beDeposited'])
        const projectRange = categoryData.get('projectRange')
        const newProjectRange = categoryData.get('newProjectRange')
        const propertyCarryover = categoryData.get('propertyCarryover')
        const propertyList = categoryData.get('propertyList') ? categoryData.get('propertyList') : fromJS([]) // GXZT_DJGL

        let payOrReceive = ''
        if (receiptList.indexOf(jrCategoryType) > -1) {
            payOrReceive = 'RECEIPT'
        } else {
            payOrReceive = 'PAYMENT'
        }

        let showIncomeExpensesProperty = false // 是否显示收入或支出属性
        // 营业收入 的 货物加服务 以及 营业收入 和 营业支出 两个顶级类别
        if (propertyCarryover === 'SX_HW_FW' || propertyList.indexOf('GXZT_DJGL') > -1) {
            showIncomeExpensesProperty = true
        }

        const detailListSouce = detailList ? detailList.filter(v => v.get('detailNature') === payOrReceive) : []

        return (
            <div className="approval-base-config-wrap">
                <div className="approval-card-input-wrap">
                    <span className="approval-card-input-tip">审批名称：</span>
                    <span className={insertOrModify === 'insert' ? "approval-card-input approval-card-input-prefix" : "approval-card-input"}>
                        <Input
                            disabled={false}
                            value={modelName}
                            placeholder="必填，最长50个字符"
                            onChange={(e) => {
                                dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('modelName', e.target.value))
                            }}
                        />
                    </span>
                    <span className="approval-card-input-tip approval-card-input-tip-right">关联流水类别：</span>
                    <span className="approval-card-input">
                        <TreeSelect
                            style={{ width: 285 }}
                            value={categoryData.get('canUse') ? (jrCategoryName ? jrCategoryId + Limit.TREE_JOIN_STR + jrCategoryType + Limit.TREE_JOIN_STR + jrCategoryName : '') : (jrCategoryName ? jrCategoryName : '')}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={jrCategoryList}
                            placeholder="必填，请选择流水类别"
                            treeDefaultExpandAll
                            onChange={(info) => {
                                const valueList = info.split(Limit.TREE_JOIN_STR)
                                // if (jrCategoryId !== valueList[0]) {
                                if (hideCategoryCanSelect.indexOf(valueList[1]) > -1) {
                                    const childList = getSelectJrCategoryChildList(valueList[0], runningCategory, valueList[2])
                                    dispatch(approvalTemplateActions.changeApprovalBaseSettingHideCategory(modelCode, valueList[0], valueList[1], valueList[2], childList))
                                } else {
                                    const childList = getSelectJrCategoryChildList(valueList[0], runningCategory, valueList[2])
                                    dispatch(approvalTemplateActions.changeApprovalBaseSettingJrCategory(modelCode, valueList[0], valueList[1], valueList[2], childList))
                                }

                                // const nextPayOrReceive = receiptList.indexOf(valueList[1]) > -1 ? 'RECEIPT' : 'PAYMENT'
                                // if (payOrReceive !== nextPayOrReceive) { // 下一个类别的类型不一样时需要清空明细范围
                                //     dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('detailScope', fromJS([])))
                                // }
                            }}
                        />
                    </span>
                </div>
                <div className="approval-card-input-wrap">
                    <span className="approval-card-input-tip" style={{display: showIncomeExpensesProperty ? '' : 'none'}}>{`${payOrReceive === 'RECEIPT' ? '收入' : '支出'}`}属性：</span>
                    <span className="approval-card-input" style={{display: showIncomeExpensesProperty ? '' : 'none'}}>
                        <Radio.Group
                            onChange={(e) => {
                                // 切换 服务 和
                                dispatch(approvalTemplateActions.switchApprovalBaseSettingCategoryProperty(e.target.value))
                            }}
                            value={incomeExpensesProperty}
                        >
                            <Radio value={'SX_DJ'} key="0" style={{display: propertyList.indexOf('GXZT_DJGL') > -1 ? '' : 'none'}}>{payOrReceive === 'RECEIPT' ? '预收' : '预付'}</Radio>
                            <Radio value={'SX_FW'} key="1" style={{display: (jrCategoryType === 'LB_YYSR' || jrCategoryType === 'LB_YYZC') && (propertyCarryover === 'SX_HW_FW' || propertyCarryover === 'SX_FW') ? '' : 'none'}}>{payOrReceive === 'RECEIPT' ? '销售' : '购进'}服务</Radio>
                            <Radio value={'SX_HW'} key="2" style={{display: (jrCategoryType === 'LB_YYSR' || jrCategoryType === 'LB_YYZC') && (propertyCarryover === 'SX_HW_FW' || propertyCarryover === 'SX_HW') ? '' : 'none'}}>{payOrReceive === 'RECEIPT' ? '销售' : '购进'}货物</Radio>
                            <Radio value={'SX_FS'} key="3" style={{display: jrCategoryType === 'LB_FYZC' ? '' : 'none'}}>发生</Radio>
                        </Radio.Group>
                    </span>
                    <span className={showIncomeExpensesProperty ? "approval-card-input-tip approval-card-input-tip-right" : "approval-card-input-tip"}>备注：</span>
                    <span className="approval-card-input">
                        <Input
                            disabled={false}
                            value={remark}
                            placeholder="选填，最长100个字符"
                            onChange={(e) => dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('remark', e.target.value))}
                        />
                    </span>
                </div>
                <div className="approval-card-input-wrap">
                    <span className="approval-card-input-tip">明细范围：</span>
                    <span className="approval-card-input">
                        {
                            jrCategoryProperty === 'SX_HW' || incomeExpensesProperty === 'SX_HW' || incomeExpensesProperty === 'SX_DJ' || jrCategoryType === 'LB_ZZ' || jrCategoryType === 'LB_CHDB' || jrCategoryType === 'LB_ZSKX' || jrCategoryType === 'LB_ZFKX' ?
                            <Select
                                mode="multiple"
                                disabled={false}
                                value={detailScope.size ? detailScope.map(v => v.get('value')).toJS() : []}
                                style={{ width: '100%' }}
                                placeholder="必填"
                                disabled={true}
                            >
                            </Select>
                            :
                            <Select
                                mode="multiple"
                                disabled={false}
                                value={detailScope.size ? detailScope.map(v => v.get('code') + Limit.TREE_JOIN_STR + v.get('value')).toJS() : []}
                                style={{ width: '100%' }}
                                placeholder="必填"
                                disabled={!jrCategoryType}
                                onChange={value => {
                                    const valueList = value.map(v => {
                                        const value = v.split(Limit.TREE_JOIN_STR)
                                        return {
                                            "code": value[0],
                                            "value": value[1]
                                        }
                                    })
                                    dispatch(approvalTemplateActions.changeApprovalBaseSettingCommonString('detailScope', fromJS(valueList)))
                                }}
                            >
                                {
                                    // 明细分为收和付，根据选择不同的类别决定
                                    detailListSouce.toJS().map((v, i) => <Select.Option key={i} value={`${v.code}${Limit.TREE_JOIN_STR}${v.value}`}>{v.value}</Select.Option>)
                                }
                            </Select>
                        }
                    </span>
                </div>
                {
                    jrCategoryName ?
                        hideCategoryCanSelect.indexOf(jrCategoryType) > -1 ?
                        <HideCategory
                            jrCategoryType={jrCategoryType}
                            jrCategoryProperty={jrCategoryProperty}
                            dispatch={dispatch}
                            use={use}
                            selectPerson={selectPerson}
                            nature={nature}
                            natureScope={natureScope}
                            jrAccount={jrAccount}
                            jrAccountScope={jrAccountScope}
                            jrAccountRequired={jrAccountRequired}
                            contact={contact}
                            contactScope={contactScope}
                            contactRequired={contactRequired}
                            depot={depot}
			                depotScope={depotScope}
                            project={project}
                            projectScope={projectScope}
                            categoryData={categoryData}
                            projectRequired={projectRequired}
                            stockCardList={stockCardList}
                            projectCardList={projectCardList}
                            contactCardList={contactCardList}
                            modelComponentList={modelComponentList}
                            jrCategoryName={jrCategoryName}
                            contactsRange={contactsRange}
                            projectRange={projectRange}
                            newProjectRange={newProjectRange}
                            stockRange={stockRange}
                            modalCategoryList={modalCategoryList}
                            modalCardList={modalCardList}
                            jrCategory={jrCategory}
                            jrCategoryScope={jrCategoryScope}
                            digest={digest}
                            digestRequired={digestRequired}
                            payOrReceive={payOrReceive}
                            accountList={accountList}
                            enableWarehouse={enableWarehouse}
                            warehouseCardList={warehouseCardList}
                            stock={stock}
                            stockScope={stockScope}
                            outContactScope={outContactScope}
                            outProjectScope={outProjectScope}
                            outStockScope={outStockScope}
                            propertyCarryover={propertyCarryover}
                            incomeExpensesProperty={incomeExpensesProperty}
                        />
                        :
                        <CategoryCom
                            jrCategoryType={jrCategoryType}
                            jrCategoryProperty={jrCategoryProperty}
                            dispatch={dispatch}
                            use={use}
                            selectPerson={selectPerson}
                            nature={nature}
                            natureScope={natureScope}
                            jrAccount={jrAccount}
                            jrAccountScope={jrAccountScope}
                            jrAccountRequired={jrAccountRequired}
                            contact={contact}
                            contactScope={contactScope}
                            contactRequired={contactRequired}
                            depot={depot}
			                depotScope={depotScope}
                            project={project}
                            projectScope={projectScope}
                            categoryData={categoryData}
                            projectRequired={projectRequired}
                            stockCardList={stockCardList}
                            projectCardList={projectCardList}
                            contactCardList={contactCardList}
                            modelComponentList={modelComponentList}
                            jrCategoryName={jrCategoryName}
                            contactsRange={contactsRange}
                            projectRange={projectRange}
                            newProjectRange={newProjectRange}
                            stockRange={stockRange}
                            modalCategoryList={modalCategoryList}
                            modalCardList={modalCardList}
                            jrCategory={jrCategory}
                            jrCategoryScope={jrCategoryScope}
                            digest={digest}
                            digestRequired={digestRequired}
                            payOrReceive={payOrReceive}
                            accountList={accountList}
                            enableWarehouse={enableWarehouse}
                            warehouseCardList={warehouseCardList}
                            stock={stock}
                            stockScope={stockScope}
                            outContactScope={outContactScope}
                            outProjectScope={outProjectScope}
                            outStockScope={outStockScope}
                            propertyCarryover={propertyCarryover}
                            incomeExpensesProperty={incomeExpensesProperty}
                        />
                    : null
                }
            </div>
        )
    }
}
