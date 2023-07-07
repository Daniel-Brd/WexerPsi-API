import { Request, Response } from "express";
import { PatientService } from "../services/patientService";
import { makeCreatePatientSchema } from "../schemas/patientSchema";

export class PatientController {
  constructor(private service: PatientService) {}

  async create(req: Request, res: Response) {
    const {
      params: { id: userId },
      body,
    } = req;

    try {
      await makeCreatePatientSchema().validate(body);
    } catch (err: any) {
      return res.status(400).json({ error: err.errors });
    }

    const result = (await this.service.create({ body, userId })) as any;

    if ("error" in result) {
      return res.status(result.status).json(result);
    }

    return res.status(200).json(result);
  }
}
