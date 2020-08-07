import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Button, Modal, Radio, Checkbox } from 'antd'
const RadioGroup = Radio.Group

import AntdModal from './AntdModal'
// import thirdparty from 'app/utils/thirdparty'
import './exportmodal.less'

@immutableRenderDecorator
export default
class ExportModal extends React.Component{
    constructor() {
		super()
		this.state = {modalVisible: false, download: false, needA4: 'A4', needCreatedby: '1', needAss: '1'}
		// this.state = {visible: 0, download: false, needA4: 'A4', needCreatedby: '1', needAss: '1'}
	}

	render() {
        const { ddCallback, exportDisable, style, hrefUrl, title, tip, type, cxpzPDFddCallback, exportLogAction, urldownloadLog, className, hrefUrlValue, hrefUrlInitial, typeInitial, ddInitialCallback, openQuantity, enableWarehouse ,showHelpCenter, intelligentStatus} = this.props
        const { modalVisible, download, needA4, needCreatedby, needAss } = this.state

		return (
            <div className={className}>
                <span
                    className={title === '一键备份' ? `${exportDisable ? 'export-text-disable' : 'export-text'}` : `${exportDisable ? 'export-text-disable' : 'export-text'} setting-common-ant-dropdown-menu-item`}
                    style={style ? style : {}}
                    onClick={() => {
                        if (!exportDisable) {
                            if (exportLogAction) { // 前端埋点 ，弃用状态
                                exportLogAction()
                            }
                            this.setState({modalVisible: !modalVisible})
                        }
                    }}
                >{this.props.children}</span>
                <AntdModal
                    ddCallback={ddCallback}
                    exportDisable={exportDisable}
                    style={style}
                    hrefUrl={hrefUrl}
                    title={title}
                    tip={tip}
                    type={type}
                    cxpzPDFddCallback={cxpzPDFddCallback}
                    exportLogAction={exportLogAction}
                    urldownloadLog={urldownloadLog}
                    modalVisible={modalVisible}
                    onClosedModal={() => this.setState({modalVisible: !modalVisible})}
                    hrefUrlValue={hrefUrlValue}
                    hrefUrlInitial={hrefUrlInitial}
                    typeInitial={typeInitial}
                    ddInitialCallback={ddInitialCallback}
                    openQuantity={openQuantity}
					enableWarehouse={enableWarehouse}
                    showHelpCenter={showHelpCenter}
                    intelligentStatus={intelligentStatus}
                />
            </div>
		)
	}
}
