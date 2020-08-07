import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import './style/index.less'

import * as Limit from 'app/constants/Limit.js'
import { TableWrap, TableAll, TableBody, TableItem, Amount } from 'app/components'
import ContainerWrap from 'app/components/Container/ContainerWrap'

import Title from './Title.jsx'
import QcModule from './QcModule.jsx'
import QcModal from './QcModal.jsx'
import TableTitle from './TableTitle.jsx'

import * as lsqcActions	from 'app/redux/Config/Lsqc/lsqc.action.js'

@connect(state => state)
export default
class lsqcConfig extends React.Component {

	static displayName = 'lsqcConfig'

	constructor() {
		super()
		this.state = {
			searchCardContent: '',
			curModal:''
		}
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.lsqcState !== nextprops.lsqcState || this.props.allState !== nextprops.allState || this.props.homeState !== nextprops.homeState || this.state !== nextstate
	}

	render() {
		const { lsqcState, dispatch, allState, homeState} = this.props
		const { searchCardContent, curModal} = this.state

		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])
		// simplifyStatus true为专业版
		const enableWarehouse = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('WAREHOUSE') > -1
		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const simplifyStatus = moduleInfo ? (moduleInfo.indexOf('GL') > -1 ? true : false) : false
		const enableInventory = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('INVENTORY') > -1
		const enableProject = homeState.getIn(['data', 'userInfo','sobInfo','moduleInfo']).indexOf('PROJECT') > -1


		const period = allState.get('period')
		const hasClosed = !!period.get('closedyear')


		const isModified = lsqcState.getIn(['flags', 'isModified'])

		const flags = lsqcState.get('flags')
		const arrList = lsqcState.get('QcList')
		const changeQcList = lsqcState.get('changeQcList')

		const MemberList = lsqcState.get('MemberList')
		const thingsList = lsqcState.get('thingsList')
		const cardPageObj = lsqcState.getIn(['flags','cardPageObj'])
		const showContactsModal = lsqcState.get('showContactsModal')
		const selectList = lsqcState.getIn(['flags', 'selectList'])
		const selectItem = lsqcState.getIn(['flags', 'selectItem'])
		const curModifyBtn = lsqcState.getIn(['flags', 'curModifyBtn'])
		const isShow = lsqcState.getIn(['firstChildToggle', 'isShow'])

		const contactsCategory = lsqcState.get('contactsCategory')
		const hasSearchContent = lsqcState.get('hasSearchContent')
		const searchList = lsqcState.get('searchList')
		const Qcdate = lsqcState.get('Qcdate')
		const currentasscategorylist = lsqcState.getIn(['flags', 'currentasscategorylist'])
		const isDefinite = lsqcState.getIn(['flags','isDefinite'])
		const isCheckOut = lsqcState.getIn(['flags','isCheckOut'])
		const issuedate = lsqcState.getIn(['flags','issuedate'])
		const issues = lsqcState.getIn(['flags','issues'])


