export const editRunningTemp = {
    'LB_ZSKX': {
        'STATE_ZS_SQ': {
            'oriDate':  '',
            'categoryUuid': '',
            'oriState': 'STATE_ZS_SQ',
            'amount': '',
            'oriAbstract': '',
            'usedCurrent':true,
            'accounts': [{
                'accountUuid': '',
                'accountName': '',
                'amount': '',
            }],
            'usedProject':  false,
            'projectCardList': [{
                'cardUuid': '',
                'amount': ''
            }],
            "currentCardList":[{
                "cardUuid":"526406343632879616"
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        },
        'STATE_ZS_TH': {
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "oriState":"STATE_ZS_TH",
            "amount":"100.00",
            "oriAbstract":"暂收收取流水",
            "accounts":[{
                "accountUuid":"asdad",
                "amount":"100.00",
            }],
            "pendingStrongList":[{
                "beSelect":true,
                "jrJvUuid":"1234123212312"
            }],
            "currentCardList":[{
                "cardUuid":3324243435,
                "amount":"232"
            }]
        }
    },
    'LB_ZFKX': {
        'STATE_ZF_FC': {
            'oriDate':  '',
            'categoryUuid': '',
            'oriState': 'STATE_ZS_SQ',
            'usedCurrent':true,
            'amount': '',
            'oriAbstract': '',
            'accounts': [{
                'accountUuid': '',
                'accountName': '',
                'amount': '',
            }],
            'usedProject':  false,
            'projectCardList': [{
                'cardUuid': '',
                'amount': ''
            }],
            "currentCardList":[{
                "cardUuid":"526406343632879616"
            }]
        },
        'STATE_ZF_SH': {
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "oriState":"STATE_ZS_TH",
            "amount":"100.00",
            "oriAbstract":"暂收收取流水",
            "usedProject":true,
            "accounts":[{
                "accountUuid":"asdad",
                "amount":"100.00",
            }],
            "pendingStrongList":[{
                "beSelect":true,
                "jrJvUuid":"1234123212312"
            }],
            "currentCardList":[{
                "cardUuid":3324243435,
                "amount":"232"
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        }
    },
    'LB_CQZC': {
        'STATE_CQZC_YF': {
            "oriDate":"2019-01-18",
            "oriState":'',
            "categoryUuid":"65ddd5c2374342b8b74b853364ff72b2",
            "handleType":"JR_HANDLE_GJ",
            "amount":"50.00",
            "currentAmount":"50.00",
            "oriAbstract":"长期资产购进流水",
            'usedCurrent':true,
            "usedProject":true,
            "projectCardList":[{
                "cardUuid":"517713948401729536",
                "amount":"100"
            }],
            "accounts":[{
                "accountUuid":"80239644d00f4b28b53f8e215c166c25",
                "amount":"50.00"
            }],
            "billList":[{
                "billType":"bill_common",
                "billState":"bill_states_make_out",
                "taxRate":3,
                "tax":"1.50"
            }],
            "currentCardList":[{
                "cardUuid":"526406343632879616"
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        },
        'STATE_CQZC_YS':{
            'usedCurrent':true,
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "oriState":"STATE_CQZC_YS",
            "handleType":"JR_HANDLE_GJ",
            "amount":"100.00",
            "currentAmount":"100.00",
            "oriAbstract":"长期资产购进流水",
            "accounts":[{
                "accountUuid":"asdad",
                "amount":"100.00"
            }],
            "billList":[{
                "billType":"bill_common",
                "billState":"bill_states_make_out",
                "taxRate":3,
                "tax":"2.00"
            }],
            "currentCardList":[{
                "cardUuid":"2222323"
            }],
            "beCleaning":true,
             "assets":{
                "originalAssetsAmount":"5.00",
                "depreciationAmount":"1.00",
                "cleaningAmount":"98.00"
            },
            "usedProject":true,
            "projectCardList":[{
                "cardUuid":"519917674768105472",
                "amount":"98.00"
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        }
    },
    "LB_JK":{
        "STATE_JK_YS":{
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "handleType":"JR_HANDLE_QDJK",
            "oriState":"STATE_JK_YS",
            "amount":"100.00",
            "oriAbstract":"收到借款",
            "usedCurrent":false,
            "currentCardList":[{
                "cardUuid":"2222323"
            }],
            "accounts":[{
                "accountUuid":"asdad",
                "amount":"100.00",
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        },
        "STATE_JK_YF":{
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "handleType":"JR_HANDLE_QDJK",
            "oriState":"STATE_JK_YS",
            "amount":"100.00",
            "oriAbstract":"收到借款",
            "usedCurrent":false,
            "currentCardList":[{
                "cardUuid":"2222323"
            }],
            "accounts":[{
                "accountUuid":"asdad",
                "amount":"100.00",
            }],
        },
        "STATE_JK_JTLX":{
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "handleType":"JR_HANDLE_CHLX",
            "oriState":"STATE_JK_JTLX",
            "amount":"100.00",
            "oriAbstract":"计提借款利息",
            "usedProject":true,
            "usedCurrent":false,
            "currentCardList":[{
                "cardUuid":"2222323"
            }],
            "projectCardList":[{
               "cardUuid":"2222323",
               "amount":"100.00",
            }],
        },
        "STATE_JK_ZFLX":{
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "handleType":"JR_HANDLE_CHLX",
            "oriState":"STATE_JK_ZFLX",
            "amount":"100.00",
            "oriAbstract":"支付借款利息",
            "usedProject":false,
            "usedCurrent":false,
            "currentCardList":[{
                "cardUuid":"2222323"
            }],
            "accounts":[{
                "accountUuid":"asdad",
                "amount":"100.00",
            }],
            "pendingStrongList":[{
                "beSelect":true,
                "jrJvUuid":"1234123212312"
            }],
            "projectCardList":[{
               "cardUuid":"2222323",
               "amount":"100.00",
            }],
        }
    },
    "LB_YYWSR": {
        "STATE_YYWSR":{
            "oriDate": "2019-01-18",
            "oriState":"STATE_YYSR_XS",
            "categoryUuid": "159e0348534646ef81fc7ccc4fc3e3aa ",
            "currentAmount": "100.00",
            "amount": "100.00",
            "oriAbstract": "营业外收入",
            "usedProject": "true",
            'usedCurrent':true,
            "accounts":[{
                "accountUuid":"4f22f34d089341188119743e309302f0"
            }],
            "currentCardList": [
                {
                  "cardUuid": "535824350452908032"
                }
            ],
            "projectCardList": [
                {
                  "cardUuid": "535824479587139584",
                  "amount": "100"
                }
            ],
            "billList":[{
                "billType":"bill_common",
                "billState":"bill_states_make_out",
                "taxRate":3,
                "tax":"2.00"
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        }

    },
    "LB_YYWZC": {
        "STATE_YYWZC":{
            "oriDate": "2019-01-18",
            "oriState":"STATE_YYSR_XS",
            "categoryUuid": "159e0348534646ef81fc7ccc4fc3e3aa ",
            "currentAmount": "100.00",
            "amount": "100.00",
            "oriAbstract": "营业外收入",
            "usedProject": "true",
            'usedCurrent':true,
            "accounts":[{
                "accountUuid":"4f22f34d089341188119743e309302f0"
            }],
            "currentCardList": [
                {
                  "cardUuid": "535824350452908032"
                }
            ],
            "projectCardList": [
                {
                  "cardUuid": "535824479587139584",
                  "amount": "100"
                }
            ],
            "billList":[{
                "billType":"bill_common",
                "billState":"bill_states_make_out",
                "taxRate":3,
                "tax":"2.00"
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        }

    },
    "LB_XCZC":{
        "STATE_XC_JT":{
            "oriDate":"2019-01-01",
            "categoryUuid":"2312c02e59ae4357b72a0582e792aabf",
            "oriState":"STATE_XC_JT",
            "amount":"300.00",
            "oriAbstract":"工资薪金",
            "usedProject":"true",
            "propertyCost":"XZ_MANAGE",
            "accounts":[{
                "accountUuid":"4f22f34d089341188119743e309302f0"
            }],
            "projectCardList":[{
                "cardUuid":"517713948401729536",
                "amount":"100"
            },{
                "cardUuid":"517713966395293696",
                "amount":"200"
            }]
        },
        "STATE_XC_FF":{
            "oriDate":"2019-01-01",
            "categoryUuid":"2312c02e59ae4357b72a0582e792aabf",
            "oriState":"STATE_XC_FF",
            "amount":"100.00",
            "oriAbstract":"工资薪金",
            "propertyCost":"XZ_MANAGE",
            "accounts":[{
                "accountUuid":"4f22f34d089341188119743e309302f0"
            }],
            "pendingStrongList":[
                {"jrJvUuid":"544889239427350530", "beSelect":true}
            ],
            "payment":{
                "actualAmount":"",
                "companyAccumulationAmount":"",
                "personAccumulationAmount":"1",
                "companySocialSecurityAmount":"",
                "personSocialSecurityAmount":"1",
                "incomeTaxAmount":"1"
            },
            "usedProject":true,
            "projectCardList":[{
               "cardUuid":"519917674768105472",
               "amount":"98.00"
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        },
        "STATE_XC_JN":{
            "oriDate":"2019-01-01",
            "categoryUuid":"2312c02e59ae4357b72a0582e792aabf",
            "oriState":"STATE_XC_FF",
            "amount":"100.00",
            "oriAbstract":"工资薪金",
            "propertyCost":"XZ_MANAGE",
            "accounts":[{
                "accountUuid":"4f22f34d089341188119743e309302f0"
            }],
            "pendingStrongList":[
                {"jrJvUuid":"544889239427350530", "beSelect":true}
            ],
            "payment":{
                "actualAmount":"",
                "companyAccumulationAmount":"",
                "personAccumulationAmount":"1",
                "companySocialSecurityAmount":"",
                "personSocialSecurityAmount":"1",
                "incomeTaxAmount":"1"
            },
            "usedProject":true,
            "projectCardList":[{
               "cardUuid":"519917674768105472",
               "amount":"98.00"
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        },
        "STATE_XC_DJ":{
            "oriDate":"2019-01-01",
            "categoryUuid":"2312c02e59ae4357b72a0582e792aabf",
            "oriState":"STATE_XC_FF",
            "amount":"100.00",
            "oriAbstract":"工资薪金",
            "propertyCost":"XZ_MANAGE",
            "accounts":[{
                "accountUuid":"4f22f34d089341188119743e309302f0"
            }],
            "pendingStrongList":[
                {"jrJvUuid":"544889239427350530", "beSelect":true}
            ],
            "payment":{
                "actualAmount":"",
                "companyAccumulationAmount":"",
                "personAccumulationAmount":"1",
                "companySocialSecurityAmount":"",
                "personSocialSecurityAmount":"1",
                "incomeTaxAmount":"1"
            },
            "usedProject":true,
            "projectCardList":[{
               "cardUuid":"519917674768105472",
               "amount":"98.00"
            }]
        },
        "STATE_XC_DK":{
            "oriDate":"2019-01-01",
            "categoryUuid":"2312c02e59ae4357b72a0582e792aabf",
            "oriState":"STATE_XC_FF",
            "amount":"100.00",
            "oriAbstract":"工资薪金",
            "propertyCost":"XZ_MANAGE",
            "accounts":[{
                "accountUuid":"4f22f34d089341188119743e309302f0"
            }],
            "pendingStrongList":[
                {"jrJvUuid":"544889239427350530", "beSelect":true}
            ],
            "payment":{
            },
            "usedProject":true,
            "projectCardList":[{
               "cardUuid":"519917674768105472",
               "amount":"98.00"
            }]
        },
    },
    "LB_TZ":{
        "STATE_TZ_JTGL":{
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "handleType":"JR_HANDLE_QDSY",
            "oriState":"STATE_TZ_JTGL",
            "amount":"100.00",
            "oriAbstract":"计提投资收益",
            "usedProject":true,
            "projectCardList":[{
                "cardUuid":"2222323",
                "amount":"100.00",
            }],
            "usedCurrent":false,
            "currentCardList":[{
                "cardUuid":"2222323"
            }],
        },
        "STATE_TZ_JTLX":{
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "handleType":"JR_HANDLE_QDSY",
            "oriState":"STATE_TZ_JTGL",
            "amount":"100.00",
            "oriAbstract":"计提投资收益",
            "usedProject":true,
            "projectCardList":[{
                "cardUuid":"2222323",
                "amount":"100.00",
            }],
            "usedCurrent":false,
            "currentCardList":[{
                "cardUuid":"2222323"
            }],
        },
        "STATE_TZ_SRGL":{
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "handleType":"JR_HANDLE_QDSY",
            "oriState":"STATE_TZ_SRGL",
            "amount":"100.00",
            "oriAbstract":"收到投资收益",
            "usedProject":true,
            "accounts":[{
                "accountUuid":"asdad",
                "amount":"100.00",
            }],
            "pendingStrongList":[{
                "beSelect":true,
                "jrJvUuid":"1234123212312"
            }],
            "projectCardList":[{
                "cardUuid":"2222323",
                "amount":"100.00",
            }],
            "usedCurrent":false,
            "currentCardList":[{
                "cardUuid":"2222323"
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        },
        "STATE_TZ_SRLX":{
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "handleType":"JR_HANDLE_QDSY",
            "oriState":"STATE_TZ_SRGL",
            "amount":"100.00",
            "oriAbstract":"收到投资收益",
            "usedProject":true,
            "accounts":[{
                "accountUuid":"asdad",
                "amount":"100.00",
            }],
            "pendingStrongList":[{
                "beSelect":true,
                "jrJvUuid":"1234123212312"
            }],
            "projectCardList":[{
                "cardUuid":"2222323",
                "amount":"100.00",
            }],
            "usedCurrent":false,
            "currentCardList":[{
                "cardUuid":"2222323"
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        },
        "STATE_TZ_YS":{
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "handleType":"JR_HANDLE_DWTZ",
            "oriState":"STATE_TZ_YS",
            "amount":"100.00",
            "oriAbstract":"对外投资支出",
            "accounts":[{
                "accountUuid":"asdad",
                "amount":"100.00",
            }],
            "usedCurrent":false,
            "currentCardList":[{
                "cardUuid":"2222323"
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        },
        "STATE_TZ_YF":{
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "handleType":"JR_HANDLE_DWTZ",
            "oriState":"STATE_TZ_YF",
            "amount":"100.00",
            "oriAbstract":"对外投资支出",
            "accounts":[{
                "accountUuid":"asdad",
                "amount":"100.00",
            }],
            "usedCurrent":false,
            "currentCardList":[{
                "cardUuid":"2222323"
            }],
        },
    },
    "LB_ZB":{
        "STATE_ZB_ZZ":{
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "handleType":"JR_HANDLE_ZZ",
            "oriState":"STATE_ZB_ZZ",
            "amount":"100.00",
            "oriAbstract":"增加注册资本",
            "accounts":[{
                "accountUuid":"asdad",
                "amount":"100.00",
            }],
            "usedCurrent":false,
            "currentCardList":[{
                "cardUuid":"2222323"
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        },
        "STATE_ZB_JZ":{
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "handleType":"JR_HANDLE_ZZ",
            "oriState":"STATE_ZB_JZ",
            "amount":"100.00",
            "oriAbstract":"增加注册资本",
            "accounts":[{
                "accountUuid":"asdad",
                "amount":"100.00",
            }],
            "usedCurrent":false,
            "currentCardList":[{
                "cardUuid":"2222323"
            }],
        },
        "STATE_ZB_LRFP":{
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "handleType":"JR_HANDLE_LRFP",
            "oriState":"STATE_ZB_LRFP",
            "amount":"100.00",
            "oriAbstract":"计提借款利息",
            "usedCurrent":false,
            "currentCardList":[{
                "cardUuid":"2222323"
            }],
        },
        "STATE_ZB_ZBYJ":{
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "handleType":"JR_HANDLE_LRFP",
            "oriState":"STATE_ZB_LRFP",
            "amount":"100.00",
            "oriAbstract":"计提借款利息",
            "usedCurrent":false,
            "currentCardList":[{
                "cardUuid":"2222323"
            }],
            "accounts":[{
                "accountUuid":"asdad",
                "amount":"100.00",
            }],
        },
        "STATE_ZB_ZFLR":{
            "oriDate":"2019-01-01",
            "categoryUuid":"sdfsdfsdfsdfd",
            "handleType":"JR_HANDLE_LRFP",
            "oriState":"STATE_ZB_ZFLR",
            "amount":"100.00",
            "oriAbstract":"支付分配利润",
            "accounts":[{
                "accountUuid":"asdad",
                "amount":"100.00",
            }],
            "pendingStrongList":[{
                "beSelect":true,
                "jrJvUuid":"1234123212312"
            }],
            "usedCurrent":false,
            "currentCardList":[{
                "cardUuid":"2222323"
            }],
        }

    },
    "LB_FYZC":{
        "STATE_FY":{
            "oriDate": "2019-01-18",
            "categoryUuid": "f1c3214317584a5e96db4d83e04d3389",
            "oriState": "STATE_FY",
            "amount": "1000.00",
            "currentAmount": "1000.00",
            "oriAbstract": "财务费用支出",
            "usedProject": true,
            "usedCurrent": true,
            "propertyCost": "XZ_FINANCE",
            "offsetAmount":0,
            "usedAccounts":true,
            "accounts": [
                {
                    "accountUuid": "3c80258ffa4745198e031974b5ca2a4c"
                }
            ],
            "projectCardList": [
                {
                    "cardUuid": "536862976863371264",
                    "amount": "1000.00"
                }
            ],
            "billList": [
                {
                    "billType": "bill_special",
                    "billState": "bill_states_auth",
                    "taxRate": 2,
                    "tax": "19.61"
                }
            ],
            "currentCardList": [
                {
                    "cardUuid": "536862837222408192"
                }
            ],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        },
        "STATE_FY_DJ":{
            "oriDate": "2019-01-18",
            "categoryUuid": "f1c3214317584a5e96db4d83e04d3389",
            "oriState": "STATE_FY_DJ",
            "amount": "1000.00",
            "oriAbstract": "支付预付款",
            "usedProject": true,
            'usedCurrent':true,
            "usedAccounts":true,
            "projectCardList":[{
                            "cardUuid":"517713948401729536",
                            "amount":"100"
            }],
            "accounts": [
                {
                   "accountUuid": "3c80258ffa4745198e031974b5ca2a4c"
                }
            ],
            "currentCardList": [
                {
                   "cardUuid": "536862837222408192"
                }
            ]

        }
    },
    "LB_SFZC":{
        "STATE_SF_YJZZS":{
            "oriDate":"2019-01-19",
            "categoryUuid":"b1e090bc06fe4cafba05a5bda0b0b76f",
            "oriState":"STATE_SF_YJZZS",
            "amount":"55.00",
            "oriAbstract":"预交增值税",
            "accounts":[{
                "accountUuid":"80239644d00f4b28b53f8e215c166c25",
                "amount":"55.00"
            }]
        },
        "STATE_SF_ZCWJZZS":{
            "oriDate": "2019-03-21",
            "categoryUuid": "6e2ed596c32b4042ae43002c122d4c02",
            "oriState": "STATE_SF_ZCWJZZS",
            "oriAbstract": "转出未交增值税",
            "amount": 100
        },
        "STATE_SF_JN":{
            "oriDate":"2019-01-22",
            "categoryUuid":"3f15f228d7834e44949d90709d45e0f9",
            "oriState":"STATE_SF_JN",
            "amount":"2.00",
            "accounts":[{
                "accountUuid":"80239644d00f4b28b53f8e215c166c25",
                "amount":"2.00"
            }],
            "oriAbstract":"增值税缴纳",
            "beReduceTax":true,
            "reduceAmount":3.00,
            "offsetAmount":3.00,
            "projectCardList":[],
            "usedProject":true,
            "pendingStrongList":[
                {
                    "beSelect":true,
                    "oriUuid": "536226845515841536",
                    "jrUuid": "536226855305347072",
                    "jrJvUuid": "536226855368261632",
                    "jrIndex": 10,
                    "oriDate": "2019-01-19",
                    "categoryName": "增值税",
                    "oriAbstract": "增值税缴纳",
                    "amount": 60,
                    "handleAmount": 0,
                    "notHandleAmount": 20
                }
            ]
        },
        "STATE_SF_JT":{
            "oriDate":"2019-01-19",
            "categoryUuid":"3f15f228d7834e44949d90709d45e0f9",
            "oriState":"STATE_SF_JT",
            "amount":"60.00",
            "oriAbstract":"企业所得税计提",
            "usedProject":true,
            "projectCardList":[
                {
                    "cardUuid":"526447546277560320",
                    "amount":"20.00"
                },{
                    "cardUuid":"536221105682120704",
                    "amount":"40.00"
                }
            ]
        },
        "STATE_SF_SFJM":{
            "oriDate":"2019-01-19",
            "categoryUuid":"3f15f228d7834e44949d90709d45e0f9",
            "oriState":"STATE_SF_JT",
            "reduceAmount":"60.00",
            "amount":"",
            "oriAbstract":"企业所得税计提",
            "usedProject":true,
            "projectCardList":[
                {
                    "cardUuid":"526447546277560320",
                    "amount":"20.00"
                },{
                    "cardUuid":"536221105682120704",
                    "amount":"40.00"
                }
            ],
            "pendingStrongList":[{
                "beSelect":true,
                "jrJvUuid":"1234123212312"
            }],
        },
    },
    "LB_YYSR":{
        "STATE_YYSR_XS":{
            "oriDate":"2019-01-01",
            "categoryUuid":"9bd6c785a1eb4dfe829936cb120558ec",
            "oriState":"STATE_YYSR_XS",
            "amount":"200.00",
            "currentAmount":"100",
            "offsetAmount":"100",
            "oriAbstract":"销售收入",
            "usedProject":"true",
            "usedStock": "true",
            "beCarryover":"false",
            'usedCurrent':true,
            "usedAccounts":true,
            "accounts":[{
                "accountUuid":"4f22f34d089341188119743e309302f0"
            }],
            "currentCardList":[{
                "cardUuid":"517713707602542592"
            }],
            "stockCardList":[],
            "carryoverCardList":[],
            "projectCardList":[{
                "cardUuid":"517713948401729536",
                "amount":"100"
            },
            {
                "cardUuid":"517713966395293696",
                "amount":"100"
            }],
            "billList":[{
                "billType":"bill_common",
                "billState":"bill_states_make_out",
                "taxRate":"2"
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]

        },
        "STATE_YYSR_TS":{
            "oriDate":"2019-01-01",
            "categoryUuid":"9bd6c785a1eb4dfe829936cb120558ec",
            "oriState":"STATE_YYSR_XS",
            "amount":"200.00",
            "currentAmount":"100",
            "offsetAmount":"100",
            "oriAbstract":"销售收入",
            "usedProject":"true",
            "usedStock": "true",
            "beCarryover":"false",
            "usedAccounts":true,
            'usedCurrent':true,
            "accounts":[{
                "accountUuid":"4f22f34d089341188119743e309302f0"
            }],
            "currentCardList":[{
                "cardUuid":"517713707602542592"
            }],
            "stockCardList":[],
            "carryoverCardList":[],
            "projectCardList":[{
                "cardUuid":"517713948401729536",
                "amount":"100"
            },
            {
                "cardUuid":"517713966395293696",
                "amount":"100"
            }],
            "billList":[{
                "billType":"bill_common",
                "billState":"bill_states_make_out",
                "taxRate":"2"
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        },
        "STATE_YYSR_DJ":{
            "oriDate":"2019-01-01",
            "categoryUuid":"9bd6c785a1eb4dfe829936cb120558ec",
            "oriState":"STATE_YYSR_XS",
            "amount":"200.00",
            "oriAbstract":"销售收入",
            "usedAccounts":true,
            'usedCurrent':true,
            "usedProject":"true",
            "projectCardList":[{
                            "cardUuid":"517713948401729536",
                            "amount":"100"
                        }],
            "accounts":[{
                "accountUuid":"4f22f34d089341188119743e309302f0"
            }],
            "currentCardList":[{
                "cardUuid":"517713707602542592"
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        },
    },
    "LB_YYZC":{
        "STATE_YYZC_GJ":{
            "oriDate":"2019-01-01",
            "categoryUuid":"9bd6c785a1eb4dfe829936cb120558ec",
            "oriState":"STATE_YYSR_XS",
            "amount":"200.00",
            "currentAmount":"100",
            "offsetAmount":"100",
            "oriAbstract":"销售收入",
            "usedProject":"true",
            "usedStock": "true",
            "beCarryover":"false",
            "propertyCost":'11',
            'usedCurrent':true,
            "usedAccounts":true,
            "relationCategoryUuid":'',
            "carryoverProjectCardList":[],
            "usedCarryoverProject":true,
            "accounts":[{
                "accountUuid":"4f22f34d089341188119743e309302f0"
            }],
            "currentCardList":[{
                "cardUuid":"517713707602542592"
            }],
            "stockCardList":[],
            "carryoverCardList":[],
            "projectCardList":[{
                "cardUuid":"517713948401729536",
                "amount":"100"
            },
            {
                "cardUuid":"517713966395293696",
                "amount":"100"
            }],
            "billList":[{
                "billType":"bill_common",
                "billState":"bill_states_make_out",
                "taxRate":"2"
            }]
        },
        "STATE_YYZC_TG":{
            "oriDate":"2019-01-01",
            "categoryUuid":"9bd6c785a1eb4dfe829936cb120558ec",
            "oriState":"STATE_YYSR_XS",
            "amount":"200.00",
            "currentAmount":"100",
            "offsetAmount":"100",
            "oriAbstract":"销售收入",
            "usedProject":"true",
            "usedStock": "true",
            "beCarryover":"false",
            'usedCurrent':true,
            "usedAccounts":true,
            "accounts":[{
                "accountUuid":"4f22f34d089341188119743e309302f0"
            }],
            "currentCardList":[{
                "cardUuid":"517713707602542592"
            }],
            "stockCardList":[],
            "carryoverCardList":[],
            "projectCardList":[{
                "cardUuid":"517713948401729536",
                "amount":"100"
            },
            {
                "cardUuid":"517713966395293696",
                "amount":"100"
            }],
            "billList":[{
                "billType":"bill_common",
                "billState":"bill_states_make_out",
                "taxRate":"2"
            }],
            "needUsedPoundage":true,
            "poundageCurrentCardList":[],
            "poundageProjectCardList":[]
        },
        "STATE_YYZC_DJ":{
            "oriDate":"2019-01-01",
            "usedAccounts":true,
            "categoryUuid":"9bd6c785a1eb4dfe829936cb120558ec",
            "oriState":"STATE_YYSR_XS",
            "amount":"200.00",
            "oriAbstract":"销售收入",
            'usedCurrent':true,
            "usedProject":"true",
            "projectCardList":[{
                            "cardUuid":"517713948401729536",
                            "amount":"100"
            }],
            "accounts":[{
                "accountUuid":"4f22f34d089341188119743e309302f0"
            }],
            "currentCardList":[{
                "cardUuid":"517713707602542592"
            }]
        },
    }
}
