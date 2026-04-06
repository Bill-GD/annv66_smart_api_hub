import express from 'express';
import ResourceController from '../controllers/resource.controller';
import checkRecord from '../middlewares/check-record.middleware';
import filtering from '../middlewares/filtering.middleware';
import pagination from '../middlewares/pagination.middleware';
import sorting from '../middlewares/sorting.middleware';
import validateFields from '../middlewares/validate-fields.middleware';
import validateResource from '../middlewares/validate-resource.middleware';

const router = express.Router({ mergeParams: true });

router.use(validateResource);

router.get('/',
  validateFields,
  pagination,
  sorting,
  filtering,
  ResourceController.getAll,
);

router.get('/:id', validateFields, checkRecord, ResourceController.getOne);
router.post('/', ResourceController.postOne);
router.put('/:id', ResourceController.putOne);
router.patch('/:id', checkRecord, ResourceController.patchOne);
router.delete('/:id', checkRecord, ResourceController.deleteOne);

export default router;
