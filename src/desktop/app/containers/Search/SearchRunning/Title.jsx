import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Select, TreeSelect, Button, Input, Modal, Checkbox, Dropdown, Menu, Tooltip } from 'antd'
import { Amount, TableItem, Icon } from 'app/components'
import { accountTreeData } from 'app/utils'
const Option = Select.Option
import { fromJS, toJS } from 'immutable'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import PageSwitch from 'app/containers/components/PageSwitch'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import MutiPeriodMoreSelect from 'app/containers/components/MutiPeriodMoreSelect'

import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as middleActions from 'app/redux/Home/middle.action.js'
import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action'
import * as runningEnclosureActions from 'app/redux/Search/RunningEnclosure/runningEnclosure.action'
import * as printActions from 'app/redux/Edit/FilePrint/filePrint.actions.js'

@immutableRenderDecorator
export default
class Title extends React.Component {
	state = {
		deleteAllModal: false,
	}
	render() {
		const {
			issuedate,
			endissuedate,
			inputValue,
			// changeInputValue,
			searchType,
			accountList,
			accountName,
			currentAccount,
			dispatch,
			newCard,
			newRunning,
			issues,
			curCategory,
			curAccountUuid,
			selectList,
			pzSelectAllList,
			payOrReceiveOnClick,
			setReceivedList,
			setPayList,
			isSpread,
			pageList,
			editLrAccountPermission,
			reviewLrAccountPermission,
			flags,
			allPanes,
			orderType,
			selectItem,
			pageSize,
		} = this.props

		const { deleteAllModal } = this.state

		const searchTypeStr = [
			{
				value: 'SEARCH_TYPE_ABSTRACT',
				key: '摘要'
			},
			{
				value: 'SEARCH_TYPE_RUNNING_TYPE',
				key: '类型'
			},
			{
				value: 'SEARCH_TYPE_AMOUNT',
				key: '金额'
			},
			{
				value: 'SEARCH_TYPE_CREATE_NAME',
				key: '制单人'
			},
			{
				value: 'SEARCH_TYPE_CATEGORY_TYPE',
				key: '流水类别'
			}
		]

		const searchStr = ({
			'SEARCH_TYPE_ABSTRACT': () => '摘要',
			'SEARCH_TYPE_RUNNING_TYPE': () => '类型',
			'SEARCH_TYPE_AMOUNT': () => '金额',
			'SEARCH_TYPE_CREATE_NAME': () => '制单人',
			'SEARCH_TYPE_CATEGORY_TYPE': () => '流水类别'
		}[searchType])()

		const isAccount = flags.get('isAccount')
		const isAsc = flags.get('isAsc')
		let allIsClose = false, //所有选择流水是否已结账 true已结账
			isClose = true //单条流水是否已结账 true已结账
		selectItem && selectItem.size && selectItem.map(item => {
			if(!item.get('isClose')){
				isClose = false
			}
		})
		if(isClose){
			allIsClose = true
		}
		const chooseValue = flags.get('chooseValue')

		const more = (
			<Menu>
				<Menu.Item>
					<span
						className="setting-common-ant-dropdown-menu-item"
						onClick={() => {
							dispatch(searchRunningActions.getgetSearchRunningSortFun(issuedate,'1',inputValue,orderType))
						}}
					>
						按流水号顺次前移补齐断号
					</span>
				</Menu.Item>
				<Menu.Item>
					<span
						className="setting-common-ant-dropdown-menu-item"
						onClick={() => {
							dispatch(searchRunningActions.getgetSearchRunningSortFun(issuedate,'2',inputValue,orderType))
						}}
					>
						按流水日期重新顺次编号
					</span>
				</Menu.Item>
			</Menu>
		)

		return (
            <FlexTitle>
				<div className='flex-title-left'>
					{isSpread || pageList.getIn(['Search','pageList']).size <= 1 ? '' :
						<PageSwitch
							pageItem={pageList.get('Search')}
							onClick={(page, name, key) => {
								dispatch(homeActions.addPageTabPane('SearchPanes', key, key, name))
								dispatch(homeActions.addHomeTabpane(page, key, name))
							}}
						/>
					}
					<MutiPeriodMoreSelect
						issuedate={issuedate}
						endissuedate={endissuedate}
						issues={issues}
						chooseValue={chooseValue}
						changeChooseperiodsStatu={(value) => dispatch(searchRunningActions.changeSearchRunningChooseValue(value))}
						changePeriodCallback={(value1, value2) => {
							// dispatch(searchRunningActions.getBusinessList(value1, value2,curAccountUuid,1,orderType))
							dispatch(searchRunningActions.getBusinessList(value1, value2, { accountUuid:curAccountUuid,curPage: 1, pageSize:pageSize, orderBy:orderType }))
							dispatch(searchRunningActions.changeCxAccountCommonOutString(['flags', 'inputValue'], ''))
						}}
					/>

					<span className="cxls-serch">
						<Select
							style={{width: 88}}
							className="cxls-type-choose"
							// combobox
							defaultValue="流水类别"
							value={searchStr}
							onChange={value =>{
								dispatch(searchRunningActions.changeCxAccountCommonString('',['flags','searchType'],value))
							}}
							onSelect={value => dispatch(searchRunningActions.changeCxAccountCommonString('',['flags','searchType'],value))}
						>
							{searchTypeStr.map((v, i) => <Option key={v.key} value={v.value}>{v.key}</Option>)}
						</Select>
						{
							inputValue ?
							<Icon className="normal-search-delete" type="close-circle" theme='filled'
								onClick={() => {
									dispatch(searchRunningActions.changeCxAccountCommonOutString(['flags', 'inputValue'], ''))
									// dispatch(searchRunningActions.getBusinessList(issuedate,endissuedate,curAccountUuid,'',orderType,'',isAsc,isAccount))
									dispatch(searchRunningActions.getBusinessList(issuedate, endissuedate, { accountUuid: curAccountUuid, curPage: '', pageSize: pageSize, orderBy: orderType, searchContent: '', isAsc: isAsc, isAccount: isAccount }))
								}}
							/> : null
						}
						<Icon className="cxpz-serch-icon" type="search"
							onClick={() => {
								// dispatch(searchRunningActions.getBusinessList(issuedate,endissuedate,curAccountUuid,'',orderType,inputValue,isAsc,isAccount))
								dispatch(searchRunningActions.getBusinessList(issuedate, endissuedate, { accountUuid: curAccountUuid, curPage: '', pageSize: pageSize, orderBy: orderType, searchContent: inputValue, isAsc: isAsc, isAccount: isAccount }))
							}}
						/>

						<Input placeholder="搜索流水"
							className="cxls-serch-input"
							value={inputValue}
							onChange={e => dispatch(searchRunningActions.changeCxAccountCommonOutString(['flags', 'inputValue'], e.target.value))}
							onKeyDown={(e) => {
								if (e.keyCode == Limit.ENTER_KEY_CODE){
									dispatch(searchRunningActions.changeCxAccountCommonOutString(['flags', 'inputValue'], inputValue))
									// changeInputValue(inputValue)
									// dispatch(searchRunningActions.getBusinessList(issuedate,endissuedate,curAccountUuid,1,orderType,inputValue,isAsc,isAccount))
									dispatch(searchRunningActions.getBusinessList(issuedate, endissuedate, { accountUuid: curAccountUuid, curPage: 1, pageSize: pageSize, orderBy: orderType, searchContent: inputValue, isAsc: isAsc, isAccount: isAccount }))
								}
							}}
						/>
					</span>
				</div>
				{/*<span style={{lineHeight:'28px'}}>
					<Checkbox
						checked={isAccount}
						onChange={(e) => {
							dispatch(searchRunningActions.getBusinessList(issuedate,curAccountUuid,'','',inputValue,e.target.checked?true:false,e.target.checked))
						}}
					/>
					{`查看账户${isAccount?'：':''}`}
					{
						isAccount?
						<Select
							style={{
											width: 120
										}}
							value={accountName}
							onChange={value => value || dispatch(searchRunningActions.getBusinessList(issuedate,value,'','',inputValue,isAsc,isAccount))}
							onSelect={value => dispatch(searchRunningActions.getBusinessList(issuedate,value,'','',inputValue,isAsc,isAccount))}
							>
								<Option key='' value=''>全部</Option>
							{accountList.getIn([0, 'childList']).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
						</Select>:''
					}

				</span>*/}
				<div
					className="pcxls-account"
					style={{display: flags.get('isClose') ? 'block' : 'none'}}
					>
					已结账
				</div>
				<div className='flex-title-right'>
					<Button
						type="ghost"
						className="title-right"
						onClick={()=>{
							sessionStorage.setItem('previousPage', 'SearchRunning')
							dispatch(homeActions.addPageTabPane('SearchPanes', "RunningEnclosure", "RunningEnclosure", "附件管理"))
							dispatch(homeActions.addHomeTabpane("Search", "RunningEnclosure", "附件管理"))
							dispatch(runningEnclosureActions.getRunningEnclosureData(issuedate,endissuedate))
							dispatch(runningEnclosureActions.handleRunningEnclosureChooseStatus(chooseValue))
						}}
					>
						附件管理
					</Button>

					{
						<Button
							type="ghost"
							disabled={allIsClose || (!selectList.size || !reviewLrAccountPermission || !flags.get('currentVcIndex').size)}
							className="title-right"
							onClick={() => {
								if(reviewLrAccountPermission){
									dispatch(searchRunningActions.deleteVcItemFetch('searchRunningBatch', '', '', flags.get('currentVcIndex').toJS(), issuedate,inputValue))
								}
							}}
							>
							反审核

						</Button>
					}
					{/* 小白版变审核 */}
					{
						<Button
							type="ghost"
							disabled={!selectList.size || !reviewLrAccountPermission || !pzSelectAllList.size}
							className="title-right"
							onClick={() => {
								dispatch(searchRunningActions.runningInsertOrModifyVc('searchRunningBatch', pzSelectAllList, 'insert', issuedate, inputValue))
							}}
							>
							审核
						</Button>
					}
					<Button
						type="ghost"
						disabled={!selectList.size || !reviewLrAccountPermission}
						className="title-right"
						onClick={() => {
							dispatch(allActions.handlePrintModalVisible(true))
							sessionStorage.setItem('fromPos', 'searchRunning')
							dispatch(printActions.setPrintString('fromPage','cxls'))
							dispatch(printActions.setPrintString('oriUuid',selectList))
						}}
						>
						打印
					</Button>
					<Button
						className="title-right four-word-btn"
						type="ghost"
						disabled={!editLrAccountPermission}
						onClick={() => {
							if (allPanes.get('EditPanes').find(v => v.get('title') === '录入流水')) {
								thirdParty.Confirm({
									message: '是否不保存已有的录入流水的内容，进行新增？',
									title: "提示",
									buttonLabels: ['取消', '确定'],
									onSuccess : (result) => {
										if (result.buttonIndex === 1) {
											dispatch(middleActions.insertRunningFromHomePageAndSearchPage())
											dispatch(homeActions.addPageTabPane('EditPanes', 'EditRunning', 'EditRunning', '录入流水'))
											dispatch(homeActions.addHomeTabpane('Edit', 'EditRunning', '录入流水'))
										}
									}
								})
							} else {
								dispatch(middleActions.insertRunningFromHomePageAndSearchPage())
								dispatch(homeActions.addPageTabPane('EditPanes', 'EditRunning', 'EditRunning', '录入流水'))
								dispatch(homeActions.addHomeTabpane('Edit', 'EditRunning', '录入流水'))
							}
						}}
						>
						新增
					</Button>
					{
						<Button
							type="ghost"
							disabled={allIsClose || (!selectList.size || !editLrAccountPermission || !pzSelectAllList.size)}
							className="title-right"
							onClick={() => {
								dispatch(searchRunningActions.deleteAccountItemCardAndRunning(true,inputValue, null, 'QUERY_JR-DELETE_JR-FULL_DELETE'))
							}}
							>
							删除
						</Button>
					}

					{
						chooseValue!=='MONTH' && !flags.get('isClose') ?
						<Tooltip title='按账期查询时，支持批量处理'>
							<span className="title-right title-dropdown">
							<Dropdown overlay={more} disabled={chooseValue!=='MONTH' || flags.get('isClose')} className={flags.get('isClose') ? "title-disabled" : ""}>
								<span>整理 <Icon className="title-dropdown-icon" type="down"/></span>
							</Dropdown></span>
						</Tooltip> :
						<span className="title-right title-dropdown">
						<Dropdown overlay={more} disabled={chooseValue!=='MONTH' || flags.get('isClose')} className={flags.get('isClose') ? "title-disabled" : ""}>
							<span>整理 <Icon className="title-dropdown-icon" type="down"/></span>
						</Dropdown></span>
					}

					<Button
						type="ghost"
						className="title-right"
						onClick={() => {
							dispatch(searchRunningActions.afterModifyAccountAllList(true,inputValue,pageSize))
							dispatch(allActions.freshSearchPage('查询流水'))
						}}
						>
						刷新
					</Button>
				</div>
				<Modal ref="modal"
					visible={deleteAllModal}
					title="提示"
					onCancel={()=>this.setState({'deleteAllModal':false})}
					footer={[
						<Button key="back" type="ghost" size="large" onClick={()=>this.setState({'deleteAllModal':false})}>
							取消
						</Button>,
						<Button key="submit" type="primary" size="large"
							onClick={()=>{
								this.setState({'deleteAllModal':false});
								dispatch(searchRunningActions.deleteVcItemFetch('searchRunningBatch', flags.get('currentYear'), flags.get('currentMonth'), flags.get('currentVcIndex').toJS(), issuedate,inputValue))
							}}>
							确定
						</Button>
					]}>
						<p>确定删除凭证吗？</p>
				</Modal>
			</FlexTitle>
		)
	}
}
