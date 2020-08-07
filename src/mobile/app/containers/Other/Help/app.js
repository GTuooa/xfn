import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import thirdParty from 'app/thirdParty'
import { USER_GUIDE_KJ,USER_GUIDE_ZN, USER_GUIDE_VIDEO, XFNVERSION, ROOTURL, SERVERURL } from 'app/constants/fetch.constant.js'
import { Container, Row, ScrollView, ButtonGroup, Button, Icon } from 'app/components'

import { homeActions } from 'app/redux/Home/home.js'
import './style.less'

@connect(state => state)
export default
class Help extends React.Component {

    componentDidMount() {
        this.props.dispatch(homeActions.setDdConfig())
    }

	render() {

        thirdParty.setTitle({title: '帮助中心'})
		thirdParty.setIcon({
            showIcon: false
        })
		thirdParty.setRight({show: false})

        const { history, homeState } = this.props

		const packInfoList = homeState.getIn(['data', 'userInfo', 'packInfoList'])
		// const isBug = packInfoList.some(v => v.get('isBuy') === true)

        const userInfo = homeState.getIn(['data', 'userInfo'])
        const sobInfo = userInfo.get('sobInfo')
        const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 : false

		return (
            <Container>
                <ScrollView flex="1" className="help-center-wrap">
                    <img
                        className="help-center-img"
                        src="https://www.xfannix.com/utils/img/icons/customservice.png"
                    />
                    <div className="help-center-text">
                        <span>小番客服钉钉号</span>
                        <span className="help-center-text-sub">长按识别二维码，添加客服在线解答</span>
                    </div>
                    <div className="help-center-tel">
                        <span>客服电话</span>
                        <span>
                            <span
                                className="help-center-tel-number"
                                onClick={() => {
                                    thirdParty.showCallMenu({
                                        phoneNumber: '0571-28121680', // 期望拨打的电话号码
                                        code: '+86', // 国家代号，中国是+86
                                        showDingCall: true, // 是否显示钉钉电话
                                        onSuccess : function() {},
                                        onFail : function() {}
                                    })
                                }}
                            >
                            0571-28121680
                            </span>
                            转1
                        </span>
                    </div>

                    <div className="help-center-button">
                        <span onClick={() => {
                            thirdParty.openLink({
                                url: `https://page.dingtalk.com/wow/dingtalk/act/serviceconversation?wh_biz=tm&showmenu=false&goodsCode=FW_GOODS-1000302451&corpId=${sessionStorage.getItem('corpId')}&token=bd61e615e7c3757fd2af47e530dc6a1f`
                            })
                        }}>通过服务群联系客服</span>
                    </div>
                    <div className="help-center-button">
                        <a href={isRunning ? USER_GUIDE_ZN : USER_GUIDE_KJ}>自助查询帮助文档</a>
                        {/* <a href={USER_GUIDE_VIDEO}>查看帮助视频</a> */}
                    </div>
					<div className="help-center-version">{`f${XFNVERSION}@xfn-version`}</div>
                    <div
                        className="help-center-version"
                        style={{display: SERVERURL.indexOf('xfannixapp1948.eapps.dingtalkcloud.com') > -1 ? '' : 'none'}}
                        onClick={() => {
                            thirdParty.Confirm({
                                title: '提示',
                                message: '点击“确认”可切换至备用通道。请注意：线路切换将重新登录。',
                                buttonLabels: ['取消', '确认'],
                                onSuccess : (result) => {
                                    if (result.buttonIndex === 1) {

                                        const href = window.location.href
                                        const post = href.indexOf('?')
                                        const endPost = href.indexOf('#/') == -1 ? href.length : href.indexOf('#/')
                                        let serverMessage = href.slice(post+1, endPost)
        
                                        window.location.href = `${ROOTURL}/index.html?${serverMessage}&urlbackup=true`
                                    }
                                }
                            })
                        }}
                    >切换至备用服务器</div>
                </ScrollView>
                <Row>
                    <ButtonGroup>
                        <Button onClick={() => history.goBack()}>
                            <Icon type="cancel"/>
                            <span>返回</span>
                        </Button>
                    </ButtonGroup>
                </Row>
            </Container>
		)
	}
}
