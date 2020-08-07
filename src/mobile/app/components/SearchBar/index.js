import React from 'react'
import './index.less'
import { fromJS, toJS } from 'immutable'
import * as thirdParty from 'app/thirdParty'

import { SearchBar } from 'antd-mobile';

export default
class SearchBarIndex extends React.Component{

	render() {
		const { placeholder, value, onChange, onSubmit, disabled, onCancel, onClear } = this.props
		// [{key: 'man', value: '男'}]
        
        
		return (
            <SearchBar
                disabled={disabled}
                placeholder={placeholder}
                value={value}
                onSubmit={onSubmit}
                onChange={onChange}
                showCancelButton={true}
                onCancel={onCancel}
                onClear={onClear}
                // ref={ref => this.manualFocusInst = ref}
            />
        )
	}
}
