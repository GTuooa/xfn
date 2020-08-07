import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'

import { Row, Icon, Single } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import * as editRunningConfigActions from 'app/redux/Edit/EditRunning/editRunningConfig.action.js'

export default
    class Account extends Component {
    // static contextTypes = { router: PropTypes.object }

    render() {

        const { dispatch, accountList, accounts, accountStatus } = this.props
        // const { router } = this.context

        let dataList = accountList.toJS()
        dataList.push({ key: '新增账户', value: `insert${Limit.TREE_JOIN_STR}` })

        let accountUuid = accounts.getIn([0, 'accountUuid'])
        let accountName = accounts.getIn([0, 'accountName'])
        if (accountStatus == 'ACCOUNT_STATUS_TO') {//内部转账
            accountUuid = accounts.getIn([1, 'accountUuid'])
            accountName = accounts.getIn([1, 'accountName'])
        }

        return (
            <Single
                className='lrls-single'
                district={dataList}
                value={`${accountUuid}${Limit.TREE_JOIN_STR}${accountName}`}
                onOk={value => {
                    if (value.value.split(Limit.TREE_JOIN_STR)[0] == 'insert') {
                        dispatch(editRunningConfigActions.beforAddAccontfromEditRunning(['views', 'flags'], 'insert'))
                        dispatch(push('/config/account/card/edit'))
                        return
                    }
                    dispatch(editRunningActions.changeLrlsAccount(value, accountStatus))
                }}
            >
                <Row style={{ color: accountName ? '' : '#999' }} className='lrls-account lrls-type'>
                    <span className='overElli'>{accountName ? accountName : '点击选择账户'}</span>
                    <Icon type="triangle" />
                </Row>
            </Single>
        )
    }
}
