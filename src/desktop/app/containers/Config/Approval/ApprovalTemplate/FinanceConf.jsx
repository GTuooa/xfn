import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class FinanceConf extends React.Component {

	render() {

		return (
            <div>
                FinanceConf
            </div>
		)
	}
}
