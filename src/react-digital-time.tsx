import * as React from 'react'
import './index.css'
import Digit from './digit'
import * as dayjs from 'dayjs'

export interface DigitalClockProps extends React.ComponentProps<'div'> {
  readonly timezone?: string
  readonly isEastTime?: boolean
  readonly width: string
  readonly height: string
}

interface DigitalClockState {
  time: string
}

export default class DigitalClock extends React.PureComponent<DigitalClockProps, DigitalClockState> {
  static defaultProps = {
    className: '',
    isEastTime: false,
    width: '100px',
    height: '30px'
  }
  private dotStyle = { width: '2px', height: '2px' }
  private date = new Date()
  private timer = -1
  public getOriginal: () => Date = () => this.date
  public getFullTime: () => string = () => dayjs(this.date).format('YYYY') // 1970-01-01 00:00:00
  public getFullYear: () => number = () => Number(dayjs(this.date).format('YYYY')) // 1970
  public getMonth: () => number = () => Number(dayjs(this.date).format('MM'))
  public getDate: () => number = () => Number(dayjs(this.date).format('DD'))
  public getHours: () => number = () => Number(dayjs(this.date).format('HH'))
  public getMinutes: () => number = () => Number(dayjs(this.date).format('mm'))
  public getSeconds: () => number = () => Number(dayjs(this.date).format('ss'))
  public getTimestamp: () => number = () => Number(dayjs(this.date).valueOf()) // milliseconds
  public getUnix: () => number = () => Number(dayjs(this.date).unix())

  constructor(props) {
    super(props);
    this.state = {
      time: '00:00:00'
    }
  }

  format(date: Date): string {
    const time = {
      hour: `${date.getHours()}`?.padStart(2, '0'),
      minute: `${date.getMinutes()}`?.padStart(2, '0'),
      second: `${date.getSeconds()}`?.padStart(2, '0')
    }
    return [time.hour, time.minute, time.second].join(':')
  }

  renderClock(): void {
    try {
      const { isEastTime } = this.props
      if (window.document.visibilityState === 'hidden') return
      const getTime = (): void => {
        const date = isEastTime ? new Date(new Date().getTime() - (60 * 60 * 12 * 1e3)) : new Date()
        this.date = date
        this.setState({ time: this.format(date) })
      }
      getTime()
      this.timer && window.clearInterval(this.timer)
      this.timer = window.setInterval(getTime, 1e3)
    } catch (e) {
      //
    }
  }

  componentDidMount(): void {
    const { width } = this.props
    const widthValue = parseInt(width)
    const setStyle = (): void => {
      try {
        const el = window.document.querySelector('.digital-clock-two:first-child') as HTMLDivElement
        if (el) {
          el.style.marginRight = '0'
        }
      } catch (e) {
        console.log(e)
      }
    }

    this.renderClock()

    window.document.addEventListener('visibilitychange', this.renderClock)

    if (widthValue <= 80) {
      this.dotStyle = {width: '1px', height: '1px'}
      setStyle()
    } else if (widthValue <= 100) {
      this.dotStyle = { width: '2px', height: '2px' }
      setStyle()
    } else if (parseInt(width) <= 200) {
      this.dotStyle = { width: '4px', height: '4px' }
    } else {
      this.dotStyle = { width: '6px', height: '6px' }
    }

    this.getOriginal = () => this.date
    this.getFullTime = () => dayjs(this.date).format('YYYY-MM-DD HH:mm:ss')
    this.getFullYear = () => Number(dayjs(this.date).format('YYYY'))
    this.getMonth = () => Number(dayjs(this.date).format('MM'))
    this.getDate = () => Number(dayjs(this.date).format('DD'))
    this.getHours = () => Number(dayjs(this.date).format('HH'))
    this.getMinutes = () => Number(dayjs(this.date).format('mm'))
    this.getSeconds = () => Number(dayjs(this.date).format('ss'))
    this.getTimestamp = () => Number(dayjs(this.date).valueOf())
    this.getUnix = () => Number(dayjs(this.date).unix())
  }

  componentDidUpdate(): void {
    this.renderClock()
  }

  componentWillUnmount(): void {
    window.clearInterval(this.timer)
    window.document.removeEventListener('visibilitychange', this.renderClock)
  }

  render(): React.JSX.Element {
    const { width, height } = this.props
    return (
      <div
        className="digital-clock-wrap"
        style={{width: width, height: height}}
      >
        <div className="digital-clock-container">
          <div className="digital-clock-main">
            <Digit time={this.state.time} dotStyle={this.dotStyle} />
          </div>
        </div>
      </div>
    )
  }
}
