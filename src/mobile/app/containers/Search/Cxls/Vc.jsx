import React, { PropTypes } from 'react'
import { cxAccountActions } from 'app/redux/Search/Cxls'
import { yllsActions } from 'app/redux/Ylls'
import { Checkbox, Icon, Amount, Button }	from 'app/components'
import * as Common from 'app/containers/Edit/Lrls/CommonData.js'
import { formatNum, formatMoney } from 'app/utils'
import { getCarrayOver } from './getCarrayOver'
import { toJz } from './toJz'

export default
class Vc extends React.Component {

	render() {
		const {
			item,
			dispatch,
			history,
			selectedIndex,
			idx,
			isEdit,
			editPermission,
			simplifyStatus,
			editPzPermission,
			reviewLrAccountPermission,
			intelligentStatus
		} = this.props

		const uuid = item.get('uuid')
		// 生成或修改凭证权限
		const canCreateVc = simplifyStatus ? editPzPermission : reviewLrAccountPermission

		let deleteVcId = [], deleteYear, deleteMonth
		item.get('vcList').map((u, i) => {
			deleteVcId.push(u.get('vcIndex'))
			deleteYear = u.get('year')
			deleteMonth = u.get('month')
		})

		let pzCom = null, hasPz = item.get('vcList').size ? true : false

		if (simplifyStatus || intelligentStatus) {//专业版或智能总账
			if (hasPz) {
				pzCom = <div>
					<Button disabled={!canCreateVc}
						style={{marginRight: '.05rem', marginLeft: '0rem'}}
						onClick={() => {
							dispatch(cxAccountActions.deleteRunningBusinessVc(deleteYear, deleteMonth, deleteVcId))
						}}
					>
						{simplifyStatus ? '删除' : '反审核'}
					</Button>
					<span style={{marginLeft: '.05rem', textDecoration: 'underline'}}
						onClick={() => {
							dispatch(cxAccountActions.getVcFetch(item.getIn(['vcList', 0]), history))
						}}
					>
						{`记${item.getIn(['vcList', 0, 'vcIndex'])}号`}
					</span>
				</div>
			} else {
				pzCom = <Button disabled={item.get('beCertificate') || !canCreateVc}
					onClick={() => {
						dispatch(cxAccountActions.insertRunningBusinessVc(uuid))
					}}
				>
					{simplifyStatus ? '生成' : '审核'}
				</Button>
			}
		} else {
			if (hasPz) {
				pzCom = <Button disabled={!canCreateVc}
					style={{marginRight: '.05rem', marginLeft: '0rem'}}
					onClick={() => {
						dispatch(cxAccountActions.deleteRunningBusinessVc(deleteYear, deleteMonth, deleteVcId))
					}}
				>
					反审核
				</Button>
			} else {
				pzCom = <Button disabled={item.get('beCertificate') || !canCreateVc}
					onClick={() => {
						dispatch(cxAccountActions.insertRunningBusinessVc(uuid))
					}}
				>
					审核
				</Button>
			}
		}

		const onClickEvent = () => {
			if (isEdit) {
				dispatch(cxAccountActions.selectLs(selectedIndex, idx))
			} else {
				sessionStorage.setItem("ylPage", "cxls")
				dispatch(yllsActions.getYllsSingleAccount(history, selectedIndex, uuid, idx, true))
			}

		}

		const cardAbstract = item.get('cardAbstract') ? item.get('cardAbstract') : ''
		const runningAbstract = `${item.get('runningAbstract')}${cardAbstract}`

		return (
			<div className="vc">
				<div onClick={() => onClickEvent()}>
					<div className='item-title-top' >
						<div className='item-date cxls-gray'>{item.get('runningDate').replace(/-/g, '/')}</div>
						<div className='item-flowNumber'>
							<Checkbox
								checked={item.get('selected') ? item.get('selected') : false}
								style={{'paddingRight': '10px', 'display': isEdit ? 'inline-block' : 'none'}}
							/>
							{item.get('flowNumber')}
						</div>
					</div>
					<div className='item-content'>
						<div>{item.get('categoryName')}</div>
						<div><Amount showZero>{Math.abs(item.get('amount'))}</Amount></div>
					</div>
					<div className='overElli cxls-gray'>摘要：{runningAbstract}</div>
					<div className='item-content cxls-gray'>
						<span>{Common.runningType[item.get('runningType')]}</span>
						<span>制单人：{item.get('createName')}</span>
					</div>
				</div>

				<div className='item-bottom'>
					<div>
						{ pzCom }
					</div>
					<div>
						{getCarrayOver(dispatch, item, editPermission)}
						{item.get('childList').map(v => {//子流水的状态
							return getCarrayOver(dispatch, v, editPermission)
						})}
						{toJz(dispatch, item, editPermission)}
					</div>
				</div>
			</div>
		)
	}
}
