const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body
  const likes = 0
  const repository = {id: uuid(), title, url, techs, likes }
  repositories.push(repository)
  response.status(200).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params
  const {title, url, techs} = request.body
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0 ) {
    return response.status(400).json({error: "Repository not found"})
  }

  const actualRepository = repositories[repositoryIndex]
  const updatedRepository = {id, title, url, techs, likes: actualRepository.likes}
  repositories[repositoryIndex] = updatedRepository
  response.status(200).json(updatedRepository)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }
  repositories.splice(repositoryIndex, 1)
  return response.status(204).json({message: `Repository ${id} has been deleted`})
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }
  const actualRepository = repositories[repositoryIndex]
  const newLikes = actualRepository.likes + 1
  const updatedRepository = {id, title:actualRepository.title, url:actualRepository.url, techs:actualRepository.techs, likes:newLikes}
  repositories[repositoryIndex] = updatedRepository
  response.status(200).json({likes:newLikes})
});

module.exports = app;
