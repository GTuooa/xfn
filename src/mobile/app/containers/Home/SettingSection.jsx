import React, { Component, PropTypes }  from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import Icon from 'app/components/Icon'
import { Carousel } from 'antd-mobile'
import { fromJS, toJS } from 'immutable'
import * as thirdParty from 'app/thirdParty'
import { ROOTURL } from 'app/constants/fetch.constant.js'
import { DateLib } from 'app/utils'

import { homeActions } from 'app/redux/Home/home.js'
import { feeActions } from 'app/redux/Fee'
import * as sobConfigActions from 'app/redux/Config/Sob/sobConfig.action'

@immutableRenderDecorator
export default
class SettingSection extends Component {

    constructor(props) {
		super(props)
		this.state = {
            data: ['1', '2', '3'],
            imgHeight: 1.76,
		}
    }

    componentDidMount() {
        // simulate img loading

    }

    render() {
        const { dispatch, Config, userInfo, history, mySobDetailList, isPlay, showExperientialModal, emplID, pageController } = this.props
        const { data, imgHeight} = this.state

        const pageList = Config ? Config.get('pageList') : fromJS([])
        const sobInfo = userInfo.get('sobInfo')
        const isAdmin = userInfo.get('isAdmin')
        const isDdAdmin = userInfo.get('isDdAdmin')
        const isDdPriAdmin = userInfo.get('isDdPriAdmin')
        const isFinance = userInfo.get('isFinance')
        const packInfoList = userInfo.get('packInfoList')
        const sobList = userInfo.get('sobList')
        const corpName = userInfo.get('corpName')
        const defaultsobid = sobInfo ? sobInfo.get('sobId') : ''
        const slideIndex = mySobDetailList.findIndex(v => v.get('sobid') === defaultsobid)

        // 当前套餐显示
        let payPackage = []
        let tracingPackage = []
        packInfoList.map(v => {
            const info = `${v.get('name')}${v.get('comments') ? `(${v.get('comments')})` : ''}`
            if (v.get('isBuy')) {
                payPackage.push(info)
            } else {
                if (v.get('name') === '试用版') {
                    tracingPackage.push(info)
                }
            }
        })

        // const packageList = payPackage.concat(tracingPackage)
        let packageList = []
        let info = ''
        if (payPackage.length) {
            packageList = payPackage
        } else {
            packageList = tracingPackage
        }

        for (let i = 0; i < packageList.length; i++) {
            info = info ? info + '+' + packageList[i] : packageList[i]
            if (info.length >= 20) {
                if (i < packageList.length-1) {
                    info = info + '+...'
                    break;
                }
            }
        }

        return (
            <div className="home-tab-bar-set" id="homeTabBarSet">
                <div className="home-config-title-wrap">
                    <div className="home-config-title">
                        <div className="home-config-title-content"><span>{corpName}</span></div>
                        <span
                            className="home-config-title-security"
                            onClick={() => {

                                // if (isPlay) {
                                //     return thirdParty.Alert('体验模式不能设置安全中心')
                                // }

                                // if (isAdmin === 'TRUE' || isFinance === 'TRUE' || isDdAdmin === 'TRUE' || isDdPriAdmin === 'TRUE') {
                                //     history.push('/config/security/index')
                                // }

                                thirdParty.actionSheet({
                                    title: "设置",
                                    cancelButton: "取消",
                                    otherButtons: (isAdmin === 'TRUE' || isFinance === 'TRUE' || isDdAdmin === 'TRUE' || isDdPriAdmin === 'TRUE') ? ["个人设置", "公司设置"] : ["个人设置"],
                                    onSuccess: function(result) {
                                        if (result.buttonIndex == -1) {
                                            return
                                        } else if (result.buttonIndex == 0) {
                                            history.push('/config/security/personalsettings')
                                        } else if (result.buttonIndex == 1) {
                                            if (isAdmin === 'TRUE' || isFinance === 'TRUE' || isDdAdmin === 'TRUE' || isDdPriAdmin === 'TRUE') {
                                                history.push('/config/security/index')
                                            }
                                        }
                                    }
                                })
                            }}
                        >
                            <Icon type="security"/>
                        </span>
                    </div>
                    <div
                        className="home-config-sob-detail"
                        onClick={() => {
                            if (isPlay) {
                                return thirdParty.Alert('体验模式不能进入套餐购买')
                            }
                            if (isAdmin === 'TRUE' || isFinance === 'TRUE' || isDdAdmin === 'TRUE' || isDdPriAdmin === 'TRUE') {
                                dispatch(feeActions.switchFeeActivePage('Tcxq'))
                                history.push('/fee')
                            }
                        }}
                    >
                        当前套餐：{info} >
                    </div>
                </div>
                <div className="home-config-body-wrap">
                    <div className="home-config-body-title">
                        <span className="home-config-title-mysob">我的账套</span>
                        {
                            global.isplayground ? '' : (isPlay ?
                            <span className="home-config-title-pleasure" onClick={() => {
                                dispatch(homeActions.quitPleasureGround(history))
                            }}>退出体验模式</span> :
                            <span className="home-config-title-pleasure" onClick={() => {
                                dispatch(homeActions.getPlaySobModelList())
                                let homeTabBarSet = document.getElementById('homeTabBarSet')
                                homeTabBarSet.style.overflow='hidden';
                                showExperientialModal()
                                // thirdParty.openLink({
                                //     url: `${ROOTURL}/index.html?dd_nav_bgcolor=FFFFFFFF&isOV=false&isplayground=true#/`,
                                //     onSuccess : function(result) {},
                                //     onFail : function(err) {}
                                // })
                            }}>进入体验模式</span>)
                        }
                        <span
                            className="home-config-title-all"
                            onClick={() => {
                                history.push('/config/sob/index')
                            }}
                        >更多</span>
                    </div>
                    <div className="sob-box">
                        {
                            slideIndex > -1 ?
                            <Carousel
                                className="home-config-space-carousel"
                                frameOverflow="visible"
                                cellSpacing={10}
                                slideWidth={0.87}
                                autoplay={false}
                                dots={false}
                                selectedIndex={slideIndex}
                                infinite={false}
                                beforeChange={(from, to) => {
                                    if (from === to) {
                                        return
                                    } else if (to === from + 1 || to === from - 1) {
                                        const sobId = mySobDetailList.getIn([to, 'sobid'])
                                        dispatch(homeActions.modifyDefaultSobIdFetch(sobId, history))
                                    }
                                }}
                                afterChange={index => {}}
                            >
                                {mySobDetailList.map((v, index) => {
                                    return (
                                        <div
                                            key={v.get('sobid')}
                                            style={{
                                              position: 'relative',
                                              top: slideIndex === index ? 0 : 0,
                                              height: `${imgHeight}rem`,
                                            //   boxShadow: '.03rem .07rem .1rem .03rem rgba(215, 215, 215,0.7)',
                                              boxShadow: '0 0 .1rem 0 #d9d9d9',
                                              borderRadius: '.04rem',
                                              borderTop:'1px solid #ebebeb'
                                            }}
                                        >
                                            <div
                                                className="home-config-sob-item"
                                            >
                                                <div className="home-config-sob-item-title">
                                                    {v.get('sobname')}
                                                </div>
                                                <ul className="home-config-sob-item-detail">
                                                    <li>
                                                        起始账期：{`${v.get('firstyear')}年${v.get('firstmonth')}月`}
                                                    </li>
                                                    <li>
                                                        总管理员：{v.get('adminlist').reduce((pre, v) => `${pre ? pre + '、' + v.get('name') : v.get('name')}`, '')}
                                                    </li>
                                                    <li>
                                                        当前功能：{v.getIn(['moduleInfo', 'nameList']).join('、')}
                                                    </li>
                                                </ul>
                                                <div className="home-config-sob-line"></div>
                                                <div className="home-config-sob-btn">
                                                    <span
                                                        onClick={() => {
                                                            const isSobAdmin = v.get('adminlist').find(v => v.get('emplId') === emplID)
                                                            const EditRight = isAdmin || isSobAdmin
                                                            if (EditRight) {
                                                                dispatch(sobConfigActions.beforeInsertOrModifySob(v.get('sobid'), history))
                                                            }
                                                        }}
                                                    >
                                                        <Icon type="set-of-books-setting"/>
                                                    </span>
                                                    <span
                                                        onClick={() => {

                                                            // if (isPlay) {
                                                            //     return thirdParty.toast.info('体验模式下不能进行删除账套操作')
                                                            // }

                                                            const isSobAdmin = v.get('adminlist').find(v => v.get('emplId') === emplID)
                                                            const EditRight = isAdmin || isSobAdmin
                                                            if (EditRight) {
                                                                thirdParty.Prompt({
                                                                    message: '删除账套:',
                                                                    title: '请输入要删除的账套名称',
                                                                    buttonLabels: ['取消', '确认'],
                                                                    onSuccess: (result) => {
                                                                        if (result.buttonIndex === 1) {
                                                                            if (result.value === v.get('sobname')) {
                                                                                dispatch(sobConfigActions.deleteSobItemFetch([v.get('sobid')], history))
                                                                            } else {
                                                                                thirdParty.toast.info('账套名称不匹配')
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        }}
                                                    >
                                                        <Icon type="delete"/>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </Carousel> : ''
                        }
                    </div>

                    <ul className="home-config-setting-list">
                        {
                            pageController && pageController.getIn(['MANAGER', 'preDetailList', 'CLOSE_SOB', 'display']) === 'SHOW' ?
                            <div className="home-config-setting-box">
                                <li
                                    className="home-config-setting-item"
                                    onClick={() => {
                                        history.push('/config/jz')
                                    }}
                                >
                                    <span className="home-config-setting-item-icon"><Icon type="check"/></span>
                                    <span className="no-bottom">
                                        <span>结账</span>
                                        <span className="home-config-setting-item-arrow"><Icon type="arrow-right" /></span>
                                    </span>
                                </li>
                            </div>
                            : null
                        }
                        <li className="home-config-setting-item-line"></li>
                        <div className="home-config-setting-box">
                            {
                                pageList.some(v => v.get('key') === 'AccountConfig') ?
                                <li
                                    className="home-config-setting-item"
                                    onClick={() => {
                                        history.push('/config/account/index')
                                    }}
                                >
                                    <span className="home-config-setting-item-icon"><Icon type="bank-setting"/></span>
                                    <span>
                                        <span>账户设置</span>
                                        <span className="home-config-setting-item-arrow"><Icon type="arrow-right" /></span>
                                    </span>
                                </li> : ''
                            }
                            {
                                pageList.some(v => v.get('key') === 'RelativeConfig') ?
                                <li
                                    className="home-config-setting-item"
                                    onClick={() => {
                                        history.push('/config/relative/index')
                                    }}
                                >
                                    <span className="home-config-setting-item-icon"><Icon type="intercourse-setting"/></span>
                                    <span>
                                        <span>往来设置</span>
                                        <span className="home-config-setting-item-arrow"><Icon type="arrow-right" /></span>
                                    </span>
                                </li> : ''
                            }
                            {
                                pageList.some(v => v.get('key') === 'ProjectConfig') ?
                                <li
                                    className="home-config-setting-item"
                                    onClick={() => {
                                        dispatch({type: 'INIT_PROJECT'})
                                        history.push('/config/project/index')
                                    }}
                                >
                                    <span className="home-config-setting-item-icon"><Icon type="project-setting"/></span>
                                    <span>
                                        <span>项目设置</span>
                                        <span className="home-config-setting-item-arrow"><Icon type="arrow-right" /></span>
                                    </span>
                                </li> : ''
                            }
                            {
                                pageList.some(v => v.get('key') === 'InventoryConfig') ?
                                <li
                                    className="home-config-setting-item"
                                    onClick={() => {
                                        dispatch({type: 'INIT_INVENCONFIG'})
                                        history.push('/config/inventory/index')
                                    }}
                                >
                                    <span className="home-config-setting-item-icon"><Icon type="inventory-setting"/></span>
                                    <span>
                                        <span>存货设置</span>
                                        <span className="home-config-setting-item-arrow"><Icon type="arrow-right" /></span>
                                    </span>
                                </li> : ''
                            }
                            {
                                pageList.some(v => v.get('key') === 'WarehouseConfig') ?
                                <li
                                    className="home-config-setting-item"
                                    onClick={() => {
                                        dispatch({type: 'INIT_WAREHOUSE'})
                                        history.push('/config/warehouse/index')
                                    }}
                                >
                                    <span className="home-config-setting-item-icon"><Icon type="warehouse"/></span>
                                    <span>
                                        <span>仓库设置</span>
                                        <span className="home-config-setting-item-arrow"><Icon type="arrow-right" /></span>
                                    </span>
                                </li> : ''
                            }
                            {
                                pageList.some(v => v.get('key') === 'Approval') ?
                                <li
                                    className="home-config-setting-item"
                                    onClick={() => {
                                        // dispatch({type: 'INIT_WAREHOUSE'})
                                        history.push('/config/approval/index')
                                    }}
                                >
                                    <span className="home-config-setting-item-icon"><Icon type="shenpi"/></span>
                                    <span>
                                        <span>审批设置</span>
                                        <span className="home-config-setting-item-arrow"><Icon type="arrow-right" /></span>
                                    </span>
                                </li> : ''
                            }
                        </div>
                        {
                            pageList.some(v => v.get('key') === 'AccountConfig') ?
                            <li className="home-config-setting-item-line"></li> : ''
                        }
                        <div className="home-config-setting-box">
                            {/* {
                                pageList.some(v => v.get('key') === 'AccountConfig') ?
                                <li
                                    className="home-config-setting-item"
                                    onClick={() => {
                                        history.push('/config/accountconfig')
                                    }}
                                >
                                    <span className="home-config-setting-item-icon"><Icon type="running-setting"/></span>
                                    <span>
                                        <span>流水设置</span>
                                        <span className="home-config-setting-item-arrow"><Icon type="arrow-right" /></span>
                                    </span>
                                </li> : ''
                            } */}
                            {
                                pageList.some(v => v.get('key') === 'RunningConfig') ?
                                <li
                                    className="home-config-setting-item"
                                    onClick={() => {
                                        history.push('/config/running/index')
                                    }}
                                >
                                    <span className="home-config-setting-item-icon"><Icon type="running-setting"/></span>
                                    <span>
                                        <span>流水设置</span>
                                        <span className="home-config-setting-item-arrow"><Icon type="arrow-right" /></span>
                                    </span>
                                </li> : ''
                            }
                            {
                                pageList.some(v => v.get('key') === 'AcConfig') ?
                                <li
                                    className="home-config-setting-item"
                                    onClick={() => {
                                        history.push('/config/ac')
                                    }}
                                >
                                    <span className="home-config-setting-item-icon"><Icon type="account-setting"/></span>
                                    <span>
                                        <span>科目设置</span>
                                        <span className="home-config-setting-item-arrow"><Icon type="arrow-right" /></span>
                                    </span>
                                </li> : ''
                            }
                            {
                                pageList.some(v => v.get('key') === 'AssConfig') ?
                                <li
                                    className="home-config-setting-item"
                                    onClick={() => {
                                        history.push('/config/ass')
                                    }}
                                >
                                    <span className="home-config-setting-item-icon"><Icon type="ass-setting"/></span>
                                    <span>
                                        <span>辅助设置</span>
                                        <span className="home-config-setting-item-arrow"><Icon type="arrow-right" /></span>
                                    </span>
                                </li> : ''
                            }
                            {
                                pageList.some(v => v.get('key') === 'CurrencyConfig') ?
                                <li
                                    className="home-config-setting-item"
                                    onClick={() => {
                                        history.push('/currency/currencyconfig')
                                    }}
                                >
                                    <span className="home-config-setting-item-icon"><Icon type="currency-setting"/></span>
                                    <span>
                                        <span>外币设置</span>
                                        <span className="home-config-setting-item-arrow"><Icon type="arrow-right" /></span>
                                    </span>
                                </li> : ''
                            }
                            {
                                pageList.some(v => v.get('key') === 'AssetsConfig') ?
                                <li
                                    className="home-config-setting-item"
                                    onClick={() => {
                                        history.push('/assets/assets')
                                    }}
                                >
                                    <span className="home-config-setting-item-icon"><Icon type="assets-setting"/></span>
                                    <span>
                                        <span>资产设置</span>
                                        <span className="home-config-setting-item-arrow"><Icon type="arrow-right" /></span>
                                    </span>
                                </li> : ''
                            }
                        </div>
                    </ul>
                    <ul className="home-config-about-us-wrap">
                        <li className="home-config-about-us-item">
                            <span onClick={() => history.push('/other/help')}>帮助中心</span>
                        </li>
                        <li className="home-config-about-us-item">
                            <span onClick={() => history.push('/other/contract')}>用户协议</span>
                        </li>
                        <li className="home-config-about-us-item">
                            <span onClick={() => thirdParty.openLink({
                                url: 'https://www.xfannix.com/mobile/app/index.html#/'
                            })}>关于小番财务</span>
                        </li>
                        <li className="home-config-about-us-right">
                            <span>{`版权所有 ©2016-${new DateLib().getYear()} xfannix Co.,Ltd. 保留所有权利`}</span>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
