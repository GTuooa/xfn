import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import { Icon, Select, TreeSelect, Button, Checkbox, Input } from 'antd'
import { Amount, TableItem, RunCategorySelect } from 'app/components'
import { accountTreeData } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import PageSwitch from 'app/containers/components/PageSwitch'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as xmmxActions from 'app/redux/Mxb/XmMxb/xmMxb.action'
const Search = Input.Search
@immutableRenderDecorator
export default
class Title extends React.Component {

	render() {
		const {
			// treeData,
			categoryName,
			accountName,
			transferAccountName,
			currentPage,
			curCategory,
			PageTab,
			issuedate,
			endissuedate,
			nextperiods,
			paymentType,
			dispatch,
			newCard,
			issues,
			curAccountUuid,
			pageList,
			isSpread,
			chooseperiods,
			propertyCost,
			amountType,
			typeUuid,
			curCardUuid,
			isTop,
			categoryUuid,
			amountTypeName,
			pageNum,
			searchContent
		} = this.props
		const curUuid = curAccountUuid === '全部' ? '' : curAccountUuid
		const amountTypeList = fromJS([
			{
				value:'DETAIL_AMOUNT_TYPE_HAPPEN',
				name:'收支发生额'
			},
			{
				value:'DETAIL_AMOUNT_TYPE_BALANCE',
				name:'实收实付额'
			},
		])
		return (
            <div className="title">
				{isSpread || pageList.getIn(['Mxb','pageList']).size <= 1 ? '' :
					<PageSwitch
						pageItem={pageList.get('Mxb')}
						onClick={(page, name, key) => {
							if (pageList.getIn(['Mxb', 'pageList']).indexOf('项目明细表') === -1) {
								sessionStorage.setItem('previousPage', 'home')
							}
							dispatch(homeActions.addPageTabPane('MxbPanes', key, key, name))
							dispatch(homeActions.addHomeTabpane(page, key, name))
						}}
					/>
				}
                <Select
					className="title-date"
					value={issuedate}
					onChange={(value) => {
						dispatch(xmmxActions.getFirstProjectDetailList(value,endissuedate,currentPage,amountType))
						dispatch(xmmxActions.changeDetailXmmxCommonString('',['flags', 'searchContent'],''))
						dispatch(xmmxActions.changeDetailXmmxCommonString('', ['flags', 'xmType'], '全部'))
                    }}
                    >
                    {issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                </Select>
				<span className="title-checkboxtext" onClick={() => {
					dispatch(xmmxActions.changeDetailXmmxCommonString('',['flags','chooseperiods'],!chooseperiods))
					if (chooseperiods) {
						dispatch(xmmxActions.getFirstProjectDetailList(issuedate,'',currentPage,amountType,typeUuid,'',isTop))
					}
					}}>
					<Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
					<span>至</span>
				</span>
				<Select
					value={searchContent}
					disabled={!chooseperiods}
					className="title-date"
					value={endissuedate === issuedate ? '' : endissuedate}
					onChange={(value) => {
						dispatch(xmmxActions.getFirstProjectDetailList(issuedate,value,1,amountType,typeUuid,'',isTop))
						dispatch(xmmxActions.changeDetailXmmxCommonString('',['flags', 'searchContent'],''))
					}}
					>
					{nextperiods.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
				</Select>

				<span className="account-detail-margin">
					<Select style={{width: 120}}
						// combobox
						value={[amountTypeList.find(v => v.get('value') === amountType).get('name')]}
						onChange={value => {
							const valueList = value.split(Limit.TREE_JOIN_STR)
							dispatch(xmmxActions.getProjectDetailList(issuedate,endissuedate,pageNum,curCardUuid,valueList[0],categoryUuid,propertyCost))
						}}
						>
						{amountTypeList.map((v, i) => <Option key={i} value={`${v.get('value')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
					</Select>
				</span>
				<span className="account-detail-margin cxls-search-margin">
					<span>摘要：</span>
					<Search
						style={{width: 150}}
						className='lrls-search-tree'
						placeholder="根据摘要搜索流水"
						onSearch={(value) =>{
							dispatch(xmmxActions.getFirstProjectDetailList(issuedate, endissuedate,1,amountType,typeUuid,curCardUuid,isTop,categoryUuid,propertyCost,value))
						}}
						onChange ={(e) => {
							dispatch(xmmxActions.changeDetailXmmxCommonString('',['flags', 'searchContent'],e.target.value))
						}}
						/>

				</span>
				<Button
					type="ghost"
					className="title-right refresh-btn"
					onClick={() => {
						dispatch(xmmxActions.getFirstProjectDetailList(issuedate, endissuedate,1,amountType,typeUuid,curCardUuid,isTop,categoryUuid,propertyCost,searchContent))
					}}
					>
					刷新
				</Button>
			</div>
		)
	}
}
