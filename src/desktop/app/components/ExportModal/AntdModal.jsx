import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Button, Modal, Radio, Checkbox, message } from 'antd'
import fetch from 'isomorphic-fetch'
import * as thirdParty from 'app/thirdParty'
import './exportmodal.less'
const RadioGroup = Radio.Group;
function chooseLib(callback) {
	thirdParty.choose({
		// startWithDepartmentId: 0,
		multiple: false,
		users: [],
		max: 1500,
		onSuccess: (resultlist) => {
			callback(resultlist)
		},
		onFail: (err) => {
			// thirdParty.Alert('获取钉钉通讯录失败，请刷新后重试')
		}
	})
}
@immutableRenderDecorator
export default
class ExportModal extends React.Component{
    constructor() {
		super()
		this.state = {
            download: false,
            needA4: 'A4',
            needCreatedby: '1',
            needAss: '1',
            valueSurvival: 1,
            needReviewedBy:true,
            reviewedBy:''
        }
	}

	render() {
        const { ddCallback, exportDisable, style, title, tip, type, cxpzPDFddCallback, hrefUrl, exportLogAction, urldownloadLog, modalVisible, onClosedModal, ddInitialCallback,hrefUrlValue, hrefUrlInitial, typeInitial, openQuantity, enableWarehouse, showHelpCenter, intelligentStatus} = this.props
        const { download, needA4, needCreatedby, needAss, valueSurvival, needReviewedBy, reviewedBy } = this.state
        let href
        if (valueSurvival === 1 && typeInitial === 'stoke') {
            href = hrefUrlValue
        } else if (valueSurvival === 2 && typeInitial === 'stoke') {
            href = hrefUrlInitial
        } else {
            href = hrefUrl
        }
		return (
            <Modal
                visible={modalVisible}
                title={title ? title : '温馨提示'}
                onCancel={() => {
                    onClosedModal()
                }}
                footer={[
                    <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between'}}>
                        <div>
                            <a className="export-help-center" style={{display:showHelpCenter ?"":'none'}} target="_blank" href='https://www.xfannix.com/support/desktop/app/index.html?id=8.5#/sysc'>
                                帮助中心
                            </a>
                        </div>
                        <div>
                            {/* <a
                                className='export-download'
                                key="cancel"
                                style={{display: download ? 'none' : ''}}
                                // href={type === 'cxpzPDF' ? `${hrefUrl}&needCreatedby=${needCreatedby}&needA4=${needA4}&needAss=${needAss}` : hrefUrl}
                                href={type === 'cxpzPDF' ? `${hrefUrl}&needCreatedby=${needCreatedby}&needA4=${needA4}&needAss=${needAss}` : href}
                                onClick={() => {
                                    this.setState({download: true})
                                    setTimeout(() => this.setState({download: false}), 15000)
                                    if (urldownloadLog) {
                                        urldownloadLog(needA4, needCreatedby)
                                    }
                                }}
                                >
                                下载至本地
                            </a> */}
                            <a
                                className='export-download'
                                style={{display: download ? 'none' : ''}}
                                key="cancel"
                                // href={href}
                                onClick={() => {
                                    this.setState({download: true})
                                    setTimeout(() => this.setState({download: false}), 15000)

                                    const hrefDownload = type === 'cxpzPDF' ?
                                    intelligentStatus?
                                    `${hrefUrl}&needCreatedby=${needCreatedby}&needA4=${needA4}&needReviewedBy=${needReviewedBy?'1':'0'}&reviewedBy=${reviewedBy}`
                                    :
                                    `${hrefUrl}&needCreatedby=${needCreatedby}&needA4=${needA4}&needAss=${needAss}`
                                    : href
                                    const option = {
                                        credentials: 'include'
                                    }
                                    fetch(hrefDownload, option)
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
                                        window.location.href = hrefDownload
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
                            </a>
                            <a
                                className='export-download export-download-wait'
                                style={{display: download ? '' : 'none'}}
                                key="wait"
                                >
                                请等待
                            </a>
                            <a
                                key="ok"
                                className='export-download'
                                // type='ghost'
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
                                    //         if (type === 'cxpzPDF') {
                                    //             cxpzPDFddCallback(resultlist, needA4, needCreatedby)
                                    //         } else {
                                    //             ddCallback(resultlist)
                                    //         }
                                    //         this.setState({modalVisible: false})
                                    //     },
                                    //     onFail: (err) => {
                                    //         thirdparty.alert("此功能尚不稳定请回到首页刷新")
                                    //     }
                                    // })
                                    if (type === 'cxpzPDF') {
										if (intelligentStatus) {
											if (needReviewedBy && !reviewedBy) {
												message.info('审核人必填，仅可选择1人')
												return
											} else {
												cxpzPDFddCallback('', needA4, needCreatedby, needReviewedBy?'1':'0',reviewedBy)
											}
										} else {
											cxpzPDFddCallback('', needA4, needCreatedby, needAss)
										}
                                    } else if (valueSurvival === 2) {
                                        ddInitialCallback('')
                                    } else {
                                        ddCallback('')
                                    }
                                    // this.setState({modalVisible: false})
                                    onClosedModal()
                                }}>
                                发至我的“工作通知”
                            </a>
                        </div>
                    </div>,
                ]}
                >
                <ul className="export-tiplist">
                    <li>{tip}</li>
                    <li>当导出数据较多时，生成文件耗时较长，建议选择‘发至我的“工作通知”’，文件生成后将以消息的形式发送给您。</li>
                    {
                        type === 'cxpzPDF' ?
                            <div className="export-radiogroup">
                                <div>
                                    <RadioGroup onChange={(e) => this.setState({needA4: e.target.value})} value={needA4}>
                                        <div>一页两张：<Radio value={'A4'}>A4</Radio></div>
                                        <div>一页一张：
                                            <Radio value={'A5'}>A5</Radio>
                                            <Radio value={'1224'}>12*24</Radio>
                                            <Radio value={'1424'}>14*24（发票尺寸）</Radio>
                                        </div>
                                    </RadioGroup>
                                </div>
                                {
                                    !intelligentStatus?
                                    <div>
                                        <Checkbox className="export-checkbox" checked={needCreatedby === "1"} onChange={() => needCreatedby === "1" ? this.setState({needCreatedby: '0'}) : this.setState({needCreatedby: '1'})}/>打印“制单人”、“审核人”姓名
                                    </div>:''
                                }

                                {
                                    !intelligentStatus?
                                    <div>
                                        <Checkbox className="export-checkbox" checked={needAss === "1"} onChange={() => needAss === "1" ? this.setState({needAss: '0'}) : this.setState({needAss: '1'})}/>打印辅助核算
                                    </div>:''
                                }
                                {
                                    intelligentStatus?
                                    <div style={{margin:'12px 0'}}>
                                         <Checkbox checked={needCreatedby === "1"} onChange={() => needCreatedby === "1" ? this.setState({needCreatedby: '0'}) : this.setState({needCreatedby: '1'})}>
                                            打印制单人
                                         </Checkbox>
                                    </div>:''
                                }

                                {
                                    intelligentStatus?
                                    <div style={{marginBottom:'12px',display:'flex',lineHeight:'28px'}}>
                                         <Checkbox checked={needReviewedBy} onChange={() => {
                                             this.setState({needReviewedBy: !needReviewedBy})
                                         }}>
                                            打印审核人
                                         </Checkbox>
                                         {
                                             needReviewedBy?
                                             <div
                                             className='print-name'
                                             style={{flex:1,border:'1px solid #ccc'}}
                                             onClick={() => {
                                                 chooseLib((resultlist) => {
                                                     if (resultlist.length) {
                                                         this.setState({reviewedBy: resultlist[0].name})
                                                     }
                                                     })
                                             }}
                                             >
                                                 {reviewedBy}
                                             </div>:''
                                         }
                                    </div>:''
                                }
                            </div>
                        :
                        typeInitial === 'stoke' ?
                         openQuantity || enableWarehouse?
                            <div className="export-radiogroup">
                                <div>
                                    <span>导出内容：</span>
                                        <RadioGroup onChange={(e) => this.setState({valueSurvival: e.target.value})} value={valueSurvival}>
                                            <Radio value={ 1 }>存货</Radio>
                                            <Radio value={ 2 }>存货期初值</Radio>
                                        </RadioGroup>
                                </div>
                            </div>:''
                        :
                        ''
                        // typeInitial === 'stoke'  ?
                        //     <div className="export-radiogroup">
                        //         <div>
                        //             <span>导出内容：</span>
                        //                 <RadioGroup onChange={(e) => this.setState({valueSurvival: e.target.value})} value={valueSurvival}>
                        //                     <Radio value={ 1 }>存货</Radio>
                        //                     <Radio value={ 2 }>存货期初值</Radio>
                        //                 </RadioGroup>
                        //         </div>
                        //     </div>
                        // :
                        // ''
                    }
                </ul>
                {
                    type === 'cxpzPDF' ? 
                    <div>本次操作将导出本账期所有凭证（不论是否勾选），若需导出部分凭证，请勾选凭证后点击“打印”。</div>
                    : null
                }
            </Modal>
        )
    }
}
