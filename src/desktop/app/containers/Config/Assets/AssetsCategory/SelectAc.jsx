import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Input, Select, Modal, Button } from 'antd'
const Option = Select.Option

@immutableRenderDecorator
export default
class SelectAc extends React.Component {

	constructor() {
		super()
		this.state = {show: false}
	}

	render() {

		const { acId, acName, debitAssList, lrAclist, onChange, className, tipText } = this.props
		const { show } = this.state

		return (
            <div>
                <Select
					className={className ? className : ''}
                    showSearch
					allowClear={true}
                    optionFilterProp={"children"}
                    notFoundContent="无法找到相应科目"
					searchPlaceholder={tipText}
                    value={acId && acId + '_' + acName}
                    onChange={value => value || onChange(value ? value : '')}
                    onSelect={onChange}
					onFocus={() => this.setState({show: true})}
					onBlur={() => this.setState({show: false})}
                    >
                    {lrAclist.map((v, i) =>
                        <Option key={i} value={`${v.get('acid')} ${v.get('acname')}`}>
                            {`${v.get('acid')} ${v.get('acfullname')}`}
                        </Option>
                    )}
                </Select>
            </div>
		)
	}
}
