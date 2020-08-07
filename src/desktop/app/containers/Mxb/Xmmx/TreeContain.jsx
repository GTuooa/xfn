import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import Trees from './Trees.jsx'
import { Select, Icon, Menu, Input, Collapse, Tree, Pagination }  from 'antd'
const TreeNode = Tree.TreeNode
import { TableTree } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
const Panel = Collapse.Panel;
// import * as lrAccountActions from 'app/actions/lrAccount.action'
import * as xmmxActions from 'app/redux/Mxb/XmMxb/xmMxb.action'
import SelectType from './SelectType'
import RunningSelectType from './RunningSelectType'
const Search = Input.Search
import XfnIcon from 'app/components/Icon'
@immutableRenderDecorator
export default
class TreeContain extends React.Component {
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
			cardCurPage,
			xmmxState,
			searchContent
		} = this.props
		const { showDimensionSearch,searchValue } = this.state
		const projectTypeTree = xmmxState.getIn(['flags','projectTypeTree'])
		const xmType = xmmxState.getIn(['flags','xmType'])
		const cardList = xmmxState.getIn(['flags','cardList'])
		const showRunningType = xmmxState.getIn(['flags','showRunningType'])
		const amountType = xmmxState.getIn(['flags','amountType'])
		const runningCategory = xmmxState.getIn(['flags','runningCategory'])
		const curCardUuid = xmmxState.getIn(['flags','curCardUuid'])
		const categoryUuid = xmmxState.getIn(['flags','categoryUuid'])
		const categoryName = xmmxState.getIn(['flags','categoryName'])
		const propertyCost = xmmxState.getIn(['flags','propertyCost'])
		const cardPageNum = xmmxState.getIn(['flags','cardPageNum'])
		const cardPages = xmmxState.getIn(['flags','cardPages'])
		const pages = xmmxState.getIn(['flags','pages'])
		const selectedCard = xmmxState.getIn(['flags','selectedCard'])
		const selectedKeys = `${categoryUuid}${Limit.TREE_JOIN_STR}${categoryName}${Limit.TREE_JOIN_STR}${propertyCost}`
		const isTop = flags.get('isTop')
		const typeUuid = flags.get('typeUuid')
		const contactsTypeClass = showRunningType ? 'group-item-first-50' : 'group-item-first-100'
		return (
			<TableTree>
				<div className="tree-group">
					<div className={`tree-group-first-item ${contactsTypeClass}`}>
						<span className="tree-group-item-title xm-title-tree-right">
							<span className='xm-type-title'>项目类别：</span>
							<div className="xm-type-box">
								<SelectType
									treeData={projectTypeTree}
									value={xmType}
									placeholder=""
									parentDisabled={false}
									onChange={(value) => {
										const valueList = value.split(Limit.TREE_JOIN_STR)
										dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'xmType'], valueList[1]))
										dispatch(xmmxActions.getProjectDetailCardList(issuedate, endissuedate,amountType,valueList[0],valueList[2],1,1,searchContent))
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
										const valueList = value.split(Limit.TREE_JOIN_STR)
										dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'curCardUuid'], value[0]))
										dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'categoryName'], '全部'))
										dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'selectedCard'], valueList[1]+' '+valueList[2]))
										dispatch(xmmxActions.getProjectDetailList(issuedate,endissuedate,1,valueList[0],amountType,'','',searchContent))
									}}
									showArrow={false}
									>
									{(issuedate ? cardList : []).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{`${v.get('code')} ${v.get('name')}`}</Option>)}
								</Select>
								<Icon type="search" className="table-right-table-input-search"/>
							</div>
							<div className="item-content-list">
							<div className="item-content-box"
								style={{height:cardPages > 1?'calc(100%-25px)':'100%'}}
								>
								<Tree
					                onSelect={value => {
					                    if (value[0]) {
					                        dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'curCardUuid'], value[0]))
					                        dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'categoryName'], '全部'))
									        dispatch(xmmxActions.getProjectDetailList(issuedate,endissuedate,1,value[0],amountType,'','',searchContent))
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

					                        })
					                        :
					                        null
					                    }
								</Tree>
								</div>
								{
									cardPages > 1 ?
									<div className='xmmx-card-pagination'>
									<Pagination
										simple
										current={cardPageNum}
										total={cardPages*10}
										onChange={(value) => {
											dispatch(xmmxActions.getProjectDetailCardList(issuedate, endissuedate,amountType,typeUuid,isTop,value,1,searchContent))
										}}
									/>
									</div>: ''

								}

							</div>

						</div>
					</div>
					{
						showDimensionSearch ?
						<div>
							<div className="tree-group-second-item">
								<span className="tree-group-item-title xm-title-tree-right">
									<span className='xm-type-title'>流水类别：</span>
									<div className="xm-type-box">
										<RunningSelectType
											treeData={runningCategory}
											value={'全部'}
											placeholder=""
											parentDisabled={false}
											onChange={(value) => {
												console.log(value);
												// dispatch(xmmxActions.getProjectDetailList(issuedate,endissuedate,curCardUuid,amountType,false,))
											}}
										/>
									</div>
								</span>
							</div>
							<div className="tree-group-second-item">
								<span className="tree-group-item-title xm-title-tree-right">
									<span className='xm-type-title'>查看维度：</span>
									<div className="xm-type-box">
										<SelectType
											treeData={staticData}
											value={'全部'}
											placeholder=""
											parentDisabled={false}
											onChange={(value,label,extra) => {
											}}
										/>
									</div>
									<XfnIcon
										type='double-down'
										className='xm-type-close'
										onClick={() => this.setState({showDimensionSearch: !showDimensionSearch})}
									/>
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
												dispatch(xmmxActions.getDetailList(issuedate,endissuedate,curCardUuid,valueList[0],valueList[2], 1,))
												dispatch(xmmxActions.changeDetailXmmxCommonString('',['flags', 'propertyCost'],valueList[2]))
												dispatch(xmmxActions.changeDetailXmmxCommonString('',['flags', 'categoryUuid'],valueList[0]))
												dispatch(xmmxActions.changeDetailXmmxCommonString('',['flags', 'categoryName'],valueList[1]))
											}
										}}
									/>
								</div>
							</div>
						</div>  :
						showRunningType ?
						<div  className='tree-group-second'>
							<div className="tree-group-second-item">
								<span className="tree-group-item-title xm-title-tree-right">
									<span className='xm-type-title'>流水类别：</span>
									<div className="xm-type-box">
										{categoryName?categoryName:'全部'}
									</div>
									<button className='xm-type-close' onClick={() => {
										// dispatch(xmmxActions.getProjectDetailList(issuedate,endissuedate,1,curCardUuid,amountType))
										// dispatch(xmmxActions.changeDetailXmmxCommonString('',['flags', 'categoryName'],'全部'))
										dispatch(xmmxActions.changeDetailXmmxCommonString('',['flags', 'showRunningType'],false))
									}}><XfnIcon type='double-down'/></button>
								</span>
								<div className='xmmx-tree-content'>
									<Trees
										flags={flags}
										category={runningCategory}
										selectedKeys={[selectedKeys]}
										dispatch={dispatch}
										onSelect={value => {
											if(value[0]){
												const valueList = value[0].split(Limit.TREE_JOIN_STR)
												dispatch(xmmxActions.getProjectDetailList(issuedate,endissuedate,1,curCardUuid,amountType,valueList[0],valueList[2],searchContent))
												dispatch(xmmxActions.changeDetailXmmxCommonString('',['flags', 'propertyCost'],valueList[2]))
												dispatch(xmmxActions.changeDetailXmmxCommonString('',['flags', 'categoryUuid'],valueList[0]))
												dispatch(xmmxActions.changeDetailXmmxCommonString('',['flags', 'categoryName'],valueList[1]))
										}}}
									/>
								</div>
							</div>
							{/* 多维度暂时不做 */}
							{/* <div className="tree-group-second-item item-btn" onClick={() => this.setState({showDimensionSearch: !showDimensionSearch})}>
								<span className="tree-group-item-title xm-title-tree-right">
									<span className='xm-type-only-title'>多维查询</span>
								</span>
							</div> */}
						</div> :
						<div className="tree-group-second-item item-btn" onClick={() => dispatch(xmmxActions.changeDetailXmmxCommonString('',['flags', 'showRunningType'],true))}>
							<span className="tree-group-item-title-bottom xm-title-tree-right">
								<span className='xm-type-title'>流水类别：</span> <span className="xm-type-box">{categoryName?categoryName:'全部'}</span>
								<XfnIcon type="double-up" className="running-type-up-icon" />
							</span>
						</div>
					}
				</div>

			</TableTree>
		)
	}
}
