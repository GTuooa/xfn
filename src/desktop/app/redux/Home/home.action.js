import fetchApi from 'app/constants/fetch.constant.js'
import * as ActionTypes from './ActionTypes.js'
import { message }	from 'antd'
let network = 'network=wifi'
let source = 'source=desktop'

import * as thirdParty from 'app/thirdParty'
import { showMessage, DateLib } from 'app/utils'
import { browserNavigator } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import { ROOT, ROOTURL, XFNVERSION, getUrlParam } from 'app/constants/fetch.constant.js'

import * as allActions from 'app/redux/Home/All/all.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action.js'
import * as middleActions from 'app/redux/Home/middle.action.js'
import * as editCalculateActions from 'app/redux/Edit/EditCalculate/editCalculate.action'



export const addHomeTabpane = (tabKey, openPage, title) => dispatch => {
    // if (sessionStorage.getItem("firstload") == 'first') {
	// 	sessionStorage.removeItem("firstload")
	// }

    dispatch({
        type: ActionTypes.ADD_HOME_TAB_PANE,
        tabKey,
        openPage,
        title
    })
}

export const addPageTabPane = (pagePanesName, tabKey, openPage, title) => dispatch => {
    dispatch({
        type: ActionTypes.ADD_PAGE_TAB_PANE,
        pagePanesName,
        tabKey,
        openPage,
        title
    })
}

export const removeHomeTabpane = (tabKey, activeTabkey) => ({
    type: ActionTypes.REMOVE_HOME_TAB_PANE,
    tabKey,
    activeTabkey
})

export const getPlaySobModelList = () => dispatch => {
    fetchApi('getPlaySobModelList', 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.AFTER_GET_PLAY_SOBMODE_LIST,
                receivedData: json.data
            })
        }
    })
}


