import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as configActions from 'app/redux/Config/Ac/acConfig.action.js'
import { Checkbox, Button, message, Tooltip }	from 'antd'
import { Icon } from 'app/components'
import { TableItem, ItemTriangle, TableOver } from 'app/components'

@immutableRenderDecorator
export default
class AcItem extends React.Component {

	render() {

		const { acitem, dispatch, acidlist, idx, aclist, checked, acTags, acChildShow, acConfigRowClick, upperidList, isShow, line, className } = this.props

		const acid = acitem.get('acid');

		return (
			<TableItem line={line} className={className}>
				<li onClick={(e) => {
					e.stopPropagation()
					dispatch(configActions.selectAcItem(idx))
					}}>
					<Checkbox checked={checked}/>
				</li>
				<li>
					<Tooltip placement="topLeft" title={acitem.get('asscategorylist').size ? '该科目已关联辅助核算，不允许新增子科目' : (acitem.get('acid').length === 10 ? '该科目已经是末端科目，不允许新增子科目' : '')}>
						<Icon
							type="plus"
							className={acitem.get('asscategorylist').size || acitem.get('acid').length === 10 ? "acconfig-plus-disable" : 'acconfig-plus'}
							onClick={(e) => {
								e.stopPropagation()
								// if (aclist.some(v => !v.get('acid').indexOf(acid) && v.get('acid') !== acid ))
								// 	return alert('上级科目不存在，不允许新增子科目')
								// if (acitem.get('asscategorylist').size)
								// 	return message.warn('该科目已关联辅助核算，不允许新增子科目')
								// if (acitem.get('acid').length === 10)
								// 	return message.warn('该科目已经是末端科目，不允许新增子科目')
								if (aclist.some(v => !v.get('acid').indexOf(acid) && v.get('acid') !== acid ))
									return
								if (acitem.get('asscategorylist').size)
									return
								if (acitem.get('acid').length === 10)
									return

								if (acitem.get('acid').length === 4 && acChildShow.indexOf(acitem.get('acid')) === -1) {
									acConfigRowClick(acitem.get('acid'))
								}
								sessionStorage.setItem('changeAcInfo', true)
								let acid = Number(acitem.get('acid') + '01')
								aclist.forEach(v => v.get('acid') == acid ? acid++ : acid)
								dispatch(configActions.insertAcItem(acitem, acid))
							}}
						/>
					</Tooltip>
					{/* <Icon
						type="edit"
						className="acconfig-edit"
						onClick={(e) => {
							e.stopPropagation()
							const upper = aclist.find(v => v.get('acid') == acitem.get('upperid'))
							const nextac = aclist.some(v => !v.get('acid').indexOf(acid) && v.get('acid') !== acid )
							dispatch(configActions.modifyAcItem(acitem.set('nextac', nextac).set('upperinfo', upper ? upper.get('acid') + ' ' + upper.get('acname') : '')))
							dispatch(configActions.changeModalDisplay())
							sessionStorage.setItem('changeAcInfo', true)
						}}
					/> */}
				</li>
				{/* <li style={{textIndent: acitem.get('acid').length == 4 ? '0em' : "1em"}}>
					{acid}
					{
						upperidList.indexOf(acid) === -1 ? '' :
						<Icon
							className="kmyeb-triangle"
							onClick={() => acConfigRowClick(acid)}
							type={acChildShow.indexOf(acid) > -1 ? 'up' :'down'}
							style={{'color': '#666'}}>
						</Icon>
					}
				</li> */}
				<ItemTriangle
					paddingLeft={acitem.get('acid').length == 4 ? '' : '14px'}
					showTriangle={upperidList.indexOf(acid) !== -1}
					onClick={() => {
						if (upperidList.indexOf(acid) !== -1) {
							acConfigRowClick(acid)
						}
					}}
					showchilditem={acChildShow.indexOf(acid) > -1}
					className={upperidList.indexOf(acid) !== -1 ? 'haveChild' : 'notHave'}
					>
					{acid}
				</ItemTriangle>
				<TableOver
					textAlign="left"
					isLink={true}
					onClick={(e) => {
						e.stopPropagation()
						const upper = aclist.find(v => v.get('acid') == acitem.get('upperid'))
						const nextac = aclist.some(v => !v.get('acid').indexOf(acid) && v.get('acid') !== acid )
						dispatch(configActions.modifyAcItem(acitem.set('nextac', nextac).set('upperinfo', upper ? upper.get('acid') + ' ' + upper.get('acname') : '')))
						dispatch(configActions.changeModalDisplay())
						sessionStorage.setItem('changeAcInfo', true)
					}}>
					<span className="ac-config-hover">{acitem.get('acname')}</span>
				</TableOver>
				<li>{acitem.get('category')}</li>
				<li>{acitem.get('direction') == 'credit' ? '贷' : '借'}</li>
				<TableOver textAlign="left">{acitem.get('asscategorylist').reduce((prev, v) => prev + '/' + v)}</TableOver>
				{/* 外币 */}
				<TableOver textAlign='left'>
					{acitem.get('fcStatus') == '1' ?	 <Icon type="check" /> : ''}
				</TableOver>
				{/* 等于1表示他是一级科目且有下级科目开启了数量核算 */}
				<TableOver textAlign='left'>{
					acitem.get('upperAcunit') == '1' ?
					<Icon type="check" /> :
					(acitem.get('acunitOpen') == "1" ? acitem.get('acunit') : '')
				}</TableOver>
			</TableItem>
		);
	}
}
