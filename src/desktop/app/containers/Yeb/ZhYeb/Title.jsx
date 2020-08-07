import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS } from 'immutable'

import { Icon, Select, TreeSelect, Button, Checkbox } from 'antd'
import { Amount, TableItem } from 'app/components'
import { accountTreeData } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import PageSwitch from 'app/containers/components/PageSwitch'

// import * as accountActions from 'app/actions/account.action'
import * as zhyeActions from 'app/redux/Yeb/ZhYeb/zhYeb.action'
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
			nextperiods
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
						dispatch(zhyeActions.getAccountBalanceList(value))
                    }}
                    >
                    {issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                </Select>
				<span className="title-checkboxtext" onClick={() => {
					if (chooseperiods && endissuedate !== issuedate) {
						dispatch(zhyeActions.getAccountBalanceList(issuedate))
					}
					dispatch(zhyeActions.changeZhyeMorePeriods())
					}}>
					<Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
					<span>至</span>
				</span>
				<Select
					disabled={!chooseperiods}
					className="title-date"
					value={endissuedate === issuedate ? '' : endissuedate}
					onChange={(value) => {
						dispatch(zhyeActions.getAccountBalanceList(issuedate,value))
					}}
					>
					{nextperiods.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
				</Select>


				<Button
					type="ghost"
					className="title-right refresh-btn"
					onClick={() => {
						dispatch(zhyeActions.getAccountBalanceList(issuedate,endissuedate))

						dispatch(allActions.freshYebPage('账户余额表'))
					}}
					>
					刷新
				</Button>
			</div>
		)
	}
}
