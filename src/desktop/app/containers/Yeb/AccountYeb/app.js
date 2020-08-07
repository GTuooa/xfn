import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toJS, fromJS, Map } from 'immutable'
import './style.less'

import { Button, message } from 'antd'
import { debounce } from 'app/utils'
import PageSwitch from 'app/containers/components/PageSwitch'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import MutiPeriodMoreSelect from 'app/containers/components/MutiPeriodMoreSelect'
import * as Limit from 'app/constants/Limit.js'
import { Export } from 'app/components'
import { ROOT } from 'app/constants/fetch.account.js'

import Table from './Table'

import * as accountYebActions from 'app/redux/Yeb/AccountYeb/accountYeb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
	class AccountYeb extends React.Component {

	static displayName = 'AccountYeb'

	static propTypes = {
		allState: PropTypes.instanceOf(Map),
		dispatch: PropTypes.func
	}

	componentDidMount() {
		this.props.dispatch(accountYebActions.getPeriodAndAccountYebBalanceList())
	}

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.accountYebState != nextprops.accountYebState || this.props.homeState != nextprops.homeState
	}

	render() {

		const { allState, homeState, dispatch, accountYebState } = this.props

		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])

		const issuedate = accountYebState.get('issuedate')
		const endissuedate = accountYebState.get('endissuedate')
		const chooseValue = accountYebState.getIn(['views', 'chooseValue'])
		const accountBalanceList = accountYebState.get('accountBalanceList')
		const totalBalance = accountYebState.get('totalBalance')

		const accountIssues = allState.get('accountIssues')
		const pageList = homeState.get('pageList')
		const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
		const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

		return (
			<ContainerWrap type="yeb-seven" className="account-yeb">
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread || pageList.getIn(['Yeb', 'pageList']).size <= 1 ? '' :
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
							changeChooseperiodsStatu={(value) => dispatch(accountYebActions.changeAccountYebChooseValue(value))}
							changePeriodCallback={(value1, value2) => dispatch(accountYebActions.getAccountYebBalanceList(value1, value2))}
						/>
					</div>
					<div className="flex-title-right">
						<span className="title-right title-dropdown">
							<Export
								isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
								type="first"
								exportDisable={!begin || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay}

								excelDownloadUrl={`${ROOT}/jr/excel/export/account/balance?${URL_POSTFIX}&begin=${begin}&end=${end}`}
								ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendAccountExcelbalance', { begin: begin, end: end }))}
								onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '账户余额表',
									}))
								}}
							/>
						</span>
						<Button
							className="title-right"
							type="ghost"
							onClick={() => debounce(() => {
								dispatch(accountYebActions.getPeriodAndAccountYebBalanceList(issuedate, endissuedate))
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
					accountBalanceList={accountBalanceList}
					totalBalance={totalBalance}
					chooseValue={chooseValue}
				/>
			</ContainerWrap>
		)
	}
}
