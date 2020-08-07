import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS } from 'immutable'

import * as Limit from 'app/constants/Limit.js'
import { DatePicker, Input, Select, Checkbox, Button, Modal, message, Timeline } from 'antd'
import { RunCategorySelect, AcouontAcSelect,TableWrap } from 'app/components'
import CardTable from './CardTable'
import TreeContain from './TreeContains'

@immutableRenderDecorator
export default
class CardWrap extends React.Component {
	constructor() {
		super()
		this.state = {
			showDetail: false
		}
	}
	// componentWillReceiveProps(nextprops) {
	// }

	render() {
		const {
			flags,
            cardTemp,
            dispatch,
			issuedate,
			// selectList,
			curCategory,
			curCategoryTree,
			zhmxState,
			accountConfState,
			runningCategory,
			detailsTemp,
			hideCategoryList,
			panes,

			currentPage,
			curAccountUuid,
			pageCount,
			PageTab,
			defaultCategory,
			accountType,
			paymentType,
			endissuedate,
			editLrAccountPermission,
			propertyCost,
			showDrawer,
			searchContent
		} = this.props

		const { showDetail } = this.state

		return (
			<TableWrap className="table-normal-with-new table-flex-mxb">
				<CardTable
					issuedate={issuedate}
					endissuedate={endissuedate}
					zhmxState={zhmxState}
					curCategory={curCategory}
					accountConfState={accountConfState}
					runningCategory={runningCategory}
					dispatch={dispatch}
					detailsTemp={detailsTemp}
					panes={panes}
					curAccountUuid={curAccountUuid}
					editLrAccountPermission={editLrAccountPermission}
					propertyCost={propertyCost}
					showDrawer={showDrawer}
				/>

				<TreeContain
					flags={flags}
					currentPage={currentPage}
					accountType={accountType}
					paymentType={paymentType}
					defaultCategory={defaultCategory}
					curAccountUuid={curAccountUuid}
					issuedate={issuedate}
					pageCount={pageCount}
					hideCategoryList={hideCategoryList}
					dispatch={dispatch}
					curCategory={curCategoryTree}
					runningCategory={runningCategory}
					PageTab={PageTab}
					endissuedate={endissuedate}
					searchContent={searchContent}
				/>

			</TableWrap>
		)
	}
}
