import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=Inventory!./InventoryLazy'

const InventoryIndex = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default InventoryIndex
