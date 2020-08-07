import React from 'react'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'

import { Row, Icon, Button, ButtonGroup, Container, ScrollView, TextareaItem, XfInput, SwitchText, Amount } from 'app/components'
import { TopDatePicker, EnclosurePublic } from 'app/containers/components'

import { DateLib, decimal } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action.js'


@connect(state => state)
export default
class Kjfp extends React.Component {
	state = { inputTax: true}
	componentDidMount() {
		thirdParty.setTitle({ title: '开具发票' })
		thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })
		sessionStorage.setItem('prevPage','searchrunning')
	}

	render () {
		const { dispatch, searchRunningState, history } = this.props
		const { inputTax } = this.state
		const data = searchRunningState.get('data')

		const oriDate = data.get('oriDate')
		const oriAbstract = data.get('oriAbstract')
		const amount = data.get('amount')
		const taxTotal = data.get('taxTotal')
		const jrTaxAmount = data.get('jrTaxAmount')
		const jrAmount = data.get('jrAmount')

		let jrTaxTotal = decimal(jrTaxAmount * amount / jrAmount)

		return(
			<Container className="edit-running">
				<TopDatePicker
					value={oriDate}
					onChange={date => {
						dispatch(searchRunningActions.changeCxlsData(['data', 'oriDate'], new DateLib(date).valueOf()))

					}}
					callback={(value) => {
						dispatch(searchRunningActions.changeCxlsData(['data', 'oriDate'], value))

					}}
				/>

				<ScrollView flex="1">
					<div className='lrls-card lrls-line'>
						<label>摘要：</label>
						<TextareaItem
							placeholder='摘要填写'
							value={oriAbstract}
							onChange={(value) => {
								dispatch(searchRunningActions.changeCxlsData(['data', 'oriAbstract'], value))
							}}
						/>
					</div>
					<div className='lrls-card'>
                        <Row className='lrls-more-card'>
						    <label>{inputTax ? '开票税额' : '价税合计'}:</label>
                            <XfInput.BorderInputItem
                                mode='amount'
                                placeholder='填写金额'
                                value={inputTax ? amount : taxTotal}
								onChange={(value) => {
									if (!inputTax) {//价税合计金额
										let amount = decimal(value*jrAmount/jrTaxAmount)
										dispatch(searchRunningActions.changeCxlsData(['data', 'amount'], amount))
										dispatch(searchRunningActions.changeCxlsData(['data', 'taxTotal'], value))
									} else {
										dispatch(searchRunningActions.changeCxlsData(['data', 'amount'], value))
									}
								}}
                            />
							<span className='noTextSwitch' style={{marginLeft: '6px'}}>
                                <SwitchText
                                    checked={inputTax}
                                    checkedChildren=''
                                    unCheckedChildren=''
                                    onChange={() => {
										this.setState({inputTax: !inputTax})
                                        dispatch(searchRunningActions.changeCxlsData(['data', 'amount'], jrAmount))
                                        if (inputTax) {//价税合计模式
                                            dispatch(searchRunningActions.changeCxlsData(['data', 'taxTotal'], jrTaxAmount))
                                        }
                                    }}
                                />
                            </span>							
                        </Row>
						<div className='lrls-placeholder lrls-margin-top' style={{paddingLeft: '.6rem'}}>
							<div>
								{ !inputTax ? <span>开票税额: <Amount showZero>{amount}</Amount></span>
                                   : <span>价税合计: <Amount showZero>{jrTaxTotal}</Amount></span> 
								}
                            </div>
							<div>待开票税额: <Amount showZero>{jrAmount}</Amount></div>
							<span>
                               待处理价税合计: <Amount showZero>{jrTaxAmount}</Amount>
                            </span>
                        </div>						
                    </div>
					<EnclosurePublic history={history}/>
				</ScrollView>

				<ButtonGroup>
					<Button onClick={() => {
						history.goBack()
					}}>
						<Icon type="cancel"/>
						<span>取消</span>
					</Button>
					<Button onClick={() => {
						dispatch(searchRunningActions.saveKjfp(history))
					}}>
						<Icon type="new"/>
						<span>保存</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
