import React from 'react'
import { connect }	from 'react-redux'
import { Spin,Progress } from 'antd'
import fetchApi from 'app/constants/fetch.constant.js'
import { showMessage } from 'app/utils'
import * as configActions from 'app/redux/Config/Ac/acConfig.action.js'
export default
class ImportProgress extends React.Component {
	componentDidMount() {

	}

    componentWillUnmount(){
        this.props.clearProgress()
    }

	render() {
        const {showMessageMask,originData,mediaId,dispatch,getProgress,clearProgress,ddImportCallBack} = this.props
        const percent = originData.getIn(['importProgressInfo','progress'])
        const successList = originData.getIn(['importProgressInfo','successList'])
        const failList = originData.getIn(['importProgressInfo','failList'])
        const message = originData.getIn(['importProgressInfo','message'])

        if(showMessageMask && (percent < 100)){
            getProgress()
        }

		return (
			<div className="import-progress">
				<Progress percent={percent} />
                {
                    percent < 100 ? ''
                    :
                    <div>
                        <div className="import-mask-main-message-btn">
                            <div>提示信息共{successList.size + failList.size}条，成功导入记录{successList.size}条，错误记录{failList.size}条</div>
                            {
                                mediaId ?
                                <span className="import-mask-main-message-onload-send">
                                    <span>导入失败凭证汇总.xls</span>
                                    <span className="import-mask-main-message-onload" onClick={() => ddImportCallBack('')}>导出至自己</span>
                                </span>
                                : ''
                            }
                        </div>
                        <div className="import-mask-main-message-detail">
                            <div>提示信息：{message}</div>
							{
								failList && failList.size > 0 ?
									<div>
		                                失败汇总：
		                                <div>
		                                    {
		                                        failList.map((item,index) => {
		                                            return <p key={index}>{item} </p>
		                                        })
		                                    }
		                                </div>
		                            </div>
								: ''
							}
                        </div>
                    </div>
                }
			</div>
		)
	}
}
