import React from 'react';
import './checkbox.css';
import * as thirdParty from 'app/thirdParty'
export default
class Checkbox extends React.Component {

	render() {
		const { className, checkedColor, checked, onChange, disabled, disabledToast, ...other } = this.props;

		return (
			<span {...other} className={`${checked ? 'checkbox-checked' : 'checkbox-checkbox'}${className ? ' '+ className : ''}`}>
				<span className={`checkbox-inner ${disabled ? 'checkbox-inner-disable' : ''}`} style={checked ? {borderColor: checkedColor, backgroundColor: checkedColor} : {}}></span>
				<input
					type="checkbox"
					className={'checkbox-input'}
					checked={checked}
					onChange={(e)=>{
						if (disabled) {
							if (disabledToast) {
								thirdParty.toast.info(disabledToast,1)
							}
							return
						}
						if (onChange) {
							onChange(e)
						}
					}}
				/>
			</span>
		)
	}
}
