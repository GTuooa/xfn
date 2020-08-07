import React, { Fragment } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import XfIcon from 'app/components/Icon'
import { fromJS } from 'immutable'

import * as Limit from 'app/constants/Limit.js'
import CommonModal from '../MxbModal/CommonModal'
import CommonTreeModal from '../MxbModal/CommonTreeModal'

import * as relativeMxbActions from 'app/redux/Mxb/RelativeMxb/relativeMxb.action.js'

@immutableRenderDecorator
export default
class OverviewTitle extends React.Component{

	render() {

        const {
			dispatch,
			className,
			analysisType,
			showAccount,
			showProject,
			showStock,
			showJrCategory,
			openQuantity,
			isDebit,

			issuedate,
			endissuedate,
			currentCardItem,
			chooseDirection,
			chooseStockCard,
			chooseProjectCard,
			chooseAccountCard,
			chooseJrCategoryCard,
			projectCardList,
			stockCardList,
			accountCardList,
			jrCategoryList,
			curSelectAccountUuid,
			curSelectProjectUuid,
			curSelectStockUuid,
			curSelectJrCategoryUuid,
			modalName,
			needBranch,
			mergeStockBranch,
		} = this.props

		let titleNameList = []

		switch(analysisType){
			case 'HAPPEN':
				titleNameList = [
					{name:'日期'},
					{name:'流水号'},
					{name:'摘要',className: 'table-title-center'},
					{name:'流水类别',notShow: !showJrCategory,chooseJrCategoryCard,className: 'position-item',modalClassName:'position-item-modal'},
					{name:'项目',notShow: !showProject,chooseProjectCard,className: 'position-item',modalClassName:'position-item-modal'},
					{name:'存货',notShow: !showStock,chooseStockCard,className: 'position-item',modalClassName:'position-item-modal'},
					{name:'数量',notShow: !showStock || showStock && !openQuantity},
					{name:'收入发生额'},
					{name:'支出发生额'},
					{name:'方向'},
					{name: isDebit ? '收入净额' : '支出净额'}
				]
				break;
			case 'PAYMENT':
				titleNameList = [
					{name:'日期'},
					{name:'流水号'},
					{name:'摘要',className: 'table-title-center'},
					{name:'流水类别',notShow: !showJrCategory,chooseJrCategoryCard,className: 'position-item',modalClassName:'position-item-modal'},
					{name:'账户',notShow: !showAccount,chooseAccountCard,className: 'position-item',modalClassName:'position-item-modal'},
					{name:'收入实收额'}, {name:'支出实付额'},
					{name:'方向'},
					{name: isDebit ? '实收净额' : '实付净额'}
				]
				break;
			case 'RECEIVABLE':
				titleNameList = [
					{name:'日期'},
					{name:'流水号'},
					{name:'摘要',className: 'table-title-center'},
					{name:'项目',notShow: !showProject,chooseProjectCard,className: 'position-item',modalClassName:'position-item-modal'},
					{name:'本期新增',childList:[{name:'应收额'},{name:'应付额'}]},
					{name:'本期核销',childList:[{name:'应收核销额'},
					{name:'应付核销额'}]},
					{name:'方向'},
					{name: isDebit ? '应收余额' : '应付余额'}
				]
				break;
			case '':
			default:
				titleNameList = [
					{name:'日期'},
					{name:'流水号'},
					{name:'摘要',className: 'table-title-center'},
					{name:'流水类别',notShow: !showJrCategory,chooseJrCategoryCard,className: 'position-item',modalClassName:'position-item-modal'},
					{name:'发生额',childList:[{name:'收入发生额'},{name:'支出发生额'}]},
					{name:'收付额',childList:[{name:needBranch ? '收入实收额' : '收款额'},{name:needBranch ? '支出实付额' : '付款额'}]},
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
				case '项目' :
					selectUuidName = 'curSelectProjectUuid'
					chooseCardName = 'chooseProjectCard'
					chooseCardObj = chooseProjectCard
					break;
				case '存货' :
					selectUuidName = 'curSelectStockUuid'
					chooseCardName = 'chooseStockCard'
					chooseCardObj = chooseStockCard
					break;
				case '流水类别' :
					selectUuidName = 'curSelectJrCategoryUuid'
					chooseCardName = 'chooseJrCategoryCard'
					chooseCardObj = chooseJrCategoryCard
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
									<li className='overview-mxb-table-item-amount'>
										<div>
											<span>{item.name}</span>
										</div>
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
										onClick={()=>{
											if((item.name === '存货' || item.name === '项目' || item.name === '账户' || item.name === '流水类别') && modalName === ''){
												const curSelectUuidName = getModal(item.name).selectUuidName
												const curChooseCardObj = getModal(item.name).chooseCardObj
												dispatch(relativeMxbActions.changeFilterCardValue(curSelectUuidName,curChooseCardObj))
												dispatch(relativeMxbActions.changeFilterCardValue('modalName',item.name))

											}
										}}
									>
									<span>
									{item.name}
									{

										item.name === '存货' && chooseStockCard.size ||
										item.name === '项目' && chooseProjectCard.size ||
										item.name === '流水类别' && chooseJrCategoryCard.size ||
										item.name === '账户' && chooseAccountCard.size ?
										<XfIcon type='filter'/> :
										(
											item.name === '存货' && !chooseStockCard.size ||
											item.name === '项目' && !chooseProjectCard.size ||
											item.name === '流水类别' && !chooseJrCategoryCard.size ||
											item.name === '账户' && !chooseAccountCard.size ?
											<XfIcon  type='not-filter'/> : null
										)


									}
									</span>
									{
										item.name === '存货' || item.name === '项目' || item.name === '账户' || item.name === '流水类别' ?
										<Fragment>
										<div
											className="common-modal-mask"
											style={{display: item.name === '账户' && modalName === '账户' || item.name === '项目' && modalName === '项目' || item.name === '存货' && modalName ===  '存货' || item.name === '流水类别' && modalName ===  '流水类别' ? 'block' : 'none'}}
											onClick={(e)=>{
												e.stopPropagation()
												const curSelectUuidName = getModal(modalName).selectUuidName
												dispatch(relativeMxbActions.changeFilterCardValue('modalName',''))
												dispatch(relativeMxbActions.changeFilterCardValue(curSelectUuidName,fromJS([])))
											}}
										></div>
										<div className={item.modalClassName}>
											<CommonModal
												modalStyle={{display: item.name === '账户' && modalName === '账户' || item.name === '项目' && modalName === '项目' || item.name === '存货' && modalName ===  '存货' ? 'block' : 'none'}}
												modalName={modalName}
												cardList={modalName === '账户' ? accountCardList : modalName === '项目' ? projectCardList :modalName === '存货' ? stockCardList : modalName === '流水类别' ? jrCategoryList : fromJS()}
												curSelectUuid={modalName === '账户' ? curSelectAccountUuid : modalName === '项目' ? curSelectProjectUuid : modalName ===  '存货' ? curSelectStockUuid : modalName ===  '流水类别' ? curSelectJrCategoryUuid : fromJS([])}
												dispatch={dispatch}
												cancel={() => {
													const curSelectUuidName = getModal(modalName).selectUuidName
													dispatch(relativeMxbActions.changeFilterCardValue('modalName',''))
													dispatch(relativeMxbActions.changeFilterCardValue(curSelectUuidName,fromJS([])))
												}}
												onOkCallback={(curSelectUuid) => {
													const curChooseCardName = getModal(modalName).chooseCardName
													dispatch(relativeMxbActions.changeFilterCardValue(curChooseCardName,curSelectUuid))
													const filterCardObj = {
														showAccount,
														showStock,
														showProject,
														showJrCategory,
														accountList: modalName === '账户' ? curSelectUuid : chooseAccountCard,
														projectList: modalName === '项目' ? curSelectUuid : chooseProjectCard,
														stockList: modalName === '存货' ? curSelectUuid : chooseStockCard,
														jrCategoryList: chooseJrCategoryCard,
														analysisType,
													}
													dispatch(relativeMxbActions.getRelativeMxbBalanceListFromChangeAnalysisValue(issuedate, endissuedate, currentCardItem, chooseDirection,filterCardObj))
												}}
												singleCheckBoxClick={(checked,uuid)=>{
													const curSelectUuidName = getModal(modalName).selectUuidName
													dispatch(relativeMxbActions.changeItemCheckboxCheck(checked,uuid,curSelectUuidName))
												}}
												allCheckBoxClick={(checkedAll,allList)=>{
													const curSelectUuidName = getModal(modalName).selectUuidName
													dispatch(relativeMxbActions.changeItemCheckboxCheckAll(checkedAll,allList,curSelectUuidName))
												}}
											/>
											<CommonTreeModal
												modalStyle={{display: item.name === '流水类别' && modalName ===  '流水类别' ? 'block' : 'none'}}
												modalName={modalName}
												cardList={modalName === '流水类别' ? jrCategoryList : fromJS()}
												curSelectUuid={modalName ===  '流水类别' ? curSelectJrCategoryUuid : fromJS([])}
												dispatch={dispatch}
												cancel={() => {
													const curSelectUuidName = getModal(modalName).selectUuidName
													dispatch(relativeMxbActions.changeFilterCardValue('modalName',''))
													dispatch(relativeMxbActions.changeFilterCardValue(curSelectUuidName,fromJS([])))
												}}
												checkedKeys={curSelectJrCategoryUuid.toJS() || []}
												onCheck={(info,e,allUUidList)=>{
													const curSelectUuidName = getModal(modalName).selectUuidName
													const isChecked = e.checked
													const notAllList = info.filter(v => v !== 'all')
													if(isChecked){
														if(notAllList.length === allUUidList.length || !notAllList.length || e.node.props.title === '(全选)'){
															dispatch(relativeMxbActions.changeFilterCardValue(curSelectUuidName,fromJS(['all'].concat(allUUidList))))
														}else{
															dispatch(relativeMxbActions.changeFilterCardValue(curSelectUuidName,fromJS(notAllList)))
														}
													}else{
														if(notAllList.length === allUUidList.length){
															dispatch(relativeMxbActions.changeFilterCardValue(curSelectUuidName,fromJS([])))
														}else{
															dispatch(relativeMxbActions.changeFilterCardValue(curSelectUuidName,fromJS(notAllList)))
														}

													}


												}}
												onOkCallback={() => {
													const curChooseCardName = getModal(modalName).chooseCardName
													dispatch(relativeMxbActions.changeFilterCardValue(curChooseCardName,curSelectJrCategoryUuid))
													const filterCardObj = {
														showAccount,
														showStock,
														showProject,
														showJrCategory,
														needBranch,
														mergeStockBranch,
														accountList: chooseAccountCard,
														projectList: chooseProjectCard,
														stockList: chooseStockCard,
														jrCategoryList: curSelectJrCategoryUuid,
														analysisType,
													}
													dispatch(relativeMxbActions.getRelativeMxbBalanceListFromChangeAnalysisValue(issuedate, endissuedate, currentCardItem, chooseDirection,filterCardObj))
												}}
												allCheckBoxClick={(checkedAll,allList)=>{
													const curSelectUuidName = getModal(modalName).selectUuidName
													dispatch(relativeMxbActions.changeItemCheckboxCheckAll(checkedAll,allList,curSelectUuidName))
												}}
											/>
										</div>


										</Fragment>
										: null
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
