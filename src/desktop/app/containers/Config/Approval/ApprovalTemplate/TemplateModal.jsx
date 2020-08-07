import React from 'react'
import { connect } from 'react-redux'

import { Modal, Button, message } from 'antd'

import BaseConf from './BaseConf'
import FormConf from './FormConf'

import * as approvalTemplateActions from 'app/redux/Config/Approval/ApprovalTemplate/approvalTemplate.action.js'

@connect(state => state)
export default
    class TemplateModal extends React.Component {

    static displayName = 'ApprovalTemplateModal'

    constructor() {
        super()
        this.state = {
            currentPage: 0
        }
    }

    shouldComponentUpdate(nextprops, nextstate) {
        return this.props.approvalTemplateState !== nextprops.approvalTemplateState || this.props.allState !== nextprops.allState || this.props.basicComponentList !== nextprops.basicComponentList || this.state !== nextstate
    }

    render() {
        const { approvalTemplateState, onCancel, allState, homeState, dispatch, basicComponentList } = this.props
        const { currentPage } = this.state

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

        const categoryData = approvalTemplateState.get('categoryData')
        const projectCardList = approvalTemplateState.get('projectCardList')
        const contactCardList = approvalTemplateState.get('contactCardList')
        const stockCardList = approvalTemplateState.get('stockCardList')
        const warehouseCardList = approvalTemplateState.get('warehouseCardList')
        const insertOrModify = approvalTemplateState.getIn(['views', 'insertOrModify'])
        const approvalTemp = approvalTemplateState.get('approvalTemp')
        const baseSetting = approvalTemp.get('baseSetting')
        const formSetting = approvalTemp.get('formSetting')
        const detailList = approvalTemp.get('detailList')
        const modelComponentList = approvalTemp.get('modelComponentList')

        const modalCategoryList = approvalTemplateState.get('modalCategoryList')
        const modalCardList = approvalTemplateState.get('modalCardList')

        const runningCategory = allState.get('runningCategory')
        const hideCategoryList = allState.get('hideCategoryList')
        const accountList = allState.get('accountList')
        const enableWarehouse = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1

        const titleList = ['基础设置', '表单设置']
        // const titleList = ['基础设置', '表单设置', '财务流设置']

        const currentComponet = {
            0: <BaseConf
                    dispatch={dispatch}
                    baseSetting={baseSetting}
                    hideCategoryList={hideCategoryList}
                    runningCategory={runningCategory}
                    categoryData={categoryData}
                    detailList={detailList}
                    projectCardList={projectCardList}
                    contactCardList={contactCardList}
                    stockCardList={stockCardList}
                    modelComponentList={modelComponentList}
                    modalCategoryList={modalCategoryList}
                    modalCardList={modalCardList}
                    accountList={accountList}
                    enableWarehouse={enableWarehouse}
                    warehouseCardList={warehouseCardList}
                    insertOrModify={insertOrModify}
                />,
            1: <FormConf
                    dispatch={dispatch}
                    formSetting={formSetting}
                    basicComponentList={basicComponentList}
                />
        }

        return (
            <Modal
                visible={true}
                maskClosable={false}
                width='800px'
                title={insertOrModify === 'insert' ? '新增审批模板' : '修改审批模板'}
                onCancel={() => {
                    onCancel()
                    dispatch(approvalTemplateActions.cancelModifyApprovalTemplate())
                }}
                footer={[
                    <Button
                        key="cancel"
                        type="ghost"
                        onClick={() => {
                            onCancel()
                            dispatch(approvalTemplateActions.cancelModifyApprovalTemplate())
                        }}
                    >
                        取 消
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        disabled={!editPermission}
                        onClick={() => {
                            dispatch(approvalTemplateActions.saveApprovalTemplate(approvalTemp, insertOrModify, () => onCancel())) 
                        }}
                    >
                        保 存
                    </Button>,
                ]}
            >
                <div className="approval-modal-wrap">
                    <div className="approval-modal-title">
                        {titleList.map((v, i) => {
                            return (
                                <span
                                    key={i}
                                    className={i === currentPage ? 'approval-modal-title-item approval-modal-title-item-cur' : 'approval-modal-title-item'}
                                    onClick={() => {
                                        if (i !== currentPage) {
                                            this.setState({ currentPage: i })
                                            // if (!baseSetting.get('jrCategoryType') && i == 1) {
                                            //     message.info('请先完成基础设置')
                                            // }
                                        }
                                    }}
                                >
                                    {v}
                                </span>
                            )
                        })}
                    </div>
                    {currentComponet[currentPage]}
                </div>
            </Modal>
        )
    }
}