import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Input } from 'antd'
import { numberTest } from 'app/containers/Edit/EditRunning/common/common'
import { formatFour } from 'app/utils'

@immutableRenderDecorator
export default
class InuptFour extends React.Component{
	state = {
		formate:true
	}
	render() {
		const showZero = this.props.showZero || false
        const value = this.state.formate ?
		this.props.value && Number(this.props.value) ?formatFour(this.props.value,this.props.PointDisabled?0:2):''
		:this.props.value
		return (
            <Input
                {...this.props}
                value={value || ''}
				onFocus={(e) => {
					typeof this.props.onFocus === 'function' && this.props.onFocus(e)
					this.setState({formate:false},() => {
						this.nameInput && this.nameInput.select()

						})
				}}
				onBlur={(e)=> {
					typeof this.props.onBlur === 'function' && this.props.onBlur(e)
					this.setState({formate:true})
				}}
				ref={(node) => this.nameInput = node}
            />
		)
	}
}
