export interface IUser {
  id: string;
  name: string;
}

export interface IAgendaItem {
  id: string;
  agenda: string;
  owner: IUser; // was string
  duration: string;
}

export interface IMeeting {
  id: string;
  subject: string;
  description: string;
  start_time: string; // e.g., "2025-06-30 12:12:12"
  end_time: string;
  host: IUser; // previously a string
  participants: IUser[]; // was string[]
  agendaItems: IAgendaItem[];
  attachments: File[];
}
