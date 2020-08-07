import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'

import * as xjllbActions from 'app/redux/Report/Xjllb/xjllb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

import { Button, Tooltip } from 'antd'
import thirdParty from 'app/thirdParty'
import InitTable from './InitTable.jsx'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import './style/index.less'
import { judgePermission } from 'app/utils'

@connect(state => state)
export default
class InitXjllb extends React.Component {

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.xjllbState != nextprops.xjllbState || this.props.homeState != nextprops.homeState
	}

	render() {

		const { xjllbState, dispatch, allState, homeState } = this.props

		const initPeriodList = xjllbState.get('initPeriodList')
		const lrbRuleModal = xjllbState.get('lrbRuleModal')

		// const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		//报表/现金流量表
        const detailList = homeState.getIn(['data','userInfo','pageController','REPORT','preDetailList','CASH_FLOW_REPORT','detailList'])

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
								dispatch(homeActions.addPageTabPane('ReportPanes', 'Xjllb', 'Xjllb', '现金流量表'))
								dispatch(homeActions.addHomeTabpane('Report', 'Xjllb', '现金流量表'))
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
											dispatch(xjllbActions.clearInitXjllb())
										}
									},
									onFail : (err) => console.log(err)
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
								onClick={() => dispatch(xjllbActions.saveInitXjllbFetch())}
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
