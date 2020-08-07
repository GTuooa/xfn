import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as sobRoleActions from 'app/redux/Config/SobRole/sobRole.action.js'

import { Icon, Checkbox, Button, Radio }	from 'antd'

@immutableRenderDecorator
export default
class CheckboxItem extends React.Component {

	render() {

        const { dispatch, moduleItem, moduleItemName, placement, disabled, name } = this.props
        
        // 长度大于3说明有前置权限， 前置权限关闭时不显示
        const style = placement.length > 3 ? {display: moduleItem.getIn([...placement.slice(0, -3), 'open']) ? '' : 'none'} :null

		return (
            <Checkbox
                checked={moduleItem.getIn(placement)}
                style={style ? style : {}}
                disabled={disabled}
                onClick={e => {
                    dispatch(sobRoleActions.setSobRoleModuleListValue([moduleItemName, ...placement], e.target.checked))
                }}
            >
                {name}
            </Checkbox>
		)
	}
}
