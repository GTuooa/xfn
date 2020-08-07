import React, { PropTypes } from 'react'
import { Map, List, toJS } from 'immutable'
import { connect } from 'react-redux'
import { ROOTURL } from 'app/constants/fetch.constant.js'
import * as Limit from 'app/constants/Limit.js'

import * as securityActions from 'app/redux/Config/Security/security.action'
import { homeActions } from 'app/redux/Home/home.js'
import { Container, Row, Column, Icon, ButtonGroup , Button, ScrollView, TipWrap, Form, SinglePicker, TextInput } from 'app/components'
import thirdParty from 'app/thirdParty'
import './style.less'

const {
	Label,
	Control,
	Item
} = Form

@connect(state => state)
export default
class PersonalSettings extends React.Component {

	static displayName = 'PersonalSettings'

	constructor(props) {
		super(props)
		this.state = {
			showGuidePage: ''
		}
	}

	componentDidMount() {
		thirdParty.setTitle({
			title: '安全中心'
		})

		thirdParty.setRight({show: false})
		this.props.dispatch(securityActions.getSecurityPermissionList())
	}

	render() {

		const { dispatch, allState, homeState, securityState, history } = this.props
		const { showGuidePage } = this.state

        const userInfo = homeState.getIn(['data', 'userInfo'])
        const lockTime = userInfo.getIn(['lockSecret', 'lockTime'])
		const secret = userInfo.getIn(['lockSecret', 'secret'])
		
		return (
			<Container className="security-wrap">
				<ScrollView flex='1'>
					<div className="personal-settings-sub-tip">
						安全设置
					</div>
					<Form>
						<Item label="锁屏密码" className="form-offset-up">
							<TextInput onClick={() => {history.push('/config/security/passwordsetpage')}} />
							<Icon type="arrow-right" className="ac-option-icon" size="14" />
						</Item>
						<Item label="自动锁屏" className="form-offset-up personal-settings-select">
							<SinglePicker
								className="form-select-show-select"
								district={[{
									key: '永不',
									value: '-1'
								}, {
									key: '5分钟',
									value: '5'
								}, {
									key: '10分钟',
									value: '10'
								}, {
									key: '15分钟',
									value: '15'
								}, {
									key: '30分钟',
									value: '30'
								}, {
									key: '60分钟',
									value: '60'
								}]}
								onOk={(result) => {
									dispatch(securityActions.setLockSecret(secret, result.value))
								}}
							>
								<div className="form-select-show">
									<span>{lockTime ? (lockTime == -1 ? '永不' : lockTime + '分钟') : ''}</span>
								</div>
							</SinglePicker>
							&nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
						</Item>
					</Form>	
				</ScrollView>
			</Container>
		)
	}
}
