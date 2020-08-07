import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Select } from 'antd'
const Option = Select.Option
import { toJS } from 'immutable'
import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'
import * as Limit from 'app/constants/Limit.js'

@immutableRenderDecorator
export default
class SelectAss extends React.Component {

	constructor() {
		super()
		this.state = {show: false}
	}

	render() {

		const { assid, assname, asscategory, allasscategorylist, onChange, className, dispatch } = this.props
		const { show } = this.state

        const selectAsslist = allasscategorylist.find(v => v.get('asscategory') === asscategory)

		return (
            <div>
                <Select
					combobox
					className={className ? className : ''}
					optionFilterProp={"children"}
					notFoundContent="无法找到相应科目"
					searchPlaceholder='必填，请选择辅助核算'
                    value={assid && assid + '' + assname}
                    onChange={value => value || onChange(value)}
					onSelect={value => onChange(value)}
					// onFocus={() => this.setState({show: true})}
					// onBlur={() => this.setState({show: false})}
					onBlur={() => this.setState({show: true})}
					onFocus={() => {
						const disableList = selectAsslist.get('asslist').filter(v => !v.get('disableTime'))
						if (!disableList.size && !show ) {
							dispatch(assetsActions.showAssDisableModal(asscategory))
						}
					}}
                    >
                    {
                        selectAsslist.get('asslist').filter(v => !v.get('disableTime')).map((v, i) =>
                            <Option key={i} value={`${v.get('assid')}${Limit.TREE_JOIN_STR}${v.get('assname')}`}>
                                {`${v.get('assid')} ${v.get('assname')}`}
                            </Option>
                        )
                    }
                </Select>
            </div>
		)
	}
}
