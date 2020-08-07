import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Modal, DatePicker, Switch, Input, Select, message } from 'antd'
const Option = Select.Option
import { Icon } from 'app/components'
import { formatMoney, formatDate, showImg } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'

import EnclosurePreview from 'app/containers/components/EnclosurePreview'

import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import { allDownloadEnclosure } from 'app/redux/Home/All/all.action'

@immutableRenderDecorator
export default
class Enclosure extends React.Component {
    constructor() {
		super()
		this.state = {
            preview: false, //预览的图片的组件状态
            page: 0, //当前预览图片的下标
        }
    }

    render() {

        const { dispatch, enclosureList, editLrAccountPermission } = this.props
        const { page, preview } = this.state

        const previewImgArr = enclosureList ? enclosureList.filter(v => v.get('imageOrFile') === 'TRUE' || v.get('mimeType') === 'application/pdf') : fromJS([])

        return (
            <div style={{overflow:'hidden'}}>
                {
                    enclosureList && enclosureList.size?
                    <div className='fj-title'>
                        附件
                    </div>:''
                }
                <div className='upload-content'>
                    {
                        (enclosureList||[]).map((v, i) =>
                            <div className='upload' key={i}>
                                <div
                                    className='plus'
                                    onClick={() => {
                                        if (v.get('imageOrFile')==='TRUE' || v.get('mimeType')=='application/pdf') {
                                            let idx = 0
                                            previewImgArr.forEach((w,j) => {
                                                if (v.get('enclosurePath') === w.get('enclosurePath')) {
                                                    idx = j;
                                                    return
                                                }
                                            })
                                            this.setState({'preview': true, page: idx})
                                        } else {
                                            message.warn('仅图片及PDF格式支持预览')
                                        }
                                    }}
                                >
                                    <img src={showImg(v.get('imageOrFile'), v.get('fileName'))}/>
                                </div>
                                <div>
                                    <p>{v.get('fileName')}</p>
                                    <span>
                                        <span style={{display: editLrAccountPermission ? '' : 'none',color:'#5e81d1',marginRight:'3px'}} onClick={() => dispatch(previewRunningActions.previewDownloadEnclosure(v.get('signedUrl'), v.get('fileName')))}>
                                            <Icon type="download" />
                                            {/* <div>下载</div> */}
                                        </span>
                                        {v.get('size')>=1024 ? (v.get('size')/1024).toFixed(2)+'M' :v.get('size')+'kb'}
                                        {
                                            v.get('label')==='无标签'? '' :
                                            <span className='tag'>
                                                {v.get('label')}
                                            </span>
                                        }
                                    </span>
                                    {/* <a href={v.get('enclosurePath')} download
                                        style={{display: editLrAccountPermission ? '' : 'none'}}>
                                        <Icon type="download" />
                                    </a> */}
                                    {/* <span style={{display: editLrAccountPermission ? '' : 'none'}} onClick={() => dispatch(previewRunningActions.previewDownloadEnclosure(v.get('enclosurePath'), v.get('fileName')))}> */}

                                </div>
                            </div>)
                }
                </div>
                <EnclosurePreview
                    page={page}
                    dispatch={dispatch}
                    preview={preview}
                    downloadPermission={editLrAccountPermission}
                    downloadEnclosure={(enclosureUrl, fileName) => dispatch(allDownloadEnclosure(enclosureUrl, fileName))}
                    previewImgArr={previewImgArr}
                    closePreviewModal={() => this.setState({preview: false})}
                    type={'ls'}
                />
            </div>
        )
    }
}
