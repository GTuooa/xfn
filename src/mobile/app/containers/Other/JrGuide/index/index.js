import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=JrGuide!./lazy'

const JrGuide = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default JrGuide
