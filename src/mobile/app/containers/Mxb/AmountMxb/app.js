import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { fromJS, toJS, Map }	from 'immutable'
import { Container, Row, ScrollView, Icon, Select, Amount,SinglePicker, ChosenPicker } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import { TopMonthPicker } from 'app/containers/components'
import * as Limit from 'app/constants/Limit.js'
import Jv from './Jv.jsx'
import './amountmxb.less'

import * as amountMxbActions from 'app/redux/Mxb/AmountMxb/amountMxb.action.js'
import * as allActions from 'app/redux/Home/All/other.action'
import * as acAllActions from 'app/redux/Home/All/aclist.actions'

@connect(state => state)
export default
class AmountMxb extends React.Component {
	scrollerHeight = 0//滚动容器的高度
	componentDidMount() {
		thirdParty.setTitle({title: '数量明细表'})
		if (sessionStorage.getItem('previousPage') === 'amountYeb') {
            sessionStorage.removeItem('previousPage')
            // this.props.dispatch(acAllActions.getAcListandAsslistFetch())
        }
		if(sessionStorage.getItem('prevPage')==='cxpz'){
			sessionStorage.removeItem('prevPage')
			const {dispatch,amountMxbState} = this.props
			const queryByAss =  amountMxbState.getIn(['views', 'queryByAss'])
			const currentAcid = amountMxbState.get('currentAcid')
			const getTreeAndList = (issuedate, endissuedate) => {
				if (queryByAss) {
					dispatch(amountMxbActions.initMxAssObj())
					dispatch(amountMxbActions.getAmountMxTerrByAss(issuedate, endissuedate))
					dispatch(amountMxbActions.getAmountMxByAss(issuedate, endissuedate))
				} else {
					dispatch(amountMxbActions.getAmountMxbSubsidiaryLedgerFetch(issuedate, endissuedate, currentAcid))
				}
			}
			getTreeAndList(amountMxbState.get('issuedate'), amountMxbState.get('endissuedate'))
		}
		const scrollViewHtml = document.getElementsByClassName('scroll-view')[0]
        this.scrollerHeight = Number(window.getComputedStyle(scrollViewHtml).height.replace('px',''))
	}
	render() {
		const {
			dispatch,
			amountMxbState,
			allState,
			history
		} = this.props
		thirdParty.setTitle({title: '数量明细表'})

		const issues = allState.get('issues')
		const unitDecimalCount = allState.getIn(['systemInfo', 'unitDecimalCount'])
		const issuedate = amountMxbState.get('issuedate')
		const endissuedate = amountMxbState.get('endissuedate')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)
		const ledger = amountMxbState.get('ledger')
		const jvlist = ledger.get('jvlist')
		const acinfo = [ledger.get('acid'), ledger.get('acfullname')].join('_')
		const acid = ledger.get('acid')
		const assid = ledger.get('assid')
		const acuint = ledger.get('acuint')

		const amountmxbAclist = amountMxbState.get('amountmxbAclist')
		const currentAcid = amountMxbState.get('currentAcid')
		const currentAc = amountmxbAclist && amountmxbAclist.find(v => v.get('acid') == currentAcid)
		const currentAss = amountMxbState.get('currentAss')
		const asslist = currentAc ? currentAc.get('asslist') : fromJS([])
		const showAss = currentAss ? currentAss : '全部'
		const disableTime = currentAss ? asslist.filter(v => v.get('assid') == currentAss.split('_')[1]).getIn([0, 'disableTime']) : ''

		// 可选的辅助核算列表
		const source = asslist.map(v => ({
			key: v.get('asscategory') + '_' + v.get('assid') + '_' + v.get('assname'),
			// value: v.get('asscategory') + '_' + v.get('assid') + '_' + v.get('assname')
			value: v.get('asscategory') + Limit.TREE_JOIN_STR + v.get('assid') + Limit.TREE_JOIN_STR + v.get('assname')

		}))

		// 可选的一级科目及其子科目
		let sourceAclist = []
		let handleAcid = currentAcid && currentAcid.length > 4 ? currentAcid.substr(0, 4) : currentAcid
		amountmxbAclist.map(v => {
			if (v.get('acid').indexOf(handleAcid) == 0) {
				sourceAclist.push({
					key: v.get('acid') + " " + v.get('acname'),
					value: v.get('acid')
				})
			}
		})

