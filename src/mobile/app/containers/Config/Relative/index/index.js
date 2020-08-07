import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=relativeConf!./lazy'

const relativeConf = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default relativeConf
