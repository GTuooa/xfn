import React, { PropTypes } from 'react'
import { Map, toJS, fromJS } from 'immutable'
import { connect } from 'react-redux'
import '../style.less'

import { DateLib } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { TopDatePicker } from 'app/containers/components'
import { Container, Row, ScrollView, Icon, ButtonGroup, Button } from 'app/components'
import ZeroInventory from './ZeroInventory'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'

@connect(state => state)
export default
	class AccountApproval extends React.Component {

	componentDidMount() {
		thirdParty.setTitle({ title: '挂账信息' })
		thirdParty.setIcon({
			showIcon: false
		})
		thirdParty.setRight({ show: false })

	}

	constructor() {
		super()
		this.state = {
			// isSearch: false,
		}
	}

	componentWillUnmount() {
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', new DateLib().valueOf()))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beCarryoverOut', false))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCost', ''))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('propertyCostList', fromJS([])))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('beZeroInventory', false))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverCategoryItem', null))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('usedCarryoverProject', false))
        this.props.dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('carryoverProjectCardList', fromJS([])))
    }

	render() {
		const {
			dispatch,
			history,
			approalAccountState,
		} = this.props

		const accountDate = approalAccountState.get('accountDate')
		const selectList = approalAccountState.get('selectList')

		const fromPage = approalAccountState.get('fromPage')
		const beZeroInventory = approalAccountState.get('beZeroInventory')
		const beCarryoverOut = approalAccountState.get('beCarryoverOut')
		const propertyCost = approalAccountState.get('propertyCost')
		const propertyCostList = approalAccountState.get('propertyCostList')
		const carryoverCategoryList = approalAccountState.get('carryoverCategoryList')
		const carryoverCategoryItem = approalAccountState.get('carryoverCategoryItem')
		const usedCarryoverProject = approalAccountState.get('usedCarryoverProject')
		const carryoverProjectCardList = approalAccountState.get('carryoverProjectCardList')
		const carryoverProjectList = approalAccountState.get('carryoverProjectList')

		return (
			<Container className="edit-running search-approval">
				<TopDatePicker
					value={accountDate}
					callback={(date) => {
						const value = new DateLib(date).valueOf()
						dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', value))
					}}
					onChange={date => {
						const value = new DateLib(date).valueOf()
						dispatch(searchApprovalActions.changeSearchRunningCalculateCommonString('accountDate', value))
					}}
				/>
				<ScrollView flex='1'>
					{
						beZeroInventory ?
							<ZeroInventory
								oriDate={accountDate}
								dispatch={dispatch}
								beCarryoverOut={beCarryoverOut}
								propertyCost={propertyCost}
								propertyCostList={propertyCostList}
								carryoverCategoryList={carryoverCategoryList}
								carryoverCategoryItem={carryoverCategoryItem}
								usedCarryoverProject={usedCarryoverProject}
								carryoverProjectCardList={carryoverProjectCardList}
								carryoverProjectList={carryoverProjectList}
							/>
							: null
					}
				</ScrollView>
				<Row className="footer">
					<ButtonGroup style={{ height: 50 }}>
						<Button onClick={() => {
							history.goBack()
						}}><Icon type="cancel"></Icon><span>取消</span></Button>
						<Button onClick={() => {
							dispatch(searchApprovalActions.accountingApprovalProcessDetailInfo(selectList, accountDate, beCarryoverOut, carryoverCategoryItem, carryoverProjectCardList, propertyCost, () => {
								if (fromPage === 'modal') {
									dispatch(searchApprovalActions.getApprovalProcessDetailInfo(selectList.get(0), () => { }, 'switch'))
								}
								history.goBack()
							}))
						}}><Icon type="save"></Icon><span>保存</span></Button>
					</ButtonGroup>
				</Row>
			</Container>
		)
	}
}