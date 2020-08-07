import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'

import Trees from './Trees.jsx'
import TreesBottom from './TreesBottom.jsx'
import { Select }  from 'antd'
import { TableTree, Icon } from 'app/components'
const Option = Select.Option

@immutableRenderDecorator
export default
class TreeContain extends React.Component {

	render() {

		const {
			style,
			dispatch,
			assetslist,
			labelTreeList,
			initAssetsList,
			currentSelectedKeys,
			currentSelectedTitle
		} = this.props

		return (
			<TableTree>
				<Select
					combobox
					className="table-right-table-input"
					optionFilterProp="children"
					notFoundContent="无法找到相应科目"
					value={currentSelectedTitle}
					onSelect={value => {
						dispatch(assetsActions.getCardListFetch(value))
					}}
					showArrow={false}
					>
					{(initAssetsList ? initAssetsList.filter(v => v.get('serialNumber').length < 4) : []).map((v, i) => <Option key={i} value={`${v.get('serialNumber')}`}>{`${v.get('serialNumber')} ${v.get('serialName')}`}</Option>)}
				</Select>
				<Icon type="search" className="table-right-table-input-search"/>
				<div className="table-right-tree">
					<Trees
						assetslist={assetslist}
						onSelect={(info) => {
							if (info.length == 0){
								return false;
							}else{
								dispatch(assetsActions.getCardListFetch(info[0]))
							}
						}}
						currentSelectedKeys={currentSelectedKeys}
					/>
				</div>
				<div className="table-right-tree">

					<TreesBottom
						labelTreeList={labelTreeList}
						currentSelectedKeys={currentSelectedKeys}
						onSelect={(info) => {
							if (info.length == 0||info[0]==0){
								return false;
							}else{
								dispatch(assetsActions.getCardListByLabelFetch(info[0]))
							}
						}}
					/>
				</div>
			</TableTree>
		)
	}
}
