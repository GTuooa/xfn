import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Amount, TableItem } from 'app/components'

const levels = {
	// first: [1, 23, 30, 32],
	// second: [2, 20, 22, 24, 31],
	// third: [3, 11, 14, 18],
	// fourth: [4, 12, 15, 19, 23, 25],
	// fifth: [5, 6, 7, 8, 9, 10, 13, 16, 17, 26, 27, 28, 29]
	first: [1, 23, 32, 34],
	second: [2, 21, 24, 26, 33],
	third: [3, 11, 14, 18],
	fourth: [4, 12, 15, 19, 20, 22, 25, 27],
	fifth: [5, 6, 7, 8, 9, 10, 13, 16, 17, 28, 29, 30, 31]
}

@immutableRenderDecorator
export default
class LrItem extends React.Component {

	render() {

		const { lrItem, className, idx } = this.props

		let level = ''
		for (const v of Object.keys(levels)) {
			if (levels[v].indexOf(lrItem.get('lineindex')) > -1) {
				level = v
				break
			}
		}

		return (
			<TableItem className={className} line={idx+1}>
				<li><span className={level ? `lrb-text-index-${level}` : ''}>{lrItem.get('linename') ? lrItem.get('linename').replace(/\./g, '、').replace(/:/g, '：') : ''}</span></li>
				<li>{lrItem.get('lineindex')}</li>
				<li><Amount>{lrItem.get('yearaccumulation')}</Amount></li>
				<li><Amount>{lrItem.get('monthaccumulation')}</Amount></li>
			</TableItem>
		)
	}
}
