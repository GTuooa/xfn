import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { RunCategorySelect, AcouontAcSelect } from 'app/components'
import { DatePicker, Input, Select, Checkbox, Button, message, Radio } from 'antd'
const RadioGroup = Radio.Group
const Option = Select.Option
import { toJS } from 'immutable'

import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'

@immutableRenderDecorator
export default
class LongTermAsset extends React.Component {
	constructor() {
		super()
		this.state = {
		}
	}

	render() {
		const {
            reg,
            dispatch,
            cardTemp

		} = this.props


        const changeValue = (tempType, valuePlace, data) => {

            let value = data.indexOf('。') > -1 ? data.replace('。', '.') : data
			if(value.indexOf('0') === 0 && value != '0' && value >= 1 ){
				value = value.substr(1)
			}
            if (reg.test(value) || value === '') {
                dispatch(lrAccountActions.changeLrAccountCommonString(tempType, valuePlace, value))
            } else {
                message.info('金额只能输入带两位小数的数字')
            }
        }

        // 长期资产

		return (
            <div>
                <div className="accountConf-separator"></div>
                <div className="accountConf-modal-list-item">
                    <label>资产原值：</label>
                    <div>
                        <Input
                            placeholder=""
                            value={cardTemp.get('offsetAmount')}
                            onChange={(e) => {
                                changeValue('card', 'offsetAmount', e.target.value)
                            }}
                        />
                    </div>
                </div>
                <div className="accountConf-modal-list-item">
                    <label>折旧累计：</label>
                    <div>
                        <Input
                            placeholder=""
                            value={cardTemp.get('offsetAmount')}
                            onChange={(e) => {
                                changeValue('card', 'offsetAmount', e.target.value)
                            }}
                        />
                    </div>
                </div>
                <div className="accountConf-modal-list-item">
                    <label>清理费用：</label>
                    <div>
                        <Input
                            placeholder=""
                            value={cardTemp.get('offsetAmount')}
                            onChange={(e) => {
                                changeValue('card', 'offsetAmount', e.target.value)
                            }}
                        />
                    </div>
                </div>
                <div className="accountConf-modal-list-item">
                    <label>升级改造：</label>
                    <div>
                        <Input
                            placeholder=""
                            value={cardTemp.get('offsetAmount')}
                            onChange={(e) => {
                                changeValue('card', 'offsetAmount', e.target.value)
                            }}
                        />
                    </div>
                </div>

            </div>
		)
	}
}
