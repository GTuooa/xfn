import React, { PropTypes } from 'react'
import { fromJS, toJS } from 'immutable'
import { connect }	from 'react-redux'
import { SegmentedControl, WingBlank } from 'antd-mobile'
import { cxAccountActions } from 'app/redux/Search/Cxls'
import * as thirdParty from 'app/thirdParty'
import { TopMonthPicker } from 'app/containers/components'
import { Button, ButtonGroup, Icon, Container, Row, ScrollView, Amount } from 'app/components'
import * as lsmxbActions from 'app/redux/Mxb/Lsmxb/lsmxb.action.js'
import { Account,CategoryCom, Menu } from 'app/containers/Edit/Lrls/components'
import * as Limit from 'app/constants/Limit.js'

import Vc from './Vc.jsx'
import ScrollLoad from './ScrollLoad.jsx'
import './lsmxb.less'

@connect(state => state)
export default
class Lsmxb extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedIndex: 0
        }
    }
	componentDidMount() {
		thirdParty.setTitle({ title: '收支明细表' })
		thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })

		if (sessionStorage.getItem('ylPage') === 'lsmxb') {
			sessionStorage.removeItem('fromPage')
			const selectedIndex = this.props.yllsState.getIn(['lsmxbData', 'selectedIndex'])
			this.setState({ selectedIndex: selectedIndex })
			return
		}
		if (sessionStorage.getItem('fromPage') === 'lsyeb') {
			sessionStorage.removeItem('fromPage')
			const selectedIndex = this.props.lsmxbState.getIn(['flags', 'amountType']) == 'DETAIL_AMOUNT_TYPE_HAPPEN' ? 0 : 1
			this.setState({ selectedIndex: selectedIndex })
			return
		}
		this.props.dispatch(lsmxbActions.getPeriodDetailList())
	}

	render() {
		const { selectedIndex } = this.state
		const { dispatch, cxAccountState, history, lsmxbState,allState} = this.props

		const lastCategory = lsmxbState.get('runningCategory')
		const accountList = lsmxbState.get('accountList')
		const issuedate = lsmxbState.getIn(['flags','issuedate'])
		const issues = lsmxbState.get('issues')

		const firstDate = issues.getIn([0,'value'])
		const lastDate = issues.getIn([issues.size - 1,'value'])
		const endissuedate = lsmxbState.getIn(['flags','endissuedate'])
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)
		const end = endissuedate ? endissuedate : issuedate

		const detailsTemp = lsmxbState.get('detailsTemp')
		const QcData = lsmxbState.get('QcData')

		const currentPage = lsmxbState.get('currentPage')
		const pageCount = lsmxbState.get('pageCount')
		const amountType = lsmxbState.getIn(['flags','amountType'])
		const property = lsmxbState.getIn(['flags','property'])

		const categoryUuid = lsmxbState.getIn(['flags','curCategory'])
		const categoryName = lsmxbState.getIn(['flags','categoryType'])
		const accountUuid = lsmxbState.getIn(['flags','curAccountUuid'])
		const accountName = lsmxbState.getIn(['flags','accountType'])
		const menuLeftIdx = lsmxbState.getIn(['flags','menuLeftIdx'])
		const menuType = lsmxbState.getIn(['flags','menuType'])

		const allHappenAmount = lsmxbState.getIn(['flags','allHappenAmount'])
		const allHappenBalanceAmount = lsmxbState.getIn(['flags','allHappenBalanceAmount'])
		const allIncomeAmount = lsmxbState.getIn(['flags','allIncomeAmount'])
		const allExpenseAmount = lsmxbState.getIn(['flags','allExpenseAmount'])
		const allBalanceAmount = lsmxbState.getIn(['flags','allBalanceAmount'])

		let component = null
		;({
			'LB_CATEGORY': () => {//选择类别页面
				component = <Menu
					data={lastCategory}
					leftIdx={menuLeftIdx}
					leftClick={(idx) => dispatch(lsmxbActions.changeMenuData('menuLeftIdx', idx))}
					onChange={(value) => {
						const valueList = value[1].split(Limit.TREE_JOIN_STR)
						dispatch(lsmxbActions.getDetailList(valueList[0],issuedate,1,amountType,accountUuid,valueList[2],false, true))
						dispatch(lsmxbActions.changeCommonStr('',['flags','categoryType'],valueList[1]))
						dispatch(lsmxbActions.changeMenuData('menuType', ''))
					}}
				/>
			}
        }[menuType] || (()=> {
			thirdParty.setTitle({ title: '收支明细表' })
			return null}))()

		return (
			component ? component :
			<Container className="lsmxb">
				<TopMonthPicker
                    issuedate={issuedate}
                    source={issues} //默认显示日期
                    callback={(value) => {
						dispatch(lsmxbActions.getDetailList('',value,1,'DETAIL_AMOUNT_TYPE_HAPPEN','','',false, true))
						// dispatch(cxAccountActions.getBusinessList(1, value, false, true))
					}}
                    onOk={(result) => {
						dispatch(lsmxbActions.getDetailList('',result.value,1,'DETAIL_AMOUNT_TYPE_HAPPEN','','',false, true))
					}}
                    showSwitch={false}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
                        //dispatch(lsyebActions.getPeriodAndBalanceList(result.value, ''))
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						//dispatch(lsyebActions.getPeriodAndBalanceList(issuedate, result.value))
					}}
					//changeEndToBegin={()=>dispatch(lsyebActions.getPeriodAndBalanceList(issuedate, ''))}
                />
				<WingBlank>
					<SegmentedControl
						values={['发生额', '收付款']}
						selectedIndex={selectedIndex}
						onChange={(e) => {
							this.setState({
								selectedIndex: e.nativeEvent.selectedSegmentIndex
							})
							switch (e.nativeEvent.selectedSegmentIndex) {
								case 0:
									dispatch(lsmxbActions.getDetailList('',issuedate,1,'DETAIL_AMOUNT_TYPE_HAPPEN','','',false, true))
									break
								case 1:
									dispatch(lsmxbActions.getDetailList('',issuedate,1,'DETAIL_AMOUNT_TYPE_BALANCE','','',false, true))
									dispatch(lsmxbActions.changeCommonStr('',['flags','accountType'],'请选择账户'))
									break
							}
							dispatch(lsmxbActions.changeCommonStr('',['flags','categoryType'],'请选择类别'))
						}}
					/>
				</WingBlank>

				<div className="lsmx-top-select">
					<div className={selectedIndex == 1 ? 'lsmx-with-account' : 'lsmx-type-select'}>
						<Row className='lrls-row'>
							<Row className='lrls-type'
								onClick={() => {
									if (lastCategory.size) {
										dispatch(lsmxbActions.changeMenuData('menuType', 'LB_CATEGORY'))
									} else {
										return
									}
								}}
							>
								<span>{lastCategory.size ? categoryName : '暂无类别'}</span>
								{
									categoryName !== '请选择类别' && lastCategory.size ?
									<span className='lsmx-direction'>{property}</span>
									: ''
								}
								<Icon type="triangle" />
							</Row>
						</Row>

					</div>


					{
						selectedIndex == 1  ?
						<div className="lsmx-account-select" >
							<Account
								accountList={accountList.map(v => {return {key: v.get('name'), value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}})}
								accountUuid={accountUuid}
								accountName={accountName}
								onOk={(result) =>{
									if(result){
										const valueList = result.split(Limit.TREE_JOIN_STR)
										dispatch(lsmxbActions.getDetailList(categoryUuid,issuedate,1,amountType,result,'',false, true))
										dispatch(lsmxbActions.changeCommonStr('',['flags','accountType'],valueList[1]))
									}
								}}
							/>
						</div>
						: ''
					}

				</div>

				{
					selectedIndex == 1 && categoryName == '全部'?
					<Row className='ba-title'>
						<div className='ba-title-item'>期初</div>
						<div className='ba-title-item'></div>
						<div className='ba-title-item'></div>
						<div className='ba-title-item'><Amount showZero={true}>{QcData.balanceAmount}</Amount></div>
					</Row>
					: ''
				}


				<ScrollView flex="1" uniqueKey="lsmx-scroll"  className= 'scroll-item' savePosition>
					{
						<div className='ba-list flow-content'>
							{detailsTemp.map((v, i) => {
								return <Vc
									key={i}
									className=""
									item={v}
									dispatch={dispatch}
									history={history}
									selectedIndex={selectedIndex}
									categoryName={categoryName}
									idx={i}
								/>
							})}
						</div>
					}
					<ScrollLoad
						diff={100}
						callback={(_self) => {
							switch (selectedIndex) {
								case 0:
									dispatch(lsmxbActions.getDetailList(categoryUuid,issuedate,currentPage+1,'DETAIL_AMOUNT_TYPE_HAPPEN',accountUuid,'',true, false,true,_self))
									break
								case 1:
									dispatch(lsmxbActions.getDetailList(categoryUuid,issuedate,currentPage+1,'DETAIL_AMOUNT_TYPE_HAPPEN',accountUuid,'',true, false,true,_self))
									break
							}
						}}
						isGetAll={currentPage >= pageCount }
						itemSize={detailsTemp.size}
					/>
				</ScrollView>
				{
					selectedIndex == 1 && categoryName == '全部'?
					<Row className='ba-title'>
						<div className='ba-title-item'>期末余额</div>
						<div className='ba-title-item'><Amount showZero={true}>{allIncomeAmount}</Amount></div>
						<div className='ba-title-item'><Amount showZero={true}>{allExpenseAmount}</Amount></div>
						<div className='ba-title-item'><Amount showZero={true}>{allBalanceAmount}</Amount></div>
					</Row>
					:
					<Row className='ba-title'>
						<div className='ba-title-item'>合计</div>
						<div className='ba-title-item'></div>
						<div className='ba-title-item'></div>
						<div className='ba-title-item'><Amount showZero={true}>{allHappenAmount}</Amount></div>
					</Row>
				}
			</Container>
		)
	}
}
