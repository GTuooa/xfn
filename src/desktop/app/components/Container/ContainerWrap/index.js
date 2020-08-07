import React from 'react'
import PropTypes from 'prop-types'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './index.less'

@immutableRenderDecorator
class ContainerWrap extends React.Component{

	static displayName = 'ContainerWrap'

	static propTypes = {
		type: PropTypes.string.isRequired,
		className: PropTypes.string.isRequired,
	}

	render() {

		const { type, className, onClick } = this.props

		// type: 调节整个表格的最大最小值
		// 已有type： 设置页面统一 "config-one"

		return (
			<div className={`container-wrap container-width-${type} ${className}`} onClick={onClick}>
				{this.props.children}
			</div>
		)
	}
}

export default ContainerWrap