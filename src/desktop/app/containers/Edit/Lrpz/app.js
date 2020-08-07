import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { connect } from 'react-redux'
import { fromJS, toJS } from 'immutable'

import * as lrpzActions_init from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as fzhsActions from 'app/redux/Config/Ass/assConfig.action.js'
import * as draftActions from 'app/redux/Edit/Draft/draft.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

import Trees from './Trees.jsx'
import Title from './Title.jsx'
import Voucher from './Voucher.jsx'
// import Enclosure from './Enclosure.jsx'
import Enclosure from 'app/containers/components/Enclosure'
import AcOption from 'app/containers/Config/Ac/AcOption.jsx'
import FzModel from 'app/containers/Config/Ass/FzModel.jsx'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { Tabs, Modal, Input, Select, Button, Switch, message, Radio, Tooltip } from 'antd'
import { Icon } from 'app/components'
import { judgePermission } from 'app/utils'
import { AlertModal } from 'app/components'
import moment from 'moment'
import { nameCheck } from 'app/utils'
import './style/index.less'

const TabPane = Tabs.TabPane

@connect(state => state)
export default class Lrpz extends React.Component {

	constructor() {
		super()
		this.state = {
			saveWay: false,	   //凭证重复保存方式
			autoEncode: true    //true系统自动编号false插入凭证
		}
	}

	componentDidMount() {

		if (sessionStorage.getItem('previousPage') === 'home') {

			sessionStorage.setItem("lrpzHandleMode", "insert")
			sessionStorage.setItem("previousPage", '')
			const period = this.props.allState.get('period')
			const year = period.get('openedyear')
			const month = period.get('openedmonth')

			let vcDate = ''

			if (!year) {
				vcDate = new Date()
			} else {
				const lastDate = new Date(year, month, 0)
				const currentDate = new Date()
				const currentYear = new Date().getFullYear()
				const currentMonth = new Date().getMonth() + 1
				if (lastDate < currentDate) {   //本月之前
					vcDate = lastDate
				} else if (Number(year) == Number(currentYear) && Number(month) == Number(currentMonth)) {  //本月
					vcDate = currentDate
				} else {   //本月之后
					vcDate = new Date(year, Number(month)-1, 1)
				}
			}

			this.props.dispatch(lrpzActions_init.initAndGetLastVcIdFetch('initAndGetLastVcIdFetch', vcDate))
		}

		const moduleInfo = this.props.homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		//有没有开启附件
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_GL') > -1 ? true : false) : true
		const checkMoreFj = this.props.homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
		if(enCanUse && checkMoreFj){
			this.props.dispatch(lrpzActions_init.initLabel())
			// this.props.dispatch(lrpzActions_init.getUploadGetTokenFetch())
		}
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.lrpzState !== nextprops.lrpzState || this.props.allState !== nextprops.allState || this.state !== nextstate || this.props.filePrintState !== nextprops.filePrintState 
	}