//获取账套列表 在进入首页后就立即发送
export const getDbListFetch = (first, history) => (dispatch, getState) => {

    if (global.isplayground) { // 通过路由判断是体验模式
        if (browserNavigator.versions.mobile || browserNavigator.versions.ios || browserNavigator.versions.android || browserNavigator.versions.iPhone || browserNavigator.versions.iPad) { // 手机端体验模式
            window.location.href = 'http://mtst.xfannix.com' + "/index.html?dd_nav_bgcolor=FFFFFFFF&isOV=false&isplayground=true"
        } else if (global.isPlay) { // 发送过 playOpen 的请求，已成功登录
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            fetchApi('getdduserinfo', 'POST', JSON.stringify({code: ''}), json => {
                if (json.code === 3) {
                    thirdParty.Alert(json.message)
                    //return
                } else if (json.code === 10006) {
                    dispatch(codeError(first, history))
                } else {
                    if (showMessage(json)) {
                        dispatch(afterGetDbListFetch(json, first))
                    } else if (json.code === Limit.REPEAT_REQUEST_CODE) {
                        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                    }
                }
            })
        } else { // 刚进入游乐场，还未发送过 playOpen 的请求
            dispatch(getPlaySobModelList())
        }
    } else {
        dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

        if (browserNavigator.versions.DingTalk) {
            const ddReady = getState().homeState.getIn(['views', 'ddReady'])

            if (ddReady) {
                fetchApi('getdduserinfo', 'POST', JSON.stringify({code: ''}), json => {
                    if (json.code === 3) {
                        thirdParty.Alert(json.message)
                        return
                    } else if (json.code === 10006) {
                        dispatch(codeError('', history))
                    } else {
                        if (showMessage(json)) {
                            dispatch(afterGetDbListFetch(json))
                        } else if (json.code === Limit.REPEAT_REQUEST_CODE){
                            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                        }
                    }
                })
            } else {
          
                const href = location.href
                const start = href.indexOf('?')
                let serverMessage = location.href.slice(start+1).split('&')
                let corpId = ''

                // 从路由读取 corpid
                for (let i=0; i < serverMessage.length; i++) {
                    if (serverMessage[i].substr(0, 7) === 'corpid=') {
                        corpId = serverMessage[i].slice(7).replace('#/', '')
                    }
                }
                // console.log('corpId', corpId);

                sessionStorage.setItem('corpId', corpId)

                thirdParty.ready(() => {
                    //dd请求用户编码
                    // console.log('ready', corpId);
                    
                    thirdParty.requestAuthCode({
                        corpId: corpId,
                        onSuccess: (result) => {
                            if (result && result.code) {
                                const code = result.code
                                // console.log('requestAuthCode code', code);
                                
                                fetchApi('getdduserinfo', 'POST', JSON.stringify({code}), json => {
                                    if (json.code === 3) {
                                        thirdParty.Alert(json.message)
                                        //return
                                    } else if (json.code === 10006) {
                                        dispatch(codeError(first, history))
                                    } else {
                                        if (showMessage(json)) {

                                            const Today = new DateLib().toString()
                                            const useruuid = json.data.useruuid
                                            const lastLogInData = localStorage.getItem(useruuid)

                                            if (lastLogInData !== Today) {
                                                sessionStorage.setItem('TodayFirstIn', 'TRUE')
                                                localStorage.setItem(useruuid, Today)
                                            } else {
                                                sessionStorage.setItem('TodayFirstIn', 'FALSE')
                                            }

                                            dispatch(afterGetDbListFetch(json, first))
                                        } else if (json.code === Limit.REPEAT_REQUEST_CODE){
                                            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                                        }
                                    }
                                })
                            } else {
                                message.info('钉钉调用出错，请刷新')
                            }
                        }
                    })

                    if (!ddReady) {
                        dispatch({
                            type: ActionTypes.CHANGE_DDREADY_TO_TRUE
                        })
                    }
                })
      
            //         fetchApi('getddconfig', 'GET', `refreshticket=0&version=${XFNVERSION}`, json => {

            //             if (json.code === 3) {
            //                 thirdParty.Alert(json.message)
            //                 return
            //             } else if (json.code === Limit.REPEAT_REQUEST_CODE) {
            //                 dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            //                 return
            //             } else if (!showMessage(json)) {
            //                 return
            //             }

            //             if (json.data.isForceReload === true) {
            //                 window.location.href=window.location.href+"?timestamp=" + new Date().getTime()
            //                 location.reload(true)
            //             }

            //             const _config = json.data.config
            //             let count = 0

            //             //配置dd
            //             function setDD(conf) {
            //                 thirdParty.config(conf)

            //                 //dd配置校验失败时触发
            //                 thirdParty.error((err) => {
            //                     thirdParty.Alert('dd error: ' + JSON.stringify(err))
            //                     if (++count > 1)
            //                         return thirdParty.Alert('二次校验失败，请重新打开页面')
            //                     //请求更新ti45cket并重新装填新的配置
            //                     fetchApi('getddconfig', 'GET', 'refreshticket=1', json => setDD(json.config))
            //                 })

            //                 //dd配置校验成功时触发
            //                 thirdParty.ready(() => {
            //                     //dd请求用户编码

            //                     sessionStorage.setItem('corpId', conf.corpId)
            //                     sessionStorage.setItem('agentId', conf.agentId)

            //                     dispatch({
            //                         type: ActionTypes.CHANGE_DDREADY_TO_TRUE
            //                     })
            //                     // sessionStorage.setItem('ddReady', true)

            //                     thirdParty.requestAuthCode({
            //                         corpId: conf.corpId,
            //                         onSuccess: (result) => {
            //                             if (result && result.code) {
            //                                 const code = result.code
            //                                 fetchApi('getdduserinfo', 'POST', JSON.stringify({code}), json => {
            //                                     if (json.code === 3) {
            //                                         thirdParty.Alert(json.message)
            //                                         //return
            //                                     } else if (json.code === 10006) {
            //                                         dispatch(codeError(first, history))
            //                                     } else {
            //                                         if (showMessage(json)) {

            //                                             const Today = new DateLib().toString()
            //                                             const useruuid = json.data.useruuid
            //                                             const lastLogInData = localStorage.getItem(useruuid)

            //                                             if (lastLogInData !== Today) {
            //                                                 sessionStorage.setItem('TodayFirstIn', 'TRUE')
            //                                                 localStorage.setItem(useruuid, Today)
            //                                             } else {
            //                                                 sessionStorage.setItem('TodayFirstIn', 'FALSE')
            //                                             }

            //                                             dispatch(afterGetDbListFetch(json, first))
            //                                         } else if (json.code === Limit.REPEAT_REQUEST_CODE){
            //                                             dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            //                                         }
            //                                     }
            //                                 })
            //                             } else {
            //                                 message.info('钉钉调用出错，请刷新')
            //                             }
            //                         }
            //                     })
            //                 })
            //             }
            //             setDD(_config)
            //         })
            }
        } else {
            if (global.isInWeb) { // 网页端进入
                let code = ''
                if (localStorage.getItem('userCode')) {
                    code = localStorage.getItem('userCode')
                    localStorage.removeItem('userCode')
                }
                dispatch(getUserloginInfoInWeb(first, code))
            } else {
                if (ROOTURL.indexOf('https://desktop.xfannix.com') === 0 || ROOTURL.indexOf('https://dpre.xfannix.com') === 0) {
                    window.location.href = 'https://www.xfannix.com/utils/noticeforbrower.html'
                } else {
                    dispatch(localLogIn(first))
                }
            }
        }
    }
}

