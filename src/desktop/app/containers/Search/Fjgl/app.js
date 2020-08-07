import React from 'react'
import { toJS } from 'immutable'
import { connect } from 'react-redux'
import './style/index.less'

import { Button, Menu, Dropdown, Icon, Radio, Modal } from 'antd'
import { formatMoney, judgePermission } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
const RadioGroup = Radio.Group
import EnclosurePreview from 'app/containers/components/EnclosurePreview'
import ContainerWrap from 'app/components/Container/ContainerWrap'

import Table from './Table.jsx'
import Title from './Title.jsx'

import * as fjglActions from 'app/redux/Search/Fjgl/fjgl.action.js'
import { allDownloadEnclosure } from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
class Fjgl extends React.Component {

	componentDidMount() {
		this.props.dispatch(fjglActions.getFjListFetch())
	}

	constructor() {
		super()
		this.state = {
			inputValue: '',
			rotate: 0 //旋转的角度
		}
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.fjglState != nextprops.fjglState || this.props.allState != nextprops.allState || this.state != nextstate || this.props.homeState != nextprops.homeState
	}

	render() {
		const { dispatch, fjglState, allState, homeState } = this.props
		const { inputValue, rotate } = this.state
		//查询凭证权限 中的附件管理权限ATTACHMENT_MANAGER
		const detailList = homeState.getIn(['data','userInfo','pageController','QUERY_VC','preDetailList','ATTACHMENT_MANAGER','detailList'])
		const PzPermissionInfo = homeState.getIn(['permissionInfo', 'Pz'])
		const issues = allState.get('issues')
		const vclist = fjglState.get('vclist')

		const period = allState.get('period')
		const year = allState.getIn(['period', 'openedyear'])
		const month = allState.getIn(['period', 'openedmonth'])
		const issuedate = fjglState.get('issuedate')

		const selectVcAll = fjglState.getIn(['flags', 'selectVcAll'])
		const maxVoucherId = fjglState.getIn(['flags', 'maxVoucherId'])
		const vcindexSort = fjglState.getIn(['flags', 'vcindexSort'])
		const vcdateSort = fjglState.getIn(['flags', 'vcdateSort'])
		const closeby = vclist.getIn([ 0, 'closedby']) ? true : false

		const firstyear = period.get('firstyear')
		const lastyear = period.get('lastyear')

		const havVc = !!firstyear && !!lastyear
		const vclistExist = vclist.size ? true : false

		const receiveAble = vclist.filter(v => v.get('checkboxDisplay')).every(v => v.get('reviewedby'))
		const cancelReceiveAble = vclist.filter(v => v.get('checkboxDisplay')).some(v => v.get('reviewedby'))
		const preview = fjglState.getIn(['flags', 'preview'])
		const previewImgArr = fjglState.get('previewImgArr')
		const previewSrcIdx = fjglState.get('previewSrcIdx')
		const fjLabel=fjglState.get('fjLabel')
		const labelModal = fjglState.getIn(['flags', 'labelModal'])
		const currentLabel = fjglState.get('currentLabel')
		const updatePath = fjglState.get('updatePath')
		const radioStyle = {
			display: 'block',
			height: '30px',
			lineHeight: '30px'
		};
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const intelligentStatus = moduleInfo ? (moduleInfo.indexOf('RUNNING') > -1 ? true : false) : false

		return (
			<ContainerWrap type="fjgl-one" className="fjgl">
				<Title
					havVc={havVc}
					year={year}
					month={month}
					receiveAble={receiveAble}
					cancelReceiveAble={cancelReceiveAble}
					firstyear={firstyear}
					allState={allState}
					issues={issues}
					vclist={vclist}
					closeby={closeby}
					dispatch={dispatch}
					issuedate={issuedate}
					fjglState={fjglState}
					vclistExist={vclistExist}
					inputValue={inputValue}
					detailList={detailList}
					// PzPermissionInfo={PzPermissionInfo}
					changeInputValue={(value) => this.setState({inputValue: value})}
					changeSearchValue={(value) => dispatch(fjglActions.serchForVc(value))}
					onChange={value => dispatch(fjglActions.changeFjglIssudate(value)) && dispatch(fjglActions.getFjListFetch())}
					onChangeLabel={value => dispatch(fjglActions.changeLabelValue(value)) && dispatch(fjglActions.getFjListFetch())}
					intelligentStatus={intelligentStatus}
				/>
				<Table
					vcindexSort={vcindexSort}
					vcdateSort={vcdateSort}
					dispatch={dispatch}
					selectVcAll={selectVcAll}
					vclist={vclist}
					issuedate={issuedate}
					detailList={detailList}
					PzPermissionInfo={PzPermissionInfo}
				/>
				<Modal
					title="标签"
					visible={labelModal}
					onCancel={()=>dispatch(fjglActions.closeLabelModal())}
					footer={[
						<Button
							onClick={()=>dispatch(fjglActions.closeLabelModal())}
						>
							取消
						</Button>,
						<Button
							type="primary"
							// disabled={!PzPermissionInfo.getIn(['edit', 'permission'])}
							disabled={ judgePermission(detailList.get('ATTACHMENT_LABEL_MANAGER')).disabled }
							onClick={() => dispatch(fjglActions.updateLabel(updatePath,currentLabel))}
						>
							确定
						</Button>
					]}
				>
					<RadioGroup onChange={(e)=>dispatch(fjglActions.changeCurrentLabel(e.target.value))} value={currentLabel}>
						{fjLabel.map((v, i) => <Radio style={radioStyle} key={i} value={v}>{v}</Radio>)}
					</RadioGroup>
				</Modal>
				<EnclosurePreview
					page={previewSrcIdx}
					dispatch={dispatch}
					preview={preview}
					downloadPermission={PzPermissionInfo.getIn(['edit', 'permission'])}
					downloadEnclosure={(enclosureUrl, fileName) => dispatch(allDownloadEnclosure(enclosureUrl, fileName))}
					previewImgArr={previewImgArr}
					closePreviewModal={() => dispatch(fjglActions.closePrewiew())}
				/>
			</ContainerWrap>
		)
	}
}
