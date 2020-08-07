import React from 'react';
import Bundle from 'app/containers/Bundle';
import load from 'bundle-loader?lazy&name=Page1006!./lazy';

const Page1006 = (props) => <Bundle load={load}>{(View) => <View {...props}/>}</Bundle>;

export default Page1006
