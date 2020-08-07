import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon, Select, TreeSelect, Button, Input, Modal, Checkbox } from 'antd'
import { Amount, TableItem } from 'app/components'
import { accountTreeData } from 'app/utils'

import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import { fromJS, toJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import PageSwitch from 'app/containers/components/PageSwitch'

@immutableRenderDecorator
export default
class Title extends React.Component {
	state = {
		deleteAllModal: false,
	}
	render() {
		const {
			issuedate,
			inputValue,
			changeInputValue,
			main,
			searchType,
			mainWater,
			accountList,
			accountName,
			currentAccount,
			currentAss,
			dispatch,
			newCard,
			newRunning,
			issues,
			curCategory,
			curAccountUuid,
			assId,
			assCategory,
			acId,
			selectList,
			pzSelectAllList,
			mediumAcAssList,
			payOrReceiveOnClick,
			setReceivedList,
			setPayList,
			isSpread,
			pageList,
			editLrAccountPermission,
			reviewLrAccountPermission,
			editPzPermission,
			simplifyStatus,
			flags
		} = this.props

		const { deleteAllModal } = this.state

		// 生成或修改凭证权限
		const canCreateVc = simplifyStatus ? editPzPermission : reviewLrAccountPermission
		//
		// const happenSouce = [
		// 	{
		// 		value: true,
		// 		key: '已发生'
		// 	},
		// 	{
		// 		value: false,
		// 		key: '未发生'
		// 	}
		// ]
		//
		// const mainWaterouce = [
		// 	{
		// 		value: 'allWater',
		// 		key: '全部'
		// 	},
		// 	{
		// 		value: 'Duty',
		// 		key: '发生额'
		// 	},
		// 	{
		// 		value: 'Realize',
		// 		key: '收付额'
		// 	}
		// ]

		const searchTypeStr = [
			{
				value: 'SEARCH_TYPE_CATEGORY_TYPE',
				key: '流水类别'
			},
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
			}
		]

		// const mainWaterStr = ({
		// 	'allWater': () => '全部',
		// 	'Duty': () => '发生额',
		// 	'Realize': () => '收付额'
		// }[mainWater])()

		const searchStr = ({
			'SEARCH_TYPE_CATEGORY_TYPE': () => '流水类别',
			'SEARCH_TYPE_ABSTRACT': () => '摘要',
			'SEARCH_TYPE_RUNNING_TYPE': () => '类型',
			'SEARCH_TYPE_AMOUNT': () => '金额',
			'SEARCH_TYPE_CREATE_NAME': () => '制单人'
		}[searchType])()

		let mediumAcAssListSouce = [{
			value: '全部',
			key: ''
		}]
		let acOrAssName = ''

		if (main === 'waitFor') {

			mediumAcAssList.get('acList').size ? mediumAcAssList.get('acList').forEach(v => {

				if (acId === v.get('acId')) {
					acOrAssName = v.get('acId') + ' ' + v.get('acName')
				}

				mediumAcAssListSouce.push({
					value: v.get('acId') + ' ' + v.get('acName'),
					key: v.get('acId')
				})
			}) : ''


			mediumAcAssList.get('category').size ? mediumAcAssList.get('category').forEach(v => {
				v.get('assList').forEach(w => {
					mediumAcAssListSouce.push({
						value: w.get('assCategory') + ' ' + w.get('assId') + ' ' + w.get('assName'),
						key: `${Limit.TREE_JOIN_STR}${w.get('assCategory')}${Limit.TREE_JOIN_STR}${w.get('assId')}`
					})
				})
			}) : ''
		}

		const routeStr = main === 'reality' ? 'Payment' : 'Business'
		const isAccount = flags.get('isAccount')
		const isAsc = flags.get('isAsc')
		const isClose = flags.get('isClose')
		return (
            <div className="title">
				{isSpread || pageList.getIn(['Search','pageList']).size <= 1 ? '' :
					<PageSwitch
						pageItem={pageList.get('Search')}
						onClick={(page, name, key) => {
							dispatch(homeActions.addPageTabPane('SearchPanes', key, key, name))
							dispatch(homeActions.addHomeTabpane(page, key, name))
						}}
					/>
				}
                <Select
					className="title-date title-date-margin-right"
					value={issuedate}
					onChange={(value) => {
						// issuedate, main或count
						dispatch(cxlsActions.getBusinessList(value,'allWater',curAccountUuid))
						dispatch(cxlsActions.changeCxAccountCommonOutString(['flags', 'searchType'], 'SEARCH_TYPE_CATEGORY_TYPE'))
						changeInputValue('')
                    }}
                    >
                    {issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                </Select>
				<span className="cxls-serch">
					<Select
						style={{width: 88}}
						className="cxls-type-choose"
						// combobox
						defaultValue="流水类别"
						value={searchStr}
						onChange={value =>{
							dispatch(cxlsActions.changeCxAccountCommonString('',['flags','searchType'],value))
						}}
						onSelect={value => dispatch(cxlsActions.changeCxAccountCommonString('',['flags','searchType'],value))}
					>
						{searchTypeStr.map((v, i) => <Option key={v.key} value={v.value}>{v.key}</Option>)}
					</Select>
					<Icon className="cxls-serch-icon" type="search"
						onClick={() => {
						dispatch(cxlsActions.getBusinessList(issuedate,mainWater,curAccountUuid,'','',inputValue,isAsc,isAccount))
					}}
				/>
					<Input placeholder="搜索流水"
						className="cxls-serch-input"
						value={inputValue}
						onChange={e => changeInputValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.keyCode == Limit.ENTER_KEY_CODE){
								changeInputValue(inputValue)
								dispatch(cxlsActions.getBusinessList(issuedate,mainWater,curAccountUuid,'','',inputValue,isAsc,isAccount))
							}
						}}
					/>
				</span>
				<span style={{lineHeight:'28px'}}>
					<Checkbox
						checked={isAccount}
						onChange={(e) => {
							dispatch(cxlsActions.getBusinessList(issuedate,mainWater,curAccountUuid,'','',inputValue,e.target.checked?true:false,e.target.checked))
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
							onChange={value => value || dispatch(cxlsActions.getBusinessList(issuedate,mainWater,value,'','',inputValue,isAsc,isAccount))}
							onSelect={value => dispatch(cxlsActions.getBusinessList(issuedate,mainWater,value,'','',inputValue,isAsc,isAccount))}
							>
								<Option key='' value=''>全部</Option>
							{accountList.getIn([0, 'childList']).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
						</Select>:''
					}

				</span>
				<div
					className="pcxls-account"
					style={{display: isClose ? 'block' : 'none'}}
					>
					已结账
				</div>
				<Button
					type="ghost"
					className="title-right"
					onClick={() => {
						changeInputValue('')
						dispatch(cxlsActions.afterModifyAccountAllList(true))
						dispatch(allActions.freshSearchPage('查询流水'))
					}}
					>
					刷新
				</Button>
				<Button
					type="ghost"
					disabled={!selectList.size || !editLrAccountPermission}
					className="title-right"
					onClick={() => {
						dispatch(cxlsActions.deleteAccountItemCardAndRunning(true,inputValue))
					}}
					>
					删除
				</Button>
				<Button
					className="title-right four-word-btn"
					type="ghost"
					onClick={() => {
						// dispatch(homeActions.addTabpane('Calculation'));
						dispatch(homeActions.addPageTabPane('SearchPanes', 'Calculation', 'Calculation', '核算与管理'))
						dispatch(homeActions.addHomeTabpane('Search', 'Calculation', '核算与管理'))
					}}
					>
					核算与管理
				</Button>
				{/* 小白版变审核 */}
				<Button
					type="ghost"
					disabled={!selectList.size || !canCreateVc || !pzSelectAllList.size}
					className="title-right"
					onClick={() => {
						dispatch(cxlsActions.runningInsertVc(pzSelectAllList, routeStr, issuedate,inputValue))
						// dispatch(accountActions.beforeSetSetings())
						// this.setState({visible: true})
					}}
					>
						{
							simplifyStatus ? '生成凭证' : '审核'
						}
				</Button>
				<Button
					className="title-right four-word-btn"
					type="ghost"
					disabled={!editLrAccountPermission}
					onClick={() => {
						dispatch(lrAccountActions.getRunningSettingInfo())
						dispatch(homeActions.addPageTabPane('EditPanes', 'LrAccount', 'LrAccount', '录入流水'))
						dispatch(homeActions.addHomeTabpane('Edit', 'LrAccount', '录入流水'))
					}}
					>
					新增
				</Button>
				<Button
					type="ghost"
					disabled={!selectList.size || !canCreateVc || !flags.get('currentVcIndex').size}
					className="title-right"
					onClick={() => {
						if (canCreateVc && simplifyStatus) {
							this.setState({'deleteAllModal':true})
						}
						if(canCreateVc && !simplifyStatus){
							dispatch(cxlsActions.deleteVcItemFetch(flags.get('currentYear'), flags.get('currentMonth'), flags.get('currentVcIndex').toJS(), issuedate,inputValue))
						}
					}}
					>
						{
							simplifyStatus ? '删除凭证' : '反审核'
						}
				</Button>
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
								dispatch(cxlsActions.deleteVcItemFetch(flags.get('currentYear'), flags.get('currentMonth'), flags.get('currentVcIndex').toJS(), issuedate,inputValue))
							}}>
							确定
						</Button>
					]}>
						<p>确定删除凭证吗？</p>
				</Modal>
			</div>
		)
	}
}
