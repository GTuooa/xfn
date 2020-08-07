import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Checkbox } from 'antd'
import { XfnIcon } from 'app/components'

import * as lsqcActions	from 'app/redux/Config/Lsqc/lsqc.action.js'

@immutableRenderDecorator
export default
class TableTitle extends React.Component{

	render() {
		const { dispatch, className, isShow } = this.props

		return (
			<div className="table-title-wrap">
				<ul className={className ? `${className} table-title` : "table-title"}>

					<li >
                        <span style={{marginRight: '5px'}}>类别</span>
                        <span onClick={() => {
                            dispatch(lsqcActions.initAllShow(!isShow))
                        }}>
                            <XfnIcon type={isShow ? 'kmyeUp' : 'kmyeDown'} style={{color:'#999'}}/>
                        </span>
                    </li>
					<li ><span>资产</span></li>
					<li ><span>负债和权益</span></li>
					<li ><span>操作</span></li>
				</ul>
			</div>
		)
	}
}
