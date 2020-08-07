import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import './style.less'

import thirdParty from 'app/thirdParty'
import { showImg } from 'app/utils'
import { message, Radio, Modal } from 'antd'
import { Icon } from 'app/components'
const RadioGroup = Radio.Group

import UploadEnclosure from './UploadEnclosure.jsx'
import EnclosurePreview from 'app/containers/components/EnclosurePreview'

@immutableRenderDecorator
export default
class Enclosure extends React.Component {

    constructor() {
		super()
		this.state = {
			tagModal: false, //标签组件的状态
			tagValue: '无标签', //标签名
			currentIdx:'', //单前操作的id
			// fileTotal:'', //当前选择的文件数
			// canFileTotal:'', //能上传的文件数
			// fileMesage:[], //当前选择文件的信息
			preview: false, //预览的图片的组件状态
		}
	}


	render() {
		const {
			formPage,
            className,
			dispatch,
			permission,
			closed,
			reviewed,
			enclosureList,
			label,
			enCanUse,
			checkMoreFj,
            getLabelFetch,
            deleteUploadImgUrl,
            changeTagName,
            uploadEnclosureList,
            downloadEnclosure,
            type,
            uploadKeyJson,
            getUploadTokenFetch,
		} = this.props

        const { tagValue, currentIdx, preview, tagModal, page } = this.state

		const previewImgArr = enclosureList && enclosureList.filter(v => v.get('imageOrFile') === 'TRUE' || v.get('mimeType') === 'application/pdf')

		let deleteAndLabel = false //删除图标和标签图标出现的状态
		if (permission && !closed && !reviewed) { //是管理员观察员且未结账未审核
			deleteAndLabel = true //出现d
		}
		let showFj = true
		if ((closed || reviewed) && !enclosureList.size) {//结账或审核且没有附件
			showFj = false
		}

        // const enclosureUrl = type == 'ls' ? 'enclosurePath' : 'enclosurepath'  // 流水那边的字段是 enclosurePath ， 总账是 enclosurepath
        const enclosureUrl = 'enclosurePath' // 流水那边的字段是 enclosurePath ， 总账是 enclosurepath

		return (
            <div
                className={["enclosure-upload-part", className].join(' ')}
                style={{display : (showFj && enCanUse) ? '' : 'none'}}
            >
				<span
                    className="enclosure-wrap-title"
                    style={{display: deleteAndLabel && enclosureList.size < 9 && (checkMoreFj ? '' : 'none')}}
                >
					附件(最多上传九个)
				</span>
				<div className="enclosure-list-wrap">
					{/* 展示 */}
					{(enclosureList || []).map((v, i) => (
						<div className='enclosure-item' key={i}>
							<div className='enclosure-item-icon' onClick={() => {
								if (v.get('imageOrFile') === 'TRUE' || v.get('mimeType') == 'application/pdf') {
									let idx = 0
									previewImgArr.forEach((w,j) => {
										if (v.get(enclosureUrl) === w.get(enclosureUrl)) {
											idx = j;
											return
										}
									})
									this.setState({'preview': true, page: idx})
								} else {
									message.warn('仅图片及PDF格式支持预览')
								}
							}}>
								<img src={showImg(v.get('imageOrFile'), v.get('fileName'))}/>
							</div>
							<div className='enclosure-item-detail'>
								<p className='enclosure-item-filename'>{v.get('fileName')}</p>
								<span className="enclosure-item-tip">
									{v.get('size')>=1024 ? (v.get('size')/1024).toFixed(2)+'M' :v.get('size')+'kb'}
								</span>
								<a className="enclosure-item-tip" onClick={() => downloadEnclosure(v.get('signedUrl'), v.get('fileName'))} href="#"
									style={{display: permission ? '' : 'none'}}>
									<Icon type="download" />
								</a>
								<span className='enclosure-tag'
									style={{display: deleteAndLabel ? '' : 'none'}}
									onClick={()=>{
										this.setState({currentIdx:i, tagValue:v.get('label'), tagModal: true})
										getLabelFetch()
									}}
								>
                                    {v.get('label')==='无标签'? '添加标签' : v.get('label')}
								</span>
							</div>
							<div
                                className='icon-close'
                                style={{display: deleteAndLabel ? '' : 'none'}}
								onClick={()=>{deleteUploadImgUrl(i)}}
							>
								<Icon type="close" />
							</div>
						</div>
					))}
					{/* 上传 */}
                    <UploadEnclosure
                        style={{display: deleteAndLabel && enclosureList.size < 9 && checkMoreFj ? '' : 'none'}}
                        dispatch={dispatch}
                        enclosureList={enclosureList}
                        uploadEnclosureList={uploadEnclosureList}
                        uploadKeyJson={uploadKeyJson}
						getUploadTokenFetch={getUploadTokenFetch}
						formPage={formPage}
					/>
					
				</div>
				<Modal
                    title="添加标签"
                    visible={tagModal}
					onOk={()=> {
						changeTagName(currentIdx, tagValue)
						this.setState({tagModal: false})
					}}
					onCancel={() => this.setState({tagModal: false})}
                >
					<RadioGroup
                        onChange={(e)=>this.setState({tagValue: e.target.value})}
                        value={tagValue}
                    >
						{label.map((v, i) => <Radio className="enclosure-radio" key={i} value={v}>{v==='无标签' ? '取消标签' : v}</Radio>)}
					</RadioGroup>
				</Modal>
				<EnclosurePreview
					page={page}
					dispatch={dispatch}
					preview={preview}
					downloadPermission={permission}
					previewImgArr={previewImgArr}
                    downloadEnclosure={downloadEnclosure}
					closePreviewModal={() => this.setState({preview: false})}
                    type={type}
                    uploadKeyJson={uploadKeyJson}
				/>
			</div>
		)
	}
}
