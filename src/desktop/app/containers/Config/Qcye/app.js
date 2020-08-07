import React from 'react'
import { connect }	from 'react-redux'

import * as qcyeActions	from 'app/redux/Config/Qcye/qcye.action.js'

import { Button, message, Modal, Select } from 'antd'
import { TableWrap, TableBody, TitleKmye, TableAll, TableItem, Amount } from 'app/components'
import AcList from './AcList.jsx'
import Title from './Title.jsx'
import TableTitle from './TableTitle'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import { toJS, fromJS } from 'immutable'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import './style/index.less'

@connect(state => state)
export default
class qcConfig extends React.Component {

	componentDidMount() {
		const closedyear = this.props.allState.getIn(['period', 'closedyear'])
		this.props.dispatch(qcyeActions.getBaInitListFetch(closedyear))
	}

	shouldComponentUpdate(nextprops) {
		return this.props.qcyeState != nextprops.qcyeState || this.props.allState != nextprops.allState || this.props.homeState != nextprops.homeState
	}

	componentWillReceiveProps(nextprops) {
		if (nextprops.qcyeState.get('acbalist') !== this.props.qcyeState.get('acbalist'))
			this.props.dispatch(qcyeActions.chengeQcyeIsModified(true))
	}

	render() {
		const { qcyeState, dispatch, allState, homeState } = this.props

		// const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const detailList = homeState.getIn(['data', 'userInfo', 'pageController', 'MANAGER', 'preDetailList', 'AC_SETTING', 'detailList'])
		const tabSelectedIndex = qcyeState.getIn(['flags', 'tabSelectedIndex'])
		const aclist = allState.getIn(['categoryAclist', tabSelectedIndex])
		const aclistLength = aclist.size

		const acbalist = qcyeState.get('acbalist')
		const asslist = allState.get('allasscategorylist')
		const qcModalDisplay = qcyeState.getIn(['flags', 'qcModalDisplay'])

		const period = allState.get('period')
		const hasClosed = !!period.get('closedyear')
		const unitDecimalCount = allState.getIn(['systemInfo', 'unitDecimalCount'])

		const isModified = qcyeState.getIn(['flags', 'isModified'])

		const entertext = qcyeState.getIn(['flags', 'entertext'])
		const currentasscategorylist = qcyeState.getIn(['flags', 'currentasscategorylist'])

		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		return (
			<ContainerWrap type="config-three" className='initQcye'>
				<Title
					tabSelectedIndex={tabSelectedIndex}
					acbalist={acbalist}
					qcyeState={qcyeState}
					dispatch={dispatch}
					allState={allState}
					acbalist={acbalist}
					hasClosed={hasClosed}
					// configPermissionInfo={configPermissionInfo}
					detailList={detailList}
					isModified={isModified}
					URL_POSTFIX={URL_POSTFIX}
					isPlay={isPlay}
				/>
				<TableWrap notPosition="true">
					<TableAll>
						<TableTitle />
						<i className="table-title-shadow"></i>
						<i className="table-title-shadow" style={{top:'30px'}}></i>
						<TableBody className="qcye-table-body">
							{aclist.map((u, j) => {
								const showInput = j === aclistLength ? true : (aclist.getIn([j+1, 'upperid']) === u.get('acid') ? false : true)
								const showCountInput = u.get('acunitOpen') == "1" ? true:false;
								const asscategorylist = u.get('asscategorylist')

								const assItemSizeArr = asscategorylist.size === 0 ? fromJS([]) : asscategorylist.map(v => {
									const curasslist = asslist.filter(w => w.get('asscategory') === v).getIn([0, 'asslist'])
									return curasslist ? curasslist.size : 0
								})
								const asslistSize = assItemSizeArr.size === 0 ? 0 : assItemSizeArr.reduce((v, pre) => v * pre)

								return <AcList
									key={j}
									hasClosed={hasClosed}
									asslistSize={asslistSize}
									asscategorylist={asscategorylist}
									acitem={u} dispatch={dispatch}
									acbalist={acbalist}
									showInput={showInput}
									showCountInput={showCountInput}
									unitDecimalCount={unitDecimalCount}
								/>
							})}
						</TableBody>
					</TableAll>
				</TableWrap>
				<Modal
					title="选择辅助核算"
					onOk={() => {
						// entertext是用户选择了的类别的项目
						if (entertext.every(v => v !== '')) {
							if (entertext.size === currentasscategorylist.size) {
								dispatch(qcyeActions.enterQcAssText())
								dispatch(qcyeActions.afterenterQcAssText())
							} else {
								// dispatch(qcyeActions.cancleEnterQcModal())
								thirdParty.Alert('辅助核算不能为空!')
							}
						} else {
							thirdParty.Alert('辅助核算不能为空!')
						}
					}}
					visible={qcModalDisplay}
					onCancel={() => dispatch(qcyeActions.cancleEnterQcModal())}
					>
					{currentasscategorylist.map((v, i) => {
						const currentacid = qcyeState.getIn(['flags', 'currentacid'])
						const acbaitem = acbalist.filter(v => v.get('acid') === currentacid)
						const assidlist = acbaitem && acbaitem.map(v => v.getIn(['asslist', 0, 'assid'])).splice(-1,1)

						return <div key={i} className="qcye-table-item-assselect">
							<label className="qcye-table-item-label">{v + ':'}</label>
							<Select
								showSearch
								optionFilterProp={"children"}
								value={entertext.get(i) ? entertext.get(i).replace(Limit.TREE_JOIN_STR, ' ') : entertext.get(i)}
								onChange={value => value || dispatch(qcyeActions.changeQcAssText(value, i))}
								onSelect={value => dispatch(qcyeActions.changeQcAssText(value, i))}
								>
								{asslist.filter(u => u.get('asscategory') == v).getIn([0, 'asslist']).map(w => {
									return <Option key={w.get('assid')} value={w.get('assid') + Limit.TREE_JOIN_STR + w.get('assname')}>{w.get('assid') + '_' + w.get('assname')}</Option>
								})}
							</Select>
						</div>
					})}
				</Modal>
			</ContainerWrap>
		)
	}
}
