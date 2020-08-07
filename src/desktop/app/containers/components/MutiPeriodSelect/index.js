import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Select, Checkbox }	from 'antd'
import './style.less'

@immutableRenderDecorator
export default
class MutiPeriodSelect extends React.Component {

	render() {

		const { issuedate, endissuedate, issues, chooseperiods, changePeriodCallback, changeChooseperiodsStatu } = this.props

		const idx = issues ? issues.findIndex(v => v === issuedate) : 0
        const nextperiods = issues ? issues.slice(0, idx) : []

		return (
            <div>
                <Select
                    className="title-date"
                    value={issuedate}
                    onChange={(value) => changePeriodCallback(value, value)}
                >
                    {issues ? issues.map((data, i) => <Select.Option key={i} value={data}>{data}</Select.Option>) : ''}
                </Select>
                <span className="title-checkboxtext" onClick={() => {
                    if (chooseperiods && endissuedate !== issuedate) {
                        changePeriodCallback(issuedate, issuedate)
                    }
					changeChooseperiodsStatu()
                }}>
                    <Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
                    <span>至</span>
                </span>
                <Select
                    disabled={!chooseperiods}
                    className="title-date"
                    value={endissuedate === issuedate ? '' : endissuedate}
                    onChange={(value) => changePeriodCallback(issuedate, value)}
                >
                    {nextperiods.map((data, i) => <Select.Option key={i} value={data}>{data}</Select.Option>)}
                </Select>
            </div>
		)
	}
}
