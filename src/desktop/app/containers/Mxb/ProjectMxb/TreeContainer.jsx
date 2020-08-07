import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS, Map, List } from 'immutable'

import { Select, Icon, Menu, Pagination }  from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { TableTree, XfnIcon } from 'app/components'

import Trees from './Trees'
import CategorySelect from './CategorySelect'

import * as projectMxbActions from 'app/redux/Mxb/ProjectMxb/projectMxb.action.js'

@immutableRenderDecorator
export default
class TreeContainer extends React.Component {

	constructor() {
		super()
		this.state = {
			showRunningType: false,
		}
	}

	render() {

		const {
			dispatch,
			issuedate,
			endissuedate,
			cardList,
			cardPages,
			cardPageNum,
			projectCategoryList,
			currentProjectItem,
			currentCardItem,
			selectType,
			runningCategoryList,
			runningTypeList,
			currentRunningCategoryItem,
			currentRunningTypeItem,
			tableName,
		} = this.props
		const { showRunningType } = this.state
		return (
			<TableTree className="project-mxb-tree-contain">
				<div className="project-mxb-project-category-select">
					<span className='project-mxb-top-name'>项目类别：</span>
					<span className="project-mxb-top-search-select-wrap">
						<span>
							<CategorySelect
								className="project-mxb-top-search-select"
								categoryList={projectCategoryList}
								currentProjectItem={currentProjectItem}
								onChange={(value,
									label) => {
									const valueList = value.split(Limit.TREE_JOIN_STR)

									const projectItem = {
										uuid: valueList[0],
										name: label[0],
										top: valueList[1] === 'true',
										value: value,
									}
									if(tableName === 'Income'){
										dispatch(projectMxbActions.getProjectMxbBalanceListFromProject(fromJS(projectItem)))
									}else{
										dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromProject(fromJS(projectItem)))
									}

								}}
							/>
						</span>
					</span>
				</div>
				<div className="project-mxb-project-search">
					<Select
						value={currentCardItem.get('uuid') ? `${currentCardItem.get('name')}` : ''}
						showSearch
						placeholder="搜索卡片"
						className="project-mxb-project-select"
						optionFilterProp="children"
						notFoundContent="无法找到相应卡片"
						onSelect={value => {

							const valueList = value.split(Limit.TREE_JOIN_STR)

							const cardItem = {
								uuid: valueList[0],
								code: valueList[1],
								name: valueList[2]
							}
							if(tableName === 'Income'){
								dispatch(projectMxbActions.getProjectMxbBalanceListFromCardItem(fromJS(cardItem)))
							}else{
								dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromCardItem(fromJS(cardItem)))
							}

						}}
						showArrow={false}
						>
						{(issuedate ? cardList : []).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{`${v.get('name')}`}</Option>)}
					</Select>
					<Icon type="search" className="project-mxb-project-search-icon"/>
				</div>
				<div className={cardPages > 1 ? "project-mxb-project-card" : "project-mxb-project-no-pages"}>
					<div className="mxb-project-card-content">
						<div className="project-card-content-items">
							<div
								className='project-mxb-project-card-box'
								onClick={() => {
									const cardItem = {
										uuid: '',
										code: '',
										name: '全部'
									}
									if(tableName === 'Income'){
										dispatch(projectMxbActions.getProjectMxbBalanceListFromCardItem(fromJS(cardItem)))
									}else{
										dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromCardItem(fromJS(cardItem)))
									}
								}}
							>
								<span className={currentCardItem.get('uuid') === '' ? "project-mxb-project-card-item project-mxb-project-card-item-cur" : "project-mxb-project-card-item"}>全部</span>
							</div>
							{cardList && cardList.map((v, i) => {
								return (
									<div
										className='project-mxb-project-card-box'
										onClick={() => {
											const cardItem = {
												uuid: v.get('uuid'),
												code: v.get('code'),
												name: v.get('name')
											}
											if(tableName === 'Income'){
												dispatch(projectMxbActions.getProjectMxbBalanceListFromCardItem(fromJS(cardItem)))
											}else{
												dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromCardItem(fromJS(cardItem)))
											}
										}}
									>
										<span className={currentCardItem.get('uuid') === v.get('uuid') ? "project-mxb-project-card-item project-mxb-project-card-item-cur" : "project-mxb-project-card-item"}>{`${v.get('name')}`}</span>
									</div>
								)
							})}
						</div>

					</div>
					{
						cardPages > 1 ?
						<div className='project-card-pagination'>
						<Pagination
							simple
							current={cardPageNum}
							total={cardPages*10}
							onChange={(value) => {
								if(tableName === 'Income'){
									dispatch(projectMxbActions.getProjectMxbBalanceListFromChangeCardList(issuedate,endissuedate,currentProjectItem,value ))
								}else{
									dispatch(projectMxbActions.getProjectTypeMxbBalanceListFromChangeCardList(issuedate,endissuedate,currentProjectItem,value ))
								}
							}}
						/>
						</div>: ''

					}

				</div>
				<div className="project-mxb-project-category-select">
					<span
						className='project-mxb-category-type'
						style={{display: showRunningType ? '' : 'none'}}
					>
						{
							tableName === 'Income' ? `流水类别：${currentRunningCategoryItem.get('jrCategoryName') ? currentRunningCategoryItem.get('jrCategoryName') : '全部'} ` :
						`类型：${currentRunningTypeItem.get('typeName') ? currentRunningTypeItem.get('typeName') : '全部'}`
					}
						{/* <Icon type="swap" /> */}
					</span>
					<span
						className="project-mxb-hide-icon"
						onClick={() => {
							this.setState({showRunningType: false})
						}}
						style={{display: showRunningType ? '' : 'none'}}
					>
						<XfnIcon type="double-down"  className='project-mxb-arrow-icon'/>
					</span>
					<span className="project-mxb-show-icon" style={{display: showRunningType ? 'none' : ''}}>
						{
							tableName === 'Income' ?
							<span>流水类别：{currentRunningCategoryItem.get('jrCategoryName') ? currentRunningCategoryItem.get('jrCategoryName') : '全部'}</span> :
							<span>类型：{currentRunningTypeItem.get('typeName') ? currentRunningTypeItem.get('typeName') : '全部'}</span>
						}

						<span>
							<XfnIcon
								type="double-up"
								className='project-mxb-arrow-icon'
								onClick={() => {
									this.setState({showRunningType: true})
								}}
							/>
						</span>
					</span>
				</div>
				<div style={{display: showRunningType ? '' : 'none'}} className="project-mxb-project-category">
					{
						tableName === 'Income' ?
						<div className="project-mxb-project-tree">
							<Trees
								data={runningCategoryList}
								nameString={'jrCategoryName'}
								uuidString={'jrCategoryUuid'}
								completeName={'jrCategoryName'}
								onSelect={info => {
									if (info.length === 0) {
										return
									}
									const valueList = info[0].split(Limit.TREE_JOIN_STR)
									const direction = valueList[2]
									const categoryItem = {
										jrCategoryUuid: valueList[0],
										jrCategoryName: valueList[1],
										direction: valueList[2],
										completeName: valueList[3],
									}
									dispatch(projectMxbActions.getProjectMxbBalanceListFromCategory('Income', fromJS(categoryItem)))
									dispatch(projectMxbActions.changeProjectMxbReportDirection(direction))

								}}
								currentTreeSelectItem={currentRunningCategoryItem}
							/>
						</div> :
						<div className="project-mxb-project-tree">
							<Trees
								data={runningTypeList}
								nameString={'typeName'}
								uuidString={'jrJvTypeUuid'}
								completeName={'mergeName'}
								onSelect={info => {
									if (info.length === 0) {
										return
									}
									const valueList = info[0].split(Limit.TREE_JOIN_STR)
									const direction = valueList[2]
									const categoryItem = {
										jrJvTypeUuid: valueList[0],
										typeName: valueList[1],
										direction: valueList[2],
										mergeName: valueList[3],
									}
									dispatch(projectMxbActions.getProjectMxbBalanceListFromType('Type', fromJS(categoryItem)))
									dispatch(projectMxbActions.changeProjectMxbReportDirection(direction ? direction : 'double_credit'))

								}}
								currentTreeSelectItem={currentRunningTypeItem}
							/>
						</div>
					}
				</div>
			</TableTree>
		)
	}
}
