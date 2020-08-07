import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import Trees from './Trees.jsx'
import { Select }  from 'antd'
import { Icon } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import * as assmxbActions from 'app/redux/Mxb/AssMxb/assMxb.action.js'

import { TableTree } from 'app/components'

@immutableRenderDecorator
export default
class TreeContain extends React.Component {

	constructor() {
		super()
		this.state = { isSearching: false}
	}

	render() {
		const {
			assmxbAclist,
			selectedKeys,
			dispatch,
			issuedate,
			endissuedate,
			cascadeAclist
		} = this.props
		const { isSearching } = this.state

		return (
			<TableTree>
				<Select
					showSearch
					searchPlaceholder="搜索辅助核算项目"
					className="table-right-table-input"
					optionFilterProp="children"
					notFoundContent="无法找到相应科目"
					onSelect={value => {
						if (!isSearching) {
							this.setState({isSearching: true})
							const info = value.split('_')
							// dispatch(assmxbActions.changeTreeSelectedkeys(info[0]))
							dispatch(assmxbActions.getreportassdetailFetch(issuedate, endissuedate, '', info[1], info[2],'','', '', '1', info[0], () => {
								this.setState({isSearching: false})
							}))
						}
					}}
					showArrow={false}
					>
					{assmxbAclist.map((v, i) => <Select.Option key={i} value={`${i}_${v.get('assid')}_${v.get('asscategory')}`}>{`${v.get('assid')} ${v.get('assname')}`}</Select.Option>)}
				</Select>
				<Icon type="search" className="table-right-table-input-search"/>
				<div className="table-right-tree" style={{paddingTop: '3px'}}>
					<Trees
						cascadeAclist={cascadeAclist}
						selectedKeys={selectedKeys}
						onSelect={(info) => {
							if (info.length === 0 || info[0].indexOf('disable') === 0)
								return
							// dispatch(assmxbActions.changeTreeSelectedkeys(info[0]))
							const currentkeys = info[0]

							let acid = ''
							let assid = ''
							let currentAssCategory = ''
							let assidTwo = ''
							let asscategoryTwo = ''
							let itemAssname = '全部'

							const infoList = currentkeys.split('-')

							if (infoList.length === 1) {
								assid = assmxbAclist.getIn([currentkeys, 'assid'])
								currentAssCategory = assmxbAclist.getIn([currentkeys, 'asscategory'])
							} else if (infoList.length === 2) {
								assid = assmxbAclist.getIn([infoList[0], 'assid'])
								currentAssCategory = assmxbAclist.getIn([infoList[0], 'asscategory'])
								acid = assmxbAclist.getIn([infoList[0], 'acDtoList', infoList[1], 'acid'])
							}else{
								assid = assmxbAclist.getIn([infoList[0], 'assid'])
								currentAssCategory = assmxbAclist.getIn([infoList[0], 'asscategory'])
								acid = assmxbAclist.getIn([infoList[0], 'acDtoList', infoList[1], 'acid'])
								assidTwo = assmxbAclist.getIn([infoList[0], 'acDtoList',infoList[1],'assList',infoList[2],'assid'])
								itemAssname = assmxbAclist.getIn([infoList[0], 'acDtoList',infoList[1],'assList',infoList[2],'assname'])
								asscategoryTwo = assmxbAclist.getIn([infoList[0], 'acDtoList', infoList[1], 'asscategoryTwo'])
							}
							dispatch(assmxbActions.getreportassdetailFetch(issuedate, endissuedate, acid, assid, currentAssCategory, assidTwo, asscategoryTwo, `${assidTwo}${Limit.TREE_JOIN_STR}${itemAssname}`, '1', info[0]))

						}}
					/>
				</div>
			</TableTree>
		)
	}
}
