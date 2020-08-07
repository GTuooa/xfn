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
class ManageModal extends React.Component {

    render() {

        const { manageModal, dispatch, modalTemp, lsItemData, showDrawer, contactsCardRange, magenerType, accountList, categoryTypeObj } = this.props

        return (
            <Modal
				visible={manageModal}
				onCancel={() => {
					this.setState({'manageModal':false})
					dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp',fromJS({runningDate:formatDate()})))
				}}
				className='single-manager'
				title={`${magenerType === 'debit'?'收款':'付款'}核销`}
				okText='保存'
				onOk={() => {
					dispatch(cxlsActions.insertlrAccountManagerModal(()=>{
						this.setState({'manageModal':false})
						dispatch(yllsActions.getYllsBusinessData(lsItemData,showDrawer))
					}, categoryTypeObj))
				}}
				>
					<div className='manager-content'>
					<div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
					<div className='manager-item'><label>日期：</label>
					<DatePicker
                        disabledDate={(current) => {
                            return moment(modalTemp.getIn(['pendingManageDto','pendingManageList',0,'oriDate'])) > current
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
						<label>{`${magenerType === 'debit'?'收款':'付款'}金额：`}</label>
						<Input
							value={modalTemp.get('handlingAmount')}
							onChange={(e) => {
								numberTest(e,(value) => {
									dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'handlingAmount'], value))

								})
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>账户：</label>
						<Select
							// combobox
							value={modalTemp.get('accountName')}
							onChange={value => {
								const uuid = value.split(Limit.TREE_JOIN_STR)[0]
								const accountName = value.split(Limit.TREE_JOIN_STR)[1]
								dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'accountName'], value))
								dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'accountUuid'], uuid))
							}}
							>
							{accountList.getIn([0, 'childList'])?accountList.getIn([0, 'childList']).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>):[]}
						</Select>
					</div>
				</div>
			</Modal>
        )
    }
}
