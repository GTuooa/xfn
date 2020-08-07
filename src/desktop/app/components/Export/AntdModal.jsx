import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Button, Modal, Radio, message } from 'antd'
// import thirdparty from 'app/utils/thirdparty'
import '../ExportModal/exportmodal.less'

import fetch from 'isomorphic-fetch'
import thirdParty from 'app/thirdParty'

const RadioGroup = Radio.Group;

// PDF或Excel导出
@immutableRenderDecorator

class AntdModal extends React.Component{
    constructor() {
		super()
		this.state = {valueFirst: 1, valueSecond: 1, download: false, valuePdfType: 1, valueAcType: 1}
	}
    componentWillReceiveProps(nextprops) {
        if (nextprops.type === 'first' && this.state.valueSecond === 2) {
            this.setState({valueSecond: 1})
        }
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
            modalVisible,
            onClosedModal,
            onErrorSendMsg,
        } = this.props
        const { valueFirst, valueSecond, download, valuePdfType, valueAcType } = this.state
        let href, ddCallback

        const PDFSelect = valueSecond === 2 || !isAdmin
        const excelSelect = isAdmin && valueSecond === 1

        if (!type) {
            // 最平常的状态  Excel PDF
            if (excelSelect) {
                href = excelDownloadUrl
                ddCallback = ddExcelCallback
            } else {
                href = PDFDownloadUrl
                ddCallback = ddPDFCallback
            }

        } else if (type === 'first') { // 科目余额表
            // 阿米巴   Excel
            if (excelSelect) {
                href = excelDownloadUrl
                ddCallback = ddExcelCallback
            }

        } else if (type === 'second') { // 科目余额表
            // 科目余额表   Excel   Pdf:  科目余额表、 凭证汇总表
            if (excelSelect) {
                href = excelDownloadUrl
                ddCallback = ddExcelCallback
            } else {
                ({
                    1: () => {
                        href = PDFDownloadUrl
                        ddCallback = ddPDFCallback
                    },
                    2: () => {
                        href = allKmyebPDFDownloadUrl
                        ddCallback = allKmyebDdPDFCallback
                    }
                }[valuePdfType])()
            }

        } else if (type === 'third') {
            // 科目明细表 Excel： 当前明细、 所有明细  总账    Pdf: 当前明细
                                                           //  所有明细   一级科目 二级科目
                                                           //  总账    一级科目 二级科目
            if (excelSelect) {
                ({
                    1: () => {
                        // href = excelDownloadUrl
                        // ddCallback = ddExcelCallback
                        ({
                            1: () => {
                                href = excelDownloadUrl
                                ddCallback = ddExcelCallback
                            },
                            2: () => {
                                href = excelVcDownloadUrl
                                ddCallback = ddExcelVcCallback
                            }
                        }[valueAcType])()
                    },
                    2: () => {
                        href = allexcelDownloadUrl
                        ddCallback = allddExcelCallback
                    },
                    3: () => {
                        href = acMxLedgerExcelDownloadUrl
                        ddCallback = acMxLedgerDdExcelCallback
                    }
                }[valueFirst])()
            } else {
                ({
                    1: () => {
                        href = PDFDownloadUrl
                        ddCallback = ddPDFCallback
                    },
                    2: () => { // 所有明细
                        ({
                            1: () => {
                                href = allAcMxPDFDownloadUrl
                                ddCallback = allAcMxDdPDFCallback
                            },
                            2: () => {
                                href = acMxSecondPDFDownloadUrl
                                ddCallback = acMxSecondDdPDFCallback
                            }
                        }[valueAcType])()
                    },
                    3: () => { // 总账
                        ({
                            1: () => {
                                href = allPDFDownloadUrl
                                ddCallback = allddPDFCallback
                            },
                            2: () => {
                                href = allAcMxSecondPDFDownloadUrl
                                ddCallback = allAcMxSecondDdPDFCallback
                            }
                        }[valueAcType])()
                    }
                }[valueFirst])()
            }

        } else if (type === 'fourth') {
            // 数量明细表， 辅助核算明细表  Excel： 当前明细、 所有明细   Pdf:  当前明细
            if (excelSelect) {
                ({
                    1: () => {
                        href = excelDownloadUrl
                        ddCallback = ddExcelCallback
                    },
                    2: () => {
                        href = allexcelDownloadUrl
                        ddCallback = allddExcelCallback
                    }
                }[valueFirst])()
            } else {
                href = PDFDownloadUrl
                ddCallback = ddPDFCallback
            }
        } else if (type === 'fifth') {
            // 数量明细表， 辅助核算明细表  Excel： 当前明细、 所有明细   Pdf:  当前明细
            if (excelSelect) {
                ({
                    1: () => {
                        href = excelDownloadUrl
                        ddCallback = ddExcelCallback
                    },
                    2: () => {
                        href = allexcelDownloadUrl
                        ddCallback = allddExcelCallback
                    }
                }[valueFirst])()
            }
            // else {
            //     href = PDFDownloadUrl
            //     ddCallback = ddPDFCallback
            // }
        }

