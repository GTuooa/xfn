import React, { PropTypes } from 'react'
import { fromJS, toJS, is } from 'immutable'
import { connect }	from 'react-redux'
import { SegmentedControl, WingBlank } from 'antd-mobile'
import { cxAccountActions } from 'app/redux/Search/Cxls'
import thirdParty from 'app/thirdParty'
import { TopMonthPicker, ScrollLoad } from 'app/containers/components'
import { Button, ButtonGroup, Icon, Container, Row, ScrollView, Amount } from 'app/components'
import * as zhmxbActions from 'app/redux/Mxb/Zhmxb/zhmxb.action.js'
import { Account,CategoryCom} from 'app/containers/Edit/Lrls/components'
import * as Limit from 'app/constants/Limit.js'

import Ba from './Ba.jsx'
import Category from './Category.jsx'
import './zhmxb.less'

@connect(state => state)
export default
class Zhmxb extends React.Component {
	componentDidMount() {
		thirdParty.setTitle({ title: '账户明细表' })
		thirdParty.setIcon({ showIcon: false })
		const zhmxbState = this.props.zhmxbState
		const menuType = zhmxbState.getIn(['flags','menuType'])
		thirdParty.setRight({ show: false })

		if (sessionStorage.getItem('ylPage') === 'zhmxb') {
			sessionStorage.removeItem('fromPage')
			return
		}
		if (sessionStorage.getItem('fromPage') === 'zhyeb') {
			sessionStorage.removeItem('fromPage')
			return
		}
		this.props.dispatch(zhmxbActions.changeMenuData('menuType', ''))
		this.props.dispatch(zhmxbActions.getPeriodDetailList())
	}
	componentWillReceiveProps(nextprops) {
        if(!is(nextprops.zhmxbState.getIn(['flags','menuType']),this.props.zhmxbState.getIn(['flags','menuType']))) {

			if(nextprops.zhmxbState.getIn(['flags','menuType']) === 'LB_CATEGORY'){
				thirdParty.setRight({
					show: true,
					control: true,
					text: '取消',
					onSuccess: (result) => this.props.dispatch(zhmxbActions.changeMenuData('menuType', '')),
					onFail: (err) => {alert(err)}
				})
			}else{
				thirdParty.setRight({ show: false })
			}
        }

    }

	render() {
		const { dispatch, cxAccountState, history, zhmxbState,allState} = this.props

		const lastCategory = zhmxbState.get('runningCategory')
		const accountList = zhmxbState.get('accountList')
		const issuedate = zhmxbState.getIn(['flags','issuedate'])
		const issues = zhmxbState.get('issues')

		const firstDate = issues.getIn([0,'value'])
		const lastDate = issues.getIn([issues.size - 1,'value'])
		const endissuedate = zhmxbState.getIn(['flags','endissuedate'])
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)
		const end = endissuedate ? endissuedate : issuedate

		const detailsTemp = zhmxbState.get('detailsTemp')
		const QcData = zhmxbState.get('QcData')

		const currentPage = zhmxbState.get('currentPage')
		const pageCount = zhmxbState.get('pageCount')
		const amountType = zhmxbState.getIn(['flags','amountType'])
		const property = zhmxbState.getIn(['flags','property'])

		const categoryUuid = zhmxbState.getIn(['flags','curCategory'])
		const categoryName = zhmxbState.getIn(['flags','categoryType'])
		const accountUuid = zhmxbState.getIn(['flags','curAccountUuid'])
		const accountName = zhmxbState.getIn(['flags','accountType'])
		const menuLeftIdx = zhmxbState.getIn(['flags','menuLeftIdx'])
		const menuType = zhmxbState.getIn(['flags','menuType'])
		const propertyCost = zhmxbState.getIn(['flags','propertyCost'])

		const allHappenAmount = zhmxbState.getIn(['flags','allHappenAmount'])
		const allHappenBalanceAmount = zhmxbState.getIn(['flags','allHappenBalanceAmount'])
		const allIncomeAmount = zhmxbState.getIn(['flags','allIncomeAmount'])
		const allExpenseAmount = zhmxbState.getIn(['flags','allExpenseAmount'])
		const allBalanceAmount = zhmxbState.getIn(['flags','allBalanceAmount'])
		const bussinessShowChild = zhmxbState.getIn(['flags','bussinessShowChild'])
		const ylDataList = zhmxbState.get('ylDataList')
        const loop = (data,leve) => data.map((item,i) => {
            const showChild = bussinessShowChild.indexOf(item.get('uuid')) > -1
            const backgroundColor = leve > 1 ? '#FEF3E3' : '#fff'
            if (item.get('childList').size) {
                return  <div key={i}>
                    <Ba
                        leve={leve}
                        className="balance-running-tabel-width"
                        style={{backgroundColor}}
                        ba={item}
                        haveChild={true}
                        showChild={showChild}
                        history={history}
                        dispatch={dispatch}
                        issuedate={issuedate}
						ylDataList={ylDataList}
                    />
                        {showChild ? loop(item.get('childList'), leve+1) : ''}
                </div>
            } else {
                return <div key={i}>
                    <Ba
                        leve={leve}
                        className="balance-running-tabel-width"
                        ba={item}
                        style={{backgroundColor}}
                        history={history}
                        dispatch={dispatch}
                        issuedate={issuedate}
						ylDataList={ylDataList}
                    />
                </div>
            }

        })

