import React from 'react'
import { fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { TableWrap, TableBody, TableTitle, TableAll } from 'app/components'

import Item from './Item'
import ModifyModal from './ModifyModal'

import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@immutableRenderDecorator
export default class RunningConf extends React.Component {

	static displayName = 'RunningConf'

	componentDidMount() {

	}

	render() {
		const { dispatch, editPermission, taxRateTemp, runningCategory, flags, runningTemp, newJr, enableInventory, enableProject } = this.props

		const titleList = ['操作', '流水类别', '备注', '启/停用']
		const showModal = flags.get('showModal')
		const insertOrModify = flags.get('insertOrModify')
		const runningShowChild = flags.get('runningShowChild')
		const runningSelect = flags.get('runningSelect')

		// 构造显示的running item
		const loop = (data, leve, upperArr, disableList,isValid) => {
			let elementList = []
			data && data.forEach((item, i) => {
				if (item.get('childList').size || item.get('disableList').size) {
					const showChild = runningShowChild.indexOf(item.get('uuid')) > -1
					elementList.push(
						<div key={item.get('uuid')}>
							<Item
								leve={leve}
								className="accountConf-running-tabel-width"
								item={item}
								haveChild={true}
								showChild={showChild}
								line={leve <= 1 ? 0 : 1}
								upperArr={upperArr}
								checked={runningSelect.indexOf(item.get('uuid')) > -1}
								dispatch={dispatch}
								runningTemp={runningTemp}
								index={i}
								lastItemUuid={i > 0 ? data.getIn([i-1, 'uuid']):''}
								nextItemUuid={i !== data.size-1 ? data.getIn([i+1, 'uuid']):''}
								dataSize={data.size}
								runningSelect={runningSelect}
								isDisableList={!item.get('canUse')}
								isValid={isValid}
								editPermission={editPermission}

							/>
							{showChild ? loop(item.get('childList'), leve+1, upperArr.push(item.get('uuid')), item.get('disableList')) : ''}
						</div>
					)
				} else {
					elementList.push(
                        item.get('categoryType') !== 'LB_ZZ'?
                        <div key ={item.get('uuid')}>
							<Item
								key={item.get('uuid')}
								className="accountConf-running-tabel-width"
								item={item}
								line={leve <= 1 ? 0 : 1}
								leve={leve}
								upperArr={upperArr}
								checked={runningSelect.indexOf(item.get('uuid')) > -1}
								dispatch={dispatch}
								runningTemp={runningTemp}
								index={i}
								lastItemUuid={i > 0 ? data.getIn([i-1, 'uuid']):''}
								nextItemUuid={i !== data.size-1 ? data.getIn([i+1, 'uuid']):''}
								dataSize={data.size}
								runningSelect={runningSelect}
								isDisableList={!item.get('canUse')}
								isValid={isValid}
								editPermission={editPermission}
							/>
						</div> : null
					)
				}
			})
			if (disableList && disableList.size) {
				disableList.forEach((item, i) => {
				const showChild = runningShowChild.indexOf(item.get('uuid')) > -1
					if (item.get('disableList').size) {
						elementList.push(
							<div key ={item.get('uuid')}>
								<Item
									leve={leve}
									className="accountConf-running-tabel-width"
									item={item}
									showChild={showChild}
									haveChild={true}
									line={leve <= 1 ? 0 : 1}
									upperArr={upperArr}
									checked={runningSelect.indexOf(item.get('uuid')) > -1}
									dispatch={dispatch}
									runningTemp={runningTemp}
									dataSize={data.size}
									runningSelect={runningSelect}
									isDisableList={true}
									isValid={isValid}
									editPermission={editPermission}
								/>
								{showChild ? loop(item.get('childList'), leve+1, upperArr.push(item.get('uuid')), item.get('disableList')) : ''}
							</div>
						)
					}else{
						elementList.push(
							item.get('categoryType') !== 'LB_ZZ' ?
							<div key ={item.get('uuid')}>
								<Item
									key={item.get('uuid')}
									className="accountConf-running-tabel-width"
									item={item}
									line={leve <= 1 ? 0 : 1}
									leve={leve}
									upperArr={upperArr}
									checked={runningSelect.indexOf(item.get('uuid')) > -1}
									dispatch={dispatch}
									runningTemp={runningTemp}
									index={i}
									lastItemUuid={i > 0 ? data.getIn([i-1, 'uuid']):''}
									nextItemUuid={i !== data.size-1 ? data.getIn([i+1, 'uuid']):''}
									dataSize={data.size}
									runningSelect={runningSelect}
									isDisableList={true}
									isValid={isValid}
									editPermission={editPermission}
								/>
							</div> : null
						)
					}
				})
			}
			return elementList
		}

		return (
			<TableWrap className="ac-setUp">
				<TableAll>
					<TableTitle
						className="accountConf-running-tabel-width"
						hasCheckbox={true}
						titleList={titleList}
						disabled={true}
						selectAcAll={false}
					/>
					<TableBody>
						{loop(runningCategory.getIn([0, 'childList']), 1, fromJS([]),runningCategory.getIn([0, 'disableList']))}
					</TableBody>
				</TableAll>
				<ModifyModal
					flags={flags}
					dispatch={dispatch}
					showModal={showModal}
					insertOrModify={insertOrModify}
					runningTemp={runningTemp}
					taxRateTemp={taxRateTemp}
					runningCategory={runningCategory}
					editPermission={editPermission}
					newJr={newJr}
					enableInventory={enableInventory}
					enableProject={enableProject}
				/>
			</TableWrap>
		)
	}
}
