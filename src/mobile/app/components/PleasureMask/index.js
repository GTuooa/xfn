import React from 'react'
import { connect }	from 'react-redux'

import { browserNavigator } from 'app/utils'
import * as thirdParty from 'app/thirdParty'
import { getUrlParam } from 'app/constants/fetch.constant.js'
import './style.less'

@connect(state => state)
export default
class Home extends React.Component {

	render() {

		const { dispatch, homeState, history } = this.props
        const isPlay = homeState.getIn(['views', 'isPlay'])

		return (
            <div className="home-pleasure-mask">
                {
                    browserNavigator.versions.DingTalk && isPlay && global.isOrgTrialEntry ? 
                    <div
                        className="home-orgTrial-icon"
                        onClick={() => {
                            const href = location.href
                            const urlParam = getUrlParam(href)

                            thirdParty.openLink({
                                url: `https://page.dingtalk.com/wow/dingtalk/act/serviceconversation?wh_biz=tm&showmenu=false&goodsCode=FW_GOODS-1000302451&corpId=${urlParam.corpId}&token=bd61e615e7c3757fd2af47e530dc6a1f`
                            })
                        }}
                    >
                        <img  src="https://www.xfannix.com/utils/img/icons/orgTrialIcon.png" />
                    </div> :
                    '' 
                }
                {
                    isPlay ?
                    <div
                        className="home-pleasure-icon"
                        onClick={() => {
                            // thirdParty.Confirm({
                            //     message: "退出体验模式？",
                            //     title: "提示",
                            //     buttonLabels: ['取消', '退出'],
                            //     onSuccess : (result) => {
                            //         if (result.buttonIndex === 1) {
                            //             dispatch(homeActions.quitPleasureGround(history))
                            //         }
                            //     },
                            //     onFail : (err) => alert(err)
                            // })
                        }}
                    >
                        <img  src="https://www.xfannix.com/utils/img/icons/park.png" />
                    </div> :
                    ''
                }
			</div>
		)
	}
}
