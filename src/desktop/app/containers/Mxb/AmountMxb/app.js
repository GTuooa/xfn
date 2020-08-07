import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'

import * as AmmxbActions from 'app/redux/Mxb/AmountMxb/amountMxb.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'

import PageSwitch from 'app/containers/components/PageSwitch'
import { fromJS, Map, List } from 'immutable'
import { changeAmmxbDataToTree, assMxbTree, judgePermission } from 'app/utils'
import { Select, Checkbox, Button,message } from 'antd'
import { ROOT } from 'app/constants/fetch.constant.js'
import * as Limit from 'app/constants/Limit.js'
import { TableWrap, TableBody, TableItem, TableTitle, TableOver, TableAll, Export, Title } from 'app/components'
import JvItem from './JvItem.jsx'
import TreeContain from './TreeContain.jsx'
import Table from './Table.jsx'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import { debounce } from 'app/utils'
import './style/index.less'

@connect(state => state)
export default
class AmountMxb extends React.Component {

	componentDidMount() {
		const { dispatch, allState } = this.props
		const previousPage = sessionStorage.getItem('previousPage')
		if (previousPage === 'home') {
			sessionStorage.setItem('previousPage', '')
			dispatch(AmmxbActions.getPeriodAndMxbAclistFetch())
		}
	}

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.ammxbState != nextprops.ammxbState || this.props.homeState != nextprops.homeState
	}

	render() {
		const { dispatch, ammxbState, allState, homeState } = this.props
		//数量余额表
        const detailList = homeState.getIn(['data','userInfo','pageController','BALANCE_DETAIL','preDetailList','NUMBER_BALANCE_STATEMENT','detailList'])
		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
		const assTags = allState.get('assTags')
		const aclist = ammxbState.get('aclist') || fromJS([])
		const asslist = ammxbState.get('asslist') || fromJS([])
		const issuedate = ammxbState.get('issuedate')
		const currentAcid = ammxbState.get('currentAcid')
		const currentSupportPos = ammxbState.get('currentSupportPos')
		const currentAcItem = allState.get('aclist').find(v => v.get('acid') == currentAcid)
		const ledger = ammxbState.get('ledger')
		const acid = ledger.get('acid')
		const acfullname = ledger.get('acfullname')
		const assid = ledger.get('assid')
		const assname = ledger.get('assname')
		const currentAsscategory = ammxbState.get('currentAsscategory')
		const acId = ammxbState.get('acId')
		const assId = ammxbState.get('assId')
		const acName = ammxbState.get('acName')
		const assName = ammxbState.get('assName')
		const assIdTwo = ammxbState.get('assIdTwo')
		const assTwoName = ammxbState.get('assTwoName')
		const assCategoryTwo = ammxbState.get('assCategoryTwo')
		const pos = ammxbState.get('currentSupportPos')
		const jvlist = ledger.get('jvlist') || fromJS([])
		const issues = allState.get('issues')
		const firstyear = allState.getIn(['period', 'firstyear'])
		const unitDecimalCount = allState.getIn(['systemInfo', 'unitDecimalCount'])
		const beSupport = ammxbState.get('beSupport')
		const pageCount = ammxbState.get('pageCount')
		const currentPage = ammxbState.get('currentPage')
		let acinfo = ''
		if (beSupport) {
			acinfo = `${assId?`${assId}_${assName} `:''}${acId?`${acId}_${acName}`:''}${assIdTwo?assIdTwo+'_'+assTwoName:''}`
		} else {
			acinfo = assid ? `${acid}_${assid} ${acfullname}_${assname}` : `${acid}_${acfullname}`
		}
		const hash = {}
		// lrpz的上下张凭证数组vcindexList包含的是 ['2017-01_1'], 日期和凭证号的分隔符为 "_"
		const vcindexList = jvlist.size ? (jvlist.map(v => [v.get('vcdate'), v.get('vcindex')].join('_')).filter(w => hash[w] ? false : hash[w] = true)) : fromJS([])

        const endissuedate = ammxbState.get('endissuedate')
		const chooseperiods = ammxbState.get('chooseperiods')
		const assCategory = ammxbState.get('assCategory')
        const idx = issues.findIndex(v => v === issuedate)
        const nextperiods = issues.slice(0, idx)

		const begin = `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`
		const beginYear = `${issuedate.substr(0,4)}`
		const beginMonth = `${issuedate.substr(6,2)}`
		const end =  endissuedate?`${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`:`${issuedate.substr(0,4)}${issuedate.substr(6,2)}`
		const endYear =  endissuedate?`${endissuedate.substr(0,4)}`:`${issuedate.substr(0,4)}`
		const endMonth =  endissuedate?`${endissuedate.substr(6,2)}`:`${issuedate.substr(6,2)}`
		// const showPzBomb = allState.get('showPzBomb')
		const currentInfo = acid + Limit.TREE_JOIN_STR + ledger.get('assid') + Limit.TREE_JOIN_STR + (currentAsscategory ? currentAsscategory : '')
		const clickAcid = ammxbState.get('clickAcid')
		const clickAsscategory = ammxbState.get('clickAsscategory')
		const clickAssid = ammxbState.get('clickAssid')


		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		return (
			<ContainerWrap type="mxb-three" className="ammountMxb">
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread || pageList.getIn(['Mxb','pageList']).size <= 1 ? '' :
							<PageSwitch
								pageItem={pageList.get('Mxb')}
								onClick={(page, name, key) => {
									if (pageList.getIn(['Mxb','pageList']).indexOf('数量明细表') === -1) {
										sessionStorage.setItem('previousPage', 'home')
									}
									dispatch(homeActions.addPageTabPane('MxbPanes', key, key, name))
									dispatch(homeActions.addHomeTabpane(page, key, name))
								}}
							/>
						}
	                    <Select
	                        className="title-date"
	                        value={issuedate}
	                        onChange={(value) => {
								if (beSupport) {
									dispatch(AmmxbActions.getMxbAsslistFetch(value,value,assCategory,acId,acName, assId,assName,assIdTwo,assCategoryTwo))

								} else {
									dispatch(AmmxbActions.getMxbAclistFetch(value,value))
								}
							}}
	                        >
	                        {issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
	                    </Select>
	                    <span className="title-checkboxtext" onClick={() => {
							if (chooseperiods && endissuedate !== issuedate) {
								if (beSupport) {
									dispatch(AmmxbActions.getMxbAsslistFetch(issuedate,issuedate,assCategory,acId,acName, assId,assName,assIdTwo,assCategoryTwo))

								} else {
									dispatch(AmmxbActions.getMxbAclistFetch(issuedate,issuedate))
								}
							}
							dispatch(AmmxbActions.changeMxbChooseMorePeriods())
							}}>
	                        <Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
	                        <span>至</span>
	                    </span>
	                    <Select
	                        disabled={!chooseperiods}
	                        className="title-date"
	                        value={issuedate === endissuedate ? '' : endissuedate}
							onChange={(value) => {
								if (beSupport) {
									dispatch(AmmxbActions.getMxbAsslistFetch(issuedate,value,assCategory,acId,acName, assId,assName,assIdTwo,assCategoryTwo))

								} else {
									dispatch(AmmxbActions.getMxbAclistFetch(issuedate,value))
								}
							}}
	                        >
	                        {nextperiods.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
	                    </Select>
						<span>
                            <Checkbox
								style={{marginLeft:'10px'}}
                                className="title-checkbox"
                                checked={beSupport}
                                onClick={(e) => {
									if (!beSupport) {
										dispatch(AmmxbActions.getMxbAsslistFetch(issuedate,endissuedate,assCategory,acId,acName, assId,assName,assIdTwo,assCategoryTwo))

									} else {
										dispatch(AmmxbActions.getMxbAclistFetch(issuedate,endissuedate))
									}
                                }}
                            />
                            <span style={{lineHeight:'28px'}}>按辅助类别查看{beSupport?':':''}</span>
                        </span>

                        {
                            beSupport?
							<span className="amountYeb-select">
								<span>
									<Select
										className="asskmyebcategory-select-item"
										value={assCategory}
										style={{width:'104px'}}
										onChange={(value) => {
											dispatch(AmmxbActions.getMxbAsslistFetch(issuedate,endissuedate,value))
										}}
										>
											{assTags.map(v => <Option key={v} value={v}>{v}</Option>)}
										</Select>
									</span>
								</span>:''
						}
					</div>
					<div className="flex-title-right">
						<span className="title-right title-dropdown">
							<Export
								isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
								type={'fourth'}
								exportDisable={!issuedate || isPlay}
								//当前明细表Excel
								excelDownloadUrl={
									beSupport?
									`${ROOT}/excel/export/countSub/by/ass?begin=${issuedate ? begin : ''}&end=${end}&assId=${assId}&acId=${acId}&assCategory=${assCategory}&assIdTwo=${assIdTwo}&assCategoryTwo=${assCategoryTwo}`
									:
									`${ROOT}/excel/export/countSunOne?${URL_POSTFIX}&begin=${issuedate ? begin : ''}&end=${end}&acid=${acid ? acid : ''}&assid=${assid ? assid : ''}&asscategory=${currentAsscategory ? encodeURI(encodeURI(currentAsscategory)) : encodeURI(encodeURI(''))}`
								}
								// ddExcelCallback={
								// 	(value) => {
								// 		beSupport?
								// 		dispatch(allActions.allExportReceiverlist(value, 'excelcountSunOneAss', {begin:issuedate ? begin : '', end:endissuedate ? end : '',assId,assCategory,assIdTwo,assCategoryTwo,acId }))
								// 		:
								// 		dispatch(allActions.allExportReceiverlist(value, 'excelcountSunOne', {begin:issuedate ? begin : '', end:endissuedate ? end : '', acid: acid ? acid : '', assid:assid ? assid : '' , asscategory:currentAsscategory ? currentAsscategory : ''}))
								// }}
								ddExcelCallback={(value) => {
									if(!judgePermission(detailList.get('EXPORT_CURRENT_STATEMENT_EXCEL')).disabled){
										beSupport?
										dispatch(allActions.allExportReceiverlist(value, 'excelcountSunOneAss', {begin:issuedate ? begin : '', end:endissuedate ? end : '',assId,assCategory,assIdTwo,assCategoryTwo,acId }))
										:
										dispatch(allActions.allExportReceiverlist(value, 'excelcountSunOne', {begin:issuedate ? begin : '', end:endissuedate ? end : '', acid: acid ? acid : '', assid:assid ? assid : '' , asscategory:currentAsscategory ? currentAsscategory : ''}))
									}else{
										message.info('当前角色无该请求权限')
									}
								}}
								
								//当前明细表PDF
								PDFDownloadUrl={
									beSupport?
									`${ROOT}/pdf/exportCountSub/by/ass?begin=${issuedate ? begin : ''}&end=${end}&assId=${assId}&acId=${acId}&assCategory=${assCategory}&assIdTwo=${assIdTwo}&assCategoryTwo=${assCategoryTwo}`
									:
									`${ROOT}/pdf/exportCountSub?${URL_POSTFIX}&begin=${issuedate ? begin : ''}&end=${end}&acid=${acid ? acid : ''}&assid=${assid ? assid : ''}&asscategory=${currentAsscategory ? encodeURI(encodeURI(currentAsscategory)) : encodeURI(encodeURI(''))}`
								}
								// ddPDFCallback={(value) => {
								// 	beSupport?
								// 	dispatch(allActions.allExportReceiverlist(value, 'pdfCountSubAss', {beginYear,beginMonth, endYear, endMonth, assId,assCategory,assIdTwo,assCategoryTwo,acId}))
								// 	:
								// 	dispatch(allActions.allExportReceiverlist(value, 'pdfCountSub', {begin: begin, end: end, acid: `${acid ? acid : ''}`, assid: `${assid ? assid : ''}`, asscategory: `${currentAsscategory ? currentAsscategory : ''}`}))
								// }}
								ddPDFCallback={(value) => {
									if(!judgePermission(detailList.get('EXPORT_STATEMENT_PDF')).disabled){
										beSupport?
										dispatch(allActions.allExportReceiverlist(value, 'pdfCountSubAss', {beginYear,beginMonth, endYear, endMonth, assId,assCategory,assIdTwo,assCategoryTwo,acId}))
										:
										dispatch(allActions.allExportReceiverlist(value, 'pdfCountSub', {begin: begin, end: end, acid: `${acid ? acid : ''}`, assid: `${assid ? assid : ''}`, asscategory: `${currentAsscategory ? currentAsscategory : ''}`}))
									}else{
										message.info('当前角色无该请求权限')
									}
								}}
								//所有明细表Excel
								allexcelDownloadUrl={
									beSupport?
									`${ROOT}/excel/export/countSubAll/by/ass?begin=${issuedate ? begin : ''}&end=${end}&assId=${assId}&acId=${acId}&assCategory=${assCategory}&assIdTwo=${assIdTwo}&assCategoryTwo=${assCategoryTwo}`
									:
									`${ROOT}/excel/export/CountSubAll?${URL_POSTFIX}&begin=${issuedate ? begin : ''}&end=${end}`
								}
								// allddExcelCallback={(value) => {
								// 	beSupport?
								// 	dispatch(allActions.allExportReceiverlist(value, 'excelcountSubAllByAss', {begin: begin, end: end,assId,assCategory,assIdTwo,assCategoryTwo,acId}))
								// 	:
								// 	dispatch(allActions.allExportReceiverlist(value, 'excelcountSubAll', {begin: begin, end: end}))
								// }}
								allddExcelCallback={(value) => {
									if(!judgePermission(detailList.get('EXPORT_STATEMENT_EXCEL')).disabled){
										beSupport?
										dispatch(allActions.allExportReceiverlist(value, 'excelcountSubAllByAss', {begin: begin, end: end,assId,assCategory,assIdTwo,assCategoryTwo,acId}))
										:
										dispatch(allActions.allExportReceiverlist(value, 'excelcountSubAll', {begin: begin, end: end}))
									}else{
										message.info('当前角色无该请求权限')
									}
								}}
								onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '数量明细表',
									}))
								}}
								>
							</Export>
						</span>
						<Button
	                        className="title-right refresh-btn"
	                        type="ghost"
	                        onClick={() => debounce(() => {
								dispatch(allActions.freshMxbPage('数量明细表'))
								beSupport?
								dispatch(AmmxbActions.getMxbAsslistFetch(issuedate,endissuedate,assCategory,acId,acName, assId,assName,assIdTwo,assCategoryTwo,assTwoName))
								:
								dispatch(AmmxbActions.getPeriodAndMxbAclistFetch(firstyear ? issuedate : 'NO_VALID_ISSUE_DATE', endissuedate, currentAcid))
							})()}
	                        >
	                        刷新
	                    </Button>
                	</div>
				</FlexTitle>
				<TableWrap className="table-flex-mxb table-tree-wrap" notPosition={true}>
					<Table
						dispatch={dispatch}
						acinfo={acinfo}
						ledger={ledger}
						jvlist={jvlist}
						vcindexList={vcindexList}
						issuedate={issuedate}
						unitDecimalCount={unitDecimalCount}
						beSupport={beSupport}
						currentPage={currentPage}
						pageCount={pageCount}
						paginationCallBack={(value) =>{
							beSupport?
							dispatch(AmmxbActions.getMxbAsslistFetch(issuedate,endissuedate,assCategory,acId,acName, assId,assName,assIdTwo,assCategoryTwo,assTwoName,value))
							:
							dispatch(AmmxbActions.getPeriodAndMxbAclistFetch(firstyear ? issuedate : 'NO_VALID_ISSUE_DATE', endissuedate, currentAcid,clickAsscategory, clickAssid,value))
						}}
					/>
					<TreeContain
						dispatch={dispatch}
						aclist={aclist}
						issuedate={issuedate}
						cascadeAclist={beSupport?assMxbTree(asslist.toJS(),true):changeAmmxbDataToTree(aclist.toJS())}
						currentAcid={currentAcid}
						assid={assid}
						currentAsscategory={currentAsscategory}
						currentSupportPos={currentSupportPos}
						endissuedate={endissuedate}
						chooseperiods={chooseperiods}
						assCategory={assCategory}
						beSupport={beSupport}
						asslist={asslist}
						currentPage={currentPage}
						pageCount={pageCount}
					/>
				</TableWrap>
				{/* { showPzBomb ? <PzBomb/> : '' } */}
			</ContainerWrap>
		)
	}
}
