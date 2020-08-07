import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=Wlmxb!./lazy'

const Wlmxb = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default Wlmxb
