import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'

import * as lrbActions from 'app/redux/Report/Lrb/lrb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

import { Button, Tooltip } from 'antd'
import * as thirdParty from 'app/thirdParty'
import InitTable from './InitTable.jsx'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import './style/index.less'
import { judgePermission } from 'app/utils'

@connect(state => state)
export default
class InitLrb extends React.Component {

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.lrbState != nextprops.lrbState || this.props.homeState != nextprops.homeState
	}

	render() {

		const { lrbState, dispatch, allState, homeState } = this.props
		//报表/利润表
        const detailList = homeState.getIn(['data','userInfo','pageController','REPORT','preDetailList','PROFIT_REPORT','detailList'])
		const initPeriodList = lrbState.get('initPeriodList')
		const lrbRuleModal = lrbState.get('lrbRuleModal')

		// const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])

		return (
			<ContainerWrap type="report-one" className='initLrb'>
				<FlexTitle>
					<div className="flex-title-left">
					</div>
					<div className="flex-title-right">
						<Button
							className="title-right"
							type="ghost"
							onClick={() => {
								dispatch(homeActions.addPageTabPane('ReportPanes', 'Lrb', 'Lrb', '利润表'))
								dispatch(homeActions.addHomeTabpane('Report', 'Lrb', '利润表'))
							}}
							>
							返回
						</Button>
						<Button
							className="title-right"
							type="ghost"
							onClick={() => {
								thirdParty.Confirm({
									message: `本操作将清空数据`,
									title: "提示",
									buttonLabels: ['取消', '确定'],
									onSuccess : (result) => {
										if (result.buttonIndex === 1) {
											dispatch(lrbActions.clearInitLrb())
										}
									}
								})
							}}
							>
							清空
						</Button>
						<Tooltip placement="bottom" title={judgePermission(detailList.get('ADJUST')).disabled ? '当前角色无该权限' : ''}>
							<Button
								className="title-right"
								type="ghost"
								disabled={judgePermission(detailList.get('ADJUST')).disabled}
								onClick={() => dispatch(lrbActions.saveInitLrbFetch())}
								>
								保存
							</Button>
						</Tooltip>
					</div>
				</FlexTitle>
				<InitTable incomestatement={initPeriodList} dispatch={dispatch} isAdmin={!judgePermission(detailList.get('ADJUST')).disabled}/>
			</ContainerWrap>
		)
	}
}
