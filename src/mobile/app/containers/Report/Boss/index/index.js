import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=Boss!./lazy'

const Boss = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default Boss
