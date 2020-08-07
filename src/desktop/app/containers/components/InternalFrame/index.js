import React from 'react'
import { connect } from 'react-redux'

import { Menu, Dropdown, Icon, Button }	from 'antd'
import { XfnIcon } from 'app/components'
import './style.less'

import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
class InternalFrame extends React.Component {

	render() {

		const { allState, dispatch } = this.props

		const internalFrame = allState.get('internalFrame')
		const title = internalFrame.get('title')
		const url = internalFrame.get('url')
		const visibile = internalFrame.get('visibile')
		const cancelText = internalFrame.get('cancelText')

		return (
            <div className="internal-frame-mask" style={{display: visibile ? '' : 'none'}}>
                <div className="internal-frame-container">
                    <div className="internal-frame-title">
                        <span>
							{title}
						</span>
						<span onClick={() => dispatch(allActions.changeInternalFrameStatus({
							visibile: false
						}))}>
							<Icon type="close" />
						</span>
                    </div>
                    <iframe className="internal-frame" src={url}></iframe>
                    <div className="internal-frame-bottom">
                        <Button onClick={() => dispatch(allActions.changeInternalFrameStatus({
							visibile: false
						}))}>{cancelText}</Button>
                    </div>
                </div>
            </div>
		)
	}
}
