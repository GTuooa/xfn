export const tabNames = {
    // Tcgm: {
    //     name: '套餐购买',
    //     path: 'Fee/Home'
    // },

    Home: {
        name: '首页',
        path: 'Home'
    },
    Edit: {
        name: '录入',
        path: 'Edit'
    },
    Search: {
        name: '查询',
        path: 'Search'
    },
    Report: {
        name: '报表',
        path: 'Report'
    },
    Yeb: {
        name: '余额表',
        path: 'Yeb'
    },
    Mxb: {
        name: '明细表',
        path: 'Mxb'
    },
    Config: {
        name: '管理',
        path: 'Config'
    }
}

export const allPermission = {
    'Pz': {
        'ADMIN': {
            // 对凭证的
            // style: 'show', 'disabled', 'none'
            'edit': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            // 导出excel
            'exportExcel': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            // 审核权限
            'review': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            'toMxb': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            "arrange": {
                permission: true,
                style: 'show',
                disabledTip: '',
            }
        },
        'OBSERVER': {
            'edit': {
                permission: false,
                style: 'disabled',
                disabledTip: '账套总管理员和记账员才可以新增修改凭证',
            },
            'exportExcel': {
                permission: false,
                style: 'disabled',
                disabledTip: '账套总管理员才可以导出Excel',
            },
            'review': {
                permission: false,
                style: 'disabled',
                disabledTip: '记账员和观察员不能审核凭证',
            },
            'toMxb': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            "arrange": {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            }
        },
        'OBSERVER_REVIEW': {
            'edit': {
                permission: false,
                style: 'disabled',
                disabledTip: '账套总管理员和记账员才可以新增修改凭证',
            },
            'exportExcel': {
                permission: false,
                style: 'disabled',
                disabledTip: '账套总管理员才可以导出Excel',
            },
            'review': {
                permission: false,
                style: 'disabled',
                disabledTip: '记账员和观察员不能审核凭证',
            },
            'toMxb': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            "arrange": {
                permission: true,
                style: 'show',
                disabledTip: '',
            }
        },
        'OBSERVER_EXPORT': {
            'edit': {
                permission: false,
                style: 'disabled',
                disabledTip: '账套总管理员和记账员才可以新增修改凭证',
            },
            'exportExcel': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            'review': {
                permission: false,
                style: 'disabled',
                disabledTip: '记账员和观察员不能审核凭证',
            },
            'toMxb': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            "arrange": {
                permission: true,
                style: 'show',
                disabledTip: '',
            }
        },
        'VC_REVIEW': {
            'edit': {
                permission: false,
                style: 'disabled',
                disabledTip: '账套总管理员和记账员才可以新增修改凭证',
            },
            'exportExcel': {
                permission: false,
                style: 'disabled',
                disabledTip: '账套总管理员才可以导出Excel',
            },
            'review': {
                permission: true,
                style: 'show',
                disabledTip: '记账员和观察员不能审核凭证',
            },
            'toMxb': {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            },
            "arrange": {
                permission: true,
                style: 'show',
                disabledTip: '',
            }
        },
        'REVIEW': {
            'edit': {
                permission: false,
                style: 'disabled',
                disabledTip: '账套总管理员和记账员才可以新增修改凭证',
            },
            'exportExcel': {
                permission: false,
                style: 'disabled',
                disabledTip: '账套总管理员才可以导出Excel',
            },
            'review': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            'toMxb': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            "arrange": {
                permission: true,
                style: 'show',
                disabledTip: '',
            }
        },
        'OPERATOR': {
            'edit': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            'exportExcel': {
                permission: false,
                style: 'disabled',
                disabledTip: '账套总管理员才可以导出Excel',
            },
            'review': {
                permission: false,
                style: 'disabled',
                disabledTip: '记账员和观察员不能审核凭证',
            },
            'toMxb': {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            },
            "arrange": {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            }
        },
        OPERATOR_OBSERVER: {
            'edit': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            'exportExcel': {
                permission: false,
                style: 'disabled',
                disabledTip: '账套总管理员才可以导出Excel',
            },
            'review': {
                permission: false,
                style: 'disabled',
                disabledTip: '记账员和观察员不能审核凭证',
            },
            'toMxb': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            "arrange": {
                permission: true,
                style: 'show',
                disabledTip: '',
            }
        },
        OPERATOR_REVIEW: {
            'edit': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            'exportExcel': {
                permission: false,
                style: 'disabled',
                disabledTip: '账套总管理员才可以导出Excel',
            },
            'review': {
                permission: true,
                style: 'show',
                disabledTip: '记账员和观察员不能审核凭证',
            },
            'toMxb': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            "arrange": {
                permission: true,
                style: 'show',
                disabledTip: '',
            }
        },
        'FLOW_REVIEW': {
			'edit': {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            },
            // 导出excel
            'exportExcel': {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            },
			'review': {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            },
			'toMxb': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            "arrange": {
                permission: true,
                style: 'show',
                disabledTip: '',
            }
		}
    },
    'Report': {
        ADMIN: {
            'exportExcel': {
                permission: true,
                style: 'show',
                disabledTip: '',
            }
        }
    },
    'Config': {
        'ADMIN': {
            'edit': {
                permission: true,
                style: '',
                disabledTip: '',
            },
            'importExcel': {
                permission: true,
                style: '',
                disabledTip: '',
            }
        }
    },
    'LrAccount': {
        'ADMIN': {
            'edit': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            review: {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            'toMxb': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
        },
        'CASHIER': {
            'edit': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            review: {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            },
            'toMxb': {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            },
        },
        OBSERVER: {
            'edit': {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            },
            review: {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            },
            'toMxb': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
        },
        REVIEW: {
            'edit': {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            },
            review: {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            'toMxb': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
        },
        FLOW_REVIEW: {
            'edit': {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            },
            review: {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            'toMxb': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
        },
        CASHIER_OBSERVER: {
            'edit': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            review: {
                permission: false,
                style: 'disabled',
                disabledTip: '',
            },
            'toMxb': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
        },
        CASHIER_REVIEW: {
            'edit': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            review: {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            'toMxb': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
        }
    }
}

export const loginInfo = {}
//  {
//     "data":{
//         "noticeList":[
//             {
//                 "content":"7月18日更新公告",
//                 "url":"http://xfncwhelp.file.alimmdn.com/notice/notice0718.html"
//             },
//             {
//                 "content":"5月22日更新公告",
//                 "url":"http://xfncwhelp.file.alimmdn.com/notice/notice0522.html"
//             },
//             {
//                 "content":"重要：资产负债表列示调整",
//                 "url":"http://xfncwhelp.file.alimmdn.com/notice/notice0131.html"
//             }
//         ],
//         "corpId":"ding9e1aa64cbe4d3b3435c2f4657eb6378f",
//         "isFinance":"TRUE",
//         "moduleInfo":{
//             "GL":false,
//             "RUNNING":true,
//             "AMB":true
//         },
//         "dduserid":"0403510440689690",
//         "corpName":"新权益",
//         "sobInfo":{
//             "sobName":"滴滴小白流水账",
//             "roleInfo":[
//                 "ADMIN"
//             ],
//             "moduleInfo":[
//                 "ASSETS",
//                 "CURRENCY",
//                 "GL",
//                 "NUMBER",
//                 "RUNNING"
//             ],
//             "sobId":"sob_3e7d75d5fd0747b5be0b95e9aaf8cf5c20180730144139"
//         },
//         "isAdmin":"FALSE",
//         "useruuid":"3e7d75d5fd0747b5be0b95e9aaf8cf5c",
//         "checkMoreFj":"TRUE",
//         "emplID":"0403510440689690",
//         "newEquity":true,
//         "xfnVersion":"",
//         "warning":{
//             "comments":"若体验不错，可由“账套设置”-“超级管理”进行购买，咨询热线：0571-28121680",
//             "expirationTime":"",
//             "context":[
//                 "160账套版已到期"
//             ],
//             "webStyle":"alert",
//             "detail":"了解更多",
//             "content":"亲爱的小番用户："
//         },
//         "sobList":[
//             {
//                 "sobName":"handsome马仔",
//                 "roleInfo":[
//                     "OPERATOR",
//                     "CASHIER",
//                     "FLOW_OBSERVER"
//                 ],
//                 "moduleInfo":[
//                     "ENCLOSURE_RUN",
//                     "GL",
//                     "RUNNING"
//                 ],
//                 "sobId":"sob_e08d3e9f493c43619c97e3a45f06c3ff20180809152643"
//             },
//             {
//                 "sobName":"测试一下",
//                 "roleInfo":[
//                     "ADMIN"
//                 ],
//                 "moduleInfo":[
//                     "ASSETS",
//                     "CURRENCY",
//                     "ENCLOSURE_RUN",
//                     "GL",
//                     "NUMBER",
//                     "RUNNING"
//                 ],
//                 "sobId":"sob_3e7d75d5fd0747b5be0b95e9aaf8cf5c20180816101555"
//             },
//             {
//                 "sobName":"sdf",
//                 "roleInfo":[
//                     "ADMIN"
//                 ],
//                 "moduleInfo":[
//                     "ENCLOSURE_RUN",
//                     "RUNNING"
//                 ],
//                 "sobId":"sob_3e7d75d5fd0747b5be0b95e9aaf8cf5c20180817175732"
//             },
//             {
//                 "sobName":"新版前端大家一起测【无流水】",
//                 "roleInfo":[
//                     "ADMIN"
//                 ],
//                 "moduleInfo":[
//                     "AMB",
//                     "ASS",
//                     "ASSETS",
//                     "CURRENCY",
//                     "ENCLOSURE_GL",
//                     "GL",
//                     "NUMBER"
//                 ],
//                 "sobId":"sob_bfea058b367e4344a540291b1381cc6620180801192645"
//             },
//             {
//                 "sobName":"流水账",
//                 "roleInfo":[
//                     "CASHIER"
//                 ],
//                 "moduleInfo":[
//                     "ASSETS",
//                     "CURRENCY",
//                     "ENCLOSURE_GL",
//                     "GL",
//                     "NUMBER",
//                     "RUNNING"
//                 ],
//                 "sobId":"sob_3e7d75d5fd0747b5be0b95e9aaf8cf5c20180720234650"
//             },
//             {
//                 "sobName":"滴滴小白流水账",
//                 "roleInfo":[
//                     "ADMIN"
//                 ],
//                 "moduleInfo":[
//                     "ASSETS",
//                     "CURRENCY",
//                     "GL",
//                     "NUMBER",
//                     "RUNNING"
//                 ],
//                 "sobId":"sob_3e7d75d5fd0747b5be0b95e9aaf8cf5c20180730144139"
//             },
//             {
//                 "sobName":"哈比测试",
//                 "roleInfo":[
//                     "ADMIN"
//                 ],
//                 "moduleInfo":[
//                     "ENCLOSURE_RUN",
//                     "RUNNING"
//                 ],
//                 "sobId":"sob_3e7d75d5fd0747b5be0b95e9aaf8cf5c20180808165802"
//             },
//             {
//                 "sobName":"记账员+总观察员",
//                 "roleInfo":[
//                     "ADMIN"
//                 ],
//                 "moduleInfo":[
//                     "ASSETS",
//                     "CURRENCY",
//                     "ENCLOSURE_RUN",
//                     "GL",
//                     "NUMBER",
//                     "RUNNING"
//                 ],
//                 "sobId":"sob_3e7d75d5fd0747b5be0b95e9aaf8cf5c20180813155134"
//             },
//             {
//                 "sobName":"记账员+凭证观察员",
//                 "roleInfo":[
//                     "ADMIN"
//                 ],
//                 "moduleInfo":[
//                     "ASSETS",
//                     "CURRENCY",
//                     "ENCLOSURE_RUN",
//                     "GL",
//                     "NUMBER",
//                     "RUNNING"
//                 ],
//                 "sobId":"sob_3e7d75d5fd0747b5be0b95e9aaf8cf5c20180813155344"
//             },
//             {
//                 "sobName":"我是记账员",
//                 "roleInfo":[
//                     "OPERATOR"
//                 ],
//                 "moduleInfo":[
//                     "ASS",
//                     "ASSETS",
//                     "CURRENCY",
//                     "ENCLOSURE_GL",
//                     "GL",
//                     "NUMBER"
//                 ],
//                 "sobId":"sob_3e7d75d5fd0747b5be0b95e9aaf8cf5c20180725182615"
//             },
//             {
//                 "sobName":"小白版流水账",
//                 "roleInfo":[
//                     "ADMIN"
//                 ],
//                 "moduleInfo":[
//                     "RUNNING"
//                 ],
//                 "sobId":"sob_3e7d75d5fd0747b5be0b95e9aaf8cf5c20180720224448"
//             }
//         ],
//         "username":"叶子"
//     },
//     "code":0,
//     "message":"成功",
//     "str1":null,
//     "str2":null,
//     "str3":null,
//     "parameter":null
// }
