import React from 'react'
import {Grid} from 'material-ui'

class Event extends Component {

  const style = {
    Paper: {
      padding: 20, marginTop: 10, marginBottom:10
    }
  }
  render(){
    const {classes} = this.props
    return (
      <Grid container sm={6}>
        <Grid item sm={3}>
          <Paper styles = {style.paper}>
            Left pane
          </Paper>
        </Grid>
        <Grid item sm = {3}>
          <Paper styles = {style.paper}>
            Right pane
          </Paper>
        </Grid>
      </Grid>
    )
  }
}