        const exportContain = ({
            // 科目余额表
            'second': () => {
                return <li style={{display: PDFSelect  ? '' : 'none'}}>
                    <span>导出内容：</span>
                    <RadioGroup onChange={(e) => this.setState({valuePdfType: e.target.value})} value={valuePdfType}>
                        <Radio value={1}>科目余额表</Radio>
                        <Radio value={2}>凭证汇总表</Radio>
                    </RadioGroup>
                </li>
            },
            'third': () => {
                return <li>
                    <span>导出内容：</span>
                    <RadioGroup onChange={(e) => this.setState({valueFirst: e.target.value})} value={valueFirst}>
                        <Radio value={1}>当前明细</Radio>
                        <Radio value={2}>所有明细</Radio>
                        {/* <Radio value={3} style={{display: PDFSelect ? '' : 'none'}}>总账</Radio> */}
                        <Radio value={3}>总账</Radio>
                    </RadioGroup>
                </li>
            },
            'fourth': () => {
                return <li>
                    <span>导出内容：</span>
                    <RadioGroup onChange={(e) => this.setState({valueFirst: e.target.value})} value={valueFirst}>
                        <Radio value={1}>当前明细</Radio>
                        <Radio value={2} style={{display: PDFSelect ? 'none' : ''}}>所有明细</Radio>
                    </RadioGroup>
                </li>
            },
            'fifth': () => {
                return <li>
                    <span>导出内容：</span>
                    <RadioGroup onChange={(e) => this.setState({valueFirst: e.target.value})} value={valueFirst}>
                        <Radio value={1}>当前明细</Radio>
                        <Radio value={2} style={{display: PDFSelect ? 'none' : ''}}>所有明细</Radio>
                    </RadioGroup>
                </li>
            },

        }[type] || (() => {}))()

        const moreContain = ({
            // 科目余额表
            'third': () => {
                if (PDFSelect && (valueFirst === 2 || valueFirst === 3)) {
                    return <li>
                        <span>导出内容：</span>
                        <RadioGroup onChange={(e) => this.setState({valueAcType: e.target.value})} value={valueAcType}>
                            <Radio value={1}>一级科目</Radio>
                            <Radio value={2}>二级科目</Radio>
                        </RadioGroup>
                    </li>
                } else if (excelSelect && valueFirst === 1) {
                    return <li>
                        <span>导出内容：</span>
                        <RadioGroup onChange={(e) => this.setState({valueAcType: e.target.value})} value={valueAcType}>
                            <Radio value={1}>分录</Radio>
                            <Radio value={2}>凭证</Radio>
                        </RadioGroup>
                    </li>
                }
            }
        }[type] || (() => {}))()

