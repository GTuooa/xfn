import React, { Component }  from 'react'
import { toJS, fromJS } from 'immutable'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'

import { Row, Icon, Single } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'
import * as editRunningConfigActions from 'app/redux/Edit/EditRunning/editRunningConfig.action.js'

export default
class Account extends Component {

    render() {

        const { dispatch, accountList, accounts, accountStatus } = this.props

        let dataList = accountList.toJS()
        //dataList.push({key: '新增账户', value: `insert${Limit.TREE_JOIN_STR}`})

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
                icon={{
                        type: 'account-add',
                        onClick: () => {
                            dispatch(editRunningConfigActions.beforAddAccontfromEditRunning(['views', 'flags'], 'insert'))
                            console.log('sss', push('/config/account/card/edit'));
                            dispatch(push('/config/account/card/edit'))
                        }
                    }}
                onOk={value => {
                    dispatch(editRunningActions.changeLrlsAccount(value, accountStatus))
                }}
            >
                <Row style={{color: accountName ? '' : '#999'}} className='lrls-account lrls-type'>
                    <span className='overElli'>{ accountName ? accountName : '点击选择账户' }</span>
                    <Icon type="triangle" />
                </Row>
            </Single>
        )
    }
}
