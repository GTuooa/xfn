import React from 'react'
import { connect }	from 'react-redux'
import Zzs from './Zzs'
import Grsf from './Grsf'
import Qtsf from './Qtsf'

@connect(state => state)
export default
class Sfzc extends React.Component {
	constructor(props) {
		super(props)
    }

	render () {
		const { yllsState, history } = this.props
		const propertyTax = yllsState.getIn(['data', 'propertyTax'])//税费属性

		let component = null

		;({
			'SX_ZZS': () => {//增值税
				component = <Zzs history={history} />
			},
			'SX_GRSF': () => {//个人税费
				component = <Grsf history={history} />
			},
			'SX_QTSF': () => {//其他税费
				component = <Qtsf history={history} />
			},
			'SX_QYSDS': () => {//企业所得税
				component = <Qtsf history={history} />
			}
		}[propertyTax] || (() => null))()

		return(
			component
		)
	}
}