        const patternContain = (() => {
            // 不是管理员时，且不是阿米巴表时
            if (!isAdmin) {
                return <RadioGroup value={2}>
                    <Radio value={2}>PDF</Radio>
                </RadioGroup>
            } else {
                if (type === 'first') {
                    return <RadioGroup value={1}>
                        <Radio value={1}>Excel</Radio>
                    </RadioGroup>
                } else if (type === 'third') {
                    return <RadioGroup onChange={(e) => this.setState({valueSecond: e.target.value})} value={valueSecond}>
                        {/* <Radio value={1} disabled={valueFirst === 3}>Excel</Radio> */}
                        <Radio value={1}>Excel</Radio>
                        <Radio value={2}>PDF</Radio>
                    </RadioGroup>
                } else if (type === 'fourth') {
                    return <RadioGroup onChange={(e) => this.setState({valueSecond: e.target.value})} value={valueSecond}>
                        <Radio value={1}>Excel</Radio>
                        <Radio value={2} disabled={valueFirst === 2}>PDF</Radio>
                    </RadioGroup>
                } else if (type === 'fifth') {
                    return <RadioGroup onChange={(e) => this.setState({valueSecond: e.target.value})} value={valueSecond}>
                        <Radio value={1}>Excel</Radio>
                    </RadioGroup>
                } else {
                    return <RadioGroup onChange={(e) => this.setState({valueSecond: e.target.value})} value={valueSecond}>
                        <Radio value={1}>Excel</Radio>
                        <Radio value={2}>PDF</Radio>
                    </RadioGroup>
                }
            }
        })()

		return (
            <Modal
                visible={modalVisible}
                title={'温馨提示'}
                onCancel={() => {
                    onClosedModal()
                }}
                footer={[
                    <a
                        className='export-download'
                        style={{display: download ? 'none' : ''}}
                        key="cancel"
                        // href={href}
                        onClick={() => {
                            this.setState({download: true})
                            setTimeout(() => this.setState({download: false}), 15000)


                            const option = {
                                credentials: 'include'
                            }
                            fetch(href, option)
                            .then(res => {
                                if (res.status === 200) {
                                    return res.json()
                                } else {
                                    return {
                                        code: '-2',
                                        message: `通信异常，服务器返回码${res.status}`
                                    }
                                }
                            })
                            .catch(err => {
                                // console.log(err);
                                window.location.href = href
                            }).then(json => {
                                if (json) {
                                    if (json.code) {
                                        thirdParty.Alert(json.message)
                                        return false
                                    }
                                }
                            })
                        }}
                        >
                        下载至本地
                    </a>,
                    <a
                        className='export-download export-download-wait'
                        style={{display: download ? '' : 'none'}}
                        key="wait"
                        >
                        请等待
                    </a>,
                    <a
                        key="ok"
                        // type='ghost'
                        className='export-download'
                        onClick={() => {
                            // 导出到联系人
                            // thirdparty.choose({
                            //     multiple: true,
                            //     users: [],
                            //     max: 1500,
                            //     onSuccess: (resultlist) => {
                            //         resultlist = resultlist.map(v => {
                            //             v.emplId = v.emplId.toString()
                            //             return v.emplId
                            //         })
                            //         ddCallback(resultlist)
                            //         this.setState({modalVisible: false})
                            //     },
                            //     onFail: (err) => {
                            //         thirdparty.alert("此功能尚不稳定请回到首页刷新")
                            //     }
                            // })
                            if (!ddCallback) {
                                onErrorSendMsg(type, valueFirst, valueSecond)
                                message.error('发至我的“工作通知”异常，已通知开发人员')
                            }

                            ddCallback && ddCallback('')
                            // this.setState({modalVisible: false})
                            onClosedModal()
                        }}>
                        发至我的“工作通知”
                    </a>
                ]}
                >
                <ul className="export-tiplist-tip">
                    <li>当导出数据较多时，生成文件耗时较长，建议选择‘发至我的“工作通知”’，文件生成后将以消息的形式发送给您。</li>
                    <li>{this.props.children}</li>
                </ul>
                <ul className="export-radiogroup">
                    <li>
                        <span>导出方式：</span>
                        {patternContain}
                    </li>
                    {exportContain}
                    {moreContain}
                </ul>
            </Modal>
		)
	}
}

export default AntdModal;