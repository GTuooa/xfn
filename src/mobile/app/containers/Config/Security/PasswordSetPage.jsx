import React, { PropTypes } from 'react'
import { Map, List, toJS } from 'immutable'
import { connect } from 'react-redux'
import { ROOTURL } from 'app/constants/fetch.constant.js'
import * as Limit from 'app/constants/Limit.js'

import * as securityActions from 'app/redux/Config/Security/security.action'
import { homeActions } from 'app/redux/Home/home.js'
import { Container, Row, Column, Icon, ButtonGroup , Button, ScrollView, TipWrap, Form, SinglePicker } from 'app/components'
import thirdParty from 'app/thirdParty'
import './style.less'

const {
	Label,
	Control,
	Item
} = Form

@connect(state => state)
export default
class PasswordSetPage extends React.Component {

	static displayName = 'PasswordSetPage'

	constructor(props) {
		super(props)
		this.state = {
            password: ''
		}
	}

	componentDidMount() {
		thirdParty.setTitle({
			title: '设置密码'
		})
    }

	render() {

		const { dispatch, homeState, history } = this.props
		const { password } = this.state

        let passwordArr = password.split('')
        const userInfo = homeState.getIn(['data', 'userInfo'])
        const lockTime = userInfo.getIn(['lockSecret', 'lockTime'])
		const secret = userInfo.getIn(['lockSecret', 'secret'])
        
		return (
			<Container className="security-wrap">
				<ScrollView flex='1' className="security-wrap-password">
                    <div className="security-wrap-password-title">请输入密码</div>
                    <ul className="security-wrap-password-wrap">
                        <li></li>
                        <li className="security-wrap-password-input">
                            {passwordArr[0] ? passwordArr[0] : ''}
                        </li>
                        <li className="security-wrap-password-input">
                            {passwordArr[1] ? passwordArr[1] : ''}
                        </li>
                        <li className="security-wrap-password-input">
                            {passwordArr[2] ? passwordArr[2] : ''}
                        </li>
                        <li className="security-wrap-password-input">
                            {passwordArr[3] ? passwordArr[3] : ''}
                        </li>
                        <li></li>
                        <input
                            className="security-wrap-password-input-input"
                            type="number"
                            value={password}
                            onChange={(e) => {
                                var reg = /^\d{0,4}$/
                                if (reg.test(e.target.value) || e.target.value === '') {
                                    this.setState({password: e.target.value})
                                } else {
                                    return
                                }
                            }}
                        />
                    </ul>
                    <ul className="security-wrap-password-tip">
                        <li>设置说明：</li>
                        <li>1、仅用于快捷锁屏及解锁，若密码遗忘可直接重新设置；</li>
                        <li>2、支持1-4位数字密码；</li>
                        <li>3、本密码为个人锁屏密码，不区分账套；</li>
                        <li>4、保存空密码，可关闭本功能；</li>
                    </ul>
                </ScrollView>
                <ButtonGroup>
                    <Button onClick={() => {history.goBack()}}>
                        <Icon type="cancel"/>
                        <span>返回</span>
                    </Button>
                    <Button onClick={() => {
                        dispatch(securityActions.setLockSecret(password, lockTime, () => history.goBack()))
                    }}>
                        <Icon type="save"/>
                        <span>保存</span>
                    </Button>
                </ButtonGroup>
			</Container>
		)
	}
}
