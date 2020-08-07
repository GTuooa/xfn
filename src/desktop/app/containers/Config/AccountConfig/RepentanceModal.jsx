import React from 'react'
import * as Limit from 'app/constants/Limit.js'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'
import { Button,Input,Modal, Select } from 'antd'
const { Option } = Select

import SelectType from './SelectType'

import * as accountConfigActions from 'app/redux/Config/AccountConfig/accountConfig.action'

@immutableRenderDecorator
export default class RepentanceModal extends React.Component {

	static displayName = 'RunningConfigRepentanceModal'
	state={
		showConfirmModal:false
	}
    render() {

        const {
            dispatch,
            showModal,
			onClose,
			regretTemp,
			typeStr,
			typeList,
			open,
            changeState,
            regretCategory,
            subordinateName,
            isBalance,
            isBusiness,
            editPermission
        } = this.props
		const { showConfirmModal } = this.state
		const accountRegretList = regretTemp.get('accountRegretList')
		const categoryName = regretTemp.get('categoryName')
		const categoryUuid = regretTemp.get('categoryUuid')
		const type = regretTemp.get('type')
		const newType = regretTemp.get('newType')
		const modifyJudge = regretTemp.get('modifyJudge') || fromJS({})
        return (
            <div>
                <Modal
                    visible={showModal}
                    title='反悔模式'
                    onCancel={onClose}
                    footer={[
                        <Button
                            key='cancel'
                            onClick={onClose}
                        >
                            取消
                        </Button>,
                        <Button
                            key='ok'
                            type='primary'
                            disabled={!newType}
                            onClick={() => {
								this.setState({showConfirmModal:true})
								onClose()
                            }}
                        >
                            信息确认
                        </Button>
                    ]}
                >
                    <div className="account-regret-modal-content">
                        <div className="accountConf-modal-list-item">
                            <label>账户：</label>
                            {
                                <SelectType
                                    treeData={accountRegretList}
                                    value={categoryName}
                                    placeholder=""
                                    parentDisabled={true}
                                    onChange={(value,options) => {
                                        const valueList = value.split(Limit.TREE_JOIN_STR)
										const modifyJudge = options.props.modifyJudge
										dispatch(accountConfigActions.changeAccountConfingCommonString('regret', 'categoryUuid',valueList[0]))
										dispatch(accountConfigActions.changeAccountConfingCommonString('regret', 'categoryName',valueList[1]))
										dispatch(accountConfigActions.changeAccountConfingCommonString('regret', 'type',valueList[2]))
                                        dispatch(accountConfigActions.changeAccountConfingCommonString('regret', 'modifyJudge',fromJS(modifyJudge)))
                                    }}
                                />
                            }
                        </div>
                        <div className="account-regret-modal-text">
                            <p>已有数据的账户修改账户类型</p>
                        </div>
                        {
                            categoryName?
                            <div>
                                <div className="account-regret-modal-hadMsg">
                                    <div className="regret-modal-hadMsg-content">
										<p>原账户类型：{typeStr(type)}</p>
                                        <p>该账户已有数据：</p>
                                        <ul>
                                            {
                                                modifyJudge.get('billAndOpenBalance') ? <li>期初余额数据</li> : ''
                                            }
                                            {
                                                modifyJudge.get('hasJrData') ? <li>流水数据</li> : ''
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <div className="account-regret-modal-text">
                                    <p>以上数据将转移至修改后的账户类型中</p>
                                </div>
                                <div className="accountConf-modal-list-item">
                                    <label style={{lineHeight:'28px'}}>账户类型：</label>
                                    {
                                        <div>
											<Select
												style={{width:'100%'}}
												value={typeStr(newType)}
												onChange={value=> {
													dispatch(accountConfigActions.changeAccountConfingCommonString('regret', 'newType', value))
												}}
											>
												{
													typeList.map((v, i) => <Option key={v.key} value={v.key}>{v.value}</Option>)
												}
											</Select>
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
                        dispatch(accountConfigActions.saveAccountRegret(categoryUuid,newType,() => {
							this.setState({showConfirmModal:false})
						}))
                    }}
                    onCancel={() =>{
						this.setState({showConfirmModal:false})
						open()
                    }}
                >
                    <div className="account-regret-modal-content">
                        <div className="account-regret-modal-hadMsg">
                            <div className="regret-modal-hadMsg-content">
                                <p>「{categoryName}」的原账户类型「{typeStr(type)}」将修改为「{typeStr(newType)}」。调整数据如下:</p>
                                <ul>
									{
										modifyJudge.get('billAndOpenBalance') ? <li>期初余额数据</li> : ''
									}
									{
										modifyJudge.get('hasJrData') ? <li>流水数据</li> : ''
									}
                                </ul>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}
