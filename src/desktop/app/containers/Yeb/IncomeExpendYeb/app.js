import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map, List } from 'immutable'
import './style.less'

import { Button, message } from 'antd'
import { debounce } from 'app/utils'
import PageSwitch from 'app/containers/components/PageSwitch'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import MutiPeriodMoreSelect from 'app/containers/components/MutiPeriodMoreSelect'
import { Export } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import { ROOT } from 'app/constants/fetch.account.js'

import Table from './Table'

import * as incomeExpendYebActions from 'app/redux/Yeb/IncomeExpendYeb/incomeExpendYeb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
class IncomeExpendYeb extends React.Component {

	static displayName = 'IncomeExpendYeb'

	static propTypes = {
		allState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func
	}

	constructor(props) {
		super(props)
		this.state = {
			showModal: false
		}
	}

	componentDidMount() {
		this.props.dispatch(incomeExpendYebActions.getPeriodAndIncomeExpendYebBalanceList())
	}


	render() {

		const { allState, homeState, dispatch, incomeExpendYebState } = this.props
		const { showModal } = this.state

		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])

		const issuedate = incomeExpendYebState.get('issuedate')
		const endissuedate = incomeExpendYebState.get('endissuedate')
		const chooseValue = incomeExpendYebState.getIn(['views', 'chooseValue'])
		const showChildList = incomeExpendYebState.getIn(['views', 'showChildList'])
		const allItemShow = incomeExpendYebState.getIn(['views', 'allItemShow'])

		const accountIssues = allState.get('accountIssues')
		const pageList = homeState.get('pageList')
		const isSpread = homeState.getIn(['views', 'isSpread'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		const incomeExpendBalanceList = incomeExpendYebState.get('incomeExpendBalanceList')
		const totalBalance = incomeExpendYebState.get('totalBalance')

		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])

		const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
		const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

		return (
			<ContainerWrap type="fjgl-one" className="incomeExpend-yeb">
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread || pageList.getIn(['Yeb','pageList']).size <= 1 ? '' :
							<PageSwitch
								pageItem={pageList.get('Yeb')}
								onClick={(page, name, key) => {
									dispatch(homeActions.addPageTabPane('YebPanes', key, key, name))
									dispatch(homeActions.addHomeTabpane(page, key, name))
								}}
							/>
						}
						<MutiPeriodMoreSelect
							issuedate={issuedate}
							endissuedate={endissuedate}
							issues={accountIssues}
							chooseValue={chooseValue}
							changeChooseperiodsStatu={(value) => dispatch(incomeExpendYebActions.changeIncomeExpendYebChooseValue(value))}
							changePeriodCallback={(value1, value2) => dispatch(incomeExpendYebActions.getIncomeExpendYebBalanceList(value1, value2))}
						/>
					</div>
					<div className="flex-title-right">
						{
							<span className="title-right title-dropdown">
								<Export
									isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
									type="first"
									exportDisable={!begin || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay}

									excelDownloadUrl={`${ROOT}/jr/excel/export/incomeAndExpense/balance?${URL_POSTFIX}&begin=${begin}&end=${end}`}
									ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendIncomeExcelbalance', {begin: begin, end: end}))}
									onErrorSendMsg={(type, valueFirst, valueSecond) => {
										dispatch(allActions.sendMessageToDeveloper({
											title: '导出发送钉钉文件异常',
											message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
											remark: '收支余额表',
										}))
									}}
								/>
							</span>
						}
						<Button
							className="title-right"
							type="ghost"
							onClick={() => debounce(() => {
								dispatch(incomeExpendYebActions.getPeriodAndIncomeExpendYebBalanceList(issuedate, endissuedate))
							})()}
						>
							刷新
						</Button>
					</div>
				</FlexTitle>
				<Table
					dispatch={dispatch}
					issuedate={issuedate}
					endissuedate={endissuedate}
					incomeExpendBalanceList={incomeExpendBalanceList}
					totalBalance={totalBalance}
					showChildList={showChildList}
					allItemShow={allItemShow}
					chooseValue={chooseValue}
					paginationCallBack={value => dispatch(incomeExpendYebActions.getIncomeExpendMxbListFromPage(issuedate, endissuedate,value))}
				/>

			</ContainerWrap>
		)
	}
}
