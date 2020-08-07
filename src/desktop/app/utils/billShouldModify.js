export default function billShouldModify (type, list) {
    //type 单据的名称
    //list 关联单据列表
    let info = true //默认允许修改

    function shouldModify(category) {
        for (let i = 0, length = list.size; i < length; i++) {
            if (list.getIn([i,'relateCategory']) === category) {//有下级关联单据
                info = false
                break
            }
        }
    }

    // 采购订单->采购单->采购退单->出库单
    // 销售订单->销售单->销售退单->入库单
    ({
        'purchaseOrder': () => {
            shouldModify('PURCHASE_SHEET')
        },
        'purchaseSheet': () => {
            shouldModify('PURCHASE_CHARGEBACK')
        },
        'purchaseChargeback': () => {
            shouldModify('DELIVERY_SHEET')
        },
        'salesOrder': () => {
            shouldModify('SALES_SHEET')
        },
        'salesSheet': () => {
            shouldModify('SALES_CHARGEBACK')
        },
        'salesChargeback': () => {
            shouldModify('WAREHOUSE_ENTRY')
        }

    }[type])()

    return info
}
