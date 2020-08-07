import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=AssYeb!./lazy'

const AssYeb = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default AssYeb
