import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Icon } from 'app/components'

import thirdParty from 'app/thirdParty'

@immutableRenderDecorator
export default
class ProcessInfo extends React.Component {
   

    render() {

        const { dispatch, processInfo } = this.props

        return (
            <div>
                <div className='running-preview-fj-title'>审批</div>
                <div
                    className="ylls-process-info-wrap"
                    onClick={() => {
                        thirdParty.openLink({
                            url: `https://aflow.dingtalk.com/dingtalk/mobile/homepage.htm?dd_share=false&showmenu=true&dd_progress=false&back=native&corpid=${sessionStorage.getItem('corpId')}&swfrom=${'XFN'}#/approval?procInstId=${processInfo.get('processInstanceId')}`
                        });
                    }}
                >
                    <span className="ylls-process-info-text">
                        {processInfo.get('processTitle')}
                    </span>
                    <span className="ylls-process-info-code">
                        单号：{processInfo.get('processBusinessCode')}
                    </span>
                    <Icon type="arrow-right" className="ac-option-icon" size="11" />
                </div>
            </div>
        )
    }
}
