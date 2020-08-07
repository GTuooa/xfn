import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as currencyMxbActions from 'app/redux/Mxb/CurrencyMxb/currencyMxb.action.js'

import Trees from './Trees.jsx'
import { Select, Icon }  from 'antd'
import * as thirdParty from 'app/thirdParty'
import { TableTree } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class TreeContain extends React.Component {
	render() {
		const {
			dispatch,
			currencyAcList,
			issuedate,
			endissuedate,
			selectedKeys,
			cascadeAclist,
			currentPage
		} = this.props

		return (
			<TableTree>
				<Select
					showSearch
					searchPlaceholder="搜索外币编码"
					className="table-right-table-input"
					optionFilterProp="children"
					notFoundContent="无法找到相应科目"
					onSelect={value => {
						dispatch(currencyMxbActions.changeTreeSelectedkeys(value))
						dispatch(currencyMxbActions.getFCDetailListFetch(issuedate, endissuedate, value,currentPage))
					}}
					showArrow={false}
					>
					{(currencyAcList : []).map((v, i) => <Option key={i} value={v.get('fcNumber')}>{v.get('fcNumber')}</Option>)}
				</Select>
				<Icon type="search" className="table-right-table-input-search"/>
				<div className="table-right-tree" style={{display: issuedate ? 'block' : 'none',paddingTop: '3px'}}>
					<Trees
						Data={cascadeAclist}
						selectedKeys={selectedKeys}
						onSelect={(info) => {
							if (info.length === 0 || info[0].indexOf('disable') === 0 )
								return
							dispatch(currencyMxbActions.changeTreeSelectedkeys(info[0]))

							const currentkeys = info[0]
							// const infoList = currentkeys.split('-')
							const infoList = currentkeys.split(Limit.TREE_JOIN_STR)

							let acid = '', assid = '', number = '', asscategory = ''

							if (infoList.length == 1) {
								number = infoList[0]
							} else if (infoList.length == 2) {
								number = infoList[0]
								acid = infoList[1]
							} else if (infoList.length == 4) {
								number = infoList[0]
								acid = infoList[1]
								assid = infoList[2]
								asscategory = infoList[3]
							}
							dispatch(currencyMxbActions.getFCDetailListFetch(issuedate, endissuedate, number, acid, asscategory, assid))
						}}
					/>
				</div>
			</TableTree>
		)
	}
}
