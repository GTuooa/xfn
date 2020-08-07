
function perPlaceholder (leve) {
    const placeholder = ({
        1: () => '',
        2: () => '- ',
        3: () => '- - ',
        4: () => '- - - '
    }[leve])()

    return placeholder
}

// ActionTypes用
function capital (currentPage) {
    const capitalStr = ({


        'inventoryClass': () => 'INVENTORY',
        'inventoryCard': () => 'INVENTORY',
        'storageClass': () => 'INVENTORY',
        'storageCard': () => 'INVENTORY',

        'purchasingClass': () => 'PURCHASING',
        'purchasingCard': () => 'PURCHASING',
        'supplierClass': () => 'PURCHASING',
        'supplierCard': () => 'PURCHASING',

        'salesClass': () => 'SALES',
        'salesCard': () => 'SALES',
        'customerClass': () => 'SALES',
        'customerCard': () => 'SALES'

    }[currentPage])()

    return capitalStr
}


// url拼接用
function camelCase (currentPage) {
    const capitalStr = ({
        // 'warehouse': () => 'Warehouse',
        // 'inventory': () => 'Inventory',
        // 'purchasing': () => 'Purchasing',


        'inventoryClass': () => 'Inventory',
        'inventoryCard': () => 'Inventory',
        'storageClass': () => 'Storage',
        'storageCard': () => 'Storage',

        'purchasingClass': () => 'Purchasing',
        'purchasingCard': () => 'Purchasing',
        'supplierClass': () => 'Supplier',
        'supplierCard': () => 'Supplier',

        'salesClass': () => 'Sales',
        'salesCard': () => 'Sales',
        'customerClass': () => 'Customer',
        'customerCard': () => 'Customer',

        //查询单据
        'purchaseOrder': () => 'PurchaseOrder',
        'purchaseSheet': () => 'PurchaseSheet',
        'purchaseChargeback': () => 'PurchaseChargeback',

        'salesOrder': () => 'SalesOrder',
        'salesSheet': () => 'SalesSheet',
        'salesChargeback': () => 'SalesChargeback'


    }[currentPage])()

    return capitalStr
}

// state拼接用
function stateName (currentPage) {
    const stateNameStr = ({
        'inventoryClass': () => 'inventory',
        'inventoryCard': () => 'inventory',
        'storageClass': () => 'inventory',
        'storageCard': () => 'inventory',

        'purchasingClass': () => 'purchasing',
        'purchasingCard': () => 'purchasing',
        'supplierClass': () => 'purchasing',
        'supplierCard': () => 'purchasing',

        'salesClass': () => 'sales',
        'salesCard': () => 'sales',
        'customerClass': () => 'sales',
        'customerCard': () => 'sales'

    }[currentPage])()

    return stateNameStr
}

// card和calss归哪一类， 如存货类
function currentPageCategory (currentPage) {
    const categoryNameStr = ({
        'inventoryClass': () => 'inventory',
        'inventoryCard': () => 'inventory',
        'storageClass': () => 'storage',
        'storageCard': () => 'storage',

        'purchasingClass': () => 'purchasing',
        'purchasingCard': () => 'purchasing',
        'supplierClass': () => 'supplier',
        'supplierCard': () => 'supplier',

        'salesClass': () => 'sales',
        'salesCard': () => 'sales',
        'customerClass': () => 'customer',
        'customerCard': () => 'customer'

    }[currentPage])()

    return categoryNameStr
}

let jxcConfigCheck = {};
jxcConfigCheck.perPlaceholder = perPlaceholder;
jxcConfigCheck.capital = capital;

export default jxcConfigCheck;