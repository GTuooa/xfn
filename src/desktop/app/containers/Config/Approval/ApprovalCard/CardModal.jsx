import React from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable';

import * as Limit from 'app/constants/Limit.js'
import FormDiy from '../components/FormDiy'
import { Modal, Button, Input, Radio } from 'antd'

import * as approvalCardActions from 'app/redux/Config/Approval/ApprovalCard/approvalCard.action.js'

@connect(state => state)
export default
    class CardModal extends React.Component {

    static displayName = 'ApprovalCardModal'

    shouldComponentUpdate(nextprops, nextstate) {
        return this.props.approvalcardState !== nextprops.approvalCardState || this.props.basicComponentList !== nextprops.basicComponentList || this.state !== nextstate
    }

    render() {
        const { dispatch, approvalCardState, homeState, onCancel, basicComponentList } = this.props

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

        const cardData = approvalCardState.get('cardData')
        const detailLabel = cardData.get('detailLabel')
        const placeHolder = cardData.get('placeHolder')
        const detailNature = cardData.get('detailNature')
        const formSetting = cardData.get('formSetting')
        // const modelList = cardData.get('modelList')
        // const modelScope = cardData.get('modelScope')
        const componentList = formSetting.get('componentList')
        const insertOrModify = approvalCardState.getIn(['views', 'insertOrModify'])

        return (
            <Modal
                visible={true}
                maskClosable={false}
                width='800px'
                title={insertOrModify === 'insert' ? '新增审批明细' : '修改审批明细'}
                onCancel={() => {
                    onCancel()
                    dispatch(approvalCardActions.cancelModifyApprovalCard())
                }}
                footer={[
                    <Button
                        key="cancel"
                        type="ghost"
                        onClick={() => {
                            onCancel()
                            dispatch(approvalCardActions.cancelModifyApprovalCard())
                        }}>
                        取 消
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        disabled={!editPermission}
                        onClick={() => {
                            dispatch(approvalCardActions.saveApprovalCard(cardData, insertOrModify, () => onCancel()))
                        }}>
                        保 存
                    </Button>,
                ]}
            >
                <div className="approval-modal-wrap">
                    <div className="approval-base-config-wrap">
                        <div className="approval-card-input-wrap">
                            <span className="approval-card-input-tip">明细名称：</span>
                            <span className="approval-card-input">
                                <Input
                                    disabled={false}
                                    value={detailLabel}
                                    placeholder="必填，最长50个字符"
                                    onChange={(e) => dispatch(approvalCardActions.changeApprovalCardCommonString('detailLabel', e.target.value))}
                                />
                            </span>
                        </div>
                        <div className="approval-card-input-wrap">
                            <span className="approval-card-input-tip">提示文字：</span>
                            <span className="approval-card-input">
                                <Input
                                    disabled={false}
                                    value={placeHolder}
                                    placeholder="选填，最长50个字符"
                                    onChange={(e) => dispatch(approvalCardActions.changeApprovalCardCommonString('placeHolder', e.target.value))}
                                />
                            </span>
                        </div>                      
                        <div className="approval-card-input-wrap">
                            <span className="approval-card-input-tip">明细性质：</span>
                            <span className="approval-card-input">
                                <Radio.Group
                                    onChange={(e) => dispatch(approvalCardActions.changeApprovalCardCommonString('detailNature', e.target.value))}
                                    value={detailNature}
                                >
                                    <Radio value={'PAYMENT'} key="1">付款</Radio>
                                    <Radio value={'RECEIPT'} key="2">收款</Radio>
                                </Radio.Group>
                            </span>
                        </div>     
                        {
                            // <FormDiy
                            //     page={'MX'}
                            //     componentList={componentList}
                            //     basicComponentList={basicComponentList}
                            //     addComponent={component => dispatch(approvalCardActions.addApprovalCardFormComponent(component))}
                            //     deleteComponent={index => dispatch(approvalCardActions.deleteApprovalCardFormComponent(index))}
                            //     adjustPosition={(fromPost, toPost) => dispatch(approvalCardActions.adjustPositionApprovalCardComponent(fromPost, toPost))}
                            //     changeOptionString={(index, place, value) => dispatch(approvalCardActions.changeApprovalCardFormOptionString(['cardData', 'formSetting', 'componentList', index, place], value))}
                            // />
                        }
                    </div>
                </div>
            </Modal>
        )
    }
}


// <div className="approval-card-input-wrap">
//     <span className="approval-card-input-tip">模版范围：</span>
//     <span className="approval-card-input">
//         <Select
//             mode="multiple"
//             disabled={false}
//             value={modelScope.size ? modelScope.map(v => v.get('code') + Limit.TREE_JOIN_STR + v.get('value')).toJS() : []}
//             style={{ width: '100%' }}
//             placeholder="选填"
//             onChange={value => {
//                 console.log('value', value)
//                 const valueList = value.map(v => {
//                     const value = v.split(Limit.TREE_JOIN_STR)
//                     return {
//                         "code": value[0],
//                         "value": value[1]
//                     }
//                 })
//                 dispatch(approvalCardActions.changeApprovalCardCommonString('modelScope', fromJS(valueList)))
//             }}
//         >
//             {
//                 modelList && modelList.toJS().map(v => <Select.Option value={`${v.code}${Limit.TREE_JOIN_STR}${v.value}`}>{v.value}</Select.Option>)
//             }
//         </Select>
//     </span>
// </div>