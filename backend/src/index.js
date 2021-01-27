const { request, response } = require('express');
const express = require('express');
const cors = require('cors');
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

/**
 * Métodos HTTP:
 * 
 * GET: buscar informações do back-end
 * POST: criar uma informação do back-end
 * PUT: alterar uma informação no back-end
 * DELETE: deletar uma informação no back-end
 */

/**
 * Tipos de parâmetros:
 * 
 * Query Params: filtros e paginação / GET
 * Route Params: identificar recursos (atualizar/deletar) / PUT/DELETE
 * Request Body: conteúdo na hora de criar ou editar um recurso (JSON)
 */

/**
 * Middleware:
 * 
 * Interceptador de requisições que interromper totalmente a requisição ou alterar dados da requisição.
 */

const projects = [];

function logRequests(request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    return next(); // Próximo middleware
}

function validateProjectId(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({ error: "Invalid project ID."});
    }

    return next();
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
    const { title } = request.query;

    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects;

    return response.json(results);
});

app.post('/projects', (request, response) => {
    const { title, owner } = request.body;

    const project = { id: uuid(), title, owner };

    projects.push(project);

    return response.json(project);
});

app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.' })
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.' })
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});



app.listen(3333, () => {
    console.log('Back-end started!🚀')
});