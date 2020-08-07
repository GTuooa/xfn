import React, { PropTypes } from 'react'
import { fromJS, toJS, is } from 'immutable'
import { connect }	from 'react-redux'
import { SegmentedControl, WingBlank } from 'antd-mobile'
import { cxAccountActions } from 'app/redux/Search/Cxls'
import * as thirdParty from 'app/thirdParty'
import { TopMonthPicker, ScrollLoad } from 'app/containers/components'
import { Button, ButtonGroup, Icon, Container, Row, ScrollView, Amount } from 'app/components'

import { Account,CategoryCom, Menu } from 'app/containers/Edit/Lrls/components'
import * as Limit from 'app/constants/Limit.js'
import * as xmmxActions from 'app/redux/Mxb/Xmmxb/xmMxb.action.js'
import SingleItem from './SingleItem.jsx'
import Category from './Category.jsx'
import './xmmxb.less'

@connect(state => state)
export default
class xmmxb extends React.Component {
	constructor(props) {
		super(props)
    }
	componentDidMount() {
		thirdParty.setTitle({ title: '项目明细表' })
		thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })
		this.props.dispatch(xmmxActions.changeMenuData('menuType', ''))
		if (sessionStorage.getItem('ylPage') === 'xmmxb') {
			sessionStorage.removeItem('ylPage')
			return
		}
		const curIdx = this.props.amountType === 'DETAIL_AMOUNT_TYPE_BALANCE' ? 1 : 0
		this.props.dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'selectedIndex'],curIdx))
		if (sessionStorage.getItem('fromPage') === 'xmyeb') {
			sessionStorage.removeItem('fromPage')
			return
		}

		this.props.dispatch(xmmxActions.getFirstProjectDetailList())
	}
	componentWillReceiveProps(nextprops) {
		const menuType = nextprops.xmmxbState.getIn(['flags','menuType'])
        if(!is(menuType,this.props.xmmxbState.getIn(['flags','menuType']))) {

			if(menuType === 'LB_CATEGORY' || menuType === 'RLB_CATEGORY'){
				thirdParty.setRight({
					show: true,
					control: true,
					text: '取消',
					onSuccess: (result) => this.props.dispatch(xmmxActions.changeMenuData('menuType', '')),
					onFail: (err) => {alert(err)}
				})
			}else{
				thirdParty.setRight({ show: false })
			}
        }

    }

	render() {
		const { dispatch, history, xmmxbState} = this.props

		const lastCategory = xmmxbState.getIn(['flags','projectTypeTree'])
		const runningCategory = xmmxbState.getIn(['flags','runningCategory'])
		const wlRelationship = xmmxbState.getIn(['flags','wlRelationship'])
		const issuedate = xmmxbState.getIn(['flags', 'issuedate'])
		const issues = xmmxbState.get('issues')
		const runningShowChild = xmmxbState.get('runningShowChild')

		const endissuedate = xmmxbState.getIn(['flags', 'endissuedate'])
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)
		const end = endissuedate ? endissuedate : issuedate
		const propertyCost = xmmxbState.getIn(['flags', 'propertyCost'])
		const detailsTemp = xmmxbState.getIn(['flags', 'detailsTemp'])
		const total = xmmxbState.getIn(['flags', 'total'])

		const currentPage = xmmxbState.getIn(['flags', 'currentPage'])
		const pageCount = xmmxbState.getIn(['flags', 'pageCount'])

		const cardList = xmmxbState.get('cardList')
		const curCardUuid = xmmxbState.getIn(['flags', 'curCardUuid'])
		const categoryUuid = xmmxbState.getIn(['flags', 'categoryUuid'])
		const categoryName = xmmxbState.getIn(['flags', 'categoryName'])
		const wlRelate = xmmxbState.getIn(['flags', 'wlRelate'])
		const selectedIndex = xmmxbState.getIn(['flags', 'selectedIndex'])

		const wlOnlyRelate = xmmxbState.getIn(['flags', 'wlOnlyRelate'])
		const wlType = xmmxbState.getIn(['flags', 'wlType'])
		const isTop = xmmxbState.getIn(['flags', 'isTop'])
		const contactTypeTree = xmmxbState.get('contactTypeTree')
		const flags = xmmxbState.get('flags')
		const typeUuid = flags.get('typeUuid')

		const menuType = xmmxbState.getIn(['flags','menuType'])
		const menuLeftIdx = xmmxbState.getIn(['flags','menuLeftIdx'])
		const lbMenuLeftIdx = xmmxbState.getIn(['flags','lbmenuLeftIdx'])
		const curCardName = xmmxbState.getIn(['flags','curCardName'])

		const allHappenIncomeAmount = xmmxbState.getIn(['flags', 'allHappenIncomeAmount'])
		const allBalanceAmount = xmmxbState.getIn(['flags', 'allBalanceAmount'])

		const amountType = xmmxbState.getIn(['flags', 'amountType'])
		const QcData = xmmxbState.get('QcData')
		const ylDataList = xmmxbState.get('ylDataList')
		const direction = amountType === 'DETAIL_AMOUNT_TYPE_BALANCE' ? '收付净额' : '收支净额'
		let component = null
		;({
			'LB_CATEGORY': () => {//选择类别页面
				component = <Category
					data={lastCategory}
					leftIdx={lbMenuLeftIdx}
					leftClick={(idx) => dispatch(xmmxActions.changeMenuData('lbmenuLeftIdx', idx))}
					onChange={(value) => {
						const valueList = value[1].split(Limit.TREE_JOIN_STR)
						dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'xmType'], valueList[1]))
						dispatch(xmmxActions.getProjectDetailCardList(issuedate, endissuedate,amountType,valueList[0],valueList[2]))
						dispatch(xmmxActions.changeMenuData('menuType', ''))
						dispatch(xmmxActions.changeMenuData('menuLeftIdx', 0))
					}}
				/>
			},
			'RLB_CATEGORY': () => {
				component = <Category
					data={runningCategory}
					leftIdx={menuLeftIdx}
					leftClick={(idx) => dispatch(xmmxActions.changeMenuData('menuLeftIdx', idx))}
					onChange={(value) => {
						const valueList = value[1].split(Limit.TREE_JOIN_STR)
						dispatch(xmmxActions.getProjectDetailList(issuedate,endissuedate,1,curCardUuid,amountType,valueList[0],valueList[2]))
						dispatch(xmmxActions.changeDetailXmmxCommonString('',['flags', 'propertyCost'],valueList[2]))
						dispatch(xmmxActions.changeDetailXmmxCommonString('',['flags', 'categoryUuid'],valueList[0]))
						dispatch(xmmxActions.changeDetailXmmxCommonString('',['flags', 'categoryName'],valueList[1]))
						dispatch(xmmxActions.changeMenuData('menuType', ''))
					}}
				/>
			}
        }[menuType] || (()=> {
			thirdParty.setTitle({ title: '项目明细表' })
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
							selectedIndex={selectedIndex}
							amountType={amountType}
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
							selectedIndex={selectedIndex}
							amountType={amountType}
						/>
					</div>
					}
			})

		return (
			component ? component :
			<Container className="xmmxb">
				<TopMonthPicker
                    issuedate={issuedate}
                    source={issues} //默认显示日期
                    callback={(value) => {
						dispatch(xmmxActions.getFirstProjectDetailList(value,'',currentPage,amountType,typeUuid,curCardUuid,isTop,'','',curCardName))
						dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'selectedCard'], ''))
					}}
                    onOk={(result) => {
						dispatch(xmmxActions.getFirstProjectDetailList(result.value,'',currentPage,amountType,typeUuid,curCardUuid,isTop,'','',curCardName))
						dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'selectedCard'], ''))
					}}
                    showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
						dispatch(xmmxActions.getFirstProjectDetailList(result.value,'',currentPage,amountType,typeUuid,curCardUuid,isTop,'','',curCardName))
						dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'selectedCard'], ''))
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						dispatch(xmmxActions.getFirstProjectDetailList(issuedate,result.value,currentPage,amountType,typeUuid,curCardUuid,isTop,'','',curCardName))
						dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'selectedCard'], ''))
					}}
					changeEndToBegin={()=>{
						dispatch(xmmxActions.getFirstProjectDetailList(issuedate,'',currentPage,amountType,typeUuid,curCardUuid,isTop,'','',curCardName))
						dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'selectedCard'], ''))}}
                />

				<div className="xmmx-top-select">
					<div className='xmmx-with-account'>
						<Row className='lrls-row'>
							<Row className='lrls-type'
								onClick={() => {
									if (lastCategory.size) {
										dispatch(xmmxActions.changeMenuData('menuType', 'LB_CATEGORY'))
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
					<div className="xmmx-account-select" >
						<Row className='lrls-row'>
							<Row className='lrls-type'
								onClick={() => {
									if (runningCategory.size) {
										dispatch(xmmxActions.changeMenuData('menuType', 'RLB_CATEGORY'))
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

				<WingBlank>
					<SegmentedControl
						values={['收支发生额', '实收实付额']}
						selectedIndex={selectedIndex}
						onChange={(e) => {
							dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'selectedIndex'],e.nativeEvent.selectedSegmentIndex))
							switch (e.nativeEvent.selectedSegmentIndex) {
								case 0:
									dispatch(xmmxActions.getProjectDetailList(issuedate,endissuedate,1,curCardUuid,'DETAIL_AMOUNT_TYPE_HAPPEN',categoryUuid,propertyCost))
									break
								case 1:
									dispatch(xmmxActions.getProjectDetailList(issuedate,endissuedate,1,curCardUuid,'DETAIL_AMOUNT_TYPE_BALANCE',categoryUuid,propertyCost))
									break
							}
						}}
					/>
				</WingBlank>


				<ScrollView flex="1" uniqueKey="xmmx-scroll"  className= 'scroll-item' savePosition>
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
									amountType={amountType}
								/>
							</div>
						})}
					</div>
					<ScrollLoad
						diff={1}
						classContent='flow-content'
						callback={(_self) => {
							dispatch(xmmxActions.getProjectDetailList(issuedate,endissuedate,currentPage+1,curCardUuid,amountType,categoryUuid,propertyCost,true,true,_self))
						}}
						isGetAll={currentPage >= pageCount }
						itemSize={detailsTemp.size}
					/>
				</ScrollView>
				<Row className='ba-title-single'>
					<div className='ba-title-item'>{direction}</div>
					<div className='ba-title-item'><Amount showZero={true}>{total}</Amount></div>
				</Row>
			</Container>
		)
	}
}
