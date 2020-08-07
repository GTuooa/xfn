 import React, { PropTypes } from 'react'
import { Map, List, toJS } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Amount, TableItem } from 'app/components'

@immutableRenderDecorator
export default
class XjItem extends React.Component {

	render() {
		const { className, cachFlowItem, idx } = this.props
		const lineIndex = cachFlowItem.get('lineIndex') == 23 || cachFlowItem.get('lineIndex') ==24 || cachFlowItem.get('lineIndex') ==25 ? '' : cachFlowItem.get('lineIndex');

		return (
			<TableItem className={className} line={idx+1}>
				<li>{cachFlowItem.get('lineName') ? cachFlowItem.get('lineName').replace(/\./g, '、').replace(/:/g, '：') : ''}</li>
				<li>{lineIndex}</li>
				<li>
                    {(lineIndex ==7 || lineIndex ==13 || lineIndex ==19 || lineIndex ==20 || lineIndex ==21 || lineIndex ==22) ? <Amount showZero="true">{cachFlowItem.get('sumAmount')}</Amount> : <Amount>{cachFlowItem.get('sumAmount')}</Amount>
                    }
				</li>
				<li>
					{(lineIndex ==7 || lineIndex ==13 || lineIndex ==19 || lineIndex ==20 || lineIndex ==21 || lineIndex ==22) ? <Amount showZero="true">{cachFlowItem.get('amount')}</Amount> : <Amount>{cachFlowItem.get('amount')}</Amount>
					}
				</li>
			</TableItem>
		)
	}
}
