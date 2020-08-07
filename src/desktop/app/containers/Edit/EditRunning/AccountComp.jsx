import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import { Input, Select, Icon, Divider, Switch, Checkbox } from 'antd'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import XfnSelect from 'app/components/XfnSelect'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney } from 'app/utils'
import { getCategorynameByType, numberTest, regNegative, reg, CommonProjectTest } from './common/common'

import AccountModifyModal from 'app/containers/Config/AccountConfig/AccountModifyModal'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as accountConfigActions from 'app/redux/Config/AccountConfig/accountConfig.action'

@immutableRenderDecorator
export default
class AccountComp extends React.Component {

    constructor() {
		super()
		this.state = {
			showModal: false
		}
	}
    render() {
        const {
            accounts,
            accountList,
            dispatch,
            isCheckOut,
            oriTemp
        } = this.props
        const { showModal } = this.state
        return(
            <div className="edit-running-modal-list-item">
                <label>账户：</label>
                <div className="lrls-account-box">
                    <XfnSelect
                        showSearch
                        value={accounts.getIn([0,'accountName'])?accounts.getIn([0,'accountName']):''}
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                <Divider style={{ margin: '4px 0' }} />
                                <div
                                    style={{ padding: '8px', cursor: 'pointer' }}
                                    onMouseDown={() => {
                                        // const showModal = () => {
                                        //     this.setState({showModal: true})
                                        // }
                                        dispatch(accountConfigActions.beforeInsertAccountConf())
                                        this.setState({showModal: true})
                                        // showModal()
                                    }}
                                >
                                    <Icon type="plus" /> 新增账户
                                </div>
                            </div>
                        )}
                        onSelect={(value,options) => {
                            const valueList = value.split(Limit.TREE_JOIN_STR)
                            const accountUuid = valueList[0]
                            const accountName = valueList[1]
                            const poundageObj = options.props.poundage
                            const poundage = poundageObj.get('poundage')
                            const poundageRate = poundageObj.get('poundageRate')
                            const amount = this.props.amount || oriTemp.get('amount')
                            const sxAmount = Math.abs(amount || 0)*poundageRate/1000> poundage && poundage > 0
                                ? poundage
                                : Math.abs(amount || 0)*poundageRate/1000
                            dispatch(editRunningActions.changeLrAccountCommonString('ori',['accounts',0,'poundageAmount'],(sxAmount || 0).toFixed(2)))
                            dispatch(editRunningActions.changeLrAccountAccountName(accountUuid, accountName,poundageObj))
                        }}
                    >
                        {accountList.getIn([0, 'childList']).map((v, i) =>
                        <Option
                            key={i}
                            value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
                            poundage={fromJS({needPoundage:v.get('needPoundage'),poundage:v.get('poundage'),poundageRate:v.get('poundageRate')})}
                        >
                            {v.get('name')}
                        </Option>)}
                    </XfnSelect>
                </div>

                <AccountModifyModal
                    dispatch={dispatch}
                    showModal={showModal}
                    onClose={() => this.setState({showModal: false})}
                    fromPage='editRunning'
                    isCheckOut={isCheckOut}
                />
            </div>
        )
    }
}