	render() {
		const { dispatch, lrpzState, allState, homeState } = this.props
		const { saveWay, autoEncode } = this.state
		//录入凭证权限控制
		const preDetailList = homeState.getIn(['data','userInfo','pageController','SAVE_VC','preDetailList'])
		const QUERY_VC = homeState.getIn(['data','userInfo','pageController','QUERY_VC'])
		const lrpzFzhsPermission = preDetailList.getIn(['QUICK_MANAGER','detailList','SAVE_ASS'])
		const lrpzKmPermission = preDetailList.getIn(['QUICK_MANAGER','detailList','SAVE_AC'])
		// const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const PzPermissionInfo = homeState.getIn(['permissionInfo', 'Pz'])

		const allAssList = allState.get('allasscategorylist')
		const selectAcList = allState.get('lrAclist') //全部的科目列表
		const acListTree = allState.get('cascadeAclist')
		const acTags = allState.get('acTags') //科目类别
		const openedYear = allState.getIn(['period', 'openedyear'])
		const openedMonth = allState.getIn(['period', 'openedmonth'])
		const unitDecimalCount = allState.getIn(['systemInfo', 'unitDecimalCount']) ? Number(allState.getIn(['systemInfo', 'unitDecimalCount'])) : 2

		const jvList = lrpzState.get('jvList')
		const vcDate = lrpzState.get('vcDate')
		const vcIndex = lrpzState.get('vcIndex')
		const oldVcIndex = lrpzState.get('oldVcIndex')
		const year = lrpzState.get('year')
		const month = lrpzState.get('month')
		const closedBy = lrpzState.get('closedBy')
		const reviewedBy = lrpzState.get('reviewedBy')
		const createdBy = lrpzState.get('createdBy')
		const modifiedTime = lrpzState.get('modifiedTime')
		const createdTime = lrpzState.get('createdTime')
		const enclosureCountUser = lrpzState.get('enclosureCountUser')
		const importResponList = lrpzState.get('importResponList')
		const messages = lrpzState.get('message')
		const ass = lrpzState.get('ass')
		const increaseAcItem = lrpzState.get('increaseAcItem')
		const enclosureList = lrpzState.get('enclosureList'); // 图片上传
		const label = lrpzState.get('label');// 附件标签
		const tagModal = lrpzState.get('tagModal');// 附件标签modal
		const voucherIdx = lrpzState.getIn(['flags', 'voucherIdx'])
		const focusRef = lrpzState.getIn(['flags', 'focusRef'])
		const debitTotal = lrpzState.getIn(['flags', 'debitTotal'])
		const creditTotal = lrpzState.getIn(['flags', 'creditTotal'])
		const voucherIndexList = lrpzState.getIn(['flags', 'voucherIndexList'])
		const acModalDisplay = lrpzState.getIn(['flags', 'acModalDisplay'])
		const selectContent = lrpzState.getIn(['flags', 'acModalSelectedContent'])
		const lrfzhsModalDisplay = lrpzState.getIn(['flags', 'lrfzhsModalDisplay'])
		const lrAcModalDisplay = lrpzState.getIn(['flags', 'lrAcModalDisplay'])
		const showLrModalMask = lrpzState.getIn(['flags', 'showLrModalMask'])
		const assDropListFull = lrpzState.getIn(['flags', 'assDropListFull'])
		const lrIframeload = lrpzState.getIn(['flags', 'lrIframeload'])
		const shortCut = lrpzState.getIn(['flags', 'shortCut'])
		const titleFixed = lrpzState.getIn(['flags', 'titleFixed'])
		const focusBack = lrpzState.getIn(['flags', 'focusBack'])
		const currencyList = lrpzState.getIn(['flags', 'currencyList'])  //外币列表
		const showAssDisableInfo = lrpzState.getIn(['flags', 'showAssDisableInfo'])
		const showAssDisableModal = lrpzState.getIn(['flags', 'showAssDisableModal'])

		const vcKey = lrpzState.get('vcKey')   // 草稿
		const isEnterDraft = lrpzState.getIn(['flags', 'isEnterDraft'])
		const draftList = lrpzState.getIn(['flags', 'draftList'])
		const changeDraftIdx = lrpzState.getIn(['flags', 'changeDraftIdx'])

		const amountDisplay = jvList.some(v => v.get('acunitOpen') == '1')  //确定数量核算一栏是否显示 报过 Cannot read property 'get' of undefined 待定
		const currencyDisplay = jvList.some(v => v.get('fcNumber'))  //确定外币核算一栏是否显示

		const disabled = increaseAcItem.get('acid').length !== 4 ? true : false
		const lrpzHandleMode = sessionStorage.getItem('lrpzHandleMode') //凭证状态
		const lrpzDraft = sessionStorage.getItem('lrpzDraft')  //草稿的状态
		const lrpzActions = (!!closedBy || !!reviewedBy)  ? new Proxy({}, {get: () => () => ({type: 'NO_CHANGE'})}) : lrpzActions_init

		//附件上传
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		//有没有开启附件

		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_GL') > -1 ? true : false) : true
		const checkMoreFj = homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false

		const token = allState.get('token')
		const sobid = homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobId'])
		const useruuid = homeState.getIn(['data', 'userInfo', 'useruuid'])
		//begin：本url影响编译环境，不可做任何修改
		// const dirUrl = `test/${sobid}/${year}-${month}/${vcIndex}`;
		const timestamp = new Date().getTime()
		const dirUrl = `test/${sobid}/${useruuid}/${timestamp}`
		//end：本url影响编译环境，不可做任何修改

		const changeJvAc = () => {

			const acId = selectContent.split(' ')[0]
			const acItem = selectAcList.find(v => v.get('acid') == acId)
			dispatch(lrpzActions.changeAcModalDisplay())
			// dispatch(lrpzActions.changeJvAc(acModalDisplay, acId, acItem && acItem.get('acname'), acItem && acItem.get('acfullname'), acItem && acItem.get('asscategorylist')))
			dispatch(lrpzActions.changeJvAc(acModalDisplay, acId, acItem && acItem.get('acname'), acItem && acItem.get('acfullname'), acItem && acItem.get('asscategorylist'), acItem && acItem.get('acunitOpen')))
			if(acItem && acId){
				// dispatch(lrpzActions.getAmountDataFetch(acId, vcDate, acModalDisplay))
				if (!acItem.get('asscategorylist').size) {
					if (acItem.get('acunitOpen') == '1') {
						dispatch(lrpzActions.getAmountDataFetch(acId, vcDate, acModalDisplay))//获取数量
					}
					dispatch(lrpzActions.getAcCloseBalance(acId, vcDate, acModalDisplay)) //获取余额
				}
				if(acItem.get('fcStatus') == '1'){
					dispatch(lrpzActions.getFCListDataFetch(acModalDisplay)) //获取外币
				}
			}
		}

		const saveWayModal = () => this.setState({'saveWay':true})
		// alt+s保存，alt+n保存并新增，通过空格切换贷借方;
		;(function(){
			document.onkeydown = function() {
				var oEvent = window.event;
				if (oEvent.altKey && oEvent.keyCode == Limit.S_KEY_CODE) { //保存
					if (reviewedBy)
						return thirdParty.Alert('凭证已审核，不能保存')
					if (closedBy)
						return thirdParty.Alert('本月已结账，不能保存')
					// if (!PzPermissionInfo.getIn(['edit', 'permission']))
					// if( judgePermission(preDetailList.get('RUD_VC')).disabled )
					// 	return thirdParty.Alert('当前角色无该权限')
					dispatch(lrpzActions.saveJvItemFetch('false', '', saveWayModal, PzPermissionInfo))
				}
				if (oEvent.altKey && oEvent.keyCode == Limit.N_KEY_CODE) {  //保存并新增
					if (reviewedBy)
						return thirdParty.Alert('凭证已审核，不能保存')
					if (closedBy)
						return thirdParty.Alert('本月已结账，不能保存')
					// if (!PzPermissionInfo.getIn(['edit', 'permission']))
					// if( judgePermission(preDetailList.get('RUD_VC')).disabled )
					// 	return thirdParty.Alert('当前角色无该权限')
					dispatch(lrpzActions.saveJvItemFetch('true', '', saveWayModal, PzPermissionInfo))
				}

				if (oEvent.altKey && oEvent.keyCode == Limit.P_KEY_CODE) {   //暂存
					if (reviewedBy)
						return thirdParty.Alert('凭证已审核，不能暂存')
					if (closedBy)
						return thirdParty.Alert('本月已结账，不能暂存')
					// if (!PzPermissionInfo.getIn(['edit', 'permission']))
					if( judgePermission(preDetailList.get('DRAFT_BOX')).disabled )
						return thirdParty.Alert('当前角色无该权限')
					dispatch(lrpzActions.draftSaveFetch(vcKey))
				}
				if (oEvent.altKey && oEvent.keyCode == Limit.D_KEY_CODE) {   //进入草稿箱
					// if (!PzPermissionInfo.getIn(['edit', 'permission']))
					if( judgePermission(preDetailList.get('DRAFT_BOX')).disabled )
						return thirdParty.Alert('当前角色无该权限')
					//    dispatch(homeActions.addTabpane('Draft'))
					
					dispatch(homeActions.addPageTabPane('EditPanes', 'Draft', 'Draft', '草稿箱'))
					dispatch(homeActions.addHomeTabpane('Edit', 'Draft', '草稿箱'))
					dispatch(draftActions.getDraftListFetch('全部'))
				}
				//取消默认行为
				if (oEvent.keyCode == Limit.TAB_KEY_CODE ||
					oEvent.altKey && oEvent.keyCode == Limit.S_KEY_CODE ||
					oEvent.altKey && oEvent.keyCode == Limit.N_KEY_CODE ||
					oEvent.altKey && oEvent.keyCode == Limit.R_KEY_CODE ||
					oEvent.altKey && oEvent.keyCode == Limit.P_KEY_CODE ||
					oEvent.altKey && oEvent.keyCode == Limit.D_KEY_CODE
				) {
					if (oEvent.preventDefault) {
						oEvent.preventDefault()
					} else {
						oEvent.returnValue = false   //ie
					}
				}
			}
		})()

		let firstyear = '', firstmonth = ''
		if (Number(allState.getIn(['period', 'firstmonth'])) == 1) {
			firstmonth = 12
			firstyear = Number(allState.getIn(['period', 'firstyear'])) - 1
		} else {
			firstmonth = Number(allState.getIn(['period', 'firstmonth'])) - 1
			firstyear = Number(allState.getIn(['period', 'firstyear']))
		}
		const disabledBeginDate  = new Date(firstyear, firstmonth, 0).getTime()

		const disabledDate = function (current) {
			return current && (moment(disabledBeginDate).endOf('day') > current)
		}

		let acListKeysArr = []
		acListTree.forEach((v, key) => acListKeysArr.push(key))

		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		const uploadKeyJson = allState.get('uploadKeyJson')

		return (
			<div
				// className="wrap-body wrap-lrpz"
				className="wrap-lrpz"
				onKeyDown={e => {
					if (lrAcModalDisplay) {
						return
					} else {
						if (e.keyCode == Limit.SHIFT_KEY_CODE) {
							dispatch(lrpzActions.changeFocusInput(e.keyCode))
						}
					}
				}}
				onKeyUp={e => {
					if (lrAcModalDisplay) {
						return
					} else {
						if (e.keyCode == Limit.ENTER_KEY_CODE) {
							const currentFocus = `cr-${jvList.size - 1}`
							if (focusRef === currentFocus){
								dispatch(lrpzActions.insertJvItem(jvList.size-1))
							}

							dispatch(lrpzActions.changeFocusInput(e.keyCode))

						}

						if (e.keyCode == Limit.TAB_KEY_CODE || e.keyCode == Limit.SHIFT_KEY_CODE) {

							if (e.keyCode == Limit.TAB_KEY_CODE) {
								const currentFocus = `cr-${jvList.size - 1}`
								if (focusRef === currentFocus && !focusBack){
									dispatch(lrpzActions.insertJvItem(jvList.size-1))
								}
							}
							dispatch(lrpzActions.changeFocusInput(e.keyCode))
						} else {
							return
						}
					}
				}}
			>
				<Title
					QUERY_VC={QUERY_VC}
					preDetailList={preDetailList}
					PzPermissionInfo={PzPermissionInfo}
					jvList={jvList}
					month={month}
					year={year}
					vcKey={vcKey}
					message={messages}
					vcIndex={vcIndex}
					oldVcIndex={oldVcIndex}
                    closedBy={closedBy}
                    dispatch={dispatch}
					draftList={draftList}
					isEnterDraft={isEnterDraft}
					changeDraftIdx={changeDraftIdx}
                    showLrModalMask={showLrModalMask}
					lrIframeload={lrIframeload}
					importResponList={importResponList}
					reviewedBy={reviewedBy}
					voucherIdx={voucherIdx}
					voucherIndexList={voucherIndexList}
                    lrpzHandleMode={lrpzHandleMode}
					shortcutClick={() => false}
					enclosureList={enclosureList}
					titleFixed={titleFixed}
					openedYear={openedYear}
					openedMonth={openedMonth}
					URL_POSTFIX={URL_POSTFIX}
					importProgressInfo = {lrpzState.get('importProgressInfo')}
					isPlay={isPlay}
					autoEncode={autoEncode}
					saveWayModal={saveWayModal}
				/>
				<div className="lrpz-body-wrap">
					<Voucher
						vcIndex={vcIndex}
						year={year}
						month={month}
						jvList={jvList}
						vcDate={vcDate}
						amountDisplay={amountDisplay}
						allAssList={allAssList}
						PzPermissionInfo={PzPermissionInfo}
						focusRef={focusRef}
						closedBy={closedBy}
						reviewedBy={reviewedBy}
						dispatch={dispatch}
						createdBy={createdBy}
						modifiedTime={modifiedTime}
						createdTime={createdTime}
						debitTotal={debitTotal}
						creditTotal={creditTotal}
						selectAcList={selectAcList}
						assDropListFull={assDropListFull}
						currencyList={currencyList}
						currencyDisplay={currencyDisplay}
						showAssDisableInfo={showAssDisableInfo}
						disabledDate={disabledDate}
						enclosureCountUser={enclosureCountUser}
						unitDecimalCount={unitDecimalCount}
					/>
					<Enclosure
						fromPage={'Lrpz'}
						className="lrpz-enclosure-wrap"
						dispatch={dispatch}
						permission={PzPermissionInfo.getIn(['edit', 'permission'])}
						token={token}
						// sobid={sobid}
						enclosureList={enclosureList}
						label={label}
						closed={closedBy}
						reviewed={reviewedBy}
						enCanUse={enCanUse}
						checkMoreFj={checkMoreFj}
						getUploadTokenFetch={() => dispatch(lrpzActions_init.getUploadGetTokenFetch())}
						getLabelFetch={() => dispatch(lrpzActions.getLabelFetch())}
						deleteUploadImgUrl={(index) => dispatch(lrpzActions.deleteUploadImgUrl(index))}
						changeTagName={(index, tagName) => dispatch(lrpzActions.changeTagName(index, tagName))}
						downloadEnclosure={(enclosureUrl, fileName) => {
							dispatch(allActions.allDownloadEnclosure(enclosureUrl, fileName))
						}}
						uploadEnclosureList={(value) => {

							// console.log('sdfsdfsad', ...value);
							if (vcIndex) { // 条件
								dispatch(lrpzActions.checkEnclosureList(year, month, vcIndex, ...value))
							} else {
								message.error('日期或凭证号加载异常，请重试')
							}
						}}
						uploadKeyJson={uploadKeyJson}
					/>
				</div>
				{/* 新增科目 */}
				<AcOption
					tempAcItem={increaseAcItem}
					dispatch={dispatch}
					aclist={selectAcList}
					acTags={acTags}
					disabled={disabled}
					acConfigMode={'insertLrpz'}
					moduleInfo={moduleInfo}
					modalDisplay={lrAcModalDisplay}
					// configPermissionInfo={configPermissionInfo}
					lrpzKmPermission={lrpzKmPermission}
					configState={lrpzState}
					onCancel={() => {
						sessionStorage.removeItem('enterLrModal')
						dispatch(lrpzActions.changelrAcModalClear())
					}}
					onClickSave={(increaseAcItem, lrpzState) => {
						if(increaseAcItem.get('acunitOpen') == '1' && !increaseAcItem.get('acunit')){
							return message.warn('请输入计量单位');
						}
						if(increaseAcItem.get('acunit').length > Limit.AC_UNIT_LENGTH){
							return message.warn(`计算单位位数不能超过${Limit.AC_UNIT_LENGTH}位`)
						}

						const isChinese = /[\u4e00-\u9fa5]/g
						const isChineseSign = /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]/g
						// ： 。 ；  ， ： “ ”（ ） 、 ？ 《 》

						let acnameLimitLength = Limit.ALL_NAME_LENGTH
						if (!isChinese.test(increaseAcItem.get('acname')) && !isChineseSign.test(increaseAcItem.get('acname'))) {
							acnameLimitLength = Limit.ASS_NAME_LENGTH
						}

						if(increaseAcItem.get('acname').length > acnameLimitLength){
							return message.warn(`科目名称包含中文及中文标点字符，长度不能超过${Limit.ALL_NAME_LENGTH}位；否则，长度不能超过${Limit.ASS_NAME_LENGTH}位`)
						}

						dispatch(allActions.enterAcItemFetch('Lrpz', lrpzState.get('increaseAcItem'), 'insert', lrpzState.getIn(['flags', 'accategory'])))
					}}
					onChangeAcId={e => dispatch(lrpzActions.changeLrAcidText(e.target.value, allState.get('aclist')))}
					onChangeAcText={e => dispatch(lrpzActions.changeLrAcNameText(e.target.value))}
					onSelect={value => dispatch(lrpzActions.changeLrCategoryText(value))}
					onChangeSwitch={() => disabled || dispatch(lrpzActions.changeLrAcDirectionText())}
					changeAmountCheckbox={()=>dispatch(lrpzActions.changeLrAcAmountStateText())}
					changeAmountInput={e => dispatch(lrpzActions.changePzAcUnitText(e.target.value))}
				/>
				{/* 新增辅助核算 */}
				<FzModel
					judgeAssEnter={'insertLrpz'}
					FzModelDisplay={lrfzhsModalDisplay}
					// configPermissionInfo={configPermissionInfo}
					// PzPermissionInfo={PzPermissionInfo}
					lrpzFzhsPermission={lrpzFzhsPermission}
					fzhsState={lrpzState}
					dispatch={dispatch}
					assItem={lrpzState.get('ass')}
					judgeAssEnter={'insertLrpz'}
					onOk={() => {
						if(nameCheck(lrpzState.getIn(['ass','assname']))){
							return message.warn(`辅助核算名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
						}
						if(nameCheck(lrpzState.getIn(['ass','asscategory']))){
							return message.warn(`辅助核算类别名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
						}
						dispatch(allActions.enterAssItemFetch('Lrpz', lrpzState.get('ass')))
					}}
					onCancel={() => {
						dispatch(lrpzActions.changeLrFzhsModalClear())
						sessionStorage.removeItem('enterLrModal')
					}}
					onChangeId={(value) => dispatch(lrpzActions.changeLrAssId(value))}

					onChangeName={(value) => dispatch(lrpzActions.changeLrAssName(value))}

				/>
				<Modal
					title="科目选择"
					visible={acModalDisplay !== false}
					onOk={() => changeJvAc()}
					onCancel={() => dispatch(lrpzActions.changeAcModalDisplay())}
					>
					<div onDoubleClick={() => changeJvAc()}>
						<Tabs defaultActiveKey="资产" style={{marginTop: '-16px'}}>
							{acListKeysArr.map((key, i) => {
								return(
									<TabPane tab={key} key={key}>
										<div className="lrpz-tree-wrap">
											<Trees
												Data={acListTree.get(key)}
												selectedKeys={[selectContent]}
												onSelect={(info) => dispatch(lrpzActions.changeTreeSelectContent(info[0]))}
											/>
										</div>
									</TabPane>
								)
							})}
						</Tabs>
					</div>
				</Modal>

				{/* 快捷键说明 */}
				<Modal
					visible={shortCut}
					title='快捷键说明'
					onCancel={() => dispatch(lrpzActions.shortcut())}
					footer={[
						<Button key="cancel" type="ghost" onClick={() => dispatch(lrpzActions.shortcut())}>
							关 闭
						</Button>
					]}
					>
					<ul className="uses-tip">
						<li className="uses-tip-dark">1、Enter ：光标跳至下一栏；</li>
						<li className="uses-tip-dark">2、Shift＋Tab ：光标返回上一栏；</li>
						<li className="uses-tip-dark">3、= ：实现分录借贷自动平衡；</li>
						<li className="uses-tip-dark">4、Alt+S ：保存凭证；</li>
						<li className="uses-tip-dark">5、Alt+N ：保存并新增凭证；</li>
						<li className="uses-tip-dark">6、Alt+P ：暂存；</li>
						<li className="uses-tip-dark">7、Alt+D ：草稿箱；</li>
						<li className="uses-tip-dark">8、空格 ：切换借贷方金额；</li>
					</ul>
				</Modal>

				{/* 提示信息 */}
				<AlertModal
					visible={showAssDisableModal}
					message={showAssDisableInfo}
					onOk={() => dispatch(lrpzActions.showAssDisableModal())}
				/>

				{/*保存方式*/}
				<Modal ref="modal"
					visible={saveWay}
					title="选择保存方式"
					onCancel={() => this.setState({'saveWay': false, 'autoEncode': true})}
					footer={[
						<Button
							key="submit"
							type="primary"
							size="large"
						// disabled={deleteHasFj ? !isSeleck : false}
							onClick={() => {
								this.setState({
									'saveWay': false,
									'autoEncode': true
								})
								const saveWayModal = () => this.setState({'saveWay':false})
								const reDirect = sessionStorage.getItem('reDirect')
								dispatch(lrpzActions.saveJvItemFetch(reDirect,autoEncode,saveWayModal,PzPermissionInfo))
							}}>
							确定
						</Button>
					]}
				>
					<p>凭证号：{vcIndex}已存在，您可以</p>
					<div className="save-way-choose">
						<Radio checked={autoEncode} onChange={() => this.setState({'autoEncode':true})}>系统自动编号</Radio>
						<Tooltip placement="top" title='自动新增为末尾最新凭证编号，存在断号则补齐断号'>
							<span className="question-box">
								<Icon type="question-circle" />
							</span>
						</Tooltip>
					</div>
					<div className="save-way-choose">
						<Radio checked={!autoEncode} onChange={() => this.setState({'autoEncode':false})}>插入凭证号</Radio>
						<Tooltip placement="top" title='当前凭证号不变，原凭证编号将顺次后移'>
							<span className="question-box">
								<Icon type="question-circle" />
							</span>
						</Tooltip>
					</div>
				</Modal>
			</div>
		)
	}
}
