import React from 'react'
import { connect } from 'react-redux'

import Title from './Title.jsx'
import FzItem from './FzItem.jsx'
import FzModel from './FzModel.jsx'
import ReversAss from './ReversAss.jsx'
import RelateAcModal from './RelateAcModal.jsx'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import { fromJS, toJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'
import { Button, Checkbox, Modal, message, Tooltip } from 'antd'
import { Icon } from 'app/components'
import { treeAssSelect, nameCheck, judgePermission } from 'app/utils'
import { TableWrap, TableBody, TableItem, TableTitle, TableOver, TableAll, TableTree, TablePagination } from 'app/components'
import './style/index.less'

import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as fzhsActions from 'app/redux/Config/Ass/assConfig.action.js'
import * as configActions from 'app/redux/Config/Ac/acConfig.action.js'

@connect(state => state)
export default
	class AssConfig extends React.Component {

	constructor() {
		super()
		this.state = { index: -1 }
	}

	componentDidMount() {

		// this.props.dispatch(allActions.getAcListFetch())
		this.props.dispatch(allActions.getAssListFetch(true))

		if (this.props.allState.get('allasscategorylist').size) {
			const activeAssList = this.props.allState.getIn(['allasscategorylist', 0])
			this.props.dispatch(fzhsActions.changeActiveAssCategory(activeAssList.get('asscategory'), activeAssList))
		}
	}

	componentWillReceiveProps(nextprops) {
		if (nextprops.allState.get('allasscategorylist') !== this.props.allState.get('allasscategorylist')) {
			const nextActiveAssCategory = nextprops.fzhsState.get('activeAssCategory')
			const activeAssCategory = nextprops.allState.get('assTags').some(v => v === nextActiveAssCategory) ? nextActiveAssCategory : '客户'
			const activeAssList = nextprops.allState.get('allasscategorylist').find(v => v.get('asscategory') == activeAssCategory)
			this.props.dispatch(fzhsActions.changeActiveAssCategory(activeAssCategory, activeAssList))
		}
	}

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.fzhsState != nextprops.fzhsState || this.props.homeState != nextprops.homeState
	}

	render() {
		const { dispatch, allState, fzhsState, homeState } = this.props
		const { index } = this.state
		//获取权限
		const CUD_ASS = homeState.getIn(['data', 'userInfo', 'pageController', 'MANAGER', 'preDetailList', 'ASS_SETTING', 'detailList', 'CUD_ASS'])
		const detailList = homeState.getIn(['data', 'userInfo', 'pageController', 'MANAGER', 'preDetailList', 'ASS_SETTING', 'detailList'])

		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const expireInfo = homeState.getIn(['data', 'userInfo', 'moduleInfo'])
		const assTags = allState.get('assTags')
		const asslist = allState.get('allasscategorylist')
		const selectAssAll = fzhsState.get('selectAssAll')
		const relatedAclist = fzhsState.get('relatedAclist')
		const FzModelDisplay = fzhsState.get('FzModelDisplay')
		const asscategory = fzhsState.getIn(['ass', 'asscategory'])
		const activeAssCategory = fzhsState.get('activeAssCategory')
		const activeAssList = allState.getIn(['allasscategorylist', 0])
		const asslistSelectedStatus = fzhsState.get('asslistSelectedStatus')

		const ass = allState.get('allasscategorylist').find(v => v.get('asscategory') === activeAssCategory)
		const aclist = allState.get('aclist')
		const assExist = allState.get('allasscategorylist').size ? true : false

		let disSelectAcidlist = aclist.filter(v => v.get('asscategorylist').every(v => v !== activeAssCategory) && v.get('asscategorylist').size >= 2).map(v => v.get('acid'))

		const categoryAclist = {
			'资产': [],
			'负债': [],
			'权益': [],
			'成本': [],
			'损益': []
		}
		aclist.toJS().forEach(v => {
			//const category =
			const key = {
				'流动资产': '资产',
				'非流动资产': '资产',
				'流动负债': '负债',
				'非流动负债': '负债',
				'所有者权益': '权益',
				'成本': '成本'
			}[v.category] || '损益'
			categoryAclist[key].push(v)
		})
		const categoryAc = {
			'资产': [],
			'负债': [],
			'权益': [],
			'成本': [],
			'损益': []
		}
		const cate = fromJS(categoryAclist)
		cate.map((v, i) => {
			const everaclist = v.toJS()
			const ac = treeAssSelect(everaclist, activeAssCategory)
			categoryAc[i] = ac
		})

		// const titleList = ['操作', '编码', '名称', '禁用']
		const titleList = ['编码', '名称', '禁用']

		const ambSourceList = asslist.filter(v => v.get('aclist').some(v => v.get('acid').indexOf('5') === 0)).map(v => v.get('asscategory'))

		const ambAssCategroyList = fzhsState.get('ambAssCategroyList')
		//反悔
		const reversAss = fzhsState.get('reversAss')
		const assMessage = fzhsState.get('assMessage')
		const showReversModal = fzhsState.get('showReversModal')
		const reversAssConfirmShow = fzhsState.get('reversAssConfirmShow')
		const oldName = fzhsState.get('oldName')
		const newName = fzhsState.get('newName')
		const assCategoryModalVisible = fzhsState.get('assCategoryModalVisible')
		//分页
		const currentPage = fzhsState.get('currentPage')
		const pageCount = fzhsState.get('pageCount')
		const currentPageList = ass ? ass.get('asslist').slice((currentPage - 1) * Limit.FZHE_CURRENT_PAGE_SIZE, currentPage * Limit.FZHE_CURRENT_PAGE_SIZE) : []

		const pageList = homeState.get('pageList')
		const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])

		return (
			<ContainerWrap type="config-two" className="fzhs-config">
				<Title
					detailList={detailList}
					isSpread={isSpread}
					pageList={pageList}
					expireInfo={expireInfo}
					ass={ass}
					tags={assTags}
					asslist={asslist}
					dispatch={dispatch}
					allState={allState}
					assExist={assExist}
					fzhsState={fzhsState}
					ambSourceList={ambSourceList}
					activeAssList={activeAssList}
					ambAssCategroyList={ambAssCategroyList}
					activeAssCategory={activeAssCategory}
					// configPermissionInfo={configPermissionInfo}
					asslistSelectedStatus={asslistSelectedStatus}
					URL_POSTFIX={URL_POSTFIX}
					isPlay={isPlay}
				/>

				<TableWrap notPosition={true}>
					<TableAll type="assconfig">
						<TableTitle
							className="assconfig-tabel-width"
							hasCheckbox={true}
							titleList={titleList}
							onClick={() => dispatch(fzhsActions.selectAssAll())}
							selectAcAll={selectAssAll}
						/>
						<TableBody>
							{currentPageList.map((u, j) =>
								<FzItem
									assItem={u}
									className={["assconfig-tabel-width", u.get('disableTime') ? 'fzhs-item-disable' : ''].join(' ')}
									dispatch={dispatch}
									idx={u.get('assid')}
									checked={asslistSelectedStatus.get(u.get('assid'))}
									itemId={j + (currentPage - 1) * Limit.FZHE_CURRENT_PAGE_SIZE}
									key={j}
									markModifyIndex={value => this.setState({ index: value })}
								/>
							)}
						</TableBody>
						<TablePagination
							currentPage={currentPage}
							pageCount={pageCount}
							paginationCallBack={(value) => dispatch(fzhsActions.changeCurrentPage(ass, value))}
						/>
					</TableAll>
					<TableTree className="assconfig-left">
						<Tooltip placement="bottom" title={judgePermission(detailList.get('RELATE_AC')).disabled ? '当前角色无该权限' : (ass ? '' : '关联科目至少要有一个辅助核算编码')}>
							<div className="assconfig-left-title" onClick={() => {
								if (judgePermission(detailList.get('RELATE_AC')).disabled) {
									return
								}
								ass && dispatch(fzhsActions.changeAclistModalDisplay(ass.get('aclist')))
							}}>
								<span>关联科目</span>
								<Icon type="edit" />
							</div>
						</Tooltip>
						<ul className="uses-tip fzhs-uses-tip">
							<li>每个辅助类别若要关联科目，则其至少要有一个辅助核算编码；</li>
							<li>每个科目只支持关联两个辅助核算类别。</li>
						</ul>
						<div className="relatedaclist-wrap">
							{
								(ass ? ass.get('aclist') : []).map((u, j) =>
									<span className="relatedaclist-item" key={u.get('acid')}>
										<span>{u.get('acid')}</span>
										<span>{u.get('acname')}</span>
									</span>
								)
							}
						</div>
					</TableTree>
				</TableWrap>
				<FzModel
					// idx={0}
					CUD_ASS={CUD_ASS}
					detailList={detailList}
					tags={assTags}
					FzModelDisplay={FzModelDisplay}
					configPermissionInfo={configPermissionInfo}
					fzhsState={fzhsState}
					asslist={asslist}
					dispatch={dispatch}
					asscategory={asscategory}
					assItem={fzhsState.get('ass')}
					judgeAssEnter={'insertFz'}
					onOk={(save) => {
						if (nameCheck(fzhsState.getIn(['ass','assname']))) {
							return message.warn(`辅助核算名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
						}
						if(nameCheck(asscategory)) {
							return message.warn(`辅助核算类别名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
						}
					
						dispatch(allActions.enterAssItemFetch('assConfig', fzhsState.get('ass'), save, index))
					}}
					onCancel={() => dispatch(fzhsActions.changeFzModalDisplay())}
					onChangeId={(value) => dispatch(fzhsActions.changeAssId(value))}
					onChangeName={(value) => dispatch(fzhsActions.changeAssName(value))}
				/>
				<Modal
					okText="确定"
					cancelText="取消"
					title="编辑关联科目"
					maskClosable={false}
					visible={fzhsState.get('aclistModalDisplay')}
					onCancel={() => dispatch(fzhsActions.changeAclistModalDisplay())}
					onOk={() => dispatch(allActions.modifyRelatedAclistFetch(activeAssCategory, relatedAclist))}
					>
					<RelateAcModal
						dispatch={dispatch}
						relatedAclist={relatedAclist}
						//cascadeAclist={allState.get('cascadeAclist')}
						asscascadeAclist={categoryAc}
						disSelectAcidlist={disSelectAcidlist}
					/>
				</Modal>
				<ReversAss
					tags={assTags}
					asslist={asslist}
					dispatch={dispatch}
					allState={allState}
					reversAss={reversAss}
					assMessage={assMessage}
					showReversModal={showReversModal}
					reversAssConfirmShow={reversAssConfirmShow}
					activeAssCategory={activeAssCategory}
					oldName={oldName}
					newName={newName}
					assCategoryModalVisible={assCategoryModalVisible}
					ass={ass}
				/>

			</ContainerWrap>
		)
	}
}
