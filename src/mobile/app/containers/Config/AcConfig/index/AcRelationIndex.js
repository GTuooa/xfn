import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=AcRelation!./AcRelationLazy'

const AcRelation = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default AcRelation
