import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'

import * as cxpzActions from 'app/redux/Search/Cxpz/cxpz.action'
import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as lrpzExportActions from 'app/redux/Edit/Lrpz/lrpzExport.action.js'
import * as allActions from 'app/redux/Home/All/other.action'
import * as acAllActions from 'app/redux/Home/All/aclist.actions'
import * as thirdParty from 'app/thirdParty'
import { TopMonthPicker, ScrollLoad } from 'app/containers/components'
import { Button, ButtonGroup, Icon, Container, Row, ScrollView, SearchBar, Single } from 'app/components'

import Vc from './Vc.jsx'
import './cxpz.less'

@connect(state => state)
export default
class Cxpz extends React.Component {
	// static propTypes = {
	// 	dispatch: PropTypes.func,
	// 	history: PropTypes.object,
	// 	allState: PropTypes.instanceOf(Map),
	// 	cxpzState: PropTypes.instanceOf(Map)
	// }
	/*begin: po 20161104, xxxxxx */
	componentDidMount() {
		thirdParty.setTitle({title: '查询凭证'})
		thirdParty.setIcon({
            showIcon: false
        })
		// thirdparty.setRight({show: false})
		if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(cxpzActions.changeData('searchContentType', 'PROPERTY_ZONGHE'))
			this.props.dispatch(cxpzActions.changeData('condition', ''))
			this.props.dispatch(cxpzActions.getPeriodAndVcListFetch())
			// this.props.dispatch(acAllActions.getAcListandAsslistFetch())
		}
		if(sessionStorage.getItem('prevPage') === 'cxpz'){
			sessionStorage.removeItem('prevPage')
			const {dispatch,cxpzState} = this.props
			dispatch(cxpzActions.pagingVc(cxpzState.get('issuedate')))
		}
	}
	/*end*/
	render() {
		const {
			dispatch,
			cxpzState,
			allState,
			history,
			homeState
		} = this.props

		const pzPermissionInfo = homeState.getIn(['permissionInfo', 'Pz'])
		const editPermission = pzPermissionInfo.getIn(['edit', 'permission'])
		const arrangePermission = pzPermissionInfo.getIn(['arrange', 'permission'])

		const allCheckboxDisplay = cxpzState.get('allCheckboxDisplay')
		const toolBarDisplayIndex = cxpzState.get('toolBarDisplayIndex')
		const vclist = cxpzState.get('vclist')
		const issuedate = cxpzState.get('issuedate')
		const currentPage = cxpzState.get('currentPage')
		const pageCount = cxpzState.get('pageCount')
		// 是否有非零个vcitem被选中
		const nonZeroVcItemBool = cxpzState.get('vclist').some(v => v.get('selected'))
		const issues = allState.get('issues')
		const firstDate = issues.getIn([0,'value'])
        const lastDate = issues.getIn([issues.size - 1,'value'])

		const maxVcIndex = cxpzState.get('maxVcIndex')
		const vclistLength = cxpzState.get('vclistLength')

		const period = allState.get('period')
		const year = allState.getIn(['period', 'openedyear'])
		const month = allState.getIn(['period', 'openedmonth'])

		const closedby = vclist.getIn([0, 'closedby']) ? true : false
		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('excelsend', {year: issuedate.substr(0, 4), month: issuedate.substr(5, 2), 'exportModel':'vc', action: 'QUERY_VC-BATCH_EXPORT_EXCEL'}))

		const vcindexlist = vclist.filter(v => v.get('selected')).map(v => v.get('vcindex'))
		const ddPDFCallback = (needA4, needCreatedby, needAss) => dispatch => dispatch(allActions.allExportDo('cxpzpdfexport', {year: issuedate.substr(0, 4), month: issuedate.substr(5, 2), 'vcIndexList': vcindexlist, needA4, needCreatedby, needAss}))

		nonZeroVcItemBool ? dispatch(allActions.navigationSetMenu('PDF-vc', ddPDFCallback)) : dispatch(allActions.navigationSetMenu('excel-vc', ddPDFCallback, ddExcelCallback))
		// 有没有开启附件
		const moduleInfo = this.props.homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_GL') > -1 ? true : false) : false
		const intelligentStatus = moduleInfo ? (moduleInfo.indexOf('RUNNING_GL') > -1 ? true : false) : false

		const cardTypeList = [
			{key: '综合', value: 'PROPERTY_ZONGHE'},
			{key: '摘要', value: 'PROPERTY_ABSTRACT'},
			{key: '科目', value: 'PROPERTY_AC'},
			{key: '金额', value: 'PROPERTY_AMOUNT'},
			{key: '制单人', value: 'PROPERTY_MAKER'},
		]
		const searchContentType = cxpzState.get('searchContentType')
		const condition = cxpzState.get('condition')

		return (
			<Container className="cxpz">
				<TopMonthPicker
					issuedate={issuedate}
					source={issues} //默认显示日期
					callback={(value) => dispatch(cxpzActions.pagingVc(value))}
					onOk={(result) => dispatch(cxpzActions.pagingVc(result.value))}
				/>
				
				<div className='cxpz-flex cxpz-margin-bottom'>
					<Single
					    className='left'
				    	district={cardTypeList}
				    	value={searchContentType}
				    	canSearch={false}
				    	onOk={value => {
							dispatch(cxpzActions.changeData('searchContentType', value.value))
				    	}}
				    >
				    	<div className='cxpz-flex'>
				    		<div>{{'PROPERTY_ZONGHE': '综合','PROPERTY_ABSTRACT': '摘要','PROPERTY_AC': '科目','PROPERTY_AMOUNT': '金额','PROPERTY_MAKER': '制单人',}[searchContentType]}</div>
				    		<Icon type="triangle"/>
				    	</div>
				    </Single>
					<div className='search-right'>
						<SearchBar
						    placeholder='搜索凭证'
							value={condition}
							showCancelButton={false}
						    onChange={(value) => {
								dispatch(cxpzActions.changeData('condition', value))
							}}
							onSubmit={(value) => {
								dispatch(cxpzActions.pagingVc(issuedate))
							}}
							onClear={() => {
								dispatch(cxpzActions.changeData('condition', ''))
								dispatch(cxpzActions.pagingVc(issuedate))
							}}
						/>
					</div>					
				</div>

				<ScrollView flex="1" uniqueKey="cxpz-scroll" savePosition>
					<div className='cxpz-scroll-content'>
						{vclist.map((v, i) =>
							<Vc
								allCheckboxDisplay={allCheckboxDisplay}
								idx={i}
								key={i}
								vcitem={v}
								dispatch={dispatch}
								history={history}
								vclist={vclist}
								intelligentStatus={intelligentStatus}
							/>
						)}
					</div>

					<ScrollLoad
						// diff={1}
						classContent='cxpz-scroll-content'
						callback={(_self) => {
							// dispatch(cxAccountActions.getBusinessList(currentPage + 1, true,  _self))
							dispatch(cxpzActions.pagingVc(issuedate, currentPage, true,  _self))
						}}
						isGetAll={currentPage >= pageCount}
						itemSize={vclist.size}
					/>
					{/* <button style={{display: currentPage >= pageCount ? 'none': ''}} className="loadingmorevc" onClick={() => {
						// if (currentPage >= pageCount){
						// 	return thirdParty.Alert('只有这么多的数据')
						// }
						dispatch(cxpzActions.pagingVc(issuedate, currentPage))
					}}>点击加载更多</button> */}
				</ScrollView>
				<Row>
					<ButtonGroup type="ghost" style={{display: toolBarDisplayIndex === 1 ? '' : 'none'}}>
						<Button
							disabled={!editPermission}
							onClick={() => {

								let vcdate = ''
								const now = new Date()
								const nowYear = now.getFullYear()
								const nowMonth = now.getMonth() + 1

								const issyear = issuedate.substr(0, 4)
								const issmonth = issuedate.substr(5, 2)

								if (!year) {
									vcdate = new Date()
								} else if (closedby) { // 本期已结账的取未结账第一期的第一天或最后一天或今天
									// vcdate = new Date(year, month, 0)
									const lastDate = new Date(year, month, 0)
									if (lastDate < now) {   //本月之前
										vcdate = lastDate
									} else if (Number(year) == Number(nowYear) && Number(month) == Number(nowMonth)) {  //本月
										vcdate = now
									} else {   //本月之后
										vcdate = new Date(year, Number(month)-1, 1)
									}
								} else { // 本月未结账 取本月的第一天或最后一天或今天
									vcdate = new Date(issyear, issmonth, 0)

									const lastDate = new Date(issyear, issmonth, 0)
									if (lastDate < now) {   //本月之前
										vcdate = lastDate
									} else if (Number(issyear) == Number(nowYear) && Number(issmonth) == Number(nowMonth)) {  //本月
										vcdate = now
									} else {   //本月之后
										vcdate = new Date(issyear, Number(issmonth)-1, 1)
									}
								}

								dispatch(lrpzExportActions.initLrpz())
								dispatch(lrpzExportActions.getLastVcIdFetch(vcdate))
								history.push('/lrpz')
								// dispatch(acAllActions.getAcListandAsslistFetch())
								sessionStorage.setItem('router-from', 'cxpz')
								sessionStorage.setItem('lrpzHandleMode', 'insert')
								dispatch(lrpzExportActions.setCkpzIsShow(false))

							}}
							>
							<Icon type="add-plus"/>
							<span>新增</span>
						</Button>
						<Button
							disabled={!arrangePermission || closedby || vclist.size === 0}
							style={{display: intelligentStatus ? 'none' : ''}}
							onClick={() => {
								thirdParty.actionSheet({
									title: "选择整理方式",
									cancelButton: "取消",
									otherButtons: ["按凭证号顺次前移补齐断号", "按凭证日期重新顺次编号"],
									onSuccess: function(result) {
										if (result.buttonIndex == -1)
											return
										dispatch(cxpzActions.getSortVcFetch(issuedate, result.buttonIndex+1))
									}
								})
							}}
							>
							<Icon type="settle"/>
							<span>整理</span>
						</Button>
						<Button
							style={{display: enCanUse ? '' : 'none'}}
							onClick={() => {
								dispatch(cxpzActions.setFjglData())
								history.push('/fjgl')
							}}
							>
							<Icon type="fujian"/>
							<span>附件</span>
						</Button>
						<Button
							disabled={vclist.size === 0}
							onClick={() => dispatch(cxpzActions.changeVcCheckBoxDisplay())}
							>
							<Icon type="select"/>
							<span>选择</span>
						</Button>
					</ButtonGroup>
					<ButtonGroup type="ghost" style={{display: toolBarDisplayIndex === 2 ? '' : 'none'}}>
						<Button onClick={() => dispatch(cxpzActions.selectVcAll())}><Icon type="choose"/><span>全选</span></Button>
						<Button onClick={() => dispatch(cxpzActions.cancelChangeVcCheckBoxDisplay())}><Icon type="cancel"/><span>取消</span></Button>
						<Button
							disabled={!nonZeroVcItemBool || closedby || !editPermission || vclist.some(v => v.get('selected') && v.get('reviewedby'))} 
							onClick={() => dispatch(cxpzActions.deleteVcFetch(cxpzState))}>
								<Icon type="delete"/>
								<span>删除</span>
						</Button>
						<Button disabled={ !(vclist.some(v => v.get('selected') && !v.get('reviewedby'))) || !editPermission } 
						    onClick={() => {dispatch(cxpzActions.reviewedJvlist(issuedate))}}
						>
						<Icon type='shenhe'/><span>审核</span>
					    </Button>
					    <Button disabled={ !(vclist.some(v => v.get('selected') && v.get('reviewedby'))) || !editPermission } 
					        onClick={() => {dispatch(cxpzActions.cancelReviewedJvlist(issuedate))}}
					    >
						    <Icon type='chexiao'/><span>反审核</span>
					    </Button>
					</ButtonGroup>
				</Row>
			</Container>
		)
	}
}
