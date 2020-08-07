import React from 'react'
import * as Limit from 'app/constants/Limit.js'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Button,Input,Modal } from 'antd'

import SelectType from './SelectType'

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'

@immutableRenderDecorator
export default class RepentanceModal extends React.Component {

	static displayName = 'RunningConfigRepentanceModal'

    render() {

        const {
            dispatch,
            showModal,
            showConfirmModal,
            changeState,
            regretCategory,
            categoryName,
            categoryUuid,
            subordinateName,
            isBalance,
            isBusiness,
            editPermission
        } = this.props

        return (
            <div>
                <Modal
                    visible={showModal}
                    title='反悔模式'
                    onCancel={() =>{
                        dispatch(runningConfActions.changeRegretCancle())
                    }}
                    footer={[
                        <Button
                            key='cancel'
                            onClick={() => {
                                dispatch(runningConfActions.changeRegretCancle())
                            }}
                        >
                            取消
                        </Button>,
                        <Button
                            key='ok'
                            type='primary'
                            disabled={!editPermission}
                            onClick={() => {
                                dispatch(runningConfActions.changeRegretAccountCommonString('regret', 'showModal',false))
                                dispatch(runningConfActions.changeRegretAccountCommonString('regret', 'showConfirmModal',true))
                            }}
                        >
                            信息确认
                        </Button>
                    ]}
                >
                    <div className="account-regret-modal-content">
                        <div className="accountConf-modal-list-item">
                            <label>流水类别：</label>
                            {
                                <SelectType
                                    treeData={regretCategory}
                                    value={categoryName}
                                    placeholder=""
                                    parentDisabled={true}
                                    onChange={(value) => {
                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                        dispatch(runningConfActions.changeRegretAccountAccountName('regret', 'categoryUuid', 'categoryName','isBalance','isBusiness',value))
                                    }}
                                />
                            }
                        </div>
                        <div className="account-regret-modal-text">
                            <p>已有数据的流水类别新增下级类别</p>
                        </div>
                        {
                            categoryName != '请选择流水类别' ?
                            <div>
                                <div className="account-regret-modal-hadMsg">
                                    <div className="regret-modal-hadMsg-content">
                                        <p>该类别已有数据:</p>
                                        <ul>
                                            {
                                                isBalance !== 'false' ? <li>期初余额数据</li> : ''
                                            }
                                            {
                                                isBusiness !== 'false' ? <li>流水数据</li> : ''
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <div className="account-regret-modal-text">
                                    <p>以上数据将转移至新增下级类别中</p>
                                </div>
                                <div className="accountConf-modal-list-item">
                                    <label>下级类别名称：</label>
                                    {
                                        <div>
                                            <Input
                                                value={subordinateName}
                                                onChange={(e) => {
                                                    dispatch(runningConfActions.changeRegretAccountCommonString('regret', 'subordinateName', e.target.value))
                                                }}
                                            />
                                        </div>
                                    }
                                </div>
                            </div> : ''
                        }
                    </div>
                </Modal>

                <Modal
                    visible={showConfirmModal}
                    title='信息确认'
                    onOk={() => {
                        if (editPermission) {
                            dispatch(runningConfActions.saveRegretMessage())
                        }
                    }}
                    onCancel={() =>{
                        dispatch(runningConfActions.changeRegretCancle())
                    }}
                >
                    <div className="account-regret-modal-content">
                        <div className="account-regret-modal-hadMsg">
                            <div className="regret-modal-hadMsg-content">
                                <p>1、原【{categoryName}】的数据将转移至【{subordinateName}】。数据如下:</p>
                                <ul>
                                    {
                                        isBalance !== 'false' ? <li>期初余额</li> : ''
                                    }
                                    {
                                        isBusiness !== 'false' ? <li>流水数据</li> : ''
                                    }
                                </ul>
                                <p>2、【{categoryName}】可新增下级类别</p>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}
