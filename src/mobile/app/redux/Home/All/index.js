import { fromJS, is, toJS }	from 'immutable'
import { showMessage, cascadeData } from 'app/utils'
import * as ActionTypes from './ActionTypes'
import * as Limit from 'app/constants/Limit.js'

const allState = fromJS({
	views: {
		isCheckOut: false, // 流水是否已结账
		offline: false,
	},
	// isObOrOp: false,
	// isAdOrOp: false,
	// isAd: false,
	issues: [],//‘第xxxx年xx期’
	assTags: ['客户', '供应商', '职员', '项目', '部门'],
	acTags: [{
		category: '资产',
		sub: ['流动资产', '非流动资产']
	}, {
		category: '负债',
		sub: ['流动负债', '非流动负债']
	}, {
		category: '权益',
		sub: ['所有者权益']
	}, {
		category: '成本',
		sub: ['成本']
	}, {
		category: '损益',
		sub: ['营业收入', '其他收益', '营业成本', '营业税金及附加', '期间费用', '其他损失', '所得税费用', '以前年度损益调整']
	}],
	period: {
		firstyear: '',
		firstmonth: '',
		lastyear: '',
		lastmonth: '',
		openedyear: '',
		openedmonth: '',
		closedyear: '',
		closedmonth: '',
		periodStartMonth:''
	},
	soblist: [
		/*{
			selected: false,
			sobid: '',
			sobname: '',
			companyname: '',
			template: '0',
			vcname: '记',
			adminlist: [{
					name: '',
					avatar: '',
					emplId: ''
			}],
			observerlist: [],
			operatorlist: []
		}*/
	],
	aclist: [
		/*{
			acid: '',
			acname: '',
			category: '',
			upperinfo: '无',
			upperid: '',
			direction: 'debit',
			asscategorylist: []
		}*/
	],
	cascadeDataAclist: [],
	acasslist: [
		/*{
	        asscategory: '客户',
	        asslist:[{
				assid: '9001',
				assname: '小明'
	        }],
	        aclist: [{
	            acid: '100201',
	            acname: '流动资产'
	        }]
	    }*/
	],
	isloading: false,
	data: {
		allAssList: []
	},
	lrAclist: [],
	systemInfo: {
		unitDecimalCount: '2', // 数量可以保存的小数位数
	},
	currencyModelList: [],

	runningCategory: [],
	accountList: [],
	accountPoundage: {},//手续费
	hideCategoryList: [],
	taxRate: {},
	oriCategory: [],//处理后的类别列表

	// 上传附件参数 类似token
	expire: 0,
	new: Date.parse(new Date()) / 1000,
	timestamp: Date.parse(new Date()) / 1000,
	uploadKeyJson: {
		// accessKeyId: "LTAI9ytx675TmcuI"
		// callback: "eyJjYWxsYmFja0JvZHkiOiJmaWxlbmFtZT0ke29iamVjdH0mc2l6ZT0ke3NpemV9Jm1pbWVUeXBlPSR7bWltZVR5cGV9JmhlaWdodD0ke2ltYWdlSW5mby5oZWlnaHR9JndpZHRoPSR7aW1hZ2VJbmZvLndpZHRofSIsImNhbGxiYWNrQm9keVR5cGUiOiJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQiLCJjYWxsYmFja1VybCI6Imh0dHA6Ly8xMTQuNTUuMzUuMTU3OjUwNjAvYWxpeXVuL29zcy9jYWxsYmFjayJ9"
		// dir: "sob_c2e5ae2dbe7b4fe4989d0fc9f022d90720181129145712/c2e5ae2dbe7b4fe4989d0fc9f022d907/1556507321847/"
		// expire: "1556507621"
		// host: "http://xfn-ddy-test-bucket.oss-cn-hangzhou.aliyuncs.com"
		// policy: "eyJleHBpcmF0aW9uIjoiMjAxOS0wNC0yOVQwMzoxMzo0MS44NDdaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjBdLFsic3RhcnRzLXdpdGgiLCIka2V5Iiwic29iX2MyZTVhZTJkYmU3YjRmZTQ5ODlkMGZjOWYwMjJkOTA3MjAxODExMjkxNDU3MTIvYzJlNWFlMmRiZTdiNGZlNDk4OWQwZmM5ZjAyMmQ5MDcvMTU1NjUwNzMyMTg0Ny8iXV19"
		// signature: "g/j+gweFXohpDLocHNgAX54LWpo="
	}
})

