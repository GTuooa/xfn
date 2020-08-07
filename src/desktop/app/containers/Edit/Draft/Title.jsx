import React from 'react'
import { Button, Icon, Select, Input, message } from 'antd'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as draftActions from 'app/redux/Edit/Draft/draft.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'

import { fromJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'
import { debounce, judgePermission } from 'app/utils'

@immutableRenderDecorator
export default
class Title extends React.Component {

	render() {
		const {
			dispatch,
			inputValue,
			selectList,
			searchValue,
			selectDraftList,
			selectDraftType,
			changeInputValue,
			DRAFT_BOX
		} = this.props
		const selectDraft = fromJS([
			'全部',
			'未锁定',
			'已锁定'
		])
		const detailList = DRAFT_BOX.get('detailList')
		return (
			<div className="title">
				<Select
					className="title-date"
					value={selectDraftType}
					onChange={value => {
						dispatch(draftActions.getDraftListFetch(value))
					}}
				>
					{selectDraft.map((value, i) => <Option key={i} value={value}>{value}</Option>)}
				</Select>
				<span className="draft-search">
					<Icon
						className="draft-search-icon"
						type="search"
						onClick={() => {
							dispatch(draftActions.searchDraft(searchValue))
						}}
					/>
					<Input
						className="draft-search-input"
						value={searchValue}
						placeholder="搜索草稿..."
						onChange={(e) => dispatch(draftActions.changeInputValue(e.target.value))}
						onKeyDown={(e) => {
							if (e.keyCode == Limit.ENTER_KEY_CODE) {
								dispatch(draftActions.searchDraft(searchValue))
							}
						}}
					/>
				</span>
				<Button
					className="title-right"
					type="ghost"
					onClick={() => {
						dispatch(homeActions.addPageTabPane('EditPanes', 'Lrpz', 'Lrpz', '录入凭证'))
						dispatch(homeActions.addHomeTabpane('Edit', 'Lrpz', '录入凭证'))
					}}
				>
					返回
				</Button>
				<Button
					className="title-right"
					type="ghost"
					onClick={() => debounce(() => {
						dispatch(draftActions.getDraftListFetch(selectDraftType))
					})()}
				>
					刷新
				</Button>
				<Button
					className="title-right"
					type="ghost"
					// disabled={ !selectList.some(v => v.get('checkboxDisplay')) || !selectList.some(v => v.get('locked') == '0')}
					disabled={judgePermission(detailList.get('LOCKING_DRAFT_BOX')).disabled || !selectList.some(v => v.get('checkboxDisplay')) || !selectList.some(v => v.get('locked') == '0')}
					onClick={() => {
						if( !judgePermission(detailList.get('LOCKING_DRAFT_BOX')).disabled ){
							dispatch(draftActions.lockDraft(selectDraftList, selectDraftType))
						}else{
							console.log(!judgePermission(detailList.get('LOCKING_DRAFT_BOX')).disabled)
							message.info('当前角色无该请求权限')
						}
					}}
					>
					锁定
				</Button>
				<Button
					className="title-right"
					type="ghost"
					// disabled={!selectList.some(v => v.get('checkboxDisplay')) || !selectList.some(v => v.get('locked') == '1')}
					disabled={ judgePermission(detailList.get('UNLOCKING_DRAFT_BOX')).disabled || !selectList.some(v => v.get('checkboxDisplay')) || !selectList.some(v => v.get('locked') == '1')}
					onClick={() => {
						// console.log(!judgePermission(detailList.get('UNLOCKING_DRAFT_BOX')).disabled)
						if(!judgePermission(detailList.get('UNLOCKING_DRAFT_BOX')).disabled){
							dispatch(draftActions.unLockDraft(selectDraftList, selectDraftType))
						}else{
							console.log(2222)
							message.info('当前角色无该请求权限')
						}
					}}
					>
					解锁
				</Button>
				<Button
					className="title-right"
					type="ghost"
					disabled={!selectList.some(v => v.get('checkboxDisplay')) || !selectList.some(v => v.get('locked') == '0')}
					onClick={() => {
						thirdParty.Confirm({
							message: `是否确认删除`,
							title: "提示",
							buttonLabels: ['取消', '确定'],
							onSuccess : (result) => {
								if (result.buttonIndex === 1) {
									dispatch(draftActions.deleteDraft(selectDraftList, selectDraftType))
								}
							}
						})
					}}
					>
					删除
				</Button>
			</div>
		)
	}
}
