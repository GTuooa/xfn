import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=ModifyAcUnit!./ModifyAcUnitLazy'

const ModifyAcUnit = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default ModifyAcUnit
