import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon, Amount, ChosenPicker,XfInput } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import { toJS, fromJS } from 'immutable'
import browserNavigator from 'app/utils/browserNavigator'
import * as thirdParty from 'app/thirdParty/dingding'
import * as lsqcActions from 'app/redux/Config/Lsqc/lsqc.action.js'

@immutableRenderDecorator
export default
class EditBa extends React.Component {
	constructor() {
		super()
		this.state = {
			debitBeginAmount: '',
			creditBeginAmount: '',
		}
	}
	componentDidMount() {
        this.setState({
			debitBeginAmount: this.props.ba.get('debitBeginAmount') == 0 ? '' : this.props.ba.get('debitBeginAmount'),
			creditBeginAmount: this.props.ba.get('creditBeginAmount') == 0 ? '' : this.props.ba.get('creditBeginAmount')
		})
    }
	// componentWillReceiveProps(nextprops) {
	// 	if (nextprops.ba.get('debitBeginAmount') !== this.props.ba.get('debitBeginAmount') || nextprops.ba.get('creditBeginAmount') !== this.props.ba.get('creditBeginAmount')) {
	// 		this.setState({
	// 			debitBeginAmount: nextprops.ba.get('debitBeginAmount') == 0 ? '' : nextprops.ba.get('debitBeginAmount'),
	// 			creditBeginAmount: nextprops.ba.get('creditBeginAmount') == 0 ? '' : nextprops.ba.get('creditBeginAmount')
	// 		})
	// 	}
	//
	// }

	render() {
		const {
			ba,
			style,
			hasSub,
			dispatch,
			className,
			issuedate,
			endissuedate,
			leve,
			haveChild,
			showChild,
			history,
			listName,
			lsqcState,
			enableWarehouse,
			isCheckOut
		} = this.props
		const {debitBeginAmount,creditBeginAmount} = this.state
		const articlePaddingLeft = (leve - 1) / 100 * 10 + 'rem'
		const MemberList = lsqcState.get('MemberList')
		const thingsList = lsqcState.get('thingsList')
		const contactsCategory = lsqcState.get('contactsCategory')
		const showContactsModal = lsqcState.get('showContactsModal')
		const isDefinite = lsqcState.getIn(['flags','isDefinite'])
		const curmemberList = listName === 'Contacts' ? MemberList : thingsList
		const isDisabled = ba.get('handleAmount') !== 0  && !ba.get('add') && listName === 'Project' ? true : ba.get('add') ? false : isCheckOut
		const addItemProperty = lsqcState.getIn(['flags','property'])
		const categoryKey = lsqcState.getIn(['flags','categoryKey'])
		const addItemInventoryNature = lsqcState.getIn(['flags','inventoryNature'])
		// const flagColor = {
		// 	1: '#fff',
		// 	2: '#D1C0A5',
		// 	3: '#7E6B5A',
		// 	4: '#59493f'
		// }[leve]

		const flagstyle = {
			// background: flagColor,
			minWidth: articlePaddingLeft,
			backgroundColor:style
		}
		const listItem = lsqcState.getIn(['QcList',listName,'List'])
		const getNumber = (numberName) => {
			let totalNumber = 0
			const loop = (data) => {
				data.map((item,i) => {
					if(item.childList && item.childList.length>0){
						loop(item.childList)
					}else{
						if(item.operate == "SUBTRACT"){
							totalNumber -= parseFloat(item[numberName])
						}else{
							totalNumber += parseFloat(item[numberName])
						}

					}
				})


			}
			ba.get('childList') && ba.get('childList').size > 0 ? loop(ba.get('childList').toJS()) : ''

			const number = ba.get('childList') && ba.get('childList').size > 0 ? totalNumber
			:
			((listName == 'Contacts' || listName == 'Stock') && leve==1 || listName == 'Project' && projectAddBtnArr.includes(ba.get('relationUuid')) ) ? 0 : ba.get(numberName)
			return number
		}
		const cantChooseList = lsqcState.get('cantChooseList')
		const changeQcList = lsqcState.get('changeQcList')
		let cantLists = [],//已在新增列表
			deleteLists = []//已在删除列表
		let newCantChooseList = cantChooseList
		changeQcList.map(item => {
			if(item.get('operateType') === '1' && (item.get('property') == addItemProperty || item.get('property') == 'stock')){
				cantLists.push(item.get('uuid'))
			}
			if(item.get('operateType') === '2' && cantChooseList.indexOf(item.get('relationUuid')) > -1 ){
				deleteLists.push(item.get('relationUuid'))
			}
		})
		cantLists = fromJS(cantLists)
		deleteLists = fromJS(deleteLists)

		const selectList = lsqcState.getIn(['flags', 'selectList'])
		const cardList = !isCheckOut ? curmemberList.map(v => {return {key: `${v.get('code')} ${v.get('name')}`, value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('relationUuid')}`}}) :
									curmemberList.filter(v => v.get('code') !== 'UDFNCRD' && v.get('code') !== 'IDFNCRD')
												.map(v => {return {key: `${v.get('code')} ${v.get('name')}`, value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('relationUuid')}`}})

