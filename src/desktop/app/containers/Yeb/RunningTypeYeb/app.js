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
import { TableWrap } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import { Export } from 'app/components'
import { ROOT } from 'app/constants/fetch.account.js'

import Table from './Table'

import * as runningTypeYebActions from 'app/redux/Yeb/RunningTypeYeb/runningTypeYeb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
class RunningTypeYeb extends React.Component {

	static displayName = 'RunningTypeYeb'

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
		this.props.dispatch(runningTypeYebActions.getPeriodAndRunningTypeYebBalanceList())
	}


	render() {

		const { allState, homeState, dispatch, runningTypeYebState } = this.props
		const { showModal } = this.state

		const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])

		const issuedate = runningTypeYebState.get('issuedate')
		const endissuedate = runningTypeYebState.get('endissuedate')
		const chooseValue = runningTypeYebState.getIn(['views', 'chooseValue'])
		const showChildList = runningTypeYebState.getIn(['views', 'showChildList'])

		const accountIssues = allState.get('accountIssues')
		const pageList = homeState.get('pageList')
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isSpread = homeState.getIn(['views', 'isSpread'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		const runningTypeBalanceList = runningTypeYebState.get('runningTypeBalanceList')
		const totalBalance = runningTypeYebState.get('totalBalance')

		const begin = issuedate ? issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}` : ''
		const end = endissuedate ? endissuedate.substr(4,1) ==='-' ? endissuedate : `${endissuedate.substr(0, 4)}-${endissuedate.substr(6, 2)}` : ''

		return (
			<ContainerWrap type="fjgl-one" className="runningType-yeb">
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
							changeChooseperiodsStatu={(value) => dispatch(runningTypeYebActions.changeRunningTypeYebChooseValue(value))}
							changePeriodCallback={(value1, value2) => dispatch(runningTypeYebActions.getRunningTypeYebBalanceList(value1, value2))}
						/>
					</div>
					<div className="flex-title-right">
						<span className="title-right title-dropdown">
							<Export
								isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
								type="first"
								exportDisable={!begin || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay}

								excelDownloadUrl={`${ROOT}/jr/excel/export/type/balance?${URL_POSTFIX}&begin=${begin}&end=${end}`}
								ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'sendTypeExcelbalance', {begin: begin, end: end}))}
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
								dispatch(runningTypeYebActions.getPeriodAndRunningTypeYebBalanceList(issuedate, endissuedate))
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
					runningTypeBalanceList={runningTypeBalanceList}
					totalBalance={totalBalance}
					showChildList={showChildList}
					chooseValue={chooseValue}
					paginationCallBack={value => dispatch(runningTypeYebActions.getRunningTypeYebMxbListFromPage(issuedate, endissuedate,value))}
				/>

			</ContainerWrap>
		)
	}
}
