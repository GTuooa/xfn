import React, { PropTypes } from 'react'
import { fromJS, toJS, is } from 'immutable'
import { connect }	from 'react-redux'
import { SegmentedControl, WingBlank } from 'antd-mobile'
import { cxAccountActions } from 'app/redux/Search/Cxls'
import * as thirdParty from 'app/thirdParty'
import { TopMonthPicker, ScrollLoad } from 'app/containers/components'
import { Button, ButtonGroup, Icon, Container, Row, ScrollView, Amount } from 'app/components'
import * as xmyeActions from 'app/redux/Yeb/Xmyeb/Xmyeb.action.js'
import * as xmmxActions from 'app/redux/Mxb/Xmmxb/xmMxb.action.js'
import { Account,CategoryCom, Menu } from 'app/containers/Edit/Lrls/components'
import * as Limit from 'app/constants/Limit.js'

import DoubleItem from './DoubleItem.jsx'
import Category from './Category.jsx'
import './xmyeb.less'

@connect(state => state)
export default
class xmyeb extends React.Component {
	constructor(props) {
		super(props)
    }
	componentDidMount() {
		thirdParty.setTitle({ title: '项目余额表' })
		thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })
		if (sessionStorage.getItem('fromPage') === 'xmyeb') {
			sessionStorage.removeItem('fromPage')
			return
		}
		if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(xmyeActions.getFirstProjectList())
		}
		this.props.dispatch(xmyeActions.changeMenuData('menuType', ''))

	}
	componentWillReceiveProps(nextprops) {
        if(!is(nextprops.xmyebState.getIn(['flags','menuType']),this.props.xmyebState.getIn(['flags','menuType']))) {

			if(nextprops.xmyebState.getIn(['flags','menuType']) === 'LB_CATEGORY' || nextprops.xmyebState.getIn(['flags','menuType']) === 'RLB_CATEGORY'){
				thirdParty.setRight({
					show: true,
					control: true,
					text: '取消',
					onSuccess: (result) => this.props.dispatch(xmyeActions.changeMenuData('menuType', '')),
					onFail: (err) => {alert(err)}
				})
			}else{
				thirdParty.setRight({ show: false })
			}
        }

    }

	render() {
		const { dispatch, history, xmyebState} = this.props

		const lastCategory = xmyebState.getIn(['flags','projectCategoryList'])
		const runningCategory = xmyebState.getIn(['flags','categoryList'])
		const wlRelationship = xmyebState.getIn(['flags','wlRelationship'])
		const issuedate = xmyebState.getIn(['flags','issuedate'])
		const issues = xmyebState.get('issues')
		const runningShowChild = xmyebState.getIn(['flags','runningShowChild'])

		const endissuedate = xmyebState.getIn(['flags','endissuedate'])
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)
		const end = endissuedate ? endissuedate : issuedate

		const balanceTemp = xmyebState.get('balanceTemp')

		const currentPage = xmyebState.get('currentPage')
		const pageCount = xmyebState.get('pageCount')

		const isTop = xmyebState.getIn(['flags', 'isTop'])

		const menuType = xmyebState.getIn(['flags','menuType'])
		const menuLeftIdx = xmyebState.getIn(['flags','menuLeftIdx'])
		const lbMenuLeftIdx = xmyebState.getIn(['flags','lbMenuLeftIdx'])
		const runningType = xmyebState.getIn(['flags','runningType'])
		const xmType = xmyebState.getIn(['flags','xmType'])
		const categoryUuid = xmyebState.getIn(['flags','categoryUuid'])
		const runningCategoryUuid = xmyebState.getIn(['flags', 'runningCategoryUuid'])
		const propertyCost = xmyebState.getIn(['flags','propertyCost'])
		let component = null
		;({
			'LB_CATEGORY': () => {//选择类别页面
				component = <Category
					data={lastCategory}
					leftIdx={menuLeftIdx}
					leftClick={(idx) => dispatch(xmyeActions.changeMenuData('menuLeftIdx', idx))}
					onChange={(value) => {
						const valueList = value[1].split(Limit.TREE_JOIN_STR)
						dispatch(xmyeActions.changeXmYeInnerCommonString(['flags','xmType'],valueList[1]))
						dispatch(xmyeActions.changeXmYeInnerCommonString(['flags','runningType'],'全部'))
						dispatch(xmyeActions.getProjectBalanceList(issuedate,endissuedate,1,valueList[2],valueList[0],''))
						dispatch(xmyeActions.getProjectCategoryList(issuedate,endissuedate,valueList[0],valueList[2]))
						dispatch(xmyeActions.changeMenuData('menuType', ''))
					}}
				/>
			},
			'RLB_CATEGORY': () => {//选择类别页面
				component = <Category
					data={runningCategory}
					leftIdx={lbMenuLeftIdx}
					leftClick={(idx) => dispatch(xmyeActions.changeMenuData('lbMenuLeftIdx', idx))}
					onChange={(value) => {
						const valueList = value[1].split(Limit.TREE_JOIN_STR)
						dispatch(xmyeActions.changeXmYeInnerCommonString(['flags','runningType'],valueList[1]))
						dispatch(xmyeActions.getProjectBalanceList(issuedate,endissuedate,1,isTop,categoryUuid,valueList[0],valueList[2]))
						dispatch(xmyeActions.changeMenuData('menuType', ''))
						dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'categoryName'], valueList[1]))
					}}
				/>
			}
        }[menuType] || (()=> {
			thirdParty.setTitle({ title: '项目余额表' })
			return null}))()

			const loop = (data,leve) => data.map((item,i) => {
				const showChild = runningShowChild.indexOf(item.get('uuid')) > -1
				const backgroundColor = leve > 1 ? '#FEF3E3' : '#fff'
				if (item.get('childList').size) {
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
							issuedate={issuedate}
							endissuedate={endissuedate}
							isTop={isTop}
							xmType={xmType}
							runningType={runningType}
							categoryUuid={categoryUuid}
							runningCategoryUuid={runningCategoryUuid}
							propertyCost={propertyCost}
						/>
						{showChild ? loop(item.get('childList'), leve+1) : ''}
					</div>
				} else {
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
							issuedate={issuedate}
							endissuedate={endissuedate}
							isTop={isTop}
							xmType={xmType}
							runningType={runningType}
							runningCategoryUuid={runningCategoryUuid}
						/>
						{showChild ? loop(item.get('childList'), leve+1) : ''}
					</div>

				}
			})

		return (
			component ? component :
			<Container className="xmyeb">
				<TopMonthPicker
                    issuedate={issuedate}
                    source={issues} //默认显示日期
                    callback={(value) => {
						dispatch(xmyeActions.getFirstProjectList(value))
					}}
                    onOk={(result) => {
						dispatch(xmyeActions.getFirstProjectList(result.value))
					}}
                    showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
                        dispatch(xmyeActions.getFirstProjectList(result.value))
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						dispatch(xmyeActions.getFirstProjectList(issuedate,result.value))
					}}
					changeEndToBegin={()=>dispatch(xmyeActions.getProjectBalanceList(issuedate))}
                />

				<div className="xmye-top-select">
					<div className={'xmye-with-account'}>
						<Row className='lrls-row'>
							<Row className='lrls-type'
								onClick={() => {
									if (lastCategory.size) {
										dispatch(xmyeActions.changeMenuData('menuType', 'LB_CATEGORY'))
									} else {
										return
									}
								}}
							>
								<span>{lastCategory.size ? xmType : '全部'}</span>
								<Icon type="triangle" />
							</Row>
						</Row>

					</div>
					<div className={'xmye-with-account'}>
						<Row className='lrls-row'>
							<Row className='lrls-type xmye-type'
								onClick={() => {
									if (runningCategory.size) {
										dispatch(xmyeActions.changeMenuData('menuType', 'RLB_CATEGORY'))
									} else {
										return
									}
								}}
							>
								<span>{runningCategory.size ? runningType : '全部'}</span>
								<Icon type="triangle" />
							</Row>
						</Row>

					</div>


				</div>
				{
					<Row className='ba-title-double'>
						<div className='ba-title-item'>
							<span className="item-item">收入额</span>
							<span className="item-item">实收额</span>
						</div>
						<div className='ba-title-item'>
							<span className="item-item">支出额</span>
							<span className="item-item">实付额</span>
						</div>
						<div className='ba-title-item'>
							<span className="item-item">收支净额</span>
							<span className="item-item">收付净额</span>
						</div>
					</Row>
				}

				<ScrollView flex="1" uniqueKey="xmye-scroll"  className= 'scroll-item' savePosition>
					<div className='ba-list flow-content'>
						{loop(balanceTemp,1)}
					</div>
					<ScrollLoad
						diff={1}
						classContent='flow-content'
						callback={(_self) => {
							dispatch(xmyeActions.getProjectBalanceList(issuedate,endissuedate,currentPage+1,isTop,categoryUuid,runningCategoryUuid,propertyCost, true,true,_self))
						}}
						isGetAll={currentPage >= pageCount }
						itemSize={balanceTemp.size}
					/>
				</ScrollView>
			</Container>
		)
	}
}
