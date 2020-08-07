import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { toJS, Map, fromJS } from 'immutable'
import * as assAllActions from 'app/redux/Home/All/asslist.actions'
import * as acAllActions from 'app/redux/Home/All/aclist.actions'
import * as otherAllActions from 'app/redux/Home/All/other.action'
import * as assconfigActions from 'app/redux/Config/Ass/assconfig.action'
import './ass-config.less'
import Ass from './Ass.jsx'
import Title from './Title.jsx'

import { Button, ButtonGroup, Container, Row, ScrollView, Icon, Collapse } from 'app/components'
import thirdParty from 'app/thirdParty'

@connect(state => state)
export default
class AssConfig extends React.Component {

	componentDidMount() {
		thirdParty.setTitle({title: '辅助核算'})
		thirdParty.setRight({show: false})
		thirdParty.setIcon({
            showIcon: false
        })
		this.props.dispatch(acAllActions.getAcListandAsslistFetch())
	}
	render() {
		const {
			dispatch,
			assconfigState,
			history,
			allState,
			homeState
		} = this.props

		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

		// const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const expireInfo = homeState.getIn(['data', 'userInfo', 'moduleInfo'])

		const AMBCanUse = expireInfo ? (expireInfo.get('AMB') ? true : false) : false

		const selectAssAll = assconfigState.get('selectAssAll')
		const toolBarDisplayIndex = assconfigState.get('toolBarDisplayIndex')
		const allAssCheckBoxDisplay = assconfigState.get('allAssCheckBoxDisplay')
		const assTags = allState.get('assTags')

		// 是否有非零个item被选中
		const nonZeroAssItemBool = allState.get('acasslist').toSeq().reduce((p, v) => p.concat(v.get('asslist')), fromJS([])).some(v => v.get('selected'))
		//通过当前选择的tab栏索引获取到相应类别
		const tabSelectedIndex = assconfigState.get('tabSelectedIndex')
		const tabSelectedAssCategory = assTags.get(tabSelectedIndex) || '客户'
		//通过类别获取当前acasslist中相应的索引和具体对象
		const acAssSelectedIndex = allState.get('acasslist').findKey(v => v.get('asscategory') == tabSelectedAssCategory)
		const acass = allState.getIn(['acasslist', acAssSelectedIndex])
		//获取acass中的aclist和asslist(插入类别)
		const aclist = acass ? acass.get('aclist') : []
		const asslist = acass ? acass.get('asslist').map(v => v.set('asscategory', tabSelectedAssCategory)) : fromJS([])
		// export
		const ddExcelCallback = () => dispatch => dispatch(otherAllActions.allExportDo('excelsend', {year: 0, month: 0, exportModel: 'ass', action: 'MANAGER-ASS_SETTING-EXPORT_ASS'}))

		dispatch(otherAllActions.navigationSetMenu('config', '', ddExcelCallback))

		return (
			<Container className="ass-config">
				<Title
					tabSelectedIndex={tabSelectedIndex}
					assTags={assTags}
					dispatch={dispatch}
					tabSelectedAssCategory={tabSelectedAssCategory}
				/>
				<ScrollView flex="1">
					{/* <div className="ass-config-category">{`辅助类别：${tabSelectedAssCategory}`}</div> */}
					<Collapse title="关联科目" maxHeight=".33rem" showedCollapseFooter={aclist.size > 2}>
						{aclist.map((v, i) =>
							<span className="ac-info" key={v.get('acid')}>
								{/* <Icon className="icon" type="label"/>
								<span>{[v.get('acid'), v.get('acfullname')].join(' ')}</span> */}
								<span className="ac-info-icon"><Icon type="label" color="#7E6B5A" /></span>
								<span className="ac-info-number">{v.get('acid')}</span>
								<span className="ac-info-name">{v.get('acfullname')}</span>
							</span>
						)}
						<span className="clear-both"></span>
					</Collapse>
					<ul className="form-tip" style={{display: asslist.size === 0 ? 'block' : 'none'}}>
						<li className="form-tip-item">
							该辅助类别下至少需要有一个辅助核算才能“关联科目”
						</li>
					</ul>
					{asslist.map((v, i) =>
						<Ass
							key={i}
							idx={i}
							assitem={v}
							acAssSelectedIndex={acAssSelectedIndex}
							allAssCheckBoxDisplay={allAssCheckBoxDisplay}
							dispatch={dispatch}
							className={v.get('disableTime') ? 'fzhs-item-disable' : ''}
							isEnd={i === asslist.size-1 ? true : false}
							history={history}
						/>
					)}
				</ScrollView>
				<ButtonGroup height={50} style={{display: allAssCheckBoxDisplay ? 'none' : ''}}>
					<Button disabled={!editPermission} onClick={() => dispatch(assconfigActions.beforeInsertAss(tabSelectedAssCategory)) && history.push('/config/option/ass')}><Icon type="add-plus"/><span>新增</span></Button>
					<Button disabled={!editPermission || acAssSelectedIndex === undefined} onClick={() => dispatch(assconfigActions.showAllAssCheckBox())}><Icon type="select" size='15'/><span>选择</span></Button>
					<Button
						disabled={!editPermission}
						onClick={() => {

							const otherButtons = AMBCanUse ? ["阿米巴模式", "关联科目", "反悔模式"] : ["关联科目", "反悔模式"]

							if (!editPermission) {
								history.push('/config/relation/ac')
							} else {
								thirdParty.actionSheet({
									title: "选择",
									cancelButton: "取消",
									otherButtons: otherButtons,
									onSuccess: function(result) {
										if (AMBCanUse) {
											if (result.buttonIndex == -1) {
												return
											} else if (result.buttonIndex == 0) {
												history.push('/config/amb')
											} else if (result.buttonIndex == 1) {
												if (!editPermission)
													thirdParty.Alert('管理员和观察员不能关联科目')
												if (asslist.size === 0)
													thirdParty.Alert('请先创建辅助项目')
												history.push('/config/relation/ac')
											} else if (result.buttonIndex == 2) {
												if (!editPermission)
													return thirdParty.Alert('记账员和观察员不能使用反悔模式')
												dispatch(assconfigActions.changeReversAssCategory(tabSelectedAssCategory))
												history.push('/reverse/reverseass')
											}
										} else {
											if (result.buttonIndex == -1) {
												return
											} else if (result.buttonIndex == 0) {
												if (!editPermission)
													thirdParty.Alert('管理员和观察员不能关联科目')
												if (asslist.size === 0)
													thirdParty.Alert('请先创建辅助项目')
												history.push('/config/relation/ac')
											} else if (result.buttonIndex == 1) {
												if (!editPermission)
													return thirdParty.Alert('记账员和观察员不能使用反悔模式')
												dispatch(assconfigActions.changeReversAssCategory(tabSelectedAssCategory))
												history.push('/reverse/reverseass')
											}
										}
									},
									onFail : function(err) {}
								})
							}
						}}
					><Icon type={!editPermission ? "edit" : "more"}/><span>{!editPermission ? "关联科目" : "更多"}</span></Button>
				</ButtonGroup>
				<ButtonGroup height={50} style={{display: allAssCheckBoxDisplay ? '' : 'none'}}>
					<Button disabled={acAssSelectedIndex === undefined} onClick={() => dispatch(assAllActions.selectAssAll(acAssSelectedIndex))}><Icon type="choose"/><span>全选</span></Button>
					<Button onClick={() => dispatch(assconfigActions.hideAllAssCheckBox()) & dispatch(assAllActions.unselectAssAll(acAssSelectedIndex))}><Icon type="cancel"/><span>取消</span></Button>
					<Button disabled={!nonZeroAssItemBool} onClick={() => dispatch(assAllActions.deleteAssFetch())}><Icon type="delete"/><span>删除</span></Button>
				</ButtonGroup>
			</Container>
		)
	}
}

// <Button
// 	disabled={!editPermission || (asslist.size === 0 ? true : false)}
// 	onClick={() => {
// 		history.push('/config/relation/ac')
// 		const categoryIndex = aclist.size === 0 ? 0 : aclist.getIn([0, 'acid']).substr(0,1) - 1 //0-4d对应类别资产至损益
// 		dispatch(assconfigActions.changeTabIndexAcAssconfig(categoryIndex))
// 		// sessionStorage.setItem('config', 'assconfig')
// 	}}><Icon type="edit"/><span>关联科目</span>
// </Button>