export const setDdConfig = () => (dispatch, getState) => {

    if (!browserNavigator.versions.DingTalk || global.isPlay) { // 不是钉钉环境不用
        return
    }

    if (!getState().homeState.getIn(['views', 'setDingConfig'])) {
        dispatch({
            type: ActionTypes.AFTER_SET_DD_CONFIG,
            bool: true
        })
        fetchApi('getddconfig', 'GET', `refreshticket=0&version=${XFNVERSION}`,json => {
            // 调试信息
            // alert('getddconfig:'+JSON.stringify(json))
            // alert('Url:'+window.location.href)
            if (json.code === 3) { // 拦截异常用户
                alert(json.message)
                dispatch({
                    type: ActionTypes.AFTER_SET_DD_CONFIG,
                    bool: false
                })
                return
            } else {
                if (json.code) {
                    showMessage(json)
                    dispatch({
                        type: ActionTypes.AFTER_SET_DD_CONFIG,
                        bool: false
                    })
                    return
                }

                const _config = json.data.config
                let count = 0

                //配置dd
                ;(function setDD(conf) {
                    thirdParty.config(conf)
                    // dispatch({
                    //     type: ActionTypes.AFTER_SET_DD_CONFIG,
                    //     bool: true
                    // })
                    //dd配置校验失败时触发
                    thirdParty.error((err) => {
                        alert('dd error: ' + JSON.stringify(err))
                        if (++count > 1)
                            return alert('二次校验失败，请重新打开页面')

                        //请求更新ticket并重新装填新的配置
                        fetchApi('getddconfig', 'GET', 'refreshticket=1', json => {
                            // alert('Url:'+window.location.href)
                            // alert('getddconfig2'+JSON.stringify(json))
                            if (showMessage(json)) {
                                setDD(json.data.config)
                            } else {
                                dispatch({
                                    type: ActionTypes.AFTER_SET_DD_CONFIG,
                                    bool: false
                                })
                            }
                        })
                    })
                })(_config)
            }
        })
    }
}

