import React from 'react'
import './index.less'
import { fromJS, toJS } from 'immutable'
import * as thirdParty from 'app/thirdParty'

export default
class Radio extends React.Component{

	render() {
		const { list, value, onChange, className, disabled } = this.props
		// [{key: 'man', value: '男'}]
		let dataList = fromJS(list)
		return (
			<div className={['radio-group', className].join(' ')}>
				{
					dataList.map((v, i) => (
						<span key={i} className="radio-wrapper"
							style={{color: v.get('disabled') ? '#ccc' : ''}}
							onClick={() => {
								if (v.get('disabled') && v.get('message')) {
									return thirdParty.toast.info(v.get('message'), 2)
								}
								if (disabled ||  v.get('disabled')) {
									return
								}
								onChange(v.get('key'))
						}}>
							<span className={value == v.get('key') ? 'radio radio-selected' : 'radio'}>
								<span></span>
							</span>
							<span className="radio-text" style={{color: disabled && value != v.get('key') ? '#ccc' : ''}}>
								{v.get('value')}
							</span>
						</span>
					))
				}
			</div>
		)
	}
}
