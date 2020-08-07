import React from 'react'
import Bundle from 'app/containers/Bundle'
import load from 'bundle-loader?lazy&name=Fjgl!./lazy'

const Fjgl = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>

export default Fjgl
