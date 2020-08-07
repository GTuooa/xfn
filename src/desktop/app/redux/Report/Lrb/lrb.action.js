import * as ActionTypes from './ActionTypes.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'
import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant.js'
import * as thirdParty from 'app/thirdParty'
import { fromJS } from 'immutable'

export const getPeriodAndIncomeStatementFetch = (issuedate, endissuedate, selectAssId = 0, asscategory, assid) => dispatch => {
	dispatch(AllGetLrblistListFetch(issuedate, endissuedate, selectAssId, assid, asscategory, 'true'))
	dispatch(showInitLrb(false))
}


export const getIncomeStatementFetch = (issuedate, endissuedate, selectAssId = 0, assid, asscategory) => (dispatch, getState) => {
	dispatch(AllGetLrblistListFetch(issuedate, endissuedate, selectAssId, assid, asscategory))
}

const AllGetLrblistListFetch = (issuedate, endissuedate, selectAssId, assid, asscategory, getPeriod) => (dispatch, getState) => {
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
	const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
	let url = ''
	let options = {}
	if (isRunning) { // 智能版
		url = 'getJrincomestatement'
        options = {
            begin: issuedate ? `${issuedate.substr(0,4)}-${issuedate.substr(6,2)}` : '',
            end: issuedate ? `${endissuedate.substr(0,4)}-${endissuedate.substr(6,2)}` : '',
            needPeriod:getPeriod,
        }
	} else if (selectAssId === 0) { // 会计版无阿米巴
		if (issuedate == endissuedate) {
			// 单月／无AMB
			url = 'getincomestatement'
			options = {
				year: issuedate ? issuedate.substr(0, 4) : '',
				month: issuedate ? issuedate.substr(6, 2) : '',
				getPeriod,
			}
		} else {
			// 多月／无AMB
			url = 'getincomestatementquarter'
			options = {
				begin: issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}` : '',
				end: issuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : '',
				getPeriod,
			}
		}
	} else { // 会计版有阿米巴
		const assSelectableList = getState().lrbState.get('assSelectableList')
		const assid = assSelectableList.getIn([selectAssId, 'assid'])
		const asscategory = assSelectableList.getIn([selectAssId, 'asscategory'])

		dispatch({
			type: ActionTypes.CHANGE_SELECTASSID,
			selectAssId
		})

		if (issuedate == endissuedate) {
			// 单月／有
			url = 'getincomestatementass'
			options = {
				year: issuedate ? issuedate.substr(0, 4) : '',
				month: issuedate ? issuedate.substr(6, 2) : '',
				asscategory,
				assid,
				getPeriod,
			}
		} else {
			// 多月／有
			url = 'getincomestatementquarterass'
			options = {
				begin: issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}` : '',
				end: issuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : '',
				asscategory,
				assid,
				getPeriod,
			}
		}
	}



	fetchApi(url, 'POST', JSON.stringify(options), json => {

		if (showMessage(json)) {

			dispatch({
				type: ActionTypes.CHANGE_INCOME_STATEMENT,
				receivedData: json.data.profitlist
			})

			if (getPeriod == 'true') {

				const openedissuedate = dispatch(allActions.everyTableGetPeriod(json))
				const issuedateNew = issuedate ? issuedate : openedissuedate
				const endissuedateNew = endissuedate ? endissuedate : openedissuedate

				if (!assid) {
					dispatch({
						type: ActionTypes.CHANGE_ISSUDATE,
						issuedate: issuedateNew,
						endissuedate: endissuedateNew
					})
				}

			} else {

				if (!assid) {
					dispatch({
						type: ActionTypes.CHANGE_ISSUDATE,
						issuedate,
						endissuedate
					})
				}

			}

			if (selectAssId === 0) {
				if (issuedate == endissuedate) {
					if (!assid) {
						if (json.data.assList) {

							if (json.data.assList.length > 1) {
								let assSelectableList = json.data.assList
								assSelectableList.unshift({assid: 0, assname: '全部核算项目'})
								assSelectableList.forEach((v, i) => v.key = i)
								dispatch({
									type: ActionTypes.CHANGE_ASSSELECTABLELIST,
									assSelectableList
								})
							} else {
								let assSelectableList = []
								dispatch({
									type: ActionTypes.CHANGE_ASSSELECTABLELIST,
									assSelectableList
								})
							}
						}
					}
				}
			}

			if (selectAssId === 0) {
				dispatch({
					type: ActionTypes.CHANGE_SELECTASSID,
					selectAssId
				})
			}

		} else {
			dispatch({
				type: ActionTypes.INIT_LRB
			})
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const changeLrbRuleModal = () => ({
	type: ActionTypes.CHANGE_LRB_RULE_MODAL
})

export const changeLrbChooseMorePeriods = () => ({
	type: ActionTypes.CHANGE_LRB_CHOOSE_MORE_PERIODS
})

export const changeListType = () => ({
	type: ActionTypes.CHANGE_LIST_TYPE
})
// lrb期初设置
export const getInitIncomeStatementFetch = (firstyear, firstmonth, periodStartMonth) => (dispatch,getState) => {
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
	const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
    
	fetchApi(isRunning? 'getJrinitincomestatement' : 'getinitincomestatement', 'GET', '', json => {
		if (showMessage(json)) {
			dispatch({
				type: ActionTypes.GET_INIT_INCOMESTATEMENT,
                receivedData: json.data,
            })
			// const lastMonth = Number(firstmonth) - 1
			// const lastMonthStr = lastMonth < 10 ? `0${lastMonth}` : `${lastMonth}`
           
            // 判断是否小于等于10 是否要拼接字符串0 调整起始年份messageYearStart 调整起始月份messageMonthStart 调整终止年份messageYearEnd 调整终止月份messageMonthEnd
            const lastMonthstr = firstmonth <= 10 ? `0${firstmonth- 1}` : `${firstmonth- 1}`
            const messageYearStart = Number(firstmonth) > Number(periodStartMonth) ? firstyear : firstyear - 1
            // const messageMonthStart = Number(periodStartMonth
            const messageYearEnd = Number(firstmonth) > Number(periodStartMonth) ? firstyear : Number(firstmonth) === 1 ? firstyear-1 : firstyear
            const messageMonthEnd =  Number(firstmonth) > Number(periodStartMonth) ? lastMonthstr : Number(firstmonth) === 1 ? 12 : lastMonthstr 
			// const message = `当前账套起始账期为${firstyear}-${firstmonth}期,请填写下列项目${firstyear}-01期至${firstyear}-${lastMonthStr}期的累计发生额,以修正利润表本年累计金额(注：起始账期修改后,调整数据将会被清零)。`

			const message = `当前账套起始账期为${firstyear}-${firstmonth}期,请填写下列项目${messageYearStart}-${periodStartMonth}期至${messageYearEnd}-${messageMonthEnd}期的累计发生额,以修正利润表本年累计金额(注：起始账期修改后,调整数据将会被清零)。`

			// confirm(message)
			thirdParty.Alert(message)
		}
	})
}

export const changeInitLrbAmount = (lineIndex, amount) => ({
	type: ActionTypes.CHANGE_INIT_LRB_AMOUNT,
	lineIndex,
	amount
})

export const saveInitLrbFetch = () => (dispatch, getState) => {
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
	const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
	let initPeriodList = getState().lrbState.get('initPeriodList')
	initPeriodList = initPeriodList.filter(v => v.get('amount') !== '')
	fetchApi(isRunning?'incomeJrstatementinit':'incomestatementinit', 'POST', JSON.stringify({initPeriodList}), json => showMessage(json, 'show'))
}
export const showInitLrb = (value) => ({
	type: ActionTypes.SHOW_INIT_LRB,
	value
})
export const clearInitLrb = () => ({
	type: ActionTypes.CLEAR_INIT_LRB
})

// 获取小贩报表数据
export const getinitincomestatement = (issuedate, endissuedate,getPeriod="true") => (dispatch,getState) => {

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	 const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
	const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
	let object = {}
	if (!issuedate) {
		// 进入页面发送的参数
		object = {
			getPeriod: 'true',
            needPeriod: 'true',
			begin: '',
			end: ''
		}
	} else {
		object={
			begin: issuedate ? `${issuedate.substr(0,4)}${isRunning?'-':''}${issuedate.substr(6,2)}` : '',
			end: endissuedate ? `${endissuedate.substr(0,4)}${isRunning?'-':''}${endissuedate.substr(6,2)}` : `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`,
			getPeriod,
			needPeriod:getPeriod,
			referBegin:'',
			referEnd:''
		}
    }
    fetchApi(isRunning? 'getJrProfit' : 'getIncomestatementCustomize', 'POST', JSON.stringify(object), resp => {
	// fetchApi(isRunning? 'getJrProfit' : 'getSelfTypeListData', 'POST', JSON.stringify(object), resp => {
		if (showMessage(resp)) {
			let selfListData = []
			let extraMessage = []
            const issues = resp.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(resp.data.periodDtoJson)) : ''
            const data = resp.data.result
            
			for(let i in data){
				if(data[i].linename){
                    selfListData.push(data[i])
				}else{
					extraMessage.push(data[i])
				}
            }
            
			dispatch({
				type: ActionTypes.GET_SELF_MADE_PROFIT_LIST,
				payload: selfListData,
				extraMessage,
				issues
			})
            const openedissuedate = isRunning ? dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(resp)) : dispatch(allActions.everyTableGetPeriod(resp))
			const issuedateNew = issuedate ? issuedate : openedissuedate
            const endissuedateNew = endissuedate ?endissuedate : openedissuedate

			dispatch({
				type: ActionTypes.CHANGE_ISSUDATE,
				issuedate: issuedateNew,
				endissuedate: endissuedateNew
            })
            
		}
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	})
}

export const upDateChlidProfitList = (payload)=>({
	type:ActionTypes.UPDATE_CHILD_PROFIT_LIST,
	payload
})
export const expandTable=(payload)=>({
	type:ActionTypes.EXPAND_TABLE,
	payload
})

export const changeDifferType=(differenceType)=>(dispatch)=>{
	dispatch({
		type:ActionTypes.CHANGE_DIFFERENCE_TYPE,
		value:differenceType
	})
}

export const changeReferChooseValue=(value)=>dispatch=>{
	dispatch({
		type:ActionTypes.SET_REFER_CHOOSE_VALUE,
		value
	})
}

export const changeLrbString=(name,value)=>dispatch=>{
	dispatch({
		type:ActionTypes.SET_LRB_COMMON_VALUE,
		name,
		value,
	})
}
export const getInitListFetch=(issuedate,endissuedate,referBegin,referEnd,getPeriod="true")=>(dispatch,getState)=>{

	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
	const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
	let object={
		begin: issuedate ? `${issuedate.substr(0,4)}${isRunning?'-':''}${issuedate.substr(6,2)}` : '',
		end: endissuedate ? `${endissuedate.substr(0,4)}${isRunning?'-':''}${endissuedate.substr(6,2)}` : `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`,
		referBegin:referBegin?isRunning ?referBegin.substr(0,4)+'-'+referBegin.substr(4,2):referBegin:'',
		referEnd:referEnd?isRunning ?referEnd.substr(0,4)+'-'+referEnd.substr(4,2):referEnd:'',
		getPeriod,
		needPeriod:getPeriod
    }
    
	fetchApi(isRunning? 'getJrProfit' : 'getSelfTypeListData', 'POST', JSON.stringify(
		object
	),resp=>{
		if(showMessage(resp)){
			dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            const openedissuedate = isRunning ? dispatch(allRunningActions.reportGetIssuedateAndFreshPeriod(resp)) : dispatch(allActions.everyTableGetPeriod(resp))
			const newIssuedate = object.begin ?issuedate: openedissuedate
			const newEndissuedate = endissuedate?endissuedate:``
            const issues = resp.data.periodDtoJson ? dispatch(allActions.everyTableGetIssuedate(resp.data.periodDtoJson)) : ''
			let selfListData = []
			let extraMessage = []
			const data = resp.data.result
			for(let i in data){
				if(data[i].linename){
					selfListData.push(data[i])
				}else{
					extraMessage.push(data[i])
				}
			}
			dispatch({
				type:ActionTypes.SET_SELF_TYPE_LIST_DATA,
				selfListData,
				extraMessage,
				issues
			})
			dispatch({
				type: ActionTypes.CHANGE_ISSUDATE,
				issuedate: newIssuedate,
				endissuedate:newEndissuedate
			})
			dispatch(setReferDate(referBegin?referBegin:'',referEnd?referEnd:""))
		}
	})
}

export const setReferDate=(referBegin, referEnd)=>(dispatch)=>{
	dispatch({
		type:ActionTypes.SET_REFER_DATE,
		referBegin,
		referEnd
	})
}

export const getExtraInformationList = (cb)=>(dispatch,getState)=>{
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
	const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
    fetchApi(isRunning? 'getJrExtraMessage' :'getSelfTypeListExtraMessage','GET','',resp=>{
		if(showMessage(resp)){
			dispatch({
				type:ActionTypes.SET_LRB_COMMON_VALUE,
				name:'extraMessageList',
				value:fromJS(resp.data)
			})
			cb()
		}
	})
}

export const setExtraMessageList = (messageList,cb)=>(dispatch,getState)=>{
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
    fetchApi(isRunning? 'setJrExtraMessageList' :'setExtraMessageList','POST',JSON.stringify({
		messageList
	}),json => {
		if(showMessage(json,'show')){
			cb()
		}
	})
}

export const getMeasureInitData=(issuedate,endissuedate)=>(dispatch,getState)=>{
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
	dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
    dispatch({
        type:ActionTypes.SHOW_MEASURE_RESULT,
        bool:false
    })
    const cannotChecked = getState().lrbState.get('cannotChecked').toJS()
    const haveSwitchList= getState().lrbState.get('haveSwitchList')
    fetchApi(isRunning? 'getJrMeasureList':'getMeasureList', 'POST', JSON.stringify({
        begin: issuedate ? `${issuedate.substr(0,4)}${isRunning?'-':''}${issuedate.substr(6,2)}` : '',
		end: endissuedate ? `${endissuedate.substr(0,4)}${isRunning?'-':''}${endissuedate.substr(6,2)}` : `${issuedate.substr(0,4)}${isRunning?'-':''}${issuedate.substr(5,2)}`,
        referBegin:'',
		referEnd:"",
		needPeriod:'false'
    }),resp=>{
		dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        if(showMessage(resp)){
            // dispatch({
            //     type:ActionTypes.SET_MEASURE_INIT_DATE,
            //     issuedate,
            //     endissuedate
            // })
            const incomeTotal = resp.data.result[0]
            const profit = resp.data.result.find(v=>v.linename.substr(-4,4)==='业务利润' || v.linename.substr(-4,4)==='营业利润')
            const profitIndex = resp.data.result.findIndex(v=>v.linename.substr(-4,4)==='业务利润' || v.linename.substr(-4,4)==='营业利润')
            let detailList = resp.data.result.slice(1,profitIndex)
            let checkedList = []
            const loop=(list,checked)=>list.map((item)=>{
                if(!cannotChecked.includes(item.linename)){
                    //let uniqueId =item.lineindex ?item.lineindex :item.acId
                    //checkedList.push(item.linename)
                    item.showChild=false
                    item.checked=checked
                    item.testMonthaccumulation = `${item.monthaccumulation.toFixed(2)}`
                    item.testShareOfMonth = `${item.shareOfMonth*100}`
                }
                if(item.childProfit.length>0){
                    loop(item.childProfit,false)
                }
                if(haveSwitchList.includes(item.linename)){
                    if(item.linename==='管理费用'){
                        item.testAmount=false
                        if(item.childProfit.length>0){
                            item.childProfit.map((item)=>{
                                item.testAmount=false
                            })
                        }
                    }else{
                        item.testAmount=true
                        if(item.childProfit.length>0){
                            item.childProfit.map((item)=>{
                                item.testAmount=true
                            })
                        }
                    }


                }
            })
            loop(detailList,true)
            // for (let i in detailList){
            //     for(let j in cannotChecked){
            //         if(detailList[i].linename===cannotChecked[j]){
            //             let key = detailList[i].lineindex ?detailList[i].lineindex :detailList[i].acId
            //             let index=checkedList.findIndex(v=>v===key)
            //             checkedList.splice(index,1)
            //         }
            //     }
            // }
            dispatch({
                type:ActionTypes.SET_MEASURE_INIT_DATA,
                incomeTotal,
                profit,
                detailList,
                checkedList,
                showChildList:[]
            })
			dispatch(changeLrbString('calculatePage',true))
        }
    })
}

export const changeTestShareOfMonth=(value,uniqueId)=>(dispatch,getState)=>{
    let detailList= getState().lrbState.get('detailList').toJS()
    const loop=(list)=>list.map((item,index)=>{
        let itemUniqueId= item.lineindex ?item.lineindex :item.acId
        if(itemUniqueId===uniqueId){
            item.testShareOfMonth=value
            if(item.childProfit.length>0){
                item.childProfit.map((e)=>{
                    e.checked=false
                })
            }
        }else{
            loop(item.childProfit)
        }
        let find=item.childProfit.find(e=>{
            let eUniqueId = e.lineindex ?e.lineindex :e.acId
            return uniqueId===eUniqueId
        })
        if(find){
            let result = 0
            item.childProfit.filter(v=>v.checked).map((e,i)=>{
                result = result+Number(e.testShareOfMonth)
            })
            item.testShareOfMonth=`${result}`
        }

    })
    loop(detailList)
    dispatch({
        type:ActionTypes.UPDATE_MEASURE_DETAIL_LIST,
        detailList
    })
}
export const changeTestMonthaccumulation=(value,uniqueId)=>(dispatch,getState)=>{
    let detailList= getState().lrbState.get('detailList').toJS()
    const loop=(list)=>list.map((item,index)=>{
        let itemUniqueId= item.lineindex ?item.lineindex :item.acId
        if(itemUniqueId===uniqueId){
            item.testMonthaccumulation=value
            if(item.childProfit.length>0){
                item.childProfit.map((e)=>{
                    e.checked=false
                })
            }
        }else{
            loop(item.childProfit)
        }
        let find=item.childProfit.find(e=>{
            let eUniqueId = e.lineindex ?e.lineindex :e.acId
            return uniqueId===eUniqueId
        })
        if(find){
            let result = 0
            item.childProfit.filter(v=>v.checked).map((e,i)=>{
                result = result+Number(e.testMonthaccumulation)
            })
            item.testMonthaccumulation=`${result.toFixed(2)}`
        }
    })
    loop(detailList)
    dispatch({
        type:ActionTypes.UPDATE_MEASURE_DETAIL_LIST,
        detailList
    })
}

export const changeSwitchType = (linename)=>(dispatch,getState)=>{
    let detailList= getState().lrbState.get('detailList').toJS()
    const loop=(list)=>list.map((item,index)=>{
        if(item.linename===linename){
            item.testAmount=!item.testAmount
            item.testMonthaccumulation = `${item.monthaccumulation.toFixed(2)}`
            item.testShareOfMonth = `${item.shareOfMonth*100}`
            if(item.childProfit.length>0){
                loop2(item.childProfit)
            }
        }else{
            loop(item.childProfit)
        }
    })
    const loop2=(list)=>list.map((item,index)=>{
        item.testAmount=!item.testAmount
        item.testMonthaccumulation = `${item.monthaccumulation.toFixed(2)}`
        item.testShareOfMonth = `${item.shareOfMonth*100}`
        if(item.childProfit.length>0){
            loop2(item.childProfit)
        }
    })
    loop(detailList)
    dispatch({
        type:ActionTypes.UPDATE_MEASURE_DETAIL_LIST,
        detailList
    })
}

export const handleItemShow = (uniqueId,resultShowChildItem,show)=>(dispatch,getState)=>{
    let detailList= getState().lrbState.get('detailList').toJS()
    const loop=(list)=>list.map((item,index)=>{
        let itemUniqueId= item.lineindex ?item.lineindex :item.acId
        if(itemUniqueId===uniqueId){
            item.showChild=show
        }
        if(item.childProfit.length>0){
            loop(item.childProfit)
        }
    })
    loop(detailList)
    dispatch({
        type:ActionTypes.UPDATE_MEASURE_DETAIL_LIST,
        detailList
    })
    dispatch({
        type:ActionTypes.SET_RESULT_SHOW_CHILD_LIST,
        resultShowChildItem
    })
}

export const handleItemChecked = (uniqueId,checked)=>(dispatch,getState)=>{
    let detailList= getState().lrbState.get('detailList').toJS()
    const loop=(list)=>list.map((item,index)=>{
        let itemUniqueId= item.lineindex ?item.lineindex :item.acId
        if(itemUniqueId===uniqueId){
            item.checked=!checked
            if(item.childProfit.length>0){
                loop2(item.childProfit)
            }
        }else{
            loop(item.childProfit,checked)
        }
        let find=item.childProfit.find(e=>{
            let eUniqueId = e.lineindex ?e.lineindex :e.acId
            return uniqueId===eUniqueId
        })
        if(find){
            let result = 0
            let resultMonthaccumulation= 0
            item.childProfit.filter(v=>v.checked).map((e,i)=>{
                result = result+Number(e.testShareOfMonth)
                resultMonthaccumulation = resultMonthaccumulation+Number(e.testMonthaccumulation)
            })
            item.testShareOfMonth=`${result}`
            item.testMonthaccumulation = `${resultMonthaccumulation.toFixed(2)}`
            if(item.childProfit.filter(v=>v.checked).length===0){//全都mei选中
                item.checked=false
            }else{
                item.checked=true
            }
        }else{
            if(itemUniqueId===uniqueId && item.childProfit.length>0){
                let result = 0
                let resultMonthaccumulation= 0
                item.childProfit.filter(v=>v.checked).map((e,i)=>{
                    result = result+Number(e.testShareOfMonth)
                    resultMonthaccumulation = resultMonthaccumulation+Number(e.testMonthaccumulation)
                })
                item.testShareOfMonth=`${result}`
                item.testMonthaccumulation = `${resultMonthaccumulation.toFixed(2)}`
            }
        }
    })
    const loop2=(list)=>list.map((item,index)=>{
        item.checked=!checked
        if(item.childProfit.length>0){
            loop2(item.childProfit)
        }
    })
    loop(detailList)
    dispatch({
        type:ActionTypes.UPDATE_MEASURE_DETAIL_LIST,
        detailList
    })
}
export const handleItemShowAll = (list,checked) => (dispatch,getState) =>{
	const newList = list.filter(v => v.get('childProfit').size)
	const loop = (data) => {
		data.map(lrItem => {
			let uniqueId =lrItem.get('lineindex') ?lrItem.get('lineindex') :lrItem.get('acId')
			if (lrItem.get('childProfit') && lrItem.get('childProfit').size) {
				loop(lrItem.get('childProfit'))
			}
			dispatch(handleItemShow(uniqueId,lrItem.get('linename'),checked))
			checked?
			dispatch(handleItemChecked(uniqueId,false))
			:
			dispatch(changeThisItemChecked(uniqueId,false))
			})
	}
	loop(newList)
}
export const changeThisItemChecked=(uniqueId,checked)=>(dispatch,getState)=>{
    let detailList= getState().lrbState.get('detailList').toJS()
    const loop=(list)=>list.map((item,index)=>{
        let itemUniqueId= item.lineindex ?item.lineindex :item.acId
        if(itemUniqueId===uniqueId){
            item.checked=!checked
            item.testMonthaccumulation = `${item.monthaccumulation.toFixed(2)}`
            item.testShareOfMonth = `${item.shareOfMonth*100}`
            if(item.childProfit.length>0){
                loop2(item.childProfit)
            }
        }else{
            loop(item.childProfit,checked)
        }
    })
    const loop2=(list)=>list.map((item,index)=>{
        item.checked=checked
        if(item.childProfit.length>0){
            loop2(item.childProfit)
        }
    })
    loop(detailList)
    dispatch({
        type:ActionTypes.UPDATE_MEASURE_DETAIL_LIST,
        detailList
    })
}

export const startMeasure= calculType => (dispatch,getState) => {
    if(calculType === '利润'){
        dispatch(getMeasureProfitResult())
    }else{
        dispatch(getMeasureProfitAndLossResult())
    }
}
export const getMeasureProfitResult=()=>(dispatch,getState)=>{ //测利润
    let detailList= getState().lrbState.get('detailList').toJS().filter(v=>v.checked===true)
	let amountInput = getState().lrbState.get('amountInput')
    let AmountList = []
    let PrecentList = []
    detailList.map((item)=>{
        if(item.testAmount===true){
            PrecentList.push(item)
        }else{
            AmountList.push(item)
        }
    })
    let ProfitAndLossResult = Number(amountInput)
    let precentAmount = 1
    let amount = 0
    PrecentList.map(e=>{
        precentAmount = precentAmount-(Number(e.testShareOfMonth)/100)
    })
    // console.log(precentAmount);
    // if(precentAmount<0){
    //     Toast.info('请输入有效的营业收入金额')
    // }
    AmountList.map(e=>{
        amount = amount+Number(e.testMonthaccumulation)
    })
    let profitResult = ProfitAndLossResult*precentAmount - amount

    let resultList =getState().lrbState.get('detailList').toJS().filter(v=>v.checked===true)
    dispatch({
        type:ActionTypes.SET_MEASURE_RESULT,
        profitResult,
        ProfitAndLossResult,
        resultList:resultList
    })
}
export const getMeasureProfitAndLossResult=()=>(dispatch,getState)=>{ //测盈亏
    let detailList= getState().lrbState.get('detailList').toJS().filter(v=>v.checked===true)
    let amountInput = getState().lrbState.get('amountInput')
    let profitResult = Number(amountInput)  //待测金额=利润

    let AmountList = []
    let PrecentList = []
    detailList.map((item)=>{
        if(item.testAmount===true){
            PrecentList.push(item)
        }else{
            AmountList.push(item)
        }
    })
    let amount = Number(amountInput)
    let precentAmount = 0
    AmountList.map(e=>{
        amount = amount+Number(e.testMonthaccumulation)
    })
    PrecentList.map(e=>{
        precentAmount = precentAmount+Number(e.testShareOfMonth)
    })
    let ProfitAndLossResult =amount/(1-precentAmount/100)

    let resultList =getState().lrbState.get('detailList').toJS().filter(v=>v.checked===true)
    dispatch({
        type:ActionTypes.SET_MEASURE_RESULT,
        profitResult,
        ProfitAndLossResult,
        resultList:resultList
    })
}

export const showMeasureResult = (bool) => (dispatch)=>{
    dispatch({
        type:ActionTypes.SHOW_MEASURE_RESULT,
        bool
    })
}

export const handleMeasureResultListShowChild=(id,show)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.HANDLE_MEASURE_RESULT_LIST_SHOW_CHILD,
        id,
		show
    })
}
export const handleMeasureResultListShowChildAll = (list,show) => dispatch => {
	let linenameList = []
	const loop = (data) => {
		data.forEach(v => {
			linenameList.push(v.linename)
			v.childProfit.length && loop(v.childProfit)
		})
	}
	loop(list)
	linenameList.map(v => dispatch(handleMeasureResultListShowChild(v,show)))
}

export const deleteExtraMessage = (idList,cb)=>(dispatch,getState)=>{
	const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = getState().homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1 && newJr : false
    fetchApi(isRunning? 'deleteJrExtraMessage':'deleteExtraMessage','POST',JSON.stringify({
        idList
    }),resp=>{
        if(showMessage(resp,'show')){
			cb()
        }
    })
}
