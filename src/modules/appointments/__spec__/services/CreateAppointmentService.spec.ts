import FakeAppointmentRepository from '../fakes/FakeAppointmentsRepository'
import CreateAppointmentService from '../../services/CreateAppointmentService'
import AppError from '@shared/errors/AppError'

let fakeAppointmentRepository: FakeAppointmentRepository
let createAppointment: CreateAppointmentService

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository()
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository)

  })

  describe('#execute', () => {
    it('should be able to create a new user',async () => {

      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2020, 4, 10, 12).getTime()
      })

      const appointment = await createAppointment.execute({
        schedule_date: new Date(2020, 4, 10, 13),
        provider_id: 'provider_id',
        user_id: 'user_id'
      })

      expect(appointment).toHaveProperty('id')
      expect(appointment.provider_id).toBe('provider_id')
    })

    it('should not be able to create two appointment on same time', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2020, 4, 10, 10).getTime()
      })

      const appointmentDate = new Date(2020, 4, 10 , 11)
      const appointment = await createAppointment.execute({
        schedule_date: appointmentDate,
        provider_id: 'provider_id',
        user_id: 'user_id'
      })

      await expect(createAppointment.execute({
        schedule_date: appointmentDate,
        provider_id: 'provider_id',
        user_id: 'user_id'
      })).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to create an appointment on a past date', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2020, 4, 10, 12).getTime()
      })

      await expect(createAppointment.execute({
        schedule_date: new Date(2020, 4, 10, 11),
        provider_id: 'provider_id',
        user_id: 'user_id'
      })).rejects.toBeInstanceOf(AppError)

    })

    it('should not be able to create an appointment with same user as provider', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2020, 4, 10, 10).getTime()
      })

      await expect(createAppointment.execute({
        schedule_date: new Date(2020, 4, 10, 11),
        provider_id: 'user_id',
        user_id: 'user_id'
      })).rejects.toBeInstanceOf(AppError)

    })


    it('should not be able to create an appointment before 08 Am', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2020, 4, 10, 10).getTime()
      })

      await expect(createAppointment.execute({
        schedule_date: new Date(2020, 4, 11, 7),
        provider_id: 'provider_id',
        user_id: 'user_id'
      })).rejects.toBeInstanceOf(AppError)

    })

    it('should not be able to create an appointment after 18 Am', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2020, 4, 10, 10).getTime()
      })

      await expect(createAppointment.execute({
        schedule_date: new Date(2020, 4, 10, 18),
        provider_id: 'provider_id',
        user_id: 'user_id'
      })).rejects.toBeInstanceOf(AppError)

    })
  })
})
