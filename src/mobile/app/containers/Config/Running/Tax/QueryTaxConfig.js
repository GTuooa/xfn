import React from 'react'
import { toJS, fromJS } from 'immutable'
import { Icon, Row, ScrollView } from 'app/components'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

export default
class QueryTaxConfig extends React.Component {

    static displayName = 'QueryTaxConfig'

    componentDidMount() {
        this.props.dispatch(allRunningActions.getRunningTaxRate())
    }
    render() {
        const {
            dispatch,
            taxRateTemp,
		} = this.props

        const scale = taxRateTemp.get('scale')
        const payableRate = taxRateTemp.get('payableRate')//默认应交增值税率
        const outputRate = taxRateTemp.get('outputRate')//默认销项税率

        return(
            <ScrollView flex="1" uniqueKey="ac-config-scroll" savePosition className="tax-config">
                <Row className='tax-config-title-query'>
                    <span>企业类型：</span>
                    <span>{{'small': '小规模纳税人', 'general': '一般纳税人', 'isEnable': '不启用'}[scale]}</span>
                </Row>
                <Row>

                    {
                        (scale === 'small') ? <Row className='tax-config-item-query'>
                            <span>默认税率：{`${payableRate}%`}</span>
                        </Row> : null
                    }

                    {
                        (scale === 'general') ? <Row className='tax-config-item-query'>
                            <span>默认税率：{`${outputRate}%`}</span>
                        </Row> : null
                    }

                    {
                        scale === 'isEnable' ? <Row className='tax-config-isEnable'>
                                <Icon type="prompt"/>
                                流水中不体现发票内容
                        </Row> : null
                    }
                </Row>
            </ScrollView>
        )
    }
}
