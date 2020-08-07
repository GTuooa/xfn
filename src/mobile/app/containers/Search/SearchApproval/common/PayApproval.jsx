import React, { PropTypes } from 'react'
import { Map, toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../style.less'

import * as Limit from 'app/constants/Limit.js'
import { DateLib } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { TopDatePicker } from 'app/containers/components'
import { Container, Row, ScrollView, Icon, Single, ButtonGroup, Button } from 'app/components'

import ZeroInventory from './ZeroInventory'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@connect(state => state)
export default
    class PayApproval extends React.Component {

    constructor() {
        super()
        this.state = {
            // isSearch: false,
        }
    }

    componentDidMount() {
        thirdParty.setTitle({ title: '付款信息' })
        thirdParty.setIcon({
            showIcon: false
        })
        thirdParty.setRight({ show: false })
    }

    componentWillUnmount() {
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', new DateLib().valueOf()))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', null))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beCarryoverOut', false))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', ''))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCostList', fromJS([])))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beZeroInventory', false))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverCategoryItem', null))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('usedCarryoverProject', false))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([])))
    }

    render() {
        const {
            dispatch,
            history,
            allState,
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
        const account = approalAccountState.get('account')
        const accountName = account ? account.get('accountName') : ''
        const accountUuid = account ? account.get('accountUuid') : ''

        const accountDate = approalAccountState.get('accountDate')
        const selectList = approalAccountState.get('selectList')

        const beZeroInventory = approalAccountState.get('beZeroInventory')
        const beCarryoverOut = approalAccountState.get('beCarryoverOut')
        const propertyCost = approalAccountState.get('propertyCost')
        const propertyCostList = approalAccountState.get('propertyCostList')
        const carryoverCategoryList = approalAccountState.get('carryoverCategoryList')
        const carryoverCategoryItem = approalAccountState.get('carryoverCategoryItem')
        const usedCarryoverProject = approalAccountState.get('usedCarryoverProject')
        const carryoverProjectCardList = approalAccountState.get('carryoverProjectCardList')
        const carryoverProjectList = approalAccountState.get('carryoverProjectList')

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
                                className='lrls-single'
                                district={accountListJson}
                                value={`${accountUuid}${Limit.TREE_JOIN_STR}${accountName}`}
                                onOk={value => {
                                    const arr = value.value.split(Limit.TREE_JOIN_STR)
                                    dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', fromJS({
                                        accountUuid: arr[0],
                                        accountName: arr[1],
                                    })))
                                }}
                            >
                                <Row style={{ color: accountName ? '' : '#999' }} className='lrls-account lrls-type'>
                                    <span className='overElli'>{accountName ? accountName : '点击选择账户'}</span>
                                    <Icon type="triangle" />
                                </Row>
                            </Single>
                        </Row>
                    </Row>
                    {
                        beZeroInventory ?
                            <ZeroInventory
                                oriDate={accountDate}
                                dispatch={dispatch}
                                beCarryoverOut={beCarryoverOut}
                                propertyCost={propertyCost}
                                propertyCostList={propertyCostList}
                                carryoverCategoryList={carryoverCategoryList}
                                carryoverCategoryItem={carryoverCategoryItem}
                                usedCarryoverProject={usedCarryoverProject}
                                carryoverProjectCardList={carryoverProjectCardList}
                                carryoverProjectList={carryoverProjectList}
                            />
                            : null
                    }
                </ScrollView>
                <Row className="footer">
                    <ButtonGroup style={{ height: 50 }}>
                        <Button onClick={() => {
                            history.goBack()
                        }}><Icon type="cancel"></Icon><span>取消</span></Button>
                        <Button onClick={() => {
                            dispatch(searchApprovalActions.payingApprovalProcessDetailInfo(selectList, account, accountDate, beCarryoverOut, carryoverCategoryItem, carryoverProjectCardList, propertyCost, () => {
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