import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Map } from 'immutable'
import * as qcyeActions from 'app/redux/Config/Qcye/qcye.action'
import { TextInput, Icon, AmountInput } from 'app/components'
import { formatMoney } from 'app/utils'
import { Amount } from 'app/components'
import thirdParty from 'app/thirdParty'

@immutableRenderDecorator
export default
class Balance extends React.Component {
	constructor() {
		super()
		this.state = {qcyeFzhsBool: false, qcyeFzhsCountBool: false}
	}

	render() {
		const {
            ac,
			style,
            baitem,
            dispatch,
			acunitOpen,
			acunit,
			unitDecimalCount,
		} = this.props
		const { qcyeFzhsBool, qcyeFzhsCountBool } = this.state

		return (
			<div style={style} className="qcye-line">
				<span className="assname">
					<Icon
						className="delete-plus-icon"
						type="delete-plus"
						color="#f55"
						size="14"
						onClick={() => {
							if (!baitem.get('amount'))
								return dispatch(qcyeActions.deleteAcBalance(baitem.get('idx')))

								thirdParty.Confirm({
										message: `确定删除此条辅助核算？`,
										title: "提示",
										buttonLabels: ['取消', '确定'],
										onSuccess : (result) => {
											if (result.buttonIndex === 1) {
												dispatch(qcyeActions.deleteAcBalance(baitem.get('idx')))
											}
										},
										onFail : (err) => alert(err)
									})
								}
						}
					/>
					<span>辅：</span>
					<div>
						{
							baitem.get('asslist').map(v => <div>{[v.get('asscategory') ,v.get('assid'), v.get('assname')].join('_')}</div>)
						}
					</div>
					{/* 辅: {[baitem.getIn(['asslist', 0, 'asscategory']), baitem.getIn(['asslist', 0,'assid']), baitem.getIn(['asslist', 0, 'assname'])].join('_')} */}
				</span>
				<span className="direction">{baitem.get('direction') == 'debit' ? '借' : '贷'}</span>
				<span className="amount">
					{acunitOpen ?
					(
						<div className="acunitOpen">
							<p>
								{/* 数字 */}
								<TextInput
									className="amount-content acunitOpen-input"
									style={{color: baitem.get('beginCount') < 0 ? 'red' : undefined}}
									onChange={value => {
										if(Math.abs(value) > 1000000){
											return alert('数量的长度不能超过6位')
										}
										dispatch(qcyeActions.changeAcBalanceCount(ac, value, baitem.get('idx'), unitDecimalCount))
									}}
									value={baitem.get('beginCount') ? (qcyeFzhsCountBool ? baitem.get('beginCount') : formatMoney(baitem.get('beginCount'), unitDecimalCount, '')) : ''}
									onBlur={() => this.setState({qcyeFzhsCountBool: false})}
									onFocus={() => {
										this.setState({qcyeFzhsCountBool: true})
									}}
								/>
								<span className="acunitOpen-acunit">{acunit}</span>
							</p>
							<hr className="acunitOpen-hr" />
							<p>
								<TextInput
									className="amount-content acunitOpen-input"
									style={{color: baitem.get('amount') < 0 ? 'red' : undefined}}
									type="text"
									placeholder="金额填写"
									value={baitem.get('amount') ? (qcyeFzhsBool ? baitem.get('amount') : formatMoney(baitem.get('amount'), 2, '')) : ''}
									onChange={value => dispatch(qcyeActions.changeBaAmount(ac, value, baitem.get('idx')))}
									onBlur={e => {
										this.setState({qcyeFzhsBool: false})
									}}
									onFocus={e => {
										this.setState({qcyeFzhsBool: true})
									}}
								/>
							</p>
						</div>
					) :
					<span className="amount-content" style={{color: baitem.get('amount') < 0 ? 'red' : undefined}}>
						<TextInput
							type="text"
							placeholder="金额填写"
							moneyKeyboardAlign="right"
							value={baitem.get('amount') ? (qcyeFzhsBool ? baitem.get('amount') : formatMoney(baitem.get('amount'), 2, '')) : ''}
							onChange={value => dispatch(qcyeActions.changeBaAmount(ac, value, baitem.get('idx')))}
							onBlur={e => {
								this.setState({qcyeFzhsBool: false})
							}}
							onFocus={e => {
								this.setState({qcyeFzhsBool: true})
							}}
						/>
					</span>

					}
					{/* <Input
						className="amount-content"
						style={{color: baitem.get('amount') < 0 ? 'red' : undefined}}
						type="text"
						placeholder="金额填写"
						value={baitem.get('amount') ? (qcyeFzhsBool ? baitem.get('amount') : formatMoney(baitem.get('amount'), 2, '')) : ''}
						onChange={e => dispatch(qcyeActions.changeBaAmount(ac, e.target.value, baitem.get('idx')))}
						onBlur={e => {
                            this.setState({qcyeFzhsBool: false})
						}}
						onFocus={e => {
							this.setState({qcyeFzhsBool: true})
						}}
					/> */}
				</span>
			</div>
		)
	}
}
