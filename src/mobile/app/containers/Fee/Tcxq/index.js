import React from 'react'
import { connect }	from 'react-redux'

import * as thirdParty from 'app/thirdParty'
import Title from '../components/Title'
import { Icon, Button, ButtonGroup, Container, Row, Form, ScrollView, TextInput, MonthPicker, SinglePicker } from 'app/components'
import EquityList from './EquityList'
import InvalidEquity from './InvalidEquity'
import OrderMessage from '../Wddd/OrderMessage'
import Wddd from '../Wddd/index.js'

import * as tcxqActions from 'app/redux/Fee/Tcxq/tcxq.action.js'
import { feeActions } from 'app/redux/Fee'
import '../style.less'

@connect(state => state)
export default
class Tcxq extends React.Component {

    componentDidMount() {
        this.props.dispatch(tcxqActions.getPackageAmountListAndgetAdminCorpinfoFetch())
	}

    shouldComponentUpdate(nextprops) {
		return this.props.tcxqState != nextprops.tcxqState
	}

    render() {

        const { tcxqState, dispatch, homeState, history, feeState } = this.props

        const currentPage = feeState.getIn(['views', 'currentPage'])
        const corpId = tcxqState.getIn(['data', 'corpInfo', 'corpId'])
        const corpName = tcxqState.getIn(['data', 'corpInfo', 'corpName'])
        const equityList = tcxqState.getIn(['data', 'corpInfo', 'equityList'])
        const invalidEquityList = tcxqState.getIn(['data', 'corpInfo', 'invalidEquityList'])

        return (
            <Container className="fee">
                {
                    // <Title
                    //     activeTab={currentPage}
                    //     onClick={(value) => {
                    //         dispatch(feeActions.switchFeeActivePage(value))
                    //     }}
                    // />
                }
                <OrderMessage />
                <ScrollView flex='1'>
                    <div className="fee-title">
                        <span className="fee-title-label">企业名称：</span>
                        <span className="fee-title-text">{corpName}</span>
                    </div>

                    {
                        equityList.size ?
                        <div className="fee-equity-list-wrap">
                            <div className="tcxq-label">当前功能</div>
                            <EquityList
                                equityList={equityList}
                                dispatch={dispatch}
                            />
                        </div>
                        : null
                    }
                    {
                        invalidEquityList.size ?
                        <div className="tcxq-invalid-equity">
                            <span className="tcxq-label">未购买功能</span>
                            <InvalidEquity
                                invalidEquityList={invalidEquityList}
                                dispatch={dispatch}
                            />
                        </div> : ''
                    }
                    <Wddd
                        tcxqState={tcxqState}
                        dispatch={dispatch}
                        homeState={homeState}
                        history={history}
                    />
                </ScrollView>
            </Container>
        )
    }
}
