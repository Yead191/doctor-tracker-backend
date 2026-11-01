import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { DoctorController } from './doctor.controller';
import { DoctorValidations } from './doctor.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router
  .route('/')
  .post(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      next();
    },
    validateRequest(DoctorValidations.createDoctorZodSchema),
    DoctorController.createDoctor
  )
  .get(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
    DoctorController.getAllDoctors
  );

router
  .route('/:id')
  .get(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
    DoctorController.getDoctorById
  )
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      next();
    },
    validateRequest(DoctorValidations.updateDoctorZodSchema),
    DoctorController.updateDoctor
  )
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    DoctorController.deleteDoctor
  );

// Corresponding patients under a specific doctor
router
  .route('/:id/patients')
  .get(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
    DoctorController.getDoctorPatients
  )
  .post(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      next();
    },
    DoctorController.addPatientToDoctor
  );

router
  .route('/:id/patients/:patientId')
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    DoctorController.removePatientFromDoctor
  );

export const DoctorRoutes = router;
