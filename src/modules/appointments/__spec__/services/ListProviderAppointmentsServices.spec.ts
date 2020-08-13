import FakeAppointmentsRepository from '../fakes/FakeAppointmentsRepository'
import ListProviderAppointmentsService from '../../services/ListProviderAppointmentsServices'

let listProviderAppointmentsService: ListProviderAppointmentsService
let fakeAppointmentsRepository: FakeAppointmentsRepository

describe('ListProviderMonthAvailabityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository
      )
  })
  describe('#execute', () => {
    it('shoud be able to list appointments on a specific day', async () => {
      const appointment1 = await fakeAppointmentsRepository.create({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2020, 4, 20, 14, 0, 0)
      })

      const appointment2 = await fakeAppointmentsRepository.create({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2020, 4, 20, 15, 0, 0)
      })


      const appointments = await listProviderAppointmentsService.execute({
        provider_id: 'provider',
        year: 2020,
        month: 5,
        day: 20
      })

      expect(appointments).toEqual(expect.arrayContaining([appointment1, appointment2]))
    })
  })
})
