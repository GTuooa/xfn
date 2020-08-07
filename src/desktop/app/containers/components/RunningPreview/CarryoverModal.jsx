import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Icon, Modal, DatePicker, Switch, Input, Select,  } from 'antd'
const Option = Select.Option
import { formatMoney, formatDate, numberTest } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import moment from 'moment'

import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'

@immutableRenderDecorator
export default
class CarryoverModal extends React.Component {

    render() {

        const { carryoverModal, dispatch, modalTemp, lsItemData, showDrawer, categoryTypeObj } = this.props

        return (
            <Modal
				visible={carryoverModal}
				onCancel={() => {
					this.setState({'carryoverModal':false})
					dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp', fromJS({runningDate: formatDate()})))
				}}
				className='single-manager'
				title='成本结转'
				okText='保存'
				onOk={() => {
					dispatch(cxlsActions.insertlrAccountCarryoverModal(()=>{
						this.setState({'carryoverModal':false})
						dispatch(yllsActions.getYllsBusinessData(lsItemData, showDrawer))
					}, categoryTypeObj))
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
					<div className='manager-item'>
						<label>金额：</label>
						<Input
							value={modalTemp.get('carryoverAmount')}
							onChange={(e) => {
								numberTest(e,(value) => {
									dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'carryoverAmount'], value))
								})
							}}
						/>
					</div>
				</div>
			</Modal>
        )
    }
}
