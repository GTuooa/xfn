import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as AmmxbActions from 'app/redux/Mxb/AmountMxb/amountMxb.action.js'
import * as Limit from 'app/constants/Limit.js'

import Trees from './Trees.jsx'
import { Select }  from 'antd'
import { Icon } from 'app/components'
import { TableTree } from 'app/components'

@immutableRenderDecorator
export default
class TreeContain extends React.Component {

	render() {

		const { dispatch, aclist,asslist, issuedate, cascadeAclist, currentAcid, assid, currentAsscategory, currentSupportPos, endissuedate, chooseperiods, assCategory, beSupport ,currentPage,pageCount} = this.props

		const selectTreeItem = assid ? `${currentAcid}${Limit.TREE_JOIN_STR}${assid}${Limit.TREE_JOIN_STR}${currentAsscategory}` : (currentAsscategory ? `${currentAcid}${Limit.TREE_JOIN_STR}asscategory${Limit.TREE_JOIN_STR}${currentAsscategory}` : `${currentAcid}`)
		// const selectTreeItem = assid ? `${currentAcid} ${assid} ${currentAsscategory}` : currentAcid

		return (
			<TableTree>
				<Select
					showSearch
					showArrow={false}
					searchPlaceholder="搜索辅助核算项目"
					className="table-right-table-input"
					optionFilterProp="children"
					notFoundContent="无法找到相应科目"
					onSelect={(value) =>{
						if (beSupport) {
							const assid = value.split(Limit.TREE_JOIN_STR)[0]
							const assname = value.split(Limit.TREE_JOIN_STR)[1]
							dispatch(AmmxbActions.getAssSubsidiaryLedgerFetch(issuedate, endissuedate, assCategory,'','',assid,assname,'', '', '', value.split(Limit.TREE_JOIN_STR)[2]),currentPage,pageCount)
						} else {
							dispatch(AmmxbActions.getSubsidiaryLedgerFetch(issuedate, endissuedate, parseInt(value) + ''))
						}
					}}
					>
					{
						beSupport?
						(issuedate ? asslist : []).map((v,i) => <Option key={i} value={`${v.get('assid')}${Limit.TREE_JOIN_STR}${v.get('assname')}${Limit.TREE_JOIN_STR}${i}`}>{`${v.get('assid')} ${v.get('assname')}`}</Option>)
						:
						(issuedate ? aclist : []).map((v, i) => <Option key={i} value={`${v.get('acid')}  ${v.get('acname')}`}>{`${v.get('acid')} ${v.get('acname')}`}</Option>)
					}
				</Select>
				<Icon type="search" className="table-right-table-input-search"/>
				<div className="table-right-tree" style={{display: issuedate ? 'block' : 'none',paddingTop: '3px'}}>
					<Trees
						data={aclist}
						cascadeAclist={cascadeAclist}
						dataKey={'acid'}
						dataValue={'acname'}
						currentAcid={selectTreeItem}
						beSupport={beSupport}
						currentSupportPos={currentSupportPos}
						onSelect={(info) => {
							if (info.length === 0)
								return
							if (beSupport) {
								if (info[0].indexOf('disable') > -1)
								return


								let acid = ''
								let acname = ''
								let assid = ''
								let assname = ''
								let assidTwo = ''
								let asscategoryTwo = ''
								let assidTwoName = ''
								const infoArr = info[0].split('-')
								if (infoArr.length === 1) {
									assid = asslist.getIn([infoArr[0],'assid'])
									assname = asslist.getIn([infoArr[0],'assname'])
								} else if (infoArr.length === 2) {
									assid = asslist.getIn([infoArr[0],'assid'])
									assname = asslist.getIn([infoArr[0],'assname'])
									acid = asslist.getIn([infoArr[0],'acDtoList',infoArr[1],'acid'])
									acname = asslist.getIn([infoArr[0],'acDtoList',infoArr[1],'acname'])
								} else if (infoArr.length === 3) {
									assid = asslist.getIn([infoArr[0],'assid'])
									assname = asslist.getIn([infoArr[0],'assname'])
									acid = asslist.getIn([infoArr[0],'acDtoList',infoArr[1],'acid'])
									acname = asslist.getIn([infoArr[0],'acDtoList',infoArr[1],'acname'])
									asscategoryTwo = asslist.getIn([infoArr[0],'acDtoList',infoArr[1],'assList',infoArr[2],'asscategory'])
									assidTwo = asslist.getIn([infoArr[0],'acDtoList',infoArr[1],'assList',infoArr[2],'assid'])
									assidTwoName = asslist.getIn([infoArr[0],'acDtoList',infoArr[1],'assList',infoArr[2],'assname'])
								}
								dispatch(AmmxbActions.getAssSubsidiaryLedgerFetch(issuedate, endissuedate, assCategory,acid,acname,assid,assname,assidTwo,asscategoryTwo,assidTwoName, info[0],currentPage,pageCount))
							} else {
								dispatch(AmmxbActions.getSubsidiaryLedgerFetch(issuedate, endissuedate, info[0] || currentAcid))

							}
						}}
					/>
				</div>
			</TableTree>
		)
	}
}