export default function handleConfig(state = allState, action) {
	return ({
		[ActionTypes.INIT_ALL]				: () => allState,
		[ActionTypes.SWITCH_LOADING_MASK]	: () => state.update('isloading', v => !v),
		[ActionTypes.GET_PERIOD_FETCH]		: () => {

			const period = fromJS(action.receivedData.data)
			// console.log(period.toJS())
			// if (action.receivedData.code || is(state.get('period'), period))
			// 	return state

			const issues = []
			const firstyear = Number(period.get('firstyear'))
			, lastyear = Number(period.get('lastyear'))
			, firstmonth = Number(period.get('firstmonth'))
			, lastmonth = Number(period.get('lastmonth'))

			for (let year = lastyear; year >= firstyear; --year) {
				if (firstyear === 0)
					break
				for (let month = (year === lastyear ? lastmonth : 12); month >= (year === firstyear ? firstmonth : 1); --month) {
					const monthstr = month < 10 ? '0' + month : month
					// console.log(year, monthstr, month)
					issues.push({
                        value: `${year}-${monthstr}`,
                        key: `${year}年第${monthstr}期`
                    })
				}
			}
			return state.set('period', period).set('issues', fromJS(issues))
		},
		[ActionTypes.GET_DBLIST_FETCH]  : () => {
			if (!action.receivedData.soblist.length)
				return state

			const defaultsobid = action.receivedData.defaultsobid
			const username = action.receivedData.username

			const soblist = fromJS(action.receivedData.soblist)
			const defaultsoblist = soblist.find(v => v.get('sobid') === defaultsobid)

			const adminlist = defaultsoblist.get('adminlist')
			const observerlist = defaultsoblist.get('observerlist')
			const operatorlist = defaultsoblist.get('operatorlist')

			if (adminlist.some(v => v.get('name') === username)) {
				// 代表的是按钮的disable属性值，与身份无关
				state = state.set('isObOrOp', false).set('isAdOrOp', false).set('isAd', false)
			}
			if (observerlist.some(v => v.get('name') === username)) {
				state = state.set('isObOrOp', true).set('isAdOrOp', true).set('isAd', true)
			}
			if (operatorlist.some(v => v.get('name') === username)) {
				state = state.set('isObOrOp', true).set('isAdOrOp', false).set('isAd', true)
			}

			return state.set('soblist', soblist)
		},
		[ActionTypes.DELETE_SOB_FETCH]	: () => state.update('soblist', v => v.filter(v => !v.get('selected'))),
		// [ActionTypes.INSERT_SOB]		: () => !history.goBack() && state.update('soblist', v => v.push(action.sob)),
		// [ActionTypes.MODIFY_SOB]		: () => !history.goBack() && state.updateIn(['soblist', action.idx], v => action.sob),
		[ActionTypes.INSERT_SOB]		: () => state.update('soblist', v => v.push(action.sob)),
		[ActionTypes.MODIFY_SOB]		: () => state.updateIn(['soblist', action.idx], v => action.sob),
		[ActionTypes.SELECT_SOB]		: () => state.updateIn(['soblist', action.idx, 'selected'], v => !v),
		[ActionTypes.SELECT_SOB_ALL]	: () => state.update('soblist',v =>  v.map(w => w.set('selected', true))),
		[ActionTypes.UNSELECT_SOB_ALL]	: () => state.update('soblist',v =>  v.map(w => w.set('selected', false))),
		[ActionTypes.CLOSE_SOB_FETCH]	: () => state.set('period', fromJS(action.receivedData.data)),
		[ActionTypes.OPEN_SOB_FETCH]	: () => state.set('period', fromJS(action.receivedData.data)),


		[ActionTypes.GET_AC_LIST_FETCH]	: () => {
			const aclist = fromJS(action.receivedData)
			const lrAclist = aclist.map((v, i) => {
				const curentacid = v.get('acid')
				const nextacid = aclist.getIn([i + 1, 'acid'])

				return v.set('hasSub', !!nextacid && nextacid.indexOf(curentacid) === 0)
			}).filter(v => !v.get('hasSub'))

			return state.set('aclist', aclist)
						.set('cascadeDataAclist', fromJS(cascadeData(action.receivedData)))
						.set('lrAclist', lrAclist)
		},
		// [ActionTypes.INSERT_AC]			: () => !history.goBack() && state.update('aclist', v => v.push(action.ac).sortBy(v => v.get('acid'))),
		// [ActionTypes.MODIFY_AC]			: () => !history.goBack() && state.updateIn(['aclist', action.idx], v => action.ac),
		[ActionTypes.INSERT_AC]			: () => state.update('aclist', v => v.push(action.ac).sortBy(v => v.get('acid'))),
		[ActionTypes.MODIFY_AC]			: () => state.updateIn(['aclist', action.idx], v => action.ac),
		[ActionTypes.SELECT_AC]			: () => state.updateIn(['aclist', action.idx, 'selected'], v => !v),
		[ActionTypes.SELECT_AC_CHILRENS]: () => state.update('aclist', v => v.map(w => w.get('upperid') == action.acid ? w.set('selected', true) : w)),
		[ActionTypes.SELECT_AC_ALL]		: () => {

			if (state.get('aclist').filter(w => action.tabSelectedSubTags.indexOf(w.get('category')) > -1).every(v => v.get('selected'))) {
				return state.update('aclist', v => v.map(w => action.tabSelectedSubTags.indexOf(w.get('category')) > -1 ? w.set('selected', false) : w))
			} else {
				return state.update('aclist', v => v.map(w => action.tabSelectedSubTags.indexOf(w.get('category')) > -1 ? w.set('selected', true) : w))
			}
		},
		[ActionTypes.UNSELECT_AC_ALL]	: () => state.update('aclist', v => v.map(w => w.set('selected', false))),
		[ActionTypes.SELECT_AC_BY_ASSCATEGORY]		: () => state.update('aclist', v => v.map(w => w.get('asscategorylist').some(w => w === action.asscategory) ? w.set('selected', true) : w)),
		[ActionTypes.DELETE_AC_FETCH]	: () => {
			const undeleteable = action.undeleteable
			return state.update('aclist', v => v.filter(v => !v.get('selected') || (v.get('selected') && undeleteable.some(w => w === v.get('acid')))))
		},
		[ActionTypes.GET_AC_ASS_LIST_FETCH]: () => {

			// console.log('action.receivedData', action.receivedData);
			// 将获取到的asscategory赋给数组
			let _tags = []
			action.receivedData.map(v => _tags.push(v.asscategory))
			// 过滤掉一定要有的五个类别
			allState.get('assTags').map(v => {
				_tags = _tags.filter(u => u !== v)
			})
			// 连接一定要有的5个类别和新增的类别
			const tags = allState.get('assTags').concat(_tags)
			// 郭涛流水账要用
            let allAssList = []
            action.receivedData.map(v => {
    			let assList = []
    			v.asslist.map(w => {
    				assList.push({
    					key: `${w.assid} ${w.assname}`,
    					value: `${w.assid}${Limit.TREE_JOIN_STR}${w.assname}${Limit.TREE_JOIN_STR}${v.asscategory}`
    				})
    			})
    			allAssList.push({
                    assCategory: v.asscategory,
                    assList
                })
    		})

			return state.set('acasslist', fromJS(action.receivedData)).set('assTags', tags).setIn(['data' ,'allAssList'], fromJS(allAssList))
		},
		[ActionTypes.MODIFY_ASS_FETCH]	: () => {
			if (!showMessage(action.receivedData))
				return state
			// history.goBack()

			const oldassid = action.ass.get('oldassid')
			const asscategory = action.ass.get('asscategory')
			return state.update('acasslist', w => w.map(v =>
				v.get('asscategory') === asscategory ?
					v.update('asslist', u => u.map(ass =>
						ass.get('assid') === oldassid ? ass.merge(action.ass) : ass
				)) : v
			))
		},
		[ActionTypes.INSERT_ASS_FETCH]	: () => {
			if (!showMessage(action.receivedData))
				return state
			// history.goBack()

			const asscategory = action.ass.get('asscategory')
			//若存在新增ass的类别，则将其添加至数组，反之，则新建类别并添加
			// if (state.get('acasslist').some(v => v.get('asscategory') == asscategory)) {
			// 	return state.update('acasslist', w => w.map(v => v.get('asscategory') == asscategory ? v.update('asslist', w => w.push(action.ass)) : v))
			// } else {
			// 	return state = state.update('acasslist', v => v.push(fromJS({
			// 		asscategory,
			// 		aclist: [],
			// 		asslist: [action.ass]
			// 	}))).update('assTags', v => v.set(asscategory, asscategory))
			// }
			if (state.get('assTags').some(v => v === asscategory)) {
				if (state.get('acasslist').some(v => v.get('asscategory') == asscategory)) {
					return state.update('acasslist', w => w.map(v => v.get('asscategory') == asscategory ? v.update('asslist', w => w.push(action.ass)) : v))
				} else {
					return state = state.update('acasslist', v => v.push(fromJS({
						asscategory,
						aclist: [],
						asslist: [action.ass]
					})))
				}
			} else {
				return state = state.update('acasslist', v => v.push(fromJS({
					asscategory,
					aclist: [],
					asslist: [action.ass]
				}))).update('assTags', v => v.push(asscategory))
			}
		},
		[ActionTypes.SELECT_ASS]		: () => state.updateIn(['acasslist', action.acAssSelectedIndex, 'asslist', action.idx, 'selected'], v => !v),
		[ActionTypes.SELECT_ASS_ALL]	: () => {

			if (state.getIn(['acasslist', action.acAssSelectedIndex, 'asslist']).every(v => v.get('selected'))) {
				return state.updateIn(['acasslist', action.acAssSelectedIndex, 'asslist'], v => v.map(w => w.set('selected', false)))
			} else {
				return state.updateIn(['acasslist', action.acAssSelectedIndex, 'asslist'], v => v.map(w => w.set('selected', true)))
			}
		},
		[ActionTypes.UNSELECT_ASS_ALL]			: () => state.updateIn(['acasslist', action.acAssSelectedIndex, 'asslist'], v => v ? v.map(w => w.set('selected', false)) : v),
		[ActionTypes.SELECT_AC_BY_CURRENCY]		: () => state.update('aclist', v => v.map(w => action.list.indexOf(w.get('acid')) > -1 ?  w.set('selected', true) : w)),
		[ActionTypes.SELECT_AC_CURRENCY]		: () => state.updateIn(['aclist', action.idx, 'selected'], v => !v),

		[ActionTypes.BEFORE_INSERT_GET_MODEL_FCLIST]     : () => state.set('currencyModelList', fromJS(action.receivedData)),
		[ActionTypes.CHANGE_SYSTEM_INFO]                 : () => state.set('systemInfo', fromJS(action.receivedData))
																	.set('currencyModelList', action.currencyModelList ? fromJS(action.currencyModelList) : fromJS([])),
		[ActionTypes.CHANGE_SYSTEM_UNIT_DECIMAL_COUNT]   : () => state.setIn(['systemInfo', 'unitDecimalCount'], action.value),


		// 流水部分
		[ActionTypes.GET_RUNNING_SETTING_INFO]      : () => {

			let categoryList = []//类别列表
			let runningCategory = fromJS(action.receivedData.categoryList)
            runningCategory.getIn([0, 'childList']).forEach(v => {
                if (v.get('childList').size) {//一级类别有子集
                    categoryList.push(v)
                } else {//一级类别无子集
                    if (v.get('beSpecial') && v.get('disableList').size == 0) {
                        categoryList.push(v)
                    }
                }
            })
			action.receivedData.hideCategoryList.forEach(v => {
				if (v['categoryType']=='LB_SFGL') {
					categoryList.push(v)
				}
			})
            categoryList.push({
                uuid: '内部核算',
                name: '内部核算',
                childList: action.receivedData.hideCategoryList
            })

            return state = state.set('runningCategory', runningCategory)
                                .setIn(['views', 'isCheckOut'], action.receivedData.isCheckOut)
                                .set('accountList', fromJS(action.receivedData.accountList))
                                .set('hideCategoryList', fromJS(action.receivedData.hideCategoryList))
                                .set('taxRate', fromJS(action.receivedData.rate))
								.set('oriCategory', fromJS(categoryList))
								.set('accountPoundage', fromJS(action.receivedData.accountPoundage))
        },
		[ActionTypes.RUNNING_CONFIG_GET_CATEGORY]                     : () => {
            return state.set('runningCategory', fromJS(action.receivedData.resultList))
                        .set('taxRate', fromJS(action.receivedData.rate))
        },
		[ActionTypes.GET_COMMON_TAX_RATE]      : () => {
            return state = state.set('taxRate', fromJS(action.receivedData.result))
        },
		[ActionTypes.CHANGE_TAX_RATE_DATA]      : () => {
            return state = state.setIn(['taxRate',action.dataType], fromJS(action.value))
        },
		[ActionTypes.AFTER_UPDATE_ALLRUNNING_RUNNING_CATEGORY]  : () => {
            return state = state.set('runningCategory', fromJS(action.receivedData.resultList))
        },
		[ActionTypes.CHANGE_CATEGORY_ORDER]                     : () => {
            return state.setIn(['runningCategory',0], fromJS(action.receivedData))
        },
		[ActionTypes.GET_RUNNING_CONF_CATEGORY]                     : () => {
			return state.set('runningCategory', fromJS(action.receivedData.resultList))
						.set('taxRate', fromJS(action.receivedData.rate))
		},
		[ActionTypes.GET_RUNNING_ACCOUNT_LIST]                     : () => {
			if (action.isCheckOut !== undefined) {
				state = state.setIn(['views', 'isCheckOut'], action.isCheckOut)
			}
			state = state.set('accountList', fromJS(action.receivedData))
			return state
		},
		[ActionTypes.AFTER_GET_UPLOAD_SIGNATURE]                      : () => {
			if (!action.code) {
				return state = state.set('uploadKeyJson', fromJS(action.receivedData))
									.set('expire', parseInt(action.receivedData.expire))
			} else if (action.code === 40040)  {
				return state = state.set('uploadKeyJson', fromJS({checkMoreFj: false}))
									.set('expire', 0)
			} else {
				return state
			}
		},
		[ActionTypes.CHANGE_OFFLINE_STATUS]						      : () => {
			return state = state.setIn(['views', 'offline'], action.bool)
		}
	}[action.type] || (() => state))()
}
