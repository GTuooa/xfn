import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as sobRoleActions from 'app/redux/Config/SobRole/sobRole.action.js'

import { Icon, Checkbox, Button, Radio, Tooltip }	from 'antd'

@immutableRenderDecorator
export default
class Title extends React.Component {

	render() {

        const { dispatch, roleModuleTemp, isSystem, isMidify, haveChanged} = this.props 

		return (
            <div className="sob-role-detail-title-wrap">
                <div className="sob-role-detail-title">
                    {roleModuleTemp.get('roleName')}
                </div>
                <Tooltip title={isSystem ? '账套管理员拥有全部权限，不可修改' : ''} placement="topRight">
                    <Button
                        disabled={isSystem || !haveChanged}
                        type="primary"
                        className="sob-role-detail-title-btn"
                        onClick={() => {
                            if (isMidify) {
                                dispatch(sobRoleActions.modifySobRoleModule())
                            }
                            // else {
                            //     dispatch(sobRoleActions.addSobRole())
                            // }
                        }}
                    >
                        保存
                    </Button>
                </Tooltip>
            </div>
		)
	}
}
