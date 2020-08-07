import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import { Icon, Select, TreeSelect, Button, Checkbox } from 'antd'
import { Amount, TableItem } from 'app/components'
import { accountTreeData } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import PageSwitch from 'app/containers/components/PageSwitch'
import SelectType from './SelectType'

// import * as accountActions from 'app/actions/account.action'
import * as wlyeActions from 'app/redux/Yeb/WlYeb/wlYeb.action'
import * as homeActions from 'app/redux/Home/home.action.js'
import * as allActions from 'app/redux/Home/All/all.action'


@immutableRenderDecorator
export default
class Title extends React.Component {

	render() {
		const {
			issuedate,
			endissuedate,
			dispatch,
			issues,
			isSpread,
			pageList,
			chooseperiods,
			nextperiods,
			wlRelate,
			wlType,
			typeUuid,
			wlRelationship,
			contactTypeTree,
			isTop,
			currentPage,
			wlOnlyRelate
		} = this.props

		const wlRelationshipStr = ({
			'': () => '全部',
			'1': () => '仅付款单位',
			'2': () => '仅收款单位',
			'3': () => '收款兼付款单位'
		}[wlRelate])()
		const mxbStyle = typeUuid === '' && (wlRelate == '1' || wlRelate == '2' ) || wlOnlyRelate == '1' || wlOnlyRelate == '2' ? 'mxb-table-left-small-title' : 'mxb-table-left-title'
		return (
            <div className={`title ${mxbStyle}`}>
				{isSpread || pageList.getIn(['Yeb','pageList']).size <= 1 ? '' :
					<PageSwitch
						pageItem={pageList.get('Yeb')}
						onClick={(page, name, key) => {
							dispatch(homeActions.addPageTabPane('YebPanes', key, key, name))
							dispatch(homeActions.addHomeTabpane(page, key, name))
						}}
					/>
				}
                <Select
					className="title-date title-date-margin-right"
					value={issuedate}
					onChange={(value) => {
						// issuedate, main或count
						dispatch(wlyeActions.getContactsBalanceList(value))
                    }}
                    >
                    {issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                </Select>
				<span className="title-checkboxtext" onClick={() => {
					if (chooseperiods && endissuedate !== issuedate) {
						dispatch(wlyeActions.getContactsBalanceList(issuedate))
					}
					dispatch(wlyeActions.changeWlyeMorePeriods())
					}}>
					<Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
					<span>至</span>
				</span>
				<Select
					disabled={!chooseperiods}
					className="title-date title-date-end"
					value={endissuedate === issuedate ? '' : endissuedate}
					onChange={(value) => {
						dispatch(wlyeActions.getContactsBalanceList(issuedate,value))
					}}
					>
					{nextperiods.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
				</Select>
				<span className="wl-title-margin-right">
					<span>往来类别：</span>
					<div className="wl-type-box">
						<SelectType
							treeData={contactTypeTree}
							value={wlType}
							placeholder=""
							parentDisabled={false}
							onChange={(value) => {
								const valueList = value.split(Limit.TREE_JOIN_STR)
								dispatch(wlyeActions.getContactsBalanceList(issuedate,endissuedate,valueList[2],valueList[0],valueList[1],'',1))
							}}
						/>
					</div>
				</span>
				{
					wlRelationship && wlRelationship.size > 2 ?
					<span className="wl-title-margin-right">
						<span>往来关系：</span>
						<div className="wl-type-box">
							<Select
									value={wlRelationshipStr}
									onChange={(value) => {
										dispatch(wlyeActions.getContactsBalanceList(issuedate,endissuedate,isTop,typeUuid,wlType,value,1))
									}}>

							{wlRelationship.map((v, i) => <Option key={v.get('name')} value={v.get('relation')}>{v.get('name')}</Option>)}
							</Select>
						</div>
					</span> : ''
				}



				<Button
					type="ghost"
					className="title-right refresh-btn"
					onClick={() => {
						dispatch(wlyeActions.getContactsBalanceList(issuedate,endissuedate,isTop,typeUuid,wlType,wlRelate,currentPage))

						dispatch(allActions.freshYebPage('往来余额表'))
					}}
					>
					刷新
				</Button>
			</div>
		)
	}
}
