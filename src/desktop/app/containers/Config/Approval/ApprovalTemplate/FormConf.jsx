import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

// import * as Limit from 'app/constants/Limit.js'
import FormDiy from '../components/FormDiy'

import * as approvalTemplateActions from 'app/redux/Config/Approval/ApprovalTemplate/approvalTemplate.action.js'

@immutableRenderDecorator
class FormConf extends React.Component {

	render() {

		const { dispatch, formSetting, basicComponentList } = this.props

		const componentList = formSetting.get('componentList')
		
		return (
			<FormDiy
				componentList={componentList}
				basicComponentList={basicComponentList}
				addComponent={component => dispatch(approvalTemplateActions.addApprovalFormComponent(component))}
				deleteComponent={index => dispatch(approvalTemplateActions.deleteApprovalFormComponent(index))}
				adjustPosition={(fromPost, toPost) => dispatch(approvalTemplateActions.adjustPositionApprovalFormComponent(fromPost, toPost))}
				changeOptionString={(index, place, value) => dispatch(approvalTemplateActions.changeApprovalFormOptionString(['approvalTemp', 'formSetting', 'componentList', index, place], value))}
			/>
		)
	}
}

export default FormConf