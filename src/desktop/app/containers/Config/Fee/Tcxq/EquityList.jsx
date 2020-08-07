import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as thirdParty from 'app/thirdParty'
// import * as tcxqActions from 'app/redux/Fee/Tcxq/tcxq.action.js'
import { feeActions } from 'app/redux/Fee'
import * as tcgmActions from 'app/redux/Fee/Tcgm/tcgm.action.js'
import { Checkbox, Button, Tooltip } from 'antd'

import * as allActions from 'app/redux/Home/All/all.action'

@immutableRenderDecorator
export default
class EquityList extends React.Component {

	render() {
        const {
			equityList,
			dispatch
		} = this.props

		return (
            <ul className="tcxq-equity-list">
                {
                    equityList.map((v, i) => {
                        const buttonList = v.get('buttonList')
                        let button = null

                        if (buttonList.size) {  // 可购买
                            button = buttonList.map(w => {
                                return <Tooltip title={w.get('function') === 'XFN' ? 'PC端暂不支持购买，如需续费/升级请前往安卓手机端。' : ''} ><Button className={`tcxq-equity-item-button-${w.get('color').toLowerCase()}`} onClick={() => {
                                    if (w.get('function') === 'XFN') {
                                        // dispatch(feeActions.switchFeeActivePage('Tcgm'))
                                        // dispatch(tcgmActions.fromTcxqJumpToTcgm(v.get('name').split('(')[0]))
                                    } else if (w.get('function') === 'DD') {
                                        // thirdParty.Confirm({
                                        // 	title: '提示',
                                        // 	message: '前往钉钉应用中心购买',
                                        // 	buttonLabels: ['取消', '立即前往'],
                                        // 	onSuccess : (result) => {
                                        // 		if (result.buttonIndex === 1) {
                                        // 			window.location.href = `https://h5.dingtalk.com/appcenter/index-pc.html?source=appstore_button&corpId=${sessionStorage.getItem('corpId')}`
                                        // 		}
                                        // 	}
                                        // })
                                        thirdParty.openSlidePanel(
                                            `https://h5.dingtalk.com/open-market/skuDetail.html?corpId=${sessionStorage.getItem('corpId')}&articleCode=FW_GOODS-1000302451&source=STORE_HOMEPAGE`,
                                            '小番财务购买',
                                            () => {},
                                            () => {},
                                        )
                                    }
                                }}>
                                    {w.get('label')}
                                </Button></Tooltip>
                            })
                        }

                        return (
                            <li className="tcxq-equity-item" key={i}>
                                <div className="tcxq-equity-item-title">
                                    {v.get('name')}
                                </div>
                                <div className="tcxq-equity-item-expiration">
                                    {v.get('expireInfo')}
                                </div>

                                <div className="tcxq-equity-item-button">
                                    {button}
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
		)
	}
}
