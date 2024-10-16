import { Router } from 'express';
import { DataController } from '../controllers/dataController';

const router = Router();
const dataController = new DataController();

router.get('/getData', async (req, res) => {
    try {
        const data = await dataController.getData(req.query.age as string, req.query.gender as string, req.query.startDate as string, req.query.endDate as string);
        res.json(data);
    } catch (error : any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
