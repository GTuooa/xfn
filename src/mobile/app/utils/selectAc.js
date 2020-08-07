import { Map, List, fromJS } from 'immutable'
import thirdParty from 'app/thirdParty'

function valueToIdAndName(value) {
	let id = value.match(/^\d*/)
	let name = value.match(/_.*$/)
	return {
		name: name.toString().replace('_', ''),
		id: id.toString()
	}
}

const aclistselect = fromJS([{key: '资产', value: '资产'}, {key: '负债', value: '负债'},{key: '权益', value: '权益'}, {key: '成本', value: '成本'}, {key: '损益', value: '损益'}])

export default
function selectAc(cascadeDataAclist, aclist, callback, enterPage, searchNumberFetch, clearAcUnitOpen, lrpzAcunitCallback, searchCurrencyFetch, clearAcCurrency) {

	thirdParty.chosen({
        source : aclistselect,
        onSuccess: (result) => {
            const category = result.value || '资产'
            const firstaclist = cascadeDataAclist.filter(v => v.get('category') === category).map(v => ({key: v.get('title'), value: v.get('key')}))
			selectAction(firstaclist)
		},
		onFail: (err) => {}
	})

	let preAclist = cascadeDataAclist

	function selectAction (selectList) {
		thirdParty.chosen({
			source: selectList,
			onSuccess: (result) => {
				const selectacid = result.value
				const _nextSelectAclist = preAclist.find(v => v.get('key') === selectacid).get('children')
				preAclist = _nextSelectAclist

				if (_nextSelectAclist) {
					const nextSelectAclist = _nextSelectAclist.map(v => ({key: v.get('title'), value: v.get('key')}))
					selectAction(nextSelectAclist)
				} else {
					const ac = valueToIdAndName(result.key)
					const acitem = aclist.find(v => v.get('acid') == ac.id)
					const asscategorylist = acitem && acitem.get('asscategorylist')
					if (enterPage === 'lrpz') {
						lrpzAcunitCallback(acitem.get('acunitOpen'))
						if(acitem && acitem.get('acunitOpen') == '1' && !acitem.get('asscategorylist').size){
							searchNumberFetch(ac.id)	//获取数量一栏的数据
						} else {
							clearAcUnitOpen() //将 acunitOpen 设置为‘0’
						}
						if(acitem && acitem.get('fcStatus') == '1'){
							searchCurrencyFetch()	//获取外币
						} else {
							clearAcCurrency() 		//清除数据
						}
					}

					callback(ac.id, ac.name, acitem.get('acname'), asscategorylist)
				}
			},
			onFail: (err) => {}
		})
	}
}
