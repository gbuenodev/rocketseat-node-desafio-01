const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [{
	"id": "69d50ad9-7448-4270-a041-b2a0ebb9f472",
	"title": "projetin felas",
	"url": "www.projetancia.com",
	"techs": [
		"nodezada",
		"reactzada"
	],
	"likes": 0
}];

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!isUuid(id)) return res.status(400).json({ error: `Invalid project ID.` });
  return next();
};

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter(project => project.title.includes(title))
    : repositories;

  
  response.status(200).json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const project = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(project);

  return response.status(201).json(project);

});

app.put("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const projectIndex = repositories.findIndex(project => project.id === id);

  const project = repositories[projectIndex]

  if (projectIndex < 0) return response.status(404).json({ error: `Project not found` });

  const projectEdit = {
    id,
    title,
    url,
    techs,
    likes: project.likes,
  }

  repositories[projectIndex] = projectEdit;

  return response.status(200).json(projectEdit);
});

app.delete("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0) return response.status(404).json({ error: `Project not found` });

  repositories.splice(projectIndex, 1);

  return response.status(204).end();
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0) return response.status(404).json({ error: `Project not found` });

  repositories[projectIndex].likes += 1;

  const likes = repositories[projectIndex].likes;

  return response.status(200).json({likes})

});

module.exports = app;
