import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import { Icon, Select, TreeSelect, Button, Checkbox, Input } from 'antd'
import { Amount, TableItem, RunCategorySelect } from 'app/components'
import { accountTreeData } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import PageSwitch from 'app/containers/components/PageSwitch'
import * as wlmxActions from 'app/redux/Mxb/WlMxb/wlMxb.action'
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
			curCardUuid,
			categoryUuid,
			isTop,
			typeUuid,
			cardCurPage,
			wlRelate,
			searchContent
		} = this.props
		const curUuid = curAccountUuid === '全部' ? '' : curAccountUuid
		const wlmxTitleWidth = wlRelate === '' || wlRelate === '3' ? '' : 'wlmxb-title'
		return (
            <div className={`title ${wlmxTitleWidth}`}>
				{isSpread || pageList.getIn(['Mxb','pageList']).size <= 1 ? '' :
					<PageSwitch
						pageItem={pageList.get('Mxb')}
						onClick={(page, name, key) => {
							if (pageList.getIn(['Mxb', 'pageList']).indexOf('往来明细表') === -1) {
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
						dispatch(wlmxActions.getPeriodDetailList(value,'',isTop,typeUuid,curCardUuid))
						dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'selectedCard'], ''))
						dispatch(wlmxActions.changeDetailAccountCommonString('',['flags', 'searchContent'],''))
                    }}
                    >
                    {issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                </Select>
				<span className="title-checkboxtext" onClick={() => {
					if (chooseperiods && endissuedate !== issuedate) {
					dispatch(wlmxActions.getPeriodDetailList(issuedate,'',isTop,typeUuid,curCardUuid))
					dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'selectedCard'], ''))
					}
					dispatch(wlmxActions.changeWlmxMorePeriods())
					}}>
					<Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
					<span>至</span>
				</span>
				<Select
					disabled={!chooseperiods}
					className="title-date"
					value={endissuedate === issuedate ? '' : endissuedate}
					onChange={(value) => {
						dispatch(wlmxActions.getPeriodDetailList(issuedate,value,isTop,typeUuid,curCardUuid))
						dispatch(wlmxActions.changeDetailAccountCommonString('', ['flags', 'selectedCard'], ''))
						dispatch(wlmxActions.changeDetailAccountCommonString('',['flags', 'searchContent'],''))
					}}
					>
					{nextperiods.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
				</Select>
				<span className="account-detail-margin">
					<span>摘要：</span>
					<Search
						value={searchContent}
						style={{width: 150}}
						className='lrls-search-tree'
						placeholder="根据摘要搜索流水"
						onSearch={(value) =>{
							dispatch(wlmxActions.reflashDetailList(issuedate,endissuedate,isTop,typeUuid,curCardUuid,categoryUuid,propertyCost,currentPage,cardCurPage,value ))
						}}
						onChange ={(e) => {
							dispatch(wlmxActions.changeDetailAccountCommonString('',['flags', 'searchContent'],e.target.value))
						}}
						/>

				</span>

				<Button
					type="ghost"
					className="title-right refresh-btn"
					onClick={() => {
						dispatch(wlmxActions.reflashDetailList(issuedate,endissuedate,isTop,typeUuid,curCardUuid,categoryUuid,propertyCost,currentPage,cardCurPage,searchContent ))
					}}
					>
					刷新
				</Button>
			</div>
		)
	}
}
