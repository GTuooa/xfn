import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=InventoryMxb!./lazy'

const InventoryMxb = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default InventoryMxb
