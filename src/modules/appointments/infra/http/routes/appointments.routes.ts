import { Router } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe'
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';


const appointmentsRouter = Router();


// appointmentsRouter.get('/', async (req, res) => {
//   const appointments = await appointmentRepository.find();
//   res.json(appointments);
// });

appointmentsRouter.post('/', async (req, res) => {
  const { provider_id, date } = req.body;
  const parsedDate = parseISO(date);
  const createAppointment = container.resolve(CreateAppointmentService);

  const appointment = await createAppointment.execute({
    provider_id,
    schedule_date: parsedDate,
  });

  return res.json(appointment);
});

export default appointmentsRouter;
