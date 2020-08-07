import React, { PropTypes } from 'react'
import { Map, toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../style.less'

import * as Limit from 'app/constants/Limit.js'
import { DateLib } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { TopDatePicker } from 'app/containers/components'
import { Container, Row, ScrollView, Icon, Single, ButtonGroup, Button, Switch } from 'app/components'

import Poundage from './Poundage'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@connect(state => state)
export default
    class BookKeepingApproval extends React.Component {



    constructor() {
        super()
        this.state = {
            // isSearch: false,
        }
    }

    componentDidMount() {
        thirdParty.setTitle({ title: '核记信息' })
        thirdParty.setIcon({
            showIcon: false
        })
        thirdParty.setRight({ show: false })

    }

    componentWillUnmount() {
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', new DateLib().valueOf()))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', null))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('needUsedPoundage', false))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentList', fromJS([])))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectList', fromJS([])))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountProjectRange', fromJS([])))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountContactsRange', fromJS([])))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
		this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))
    }

    render() {
        const {
            allState,
            dispatch,
            history,
            approalAccountState,
        } = this.props

        const accountListOri = allState.get('accountList')
        let accountListJson = []
        accountListOri.size && accountListOri.getIn([0, 'childList']).forEach((v, i) => {
            let item = v.toJS()
            item['key'] = v.get('name')
            item['value'] = `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`
            accountListJson.push(item)
        })

        const fromPage = approalAccountState.get('fromPage')
        const accountPoundage = allState.get('accountPoundage')
        const receiveAmount = approalAccountState.get('receiveAmount')
        const needUsedPoundage = approalAccountState.get('needUsedPoundage')
        const poundageCurrentList = approalAccountState.get('poundageCurrentList')
        const poundageProjectList = approalAccountState.get('poundageProjectList')
        const poundageCurrentCardList = approalAccountState.get('poundageCurrentCardList')
        const poundageProjectCardList = approalAccountState.get('poundageProjectCardList')
        const accountProjectRange = approalAccountState.get('accountProjectRange')
        const accountContactsRange = approalAccountState.get('accountContactsRange')
        const handlingFeeType = approalAccountState.get('handlingFeeType')

        const accountDate = approalAccountState.get('accountDate')
        const selectList = approalAccountState.get('selectList')
        const account = approalAccountState.get('account')

        return (
            // <Container className="search-approval">
            <Container className="edit-running search-approval">
                <TopDatePicker
                    value={accountDate}
                    callback={(date) => {
                        const value = new DateLib(date).valueOf()
                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', value))
                    }}
                    onChange={date => {
                        const value = new DateLib(date).valueOf()
                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', value))
                    }}
                />
                <ScrollView flex='1'>
                    {
                        account && account.getIn(['poundage', 'needPoundage']) ? <Poundage
                            type={'核记'}
                            dispatch={dispatch}
                            account={account}
                            receiveAmount={receiveAmount}
                            needUsedPoundage={needUsedPoundage}
                            accountPoundage={accountPoundage}
                            poundageCurrentList={poundageCurrentList}
                            poundageProjectList={poundageProjectList}
                            poundageCurrentCardList={poundageCurrentCardList}
                            poundageProjectCardList={poundageProjectCardList}
                            accountProjectRange={accountProjectRange}
                            accountContactsRange={accountContactsRange}
                            handlingFeeType={handlingFeeType}
                            
                        /> : null
                    }
                </ScrollView>
                <Row className="footer">
                    <ButtonGroup style={{ height: 50 }}>
                        <Button onClick={() => {
                            history.goBack()
                        }}><Icon type="cancel"></Icon><span>取消</span></Button>
                        <Button onClick={() => {
                            dispatch(searchApprovalActions.bookKeepingApprovalProcessDetailInfo(selectList, accountDate, () => {
                                if (fromPage === 'modal') {
                                    dispatch(searchApprovalActions.getApprovalProcessDetailInfo(selectList.get(0), () => { }, 'switch'))
                                }
                                history.goBack()
                            }))
                        }}><Icon type="save"></Icon><span>保存</span></Button>
                    </ButtonGroup>
                </Row>
            </Container>
        )
    }
}