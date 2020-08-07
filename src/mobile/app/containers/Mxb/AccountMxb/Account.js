import React, { Component }  from 'react'
import { toJS, fromJS } from 'immutable'
import PropTypes from 'prop-types'

import { Row, SinglePicker, Icon, SwitchText, TreeSelect, Single } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'

export default
class Account extends Component {
    static contextTypes = { router: PropTypes.object }

    render() {

        const { accountList, accountUuid, accountName, onOk, history } = this.props
        const { router } = this.context


        let dataList = accountList ? accountList.toJS() : fromJS([])
        dataList.unshift({
			value: `${Limit.TREE_JOIN_STR}全部`,
			key: '全部'
		})


        return (
            <SinglePicker
                className='antd-single-picker'
                district={dataList}
                value={`${accountUuid}${Limit.TREE_JOIN_STR}${accountName}`}
                onOk={value => {
                    onOk(value.value)
                }}
            >
                {/* <div> */}
                    <Row style={{color: accountName ? '' : '#999'}} className='account-type'>
                        <span className='overElli'>{ accountName ? accountName : '点击选择账户' }</span>
                        <Icon type="triangle" />
                    </Row>
                {/* </div> */}
            </SinglePicker>
        )
    }
}
