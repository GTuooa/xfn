import { toJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'


// 树形选择器可能可以用，暂时没有用
export default function upperClassToTree (list, flag) {

    const loop = data => data.map((v, i) => {

        if (v.get('childList').size) {

            return {
                key: v.get('uuid'),
				value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${ v.get('name')}`,
				label: v.get('name'),
                children: (loop(v.get('childList'))).toJS()
            }

        } else {
            return {
                key: v.get('uuid'),
				value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${ v.get('name')}`,
				label: v.get('name')
            }
        }
    })

    const returnData = loop(list)

	return returnData
}
