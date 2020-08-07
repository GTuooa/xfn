import React, { Fragment }  from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS } from 'immutable'

import * as thirdParty from 'app/thirdParty'
import { ROOT } from 'app/constants/fetch.constant.js'
import { Table, Icon, InputNumber, Button, Modal } from 'antd'
import { Amount, TableItem } from 'app/components'

import QcItem from './QcItem.jsx'

import * as lsqcActions	from 'app/redux/Config/Lsqc/lsqc.action.js'

@immutableRenderDecorator
export default
class QcModule extends React.Component {

	static displayName = 'QcModule'

	render() {

		const {
			editPermission,
			dispatch,
			isModified,
			listObj,
			lsqcState,
			listName,
			curModifyBtn,
			changeModal,
			curModal,
			isCheckOut,
			leftTotalNumber,
			rightTotalNumber,
			className,
			index,
			changeQcList,
			enableWarehouse,
		} = this.props

		const listItem = listObj.get('List')
		const btnStatus = listObj.get('status')
		let lineNum = 0
		const balanceShowChild = lsqcState.getIn(['flags', 'balanceShowChild'])
		const showFirstChild = lsqcState.getIn(['firstChildToggle', `${listName}Display`])
		const haveFirstChild = listItem.get('childList') && listItem.get('childList').size ? true : false
		let allShowBtn = false
		const loop = (data, leve, upperArr) => data.map((item, i) => {
			let line = ++lineNum
			const showChild = balanceShowChild.indexOf(item.get('relationUuid')) > -1
			if((listName == 'Contacts' || listName == 'Stock')  && !item.get('isDefinite')){
				allShowBtn = true
			}
			if (item.get('childList') && item.get('childList').size) {
				return  <div key={line}>
					<QcItem
						leve={leve}
						className={className}
						item={item}
						haveChild={true}
						showChild={showChild}
						line={index+1}
						upperArr={upperArr}
						listItem={listItem}
						listName={listName}
						btnStatus={btnStatus}
						dispatch={dispatch}
						curModal={curModal}
						isCheckOut={isCheckOut}
						curModifyBtn={curModifyBtn}
						changeQcList={changeQcList}
					/>
					{showChild ? loop(item.get('childList'), leve+1, upperArr.push(item.get('uuid'))) : ''}
				</div>
			} else {
				return (
					<QcItem
						key={line}
						leve={leve}
						className={className}
						item={item}
						line={index+1}
						upperArr={upperArr}
						listItem={listItem}
						listName={listName}
						btnStatus={btnStatus}
						dispatch={dispatch}
						curModal={curModal}
						isCheckOut={isCheckOut}
						curModifyBtn={curModifyBtn}
						changeQcList={changeQcList}
					/>
				)
			}
		})
		const modifyMoudleStr = ({
			'Account': () => '账户',
			'Tax': () => '税费',
			'Salary': () => '薪酬',
			'Contacts': () => '往来款',
			'Stock': () => '存货',
			'Others': () => '其他应收、应付',
			'LongTerm': () => '长期资产',
			'CIB': () => '资本、投资、借款',
			'Project': () => '项目',
		}[curModifyBtn] || (()=>''))()

		const listChild = listItem.get('childList').toJS()

		const projectAddBtnArr = ['PROJECT_PRODUCT_BASIC_CATEGORY_UUID','PROJECT_CONSTRUCTION_COST_CATEGORY_UUID','PROJECT_CONSTRUCTION_PROFIT_CATEGORY_UUID','PROJECT_SETTLEMENT_CATEGORY_UUID']

		const getNumber = (numberName) => {
			let totalNumber = 0
			const loop = (data,level) => data.map((item,i) => {
				if(item.childList && item.childList.length>0){
					loop(item.childList,level+1)
				}else{
					if(listName == 'Contacts' && level == 1 || listName == 'Project' && projectAddBtnArr.includes(item['relationUuid'])){
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
			loop(listChild,1)
			return totalNumber
		}
		const btnComponent = btnStatus ?
		<Fragment>
			<Button
				className="title-right title-save"
				style={{display: isCheckOut ? 'none' : ''}}
				type="ghost"
				disabled={!editPermission}
				onClick={() => {

					Modal.confirm({
						title: '提示',
						content: `确定清空【${listItem.get('name')}】的期初值吗`,
						okText: '确定',
						cancelText: '取消',
						onOk: () => {
							dispatch(lsqcActions.changeAllQcListInMoudle(listName))
						}
					})
				}}
			>
				清空
			</Button>
			<Button
				className="title-right title-modify"
				type="ghost"
				disabled={!editPermission}
				onClick={() => {
					if(enableWarehouse && listName === 'Stock'){
						Modal.success({
							title: '账套开启仓库管理，请前往“存货设置”中填入期初值',
							content: '',
						});
					}else if (curModifyBtn === '') {
						dispatch(lsqcActions.changeModifyBtn(listName,false))
						const modalName = listName === 'Contacts' ? 'Contacts' : listName === 'Project' ? 'Project' : 'Stock'
						changeModal(modalName)
					} else {
						const alertMessage = `“${modifyMoudleStr}”的期初余额未保存，是否保存后继续操作？`
						Modal.confirm({
							title: '提示',
							content: alertMessage,
							okText: '保存',
							cancelText: '放弃',
							onOk: () => {
								dispatch(lsqcActions.saveBeginningBalance(curModifyBtn))
							},
							onCancel: () => {
								dispatch(lsqcActions.restoreModification(curModifyBtn))
								dispatch(lsqcActions.getBeginningList())
							}
						})
					}
				}}
			>
				修改
			</Button>
		</Fragment> :
		<div>
			<Button
				className="title-right title-save"
				type="ghost"
				disabled={!editPermission}
				// disabled={isObOrOp || hasClosed}
				onClick={() => {
					// if (isModified) {
					dispatch(lsqcActions.saveBeginningBalance(curModifyBtn))
					// } else {
					// 	thirdparty.alert('未进行期初值修改！')
					// }
				}}
			>
				保存
			</Button>
			<Button
				className="title-right"
				type="ghost"
				disabled={!editPermission}
				// disabled={isObOrOp || hasClosed}
				onClick={() => {
					dispatch(lsqcActions.restoreModification(curModifyBtn))
					dispatch(lsqcActions.getBeginningList())
				}}
			>
				取消
			</Button>
		</div>
		const moduleComponents = loop(listItem.get('childList'), 1, fromJS([]))
		return (
			<div style={{display:listItem.get('childList') && listItem.get('childList').size || listName === 'Stock' ? '' : 'none'}}>
				<TableItem className={className} line={index+1}>
					<li className="module-title-name"  onClick={() => {
						if(haveFirstChild){
							dispatch(lsqcActions.firstChildToggle(listName))
						}
					}}>
						<span className="table-item-name">
							{
								// listName == 'Stock' && !btnStatus && !isCheckOut ?
								// <Icon
								// 	type="plus"
								// 	className='acconfig-plus'
								// 	onClick={(e) => {
								// 		e.stopPropagation()
								// 		dispatch(lsqcActions.getDetailsListInfo(listName,sessionStorage.getItem('psiSobId'),listItem))
								// 	}}
								// /> :''
							}
							<span className="name-name">{listItem.get('name')}</span>
						</span>

						{
							haveFirstChild ?
							<span className="table-item-triangle-account-wrap title-right name-icon">
								<Icon className="table-item-triangle-account"
									type={showFirstChild == 'block' ? 'up' : 'down'}>
								</Icon>
							</span> : ''
						}
					</li>
					<li><Amount>{getNumber('debitBeginAmount')}</Amount></li>
					<li><Amount>{getNumber('creditBeginAmount')}</Amount></li>
					<li>
						{
							// 已结账后，“修改”按钮一般不显示；往来款有未明确对象，才显示修改按钮
							isCheckOut ? (allShowBtn ? btnComponent : null) : btnComponent
						}
					</li>
				</TableItem>
				<div className="lsqc-module-content" style={{display:showFirstChild}}>
					{moduleComponents}
				</div>
			</div>
		)
	}
}
