import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { fromJS, Map, List }	from 'immutable'

import * as homeActions from 'app/redux/Home/home.action.js'
import { ROOT } from 'app/constants/fetch.constant.js'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'
import TreeContain from './TreeContain.jsx'
import Table from './Table.jsx'
import MutilColumnTable from './MutilColumnTable'
import { getTreeData, DateLib, judgePermission} from 'app/utils'
import { Button, Icon, Input, message } from 'antd'
import { debounce } from 'app/utils'

import { TableWrap, Export } from 'app/components'
import PageSwitch from 'app/containers/components/PageSwitch'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import MutiPeriodMoreSelect from 'app/containers/components/MutiPeriodMoreSelect'
import './style/index.less'

import * as kmmxbActions from 'app/redux/Mxb/Kmmxb/kmmxb.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
class Kmmxb extends React.Component {

	constructor() {
		super()
		this.state = {inputValue: '', isSearching: false}
	}

	componentDidMount() {
		const { dispatch, allState } = this.props
		const previousPage = sessionStorage.getItem('previousPage')
		if (previousPage === 'home') {
			sessionStorage.setItem('previousPage', '')
			dispatch(kmmxbActions.getPeriodAndMxbAclistFetch({
				issuedate: '',
				endissuedate: '',
				acId: '',
				assId: '',
				assCategory: '',
				condition: '',
				currentPage: '1',
			}))
		}
	}

	shouldComponentUpdate(nextprops, nextstate) {
		const previousPage = sessionStorage.getItem('previousPage')
		if (previousPage === 'kmyeb' || previousPage === 'cxpz') {
			sessionStorage.setItem('previousPage', '')
			this.setState({inputValue: ''})
		}
		return this.props.allState != nextprops.allState || this.props.kmmxbState != nextprops.kmmxbState || this.props.homeState != nextprops.homeState || this.state != nextstate
	}

