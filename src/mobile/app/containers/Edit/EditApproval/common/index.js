import {
    CategoryComp,
    InventoryComp,
    CommonChoose,
    CommonInput,
    ProjectComp,
    DateComp,
    RelativeComp,
    AccountComp,
    ContactsComp,
    UploadPic,
    MultiChoose,
    FjComp,
    CommonMultiInput,
    SpdComp
    } from '../components'

export const type = {
    LB_YYSR:'debit',
    LB_YYZC:'credit',
    LB_ZZ:'calculate',
    LB_FYZC:'credit',
    LB_XCZC:'credit',
    LB_SFZC:'credit',
    LB_YYWSR:'debit',
    LB_YYWZC:'credit',
}
export const formType = {
    NumberField:CommonInput,
    MoneyField:CommonInput,
    DDSelectField:CommonChoose,
    InnerContactField:ContactsComp,
    DDPhotoField:UploadPic,
    DDMultiSelectField:MultiChoose,
    DDAttachment:FjComp,
    TextareaField:CommonMultiInput,
    DDDateRangeField:DateComp,
    TextField:CommonInput,
    DDDateField:DateComp,
    RelateField:SpdComp
    // RelateField:
}
export const jrType = {
    LSLB:CategoryComp,
    XM:ProjectComp,
    MX_DATE:DateComp,
    DATE:DateComp,
    MX_AMOUNT:CommonInput,
    ZY:CommonInput,
    CH:InventoryComp,
    WLDW:RelativeComp,

}

export const tabs = [
    {title:'我处理的',sub:'1'},
    {title:'我发起的',sub:'2'},
    {title:'抄送我的',sub:'3'},
]

export const containType = {
    'AMOUNT': '金额',
    'DATE': '日期',
    'ABSTRACT': '摘要',
    'CONTECT': '往来单位',
    'STROCK': '存货',
    'DRPOT': '仓库',
    'CATEGORY': '流水类别',
    'DETAIL-TYPE': '明细类型',
    'ACCOUNT': '账户'
}

export const commonCode = item => ['COMNCRD', 'ASSIST', 'MAKE', 'INDIRECT', 'MECHANICAL'].includes(item.code)
