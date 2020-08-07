import { fromJS, is, toJS }	from 'immutable'
import { message } from 'antd'
import { DateLib }	from 'app/utils'
import { showMessage, cascadeData } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'

const allState = fromJS({
	views: {
		isLoading: false,
		// mxb是否显示流水预览
		mxbRunningPreviewVisibility: false,
		// mxb是否显示序列号预览
		mxbSerialDrawerVisibility: false,
		// 查询页是否显示流水预览
		searchRunningPreviewVisibility: false,
		// 账户设置是否已结转
		isCheckOut: false,
		loadingState: 0,
	},
	userLog: [],
	isObOrOp: false,
	isAdOrOp: false,
	isAd: false,
	conf: {},
	aclist: [], //getaclist 获取到的数据存储
	categoryAclist: {
		'资产': [],
		'负债': [],
		'权益': [],
		'成本': [],
		'损益': []
	},
	lrAclist: [],
	cascadeAclist: {
		'资产': [],
		'负债': [],
		'权益': [],
		'成本': [],
		'损益': []
	},
	cascadeAclistArr: [
		'资产': [],
		'负债': [],
		'权益': [],
		'成本': [],
		'损益': []
	],
	allasscategorylist: [ //getasslist得到的数据,最全的allasscategorylist，aclist里有个asscategorylist 原来叫asslist
		// {
		// 	"aclist": [{
		// 		"acfullname":"材料成本差异",
		// 		"acname":"材料成本差异",
		// 		"acid":"1404"
		// 	}],
		// 	"asscategory":"部门",
		// 	"asslist":[{ 原来叫list
		// 		"assid":"12323433",
		// 		"assname":"12"
		// 	}]
		// }
	],
	assTags: [
		'客户',
		'供应商',
		'职员',
		'项目',
		'部门'
	],
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
		periodStartMonth:'',
	},
	issues: [],
	accountPeriod: { //流水账账期
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
	accountIssues:[], //流水账账期
	defaultIssuedate: '',
	isloading: false,
	showPzBomb: false,
	showPrintModal:false,
	// cxkcBomb: false,
	// cxcgBomb: false,
	// cxxsBomb: false,
	pzBombFrom: '',
	pzBombCallback: null,

	systemInfo: {
		unitDecimalCount: '2', // 数量可以保存的小数位数
	},
	currencyModelList: [],

	// 录入流水 及 流水设置
	runningCategory: [{
		childList: []
	}],  // categoryList
	accountList: [],
	hideCategoryList: [],
	taxRate: {}, // rate

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
	},

	internalFrame: {
		title: '',
		url: '',
		visibile: false,
		cancelText: '',
	}
})
let achide = null

