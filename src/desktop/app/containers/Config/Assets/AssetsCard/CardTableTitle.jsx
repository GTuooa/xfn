import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Icon, Checkbox } from 'antd'
import * as Limit from 'app/constants/Limit.js'

import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'

@immutableRenderDecorator
export default
class CardTableTitle extends React.Component {

	render() {

		const { dispatch, selectAcAll, sortByValue, sortByStatus } = this.props

		return (
			<div className="table-title-wrap">
				<ul className="table-title assetscard-tabel-width">
					<li onClick={() => dispatch(assetsActions.selectAllCardButton())}>
						<Checkbox checked={selectAcAll}/>
					</li>
					<li>编码</li>
					<li>名称</li>
					<li
						className="cxpz-cur"
						// 判断排序的顺序不能变，因为除了‘1’， ’-1‘， 还有为 ‘’的情况
						onClick={() => dispatch(assetsActions.assetsSortByStatusOrValue(sortByValue === Limit.ASSETS_SORT_BY_VALUE_DESC ? Limit.ASSETS_SORT_BY_VALUE_ASC : Limit.ASSETS_SORT_BY_VALUE_DESC, ''))}
						>
						原值
						<span className="cxpz-sort-icon"></span>
					</li>
					<li>残值率</li>
					<li>启用日期</li>
					<li>录入期间</li>
					<li>账务处理借方科目</li>
					<li>账务处理贷方科目</li>
					<li>月折旧/摊销</li>
					<li
                        className="cxpz-cur"
                        onClick={() => dispatch(assetsActions.assetsSortByStatusOrValue('', sortByStatus === Limit.ASSETS_SORT_BY_STATUS_DESC ? Limit.ASSETS_SORT_BY_STATUS_ASC : Limit.ASSETS_SORT_BY_STATUS_DESC))}
                        >
                        状态
						<span className="cxpz-sort-icon"></span>
					</li>
				</ul>
			</div>
		)
	}
}
