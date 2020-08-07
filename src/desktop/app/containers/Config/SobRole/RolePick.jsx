import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS } from 'immutable'

import { Button, Icon, Checkbox } from 'antd'
import * as thirdParty from 'app/thirdParty'

import * as sobRoleActions from 'app/redux/Config/SobRole/sobRole.action.js'

function chooseLib(list, callback) {

	if (global.isplayground)
		return

	thirdParty.choose({
		// startWithDepartmentId: 0,
		multiple: true,
		users: list.map(v => v.get('emplId')).toJS(),
		max: 1500,
		onSuccess: (resultlist) => {
			// 点击取消时的 resultlist 返回为 []，此时不要重置已有的人员，正常情况下resultlist不可能为[]，所以直接用长度判断
			if (resultlist.length) {
				// resultlist = resultlist.map(v => {
					// v.emplId = v.emplId.toString()
					// const openReview = list.find(w => w.get('emplId') === v.emplId.toString())
					// v.openReview = openReview ? openReview.get('openReview') : false
					// return v
				// })

				console.log('resultlist', resultlist);
				
				callback(resultlist)
			}
		},
		onFail: (err) => {
			// thirdParty.Alert('获取钉钉通讯录失败，请刷新后重试')
		}
	})
}

@immutableRenderDecorator
export default
class RolePick extends React.Component {

	constructor(props) {
		super(props)
		this.state = {showRoleList: false}
	}

	render() {

		const {
			moduleItemName,
			placement,
			title,
			dispatch,
			rangeList,
			deleteAllRange,
			checkedSelf
        } = this.props
		const { showRoleList } = this.state

		const inList = rangeList && rangeList.get('in') ? rangeList.get('in') : fromJS([])

		return (
			<div className="sob-role-detail-item-range-wrap">
				<span>{`${title}：`}</span>
				<span className="sob-role-detail-input">
					<div className="sob-role-detail-input-item-wrap">
						<div>
							<ul className="approval-card-input-item-container">
								{
									inList.map((v, i) => {
										return (
											<li>
												<span>{v.get('name')}</span>
												<Icon
													type="close" 
													onClick={() => {
														const newStockScope = inList.delete(i)
														dispatch(sobRoleActions.setSobRoleModuleListValue([moduleItemName, ...placement, 'in'], newStockScope))
													}}
												/>
											</li>
										)
									})
								}
							</ul>
						</div>
					</div>
					<div
						className='sob-role-detail-chosen-word'
						onClick={() => {
							chooseLib(inList, (resultlist) => {
								dispatch(sobRoleActions.setSobRoleModuleListValue([moduleItemName, ...placement, 'in'], fromJS(resultlist)))
							})
						}}
					>
						选择
					</div>
				</span>

				<Checkbox
					className='sob-role-detail-self-checkbox'
					checked={checkedSelf}
					onClick={e => {
						dispatch(sobRoleActions.setSobRoleModuleListValue([moduleItemName, 'oneself'], !checkedSelf))
					}}
				>
					本人
				</Checkbox>

				<Icon className='sob-role-detail-delete-icon' type="delete" onClick={() => deleteAllRange()} />
			</div>
		)
	}
}
