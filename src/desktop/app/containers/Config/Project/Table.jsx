import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { TableWrap, TableAll, TableTitle, TableBody,TablePagination } from 'app/components'

import ItemRow from './ItemRow'
import TreeContain from './TreeContain'

import * as projectConfActions from 'app/redux/Config/Project/project.action.js'

@immutableRenderDecorator
export default
class Table extends React.Component {

	static displayName = 'ProjectConfTable'

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
			pageCount,
			parentUuid
		} = this.props

        const type = activeTapKey === anotherTabName ? 'project' : 'project-small'

        const titleName = activeTapKey === anotherTabName ? '项目性质': `${activeTapKey}类别`
        const proTitleList = ['编码','名称',`${titleName}`,'启/停用']
        const titleList = ['编码','名称',`${titleName}`]

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
                        titleList={activeTapKey === anotherTabName ? proTitleList : titleList}
                        onClick={() => dispatch(projectConfActions.selectProjectCardAll(selectAll))}
                        selectAcAll={selectAll}
                    />
                    <TableBody>
                        {
                            cardList
							// .filter(v => searchContent !== ''?v.get('name').indexOf(searchContent) > -1 || v.get('code').indexOf(searchContent) > -1: true)
							.map((v, i) => {
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
							const currentItem = fromJS({'name': activeTapKey, 'uuid': activeTapKeyUuid})
							if (!parentUuid) {
								dispatch(projectConfActions.refreshProjectList(currentItem,value,searchContent))
							} else {
								dispatch(projectConfActions.getProjectCardListByType(parentUuid, selectTypeId, selectTypeName,value,searchContent))

							}
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
                            dispatch(projectConfActions.beforeAddProjectCardType(showModal))
                        }}
                    />
                }
            </TableWrap>
		)
	}
}
