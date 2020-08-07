

export default function getBillType (type) {

    const billType = ({
        '': () => '全部',
        'CG': () => '普通采购',
        'CGT': () => '销售退货',
        'XS': () => '普通销售',
        'XST': () => '销售退货',
        'QTCK': () => '其他出库',
        'QTRK': () => '其他入库',
        'PY': () => '盘盈入库',
        'PK': () => '盘亏出库',
        'DBRK': () => '调拨入库',
        'DBCK': () => '调拨出库',
        'CBTZ': () => '成本调整'
    }[type] || (() => '未匹配'))()

    return billType
}