export const getUserloginInfoInWeb = (first, code) => dispatch => {

    if (first === 'first') {
        fetchApi('getuserlogintemporary', 'POST', JSON.stringify({
            code: code ? code : 'verify_session'
        }), json => {
            if (json.code === 0) {
                fetchApi('getdduserinfo', 'POST', JSON.stringify({code: ''}), json => {
                    if (json.code === 3) {
                        thirdParty.Alert(json.message)
                        return
                    } else if (json.code === 10006) {
                        dispatch(codeError('', history))
                    } else {
                        if (showMessage(json)) {
                            dispatch(afterGetDbListFetch(json, first))
                            localStorage.setItem('load', 'true')
                        } else if (json.code === Limit.REPEAT_REQUEST_CODE){
                            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                        }
                    }
                    if (!browserNavigator.versions.webKit) {
                        message.info('当前不在“Webkit”内核')
                    }
                })
            } else if (json.code === 10011) {
                thirdParty.Alert('临时授权码已过期，请关闭本页面后，重新在小番财务内跳转浏览器。')
            } else {
                showMessage(json)
            }
        })
    } else {
        fetchApi('getdduserinfo', 'POST', JSON.stringify({code: ''}), json => {
            if (json.code === 3) {
                thirdParty.Alert(json.message)
                return
            } else if (json.code === 10006) {
                dispatch(codeError('', history))
            } else {
                if (showMessage(json)) {
                    dispatch(afterGetDbListFetch(json))
                } else if (json.code === Limit.REPEAT_REQUEST_CODE){
                    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
                }
            }
        })
    }
}

const localLogIn = (first) => dispatch => {
    fetchApi('login', 'POST', JSON.stringify({
        code: ''
    }), json => {

        if (json.code === 3) {
            thirdParty.Alert(json.message)
        } else if (showMessage(json)) {

            const Today = new DateLib().toString()
            const useruuid = json.data.useruuid
            const lastLogInData = localStorage.getItem(useruuid)

            if (lastLogInData !== Today) {
                sessionStorage.setItem('TodayFirstIn', 'TRUE')
                localStorage.setItem(useruuid, Today)
            } else {
                sessionStorage.setItem('TodayFirstIn', 'FALSE')
            }

            sessionStorage.setItem('corpId', json.data.corpId)

            dispatch(afterGetDbListFetch(json, first))
        } else {
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }

    })
}

