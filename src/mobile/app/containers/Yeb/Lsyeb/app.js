import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS, Map } from 'immutable'
import * as thirdParty from 'app/thirdParty'
import * as lsyebActions from 'app/redux/Yeb/Lsyeb/Lsyeb.action.js'
import { TopMonthPicker } from 'app/containers/components'
import { ButtonGroup, Button, Container, Row, ScrollView } from 'app/components'

import './Lsyeb.less'
import Ba from './Ba'

@connect(state => state)
export default
class Lsyeb extends React.Component {

    componentDidMount() {
        thirdParty.setTitle({title: '收支余额表'})
        thirdParty.setIcon({ showIcon: false })
        thirdParty.setRight({ show: false })

        if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(lsyebActions.getPeriodAndBalanceList('','',"true"))
		}
        else {
			this.props.dispatch(lsyebActions.getPeriodAndBalanceList(this.props.lsyebState.get('issuedate'), this.props.lsyebState.get('endissuedate')))
		}
    }

    render() {
        const {
            history,
            dispatch,
            allState,
            lsyebState
        } = this.props

        const balistSeq = lsyebState.get('balanceTemp')
        const issuedate = lsyebState.get('issuedate')

        const issues = lsyebState.get('issues')

        const runningShowChild = lsyebState.get('runningShowChild')
        const loop = (data,leve) => data.map((item,i) => {
            const showChild = runningShowChild.indexOf(item.get('categoryUuid')) > -1
            const backgroundColor = leve > 1 ? '#FEF3E3' : '#fff'

            if (item.get('childList').size) {
                return  <div key={i}>
                    <Ba
                        leve={leve}
                        className="balance-running-tabel-width"
                        style={{backgroundColor}}
                        ba={item}
                        haveChild={true}
                        showChild={showChild}
                        history={history}
                        dispatch={dispatch}
                        issuedate={issuedate}
                    />
                        {showChild ? loop(item.get('childList'), leve+1) : ''}
                </div>
            } else {
                return <div key={i}>
                    <Ba
                        leve={leve}
                        className="balance-running-tabel-width"
                        ba={item}
                        style={{backgroundColor}}
                        history={history}
                        dispatch={dispatch}
                        issuedate={issuedate}
                    />
                </div>
            }

        })

        return (
            <Container className="lsyeb">
                <TopMonthPicker
                    issuedate={issuedate}
                    source={issues} //默认显示日期
                    callback={(value) => dispatch(lsyebActions.getPeriodAndBalanceList(value, '',"true"))}
                    onOk={(result) => dispatch(lsyebActions.getPeriodAndBalanceList(result.value, '',"true"))}
                />
				<Row className='ba-title'>
					<div className='ba-title-item'>本期发生额</div>
					<div className='ba-title-item'>本期收款额</div>
					<div className='ba-title-item'>本期付款额</div>
				</Row>
				<ScrollView flex="1" uniqueKey="kmyeb-scroll" savePosition>
					<div className='ba-list'>
						{loop(balistSeq, 1)}
					</div>
				</ScrollView>
            </Container>
        )
    }
}
