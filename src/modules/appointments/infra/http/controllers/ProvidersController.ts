import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProvidersService from '@modules/appointments/services/ListProviderService';
import { classToClass } from 'class-transformer';

class ProvidersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const listProviders = container.resolve(ListProvidersService);

    const providers = await listProviders.execute({
      user_id,
    });

    return res.json(classToClass(providers));
  }
}

export default new ProvidersController();
