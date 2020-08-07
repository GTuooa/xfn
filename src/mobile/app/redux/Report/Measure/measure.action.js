import { showMessage, jsonifyDate } from 'app/utils'
import fetchApi from 'app/constants/fetch.constant'
import * as allActions from 'app/redux/Home/All/other.action'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'
import { Toast } from 'antd-mobile';
export const getMeasureInitData=(issuedate,endissuedate)=>(dispatch,getState)=>{
    thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
    dispatch({
        type:ActionTypes.SHOW_MEASURE_RESULT,
        bool:false
    })
    const cannotChecked = getState().measureState.get('cannotChecked').toJS()
    const haveSwitchList= getState().measureState.get('haveSwitchList')
    const userInfo = getState().homeState.getIn(['data', 'userInfo'])
    const sobInfo = userInfo.get('sobInfo')
    const newJr = sobInfo.get('newJr')
    const isRunning = sobInfo ? sobInfo.get('moduleInfo').indexOf('RUNNING') > -1  && newJr : false
    fetchApi(isRunning? 'getJrMeasureList':'getMeasureList', 'POST', JSON.stringify({
        begin: issuedate ? `${issuedate.substr(0,4)}${isRunning?'-':''}${issuedate.substr(5,2)}` : '',
		end: endissuedate ? `${endissuedate.substr(0,4)}${isRunning?'-':''}${endissuedate.substr(5,2)}` : `${issuedate.substr(0,4)}${isRunning?'-':''}${issuedate.substr(5,2)}`,
        referBegin:'',
		referEnd:"",
    }),resp=>{
        if(showMessage(resp)){
            thirdParty.toast.hide()
            dispatch({
                type:ActionTypes.SET_MEASURE_INIT_DATE,
                issuedate,
                endissuedate
            })
            const incomeTotal = resp.data.result[0]
            const profit = resp.data.result.find(v=>v.linename.substr(-4,4)==='业务利润')
            const profitIndex = resp.data.result.findIndex(v=>v.linename.substr(-4,4)==='业务利润')
            let detailList = resp.data.result.slice(1,profitIndex)
            let checkedList = []
            const loop=(list,checked)=>list.map((item)=>{
                if(!cannotChecked.includes(item.linename)){
                    //let uniqueId =item.lineindex ?item.lineindex :item.acId
                    //checkedList.push(item.linename)
                    item.showChild=false
                    item.checked=checked
                    item.testMonthaccumulation = `${item.monthaccumulation.toFixed(2)}`
                    item.testShareOfMonth = `${Math.round(item.shareOfMonth*100).toFixed()}`
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

        }
    })
}
export const changeAmountInput=(value)=>dispatch=>{
    dispatch({
        type:ActionTypes.CHANGE_AMOUNT_INPUT,
        value
    })
}
export const handleItemShow = (uniqueId,resultShowChildItem)=>(dispatch,getState)=>{
    let detailList= getState().measureState.get('detailList').toJS()
    const loop=(list)=>list.map((item,index)=>{
        let itemUniqueId= item.lineindex ?item.lineindex :item.acId
        if(itemUniqueId===uniqueId){
            item.showChild=!item.showChild
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
    let detailList= getState().measureState.get('detailList').toJS()
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
export const changeMeasureTestType=()=>dispatch=>{
    dispatch({
        type:ActionTypes.CHANGE_MEASURE_TEST_TYPE,
    })
}
export const changeSwitchType = (linename)=>(dispatch,getState)=>{
    let detailList= getState().measureState.get('detailList').toJS()
    const loop=(list)=>list.map((item,index)=>{
        if(item.linename===linename){
            item.testAmount=!item.testAmount
            item.testMonthaccumulation = `${item.monthaccumulation.toFixed(2)}`
            item.testShareOfMonth = `${Math.round(item.shareOfMonth*100)}`
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
        item.testShareOfMonth = `${Math.round(item.shareOfMonth*100)}`
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
export const changeThisItemChecked=(uniqueId,checked)=>(dispatch,getState)=>{
    let detailList= getState().measureState.get('detailList').toJS()
    const loop=(list)=>list.map((item,index)=>{
        let itemUniqueId= item.lineindex ?item.lineindex :item.acId
        if(itemUniqueId===uniqueId){
            item.checked=!checked
            item.testMonthaccumulation = `${item.monthaccumulation.toFixed(2)}`
            item.testShareOfMonth = `${Math.round(item.shareOfMonth*100)}`
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
export const changeTestShareOfMonth=(value,uniqueId)=>(dispatch,getState)=>{
    let detailList= getState().measureState.get('detailList').toJS()
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
    let detailList= getState().measureState.get('detailList').toJS()
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
export const showMeasureResult = (bool) => (dispatch)=>{
    dispatch({
        type:ActionTypes.SHOW_MEASURE_RESULT,
        bool
    })
}
export const startMeasure=()=>(dispatch,getState)=>{
    let testProfit = getState().measureState.get('testProfit') //true测利润 false测盈亏
    if(testProfit){
        dispatch(getMeasureProfitResult())
    }else{
        dispatch(getMeasureProfitAndLossResult())
    }
}
export const getMeasureProfitResult=()=>(dispatch,getState)=>{ //测利润
    let detailList= getState().measureState.get('detailList').toJS().filter(v=>v.checked===true)
    let AmountList = []
    let PrecentList = []
    detailList.map((item)=>{
        if(item.testAmount===true){
            PrecentList.push(item)
        }else{
            AmountList.push(item)
        }
    })
    let amountInput = getState().measureState.get('amountInput')
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

    let resultList =getState().measureState.get('detailList').toJS().filter(v=>v.checked===true)
    dispatch({
        type:ActionTypes.SET_MEASURE_RESULT,
        profitResult,
        ProfitAndLossResult,
        resultList:resultList
    })
}
export const getMeasureProfitAndLossResult=()=>(dispatch,getState)=>{ //测盈亏
    let detailList= getState().measureState.get('detailList').toJS().filter(v=>v.checked===true)
    let amountInput = getState().measureState.get('amountInput')
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

    let resultList =getState().measureState.get('detailList').toJS().filter(v=>v.checked===true)
    dispatch({
        type:ActionTypes.SET_MEASURE_RESULT,
        profitResult,
        ProfitAndLossResult,
        resultList:resultList
    })
}
export const handleMeasureResultListShowChild=(id)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.HANDLE_MEASURE_RESULT_LIST_SHOW_CHILD,
        id
    })
}
export const clearMeasureResultShowChildList=()=>(dispatch)=>{
    dispatch({
        type:ActionTypes.CLEAR_MEASURE_RESULT_SHOW_CHILD_LIST,
    })
}
