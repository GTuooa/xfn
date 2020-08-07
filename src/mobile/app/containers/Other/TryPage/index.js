import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import dingOpenOrgTryEntry from 'ding-open-org-trial-entry';
 
@connect(state => state)
export default
class TryPage extends React.Component {

    componentDidMount() {
        dingOpenOrgTryEntry.config({
            insertElement: document.querySelector('#customizeElement'),
            skuQuery:{
                goodsCode: 'FW_GOODS-1000302451'
            }
        }).init();
    }

	render() {

        

		// const { his } = this.props

        // thirdParty.setTitle({title: '智能版引导'})
		// thirdParty.setIcon({
        //     showIcon: false
        // })
        // thirdParty.setRight({show: false})
        

		return (
			<div id="customizeElement" style={{height: '64px'}}></div>
		)
	}
}




            