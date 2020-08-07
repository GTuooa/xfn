import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Icon, Modal, DatePicker, Switch, Input, Select,  } from 'antd'
const Option = Select.Option
import { formatMoney, formatDate } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import moment from 'moment'

import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'

@immutableRenderDecorator
export default
class InvoiceAuthModal extends React.Component {

    render() {

        const { defineModal, dispatch, lsItemData, showDrawer, categoryTypeObj, modalTemp } = this.props

        return (
            <Modal
				visible={defineModal}
				onCancel={() => {
					this.setState({'defineModal': false})
					dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate: formatDate()})))
				}}
				className='single-manager'
				title='发票认证'
				okText='保存'
				onOk={() => {
					dispatch(cxlsActions.insertlrAccountInvioceDefineModal(() => {
						this.setState({'defineModal':false})
						dispatch(yllsActions.getYllsBusinessData(lsItemData, showDrawer))
					}, ))
				}}
			>
				<div className='manager-content'>
                    <div className='manager-item'><label>日期：</label>
                        <DatePicker
                            disabledDate={(current) => {
                                return moment(modalTemp.getIn(['pendingStrongList',0,'oriDate'])) > current
                            }}
                            allowClear={false}
                            value={modalTemp.get('runningDate')?moment(modalTemp.get('runningDate')):''}
                            onChange={value => {
                            const date = value.format('YYYY-MM-DD')
                            dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningDate'], date))
                            }}
                        />
                    </div>
                    <div className='manager-item'>
                        <label>摘要：</label>
                        <Input
                            value={modalTemp.get('runningAbstract')}
                            onChange={(e) => {
                                dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningAbstract'], e.target.value))
                            }}
                        />
                    </div>
                </div>
			</Modal>
        )
    }
}
