import React, { Component } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Button, Modal, Input, message,  Select, DatePicker } from 'antd'
import { fromJS, toJS }	from 'immutable'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class CalculateModel extends Component {

	render() {
		const {
			visible,
			message,
			onOk,
			onOkText,
			ass,
			selectDate,
			runningAbstract,
			totalAmount,
			handlingAmount,
			accountName,
			accountList
		} = this.props
    const disabledDate = function (current) {
      return current && (new Date(selectDate).getTime() > current.getTime())
    }
		return (
			<Modal
				width="800"
				visible={visible}
				title="一键收/付"
				footer=''
				onCancel={onOk}
				style={{boxShadow: 'rgba(0, 0, 0, 0.14902) 0px 1px 3px 1px'}}
				maskClosable={false}
				>
				<div className="info">
					{/* <div>{this.props.children}</div> */}

					<div>
            <div className="accountConf-modal-list">

    						<div className="accountConf-modal-list-item">
    							<label>流水类别：</label>
    							<div>收付管理</div>

    						</div>
    						<div className="accountConf-modal-list-item">
            						<label>核账对象：</label>
    								<div>
    									<div>{ass}</div>
    								</div>
        						</div>
    						<div className='accountConf-separator'></div>
    						<div className="accountConf-modal-list-item">
    							<label>日期：</label>
    							<div>
    								<DatePicker
    									disabledDate={(current) => disabledDate(current)
                    }
    									value={selectDate}
    									onChange={value => {
    									const date = value.format('YYYY-MM-DD')
    									if (ass && accountType !== 'single' && !modify) {
    										const id = calculateTemp.get('id')
    										const assCategory = calculateTemp.get('assCategory')
    										const idType = calculateTemp.get('idType')
    										dispatch(lrAccountActions.getBusinessList(date, id, assCategory, idType))
    									}

    									dispatch(lrAccountActions.changeLrAccountCommonString('calculate', 'runningDate', date))
    								}}/>
    							</div>
    						</div>
    				        <div className="accountConf-modal-list-item">
    				            <label>摘要：</label>
    								<div>
    									<Input

    										value={runningAbstract}
    										onChange={(e) => {
    											dispatch(lrAccountActions.changeLrAccountCommonString('calculate', 'runningAbstract', e.target.value))
    										}}
    									/>
    								</div>
        					</div>
    						<div className="accountConf-modal-list-item">
            					<label>{`${totalAmount>=0?'收':'付'}款金额：`}</label>
    							<div>
    								<Input
    									// disabled={runningIndex != 0}
    									value={handlingAmount}
    									onChange={(e) => {
    										//e.targt.value小于计提
    										let value = e.target.value.indexOf('。') > -1 ? e.target.value.replace('。', '.') : e.target.value
    										if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
    											value = value.substr(1)
    										}
    										if (reg.test(value) || value === '') {
    											dispatch(lrAccountActions.changeLrAccountCommonString('calculate', 'handlingAmount', value))
    										} else {
    											message.info('金额只能输入带两位小数的数字')
    										}

    									}}
    								/>
    							</div>

        					</div>
        					{/* <div className="accountConf-modal-list-item">
            					<label>账户：</label>
    							<div>
    								<Select
    									// combobox
    									// disabled={runningIndex != 0}
    									value={accountName}
    									onChange={value => value || dispatch(lrAccountActions.changeLrAccountAccountName('calculate', 'accountUuid', 'accountName', value))}
    									onSelect={value => dispatch(lrAccountActions.changeLrAccountAccountName('calculate', 'accountUuid', 'accountName', value))}
    									>
                        <Option>全部</Option>
    									{accountList.getIn([0, 'childList']).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
    								</Select>
    							</div>
        					</div> */}
    						<div className='accountConf-separator'></div>
    						{/* <div className='lrAccount-detail-title'>
    							<div className='lrAccount-detail-title-left'>请勾选需要核账的流水：</div>
    							<div className='lrAccount-detail-title-right'>
    								<span>
    									{`待核销${totalAmount>=0?'收':'付'}款金额：`}<i style={{fontSize:'18px',color: 'orange'}}>{totalAmount?Math.abs(totalAmount).toFixed(2):'0.00'}</i>
    								</span>
    								<br/>
    								<span style={{float:'right'}}>
    									已勾选流水：{indexList.size}条
    								</span>
    							</div>
    						</div> */}

        					{/* <JxcTableAll>
        					<TableTitle
        						className="lrAccount-table-width"
        						titleList={['流水类别', '日期', '流水号', '摘要', '暂收/预收/应收','暂付/预付/应付']}
    								disabled={runningIndex !== 0}
    								hasCheckbox={true}
    								selectAcAll={selectAcAll}
    								onClick={(e) => {
    										e.stopPropagation()
    										if (runningIndex === 0) {
    											if(accountType === 'single') {
    												dispatch(lrAccountActions.accountItemCheckboxCheckAll(selectAcAll, fromJS([calculateTemp])))
    											} else {
    												dispatch(lrAccountActions.accountItemCheckboxCheckAll(selectAcAll, detail))
    											}
    											dispatch(lrAccountActions.accountTotalAmount(true))
    										}

    								}}
        					/>
        					<TableBody>

    							{detailElementList}
    							<TableItem className='lrAccount-table-width' key='total'>
    								<li	></li>
    								<li></li>
    								<li></li>
    								<li></li>
    								<li>合计</li>
    								<li>
    									{
    										debitAmount?
    											debitAmount<0?
    												<div className='amount-content'><span style={{float:'left',color:"orange"}}>{Math.abs(debitAmount).toFixed(2)}</span></div>
    												:
    												<div className='amount-content'><span style={{float:'right'}}>{Math.abs(debitAmount).toFixed(2)}</span></div>
    											:
    											''
    									}
    								</li>
    								<li>
    									{
    										creditAmount?
    											creditAmount<0?
    												<div className='amount-content'><span style={{float:'left',color:"orange"}}>{Math.abs(creditAmount).toFixed(2)}</span></div>
    												:
    												<div className='amount-content'><span style={{float:'right'}}>{Math.abs(creditAmount).toFixed(2)}</span></div>
    											:
    											''
    									}
    								</li>

    							</TableItem>
        					</TableBody>
        				</JxcTableAll> */}
    				</div>
					</div>

					<div className="info-btn" onClick={onOk} >
						{onOkText ? onOkText : '确定'}
					</div>
				</div>
			</Modal>
		)
	}
}
