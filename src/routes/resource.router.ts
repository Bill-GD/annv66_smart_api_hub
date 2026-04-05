import express from 'express';
import ResourceController from '../controllers/resource.controller';
import checkFields from '../middlewares/check-fields.middleware';
import checkRecord from '../middlewares/check-record.middleware';
import checkTable from '../middlewares/check-table.middleware';
import pagination from '../middlewares/pagination.middleware';
import sorting from '../middlewares/sorting.middleware';

const router = express.Router({ mergeParams: true });

router.use(checkTable);

router.get('/', checkFields, pagination, sorting, ResourceController.getAll);
router.get('/:id', checkFields, checkRecord, ResourceController.getOne);

router.post('/', ResourceController.postOne);

router.put('/:id', ResourceController.putOne);
router.patch('/:id', checkRecord, ResourceController.patchOne);
router.delete('/:id', checkRecord, ResourceController.deleteOne);

export default router;
