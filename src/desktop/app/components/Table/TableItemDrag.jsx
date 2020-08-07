import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './table.less'
// import * as jxcCommonActions from 'app/actions/jxcConf/jxcCommon.action.js'

@immutableRenderDecorator
export default
class TableItemDrag extends React.Component{
	render() {
		const { type, className, line, modaltype, uuid,dispatch,heightAuto,droping,droped} = this.props
		const heightClass = heightAuto ? ' ' : ' table-item-height '

		return (
            <ul className={(line !== 'hide' && line%2 === 0) ? `${className}${heightClass}table-item-color table-item` : `${className}${heightClass}table-item`} style={{display: line !== 'hide' ? '' : 'none'}}
				draggable="true"
				onDragStart={(e) => {
					droping();
					dispatch(jxcCommonActions.drag(uuid,e))
				}}
				onDragOver={(e) => e.preventDefault()}
				onDrop={(e) => {
					droped();
					dispatch(jxcCommonActions.drop(modaltype,uuid,e))
				}}
				onDragEnd={(e) =>{
					droped();
				}}
			>
				{this.props.children}
			</ul>
		)
	}
}
