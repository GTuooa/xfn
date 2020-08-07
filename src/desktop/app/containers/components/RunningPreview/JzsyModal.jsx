import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Icon, Modal, DatePicker, Switch, Input, Select,  } from 'antd'
const Option = Select.Option
import { formatMoney, formatDate, numberTest } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import moment from 'moment'

import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'

@immutableRenderDecorator
export default
class JzsyModal extends React.Component {

    render() {

        const { jzsyModal, dispatch, modalTemp, lsItemData, projectList, curItem } = this.props

        return (
            <Modal
				visible={jzsyModal}
				onCancel={() => {
					this.setState({'jzsyModal':false})
					dispatch(cxlsActions.changeCxAccountCommonOutString('modalTemp', fromJS({runningDate: formatDate()})))
				}}
				className='single-manager'
				title='结转损益'
				okText='保存'
				onOk={() => {
					dispatch(cxlsActions.insertlrAccountJzsyModal(()=>this.setState({'jzsyModal':false})))
				}}
			>
				<div className='manager-content'>
					<div className='manager-item'><label>日期：</label>
						<DatePicker
                            disabledDate={(current) => {
                                return moment(modalTemp.getIn(['pendingStrongList',0,'oriDate'])) > current
                            }}
							allowClear={false}
							value={modalTemp.get('runningDate') ? moment(modalTemp.get('runningDate')):''}
							onChange={value => {
							const date = value.format('YYYY-MM-DD')
								dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'runningDate'], date))
							}}
						/>
					{
						lsItemData && lsItemData.get('beProject')?
						<Switch
							className="use-unuse-style"
							style={{marginLeft:'.2rem'}}
							checked={modalTemp.get('usedProject')}
							checkedChildren={'项目'}
							onChange={() => {
								dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'usedProject'], !modalTemp.get('usedProject')))
							}}
						/>:''
					}

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
					{
						modalTemp.get('usedProject')?
						<div className="manager-item" >
							<label>项目：</label>
							<Select
								combobox
								showSearch
								value={`${modalTemp.getIn(['projectCard','code'])?modalTemp.getIn(['projectCard','code']):''} ${modalTemp.getIn(['projectCard','name'])?modalTemp.getIn(['projectCard','name']):''}`}
								onChange={value => {
									const valueList = value.split(Limit.TREE_JOIN_STR)
									const uuid = valueList[0]
									const code = valueList[1]
									const name = valueList[2]
									dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'projectCard'], fromJS({uuid,code,name})))
								}}
								>
								{projectList && projectList.map((v, i) =>
									<Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>
										{`${v.get('code')} ${v.get('name')}`}
									</Option>
								)}
							</Select>
						</div>:''
					}
					<div className='manager-item'>
						<label>{modalTemp.get('netProfitAmount')>0?'净收益金额：':'净损失金额：'}</label>
						{modalTemp.get('netProfitAmount')>0 ? modalTemp.get('netProfitAmount') : modalTemp.get('lossAmount')}
					</div>
					<div className='manager-item'>
						<label>资产原值：</label>
						<Input
							value={modalTemp.getIn(['acAssets','originalAssetsAmount'])}
							onChange={(e) => {
								numberTest(e,(value) => {
									dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'acAssets','originalAssetsAmount'], value))
									dispatch(cxlsActions.calculateGainForJzsy())

								})
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>累计折旧摊销：</label>
						<Input
							value={modalTemp.getIn(['acAssets','depreciationAmount'])}
							onChange={(e) => {
								numberTest(e,(value) => {
									dispatch(cxlsActions.changeCxAccountCommonOutString(['modalTemp', 'acAssets','depreciationAmount'], value))
									dispatch(cxlsActions.calculateGainForJzsy())
								})
							}}
						/>
					</div>
					<div className='manager-item'>
						<label>处置金额：</label>
						{curItem ? formatMoney(curItem.get('amount')-curItem.get('tax')):''}
					</div>
				</div>
			</Modal>
        )
    }
}
