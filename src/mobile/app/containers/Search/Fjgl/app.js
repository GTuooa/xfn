import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect }	from 'react-redux'

import * as fjglActions from 'app/redux/Search/Fjgl/fjgl.action.js'
import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'

import * as thirdParty from 'app/thirdParty'
import { TopMonthPicker } from 'app/containers/components'
import { Button, ButtonGroup, Icon, Container, Row, ScrollView,SinglePicker } from 'app/components'
import './fjgl.less'
import Vc from './Vc.jsx'

@connect(state => state)
export default
class Fjgl extends React.Component {

	/*begin: po 20161104, xxxxxx */
	componentDidMount() {
		thirdParty.setTitle({title: '凭证附件'})
		thirdParty.setRight({show: false})
		thirdParty.setIcon({
            showIcon: false
        })
		this.props.dispatch(fjglActions.getFjListFetch())

	}
	/*end*/
	render() {
		const {
			dispatch,
			fjglState,
			history,
			allState,
			homeState
		} = this.props

		const pzPermissionInfo = homeState.getIn(['permissionInfo', 'Pz'])
		const editPermission = pzPermissionInfo.getIn(['edit', 'permission'])

		const allCheckboxDisplay = fjglState.get('allCheckboxDisplay')
		const toolBarDisplayIndex = fjglState.get('toolBarDisplayIndex')
		const vclist = fjglState.get('vclist')

		const issuedate = fjglState.get('issuedate')
		const currentPage = fjglState.get('currentPage')
		const pageCount = fjglState.get('pageCount')
		// 是否有非零个vcitem被选中
		const issues = allState.get('issues')

		const period = allState.get('period')
		const year = allState.getIn(['period', 'openedyear'])
		const month = allState.getIn(['period', 'openedmonth'])

		const closedby = vclist.getIn([0, 'closedby']) ? true : false
		let hasChecked=false;
		let hasCheckedAndReviewed=false;
		vclist.forEach((v)=>{
			if(v.get('enclosureList').some(w => w.get('checkboxFjDisplay'))){
				hasChecked=true;
				if(hasChecked&&v.get('reviewedby')){
					hasCheckedAndReviewed=true
				}
				return
			}
		})
		const label = fjglState.get('label').toJS()
		const fjLabel = fjglState.get('fjLabel').toJS()
		const labelValue = fjglState.get('labelValue')
		const totalSize=fjglState.get('totalSize')
		const useSizeBySob=fjglState.get('useSizeBySob')
		const useSizeByCorp=fjglState.get('useSizeByCorp')
		const corpPercent=((useSizeByCorp/(totalSize*1024))*100).toFixed(2);
		const needDownLoad = fjglState.get('needDownLoad').toJS()
		return (
			<Container className="fjgl">
				<TopMonthPicker
					issuedate={issuedate}
					source={issues} //默认显示日期
					callback={(value) => {
						dispatch(fjglActions.changeFjglIssudate(value))
						dispatch(fjglActions.getFjListFetch())
					}}
					onOk={(result) => {
						dispatch(fjglActions.changeFjglIssudate(result.value))
						dispatch(fjglActions.getFjListFetch())
					}}
				/>
				{/* 改 */}
				<Row className='fjgl-top'>
					<SinglePicker district={label} value='' onOk={(result) => {
						dispatch(fjglActions.changeLabelValue(result.value))
						dispatch(fjglActions.getFjListFetch())
					}}>
						<div>
							{labelValue}
							<Icon type="triangle" size="11"></Icon>
						</div>
					</SinglePicker>
					<ul>
						<li>
							剩余容量：{((totalSize*1024-useSizeByCorp)/1024).toFixed(2)}G
							<span>{totalSize}G</span>
						</li>
						<li>
							<div>
								<div style={{'width':corpPercent+'%'}}></div>
							</div>
						</li>
					</ul>
				</Row>
				<ScrollView flex="1" uniqueKey="fjgl-scroll" savePosition>
					{vclist.map((v, i) =>
						<Vc
							allCheckboxDisplay={allCheckboxDisplay}
							idx={i}
							key={i}
							vcitem={v}
							dispatch={dispatch}
							fjLabel={fjLabel}
							editPermission={editPermission}
							vclist={vclist}
							history={history}
						/>
					)}
				</ScrollView>
				<Row>
					<ButtonGroup type="ghost" style={{display: toolBarDisplayIndex === 1 ? '' : 'none'}}>
						<Button
							disabled={!editPermission || vclist.size === 0}
							onClick={() => {
								dispatch(fjglActions.changeFjCheckBoxDisplay())
							}}
							>
							<Icon type="select"/>
							<span>选择</span>
						</Button>
					</ButtonGroup>
					<ButtonGroup type="ghost" style={{display: toolBarDisplayIndex === 2 ? '' : 'none'}}>
						<Button
							// disabled={!editPermission || !(editPermission && hasChecked)}
							disabled={true}
							onClick={() => {
								dispatch(fjglActions.getDownloadData())
								thirdParty.Confirm({
									message: '单次下载最多支持九个附件，超过九个后默认选择前九个，附件将以消息的形式发送给您',
									title: "提示",
									buttonLabels: ['取消', '确定'],
									onSuccess : (result) => {
										if (result.buttonIndex === 1) {
											dispatch(fjglActions.download())
										}
									},
									onFail : function(err) {}
								})
                            }}>
							<Icon type="download"/>
							<span>下载</span>
						</Button>
						<Button onClick={() =>dispatch(fjglActions.cancelChangeFjCheckBoxDisplay())}>
							<Icon type="cancel"/>
							<span>取消</span>
						</Button>
						<Button
							disabled={!editPermission || !hasChecked || hasCheckedAndReviewed || closedby}
							onClick={() => dispatch(fjglActions.deleteFjItemFetch())}
							>
							<Icon type="delete"/>
							<span>删除</span>
						</Button>
					</ButtonGroup>
				</Row>
			</Container>
		)
	}
}
