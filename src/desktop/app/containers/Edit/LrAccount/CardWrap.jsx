import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { DatePicker, Input, Select, Checkbox, Button, Modal, message, Timeline } from 'antd'
import { RunCategorySelect, AcouontAcSelect, TableAll, TableTitle, TableBody, TableItem, Amount, TableOver } from 'app/components'
import { Icon } from 'app/components'
import AccruedPaymentList from './AccruedPaymentList'
import AccruedPaymentListForXCZC from './AccruedPaymentListForXCZC'
import CardBody from './CardBody'
import CardTitle from './CardTitle'
import CalculateBody from './CalculateBody'
import CommonCharge from './CommonCharge'
import Calculate from './Calculate'
// import UploadImg from './UploadImg'
import Enclosure from 'app/containers/components/Enclosure'
import { toJS, fromJS } from 'immutable'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'

import Ylls from 'app/containers/Search/Cxls/Ylls'
import * as yllsActions from 'app/redux/Search/Ylls/ylls.action.js'
import Cqzcjzsy from './Cqzcjzsy'
import { allDownloadEnclosure } from 'app/redux/Home/All/all.action'

@immutableRenderDecorator
export default
class CardWrap extends React.Component {
	constructor() {
		super()
		this.state = {
			showDetail: false,
			show: false,
			yllsVisible:false
		}
	}
	componentDidMount () {
		// this.props.dispatch(lrAccountActions.initLabel())
	}
	componentWillReceiveProps(nextprops) {
		if ((this.props.homeState.get('homeActiveKey') !== nextprops.homeState.get('homeActiveKey') || this.props.homeState.get('pageActive') !== nextprops.homeState.get('pageActive')) && this.state.yllsVisible === true) {
			this.setState({yllsVisible: false})
		}
	}

