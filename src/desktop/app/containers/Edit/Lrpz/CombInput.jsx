import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'

import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class CombInput extends React.Component {

	componentDidMount () {
		if(this.props.showAmount){    //切换贷借方金额
			this.refs[this.props.id].addEventListener('keydown', () => this.props.onKeyDown(), false)
		}
		if (this.props.id === 'abstract-0') {
			this.refs[this.props.id].focus()
		}

		if (this.props.isInsert === 'true') {	//判断是否是执行插入分录，是-->焦点聚焦
			this.refs[this.props.id].focus()
			this.refs[this.props.id].select()
		}
	}

	componentDidUpdate(prevProps) {
		// if (this.props.focus && sessionStorage.getItem('lrpzHandleMode') == 'insert'){
		if (this.props.focus){
			this.refs[this.props.id].focus()
		}

		// 复制
		if (this.props.copy && (this.props.copy != prevProps.copy)) {
			this.refs[this.props.id].select()
		}
	}

	render() {

		const {
			className,
			id,
			style,
			value,
			focus,
			showAmount,
			amountValue,
			onChange,
			onBlur,
			onClick,
			assDropListFull,
			focusClick,
			onKeyDown,
			copy,
			isInsert
		} = this.props

		const color = {color: showAmount && value < 0 ? 'red' : 'black'}
		const displayElement = !showAmount ? value : (<ul className="voucher-amount">{amountValue.map((w, j) => <li key={j} style={color}>{w}</li>)}</ul>)

		return (
			<div
				className={`combinput${className ? ' ' + className : ''}`}
				onClick={() => {
					if (onClick){
						onClick()
					}
					if (!focus){
						this.refs[id].select()
					}
					if (!focus){
						focusClick(id)
					}
				}}>
				<div className="text-show-wrap">
					<div className="text-show">
						<span>
							{displayElement}
						</span>
					</div>
				</div>
				<input
					type="text"
					className="combinput-input"
					autoComplete="off"
					ref={id}
					value={value}
					onChange={e => onChange(e)}
					onBlur={(e) => onBlur(e)}
					style={ style}

				/>
			</div>
		)
	}
}
