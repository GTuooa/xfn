import React, { PropTypes } from 'react'
import { Map, List ,fromJS} from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import XfnIcon from 'app/components/Icon'
import LrItem from './LrItem.jsx'
import { TableWrap, TableBody, TableTitle, TableAll ,TitleKmye} from 'app/components'
import SelfLrbItem from "./SelfLrbItem"
import * as lrbActions from 'app/redux/Report/Lrb/lrb.action.js'
import { debounce } from 'app/utils'
import { Select, Modal, Button, Checkbox, Input, message, Radio, DatePicker, Icon } from 'antd'
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const { RangePicker } = DatePicker
import moment from 'moment'

@immutableRenderDecorator
export default
class DateModal extends React.Component {
    state = {
        begin:this.props.referBegin,
        end:this.props.referEnd,
        confirm:true
    }
    render() {
        const {
            dateModal,
            dispatch,
            issuedate,
            endissuedate,
            startMonth,
            year,
            finalMonth,
            referChooseValue,
            issues,
            onCancel
        } = this.props
        const {
            begin,
            end,
            confirm
        } = this.state
        const monthFormat = 'YYYY-MM'
		const checkboxOpt = []
		const endissuedateValue = endissuedate ? endissuedate : issuedate
		const endDate = issues.get(0) || ''
		const startDate = issues.get(issues.size-1) || ''
		let  disabledBeginDate = '', disabledEndDate=''
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
		const disabledBeginYear = getMonthYear(startDate.substr(0,4), startDate.substr(6,2)).openedyear
		const disabledBeginMonth = getMonthYear(startDate.substr(0,4), startDate.substr(6,2)).openedmonth
		const disabledEndYear = getMonthYear(endDate.substr(0,4), endDate.substr(6,2)).openedyear
		const disabledEndMonth = getMonthYear(endDate.substr(0,4), endDate.substr(6,2)).openedmonth
		disabledBeginDate  = new Date(disabledBeginYear,disabledBeginMonth, 1)
		disabledEndDate  =  new Date(disabledEndYear, disabledEndMonth, 1)
		const disabledDate = function (current) {
			return current && (moment(disabledBeginDate) > current)
		}
        const word = begin === end ?
            `${begin.substr(0,4)}-${begin.substr(4,2)}`
            :
            `${begin.substr(0,4)}-${begin.substr(4,2)}~${(end?end:begin).substr(0,4)}-${(end?end:begin).substr(4,2)}`
        return(
            <Modal
                width={480}
                visible={dateModal}
                title={'选择参考账期'}
                onCancel={onCancel}
                className='date-modal'
                maskClosable={false}
                onOk={() => {
                    if (!confirm) return;
                    let beginYear = begin.substr(0,4)
                    let beginMonth = begin.substr(4,2)
                    let endYear = end.substr(0,4)
                    let endMonth = end.substr(4,2)
                    if (referChooseValue === '按账期区间选择') {
                        if(beginYear !== endYear) {
                            message.info('所选区间不可跨年')
                            return;
                        } else if (beginYear < disabledBeginYear || beginYear == disabledBeginYear && beginMonth < disabledBeginMonth
                                || endYear > disabledEndYear || endYear == disabledEndYear && endMonth > disabledEndMonth
                        ) {
                            message.info('所选区间有误')
                            return;
                        }
                    }
                    dispatch(lrbActions.changeLrbString('curReferValue',referChooseValue))
                    dispatch(lrbActions.getInitListFetch(issuedate,endissuedate,begin,end))
                    onCancel()
                }}
                okType={confirm?'primary':'disabled'}
                >
                <div>
                    <RadioGroup
                        className='date-radio-group'
                        value={referChooseValue}
                        onChange={(e) => {
                            const valueStr = e.target.value
                            let year = issuedate.substr(0,4)
                            let month = issuedate.substr(6,2)
                            const issueList = issues.toJS().reverse()
                            let lastyear =`${Number(year)-1}${month}`
                            let lastyearTwo =`${Number(endissuedate.substr(0,4))-1}${endissuedate.substr(6,2)}`
                            const lastIssuedate = `${Number(year)-1}年第${month}期`
                            const lastIssuedateTwo = `${Number(endissuedate.substr(0,4))-1}年第${endissuedate.substr(6,2)}期`
                            let index = issueList.findIndex(v => v === issuedate)
                            dispatch(lrbActions.changeReferChooseValue(valueStr))
                            this.setState({confirm:true})
                            switch(valueStr) {
                                case '本年累计':
                                    this.setState({begin:`${year}${startMonth}`,end:`${year}${month}`})
                                    break
                                case '上个月':
                                    if (index === 0) {
                                        message.info('不在有效账期区间内')
                                        this.setState({confirm:false})
                                    } else {
                                        let lastMonth = issueList[index-1]
                                        this.setState({begin:`${lastMonth.substr(0,4)}${lastMonth.substr(6,2)}`,end:`${lastMonth.substr(0,4)}${lastMonth.substr(6,2)}`})
                                    }
                                    break
                                case '上年同期':
                                    if (issueList.some(v => v === lastIssuedate) && issueList.some(v => v === lastIssuedateTwo)) {
                                        this.setState({begin:`${lastyear}`,end:`${lastyearTwo}`})
                                    } else {
                                        message.info('不在有效账期区间内')
                                        this.setState({confirm:false})
                                    }
                                    break
                                case '过去三个月':
                                    if (index <= 3) {
                                        message.info('不在有效账期区间内')
                                        this.setState({confirm:false})
                                    } else {
                                        let lastMonth = issueList[index-3]
                                        let endMonth = issueList[index-1]
                                        this.setState({begin:`${lastMonth.substr(0,4)}${lastMonth.substr(6,2)}`,end:`${endMonth.substr(0,4)}${endMonth.substr(6,2)}`})
                                    }
                                    break
                                case '过去半年':
                                    if (index <= 6) {
                                        message.info('不在有效账期区间内')
                                        this.setState({confirm:false})
                                    } else {
                                        let lastMonth = issueList[index-6]
                                        let endMonth = issueList[index-1]
                                        this.setState({begin:`${lastMonth.substr(0,4)}${lastMonth.substr(6,2)}`,end:`${endMonth.substr(0,4)}${endMonth.substr(6,2)}`})
                                    }
                                    break
                                default:
                            }
                        }}
                    >
                        <Radio value={'本年累计'}>本年累计</Radio>
                        <Radio value={'上个月'}>上个月</Radio>
                        <Radio value={'上年同期'}>上年同期</Radio>
                        {/* <Radio value={'过去三个月'}>过去三个月</Radio> */}
                        {/* <Radio value={'过去半年'}>过去半年</Radio> */}
                    </RadioGroup>
                    <Input
                        disabled
                        style={{display:'block'}}
                        value={
                            referChooseValue === '本年累计'?
                            `${year}-${startMonth}~${year}-${finalMonth}`
                            :
                            word
                        }
                    />
                    <div style={{margin:'10px 0'}}>
                        <Radio
                            checked={referChooseValue === '按账期选择'}
                            value={'按账期选择'}
                            onClick={() =>{
                                this.setState({confirm:true,begin:`${year}${startMonth}`,end:`${year}${startMonth}`})
                                dispatch(lrbActions.changeReferChooseValue('按账期选择'))
                            }}
                            >按账期选择</Radio>
                    </div>
                        <Select
                            disabled={referChooseValue !== '按账期选择'}
                            className="date-choose"
                            value={referChooseValue === '按账期选择' && begin?`${begin.substr(0,4)}年第${begin.substr(4,2)}期`:''}
                            onChange={(value) => {
                                this.setState({begin:`${value.substr(0,4)}${value.substr(6,2)}`,end:`${value.substr(0,4)}${value.substr(6,2)}`})
                            }}
                            >
                            {issues.map((data, i) => <Select.Option key={i} value={data}>{data}</Select.Option>)}
                        </Select>
                    <div style={{margin:'10px 0'}}>
                    <Radio
                        checked={referChooseValue === '按账期区间选择'}
                        value={'按账期区间选择'}
                        onClick={() =>{
                            this.setState({confirm:true})
                            dispatch(lrbActions.changeReferChooseValue('按账期区间选择'))
                        }}
                        >按账期区间选择</Radio>
                    </div>
                    <RangePicker
                        mode={['month', 'month']}
                        disabled={referChooseValue !== '按账期区间选择'}
                        disabledDate={disabledDate}
                        allowClear={false}
                        className='title-more-choose-month'
                        value={referChooseValue === '按账期区间选择' && begin ? [moment(begin, monthFormat), moment(end, monthFormat)] : []}
                        format={monthFormat}
                        onPanelChange={(value, mode) => debounce(() =>{
                            const begin = value[0].format(monthFormat).replace('-','')
                            let end = value[1].format(monthFormat).replace('-','')
                            if(begin.indexOf('Invalid') === -1){
                                if(end.indexOf('Invalid') > -1){
                                    end = ''
                                }
                                dispatch(lrbActions.changeReferChooseValue('按账期区间选择'))
                                this.setState({begin:begin,end:end})
                            }else{
                                message.info('日期格式错误，请刷新重试')
                            }

                        })()}
                        suffixIcon={<Icon type="down" />}
                    />
                </div>
            </Modal>
        )
    }
}
