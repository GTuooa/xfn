import React from 'react'

import { Button, ButtonGroup, Icon } from 'app/components'

import TaxConfig from './TaxConfig'
import QueryTaxConfig from './QueryTaxConfig'

import * as taxConfActions from 'app/redux/Config/Running/Tax/taxConf.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

export default
class Tax extends React.Component {

	static displayName = 'Tax'

	render() {
		const { dispatch, isTaxQuery, taxRateTemp, history } = this.props
		let components = null
		components = isTaxQuery ?
					<QueryTaxConfig
						dispatch={dispatch}
						taxRateTemp={taxRateTemp}
					/> :
					<TaxConfig
						history={history}
						dispatch={dispatch}
						taxRateTemp={taxRateTemp}
					/>
		return(
			components
		)
	}
}
