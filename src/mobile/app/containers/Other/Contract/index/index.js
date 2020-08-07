import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=Contract!./lazy'

const Contract = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default Contract
