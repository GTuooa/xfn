import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { TableWrap, TableAll, TableTitle, TableBody, TablePagination } from 'app/components'

import ItemRow from './ItemRow'
import TreeContain from './TreeContain'

import * as relativeConfActions from 'app/redux/Config/Relative/relative.action.js'

@immutableRenderDecorator
export default
class Table extends React.Component {

	static displayName = 'RelativeConfTable'

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
			currentPage,
			pageCount
		} = this.props

        const type = activeTapKey === anotherTabName ? 'relative' : 'relative-small'

        const titleName = activeTapKey === anotherTabName ? '往来类别': `${activeTapKey}类别`
        const manageTitleList = ['编码','名称',`${titleName}`,'启/停用']
        const titleList = ['编码','名称',`${titleName}`,'启/停用']
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
                        onClick={() => dispatch(relativeConfActions.selectRelativeCardAll(selectAll))}
                        selectAcAll={selectAll}
                    />
                    <TableBody>
                        {
                            cardList.map((v, i) => {
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
							dispatch(relativeConfActions.refreshRelativeConfList(currentItem,value,searchContent))
							:
							dispatch(relativeConfActions.getRelativeCardListByType(activeTapKeyUuid, selectTypeId, selectTypeName,value,searchContent))
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
                            dispatch(relativeConfActions.beginAddProjectType(showModal))
                        }}
                    />
                }
            </TableWrap>
		)
	}
}