	render() {
		const {
			flags,
            cardTemp,
            dispatch,
            onCancel,
            showModal,
            accountList,
            taxRateTemp,
            payOrReceive,
            insertOrModify,
            runningCategory,
            disabledBeginDate,
			openRunningInfoModal,
			acAssCategoryList,
			allasscategorylist,
            inputAssCategoryList,
            stockAssCategoryList,
            mediumAssCategoryList,
            outputAssCategoryList,
            payableAssCategoryList,
			depositAssCategoryList,
            certifiedAssCategoryList,
            carryoverAssCategoryList,
			calculateTemp,
			CqzcTemp,
			commonChargeTemp,
			hideCategoryList,
			configPermissionInfo,
			simplifyStatus,

			lrPermissionInfo,
			closedBy,
			reviewedBy,
			token,
			dirUrl,
			enclosureList,
			label,
			tagModal,
			enCanUse,
			checkMoreFj,
			yllsState,
			panes,
			homeState,
			homeActiveKey,
			uploadKeyJson,
		} = this.props
		const { yllsVisible } = this.state
		const categoryType = cardTemp.get('categoryType')
		const assetType = cardTemp.get('assetType')
		let showManagemented, propertyShow, categoryTypeObj
		let direction = 'debit'
		let showInvoice = false
		let isShowAbout = false
		let specialState = false
		;({
			'LB_YYSR': () => {
				showManagemented = true
				propertyShow = '营业收入'
				categoryTypeObj = 'acBusinessIncome'
			},
			'LB_YYZC': () => {
				showManagemented = true
				propertyShow = '营业支出'
				categoryTypeObj = 'acBusinessExpense'
				direction = 'credit'
			},
			'LB_YYWSR': () => {
				showManagemented = true
				propertyShow = '营业外收入'
				categoryTypeObj = 'acBusinessOutIncome'
				isShowAbout = true
				direction = 'debit'
			},
			'LB_YYWZC': () => {
				showManagemented = true
				propertyShow = '营业外支出'
				categoryTypeObj = 'acBusinessOutExpense'
				direction = 'credit'
				isShowAbout = true
				direction = 'credit'
			},
			'LB_JK': () => {
				showManagemented = true
				propertyShow = '借款'
				categoryTypeObj = 'acLoan'
				specialState = true
			},
			'LB_TZ': () => {
				showManagemented = true
				propertyShow = '投资'
				categoryTypeObj = 'acInvest'
				specialState = true
			},
			'LB_ZB': () => {
				showManagemented = true
				propertyShow = '资本'
				categoryTypeObj = 'acCapital'
				specialState = true
			},
			'LB_CQZC': () => {
				showManagemented = true
				propertyShow = '长期资产'
				categoryTypeObj = 'acAssets',
				direction = 'debit'
			},
			'LB_FYZC': () => {
				showManagemented = true
				propertyShow = '费用支出'
				categoryTypeObj = 'acCost',
				direction = 'credit'
			},
			'LB_ZSKX': () => {
				showManagemented = false
				propertyShow = '暂收款项'
				categoryTypeObj = 'acTemporaryReceipt'
				isShowAbout = true
				specialState = true
			},
			'LB_ZFKX': () => {
				showManagemented = false
				propertyShow = '暂付款项'
				categoryTypeObj = 'acTemporaryPay'
				isShowAbout = true
				specialState = true
			},
			'LB_XCZC': () => {
				showManagemented = false
				propertyShow = '薪酬支出'
				categoryTypeObj = 'acPayment',
				direction = 'credit'
				specialState = true
			},
			'LB_SFZC': () => {
				showManagemented = false
				propertyShow = '税费支出'
				categoryTypeObj = 'acTax',
				direction = 'credit'
				specialState = true
			}
		}[categoryType] || (() => ''))()
		const { showDetail } = this.state
		const businessList = cardTemp.get('businessList')
		const paymentList = cardTemp.get('paymentList') ? cardTemp.get('paymentList') : fromJS([])
		const runningState = cardTemp.get('runningState')
		const offsetAmount = cardTemp.get('offsetAmount')
		const notHandleAmount = cardTemp.get('notHandleAmount')
		const propertyCost = cardTemp.get('propertyCost')
		const beProject = cardTemp.get('beProject')
		const handleAmount = cardTemp.get('handleAmount')
		const isQueryByBusiness = flags.get('isQueryByBusiness')
		const runningInsertOrModify = flags.get('runningInsertOrModify')
		const specialStateforAccrued = flags.get('specialStateforAccrued')
		const propertyTax = cardTemp.get('propertyTax')
		const specialStateforAssets = flags.get('specialStateforAssets')
		const allGetFlow = flags.get('allGetFlow')
		const beAccrued = cardTemp.getIn([categoryTypeObj, 'beAccrued'])
		const beManagemented = cardTemp.getIn([categoryTypeObj, 'beManagemented'])
		const amount = flags.get('amount')
		const paymentType = flags.get('paymentType')
		const currentAmount = cardTemp.get('currentAmount')
		const lsItemData = yllsState.get('lsItemData')
		const PageTab = flags.get('PageTab')
		const paymentInsertOrModify = flags.get('paymentInsertOrModify')
		const isQuery = flags.get('isQuery')
		let component
		if (PageTab === 'business' || (PageTab === 'payment' && flags.get('paymentType') === '')) {
			component = <CardBody
					flags={flags}
					cardTemp={cardTemp}
					dispatch={dispatch}
					accountList={accountList}
					taxRateTemp={taxRateTemp}
					payOrReceive={payOrReceive}
					insertOrModify={insertOrModify}
					runningCategory={runningCategory}
					disabledBeginDate={disabledBeginDate}
					configPermissionInfo={configPermissionInfo}
					simplifyStatus={simplifyStatus}
					categoryTypeObj={categoryTypeObj}
			/>
		} else  {
			switch (paymentType) {
				case 'LB_SFGL':
					component = <CalculateBody
						flags={flags}
						calculateTemp={calculateTemp}
						dispatch={dispatch}
						accountList={accountList}
						disabledBeginDate={disabledBeginDate}
						hideCategoryList={hideCategoryList}
						configPermissionInfo={configPermissionInfo}
						yllsState={yllsState}
						panes={panes}
						homeState={homeState}
					/>
					break
				case 'LB_GGFYFT':
					component =<CommonCharge
						flags={flags}
						commonChargeTemp={commonChargeTemp}
						dispatch={dispatch}
						hideCategoryList={hideCategoryList}
						disabledBeginDate={disabledBeginDate}
						yllsState={yllsState}
						panes={panes}
						homeState={homeState}
					/>
					break
				case 'LB_JZSY':
					component = <Cqzcjzsy
						flags={flags}
						CqzcTemp={CqzcTemp}
						dispatch={dispatch}
						accountList={accountList}
						disabledBeginDate={disabledBeginDate}
						hideCategoryList={hideCategoryList}
						configPermissionInfo={configPermissionInfo}
						panes={panes}
						yllsState={yllsState}
						homeState={homeState}
					/>
					break

				default:
					component= <Calculate
						flags={flags}
						cardTemp={cardTemp}
						configPermissionInfo={configPermissionInfo}
						/>
			}
		}

		return (
			<div className="lrAccount" >
                {/* <CardTitle/> */}

				{component}

				{
					PageTab === 'business' || (PageTab === 'payment' && flags.get('paymentType') === '')?
						<div>
							{
								PageTab === 'business' && isQueryByBusiness && businessList && businessList.size && runningState !== 'STATE_CQZC_JZSY'?
									<div>
										<div className="accountConf-separator"></div>
											{
												businessList.map(v => <div className='business-water' key={v.get()}>
													<span className='green-pannel'>
													{`结转${v.get('runningState') === 'STATE_YYSR_JZCB'?'成本':'损益'}`}
													</span>
													{`结转${v.get('runningState') === 'STATE_YYSR_JZCB'?'成本':'损益'}流水:${v.get('flowNumber')}`}
											</div>)
											}
									</div>
									:
									null
							}
							{
								PageTab === 'business'
								&& runningState === 'STATE_CQZC_JZSY'
								&& (isQueryByBusiness && businessList && businessList.size || runningInsertOrModify === 'insert') ?
									<div style={{marginTop:'10px'}}>
										<TableAll className="lrAccount-table">
											<TableTitle
												className="account-card-wrap-table-width"
												titleList={['流水号','流水类别','金额']}
											/>
											<TableBody>
												{
													runningInsertOrModify === 'modify'?
														businessList.map(v =>
															<TableItem className="account-card-wrap-table-width">
																<li><span>{v.get('flowNumber')}</span></li>
																<li><span>{v.get('categoryName')}</span></li>
																<li><p>{v.get('tax') && v.get('billType') === 'bill_common' ? (Number(v.get('amount')) - Number(v.get('tax'))).toFixed(2) : v.get('amount')}</p></li>
															</TableItem>
														)
														:
														<TableItem className="account-card-wrap-table-width">
															<li><span>{cardTemp.get('flowNumber')}</span></li>
															<li><span>{cardTemp.get('categoryName')}</span></li>
															<li><p>{cardTemp.get('tax') && cardTemp.get('billType') === 'bill_common' ? (Number(cardTemp.get('amount')) - Number(cardTemp.get('tax'))).toFixed(2) : cardTemp.get('amount')}</p></li>
														</TableItem>

												}

											</TableBody>
										</TableAll>
									</div>
									:
									null
							}
							{
								isQueryByBusiness
								&&(runningState !== 'STATE_JK_ZFLX'
								&& runningState !== 'STATE_TZ_SRGL'
								&& runningState !== 'STATE_TZ_SRLX'
								&& runningState !== 'STATE_ZB_ZFLR'
								&& runningState !== 'STATE_XC_JN'
								&& runningState !== 'STATE_XC_FF'
								&& runningState !== 'STATE_SF_JN'
								&& runningState !== 'STATE_ZS_TH'
								&& runningState !== 'STATE_ZF_SH'
								&& propertyCost !== 'XZ_QDJK'
								&& propertyCost !== 'XZ_CHBJ'
								&& propertyCost !== 'XZ_SHTZ'
								&& propertyCost !== 'XZ_DWTZ'
								&& runningState !== 'STATE_CQZC_JZSY'
								&& runningState !== 'STATE_CQZC_YS'
								&& runningState !== 'STATE_CQZC_YF'
								&& runningState !== 'STATE_FY_YF'
								&& runningState !== 'STATE_FY_DJ'
								&& assetType !== 'XZ_ZJTX'
								&& (beManagemented || beAccrued )
								&& !allGetFlow
								|| runningState === 'STATE_ZS_SQ'
								|| runningState === 'STATE_XC_JT'
								|| runningState === 'STATE_JK_JTLX'
								|| runningState === 'STATE_ZF_FC' )?
									<div>
										<div className="accountConf-separator"></div>
										<div className='payment-water'>
											{
												Number(amount) != Number(currentAmount) ?
												<span>
													核销情况：{`${handleAmount != 0 ? notHandleAmount == 0 ? '已全部核销' : '部分核销': '未核销'}`}
												</span>
												: ''
											}

											{
												handleAmount !=0 && amount != currentAmount?
												<span className='detail'>
													{
														this.state.show ?
															<span
																onClick={() => {
																	this.setState({show:false})
																}}
																>收拢 <Icon type="up" /></span>
															:
															<span
																onClick={() => {
																	this.setState({show:true})
																}}
																>查看详情 <Icon type="down" /></span>
													}
												</span>
												:
												null
											}
											{
												this.state.show && amount != currentAmount?
												<TableAll className="lrAccount-table">
													<TableTitle
														className="account-card-wrap-table-width"
														titleList={['流水日期', '流水号', '处理金额']}
													/>
													<TableBody>
														{
															paymentList.map(v =>
																<TableItem className="account-card-wrap-table-width">
																	<li><span>{v.get('runningDate')}</span></li>
																	<TableOver
																		textAlign='left'
																		className='account-flowNumber'
																		onClick={() => {
																			dispatch(yllsActions.getYllsBusinessData(v,() => this.setState({yllsVisible: true})))
																		}}
																	>
																		<span>{v.get('flowNumber')}</span>
																	</TableOver>
																	<li><p>{v.get('handleAmount').toFixed(2)}</p></li>
																</TableItem>
															)
														}
														<TableItem className="account-card-wrap-table-width">
															<li></li>
															<li>合计</li>
															<li>
																<p>
																	{
																		paymentList.reduce((total ,current) => {
																			return total += Number(current.get('handleAmount'))
																		},0).toFixed(2)
																	}
																</p>

															</li>
														</TableItem>
													</TableBody>
												</TableAll>
												:
												null
											}

										</div>
									</div>
									:
									null
							}

							{
								PageTab === 'business' && (runningState === 'STATE_JK_ZFLX' || runningState === 'STATE_TZ_SRGL' || runningState === 'STATE_TZ_SRLX' || runningState === 'STATE_ZB_ZFLR') && specialState && beAccrued?
								<AccruedPaymentList
									specialStateforAccrued={specialStateforAccrued}
									paymentList={paymentList}
									isQueryByBusiness={isQueryByBusiness}
									dispatch={dispatch}
									flags={flags}
									cardTemp={cardTemp}
									yllsState={yllsState}
									panes={panes}
									showDrawer={() => this.setState({yllsVisible: true})}
								/>
								:
								null
							}
							{
								PageTab === 'business' && runningState === 'STATE_SF_JN' && specialState && (propertyTax === 'SX_QTSF' && beAccrued || propertyTax === 'SX_ZZS' || propertyTax === 'SX_QYSDS' && beAccrued)?
								<AccruedPaymentList
									specialStateforAccrued={specialStateforAccrued}
									paymentList={paymentList}
									isQueryByBusiness={isQueryByBusiness}
									dispatch={dispatch}
									flags={flags}
									cardTemp={cardTemp}
									yllsState={yllsState}
									panes={panes}
									showDrawer={() => this.setState({yllsVisible: true})}
								/>
								:
								null
							}
							{
								PageTab === 'business' && (runningState === 'STATE_ZS_TH' || runningState === 'STATE_ZF_SH' || runningState === 'STATE_SF_SFJM') && specialState ?
								<AccruedPaymentList
									specialStateforAccrued={specialStateforAccrued}
									paymentList={paymentList}
									isQueryByBusiness={isQueryByBusiness}
									dispatch={dispatch}
									flags={flags}
									cardTemp={cardTemp}
									yllsState={yllsState}
									panes={panes}
									showDrawer={() => this.setState({yllsVisible: true})}
								/>
								:
								null
							}
							{
								PageTab === 'business' && (runningState === 'STATE_XC_JN' || runningState === 'STATE_XC_FF')  && specialState && beAccrued ?
								<AccruedPaymentListForXCZC
									specialStateforAccrued={specialStateforAccrued}
									paymentList={paymentList}
									isQueryByBusiness={isQueryByBusiness}
									dispatch={dispatch}
									flags={flags}
									cardTemp={cardTemp}
									yllsState={yllsState}
									panes={panes}
									showDrawer={() => this.setState({yllsVisible: true})}
								/>
								:
								null
							}
						</div>
						:
						null
				}
				{/* {
					// PageTab === 'business' || PageTab !== 'business' && (paymentType === 'LB_ZZ' || paymentType === 'LB_JZCB' || paymentType === 'LB_FPRZ' || paymentType === 'LB_KJFP' || paymentType === 'LB_ZCWJZZS' || paymentType === 'LB_GGFYFT')?
					// enCanUse && checkMoreFj && homeActiveKey === "Edit" ?
					// <UploadImg
					// 	dispatch={dispatch}
					// 	lrPermissionInfo={lrPermissionInfo}
					// 	token={token}
					// 	dirUrl={dirUrl}
					// 	dispatch={dispatch}
					// 	enclosureList={enclosureList}
					// 	label={label}
					// 	tagModal={tagModal}
					// 	closedBy={closedBy}
					// 	reviewedBy={reviewedBy}
					// 	enCanUse={enCanUse}
					// 	checkMoreFj={checkMoreFj}
					// 	PageTab={PageTab}
					// 	paymentType={flags.get('paymentType')}
					// 	runningState={runningState}
					// 	isQuery={isQuery}
					// 	paymentInsertOrModify={paymentInsertOrModify}
					// 	specialStateforAccrued={specialStateforAccrued}
					// /> : ''
				} */}
				<Enclosure
					formPage={'oldRunning'}
					type="ls"
					className="lrls-enclosure-wrap"
					dispatch={dispatch}
					permission={lrPermissionInfo.getIn(['edit', 'permission'])}
					token={token}
					// sobid={sobid}
					enclosureList={enclosureList}
					label={label}
					closed={closedBy}
					reviewed={reviewedBy}
					enCanUse={enCanUse}
					checkMoreFj={checkMoreFj}
					getUploadTokenFetch={() => dispatch(lrAccountActions.getUploadGetTokenFetch())}
					getLabelFetch={() => dispatch(lrAccountActions.getLabelFetch(PageTab,paymentType))}
					deleteUploadImgUrl={(index) => dispatch(lrAccountActions.deleteUploadFJUrl(index,PageTab,paymentType)) }
					changeTagName={(index, tagName) => dispatch(lrAccountActions.changeTagName(index,tagName,PageTab,paymentType))}
					downloadEnclosure={(enclosureUrl, fileName) => dispatch(allDownloadEnclosure(enclosureUrl, fileName))}
					uploadEnclosureList={(value) => {
						dispatch(lrAccountActions.uploadFiles(PageTab, paymentType, ...value))
					}}
					uploadKeyJson={uploadKeyJson}
				/>

				{
					yllsVisible ?
					<Ylls
						yllsVisible={yllsVisible}
						dispatch={dispatch}
						yllsState={yllsState}
						onClose={() => this.setState({yllsVisible: false})}
						editLrAccountPermission={true}
						panes={panes}
						lsItemData={lsItemData}
						uuidList={paymentList.filter((v,i) => i>0 ? v.get('uuid') !== paymentList.getIn([i-1,'uuid']):true)}
						showDrawer={() => this.setState({yllsVisible: true})}
						refreshList={() => {}}
						lryl={true}
						// inputValue={inputValue}
					/>
					: ''
				}
            </div>
		)
	}
}