// 得到账套信息后 1将账套信息赋给userinfo；2获取账套或切换账套成功后，设置vcexist为true，清空panes；
const afterGetDbListFetch = (receivedData, first) => dispatch => {

	if (showMessage(receivedData)) {
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

        const TodayFirstIn = sessionStorage.getItem('TodayFirstIn')
		if (first === 'first') {

			const warning = receivedData.data.warning
			// let warning = {
			// 	comments: "若体验不错，可由“账套设置”-“超级管理”进行购买，咨询热线：0571-28121680",
			// 	content: " 亲爱的小番用户:",
			// 	context: ['预到期'],
			// 	webStyle: 'alert',
			// 	detail: '了解更多'
			// }

            // warning.context.some(v => v.indexOf('增值包') === -1) 用来判断总账是否到期
            // 总账的每次都提示，增值包每天第一次提示
            if (warning.context.some(v => v.indexOf('增值包') === -1) || TodayFirstIn === 'TRUE') {
                if (warning.detail === '了解更多') {
                    warning.comments = '若体验不错，用钉钉移动端打开小番财务会有相应提示弹窗，可点击"了解详情"进行购买，咨询热线：0571-28121680'
                }

                let userTipStr = warning && warning.context.length ? warning.context.join(',') : ''

                if (userTipStr !== '') {

                    const connectTipStr = warning.content + userTipStr + '。' + warning.comments

                    if (warning.webStyle === 'alert') {
                        thirdParty.Alert(connectTipStr)
                        // alert(connectTipStr)
                    } else {
                        message.info(connectTipStr, 3)
                    }
                }
            }

		}


		// dispatch({
		// 	type: ActionTypes.AFTER_GET_IDENTITY_FETCH,
		// 	receivedData
		// })

		// const period = receivedData.data.period

		//进销存－－－－本地调试需要，路由中加 sobid
        const sobInfo = receivedData.data.sobInfo
		sessionStorage.setItem('psiSobId', sobInfo ? sobInfo.sobId : '')
        // sessionStorage.setItem('psiSobId', receivedData.data.defaultsobid) //调试专用
        // sessionStorage.setItem('sobId', receivedData.data.defaultsobid)//调试专用
        sessionStorage.setItem('sobId', sobInfo ? sobInfo.sobId : '')
        global.ssid = receivedData.data.ssid

		dispatch({
			type: ActionTypes.AFTER_GET_DBLIST_FETCH,
            receivedData: receivedData.data,
            first
		})

        if (sobInfo) {
            if (receivedData.data.needGuide === "GL") {
                dispatch({
                    type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
                    name: 'guideGL',
                    bool: true
                })
            } else if (receivedData.data.needGuide === "JR") {
                dispatch({
                    type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
                    name: 'guideZN',
                    bool: true
                })
            }
            dispatch(allActions.changeSystemInfo())
            if (sobInfo.moduleInfo.indexOf('RUNNING') > -1) {
                dispatch(allRunningActions.getRunningSettingInfo(first,true,receivedData.data))
            }
        } else {
            // // 没有账套，且不是钉钉管理员时，获取有哪些管理员
            // if (receivedData.data.isAdmin === 'FALSE' && receivedData.data.isFinance === 'FALSE' && receivedData.data.isDdAdmin === 'FALSE' && receivedData.data.isDdPriAdmin === 'FALSE') {
            //     fetchApi('getAdminNameList', 'GET', '', json => {
            //         if (showMessage(json)) {
            //             dispatch({
            //                 type: ActionTypes.GET_ADMIN_FINANCE_NAME_LIST,
            //                 adminList: json.data.adminList
            //             })
            //         }
            //     })
            // }
            if (receivedData.data.isAdmin === 'TRUE' || receivedData.data.isDdAdmin === 'TRUE' || receivedData.data.isDdPriAdmin === 'TRUE' || receivedData.data.isFinance === 'TRUE') {
                // 超级管理员、钉钉管理员，钉钉子管理员、财务经理 可以新增账套

                dispatch(beforeInsertGetModelFCList())  // 账套编辑需要外币列表

                if (receivedData.data.isAdmin === 'TRUE') {
                    if (receivedData.data.securityCenterModified === 'FALSE') { //超级管理员 且公司从未保存过安全中心 跳安全中心
                        dispatch({
                            type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
                            name: 'firstToSecurity',
                            bool: true
                        })
                        // history.push('/config/security')
                    } else {
                        if (receivedData.data.sobNumber > receivedData.data.usedSobNumber) { // 有账套余额
                            dispatch({
                                type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
                                name: 'firstToSobInsert',
                                bool: true
                            })
                            const corpName = receivedData.data.corpName

                            dispatch(addPageTabPane('ConfigPanes', 'SobOption', 'SobOption', '账套新增'))
                            dispatch(addHomeTabpane('Config', 'SobOption', '账套新增'))
                            setTimeout(() => dispatch(middleActions.sobOptionInit('', ()=>{}, corpName)), 100)
                            // dispatch(sobConfigActions.beforeHomeInsertOrModifySob(history))
                        } else {
                            dispatch({
                                type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
                                name: 'firstToSob',
                                bool: true
                            })
                            dispatch(addPageTabPane('ConfigPanes', 'Sob', 'Sob', '账套设置'))
                            dispatch(addHomeTabpane('Config', 'Sob', '账套设置'))
                        }
                    }

                } else {  //钉钉管理员，钉钉子管理员、财务经理

                    if (receivedData.data.sobNumber > receivedData.data.usedSobNumber) { // 有账套余额
                        dispatch({
                            type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
                            name: 'firstToSobInsert',
                            bool: true
                        })
                        const corpName = receivedData.data.corpName

                        dispatch(addPageTabPane('ConfigPanes', 'SobOption', 'SobOption', '账套新增'))
                        dispatch(addHomeTabpane('Config', 'SobOption', '账套新增'))
                        setTimeout(() => dispatch(middleActions.sobOptionInit('', ()=>{}, corpName)), 100)
                    } else {
                        dispatch({
                            type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
                            name: 'firstToWelcome',
                            bool: true
                        })
                        fetchApi('getAdminNameList', 'GET', '', json => {
                            if (showMessage(json)) {
                                dispatch({
                                    type: ActionTypes.GET_ADMIN_FINANCE_NAME_LIST,
                                    adminList: json.data.adminList
                                })
                            }
                        })
                    }
                }

            } else { // 普通员工不能新增账套
                dispatch({
                    type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
                    name: 'firstToWelcome',
                    bool: true
                })
                fetchApi('getAdminNameList', 'GET', '', json => {
                    if (showMessage(json)) {
                        dispatch({
                            type: ActionTypes.GET_ADMIN_FINANCE_NAME_LIST,
                            adminList: json.data.adminList
                        })
                    }
                })
            }
        }
	}
}
export const openModalChooseToGo = (data) => dispatch => {
    // 有msgDtoList，显示弹框跳转
    if(data.msgDtoList){
        const msg = data.msgDtoList[0]
        thirdParty.Confirm({
            message: msg.bodyContent,
            title: msg.bodyTitle,
            buttonLabels: [msg.button1, msg.button2],
            onSuccess : (result) => {
                if (result.buttonIndex === 1) {
                    const valueList = msg.url2.split('-')
                    if(valueList[3] === 'payment'){ //录入核算与管理
                        dispatch({
                            type: ActionTypes.CALCULATE_FROM_SEARCH_JUMP_TO_EDIT,
                            pageType: valueList[4],
                            PageTab: 'payment',
                            insertOrModify: 'insert',
                            needSendRequest: true
                        })
                    }
                    dispatch(addPageTabPane(`${valueList[0]}Panes`, valueList[1], valueList[1], valueList[2]))
                    dispatch(addHomeTabpane(valueList[0], valueList[1], valueList[2]))
                }
            }
        })
    }
}

