import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Select, Icon }  from 'antd'
import { TableTree, JxcTree } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

import * as projectConfActions from 'app/redux/Config/Project/project.action.js'

@immutableRenderDecorator
export default
class TreeContain extends React.Component {

	static displayName = 'ProjectConfTreeContain'

	render() {
		const {
			dispatch,
			openCardTypeModal,
			editPermission,
			treeList,
			activeTapKeyUuid,
			selectTypeId,
			selectTypeName,
		} = this.props

		let selectList = []
		let parentUuid = activeTapKeyUuid
		let sonUuid = selectTypeId
		let sonName = selectTypeName

		const loop = data => data.forEach((item) => {
			if (item.childList.length) {
				selectList.push({
					value: `${item.uuid}${Limit.TREE_JOIN_STR}${item.name}`,
					name: item.name
				})
				loop(item.childList)
			} else {
				selectList.push({
					value: `${item.uuid}${Limit.TREE_JOIN_STR}${item.name}`,
					name: item.name
				})
			}
		})

		loop(treeList.toJS())

		return (
			<TableTree >
				<span>
					<Select
						showSearch
						className="table-right-table-input input-with-setting"
						optionFilterProp="children"
						placeholder="搜索类别"
						notFoundContent="无法找到相应科目"
						value={sonName}
						onSelect={value => {
							const info = value.split(Limit.TREE_JOIN_STR)
							const uuid = info[0]
							const name = info[1]
							dispatch(projectConfActions.getProjectCardListByType(parentUuid, uuid, name))
						}}
						showArrow={false}
					>
						{selectList.map((v, i) => <Select.Option key={i} value={v.value}>{v.name}</Select.Option>)}
					</Select>
					<Icon type="search" className="table-right-table-input-search"/>
					<Icon
						type="setting"
						className="icon-right-add-type"
						style={{color: editPermission ? '' : '#eee'}}
						onClick={()=> editPermission && openCardTypeModal()}
					/>
				</span>
				<div className="table-right-tree">
					<JxcTree
						dataList={treeList}
						currentSelectedKeys={[`${sonUuid}${Limit.TREE_JOIN_STR}${sonName}`]}
						onSelect={(info) => {
							let uuid = ''
							let name = ''
							if (info.length === 0) {
								uuid = sonUuid
								name = sonName
							} else {
								const value = info[0].split(Limit.TREE_JOIN_STR)
								uuid = value[0]
								name = value[1]
							}
							dispatch(projectConfActions.getProjectCardListByType(parentUuid, uuid, name))
						}}
					/>
				</div>
			</TableTree>
		)
	}
}
