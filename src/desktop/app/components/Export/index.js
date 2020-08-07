import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Button, Modal, Radio, Tooltip } from 'antd'
// import thirdparty from 'app/utils/thirdparty'
import '../ExportModal/exportmodal.less'

import AntdModal from './AntdModal'

// PDF或Excel导出
@immutableRenderDecorator
export default
class Export extends React.Component{
    constructor() {
		super()
		this.state = { modalVisible: false }
	}

	render() {
        const {
            type,
            isAdmin,
            style,
            ddExcelCallback,
            ddPDFCallback,
            exportDisable,
            excelDownloadUrl,
            PDFDownloadUrl,
            excelVcDownloadUrl,
            ddExcelVcCallback,
            allddExcelCallback,
            allddPDFCallback,
            allexcelDownloadUrl,
            allPDFDownloadUrl,
            allKmyebPDFDownloadUrl,
            allKmyebDdPDFCallback,
            allAcMxPDFDownloadUrl,
            allAcMxDdPDFCallback,
            acMxSecondPDFDownloadUrl,
            acMxSecondDdPDFCallback,
            allAcMxSecondPDFDownloadUrl,
            allAcMxSecondDdPDFCallback,
            acMxLedgerExcelDownloadUrl,
            acMxLedgerDdExcelCallback,
            onErrorSendMsg,
            exportButtonName,
            exportDisableTips,
        } = this.props
        const { modalVisible } = this.state
        // console.log(this.props.exportDisable)

        const buttonName = exportButtonName ? exportButtonName : '导 出'
		return (
            <div>
                <Tooltip placement="topLeft" title={exportDisable ? exportDisableTips ? exportDisableTips :`${global.isplayground ? '游乐场不能导出数据' : '权限不足或没有可导出的数据'}` : ''}>
                    <span onClick={() => !exportDisable && this.setState({modalVisible: true})} className={exportDisable ? 'export-text-disable' : 'export-text'} style={style}>{buttonName}</span>
                    <AntdModal
                        modalVisible={modalVisible}
                        onClosedModal={() => this.setState({modalVisible: false})}
                        type={type}
                        isAdmin={isAdmin}
                        style={style}
                        ddExcelCallback={ddExcelCallback}
                        ddPDFCallback={ddPDFCallback}
                        exportDisable={exportDisable}
                        excelDownloadUrl={excelDownloadUrl}
                        PDFDownloadUrl={PDFDownloadUrl}
                        excelVcDownloadUrl={excelVcDownloadUrl}
                        ddExcelVcCallback={ddExcelVcCallback}
                        allddExcelCallback={allddExcelCallback}
                        allddPDFCallback={allddPDFCallback}
                        allexcelDownloadUrl={allexcelDownloadUrl}
                        allPDFDownloadUrl={allPDFDownloadUrl}
                        allKmyebPDFDownloadUrl={allKmyebPDFDownloadUrl}
                        allKmyebDdPDFCallback={allKmyebDdPDFCallback}
                        allAcMxPDFDownloadUrl={allAcMxPDFDownloadUrl}
                        allAcMxDdPDFCallback={allAcMxDdPDFCallback}
                        acMxSecondPDFDownloadUrl={acMxSecondPDFDownloadUrl}
                        acMxSecondDdPDFCallback={acMxSecondDdPDFCallback}
                        allAcMxSecondPDFDownloadUrl={allAcMxSecondPDFDownloadUrl}
                        allAcMxSecondDdPDFCallback={allAcMxSecondDdPDFCallback}
                        acMxLedgerExcelDownloadUrl={acMxLedgerExcelDownloadUrl}
                        acMxLedgerDdExcelCallback={acMxLedgerDdExcelCallback}
                        onErrorSendMsg={onErrorSendMsg}
                    >
                        {this.props.children}
                    </AntdModal>
                </Tooltip>
            </div>
		)
	}
}
