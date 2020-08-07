import React, { PropTypes } from 'react'
import { Map, List, toJS } from 'immutable'
import { connect } from 'react-redux'
import { ROOTURL } from 'app/constants/fetch.constant.js'
import * as Limit from 'app/constants/Limit.js'

import * as securityActions from 'app/redux/Config/Security/security.action'
import { homeActions } from 'app/redux/Home/home.js'
import { Container, Row, Column, Icon, ButtonGroup , Button, ScrollView, TipWrap } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import './style.less'

import * as allActions from 'app/redux/Home/All/other.action'

// function chooseLib(list, callback) {
// 	thirdParty.choose({
// 		startWithDepartmentId: 0,
// 		users: list.map(v => v.get('emplId')).toJS(),
// 		onSuccess: (resultlist) => {
// 			resultlist = resultlist.map(v => {
// 				v.emplId = v.emplId.toString()
// 				const openReview = list.find(w => w.get('emplId') === v.emplId.toString())
// 				v.openReview = openReview ? openReview.get('openReview') : false
// 				return v
// 			})
// 			callback(resultlist)
// 		},
// 		onFail: (err) => {
// 			alert(JSON.stringify(err))
// 		}
// 	})
// }

function chooseComplexPicker(list, title, callback) {

	let appId = ''
	if (ROOTURL.indexOf('mtst.xfannix.com') > -1) {
		appId = Limit.APPID_TEST // '1390'
	} else if (ROOTURL.indexOf('mpre.xfannix.com') > -1) {
		appId = Limit.APPID_PREF // '3837'
	} else if (ROOTURL.indexOf('mobile.xfannix.com') > -1) {
		appId = Limit.APPID_FORM // '1948'
	}

	thirdParty.complexPicker({
		title: title,            //标题
		corpId: sessionStorage.getItem('corpId'),   //企业的corpId
		multiple: true,         //是否多选
		limitTips: "超出了",     //超过限定人数返回提示
		maxUsers: 1000,        //最大可选人数
		pickedUsers: list.map(v => v.get('emplId')).toJS(),    //已选用户
		pickedDepartments: [],          //已选部门
		disabledUsers: [],              //不可选用户
		disabledDepartments: [],        //不可选部门
		requiredUsers: [],              //必选用户（不可取消选中状态）
		requiredDepartments: [],        //必选部门（不可取消选中状态）
		appId: appId,                   //微应用的Id
		permissionType: "xxx",          //选人权限，目前只有GLOBAL这个参数
		responseUserOnly: true,        //ture表示返回人，false返回人和部门
		startWithDepartmentId: 0 ,   // 0表示从企业最上层开始，IOS不支持该字段
		onSuccess: (resultlist) => {
			resultlist = resultlist.users.map(v => {
				v.emplId = v.emplId.toString()
				// const openReview = list.find(w => w.get('emplId') === v.emplId.toString())
				// v.openReview = openReview ? openReview.get('openReview') : false
				return v
			})
			callback(resultlist)
		},
		onFail: (err) => {
			// alert(JSON.stringify(err))
		}
	})
}

@connect(state => state)
export default
class Security extends React.Component {

	static displayName = 'Security'

	constructor(props) {
		super(props)
		this.state = {
			showGuidePage: this.props.homeState.getIn(['views', 'firstToSecurity'])
		}
	}

	componentDidMount() {
		thirdParty.setTitle({
			title: '安全中心'
		})

		thirdParty.setRight({show: false})
		this.props.dispatch(securityActions.getSecurityPermissionList())
		
		this.props.dispatch(homeActions.setDdConfig())
	}

