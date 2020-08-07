import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './tipwrap.less'

@immutableRenderDecorator
export default
class TipWrap extends Component {

    constructor() {
        super()
        this.state = {show: false}
    }

	render() {
		const { className, style } = this.props
        const { show } = this.state



		return (
            <ul
                className={className ? (show ? "form-tip" + ' ' + className : "form-tip form-tip-hide" + ' ' + className) : (show ? "form-tip" : "form-tip form-tip-hide")}
                style={style}
                onClick={() => this.setState({show: !show})}
                >
                <span className="form-tip-switch" style={{display: show ? 'none' : ''}}>展开</span>
                {this.props.children}
            </ul>
		)
	}
}
