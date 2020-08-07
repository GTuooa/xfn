import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { TableWrap, TableAll, TableTitle, TableBody, TablePagination } from 'app/components'

import ItemRow from './ItemRow'
import TreeContain from './TreeContain'

import * as inventoryConfActions from 'app/redux/Config/Inventory/inventory.action.js'

@immutableRenderDecorator
export default
class Table extends React.Component {

	static displayName = 'InventoryConfTable'

	render() {
		const {
			dispatch,
			editPermission,
            activeTapKey,
            anotherTabName,
            cardList,
            cardSelectList,
            selectTypeId,
            selectTypeName,
            treeList,
			originTags,
            activeTapKeyUuid,
			showModal,
			showCardModal,
			searchContent,
			openQuantity,
			BATCH,
			Psi,
			currentPage,
			pageCount,
		} = this.props

        const type = activeTapKey === anotherTabName ?
		BATCH ? 'inventory-batch' : 'inventory'
		:
		BATCH ? 'inventory-small-batch' : 'inventory-small'
        const titleName = activeTapKey === anotherTabName ? '存货类别': `${activeTapKey}类别`

        let manageTitleList = openQuantity && Psi?
		BATCH?['编码','名称',`${titleName}`,'批次','启用组装','启/停用']:['编码','名称',`${titleName}`,'启用组装','启/停用']
		:['编码','名称',`${titleName}`,'启/停用']

        const titleList = openQuantity && Psi?
		BATCH?['编码','名称',`${titleName}`,'批次','启用组装','启/停用']:['编码','名称',`${titleName}`,'启用组装','启/停用']
		:['编码','名称',`${titleName}`]
		const currentItem = fromJS({'name': activeTapKey, 'uuid': activeTapKeyUuid})
        let selectUuidList = []
		cardSelectList.map((item,index) =>{
			selectUuidList.push(item.get('uuid'))
		})
        const selectAll = cardList.size > 0 ? cardList.every(v => selectUuidList.indexOf(v.get('uuid')) > -1) : false

		return (
            <TableWrap notPosition={true}>
                <TableAll type={activeTapKey === anotherTabName ? '' : 'running-config-two'} newTable="true">
                    <TableTitle
                        className={`${type}-tabel-width`}
                        hasCheckbox={true}
                        titleList={activeTapKey === anotherTabName ? manageTitleList : titleList}
                        onClick={() => dispatch(inventoryConfActions.selectCardAll(selectAll))}
                        selectAcAll={selectAll}
                    />
                    <TableBody>
                        {
                            cardList.filter(v => searchContent !== ''?v.get('name').indexOf(searchContent) > -1 || v.get('code').indexOf(searchContent) > -1: true).map((v, i) => {
                                return (
                                    <ItemRow
                                        key={i}
                                        line={i+1}
                                        item={v}
                                        dispatch={dispatch}
                                        className={`${type}-tabel-width`}
                                        checked={v.get('checked')}
                                        showLastLine={activeTapKey === anotherTabName ? true : false}
                                        showCardModal={showCardModal}
                                        editPermission={editPermission}
										originTags={originTags}
										openQuantity={openQuantity}
										BATCH={BATCH}
										Psi={Psi}
                                    />
                                )
                            })
                        }
                    </TableBody>
					<TablePagination
						currentPage={currentPage}
						pageCount={pageCount || 1}
						paginationCallBack={(value) => {
							activeTapKey === '全部'?
							dispatch(inventoryConfActions.refreshInventoryList(currentItem,value))
							:
							dispatch(inventoryConfActions.getInventoryCardListByType(activeTapKeyUuid, selectTypeId, selectTypeName,value))
						}}
					/>
                </TableAll>
                {
                    activeTapKey === anotherTabName ? null :
                    <TreeContain
                        editPermission={editPermission}
                        dispatch={dispatch}
                        treeList={treeList}
                        activeTapKeyUuid={activeTapKeyUuid}
                        selectTypeId={selectTypeId}
                        selectTypeName={selectTypeName}
                        openCardTypeModal={() => {
                            showModal()
                            dispatch(inventoryConfActions.beforeAddInventoryCardType(showModal))
                        }}
                    />
                }
            </TableWrap>
		)
	}
}
