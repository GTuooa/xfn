import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect }	from 'react-redux'
import { toJS } from 'immutable'
import * as otherAllActions from 'app/redux/Home/All/other.action'
import * as qcyeActions from 'app/redux/Config/Qcye/qcye.action'
import thirdParty from 'app/thirdParty'
import { ButtonGroup, Button, Container, ScrollView, Row, Icon } from 'app/components'
import Ba from './Ba.jsx'
import Title from './Title.jsx'
import './qcye.less'
import { showMessage } from 'app/utils'

@connect(state => state)
export default
class Qcye extends React.Component {

	componentDidMount() {
		thirdParty.setTitle({title: '期初余额'})
		const closedyear = this.props.allState.getIn(['period', 'closedyear'])
		this.props.dispatch(qcyeActions.getAcBalanceFetch(closedyear))
	}
	componentWillReceiveProps(nextprops) {
		if (nextprops.qcyeState.get('acbalist') !== this.props.qcyeState.get('acbalist'))
			this.props.dispatch(qcyeActions.chengeQcyeIsModified(true))
	}
	componentWillUnmount() {

		const configPermissionInfo = this.props.homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

		if (editPermission) {
			const isModified = this.props.qcyeState.get('isModified')
			const period = this.props.allState.get('period')
			const hasClosed = period.get('firstyear') ? !!period.get('closedyear') : false

			if (isModified && !hasClosed) {
				thirdParty.Confirm({
					message: "是否需要保存期初设置数据？",
					title: "提示",
					buttonLabels: ['不保存', '保存'],
					onSuccess : (result) => {
						if (result.buttonIndex === 1) {
							this.props.dispatch(qcyeActions.setAcBalanceFetch())
						}
					},
					onFail : (err) => alert(err)
				})
			}
		}
	}
	render() {
		const {
			dispatch,
			qcyeState,
			allState,
			history,
			homeState
		} = this.props

		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

		const acbalist = qcyeState.get('acbalist').map((v, i) => v.set('idx', i))
		const selectIdx = qcyeState.get('selectIdx')

		const period = allState.get('period')
		const hasClosed = period.get('firstyear') ? !!period.get('closedyear') : false

		const acasslist = allState.get('acasslist')
		const aclist = allState.get('aclist')
		const aclistSeq = allState.get('aclist').toSeq()
		const acTags = allState.get('acTags')
		const unitDecimalCount = allState.getIn(['systemInfo', 'unitDecimalCount'])

		const tabSelectedIndex = qcyeState.get('tabSelectedIndex')
		const tabSelectedSubTags = acTags.getIn([tabSelectedIndex, 'sub'])
		const showedLowerAcIdList = qcyeState.get('showedLowerAcIdList')
		const isModified = qcyeState.get('isModified')

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
		const ddExcelCallback = () => dispatch => dispatch(otherAllActions.allExportDo('qcyeexcelsend'))

		dispatch(otherAllActions.navigationSetMenu('config', '', ddExcelCallback))


		return (
			<Container className="qcye">
				<Title tabSelectedIndex={tabSelectedIndex} dispatch={dispatch} acTags={acTags}/>
				<Row className="qcye-line title">
					<span className="acname">科目</span>
					<span className="direction">方向</span>
					<span className="amount">期初余额</span>
				</Row>
				<ScrollView flex="1" className="qcye-container">
					{
						(currTabAcList || []).map((v, i) =>{
							const upperid = v.get('upperid')
							const color = upperid ? '#999' : '#222'
							const display = !upperid || showedLowerAcIdList.indexOf(upperid) > -1 ? '' : 'none'
							const isExpanded = showedLowerAcIdList.indexOf(v.get('acid')) > -1

							return(
								<Ba
									hasSub={v.get('hasSub')}
									isExpanded={isExpanded}
									style={{display}}
									itemstyle={{color}}
									idx={i}
									key={v.get('acid')}
									ac={v}
									acbalist={acbalist}
									acasslist={acasslist}
									aclist={aclist}
									dispatch={dispatch}
									unitDecimalCount={unitDecimalCount}
								/>
							)
						})
					}
				</ScrollView>
				<ButtonGroup>
					<Button disabled={!editPermission || hasClosed} onClick={() => {
						thirdParty.Confirm({
							message: "确定已完成期初值导出备份？",
							title: "提示",
							buttonLabels: ['取消', '确定'],
							onSuccess : (result) => {
								if (result.buttonIndex === 1) {
									dispatch(qcyeActions.setAcBalanceFetch('clean'))
								}
							}
						})
					}}><Icon type='clean'/><span>清空</span></Button>
					<Button disabled={!editPermission || hasClosed} onClick={() => {
						if (isModified) {
							return thirdParty.Alert('保存数据后方能进行试算平衡')
						} else {
							dispatch(qcyeActions.getTrailBalanceFetch())
						}
					}}><Icon type="balance-scale" size="14"/><span>试算平衡</span></Button>
					<Button disabled={!editPermission || hasClosed} onClick={() => {
						if (isModified) {
							dispatch(qcyeActions.setAcBalanceFetch())
						} else {
							return thirdParty.Alert('未进行期初值修改！')
						}
					}}><Icon type='save'/><span>保存</span></Button>
				</ButtonGroup>
			</Container>
		)
	}
}
