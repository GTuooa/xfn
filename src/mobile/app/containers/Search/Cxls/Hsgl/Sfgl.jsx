import React from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'

import { TextInput, Row, Icon, Button, ButtonGroup, Container, ScrollView, Amount, TextareaItem, SinglePicker } from 'app/components'
import { TopDatePicker } from 'app/containers/components'
import { Account } from 'app/containers/Edit/Lrls/components'

import { DateLib } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

import { cxAccountActions } from 'app/redux/Search/Cxls'


@connect(state => state)
export default
class Sfgl extends React.Component {

	componentDidMount() {
		const runningDate = new DateLib(new Date()).valueOf()
		this.props.dispatch(cxAccountActions.changeCxlsData(['data', 'runningDate'], runningDate))
	}

	render () {
		const { dispatch, cxAccountState } = this.props

		const accountList = cxAccountState.get('accountList')
		const data = cxAccountState.get('data')

		const accountName = data.get('accountName')
		const accountUuid = data.get('accountUuid')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
		const amount = data.get('amount')
		const amountTitle = data.get('amountTitle')
		const contactsCardRange = data.get('contactsCardRange')
		const fromRouter = cxAccountState.getIn(['views', 'fromRouter'])
		const categoryList = cxAccountState.get('categoryList')
		const assTypeList = categoryList.get('assTypeList')
		const lastIdx = assTypeList.size - 1
		const assType = {AC_AR:'应收', AC_PP:'预收', AC_ADV:'预付', AC_AP: '应付'}

		return(
			<Container className="lrls">
				<TopDatePicker
					value={runningDate}
					onChange={date => {
						dispatch(cxAccountActions.changeCxlsData(['data', 'runningDate'], new DateLib(date).valueOf()))

					}}
					callback={(value) => {
						dispatch(cxAccountActions.changeCxlsData(['data', 'runningDate'], value))

					}}
				/>

				<ScrollView flex="1">

					<Row className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={runningAbstract}
							onChange={(value) => {
								dispatch(cxAccountActions.changeCxlsData(['data', 'runningAbstract'], value))
							}}
						/>
					</Row>

					<div className='lrls-card'>
						<div className='lrls-bottom'>往来单位： {`${contactsCardRange.get('code')} ${contactsCardRange.get('name')}`}</div>

						<Row className='yysr-amount'>
							<label>{amountTitle}:</label>
							<TextInput
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
									if (/^\d*\.?\d{0,2}$/g.test(value)) {
										dispatch(cxAccountActions.changeCxlsData(['data', 'amount'], value))
									}
								}}
							/>
							<Account
								accountList={accountList}
								accountUuid={accountUuid}
								accountName={accountName}
								noInsert={true}
								onOk={(value) => {
									let arr = value.split(Limit.TREE_JOIN_STR)
									dispatch(cxAccountActions.changeCxlsData(['data', 'accountUuid'], arr[0]))
									dispatch(cxAccountActions.changeCxlsData(['data', 'accountName'], arr[1]))
								}}
							/>
						</Row>
					</div>

					<div className='lrls-card' style={{display: assTypeList.size ? '' : 'none'}}>
						{
							assTypeList.map((v, i) => {
								return (
									<div key={i}
										className='lrls-more-card lrls-bottom lrls-jzsy'
										style={{marginBottom: i == lastIdx ? '0' : ''}}
									>
										<label>{assType[v.get('assType')]}期初类别:</label>
										<SinglePicker
											district={categoryList.get(v.get('assType')).toJS()}
											value={v.get('categoryUuid') ? `${v.get('categoryUuid')}${Limit.TREE_JOIN_STR}${v.get('name')}` : ''}
											onOk={value => {
												dispatch(cxAccountActions.changeSfglCategory(value.value, i))
											}}
										>
											<Row className='lrls-category lrls-padding'>
												{
													v.get('categoryUuid') ? <span> {v.get('name')} </span>
													: <span className='lrls-placeholder'>点击选择类别</span>
												}
												<Icon type="triangle" />
											</Row>
										</SinglePicker>
                                </div>)
							})
						}
					</div>


				</ScrollView>

				<ButtonGroup style={{backgroundColor: '#F8F8F8'}}>
					<Button onClick={() => {
						dispatch(cxAccountActions.changeCxlsData(['views', 'currentRouter'], fromRouter))
						dispatch(cxAccountActions.changeCxlsData(['categoryList', 'assTypeList'], fromJS([])))
					}}>
						<Icon type="cancel"/>
						<span>取消</span>
					</Button>
					<Button onClick={() => {
						dispatch(cxAccountActions.saveSfgl())
					}}>
						<Icon type="new"/>
						<span>保存</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
