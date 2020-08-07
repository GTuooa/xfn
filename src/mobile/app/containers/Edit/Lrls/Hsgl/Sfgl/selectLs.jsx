import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import { Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, Checkbox, SinglePicker } from 'app/components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { sfglAccountActions } from 'app/redux/Edit/Lrls/Hsgl/sfglAccount'
import { decimal } from 'app/utils'
import './index.less'

@connect(state => state)
export default
class Sfgl extends React.Component {

	render () {
		const { dispatch, sfglAccountState } = this.props
		const manageList = sfglAccountState.getIn(['manageList', 'childList'])

		let countNumber = 0
		let totalAmount = 0
		manageList.forEach(v => {

			if (v.get('isCheck')) {
				countNumber++
				const flowType = v.get('flowType')
				const direction = v.get('direction')
				let notHandleAmount = Number(v.get('notHandleAmount'))
				const runningState = v.get('runningState')
				if (runningState === 'STATE_YYSR_TS' || runningState === 'STATE_YYZC_TG') {
					notHandleAmount = -Math.abs(notHandleAmount)
				}
				if (flowType == 'FLOW_INADVANCE') {
					if (direction=='credit') {
						totalAmount += notHandleAmount
					} else {
						totalAmount -= notHandleAmount
					}
				} else {
					if (direction=='credit') {
						totalAmount -= notHandleAmount
					} else {
						totalAmount += notHandleAmount
					}
				}
			}
		})

		let titleName = totalAmount >= 0 ? '待核销收款金额：' : '待核销付款金额：'

		const runningName = (flowType, direction) => {
			let name = ''
			if (flowType == 'FLOW_INADVANCE') {
				if (direction=='credit') {
					name = '预付'
				} else {
					name = '预收'
				}
			} else {
				if (direction=='credit') {
					name = '应付'
				} else {
					name = '应收'
				}
			}
			return name
		}

		return(
			<Container className="lrls">
				<ul className='lrls-row xczc-ls'>
					<li>已勾选流水：{countNumber}条</li>
					<li>{titleName}<Amount showZero>{Math.abs(totalAmount)}</Amount></li>
				</ul>

				<ScrollView ref="lrlsScrollContainer" flex="1" uniqueKey="lrls-scroll" savePosition>
					{
						manageList.map((v, i) => {
							let notHandleAmount = Number(v.get('notHandleAmount'))
							const runningState = v.get('runningState')
							if (runningState === 'STATE_YYSR_TS' || runningState === 'STATE_YYZC_TG') {
								notHandleAmount = -Math.abs(notHandleAmount)
							}

							return (
								<Row
									key={i}
									className='lrls-card'
								>
									<div className='xczc-ls-line xczc-ls-top'
										onClick={() => {
											if (v.get('isCheck')) {
												dispatch(sfglAccountActions.manageListCheckded(i, false))
											} else {
												dispatch(sfglAccountActions.manageListCheckded(i, true))
												if (v.get('beOpened')) {
													dispatch(sfglAccountActions.getSfglCategoryList(i, v.get('assType')))
												}
											}
										}}
									>
										<span>
											<Checkbox
												style={{'paddingRight': '10px'}}
												checked={v.get('isCheck') ? true : false}
											/>
											{v.get('flowNumber')}
										</span>
										<span className='xczc-ls-color'>{v.get('runningDate')}</span>
									</div>

									<div className='xczc-ls-line xczc-ls-center sfgl-item'>
										{
											v.get('beOpened') ? <SinglePicker
												disabled={!(v.get('isCheck'))}
												district={v.get('categoryList') ? v.get('categoryList').toJS() : []}
												value={v.get('categoryName') ? v.get('categoryName') : ''}
												onOk={value => {
													dispatch(sfglAccountActions.sfglManageListCatetory(i, value.value))
												}}
											>
												<Row className={v.get('isCheck') ? 'overElli' : 'overElli lrls-placeholder'}>
													{v.get('categoryName') ? v.get('categoryName') : '点击选择类别'}
												</Row>
											</SinglePicker> : <div className='overElli'>
												{v.get('categoryName')}
											</div>
										}
										<Amount showZero>{notHandleAmount}</Amount>
									</div>
									<div className='xczc-ls-line xczc-ls-center'>
										<span className='overElli'>
											{v.get('runningAbstract')}
										</span>
										<span></span>
									</div>
									{/* {
										v.get('beOpened') ? null : <div className='xczc-ls-line xczc-ls-bottom'>
											<span className='xczc-ls-color'>
												{runningName(v.get('flowType'), v.get('direction'))}
											</span>
										</div>
									} */}
									<div className='xczc-ls-line xczc-ls-bottom'>
										<span className='xczc-ls-color'>
											{runningName(v.get('flowType'), v.get('direction'))}
										</span>
									</div>


								</Row>
							)
						})
					}

				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						dispatch(homeAccountActions.changeHomeAccountData('categoryType','LB_SFGL'))
						dispatch(sfglAccountActions.changeSfglData('amount', totalAmount))
						dispatch(sfglAccountActions.changeSfglData('totalAmount', totalAmount))
					}}>
						<Icon type="choose"/>
						<span>确定</span>
					</Button>

				</ButtonGroup>
			</Container>

		)
	}
}
