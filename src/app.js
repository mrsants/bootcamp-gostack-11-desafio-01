const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryId = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryId === -1) {
    return response.status(400).json([
      {
        error: "Repository does not exists.",
      },
    ]);
  }

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: repositories[repositoryId].likes,
  };

  repositories[repositoryId] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryId = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryId >= 0) {
    repositories.splice(repositoryId, 1);
  } else {
    return response.status(400).json({
      error: "Repository does not exists",
    });
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(400).send();
  }

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
