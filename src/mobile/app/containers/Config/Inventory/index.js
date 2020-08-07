import React from 'react'
import { toJS, Map, fromJS } from 'immutable'
import { Container } from 'app/components'

import { Router, Route, Switch } from 'react-router-dom'
import InventoryConfApp from './app.js'
import InventoryInsert from './InventoryInsert'
import InventoryHighType from './InventoryHighType'
import InventoryType from './InventoryType'
import InventoryTypeInsert from './InventoryTypeInsert'
import InventoryOpened from './Open/InventoryOpened'//期初数量 余额
import QuantityOnly from './Open/QuantityOnly.jsx'//期初数量 余额 仅开启数量
import InventoryUnit from './InventoryUnit'//新增计量单位
import InventoryUnitModify from './InventoryUnitModify'//修改计量单位
import InventoryAssembly from './InventoryAssembly'//组装单设置
import InventoryAssist from './Assist/Assist.jsx'//所有的辅助属性
import AssistClass from './Assist/AssistClass.jsx'//辅助分类
import InventoryBatch from './Batch/Batch.jsx'//批次管理
import InventoryBatchSet from './Batch/BatchSet.jsx'//新增修改批次
import InventoryBatchList from './Batch/BatchList.jsx'//批次列表管理
import InventoryQuantity from './Quantity/QuantitySet.jsx'//数量管理设置
import InventorySerial from './Serial/Serial.jsx'//录入序列号
import InventorySerialBatch from './Serial/SerialBatch.jsx'//批量添加序列号

export default
class InventoryConfIndex extends React.Component {

    render() {

        return(
            <Container className="inventory-config">
                <Route path="/config/inventory/index" component={InventoryConfApp} />
                <Route path="/config/inventory/inventoryInsert" component={InventoryInsert} />
                <Route path="/config/inventory/inventoryHighType" component={InventoryHighType} />
                <Route path="/config/inventory/inventoryType" component={InventoryType} />
                <Route path="/config/inventory/inventoryTypeInsert" component={InventoryTypeInsert} />
                <Route path="/config/inventory/inventoryOpened" component={InventoryOpened} />
                <Route path="/config/inventory/quantityOnly" component={QuantityOnly} />
                <Route path="/config/inventory/unit" component={InventoryUnit} />
                <Route path="/config/inventory/unitModify" component={InventoryUnitModify} />
                <Route path="/config/inventory/assembly" component={InventoryAssembly} />
                <Route path="/config/inventory/assist" component={InventoryAssist} />
                <Route path="/config/inventory/assistClass" component={AssistClass} />
                <Route path="/config/inventory/batch" component={InventoryBatch} />
                <Route path="/config/inventory/batchSet" component={InventoryBatchSet} />
                <Route path="/config/inventory/batchList" component={InventoryBatchList} />
                <Route path="/config/inventory/quantity" component={InventoryQuantity} />
                <Route path="/config/inventory/serial" component={InventorySerial} />
                <Route path="/config/inventory/serialBatch" component={InventorySerialBatch} />
            </Container>
        )
    }
}
