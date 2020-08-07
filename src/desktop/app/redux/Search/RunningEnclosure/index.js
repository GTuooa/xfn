import { fromJS, toJS }	from 'immutable'
import { message } from 'antd'
import { showMessage } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'

const runningEnclosureState =fromJS({
    issuedate: '',
    endissuedate:'',
    chooseValue:'MONTH',
    jsonArray: [],
    totalSize:1,//总容量G
    useSizeBySob:0,//账套已用
    useSizeByCorp:0,//公司已用
    selectList:[],
    selectedAll:false,
    searchCondition:"SEARCH_TYPE_ENCLOSURE_NAME",
    searchContent:"",
    tagList:[],
    enclosureKey:null,
    labelValue:"",
    tagId:"",
    importresponlist : {
        'failJsonList': [],
        'successJsonList': []
    },
    message: '',
    needDeleteUrl:[],//[{},{},{},{}]
    vcIndexArray:[],
    needDownLoad:[],//需要下载的地址['','','']
    previewImgArr:[],//需要预览的图片的数据[{},{},{},{}]
    previewSrcIdx:0,//当前需要预览的图片地址的下标
    label:[],//顶部选择框标签列表

    //fjLabel:[],//数据标签列表
    currentLabel:'',//当前的标签名
    vcIdx:'',//需要被改标签的vcidx
    fjIdx:'',//需要被改标签的fjidx
    updatePath:'',
    flags: {
        selectedVcItemArray: [],
        selectVcAll: false,
        maxVoucherId: '0',
        lastvcindex: '',
        vcindexSort: 1, //根据vcindex进行排序 ， 1为递增排序， －1为递减排序
        vcdateSort: 1,
        showMessageMask: false,
        iframeload: false,
        serchValue: '',
        preview:false,//图片预览的显示与否
        labelModal:false//修改标签的modal状态
    },
    uuidList:[]
})
export default function handleEnclosure(state = runningEnclosureState, action) {
    return({
        [ActionTypes.SET_ISSUEDATE]:() => {
            return state.set("issuedate",action.issuedate)
                        .set('endissuedate',action.endissuedate)
                        .set("selectList",fromJS([]))
                        .set("searchContent","")
                        .set("uuidList",fromJS([]))
        },
        [ActionTypes.SET_INITIAL_DATA]:()=>{
            return state.set("totalSize",Number(action.payload.totalSize))
                .set("useSizeByCorp",action.payload.useSizeByCorp)
                .set("useSizeBySob",action.payload.useSizeBySob)
                .set("jsonArray",action.payload.jsonArray)
                .set("selectedAll",false)
        },
        [ActionTypes.SET_RUNNING_ENCLOSURE_SEARCHED_DATA]:()=>{
            return state.set("totalSize",Number(action.payload.totalSize))
                .set("useSizeByCorp",action.payload.useSizeByCorp)
                .set("useSizeBySob",action.payload.useSizeBySob)
                .set("jsonArray",action.payload.jsonArray)
                .set("selectedAll",false)
                .set("selectList",fromJS([]))
                .set("uuidList",fromJS([]))
                .set("issuedate",action.issuedate)
        },
        [ActionTypes.PREVIEW_RUNNING_ENCLOSURE_IMAGE] :()=>{
            let previewImgArr = []//所有附件的图片列表
			state.get('jsonArray').forEach(v => v.enclosureList.forEach(w =>{
				if (w.imageOrFile === 'TRUE' || w.mimeType== 'application/pdf'){
					previewImgArr.push(w)
				}
			}))
			let previewSrcIdx = 0
            let clickEnclosurekey = state.get("jsonArray")[ action.idx].enclosureList[action.fjIdx].enclosureKey
			previewImgArr.forEach((v,i)=>{
				if(v.enclosureKey == clickEnclosurekey ){
					previewSrcIdx = i
					return
				}
			})
			state = state.setIn(['flags', 'preview'], true)
			.set('previewSrcIdx', previewSrcIdx)
			.set('previewImgArr', fromJS(previewImgArr))
			return state;
        },
        [ActionTypes.CLOSE_PREVIEW_RUNNING_ENCLOSURE_IMAGE]   :  ()=>state.setIn(['flags', 'preview'], false),
        [ActionTypes.CHANGE_RUNNING_ENCLOSURE_SELECT_LIST]    :  ()=>{
            let selectList = state.get("selectList").toJS()
            let enclosureKey = action.enclosureKey

            if(selectList.includes(enclosureKey)){
                let index = selectList.findIndex((data,index)=>{
                    return data===enclosureKey
                })
                selectList.splice(index,1)
            }else{
                selectList.push(enclosureKey)
            }
            return state.set("selectList",fromJS(selectList))
        },
        [ActionTypes.SELECT_ALL_RUNNING_ENCLOSURE_LIST]:         ()=>{
            let selectedAll = action.selectedAll
            let newSelectList =[]
            let newUuidList = []
            let data = state.get("jsonArray")
            if(selectedAll){
                for(let i in data){
                    for(let j in data[i].enclosureList){
                        newSelectList.push(`${data[i].jrIndex}-${data[i].enclosureList[j].enclosureKey}`)
                        newUuidList.push(data[i].enclosureList[j].uuid)
                    }
                }
            }
            return state.set("selectList",fromJS(newSelectList)).set("selectedAll",selectedAll).set('uuidList',fromJS(newUuidList))
        },
        [ActionTypes.CHANGE_RUNNING_ENCLOSEURE_SEARCH_CONTENT]:  ()=>{
            return state.set("searchContent",action.value)
        },
        [ActionTypes.CHANGE_RUNNING_ENCLOSEURE_SEARCH_CONDITION]:()=>{
            //console.log( toJS(state.set("searchCondition",action.value)));
            return state.set("searchCondition",action.value)
        },
        [ActionTypes.GET_RUNNING_ENCLOSURE_TAG_LIST]:           ()=>{
            return state.set("tagList",action.data).set("enclosureKey",action.enclosureKey)
        },
        [ActionTypes.REFRESH_RUNNING_ENCLOSURE_TAG_LIST] :      ()=>{
            return state.set("tagList",action.data).set()
        },
        [ActionTypes.SET_RUNNING_ENCLOSEURE_LABEL] :            ()=>{
            return state.set("labelValue",action.value).set("tagId",action.id)
        },
        [ActionTypes.SET_ENCLOSURE_UUIDLIST]:                   ()=>{
            let uuidList = state.get("uuidList").toJS()
            let uuid = action.uuid
            if(uuidList.includes(uuid)){
                let index = uuidList.findIndex((data,index)=>{
                    return data===uuid
                })
                uuidList.splice(index,1)
            }else{
                uuidList.push(uuid)
            }
            return state.set("uuidList",fromJS(uuidList))
        },
        [ActionTypes.HANDLE_RUNNING_ENCLOSURE_CHOOSE_VALUE] :()=>state.set('chooseValue',action.value)
    }[action.type] || (() => state))()
}
