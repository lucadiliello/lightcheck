import React, { Component } from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import './Footer.css';

class Footer extends Component {

    render() {
        return (
            <Segment className='footer-props'>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column width="eight" className='column'>
                            <div>Work Trip Manager</div>
                            <p>Easily control and manage your city</p>
                        </Grid.Column>
                        <Grid.Column width="eight" className='column'>
                            <div>Created by Luca Di Liello</div>
                            <div>for the IoT course</div>
                            <div>at the University of Trento</div>
                            <div>2018/2019</div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>

        );
    }
}

export default Footer;
