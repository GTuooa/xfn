import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect }	from 'react-redux'
import './ac-config.less'
import { Button, ButtonGroup, Icon, Container, Row, ScrollView } from 'app/components'
import * as acAllActions from 'app/redux/Home/All/aclist.actions'
import * as otherAllActions from 'app/redux/Home/All/other.action'
import * as acconfigActions from 'app/redux/Config/Ac/acconfig.action'
import Ac from './Ac.jsx'
import Title from './Title.jsx'
import thirdParty from 'app/thirdParty'

@connect(state => state)
export default
class AcConfig extends React.Component {

	componentDidMount() {
		thirdParty.setTitle({title: '科目设置'})
		thirdParty.setIcon({
            showIcon: false
        })
		thirdParty.setRight({show: false})

		if (sessionStorage.getItem("preverPage") === "qcye") {
			sessionStorage.removeItem('preverPage')
			return
		} else {
			this.props.dispatch(acAllActions.getAcListandAsslistFetch())
		}
		// sessionStorage.setItem('config', 'acconfig')
	}

	render() {
		const {
			dispatch,
			acconfigState,
			history,
			allState,
			homeState
		} = this.props

		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

		const aclistSeq = allState.get('aclist').toSeq()
		const tabSelectedIndex = acconfigState.get('tabSelectedIndex')
		const allAcCheckBoxDisplay = acconfigState.get('allAcCheckBoxDisplay')
		const allAcModifyButtonDisplay = acconfigState.get('allAcModifyButtonDisplay')
		const toolBarDisplayIndex = acconfigState.get('toolBarDisplayIndex')
		const showedLowerAcIdList = acconfigState.get('showedLowerAcIdList')
		const currAcIdFirstChar = tabSelectedIndex + 1

		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const NUMBERCanUse = moduleInfo ? (moduleInfo.indexOf('NUMBER') > -1 ? true : false) : false
		const unitDecimalCount = allState.getIn(['systemInfo', 'unitDecimalCount'])

		// 是否有非零个item被选中
		const nonZeroAcItemBool = allState.get('aclist').some(v => v.get('selected'))

		const acTags = allState.get('acTags')
		const tabSelectedSubTags = acTags.getIn([tabSelectedIndex, 'sub'])
		//当前tab页的科目列表
		const currTabAcList = aclistSeq
			//设置每个科目相对于数组的编号，便于分页之后相关操作定位
			.map((v, i) => v.set('idx', i))
			//只显示符合当前选中的页面的科目
			.filter(v => tabSelectedSubTags.indexOf(v.get('category')) > -1)
			//判断是否存在下一级，并设置标示位
			.map(v => {
				const currAcid = v.get('acid')
				const nextAcupperid = aclistSeq.getIn([v.get('idx') + 1, 'upperid'])
				return v.set('hasSub', !!nextAcupperid && nextAcupperid === currAcid)
			})

		// export
		const ddExcelCallback = () => dispatch => dispatch(otherAllActions.allExportDo('excelsend', {year: 0, month: 0, exportModel: 'ac', action: 'MANAGER-AC_SETTING-EXPORT_AC'}))

		dispatch(otherAllActions.navigationSetMenu('config', '', ddExcelCallback))

		return (
			<Container className="ac-config">
				<Title
					tabSelectedIndex={tabSelectedIndex}
					dispatch={dispatch}
					acTags={acTags}
					callback={(value) => dispatch(acconfigActions.changeTabIndexAcConfig(value))}
				/>
				<div
					className="btn"
					style={{display: allAcModifyButtonDisplay ? '' : 'none'}}
					onClick={() => dispatch(acconfigActions.beforeInsertAc('', '', 'first', history))}
					>
					<Icon type="add" color="#7E6B5B" size="14"/>
					<span>增加一级科目</span>
				</div>
				<ScrollView flex="1" uniqueKey="ac-config-scroll" savePosition className="ac-list">
					{currTabAcList.map((u, j) => {
						const upperid = u.get('upperid')
						const backgroundColor = upperid ? '#FEF3E3' : '#fff'
						const display = !upperid || showedLowerAcIdList.indexOf(upperid) > -1 ? '' : 'none'
						const isExpanded = showedLowerAcIdList.indexOf(u.get('acid')) > -1
						const uppername = upperid ? currTabAcList.find(v => v.get('acid') === upperid).get('acname') : ''

						return (
							<Ac
								hasSub={u.get('hasSub')}
								isExpanded={isExpanded}
								style={{backgroundColor, display}}
								key={u.get('acid')}
								idx={u.get('idx')}
								ac={u}
								selectable={true}
								allAcCheckBoxDisplay={allAcCheckBoxDisplay}
								allAcModifyButtonDisplay={allAcModifyButtonDisplay}
								currTabAcList={currTabAcList}
								dispatch={dispatch}
								uppername={uppername}
								isEnd={j === currTabAcList.size-1 ? true : false}
								history={history}
							/>
						)
					})}
				</ScrollView>
				<Row>
					<ButtonGroup height={50} style={{display: toolBarDisplayIndex === 1 ? '' : 'none'}}>
						<Button disabled={!editPermission} onClick={() => dispatch(acconfigActions.showAllAcModifyButton())}><Icon type="add-plus"/><span>新增</span></Button>
						<Button disabled={!editPermission} onClick={() => dispatch(acconfigActions.showAllAcCheckBox())}><Icon type="select" size='15'/><span>选择</span></Button>
						<Button disabled={!editPermission} onClick={() => {
							if (!editPermission) {
								sessionStorage.setItem("preverPage", "qcye")
								history.push('/config/qcye')
							} else {
								thirdParty.actionSheet({
									title: "选择",
									cancelButton: "取消",
									otherButtons: NUMBERCanUse ? ["期初值", "反悔模式", "计算单位设置"] : ["期初值", "反悔模式"],
									onSuccess: function(result) {
										if (result.buttonIndex == -1) {
											return
										} else if (result.buttonIndex == 0) {
											history.push('/config/qcye')
										} else if (result.buttonIndex == 1) {
											history.push('/reverse/reverseac')
										} else if (result.buttonIndex == 2) {
											thirdParty.actionSheet({
												title: `数量值支持小数点后保留位数,当前为:${unitDecimalCount}`,
												cancelButton: "取消",
												otherButtons: ['0', '1', '2', '3', '4'],
												onSuccess: (result) => {
													if (result.buttonIndex > -1 && result.buttonIndex.toString() !== unitDecimalCount) {
														dispatch(otherAllActions.changeSystemunitDecimalCount(result.buttonIndex.toString()))
													} else {
														thirdParty.toast.info('小数点后保留位数未改变')
													}
												}
											})
										}
									},
									onFail : function(err) {}
								})
							}
						}}><Icon type={!editPermission ? "initial-value" : "more"}/><span>{!editPermission ? "期初值" : "更多"}</span></Button>
					</ButtonGroup>
					<ButtonGroup height={50} style={{display: toolBarDisplayIndex === 2 ? '' : 'none'}}>
						<Button onClick={() => dispatch(acAllActions.selectAcAll(tabSelectedSubTags))}><Icon type="choose"/><span>全选</span></Button>
						<Button onClick={() => dispatch(acAllActions.unselectAcAll()) & dispatch(acconfigActions.hideAllAcCheckBox())}><Icon type="cancel"/><span>取消</span></Button>
						<Button disabled={!nonZeroAcItemBool} onClick={() => dispatch(acAllActions.deleteAcFetch())}><Icon type="delete"/><span>删除</span></Button>
					</ButtonGroup>
					<ButtonGroup height={50} style={{display: toolBarDisplayIndex === 3 ? '' : 'none'}}>
						<Button onClick={() => dispatch(acconfigActions.hideAllAcModifyButton())}><Icon type="cancel"/><span>取消</span></Button>
					</ButtonGroup>
				</Row>
			</Container>
		)
	}
}
