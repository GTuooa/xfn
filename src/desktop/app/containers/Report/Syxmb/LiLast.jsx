import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { Icon } from 'antd'
import { Amount } from 'app/components'
import { formatMoney } from 'app/utils'

@immutableRenderDecorator
export default
class LiLast extends React.Component {

	render() {

		const { isForOneMonth, increaseAmount, increaseScaleAmount, propYearAmount } = this.props

		return (
            <li>
                {
                    isForOneMonth === 'TRUE' ?
                    <span className={'ambsyb-all-text-black'}>

                        <span className="ambsyb-all-text-amount">
							{`${increaseAmount > 0 ? '+' : ''} ${increaseAmount === 0 ? '' : formatMoney(increaseAmount, 2, '')} `}
						</span>
                        <span className={`ambsyb-all-text-gray ${increaseAmount >= 0 ? 'ambsyb-all-text-red' : 'ambsyb-all-text-blue'}`}>
							{`${increaseAmount=== 0 ? '' : increaseScaleAmount === -9999 || increaseScaleAmount < -999 || increaseScaleAmount > 999 ? '--' :  (increaseScaleAmount.toFixed(2) + '%')}`}
							{increaseScaleAmount === -9999 || increaseScaleAmount < -999 || increaseScaleAmount > 999 ? '' : (increaseScaleAmount > 0 ? <Icon type="arrow-up" className='arrow-orange'/> :increaseScaleAmount == 0 ? '' : <Icon type="arrow-down" className='arrow-blue' />) }
                        </span>

                    </span> :
                    <span className={propYearAmount > 0 ? 'ambsyb-all-text-red' : 'ambsyb-all-text-blue'}>
                        {`${propYearAmount} %`}
                    </span>
                }
            </li>
		)
	}
}
