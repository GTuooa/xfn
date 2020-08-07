import React, { Component, PropTypes }  from 'react'
import { fromJS, toJS } from 'immutable'
import { Row, DatePicker, Icon } from 'app/components'

import './index.less'

export default
class TopDatePicker extends Component {

    render() {

        const {
            onChange,
			value,
			callback,
			style,
            isRange,//是否是日期区间
            endValue,//结束日期
            onEndChange,
        } = this.props

        const showdate = value.replace(/-/g, '/')

		function GetDay(bool) {
			const date = value.split('-')
			const today = new Date(date[0], date[1] - 1, date[2])
			const yesterday_milliseconds = bool ? today.getTime() + 1000 * 60 * 60 * 24 : today.getTime() - 1000 * 60 * 60 * 24
			const yesterday = new Date()
			yesterday.setTime(yesterday_milliseconds)

			const strYear = yesterday.getFullYear()
			let strDay = yesterday.getDate()
			if (strDay < 10) {
				strDay = '0' + strDay
			}
			let strMonth = yesterday.getMonth() + 1
			if (strMonth < 10) {
				strMonth = '0' + strMonth
			}
			const strYesterday = [strYear, strMonth, strDay].join('-')
			return strYesterday
		}
		const tomorrow = GetDay(false)

        return (

            <Row className="date-header-wrap" style={style}>
                <div className="date-header" style={{display: isRange ? 'none' : ''}}>
                    <span
                        className="date-header-btn-wrap"
                        onClick={() => {
                            if (value) {
                                const date = GetDay(false)
                                callback(date)
                            }
                        }}
                    >
                        <Icon
                            className="header-left"
                            type="last"
                        ></Icon>
                    </span>
					<DatePicker
                        className="thirdparty-date-select"
                        value={value}
                        onChange={onChange}
                    >
                        <div>
                            <span className="thirdparty-date-date">{showdate}</span>
                            <Icon type="triangle" size="11"/>
                        </div>
                    </DatePicker>
                    <span
                        className="date-header-btn-wrap"
                        onClick={() => {
                            if (value) {
                                const date = GetDay(true)
                                callback(date)
                            }
                        }}
                    >
                        <Icon
                            className="header-right"
                            type="next"
                        />
                    </span>
                </div>
                
                <div className="date-header" style={{display: isRange ? '' : 'none'}}>
					<DatePicker
                        className="thirdparty-date-select"
                        value={value}
                        onChange={onChange}
                    >
                        <div>
                            <span className="thirdparty-date-date">{showdate}</span>
                            <Icon type="triangle" size="11"/>
                        </div>
					</DatePicker>
					<span>至</span>
                    <DatePicker
                        className="thirdparty-date-select"
                        value={endValue}
                        onChange={onEndChange}
                    >
                        <div>
                            <span className="thirdparty-date-date">{endValue ? endValue.replace(/-/g, '/') : ''}</span>
                            <Icon type="triangle" size="11"/>
                        </div>
					</DatePicker>
				</div>
			</Row>
        )
    }
}
