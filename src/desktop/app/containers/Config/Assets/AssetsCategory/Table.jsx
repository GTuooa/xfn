import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import AssetsItem from './AssetsItem.jsx'
import { TableBody, TableTitle, TableAll } from 'app/components'

import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'

@immutableRenderDecorator
export default
class TableSort extends React.Component {

	render() {
		const {
			style,
			sortList,
			dispatch,
			selectAcAll,
			assetslist,
			assetsChildShow,
			AssetsConfigRowClick,
			selectClass,
			selectAssetsAll,
			sortCheckedAll,
			sortItemStatus
		} = this.props

		let lineNum = 0

		//  有下级的类别
		const upperidList = sortList ? sortList.map(v => v.get('upperAssetsNumber')) : ''
		// 有直接卡片的一级分类
		const disableAddChildList = assetslist ? assetslist.map(v => v.get('upperAssetsNumber').length === 1 && v.get('serialNumber').length === 7 ? v.get('upperAssetsNumber') : '') : []
		const titleList = ['操作', '编码', '名称', '折旧/摊销方法', '默认总期限', '默认残值率', '默认资产科目', '账务处理默认借方科目', '账务处理默认贷方科目', '备注']

		return (
			<TableAll>
				<TableTitle
					className="assetssort-tabel-width"
					hasCheckbox={true}
					titleList={titleList}
					onClick={() => dispatch(assetsActions.selectAllSortButton())}
					selectAcAll={sortCheckedAll}
				/>
				<TableBody>
					{(sortList || []).map((u, i) => {

						const isShow = u.get('serialNumber').length === 1 || assetsChildShow.indexOf(u.get('serialNumber').substr(0, 1)) > -1
						let line = isShow ? ++lineNum : 'hide'
						const disableAddChild = disableAddChildList.indexOf(u.get('serialNumber')) > -1
						const  sortItemCheckedStatus=sortItemStatus.getIn([i,'status'])

						return (
							<AssetsItem
								key={i}
								idx={i}
								className='assetssort-tabel-width assetssort-tabel-justify'
								sortItem={u}
								dispatch={dispatch}
								sortItemCheckedStatus={sortItemCheckedStatus}
								line={line}
								isShow={isShow}
								upperidList={upperidList}
								disableAddChild={disableAddChild}
								AssetsConfigRowClick={AssetsConfigRowClick}
							/>
						)
					})}
				</TableBody>
			</TableAll>
		)
	}
}