		//按辅助核算维度查询
		const queryByAss =  amountMxbState.getIn(['views', 'queryByAss'])
		const mxAssObj = amountMxbState.get('mxAssObj')
		const assCategory = mxAssObj.get('assCategory')
		const assId = mxAssObj.get('assId')
		const assName = mxAssObj.get('assName')
		const acId = mxAssObj.get('acId')
		const acName = mxAssObj.get('acName')
		const assCategoryTwo = mxAssObj.get('assCategoryTwo')
		const assIdTwo = mxAssObj.get('assIdTwo')
		const assNameTwo = mxAssObj.get('assNameTwo')

		const acTree = amountMxbState.get('acTree').toJS()
		const assTree = amountMxbState.get('assTree').toJS()

		const getTreeAndList = (issuedate, endissuedate) => {
            if (queryByAss) {
				dispatch(amountMxbActions.initMxAssObj())
                dispatch(amountMxbActions.getAmountMxTerrByAss(issuedate, endissuedate))
				dispatch(amountMxbActions.getAmountMxByAss(issuedate, endissuedate))
            } else {
				dispatch(amountMxbActions.getAmountMxbSubsidiaryLedgerFetch(issuedate, endissuedate, currentAcid))
			}
        }

		const begin = `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`
		const end =  endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(5,2)}` : begin

		// export
		let ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('excelcountSunOne', {begin: begin, end:end, acid, assid: assid ? assid : '', asscategory: asslist.getIn([0, 'asscategory']) ? asslist.getIn([0, 'asscategory']) : ''}))
		let ddPDFCallback = () => dispatch => dispatch(allActions.allExportDo('pdfCountSub', {begin: begin, end: end, acid, assid: assid ? assid : '', asscategory: asslist.getIn([0, 'asscategory']) ? asslist.getIn([0, 'asscategory']) : ''}))
		let allddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('excelcountSubAll', {begin:begin, end:end}))
		if (queryByAss) {
			const byAssObj = {begin: begin, end:end, acId, assCategory, assId, assCategoryTwo, assIdTwo}

			ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('excelcountSunOneByAss', byAssObj))
			ddPDFCallback = () => dispatch => dispatch(allActions.allExportDo('pdfCountSubByAss', byAssObj))
			allddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('excelcountSubAllByAss', byAssObj))
		}
		dispatch(allActions.navigationSetMenu('mxb', ddPDFCallback, ddExcelCallback, '', allddExcelCallback))

		const pageCount = Math.ceil(jvlist.size/20)
        const currentPage = amountMxbState.getIn(['views', 'currentPage'])

		return (
			<Container className="amountmxb">
				<TopMonthPicker
					issuedate={issuedate}
					source={issues} //默认显示日期
					callback={(value) => getTreeAndList(value, endissuedate)}
					onOk={(result) => getTreeAndList(result.value, endissuedate)}
					showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
						getTreeAndList(result.value, '')
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						getTreeAndList(issuedate, result.value)
					}}
					changeEndToBegin={()=>{//跨期变为单期之后 使endissuedate为空 重新获取数据
						getTreeAndList(issuedate, '')
					}}
				/>
				<Row className="amountmxb-title" style={{display: queryByAss ? 'none' : ''}}>
					<div className="amountmxb-title-acinfo">
						<span className="amountmxb-title-ac amountmxb-title-ac-tip">科目选择:</span>
						<span className="amountmxb-title-ac">{acinfo}</span>
						<div style={{'flex':1,textAlign:'right'}}>
							<SinglePicker district={sourceAclist} value='' onOk={(result) => {
								dispatch(amountMxbActions.getAmountMxbSubsidiaryLedgerFetch(issuedate, endissuedate,result.value))
							}}>
								<Icon type="triangle"/>
							</SinglePicker>
						</div>
					</div>
					<div className={["amountmxb-title-assinfo", disableTime ? 'lrb-item-disable' : ''].join(' ')}>
						<span>辅助核算:</span>
						<span
							onClick={() => {
								if(!asslist.size)
									return
								thirdParty.chosen({
									source : source,
									onSuccess: (result) => {
										dispatch(amountMxbActions.getAmountMxbSubsidiaryLedgerFetch(issuedate, endissuedate, currentAcid, result.value, result.key))
									}
								})
							}}
							>
							{asslist.size ? showAss : '无'}
						</span>
						{asslist.size ? <Icon type="arrow-down"/> : ''}
					</div>
				</Row>
				<Row className="amountmxb-title" style={{display: queryByAss ? '' : 'none'}}>
					<div className="amountmxb-title-ac amountmxb-title-ac-tip">辅助项目：{`${assCategory}_${assId} ${assName}`}</div>
					<ChosenPicker
						type='card'
						district={acTree}
						cardList={assTree}
						onChange={(value) => {
							const acId = value.acid
							dispatch(amountMxbActions.changeData(['mxAssObj', 'acId'], acId))
							dispatch(amountMxbActions.changeData(['mxAssObj', 'acName'], value.acname))

							let newAssTree = [{uuid: '', name: '全部', assid: '', assname: '全部'}]
							value['assList'].forEach(w => {
								w['uuid'] = w['assid']
								w['name'] = w['assname']
								w['disabled'] = w['disableTime'] ? true : false
								newAssTree.push(w)
							})
							dispatch(amountMxbActions.changeShortData('assTree', fromJS(newAssTree)))
							dispatch(amountMxbActions.getAmountMxByAss(issuedate, endissuedate))
						}}
						onOk={(value) => {
							dispatch(amountMxbActions.changeData(['mxAssObj', 'assIdTwo'], value[0]['assid']))
							dispatch(amountMxbActions.changeData(['mxAssObj', 'assNameTwo'], value[0]['assname']))
							dispatch(amountMxbActions.getAmountMxByAss(issuedate, endissuedate))
						}}
						value={acId}
						cardValue={[assIdTwo]}
					>
						<Row className='amountmxb-title-assinfo'>
							<span>
								科目选择：{`${acId} ${acName}`}{assCategoryTwo ? `_${assCategoryTwo}` : ''}{assIdTwo ? `-${assIdTwo} ${assNameTwo}` : ''}
							</span>
							<Icon type="triangle" />
						</Row>
					</ChosenPicker>
				</Row>
				<Row className="amountmxb-main-top">
					<span className="amountmxb-main-amount-odd">期初<span className="amountmxb-main-amount-odd-direction">{`(${ledger.get('openingDirection') === 'debit' ? '借' : '贷'}方)`}</span></span>
					<span className="amountmxb-main-amount">
						<Amount showZero={true}>{ledger.get('openingbalance')}</Amount>
						<span className="mxb-amount-color">
							<Amount showZero={true} decimalPlaces={unitDecimalCount}>{ledger.get('begincount')}</Amount>{ledger.get('acuint')}
							&nbsp;*
							<Amount showZero={true}>{ledger.get('openingprice')}</Amount>
						</span>
					</span>

				</Row>
				<ScrollView flex="1" uniqueKey="amountmxb-scroll" savePosition
					onScroll={(e)=>{
                        const scrollY = e.target.scrollTop
                        if (scrollY + 100 + this.scrollerHeight >= currentPage*1570 && currentPage < pageCount) {
                            dispatch(amountMxbActions.changeData(['views', 'currentPage'], currentPage+1))
                        }

                    }}
				>
					<ul className="amountmxb-main-list">
						{(jvlist || []).slice(0,currentPage*20).map((v, i) =>
							<Jv
								idx={i}
								key={i}
								jv={v}
								acuint={acuint}
								issuedate={issuedate}
								dispatch={dispatch}
								history={history}
								unitDecimalCount={unitDecimalCount}
								jvlist={jvlist}
							/>
						)}
						{jvlist.size ? '' : <div className="mxb-no-vc">暂无凭证</div>}
					</ul>
				</ScrollView>
				<Row className="amountmxb-main-top">
					<span className="amountmxb-main-amount-odd">期末<span className="amountmxb-main-amount-odd-direction">{`(${ledger.get('closingDirection') === 'debit' ? '借' : '贷'}方)`}</span></span>
					<span className="amountmxb-main-amount">
						<Amount showZero={true}>{ledger.get('closingbalance')}</Amount>
						<span className="mxb-amount-color">
							<Amount showZero={true} decimalPlaces={unitDecimalCount}>{ledger.get('closingcount')}</Amount>{ledger.get('acuint')}
							&nbsp;*
							<Amount showZero={true}>{ledger.get('closeingprice')}</Amount>
						</span>
					</span>
				</Row>
			</Container>
		)
	}
}
