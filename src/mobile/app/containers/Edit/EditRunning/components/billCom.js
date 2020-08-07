import React, { Component } from 'react'
import { toJS, fromJS } from 'immutable'

import { Row, Single, Icon, Amount, SwitchText, XfInput } from 'app/components'
import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action.js'

//流水状态组件
export default class BillCom extends Component {
    taxRateList = []
    componentDidMount(){
        const rateOptionList = this.props.rateOptionList.toJS()
        rateOptionList.forEach(v => { this.taxRateList.push({key:`${v}%`, value: v}) })
        this.taxRateList.push({key: '**%', value: -1})
    }
    render () {
        const { dispatch, categoryType, oriState, billList, amount, billStrongList, scale, payableRate, outputRate, isModify, oriBillType } = this.props

        const billType = billList ? billList.getIn([0, 'billType']) : ''
        const billState = billList ? billList.getIn([0, 'billState']) : ''
        const taxRate = billList ? billList.getIn([0, 'taxRate']) : ''
        const tax = billList ? billList.getIn([0, 'tax']) : ''
        const isCustomize = taxRate == -1 ? true : false

        let billTypeList = []
        const billTypeName = {'bill_other': '其他票据', 'bill_common': '发票', 'bill_special': '增值税专用发票'}[billType]

        let showBill = false
        const billChecked = billState === 'bill_states_make_out' || billState === 'bill_states_auth' ? true : false

        switch (categoryType) {
            case 'LB_YYSR': {
                showBill = oriState == 'STATE_YYSR_DJ' ? false : true
                billTypeList = [{key: '发票', value: 'bill_common'}, {key: '其他票据', value: 'bill_other'}]
                break
            }
            case 'LB_YYZC': {
                if (scale == 'general' || isModify) {
                    showBill = oriState == 'STATE_YYZC_DJ' ? false : true
                    billTypeList = [{key: '增值税专用发票', value: 'bill_special'}, {key: '其他票据', value: 'bill_other'}]
                }
                break
            }
            case 'LB_FYZC': {
                if (scale == 'general' || isModify) {
                    showBill = oriState == 'STATE_FY_DJ' ? false : true
                    billTypeList = [{key: '增值税专用发票', value: 'bill_special'}, {key: '其他票据', value: 'bill_other'}]
                }
                break
            }
            case 'LB_CQZC': {
                billTypeList = [{key: '发票', value: 'bill_common'}, {key: '其他票据', value: 'bill_other'}]//处置
                if (oriState == 'STATE_CQZC_YF') {//购进资产
                    billTypeList = [{key: '增值税专用发票', value: 'bill_special'}, {key: '其他票据', value: 'bill_other'}]
                }

                if (scale == 'general') {
                    showBill = true
                }

                if (scale == 'small') {
                    showBill = oriState == 'STATE_CQZC_YS' ? true : false

                    if (isModify && oriState == 'STATE_CQZC_YF' && oriBillType=='bill_special') {
                        showBill = true
                    }
                }

                break
            }
            case 'LB_YYWSR': {
                showBill = true
                billTypeList = [{key: '发票', value: 'bill_common'}, {key: '其他票据', value: 'bill_other'}]
                break
            }
            case 'LB_YYWZC': {
                if (scale == 'general' || isModify) {
                    showBill = true
                    billTypeList = [{key: '增值税专用发票', value: 'bill_special'}, {key: '其他票据', value: 'bill_other'}]
                }
                break
            }
            default: null
        }

        if (scale == 'isEnable') {
            showBill = false
            if (isModify && ['bill_special', 'bill_common'].includes(oriBillType)) {
                showBill = true
            }
        }

        if (scale == 'small' && ['LB_YYZC', 'LB_FYZC', 'LB_YYWZC'].includes(categoryType) && ['', 'bill_other'].includes(billType)) {
            showBill = false
            if (isModify && oriBillType=='bill_special') {
                showBill = true
            }
        }

        const disabled = billStrongList.size ? true : false



        return showBill ? (
            <Row className='lrls-card'>
				<Row className='yysr-bill'>
					<div className='lrls-more-card'>
						<label>票据类型:</label>
						<Single
                            disabled={disabled}
                            className='lrls-single'
							district={billTypeList}
							value={billType}
							onOk={value => {
                                dispatch(editRunningActions.changeLrlsData(['oriTemp', 'billList', 0, 'billType'], value.value))
                                dispatch(editRunningActions.changeTaxRate(scale == 'general' ? outputRate : payableRate))
                                if (value.value == 'bill_common') {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'billList', 0, 'billState'], 'bill_states_make_out'))
                                }
                                if (value.value == 'bill_special') {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'billList', 0, 'billState'], 'bill_states_auth'))
                                }
							}}
						>
							<Row className='lrls-category lrls-padding'>
								<span>{ billTypeName }</span>
                                <Icon type="triangle" style={{color: disabled ? '#ccc' : ''}}/>
							</Row>
						</Single>
					</div>

					{
						billType == 'bill_common' ? <SwitchText
							checked={billChecked}
							checkedChildren='已开票'
							unCheckedChildren='未开票'
							className='threeTextSwitch'
							onChange={() => {
                                if (disabled) { return }
                                let nextBillState = ''
                                ;({
                                    'bill_states_not_make_out': () => nextBillState = 'bill_states_make_out',
                                    'bill_states_make_out': () => nextBillState = 'bill_states_not_make_out'
                                }[billState] || (() => null))()
								dispatch(editRunningActions.changeLrlsData(['oriTemp', 'billList', 0, 'billState'], nextBillState))
							}}
						/> : null
					}
                    {
						billType == 'bill_special' ? <SwitchText
							checked={billChecked}
							checkedChildren='已认证'
							unCheckedChildren='未认证'
							className='threeTextSwitch'
							onChange={() => {
                                if (disabled) { return }
                                let nextBillState = ''
                                ;({
                                    'bill_states_not_auth': () => nextBillState = 'bill_states_auth',
                                    'bill_states_auth': () => nextBillState = 'bill_states_not_auth'
                                }[billState] || (() => null))()
								dispatch(editRunningActions.changeLrlsData(['oriTemp', 'billList', 0, 'billState'], nextBillState))
							}}
						/> : null
					}
				</Row>

				{
					billType != 'bill_other' ? <Row>
                        <Row className='lrls-more-card lrls-margin-top'>
                            <label>税率:</label>
                            <Single
                                disabled={disabled}
                                className='lrls-single'
                                district={this.taxRateList}
                                value={taxRate}
                                onOk={value => {
                                    dispatch(editRunningActions.changeTaxRate(value.value))
                            }}
                            >
                                <Row className='lrls-category lrls-padding'>
                                    <span>
                                        { `${taxRate == -1 ? '**' : taxRate}%` }
                                        <span className='lrls-placeholder' style={{display: isCustomize ? 'none' : ''}}>
                                            (税额：<Amount showZero>{tax}</Amount> 价税合计: <Amount showZero>{amount}</Amount>)
                                        </span>
                                    </span>
                                    <Icon type="triangle" style={{color: disabled ? '#ccc' : ''}}/>
                                </Row>
                            </Single>
                        </Row>
                        <Row className='yysr-amount lrls-margin-top' style={{display: isCustomize ? '' : 'none'}}>
                            <label>税额：</label>
                            <XfInput.BorderInputItem
                                mode='amount'
                                negativeAllowed={['LB_FYZC', 'LB_CQZC', 'LB_YYWSR', 'LB_YYWZC'].includes(categoryType)}
                                placeholder='填写金额'
                                value={tax}
                                onChange={(value) => {
                                    dispatch(editRunningActions.changeLrlsData(['oriTemp', 'billList', 0, 'tax'], value))
                                }}
                            />
                        </Row>
					</Row> : null
				}
                {
                    billStrongList.size && billType == 'bill_special' ? <Row className='lrls-margin-top'>
                        认证流水：{`${billStrongList.getIn([0, 'oriDate'])} ${billStrongList.getIn([0, 'jrIndex'])}`}号
                    </Row> : null
                }
                {
                    billStrongList.size && billType == 'bill_common' ? <Row className='lrls-margin-top'>
                        开票流水：{`${billStrongList.getIn([0, 'oriDate'])} ${billStrongList.getIn([0, 'jrIndex'])}`}号
                    </Row> : null
                }
			</Row>

        ) : null
    }

}
