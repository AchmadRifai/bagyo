import React, { Component } from 'react';
import logo from './logo.svg';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import axios from 'axios'

class LoginLayout extends Component {
  constructor(props) {
    super(props)
    this.state={error:'',user:this.props.sesi.user,notifEror:false,notifWarn:false,pass:this.props.sesi.pass}
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  loginGo=()=>{
    const {user,pass}=this.state.sesi
    axios.post('http://localhost:2103/login',{akun:user,pass:pass}).then((res)=>{
      const data=res.data
      if(data.kode===1)this.setState({notifEror:true,error:data.pesan,notifWarn:false})
      else if (data.kode===2)this.setState({notifEror:false,error:data.pesan,notifWarn:true})
      else {
        this.props.sesi.pass=''
        this.props.sesi.oleh=true
      }
    })
  }

  render(){
    const notifEror=this.state.notifEror
    const notifWarn=this.state.notifWarn
    const error=this.state.error
    const user=this.state.user
    const pass=this.state.pass
    let pesan=null
    if(error){
      if(notifEror)pesan=(<Message negative>{error}</Message>)
      else pesan=(<p></p>)
      if(notifWarn)pesan=(<Message warning>{error}</Message>)
      else pesan=(<p></p>)
    }else pesan=(<p></p>)
    return (
      <div className='login-form'>
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
          height: 100%;
          }
        `}</style>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
              {' '}Log-in to Panel Access
            </Header>
            <Form size='large' onSubmit={this.loginGo}>
              <Segment stacked>
                <Form.Input fluid icon='user' iconPosition='left' type='text' defaultValue={user} onChange={this.handleChange}/>
                <Form.Input fluid icon='lock' iconPosition='left' type='password' defaultValue={pass} onChange={this.handleChange}/>
                <Form.Button color='teal' fluid size='large'>Login</Form.Button>
              </Segment>
            </Form>
          </Grid.Column>
          {pesan}
        </Grid>
      </div>
    )
  }
}

export default LoginLayout
