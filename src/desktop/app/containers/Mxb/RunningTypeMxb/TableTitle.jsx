import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { TableOver} from 'app/components'
@immutableRenderDecorator
export default
class TableTitle extends React.Component{

	render() {
		const { accountDetailType, className } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={className ? `${className} table-title` : "table-title"}>
                    <li><span>日期</span></li>
                    <li><span>流水号</span></li>
                    <li><span>摘要</span></li>
                    <li><span>借方</span></li>
                    <li><span>贷方</span></li>

                    <li><span>方向</span></li>
                    <li><span>余额</span></li>
				</ul>
			</div>
		)
	}
}
