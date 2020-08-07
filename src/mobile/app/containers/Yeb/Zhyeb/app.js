import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS, Map } from 'immutable'
import thirdParty from 'app/thirdParty'
import * as zhyebActions from 'app/redux/Yeb/Zhyeb/Zhyeb.action.js'
import { TopMonthPicker } from 'app/containers/components'
import { ButtonGroup, Button, Container, Row, ScrollView } from 'app/components'

import './Zhyeb.less'
import Ba from './Ba'

@connect(state => state)
export default
class Lsyeb extends React.Component {

    componentDidMount() {
        thirdParty.setTitle({title: '账户余额表'})
        thirdParty.setIcon({ showIcon: false })
        thirdParty.setRight({ show: false })

        if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(zhyebActions.getPeriodAndBalanceList('','',"true"))
		}
        else {
			this.props.dispatch(zhyebActions.getPeriodAndBalanceList(this.props.zhyebState.get('issuedate'), this.props.zhyebState.get('endissuedate')))
		}
    }

    render() {
        const {
            history,
            dispatch,
            allState,
            zhyebState
        } = this.props

        const balistSeq = zhyebState.get('balanceTemp')
        const issuedate = zhyebState.get('issuedate')
        const endissuedate = zhyebState.get('endissuedate')

        const issues = zhyebState.get('issues')
        const idx = issues.findIndex(v => v.get('value') === issuedate)
        const nextperiods = issues.slice(0, idx)



        return (
            <Container className="zhyeb">
                <TopMonthPicker
                    issuedate={issuedate}
                    source={issues} //默认显示日期
                    callback={(value) => dispatch(zhyebActions.getPeriodAndBalanceList(value, '',"true"))}
                    onOk={(result) => dispatch(zhyebActions.getPeriodAndBalanceList(result.value, '',"true"))}
                    showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
                        dispatch(zhyebActions.getAccountBalanceList(result.value, ''))
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						dispatch(zhyebActions.getAccountBalanceList(issuedate, result.value))
					}}
					changeEndToBegin={()=>dispatch(zhyebActions.getAccountBalanceList(issuedate, ''))}
                />
				<Row className='ba-title'>
					<div className='ba-title-item'>期初余额</div>
					<div className='ba-title-item'>本期收款额</div>
					<div className='ba-title-item'>本期付款额</div>
					<div className='ba-title-item'>期末余额</div>
				</Row>
				<ScrollView flex="1" uniqueKey="kmyeb-scroll" savePosition>
					<div className='ba-list'>
                        {
                            balistSeq.map((item,i) => {
                                return <div key={i}>
                                    <Ba
                                        className="balance-running-tabel-width"
                                        ba={item}
                                        history={history}
                                        dispatch={dispatch}
                                        issuedate={issuedate}
                                        endissuedate={endissuedate}
                                    />
                                </div>
                            })
                        }
					</div>
				</ScrollView>
            </Container>
        )
    }
}