export default function handleAll(state = allState, action) {
	return ({
		[ActionTypes.INIT_ALL]						  : () => allState,
		// iframe弹框
		[ActionTypes.CHANGE_INTERNAL_FRAME_STATUS]     : () => {
			return state = state.setIn(['internalFrame', 'visibile'], action.opt.visibile)
								.setIn(['internalFrame', 'url'], action.opt.url)
								.setIn(['internalFrame', 'title'], action.opt.title)
								.setIn(['internalFrame', 'cancelText'], action.opt.cancelText)
		},
		// 控制加载中蒙层
		[ActionTypes.SWITCH_LOADING_MASK]		      : () => {

			// console.log('loadingType', action.loadingType);

			if (action.loadingType && action.loadingType === 'add') {
				// isloading 设置为 true, loadingState + 1
				return state.updateIn(['views', 'isLoading'], v => v ? v : !v).updateIn(['views', 'loadingState'], v => v+1)
			}

			if (action.loadingType && action.loadingType === 'minus') {
				// loadingState - 1
				state = state.updateIn(['views', 'loadingState'], v => v-1)
			}

			if (state.getIn(['views', 'loadingState']) === 0) {
				return state.updateIn(['views', 'isLoading'], v => !v)
			} else {
				return state
			}

			// return state.updateIn(['views', 'isLoading'], v => action.isloading === undefined ? !v : action.isloading)
		},

		[ActionTypes.AFTER_GET_AC_LIST_FETCH]		: () => {
			const aclist = fromJS(action.receivedData)
			const categoryAclist = {
				'资产': [],
				'负债': [],
				'权益': [],
				'成本': [],
				'损益': []
			}
			action.receivedData.forEach(v => {
				const key = {
					'流动资产': '资产',
					'非流动资产': '资产',
					'流动负债': '负债',
					'非流动负债': '负债',
					'所有者权益': '权益',
					'成本': '成本'
				}[v.category] || '损益'
				categoryAclist[key].push(v)
			})
			const lrAclist = aclist.map((v, i) => {
				const curentacid = v.get('acid')
				const nextacid = aclist.getIn([i + 1, 'acid'])

				return v.set('hasSub', !!nextacid && nextacid.indexOf(curentacid) === 0)
			}).filter(v => !v.get('hasSub'))


			return state.set('aclist', aclist)
				.set('categoryAclist', fromJS(categoryAclist))
				.set('lrAclist', lrAclist)
				.update('cascadeAclist', v => v.map((w, key) => cascadeData(categoryAclist[key])))
		},
		[ActionTypes.AFTER_DELETE_AC_ITEM_FETCH]    : () => {
			if (!achide() && !showMessage(action.receivedData))
				return state

			state = state.updateIn(['categoryAclist', action.idx], v => v.filter(w => !action.acidlist.includes(w.get('acid'))))
				.update('aclist', v => v.filter((w, i)=> !action.acidlist.includes(w.get('acid'))))
			return state.set('aclist', state.get('categoryAclist').reduce((prev, v) => prev.concat(v)))
		},
		[ActionTypes.AFTER_ENTER_AC_ITEM_FETCH]     : () => {
			const oldacid = action.AcItem.get('oldacid')
			const AcItem = action.AcItem
			return state.set('aclist', state.get('categoryAclist').reduce((prev, v) => prev.concat(v)))
		},
		[ActionTypes.GET_PERIOD_FETCH]		: () => {
			const period = fromJS(action.receivedData.data)

			if (is(state.get('period'), period)){
				return state
			}

			const firstyear = Number(period.get('firstyear'))
			, lastyear = Number(period.get('lastyear'))
			, firstmonth = Number(period.get('firstmonth'))
			, lastmonth = Number(period.get('lastmonth'))

			const issues= []
			for (let year = lastyear; year >= firstyear; -- year) {
				if (firstyear === 0)
					break
				for (let month = (year === lastyear ? lastmonth : 12); month >= (year === firstyear ? firstmonth : 1); --month)
					issues.push(`${year}年第${month < 10 ? '0' + month : month}期`)
			}

			return state.set('period', period).set('issues', fromJS(issues))
		},
		[ActionTypes.GET_ACCOUNT_PERIOD_FETCH]		: () => {
			const period = fromJS(action.receivedData.data)

			const firstyear = Number(period.get('firstyear'))
			, lastyear = Number(period.get('lastyear'))
			, firstmonth = Number(period.get('firstmonth'))
			, lastmonth = Number(period.get('lastmonth'))
			const issues= []

			for (let year = lastyear; year >= firstyear; -- year) {
				if (firstyear === 0)
					break
				for (let month = (year === lastyear ? lastmonth : 12); month >= (year === firstyear ? firstmonth : 1); --month)
					issues.push(`${year}年第${month < 10 ? '0' + month : month}期`)
			}

			return state.set('accountPeriod', period).set('accountIssues', fromJS(issues))
		},

		[ActionTypes.CLOSE_OR_OPEN_PERIED_FETCH]				: () => {
			const period = fromJS(action.receivedData.data)
			if (is(state.get('period'), period))
				return state

			// 处理当前日期
			const today = new Date()
			const todayis = new DateLib(today).toString()
			const year = todayis.substr(0,4)
			const month = todayis.substr(5,2)
			// 所有页面的默认账期，优先级为：1.opened日期 2.closed日期 3.当前日期
			const defaultIssuedate = `${period.get('openedyear') || period.get('closedyear') || year}年第${period.get('openedmonth') || period.get('closedmonth') || month}期`

			const firstyear = Number(period.get('firstyear'))
			, lastyear = Number(period.get('lastyear'))
			, firstmonth = Number(period.get('firstmonth'))
			, lastmonth = Number(period.get('lastmonth'))

			const issues= []
			for (let year = lastyear; year >= firstyear; -- year) {
				if (firstyear === 0)
					break
				for (let month = (year === lastyear ? lastmonth : 12); month >= (year === firstyear ? firstmonth : 1); --month)
					issues.push(`${year}年第${month < 10 ? '0' + month : month}期`)
			}

			return state.set('period', period).set('defaultIssuedate', defaultIssuedate).set('issues', fromJS(issues))
		},
		[ActionTypes.AFTER_GET_ASS_FETCH]			: () => {
			// 将获取到的asscategory赋给数组
			let _tags = action.receivedData.map(v => v.asscategory)
			// 过滤掉一定要有的五个类别
			allState.get('assTags').forEach(v => {
				_tags = _tags.filter(u => u != v)
			})
			// 连接一定要有的5个类别和新增的类别
			const tags = allState.get('assTags').concat(_tags)

			return state.set('allasscategorylist', fromJS(action.receivedData)).set('assTags', tags)
		},
		// 编辑修改辅助核算
		[ActionTypes.MODIFY_ASS_ITEM_FETCH]  		: () => {

			if (!showMessage(action.receivedData))
				return state
			const oldassid = action.ass.get('oldassid')
			return state.update('allasscategorylist', w => w.map(v =>
				v.get('asscategory') == action.ass.get('asscategory') ? v.update('asslist', u => u.map(ass =>
					ass.get('assid') == oldassid ? ass.merge(action.ass) : ass)) : v
			))
		},
		// 新增辅助核算
		[ActionTypes.INSERT_ASS_ITEM_FETCH]			: () => {
			// 获取新的asscategory
			const asscategory = action.ass.get('asscategory')

			if (!showMessage(action.receivedData))
				return state

			// 如果asscategory已经存在，allasscategorylist不变
			if (state.get('assTags').some(v => v === asscategory)) {
				if (state.get('allasscategorylist').some(v => v.get('asscategory') == asscategory)) {
					return state.update('allasscategorylist', w => w.map(v => v.get('asscategory') == asscategory ? v.update('asslist', w => w.push(action.ass)) : v))
				} else {
					return state.update('allasscategorylist', v => v.push(fromJS({
						asscategory,
						aclist: [],
						asslist: [action.ass]
					})))
				}
			} else {
				// 如果asscategory不存在，在asslist最后push进新加的asscategory列，并重排展示用的asstTags
				return state.update('allasscategorylist', v => v.push(fromJS({
					asscategory,
					aclist: [],
					asslist: [action.ass]
				}))).update('assTags', v => v.push(asscategory))
			}
		},
		[ActionTypes.SHOW_PZ_BOMB]        		     :  () => {
			if(action.value){
				state=state.set('pzBombFrom',action.fromOther)
			}

			state = state.set('pzBombCallback', action.callback ? action.callback : null)

			return state=state.set('showPzBomb', action.value)
		},

		[ActionTypes.BEFORE_INSERT_GET_MODEL_FCLIST]    : () => state.set('currencyModelList', fromJS(action.receivedData)),
		[ActionTypes.CHANGE_SYSTEM_INFO]            : () => state.set('systemInfo', fromJS(action.receivedData))
																.set('currencyModelList', action.currencyModelList ? fromJS(action.currencyModelList) : fromJS([])),
		[ActionTypes.CHANGE_SYSTEM_UNIT_DECIMAL_COUNT]   : () => state.setIn(['systemInfo', 'unitDecimalCount'], action.value),

		// 流水部分
		[ActionTypes.GET_RUNNING_SETTING_INFO]      : () => {
			const sfglCategory = action.receivedData.hideCategoryList.filter(v => v.categoryType === 'LB_SFGL')
			const noSfglCategoryList = action.receivedData.categoryList[0].childList
			const hasSfglCategory = noSfglCategoryList.concat(sfglCategory)

            return state = state.set('runningCategory', fromJS(action.receivedData.categoryList))
                                .set('accountList', fromJS(action.receivedData.accountList))
								// .setIn(['runningCategory',0, 'childList'], fromJS(hasSfglCategory))
								.setIn(['views', 'isCheckOut'], action.receivedData.isCheckOut)
                                .set('hideCategoryList', fromJS(action.receivedData.hideCategoryList))
                                .set('sfglCategory', fromJS(sfglCategory))
                                .set('taxRate', fromJS(action.receivedData.rate))
                                .set('accountPoundage', fromJS(action.receivedData.accountPoundage))
        },
		// 获取账户列表
		[ActionTypes.GET_RUNNING_ACCOUNT]           : () => {
			if (action.receivedData.isCheckOut !== undefined) {
				state = state.setIn(['views', 'isCheckOut'], action.receivedData.isCheckOut)
			}
            return state.set('accountList', fromJS(action.receivedData.resultList))
        },
		[ActionTypes.GET_COMMON_TAX_RATE]      : () => {
            return state = state.set('taxRate', fromJS(action.receivedData.result))
        },
		[ActionTypes.CHANGE_RATE_LIST]      : () => {
            return state = state.setIn(['taxRate','rateOptionList'], fromJS(action.receivedData.result.rateOptionList))
        },
		// 税率设置
        [ActionTypes.RUNNING_CONF_TAX_RATE_SETTING_SCALE]            : () => {
            return state.setIn(['taxRate', 'scale'], action.value)
        },
		[ActionTypes.SELECT_TAX_CONF_ALL_AC]             : () => {
            return state.setIn(['taxRate', action.place ? `${action.place}AcId` : 'acId'], action.acId)
                        .setIn(['taxRate', action.place ? `${action.place}AcFullName` : 'acFullName'], action.acFullName)
                        .setIn(['taxRate', action.place ? `${action.place}AssCategory` : 'assCategoryList'], action.asscategorylist)
        },
		[ActionTypes.CHANGE_TAX_CONF_COMMON_STRING]             : () => {
            return state.setIn( action.placeArr, action.value)

        },
		[ActionTypes.UPDATE_CONFIG_RUNNING_CATEGORY]  : () => {
            state = state.set('runningCategory', fromJS(action.receivedData.resultList))
            return state
        },
		[ActionTypes.GET_RUNNING_CONF_CATEGORY]                     : () => {
            return state.set('runningCategory', fromJS(action.receivedData.resultList))
                        .set('taxRate', fromJS(action.receivedData.rate))
        },
		[ActionTypes.CHANGE_CATEGORY_ORDER]                     : () => {
            return state.setIn(['runningCategory',0], fromJS(action.receivedData))
        },
		[ActionTypes.CHANGE_RUNNING_ITEM_DISABLE_STATUS]  : () => {
            let item = state.getIn(['runningCategory',0,...action.placeArr]).toJS()
            const loop = (list) => {
                for(let i in list) {
                    list[i].canUse = !action.disabled
                    list[i].childList.length && loop (list[i].childList)
                    list[i].disableList && list[i].disableList.length && loop (list[i].disableList)
                }
            }
            item.childList && item.childList.length && loop (item.childList)
            item.disableList && item.disableList.length && loop (item.disableList)

            return state.setIn(['runningCategory',0,...action.placeArr],fromJS(item))
                        .setIn(['runningCategory',0,...action.placeArr,'canUse'],!action.disabled)
        },
		[ActionTypes.GET_RUNNING_CONFIG_CATEGORY]                     : () => {
            return state.set('runningCategory', fromJS(action.receivedData.resultList))
                        .set('taxRate', fromJS(action.receivedData.rate))
        },
		[ActionTypes.CHANGE_MXB_RUNNING_PREVIEW_VISIBILITY]                          : () => {
            return state = state.setIn(['views', 'mxbRunningPreviewVisibility'], action.bool)
        },
		[ActionTypes.CHANGE_SEARCH_RUNNING_PREVIEW_VISIBILITY]                       : () => {
            return state = state.setIn(['views', 'searchRunningPreviewVisibility'], action.bool)
        },
		[ActionTypes.CHANGE_MXB_SERIAL_DRAWER_VISIBILITY]                       : () => {
            return state = state.setIn(['views', 'mxbSerialDrawerVisibility'], action.bool)
        },
		[ActionTypes.AFTER_GET_UPLOAD_SIGNATURE]                      : () => {
			if (!action.code) {
				return state = state.set('uploadKeyJson', fromJS(action.receivedData))
									.set('expire', parseInt(action.receivedData.expire))
			} else if (action.code === 40040) {
				return state = state.set('uploadKeyJson', fromJS({checkMoreFj: false}))
				 					.set('expire', 0)
			} else {
				return state
			}
        },

		[ActionTypes.HANDLD_PRINT_MODAL_VISIBLE]: () => state.set('showPrintModal',action.visible),

	}[action.type] || (() => state))()
}

// function reformAclistImmutable(aclist) {
// 	const reformedAclist = aclist.filter((v, i) => i === (aclist.size - 1) || v.get('acid').length >= aclist.getIn([i + 1, 'acid']).length)
// 	let tmp = aclist.get(0)
// 	let count = 0
// 	let pre = []
// 	return reformedAclist.map(v => {
// 		while (tmp.get('acid').length < v.get('acid').length) {
// 			pre[tmp.get('acid').length / 2 - 2] = tmp.get('acname')
// 			tmp = aclist.get(++count)
// 		}
// 		tmp = aclist.get(++count)
// 		let prestr = ''
// 		let i = 0
// 		while (i < v.get('acid').length / 2 - 2 ) {
// 			prestr += `${pre[i++]}_`
// 		}
// 		return v.update('acname', w => `${prestr}${w}`)
// 	})
// }
