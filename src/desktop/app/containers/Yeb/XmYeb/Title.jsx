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
import * as xmyeActions from 'app/redux/Yeb/XmYeb/xmYeb.action'
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
			xmType,
			runningType,
			isTop,
			currentPage,
			categoryList,
			projectCategoryList,
			runningCategoryUuid,
			categoryUuid,
			propertyCost
		} = this.props
		return (
            <div className="title">
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
						dispatch(xmyeActions.getFirstProjectList(value))
                    }}
                    >
                    {issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                </Select>
				<span className="title-checkboxtext" onClick={() => {
					if (!chooseperiods) {
						dispatch(xmyeActions.changeXmYeInnerCommonString(['flags','endissuedate'],''))
					} else {
						dispatch(xmyeActions.getProjectBalanceList(issuedate))
					}
						dispatch(xmyeActions.changeXmYeInnerCommonString(['flags','chooseperiods'],!chooseperiods))
					}}>
					<Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
					<span>至</span>
				</span>
				<Select
					disabled={!chooseperiods}
					className="title-date"
					value={endissuedate === issuedate ? '' : endissuedate}
					onChange={(value) => {
						dispatch(xmyeActions.getFirstProjectList(issuedate,value))
					}}
					>
					{nextperiods.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
				</Select>
				<span className="xm-title-margin-right">
					<span>项目类别：</span>
					<div className="xm-type-box">
						<SelectType
							needAll={false}
							treeData={projectCategoryList.toJS()}
							value={xmType}
							placeholder=""
							treeDefaultExpandAll={true}
							parentDisabled={false}
							onChange={(value) => {
								const valueList = value.split(Limit.TREE_JOIN_STR)
								dispatch(xmyeActions.changeXmYeInnerCommonString(['flags','xmType'],valueList[1]))
								dispatch(xmyeActions.changeXmYeInnerCommonString(['flags','runningType'],'全部'))
								dispatch(xmyeActions.getProjectBalanceList(issuedate,endissuedate,1,valueList[2],valueList[0],''))
								dispatch(xmyeActions.getProjectCategoryList(issuedate,endissuedate,valueList[0],valueList[2]))
							}}
						/>
					</div>
				</span>
				<span className="xm-title-margin-right">
					<span>流水类别：</span>
					<div className="xm-type-box">
						<SelectType
							needAll={true}
							treeDefaultExpandAll={false}
							treeData={categoryList.toJS()}
							value={runningType}
							placeholder=""
							parentDisabled={false}
							onChange={(value) => {
								const valueList = value.split(Limit.TREE_JOIN_STR)
								dispatch(xmyeActions.changeXmYeInnerCommonString(['flags','runningType'],valueList[1]))
								dispatch(xmyeActions.getProjectBalanceList(issuedate,endissuedate,1,isTop,categoryUuid,valueList[0],valueList[3]))
							}}
						/>
					</div>
				</span>
				<Button
					type="ghost"
					className="title-right refresh-btn"
					onClick={() => {
						dispatch(xmyeActions.getProjectBalanceList(issuedate,endissuedate,currentPage,isTop,categoryUuid,runningCategoryUuid,propertyCost))
						dispatch(xmyeActions.getProjectDetailRunningCategoryList(issuedate,endissuedate))
						dispatch(xmyeActions.getProjectCategoryList(issuedate,endissuedate,categoryUuid,isTop))

						dispatch(allActions.freshYebPage('项目余额表'))
					}}
					>
					刷新
				</Button>
			</div>
		)
	}
}
