import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { TableTree } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

import Trees from './Trees.jsx'

import * as lsqcActions	from 'app/redux/Config/Lsqc/lsqc.action.js'

@immutableRenderDecorator
export default
class TreeContains extends React.Component {

	static displayName = 'QCTreeContains'

	render() {

		const {
			dispatch,
			contactsCategory,
			curCategory,
			curModal,
			property,
			inventoryNature,
			showMemberList,
			searchCardContent,
			parent,
		} = this.props

		return (
			<div className={"table-tree-container"} style={{height:showMemberList.size > 5?'461px':'286px'}}>
				<div className="table-right-tree">
					<Trees
						category={contactsCategory}
						selectedKeys={[curCategory]}
						dispatch={dispatch}
						curModal={curModal}
						onSelect={value => {
							if(value[0]){
								const valueList = value[0].split(Limit.TREE_JOIN_STR)
								dispatch(lsqcActions.getContactsMember(curModal,valueList[1],sessionStorage.getItem('psiSobId'),property,valueList[0],inventoryNature,searchCardContent))
								parent.setState({
									selectTreeUuid: valueList[1],
									selectTreeLevel: valueList[0]
								})
							}

						}}
					/>
				</div>
            </div>
		)
	}
}
