import React, { Component } from 'react'
import { Icon, Single } from 'app/components'
import { DateLib } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { TopDatePicker } from 'app/containers/components'

import './style.less'


export default class MutiDateSelect extends Component {
    render() {
        const { start, end, chooseValue, onBeginOk, onEndOk, changeChooseValue, dateSelectList } = this.props

        return (
            <div className="muti-period-more-select">
                <div>
                    <TopDatePicker
                        value={start}
                        endValue={end ? end : start}
                        isRange={true}
                        onChange={date => {
                            const value = new DateLib(date).valueOf()
                            if (value.indexOf('Invalid') === -1) {
                                if (Date.parse(end) < Date.parse(value)) {
                                    onBeginOk(value, value)
                                } else {
                                    onBeginOk(value, end)
                                }
                            } else {
                                thirdParty.toast.info('日期格式错误,请刷新重试')
                            }
                        }}
                        onEndChange={(date)=>{
                            const value = new DateLib(date).valueOf()
                            if (Date.parse(value) < Date.parse(start)) {
                                thirdParty.Alert('结束日期不可小于开始日期', '好的')
                                return
                            }
                            if (value.indexOf('Invalid') === -1) {
                                onEndOk(start, value)
                            } else {
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
                        changeChooseValue(value.value)
                    }}
                >
                    <Icon type="select" style={{fontSize: '.17rem'}}/>
                </Single>
            </div>
        )
    }
}