// tree
		const curCategoryUuid = lsqcState.getIn(['flags', 'curCategoryUuid'])
		const level = lsqcState.getIn(['flags', 'level'])
		const addItemProperty = lsqcState.getIn(['flags','property'])
		const addItemInventoryNature = lsqcState.getIn(['flags','inventoryNature'])

		const cantChooseList = lsqcState.get('cantChooseList')


		let leftTotalNumber = 0,
		rightTotalNumber = 0

		const getNumber = (numberName) => {
			let totalNumber = 0
			arrList.map((v,i) =>{
				let itemName = i
				const loop = (data,level) => data.map((item,i) => {
					if(item.childList && item.childList.length){
						loop(item.childList,level+1)
					}else{
						if(itemName == 'Contacts' && level == 1){
							totalNumber += 0
						}else{
							if(item.operate == "SUBTRACT"){
								totalNumber -= parseFloat(item[numberName])
							}else{
								totalNumber += parseFloat(item[numberName])
							}
						}


					}
				})
					loop(v.getIn(['List','childList']).toJS(),1)
			})
			return totalNumber
		}

		leftTotalNumber = getNumber('debitBeginAmount')
		rightTotalNumber = getNumber('creditBeginAmount')


		let acListKeysArr = []
		if(simplifyStatus){
			let simplifyStr = ['Account','LongTerm']
			if (enableInventory) {
				simplifyStr.push('Stock')
			} else if(enableProject){
				simplifyStr.push('Project')
			}
			arrList.forEach((v, key) => {
				if(!(simplifyStr.indexOf(key) > -1)){
					acListKeysArr.push(key)
				}
			})
		}else{
			arrList.forEach((v, key) => {
				if (key === 'Stock' && !enableInventory || key === 'Project' && !enableProject )return;
				acListKeysArr.push(key)
			})
		}
		const sortArr = ['Account','Salary','Tax','Contacts','Stock','Project','Others','LongTerm','CIB']

		const acListKeysArrSort = sortArr.filter(v => acListKeysArr.indexOf(v) > -1)
		const titleList = ['类别', '资产', '负债和权益', '操作']

		return (
			<ContainerWrap type="config-one" className='lsqc'>
				<Title
					dispatch={dispatch}
					isModified={isModified}
					curModifyBtn={curModifyBtn}
					Qcdate={Qcdate}
					issues={issues}
					issuedate={issuedate}
					isCheckOut={isCheckOut}
					simplifyStatus={simplifyStatus}
				/>
				<TableWrap notPosition={true}>
					<TableAll>
						<TableTitle
							className='lsqc-tabel-width'
							isShow={isShow}
							dispatch={dispatch}
						/>
						<TableBody>
							<div>
								{
									acListKeysArrSort.map((key, i) => {
										return <QcModule
											className='lsqc-tabel-width'
											editPermission={editPermission}
											listName={key}
											index={i}
											dispatch={dispatch}
											listObj={arrList.get(key)}
											lsqcState={lsqcState}
											curModifyBtn={curModifyBtn}
											hasClosed={hasClosed}
											isModified={isModified}
											changeModal={(value) => this.setState({curModal: value})}
											curModal={curModal}
											isCheckOut={isCheckOut}
											leftTotalNumber={leftTotalNumber}
											rightTotalNumber={rightTotalNumber}
											changeQcList={changeQcList}
											enableWarehouse={enableWarehouse}
										/>
									})
								}
								<TableItem className='lsqc-tabel-width' line={acListKeysArr.length+1}>
									<li>
										资产总计
									</li>
									<li>
										<Amount>{leftTotalNumber}</Amount>
									</li>
									<li></li>
									<li></li>
								</TableItem>
								<TableItem className='lsqc-tabel-width' line={acListKeysArr.length+1}>
									<li>
										负债和权益总计
									</li>
									<li></li>
									<li>
										<Amount>{rightTotalNumber}</Amount>
									</li>
									<li></li>
								</TableItem>
								<TableItem className='lsqc-tabel-width' line={acListKeysArr.length+1}>
									<li>
										待处理财产损溢
									</li>
									<li>
										{leftTotalNumber < rightTotalNumber ?
											<p className="lsqc-aggregate-amount">
												<Amount>{rightTotalNumber-leftTotalNumber}</Amount>
											</p>
											: ''
										}
									</li>
									<li>
										{leftTotalNumber > rightTotalNumber ?
											<p className="lsqc-aggregate-amount">
												<Amount>{leftTotalNumber-rightTotalNumber}</Amount>
											</p>
											: ''
										}
									</li>
									<li></li>
								</TableItem>
								<TableItem className='lsqc-tabel-width' line={acListKeysArr.length+1}>
									<li>
										总金额
									</li>
									<li>
										<p className="lsqc-aggregate-amount">
											<Amount>
												{leftTotalNumber > rightTotalNumber ? leftTotalNumber:rightTotalNumber}
											</Amount>
										</p>
									</li>
									<li>
										<p className="lsqc-aggregate-amount">
											<Amount>
												{leftTotalNumber > rightTotalNumber ? leftTotalNumber:rightTotalNumber}
											</Amount>
										</p>
									</li>
									<li></li>
								</TableItem>
							</div>
						</TableBody>
					</TableAll>
				</TableWrap>
				<QcModal
					dispatch={dispatch}
					curCategory={`${level}${Limit.TREE_JOIN_STR}${curCategoryUuid}`}
					contactsCategory={contactsCategory}
					MemberList={MemberList}
					thingsList={thingsList}
					showContactsModal={showContactsModal}
					selectList={selectList}
					selectItem={selectItem || fromJS([])}
					searchCardContent={searchCardContent}
					searchList={searchList}
					hasSearchContent={hasSearchContent}
					changeInputValue={(value) => this.setState({searchCardContent: value})}
					curModal={curModal}
					cantChooseList={cantChooseList}
					addItemProperty={addItemProperty}
					addItemInventoryNature={addItemInventoryNature}
					isDefinite={isDefinite}
					changeQcList={changeQcList}
					isCheckOut={isCheckOut}
					flags={flags}
					cardPageObj={cardPageObj}
				/>
			</ContainerWrap>
		)
	}
}
