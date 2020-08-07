import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=RelativeYeb!./lazy'

const RelativeYeb = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default RelativeYeb