	render() {

		const { dispatch, kmmxbState, allState, homeState } = this.props
		const { inputValue, isSearching } = this.state

		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
		//科目明细表
		const detailList = homeState.getIn(['data', 'userInfo', 'pageController', 'BALANCE_DETAIL', 'preDetailList', 'AC_BALANCE_STATEMENT', 'detailList'])
		const PzPermissionInfo = homeState.getIn(['permissionInfo', 'Pz'])
		const aclist        = kmmxbState.get('aclist') || []
		const issuedate     = kmmxbState.get('issuedate')
		// const currentAcid   = kmmxbState.get('currentAcid')

		const currentAcId   = kmmxbState.getIn(['views', 'currentAcId'])
		const currentAssId   = kmmxbState.getIn(['views', 'currentAssId'])
		const currentAssCategory   = kmmxbState.getIn(['views', 'currentAssCategory'])

		const ledger        = kmmxbState.get('ledger')
		const acid          = ledger.get('acId')
		const acfullname    = ledger.get('acFullName')
		const assid         = ledger.get('assId')
		const assname       = ledger.get('assName')
		const jvlist        = ledger.get('detailList')
		const issues        = allState.get('issues')
		const openedyear    = allState.getIn(['period', 'openedyear'])
		const openedmonth   = allState.getIn(['period', 'openedmonth'])
		const currentPage   = kmmxbState.get('currentPage')
		const pageCount     = kmmxbState.get('pageCount')
		const chooseValue   = kmmxbState.getIn(['views', 'chooseValue'])	

		const acinfo = assid ? `${currentAcId}_${acfullname} ${assid}_${assname}` : `${currentAcId}_${acfullname}`

		const hash = {'_': true} // 期初是 "_"
		// lrpz的上下张凭证数组vcindexList包含的是 ['2017-01_1'], 日期和凭证号的分隔符为 "_"
		const vcindexList = jvlist.size ? (jvlist.map(v => [v.get('vcDate'), v.get('vcindex')].join('_')).filter(w => hash[w] ? false : hash[w] = true)) : fromJS([])
	
		const endissuedate  = kmmxbState.get('endissuedate')
		const chooseperiods = false

		// 一键结转与一键收付款判断
		let paymentable   = false
		let transferable  = false
		let showMutilColumnAccount = false
		const paymentList = ['1122', '2202']
		let allChild = []

		const endYear = endissuedate.substr(0, 4)
		const endMonth = endissuedate.substr(5, 2)

		let selected = {} // 当前科目及下级
		let loop = (data) => data.forEach(item => { // 找当前科目及下级
			if (item.get('acId') === currentAcId.substr(0, item.get('acId').length)) { // 是当前科目的父级
				if (item.get('acId').length === currentAcId.length) { 
					selected = item.toJS()
				} else {
					if (item.get('childList') && item.get('childList').size) {
						loop(item.get('childList'))
					}
				}
			}
		})
		// 判断是否出现 一键收付 成本结转 多栏帐
		if (currentAcId && (paymentList.indexOf(currentAcId.substr(0, 4)) > -1)) { //满足收付条件

			const currentAclist = aclist.filter(v => v.get('acId') === currentAcId.substr(0, 4))
			loop(currentAclist)

			if (selected.childList) { //  存在那个科目
				// 可收付的条件为 为1122或2202开头的末端科目、只有一个辅助核算且选中的是辅助核算
				if (selected.childList.length === 0) { // 为末端科目
					if (selected.assCategoryList.length === 0) { // 当前科目无辅助核算
						paymentable = true
					} else if (selected.assCategoryList.length === 1) { // 校验当前科目是否是单辅助核算
						if (currentAssId) { // 选中的是辅助核算
							paymentable = true
						}
					}
				}
			}
		} else if (currentAcId.indexOf('4') === 0) {
			const currentAclist = aclist.filter(v => v.get('acId') === currentAcId.substr(0, 4))
			loop(currentAclist)

			if (selected.childList) {
				// 账期为第一个未结账账期

				// 日期判断
				const currentYear = new DateLib().getYear()
				const currentMonth = new DateLib().getMonth()

				let showtransfer = false
				// 查询账期的最
				if (new Date(endYear, endMonth) <= new Date(currentYear, currentMonth)) {
					if (new Date(openedyear, openedmonth) <= new Date(endYear, endMonth)) {
						showtransfer = true
					}
				}

				if (showtransfer) {
					// 没有辅助核算 末端类别发生额不为零
					let loopChild = data => data.forEach(v => {
						if (v.childList && v.childList.length) {
							loopChild(v.childList)
						} else {
							if (v.assCategoryList.length === 0 && v.closingbalance !== 0) { // 并且有余额
								allChild.push(v)
							}
						}
					})
					if (selected.childList && selected.childList.length) {
						loopChild(selected.childList)
					} else {
						if (selected.assCategoryList.length === 0 && selected.closingbalance !== 0) { // 并且有余额
							allChild.push(selected)
						}
					}

					if (allChild.length) {
						transferable = true
					}
				}
			}
		} else if (currentAcId.indexOf('5') === 0) {
			const currentAclist = aclist.filter(v => v.get('acId') === currentAcId.substr(0, 4))
			loop(currentAclist)

			if (selected.childList) {
				// 5开头且有1个以上的子级科目
				if (selected.childList && selected.childList.length > 1) {
					showMutilColumnAccount = true
				}
			}
		}
		
		// const currentInfo = acid + Limit.TREE_JOIN_STR + ledger.get('assid') + Limit.TREE_JOIN_STR + (currentAssCategory ? currentAssCategory : '')
		
		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		// 多栏帐
		const showMutilColumnAccountTable = kmmxbState.getIn(['views', 'showMutilColumnAccountTable'])
		const mutilColumnData = kmmxbState.get('mutilColumnData')
		
		return (
			<ContainerWrap type={showMutilColumnAccountTable ? "mxb-mutil-column" : "mxb-one"} className="kmmxb">
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread || pageList.getIn(['Mxb','pageList']).size <= 1 ? '' :
							<PageSwitch
								pageItem={pageList.get('Mxb')}
								onClick={(page, name, key) => {
									if (pageList.getIn(['Mxb','pageList']).indexOf('科目明细表') === -1) {
										sessionStorage.setItem('previousPage', 'home')
									}
									dispatch(homeActions.addPageTabPane('MxbPanes', key, key, name))
									dispatch(homeActions.addHomeTabpane(page, key, name))
								}}
							/>
						}
						<MutiPeriodMoreSelect
							issuedate={issuedate}
							endissuedate={endissuedate}
							issues={issues}
							chooseValue={chooseValue}
							changeChooseperiodsStatu={(value) => {
								dispatch(kmmxbActions.changeAcMxbChooseValue(value))}}
							changePeriodCallback={(value1, value2) => {

								if (inputValue) {
									this.setState({inputValue: ''})
								}
								if (showMutilColumnAccountTable) {
									dispatch(kmmxbActions.getMoreColumnData(value1, value2, currentAcId, '1'))
								} else {
									// 账期切换怎么显示还没做
									dispatch(kmmxbActions.getMxbAclistFetch({
										issuedate: value1,
										endissuedate: value2,
										acId: currentAcId,
										assId: currentAssId,
										assCategory: currentAssCategory,
										condition: '',
										currentPage: '1',
									}))
								}
							}}
						/>
						<span className="cxpz-serch" style={{display: showMutilColumnAccountTable ? "none" : ''}}>
							{
								inputValue ?
								<Icon className="normal-search-delete"  type="close-circle" theme='filled'
									onClick={() => {
										dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
											issuedate: issuedate,
											endissuedate: endissuedate,
											acId: currentAcId,
											assId: currentAssId,
											assCategory: currentAssCategory,
											condition: '',
											currentPage: '1',
										}))
										this.setState({inputValue: ''})
									}}
								/> : null
							}
							<Icon className="cxpz-serch-icon"  type="search"
								onClick={() => {
									dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
										issuedate: issuedate,
										endissuedate: endissuedate,
										acId: currentAcId,
										assId: currentAssId,
										assCategory: currentAssCategory,
										condition: inputValue,
										currentPage: '1',
									}))
								}}
							/>

							<Input
								placeholder="搜索明细"
								className="cxpz-serch-input"
								value={inputValue}
								onChange={e => this.setState({inputValue: e.target.value})}
								onKeyDown={(e) => {
									if (e.keyCode == Limit.ENTER_KEY_CODE){
										if (!isSearching) {
											this.setState({isSearching: true})
											dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
												issuedate: issuedate,
												endissuedate: endissuedate,
												acId: currentAcId,
												assId: currentAssId,
												assCategory: currentAssCategory,
												condition: inputValue,
												currentPage: '1',
											}, () => {
												this.setState({isSearching: false})
											}))
										}
									}	
								}}
							/>
						</span>
					</div>
					<div className="flex-title-right">
						<Button
							style={{display: paymentable && ledger.get('allBalanceAmount') != 0 && PzPermissionInfo.getIn(['edit', 'permission']) ? '' : 'none'}}
	                        className="title-right"
	                        type="ghost"
	                        onClick={() => dispatch(kmmxbActions.mxbConvenientPaymentToLrpz(acid.substr(0, 4), currentAssCategory))}
	                    >
	                        一键收/付款
	                    </Button>
						<Button
							style={{display: showMutilColumnAccount && !showMutilColumnAccountTable ? '' : 'none'}}
	                        className="title-right"
	                        type="ghost"
	                        onClick={()=> {
								dispatch(kmmxbActions.getMoreColumnData(issuedate, endissuedate, currentAcId, '1'))
							}}
	                    >
	                        多栏账
	                    </Button>
						<Button
							style={{display: showMutilColumnAccountTable ? '' : 'none'}}
	                        className="title-right"
	                        type="ghost"
	                        onClick={()=> {
								this.setState({inputValue: ''})
								dispatch(kmmxbActions.getMxbAclistFetch({issuedate, endissuedate, acId:currentAcId, assId: '', assCategory: '', condition: '', currentPage: '1'}))
								dispatch(kmmxbActions.handleColumnAccountTable())
							}}
	                    >
	                       明细表
	                    </Button>
						<span className="title-right title-dropdown" style={{display:showMutilColumnAccountTable?"none":''}}>
							<Export
								type='third'
								isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
								exportDisable={!issuedate || isPlay}
								// excel 当前明细 分录
								excelDownloadUrl={`${ROOT}/sob/report/ac/detail/one/excel/export?${URL_POSTFIX}&begin=${issuedate}&end=${endissuedate}&acId=${currentAcId ? currentAcId : ''}&assId=${currentAssId ? currentAssId : ''}&assCategory=${currentAssCategory ? encodeURI(encodeURI(currentAssCategory)) : encodeURI(encodeURI(''))}&assName=${assname ? encodeURI(encodeURI(assname)) : encodeURI(encodeURI(''))}`}
								// ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'mxbexcelsubone', {begin:issuedate ? issuedate : '', end:endissuedate ? endissuedate : '', acId: currentAcId ? currentAcId : '', assId: currentAssId ? currentAssId : '', assCategory: currentAssCategory ? currentAssCategory : '', assName: assname ? assname : ''}))}
								ddExcelCallback={(value) => {
									console.log(111)
                                    if(!judgePermission(detailList.get('EXPORT_CURRENT_STATEMENT_EXCEL')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'mxbexcelsubone', {begin:issuedate ? issuedate : '', end:endissuedate ? endissuedate : '', acId: currentAcId ? currentAcId : '', assId: currentAssId ? currentAssId : '', assCategory: currentAssCategory ? currentAssCategory : '', assName: assname ? assname : ''}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }}
                                }
								
								// excel 当前明细 凭证
								excelVcDownloadUrl={`${ROOT}/sob/report/ac/detail/one/vc/excel/export?${URL_POSTFIX}&begin=${issuedate}&end=${endissuedate}&acId=${currentAcId ? currentAcId : ''}&assId=${currentAssId ? currentAssId : ''}&assCategory=${currentAssCategory ? encodeURI(encodeURI(currentAssCategory)) : encodeURI(encodeURI(''))}&assName=${assname ? encodeURI(encodeURI(assname)) : encodeURI(encodeURI(''))}`}
								// ddExcelVcCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'acdetailonevcexcel', {begin:issuedate ? issuedate : '', end:endissuedate ? endissuedate : '', acId: currentAcId ? currentAcId : '', assId: currentAssId ? currentAssId : '', assCategory: currentAssCategory ? currentAssCategory : '', assName: assname ? assname : ''}))}
								ddExcelVcCallback={(value) => {
                                    if(!judgePermission(detailList.get('EXPORT_CURRENT_STATEMENT_EXCEL')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'acdetailonevcexcel', {begin:issuedate ? issuedate : '', end:endissuedate ? endissuedate : '', acId: currentAcId ? currentAcId : '', assId: currentAssId ? currentAssId : '', assCategory: currentAssCategory ? currentAssCategory : '', assName: assname ? assname : ''}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }}
								}
								
								// excel 所有明细
								allexcelDownloadUrl={`${ROOT}/sob/report/ac/detail/all/excel/export?${URL_POSTFIX}&begin=${issuedate}&end=${endissuedate}`}
								// allddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'mxbexcelsuball', {begin: issuedate, end: endissuedate}))}
								allddExcelCallback={(value) => {
                                    if(!judgePermission(detailList.get('EXPORT_ALL_STATEMENT_EXCEL')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'mxbexcelsuball', {begin: issuedate, end: endissuedate}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }}
								}
								
								// 导出Excel 总账
								acMxLedgerExcelDownloadUrl={`${ROOT}/sob/report/ac/detail/ledger/excel/export?${URL_POSTFIX}&begin=${issuedate}&end=${endissuedate}`}
								// acMxLedgerDdExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'excelExportLedger', {begin: issuedate, end: endissuedate}))}
								acMxLedgerDdExcelCallback={(value) => {
                                    if(!judgePermission(detailList.get('EXPORT_GL_EXCEL')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'excelExportLedger', {begin: issuedate, end: endissuedate}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }}
								}

								// pdf 当前明细
								PDFDownloadUrl={`${ROOT}/sob/report/ac/detail/one/pdf/export?${URL_POSTFIX}&begin=${issuedate}&end=${endissuedate}&acId=${currentAcId ? currentAcId : ''}&assId=${currentAssId ? currentAssId : ''}&assCategory=${currentAssCategory ? encodeURI(encodeURI(currentAssCategory)) : encodeURI(encodeURI(''))}`}
								// ddPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'pdfmxbexport', {begin: `${issuedate}`, end: `${endissuedate}`, acId:`${currentAcId ? currentAcId : ''}`, assId: `${currentAssId ? currentAssId : ''}`, assCategory: `${currentAssCategory ? currentAssCategory : ''}`}))}								
								ddPDFCallback={(value) => {
                                    if(!judgePermission(detailList.get('EXPORT_CURRENT_STATEMENT_PDF')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'pdfmxbexport', {begin: `${issuedate}`, end: `${endissuedate}`, acId:`${currentAcId ? currentAcId : ''}`, assId: `${currentAssId ? currentAssId : ''}`, assCategory: `${currentAssCategory ? currentAssCategory : ''}`}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }}
								}   

								// 导出Pdf 所有明细  一级
								allAcMxPDFDownloadUrl={`${ROOT}/sob/report/ac/detail/all/first/pdf/export?${URL_POSTFIX}&begin=${issuedate}&end=${endissuedate}`}
								// allAcMxDdPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'pdfAcSub', {begin: issuedate, end: endissuedate}))}
								allAcMxDdPDFCallback={(value) => {
                                    if(!judgePermission(detailList.get('EXPORT_ALL_STATEMENT_PDF')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'pdfAcSub', {begin: issuedate, end: endissuedate}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }}
								}

								// 导出Pdf 总账 一级
								allPDFDownloadUrl={`${ROOT}/sob/report/ac/detail/ledger/first/pdf/export?${URL_POSTFIX}&begin=${issuedate}&end=${endissuedate}`}
								// allddPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'pdfExportLedger', {begin: issuedate, end: endissuedate}))}
								allddPDFCallback={(value) => {
                                    if(!judgePermission(detailList.get('EXPORT_GL_PDF')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'pdfExportLedger', {begin: issuedate, end: endissuedate}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }}
								}

								// 导出Pdf 所有明细 二级
								acMxSecondPDFDownloadUrl={`${ROOT}/sob/report/ac/detail/all/second/pdf/export?${URL_POSTFIX}&begin=${issuedate}&end=${endissuedate}`}
								// acMxSecondDdPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'pdfSecondAcSub', {begin: issuedate, end: endissuedate}))}
								acMxSecondDdPDFCallback={(value) => {
                                    if(!judgePermission(detailList.get('EXPORT_ALL_STATEMENT_PDF')).disabled){
										dispatch(allActions.allExportReceiverlist(value, 'pdfSecondAcSub', {begin: issuedate, end: endissuedate}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }}
								}
								
								// 导出Pdf 总账 二级
								allAcMxSecondPDFDownloadUrl={`${ROOT}/sob/report/ac/detail/ledger/second/pdf/export?${URL_POSTFIX}&begin=${issuedate}&end=${endissuedate}`}
								// allAcMxSecondDdPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'pdfExportLedger2', {begin: issuedate, end: endissuedate}))}
								allAcMxSecondDdPDFCallback={(value) => {
                                    if(!judgePermission(detailList.get('EXPORT_GL_PDF')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'pdfExportLedger2', {begin: issuedate, end: endissuedate}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }}
								}

								onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '科目明细表',
									}))
								}}
								>
							</Export>
						</span>
						<Button
							style={{display: transferable && PzPermissionInfo.getIn(['edit', 'permission']) ? '' : 'none'}}
	                        className="title-right"
	                        type="ghost"
	                        onClick={() => {
								const transferList = fromJS(allChild) 
								if (transferList.size > 29) {

									thirdParty.Alert('处理分录数量过大，系统将处理前29条分录。您可多次操作“一键结转”直至全部处理完毕。', '', '', () => dispatch(kmmxbActions.mxbTransferToLrpz(transferList.slice(0, 29), endYear, endMonth)))
								} else {
									dispatch(kmmxbActions.mxbTransferToLrpz(transferList, endYear, endMonth))
								}
							}}
	                        >
	                        一键结转
	                    </Button>
						<Button
	                        className="title-right refresh-btn"
	                        type="ghost"
	                        onClick={() => debounce(() => {
								if(showMutilColumnAccountTable){
									dispatch(kmmxbActions.getMoreColumnData(issuedate, endissuedate, currentAcId, '1'))
								}else{
									dispatch(kmmxbActions.getPeriodAndMxbAclistFetch({
										issuedate: issuedate,
										endissuedate: endissuedate,
										acId: currentAcId,
										assId: currentAssId,
										assCategory: currentAssCategory,
										condition: inputValue,
										currentPage: currentPage,
									}))
								}
								dispatch(allActions.freshMxbPage('科目明细表'))
							})()}
	                        >
	                        刷新
	                    </Button>
	                </div>
				</FlexTitle>
					{showMutilColumnAccountTable ?
						<MutilColumnTable
							dispatch={dispatch}
							acinfo={acinfo}
							mutilColumnData={mutilColumnData}
							paginationCallBack={value => {
								dispatch(kmmxbActions.getMoreColumnData(issuedate, endissuedate, currentAcId, value))
							}}
						/>
					:
					<TableWrap className="table-normal-width-new table-flex-mxb" notPosition={true}>
						<Table
							dispatch={dispatch}
							acinfo={acinfo}
							ledger={ledger}
							jvlist={jvlist}
							vcindexList={vcindexList}
							issuedate={issuedate}
							currentPage={currentPage}
							pageCount={pageCount}
							paginationCallBack={(value) => dispatch(kmmxbActions.getSubsidiaryLedgerFetch({
								issuedate: issuedate,
								endissuedate: endissuedate,
								acId: currentAcId,
								assId: currentAssId,
								assCategory: currentAssCategory,
								condition: inputValue,
								currentPage: value,
							}))}
						/>
						<TreeContain
							dispatch={dispatch}
							aclist={aclist}
							issuedate={issuedate}
							cascadeAclist={getTreeData(aclist.toJS())}
							currentAcId={currentAcId}
							currentAssId={currentAssId}
							currentAssCategory={currentAssCategory}
							endissuedate={endissuedate}
							chooseperiods={chooseperiods}
							inputValue={inputValue}
							clearInput={() => this.setState({inputValue: ''})}
						/>
					</TableWrap>
				}
			</ContainerWrap>
		)
	}
}