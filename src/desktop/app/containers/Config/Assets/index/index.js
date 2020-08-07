import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=Assets!./lazy'

const Assets = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default Assets
