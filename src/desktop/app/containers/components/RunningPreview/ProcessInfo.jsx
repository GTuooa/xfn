import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import * as thirdParty from 'app/thirdParty'

@immutableRenderDecorator
export default
class ProcessInfo extends React.Component {
   

    render() {

        const { dispatch, processInfo } = this.props

        return (
            <div>
                <div className='fj-title'>
                    审批
                </div>
                <div className="ylls-process-info-wrap">
                    <span className="ylls-process-info-text" onClick={() => {
                        thirdParty.openSlidePanel(`https://aflow.dingtalk.com/dingtalk/pc/query/pchomepage.htm?corpid=${sessionStorage.getItem('corpId')}#/approval?procInstId=${processInfo.get('processInstanceId')}`, '查看审批')
                    }}>
                        {processInfo.get('processTitle')}
                    </span>
                    <span className="ylls-process-info-code">
                        单号：{processInfo.get('processBusinessCode')}
                    </span>
                </div>
            </div>
        )
    }
}
