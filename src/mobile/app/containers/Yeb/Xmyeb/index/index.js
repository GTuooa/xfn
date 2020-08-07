import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=Xmyeb!./lazy'

const Xmyeb = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default Xmyeb
