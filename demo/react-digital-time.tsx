import * as React from 'react'
import DigitalClock from '../src/react-digital-time'

export default class ReactDigitalTime extends React.Component {

  private clockRef = React.createRef<any>()

  componentDidMount(): void {
    console.log(this.clockRef.current.getFullTime())
  }

  render(): React.JSX.Element {
    return (
      <div>
        <DigitalClock width="220px" height="70px" ref={this.clockRef}></DigitalClock>
      </div>
    );
  }
}
