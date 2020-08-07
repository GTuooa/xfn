import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { formatMoney } from 'app/utils'
import AmbPieChar from './AmbPieChar'
import { Amount } from 'app/components'

import { Icon, Modal, Button } from 'antd'

@immutableRenderDecorator
export default
class FirstSection extends React.Component {

	constructor() {
		super()
		this.state = {showModal: false}
	}

	render() {

		const { showModal } = this.state

		const { gainAndLoss, income, pay, didMount,unit } = this.props

		return (
            <div className="ambsyb-firstsection">
                <div className="ambsyb-firstsection-title">
                    收支损益关系图
                </div>
                <div className="ambsyb-firstsection-main">
					<div className="ambsyb-firstsection-main-left">
						{
							didMount ?
							<AmbPieChar
								unit={unit}
								gainAndLoss={gainAndLoss}
							/> : ''
						}
						<div className="ambsyb-piechar-legend">
							<span className="ambsyb-piechar-amount-left">
								<span className="ambsyb-piechar-name-income">{`${income === '' ? '0.00' : (income/unit).toFixed(2)}`}</span>
								<span className="ambsyb-piechar-type">收入&nbsp;</span>
								<span className="ambsyb-piechar-income"></span>
							</span>
							<span className="ambsyb-piechar-amount-right">
								<span className="ambsyb-piechar-pay"></span>
								<span className="ambsyb-piechar-type">&nbsp;支出</span>
								<span className="ambsyb-piechar-name-pay">{`${pay === '' ? '0.00' : (pay/unit).toFixed(2)}`}</span>
							</span>
						</div>
					</div>
                </div>
            </div>
		)
	}
}
