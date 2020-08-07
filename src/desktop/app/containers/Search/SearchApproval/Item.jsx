import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Checkbox, Icon, Button, Tooltip } from 'antd'
import { CxpzTableItem, TableOver, Amount } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import { showAccountState, showToolTipAccountState } from 'app/containers/Search/SearchApproval/common/common.js'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import { fromJS } from 'immutable';

@immutableRenderDecorator
export default
	class Item extends React.Component {
	render() {
		console.log('Item');
		const {
			dispatch,
			className,
			line,
			item,
			openEditRunningModal,
			addCheckDetailItem,
			deleteCheckDetailItem,
			selectList,
			parent,
			editLrAccountPermission,
			uuidList,
			clearSelectList,
		} = this.props

		const detailList = item.get('detailList')
		const idList = detailList.map(v => v.get('id'))

		const selectAll = idList.every(v => selectList.indexOf(v) > -1)

		const getStatus = (type, elementList, typeName, childItem) => {
			const typeObject = {
				'shouldReturn' : '核销',
				'pay' : '核销',
				'receive' : '核销',
				'makeOut' : '开票',
				'auth' : '认证',
				'carryover' : '结转',
				'grant':'核销',
				'defray':'核销',
				'takeBack':'核销',
				'back':'核销',
		
			}
			const btnName = {
				'shouldReturn' : '退款',
				'pay' : '付款',
				'receive' : '收款',
				'makeOut' : '开票',
				'auth' : '认证',
				'carryover' : '结转',
				'grant':`${childItem.get('jrAmount') < 0 ? '收款' : '发放' }`,
				'defray':`${childItem.get('notHandleAmount') < 0 ? '收款' : '缴纳' }`,
				'takeBack':'收回',
				'back':'退还',
			}
			
			switch (type) {
				case '1':
					elementList.push(
						<div key={`a1${typeName}`} className='search-approval-table-line'>
							<span className="search-approval-table-frist-child">{`未${typeObject[typeName]}`}</span>
							<Button
								type='ghost'
								// className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									switch(typeName){
										case 'shouldReturn' :
											dispatch(searchApprovalActions.getBusinessManagerModal(item,childItem,() => {parent.setState({
												manageModal:true
											})},`${childItem.get('oriState') === 'STATE_YYZC_TG'?'debit':'credit'}`, 'shouldReturn'))
											break
										case 'pay' :
											dispatch(searchApprovalActions.getBusinessManagerModal(item,childItem,() => {parent.setState({
												manageModal:true
											})},'credit', 'pay'))
											break
										case 'receive' :
											dispatch(searchApprovalActions.getBusinessManagerModal(item,childItem,() => {parent.setState({
												manageModal:true
											})},'debit', 'receive'))
											break
										case 'makeOut' :
											dispatch(searchApprovalActions.getBusinessInvioceModal(item,childItem,() => {parent.setState({
												invioceModal:true
											})}))
											break
										case 'auth' :
											dispatch(searchApprovalActions.getBusinessDefineModal(item,childItem,() => {parent.setState({
												defineModal:true
											})}))
											break
										case 'carryover' :
											dispatch(searchApprovalActions.getBusinessJzsyModal(item,childItem,() => {parent.setState({
												jzsyModal:true
											})}))
											break
										case 'grant' :
											dispatch(searchApprovalActions.getBusinessGrantModal(item,childItem,() => {parent.setState({
												grantModal:true
											})}))
											break
										case 'defray' :
											dispatch(searchApprovalActions.getBusinessDefrayModal(item,childItem,() => {parent.setState({
												defrayModal:true
											})}))
											break
										case 'takeBack' :
											dispatch(searchApprovalActions.getBusinessTakeBackModal(item,childItem,() => {parent.setState({
												takeBackModal:true
											})}, 'credit', 'pay'))
											break
										case 'back' :
											dispatch(searchApprovalActions.getBusinessBackModal(item,childItem,() => {parent.setState({
												backModal:true
											})}, 'debit', 'receive'))
											break
										default :
											break
		
									}
								}}
								>
								{
									btnName[typeName]
								}
							</Button>
		
						</div>
					)
					break
				case '2':
					elementList.push(
						<div key={`a2${typeName}`} className='search-approval-table-line'>
							<span className="search-approval-table-frist-child">部分核销</span>
							<Button
								type='ghost'
								// className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									switch(typeName){
										case 'shouldReturn' :
											dispatch(searchApprovalActions.getBusinessManagerModal(item,childItem,() => {parent.setState({
												manageModal:true
											})},`${childItem.get('oriState') === 'STATE_YYZC_TG'?'debit':'credit'}`, 'shouldReturn'))
											break
										case 'pay' :
											dispatch(searchApprovalActions.getBusinessManagerModal(item,childItem,() => {parent.setState({
												manageModal:true
											})},'credit', 'pay'))
											break
										case 'receive' :
											dispatch(searchApprovalActions.getBusinessManagerModal(item,childItem,() => {parent.setState({
												manageModal:true
											})},'debit', 'receive'))
											break
										case 'makeOut' :
											dispatch(searchApprovalActions.getBusinessInvioceModal(item,childItem,() => {parent.setState({
												invioceModal:true
											})}))
											break
										case 'auth' :
											dispatch(searchApprovalActions.getBusinessDefineModal(item,childItem,() => {parent.setState({
												defineModal:true
											})}))
											break
										case 'carryover' :
											dispatch(searchApprovalActions.getBusinessJzsyModal(item,childItem,() => {parent.setState({
												jzsyModal:true
											})}))
											break
										case 'grant' :
											dispatch(searchApprovalActions.getBusinessGrantModal(item,childItem,() => {parent.setState({
												grantModal:true
											})}))
											break
										case 'defray' :
											dispatch(searchApprovalActions.getBusinessDefrayModal(item,childItem,() => {parent.setState({
												defrayModal:true
											})}))
											break
										case 'takeBack' :
											dispatch(searchApprovalActions.getBusinessTakeBackModal(item,childItem,() => {parent.setState({
												takeBackModal:true
											})}, 'credit', 'pay'))
											break
										case 'back' :
											dispatch(searchApprovalActions.getBusinessBackModal(item,childItem,() => {parent.setState({
												backModal:true
											})}, 'debit', 'receive'))
											break
									default :
											break
		
									}
								}}
								>
								{
									btnName[typeName]
								}
							</Button>
						</div>
		
					)
					break
				case '3':
					elementList.push(
						<div key={`a3${typeName}`} className='search-approval-table-line'>
							<span className="search-approval-table-frist-child">
								{
									typeName === 'shouldReturn' || typeName === 'pay' || typeName === 'receive' ? '全部核销' : `已${typeObject[typeName]}`
								}
							</span>
						</div>
					)
					break
				case '0':
					break
			}
		}
		
		const getCarrayOver = (childItem) => {
		
			let receive = '0'
			let pay = '0'
			let shouldReturn = '0'
			let makeOut = '0'
			let auth = '0'
			let carryover = '0'
			let grant = '0'
			let defray = '0'
			let takeBack = '0'
			let back = '0'
			let elementList = []
			let typeJson = {
				'JR_HANDLE_NO': '1',
				'JR_HANDLE_HALF': '2',
				'JR_HANDLE_ALL': '3',
			}
		
			const jrState = childItem.get('jrState')
			const jrCategoryType = childItem.get('jrCategoryType')
			// 判断各个类别该是什么状态
			if (jrCategoryType === 'LB_YYSR' || jrCategoryType === 'LB_YYWSR') {

				if (childItem.get('detailType') === '预收账款') {
					shouldReturn = typeJson[jrState]
				} else {
					if (childItem.get('jrAmount') > 0) {
						receive = typeJson[jrState]
					} else if (childItem.get('jrAmount') < 0) {
						shouldReturn = typeJson[jrState]
					}
				}
			}
			if (jrCategoryType === 'LB_YYZC' || jrCategoryType === 'LB_YYWZC' || jrCategoryType === 'LB_FYZC') {

				if (childItem.get('detailType') === '预付账款') {
					shouldReturn = typeJson[jrState]
				} else { 
					if (childItem.get('jrAmount') > 0) {
						pay = typeJson[jrState]
					} else if (childItem.get('jrAmount') < 0) {
						shouldReturn = typeJson[jrState]
					}
				}
			}
			if (jrCategoryType === 'LB_XCZC') {
				grant = typeJson[jrState]
			}

			if (jrCategoryType === 'LB_ZSKX') {
				back = typeJson[jrState]
			}
			if (jrCategoryType === 'LB_ZFKX') {
				takeBack = typeJson[jrState]
			}
			
			let statusArr = [
				{key: 'receive',value: receive},
				{key: 'pay',value: pay},
				{key: 'shouldReturn',value: shouldReturn},
				{key: 'makeOut',value: makeOut},
				{key: 'auth',value: auth},
				{key: 'carryover',value: carryover},
				{key: 'grant',value: grant},
				{key: 'defray',value: defray},
				{key: 'takeBack',value: takeBack},
				{key: 'back',value: back}
			]
		
			statusArr.forEach((arrItem) =>{
				getStatus(arrItem.value, elementList, arrItem.key, childItem)
			})
		
			return (
				{elementList}
			)
		}

		return (
			<CxpzTableItem className={className} line={line}>
				<li onClick={() => {
					if (selectAll) {
						deleteCheckDetailItem(idList.toJS())
					} else {
						addCheckDetailItem(idList.toJS())
					}
				}}>
					<Checkbox checked={selectAll} />
				</li>
				<TableOver textAlign="left">
					{item.get('createTime').substr(0, 10)}
				</TableOver>
				<TableOver textAlign="left">
					{item.get('finishTime').substr(0, 10)}
				</TableOver>
				<li>
					<span className="table-item-line-mutil-line">
						<Tooltip
							placement="top"
							title={(
								<div className="table-item-line-tooltip">
									<div>{item.get('processTitle')}</div>
									<div>{`(单号:${item.get('processBusinessCode')})`}
									</div>
								</div>)}
						>
							<p className="table-item-line-click" onClick={() => {
								thirdParty.openSlidePanel(`https://aflow.dingtalk.com/dingtalk/pc/query/pchomepage.htm?corpid=${sessionStorage.getItem('corpId')}#/approval?procInstId=${item.get('processInstanceId')}`, '查看审批')
							}}>
								{item.get('processTitle')}
							</p>
						</Tooltip>
					</span>
				</li>
				<li>
					{detailList.map((v, i) => <p className="table-item-line" key={i} onClick={() => {
						if (selectList.indexOf(v.get('id')) > -1) {
							deleteCheckDetailItem([v.get('id')])
						} else {
							addCheckDetailItem([v.get('id')])
						}
					}}><Checkbox checked={selectList.indexOf(v.get('id')) > -1} /></p>)}
				</li>
				<li>
					{detailList.map((v, i) => {
						return (
							<p className="table-item-line table-item-line-click" key={i}
								onClick={() => {
									dispatch(searchApprovalActions.getApprovalProcessDetailInfo(v.get('id'), () => openEditRunningModal()))
								}}
							>
								{v.get('detailType')}
							</p>
						)
					})}
				</li>
				<li>
					{detailList.map((v, i) => <p className="table-item-line" key={i}>{v.get('jrDate').substr(0, 10)}</p>)}
				</li>
				<li>
					{detailList.map((v, i) => <p className="table-item-line-amonut" key={i}><Amount className="table-item-line-amonut" showZero={true}>{v.get('jrAmount')}</Amount></p>)}
				</li>
				<li>
					{detailList.map((v, i) => 
						<p className="table-item-line search-approval-table-line" key={i}>
							<span className="search-approval-table-frist-child">{showAccountState[v.get('dealState')] ? showAccountState[v.get('dealState')] : ''}</span>
							{
								v.get('dealState') ? <span className={"table-item-line-click"} onClick={e => {
									if (editLrAccountPermission) {
										dispatch(searchApprovalActions.cancelApprovalProcessDetailInfo([v.get('id')], () => clearSelectList()))
									}
								}}>
									<Tooltip
										placement="top"
										title={`反${showToolTipAccountState[v.get('dealState')]}`}
									>
										<Icon type="rollback" style={{color: editLrAccountPermission ? '#333' : '#ccc'}}/>
									</Tooltip>
								</span> : ''
							}
						</p>
					)}
				</li>
				<li>
					{detailList.map((v, i) =>
						<p className="table-item-line search-approval-table-line" key={i}>
							{
								v.get('jrIndex') ? <span className="search-approval-table-frist-child">{v.get('oriDate')}</span> : null
							}
							{
								v.get('jrIndex') ? <span className="table-item-line-click" onClick={e => {
									e.stopPropagation() // 顶层绑定了关闭预览窗口，所以阻止冒泡
									dispatch(previewRunningActions.getPreviewRunningBusinessFetch(fromJS({ oriUuid: v.get('jrOriUuid') }), 'approval', uuidList, () => {
										dispatch(searchApprovalActions.getApprovalProcessList({refresh: true}))
									}))
								}}>{`${v.get('jrIndex')} 号`}</span> : ''
							}
						</p>
					)}
				</li>
				<li>
					{
						detailList.map((v, i) => <p className="table-item-line" key={i}>
							{getCarrayOver(v).elementList}
						</p>)
					}
				</li>
				<li>
					{detailList.map((v, i) => <p className="table-item-line" key={i}>{v.get('operateUserName')}</p>)}
				</li>
			</CxpzTableItem>
		)
	}
}
