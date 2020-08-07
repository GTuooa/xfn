import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { Switch, SinglePicker, TextInput, Button, ButtonGroup, Container, ScrollView, Form, Row, Icon } from 'app/components'
import * as currencyActions from 'app/redux/Config/Currency/currency.action'
const Item = Form.Item
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

@connect(state => state)
export default
class CurrencyModify extends React.Component {

	constructor() {
		super()
		this.state = {
			showFcNumber: ''
		}
	}
	componentDidMount() {

	}
	render() {
		const {
			currencyState,
			allState,
			history,
			dispatch
		} = this.props
		const { showFcNumber } = this.state

		thirdParty.setRight({show: false})
		const handleCurrency = currencyState.get('handleCurrency')
        const currency = currencyState.get('currency')
		const currencyModelList = currencyState.get('currencyModelList')

		if (handleCurrency === 'insert'){
			thirdParty.setTitle({title: '添加币别'})
		} else if (handleCurrency === 'modify') {
			thirdParty.setTitle({title: `编辑币别：${currency.get('fcNumber')}`})
		}

		const selectFCList = currencyModelList.map((u, i ) => ({
			key: `${u.get('fcNumber')}${Limit.EMPTY_CONNECT}${u.get('name')}`,
			value: `${u.get('fcNumber')}${Limit.EMPTY_CONNECT}${u.get('name')}`
		}))

		return (
			<Container className="currency-option">
                <ScrollView flex="1">
					<Form>
                        <Item label="币别：" className="form-offset-up" style={{display: handleCurrency === 'insert' ? '' : 'none'}}>
							<SinglePicker
								district={selectFCList}
								onOk={(result) => {
									this.setState({showFcNumber: result.value})
									const arr = result.value.split(Limit.EMPTY_CONNECT)
									const fcNumber = arr[0]
									const name = arr[1]
									dispatch(currencyActions.changeFcNumber(fcNumber, name))
								}}
							>
								<span>
									<span style={{color: currency.get('fcNumber') ? '' : '#999'}}>{currency.get('fcNumber') ? currency.get('fcNumber') : '请选择币别'}</span>
									&nbsp;<Icon type="arrow-right" className="input-icon-arrow-right"/>
								</span>
							</SinglePicker>
							{/* <span
								onClick={() => {
								thirdparty.chosen({
	                                source : selectFCList,
	                                onSuccess: (result) => {
										this.setState({showFcNumber: result.value})
										const arr = result.value.split(Limit.EMPTY_CONNECT)
										const fcNumber = arr[0]
										const name = arr[1]
										dispatch(currencyActions.changeFcNumber(fcNumber, name))
	                                }
	                            })
							}}
							> */}
								{/* <span style={{color: currency.get('fcNumber') ? '' : '#999'}}>{currency.get('fcNumber') ? currency.get('fcNumber') : '请选择币别'}</span>
								&nbsp;<Icon type="arrow-right" className="input-icon-arrow-right"/> */}
							{/* </span> */}
						</Item>
                        <Item label="汇率：" className="form-offset-up  form-offset-margin">
							<TextInput
								textAlign="right"
								value={currency.get('exchange')}
                                placeholder="请输入汇率(最多支持小数点后四位)"
                                onChange={value => dispatch(currencyActions.changeExchange(value))}
                            />
							&nbsp;<Icon type="arrow-right" className="input-icon-arrow-right"/>
						</Item>
                    </Form>
				</ScrollView>

				<ButtonGroup type='ghost' height={50}>
					<Button onClick={() => dispatch(history.goBack() && currencyActions.cancelSaveCurrency())}><Icon type="cancel"/><span>取消</span></Button>
					<Button onClick={() => dispatch(currencyActions.saveCurrencyFetch(currency, handleCurrency, history))}><Icon type="save"/><span>保存</span></Button>
				</ButtonGroup>
			</Container>
		)
	}
}
