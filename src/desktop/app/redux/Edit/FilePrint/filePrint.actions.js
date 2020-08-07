import fetchApi from 'app/constants/fetch.constant.js'
import * as ActionTypes from './ActionTypes.js'
import { toJS } from 'immutable'
import { showMessage,DateLib } from 'app/utils'
import * as allActions from 'app/redux/Home/All/all.action'
import thirdParty from 'app/thirdParty'

export const setPrintVcIndexAndDate = (year,month,vcIndex)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_PRINT_VC_INDEX_AND_DATE,
        year,
        month,
        vcIndex,
    })
}
export const printPdf = (year,month,vcIndex,needCreatedBy,needA4,needAss,needReviewedBy,reviewedBy) => (dispatch)=>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const fromPos = sessionStorage.getItem('fromPos')
    const fromPageType = {
        "modal": 'QUERY_VC-PRINT',
        "cxpz": 'QUERY_VC-PRINT-BATCH_PRINT_AND_EXPORT_PDF',
        'lrpz': ''
    }

    fetchApi('pdfPrint','POST',JSON.stringify({
        year,
		month,
        needCreatedBy,
        needA4,
        needAss,
        vcIndex,
        needReviewedBy:needReviewedBy?'1':'0',
        reviewedBy:needReviewedBy?reviewedBy:'',
        action: fromPageType[fromPos]
    }),resp=>{
        if(showMessage(resp)){
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            thirdParty.openLink({
                url: resp.data.signedUrl
            })
            //window.navigate(resp.data.signedUrl, '_blank')
            dispatch(allActions.handlePrintModalVisible(false))
        }else{
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })
}

export const jrPdfPrint = (needPrintName,needPrintEnclosure,oriUuid) => (dispatch)=>{
    dispatch({type: ActionTypes.SWITCH_LOADING_MASK})

    const fromPos = sessionStorage.getItem('fromPos')
    const fromPageType = {
        "searchRunningPreview": 'QUERY_JR-PRINT',
        "searchRunning": 'QUERY_JR-PRINT-BATCH_PRINT',
    }

    fetchApi('JrPdfPrint','POST',JSON.stringify({
        needPrintName,
        needPrintEnclosure,
        oriUuid,
        action: fromPageType[fromPos]
    }),resp=>{
        if(showMessage(resp)){
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
            thirdParty.openLink({
                url: resp.data.signedUrl
            })
            //window.navigate(resp.data.signedUrl, '_blank')
            dispatch(allActions.handlePrintModalVisible(false))
        }else{
            dispatch({type: ActionTypes.SWITCH_LOADING_MASK})
        }
    })
}

export const setPrintString = (name,value)=>(dispatch)=>{
    dispatch({
        type:ActionTypes.SET_PRINT_STRING,
        name,
        value,
    })
}
