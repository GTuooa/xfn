import React, { PropTypes } from 'react'
import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action.js'
import { Checkbox, Icon, Amount, Button }	from 'app/components'
import { formatNum, formatMoney } from 'app/utils'
import { stateFunc } from './stateButton.js'
// import { runningPreviewActions } from 'app/redux/Edit/RunningPreview'
import { runningStateType } from 'app/constants/editRunning.js'

export default
class Item extends React.Component {

	render() {
		const {
			item,
			dispatch,
			history,
			selectedIndex,
			idx,
			isEdit,
			editPermission,
			intelligentStatus,
			uuidList
		} = this.props

		const uuid = item.get('oriUuid')
		const beCertificate = item.get('beCertificate')//是否已审核

		// const onClickEvent = () => {
		// 	if (isEdit) {
		// 		dispatch(searchRunningActions.selectLs(selectedIndex, idx))
		// 	} else {
		// 		dispatch(runningPreviewActions.getRunningPreviewBusinessFetch(item.get('oriUuid'), item, uuidList, 'search', history))
		// 	}
		//
		// }

		const cardAbstract = item.get('jrJvCardAbstract') ? item.get('jrJvCardAbstract') : ''
		const oriAbstract = `${item.get('oriAbstract')}${cardAbstract}`
		const showChild = item.get('showChild')//beOpen
		const oriState = item.get('oriState')
		let runningState = oriState
		if (runningState=='STATE_CHYE') {
			runningState = item.get('jrState')
		}
		const oriStateName = runningStateType[runningState] ? runningStateType[runningState] : ''

		return (
			<div className="vc">
				{/* <div onClick={() => onClickEvent()}> */}
				<div uuid={uuid} idx={idx} click_target={'true'}>
					<div className='item-title-top'>
						<div className='item-flowNumber'>
							<Checkbox
								checked={item.get('selected') ? item.get('selected') : false}
								style={{'paddingRight': '10px', 'display': isEdit ? 'inline-block' : 'none'}}
							/>
							{item.get('jrIndex')} 号
							<span className='pz'
								style={{display: intelligentStatus && beCertificate ? '' : 'none'}}
								onClick={(e) => {
									e.stopPropagation()
									dispatch(searchRunningActions.getVcFetch(item.getIn(['vcList', 0]), history))
								}}
							>
								凭证
							</span>
						</div>
						<div className='cxls-gray'>{item.get('oriDate').replace(/-/g, '/')}</div>
					</div>
					<div className='item-content'>
						<div className='center'>
							<span>{item.get('categoryName')}</span>
							<span className='oriState' style={{display: oriStateName ? '' : 'none'}}>{oriStateName}</span>
						</div>
					</div>
					<div className='item-content'>
						<div>{item.get('creditAmount') ? '贷：' : '借：'}{item.get('jrJvTypeName')}</div>
						<div><Amount showZero className='blod'>{item.get('creditAmount') ? item.get('creditAmount') : item.get('debitAmount')}</Amount></div>
					</div>
					<div className='item-content item-bottom'>
						<div className='overElli cxls-gray'>摘要：{oriAbstract}</div>
						<span>{stateFunc(dispatch, history, item, editPermission)}</span>
					</div>
					<div>
						{/* style={{display: showChild ? '' : 'none'}} */}
						{
							item.get('childList').map((v, i) => {
								const cardAbstract = v.get('jrJvCardAbstract') ? v.get('jrJvCardAbstract') : ''
								const oriAbstract = `${v.get('oriAbstract')}${cardAbstract}`
								const accountUuid = v.get('accountUuid')

								let isShow = showChild
								if (accountUuid && accountUuid!='ACCOUNT_SIGN') {//账户流水必显示
									isShow = true
								}
								if (!isShow) { return null }
								return (
									<div className='border-top' key={i}>
										<div className='item-content'>
											<div>{v.get('creditAmount') ? '贷：' : '借：'}{v.get('jrJvTypeName')}</div>
											<div><Amount showZero className='blod'>{v.get('creditAmount') ? v.get('creditAmount') : v.get('debitAmount')}</Amount></div>
										</div>
										<div className='item-content item-bottom'>
											<div className='overElli cxls-gray'>摘要：{oriAbstract}</div>
											<span>{stateFunc(dispatch, history, v, editPermission)}</span>
										</div>
									</div>
								)
							})
						}
					</div>
					<div className='item-content border-top user-name'
						onClick={(e)=>{
							e.stopPropagation()
							dispatch(searchRunningActions.changeCxlsData(['dataList', idx, 'showChild'], !showChild))
						}}
					>
						<span>制单人：{item.get('createUserName')}</span>
						<div className='cxls-blue'>
							{showChild ? '收起' : '展开'}
							<Icon style={item.get('showChild') ? {transform: 'rotate(180deg)'} : ''} type="arrow-down"/>
						</div>
					</div>
				</div>
				<Icon style={{display: beCertificate ? '' : 'none'}} className="title-item-icon" color="#ff943e" type="yishenhe" size="50"/>
			</div>
		)
	}
}