export const beforeInsertGetModelFCList = () => dispatch => {
    fetchApi('getModelFCList', 'GET', '', json => {
        if (showMessage(json)) {
            dispatch({
                type: ActionTypes.BEFORE_INSERT_GET_MODEL_FCLIST,
                receivedData: json.data
            })
        }
    })
}

//设置默认账套 传入sobid
export const setDefaultDbFetch = (defaultsobid) => dispatch => {

    thirdParty.Confirm({
        message: '切换账套后，已打开的页面不会保存，是否切换？',
        title: "切换账套",
        buttonLabels: ['取消', '切换账套'],
        onSuccess : (result) => {
            if (result.buttonIndex === 1) {
                dispatch(allActions.freshReportPage())
                dispatch(allActions.freshYebPage())
                dispatch(allActions.freshMxbPage())
                dispatch(allActions.freshSearchPage())
                dispatch(allActions.freshEditPage())
                dispatch(allActions.freshConfigPage())

                fetchApi('setdefaultsobid', 'POST', JSON.stringify({
                    defaultsobid
                }), json => {
                    if (showMessage(json)) {
                        dispatch(getDbListFetch())
                        dispatch({
                            type: ActionTypes.CLEAR_HOME_TAB_PANE
                        })
                    }
                })
            }
        }
    })
}


// export const initCxpz = () => ({
// 	type: ActionTypes.INIT_CXPZ
// })

//初始化App
// const initApp = () => dispatch => {
// 	dispatch({type: ActionTypes.INIT_ALL})
// 	dispatch({type: ActionTypes.INIT_HOME})
// 	dispatch({type: ActionTypes.INIT_LRPZ})
// 	dispatch({type: ActionTypes.INIT_CXPZ})
// 	dispatch({type: ActionTypes.INIT_BOSS})
// 	dispatch({type: ActionTypes.INIT_QCYE})
// 	dispatch({type: ActionTypes.INIT_MXB})
// 	dispatch({type: ActionTypes.INIT_LRB})
// 	dispatch({type: ActionTypes.INIT_KMYEB})
// 	dispatch({type: ActionTypes.INIT_ZCFZB})
// 	dispatch({type: ActionTypes.INIT_SOBCONFIG})
// 	dispatch({type: ActionTypes.INIT_ASSMXB})
// 	dispatch({type: ActionTypes.INIT_ASS_KMYEB})
// 	dispatch({type: ActionTypes.INIT_AMBSYB})
// 	dispatch({type: ActionTypes.INIT_CURRENCY})
// 	dispatch({type: ActionTypes.INIT_JZ})
// 	dispatch({type: ActionTypes.INIT_ASSETSYEB})
//
// }
//显示page10006页面
export const showCodePage = (first ,history) => dispatch => {
    history.push('/page10006')
}
// ({
// 	type: ActionTypes.SHOW_CODE_PAGE
// })

