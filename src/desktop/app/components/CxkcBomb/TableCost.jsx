import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { Amount } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {
		const {
			lineList
    } = this.props


		return (
      <div className="modalBody-item-wrap">
          {
						(lineList || []).map((item,i) => {
						let showPropertyName = '';
						(item.get('properties') || []).map((u,i) => {
							showPropertyName = `${showPropertyName}${showPropertyName ? '-' : ''}${u.get('name')}`
						})

						return(
							<ul className="cxkcModalBody-item lrkc-cost-tabel-width">
								<li>
									{i+1}
								</li>
								<li>
									<span>{`${item.get('productCode')} ${item.get('productName')}`}</span>
								</li>
								<li>
									<span>{item.get('specifications')}</span>
								</li>
								<li>
									<span>{showPropertyName}</span>
								</li>
								<li>
									<span>{item.get('unit')}</span>
								</li>
								<li>
									<Amount className='lrkc-textRight'>{item.get('systemAmount')}</Amount>
								</li>
								<li>
									<span className='lrck-textRight'>{item.get('actualAmount')}</span>
								</li>
								<li>
									<span className='lrck-textRight'>{item.get('adjustAmount')}</span>
								</li>
								<li>
									<span>{item.get('remark')}</span>
								</li>
							</ul>
						)})
					}
			</div>
		)
	}
}
