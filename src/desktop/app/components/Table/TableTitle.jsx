import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Checkbox } from 'antd'
import './table.less'

@immutableRenderDecorator
export default
class TableTitle extends React.Component{

	render() {
		const { type, className, titleList, hasCheckbox, onClick, selectAcAll, disabled } = this.props

		// console.log('TableTitle---')

		return (
			<div className="table-title-wrap">
				<ul className={className ? `${className} table-title` : "table-title"}>
					{hasCheckbox ?
						<li key={0} onClick={onClick}>
							{
								disabled ? '' : <Checkbox checked={selectAcAll}/>
							}
						</li>
						: ''
					}
					{titleList.map((v, i) => <li key={i+1}>{<span>{v}</span>}</li>)}
				</ul>
			</div>
		)
	}
}