//10006
const codeError = (first='', history) => dispatch => {
	fetchApi('getdduserinfo', 'POST', JSON.stringify({code: ''}), json => {
		if (json.code === 3) {
			thirdParty.Alert(json.message)
		}else if(json.code === 10006){
			fetchApi('getdduserinfo', 'POST', JSON.stringify({code: ''}), json => {
				if (json.code === 3) {
					thirdParty.Alert(json.message)
				}else if(json.code === 10006){
					dispatch(showCodePage(history))
				}else{
					showMessage(json)
					if(first){
						dispatch(afterGetDbListFetch(json, first))
						return
					}
					dispatch(afterGetDbListFetch(json))
				}
			})
		}else{
			showMessage(json)
			if(first){
				dispatch(afterGetDbListFetch(json, first))
				return
			}
			dispatch(afterGetDbListFetch(json))
		}
	})
}

export const spreadHomeNavber = (manualExpansion) => ({
	type: ActionTypes.SPREAD_HOME_NAVBER,
	manualExpansion
})

export const showNavbarChildrenList = (key) => ({
	type: ActionTypes.SHOW_NAVBAR_CHILDREN_LIST,
	key
})
export const changeHomeLockFilterShow = (bool) => ({
	type: ActionTypes.CHANGE_HOME_LOCK_FILTER_SHOW,
	bool
})

// youle
export const changePleasureGroundModule = (bool) => ({
    type: ActionTypes.CHANGE_PLEASURE_GROUND_MODULE,
    bool
})

export const enterPleasureGround = (history, demo, sobModel) => dispatch => {

    fetchApi('playOpen', 'POST', JSON.stringify({
        demo,
        sobModel
    }), json => {
        if (showMessage(json)) {

            global.isPlay = true

            dispatch(changePleasureGroundModule(true))

            dispatch(allActions.freshReportPage())
            dispatch(allActions.freshYebPage())
            dispatch(allActions.freshMxbPage())
            dispatch(allActions.freshSearchPage())
            dispatch(allActions.freshEditPage())
            dispatch(allActions.freshConfigPage())

            dispatch(getDbListFetch('', history))

            dispatch({
                type: ActionTypes.CLEAR_HOME_TAB_PANE
            })
        }
    })
}

export const quitPleasureGround = (history) => dispatch => {
    thirdParty.Confirm({
		message: "确定退出体验模式？",
		title: "提示",
		buttonLabels: ['取消', '确定'],
		onSuccess : (result) => {

			if (result.buttonIndex === 1) {
                global.isPlay = false
                dispatch(changePleasureGroundModule(false))
                dispatch(allActions.freshReportPage())
                dispatch(allActions.freshYebPage())
                dispatch(allActions.freshMxbPage())
                dispatch(allActions.freshSearchPage())
                dispatch(allActions.freshEditPage())
                dispatch(allActions.freshConfigPage())
                dispatch(getDbListFetch('', history))
                dispatch({
                    type: ActionTypes.CLEAR_HOME_TAB_PANE
                })
			} else {
				return
			}
		},
		onFail : (err) => console.log(err)
	})
}

