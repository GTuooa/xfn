import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS } from 'immutable'

import * as Limit from 'app/constants/Limit.js'
import { Icon, Select } from 'antd'

import * as sobRoleActions from 'app/redux/Config/SobRole/sobRole.action.js'

@immutableRenderDecorator
export default
class ProcessModelPick extends React.Component {

	constructor(props) {
		super(props)
		this.state = {showModal: false}
	}

	render() {

		const {
            title,
			dispatch,
			rangeList,
			moduleItemName,
			placement,
            deleteAllRange,
            processModelList,
        } = this.props
		const { showModal } = this.state

		const inList = rangeList.get('in') ? rangeList.get('in') : fromJS([])

		return (
			<div className="sob-role-detail-item-range-wrap">
				<span>{`${title}：`}</span>
				<span className="sob-role-detail-input">
                        <Select
                            mode="multiple"
                            placeholder="请选择"
                            value={inList.map((v, i) => v.get('code')+ Limit.TREE_JOIN_STR +v.get('name')).toJS()}
                            onChange={(value) => {
                                console.log(value);

                                let newProcessModelList = value.map(v => {
                                    const value = v.split(Limit.TREE_JOIN_STR)

                                   return {
                                        code: value[0],
                                        name: value[1],
                                        top: true,
                                        type: 'CARD',
                                    }
                                })

                                dispatch(sobRoleActions.setSobRoleModuleListValue([moduleItemName, ...placement, 'in'], fromJS(newProcessModelList)))
                            }}
                            style={{ width: '100%' }}
                        >
                            {
                                processModelList && processModelList.map(v => {
                                    return (
                                        <Select.Option key={`${v.get('modelCode')}${Limit.TREE_JOIN_STR}${v.get('modelName')}`} value={`${v.get('modelCode')}${Limit.TREE_JOIN_STR}${v.get('modelName')}`}>
                                            {v.get('modelName')}
                                        </Select.Option>
                                    )
                                })
                            }
                        </Select>
                </span>
                <Icon className='sob-role-detail-delete-icon' type="delete" onClick={() => deleteAllRange()} />
			</div>
		)
	}
}