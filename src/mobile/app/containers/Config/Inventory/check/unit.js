//新增单位保存时的校验
import * as Limit from 'app/constants/Limit.js'

export function check (unit) {
    let errorList = []

    const name = unit['name']
    const unitList = unit['unitList'] ? unit['unitList'] : []
    const isStandard = unit['isStandard']//是否是标准单位

    if (name == '') {
        errorList.push('请填写名称')
    }
    if (name.length > Limit.AC_UNIT_LENGTH) {
        errorList.push(`名称长度不能超过${Limit.AC_UNIT_LENGTH}个字符`)
    }
    if (unit['basicUnitQuantity']==0) {
        errorList.push(`请填写填写数量关系`)
    }

    if (unit['unitList'].length) {
        let allBasicUnitUuid = []//用户选择的标准单位
        let dupBasicUnitUuid = []//allBasicUnitUuid中出现两次及以上的值
        unitList.forEach((v, i) => {
            const name = v['name']
            const basicUnitQuantity = v['basicUnitQuantity']
            if (name == '') {
                errorList.push(`多单位${i+1}未填写名称`)
            }
            if (name.length > Limit.ALL_NAME_LENGTH) {
                errorList.push(`多单位${i+1}名称长度不能超过${Limit.ALL_NAME_LENGTH}个字符`)
            }
            if (basicUnitQuantity <= 1) {
                errorList.push(`多单位${i+1}数量关系必须大于1`)
            }

            if (!isStandard && v['isStandard']) {//基本单位不是标准单位，且多单位是标准单位 需要校验多单位中同一物理量的数量关系
                const basicUnitUuid = v['basicUnitUuid']
                if (allBasicUnitUuid.includes(basicUnitUuid) && !dupBasicUnitUuid.includes(basicUnitUuid)) {
                    dupBasicUnitUuid.push(basicUnitUuid)
                }
                allBasicUnitUuid.push(v['basicUnitUuid'])
            }

        })

        if (errorList.length) {//先把名称数量关系的校验通过
            return errorList
        }

        //校验多单位中同一物理量的数量关系
        dupBasicUnitUuid.forEach((v, i) => {
            let arr = []
            unitList.forEach((w,j) => {
                if (w['basicUnitUuid'] == v) {
                    arr.push({
                        idx: j+1,
                        oriBasicUnitQuantity: Number(w['oriBasicUnitQuantity']),
                        basicUnitQuantity: Number(w['basicUnitQuantity']),
                    })
                }
            })

            //升序
            arr.sort((a,b) => Number(a['oriBasicUnitQuantity'])-Number(b['oriBasicUnitQuantity']))

            let minOriBasicUnitQuantity = arr[0]['oriBasicUnitQuantity'], minBasicUnitQuantity = arr[0]['basicUnitQuantity']
            let idx = arr[0]['idx']
            arr.shift()

            arr.forEach((item) => {
                let basicUnitQuantity = Number(item['oriBasicUnitQuantity'])/Number(minOriBasicUnitQuantity)
                if (Number(item['basicUnitQuantity']) != minBasicUnitQuantity*basicUnitQuantity) {
                    errorList.push(`多单位${idx}与多单位${item['idx']}数量关系错误`)
                }
            })

        })

    }



    return errorList

}