// 创建内部演示账套
export const createTestSob = (history, demo) => dispatch => {

    fetchApi('copyTest', 'POST', JSON.stringify({demo}), json => {
        if (showMessage(json)) {

            dispatch(allActions.freshReportPage())
            dispatch(allActions.freshYebPage())
            dispatch(allActions.freshMxbPage())
            dispatch(allActions.freshSearchPage())
            dispatch(allActions.freshEditPage())
            dispatch(allActions.freshConfigPage())

            dispatch(getDbListFetch('', history))

            dispatch({
                type: ActionTypes.CLEAR_HOME_TAB_PANE
            })
        }
    })
}

export const changeLoginGuideString = (name, bool) => ({
    type: ActionTypes.CHANGE_LOGIN_GUIDE_STRING,
    name,
    bool
})

export const sendGuideImage = (url) => dispatch => {
    fetchApi('sendGuideImage', 'GET', `imageURL=${url}`, json => {
        if (showMessage(json)) {
            message.info('打印文件已通过企业消息发送给您，请注意查收')
        }
    })
}

export const openLinkInBrowser = (callBack) => dispatch => {

    //创建ajax引擎
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    setTimeout(() => dispatch({type: ActionTypes.SWITCH_LOADING_MASK}), 3000)
    function getXmlHttpObject() {
        let xmlhttp;
        //不同浏览器获取xmlHttpRequest对象方法不一样
        if (window.XMLHttpRequest) {
            //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
            xmlhttp = new XMLHttpRequest()
        } else {
            // IE6, IE5 浏览器执行代码
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
        }
        return xmlhttp
    }

    let myXmlHttpRequest = ""

    function getUserCode() {

        myXmlHttpRequest = getXmlHttpObject()
        //怎么判断创建ok
        if (myXmlHttpRequest) {
            const psiSobId = `psiSobId=${sessionStorage.getItem('psiSobId')}`

            const isPlayStr = `isPlay=${global.isPlay}`
            const version = `version=${XFNVERSION}`
            const timestamp = `timestamp=${new Date().getTime()}`
            let ssid = `ssid=''`

            if (global.isInWeb) {
                source = 'source=webDesktop'
            }

            if (global.ssid) {
                ssid = `ssid=${global.ssid}`
            }
            const url = `${ROOT}/u/code/get?${network}&${source}&${psiSobId}&${version}&${timestamp}&${isPlayStr}&${ssid}`
            //这个是要发送的数据
            const data = ''
            //打开请求,准备发送,,true表示同步处理
            myXmlHttpRequest.open("post", url, false);
            //还有一句话，这句话必须
            //在编程过程中，建议用Post，post会更好一些
            myXmlHttpRequest.setRequestHeader("Content-type","application/json")
            myXmlHttpRequest.withCredentials = true
            //指定回调函数.chuli是函数名
            myXmlHttpRequest.onreadystatechange=callBackRespon;
            //真的发送请求，如果是get请求则填入 null即可
            //如果是post请求，则填入实际的数据
            myXmlHttpRequest.send(data);
            //状态改变的触发器
            //myXmlHttpRequest.open("get");
        } else {
            //window.alert("创建失败");
        }
    }

    function callBackRespon() {
        //window.alert("处理函数被调回"+myXmlHttpRequest.readyState);
        // console.log('fdfsd', myXmlHttpRequest.readyState);
        if (myXmlHttpRequest.readyState == 4) {
            const mes = JSON.parse(myXmlHttpRequest.responseText)
            if (showMessage(mes)) {
                const code = mes.data

                const href = location.href
                const urlParam = getUrlParam(href)

                thirdParty.openLink({
                    // url: `http://localhost:3800/build/desktop/index.html#/browserindex?isOV=false&corpid=${sessionStorage.getItem('corpId')}&code=${code}&urlbackup=${urlParam.urlbackup ? urlParam.urlbackup : 'false'}`
                    url: `${ROOTURL}/index.html#/browserindex?isOV=false&corpid=${sessionStorage.getItem('corpId')}&code=${code}&urlbackup=${urlParam.urlbackup ? urlParam.urlbackup : 'false'}`
                })
            }
        }
    }
    getUserCode()
}
