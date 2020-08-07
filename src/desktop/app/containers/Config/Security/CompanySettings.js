import React, { PropTypes } from 'react'
import { Map, List, toJS } from 'immutable'
import { connect } from 'react-redux'

import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as securityActions from 'app/redux/Config/Security/security.action'
import * as sobConfigActions from 'app/redux/Config/Sob/sobConfig.action.js'
import * as middleActions from 'app/redux/Home/middle.action.js'

import TabTitle from 'app/containers/components/TabTitle/index.js'
import * as thirdParty from 'app/thirdParty'
import { Button, Tooltip, Icon, Input } from 'antd'
import './style.less'

function chooseLib(list, callback) {
	thirdParty.choose({
		// startWithDepartmentId: 0,
		multiple: true,
		users: list.map(v => v.get('emplId')).toJS(),
		max: 1500,
		onSuccess: (resultlist) => {
			resultlist = resultlist.map(v => {
				v.emplId = v.emplId.toString()
				return v
			})
			callback(resultlist)
		},
		onFail: (err) => {
			// thirdParty.Alert('获取钉钉通讯录失败，请刷新后重试')
		}
	})
}

@connect(state => state)
export default
class CompanySettings extends React.Component {

    componentDidMount() {
        this.props.dispatch(securityActions.getSecurityPermissionList())
        this.props.dispatch(homeActions.setDdConfig())
	}

	render() {

		const { dispatch, allState, homeState, securityState } = this.props

        const setting = securityState.get('setting')
        const adminList = setting.get('adminList')
        const financeList = setting.get('financeList')
        const informList = setting.get('informList')

		const userInfo = homeState.getIn(['data', 'userInfo'])
		const isAdmin = userInfo.get('isAdmin')
		const isDdAdmin = userInfo.get('isDdAdmin')
		const isDdPriAdmin = userInfo.get('isDdPriAdmin')
		const isFinance = userInfo.get('isFinance')
		const savePermission = isAdmin === 'TRUE' || isDdAdmin === 'TRUE'

		return (
            <div>
                <div className="security-setting-wrap">
                    <div className="security-setting-main-title">超级管理员</div>
                    <div className="security-setting-sub-title">-最高权限，支持所有操作</div>
                    <div className="security-setting-sub-title">建议设置人员：钉钉主管理员、财务负责人/总监</div>
                    <div className="security-setting-item">
                        <div className="security-setting-corp-list">
                            {
                                adminList.map((v, i) => <span key={v.get('emplId')}>
                                    {v.get('name')} <i onClick={() => {
                                        dispatch(securityActions.deleteSecurityPermissionEmpl('adminList', i))
                                    }}>×</i>
                                </span>)
                            }
                        </div>
                        <div className="security-setting-corp-btn">
                            <Button
                                className="add-role-btn"
                                onClick={() => {
                                    chooseLib(adminList, (resultlist) => {
                                        dispatch(securityActions.changeSecurityPermissionList('adminList', resultlist))
                                    })
                                }}
                            >
                                <Icon
                                    type="plus"
                                    style={{color:'#a90202'}}
                                />
                                添加
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="security-setting-wrap security-setting-wrap-second">
                    <div className="security-setting-main-title">财务经理</div>
                    <div className="security-setting-sub-title">-支持创建账套，支持试用/购买增值功能及开票</div>
                    <div className="security-setting-sub-title">-钉钉管理员默认具备财务经理权限</div>
                    <div className="security-setting-sub-title">建议设置人员：财务经理/主管</div>
                    <div className="security-setting-item">
                        <div className="security-setting-corp-list">
                            {
                                financeList.map((v, i) => <span key={v.get('emplId')}>
                                    {v.get('name')} <i onClick={() => {
                                        dispatch(securityActions.deleteSecurityPermissionEmpl('financeList', i))
                                    }}>×</i>
                                </span>)
                            }
                        </div>
                        <div className="security-setting-corp-btn">
                            <Button
                                className="add-role-btn"
                                onClick={() => {
                                    chooseLib(financeList, (resultlist) => {
                                        dispatch(securityActions.changeSecurityPermissionList('financeList', resultlist))
                                    })
                                }}
                            >
                                <Icon
                                    type="plus"
                                    style={{color:'#a90202'}}
                                />
                                添加
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="security-setting-wrap security-setting-wrap-three">
                    <div className="security-setting-main-title">消息通知人</div>
                    <div className="security-setting-sub-title">建议设置人员：公司负责人、超级管理员</div>
                    <div className="security-setting-item">
                        <div className="security-setting-corp-list">
                            {
                                informList.map((v, i) => <span key={v.get('emplId')}>
                                    {v.get('name')} <i onClick={() => {
                                        dispatch(securityActions.deleteSecurityPermissionEmpl('informList', i))
                                    }}>×</i>
                                </span>)
                            }
                        </div>
                        <div className="security-setting-corp-btn">
                            <Button
                                className="add-role-btn"
                                onClick={() => {
                                    chooseLib(informList, (resultlist) => {
                                        dispatch(securityActions.changeSecurityPermissionList('informList', resultlist))
                                    })
                                }}
                            >
                                <Icon
                                    type="plus"
                                    style={{color:'#a90202'}}
                                />
                                添加
                            </Button>
                        </div>
                    </div>
                </div>

                <div className={savePermission ? "security-setting-save-btn" : "security-setting-save-btn security-setting-save-btn-disabled"}>
                    <Button
                        disabled={!savePermission}
                        onClick={() => {
                            if (homeState.getIn(['views', 'firstToSecurity'])) {
                                dispatch(securityActions.saveSecurityPermissionList(() => {
                                    if (userInfo.get('sobNumber') > userInfo.get('usedSobNumber')) { // 有账套余额
                                        dispatch(homeActions.changeLoginGuideString('firstToSecurity', false))
                                        dispatch(homeActions.changeLoginGuideString('firstToSobInsert', true))
                                        // dispatch(sobConfigActions.beforeHomeInsertOrModifySob(history))
                                        // if (GLCanUse ) {

                                            dispatch(homeActions.addPageTabPane('ConfigPanes', 'SobOption', 'SobOption', '账套新增'))
                                            dispatch(homeActions.addHomeTabpane('Config', 'SobOption', '账套新增'))
                                            setTimeout(() => dispatch(middleActions.sobOptionInit('', ()=>{})), 100)
                                            
                                        // } else {
                                        // 	thirdParty.Alert('总账已到期，不能创建账套')
                                        // }
                                    } else {
                                        dispatch(homeActions.changeLoginGuideString('firstToSecurity', false))
                                        dispatch(homeActions.changeLoginGuideString('firstToSob', true))
                                        // history.push('/config/sob')
                                        dispatch(homeActions.addPageTabPane('ConfigPanes', 'Sob', 'Sob', '账套设置'))
                                        dispatch(homeActions.addHomeTabpane('Config', 'Sob', '账套设置'))
                                    }
                                }))
                            } else {
                                dispatch(securityActions.saveSecurityPermissionList())
                            }
                        }}
                    >
                        保存
                    </Button>
                </div>
            </div>
		)
	}
}
