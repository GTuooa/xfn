import React from 'react'
import { connect }	from 'react-redux'

import { feeActions } from 'app/redux/Fee'
import * as tcgmActions from 'app/redux/Fee/Tcgm/tcgm.action.js'

import Title from '../components/Title'
import Upgrade from './Upgrade'
import Contract from './Contract'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import { Checkbox, Button } from 'antd'
import './style.less'

@connect(state => state)
export default
class Tcgm extends React.Component {

    // componentDidMount() {
    //     this.props.dispatch(tcgmActions.getPayProductFetch())
	// }
    constructor() {
		super()
		this.state = {
            readContractStatus: false,
            agree: false
        }
	}

    shouldComponentUpdate(nextprops, nextstate) {
		return this.props.tcgmState != nextprops.tcgmState || this.state != nextstate
	}

    render() {

        const { tcgmState, dispatch, homeState, history } = this.props
        const { readContractStatus, agree } = this.state

        const corpName = tcgmState.getIn(['data', 'payInfo', 'corpName'])
        const corpId = tcgmState.getIn(['data', 'payInfo', 'corpId'])
        const equityList = tcgmState.getIn(['data', 'payInfo', 'equityList'])
        const packageList = tcgmState.getIn(['data', 'payInfo', 'packageList'])
        const expireDate = tcgmState.getIn(['data', 'payInfo', 'expireDate'])

        const views = tcgmState.get('views')
        const orderWindowShow = views.get('orderWindowShow')
        const orderNumber = views.get('orderNumber')
        const upgradeStatu = views.get('upgradeStatu')

        const ddUserId = homeState.getIn(['data', 'userInfo', 'dduserid'])

        return (
            <ContainerWrap type="config-one" className="layer-small tcgm">
                <Title
                    activeTab={1}
                    onClick={(page) => dispatch(feeActions.switchFeeActivePage(page))}
                />
                <div className="tcgm-name-wrap">
                    <span className="tcgm-label">企业名称：</span>
                    <span className="tcgm-corp-name">{corpName}</span>
                </div>
                {
                    equityList.size ?
                    <div className="tcgm-equity">
                        <span className="tcgm-label">当前功能：</span>
                        <ul className="tcgm-equity-list">
                            {
                                equityList.map((v, i) => {
                                    return (
                                        <li className={`tcgm-equity-item${v.get('equityName') === '总账' ? ' tcgm-equity-item-mini' : ''}`} key={i}>
                                            <div className="tcgm-equity-item-name">
                                                {v.get('name')}
                                            </div>
                                            <div className="tcgm-equity-item-number">
                                                {v.get('expireInfo')}
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    : null
                }
                {
                    // <div className="tcgm-expire-time">
                    //     <span className="tcgm-label">到期时间：</span>
                    //     <span>{expirationInfo}</span>
                    // </div>
                }
                
                <div className="tcgm-buy-or-upgrade-button">
                    <div className={'tcgm-buy-or-upgrade-button-current'}>
                        续费/升级
                    </div>
                </div>
                {/* 购买与升级 */}
                <Upgrade
                    packageList={packageList}
                    upgradeStatu={upgradeStatu}
                    dispatch={dispatch}
                    corpName={corpName}
                    orderWindowShow={orderWindowShow}
                    orderNumber={orderNumber}
                    history={history}
                    corpId={corpId}
                    ddUserId={ddUserId}
                    agree={agree}
                    onAgree={() => this.setState({agree: !agree})}
                    showContract={() => this.setState({readContractStatus: true})}
                    expireDate={expireDate}
                />
                <Contract
                    readContractStatus={readContractStatus}
                    cancelClick={() => this.setState({readContractStatus: false})}
                    onClick={() => {
                        this.setState({readContractStatus: false, agree: true})
                    }}
                />
            </ContainerWrap>
        )
    }
}
