import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import './style.less'
import ScreenSaver from './ScreenSaver'
import { Input, Button, message, Icon, Tooltip } from 'antd'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class LockFilter extends React.Component {

    constructor() {
		super()
		this.state = {
			password: '',
			saver: null
		}
	}

	componentDidMount() {

	}
	componentWillReceiveProps(nextprops) {
		if (this.props.lockTime == nextprops.lockTime && this.props.secret == nextprops.secret) {
			return
		} else {
			if (nextprops.lockTime > 0 && nextprops.secret) {

				if (this.state.saver) {
					this.state.saver.destroy()
				}
				const that = this
				const initScreenSaver = () => {

					const saver = new ScreenSaver({timeout: 1000 * 60 * nextprops.lockTime, callBack : () => {
						that.props.doShowLockFilter()
					}})

					that.setState({
						saver: saver
					})
				}
				initScreenSaver();
			} else if (nextprops.lockTime < 0 || !nextprops.secret) {
				if (this.state.saver) {
					this.state.saver.destroy()
				}
			}
		}
	}

	render() {

		const { doShowLockFilter, showLockFilter, cancelLockFilter, lockTime, secret } = this.props
		const { password } = this.state

		return (
			<div className="lock-wrap" style={{display: showLockFilter ? '' : 'none'}} onKeyUp={e => {
				if (showLockFilter) {
					if (e.keyCode == Limit.ENTER_KEY_CODE) {
						const reg = /\s/g
                        const passwordTrim = password.replace(reg, "")
						if (passwordTrim === secret) {
							cancelLockFilter()
							this.setState({password: ''})
						} else {
							message.error('密码错误')
						}
					}
				}
			}}>
				<div className="lock-container">
					<div>
						<div className="lock-password-input">
							<div className="lock-password-input-tip">
								屏幕已锁定 &nbsp;
								<Tooltip
									title="请输入密码解锁，若忘记密码，请在手机上进入钉钉，登录小番财务，进入 管理 - 安全中心 - 个人设置 - 锁屏密码 重置密码。密码重置后，在电脑端需要重新进入小番财务才能生效。"
								>
									<Icon type="question-circle" />
								</Tooltip>
							</div>
							<Input.Password
								value={password}
								onChange={e => {
									this.setState({password: e.target.value})

								}}
							/>
							<Button type="primary" onClick={() => {
								const reg = /\s/g
                        		const passwordTrim = password.replace(reg, "")
								if (passwordTrim === secret) {
									cancelLockFilter()
									this.setState({password: ''})
								} else {
									message.error('密码错误')
								}
							}}>解锁</Button>
						</div>
					</div>
					<div>
					</div>
				</div>
			</div>
		)
	}
}
