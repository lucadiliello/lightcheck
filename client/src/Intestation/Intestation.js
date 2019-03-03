import React, { Component } from 'react';
import { Header, Segment, Icon } from 'semantic-ui-react';
import './Intestation.css';

class Intestation extends Component {

    render() {
        return (
            <Segment className='intestation'>
                <Header as='h2' color='orange' className='main-header'>
                    <Icon circular name='lightbulb outline'/>
                    <Header.Content>
                        Work Trip Manager
                        <Header.Subheader>version 1.0</Header.Subheader>
                    </Header.Content>
                </Header>
            </Segment>
        );
    }
}

export default Intestation;
