export const relativeHighTypeTemp = {
    'isPayUnit':true,
    'isReceiveUnit':true,
    'isAppliedWater':true,
    'isAppliedInvoicing':false,
    'isAppliedLedger':false,
    'name':'',
    'payableAcName':'',
    'payableAcId':'',
    'receivableAcName':'',
    'receivableAcId':'',
    'advanceAcName':'',
    'advanceAcId':'',
    'prepaidAcName':'',
    'prepaidAcId':'',
    'treeList': [],
}

export const relativeTypeTemp = {
    name:'',
    remark:'',
    parentName:'全部',
    parentUuid:'',
    uuid:'',
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
    "insertOrModify":'insert',
    'insertFrom':'',
    'enablePrepaidAc':true,
    'enableAdvanceAc':true,
    'contacterInfo':false,
    'isCheckOut':false,
}

export const inventoryHighTypeTemp = {
    "name":"",
    "isAppliedSale":true,
    "isAppliedPurchase":true,
    'isAppliedProduce':false,
    "isAppliedWater":true,
    "isAppliedInvoicing":false,
    "uuid":'',
}

export const inventoryTypeTemp = {
    "parentUuid": "",
    "name":"",
    "remark":"",
    "ctgyUuid" : "",
    "parentName":'',
    "uuid":''
}

export const inventoryCardTemp = {
    "code": "",
    "name":"",
    "inventoryNature":"",
    "inventoryAcName" : "",
    "inventoryAcId":'',
    "opened":'',
    "remark":'',
    "isAppliedSale":true,
    "isAppliedPurchase":true,
    'isAppliedProduce':false,
    "categoryTypeList":[],
    'contacterInfo':false,
    'isCheckOut':false,

    openList: [],//期初列表
    'isOpenedQuantity': false,//是否启用数量管理
    'warehousePriceMode': 'U',//U 全部仓库同一单价 T 一级仓库不同单价 E不同仓库不同单价isOpenedQuantity
    'openedQuantity': '',//期初数量总额
    'unit': {
        uuid: '',
        name: '',
        isStandard: false,
        uuidList: [],
    },
    'unitPriceList': [],

    // 组装单
    assemblyState: 'CLOSE',//已开启 OPEN 未开启 CLOSE 失效 INVALID 不可开启 DISABLE
    "assemblySheet": {
        "unitUuid": "",
        "unitName": "",
        "quantity": '',
        "materialList": []
    },
    financialInfo: {
        openAssist: false,//辅助属性
        assistClassificationList: [],//辅助属性列表
        openBatch: false,//批次管理
        isBatchUniform: false,//批次计价模式
        batchList: [],//批次列表可用的
        openShelfLife: false,//保质期管理
        shelfLife: '',//保质期天数
        openSerial: false//序列号管理
    }

}
export const inventoryBtnStatus = {
    'isAdd':false,
    'isDelete':false,
    'treeUuid':'',
    'treeName':'全部',
    'isUp':false,
    'isDown':false,
    'isEdit':false,
    'parentUuid':''
}

export const projectHighTypeInfo = {
    'name':'',
    'commonFee':false,
    'uuid':''
}

export const projectCardInfo = {
    "name":"",
    "code":"",
    "selectUuid":'',
    "selectName":'',
    "projectRelation":[
        {
          "ctgyUuid":"",
          "subordinateUuid":""
        }
    ]
}

export const ProjectTypeBtnStatus = {
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
export const projectType = {
    name:'',
    remark:'',
    parentName:'全部',
    parentUuid:'',
    uuid:'',
}
