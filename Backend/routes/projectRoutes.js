const express = require('express');
const projectController = require('../controllers/projectController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

router.get('/', projectController.getAllProjects);
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProject);
router.put('/:id', projectController.updateProject);
router.patch('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
module.exports = router;
