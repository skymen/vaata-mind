export interface ProjectItem {
  id: number;
  name: string;
  projectId: number;
}
export interface Task extends ProjectItem {
  description: string;
  status: string;
  tags: string[];
}

export interface Note extends ProjectItem {
  content: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
}
