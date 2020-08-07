import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { formatDate } from 'app/utils'
import { TableWrap, TableBody, TableAll, TablePagination, TablePaginationPageSize, CxpzTableItem } from 'app/components'

import Item from './Item.jsx'
import TableTit from './TableTit.jsx'
import CalculateModal from './CalculateModal'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@immutableRenderDecorator
export default
	class Table extends React.Component {

	constructor(props) {
		super(props)
		this.state ={
			manageModal: false,//单笔流水核算弹窗
			carryoverModal: false,//单笔成本结转流水弹窗
			invioceModal: false,//单笔开具发票弹窗
			defineModal: false,//单笔发票认证弹窗
			jzsyModal:false,//单笔结转损益弹窗
			grantModal:false,
			backModal:false,
			takeBackModal:false,
			defrayModal:false,
		}
	}

	initModal = (modalName) => {
		this.setState({[modalName]:false})
		this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('modalTemp', fromJS({oriDate:formatDate().substr(0,10)})))
	}

	render() {

		const {
			paginationCallBack,
			dispatch,
			approvalList,
			openEditRunningModal,
			addCheckDetailItem,
			deleteCheckDetailItem,
			selectList,
			setSelectList,
			editLrAccountPermission,
			currentPage,
			pageCount,
			pageSize,
			clearSelectList,
			sortByBeginDateCallBack,
			sortByEndDateCallBack,
			sortByDealtypeCallBack,
		} = this.props

		const {
			manageModal,
			carryoverModal,
			invioceModal,
			defineModal,
			jzsyModal,
			grantModal,
			backModal,
			takeBackModal,
			defrayModal, 
		} = this.state

		// lrpz的上下张凭证数组vcindexList包含的是 ['2017-01_1'], 日期和凭证号的分隔符为 "_"

		let uuidList = fromJS([])
		let detailListSize = 0
		approvalList.map((v, i) => {
			let detailList = v.get('detailList')
			detailList.forEach(w => {
				detailListSize+=1
				if (w.get('jrOriUuid')) {
					let item = w.set('oriUuid', w.get('jrOriUuid'))
					uuidList = uuidList.push(item)
				}
			})
		})

		let selectAll = detailListSize === selectList.length

		return (
			<TableWrap notPosition={true}>
				<TableAll>
					<TableTit
						className="search-approval-table-width search-approval-table-title-justify"
						selectAll={selectAll && approvalList.size}
						onClick={() => {
							if (approvalList.size) {
								if (selectAll) {
									setSelectList([])
								} else {
									let arr = []
									approvalList.map((v, i) => {
										let detailList = v.get('detailList')
										detailList.forEach(w => {
											arr.push(w.get('id'))
										})
									})
									setSelectList(arr)
								}
							}
						}}
						sortByBeginDateCallBack={sortByBeginDateCallBack}
						sortByEndDateCallBack={sortByEndDateCallBack}
						sortByDealtypeCallBack={sortByDealtypeCallBack}
					/>
					<TableBody>
						{
							approvalList && approvalList.map((v, i) => {
								return (
									<Item
										className="search-approval-table-width search-approval-table-style"
										line={i + 1}
										item={v}
										dispatch={dispatch}
										openEditRunningModal={openEditRunningModal}
										addCheckDetailItem={addCheckDetailItem}
										deleteCheckDetailItem={deleteCheckDetailItem}
										selectList={selectList}
										parent={this}
										editLrAccountPermission={editLrAccountPermission}
										uuidList={uuidList}
										clearSelectList={clearSelectList}
									/>
								)
							})
						}
					</TableBody>
		{/** 		<TablePagination
						currentPage={currentPage}
						pageCount={pageCount}
						paginationCallBack={(value) => paginationCallBack(value)}
					/>
		*/}
					<TablePaginationPageSize
						pageSize={pageSize}
						currentPage={currentPage}
						pageCount={pageCount}
						paginationCallBack={(current,pageSize) => paginationCallBack(current,pageSize)}
					/>
				</TableAll>
				<CalculateModal
					manageModal={manageModal}
					carryoverModal={carryoverModal}
					invioceModal={invioceModal}
					defineModal={defineModal}
					jzsyModal={jzsyModal}
					grantModal={grantModal}
					backModal={backModal}
					takeBackModal={takeBackModal}
					defrayModal={defrayModal}
					parent={this}
					initModal={(modalName) => this.initModal(modalName)}
				/>
			</TableWrap>
		)
	}
}

// {
	// <VcItem
	// 	className="cxpz-table-width cxpz-table-justify"
	// 	line={i+1}
	// 	idx={i}
	// 	key={i}
	// 	vcitem={v}
	// 	dispatch={dispatch}
	// 	selectVcAll={selectVcAll}
	// 	vcindexList={vcindexList}
	// 	issuedate={issuedate}
	// 	PzPermissionInfo={PzPermissionInfo}
	// />
// }