import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { Select }	from 'antd'
const Option = Select.Option

import { editRunningAllActions } from 'app/redux/Edit/EditRunning/runningAll.js'
import * as innerCalculateActions from 'app/redux/Edit/EditCalculate/innerCalculate.action'

@immutableRenderDecorator
export default
class CategorySelect extends React.Component {

    render() {

        const { dispatch, insertOrModify, paymentTypeStr, hideCategoryList } = this.props

        let list = []
        const loop = (data) => data.map((item, i) => {
            if (item.childList && item.childList.length) {
                loop(item.childList)
            } else {
				list.push(
					<Option
					value={`${item.categoryType}${Limit.TREE_JOIN_STR}${item.fullCategoryName}`}
					key={item.uuid}
					>
						{item.name}
					</Option>
				)
			}


        })
        loop(hideCategoryList ? hideCategoryList.toJS() : [])

        return (
            <div className="edit-running-modal-list-item">
                <label>流水类别：</label>
                <div>
                    <Select
                        disabled={insertOrModify === 'modify'}
                        value={paymentTypeStr}
                        onChange={value => {
                            const valueList = value.split(Limit.TREE_JOIN_STR)
                            dispatch(editRunningAllActions.changeEditCalculatePaymentType(valueList[0]))
                            dispatch(innerCalculateActions.changeEditCalculateCommonString('',['views','paymentTypeStr'],valueList[1]))
                        }}
                        >
                        {list}
                    </Select>
                </div>
            </div>
        )
    }
}
