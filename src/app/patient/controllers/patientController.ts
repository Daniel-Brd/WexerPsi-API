import { Request, Response } from "express";
import { PatientService } from "../services/patientService";
import { makeCreatePatientSchema } from "../schemas/createPatientSchema";
import { makeUpdatePatientSchema } from "../schemas/updatePatientSchema";

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

  async getPatientByUser(req: Request, res: Response) {
    const {
      params: { id: userId },
    } = req;

    const result = await this.service.getPatientByUser(userId);

    if ("error" in result) {
      return res.status(result.status).json(result);
    }

    return res.status(200).json(result);
  }

  async getPatientById(req: Request, res: Response) {
    const {
      params: { id },
    } = req;

    const result = (await this.service.getPatientById(id)) as any;

    if ("error" in result) {
      return res.status(result.status).json(result);
    }

    return res.status(200).json(result);
  }

  async updatePatient(req: Request, res: Response) {
    const {
      params: { id },
      body,
    } = req;

    try {
      await makeUpdatePatientSchema().validate(body);
    } catch (err: any) {
      return res.status(400).json({ error: err.errors });
    }

    const result = (await this.service.updatePatient(id, body)) as any;

    if ("error" in result) {
      return res.status(result.status).json(result);
    }

    return res.status(200).json(result);
  }

  async getAllPatientTimelines(req: Request, res: Response) {
    const {
      params: { id },
    } = req;

    const result = (await this.service.getAllPatientTimelines(id)) as any;

    if ("error" in result) {
      return res.status(result.status).json(result);
    }

    res.status(200).json(result);
  }
}
