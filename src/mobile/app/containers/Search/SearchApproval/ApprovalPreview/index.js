import React, { PropTypes } from 'react'
import { Map, toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../style.less'

import * as thirdParty from 'app/thirdParty'
import { Container, Row, ScrollView, Icon, ButtonGroup, Button, Amount } from 'app/components'
import { receiptList, hideCategoryCanSelect, getCategorynameByType, systemProJectCodeCommon } from 'app/containers/Config/Approval/components/common.js'
import { showToolTipAccountState } from 'app/containers/Search/SearchApproval/common/common.js'
import { formatMoney } from 'app/utils'

import CalculateApproval from './CalculateApproval'
import Invoice from './Invoice'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@connect(state => state)
export default
	class ApprovalPreview extends React.Component {

	componentDidMount() {
		thirdParty.setTitle({ title: '预览明细' })
		thirdParty.setIcon({
			showIcon: false
		})
		thirdParty.setRight({ show: false })

		if (sessionStorage.getItem('toCalculate') === 'TRUE') { //从核算管理跳转的需要刷新状态
			sessionStorage.removeItem('toCalculate')
			// 刷新列表
			const currentPageType = this.props.searchApprovalState.getIn(['views', 'currentPageType'])
            if (currentPageType === 'ApprovalAll') {
                this.props.dispatch(searchApprovalActions.getApprovalProcessList({ refresh: true }, null, () => {
					// 刷新预览流水
					const editRunningModalTemp = this.props.editRunningModalState.get('previewApprovalModalTemp')
					const jrId = editRunningModalTemp.get('id')
					this.props.dispatch(searchApprovalActions.getApprovalProcessDetailInfo(jrId, () => { }, ''))
				}))
            } else if (currentPageType === 'Detail') {
                this.props.dispatch(searchApprovalActions.getApprovalProcessDetailList({ refresh: true }, null, () => {
					// 刷新预览流水
					const editRunningModalTemp = this.props.editRunningModalState.get('previewApprovalModalTemp')
					const jrId = editRunningModalTemp.get('id')
					this.props.dispatch(searchApprovalActions.getApprovalProcessDetailInfo(jrId, () => { }, ''))
				}))
			}
		}
	}

	constructor() {
		super()
		this.state = {
			// isSearch: false,
		}
	}

	render() {
		const {
			allState,
			dispatch,
			homeState,
			history,
			editRunningModalState,
		} = this.props

		// const { isSearch } = this.state
		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editLrAccountPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])

		const editRunningModalTemp = editRunningModalState.get('previewApprovalModalTemp')
		const categoryData = editRunningModalState.get('categoryData')
		const jrUuidList = editRunningModalState.get('jrUuidList')
		const processTitle = editRunningModalTemp.get('processTitle')
		const jrDate = editRunningModalTemp.get('jrDate')
		const jrId = editRunningModalTemp.get('id')
		const detailType = editRunningModalTemp.get('detailType')
		const jrAmount = editRunningModalTemp.get('jrAmount')
		const categoryName = editRunningModalTemp.get('categoryName')
		const jrAbstract = editRunningModalTemp.get('jrAbstract')
		const dealState = editRunningModalTemp.get('dealState')
		const account = editRunningModalTemp.get('account')
		const inputAccount = editRunningModalTemp.get('inputAccount')
		const outputAccount = editRunningModalTemp.get('outputAccount')
		const outputDepot = editRunningModalTemp.get('outputDepot')
		const inputDepot = editRunningModalTemp.get('inputDepot')
		const jrCategoryType = editRunningModalTemp.get('jrCategoryType')
		const jrCategoryUuid = editRunningModalTemp.get('jrCategoryUuid')
		const { categoryTypeObj } = jrCategoryType ? getCategorynameByType(jrCategoryType) : { categoryTypeObj: '' }
		const beManagemented = categoryTypeObj ? categoryData.getIn([categoryTypeObj, 'beManagemented']) : false
		const beZeroInventory = categoryTypeObj ? categoryData.getIn([categoryTypeObj, 'beZeroInventory']) : false
		const contactList = editRunningModalTemp.get('contactList')
		const projectList = editRunningModalTemp.get('projectList')
		const stockList = editRunningModalTemp.get('stockList')
		const billList = editRunningModalTemp.get('billList')
		const scale = allState.getIn(['taxRate', 'scale'])
		const oriBillType = editRunningModalTemp.getIn(['billList', 0, 'billType'])

		const accountName = account ? account.get('accountName') : ''

		const datailUuidList = editRunningModalState.get('datailUuidList')
		const index = datailUuidList.findIndex(v => v.get('id') === jrId)

		let canAccount = false
		let canBookkeeping = false // 可否记帐

		const isHideCategory = hideCategoryCanSelect.indexOf(jrCategoryType) > -1
		if (isHideCategory) {
			canBookkeeping = true
		} else {
			if (jrCategoryType === 'LB_XCZC') {
				if (categoryData.get('propertyPay') === 'SX_FLF') {
					canAccount = categoryData.getIn([categoryTypeObj, 'beWelfare'])
				} else if (categoryData.get('propertyPay') === 'SX_QTXC') {
					canAccount = categoryData.getIn([categoryTypeObj, 'beAccrued'])
				}
			} else {
				canAccount = beManagemented
			}
		}

		const iconType = {
			'PROCESS_PAYING': 'yifukuan',
			'PROCESS_ACCOUNTING': 'yiguazhang',
			'PROCESS_BOOK_KEEPING': 'yijizhang',
			'PROCESS_DISUSE': 'yizuofei',
			'PROCESS_INCOME': 'yishoukuan',
		}
		const invoiceCanUse = ['LB_YYSR', 'LB_YYZC', 'LB_FYZC', 'LB_YYWSR', 'LB_YYWZC']

		let showBill = invoiceCanUse.indexOf(jrCategoryType) > -1 ? true : false
		if (scale == 'isEnable') {
            showBill = false
            if (['bill_special', 'bill_common'].includes(oriBillType)) {
                showBill = true
            }
        }

        if (scale == 'small' && ['LB_YYZC', 'LB_FYZC', 'LB_YYWZC'].includes(jrCategoryType) && ['', 'bill_other'].includes(oriBillType)) {
            showBill = false
            if (oriBillType == 'bill_special') {
                showBill = true
            }
        }

		return (
			<Container className="search-approval">
				<Row className="date-header-wrap">
					<Icon
						className="running-preview-header-left"
						type="last"
						style={{ color: index <= 0 ? '#ccc' : '' }}
						onClick={() => {
							if (index <= 0) {
								return
							}
							dispatch(searchApprovalActions.getApprovalProcessDetailInfo(datailUuidList.getIn([index - 1, 'id']), () => { }, 'switch'))
						}}
					/>
					<div className="thirdparty-date-select">
						<span className="thirdparty-date-date">{jrDate ? jrDate.replace(/-/g, '/') : ''}</span>
					</div>
					<Icon
						className="running-preview-header-right"
						type="next"
						style={{ color: index === datailUuidList.size - 1 ? '#ccc' : '' }}
						onClick={() => {
							if (index === datailUuidList.size - 1) {
								return
							}
							dispatch(searchApprovalActions.getApprovalProcessDetailInfo(datailUuidList.getIn([index + 1, 'id']), () => { }, 'switch'))
						}}
					/>
				</Row>
				<ScrollView className="content" flex='1'>
					<div className="search-approval-preview">
						{dealState ? <Icon className="search-approval-preview-dealState" style={{color: dealState === 'PROCESS_DISUSE' ? '#ccc' : '#ff8348'}} type={iconType[dealState]} /> : null}
						<div className="search-approval-preview-title-wrap" onClick={() => {
							thirdParty.openLink({
								url: `https://aflow.dingtalk.com/dingtalk/mobile/homepage.htm?dd_share=false&showmenu=true&dd_progress=false&back=native&corpid=${sessionStorage.getItem('corpId')}&swfrom=${'XFN'}#/approval?procInstId=${editRunningModalTemp.get('processInstanceId')}`
							});
						}}>
							<span className="search-approval-preview-title-text">{processTitle ? processTitle : '标题'}</span>
							<span className="search-approval-preview-title-icon"><Icon type="arrow-right" /></span>
						</div>
						<h4 className="search-approval-preview-type">
							{detailType}
						</h4>
						<ul className="search-approval-preview-detail-list">
							<li className="search-approval-preview-detail-item">
								<label className="search-approval-preview-detail-label">明细日期：</label>
								<span className="search-approval-preview-detail-text">{jrDate}</span>
							</li>
							<li className="search-approval-preview-detail-item">
								<label className="search-approval-preview-detail-label">明细金额：</label>
								<span className="search-approval-preview-detail-text"><Amount>{jrAmount}</Amount></span>
							</li>
							{
								accountName ?
								<li className="search-approval-preview-detail-item">
									<label className="search-approval-preview-detail-label">明细账户：</label>
									<span className="search-approval-preview-detail-text">{accountName}</span>
								</li>
								: null
							}
							{
								hideCategoryCanSelect.indexOf(jrCategoryType) === -1 ? 
								<li className="search-approval-preview-detail-item">
									<label className="search-approval-preview-detail-label">流水类别：</label>
									<span className="search-approval-preview-detail-text">{categoryName}</span>
								</li>
								: null
							}
							
							<li className="search-approval-preview-detail-item">
								<label className="search-approval-preview-detail-label">摘要：</label>
								<span className="search-approval-preview-detail-text">{jrAbstract}</span>
							</li>
							{
								outputAccount && outputAccount.get('accountUuid') ? 
								<li className="search-approval-preview-detail-item">
									<label className="search-approval-preview-detail-label">转出账户：</label>
									<span className="search-approval-preview-detail-text">{outputAccount.get('accountName')}</span>
								</li>
								: null
							}
							{
								inputAccount && inputAccount.get('accountUuid') ? 
								<li className="search-approval-preview-detail-item">
									<label className="search-approval-preview-detail-label">转入账户：</label>
									<span className="search-approval-preview-detail-text">{inputAccount.get('accountName')}</span>
								</li>
								: null
							}
							{
								jrCategoryType == 'LB_CHDB' && outputDepot && outputDepot.get('uuid') ? 
								<li className="search-approval-preview-detail-item">
									<label className="search-approval-preview-detail-label">调出仓库：</label>
									<span className="search-approval-preview-detail-text">{outputDepot.get('code')+''+outputDepot.get('name')}</span>
								</li>
								: null
							}
							{
								jrCategoryType == 'LB_CHDB' && inputDepot && inputDepot.get('uuid') ? 
								<li className="search-approval-preview-detail-item">
									<label className="search-approval-preview-detail-label">调入仓库：</label>
									<span className="search-approval-preview-detail-text">{inputDepot.get('code')+''+inputDepot.get('name')}</span>
								</li>
								: null
							}
							{
								contactList.size ?
									<li className="search-approval-preview-detail-item">
										<label className="search-approval-preview-detail-label">往来单位：</label>
										<div className="search-approval-preview-detail-text-wrap">
											{
												contactList.map(v => {
													return <span className="search-approval-preview-detail-text" key={v.get('code')}>{`${v.get('code')}_${v.get('name')}`}</span>
												})
											}
										</div>
									</li>
									: null
							}
							{
								projectList.size ?
									<li className="search-approval-preview-detail-item">
										<label className="search-approval-preview-detail-label">项目：</label>
										<div className="search-approval-preview-detail-text-wrap">
											{
												projectList.map(v => {
													return <span className="search-approval-preview-detail-text" key={v.get('code')}>{systemProJectCodeCommon.indexOf(v.get('code')) > -1 ? `${v.get('name')}` : `${v.get('code')}_${v.get('name')}`}</span>
												})
											}
										</div>
									</li>
									: null
							}
							{
								stockList.size ?
									<li>
										<div style={{ display: stockList.size == 1 ? '' : 'none' }}>
											<div className='search-approval-preview-detail-item'>
												<div className='search-approval-preview-detail-label'>存货：</div>
												<div className='search-approval-preview-detail-text-wrap'>
													{`${stockList.getIn([0, 'stockCode'])} ${stockList.getIn([0, 'stockName'])}`}
												</div>
											</div>
											{
												['LB_CHDB'].indexOf(jrCategoryType) === -1 ? 
												<div className='search-approval-preview-detail-item' style={{ display: stockList.getIn([0, 'depotName']) ? '' : 'none' }}>
													<div className='search-approval-preview-detail-label'>仓库：</div>
													<div className='search-approval-preview-detail-text-wrap'>
														{stockList.getIn([0, 'depotCode'])} {stockList.getIn([0, 'depotName'])}
													</div>
												</div>
												: null
											}
											
											<div style={{ display: stockList.getIn([0, 'number']) ? '' : 'none' }}>
												<div className='search-approval-preview-detail-item'>
													<div className='search-approval-preview-detail-label'>数量：</div>
													<div className='search-approval-preview-detail-text-wrap'>
														{`${formatMoney(stockList.getIn([0, 'number']), 4, '', false)} ${stockList.getIn([0, 'unitName']) ? stockList.getIn([0, 'unitName']) : ''}`}
													</div>
												</div>
												<div className='search-approval-preview-detail-item'>
													<div className='search-approval-preview-detail-label'>单价：</div>
													<div className='search-approval-preview-detail-text-wrap'>
														{`${formatMoney(stockList.getIn([0, 'unitPrice']), 4, '', false)}`}
													</div>
												</div>
											</div>
										</div>
										<div className='search-approval-preview-detail-item' style={{ display: stockList.size > 1 ? '' : 'none' }}>
											<div className='search-approval-preview-detail-label'>存货：</div>
											<div className='search-approval-preview-detail-text-wrap'>多存货</div>
										</div>
										<div className='search-approval-preview-detail-item-bgColor' style={{ display: stockList.size > 1 ? '' : 'none' }}>
											{
												stockList.map((v, i) => {
													return (
														<div key={i}>
															<div className='search-approval-preview-detail-item'>
																<div className='search-approval-preview-detail-label'><span className='spot'>• </span>存货：</div>
																<div className='search-approval-preview-detail-text-wrap'>{`${v.get('stockCode')} ${v.get('stockName')}`}</div>
															</div>
															{
																['LB_CHDB'].indexOf(jrCategoryType) === -1 ?
																<div className='search-approval-preview-detail-item' style={{ display: v.get('depotName') ? '' : 'none' }}>
																	<div className='search-approval-preview-detail-label'>仓库：</div>
																	<div className='search-approval-preview-detail-text-wrap'>
																		{v.get('depotCode')} {v.get('depotName')}
																	</div>
																</div>
																: null
															}
															
															<div style={{ display: v.get('number') ? '' : 'none' }}>
																<div className='search-approval-preview-detail-item'>
																	<div className='search-approval-preview-detail-label'>数量：</div>
																	<div className='search-approval-preview-detail-text-wrap'>
																		{`${formatMoney(v.get('number'), 4, '', false)} ${v.get('unitName') ? v.get('unitName') : ''}`}
																	</div>
																</div>
																<div className='search-approval-preview-detail-item'>
																	<div className='search-approval-preview-detail-label'>单价：</div>
																	<div className='search-approval-preview-detail-text-wrap'>
																		{`${formatMoney(v.get('unitPrice'), 4, '', false)}`}
																	</div>
																</div>
															</div>
															<div className='search-approval-preview-detail-item'>
																<div className='search-approval-preview-detail-label'>金额：</div>
																<div className='search-approval-preview-detail-text-wrap'>{formatMoney(v.get('amount'), 2, '')}</div>
															</div>
														</div>
													)
												})
											}
										</div>
									</li>
									: null
							}
							{
								showBill ?
								<Invoice
									billList={billList}
									isEnable={scale}
									categoryType={jrCategoryType}
									oriState={''}
								/>
								: null
							}
						</ul>
					</div>
					<CalculateApproval
						item={editRunningModalTemp}
						dispatch={dispatch}
						history={history}
						uuidList={jrUuidList}
						editLrAccountPermission={editLrAccountPermission}
					/>
				</ScrollView>
				<Row className="footer">
					<ButtonGroup style={{ height: 50 }} style={{ display: dealState ? 'none' : '' }}>
						<Button
							disabled={!editLrAccountPermission}
							style={{ display: jrCategoryUuid && !isHideCategory && ((receiptList.indexOf(jrCategoryType) === -1 && jrAmount > 0) || (receiptList.indexOf(jrCategoryType) > -1 && jrAmount < 0)) ? '' : 'none' }}
							onClick={() => {
								if (jrAmount > 0 && beZeroInventory) {
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beZeroInventory', beZeroInventory))
								}
								if (account && account.size && account.get('accountUuid')) {
                                    const accountList = allState.get('accountList');
                                    const accountSelectList = accountList.size ? accountList.getIn([0, 'childList']) : fromJS([]);
                                    const accountItem = accountSelectList.find(v => v.get('uuid') === account.get('accountUuid'));
                                    
                                    if (accountItem) {
                                        dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', fromJS({
                                            accountName: account.get('accountName'),
                                            accountUuid: account.get('accountUuid'),
                                        }) ))
                                    }
                                }
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('fromPage', 'modal'))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS([jrId])))
								history.push('/searchapproval/payapproval')
							}}
						>
							<Icon type="shoufukuan"></Icon><span>付款</span>
						</Button>
						<Button
							disabled={!editLrAccountPermission}
							style={{ display: jrCategoryUuid && !isHideCategory &&  ((receiptList.indexOf(jrCategoryType) === -1 && jrAmount < 0) || (receiptList.indexOf(jrCategoryType) > -1 && jrAmount > 0)) ? '' : 'none' }}
							onClick={() => {

								if (account && account.size && account.get('accountUuid')) { // 如果有账户，要把账户信息填入收款信息里
									const accountList = allState.get('accountList');
									const accountSelectList = accountList.size ? accountList.getIn([0, 'childList']) : fromJS([]);

									const accountItem = accountSelectList.find(v => v.get('uuid') === account.get('accountUuid'));

									if (accountItem) {
										const poundageObj = { needPoundage: accountItem.get('needPoundage'), poundage: accountItem.get('poundage'), poundageRate: accountItem.get('poundageRate') }
										const poundage = poundageObj.poundage
										const poundageRate = poundageObj.poundageRate
										const amount = jrAmount > 0 ? jrAmount : -jrAmount
										const sxAmount = ((Math.abs(amount || 0) * poundageRate / 1000 > poundage) && poundage > 0) ? poundage : Math.abs(amount || 0) * poundageRate / 1000

										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', fromJS({
											accountName: account.get('accountName'),
											accountUuid: account.get('accountUuid'),
											poundage: poundageObj,
											poundageAmount: (sxAmount || 0).toFixed(2),
										})))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('receiveAmount', jrAmount > 0 ? jrAmount : -jrAmount))
									}
								} else {
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', null))
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('receiveAmount', jrAmount > 0 ? jrAmount : -jrAmount))
								}

								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('fromPage', 'modal'))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS([jrId])))
								history.push('/searchapproval/receiveapproval')
							}}
						>
							<Icon type="shoufukuan"></Icon><span>收款</span>
						</Button>
						<Button
							disabled={!editLrAccountPermission}
							style={{ display: jrCategoryUuid && !isHideCategory && canAccount ? '' : 'none' }}
							onClick={() => {
								if (jrAmount > 0 && beZeroInventory) {
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beZeroInventory', beZeroInventory))
								}
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('fromPage', 'modal'))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS([jrId])))

								history.push('/searchapproval/accountapproval')
							}}
						>
							<Icon type="guazhang"></Icon><span>挂账</span>
						</Button>
						<Button
							disabled={!editLrAccountPermission}
							style={{ display: jrCategoryUuid && isHideCategory && canBookkeeping ? '' : 'none' }}
							onClick={() => {
								
								if (outputAccount && outputAccount.size && outputAccount.get('accountUuid')) { // 如果有账户，要把账户信息填入收款信息里
									const accountList = allState.get('accountList');
									const accountSelectList = accountList.size ? accountList.getIn([0, 'childList']) : fromJS([]);

									const accountItem = accountSelectList.find(v => v.get('uuid') === outputAccount.get('accountUuid'));

									if (accountItem) {
										const poundageObj = { needPoundage: accountItem.get('needPoundage'), poundage: accountItem.get('poundage'), poundageRate: accountItem.get('poundageRate') }
										const poundage = poundageObj.poundage
										const poundageRate = poundageObj.poundageRate
										const amount = jrAmount > 0 ? jrAmount : -jrAmount
										const sxAmount = ((Math.abs(amount || 0) * poundageRate / 1000 > poundage) && poundage > 0) ? poundage : Math.abs(amount || 0) * poundageRate / 1000

										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', fromJS({
											accountName: outputAccount.get('accountName'),
											accountUuid: outputAccount.get('accountUuid'),
											poundage: poundageObj,
											poundageAmount: (sxAmount || 0).toFixed(2),
										})))
										dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('receiveAmount', jrAmount > 0 ? jrAmount : -jrAmount))
									}
								} else {
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('account', null))
									dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('receiveAmount', jrAmount > 0 ? jrAmount : -jrAmount))
								}

								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('fromPage', 'modal'))
								dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('selectList', fromJS([jrId])))

								history.push('/searchapproval/bookKeepingapproval')
							}}
						>
							<Icon type="home"></Icon><span>核记</span>
						</Button>
						<Button
							disabled={!editLrAccountPermission}
							onClick={() => {
								dispatch(searchApprovalActions.disuseApprovalProcessDetailInfo([jrId], () => {
									dispatch(searchApprovalActions.getApprovalProcessDetailInfo(jrId, () => { }, 'switch'))
								}))
							}}
						>
							<Icon type="zuofei"></Icon><span>作废</span>
						</Button>
						<Button
							onClick={() => {
								dispatch(searchApprovalActions.clearSearchApprovalTemp())
								dispatch(searchApprovalActions.beforeEditApprovalProcessDetailInfo(jrId, () => {history.push('/searchapproval/editapproval')}, 'switch'))
							}}
						>
							<Icon type="adjustment"></Icon><span>调整</span>
						</Button>
					</ButtonGroup>
					<ButtonGroup style={{ height: 50 }} style={{ display: dealState ? '' : 'none' }}>
						<Button
							style={{color: showToolTipAccountState[dealState] === '挂账' && (datailUuidList.getIn([index, 'jrState']) == 'JR_HANDLE_HALF' || datailUuidList.getIn([index, 'jrState']) == 'JR_HANDLE_ALL') ? '#ccc' : "#222"}}
							disabled={!editLrAccountPermission}
							onClick={() => {
								if (showToolTipAccountState[dealState] === '挂账' && (datailUuidList.getIn([index, 'jrState']) == 'JR_HANDLE_HALF' || datailUuidList.getIn([index, 'jrState']) == 'JR_HANDLE_ALL')) {
									return thirdParty.toast.info('有关联的核销流水，无法反挂账')
								}
								dispatch(searchApprovalActions.cancelApprovalProcessDetailInfo([jrId], () => {
									dispatch(searchApprovalActions.getApprovalProcessDetailInfo(jrId, () => { }, 'switch'))
								}))
							}}
						>
							<Icon type="chexiao"></Icon><span>{`反${showToolTipAccountState[dealState]}`}</span>
						</Button>
					</ButtonGroup>
				</Row>
			</Container>
		)
	}
}