import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS, Map, List } from 'immutable'

import { Select, Icon, Menu, Pagination }  from 'antd'
import * as Limit from 'app/constants/Limit.js'
import { TableTree, XfnIcon } from 'app/components'
import { debounce } from 'app/utils'

import Trees from './Trees'
import CategorySelect from './CategorySelect'

import * as relativeMxbActions from 'app/redux/Mxb/RelativeMxb/relativeMxb.action.js'

@immutableRenderDecorator
export default
class TreeContain extends React.Component {

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
			relativeCategoryList,
			currentRelativeItem,
			currentCardItem,
			selectType,
			runningCategoryList,
			runningTypeList,
			currentRunningCategoryItem,
			currentRunningTypeItem,
		} = this.props
		const { showRunningType } = this.state

		return (
			<TableTree className="relative-mxb-tree-contain">
				<div className="relative-mxb-relative-category-select">
					<span className='relative-mxb-top-name'>往来类别：</span>
					<span className="relative-mxb-top-search-select-wrap">
						<span>
							<CategorySelect
								className="relative-mxb-top-search-select"
								categoryList={relativeCategoryList}
								currentRelativeItem={currentRelativeItem}
								onChange={(value,
									label) => {
									const valueList = value.split(Limit.TREE_JOIN_STR)

									const relativeItem = {
										uuid: valueList[0],
										name: label[0],
										top: valueList[1] === 'true',
										value: value,
									}

									dispatch(relativeMxbActions.getRelativeMxbBalanceListFromRelative(fromJS(relativeItem)))
								}}
							/>
						</span>
					</span>
				</div>
				<div className="relative-mxb-relative-search">
					<Select
						value={currentCardItem.get('uuid') ? `${currentCardItem.get('uuid')}${Limit.TREE_JOIN_STR}${currentCardItem.get('code')}${Limit.TREE_JOIN_STR}${currentCardItem.get('name')}` : '全部'}
						showSearch
						placeholder="搜索卡片"
						className="relative-mxb-relative-select"
						optionFilterProp="children"
						notFoundContent="无法找到相应卡片"
						onSelect={value =>  debounce(() => {

							const valueList = value.split(Limit.TREE_JOIN_STR)

							const cardItem = {
								uuid: valueList[0],
								code: valueList[1],
								name: valueList[2]
							}
							dispatch(relativeMxbActions.getRelativeMxbBalanceListFromCardItem(fromJS(cardItem)))
						})()}
						showArrow={false}
						>
						{(issuedate ? cardList : []).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{`${v.get('code')} ${v.get('name')}`}</Option>)}
					</Select>
					<Icon type="search" className="relative-mxb-relative-search-icon"/>
				</div>
				<div className={cardPages > 1 ? "relative-mxb-relative-card" : "relative-mxb-relative-no-pages"}>
					<div className="mxb-relative-card-content">
						<div className='relative-card-content-items'>
							<div
								className='relative-mxb-relative-card-box'
								onClick={() => {
									const cardItem = {
										uuid: '',
										code: '',
										name: '全部'
									}
									dispatch(relativeMxbActions.getRelativeMxbBalanceListFromCardItem(fromJS(cardItem)))
								}}
							>
								<span className={currentCardItem.get('uuid') === '' ? "relative-mxb-relative-card-item relative-mxb-relative-card-item-cur" : "relative-mxb-relative-card-item"}>全部</span>
							</div>
							{cardList && cardList.map((v, i) => {
								return (
									<div
										key={i}
										className='relative-mxb-relative-card-box'
										onClick={() => debounce(() => {
											const cardItem = {
												uuid: v.get('uuid'),
												code: v.get('code'),
												name: v.get('name')
											}
											dispatch(relativeMxbActions.getRelativeMxbBalanceListFromCardItem(fromJS(cardItem)))
										})()}
									>
										<span className={currentCardItem.get('uuid') === v.get('uuid') ? "relative-mxb-relative-card-item relative-mxb-relative-card-item-cur" : "relative-mxb-relative-card-item"}>{`${v.get('code')} ${v.get('name')}`}</span>
									</div>
								)
							})}

						</div>
					</div>
					{
						cardPages > 1 ?
						<div className='relative-card-pagination'>
						<Pagination
							simple
							current={cardPageNum}
							total={cardPages*10}
							onChange={(value) => {
								dispatch(relativeMxbActions.getRelativeMxbBalanceListFromChangeCardList(issuedate,endissuedate,currentRelativeItem,value ))
							}}
						/>
						</div>: ''

					}
				</div>
				<div className="relative-mxb-relative-category-select">
					<span
						className='relative-mxb-category-type'
						style={{display: showRunningType ? '' : 'none'}}
					>
						{selectType === 'category' ? `流水类别：${currentRunningCategoryItem.get('jrCategoryName') ? currentRunningCategoryItem.get('jrCategoryName') : '全部'} ` : `类型 `}
						{/* <Icon type="swap" /> */}
					</span>
					<span
						className="relative-mxb-hide-icon"
						onClick={() => {
							this.setState({showRunningType: false})
						}}
						style={{display: showRunningType ? '' : 'none'}}
					>
						<XfnIcon type="double-down"  className='relative-mxb-arrow-icon'/>
					</span>
					<span
						className="relative-mxb-show-icon"
						style={{display: showRunningType ? 'none' : ''}}
						onClick={() => {
							this.setState({showRunningType: true})
						}}
					>
						<span>流水类别：{currentRunningCategoryItem.get('jrCategoryName') ? currentRunningCategoryItem.get('jrCategoryName') : '全部'}</span>
						<span>
							<XfnIcon
								type="double-up"
								className='relative-mxb-arrow-icon'

							/>
						</span>
					</span>
				</div>
				<div style={{display: showRunningType ? '' : 'none'}} className="relative-mxb-relative-category">
					{
						selectType === 'category' ?
						<div className="relative-mxb-relative-tree">
							<Trees
								data={runningCategoryList}
								onSelect={info => {
									if (info.length === 0) {
										return
									}
									const valueList = info[0].split(Limit.TREE_JOIN_STR)
									const direction = valueList[2]
									const categoryItem = {
										jrCategoryUuid: valueList[0],
										jrCategoryName: valueList[1],
										direction: valueList[2]
									}
									dispatch(relativeMxbActions.getRelativeMxbBalanceListFromCategoryOrType('category', fromJS(categoryItem)))
									dispatch(relativeMxbActions.changeRelativeMxbReportDirection(direction,false))

								}}
								currentTreeSelectItem={currentRunningCategoryItem}
							/>
						</div> :
						<div className="relative-mxb-relative-type">
							{runningTypeList && runningTypeList.map((v, i) => {
								return (
									<div
										key={i}
										className={currentRunningTypeItem.get('jrTypeUuid') === v.get('jrTypeUuid') ? "relative-mxb-relative-type-item relative-mxb-relative-type-item-cur" : "relative-mxb-relative-type-item"}
										onClick={() => {
											const typeItem = {
												jrTypeUuid: v.get('jrTypeUuid'),
												jrTypeName: v.get('jrTypeName'),
												jrDirection: v.get('jrDirection')
											}
											dispatch(relativeMxbActions.getRelativeMxbBalanceListFromCategoryOrType('type', fromJS(typeItem)))
										}}
									>
										{`${v.get('jrTypeName')}`}
									</div>
								)
							})}
						</div>
					}
				</div>
			</TableTree>
		)
	}
}
