import React from 'react'
import PropTypes from 'prop-types'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { TableWrap, NumberInput } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'
import { Radio, Select, Icon, Modal, message, Input, Tooltip } from 'antd'
const RadioGroup = Radio.Group
const Option = Select.Option

import XfnIcon from 'app/components/Icon'
// import * as taxConfActions from 'app/redux/Config/Running/tax/taxConf.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@immutableRenderDecorator
export default class TaxRateConf extends React.Component {
	state = {
		curRateList:this.props.rateList || []
	}
	render() {
		const { curRateList } = this.state
		const { onClose, dispatch, rate } = this.props
		return (
			<Modal
				width={480}
				visible={true}
				title='税率选项'
				onCancel={onClose}
				onOk={() => {
					const rateOptionList = curRateList.filter(v => v.value).map(v => v.value)
					if (!rateOptionList.length || rateOptionList.length === 1 && !rateOptionList[0]) {
						message.info('请输入有效税率')
					} else if (rateOptionList.some(v => rateOptionList.filter(w => w == v).length >= 2)) {
						message.info('税率不可重复')
					} else {
						dispatch(allRunningActions.modifyRateOption(rateOptionList,onClose))
					}
				}}
			>
                <div>
				{
					curRateList.map((v,index) =>
						<div className='rate-list'>
							<span className='rate-title'>选项{index+1}：</span>
							<Input
								disabled={rate === v.value}
								value={v.value}
								onChange={e => {
									const value = e.target.value
									const reg = /^\d{0,2}$/g
									if (value <= 99 && value !== '0' && reg.test(value)) {
										curRateList[index].value = value
										this.setState({curRateList})
									} else {
										message.info('仅支持输入整数/范围1～99')
									}

								}}
							/>
							<span style={{}} className='rate-percent'>%</span>
							<div className='pre-content'>
								<XfnIcon type='bigPlus'
									style={curRateList.length === 1?{lineHeight:'28px',fontSize:'15px'}:{}}
									onClick={() => {
										curRateList.splice(index+1,0,{})
										this.setState({curRateList})

									}}
								/>
								{
									curRateList.length > 1 ?
									<Tooltip title={rate === v.value?'默认税率不允许删除':''}>
										<XfnIcon
											type='bigDel'
											disabled={rate === v.value}
											onClick={() => {
												curRateList.splice(index,1)
												this.setState({curRateList})
										}}/>
									</Tooltip>
									:''
								}
							</div>
						</div>
					)
				}
                </div>
            </Modal>
		)
	}
}
