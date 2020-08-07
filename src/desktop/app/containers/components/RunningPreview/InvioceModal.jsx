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
class InvioceModal extends React.Component {

    render() {

        const { invioceModal, dispatch, modalTemp, lsItemData, categoryTypeObj, showDrawer } = this.props

        return (
            <Modal
				visible={invioceModal}
				onCancel={() => {
					this.setState({'invioceModal':false})
					dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
				}}
				className='single-manager'
				title='开具发票'
				okText='保存'
				onOk={() => {
					dispatch(cxlsActions.insertlrAccountInvioceModal(()=>{
						this.setState({'invioceModal':false})
						dispatch(yllsActions.getYllsBusinessData(lsItemData, showDrawer))
					}, categoryTypeObj))
				}}
			>
				<div className='manager-content'>
                    <div className='manager-item'>
                        <label>日期：</label>
                        <DatePicker
                            allowClear={false}
                            disabledDate={(current) => {
                                return moment(modalTemp.getIn(['pendingStrongList',0,'oriDate'])) > current
                            }}
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
