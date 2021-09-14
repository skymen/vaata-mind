/* eslint-disable max-classes-per-file */
import { nanoid } from 'nanoid';

export type ID = string;

export interface Tag {
  id: ID;
  name: string;
  color: string;
}

export interface ProjectItem {
  id: ID;
  name: string;
  project: string;
}
export interface Task extends ProjectItem {
  description: string;
  status: string;
  tags: ID[];
}

export class Task implements Task {
  id: ID;

  name: string;

  project: string;

  description: string;

  status: string;

  tags: string[];

  constructor(task: Task) {
    this.id = nanoid();
    this.name = task.name;
    this.project = task.project;
    this.description = task.description;
    this.status = task.status;
    this.tags = task.tags;
  }
}

export interface Note extends ProjectItem {
  content: string;
}

export class Note implements Note {

}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export class Project implements Project {

}