		const totalType = {
			'收入': '收款',
			'支出': '付款',
			'核销': '核销',
			'': '收款'
		}[property]

		let component = null
		;({
			'LB_CATEGORY': () => {//选择类别页面
				component = <Category
					data={lastCategory}
					leftIdx={menuLeftIdx}
					leftClick={(idx) => dispatch(zhmxbActions.changeMenuData('menuLeftIdx', idx))}
					onChange={(value) => {
						const valueList = value[1].split(Limit.TREE_JOIN_STR)
						dispatch(zhmxbActions.getDetailList(valueList[0],issuedate,1,accountUuid,endissuedate,valueList[2]))
						dispatch(zhmxbActions.changeCommonStr('',['flags','categoryType'],valueList[1]))
						dispatch(zhmxbActions.changeCommonStr('',['flags','propertyCost'],valueList[2]))
						dispatch(zhmxbActions.changeMenuData('menuType', ''))
					}}
				/>
			}
        }[menuType] || (()=> {
			thirdParty.setTitle({ title: '账户明细表' })
			return null}))()

		return (
			component ? component :
			<Container className="zhmxb">
				<TopMonthPicker
                    issuedate={issuedate}
                    source={issues} //默认显示日期
                    callback={(value) => {
						dispatch(zhmxbActions.getDetailList('',value,1,accountUuid,'','',false, true))
						// dispatch(cxAccountActions.getBusinessList(1, value, false, true))
					}}
                    onOk={(result) => {
						dispatch(zhmxbActions.getDetailList('',result.value,1,accountUuid,'','',false, true))
					}}
                    showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
						dispatch(zhmxbActions.getDetailList('',result.value,1,accountUuid,'','',false, true))
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						dispatch(zhmxbActions.getDetailList('',issuedate,1,accountUuid,result.value,'',false, true))

					}}
					changeEndToBegin={()=>
						dispatch(zhmxbActions.getDetailList('',issuedate,1,accountUuid,'','',false, true))
					}
                />

				<div className="zhmx-top-select">
					<div className="zhmx-account-select" >
						<Account
							accountList={accountList && accountList.map(v => {return {key: v.get('name'), value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}})}
							accountUuid={accountUuid}
							accountName={accountName}
							noInsert={true}
							onOk={(result) =>{
								if(result){
									const valueList = result.split(Limit.TREE_JOIN_STR)
									dispatch(zhmxbActions.getDetailList(categoryUuid,issuedate,1,result,endissuedate,''))
									dispatch(zhmxbActions.changeCommonStr('',['flags','accountType'],valueList[1]))
									dispatch(zhmxbActions.changeCommonStr('',['flags','categoryName'],valueList[1]))
								}
							}}
						/>
					</div>
					<div className={'zhmx-with-account'}>
						<Row className='lrls-row'>
							<Row className='lrls-type'
								onClick={() => {
									if (lastCategory.size) {
										dispatch(zhmxbActions.changeMenuData('menuType', 'LB_CATEGORY'))
									} else {
										return
									}
								}}
							>
								<span>{lastCategory.size ? categoryName : '暂无类别'}</span>

								<Icon type="triangle" />
							</Row>
						</Row>

					</div>
				</div>

				{
					categoryName == '全部'?
					<Row className='ba-title-qc'>
						<div className='ba-title-item'>期初余额</div>
						<div className='ba-title-item'><Amount showZero={true}>{QcData.balanceAmount}</Amount></div>
					</Row>
					: ''
				}


				<ScrollView flex="1" uniqueKey="zhmx-scroll"  className= 'scroll-item' savePosition>
					{
						<div className='ba-list flow-content'>
							{/* {detailsTemp.map((v, i) => {
								return <Vc
									key={i}
									className=""
									item={v}
									dispatch={dispatch}
									history={history}
									categoryName={categoryName}
									idx={i}
								/>
							})} */}
							{loop(detailsTemp,1)}
						</div>
					}
					<ScrollLoad
						diff={1}
						classContent='flow-content'
						callback={(_self) => {
							dispatch(zhmxbActions.getDetailList(categoryUuid,issuedate,currentPage+1,accountUuid,endissuedate,propertyCost,true, false,true,_self))

						}}
						isGetAll={currentPage >= pageCount }
						itemSize={detailsTemp.size}
					/>
				</ScrollView>
				{
					categoryName == '全部'?
					<Row className='ba-title-qc'>
						<div className='ba-title-item'>期末余额</div>
						<div className='ba-title-item'><Amount showZero={true}>{allBalanceAmount}</Amount></div>
					</Row>
					:
					<Row className='ba-title'>
						<div className='ba-title-item'>{totalType}净额</div>
						<div className='ba-title-item'></div>
						<div className='ba-title-item'></div>
						<div className='ba-title-item'><Amount showZero={true}>{allBalanceAmount}</Amount></div>
					</Row>
				}
			</Container>
		)
	}
}
