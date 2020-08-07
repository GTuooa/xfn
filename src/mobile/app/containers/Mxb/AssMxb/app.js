import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { toJS, Map }	from 'immutable'
import { ButtonGroup, Button, Container, Row, ScrollView, Icon, SinglePicker, Amount } from 'app/components'
import Jv from './Jv.jsx'
import * as thirdParty from 'app/thirdParty'
import { TopMonthPicker } from 'app/containers/components'
import './assMxb.less'

import * as assMxbActions from 'app/redux/Mxb/AssMxb/assMxb.action'
import * as allActions from 'app/redux/Home/All/other.action'
import * as acAllActions from 'app/redux/Home/All/aclist.actions'

@connect(state => state)
export default
class AssMxb extends React.Component {

	componentDidMount() {
		if (sessionStorage.getItem('previousPage') === 'assYeb') {
			sessionStorage.removeItem('previousPage')
			// this.props.dispatch(acAllActions.getAcListandAsslistFetch())
		}
		if(sessionStorage.getItem('prevPage')==='cxpz'){
			sessionStorage.removeItem('prevPage')
			const {dispatch,assMxbState} = this.props
			const reportassdetail = assMxbState.get('reportassdetail')
			const assmxbAclist = assMxbState.get('assmxbAclist')
			dispatch(assMxbActions.getAssMxbAclistAndReportdetailFetch(assMxbState.get('issuedate'),
				assMxbState.get('endissuedate'), reportassdetail.get('acid'),  reportassdetail.get('assid'), assmxbAclist.getIn([0, 'asscategory']),
				assMxbState.get('assidTwo'),  assMxbState.get('asscategoryTwo')
			))
		}
	}

	render() {
		const {
			dispatch,
			allState,
			assMxbState,
			history
		} = this.props
		thirdParty.setTitle({title: '辅助核算明细表'})

		const issues = allState.get('issues')
		const issuedate = assMxbState.get('issuedate')
		const endissuedate = assMxbState.get('endissuedate')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)

		const assmxbAclist = assMxbState.get('assmxbAclist')
		// const asscategory = assmxbAclist.getIn([0, 'asscategory'])
		const asscategory = assMxbState.get('asscategory')
		const assidTwo = assMxbState.get('assidTwo')
		const asscategoryTwo = assMxbState.get('asscategoryTwo')
		const doubleAss = assMxbState.get('doubleAss')


		const reportassdetail = assMxbState.get('reportassdetail')
		const jvlist = reportassdetail.get('jvlist')
		const openingbalance = reportassdetail.get('openingbalance')
		const closingbalance = reportassdetail.get('closingbalance')
		const acid = reportassdetail.get('acid')
		const acfullname = reportassdetail.get('acfullname')
		const assid = reportassdetail.get('assid')
		const assname = reportassdetail.get('assname')
		const disableTime = assmxbAclist.filter(v => v.get('assid') == assid ).getIn([0, 'disableTime'])

		// 可选的一级科目及其子科目
		let sourceAssAclist = []

		const acDtoList = assmxbAclist.filter(v => v.get('assid') === assid)

		acDtoList.size && acDtoList.getIn([0, 'acDtoList']).forEach(v => {
			sourceAssAclist.push({
				key: v.get('acid') + " " + v.get('acname'),
				value: v.get('acid')
			})
		})

		sourceAssAclist.length && sourceAssAclist.push({
			key: '全部',
			value: '全部'
		})

		const begin = issuedate.substr(0,4) + '' + issuedate.substr(5,2)
		const end = endissuedate ? (endissuedate.substr(0,4) + '' + endissuedate.substr(5,2)) : begin

		let assNameTwo = ''
        let asscategoryTwos = assidTwo ? asscategoryTwo : ''
        if (assidTwo) {
            assNameTwo = doubleAss.filter(v => v.get('value') == assidTwo).getIn([0,'key']).split(' ')[1]
        }

