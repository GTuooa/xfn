import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import Trees from './Trees.jsx'
import { Select, Menu, Input, Collapse, Tree, Pagination }  from 'antd'
import { Icon } from 'app/components'
const TreeNode = Tree.TreeNode
import { TableTree } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
const Panel = Collapse.Panel;
// import * as lrAccountActions from 'app/actions/lrAccount.action'
import * as wlmxActions from 'app/redux/Mxb/WlMxb/wlMxb.action'
import SelectType from './SelectType'
import RunningSelectType from './RunningSelectType'
const Search = Input.Search
import XfnIcon from 'app/components/Icon'

@immutableRenderDecorator
export default
class TreeContains extends React.Component {
	constructor() {
		super()
		this.state = {
			showRunningType: false,
			showDimensionSearch: false,
			searchValue:''
		}
	}
	onChange= (value,dataList,category) =>{

	}
	render() {
		const {
			dispatch,
			curCategory,
			curAccountUuid,
			issuedate,
			main,
			currentPage,
			pageCount,
			flags,
			hideCategoryList,
			disabledChangeCategory,
			defaultCategory,
			accountType,
			paymentType,
			endissuedate,
			cardList,
			curCardUuid,
			contactTypeTree,
			runningCategory,
			categoryUuid,
			propertyCost,
			categoryName,
			wlType,
			cardPages,
			cardCurPage,
			searchContent
		} = this.props
		const { showRunningType, showDimensionSearch,searchValue } = this.state

		const selectedKeys = curCategory
		const isTop = flags.get('isTop')
		const typeUuid = flags.get('typeUuid')
		const selectedCard = flags.get('selectedCard')

		const contactsTypeClass = showRunningType ? 'group-item-first-50' : 'group-item-first-100'
		return (
			<TableTree>
				<div className="tree-group">
					<div className={`tree-group-first-item ${contactsTypeClass}`}>
						<span className="tree-group-item-title wl-title-tree-right">
							<span className='wl-type-title'>往来类别：</span>
							<div className="wl-type-box">
								<SelectType
									treeData={contactTypeTree}
									value={wlType}
									placeholder=""
									parentDisabled={false}
									onChange={(value) => {
										const valueList = value.split(Limit.TREE_JOIN_STR)
										dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'wlType'], valueList[1]))
										dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'typeUuid'], valueList[0]))
										dispatch(wlmxActions.changeDetailAccountCommonString('',['flags', 'isTop'],valueList[2]))
										dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'selectedCard'], ''))
										dispatch(wlmxActions.getContactsCardList(issuedate, endissuedate, valueList[2], valueList[0]))
									}}
								/>
							</div>
						</span>
						<div className="tree-group-item-content">
							<div className="tree-title-handle">
								<Select
									value={selectedCard}
									showSearch
									placeholder="搜索卡片"
									className="table-right-table-input"
									optionFilterProp="children"
									notFoundContent="无法找到相应卡片"
									onSelect={value => {
										// clearInput()
										const valueList = value.split(Limit.TREE_JOIN_STR)
										dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'curCardUuid'], valueList[0]))
										dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'categoryName'], '全部'))
										dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'selectedCard'], valueList[1]+' '+valueList[2]))
										dispatch(wlmxActions.getDetailList(issuedate, endissuedate,valueList[0],'',propertyCost,1,'true',searchContent))
										dispatch(wlmxActions.getContactsRunningCategory(issuedate, endissuedate,valueList[0]))
									}}
									showArrow={false}
									>
									{(issuedate ? cardList : []).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{`${v.get('code')} ${v.get('name')}`}</Option>)}
								</Select>
								<Icon type="search" className="table-right-table-input-search"/>
								{/* <Search className='lrls-search-tree' placeholder="搜索"  onSearch={(value) =>this.setState({searchValue: value})}/> */}
							</div>
							<div className="item-content-box">
								<div className="item-content-list"
									style={{height:cardPages > 1?'calc(100%-25px)':'100%'}}
									>
									<Tree
										onSelect={value => {
											if (value[0]) {
												dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'curCardUuid'], value[0]))
												dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'categoryName'], '全部'))
												dispatch(wlmxActions.getDetailList(issuedate, endissuedate,value[0],'',propertyCost,1,'true',searchContent))
												dispatch(wlmxActions.getContactsRunningCategory(issuedate, endissuedate,value[0]))
											}
										}}
										selectedKeys={[curCardUuid]}
										>
											{
												cardList && cardList.size ? cardList.map(item => {
													if(item.get('code').indexOf(searchValue) || item.get('name').indexOf(searchValue)){
														return <TreeNode key={item.get('uuid')} title={<span style={{color: '#f50'}}>{item.get('code')} {item.get('name')}</span>}></TreeNode>
													}else{
														return <TreeNode key={item.get('uuid')} title={<span>{item.get('code')} {item.get('name')}</span>}></TreeNode>
													}
												}) : null
											}

									</Tree>
								</div>
								{
									cardPages > 1 ?
									<div className='wlmx-card-pagination'>
										<Pagination
											simple
											defaultCurrent={cardCurPage}
											total={cardPages*10}
											onChange={(value) => {
												dispatch(wlmxActions.getContactsCardList(issuedate, endissuedate, isTop,typeUuid,'',value))
											}}
										/>
									</div> : ''

								}
							</div>




						</div>
					</div>
					{
						showDimensionSearch ?
						<div>
							<div className="tree-group-second-item">
								<span className="tree-group-item-title wl-title-tree-right">
									<span className='wl-type-title'>流水类别：</span>
									<div className="wl-type-box">
										<RunningSelectType
											treeData={runningCategory}
											value={'全部'}
											placeholder=""
											parentDisabled={false}
											onChange={(value,) => {
												dispatch()
											}}
										/>
									</div>
								</span>
							</div>
							<div className="tree-group-second-item">
								<span className="tree-group-item-title wl-title-tree-right">
									<span className='wl-type-title'>查看维度：</span>
									<div className="wl-type-box">
										<SelectType
											treeData={''}
											value={'全部'}
											placeholder=""
											parentDisabled={false}
											onChange={(value,label,extra) => {
											}}
										/>
									</div>
									<button className='wl-type-close' onClick={() => this.setState({showDimensionSearch: !showDimensionSearch})}>关闭</button>
								</span>
								<div className="table-right-tree" >
									<Trees
										flags={flags}
										category={runningCategory}
										selectedKeys={[selectedKeys]}
										dispatch={dispatch}
										onSelect={value => {
											if(value[0]){
												const valueList = value[0].split(Limit.TREE_JOIN_STR)
												dispatch(wlmxActions.getDetailList(issuedate,endissuedate,curCardUuid,valueList[0],valueList[2], 1,'true',searchContent))
												dispatch(wlmxActions.changeDetailAccountCommonString('',['flags', 'propertyCost'],valueList[2]))
												dispatch(wlmxActions.changeDetailAccountCommonString('',['flags', 'categoryUuid'],valueList[0]))
												dispatch(wlmxActions.changeDetailAccountCommonString('',['flags', 'categoryName'],valueList[1]))
											}
										}}
									/>
								</div>
							</div>
						</div>  :
						showRunningType ?
						<div className="wlmx-tree-running-type">
							<div className="tree-group-second-item">
								<span className="tree-group-item-title wl-title-tree-right">
									<span className='wl-type-title'>流水类别：</span>
									<div className="wl-type-box">
										{categoryName}
									</div>

									<XfnIcon type="double-down"  className='wl-type-close' onClick={() => {
										this.setState({showRunningType: !showRunningType})
										// dispatch(wlmxActions.getDetailList(issuedate,endissuedate,curCardUuid,'','', 1,))
										// dispatch(wlmxActions.changeDetailAccountCommonString('',['flags', 'categoryName'],'全部'))
									}}/>
									{/* <button className='wl-type-close' >关闭</button> */}
								</span>
								<div className="wlmx-tree-running-box">
									<div className="wlmx-tree-running-content">
										<Trees
											flags={flags}
											category={runningCategory}
											selectedKeys={[selectedKeys]}
											dispatch={dispatch}
											onSelect={value => {
												if(value[0]){
													const valueList = value[0].split(Limit.TREE_JOIN_STR)
													dispatch(wlmxActions.getDetailList(issuedate,endissuedate,curCardUuid,valueList[0],valueList[2], 1,'true',searchContent))
													dispatch(wlmxActions.changeDetailAccountCommonString('',['flags', 'propertyCost'],valueList[2]))
													dispatch(wlmxActions.changeDetailAccountCommonString('',['flags', 'categoryUuid'],valueList[0]))
													dispatch(wlmxActions.changeDetailAccountCommonString('',['flags', 'categoryName'],valueList[1]))
											}}}
										/>
									</div>
								</div>

							</div>
							{/* 多维度暂时不做 */}
							{/* <div className="tree-group-second-item item-btn" onClick={() => this.setState({showDimensionSearch: !showDimensionSearch})}>
								<span className="tree-group-item-title wl-title-tree-right">
									<span className='wl-type-only-title'>多维查询</span>
								</span>
							</div> */}
						</div> :
						<div className="tree-group-second-item item-btn" onClick={() => this.setState({showRunningType: !showRunningType})}>
							<span className="tree-group-item-title tree-group-item-title-static wl-title-tree-right">
								<span className='wl-type-title'>流水类别：</span> <span className="wl-type-box">{categoryName}</span>
								<XfnIcon type="double-up" className="running-type-up-icon" />
							</span>
						</div>
					}
				</div>

			</TableTree>
		)
	}
}
