import { GetPageResponse, ListBlockChildrenResponse, SearchResponse } from '@notionhq/client/build/src/api-endpoints';
import { Task } from '@/models/project';

// eslint-disable-next-line import/prefer-default-export
export const getTasks = async () => {
  const tasks = (await ((await fetch('/api/getPages', {
    method: 'POST',
    body: JSON.stringify({
      type: 'tasks',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })).json())).results as GetPageResponse[];

  console.log('tasks', tasks);
  const blocksTasks: (() => Promise<any>)[] = [];

  tasks.forEach(async (task) => {
    blocksTasks.push(async () => {
      const blocks = (await ((await fetch('/api/getPageDetails', {
        method: 'POST',
        body: JSON.stringify({
          page: task.id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })).json()));

      return blocks;
    });
  });

  const taskBlocsResult = await Promise.all(blocksTasks.map((x) => x()));

  return tasks.map((p, index) => {
    const myTask: Partial<Task> = {};

    myTask.id = p.id;
    // @ts-ignore
    myTask.name = p.properties.Name.title[0].text.content;
    // @ts-ignore
    myTask.project = p.properties.Project.relation[0].id;
    // @ts-ignore
    myTask.status = p.properties.Status.select?.id ?? null;
    // @ts-ignore
    myTask.tags = p.properties.Tags.multi_select.map((tag) => tag.id);
    myTask.content = taskBlocsResult[index].results;

    // @ts-ignore
    return new Task(myTask);
  });
};

export class API {
  token = '';

  constructor(token: string) {
    this.setToken(token);
  }

  setToken(token: string) {
    this.token = token;
  }

  // ---

  async request<INPUT, OUTPUT>(url: string, body: INPUT, headers: HeadersInit = {}) {
    const response = await fetch(url, {
      body: JSON.stringify(body),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Token: this.token,
        ...headers,
      },
    });

    const json = await response.json();

    return json as OUTPUT;
  }

  fetchElements(startCursor?: string) {
    return this.request<any, SearchResponse>('/api/getElements', {
      startCursor,
    });
  }

  findPage(id: string) {
    return this.request<any, GetPageResponse>('/api/getPage', {
      pageId: id,
    });
  }

  getPageContent(id: string) {
    return this.request<any, ListBlockChildrenResponse>('/api/getPageContent', {
      blockId: id,
    });
  }
}

export const api = new API('');
