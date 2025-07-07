export interface IUser {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
}

export interface IAgenda {
  id?: string;
  title: string;
  duration_minutes: number;
  assignees?: IUser[];
  actions?: ActionItem[];
  note?: string;
}

export interface IMeeting {
  id?: string;
  subject: string;
  description: string;
  chairperson?: IUser;
  start_time: string; // e.g., "2025-06-30 12:12:12"
  end_time: string;
  host?: IUser;
  participants?: IUser[];
  agendas?: IAgenda[];
  attachments: File[];
}


type ActionItem = {
  name: string;
  assignee: string;
  dueDate: string;
  priority: string;
};
