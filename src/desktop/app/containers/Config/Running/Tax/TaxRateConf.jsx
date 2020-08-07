import React from 'react'
import PropTypes from 'prop-types'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { TableWrap } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'
import { Radio, Select, Icon, Divider } from 'antd'
const RadioGroup = Radio.Group
const Option = Select.Option

import XfnIcon from 'app/components/Icon'
import * as taxConfActions from 'app/redux/Config/Running/tax/taxConf.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'
import ChooseModal from './ChooseModal'

@immutableRenderDecorator
export default class TaxRateConf extends React.Component {

	static displayName = 'TaxRateConf'
	state={
		chooseModal:false
	}
	componentDidMount() {
		this.props.dispatch(allRunningActions.getRunningTaxRate())
	}


	render() {
		const { dispatch, taxRateTemp, isTaxQuery } = this.props
		const { chooseModal } = this.state
		const scale = taxRateTemp.get('scale')
		const outputRate = taxRateTemp.get('outputRate')
		const payableRate = taxRateTemp.get('payableRate')
		const rateOptionList = taxRateTemp.get('rateOptionList') || fromJS([])
		const payableRateSouce = rateOptionList.toJS().map(v => ({key:`${v}%`,value:v}))
		const outputRateSouce = payableRateSouce
		const rate = scale === 'small' ? payableRate : outputRate

		return (
			<TableWrap notPosition={true}>
				<div className="tax-rate-conf-color">
					{
						isTaxQuery?
						<div className="account-conf-tax-rate-title">
							<label>企业规模：</label>
							<div>
								{
									{
										small:'小规模纳税人',
										general:'一般纳税人',
										isEnable:'不启用'
									}[scale]
								}
							</div>
						</div> :
						<div className="account-conf-tax-rate-title">
							<label>企业规模：</label>
							<div>
								<RadioGroup onChange={e => {
									const value = e.target.value
									dispatch(taxConfActions.accountConfTaxRateSettingScale(value))
									if (value === 'small' && scale === 'general') {
										dispatch(taxConfActions.changeTaxConfCommonString('taxRate', 'payableRate', outputRate))
									} else if (scale === 'small' && value === 'general') {
										dispatch(taxConfActions.changeTaxConfCommonString('taxRate', 'outputRate', payableRate))
									}
								}} value={scale}>
									<Radio key="a" value={'small'}>小规模纳税人</Radio>
									<Radio key="b" value={'general'}>一般纳税人</Radio>
									<Radio key="c" value={'isEnable'}>不启用</Radio>
								</RadioGroup>
							</div>
						</div>
					}

					<ul style={{display: scale === 'small' ? '' : 'none'}} className="account-conf-tax-rate-list">

						<li>
							<label>默认税率：</label>
							{
								!isTaxQuery?
									<div>
										<Select
											disabled={isTaxQuery}
											value={`${rate}%`}
											dropdownRender={menu => (
												<div>
													{menu}
													<Divider style={{ margin: '4px 0' }} />
													<div
														style={{ padding: '4px 8px', cursor: 'pointer' }}
														onMouseDown={e => e.preventDefault()}
														onClick={() => {
															this.setState({chooseModal:true})
														}
														}
														>
															<XfnIcon type='edit-pen'/>税费选项
													</div>
												</div>
											)}
											onChange={(value) => dispatch(taxConfActions.changeTaxConfCommonString('taxRate', 'payableRate', value))}
											>
											{
												payableRateSouce.map((v, i) => <Option key={v.key} value={v.value}>{v.key}</Option>)
											}
										</Select>
									</div>
									:
									<div>
										{`${rate}%`}
									</div>
							}

						</li>
					</ul>
					<ul style={{display: scale === 'general' ? '' : 'none'}} className="account-conf-tax-rate-list">
						<li>
							<label>默认税率：</label>
							{
								!isTaxQuery?
									<div>
										<Select
											disabled={isTaxQuery}
											value={`${rate}%`}
											onChange={(value) => dispatch(taxConfActions.changeTaxConfCommonString('taxRate', 'outputRate', value))}
											dropdownRender={menu => (
												<div>
													{menu}
													<Divider style={{ margin: '4px 0' }} />
													<div
														style={{ padding: '4px 8px', cursor: 'pointer' }}
														onMouseDown={e => e.preventDefault()}
														onClick={() => {
															this.setState({chooseModal:true})
														}
														}
														>
															<XfnIcon type='edit-pen'/>税费选项
													</div>
												</div>
											)}
											>
											{
												outputRateSouce.map((v, i) => <Option key={v.key} value={v.value}>{v.key}</Option>)
											}
										</Select>
									</div> :
									<div>
										{`${rate}%`}
									</div>
						}
						</li>
					</ul>
					<div style={{display: scale === 'isEnable' ? '' : 'none'}} className="account-conf-tax-rate-list account-conf-tax-rate-enable">
						<Icon type="exclamation-circle" className="rate-enable-icon"/>
						流水中不体现发票内容
					</div>
				</div>
				{
					chooseModal?
					<ChooseModal
						dispatch={dispatch}
						onClose={() => {
							this.setState({chooseModal:false})
						}}
						rateList={scale === 'general'?outputRateSouce:payableRateSouce}
						rate={rate}
					/>:''
				}

			</TableWrap>
		)
	}
}
