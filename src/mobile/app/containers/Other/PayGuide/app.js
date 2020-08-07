import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import thirdParty from 'app/thirdParty'
import { USER_PAY_GUIDE } from 'app/constants/fetch.constant.js'
import { Container, Row, Icon, ScrollView } from 'app/components'
import './style.less'

@immutableRenderDecorator
export default
class PayGuide extends React.Component {

	render() {

        thirdParty.setTitle({title: '收费标准'})
		thirdParty.setIcon({
            showIcon: false
        })
		thirdParty.setRight({show: false})

		return (
			<Container>
				<ScrollView className="home-pay-guide-wrap" flex='1'>
					{/*<img src="https://www.xfannix.com/utils/img/guide/price.png"/>*/}
					<img src="https://www.xfannix.com/utils/img/guide/newprice.png"/>
				</ScrollView>
				<Row className="home-pay-guide-button-wrap">
					<a className="home-pay-guide-button" href={`https://h5.dingtalk.com/open-market/skuDetail.html?showmenu=false&dd_share=false&corpId=${sessionStorage.getItem('corpId')}&articleCode=FW_GOODS-1000302451&source=STORE_HOMEPAGE`}>
						立即购买
					</a>
				</Row>
			</Container>
		)
	}
}
