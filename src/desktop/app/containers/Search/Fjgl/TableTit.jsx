import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as fjglActions from 'app/redux/Search/Fjgl/fjgl.action.js'
import { Icon, Checkbox }	from 'antd'

@immutableRenderDecorator
export default
class TableTit extends React.Component {
	render() {
		console.log('TableTit')
		const { dispatch, selectVcAll, vcindexSort, vcdateSort, className } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={className + ' ' + "table-title"}>
					<li></li>
					<li
						className="cxpz-cur"
						onClick={() => dispatch(fjglActions.sortFjVcListByDate())}
					>
						<span>日期</span>
						<span className="cxpz-sort-icon"></span>
					</li>
					<li
						className="cxpz-cur"
						onClick={() => dispatch(fjglActions.reverseFjVcList())}
					>
						<span>凭证字号</span>
						<span className="cxpz-sort-icon"></span>
					</li>
					<li>文件名</li>
					<li>大小</li>
					<li>标签</li>
					<li>制单人</li>
					<li>审核人</li>
				</ul>
			</div>
		)
	}
}

{/* <tbody>
	<tr>
		<td></td>
		<td className="cxpz-cur draft-head-caret" onClick={() => dispatch(fjglActions.sortFjVcListByDate())}>
			<span>日期</span>
			<b className="caret-up"></b>
			<b className="caret-down"></b>
		</td>
		<td className="cxpz-cur draft-head-caret draft-head-mark" onClick={() => dispatch(fjglActions.reverseFjVcList())}>
			<span>凭证字号</span>
			<b className="caret-up"></b>
			<b className="caret-down"></b>
		</td>
		<td>文件名</td>
		<td>大小</td>
		<td>标签</td>
		<td>制单人</td>
		<td>审核人</td>
	</tr>
</tbody>
</table>
</div> */}
