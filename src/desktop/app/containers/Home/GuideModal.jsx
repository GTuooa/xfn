import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Modal, Button } from 'antd'
import * as thirdParty from 'app/thirdParty'
import { ROOTURL } from 'app/constants/fetch.constant.js'

import * as homeActions from 'app/redux/Home/home.action.js'

@immutableRenderDecorator
export default
class GuideModal extends React.Component {

	render() {

		const { dispatch, showModal, userInfo, onCancel, onClick, firstToSecurity, firstToSobInsert, firstToSob, firstToWelcome, guideGL, guideZN, adminList } = this.props

        const securityGuide = 'https://www.xfannix.com/utils/img/guide/guide_security_PCSA.png'
        const securityGuideInter = 'https://xfn-ddy-website.oss-cn-hangzhou-internal.aliyuncs.com/utils/img/guide/guide_security_PCSA.png'
        const accountGuide = 'https://www.xfannix.com/utils/img/guide/guide_accounting_PCstandardized.png'
        const accountGuideInter = 'https://xfn-ddy-website.oss-cn-hangzhou-internal.aliyuncs.com/utils/img/guide/guide_accounting_PCstandardized.png'
        const intelligenceGuide = 'https://www.xfannix.com/utils/img/guide/guide_intelligence_PCstandardized.png'
        const intelligenceGuideInter = 'https://xfn-ddy-website.oss-cn-hangzhou-internal.aliyuncs.com/utils/img/guide/guide_intelligence_PCstandardized.png'

		const authorityImgUrl = 'https://www.xfannix.com/utils/img/guide/guide_authority_complete.png' // 无账套引导全
		const authorityImgUrlInter = 'https://xfn-ddy-website.oss-cn-hangzhou-internal.aliyuncs.com/utils/img/guide/guide_authority_complete.png' // 无账套引导全
		const authoritySorryImgUrl = 'https://www.xfannix.com/utils/img/guide/guide_authority_sorry.png'  // 无账套引导上半
		const authorityContentImgUrl = 'https://www.xfannix.com/utils/img/guide/guide_authority_content.png' // 无账套引导下半

		return (
            <Modal
                okText="保存"
                visible={showModal}
                maskClosable={false}
                title='账套指引'
                onCancel={onCancel}
                footer={null}
				closable={false}
            >
                {
					firstToSecurity ?
					<div className="home-login-guide-wrap">
						<div className="home-login-guide-img-wrap">
							<img src={securityGuide} />
						</div>
						<div className="home-login-guide-button-wrap">
							<span
								className="home-login-guide-button"
								onClick={() => {
									dispatch(homeActions.sendGuideImage(securityGuideInter))
								}}
							>
								保存图片
							</span>
							<span
								className="home-login-guide-button"
								onClick={() => {
									dispatch(homeActions.addPageTabPane('ConfigPanes', 'Security', 'Security', '安全中心'))
									dispatch(homeActions.addHomeTabpane('Config', 'Security', '安全中心'))
								}}
							>前往设置</span>
						</div>
					</div>
					: null
				}
				{
					guideGL ?
					<div className="home-login-guide-wrap">
						<div className="home-login-guide-img-wrap">
							<img src={accountGuide} />
						</div>
						<div className="home-login-guide-button-wrap">
							<span
								className="home-login-guide-button"
								onClick={() => {
									dispatch(homeActions.sendGuideImage(accountGuideInter))
								}}
							>
								保存图片
							</span>
							<span
								className="home-login-guide-button"
								onClick={() => {
									dispatch(homeActions.changeLoginGuideString('guideGL', false))
								}}
							>知道了</span>
						</div>
					</div>
					: null
				}
				{
					guideZN ?
					<div className="home-login-guide-wrap">
						<div className="home-login-guide-img-wrap">
							<img src={intelligenceGuide} />
						</div>
						<div className="home-login-guide-button-wrap">
							<span
								className="home-login-guide-button"
								onClick={() => {
									dispatch(homeActions.sendGuideImage(intelligenceGuideInter))
								}}
							>
								保存图片
							</span>
							<span
								className="home-login-guide-button"
								onClick={() => {
									dispatch(homeActions.changeLoginGuideString('guideZN', false))
								}}
							>知道了</span>
						</div>
					</div>
					: null
				}
				{
					firstToWelcome ?
					<div className="home-login-guide-wrap">
						<div className="home-login-guide-img-wrap">
							<img src={authoritySorryImgUrl} />
							<div className="home-login-guide-admin-wrap">
								<div>
									<span className="sob-welcome-text-bold">抱歉,&nbsp;</span>
									<span>当前您名下暂无账套，</span>
								</div>
								<div>
									<span>请联系{adminList.slice(0, 5).join('、')}设置</span>
								</div>
							</div>
							<img src={authorityContentImgUrl} />
						</div>
						<div className="home-login-guide-button-wrap">
							<span
								className="home-login-guide-button"
								onClick={() => {
									dispatch(homeActions.sendGuideImage(authorityImgUrlInter))
								}}
							>
								保存图片
							</span>
							<Button
								className="home-login-guide-button"
								onClick={() => {
									// this.setState({'chooseModal': true})
									thirdParty.openLink({
										url: ROOTURL + "/index.html?isOV=false&isplayground=true"
									})
								}}
							>进入体验模式</Button>
						</div>

					</div>
					: null
				}
            </Modal>
		)
	}
}
