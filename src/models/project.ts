/* eslint-disable max-classes-per-file */

import { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints';

export type ID = string;

export type IElementType = 'tag' | 'task' | 'project' | 'category';

export interface IElement {
  id: ID;
  type: IElementType
  parent: ID;
  url: string;
}

export interface ITag extends IElement {
  name: string;
  color: string;
}

export interface ITask extends IElement {
  content: ListBlockChildrenResponse['results'] | null;
  // status: string;
  // tags: ID[];
  name: string;
  archived: boolean;
}

export class Task implements ITask {
  id: ID;

  name: string;

  content: ListBlockChildrenResponse['results'] | null = null;

  // status: string;

  // tags: string[];

  type: IElementType = 'task';

  archived: boolean;

  properties: any;

  parent: string;

  url: string

  constructor(task: Omit<Task, 'type'>) {
    this.id = task.id;
    this.name = task.name;
    this.parent = task.parent;
    this.content = task.content;
    // this.status = task.status;
    // this.tags = task.tags;
    this.archived = task.archived;
    this.properties = task.properties;
    this.url = task.url;
  }
}

export interface IProject extends IElement {
  name: string;
  properties: any;
}

export class Project implements IProject {
  id: string;

  name: string;

  parent: string;

  properties: any;

  type: IElementType = 'project';

  url: string

  constructor(project: Omit<IProject, 'type'>) {
    this.id = project.id;
    this.name = project.name;
    this.parent = project.parent;
    this.properties = project.properties;
    this.url = project.url;
  }
}

export interface ICategory extends IElement{
  cover: string;
  archived: boolean;
  text: string;
}

export class Category implements ICategory {
  id: string;

  cover: string;

  archived: boolean;

  text: string;

  type: IElementType = 'category';

  parent = '';

  url: string

  constructor(category: Omit<ICategory, 'type'>) {
    this.id = category.id;
    this.cover = category.cover;
    this.archived = category.archived;
    this.text = category.text;
    this.url = category.url;
  }
}

export type Elements = ITask | IProject | ICategory

export function isTask(element: Elements): element is ITask {
  return (element as ITask).type === 'task';
}

export function isProject(element: Elements): element is IProject {
  return (element as IProject).type === 'project';
}

export function isCategory(element: Elements): element is ICategory {
  return (element as ICategory).type === 'category';
}
