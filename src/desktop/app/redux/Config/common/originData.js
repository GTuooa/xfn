export const relativeCardTemp = {
    "name":"",
    "code":"",
    "isPayUnit":true,
    "isReceiveUnit":true,
    "payableAcName":"应付账款",
    "receivableAcName":"应收账款",
    "advanceAcName":"预收账款",
    "prepaidAcName":"预付账款",
    "payableAcId":"2202",
    "receivableAcId":"1122",
    "advanceAcId":"2203",
    "prepaidAcId":"1123",
    "companyAddress":"",
    "companyTel":"",
    "financeName":"",
    "financeTel":"",
    "remark":"",
    "receivableOpened":"",
    "advanceOpened":"",
    "payableOpened":"",
    "prepaidOpened":"",
    "categoryTypeList":[],
    // "insertOrModify":'insert',
    // 'insertFrom':'',
    'enablePrepaidAc':true,
    'enableAdvanceAc':true,
    'contacterInfo':false,
    'isCheckOut':false,
}

export const relativeHighTypeTemp = {
    name: '',
    isPayUnit: false,
    isReceiveUnit: false,

    isAppliedInvoicing: false, // 后端删除
    isAppliedLedger: false, // 后端删除
    isAppliedWater: true, // 后端删除

    advanceAcId: '', // 后端删除
    advanceAcName: '', // 后端删除
    payableAcId: '', // 后端删除
    payableAcName: '', // 后端删除
    prepaidAcId: '', // 后端删除
    prepaidAcName: '', // 后端删除
    receivableAcId: '', // 后端删除
    receivableAcName: '', // 后端删除
}

export const relativeTypeBtnStatus = {
    'isAdd':false,
    'isDelete':false,
    'treeUuid':'',
    'treeName':'全部',
    'isUp':false,
    'isDown':false,
    'isEdit':false,
    'parentUuid':''
}

export const relativeTypeTemp = {
    name:'',
    remark:'',
    parentName:'全部',
    parentUuid:'',
    currentUnitCtgyUuid: '' // 后端改
}

export const inventoryHighTypeTemp = {
    "name": "",
    "uuid": '',
    "isAppliedSale": false,
    "isAppliedPurchase": false,
    'isAppliedProduce': false,  // 后端删除
    "isAppliedWater": true,
    "isAppliedInvoicing": false,
}

export const inventoryCardTypeTemp = {
    "parentUuid": "",
    "name":"",
    "remark":"",
    "ctgyUuid" : "",
    "parentName":'',
    "uuid":''
}

export const inventoryCardTemp = {
    "code": "",
    "name": "",
    "inventoryNature": 5,
    "inventoryAcName": "库存商品", // 后端删除
    "inventoryAcId": '1405', // 后端删除
    "opened": '',
    "remark": '',
    "isAppliedSale": true,
    "isAppliedPurchase": true,
    'isAppliedProduce': false, // 后端删除
    "categoryTypeList": [],
    'contacterInfo': false,
    'isCheckOut': false,
    'warehouseList':[],
    'isOpenedQuantity':false,
    'isUniformPrice':false,
    'unit':{
        'unitList':[]
    },
    'openedQuantity':'',
    'unitPriceList':[],
}
export const inventorySettingBtnStatus = {
    'isAdd':false,
    'isDelete':false,
    'treeUuid':'',
    'treeName':'全部',
    'isUp':false,
    'isDown':false,
    'isEdit':false,
    'parentUuid':''
}

export const projectHighTypeTemp = {
    'name':'',
    'commonFee':false,
    'uuid':''
}

export const projectCardTemp = {
    "name":"",
    "code":"",
    "selectUuid":'',
    "selectName":'',
    "categoryTypeList":[
        {
          "ctgyUuid":"",
          "subordinateUuid":""
        }
    ]
}

export const projectTypeBtnStatus = {
    'isAdd':false,
    'isDelete':false,
    'treeUuid':'',
    'treeName':'全部',
    'isUp':false,
    'isDown':false,
    'upUuid':'',
    'downUuid':'',
    'isEdit':false,
    'parentUuid':''
}
export const projectTypeTemp = {
    name:'',
    remark:'',
    parentName:'全部',
    parentUuid:'',
    uuid:'',
}
