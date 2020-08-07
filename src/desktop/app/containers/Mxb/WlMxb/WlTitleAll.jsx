import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { TableItem, TableOver} from 'app/components'

@immutableRenderDecorator
export default
class wlTitleAll extends React.Component {
	render() {
		const { className, wlRelate } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={`${className} table-title`}>
					<li><span>日期</span></li>
					<li><span>流水号</span></li>
					<li><span>摘要</span></li>
					<TableOver>
						<span>
							{wlRelate == '2' ? '应收额' : '应付额'}
						</span>
					</TableOver>
					<TableOver>
						<span>
							{wlRelate == '2' ? '实收额' : '实付额'}
						</span>
					</TableOver>
					<TableOver>
						<span>
							{wlRelate == '2' ? '应收净额' : '应付净额'}
						</span>
					</TableOver>
				</ul>
				<i className="shadow-title-amountwlmx"></i>
			</div>
		)
	}
}
