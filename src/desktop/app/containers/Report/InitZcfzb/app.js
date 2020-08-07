import React from 'react'
import { connect } from 'react-redux'

import * as zcfzbActions from 'app/redux/Report/Zcfzb/zcfzb.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

import { Title } from 'app/components'
import InitTable from './InitTable.jsx'
import { Button, Tooltip } from 'antd'
import { judgePermission } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import './style/index.less'

@connect(state => state)
export default
class InitZcfzb extends React.Component {

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.zcfzbState != nextprops.zcfzbState || this.props.homeState != nextprops.homeState
	}
	render() {
		const { zcfzbState, allState, dispatch, homeState } = this.props

		const issues = allState.get('issues')
		const firstyear = allState.getIn(['period', 'firstyear'])
		const issuedate = zcfzbState.get('issuedate')
		const initBaSheetList = zcfzbState.get('initBaSheetList')
		const focusRef = zcfzbState.get('focusRef')

		// const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		//报表/资产负债表
        const detailList = homeState.getIn(['data','userInfo','pageController','REPORT','preDetailList','BALANCE_SHEET','detailList'])

		return (
			<ContainerWrap type="report-one" className='initZcfzb'>
				<FlexTitle>
					<div className="flex-title-left">
					</div>
					<div className="flex-title-right">
						<Button
							className="title-right"
							type="ghost"
							onClick={() => {
								dispatch(homeActions.addPageTabPane('ReportPanes', 'Zcfzb', 'Zcfzb', '资产负债表'))
								dispatch(homeActions.addHomeTabpane('Report', 'Zcfzb', '资产负债表'))
							}}
							>
							返回
						</Button>
						<Button
							className="title-right"
							type="ghost"
							// disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
							disabled={judgePermission(detailList.get('ADJUST')).disabled}
							onClick={() => {
								thirdParty.Confirm({
									message: `本操作将清空数据`,
									title: "提示",
									buttonLabels: ['取消', '确定'],
									onSuccess : (result) => {
										if (result.buttonIndex === 1) {
											dispatch(zcfzbActions.clearInitAmount())
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
								// disabled={!configPermissionInfo.getIn(['edit', 'permission'])}
								disabled={judgePermission(detailList.get('ADJUST')).disabled}
								onClick={() => dispatch(zcfzbActions.saveInitZcfzbFetch())}
								>
								保存
							</Button>
						</Tooltip>
					</div>
				</FlexTitle>
				<InitTable
					// isAdmin={configPermissionInfo.getIn(['edit', 'permission'])}
					isAdmin={!judgePermission(detailList.get('ADJUST')).disabled}
					focusRef={focusRef}
					dispatch={dispatch}
					initBaSheetList={initBaSheetList}
				/>
			</ContainerWrap>
		)
	}
}
