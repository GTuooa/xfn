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
			wlmxState,
			accountConfState,
			detailsTemp,
			panes,

			currentPage,
			curAccountUuid,
			pageCount,
			defaultCategory,
			accountType,
			paymentType,
			endissuedate,
			cardList,
			curCardUuid,

			categoryUuid,
			propertyCost,
			categoryName,
			editLrAccountPermission,
			showDrawer,
			searchContent
		} = this.props

		const { showDetail } = this.state
		const wlRelate = wlmxState.getIn(['flags', 'wlRelate'])
		const contactTypeTree = wlmxState.get('contactTypeTree')
		const runningCategory = wlmxState.get('runningCategory')
		const wlType = wlmxState.getIn(['flags','wlType'])
		const cardPages = wlmxState.get('cardPages')
		const cardCurPage = wlmxState.get('cardCurPage')
		const wlmxOutWidth = wlRelate === '' || wlRelate === '3' ? 'table-normal-with-wlmxb' : 'table-normal-with-wlmxb-small'

		return (
			<TableWrap className={`${wlmxOutWidth} table-flex-mxb wlmxb-content`}>
				<CardTable
					issuedate={issuedate}
					wlmxState={wlmxState}
					curCategory={curCategory}
					accountConfState={accountConfState}
					runningCategory={runningCategory}
					dispatch={dispatch}
					detailsTemp={detailsTemp}
					panes={panes}
					curAccountUuid={curAccountUuid}
					editLrAccountPermission={editLrAccountPermission}
					showDrawer={showDrawer}
				/>

				<TreeContain
					flags={flags}
					currentPage={currentPage}
					issuedate={issuedate}
					pageCount={pageCount}
					dispatch={dispatch}
					curCategory={curCategoryTree}
					runningCategory={runningCategory}
					endissuedate={endissuedate}
					cardList={cardList}
					curCardUuid={curCardUuid}

					contactTypeTree={contactTypeTree}
					runningCategory={runningCategory}

					categoryUuid={categoryUuid}
					propertyCost={propertyCost}
					categoryName={categoryName}
					wlType={wlType}
					cardPages={cardPages}
					cardCurPage={cardCurPage}
					searchContent={searchContent}
				/>

			</TableWrap>
		)
	}
}
