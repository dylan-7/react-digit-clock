import * as React from 'react'
import './index.css'
import DigitDate from "./digitDate";
import DigitTime from './digitTime'

export interface DigitalClockProps extends React.ComponentProps<'div'> {
  readonly timezone?: string
  readonly isEastTime?: boolean
  readonly width: string
  readonly height: string
}

interface DigitalClockState {
  date: string
  time: string
}

export interface DigitalTimeType {
  getOriginal: () => Date
  getFullTime: () => string
  getFullYear: () => number
  getMonth: () => number
  getDate: () => number
  getHours: () => number
  getMinutes: () => number
  getSecond: () => number
  getTimestamp: () => number
  getUnix: () => number
}

export default class DigitalClock extends React.PureComponent<DigitalClockProps, DigitalClockState> {
  static defaultProps = {
    className: '',
    isEastTime: false,
    width: '100px',
    height: '30px'
  }
  state = {
    date: '0000-00-00',
    time: '00:00:00'
  }

  private barStyle: {[prop: string]: string} = { width: '2px', borderTopWidth: '1px' }
  private dotStyle = { width: '2px', height: '2px' }
  private date = this.props.isEastTime ? new Date(new Date().getTime() - 60 * 60 * 60 * 12 * 1000) : new Date()
  private timer = -1
  public getOriginal: () => Date = () => this.date
  public getFullTime: () => string = () => { // 1970-01-01 00:00:00
    const year: number = this.date.getFullYear()
    const month: string = `${this.date.getMonth() + 1}`?.padStart(2, '0')
    const date: string = `${this.date.getDate()}`?.padStart(2, '0')
    const hours: string = `${this.date.getHours()}`?.padStart(2, '0')
    const minutes: string = `${this.date.getMinutes()}`?.padStart(2, '0')
    const seconds: string = `${this.date.getSeconds()}`?.padStart(2, '0')
    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
  }
  public getFullYear: () => number = () => this.date.getFullYear() // 1970
  public getMonth: () => number = () => this.date.getMonth() + 1
  public getDate: () => number = () => this.date.getDate()
  public getHours: () => number = () => this.date.getHours()
  public getMinutes: () => number = () => this.date.getMinutes()
  public getSeconds: () => number = () => this.date.getSeconds()
  public getTimestamp: () => number = () => this.date.valueOf() // milliseconds
  public getUnix: () => number = () => this.date.valueOf() / 1e3

  constructor(props: DigitalClockProps) {
    super(props)
    this.state = {
      date: '0000-00-00',
      time: '00:00:00'
    }
  }

  private format: (dateTime: Date) => { date: string, time: string } = (dateTime) => {
    const year: number = dateTime.getFullYear()
    const month: string = `${dateTime.getMonth() + 1}`?.padStart(2, '0')
    const date: string = `${dateTime.getDate()}`?.padStart(2, '0')
    const time = {
      hour: `${dateTime.getHours()}`?.padStart(2, '0'),
      minute: `${dateTime.getMinutes()}`?.padStart(2, '0'),
      second: `${dateTime.getSeconds()}`?.padStart(2, '0')
    }
    return {
      date: `${year}-${month}-${date}`,
      time: [time.hour, time.minute, time.second].join(':')
    }
  }

  private renderClock: () => void = () => {
    if (window.document.visibilityState === 'hidden') return
    const { isEastTime = false } = this.props
    const getTime = (): void => {
      const date = isEastTime ? new Date(new Date().getTime() - (60 * 60 * 12 * 1e3)) : new Date()
      this.date = date
      const dateValue = this.format(date)
      this.setState({ date: dateValue.date, time: dateValue.time })
    }
    getTime()
    this.timer && window.clearInterval(this.timer)
    this.timer = window.setInterval(getTime, 1e3)
  }

  componentDidMount(): void {
    const { width } = this.props
    const widthValue = parseInt(width)
    this.renderClock()

    window.document.addEventListener('visibilitychange', this.renderClock)

    if (widthValue <= 100) {
      this.barStyle = { width: '2px', borderTopWidth: '1px' }
      this.dotStyle = {width: '1px', height: '1px'}
    } else if (widthValue <= 220) {
      this.barStyle = { width: '3px', borderTopWidth: '1px' }
      this.dotStyle = { width: '1px', height: '1px' }
    } else if (widthValue <= 300) {
      this.barStyle = { width: '6px', borderTopWidth: '1.5px' }
      this.dotStyle = { width: '2px', height: '2px' }
    } else if (widthValue <= 400) {
      this.barStyle = { width: '8px', borderTopWidth: '2px' }
      this.dotStyle = { width: '3px', height: '3px' }
    } else if (widthValue <= 500) {
      this.barStyle = { width: '12px', borderTopWidth: '4px' }
      this.dotStyle = { width: '5px', height: '5px' }
    } else {
      this.barStyle = { width: '17px', borderTopWidth: '6px' }
      this.dotStyle = { width: '7px', height: '7px' }
    }
  }

  componentDidUpdate(): void {
    this.renderClock()
  }

  componentWillUnmount(): void {
    window.clearInterval(this.timer)
    window.document.removeEventListener('visibilitychange', this.renderClock)
  }

  render(): React.JSX.Element {
    const { width, height, className } = this.props
    return (
      <div
        className={`digital-clock-wrap ${className}`}
        style={{width: width, height: height}}
      >
        <div className="digital-clock-container">
          <div className="digital-clock-main">
            <DigitDate date={this.state.date} barStyle={this.barStyle} />
            <DigitTime time={this.state.time} dotStyle={this.dotStyle} />
          </div>
        </div>
      </div>
    )
  }
}