	render() {

		const { dispatch, allState, homeState, securityState, history } = this.props
		const { showGuidePage } = this.state

        const setting = securityState.get('setting')
		const adminList = setting.get('adminList')
        const financeList = setting.get('financeList')
        const informList = setting.get('informList')
		const sobInfo = homeState.getIn(['data', 'userInfo', 'sobInfo'])

		const userInfo = homeState.getIn(['data', 'userInfo'])
        const isAdmin = userInfo.get('isAdmin')
        const isDdAdmin = userInfo.get('isDdAdmin')
        const isDdPriAdmin = userInfo.get('isDdPriAdmin')
        const isFinance = userInfo.get('isFinance')
        const savePermission = isAdmin === 'TRUE' || isDdAdmin === 'TRUE'

		if (!showGuidePage) {
			return (
				<Container className="security-wrap">
					<ScrollView flex='1' className="security-wrap-scroll">
						<div className="security-setting-wrap">
							<div className="security-setting-main-title">超级管理员</div>
							<div className="security-setting-sub-title">-最高权限，支持所有操作；</div>
							<div className="security-setting-sub-title">建议设置人员：钉钉主管理员、财务负责人/总监；</div>
							<div className="security-setting-item">
								<div className="security-setting-corp-list">
									{
										adminList.map((v, i) => {
											return (
												<span key={v.get('emplId')}>
													<span>{v.get('name')}</span>
													<i onClick={() => {
													dispatch(securityActions.deleteSecurityPermissionEmpl('adminList', i))
													}}>×</i>
												</span>
											)
										})
									}
								</div>
								<div className="security-setting-corp-btn">
									<span
										className="add-role-btn"
										style={{color: '#a90202', fontSize: '.17rem'}}
										onClick={() => {
											chooseComplexPicker(adminList, '请选择超级管理员', (resultlist) => {
												dispatch(securityActions.changeSecurityPermissionList('adminList', resultlist))
											})
										}}
									>
										+
									</span>
								</div>
							</div>
						</div>
						<div className="security-setting-wrap security-setting-wrap-second">
							<div className="security-setting-main-title">财务经理</div>
							<div className="security-setting-sub-title">-支持创建账套，支持试用/购买增值功能及开票；</div>
							<div className="security-setting-sub-title">-钉钉管理员默认具备财务经理权限；</div>
							<div className="security-setting-sub-title">建议设置人员：财务经理/主管；</div>
							<div className="security-setting-item">
								<div className="security-setting-corp-list">
									{
										financeList.map((v, i) => {
											return (
												<span key={v.get('emplId')}>
													<span>{v.get('name')}</span>
													<i onClick={() => {
													dispatch(securityActions.deleteSecurityPermissionEmpl('financeList', i))
													}}>×</i>
												</span>
											)
										})
									}
								</div>
								<div className="security-setting-corp-btn">
									<span
										className="add-role-btn"
										style={{color: '#a90202', fontSize: '.17rem'}}
										onClick={() => {
											chooseComplexPicker(financeList, '请选择财务负责人/财务经理', (resultlist) => {
												dispatch(securityActions.changeSecurityPermissionList('financeList', resultlist))
											})
										}}
									>
										+
									</span>
								</div>
							</div>
						</div>
						<div className="security-setting-wrap security-setting-wrap-second">
							<div className="security-setting-main-title">消息通知人员</div>
							<div className="security-setting-sub-title">建议设置人员：公司负责人、超级管理员；</div>
							<div className="security-setting-item">
								<div className="security-setting-corp-list">
									{
										informList.map((v, i) => {
											return (
												<span key={v.get('emplId')}>
													<span>{v.get('name')}</span>
													<i onClick={() => {
														dispatch(securityActions.deleteSecurityPermissionEmpl('informList', i))
													}}>×</i>
												</span>
											)
										})
									}
								</div>
								<div className="security-setting-corp-btn">
									<span
										className="add-role-btn"
										style={{color: '#a90202', fontSize: '.17rem'}}
										onClick={() => {
											chooseComplexPicker(informList, '请选择消息通知人员', (resultlist) => {
												dispatch(securityActions.changeSecurityPermissionList('informList', resultlist))
											})
										}}
									>
										+
									</span>
								</div>
							</div>
						</div>
					</ScrollView>
					<Row className="footer">
						<ButtonGroup style={{height: 50}}>
							{/* <Button
								style={{display: sobInfo ? 'none' : ''}}
								onClick={() => {
									history.goBack()
								}}
							>
								跳过
							</Button> */}
							<Button disabled={!savePermission} onClick={() => {

								const successCallBack = sobInfo ? () => {} : () => {
									if (homeState.getIn(['views', 'firstToSecurity'])) {

										// thirdParty.Confirm({
										// 	message: '修改财务负责人、消息通知人，可进入小番后，点击“管理”-”安全中心"设置',
										// 	title: '温馨提示',
										// 	buttonLabels: ['确定'],
										// 	onSuccess: (result) => {
										// 		alert('sdfsdf:'+result.buttonIndex);
										// 		if (result.buttonIndex === 0) {
													// if (userInfo.get('sobNumber') > userInfo.get('usedSobNumber')) { // 有账套余额
													// 	dispatch(homeActions.changeLoginGuideString('firstToSecurity', false))
													// 	dispatch(homeActions.changeLoginGuideString('firstToSobInsert', true))
													// 	// dispatch(sobConfigActions.beforeHomeInsertOrModifySob(history))
													// } else {
														dispatch(homeActions.changeLoginGuideString('firstToSecurity', false))
														dispatch(homeActions.changeLoginGuideString('firstToSob', true))
														// history.push('/config/sob/index')
													// }

													history.goBack()
												// }
										// 	}
										// })
									}
								}
								dispatch(securityActions.saveSecurityPermissionList(sobInfo ? true : false,  successCallBack, history))
							}}>
								<Icon type="save"></Icon>
								<span>保存</span>
							</Button>
						</ButtonGroup>
					</Row>
				</Container>
			)
		} else {
			return (
				<Container>
					<ScrollView className="home-pay-guide-wrap" flex='1'>
						{/* <img src="http://xfncwhelp.image.alimmdn.com/pricing/0315.png"/> */}
						<img src="https://www.xfannix.com/utils/img/guide/guide_security_SA.png"/>
					</ScrollView>
					<ButtonGroup>
						<Button onClick={() => {
							dispatch(allActions.sendGuideImage('https://xfn-ddy-website.oss-cn-hangzhou-internal.aliyuncs.com/utils/img/guide/guide_security_SA.png'))
						}}>保存图片</Button>
						<Button onClick={() => {this.setState({showGuidePage: false})}}>
							<Icon type="security"/>
							<span>前往设置</span>
						</Button>
					</ButtonGroup>
				</Container>
			)
		}
	}
}
