import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=Page10006!./lazy'

const Page10006 = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default Page10006
