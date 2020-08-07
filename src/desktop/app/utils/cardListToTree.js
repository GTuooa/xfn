import { toJS } from 'immutable'
import * as Limit from 'app/constants/Limit.js'


export default function cardListToTree (list, flag) {

    const loop = data => data.map((v, i) => {

        if (v.childList.length) {

            return {
                key: `${v.uuid}`,
				value: `${v.uuid}${Limit.CATEGORY_CARD_JOIN_STR}${v.name}`,
				label: v.name,
                children: loop(v.childList)
            }

        } else {
            return {
                key: `${v.uuid}`,
				value: `${v.uuid}${Limit.CATEGORY_CARD_JOIN_STR}${v.name}`,
				label: v.name
            }
        }
    })

    const returnData = loop(list)

	return returnData
}
