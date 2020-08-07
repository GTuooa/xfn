//lrpz
export const LRPZ_ABSTRACT_LENGTH = 64  //摘要长度限制
export const LRPZ_MONEY_LENGTH = 10     //金额小数点前的位数
export const LRPZ_COUNT_LENGTH = 6     //数量小数点前的位数
export const LRPZ_PRICE_LENGTH = 9     //单价小数点后的位数
export const LRPZ_VCID_LENGTH = 6     //凭证号的位数

export const AC_ID_AND_NAME_CONNECT = ' '   //科目选择，id和name之间的连接符
export const ASS_ID_AND_NAME_CONNECT = '-:-'  //辅助核算选择，id和name之间的连接符
export const MIN_AC_ID_LENGTH = 4   //新增科目时，科目id的最小长度
export const SHIFT_KEY_CODE = 16    //shift keyCode值
export const S_KEY_CODE = 83    // s keyCode值
export const N_KEY_CODE = 78     // n keyCode值
export const ENTER_KEY_CODE = 13    // Enter keyCode值
export const TAB_KEY_CODE = 9    // Tab keyCode值

export const P_KEY_CODE = 80    // P keyCode值
export const D_KEY_CODE = 68    // D keyCode值
export const R_KEY_CODE = 82    // R keyCode值
export const EQUAL_KEY_CODE = 187    // = keyCode值

//辅助核算
// export const FZ_BM_LENGTH = 10          // 辅助核算编码
export const FZ_BM_LENGTH = 20          // 辅助核算编码

//资产设置
export const ASS_TOTAL_MONTH = 600      // 默认使用总期限
//科目设置
export const AC_UNIT_LENGTH = 6         // 科目单位的长度
export const ALL_NAME_LENGTH = 20       // 科目名称、辅助核算类别，资产子类别、资产名称、卡片名称长度
export const ASS_NAME_LENGTH = 40
export const ENTER_TRANSFERRED = '\r\n' // 换行
//科目设置
export const AC_CHINESE_NAME_LENGTH = 32       // 科目名称带中文名称长度
export const AC_NAME_LENGTH = 64       // 科目名称不带带中文名称长度
export const CODE_LENGTH = 16          // 流水卡片编码长度

export const ASS_SPLIT = ' '

//外币设置
export const FC_NUMBER_AND_NAME_CONNECT = ' '
export const FC_JOIN_STR_CONNECT = '-:-'
export const FC_EXCHANGE_DECIMAL_LENGTH = 4

//科目树 拼接字符串
export const TREE_JOIN_STR = '-:-'

// jxcConfig
export const JXC_AC_JOIN_STR = ' '
export const CATEGORY_CARD_JOIN_STR = '-:-'
export const JXC_PRICE_UNIT_JOIN_STR = '/'

//lrck 新增的条数限制
export const LRKC_DADA_LENGTH = 50
export const LRKC_REMARK_LENGTH = 40

export const FZHE_CURRENT_PAGE_SIZE = 100

export const ACCOUNT_RATE_TYPE_OF_PAYABLE = 'AC_ZZS'
export const ACCOUNT_RATE_TYPE_OF_NOTBILLING = 'AC_ZZS_WKP'
export const ACCOUNT_RATE_TYPE_OF_INPUT = 'AC_JXS'
export const ACCOUNT_RATE_TYPE_OF_CERTIFIED = 'AC_DRZJXS'
export const ACCOUNT_RATE_TYPE_OF_WAITOUTPUT = 'AC_DZXXS'
export const ACCOUNT_RATE_TYPE_OF_OUTPUT = 'AC_XXS'
export const ACCOUNT_RATE_TYPE_OF_TURNOUTUNPAID = 'AC_ZCWJZZS'
export const ACCOUNT_RATE_TYPE_OF_UNPAID = 'AC_WJZZS'

export const ASSETS_SORT_BY_STATUS_DESC = '-1'
export const ASSETS_SORT_BY_STATUS_ASC = '1'

export const ASSETS_SORT_BY_VALUE_DESC = '-1'
export const ASSETS_SORT_BY_VALUE_ASC = '1'


export const LSMX_LIMIE_LENGTH = 200
export const LSMX_LIMIE_LENGTH_TEST = 2
export const REPEAT_REQUEST_CODE = 10

export const AC_NAME_ABLE_LENGTH = 25   // 放宽的科目长度

export const YEB_PAGE_SIZE = 200
export const MXB_PAGE_SIZE = 200
export const CONFIG_PAGE_SIZE = 200
export const LOG_PAGE_SIZE = 100
export const CXLS_LIMIE_LENGTH = 100
// export const SEARCH_RUNNING_LINE_LENGTH = 200  
export const SEARCH_RUNNING_LINE_LENGTH = 100  //查询流水 查询审批默认pageSize为100
export const SEARCH_CXPZ_LINE_LENGTH = 200      //查询凭证 pageSize为200
export const MXB_CARD_PAGE_SIZE = 200
export const EDIT_RUNNING_CHOOSE_TABLE = 20

export const NUMBER_REG = /^[-\d]\d*\.?\d{0,2}$/g

export const ALL_TAB_NAME_STR = '全部'

// 组件type
export const BXR_COMPONENT_TYPE = 'BXR'
export const FYXZ_COMPONENT_TYPE = 'FYXZ'
export const WLDW_COMPONENT_TYPE = 'WLDW'
export const XM_COMPONENT_TYPE = 'XM'
export const LSLB_COMPONENT_TYPE = 'LSLB'
export const ZY_COMPONENT_TYPE = 'ZY'
export const ZH_COMPONENT_TYPE = 'ZH'
export const CH_COMPONENT_TYPE = 'CH'
export const CK_COMPONENT_TYPE = 'CK'
export const CK_IN_COMPONENT_TYPE = 'CK_IN'
export const CK_OUT_COMPONENT_TYPE = 'CK_OUT'
export const DATE_COMPONENT_TYPE = 'DATE'
export const APPROVAL_JOIN_STR = '-'

export const SEARCH_APPROVAL_PAGE = 100
// 存货最大数量
export const STOCK_MAX_NUMBER_ONE = 80
export const STOCK_MAX_NUMBER_TWO = 160
// 勾选流水最大数量
export const RUNNING_CHECKED_MAX_NUMBER = 160
// 多账户最大数
export const ACCOUNT_MAX_NUMBER = 32
// 余额表超800条收拢
export const YEB_EXPAND_MAX_NUMBER = 800
