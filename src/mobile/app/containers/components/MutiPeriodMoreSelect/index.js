import React, { Component } from 'react'
import { Icon, Single } from 'app/components'
import { DateLib } from 'app/utils'
import thirdParty from 'app/thirdParty'
import { TopMonthPicker, TopDatePicker } from 'app/containers/components'

import './style.less'


export default class MutiPeriodMoreSelect extends Component {
    render() {
        const { start,end,issues,chooseValue,nextperiods,onBeginOk,onEndOk,changeChooseValue } = this.props

        const dateCheck = (date) => {
			const issuesList = issues.toJS()
			let issuesEnd = issuesList.shift()['value']
			let issuesStart = issuesList.pop()['value']
			let issuesEndDay = new Date(issuesEnd.slice(0,4), issuesEnd.slice(5,7), 0)

			let returnValue = false
			if (Date.parse(date) < Date.parse(issuesStart) || Date.parse(date) > Date.parse(issuesEndDay)) {
				thirdParty.Alert('请选择账期内的日期', '好的')
				returnValue = true
			}
			return returnValue
		}

        const dateSelectList = [
			{key: '按账期查询', value: 'ISSUE'},
			{key: '按日期查询', value: 'DATE'},
			{key: '按账期区间查询', value: 'ISSUE_RANGE'},
			{key: '按日期区间查询', value: 'DATE_RANGE'}
		]

        return (
            <div className="muti-period-more-select">
                <div style={{display: ['ISSUE', 'ISSUE_RANGE'].includes(chooseValue) ? '' : 'none'}}>
                    <TopMonthPicker
                        issuedate={start}
                        source={issues}
                        callback={(value) => {
                            if(value.indexOf('Invalid') === -1){
                                onBeginOk(value)
                            }else{
                                thirdParty.toast.info('日期格式错误,请刷新重试')
                            }

                        }}
                        onOk={(result) => {
                            if(result.value.indexOf('Invalid') === -1){
                                onBeginOk(result.value)
                            }else{
                                thirdParty.toast.info('日期格式错误,请刷新重试')
                            }
                        }}

                        showSwitch={chooseValue=='ISSUE_RANGE' ? true : false}//是否有跨期的按钮
                        endissuedate={chooseValue=='ISSUE_RANGE' ? (end ? end : start) : ''}
                        nextperiods={nextperiods}
                        onBeginOk={(result) => {//跨期选择完开始时间后
                            if(result.value.indexOf('Invalid') === -1){
                                onBeginOk(result.value)
                            }else{
                                thirdParty.toast.info('日期格式错误,请刷新重试')
                            }
                        }}
                        onEndOk={(result) => {//跨期选择完结束时间后
                            if(result.value.indexOf('Invalid') === -1){
                                onEndOk(start,result.value)
                            }else{
                                thirdParty.toast.info('日期格式错误,请刷新重试')
                            }

                        }}
                    />
                </div>
                <div style={{display: ['DATE', 'DATE_RANGE'].includes(chooseValue) ? '' : 'none'}}>
                    <TopDatePicker
                        value={start}
                        endValue={end ? end : start}
                        isRange={chooseValue=='DATE_RANGE' ? true : false}
                        onChange={date => {
                            const value = new DateLib(date).valueOf()
                            if (dateCheck(value)) {
                                return
                            }
                            if(value.indexOf('Invalid') === -1){
                                onBeginOk(value)
                            }else{
                                thirdParty.toast.info('日期格式错误,请刷新重试')
                            }
                        }}
                        callback={(value) => {
                            if (dateCheck(value)) {
                                return
                            }
                            if(value.indexOf('Invalid') === -1){
                                onBeginOk(value)
                            }else{
                                thirdParty.toast.info('日期格式错误,请刷新重试')
                            }
                        }}
                        onEndChange={(date)=>{
                            const value = new DateLib(date).valueOf()
                            if (Date.parse(value) < Date.parse(start)) {
                                thirdParty.Alert('结束日期不可小于开始日期', '好的')
                                return
                            }
                            if (dateCheck(value)) {
                                return
                            }
                            if(value.indexOf('Invalid') === -1){
                                onEndOk(start,value)
                            }else{
                                thirdParty.toast.info('日期格式错误,请刷新重试')
                            }
                        }}
                    />
                </div>

                <Single
                    district={dateSelectList}
                    value={chooseValue}
                    canSearch={false}
                    onOk={value => {

                        if (!start) {
                            return
                        }

                        let date = start.slice(0,7)
                        if (['DATE', 'DATE_RANGE'].includes(value.value)) {
                            date = `${date}-01`
                        }
                        changeChooseValue(value.value)
                        if(date.indexOf('Invalid') === -1){
                            onEndOk(date,date)
                        }else{
                            thirdParty.toast.info('日期格式错误,请刷新重试')
                        }

                    }}
                >
                    <Icon type="date"/>
                </Single>
            </div>
        )

    }

}
