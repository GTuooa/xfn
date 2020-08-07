import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=GlGuide!./lazy'

const GlGuide = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default GlGuide
