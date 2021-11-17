// import Dexie from 'dexie';
// import { Note, Project, Task } from './models/project';

// const settings = new Dexie('settings');

// export class VaataDb extends Dexie {
//   tasks!: Dexie.Table<Task, number>;

//   notes!: Dexie.Table<Note, number>;

//   projects!: Dexie.Table<Project, number>;

//   constructor() {
//     super('vaata');
//     this.version(1).stores({
//       tasks: '&id, name, description, status, tags, &project',
//       notes: '&id, name, content, &project',
//       projects: '&id, name, description',
//     });

//     // @ts-ignore
//     this.tasks.mapToClass(Task);
//     // @ts-ignore
//     this.notes.mapToClass(Note);
//     // @ts-ignore
//     this.projects.mapToClass(Project);
//   }
// }

// const data = new VaataDb();

// export {
//   data,
//   settings,
// };

import { openDB, DBSchema } from 'idb';
import { IProject, Task } from './models/project';

interface VaataDb extends DBSchema {
  tasks: {
    key: string;
    value: Task;
  }

  projects: {
    key: string;
    value: IProject;
  }
}

type Settings = DBSchema

const dataDB = () => openDB<VaataDb>('vaata', 1, {
  upgrade(db) {
    db.createObjectStore('projects', {
      keyPath: 'id',
    });

    db.createObjectStore('tasks', {
      keyPath: 'id',
    });
  },
});

const settingsDB = () => openDB<Settings>('settings', 1, {
  upgrade(db) {
    //
  },
});

export {
  settingsDB,
  dataDB,
};
