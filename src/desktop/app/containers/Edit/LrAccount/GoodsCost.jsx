import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS } from 'immutable'

import * as Limit from 'app/constants/Limit.js'
import { RunCategorySelect, AcouontAcSelect, TableWrap, TableBody, TableTitle, TableAll, TableItem, JxcTableAll, Amount } from 'app/components'
import { DatePicker, Input, Select, Checkbox, Button, message, Radio } from 'antd'
const RadioGroup = Radio.Group
const Option = Select.Option

import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'

@immutableRenderDecorator
export default
class GoodsCost extends React.Component {
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

        // 货物成本结转、发票认证／待抵扣转、转出进项／转出销项

        const GoodsTitleList = ['日期', '流水号', '流水类别', '摘要', '收入总金额']
        const billTitleList = ['日期', '流水号', '流水类别', '摘要', '带认证税额']
        const taxTitleList = ['日期', '流水号', '流水类别', '摘要', '税额']


		return (
            <div>
                <div className="accountConf-separator"></div>
                <div className="accountConf-modal-list-item">
                    <label>流水类别：</label>
                    <div>
                        <Select
                            className="accountConf-modal-list-item-select"
							value={''}
							onChange={value => {
								console.log('选择流水类别')
							}}
							>
								{(cardTemp.get('acList') || []).map((v, i) =>
									<Option key={i} value={`${v.get('acId')}${Limit.TREE_JOIN_STR}${v.get('acFullName')}`}>
										{`${v.get('acId')} ${v.get('acFullName')}`}
									</Option>
								)}
						</Select>
                        <span className="lrAccount-gray-color">
                            请勾选需要结转成本的流水
                        </span>
                    </div>
                </div>

                <JxcTableAll>
					<TableTitle
						className="lrAccount-table-width"
						titleList={GoodsTitleList}
                        hasCheckbox={true}
    					selectAcAll={false}
    					onClick={() => console.log('select all')}
					/>
					<TableBody>
                        <TableItem className="lrAccount-table-width">
                            <li>
                                <Checkbox checked={false}/>
                            </li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </TableItem>
					</TableBody>
				</JxcTableAll>

            </div>
		)
	}
}