		// export
		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('assmxbexcelsubone', {begin: begin, end:end, acid:acid ? acid : '', assid, assname: assname, asscategory: asscategory, asscategoryTwo:asscategoryTwos,assNameTwo:assNameTwo,assIdTwo:assidTwo}))

		const ddPDFCallback = () => dispatch => dispatch(allActions.allExportDo('pdfassmxboneexport', {begin: begin, end: end, assName: assname, assid, acid: `${acid ? acid : ''}`, asscategory: asscategory,  asscategoryTwo:asscategoryTwos,assNameTwo:assNameTwo,assIdTwo:assidTwo}))

		const allddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('assmxbexcelsuball', {begin:begin, end:end, asscategory:asscategory}))

		dispatch(allActions.navigationSetMenu('mxb', ddPDFCallback, ddExcelCallback, '', allddExcelCallback))

		return (
			<Container className="assmxb">
				<TopMonthPicker
					issuedate={issuedate}
					source={issues} //默认显示日期
					callback={(value) => dispatch(assMxbActions.getAssMxbAclistAndReportdetailFetch(value, endissuedate, acid, assid, asscategory, assidTwo, asscategoryTwo))}
					onOk={(result) => dispatch(assMxbActions.getAssMxbAclistAndReportdetailFetch(result.value, endissuedate, acid, assid, asscategory, assidTwo, asscategoryTwo))}
					showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
						//dispatch(assMxbActions.changeAssMxBeginDate(result.value, false))
						dispatch(assMxbActions.getAssMxbAclistAndReportdetailFetch(result.value, '', acid, assid, asscategory, assidTwo, asscategoryTwo))
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						dispatch(assMxbActions.getAssMxbAclistAndReportdetailFetch(issuedate, result.value, acid, assid, asscategory, assidTwo, asscategoryTwo))
					}}
					changeEndToBegin={()=>{//跨期变为单期之后 使endissuedate为空 重新获取数据
						dispatch(assMxbActions.getAssMxbAclistAndReportdetailFetch(issuedate, '', acid, assid, asscategory, assidTwo, asscategoryTwo))
					}}
				/>
				<Row className="assmxb-title">
					<div className="assmxb-title-assinfo">
						<span className="assmxb-title-tip">
							辅助项目：
						</span>
						<span className={["assmxb-title-ass", disableTime ? 'lrb-item-disable' : ''].join(' ')}>{`${asscategory}_${assid} ${assname}`}</span>
					</div>
					<SinglePicker
                        // disabled={!hasVc}
                        district={sourceAssAclist}
                        onOk={(result) => {
							const acid = result.value === '全部' ? '' : result.value
							if (acid) {//不是全部加科目校验
								dispatch(assMxbActions.getAssMxbAclistAndReportdetailFetch(issuedate, endissuedate, acid, assid, asscategory, assidTwo, asscategoryTwo, true))
								return
							}
							dispatch(assMxbActions.getAssMxbAclistAndReportdetailFetch(issuedate, endissuedate, acid, assid, asscategory, assidTwo, asscategoryTwo))
						}}
                    >
						<div
							className="assmxb-title-acinfo"
							// onClick={() => {
							// 	thirdparty.chosen({
							// 		source : sourceAssAclist,
							// 		onSuccess: (result) => {
							// 			const acid = result.value === '全部' ? '' : result.value
							// 			if (acid) {//不是全部加科目校验
							// 				dispatch(assMxbActions.getAssMxbAclistAndReportdetailFetch(issuedate, endissuedate, acid, assid, asscategory, assidTwo, asscategoryTwo, true))
							// 				return
							// 			}
							// 			dispatch(assMxbActions.getAssMxbAclistAndReportdetailFetch(issuedate, endissuedate, acid, assid, asscategory, assidTwo, asscategoryTwo))
							// 		}
							// 	})
							// }}
							>
							<span className="assmxb-title-tip">
								科目选择：
							</span>
							<span className="assmxb-title-ac">{acid ? `${acid}_${acfullname}` : '全部'}</span>
							<Icon className="assmxb-title-acinfo-icon" type="arrow-down" size='12'/>
						</div>
					</SinglePicker>
				</Row>
				<Row className="assmxb-main-top">
					<span className="assmxb-main-amount-odd">期初<span className="assmxb-main-amount-odd-direction">(借方)</span></span>
					<Amount className="assmxb-main-amount">{openingbalance}</Amount>
				</Row>
				<ScrollView flex="1" uniqueKey="assmxb-scroll" savePosition>
					<ul className="assmxb-main-list">
						{jvlist.map((v, i) =>
							<Jv
								idx={i}
								key={i}
								jv={v}
								issuedate={issuedate}
								dispatch={dispatch}
								history={history}
								jvlist={jvlist}
							/>
						)}
						{jvlist.size ? '' : <div className="mxb-no-vc">暂无凭证</div>}
					</ul>
				</ScrollView>
				<Row className="assmxb-main-top">
					<span className="assmxb-main-amount-odd">期末<span className="assmxb-main-amount-odd-direction">(借方)</span></span>
					<Amount className="assmxb-main-amount">{closingbalance}</Amount>
				</Row>
			</Container>
		)
	}
}
