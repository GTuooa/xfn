import React, { PropTypes } from 'react'
import { Map, toJS } from 'immutable'
import { connect } from 'react-redux'
import './style.less'

import thirdParty from 'app/thirdParty'
import { Container, Row, Column, Icon, ButtonGroup , Button, ScrollView, TipWrap } from 'app/components'

import { homeActions } from 'app/redux/Home/home.js'

@connect(state => state)
export default
class Approval extends React.Component {

	componentDidMount() {
        thirdParty.setTitle({title: '审批设置'})
		thirdParty.setIcon({
            showIcon: false
        })
        thirdParty.setRight({show: false})
        
        if (!this.props.homeState.getIn(['permissionInfo', 'Config'])) {
            this.props.dispatch(homeActions.getAdminNameList())
        }
    }

	constructor() {
		super()
		this.state = {}
	}

	render() {
        const {
            homeState,
            history
        } = this.props

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
        let allList = []
        if (!configPermissionInfo) {
            const adminNameList = homeState.get('adminNameList')
            allList = adminNameList.get('adminList')
        }

		return (
			<Container className="approval-conf">
                <ScrollView className="approval-conf-wrap" flex='1'>
                    <ul className="approval-conf-content">
                        <li><img className="approval-conf-content-img" src="https://xfn-ddy-website.oss-cn-hangzhou.aliyuncs.com/utils/img/icons/site.png" /></li>
                        <li className="approval-conf-content-tip-one">{configPermissionInfo ? '请前往“电脑端”设置审批模版' : '您当前无设置审批的权限'}</li>
                        {
                            !configPermissionInfo ?
                            <li className="approval-conf-content-tip-two">请联系管理员{allList.join('、')}前往“电脑端”设置</li>
                            : null
                        }
                    </ul>
                </ScrollView>
                {
                    // <Row className="footer">
                    //     <ButtonGroup style={{height: 50}}>
                    //         <Button
                    //             disabled={false}
                    //             onClick={() => {history.goBack()}}
                    //         >
                    //             <Icon type="choose"></Icon>
                    //             <span>确定</span>
                    //         </Button>
                    //     </ButtonGroup>
                    // </Row>
                }
			</Container>
		)
	}
}
