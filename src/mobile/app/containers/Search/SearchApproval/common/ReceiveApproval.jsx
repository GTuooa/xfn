import React, { PropTypes } from 'react'
import { Map, toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../style.less'

import * as Limit from 'app/constants/Limit.js'
import { DateLib } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { TopDatePicker } from 'app/containers/components'
import { Container, Row, ScrollView, Icon, Single, ButtonGroup, Button, Switch } from 'app/components'

import Poundage from './Poundage'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@connect(state => state)
export default
    class ReceiveApproval extends React.Component {



    constructor() {
        super()
        this.state = {
            // isSearch: false,
        }
    }

    componentDidMount() {
        thirdParty.setTitle({ title: '收款信息' })
        thirdParty.setIcon({
            showIcon: false
        })
        thirdParty.setRight({ show: false })

    }s

    componentWillUnmount() {
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', new DateLib().valueOf()))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', null))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('conSetAccount', false))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('setAccount', false))
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
        const conSetAccount = approalAccountState.get('conSetAccount')
        const setAccount = approalAccountState.get('setAccount')
        const needUsedPoundage = approalAccountState.get('needUsedPoundage')
        const poundageCurrentList = approalAccountState.get('poundageCurrentList')
        const poundageProjectList = approalAccountState.get('poundageProjectList')
        const poundageCurrentCardList = approalAccountState.get('poundageCurrentCardList')
        const poundageProjectCardList = approalAccountState.get('poundageProjectCardList')
        const accountProjectRange = approalAccountState.get('accountProjectRange')
        const accountContactsRange = approalAccountState.get('accountContactsRange')

        const accountDate = approalAccountState.get('accountDate')
        const selectList = approalAccountState.get('selectList')
        const account = approalAccountState.get('account')

        const accountName = approalAccountState.getIn(['account', 'accountName'])
        const accountUuid = approalAccountState.getIn(['account', 'accountUuid'])

        return (
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
                    <Row className='lrls-card'>
                        <Row className='lrls-more-card'>
                            <label>账户:</label>
                            <Single
                                district={accountListJson}
                                value={`${accountUuid}${Limit.TREE_JOIN_STR}${accountName}`}
                                onOk={value => {
                                    const arr = value.value.split(Limit.TREE_JOIN_STR)
                                    const poundageObj = fromJS({ needPoundage: value.needPoundage, poundage: value.poundage, poundageRate: value.poundageRate })
                                    const poundage = poundageObj.get('poundage')
                                    const poundageRate = poundageObj.get('poundageRate')
                                    
                                    const amount = receiveAmount
                                    const sxAmount = ((Math.abs(amount || 0) * poundageRate / 1000 > poundage) && poundage > 0) ? poundage : Math.abs(amount || 0) * poundageRate / 1000

                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', fromJS({
                                        accountUuid: arr[0],
                                        accountName: arr[1],
                                        poundage: poundageObj.toJS(),
                                        poundageAmount: (sxAmount || 0).toFixed(2),
                                    })))

                                    if (!poundageObj.get('needPoundage')) {
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageCurrentCardList', fromJS([])))
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('poundageProjectCardList', fromJS([])))
                                    }
                                }}
                            >
                                <Row style={{ color: accountName ? '' : '#999' }} className='lrls-account lrls-type'>
                                    <span className='overElli'>{accountName ? accountName : '点击选择账户'}</span>
                                    &nbsp;
									<Icon type="triangle" style={{ color: '#666' }} />
                                </Row>
                            </Single>
                        </Row>
                    </Row>
                    <Row className='lrls-card' style={{ display: conSetAccount ? '' : 'none' }}>
                        <Row className='lrls-more-card'>
                            <label style={{ width: '1rem' }}>批量设置明细账户:</label>
                            <div className='noTextSwitch'>
                                <Switch
                                    checked={setAccount}
                                    onClick={() => {
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('setAccount', !setAccount))
                                    }}
                                />
                            </div>
                        </Row>
                    </Row>
                    {
                        account && account.getIn(['poundage', 'needPoundage']) ? <Poundage
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
                        /> : null
                    }
                </ScrollView>
                <Row className="footer">
                    <ButtonGroup style={{ height: 50 }}>
                        <Button onClick={() => {
                            history.goBack()
                        }}><Icon type="cancel"></Icon><span>取消</span></Button>
                        <Button onClick={() => {
                            dispatch(searchApprovalActions.receiveApprovalProcessDetailInfo(selectList, accountDate, fromPage === 'modal' ? true : setAccount, needUsedPoundage, account, receiveAmount, () => {
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