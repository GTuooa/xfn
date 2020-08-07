import React from 'react'
import { Container } from 'app/components'

import { Router, Route, } from 'react-router-dom'
import ProjectConfApp from './app'
import ProjectHighType from './ProjectHighType'
import ProjectType from './ProjectType'
import ProjectTypeInsert from './ProjectTypeInsert'
import ProjectCard from './ProjectCard'//卡片新增修改类别

export default
class ProjectConfIndex extends React.Component {

    render() {

        return(
            <Container className="project-config">
                <Route path="/config/project/index" component={ProjectConfApp} />
                <Route path="/config/project/projectHighType" component={ProjectHighType} />
                <Route path="/config/project/projectType" component={ProjectType} />
                <Route path="/config/project/projectTypeInsert" component={ProjectTypeInsert} />
                <Route path="/config/project/projectCard" component={ProjectCard} />
            </Container>
        )
    }
}
