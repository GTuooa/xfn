import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=Ylls!./lazy'

const Ylls = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default Ylls
