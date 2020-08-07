import React, { PropTypes } from 'react'
import { fromJS, toJS, is } from 'immutable'
import { connect }	from 'react-redux'
import { SegmentedControl, WingBlank } from 'antd-mobile'
import { cxAccountActions } from 'app/redux/Search/Cxls'
import thirdParty from 'app/thirdParty'
import { TopMonthPicker, ScrollLoad } from 'app/containers/components'
import { Button, ButtonGroup, Icon, Container, Row, ScrollView, Amount } from 'app/components'
import * as wlyeActions from 'app/redux/Yeb/Wlyeb/Wlyeb.action.js'
import { Account,CategoryCom, Menu } from 'app/containers/Edit/Lrls/components'
import * as Limit from 'app/constants/Limit.js'

import SingleItem from './SingleItem.jsx'
import DoubleItem from './DoubleItem.jsx'
import Category from './Category.jsx'
import './wlyeb.less'

@connect(state => state)
export default
class wlyeb extends React.Component {
	constructor(props) {
		super(props)
    }
	componentDidMount() {
		thirdParty.setTitle({ title: '往来余额表' })
		thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })
		if (sessionStorage.getItem('fromPage') === 'wlyeb') {
			sessionStorage.removeItem('fromPage')
			return
		}
		if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(wlyeActions.getPeriodAndBalanceList())
		}
		this.props.dispatch(wlyeActions.changeMenuData('menuType', ''))
	}
	componentWillReceiveProps(nextprops) {
        if(!is(nextprops.wlyebState.getIn(['flags','menuType']),this.props.wlyebState.getIn(['flags','menuType']))) {

			if(nextprops.wlyebState.getIn(['flags','menuType']) === 'LB_CATEGORY'){
				thirdParty.setRight({
					show: true,
					control: true,
					text: '取消',
					onSuccess: (result) => this.props.dispatch(wlyeActions.changeMenuData('menuType', '')),
					onFail: (err) => {alert(err)}
				})
			}else{
				thirdParty.setRight({ show: false })
			}
        }

    }

	render() {
		const { dispatch, history, wlyebState} = this.props

		const lastCategory = wlyebState.get('contactTypeTree')
		const wlRelationship = wlyebState.getIn(['flags','wlRelationship'])
		const issuedate = wlyebState.get('issuedate')
		const issues = wlyebState.get('issues')
		const runningShowChild = wlyebState.get('runningShowChild')

		// const firstDate = issues.getIn([0,'value'])
		// const lastDate = issues.getIn([issues.size - 1,'value'])
		const endissuedate = wlyebState.get('endissuedate')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)
		const end = endissuedate ? endissuedate : issuedate

		const balanceTemp = wlyebState.get('balanceTemp')

		const currentPage = wlyebState.get('currentPage')
		const pageCount = wlyebState.get('pageCount')

		const wlRelate = wlyebState.getIn(['flags', 'wlRelate'])
		const wlOnlyRelate = wlyebState.getIn(['flags', 'wlOnlyRelate'])
		const wlType = wlyebState.getIn(['flags', 'wlType'])
		const typeUuid = wlyebState.get('typeUuid')
		const isTop = wlyebState.getIn(['flags', 'isTop'])
		const contactTypeTree = wlyebState.get('contactTypeTree')

		const menuType = wlyebState.getIn(['flags','menuType'])
		const menuLeftIdx = wlyebState.getIn(['flags','menuLeftIdx'])

		const allBeginIncomeAmount = wlyebState.getIn(['flags', 'allBeginIncomeAmount'])
		const allBeginExpenseAmount = wlyebState.getIn(['flags', 'allBeginExpenseAmount'])
		const allHappenIncomeAmount = wlyebState.getIn(['flags', 'allHappenIncomeAmount'])
		const allHappenExpenseAmount = wlyebState.getIn(['flags', 'allHappenExpenseAmount'])
		const allPaymentIncomeAmount = wlyebState.getIn(['flags', 'allPaymentIncomeAmount'])
		const allPaymentExpenseAmount = wlyebState.getIn(['flags', 'allPaymentExpenseAmount'])
		const allBalanceIncomeAmount = wlyebState.getIn(['flags', 'allBalanceIncomeAmount'])
		const allBalanceExpenseAmount = wlyebState.getIn(['flags', 'allBalanceExpenseAmount'])

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
					data={lastCategory}
					leftIdx={menuLeftIdx}
					leftClick={(idx) => dispatch(wlyeActions.changeMenuData('menuLeftIdx', idx))}
					onChange={(value) => {
						const valueList = value[1].split(Limit.TREE_JOIN_STR)
						dispatch(wlyeActions.getContactsBalanceList(issuedate,endissuedate,valueList[2],valueList[0],valueList[1],'',1))						// dispatch(wlyeActions.changeCommonStr('',['flags','categoryType'],valueList[1]))
						dispatch(wlyeActions.changeMenuData('menuType', ''))
					}}
				/>
			}
        }[menuType] || (()=> {
			thirdParty.setTitle({ title: '往来余额表' })
			return null}))()

			const loop = (data,leve) => data.map((item,i) => {
				const showChild = runningShowChild.indexOf(item.get('uuid')) > -1
				const backgroundColor = leve > 1 ? '#FEF3E3' : '#fff'
				if (item.get('childList').size) {
					if((wlOnlyRelate == '1' || wlOnlyRelate == '2' || wlRelate == '1' || wlRelate == '2')){
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
								issuedate={issuedate}
								endissuedate={endissuedate}
								typeUuid={typeUuid}
								wlType={wlType}
								isTop={isTop}
							/>
							{showChild ? loop(item.get('childList'), leve+1) : ''}
						</div>
					}else{
						return  <div key={i}>
							<DoubleItem
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
								issuedate={issuedate}
								endissuedate={endissuedate}
								typeUuid={typeUuid}
								wlType={wlType}
								isTop={isTop}
							/>
							{showChild ? loop(item.get('childList'), leve+1) : ''}
						</div>
					}

				} else {
					if((wlOnlyRelate == '1' || wlOnlyRelate == '2' || wlRelate == '1' || wlRelate == '2')){
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
								issuedate={issuedate}
								endissuedate={endissuedate}
								typeUuid={typeUuid}
								wlType={wlType}
								isTop={isTop}
							/>
						</div>
					}else{
						return  <div key={i}>
							<DoubleItem
								leve={leve}
								className="balance-running-tabel-width"
								style={{backgroundColor}}
								ba={item}
								haveChild={false}
								showChild={showChild}
								history={history}
								dispatch={dispatch}
								issuedate={issuedate}
								wlRelate={wlRelate}
								wlOnlyRelate={wlOnlyRelate}
								issuedate={issuedate}
								endissuedate={endissuedate}
								typeUuid={typeUuid}
								wlType={wlType}
								isTop={isTop}
							/>
							{showChild ? loop(item.get('childList'), leve+1) : ''}
						</div>
					}

				}
			})

		return (
			component ? component :
			<Container className="wlyeb">
				<TopMonthPicker
                    issuedate={issuedate}
                    source={issues} //默认显示日期
                    callback={(value) => {
						dispatch(wlyeActions.getContactsBalanceList(value))
					}}
                    onOk={(result) => {
						dispatch(wlyeActions.getContactsBalanceList(result.value))
					}}
                    showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
                        dispatch(wlyeActions.getContactsBalanceList(result.value))
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						dispatch(wlyeActions.getContactsBalanceList(issuedate,result.value))
					}}
					changeEndToBegin={()=>dispatch(wlyeActions.getContactsBalanceList(issuedate))}
                />

				<div className="wlye-top-select">
					<div className={'wlye-with-account'}>
						<Row className='lrls-row'>
							<Row className='lrls-type'
								onClick={() => {
									if (lastCategory.size) {
										dispatch(wlyeActions.changeMenuData('menuType', 'LB_CATEGORY'))
									} else {
										return
									}
								}}
							>
								<span>{lastCategory.size ? wlType : '暂无类别'}</span>
								<Icon type="triangle" />
							</Row>
						</Row>

					</div>
					{
						wlRelationship && wlRelationship.size > 2 ?
						<div className="wlye-account-select" >
							<Account
								accountList={wlRelationship.map(v => {return {key: v.get('name'), value: `${v.get('relation')}${Limit.TREE_JOIN_STR}${v.get('name')}`}})}
								accountUuid={wlRelate}
								accountName={wlRelationshipStr}
								noInsert={true}
								onOk={(result) =>{
									if(result){
										const valueList = result.split(Limit.TREE_JOIN_STR)
										dispatch(wlyeActions.getContactsBalanceList(issuedate,endissuedate,isTop,typeUuid,wlType,valueList[0],1))
									}
								}}
							/>
						</div> : ''
					}


				</div>
				{
					wlOnlyRelate == '1' || wlOnlyRelate == '2' || wlRelate == '1' || wlRelate == '2'?
					<Row className='ba-title-single'>
						<div className='ba-title-item'>期初应收</div>
						<div className='ba-title-item'>本期应收</div>
						<div className='ba-title-item'>本期实收</div>
						<div className='ba-title-item'>期末应收</div>
					</Row>:
					<Row className='ba-title-double'>
						<div className='ba-title-item'>期初余额</div>
						<div className='ba-title-item'>
							<span className="item-item">本期应收</span>
							<span className="item-item">本期应付</span>
						</div>
						<div className='ba-title-item'>
							<span className="item-item">本期实收</span>
							<span className="item-item">本期实付</span>
						</div>
						<div className='ba-title-item'>期末余额</div>
					</Row>
				}

				<ScrollView flex="1" uniqueKey="wlye-scroll"  className= 'scroll-item' savePosition>
					<div className='ba-list flow-content'>
						{loop(balanceTemp,1)}
					</div>
					<ScrollLoad
						diff={1}
						classContent='flow-content'
						callback={(_self) => {
							dispatch(wlyeActions.getContactsBalanceList(issuedate,endissuedate,isTop,typeUuid,wlType,wlRelate,currentPage+1,true, false,true,_self))
						}}
						isGetAll={currentPage >= pageCount }
						itemSize={balanceTemp.size}
					/>
				</ScrollView>
			</Container>
		)
	}
}
