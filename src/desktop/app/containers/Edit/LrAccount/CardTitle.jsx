import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS } from 'immutable'

import * as Limit from 'app/constants/Limit.js'
import { DatePicker, Input, Select, Checkbox, Button, Modal, message, Timeline } from 'antd'
import { RunCategorySelect, AcouontAcSelect } from 'app/components'

@immutableRenderDecorator
export default
class CardWrap extends React.Component {
	constructor() {
		super()
		this.state = {
		}
	}


	render() {
		const {

		} = this.props

		return (
			<div className="lrAccount-title">
                <h1>流水账1</h1>
            </div>
		)
	}
}