		const allListNameChild = lsqcState.getIn(['QcList',listName,'List','childList'])
		let projectCardType = fromJS([])
		const cantChooseLoop = data => data.map((item,i) => {
			if(item.get('relationUuid') === ba.get('relationUuid')){
				projectCardType = item.get('childList')
			}
			if(item.get('childList') && item.get('childList').size){
				cantChooseLoop(item.get('childList'))
			}
		})
		cantChooseLoop(allListNameChild)



		const cardTypeList =  listName !== 'Project' ? lsqcState.getIn(['QcList',listName,'List','childList']).filter(v=>v.get('property') === ba.get('property')).getIn([0,'childList']) : projectCardType

		const regPositive = /^\d{0,14}(\.\d{0,2})?$/
		const regNegative = /^-{0,1}\d{0,14}(\.\d{0,2})?$/
		const negativeAllowed = ba.get('acType') === 'AC_BNLR' || ba.get('acType') === 'AC_WFPLR' || listName == 'Account' || listName == 'Project' ? true : false

		const projectAddBtnArr = ['PROJECT_PRODUCT_BASIC_CATEGORY_UUID','PROJECT_CONSTRUCTION_COST_CATEGORY_UUID','PROJECT_CONSTRUCTION_PROFIT_CATEGORY_UUID','PROJECT_SETTLEMENT_CATEGORY_UUID']
		const candeleteProperty = ['CARD_PROPERTY_BASIC','CARD_PROPERTY_CONTRACT_COST','CARD_PROPERTY_CONTRACT_PROFIT','CARD_PROPERTY_ENGINEER']

		const component = <span
			style={{display:'flex',alignItems:'baseline'}}
			onClick={(e) => {
				dispatch(lsqcActions.getDetailsListInfo(listName,sessionStorage.getItem('psiSobId'),ba))
			}}>
			{leve == 1 ? '' : <span className="ba-flag" style={flagstyle}></span>}
			<Icon
				type="add"
				className='acconfig-plus'
			/>
			<span className='name-name'>
				{
					listName == 'Contacts' ? (ba.get('name').indexOf('UDFNCRD') > -1 ? `未明确单位` : `${ba.get('name')}`) :
					ba.get('name').indexOf('IDFNCRD') > -1 ? `未明确存货` : `${ba.get('name')}`

				}
			</span>
		</span>

