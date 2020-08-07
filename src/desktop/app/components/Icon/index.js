import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
// import styles from './icon.css'
import './icon.less'

@immutableRenderDecorator
export default
class Icon extends React.Component{
	render() {
		const { type, className, size, style, disabled, onClick } = this.props
		const disableStyle = disabled?{color:'#d9d9d9',cursor:'not-allowed'}:onClick?{cursor:'pointer'}:{}
		return (
			<i
				{...this.props}
				className={['icon', 'icon-' + type, className].join(' ')}
				style={Object.assign({fontSize: size && size + 'px'}, style, disableStyle)}
				onClick={e => {
					if (disabled) return
					typeof onClick === 'function' && onClick(e)
					}}
			></i>
		)
	}
}
