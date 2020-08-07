import React from 'react'
import moment from 'moment'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Select, Checkbox, DatePicker, Icon, message,Input }	from 'antd'
import { XfnIcon } from 'app/components'
import { debounce } from 'app/utils'
const { RangePicker } = DatePicker
const { Option } = Select
const InputGroup = Input.Group
import './style.less'

@immutableRenderDecorator
export default
class MutiPeriodMoreSelect extends React.Component {

	render() {

		const { issuedate, endissuedate,beginMonth, endMonth, issues, changePeriodCallback,chooseValue, changeChooseperiodsStatu } = this.props
		// const { mode, value } = this.state

		const idx = issues ? issues.findIndex(v => v === issuedate || `${v.substr(0,4)}-${v.substr(6,2)}` === issuedate) : 0
        const nextperiods = issues ? issues.slice(0, idx) : []

		const getMonthYear = (year,month,isBegin) => {
			let openedyear = '', openedmonth = ''
			if(isBegin){
				if (month == 1) {
					openedmonth = 12
					openedyear = Number(year) - 1
				} else {
					openedmonth = Number(month) - 1
					openedyear = Number(year)
				}
			}else{
				openedmonth = Number(month)
				openedyear = Number(year)
			}
			return {openedyear,openedmonth}
		}

		const endissuedateValue = endissuedate ? endissuedate : issuedate


		const endDate = issues.get(0)
		const startDate = issues.get(issues.size-1)
		let  disabledBeginDate = '', disabledEndDate=''
		if(issues.size){
			const disabledBeginYear = getMonthYear(startDate.substr(0,4), startDate.substr(6,2),true).openedyear
			const disabledBeginMonth = getMonthYear(startDate.substr(0,4), startDate.substr(6,2),true).openedmonth
			const disabledEndYear = getMonthYear(endDate.substr(0,4), endDate.substr(6,2)).openedyear
			const disabledEndMonth = getMonthYear(endDate.substr(0,4), endDate.substr(6,2)).openedmonth
			disabledBeginDate  = new Date(disabledBeginYear,disabledBeginMonth, 1)
			disabledEndDate  =  new Date(disabledEndYear, disabledEndMonth, 1)
		}


		const disabledDate = function (current) {
			return current && ((moment(disabledBeginDate) > current) ||  !(moment(disabledEndDate) > current))
		}

		const monthFormat = 'YYYY-MM'
		const dateFormat = 'YYYY-MM-DD'

		let chooseSelect = []
		switch (chooseValue) {
			case 'MONTH':
				chooseSelect.push(
					<span className='muti-period-more-select'>
						<Select
							className="title-more-choose-date"
							value={issuedate ? issuedate.substr(4,1) ==='-' ? `${issuedate.substr(0,4)}年第${issuedate.substr(5,2)}期` : issuedate : ''}
							showArrow={true}
							dropdownMatchSelectWidth={false}
							onChange={(value) => debounce(() =>{
								if(value.indexOf('Invalid') === -1){
									changePeriodCallback(value, value)
								}else{
									message.info('日期格式错误，请刷新重试')
								}
							})()}
						>
							{issues ? issues.map((data, i) => <Select.Option key={i} value={`${data.substr(0,4)}-${data.substr(6,2)}`}>{data}</Select.Option>) : ''}
						</Select>
						<Icon type="calendar" className="title-more-calendar"/>
					</span>
				)
				break;
			case 'MONTH_MONTH':
				chooseSelect.push(
					<div className='title-more-choose-month-month'>
						<Select
							showArrow={false}
							value={issuedate}
							onChange={(value) => changePeriodCallback(value, value)}
							dropdownMatchSelectWidth={false}
						>
							{issues ? issues.map((data, i) => <Select.Option key={i} value={`${data.substr(0,4)}-${data.substr(6,2)}`}>{`${data.substr(0,4)}-${data.substr(6,2)}`}</Select.Option>) : ''}
						</Select>
						<span className='choose-month-month-separator'>~</span>
						<Select
							showArrow={false}
							value={endissuedate === issuedate ? '' : endissuedate}
							onChange={(value) => changePeriodCallback(issuedate, value)}
							dropdownMatchSelectWidth={false}
						>
							{nextperiods.map((data, i) => <Select.Option key={i} value={`${data.substr(0,4)}-${data.substr(6,2)}`}>{`${data.substr(0,4)}-${data.substr(6,2)}`}</Select.Option>)}
						</Select>

					{
						// <RangePicker
						// 	mode={['month', 'month']}
						// 	disabledDate={disabledDate}
						// 	allowClear={false}
						// 	className='title-more-choose-month'
						// 	value={issuedate ? [moment(issuedate, monthFormat), moment(endissuedateValue, monthFormat)] : []}
						// 	format={monthFormat}
						// 	onPanelChange={(value, mode) => debounce(() =>{
						// 		const begin = value[0].format(monthFormat)
						// 		let end = value[1].format(monthFormat)
						// 		if(begin.indexOf('Invalid') === -1){
						// 			if(end.indexOf('Invalid') > -1){
						// 				end = ''
						// 			}
						// 			changePeriodCallback(begin,end)
						// 		}else{
						// 			message.info('日期格式错误，请刷新重试')
						// 		}
						//
						// 	})()}
						// 	suffixIcon={<Icon type="down" />}
						// />
					}

					</div>

				)
				break;
			case 'DATE':
				chooseSelect.push(
					<DatePicker
						value={issuedate ? moment(issuedate, dateFormat) : '' }
						allowClear={false}
						disabledDate={disabledDate}
						className="title-more-choose-date"
						onChange={(value) => debounce(() =>{
							const date = value.format('YYYY-MM-DD')
							if(date.indexOf('Invalid') === -1){
								changePeriodCallback(date, date)
							}else{
								message.info('日期格式错误，请刷新重试')
							}

						})()}
						suffixIcon={<Icon type="down" />}
					/>
				)
				break;
			case 'DATE_DATE':
				chooseSelect.push(
					<RangePicker
						disabledDate={disabledDate}
						className='title-more-choose-month'
						allowClear={false}
						value={issuedate ? [moment(issuedate, dateFormat), moment(endissuedateValue, dateFormat)] : []}
						format={dateFormat}
						allowClear={false}
						onChange={(value, dateString) => debounce(() =>{
							if (dateString.length > 1) {
								const begin = dateString[0]
								let end = dateString[1]
								if(begin.indexOf('Invalid') === -1){
									if(end.indexOf('Invalid') > -1){
										end = ''
									}
									changePeriodCallback(begin,end)
								}else{
									message.info('日期格式错误，请刷新重试')
								}
							}
						})()}
						suffixIcon={<Icon type="down" />}
					/>
				)
				break;

			default:

		}

		return (
            <div className='common-data-change-box'>
			{
				chooseSelect
			}

				<Select
                    className="title-more-choose"
					dropdownMatchSelectWidth={false}
                    value={''}
					showArrow={false}
                    onChange={(value) => {
						changeChooseperiodsStatu(value)
						const startDate = issuedate.substr(4,1) ==='-' ? issuedate : `${issuedate.substr(0, 4)}-${issuedate.substr(6, 2)}`
						const endDate = endissuedateValue.substr(4,1) ==='-' ? endissuedateValue : `${endissuedateValue.substr(0, 4)}-${endissuedateValue.substr(6, 2)}`
						const start = value === 'MONTH' || value ==='MONTH_MONTH' ? moment(startDate, monthFormat).format(monthFormat) : moment(startDate, dateFormat).format(dateFormat)
						let end = value === 'MONTH' || value ==='MONTH_MONTH' ? moment(endDate, monthFormat).format(monthFormat) : moment(endDate, dateFormat).format(dateFormat)
						if(start.indexOf('Invalid') === -1){
							if(end.indexOf('Invalid') > -1){
								end = ''
							}
							if(value === 'MONTH' || value ==='DATE'){
								changePeriodCallback(start, start)
							}else{
								changePeriodCallback(start, end)
							}
						}else{
							message.info('日期格式错误，请刷新重试')
						}


					}}
                >
                    <Select.Option value={'MONTH'} key={'MONTH'}>{'按账期查询'}</Select.Option>
                    <Select.Option value={'DATE'} key={'DATE'}>{'按日期查询'}</Select.Option>
					<Select.Option value={'MONTH_MONTH'} key={'MONTH_MONTH'}>{'按账期区间查询'}</Select.Option>
                    <Select.Option value={'DATE_DATE'} key={'DATE_DATE'}>{'按日期区间查询'}</Select.Option>
                </Select>
				<XfnIcon type="calendar-change" className='title-more-choose-calendar'/>
            </div>
		)
	}
}
