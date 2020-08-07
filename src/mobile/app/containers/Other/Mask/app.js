import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as thirdParty from 'app/thirdParty'

import { Icon } from 'app/components'
import './style.less'

@connect(state => state)
export default
class Mask extends React.Component {

	render() {

        const { allState } = this.props

        const offline = allState.getIn(['views', 'offline'])

        if (offline) {
            return (
                <div className="home-mask-commom">
                    <div className="home-mask-commom-container">
                        <Icon type={'network-offline'} size="15" />
                        &nbsp;
                        <span>网络连接断开</span>
                    </div>
                </div>
            )
        } else {
            return null
        }
	}
}