import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as AssetsMxbActions from 'app/redux/Mxb/AssetsMxb/assetsMxb.action.js'

import Trees from './Trees.jsx'
import TreesBottom from './TreesBottom.jsx'
import { Select }  from 'antd'
import { Icon } from 'app/components'
import { TableTree } from 'app/components'

@immutableRenderDecorator
export default
class TreeContain extends React.Component {
	render() {
		const {
			dispatch,
			initAssetsList,
			assetslist,
			labelTreeList,
			issuedate,
			endissuedate,
			currentSelectedKeys,
			currentSelectedTitle
		} = this.props
		//const
		return (
			<TableTree>
				<Select
					showSearch
					className="table-right-table-input"
					optionFilterProp="children"
					notFoundContent="无法找到相应科目"
					value={currentSelectedTitle}
					onSelect={value => {
						dispatch(AssetsMxbActions.getMxListFetch(issuedate, endissuedate, value))
					}}
					showArrow = {false}
					>
					{(initAssetsList ? initAssetsList.filter(v => v.get('serialNumber').length < 4) : []).map((v, i) => <Option key={i} value={`${v.get('serialNumber')}`}>{`${v.get('serialNumber')} ${v.get('serialName')}`}</Option>)}

				</Select>
				<Icon type="search" className="table-right-table-input-search"/>
				{/* <div className="assetscar-right-tree"> */}
					<div className="table-right-tree" style={{paddingTop: '3px'}}>
						<Trees
							assetslist={assetslist}
							onSelect={(info,e) => {
								if (info.length == 0){
									return false;
								}else{
									dispatch(AssetsMxbActions.getMxListFetch(issuedate, endissuedate, info[0]))
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
									dispatch(AssetsMxbActions.getMxListByLabelFetch(issuedate, endissuedate, info[0]))
								}
							}}
						/>
					</div>
				{/* </div> */}
			</TableTree>
		)
	}
}
