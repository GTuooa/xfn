import React, { PropTypes } from 'react'
import { Map, List, toJS } from 'immutable'
import { connect } from 'react-redux'

import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as securityActions from 'app/redux/Config/Security/security.action'
import * as sobConfigActions from 'app/redux/Config/Sob/sobConfig.action.js'
import * as middleActions from 'app/redux/Home/middle.action.js'

import TabTitle from 'app/containers/components/TabTitle/index.js'
import thirdParty from 'app/thirdParty'
import { Button, Tooltip, Icon, Input, Select, Modal, message } from 'antd'
import './style.less'


@connect(state => state)
export default
class PersonalSettings extends React.Component {

    constructor() {
		super()
		this.state = {
            showEditModal: false,
            password: ''
        }
	}

	render() {

        const { dispatch, allState, homeState, securityState } = this.props
        const { showEditModal, password } = this.state

        const userInfo = homeState.getIn(['data', 'userInfo'])
        const lockTime = userInfo.getIn(['lockSecret', 'lockTime'])
		const secret = userInfo.getIn(['lockSecret', 'secret'])
        
        const sourceList = [
            {
                key: '-1',
                value: '永不',
            },
            {
                key: '5',
                value: '5分钟',
            },
            {
                key: '10',
                value: '10分钟',
            },
            {
                key: '15',
                value: '15分钟',
            },
            {
                key: '30',
                value: '30分钟',
            },
            {
                key: '60',
                value: '60分钟',
            },
        ]

        const strList ={
            '-1': '永不',
            '5': '5分钟',
            '10': '10分钟',
            '15': '15分钟',
            '30': '30分钟',
            '60': '60分钟',

        }

		return (
            <div>
                <ul className="personal-settings-list">
                    <li className="personal-settings-item">
                        <label>锁屏密码：</label>
                        <div>
                            <Button type="primary" onClick={() => this.setState({showEditModal: true})}>设置</Button>
                        </div>
                    </li>
                    <li  className="personal-settings-item">
                        <label>自动锁屏：</label>
                        <div>
                            <Select
                                style={{ width: 300 }}
                                // className="cxls-type-choose"
                                value={strList[lockTime]}
                                // onChange={value => {
                                // 	dispatch(searchApprovalActions.getApprovalProcessList({searchType, searchContent, dateType, beginDate, endDate, accountingType: value}, 1))
                                // }}
                                onSelect={value => {
                                    dispatch(securityActions.setLockSecret(secret, value, () => {
                                        // this.setState({showEditModal: false})
                                    }))
                                }}
                            >
                                {sourceList.map((v, i) => <Select.Option key={v.key} value={v.key}>{v.value}</Select.Option>)}
                            </Select>
                        </div>
                    </li>
                    <li className="personal-settings-item-tip">
                        注：本功能仅桌面端有效
                    </li>
                </ul>
                <Modal
                    okText="保存"
                    visible={showEditModal}
                    title={'锁屏密码设置'}
                    onCancel={() => {
                        this.setState({
                            password: '',
                            showEditModal: false,
                        })
                    }}
                    footer={[
                        <Button key="ok"
                            type={'primary'}
                            onClick={() => {
                                    // this.setState({showEditModal: false})
                                    dispatch(securityActions.setLockSecret(password, lockTime, () => this.setState({showEditModal: false})))
                                }
                            }
                        >
                            保 存
                        </Button>
                    ]}
                >
                    <div>
                        <div>
                            <Input.Password
                                placeholder="请输入新的锁屏密码"
                                className="personal-settings-password-input"
                                value={password}
                                onChange={(e) => {
                                    var reg = /^\d{0,4}$/
                                    if (reg.test(e.target.value) || e.target.value === '') {
                                        this.setState({password: e.target.value})
                                    } else {
                                        message.info('密码为4位数字')
                                    }
                                }}
                            />
                        </div>
                        <ul className="uses-tip">
                            <li>1、仅用于快捷锁屏及解锁，若密码遗忘可直接重新设置</li>
                            <li>2、支持1-4位数字密码</li>
                            <li>3、本密码为个人锁屏密码，不区分账套</li>
                            <li>4、保存空密码，可关闭本功能</li>
                        </ul>
                    </div>
                </Modal>
            </div>
		)
	}
}