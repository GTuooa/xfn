import React, { Fragment } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import XfIcon from 'app/components/Icon'
import { fromJS } from 'immutable'

import CommonModal from '../../MxbModal/CommonModal'

import * as projectMxbActions from 'app/redux/Mxb/ProjectMxb/projectMxb.action.js'

@immutableRenderDecorator
export default
class OverviewTitle extends React.Component{

	render() {

        const {
			dispatch,
			className,
			analysisValue,
			showAccount,
			showCurrent,
			showStock,
			openQuantity,
			isDebit,
			chooseStockCard,
			chooseContactCard,
			chooseAccountCard,
			showAccountModal,
			curSelectAccountUuid,
			curSelectContactUuid,
			curSelectStockUuid,
			modalName,
			issuedate,
			endissuedate,
			currentCardItem,
			chooseDirection,
			accountCardList,
			contactCardList,
			stockCardList,
			showAll,
		} = this.props

		let titleNameList = []
		switch(analysisValue){
			case '1':
				titleNameList = [
					{name:'日期'},
					{name:'流水号'},
					{name:'摘要',className: 'table-title-center'},
					{name:'往来',notShow: !showCurrent,chooseContactCard,className: 'position-item',modalClassName:'position-item-modal'},
					{name:'存货',notShow: !showStock,chooseStockCard,className: 'position-item',modalClassName:'position-item-modal'},
					{name:'数量',notShow: !showStock || showStock && !openQuantity},
					{name:'收入发生额'},
					{name:'支出发生额'},
					{name:'方向'},
					{name: isDebit ? '收入净额' : '支出净额'}
				]
				break;
			case '2':
				titleNameList = [
					{name:'日期'},
					{name:'流水号'},
					{name:'摘要',className: 'table-title-center'},
					{name:'账户',notShow: !showAccount,chooseAccountCard,className: 'position-item',modalClassName:'position-item-modal'},
					{name:'收入实收额'},
					{name:'支出实付额'},
					{name:'方向'},
					{name: isDebit ? '实收净额' : '实付净额'}
				]
				break;
			case '3':
				titleNameList = [
					{name:'日期'},
					{name:'流水号'},
					{name:'摘要',className: 'table-title-center'},
					{name:'往来',notShow: !showCurrent,chooseContactCard,className: 'position-item',modalClassName:'position-item-modal'},
					{name:'本期新增',childList:[{name:'应收额'},
					{name:'应付额'}]},
					{name:'本期核销',childList:[{name:'应收核销额'},{name:'应付核销额'}]},
					{name:'方向'},{name: isDebit ? '应收余额' : '应付余额'}
				]
				break;
			case '0':
			default:
				titleNameList = [
					{name:'日期'},
					{name:'流水号'},
					{name:'摘要',className: 'table-title-center'},
					{name:'发生额',childList:[{name:'收入发生额'},{name:'支出发生额'}]},
					{name:'收付额',childList:[{name:showAll ? '收入实收额' : '收款额'},{name:showAll ? '支出实付额' : '付款额'}]},
					{name:'方向'},
					{name: isDebit ? '应收余额' : '应付余额'}
				]
				break;
		}


		const getModal = (modalName) => {
			let selectUuidName = '',chooseCardName = '',chooseCardObj = {}

			switch(modalName){
				case '账户' :
					selectUuidName = 'curSelectAccountUuid'
					chooseCardName = 'chooseAccountCard'
					chooseCardObj = chooseAccountCard
					break;
				case '往来' :
					selectUuidName = 'curSelectContactUuid'
					chooseCardName = 'chooseContactCard'
					chooseCardObj = chooseContactCard
					break;
				case '存货' :
					selectUuidName = 'curSelectStockUuid'
					chooseCardName = 'chooseStockCard'
					chooseCardObj = chooseStockCard
					break;
				default:
					break;
			}
			return {selectUuidName,chooseCardName,chooseCardObj}
		}


		return (
			<div className="table-title-wrap">
			<ul className={["table-title-kmyeb", className].join(' ')}>
			{
				titleNameList.filter(v => !v.notShow).map(item => {
					return (
						<Fragment>
							{
								item.childList ?
								<li className='overview-mxb-table-common-amount'>
									<div><span>{item.name}</span></div>
									<div>
										{
											item.childList.map(v => {
												return <span>{v.name}</span>
											})
										}
									</div>
								</li> :
								<li
									className={item.className}
									onClick={(e)=>{
										e.stopPropagation();
										if((item.name === '存货' || item.name === '往来' || item.name === '账户') && modalName == ''){
											const curSelectUuidName = getModal(item.name).selectUuidName
											const curChooseCardObj = getModal(item.name).chooseCardObj
											dispatch(projectMxbActions.changeFilterCardValue(curSelectUuidName,curChooseCardObj))
											dispatch(projectMxbActions.changeFilterCardValue('modalName',item.name))
										}
									}}
								>
									<span>
									{item.name}
									{

										item.name === '存货' && chooseStockCard.size ||
										item.name === '往来' && chooseContactCard.size ||
										item.name === '账户' && chooseAccountCard.size ?
										<XfIcon type='filter'/> :
										(
											item.name === '存货' && !chooseStockCard.size ||
											item.name === '往来' && !chooseContactCard.size ||
											item.name === '账户' && !chooseAccountCard.size ?
											<XfIcon  type='not-filter'/> : null
										)


									}
									</span>
									{
										item.name === '存货' || item.name === '往来' || item.name === '账户' ?
										<Fragment>
											<div
												className="common-modal-mask"
												style={{display: item.name === '账户' && modalName === '账户' || item.name === '项目' && modalName === '项目' || item.name === '存货' && modalName ===  '存货' ? 'block' : 'none'}}
												onClick={(e)=>{
													e.stopPropagation()
													const curSelectUuidName = getModal(modalName).selectUuidName
													dispatch(projectMxbActions.changeFilterCardValue('modalName',''))
													dispatch(projectMxbActions.changeFilterCardValue(curSelectUuidName,fromJS([])))
												}}
											></div>

												<div className={item.modalClassName}>
													<CommonModal
														modalStyle={{display: item.name === '账户' && modalName === '账户' || item.name === '往来' && modalName === '往来' || item.name === '存货' && modalName ===  '存货' ? 'block' : 'none'}}
														modalName={modalName}
														cardList={modalName === '账户' ? accountCardList : modalName === '往来' ? contactCardList :modalName === '存货' ? stockCardList : fromJS()}
														curSelectUuid={modalName === '账户' ? curSelectAccountUuid : modalName === '往来' ? curSelectContactUuid : modalName ===  '存货' ? curSelectStockUuid : fromJS([])}
														// chooseAccountCard={chooseAccountCard}
														dispatch={dispatch}
														cancel={() => {
															const curSelectUuidName = getModal(modalName).selectUuidName
															dispatch(projectMxbActions.changeFilterCardValue('modalName',''))
															dispatch(projectMxbActions.changeFilterCardValue(curSelectUuidName,fromJS([])))
														}}
														onOkCallback={(curSelectUuid) => {
															const curChooseCardName = getModal(modalName).chooseCardName
															dispatch(projectMxbActions.changeFilterCardValue(curChooseCardName,curSelectUuid))
															const filterCardObj = {
																showAccount,
																showStock,
																showCurrent,
																accountList: modalName === '账户' ? curSelectUuid : chooseAccountCard,
																currentList: modalName === '往来' ? curSelectUuid : chooseContactCard,
																stockList: modalName === '存货' ? curSelectUuid : chooseStockCard,
																analyse: analysisValue,
															}
															dispatch(projectMxbActions.getProjectMxbBalanceListFromChangeAnalysisValue(issuedate, endissuedate, currentCardItem, chooseDirection,filterCardObj))
														}}
														singleCheckBoxClick={(checked,uuid)=>{
															const curSelectUuidName = getModal(modalName).selectUuidName
															dispatch(projectMxbActions.changeItemCheckboxCheck(checked,uuid,curSelectUuidName))
														}}
														allCheckBoxClick={(checkedAll,allList)=>{
															const curSelectUuidName = getModal(modalName).selectUuidName
															dispatch(projectMxbActions.changeItemCheckboxCheckAll(checkedAll,allList,curSelectUuidName))
														}}
													/>
												</div>
										</Fragment> : null
									}
								</li>
							}

						</Fragment>

					)
				})
			}

			</ul>

			</div>
		)
	}
}
