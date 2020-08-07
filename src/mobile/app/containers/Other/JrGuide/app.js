import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import * as thirdParty from 'app/thirdParty'
import { USER_PAY_GUIDE } from 'app/constants/fetch.constant.js'
import { Container, Row, Icon, ScrollView, ButtonGroup, Button } from 'app/components'
import './style.less'

import * as allActions from 'app/redux/Home/All/other.action'

@connect(state => state)
export default
class JrGuide extends React.Component {

	render() {

		const { history, dispatch } = this.props

        thirdParty.setTitle({title: '智能版引导'})
		thirdParty.setIcon({
            showIcon: false
        })
		thirdParty.setRight({show: false})

		return (
			<Container>
				<ScrollView className="home-pay-guide-wrap" flex='1'>
					{/* <img src="http://xfncwhelp.image.alimmdn.com/pricing/0315.png"/> */}
					<img src="https://www.xfannix.com/utils/img/guide/guide_intelligence_standardized.png"/>
				</ScrollView>
				<ButtonGroup>
					<Button
						onClick={() => dispatch(allActions.sendGuideImage('https://xfn-ddy-website.oss-cn-hangzhou-internal.aliyuncs.com/utils/img/guide/guide_intelligence_standardized.png'))}
					>保存图片</Button>
					<Button onClick={() => history.goBack()}>
						{/* <Icon type="cancel"/> */}
						<span>立即启用</span>
					</Button>
				</ButtonGroup>
			</Container>
		)
	}
}
