import React from 'react'
import PropTypes from 'prop-types'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { TableWrap, TableBody, TableTitle, TableAll, TablePagination } from 'app/components'
import { Button, Modal, Input, message  } from 'antd'
import thirdParty from 'app/thirdParty'

import Item from './Item'

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

		const {
			dispatch,
			selectAll,
			accountList,
			disableList,
			accountSelect,
			showEditModal,
			editPermission,
			pageCount,
			currentPage
			} = this.props
		const titleList = ['账户名称', '账户类型', '账户', '银行卡号', '开户行/机构','启/停用']

		return (
			<TableWrap notPosition={true}>
				<TableAll newTable="true">
					<TableTitle
						className='account-config-table-width account-config-table-title-justify'
						hasCheckbox={true}
						titleList={titleList}
						onClick={() => dispatch(accountConfigActions.selectOrUnselectAccountAll(selectAll))}
						selectAcAll={selectAll}
					/>
					<TableBody>
						{accountList.map((item, i) => {
							return <Item
								className='account-config-table-width'
								key={i}
								item={item}
								line={i}
								checked={accountSelect.indexOf(item.get('uuid')) > -1}
								dispatch={dispatch}
								showEditModal={showEditModal}
								listSize={accountList.size}
								lastItemUuid={accountList.getIn([i-1,'uuid'])}
								nextItemUuid={accountList.getIn([i+1,'uuid'])}
								editPermission={editPermission}
							/>
						})}
						{(disableList || []).map((item, i) => {
							return <Item
								className='account-config-table-width'
								key={i}
								item={item}
								line={i}
								checked={accountSelect.indexOf(item.get('uuid')) > -1}
								dispatch={dispatch}
								showEditModal={showEditModal}
								listSize={disableList.size}
								lastItemUuid={accountList.getIn([i-1,'uuid'])}
								nextItemUuid={accountList.getIn([i+1,'uuid'])}
								isDisabled={true}
								editPermission={editPermission}
							/>
						})}

					</TableBody>
					<TablePagination
						currentPage={currentPage}
						pageCount={pageCount || 1}
						paginationCallBack={(value) => {
							dispatch(accountConfigActions.getRunningAccount(value))
						}}
					/>
				</TableAll>
			</TableWrap>
		)
	}
}
