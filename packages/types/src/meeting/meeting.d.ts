export interface IAgendaItem {
  agenda: string;
  owner: string;
  duration: string;
  id: string;
}

export interface IMeeting {
  id: string;
  subject: string;
  description: string;
  dateTime: string; // ISO format: "YYYY-MM-DDTHH:mm"
  host: string;
  participants: string[];
  agendaItems: IAgendaItem[];
  attachments: File[];
}
