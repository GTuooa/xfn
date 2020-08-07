import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Button, Select } from 'antd'
import './title.css'

@immutableRenderDecorator
export default
class Title extends React.Component{
	render() {
		const { issues, issuedate, onChange, onClick, ...rest } = this.props
		return (
			<div {...rest} className="title-title">
				<Select
					className={"title-date"}
					value={issuedate}
					onChange={onChange}
					>
					{issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
				</Select>
				<Button
					className={"title-right"}
					type="ghost"
					onClick={onClick}
					>
					刷新
				</Button>
				{this.props.children}
			</div>
		)
	}
}
// className={`"title" ${this.props.className? ' '+this.props.className : ''}`}
