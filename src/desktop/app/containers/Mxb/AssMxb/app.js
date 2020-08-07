import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { fromJS, Map, List } from 'immutable'

import * as assmxbActions from 'app/redux/Mxb/AssMxb/assMxb.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as kmmxbActions from 'app/redux/Mxb/Kmmxb/kmmxb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

import PageSwitch from 'app/containers/components/PageSwitch'
import { Select, Checkbox, Button, Menu, Dropdown, Icon, message } from 'antd'
const Option = Select.Option
import JvItem from './JvItem.jsx'
import TreeContain from './TreeContain.jsx'
import Table from './Table.jsx'
import { assMxbTree, DateLib, judgePermission } from 'app/utils'
import { ROOT } from 'app/constants/fetch.constant.js'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'
import { TableWrap, TableBody, TableItem, TableTitle, TableOver, TableAll, Export } from 'app/components'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import './style/index.less'

@connect(state => state)
export default
class AssMxb extends React.Component {

	componentDidMount() {
		const { dispatch, allState } = this.props
		const previousPage = sessionStorage.getItem('previousPage')
		if (previousPage === 'home') {
			sessionStorage.setItem('previousPage', '')
			dispatch(assmxbActions.getPeriodAndMxbAclistFetch())
		}
	}

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.assmxbState != nextprops.assmxbState || this.props.homeState != nextprops.homeState
	}

	render() {
		const { dispatch, allState, assmxbState, homeState } = this.props
		//辅助余额表
		const detailList = homeState.getIn(['data','userInfo','pageController','BALANCE_DETAIL','preDetailList','ASS_BALANCE_STATEMENT','detailList'])
		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
		const PzPermissionInfo = homeState.getIn(['permissionInfo', 'Pz'])

		const assTags = allState.get('assTags')
		const issues = allState.get('issues')
		const firstyear = allState.getIn(['period', 'firstyear'])
		// const showPzBomb = allState.get('showPzBomb')

		const issuedate = assmxbState.get('issuedate')
		const endissuedate = assmxbState.get('endissuedate')
		const currentAssCategory = assmxbState.get('currentAssCategory')
		const chooseperiods = assmxbState.get('chooseperiods')
		const selectedKeys = assmxbState.get('selectedKeys')

		// 科目数
		const assmxbAclist = assmxbState.get('assmxbAclist')
		const assCateTree = assmxbAclist.toJS()

		// 明细列表
		const reportassdetail = assmxbState.get('reportassdetail')
		const acid = reportassdetail.get('acid')
		const acfullname = reportassdetail.get('acfullname')
		const assid = reportassdetail.get('assid')
		const assname = reportassdetail.get('assname')
		const assidTwo = assmxbState.get('assidTwo')
		const asscategoryTwo = assmxbState.get('asscategoryTwo')
		const assNameTwo = assmxbState.get('assNameTwo')
		const closingbalance = reportassdetail.get('closingbalance')
		const openingbalance = reportassdetail.get('openingbalance')
		const debit = reportassdetail.get('debit')
		const credit = reportassdetail.get('credit')
		const assjvlist = reportassdetail.get('jvlist')
		const currentPage = assmxbState.get('currentPage') === undefined ? 0 : assmxbState.get('currentPage')
		const pageCount = assmxbState.get('pageCount') === undefined ? 0 : assmxbState.get('pageCount')
		const openedyear = allState.getIn(['period', 'openedyear'])
		const openedmonth = allState.getIn(['period', 'openedmonth'])

		//导出
		let assNamesTwo = assNameTwo=='全部' || assNameTwo=='' ? '' : assNameTwo.split(Limit.TREE_JOIN_STR)[1]
		let asscategoryTwos = assNameTwo=='全部' || assNameTwo=='' ? '' : asscategoryTwo
        if(assNamesTwo === '全部'){
            assNamesTwo = ''
			asscategoryTwos = ''
        }

		// 第二个选择框能选的日期列表
		const idx = issues.findIndex(v => v === issuedate)
        const nextperiods = issues.slice(0, idx)

		const hash = {}
		const vcindexList = (assjvlist && assjvlist.size) ? (assjvlist.map(v => [v.get('vcdate'), v.get('vcindex')].join('_')).filter(w => hash[w] ? false : hash[w] = true)) : fromJS([])

		// 一键收付
		const paymentList = ['1122', '2202']

		const paymentable = ((acid) => {
			if (!acid) {
				return false
			}
			else {
				if (paymentList.indexOf(acid.substr(0, 4)) > -1 && assmxbAclist.size) {
					// 取当前类别下的aclist的‘upperid’， 以判断是否是末端科目
					const needAssmxbAclist = assmxbAclist.filter(v => v.get('assid') === assid)
					const acDtoList = needAssmxbAclist.size ? needAssmxbAclist.getIn([0, 'acDtoList']) : fromJS([])
					const ac = acDtoList.size ? acDtoList.find(v => v.get('acid') === acid) : fromJS({})
					const currentAcUpperidList = acDtoList.map(v => v.get('upperid'))

					if (currentAcUpperidList.indexOf(acid) === -1) {
						if (ac && ac.size && ac.get('assList') && ac.get('assList').size) {
							if (assidTwo) {
								return true
							} else {
								return false
							}
						} else {
							return true
						}
					}
					return false
				} else {
					return false
				}
			}
		})(acid)

		// 一键结转判断
		let transferable = false
		let curAssAcList = fromJS({})
		let transferAcList = fromJS([])
		let needJudgeList = fromJS([])

		const endYear = endissuedate.substr(0, 4)
		const endMonth = endissuedate.substr(6, 2)

		if (assid) { //满足基本条件

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

			// 账期为第一个未结账账期
			// if (endissuedate === `${openedyear}年第${openedmonth}期`) {
			if (showtransfer) {
				// 取当前选中的辅助核算及acDtoList
				curAssAcList = assmxbAclist.filter(v => v.get('assid') === assid)
				const acDtoList = curAssAcList.size ? curAssAcList.getIn([0, 'acDtoList']) : fromJS([])
				needJudgeList = acDtoList.size ? acDtoList.filter(v => v.get('acid').indexOf('4') === 0) : needJudgeList
				const upperidList = needJudgeList.size ? needJudgeList.map(v => v.get('upperid')) : fromJS([])

				if (acid) {
					if (acid.indexOf('4') === 0) {
						if (needJudgeList.size) {
							transferAcList = needJudgeList.filter(v => {
								// 是否是科目下级
								const isNeedAc = v.get('acid').indexOf(acid) === 0
								// 是否是末端
								const isTaleAc = upperidList.indexOf(v.get('acid')) < 0
								// 是否有发生额
								const isNotZero = (v.get('assList').size ? v.get('assList').some(v => v.get('closingbalance') !== 0) : v.get('closingbalance') !== 0)

								if (isNeedAc && isTaleAc && isNotZero) {
									return true
								} else {
									return false
								}
							})
						}
					}
				} else {
					if (acDtoList.every(v => v.get('acid').indexOf('4') === 0)) {
						transferAcList = acDtoList.filter(v => {
							const isTaleAc = upperidList.indexOf(v.get('acid')) < 0
							const isNotZero = (v.get('assList').size ? v.get('assList').some(v => v.get('closingbalance') !== 0) : v.get('closingbalance') !== 0)
							if (isTaleAc && isNotZero) {
								return true
							} else {
								return false
							}
						})
					}
				}
				transferable = !!transferAcList.size
			}
		}

		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		return (
			<ContainerWrap type="mxb-one" className="assMxb">
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread || pageList.getIn(['Mxb','pageList']).size <= 1 ? '' :
							<PageSwitch
								pageItem={pageList.get('Mxb')}
								onClick={(page, name, key) => {
									if (pageList.getIn(['Mxb','pageList']).indexOf('辅助明细表') === -1) {
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
	                        onChange={(value) => dispatch(assmxbActions.getAssMxbAclistFetch(value, value, currentAssCategory))}
	                        >
	                        {issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
	                    </Select>
	                    <span className="title-checkboxtext" onClick={() => {
							if (chooseperiods && endissuedate !== issuedate) {
								dispatch(assmxbActions.getAssMxbAclistFetch(issuedate, issuedate, currentAssCategory))
							}
							dispatch(assmxbActions.changeAssmxbChooseperiods())
						}}>
	                        <Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
	                        <span>至</span>
	                    </span>
	                    <Select
	                        disabled={!chooseperiods}
	                        className="title-date"
	                        value={endissuedate === issuedate ? '' : endissuedate}
	                        onChange={(value) => dispatch(assmxbActions.getAssMxbAclistFetch(issuedate, value, currentAssCategory, assid))}
	                        >
	                        {nextperiods.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
	                    </Select>
						<span className="assmxbcategory-select">
							<span className="assmxbcategory-select-title">辅助类别：</span>
							<span>
								<Select
									style={{width: 150}}
									className="assmxbcategory-select-item"
									value={currentAssCategory}
									onChange={(value) => dispatch(assmxbActions.getAssMxbAclistFetch(issuedate, endissuedate, value))}>
									{assTags.map(v => <Option key={v} value={v}>{v}</Option>)}
								</Select>
							</span>
						</span>
					</div>
					<div className="flex-title-right">
						<Button
							style={{display: paymentable && reportassdetail.get('closingbalance') != 0 && PzPermissionInfo.getIn(['edit', 'permission']) ? '' : 'none'}}
							className="title-right"
							type="ghost"
							onClick={() => dispatch(kmmxbActions.mxbConvenientPaymentToLrpz(acid.substr(0, 4), currentAssCategory, 'assmxb'))}
							>
							一键收/付款
						</Button>
						{
							transferable && (assidTwo ? closingbalance : true) && PzPermissionInfo.getIn(['edit', 'permission']) ?
							<Button
								className="title-right"
								type="ghost"
								onClick={() => {
									if (assidTwo) {
										dispatch(kmmxbActions.assMxbTransferToLrpz(transferAcList, curAssAcList, assidTwo, endYear, endMonth))
									} else {
										let num = 0
										transferAcList.forEach(v => v.get('assList').size ? num = num + v.get('assList').size : num++)
										if (num >= 30) {

											thirdParty.Alert('处理分录数量过大，系统将处理前29条分录。您可多次操作“一键结转”直至全部处理完毕。', '', '', () => dispatch(kmmxbActions.assMxbTransferToLrpz(transferAcList, curAssAcList, assidTwo, endYear, endMonth)))

											// dispatch(mxbActions.assMxbTransferToLrpz(transferAcList, curAssAcList, assidTwo))
										} else {
											dispatch(kmmxbActions.assMxbTransferToLrpz(transferAcList, curAssAcList, assidTwo, endYear, endMonth))
										}
									}

								}}
							>
								一键结转
							</Button>
							: ''
						}
						<span className="title-right title-dropdown">
							<Export
								isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
								type={'fourth'}
								// exportDisable={!issuedate || !reportPermissionInfo.getIn(['exportExcel', 'permission'])}
								exportDisable={!issuedate || isPlay}
								// excelDownloadUrl={`${ROOT}/excel/export/AssSubOne?network=wifi&source=desktop&begin=${issuedate ? issuedate.substr(0,4) + '' + issuedate.substr(6,2) : ''}&end=${endissuedate ? endissuedate.substr(0,4) + '' + endissuedate.substr(6,2) : ''}&acid=${acid ? acid : ''}&assid=${assid ? assid : ''}&assName=${assname ? encodeURI(encodeURI(assname)) : ''}&asscategory=${encodeURI(encodeURI(currentAssCategory))}&asscategoryTwo=${encodeURI(encodeURI(asscategoryTwos))}&assNameTwo=${encodeURI(encodeURI(assNamesTwo))}&assIdTwo=${assidTwo}`}
								excelDownloadUrl={`${ROOT}/excel/export/AssSubOne?${URL_POSTFIX}&begin=${issuedate ? issuedate.substr(0,4) + '' + issuedate.substr(6,2) : ''}&end=${endissuedate ? endissuedate.substr(0,4) + '' + endissuedate.substr(6,2) : ''}&acid=${acid ? acid : ''}&assid=${assid ? assid : ''}&assName=${assname ? encodeURI(encodeURI(assname)) : ''}&asscategory=${encodeURI(encodeURI(currentAssCategory))}&asscategoryTwo=${encodeURI(encodeURI(asscategoryTwos))}&assNameTwo=${encodeURI(encodeURI(assNamesTwo))}&assIdTwo=${assidTwo}`}
								// 辅助明细表Excel
								// ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'assmxbexcelsubone', {begin:issuedate.substr(0,4) + '' + issuedate.substr(6,2),
								// end:endissuedate.substr(0,4) + '' + endissuedate.substr(6,2),
								// acid:acid ? acid : '',
								// assid:assid ? assid :'',
								// assname:assname ? assname:'',
								// asscategory:currentAssCategory,
								// asscategoryTwo:asscategoryTwos,
								// assNameTwo:assNamesTwo,
								// assIdTwo:assidTwo}))}
								ddExcelCallback={(value) => {
                                    if(!judgePermission(detailList.get('EXPORT_STATEMENT_EXCEL')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'assmxbexcelsubone', {begin:issuedate.substr(0,4) + '' + issuedate.substr(6,2),
											end:endissuedate.substr(0,4) + '' + endissuedate.substr(6,2),
											acid:acid ? acid : '',
											assid:assid ? assid :'',
											assname:assname ? assname:'',
											asscategory:currentAssCategory,
											asscategoryTwo:asscategoryTwos,
											assNameTwo:assNamesTwo,
											assIdTwo:assidTwo}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }
                                }}

								PDFDownloadUrl={`${ROOT}/pdf/exportsubass?${URL_POSTFIX}&begin=${issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}` : ''}&end=${endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : ''}&acid=${acid}&assid=${assid? assid :''}&assName=${assname ? encodeURI(encodeURI(assname)) : ''}&asscategory=${encodeURI(encodeURI(currentAssCategory))}&asscategoryTwo=${encodeURI(encodeURI(asscategoryTwos))}&assNameTwo=${encodeURI(encodeURI(assNamesTwo))}&assIdTwo=${assidTwo}`}
								// 辅助明细表PDF
								// ddPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'pdfassmxboneexport', {
								// 	begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`,
								// 	end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`,
								// 	assName:`${assname ? assname :''}`,
								// 	assid: `${assid ? assid : ''}`,
								// 	acid: `${acid ? acid : ''}`,
								// 	asscategory: `${currentAssCategory ? currentAssCategory : ''}`,
								// 	asscategoryTwo:asscategoryTwos,
								// 	assNameTwo:assNamesTwo,
								// 	assIdTwo:assidTwo}))}
								ddPDFCallback={(value) => {
                                    if(!judgePermission(detailList.get('EXPORT_STATEMENT_PDF')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'pdfassmxboneexport', {
											begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`,
											end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`,
											assName:`${assname ? assname :''}`,
											assid: `${assid ? assid : ''}`,
											acid: `${acid ? acid : ''}`,
											asscategory: `${currentAssCategory ? currentAssCategory : ''}`,
											asscategoryTwo:asscategoryTwos,
											assNameTwo:assNamesTwo,
											assIdTwo:assidTwo}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }
                                }}

								// allexcelDownloadUrl={`${ROOT}/excel/export/AssSubAll?network=wifi&source=desktop&begin=${issuedate ? issuedate.substr(0,4) + '' + issuedate.substr(6,2) : ''}&end=${endissuedate ? endissuedate.substr(0,4) + '' + endissuedate.substr(6,2) : ''}&asscategory=${encodeURI(encodeURI(currentAssCategory))}`}
								allexcelDownloadUrl={`${ROOT}/excel/export/AssSubAll?${URL_POSTFIX}&begin=${issuedate ? issuedate.substr(0,4) + '' + issuedate.substr(6,2) : ''}&end=${endissuedate ? endissuedate.substr(0,4) + '' + endissuedate.substr(6,2) : ''}&asscategory=${encodeURI(encodeURI(currentAssCategory))}`}
								// allddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'assmxbexcelsuball', {begin:issuedate.substr(0,4) + '' + issuedate.substr(6,2), end:endissuedate.substr(0,4) + '' + endissuedate.substr(6,2), asscategory:currentAssCategory}))}
								// 辅助所有明细表Excel
								allddExcelCallback={(value) => {
                                    if(!judgePermission(detailList.get('EXPORT_STATEMENT_EXCEL')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'assmxbexcelsuball', {begin:issuedate.substr(0,4) + '' + issuedate.substr(6,2), end:endissuedate.substr(0,4) + '' + endissuedate.substr(6,2), asscategory:currentAssCategory}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }
                                }}
								
								// allPDFDownloadUrl={`${ROOT}/pdf/exportsubassall?network=wifi&source=desktop&begin=${issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}` : ''}&end=${endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : ''}&asscategory=${currentAssCategory ? encodeURI(encodeURI(currentAssCategory)) : encodeURI(encodeURI(''))}`}
								allPDFDownloadUrl={`${ROOT}/pdf/exportsubassall?${URL_POSTFIX}&begin=${issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}` : ''}&end=${endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : ''}&asscategory=${currentAssCategory ? encodeURI(encodeURI(currentAssCategory)) : encodeURI(encodeURI(''))}`}
								// 辅助所有明细表pdf
								// allddPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'pdfassmxballexport', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`, asscategory: `${currentAssCategory ? currentAssCategory : ''}`}))}
								allddPDFCallback={(value) => {
                                    if(!judgePermission(detailList.get('EXPORT_STATEMENT_PDF')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'pdfassmxballexport', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`, asscategory: `${currentAssCategory ? currentAssCategory : ''}`}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }
                                }}
								
								
								onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '辅助明细表',
									}))
								}}
								>
							</Export>
						</span>
						<Button
	                        className="title-right refresh-btn"
	                        type="ghost"
	                        onClick={() => {
								dispatch(allActions.freshMxbPage('辅助明细表'))
								dispatch(assmxbActions.getPeriodAndMxbAclistFetch(issuedate, endissuedate, currentAssCategory, assid, assidTwo, asscategoryTwo, assNameTwo, acid))
							}}
	                        >
	                        刷新
	                    </Button>
	                </div>
				</FlexTitle>
				<TableWrap className="table-normal-with-new table-flex-mxb" notPosition={true}>
					<Table
						acid={acid}
						assid={assid}
						debit={debit}
						credit={credit}
						assname={assname}
						assjvlist={assjvlist}
						acfullname={acfullname}
						closingbalance={closingbalance}
						openingbalance={openingbalance}
						dispatch={dispatch}
						vcindexList={vcindexList}
						currentPage={currentPage}
						pageCount={pageCount}
						assNameTwo={assNameTwo}
						paginationCallBack={(value) => dispatch(assmxbActions.getreportassdetailFetch(issuedate, endissuedate, acid ? acid : '', assid, currentAssCategory, assidTwo, asscategoryTwo, assNameTwo, value, selectedKeys))}
					/>
					<TreeContain
						assmxbAclist={assmxbAclist}
						selectedKeys={selectedKeys}
						dispatch={dispatch}
						issuedate={issuedate}
						endissuedate={endissuedate}
						cascadeAclist={assMxbTree(assCateTree)}
					/>
				</TableWrap>
				{/* { showPzBomb ? <PzBomb/> : '' } */}
			</ContainerWrap>
		)
	}
}
