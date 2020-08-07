import React from 'react'
import { connect } from 'react-redux'
import { fromJS, toJS } from 'immutable';

import { Modal, Button, Tooltip, DatePicker, Select, Icon } from 'antd'
import moment from 'moment'
import * as Limit from 'app/constants/Limit.js'
import { receiptList } from 'app/containers/Config/Approval/components/common.js'
import { debounce } from 'app/utils'
import { showToolTipAccountState, suitTypeList } from 'app/containers/Search/SearchApproval/common/common.js'

import { hideCategoryCanSelect } from 'app/containers/Config/Approval/components/common.js'

import RunningPart from './RunningPart'
import CalculatePart from './CalculatePart'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'
import { getCategorynameByType } from 'app/containers/Edit/EditRunning/common/common.js'

@connect(state => state)
export default
    class EditRunningModal extends React.Component {

    static displayName = 'EditRunningModal'

    constructor(props) {
        super(props)
        const editRunningModalTemp = this.props.editRunningModalState.get('editRunningModalTemp')
        const categoryData = this.props.editRunningModalState.get('categoryData')
        const { categoryTypeObj } = editRunningModalTemp.get('jrCategoryType') ? getCategorynameByType(editRunningModalTemp.get('jrCategoryType')) : {categoryTypeObj: ''}

        this.state = {
            showCardModal: false,
            showContact: categoryTypeObj && categoryData.getIn([categoryTypeObj, 'contactsManagement']) || editRunningModalTemp.get('beContact'),
            showProject: categoryData.get('beProject') || editRunningModalTemp.get('beProject'),
            currentbillType: editRunningModalTemp.getIn(['billList', 0, 'billType'])
        }
    }

    shouldComponentUpdate(nextprops, nextstate) {
        return this.props.editRunningModalState !== nextprops.editRunningModalState || this.props.allState !== nextprops.allState || this.state !== nextstate
    }

    componentWillReceiveProps(nextprops) {
        
        if (this.props.editRunningModalState.getIn(['editRunningModalTemp', 'jrCategoryUuid']) !== nextprops.editRunningModalState.getIn(['editRunningModalTemp', 'jrCategoryUuid'])) {
            const editRunningModalTemp = nextprops.editRunningModalState.get('editRunningModalTemp')
            const categoryData = nextprops.editRunningModalState.get('categoryData')
            const { categoryTypeObj } = editRunningModalTemp.get('jrCategoryType') ? getCategorynameByType(editRunningModalTemp.get('jrCategoryType')) : {categoryTypeObj: ''}

            this.setState({
                showContact: categoryTypeObj && categoryData.getIn([categoryTypeObj, 'contactsManagement']) || editRunningModalTemp.get('beContact'),
                showProject: categoryData.get('beProject') || editRunningModalTemp.get('beProject')
            })
        }
    }

    render() {
        console.log('EditRunningModal');

        const {
            editRunningModalState,
            onCancel,
            allState,
            homeState,
            dispatch,
            onShowPayModal,
            onShowAccountModal,
            onShowReceiveModal,
            onShowBookKeepingModal,
            setSelectList,
            setReceiveMoney,
            setConfirmAccountingApprovalDetail,
            setConfirmReceiveApprovalDetail,
            setConfirmPayApprovalDetail,
            setBookKeepingApprovalDetail
        } = this.props

        const {
            showContact,
            showProject,
            currentbillType
        } = this.state

        const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editLrAccountPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])
        
        const editRunningModalTemp = editRunningModalState.get('editRunningModalTemp')
        const categoryData = editRunningModalState.get('categoryData')
        const datailList = editRunningModalState.get('datailList')
        const runningCategory = allState.get('runningCategory')
        const accountList = allState.get('accountList')
        const taxRate = allState.get('taxRate')

        const jrDate = editRunningModalTemp.get('jrDate')
        const jrId = editRunningModalTemp.get('id')
        const dateFormat = 'YYYY-MM-DD'
        const jrCategoryType = editRunningModalTemp.get('jrCategoryType')
        const detailType = editRunningModalTemp.get('detailType')
        const jrAmount = editRunningModalTemp.get('jrAmount')
        const dealState = editRunningModalTemp.get('dealState')
        const account = editRunningModalTemp.get('account')
        const outputAccount = editRunningModalTemp.get('outputAccount')
        const canChoseDetailList = editRunningModalTemp.get('canChoseDetailList')
        const { categoryTypeObj } = jrCategoryType ? getCategorynameByType(jrCategoryType) : {categoryTypeObj: ''}
        
        const beManagemented = categoryTypeObj ? categoryData.getIn([categoryTypeObj, 'beManagemented']) : false
        const beZeroInventory = categoryTypeObj ? categoryData.getIn([categoryTypeObj, 'beZeroInventory']) : false

        const enableWarehouse = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
        const openQuantity = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('QUANTITY') > -1

        const index = datailList.findIndex(v => v.get('id') === jrId)

        let canAccount = false
        if (jrCategoryType === 'LB_XCZC') {
            if (categoryData.get('propertyPay') === 'SX_FLF') {
                canAccount = categoryData.getIn([categoryTypeObj, 'beWelfare'])  
            } else if (categoryData.get('propertyPay') === 'SX_QTXC') {
                canAccount = categoryData.getIn([categoryTypeObj, 'beAccrued']) 
            }
        } else {
            canAccount = beManagemented
        }

        const hideCalculateSuitType = ['内部转账', '存货调拨套件']

        return (
            <Modal
                visible={true}
                maskClosable={false}
                width='800px'
                title={'调整'}
                onCancel={() => {
                    onCancel()
                }}
                footer={null}
                bodyStyle={{padding: 0}}
            >
                <div className="approval-running-modal-wrap">
                    <div className="approval-running-base-config-wrap">
                        <div className="approval-running-card-input-wrap">
                            <span className="approval-running-card-input-tip">明细类型：</span>
                            <span className="approval-running-card-input">
                                <Select
                                    value={detailType ? detailType : ''}
                                    style={{ width: '100%' }}
                                    // disabled={propertyCarryover === 'SX_HW'}
                                    disabled={suitTypeList.indexOf(detailType) > -1}  // 是否是特定套件
                                    onChange={value => {
                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('detailId', valueList[0]))
                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('detailType', valueList[1]))
                                    }}
                                >
                                    {
                                        canChoseDetailList && canChoseDetailList.toJS().map((v, i) => <Select.Option value={`${v.id}${Limit.TREE_JOIN_STR}${v.label}`} key={i}>{`${v.label}`}</Select.Option>)
                                    }
                                </Select>
                            </span>
                        </div>
                        <div className="approval-running-card-input-wrap">
                            <span className="approval-running-card-input-tip">明细日期：</span>
                            <span className="approval-running-card-input">
                                <DatePicker
                                    format={dateFormat}
                                    value={jrDate ? moment(jrDate, dateFormat) : ''}
                                    onChange={(date, dateString) => {
                                        dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrDate', dateString))
                                    }}
                                />
                            </span>
                        </div>
                        {
                            hideCalculateSuitType.indexOf(detailType) > -1 ?
                            <CalculatePart
                                dispatch={dispatch}
                                editRunningModalState={editRunningModalState}
                                accountList={accountList}
                                enableWarehouse={false}
                                warehouseCanUse={enableWarehouse}
                                openQuantity={openQuantity}
                            />
                            :
                            <RunningPart
                                dispatch={dispatch}
                                editRunningModalState={editRunningModalState}
                                taxRate={taxRate}
                                runningCategory={runningCategory}
                                accountList={accountList}
                                enableWarehouse={enableWarehouse}
                                openQuantity={openQuantity}
                                currentbillType={currentbillType}
                                showProject={showProject}
                                showContact={showContact}
                            />
                        }
                    </div>
                </div>
                <div className="approval-running-modal-btn-wrap">
                    <div className="approval-running-modal-btn-left">
                        <Button
                            type='ghost'
                            className=''
                            disabled={index === 0}
                            onClick={() => debounce(() => {
                                dispatch(searchApprovalActions.getApprovalProcessDetailInfo(datailList.getIn([index-1, 'id']), ()=> {}, 'switch'))
                            })()}
                        >
                            <Icon type="caret-left" />
                        </Button>
                        <Button
                            type='ghost'
                            className=''
                            disabled={index === datailList.size-1}
                            onClick={() => debounce(() => {
                                dispatch(searchApprovalActions.getApprovalProcessDetailInfo(datailList.getIn([index+1, 'id']), () => {}, 'switch'))
                            })()}
                        >
                            <Icon type="caret-right" />
                        </Button>
                        <Tooltip placement="top" title={showToolTipAccountState[dealState] === '挂账' && (datailList.getIn([index, 'jrState']) == 'JR_HANDLE_HALF' || datailList.getIn([index, 'jrState']) == 'JR_HANDLE_ALL') ? '有关联的核销流水，无法反挂账' : ''}>
                            <Button
                                type='ghost'
                                disabled={!editLrAccountPermission || (showToolTipAccountState[dealState] === '挂账' && (datailList.getIn([index, 'jrState']) == 'JR_HANDLE_HALF' || datailList.getIn([index, 'jrState']) == 'JR_HANDLE_ALL'))}
                                style={{display: dealState ? '' : 'none'}}
                                onClick={() => debounce(() => {
                                    dispatch(searchApprovalActions.cancelApprovalProcessDetailInfo([jrId], ()=> {
                                        dispatch(searchApprovalActions.getApprovalProcessDetailInfo(jrId, ()=> {}, 'switch'))
                                    }))
                                })()}
                            >
                                {`反${showToolTipAccountState[dealState]}`}
                            </Button>
                        </Tooltip>
                        <Button
                            type='ghost'
                            className=''
                            disabled={!editLrAccountPermission}
                            style={{display: !dealState && hideCategoryCanSelect.indexOf(jrCategoryType) > -1  ? '' : 'none'}}
                            onClick={() => {
                                onShowBookKeepingModal()

                                if (outputAccount && outputAccount.size && outputAccount.get('accountUuid')) {
                                    const accountList = allState.get('accountList');
                                    const accountSelectList = accountList.size ? accountList.getIn([0, 'childList']) : fromJS([]);

                                    const accountItem = accountSelectList.find(v => v.get('uuid') === outputAccount.get('accountUuid'));
                                    
                                    if (accountItem) {
                                        const poundageObj = {needPoundage: accountItem.get('needPoundage'), poundage: accountItem.get('poundage'), poundageRate: accountItem.get('poundageRate')}
                                        const poundage = poundageObj.poundage
                                        const poundageRate = poundageObj.poundageRate
                                        const amount =  jrAmount > 0 ? jrAmount : -jrAmount
                                        const sxAmount = ((Math.abs(amount || 0)*poundageRate/1000 > poundage) && poundage > 0) ? poundage : Math.abs(amount || 0)*poundageRate/1000

                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', fromJS({
                                            accountName: outputAccount.get('accountName'),
                                            accountUuid: outputAccount.get('accountUuid'),
                                            poundage: poundageObj,
                                            poundageAmount: (sxAmount || 0).toFixed(2),
                                        }) ))
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('formPos', 'modal'))
                                        
                                        if (!poundageObj.needPoundage) {
                                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
                                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))
                                        }
                                    }
                                }
                                dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('receiveTotalMoney', jrAmount > 0 ? jrAmount : -jrAmount))

                               
                                setBookKeepingApprovalDetail((values, cb) => {
                                    dispatch(searchApprovalActions.modifyApprovalProcessDetailInfo(editRunningModalTemp, () => {
                                        dispatch(searchApprovalActions.bookKeepingApprovalProcessDetailInfo([jrId], ...values, () => {
                                            cb()
                                            dispatch(searchApprovalActions.getApprovalProcessDetailInfo(jrId, ()=> {}, 'switch'))
                                        }))
                                    }))
                                })
                            }}
                        >
                            核记
                        </Button>
                        <Button
                            type='ghost'
                            className=''
                            disabled={!editLrAccountPermission}
                            style={{display: !dealState && canAccount ? '' : 'none'}}
                            onClick={() => {
                                onShowAccountModal()
                                if (jrAmount > 0 && beZeroInventory) {
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beZeroInventory', beZeroInventory))
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', ''))
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCostList', fromJS([])))
                                }
                                setConfirmAccountingApprovalDetail((values, cb) => {
                                    dispatch(searchApprovalActions.modifyApprovalProcessDetailInfo(editRunningModalTemp, () => {
                                        dispatch(searchApprovalActions.accountingApprovalProcessDetailInfo([jrId], ...values, () => {
                                            cb()
                                            dispatch(searchApprovalActions.getApprovalProcessDetailInfo(jrId, ()=> {}, 'switch'))
                                        }))
                                    }))
                                })
                            }}
                        >
                            挂账
                        </Button>
                        <Button
                            type='ghost'
                            className=''
                            disabled={!editLrAccountPermission}
                            style={{display: hideCategoryCanSelect.indexOf(jrCategoryType) > -1 ? 'none' : (!dealState && ((receiptList.indexOf(jrCategoryType) === -1 && jrAmount > 0) || (receiptList.indexOf(jrCategoryType) > -1 && jrAmount < 0)) ? '' : 'none')}}
                            onClick={() => {
                                onShowPayModal()
                                if (jrAmount > 0 && beZeroInventory) {
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beZeroInventory', beZeroInventory))
                                }

                                if (account && account.size && account.get('accountUuid')) {
                                    const accountList = allState.get('accountList');
                                    const accountSelectList = accountList.size ? accountList.getIn([0, 'childList']) : fromJS([]);
                                    const accountItem = accountSelectList.find(v => v.get('uuid') === account.get('accountUuid'));
                                    
                                    if (accountItem) {
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', fromJS({
                                            accountName: account.get('accountName'),
                                            accountUuid: account.get('accountUuid'),
                                        }) ))
                                    }
                                }

                                setConfirmPayApprovalDetail((values, cb) => {
                                    dispatch(searchApprovalActions.modifyApprovalProcessDetailInfo(editRunningModalTemp, () => {
                                        dispatch(searchApprovalActions.payingApprovalProcessDetailInfo([jrId], ...values, () => {
                                            cb()
                                            dispatch(searchApprovalActions.getApprovalProcessDetailInfo(jrId, ()=> {}, 'switch'))
                                        }))
                                    }))
                                })
                            }}
                        >
                            付款
                        </Button>
                        <Button
                            type='ghost'
                            className=''
                            disabled={!editLrAccountPermission}
                            style={{display: hideCategoryCanSelect.indexOf(jrCategoryType) > -1 ? 'none' : (!dealState && ((receiptList.indexOf(jrCategoryType) === -1 && jrAmount < 0) || (receiptList.indexOf(jrCategoryType) > -1 && jrAmount > 0)) ? '' : 'none')}}
                            onClick={() => {
                                onShowReceiveModal()

                                if (account && account.size && account.get('accountUuid')) {
                                    const accountList = allState.get('accountList');
                                    const accountSelectList = accountList.size ? accountList.getIn([0, 'childList']) : fromJS([]);

                                    const accountItem = accountSelectList.find(v => v.get('uuid') === account.get('accountUuid'));
                                    
                                    if (accountItem) {
                                        const poundageObj = {needPoundage: accountItem.get('needPoundage'), poundage: accountItem.get('poundage'), poundageRate: accountItem.get('poundageRate')}
                                        const poundage = poundageObj.poundage
                                        const poundageRate = poundageObj.poundageRate
                                        const amount =  jrAmount > 0 ? jrAmount : -jrAmount
                                        const sxAmount = ((Math.abs(amount || 0)*poundageRate/1000 > poundage) && poundage > 0) ? poundage : Math.abs(amount || 0)*poundageRate/1000

                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', fromJS({
                                            accountName: account.get('accountName'),
                                            accountUuid: account.get('accountUuid'),
                                            poundage: poundageObj,
                                            poundageAmount: (sxAmount || 0).toFixed(2),
                                        }) ))
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('formPos', 'modal'))
                                        
                                        if (!poundageObj.needPoundage) {
                                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
                                            dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))
                                        }
                                    }
                                }
                                dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('receiveTotalMoney', jrAmount > 0 ? jrAmount : -jrAmount))

                                setConfirmReceiveApprovalDetail((values, cb) => {
                                    dispatch(searchApprovalActions.modifyApprovalProcessDetailInfo(editRunningModalTemp, () => {
                                        dispatch(searchApprovalActions.receiveApprovalProcessDetailInfo([jrId], ...values, () => {
                                            cb()
                                            dispatch(searchApprovalActions.getApprovalProcessDetailInfo(jrId, ()=> {}, 'switch'))
                                        }))
                                    }))
                                })
                            }}
                        >
                            收款
                        </Button>
                        <Button
                            type='ghost'
                            className=''
                            disabled={!editLrAccountPermission}
                            style={{display: !dealState ? '' : 'none'}}
                            onClick={() => debounce(() => {
                                dispatch(searchApprovalActions.disuseApprovalProcessDetailInfo([jrId], () => {
                                    dispatch(searchApprovalActions.getApprovalProcessDetailInfo(jrId, ()=> {}, 'switch'))
                                }))
                            })()}
                        >
                            作废
                        </Button>
                    </div>
                    <div className="approval-running-modal-btn-right">
                        <Button
                            key="cancel"
                            type="ghost"
                            onClick={() => {
                                onCancel()
                            }}
                        >
                            取 消
                        </Button>
                        <Tooltip placement="top" title={dealState ? `${dealState==='PROCESS_DISUSE' ? '该明细已作废' : '已生成流水'}，无法继续调整` : ''}>
                            <Button
                                key="save"
                                type="primary"
                                disabled={!editLrAccountPermission || !!dealState}
                                onClick={() => {
                                    dispatch(searchApprovalActions.modifyApprovalProcessDetailInfo(editRunningModalTemp, () => onCancel()))
                                }}
                            >
                                保 存
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </Modal>
        )
    }
}
