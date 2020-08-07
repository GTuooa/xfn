import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Input, Select, Modal, Button } from 'antd'
const Option = Select.Option

@immutableRenderDecorator

class SelectAc extends React.Component {
	constructor() {
		super()
		this.state = {show: false}
	}

	render() {

		console.log('TableTit')

		const { acId, acName, lrAclist, onChange, className, tipText, disabled } = this.props
		const { show } = this.state

		return (
            <div>
                <Select
					className={className ? [className, 'jxc-config-modal-select'].join(' ') : 'jxc-config-modal-select'}
                    showSearch
					disabled={disabled}
                    optionFilterProp={"children"}
                    notFoundContent="无法找到相应科目"
					searchPlaceholder={tipText}
                    value={acId!=null ? acId && acId + '_' + acName : ''}
                    onChange={value => value || onChange(value)}
                    onSelect={onChange}
					onFocus={(e) => {
							this.setState({show: true});
						}
					}
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
export default SelectAc;