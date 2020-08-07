import React from 'react'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { TableWrap, TableBody, TableTitle, TableAll } from 'app/components'
import { Button, Modal, Input, message  } from 'antd'
import thirdParty from 'app/thirdParty'

import Item from './Item'

import * as warehouseConfigActions from 'app/redux/Config/warehouseConfig/warehouseConfig.action'
import * as accountConfigActions from 'app/redux/Config/AccountConfig/accountConfig.action'

@immutableRenderDecorator
export default
class Table extends React.Component {

	static displayName = 'AccountCongigTable'

	// static propTypes = {
	// 	allState: PropTypes.instanceOf(Map),
	// 	assmxbState: PropTypes.instanceOf(Map),
	// 	homeState: PropTypes.instanceOf(Map),
	// 	dispatch: PropTypes.func
	// }
	render() {
		// 构造显示的running item
		const {
			views,
			warehouseTemp,
			showModal
		} = this.props
		const showChild = views.get('showChild')
		const selectItem = views.get('selectItem')
		const cardList = warehouseTemp.get('cardList')
		const loop = (data, leve, upperArr, disableList) => {
			let elementList = []
			data && data.forEach((item, i) => {
				if (item.get('childList').size || item.get('disableList').size) {
					const ShowChild = showChild.indexOf(item.get('uuid')) > -1
					elementList.push(
						<div key={item.get('uuid')}>
							<Item
								leve={leve}
								className="warehouse-config-table-width"
								item={item}
								haveChild={true}
								showChild={ShowChild}
								upperArr={upperArr}
								checked={selectItem.indexOf(item.get('uuid')) > -1}
								dispatch={dispatch}
								index={i}
								lastItemUuid={i > 0 ? data.getIn([i-1, 'uuid']):''}
								nextItemUuid={i !== data.size-1 ? data.getIn([i+1, 'uuid']):''}
								dataSize={data.size}
								selectItem={selectItem}
								isDisableList={!item.get('canUse')}
								showModal={showModal}

							/>
							{ShowChild ? loop(item.get('childList'), leve+1, upperArr.push(item.get('uuid')), item.get('disableList')) : ''}
						</div>
					)
				} else {
					elementList.push(
                        <div key ={item.get('uuid')}>
							<Item
								key={item.get('uuid')}
								className="warehouse-config-table-width"
								item={item}
								leve={leve}
								upperArr={upperArr}
								checked={selectItem.indexOf(item.get('uuid')) > -1}
								dispatch={dispatch}
								index={i}
								lastItemUuid={i > 0 ? data.getIn([i-1, 'uuid']):''}
								nextItemUuid={i !== data.size-1 ? data.getIn([i+1, 'uuid']):''}
								dataSize={data.size}
								selectItem={selectItem}
								isDisableList={!item.get('canUse')}
								showModal={showModal}
							/>
						</div>
					)
				}
			})
			if (disableList && disableList.size) {
				disableList.forEach((item, i) => {
				const ShowChild = showChild.indexOf(item.get('uuid')) > -1
					if (item.get('disableList').size) {
						elementList.push(
							<div key ={item.get('uuid')}>
								<Item
									leve={leve}
									className="warehouse-config-table-width"
									item={item}
									showChild={ShowChild}
									haveChild={true}
									upperArr={upperArr}
									checked={selectItem.indexOf(item.get('uuid')) > -1}
									dispatch={dispatch}
									dataSize={data.size}
									selectItem={selectItem}
									isDisableList={true}
									showModal={showModal}
								/>
								{ShowChild ? loop(item.get('childList'), leve+1, upperArr.push(item.get('uuid')), item.get('disableList')) : ''}
							</div>
						)
					}else{
						elementList.push(
							<div key ={item.get('uuid')}>
								<Item
									key={item.get('uuid')}
									className="warehouse-config-table-width"
									item={item}
									leve={leve}
									upperArr={upperArr}
									checked={selectItem.indexOf(item.get('uuid')) > -1}
									dispatch={dispatch}
									index={i}
									lastItemUuid={i > 0 ? data.getIn([i-1, 'uuid']):''}
									nextItemUuid={i !== data.size-1 ? data.getIn([i+1, 'uuid']):''}
									dataSize={data.size}
									selectItem={selectItem}
									isDisableList={true}
									showModal={showModal}
								/>
							</div>
						)
					}
				})
			}
			return elementList
		}

		const { dispatch, selectAll, accountList, accountSelect, showEditModal } = this.props

		const titleList = ['操作','编码','名称','启/停用']

		return (
			<TableWrap notPosition={true}>
				<TableAll newTable="true">
					<TableTitle
						className='warehouse-config-table-width'
						hasCheckbox={true}
						titleList={titleList}
						selectAcAll={selectAll}
						disabled={true}
					/>
					<TableBody>
						{loop(cardList.getIn([0,'childList']),1,fromJS([]),cardList.getIn([0,'disableList']))}
					</TableBody>
				</TableAll>
			</TableWrap>
		)
	}
}
