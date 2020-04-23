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
  const { url, title, techs } = request.body;

  const repository = {
    id: uuid(),
    url,
    title,
    techs, 
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const { url, title, techs, likes } = request.body;

  let repository = repositories.find(r => r.id === id);

  if(!repository) {
    return response.status(400).json({error: 'Repository not found'});
  }

  if(likes && likes > 0) {
    return response.json(repository);
  }

  repository = {
    id: repository.id,
    url,
    title,
    techs,
    likes: repository.likes
  }

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repository_index = repositories.findIndex(r => r.id === id)

  if(repository_index < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  repositories.splice(repository_index, 1);

  return response.status(204).json();

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const repository = repositories.find(r => r.id === id)

  if(!repository) {
    return response.status(400).json({error: 'Repository not found'})
  }

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
