import React from 'react'
import { connect }	from 'react-redux'
import Gzxj from './Gzxj'
import Shbx from './Shbx'
import Zfgjj from './Zfgjj'
import Flf from './Flf'
import Qtxc from './Qtxc'

@connect(state => state)
export default
class Xczc extends React.Component {
	constructor(props) {
		super(props)
    }

	render () {
		const { yllsState, history } = this.props
		const propertyPay = yllsState.getIn(['data', 'propertyPay'])//薪酬属性

		let component = null

		;({
			'SX_GZXJ': () => {
				component = <Gzxj history={history} />
			},
			'SX_SHBX': () => {
				component = <Shbx history={history} />
			},
			'SX_ZFGJJ': () => {
				component = <Zfgjj history={history} />
			},
			'SX_FLF': () => {
				component = <Flf history={history} />
			},
			'SX_QTXC': () => {
				component = <Qtxc history={history} />
			}
		}[propertyPay] || (() => null))()

		return(
			component
		)
	}
}
