import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Input } from 'antd'
import { numberTest } from 'app/containers/Edit/EditRunning/common/common'
import { formatMoney } from 'app/utils'

@immutableRenderDecorator
export default
class NumberInput extends React.Component{
	state = {
		formate:true
	}
	render() {
		const showZero = this.props.showZero || false
		const formatValue = formateInput(this.props.value,showZero)
        const value = this.state.formate ?
						(!showZero ?
						!formatValue ? '' : formatMoney(formateInput(this.props.value,showZero),this.props.PointDisabled?0:2) :
						formatValue === 0 || formatValue ? formatMoney(formateInput(this.props.value,showZero),this.props.PointDisabled?0:2) : '' ):
						this.props.value
		return (
            <Input
                {...this.props}
                value={value || ''}
				onFocus={(e) => {
					typeof this.props.onFocus === 'function' && this.props.onFocus(e)
					this.setState({formate:false})
					setTimeout(() => {
						this.nameInput && this.nameInput.select()
						},0)
				}}
				onBlur={(e)=> {
					typeof this.props.onBlur === 'function' && this.props.onFocus(e)
					this.setState({formate:true})
				}}
				ref={(node) => this.nameInput = node}
            />
		)
	}
}
function formateInput (number,showZero) {
    if(!number ) {
        return showZero ? number === '' ? '' : '0' : ''
    }else if (number == '-') {
		return number
	}
    let negative = number < 0 ? "-" : ""
	number = number < 0 ?String(number).slice(1):String(number)
    let point = number.indexOf('.') > -1 ? '.':'',
        thousand = ',',
		smallNum = number.indexOf('.')>-1 ? number.slice(number.indexOf('.')+1) : '',
        i = number.slice(0,number.indexOf('.')>-1?number.indexOf('.'):number.length) + "",
        j = i.length > 3 ? i.length % 3 : 0;
        // if (smallNum.length > 2) {
        //     if (smallNum.slice(0,4).charAt(smallNum.length-1) === '0') {
        //         smallNum = smallNum.slice(0,3)
        //     } else {
        //         smallNum = smallNum.slice(0,4)
        //     }
        // }
        return negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + point + smallNum;

}
