import express from 'express';
import ResourceController from '../controllers/resource.controller';
import checkFields from '../middlewares/check-fields.middleware';
import checkTable from '../middlewares/check-table.middleware';
import pagination from '../middlewares/pagination.middleware';
import sorting from '../middlewares/sorting.middleware';

const router = express.Router({ mergeParams: true });

router.use(checkTable);

router.get('/', checkFields, pagination, sorting, ResourceController.getAll);
router.get('/:id', checkFields, ResourceController.getOne);

router.post('/', ResourceController.postOne);

router.put('/:id', ResourceController.putOne);
router.patch('/:id', ResourceController.patchOne);
router.delete('/:id', ResourceController.deleteOne);

export default router;
