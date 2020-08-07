import React, { Fragment } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as relativeYebActions from 'app/redux/Yeb/RelativeYeb/relativeYeb.action.js'

@immutableRenderDecorator
export default
class TableTitle extends React.Component{

	render() {

        const { className,titleNameList} = this.props

		return (
			<div className="table-title-wrap">
				<ul className={["table-title table-title-relative-yeb", className].join(' ')}>
					{
						titleNameList.map(item => {
							return (
								<li>
									{
										item.childList ?
										<Fragment>
											<div onClick={item.onClick ? item.onClick : ()=>{}}>
												<span>{item.name}{item.showSort ? <span className="cxls-sort-icon"></span> : ''}</span>
											</div>
											<div className='table-title-child-name'>
												{
													item.childList.map(v => {
														return <span>{v.name}</span>
													})

												}
											</div>
										</Fragment> :
										<span>{item.name}</span>
									}

								</li>
							)
						})
					}
				</ul>
			</div>
		)
	}
}
