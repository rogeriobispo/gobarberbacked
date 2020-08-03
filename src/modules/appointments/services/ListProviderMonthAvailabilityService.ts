import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import { injectable, inject, container } from 'tsyringe'
import { getDaysInMonth, getDate } from 'date-fns'


interface IRequest {
  provider_id: string
  month: number
  year: number
}

type IResponse = Array<{
  day: number
  available: boolean
}>

@injectable()
class ListProviderMonthAvailabityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
    ){}

  public async execute({ provider_id, year, month }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
      provider_id,
      year,
      month
    })

    const numberOfDaysInMonth = getDaysInMonth(
      new Date(year, month - 1)
    )

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index)  => index + 1,
    )

      const avaliability = eachDayArray.map(day => {
        const appointmentsInDay = appointments.filter(appointment => {
          return getDate(appointment.schedule_date) === day
        })

        return {
          day,
          available: appointmentsInDay.length < 10
        }
      })
    return avaliability
  }
}

export default ListProviderMonthAvailabityService;
