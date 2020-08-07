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
                disabledTip: '当前角色无该权限',
            },
            'exportExcel': {
                permission: false,
                style: 'disabled',
                disabledTip: '当前角色无该权限',
            },
            'review': {
                permission: false,
                style: 'disabled',
                disabledTip: '当前角色无该权限',
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
                disabledTip: '当前角色无该权限',
            },
            'exportExcel': {
                permission: false,
                style: 'disabled',
                disabledTip: '当前角色无该权限',
            },
            'review': {
                permission: false,
                style: 'disabled',
                disabledTip: '当前角色无该权限',
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
                disabledTip: '当前角色无该权限',
            },
            'exportExcel': {
                permission: true,
                style: 'show',
                disabledTip: '',
            },
            'review': {
                permission: false,
                style: 'disabled',
                disabledTip: '当前角色无该权限',
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
                disabledTip: '当前角色无该权限',
            },
            'exportExcel': {
                permission: false,
                style: 'disabled',
                disabledTip: '当前角色无该权限',
            },
            'review': {
                permission: true,
                style: 'show',
                disabledTip: '当前角色无该权限',
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
                disabledTip: '当前角色无该权限',
            },
            'exportExcel': {
                permission: false,
                style: 'disabled',
                disabledTip: '当前角色无该权限',
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
                disabledTip: '当前角色无该权限',
            },
            'review': {
                permission: false,
                style: 'disabled',
                disabledTip: '当前角色无该权限',
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
                disabledTip: '当前角色无该权限',
            },
            'review': {
                permission: false,
                style: 'disabled',
                disabledTip: '当前角色无该权限',
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
                disabledTip: '当前角色无该权限',
            },
            'review': {
                permission: true,
                style: 'show',
                disabledTip: '当前角色无该权限',
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

// 权限说明：（部分）
// 查询凭证的整理功能：
// 有权限的是：会计版的账套管理员、记账员叠加账套观察员/凭证观察员、记账员叠加账套审核员/凭证审核员
//           智能版的账套管理员、账套审核员、流水审核员



export const loginInfo = {}
//         "useruuid":"3e7d75d5fd0747b5be0b95e9aaf8cf5c",
//         "username":"叶子",
//         "corpId":"ding9e1aa64cbe4d3b3435c2f4657eb6378f",
//         "dduserid":"0403510440689690",
//         "isAdmin":"TRUE",
//         "corpName":"新权益",
//         "sobInfo":{
//             "sobId":"sob_3e7d75d5fd0747b5be0b95e9aaf8cf5c20180725182615",
//             "sobName":"我是记账员",
//             "moduleInfo":[
//                 "ASS",
//                 "ASSETS",
//                 "CURRENCY",
//                 "ENCLOSURE_GL",
//                 "GL",
//                 "NUMBER"
//             ],
//             "roleInfo":[
//                 "OPERATOR"
//             ]
//         },
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
//         "sobList":[
//             {
//                 "sobId":"sob_3e7d75d5fd0747b5be0b95e9aaf8cf5c20180720224448",
//                 "sobName":"小白版流水账",
//                 "moduleInfo":[
//                     "ASS",
//                     "CURRENCY",
//                     "GL"
//                 ],
//                 "roleInfo":[
//                     "ADMIN"
//                 ]
//             },
//             {
//                 "sobId":"sob_3e7d75d5fd0747b5be0b95e9aaf8cf5c20180725182615",
//                 "sobName":"我是记账员",
//                 "moduleInfo":[
//                     "ASS",
//                     "ASSETS",
//                     "CURRENCY",
//                     "ENCLOSURE_GL",
//                     "GL",
//                     "NUMBER"
//                 ],
//                 "roleInfo":[
//                     "OPERATOR"
//                 ]
//             },
//             {
//                 "sobId":"sob_3e7d75d5fd0747b5be0b95e9aaf8cf5c20180720234650",
//                 "sobName":"流水账",
//                 "moduleInfo":[
//                     "ASSETS",
//                     "CURRENCY",
//                     "ENCLOSURE_GL",
//                     "GL",
//                     "NUMBER",
//                     "RUNNING"
//                 ],
//                 "roleInfo":[
//                     "ADMIN"
//                 ]
//             }
//         ],
//         "authChannel":null,
//         "emplID":"0403510440689690",
//         "warning":{
//             "content":"亲爱的小番用户：",
//             "webStyle":null,
//             "context":[
//
//             ],
//             "comments":"若体验不错，可由“账套设置”-“超级管理”进行购买，咨询热线：0571-28121680",
//             "detail":null,
//             "expirationTime":null
//         },
//         "checkMoreFj":"TRUE",
//         "newEquity":true,
//         "moduleInfo":{
//             "ASSETS":true,
//             "ENCLOSURE":true,
//             "RUNNING":true,
//             "GL":true
//         }
//     }
