import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Icon, Checkbox, Button, Modal, Select, Input } from 'antd'
const Option = Select.Option
import { fromJS, toJS }	from 'immutable'
import * as Limit from 'app/constants/Limit.js'

import * as currencyActions from 'app/redux/Config/Currency/currency.action.js'

@immutableRenderDecorator
export default
class CurrencyModel extends React.Component {

	render() {

		const {
            dispatch,
			currencyModelList,
            currencyModel,
			insertCurrencyList,
			onChange
		} = this.props

		const insertValue = insertCurrencyList.get('fcNumber') ? `${insertCurrencyList.get('fcNumber')}${Limit.FC_NUMBER_AND_NAME_CONNECT}${insertCurrencyList.get('name')}` : ''
		const handleCurrency = sessionStorage.getItem('handleCurrency')

		return (
			<Modal
                title={handleCurrency == 'insert' ? '添加币别' : `修改币别：${insertCurrencyList.get('fcNumber')}`}
                visible={currencyModel}
				onOk={() => dispatch(currencyActions.saveCurrencyFetch(insertCurrencyList))}
				onCancel={() => dispatch(currencyActions.cancelCurrencyModalDisplay())}
				okText="保存"
				width='480px'
                >
                    <div className="currency-model">
                        <div className="currency-model-item" style={{display: handleCurrency == 'insert' ? '' : 'none'}}>
                            <span>币别：</span>
                            <Select
								showSearch
								className="currency-model-select"
                                optionFilterProp={"children"}
            					notFoundContent="无法找到相应科目"
                                value={insertValue}
								onSelect={onChange}
                                >
                                    {currencyModelList.map((u,i) =>
										(<Option key={i} value={`${u.get('fcNumber')}${Limit.FC_NUMBER_AND_NAME_CONNECT}${u.get('name')}`}>
											{`${u.get('fcNumber')} ${u.get('name')}`}
										</Option>)
									)}
                            </Select>
                        </div>
                        <div className="currency-model-item">
                            <span>汇率：</span>
                            <Input type="number"
								className="currency-model-select"
								value={insertCurrencyList.get('exchange')}
								placeholder="最多支持小数点后4位"
								onChange={(e) => dispatch(currencyActions.changeInsertExchange(e.target.value))}
							/>
                        </div>
                    </div>
            </Modal>
		)
	}
}
