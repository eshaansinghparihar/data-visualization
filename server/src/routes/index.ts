import { Router } from 'express';
import { DataController } from '../controllers/dataController';
import { Age } from '../types/age';
import { Gender } from '../types/gender';

const router = Router();
const dataController = new DataController();

router.get('/getData', async (req, res, next) => {
    try {
        const data = await dataController.getData(req.query.age as Age, req.query.gender as Gender, req.query.startDate as string, req.query.endDate as string);
        res.json(data);
    } catch (error) {
        next(error)
    }
});

export default router;
