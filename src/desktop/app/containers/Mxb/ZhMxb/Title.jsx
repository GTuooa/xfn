import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import { Icon, Select, TreeSelect, Button, Checkbox, Input } from 'antd'
import { Amount, TableItem, RunCategorySelect } from 'app/components'
import { accountTreeData } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import PageSwitch from 'app/containers/components/PageSwitch'
import * as zhmxActions from 'app/redux/Mxb/ZhMxb/zhMxb.action'
import * as homeActions from 'app/redux/Home/home.action.js'
const Search = Input.Search

@immutableRenderDecorator
export default
class Title extends React.Component {

	render() {
		const {
			// treeData,
			categoryName,
			accountList,
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
			searchContent
		} = this.props
		const curUuid = curAccountUuid === '全部' ? '' : curAccountUuid

		return (
            <div className="title">
				{isSpread || pageList.getIn(['Mxb','pageList']).size <= 1 ? '' :
					<PageSwitch
						pageItem={pageList.get('Mxb')}
						onClick={(page, name, key) => {
							if (pageList.getIn(['Mxb', 'pageList']).indexOf('账户明细表') === -1) {
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
						// issuedate, main或count
						dispatch(zhmxActions.changeDetailAccountCommonString('',['flags', 'accountType'],'全部'))
						dispatch(zhmxActions.changeDetailAccountCommonString('',['flags', 'property'],'全部'))
						dispatch(zhmxActions.getDetailList('全部',value,1,curUuid,'',propertyCost))
						dispatch(zhmxActions.changeDetailAccountCommonString('',['flags', 'searchContent'],''))
                    }}
                    >
                    {issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                </Select>
				<span className="title-checkboxtext" onClick={() => {
					if (chooseperiods && endissuedate !== issuedate) {
						dispatch(zhmxActions.getDetailList(curCategory,issuedate,1,curUuid,'',propertyCost))
					}
					dispatch(zhmxActions.changeZhmxMorePeriods())
					}}>
					<Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
					<span>至</span>
				</span>
				<Select
					disabled={!chooseperiods}
					className="title-date"
					value={endissuedate === issuedate ? '' : endissuedate}
					onChange={(value) => {
						dispatch(zhmxActions.getDetailList(curCategory,issuedate,1,curUuid,value,propertyCost))
						dispatch(zhmxActions.changeDetailAccountCommonString('',['flags', 'searchContent'],''))
					}}
					>
					{nextperiods.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
				</Select>

				<span className="account-detail-margin">
					<span>账户：</span>
					<Select style={{width: 120}}
						// combobox
						value={accountName}
						onChange={value => value || dispatch(zhmxActions.getDetailList(curCategory,issuedate,currentPage,value,endissuedate,propertyCost))}
						onSelect={value => dispatch(zhmxActions.getDetailList(curCategory,issuedate,currentPage,value,endissuedate,propertyCost))}
						>
							<Option key='' value=''>全部</Option>
						{accountList.getIn([0, 'childList']).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
					</Select>
				</span>
				<span className="account-detail-margin cxls-search-margin">
					<span>摘要：</span>
					<Search
						value={searchContent}
						style={{width: 150}}
						className='lrls-search-tree'
						placeholder="根据摘要搜索流水"
						onSearch={(value) =>{
							dispatch(zhmxActions.getDetailList(curCategory,issuedate,currentPage,curUuid,endissuedate,propertyCost,value))
						}}
						onChange ={(e) => {
							dispatch(zhmxActions.changeDetailAccountCommonString('',['flags', 'searchContent'],e.target.value))
						}}
						/>


				</span>
				<Button
					type="ghost"
					className="title-right refresh-btn"
					onClick={() => {
						dispatch(zhmxActions.getDetailList(curCategory,issuedate,currentPage,curUuid,endissuedate,propertyCost,searchContent))
					}}
					>
					刷新
				</Button>
			</div>
		)
	}
}
