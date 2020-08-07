import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './table.less'

@immutableRenderDecorator
export default
class TableAll extends React.Component{
	render() {
		const { type, className, shadowTop, style, page, jxcTotal, bottom, shadowTwo, newTable, shadowThree } = this.props

		if (newTable == 'true') {

			return (
				<div className={['table-wrap', className, type ? `table-wrap-${type}` : '', page ? 'table-table' : ''].join(' ')} style={style}>

					{
						type === 'amountYeb' ? '' :
						(type==='kcmxb'||type==='mutil-column-table'||type==='mutil-column-table-spread'?<i className="table-title-kcmxb-shadow"></i> :
						(type==='kcyeb'?<i className="table-title-kcyeb-shadow"></i> :
						(type === 'lsmxb' && shadowThree ? <i className="table-title-szye-shadow"></i> :
						(type === 'zhyeb' ? <i className="table-title-zhye-shadow"></i> :
						( type === 'kmye' || shadowTwo ?
						<i className="table-title-kmye-shadow"></i>:
						<i className="table-title-shadow" style={{top: shadowTop ? shadowTop : '1px'}}></i>)))))
					}
					{
						jxcTotal ? <i className="table-bottom-shadow" style={{bottom: bottom ? bottom+'px' : '1px'}}></i> : ''
					}
					{this.props.children}
				</div>
			)

		} else {
			return (
				<div className={['table-normal', className, type ? `table-normal-${type}` : '', page ? 'table-table' : ''].join(' ')} style={style}>

					{
						type === 'amountYeb' ? '' : ( type === 'kmye' || shadowTwo ?
						<i className="table-title-kmye-shadow"></i>:
						<i className="table-title-shadow" style={{top: shadowTop ? shadowTop : '1px'}}></i>)
					}
					{
						jxcTotal ? <i className="table-bottom-shadow" style={{bottom: bottom ? bottom+'px' : '1px'}}></i> : ''
					}
					{this.props.children}
				</div>
			)
		}
	}
}
