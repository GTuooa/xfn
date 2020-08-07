import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Checkbox, Button, Tooltip, Dropdown, Menu }	from 'antd'
import { CxpzTableItem, TableOver, Icon } from 'app/components'
import { XfnIcon } from 'app/components'
import { formatNum, formatMoney, judgePermission } from 'app/utils'

import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as allActions from 'app/redux/Home/All/all.action.js'
import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action'
import * as middleActions from 'app/redux/Home/middle.action.js'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import * as printActions from 'app/redux/Edit/FilePrint/filePrint.actions.js'

@immutableRenderDecorator
export default
class CardItem extends React.Component {

	state = {
	}
	// componentWillReceiveProps(nextprops) {
	// 	if (this.props.allItemShow !== nextprops.allItemShow ) {
	// 		this.setState({show: nextprops.allItemShow})
	// 	}
	// }

	render() {
		const {
			className,
			item,
			line,
			dispatch,
			selectList,
			issuedate,
			flags,
			editLrAccountPermission,
			reviewLrAccountPermission,
			intelligentStatus,
			uuidList,
			inputValue,
			parent,
			showChildList,
			QUERY_VC
		} = this.props

		const isClose = flags.get('isClose')
		const isAccount = flags.get('isAccount')
		// 计算已处理的金额
		const oriDate = item.get('oriDate')

		let deleteVcId = [], deleteYear, deleteMonth
		item.get('vcList') && item.get('vcList').map((u, i) => {
			deleteVcId.push({vcIndex: u.get('vcIndex')})
			deleteYear = u.get('year')
			deleteMonth = u.get('month')
		})

		const getStatus = (type,elementList,typeName,childItem) => {
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
				'grant':`${childItem.get('notHandleAmount') < 0 ? '收款' : '发放' }`,
				'defray':`${childItem.get('notHandleAmount') < 0 ? '收款' : '缴纳' }`,
				'takeBack':'收回',
				'back':'退还',
			}

			switch (type) {
				case '1':
					elementList.push(
						<div key={`a1${typeName}`} className='cxls-item-btn-status'>
							<span>{`未${typeObject[typeName]}`}</span>
							<Button
								type='ghost'
								// className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									switch(typeName){
										case 'shouldReturn' :
											dispatch(searchRunningActions.getBusinessManagerModal(item,childItem,() => {parent.setState({
												manageModal:true
											})},`${childItem.get('oriState') === 'STATE_YYZC_TG'?'debit':'credit'}`, 'shouldReturn'))
											break
										case 'pay' :
											dispatch(searchRunningActions.getBusinessManagerModal(item,childItem,() => {parent.setState({
												manageModal:true
											})},'credit', 'pay'))
											break
										case 'receive' :
											dispatch(searchRunningActions.getBusinessManagerModal(item,childItem,() => {parent.setState({
												manageModal:true
											})},'debit', 'receive'))
											break
										case 'makeOut' :
											dispatch(searchRunningActions.getBusinessInvioceModal(item,childItem,(callBackAmount) => {parent.setState({
												invioceModal:true,
												showSingleJsAmount: callBackAmount
											})}))
											break
										case 'auth' :
											dispatch(searchRunningActions.getBusinessDefineModal(item,childItem,() => {parent.setState({
												defineModal:true
											})}))
											break
										case 'carryover' :
											// if (categoryType === 'LB_CQZC') {
												dispatch(searchRunningActions.getBusinessJzsyModal(item,childItem,() => {parent.setState({
													jzsyModal:true
												})}))
											// } else {
											// 	dispatch(searchRunningActions.getBusinessCarryoverModal(item,() => {this.setState({
											// 		carryoverModal:true
											// 	})}))
											// }
											break
										case 'grant' :
											dispatch(searchRunningActions.getBusinessGrantModal(item,childItem,() => {parent.setState({
												grantModal:true
											})}))
											break
										case 'defray' :
											dispatch(searchRunningActions.getBusinessDefrayModal(item,childItem,() => {parent.setState({
												defrayModal:true
											})}))
											break
										case 'takeBack' :
											dispatch(searchRunningActions.getBusinessTakeBackModal(item,childItem,() => {parent.setState({
												takeBackModal:true
											})}))
											break
										case 'back' :
											dispatch(searchRunningActions.getBusinessBackModal(item,childItem,() => {parent.setState({
												backModal:true
											})}))
											break
										default :
											break

									}
									// dispatch(searchRunningActions.getBusinessManagerModal(item,() => {this.setState({
									// 	manageModal:true
									// })},'credit'))
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
						<div key={`a2${typeName}`} className='cxls-item-btn-status'>
							<span>部分核销</span>
							<Button
								type='ghost'
								// className='handle-btn'
								disabled={!editLrAccountPermission}
								onClick={() => {
									switch(typeName){
										case 'shouldReturn' :
											dispatch(searchRunningActions.getBusinessManagerModal(item,childItem,() => {parent.setState({
												manageModal:true
											})},`${childItem.get('oriState') === 'STATE_YYZC_TG'?'debit':'credit'}`, 'shouldReturn'))
											break
										case 'pay' :
											dispatch(searchRunningActions.getBusinessManagerModal(item,childItem,() => {parent.setState({
												manageModal:true
											})},'credit', 'pay'))
											break
										case 'receive' :
											dispatch(searchRunningActions.getBusinessManagerModal(item,childItem,() => {parent.setState({
												manageModal:true
											})},'debit', 'receive'))
											break
										case 'makeOut' :
											dispatch(searchRunningActions.getBusinessInvioceModal(item,childItem,() => {parent.setState({
												invioceModal:true
											})}))
											break
										case 'auth' :
											dispatch(searchRunningActions.getBusinessDefineModal(item,childItem,() => {parent.setState({
												defineModal:true
											})}))
											break
										case 'carryover' :
											dispatch(searchRunningActions.getBusinessJzsyModal(item,childItem,() => {parent.setState({
												jzsyModal:true
											})}))
											// if (categoryType === 'LB_CQZC') {
											// } else {
											// 	dispatch(searchRunningActions.getBusinessCarryoverModal(item,() => {this.setState({
											// 		carryoverModal:true
											// 	})}))
											// }
											break
										case 'grant' :
											dispatch(searchRunningActions.getBusinessGrantModal(item,childItem,() => {parent.setState({
												grantModal:true
											})}))
											break
										case 'defray' :
											dispatch(searchRunningActions.getBusinessDefrayModal(item,childItem,() => {parent.setState({
												defrayModal:true
											})}))
											break
										case 'takeBack' :
											dispatch(searchRunningActions.getBusinessTakeBackModal(item,childItem,() => {parent.setState({
												takeBackModal:true
											})}))
											break
										case 'back' :
											dispatch(searchRunningActions.getBusinessBackModal(item,childItem,() => {parent.setState({
												backModal:true
											})}))
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
						<div key={`a3${typeName}`} className='cxls-item-btn-status'>
							<span>
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

		const getCarrayOver = (item) => {
			const receive = item.get('receive')
			const pay = item.get('pay')
			const shouldReturn = item.get('shouldReturn')
			const makeOut = item.get('makeOut')
			const auth = item.get('auth')
			const carryover = item.get('carryover')
			const grant = item.get('grant')
			const defray = item.get('defray')
			const takeBack = item.get('takeBack')
			const back = item.get('back')
			let elementList = []
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
				getStatus(arrItem.value,elementList,arrItem.key,item)
			})

			return (
					{elementList}
			)
		}

		const checked = selectList ? selectList.indexOf(item.get('oriUuid')) > -1 : false
		const childList = item.get('childList')
		const beOpen = item.get('beOpen')
		const modelNo = item.get('modelNo') || ''
		const isPs = modelNo.charAt(0) === 'X' || modelNo === 'Y56#0-00-0' || modelNo === 'Y57#0-00-0'
		// let itemListHeight = 34
		// if (beOpen) {
		// 	itemListHeight = item.get('childList').filter(v => v.get('typeMergeName') === '货币资金').size * 34 + 34
		// }
		const showChild = showChildList.indexOf(item.get('oriUuid')) > -1

		// const needShowChild = beOpen ? true : showChild
		const needShowChild = beOpen || showChild

		return (
			<CxpzTableItem
				// className={showChild ? className : `${className} search-running-table-item-hide`}
				className={className}
				line={line+1}
				// style={beOpen && !showChild ?{height:itemListHeight}:{}}

				>
				<li
					onClick={(e) => {
						e.stopPropagation()
						dispatch(searchRunningActions.accountItemCheckboxCheck(checked, item))
					}}
				>
					<Checkbox checked={checked}/>
				</li>
				<TableOver>{oriDate}</TableOver>
				<TableOver
					textAlign='left'
				>
					<span
						className='account-flowNumber'
					>
						<Dropdown
							placement="topCenter"
							trigger={['contextMenu']}
							overlay={(
								<Menu className='cxls-menu-content'>
									<Menu.Item
										key='del'
										disabled={!editLrAccountPermission || isClose || item.get('beCertificate')}
										onClick={()=> {
											dispatch(searchRunningActions.deleteAccountItemCardAndRunning(true,inputValue,[item.get('oriUuid')], 'QUERY_JR-DELETE_JR'))
										}}
									>
										<Tooltip placement="right" title={!editLrAccountPermission ? '权限不足' : isClose?'结账后不允许该操作':''}>
											<span className="setting-common-ant-dropdown-menu-item">删除</span>
										</Tooltip>
									</Menu.Item>
									<Menu.Divider />
									<Menu.Item
										key='sh'
										disabled={!reviewLrAccountPermission|| isClose}
										onClick={() => {
											item.get('beCertificate')?
											dispatch(searchRunningActions.deleteVcItemFetch('searchRunning', deleteYear, deleteMonth, deleteVcId, issuedate,inputValue)) :
											dispatch(searchRunningActions.runningInsertOrModifyVc('searchRunning', fromJS([{oriUuid:item.get('oriUuid'),jrNumber:item.get('jrIndex')}]),'insert', issuedate,inputValue))
										}}
									>
										<Tooltip placement="right" title={!reviewLrAccountPermission?'权限不足':isClose?'结账后不允许该操作':''}>
											<span className="setting-common-ant-dropdown-menu-item">{!item.get('beCertificate')?'审核':'反审核'}</span>
										</Tooltip>
									</Menu.Item>
									<Menu.Item key='insert'
										disabled={!editLrAccountPermission || isPs}
										onClick={() => {
											dispatch(middleActions.getEditSettingInfo())
											dispatch(middleActions.initEditRunning())
											dispatch(searchRunningActions.getSearchRunningItem(item, 'insert', fromJS([]),'','',true))
										}}
									>
										<Tooltip title={isPs?'有关联流水，不可复制':''}>
											<span className="setting-common-ant-dropdown-menu-item">复制</span>
										</Tooltip>
									</Menu.Item>
									<Menu.Item key='edit'
										disabled={!editLrAccountPermission || item.get('beCertificate') && (item.get('oriState') !== 'STATE_SYJZ_JZSR' && item.get('oriState') !== 'STATE_SYJZ_JZCBFY' && item.get('oriState') !== 'STATE_SYJZ_JZBNLR')  }
										onClick={() => {
											dispatch(middleActions.getEditSettingInfo())
											dispatch(middleActions.initEditRunning())
											dispatch(searchRunningActions.getSearchRunningItem(item, 'modify', uuidList))
										}}
									>
										<Tooltip placement="right" title={!editLrAccountPermission ? '权限不足' :''}>
											<span className="setting-common-ant-dropdown-menu-item">修改</span>
										</Tooltip>
									</Menu.Item>
									<Menu.Item key='insert'
										disabled={!editLrAccountPermission}
										onClick={() => {
											dispatch(allActions.handlePrintModalVisible(true))
											sessionStorage.setItem('fromPos', 'searchRunningPreview')
											dispatch(printActions.setPrintString('fromPage','cxls'))
											dispatch(printActions.setPrintString('oriUuid',[item.get('oriUuid')]))
										}}
									>
										<span className="setting-common-ant-dropdown-menu-item">打印</span>
									</Menu.Item>
								</Menu>
							)}
						>
							<span className="ant-dropdown-link" onClick={e => {
								e.stopPropagation() // 顶层绑定了关闭预览窗口，所以阻止冒泡
								// flowNumberOnClick(item)
								// dispatch(middleActions.getEditSettingInfo())

								dispatch(previewRunningActions.getPreviewRunningBusinessFetch(item, 'search_cxls', uuidList,() => {
									dispatch(searchRunningActions.afterModifyAccountAllList(true,'',pageSize))
								}))
							}}>
								{`${item.get('jrIndex')} 号`}
							</span>
						</Dropdown>
					</span>
					{
						childList.size ?
							<Icon
								type={showChild ? "up" : "down"}
								onClick={(e) => {
									e.stopPropagation()
									dispatch(searchRunningActions.changeSearchRunningChildItemShow(showChild,item.get('oriUuid')))
								}}
								className='account-show'
								style={{margin:'3px 5px 0 0',float: 'right'}}
							/>
						:
						null
					}
					{
						needShowChild && item.get('vcList') && item.get('vcList').size  && intelligentStatus && reviewLrAccountPermission ?
						item.get('vcList').map((u, i) => (
						<div className='searchrunning-pz-btn' key={i} style={{display: judgePermission(QUERY_VC).display ? '' : 'none'}}>
							<XfnIcon
								type={'running-pz-show'}
								className='pz-btn-icon'
								key={i}
								onClick={() => {
									// if(!reviewLrAccountPermission){
									if(!judgePermission(QUERY_VC).disabled){
										return
									}else{
										let vcindexList = item.get('vcList').toJS().map(v => `${v.year}-${v.month}-01_${v.vcIndex}`)
										dispatch(lrpzActions.getPzVcFetch([u.get('year'), u.get('month')].join('-'), u.get('vcIndex'), i, vcindexList))
										dispatch(allActions.showPzBomb(true,'Cxpz'))
									}
									}}
							/>
							{
								// <Button
								// 	type="ghost"
								// 	disabled={!reviewLrAccountPermission || isClose}
								// 	onClick={() => {
								// 		let vcindexList = item.get('vcList').toJS().map(v => `${v.year}-${v.month}-01_${v.vcIndex}`)
								// 		dispatch(lrpzActions.getPzVcFetch([u.get('year'), u.get('month')].join('-'), u.get('vcIndex'), i, vcindexList))
								// 		dispatch(allActions.showPzBomb(true,'Cxpz'))
								// 		}}
								// 	>
								// 		凭证
								// </Button>
							}
						</div>)) : null
					}


				</TableOver>
				<li>
					<p className="table-item-line">
						<Tooltip placement="topLeft" title={item.get('categoryMergeName')}>
							{item.get('categoryName')}
						</Tooltip>
					</p>
					{
						needShowChild ? childList.map((childItem, index)=> {

							if (!showChild && childItem.get('typeMergeName') !== '货币资金') {
								return null
							}

							return (
								<p className="table-item-line" key={index}>
									<Tooltip
										placement="topLeft"
										title={childItem.get('categoryMergeName')}
									>
										{childItem.get('categoryName')}
									</Tooltip>
								</p>
							)
						})
						: null
					}
				</li>
				<li>
					<p className="table-item-line">
						<Tooltip
							placement="topLeft"
							title={item.get('oriAbstract')+(item.get('jrJvCardAbstract')?item.get('jrJvCardAbstract'):'')}
						>
							{item.get('oriAbstract')+(item.get('jrJvCardAbstract')?item.get('jrJvCardAbstract'):'')}
						</Tooltip>
					</p>
					{
						needShowChild ? childList.map((childItem, index)=> {

							if (!showChild && childItem.get('typeMergeName') !== '货币资金') {
								return null
							}

							return (
								<p className="table-item-line" key={index}>
									<Tooltip
										placement="topLeft"
										title={childItem.get('oriAbstract')+(childItem.get('jrJvCardAbstract')?childItem.get('jrJvCardAbstract'):'')}
									>
										{childItem.get('oriAbstract')+(childItem.get('jrJvCardAbstract')?childItem.get('jrJvCardAbstract'):'')}
									</Tooltip>
								</p>
							)
						})
						: null
					}
				</li>
				<li>
					<p className="table-item-line">
						<Tooltip placement="topLeft" title={item.get('typeMergeName')}>
							{item.get('jrJvTypeName')}
						</Tooltip>
					</p>
					{
						needShowChild ? childList.map((childItem, index)=> {

							if (!showChild && childItem.get('typeMergeName') !== '货币资金') {
								return null
							}

							return (
								<p className="table-item-line" key={index}>
									<Tooltip placement="topLeft" title={childItem.get('typeMergeName')}>
										{childItem.get('jrJvTypeName')}
									</Tooltip>
								</p>
							)
						})
						: null
					}
				</li>
				<li>
					<p className="table-item-line-amonut">
						{item.get('debitAmount')!== null ?formatMoney(item.get('debitAmount')):''}
					</p>
					{
						needShowChild ? childList.map((childItem, index)=> {

							if (!showChild && childItem.get('typeMergeName') !== '货币资金') {
								return null
							}

							return (
								<p className="table-item-line-amonut" key={index}>
									{childItem.get('debitAmount')!== null?formatMoney(childItem.get('debitAmount')):''}
								</p>
							)
						})
						: null
					}
				</li>
				<li>
					<p className="table-item-line-amonut">
						{item.get('creditAmount')!== null ?
						item.get('creditAmount')< 0?
						`-${formatNum(Math.abs(item.get('creditAmount')).toFixed(2))}`:
						formatMoney(item.get('creditAmount')):
						''}
					</p>
					{
						needShowChild ? childList.map((childItem, index)=> {

							if (!showChild && childItem.get('typeMergeName') !== '货币资金') {
								return null
							}

							return (
								<p className="table-item-line-amonut" key={index}>
									{childItem.get('creditAmount')!== null?childItem.get('creditAmount')< 0?`-${formatMoney(Math.abs(childItem.get('creditAmount')).toFixed(2))}`:formatMoney(childItem.get('creditAmount')):''}
								</p>
							)
						})
						: null
					}
				</li>
				{
					isAccount?
					<li>
						<p className="table-item-line-amonut">
							{item.get('endAmount')!== null?item.get('endAmount')< 0?`-${formatNum(Math.abs(item.get('endAmount')).toFixed(2))}`:formatMoney(item.get('endAmount')):''}
						</p>
						{
							needShowChild ? childList.map((childItem, index) => {

								if (!showChild && childItem.get('typeMergeName') !== '货币资金') {
									return null
								}

								return (
									<p className="table-item-line-amonut" key={index}>
										{
											childItem.get('endAmount')<0?
											`-${formatNum(Math.abs(childItem.get('endAmount')).toFixed(2))}`
											:
											childItem.get('endAmount')>0?
												formatNum(Number(childItem.get('endAmount')).toFixed(2))
												:''
										}
									</p>
								)
							})
							: null
						}
					</li>
					:''
				}
				<li>
					<p className="table-item-line">
						{getCarrayOver(item).elementList}
					</p>
					{
						needShowChild ? childList.map((childItem, index) => {

							if (!showChild && childItem.get('typeMergeName') !== '货币资金') {
								return null
							}

							return (
								<p className="table-item-line" key={index}>
									{getCarrayOver(childItem).elementList}
								</p>
							)
						})
						: null
					}
				</li>
				<TableOver textAlign='left'>
					{item.get('createUserName')}
				</TableOver>
				<li>
					{
						item.get('vcList') && item.get('vcList').size ? (
						(intelligentStatus ?
						<span style={{width:'100%'}}>
							<span className='searchrunning-reviewer'>{item.get('auditUserName')}</span>
							{
								needShowChild ? item.get('vcList').map((u, i) => (
									<Button
										key={i}
										type="ghost"
										disabled={!reviewLrAccountPermission || isClose}
										onClick={() => {
											if (reviewLrAccountPermission && !isClose) {
												dispatch(searchRunningActions.deleteVcItemFetch('searchRunning', u.get('year'), u.get('month'), [{vcIndex: u.get('vcIndex')}], issuedate,inputValue))
											}
											}}
										>
											反审核
									</Button>
								)) : null
							}
						</span> :
						<span>
							<Button
								type="ghost"
								disabled={!reviewLrAccountPermission || isClose}
								onClick={() => {
									if (reviewLrAccountPermission && !isClose) {
										dispatch(searchRunningActions.deleteVcItemFetch('searchRunning', deleteYear, deleteMonth, deleteVcId, issuedate,inputValue))
									}
									}}
								>
									反审核
							</Button>
						</span> ))
						:
						<span>
							<Button
								type="ghost"
								disabled={item.get('beCertificate') || !reviewLrAccountPermission}
								onClick={() => dispatch(searchRunningActions.runningInsertOrModifyVc('searchRunning', fromJS([{oriUuid:item.get('oriUuid'),jrNumber:item.get('jrIndex'),currentYear: oriDate.substr(0,4),currentMonth: oriDate.substr(5,2) }]),'insert', issuedate,inputValue))}
								>
								审核
							</Button>
						</span>
					}
				</li>
			</CxpzTableItem>
		)
	}
}
