import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import router from './api';

const app = express();
const port = process.env.PORT || 3000;

// Set up Swagger options
const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'Course API',
			version: '1.0.0',
			description: 'API for creating and managing courses',
		},
		servers: [
			{
				url: `http://localhost:${port}/api`,
			},
		],
	},
	apis: ['./src/modules/**/*.router.ts'], // This will search for all .route.ts files in the project
};

// Generate Swagger spec
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware to parse JSON bodies
app.use(express.json());

// Use your course controller
app.use('/api', router);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
