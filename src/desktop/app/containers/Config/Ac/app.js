import React from 'react'
import { connect } from 'react-redux'
import './style/index.less'

import * as Limit from 'app/constants/Limit.js'
import AcOption from './AcOption.jsx'
import Title from './Title.jsx'
import Table from './Table.jsx'
import ReversAc from './ReversAc.jsx'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import { message } from 'antd'

import * as configActions from 'app/redux/Config/Ac/acConfig.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

@connect(state => state)
export default
	class AcConfig extends React.Component {

	componentDidMount() {
		this.props.dispatch(configActions.clearAcChildshow())
		this.props.dispatch(allActions.getAcListFetch(true))
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState != nextprops.allState || this.props.configState != nextprops.configState || this.state !== nextstate || this.props.homeState != nextprops.homeState
	}

	render() {
		const { dispatch, configState, allState, homeState } = this.props
		// const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		//获取管理权限信息 
		const CUD_AC_SETTING = homeState.getIn(['data', 'userInfo', 'pageController', 'MANAGER', 'preDetailList', 'AC_SETTING', 'detailList', 'CUD_AC_SETTING'])
		const detailList = homeState.getIn(['data', 'userInfo', 'pageController', 'MANAGER', 'preDetailList', 'AC_SETTING', 'detailList'])

		const acChildShow = configState.get('acChildShow')
		const acStatus = configState.get('acStatus')
		const tempAcItem = configState.get('tempAcItem')
		const selectAcAll = configState.get('selectAcAll')
		const acConfigMode = configState.get('acConfigMode')
		const modalDisplay = configState.get('modalDisplay')
		const acid = configState.getIn(['tempAcItem', 'acid'])
		const acSelectedIndex = configState.get('acSelectedIndex')
		const tabSelectedIndex = configState.get('tabSelectedIndex')
		let aclist = allState.getIn(['categoryAclist', tabSelectedIndex])
		const acidlist = aclist.filter((v, j) => acStatus.get(j)).map(v => v.get('acid'))

		// 当有东西删除时，2个列表长度不同时，刷新
		if (aclist.size != acStatus.size) {
			dispatch(configActions.initConfig(aclist))
			// aclist = []
		}

		const aclistExist = aclist.size ? true : false
		const acTags = allState.get('acTags')

		const upperidList = aclist.map(v => v.get('upperid').length == 4 ? v.get('upperid') : '')

		// 反悔模式所需数据
		const reverseModifiable = configState.get('reverseModifiable')
		const idNewAcReverseId = configState.get('idNewAcReverseId')
		const NewAcReverseId = configState.get('NewAcReverseId')
		const NewAcReverseName = configState.get('NewAcReverseName')
		const reverseAc = configState.get('reverseAc')
		const revenseAcid = reverseAc.get('acid')
		const revenseAcname = reverseAc.get('acname')
		const categoryList = reverseAc.get('categoryList')
		const acCount = reverseAc.get('acCount')
		const openingbalance = reverseAc.get('openingbalance')

		const disabled = !!tempAcItem.get('asscategorylist').size || tempAcItem.get('nextac')

		const reverseconfirmModalshow = configState.get('reverseconfirmModalshow')
		const reverseModifiModalshow = configState.get('reverseModifiModalshow')
		const reverseAcselectModalshow = configState.get('reverseAcselectModalshow')
		const canChangeClassId = configState.get('canChangeClassId')

		const acListTree = allState.get('cascadeAclist')
		const unitDecimalCount = allState.getIn(['systemInfo', 'unitDecimalCount'])

		let acListKeysArr = []
		// ['资产'， ‘负债’， 。。。]
		acListTree.forEach((v, key) => acListKeysArr.push(key))
		// const showQcye   = qcyeState.get('showQcye')
		const pageList = homeState.get('pageList')
		const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		return (
			<ContainerWrap type="config-one" className="ac-config-app">
				<Title
					detailList={detailList}
					tabSelectedIndex={tabSelectedIndex}
					dispatch={dispatch}
					configState={configState}
					allState={allState}
					acStatus={acStatus}
					acidlist={acidlist}
					aclistExist={aclistExist}
					acTags={acTags}
					// configPermissionInfo={configPermissionInfo}
					isSpread={isSpread}
					pageList={pageList}
					reverseClick={() => dispatch(configActions.switchReverseModifiModalShow())}
					URL_POSTFIX={URL_POSTFIX}
					isPlay={isPlay}
				/>
				<Table
					dispatch={dispatch}
					selectAcAll={selectAcAll}
					aclist={aclist}
					acStatus={acStatus}
					acChildShow={acChildShow}
					upperidList={upperidList}
					acConfigRowClick={(value) => dispatch(configActions.changeAcChildShow(value))}
					unitDecimalCount={unitDecimalCount}
					// configPermissionInfo={configPermissionInfo}
					detailList={detailList}
				/>
				<AcOption
					CUD_AC_SETTING={CUD_AC_SETTING}
					moduleInfo={moduleInfo}
					acSelectedIndex={acSelectedIndex}
					tempAcItem={tempAcItem}
					dispatch={dispatch}
					aclist={aclist}
					acTags={acTags}
					disabled={disabled}
					acConfigMode={acConfigMode}
					modalDisplay={modalDisplay}
					// configPermissionInfo={configPermissionInfo}
					configState={configState}
					tabSelectedIndex={tabSelectedIndex}
					acid={acid}
					onCancel={() => dispatch(configActions.changeModalDisplay()) && dispatch(configActions.cancelEnterAcItemFetch())}
					onClickSave={(tempAcItem, configState) => {
						if (tempAcItem.get('acunitOpen') == '1' && !tempAcItem.get('acunit')) {
							return message.warn('请输入计量单位');
						}
						if (tempAcItem.get('acunit').length > Limit.AC_UNIT_LENGTH) {
							return message.warn(`计算单位位数不能超过${Limit.AC_UNIT_LENGTH}位`)
						}

						const isChinese = /[\u4e00-\u9fa5]/g
						const isChineseSign = /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]/g
						// ： 。 ；  ， ： “ ”（ ） 、 ？ 《 》

						let acnameLimitLength = Limit.AC_CHINESE_NAME_LENGTH
						// if (configState.get('acConfigMode') === 'modify') {
						// 	acnameLimitLength = Limit.AC_NAME_ABLE_LENGTH
						// }
						if (!isChinese.test(tempAcItem.get('acname')) && !isChineseSign.test(tempAcItem.get('acname'))) {
							acnameLimitLength = Limit.AC_NAME_LENGTH
						}

						if (tempAcItem.get('acname').length > acnameLimitLength) {
							return message.warn(`科目名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；否则，长度不能超过${Limit.AC_NAME_LENGTH}位`)
						}

						dispatch(allActions.enterAcItemFetch('acConfig', configState.get('tempAcItem'), configState.get('acConfigMode'), tabSelectedIndex))

						this.setState({ acunitModify: false })
					}}
					onChangeAcId={e => dispatch(configActions.changeAcCodeText(e.target.value, aclist))}
					onChangeAcText={(e) => {
						dispatch(configActions.changeAcNameText(e.target.value))
					}}
					onSelect={value => dispatch(configActions.changeCategoryText(value))}
					onChangeSwitch={() => disabled || dispatch(configActions.changeAcDirectionText())}
					changeAmountCheckbox={() => {
						dispatch(configActions.changeAcAmountStateText(acConfigMode))
					}}
				/>
				<ReversAc
					dispatch={dispatch}
					canChangeClassId={canChangeClassId}
					reverseconfirmModalshow={reverseconfirmModalshow}
					reverseModifiModalshow={reverseModifiModalshow}
					reverseModifiable={reverseModifiable}
					reverseAc={reverseAc}
					revenseAcid={revenseAcid}
					revenseAcname={revenseAcname}
					idNewAcReverseId={idNewAcReverseId}
					NewAcReverseId={NewAcReverseId}
					NewAcReverseName={NewAcReverseName}
					categoryList={categoryList}
					openingbalance={openingbalance}
					acCount={acCount}
					reverseAcselectModalshow={reverseAcselectModalshow}
					acListTree={acListTree}
					acListKeysArr={acListKeysArr}
				/>
			</ContainerWrap>
		)
	}
}
