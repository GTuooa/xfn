import React from 'react'
import { connect }	from 'react-redux'
import { Button } from 'app/components'
import thirdParty from 'app/thirdParty'
import { showImg } from 'app/utils'

import { previewEnclosureActions } from 'app/redux/Edit/PreviewEnclosure/index.js'

@connect(state => state)
export default
class Ylfj extends React.Component {
	render() {

		const { enclosureList,  label, history, dispatch } = this.props
        let previewImageList = []
        enclosureList.map(v=>{
			if(v.get('imageOrFile') === 'TRUE'){
				previewImageList.push(v.get('signedUrl'))
			}
        })
        previewImageList=previewImageList.slice(0,9);

        const preview = (i,v)=>{//附件预览
			if(v.get('imageOrFile')==='TRUE'){

				const imageList = enclosureList.filter((w, j) => j<i && w.get('imageOrFile')==='TRUE')
				const preIdx = imageList.size

				thirdParty.previewImage({
					urls: previewImageList,//图片地址列表
					current: previewImageList[preIdx],//当前显示的图片链接
					onSuccess : function(result) {},
					onFail : function() {}
				})
			} else if (v.get('mimeType') === 'application/pdf') {
				if (v.get('size') > 8*1024) {
					return thirdParty.toast.info('文件过大，暂不支持预览。')
				}
				let previewUrl = v.get('signedUrl')
				dispatch(previewEnclosureActions.getCxpzUploadEnclosure(previewUrl, () => {
					history.push('/previewpdf')
				}))
				
			} else {
				thirdParty.Alert('文件格式暂不支持预览')
			}
		}

		return (
            <div className="ylls-fj">
			<div className="lrls-fj-title" >
			<span className="lrls-fj-tips">附件</span>
			</div>
                {(enclosureList||[]).map((v,i) =>
                    <div className='upload' key={i}>
                        <img src={showImg(v.get('imageOrFile'),v.get('fileName'))} onClick={()=>preview(i,v)}/>
                        <ul onClick={()=>preview(i,v)}>
                            <li>{v.get('fileName')}</li>
                            <li>{v.get('size')+'kb'}</li>
                        </ul>
						{
							v.get('label') !== '无标签'?
							<span className='fj-label'>
								{v.get('label')}
							</span> : ''
						}

                    </div>
                )}
            </div>
		)
	}
}
