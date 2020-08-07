import React from 'react'
import { toJS, fromJS } from 'immutable'

import { Single, Icon, Row, ScrollView } from 'app/components'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

export default
class TaxConfig extends React.Component {

    static displayName = 'TaxConfig'

    render() {
        const {
            dispatch,
            taxRateTemp,
            history,
		} = this.props

        const scale = taxRateTemp.get('scale')
        const payableRate = taxRateTemp.get('payableRate')//默认应交增值税率
        const outputRate = taxRateTemp.get('outputRate')//默认销项税率

        const rateOptionList =taxRateTemp.get('rateOptionList').toJS()
        let district = []
        rateOptionList.forEach(v => { district.push({key:`${v}%`, value: v}) })


        return(
            <ScrollView flex="1" uniqueKey="ac-config-scroll" savePosition className="tax-config">
                <Row className='tax-config-title'>
                    <span>企业类型</span>
                    <Single
                        className='ac'
                        district={[{key: '小规模纳税人', value: 'small'}, {key: '一般纳税人', value: 'general'},{key: '不启用增值税', value: 'isEnable'}]}
                        value={scale}
                        onOk={(value) => {
                            dispatch(allRunningActions.changeTaxRateData( 'scale', value.value))
                            if (scale=='isEnable') {
                                dispatch(allRunningActions.changeTaxRateData('payableRate', 3))
                                dispatch(allRunningActions.changeTaxRateData('outputRate', 3))
                            }
                        }}>
                            <span className='over-dian'>{{'small': '小规模纳税人', 'general': '一般纳税人', 'isEnable': '不启用增值税'}[scale]}</span>
                            <Icon type="triangle" style={{marginLeft: '0.05rem'}}/>
                    </Single>
                </Row>

                {
                    ['small', 'general'].includes(scale) ? <Row className='tax-config-item'>
                        <span>默认税率</span>
                        <Single
                            district={district}
                            value={scale=='small' ? payableRate : outputRate}
                            icon={{
                                type: 'setting',
                                onClick: () => {
                                    history.push("/config/running/taxRate")
                                }
                            }}
                            onOk={value => {
                                dispatch(allRunningActions.changeTaxRateData('payableRate', value.value))
                                dispatch(allRunningActions.changeTaxRateData('outputRate', value.value))
                            }}
                        >
                            <Row className='ac'>
                                <span className='over-dian'>{`${scale=='small' ? payableRate : outputRate}%`}</span>
                                <Icon type="triangle" />
                            </Row>
                        </Single>
                    </Row> : null
                }
                {
                    scale === 'isEnable' ? <Row className='tax-config-isEnable'>
                            <Icon type="prompt"/>
                            流水中不体现发票内容
                    </Row> : null
                }
            </ScrollView>
        )
    }
}
