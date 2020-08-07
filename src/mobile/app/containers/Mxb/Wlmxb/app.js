import React, { PropTypes } from 'react'
import { fromJS, toJS, is } from 'immutable'
import { connect }	from 'react-redux'
import { SegmentedControl, WingBlank } from 'antd-mobile'
import { cxAccountActions } from 'app/redux/Search/Cxls'
import thirdParty from 'app/thirdParty'
import { TopMonthPicker, ScrollLoad } from 'app/containers/components'
import { Button, ButtonGroup, Icon, Container, Row, ScrollView, Amount } from 'app/components'
import * as wlmxActions from 'app/redux/Mxb/Wlmxb/WlMxb.action.js'
// import { Account,CategoryCom, Menu } from 'app/containers/Edit/Lrls/components'
import * as Limit from 'app/constants/Limit.js'

import SingleItem from './SingleItem.jsx'
import Category from './Category.jsx'
import './wlmxb.less'

@connect(state => state)
export default
class wlmxb extends React.Component {
	constructor(props) {
		super(props)
    }
	componentDidMount() {
		thirdParty.setTitle({ title: '往来明细表' })
		thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })
		if (sessionStorage.getItem('fromPage') === 'wlyeb') {
			sessionStorage.removeItem('fromPage')
			return
		}
		if (sessionStorage.getItem('ylPage') === 'wlmxb') {
			sessionStorage.removeItem('ylPage')
			return
		}
		this.props.dispatch(wlmxActions.changeMenuData('menuType', ''))
		this.props.dispatch(wlmxActions.changeMenuData('menuLeftIdx', 0))
		this.props.dispatch(wlmxActions.changeMenuData('lbmenuLeftIdx', 0))
		this.props.dispatch(wlmxActions.getPeriodDetailList())
	}
	componentWillReceiveProps(nextprops) {
		const menuType = nextprops.wlmxbState.getIn(['flags','menuType'])
        if(!is(menuType,this.props.wlmxbState.getIn(['flags','menuType']))) {

			if(menuType === 'LB_CATEGORY' || menuType === 'RLB_CATEGORY'){
				thirdParty.setRight({
					show: true,
					control: true,
					text: '取消',
					onSuccess: (result) => this.props.dispatch(wlmxActions.changeMenuData('menuType', '')),
					onFail: (err) => {alert(err)}
				})
			}else{
				thirdParty.setRight({ show: false })
			}
        }

    }

	render() {
		const { dispatch, history, wlmxbState} = this.props

		const lastCategory = wlmxbState.get('contactTypeTree')
		const runningCategory = wlmxbState.get('runningCategory')
		const wlRelationship = wlmxbState.getIn(['flags','wlRelationship'])
		const issuedate = wlmxbState.getIn(['flags', 'issuedate'])
		const issues = wlmxbState.get('issues')
		const runningShowChild = wlmxbState.get('runningShowChild')

		const endissuedate = wlmxbState.getIn(['flags', 'endissuedate'])
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)
		const end = endissuedate ? endissuedate : issuedate
		const propertyCost = wlmxbState.getIn(['flags', 'propertyCost'])
		const detailsTemp = wlmxbState.get('detailsTemp')

		const currentPage = wlmxbState.get('currentPage')
		const pageCount = wlmxbState.get('pageCount')

		const cardList = wlmxbState.get('cardList')
		const curCardUuid = wlmxbState.getIn(['flags', 'curCardUuid'])
		const categoryUuid = wlmxbState.getIn(['flags', 'categoryUuid'])
		const categoryName = wlmxbState.getIn(['flags', 'categoryName'])
		const wlRelate = wlmxbState.getIn(['flags', 'wlRelate'])

		const wlOnlyRelate = wlmxbState.getIn(['flags', 'wlOnlyRelate'])
		const wlType = wlmxbState.getIn(['flags', 'wlType'])
		const isTop = wlmxbState.getIn(['flags', 'isTop'])
		const contactTypeTree = wlmxbState.get('contactTypeTree')
		const flags = wlmxbState.get('flags')
		const typeUuid = flags.get('typeUuid')

		const menuType = wlmxbState.getIn(['flags','menuType'])
		const menuLeftIdx = wlmxbState.getIn(['flags','menuLeftIdx'])
		const lbMenuLeftIdx = wlmxbState.getIn(['flags','lbMenuLeftIdx'])
		const curCardName = wlmxbState.getIn(['flags','curCardName'])

		const allHappenIncomeAmount = wlmxbState.getIn(['flags', 'allHappenIncomeAmount'])
		const allBalanceAmount = wlmxbState.getIn(['flags', 'allBalanceAmount'])
		const direction = wlmxbState.getIn(['flags', 'direction'])
		const QcData = wlmxbState.get('QcData')
		const ylDataList = wlmxbState.get('ylDataList')

		const wlRelationshipStr = ({
			'': () => '全部',
			'1': () => '仅付款单位',
			'2': () => '仅收款单位',
			'3': () => '收款兼付款单位'
		}[wlRelate])()
		let component = null
		;({
			'LB_CATEGORY': () => {//选择类别页面
				component = <Category
					data={contactTypeTree}
					leftIdx={lbMenuLeftIdx}
					leftClick={(idx) => dispatch(wlmxActions.changeMenuData('lbMenuLeftIdx', idx))}
					onChange={(value) => {
						const valueList = value[1].split(Limit.TREE_JOIN_STR)
						dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'wlType'], valueList[1]))
						dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'typeUuid'], valueList[0]))
						dispatch(wlmxActions.changeDetailAccountCommonString('',['flags', 'isTop'],valueList[2]))
						dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'selectedCard'], ''))
						dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'categoryName'], '全部'))
						dispatch(wlmxActions.getContactsCardList(issuedate, endissuedate, valueList[2], valueList[0]))
						dispatch(wlmxActions.changeMenuData('menuType', ''))
					}}
				/>
			},
			'RLB_CATEGORY': () => {
				component = <Category
					data={runningCategory}
					leftIdx={menuLeftIdx}
					leftClick={(idx) => dispatch(wlmxActions.changeMenuData('menuLeftIdx', idx))}
					onChange={(value) => {
						const valueList = value[1].split(Limit.TREE_JOIN_STR)
						dispatch(wlmxActions.getDetailList(issuedate,endissuedate,curCardUuid,valueList[0],valueList[2], 1,))
						dispatch(wlmxActions.changeDetailAccountCommonString('',['flags', 'propertyCost'],valueList[2]))
						dispatch(wlmxActions.changeDetailAccountCommonString('',['flags', 'categoryUuid'],valueList[0]))
						dispatch(wlmxActions.changeDetailAccountCommonString('',['flags', 'categoryName'],valueList[1]))
						dispatch(wlmxActions.changeMenuData('menuType', ''))
					}}
				/>
			}
        }[menuType] || (()=> {
			thirdParty.setTitle({ title: '往来明细表' })
			return null}))()

			const loop = (data,leve) => data.map((item,i) => {
				const showChild = runningShowChild.indexOf(item.get('uuid')) > -1
				const backgroundColor = leve > 1 ? '#FEF3E3' : '#fff'
				if (item.get('childList').size) {
					return  <div key={i}>
						<SingleItem
							leve={leve}
							className="balance-running-tabel-width"
							style={{backgroundColor}}
							ba={item}
							haveChild={true}
							showChild={showChild}
							history={history}
							dispatch={dispatch}
							issuedate={issuedate}
							wlRelate={wlRelate}
							wlOnlyRelate={wlOnlyRelate}
							ylDataList={ylDataList}
						/>
						{showChild ? loop(item.get('childList'), leve+1) : ''}
					</div>
				} else {
					return <div key={i}>
						<SingleItem
							leve={leve}
							className="balance-running-tabel-width"
							ba={item}
							style={{backgroundColor}}
							history={history}
							dispatch={dispatch}
							issuedate={issuedate}
							wlRelate={wlRelate}
							wlOnlyRelate={wlOnlyRelate}
							ylDataList={ylDataList}
						/>
					</div>
					}
			})

		return (
			component ? component :
			<Container className="wlyeb">
				<TopMonthPicker
                    issuedate={issuedate}
                    source={issues} //默认显示日期
                    callback={(value) => {
						dispatch(wlmxActions.getPeriodDetailList(value,'',isTop,typeUuid,curCardUuid))
						dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'selectedCard'], ''))
					}}
                    onOk={(result) => {
						dispatch(wlmxActions.getPeriodDetailList(result.value,'',isTop,typeUuid,curCardUuid))
						dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'selectedCard'], ''))
					}}
                    showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
						dispatch(wlmxActions.getPeriodDetailList(result.value,'',isTop,typeUuid,curCardUuid))
						dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'selectedCard'], ''))
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						dispatch(wlmxActions.getPeriodDetailList(issuedate,result.value,isTop,typeUuid,curCardUuid))
						dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'selectedCard'], ''))
					}}
					changeEndToBegin={()=>{
						dispatch(wlmxActions.getPeriodDetailList(issuedate,'',isTop,typeUuid,curCardUuid))
						dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'selectedCard'], ''))}}
                />

				<div className="wlye-top-select">
					<div className='wlye-with-account'>
						<Row className='lrls-row'>
							<Row className='lrls-type'
								onClick={() => {
									if (contactTypeTree.size) {
										dispatch(wlmxActions.changeMenuData('menuType', 'LB_CATEGORY'))
									} else {
										return
									}
								}}
							>
								<span>{curCardName}</span>
								<Icon type="triangle" />
							</Row>
						</Row>

					</div>
					<div className="wlye-account-select" >
						<Row className='lrls-row'>
							<Row className='lrls-type'
								onClick={() => {
									if (runningCategory.size) {
										dispatch(wlmxActions.changeMenuData('menuType', 'RLB_CATEGORY'))
									} else {
										return
									}
								}}
							>
								<span>{runningCategory.size ? categoryName : '暂无类别'}</span>
								<Icon type="triangle" />
							</Row>
						</Row>
					</div>



				</div>
				{
					categoryUuid === '' ?
					<Row className='ba-title-single'>
						<div className='ba-title-item'>期初 <span className="title-item-summary">{`(${QcData.get('direction')}净额)` }</span></div>
						<div className='ba-title-item'><Amount showZero={true}>{QcData.get('balanceAmount')}</Amount></div>
					</Row> : ''
				}



				<ScrollView flex="1" uniqueKey="wlye-scroll"  className= 'scroll-item' savePosition>
					<div className='ba-list flow-content'>
						{detailsTemp.map((item,i) => {
							return  <div key={i}>
								<SingleItem
									className="balance-running-tabel-width"
									ba={item}
									history={history}
									dispatch={dispatch}
									issuedate={issuedate}
									wlRelate={wlRelate}
									wlOnlyRelate={wlOnlyRelate}
									ylDataList={ylDataList}
								/>
							</div>
						})}
					</div>
					<ScrollLoad
						diff={1}
						classContent='flow-content'
						callback={(_self) => {
							dispatch(wlmxActions.getDetailList(issuedate,endissuedate,curCardUuid,categoryUuid,propertyCost,currentPage+1,'true',true,true,_self))
						}}
						isGetAll={currentPage >= pageCount }
						itemSize={detailsTemp.size}
					/>
				</ScrollView>
				<Row className='ba-title-single'>
					<div className='ba-title-item'>期末<span className="title-item-summary">{`(${direction}净额)`}</span></div>
					<div className='ba-title-item'><Amount showZero={true}>{allBalanceAmount}</Amount></div>
				</Row>
			</Container>
		)
	}
}