		return (
			<div className={'ba' + ' ' + className} style={style}>
				<div className='ba-info'>

					<span className='name-edit'>
						{
							(
								((listName == 'Contacts' || listName == 'Stock') && leve==1 && !isCheckOut) ||
								((listName == 'Contacts' || listName == 'Stock') && !ba.get('isDefinite') && isCheckOut) ||
								(listName == 'Project' && (projectAddBtnArr.includes(ba.get('relationUuid'))) && !isCheckOut)
							) && (!enableWarehouse || listName !== 'Stock') ?
							<span>
								<ChosenPicker
									type={'card'}
									parentDisabled={false}
									district={contactsCategory.toJS()}
									cardList={curmemberList.toJS()}
									value={'-:-0'}
									onChange={(value)=>{
										const valueList = value.key.split(Limit.TREE_JOIN_STR)
										dispatch(lsqcActions.getContactsMember(listName,valueList[0],sessionStorage.getItem('psiSobId'),addItemProperty,valueList[1],addItemInventoryNature))
										dispatch(lsqcActions.changeCategory(value.key))
									}}
									onOk={(result)=>{
										const valueList = result[0]
										let hasFlag = false
										cardTypeList.map(v => {
											if(v.get('uuid') === valueList.uuid || v.get('relationUuid') === valueList.uuid)
											hasFlag = true
										})

										if(hasFlag){
											return thirdParty.Alert('该对象已添加')
										}else{
											dispatch(lsqcActions.addRunningBeginItem(valueList.uuid,valueList.name,valueList.code,listName,isDefinite))
										}
									}}
									cardValue={[]}
									children={component}
								/>
							</span> :
							<span>
								{leve == 1 ? '' : <span className="ba-flag" style={flagstyle}></span>}
								<span className='name-name'>
									{
										listName == 'Contacts' ? (ba.get('name').indexOf('UDFNCRD') > -1 ? `未明确单位` : `${ba.get('name')}`) :
										ba.get('name').indexOf('IDFNCRD') > -1 ? `未明确存货` : `${ba.get('name')}`

									}
								</span>
							</span>


						}


					</span>
					{
						haveChild ||
						!haveChild && (listName == 'Contacts' || listName == 'Stock') && leve == 1 ||
						!haveChild && listName == 'Project' && projectAddBtnArr.includes(ba.get('relationUuid'))?
						<Amount showZero={false}>{getNumber('debitBeginAmount')}</Amount> :
						ba.get('direction') == 'debit' ?
						<span className="lsqc-edit-input">
							<XfInput
								mode='number'
								textAlign='right'
								disabled={ba.get('direction') == 'debit' ? isDisabled : true}
								value={debitBeginAmount}
								negativeAllowed={negativeAllowed}
								// onBlur={(value) => {
								// 	if(value == 0){
								// 		this.setState({debitBeginAmount: ''})
								// 	}
								// }}
								onChange={(value) => {
									// if (reg.test(value)) {
										dispatch(lsqcActions.changeQcList(listItem, ba, value, leve,listName,'debitBeginAmount'))
										this.setState({debitBeginAmount: value})
									// }

								}}
							/>
						</span> : <span></span>
					}
					{
						haveChild ||
						!haveChild && (listName == 'Contacts' || listName == 'Stock') && leve == 1 ||
						!haveChild && listName == 'Project' && projectAddBtnArr.includes(ba.get('relationUuid')) ?
						<Amount showZero={false}>{getNumber('creditBeginAmount')}</Amount> :
						ba.get('direction') == 'credit' ?
						<span className="lsqc-edit-input">
							<XfInput
								mode='number'
								textAlign='right'
								disabled={ba.get('direction') == 'credit' ? isDisabled : true}
								value={creditBeginAmount}
								negativeAllowed={negativeAllowed}
								// onBlur={(value) => {
								// 	if(value == 0){
								// 		this.setState({creditBeginAmount: ''})
								// 	}
								// }}
								onChange={(value) => {
									// if (reg.test(value)) {
										dispatch(lsqcActions.changeQcList(listItem, ba, value, leve,listName,'creditBeginAmount'))
										this.setState({creditBeginAmount: value})
									// }
								}}
							/>
						</span> : <span></span>
					}

					{
						((listName == 'Contacts'|| listName == 'Stock') && leve > 1) && !haveChild && !isCheckOut ||
						(candeleteProperty.indexOf(ba.get('property')) > -1 && !(projectAddBtnArr.includes(ba.get('relationUuid'))) && !haveChild && !isCheckOut) ||
						ba.get('add') ?
						<span
							className='btn'
							style={{display: listName == 'Stock' && enableWarehouse ? 'none' : ''}}
						>
							<Icon
								type="close"
								className='acconfig-plus'
								onClick={(e) => {
									e.stopPropagation()
									dispatch(lsqcActions.deleteBeginningMembers(ba,listName))
								}}
							/>
						</span> :
						<span className='btn' onClick={() => dispatch(lsqcActions.QCEditTriangleSwitch(showChild, ba.get('uuid')))}>
							<Icon
								type='arrow-down'
								style={{visibility: haveChild ? 'visible' : 'hidden', transform: showChild ? 'rotate(180deg)' : ''}}
							/>
						</span>
					}
				</div>
				{

				}

			</div>

		)
	}
}
