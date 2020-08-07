import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Checkbox } from 'antd'
import './table.less'
// import * as jxcCommonActions from 'app/actions/jxcConf/jxcCommon.action.js'

@immutableRenderDecorator
export default
class TableTitleDrag extends React.Component{

	render() {
		const { type, className, titleList, hasCheckbox, onClick, selectAcAll, uuid, modaltype, dispatch, droped} = this.props

		// console.log('TableTitle---')

		return (
			<div className="table-title-wrap"
                onDragOver={(e) => e.preventDefault()}
				onDrop={(e) => {
                    droped();
                    dispatch(jxcCommonActions.drop(modaltype,uuid,e))
                }}
            >
				<ul className={className ? `${className} table-title` : "table-title"}>
					{hasCheckbox ?
						<li onClick={onClick} key={0}>
							<Checkbox checked={selectAcAll}/>
						</li>
						: ''
					}
					{titleList.map((v, i) => <li key={i+1}>{<span>{v}</span>}</li>)}
				</ul>
			</div>
		)
	}
}
