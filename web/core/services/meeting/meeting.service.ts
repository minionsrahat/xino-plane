import { API_BASE_URL } from "@plane/constants";
import { APIService } from "../api.service";
import { IMeeting, IMeetingGroup } from "@plane/types";

export class MeetingService extends APIService {
  constructor() {
    super(API_BASE_URL)
  }


  async createMeeting(workspaceSlug: string, data: Partial<IMeeting>): Promise<IMeeting> {
    const payload = serializeMeetingForApi(data);
    return this.post(`/api/workspaces/${workspaceSlug}/meetings/`, payload)
      .then((res) => res?.data)
      .catch((error) => {
        throw error?.response;
      })
  }


  async updateMeeting(workspaceSlug: string, meetingId: string, data: Partial<IMeeting>): Promise<IMeeting> {
    const payload = serializeMeetingForApi(data)
    return this.patch(`/api/workspaces/${workspaceSlug}/meetings/${meetingId}/`, payload)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response;
      });
  }

  async deleteMeeting(workspaceSlug: string, meetingId: string): Promise<void> {
    return this.delete(`/api/workspaces/${workspaceSlug}/meetings/${meetingId}/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response;
      });
  }

  async getMeetings(workspaceSlug: string): Promise<IMeetingGroup[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/meetings/`, {
      params: {
        all: true
      }
    })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response;
      });
  }

  async getMeetingById(workspaceSlug: string, meetingId: string): Promise<IMeeting> {
    return this.get(`/api/workspaces/${workspaceSlug}/meetings/${meetingId}/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response;
      });
  }
}

// Utility function to convert full objects to ID-only format
const serializeMeetingForApi = (data: Partial<IMeeting>) => ({
  ...data,
  chairperson: data.chairperson?.id || null,
  host: data.host?.id || null,
  participants: data.participants?.map(p => p.id) || [],
  attachments: data.attachments?.map(a => ({
    id: a.id,
    name: a.name,
    url: a.url,
    type: a.type
  })) || [],
  agendas: data.agendas?.map(agenda => ({
    id: agenda.id,
    title: agenda.title,
    duration_minutes: agenda.duration_minutes,
    note: agenda.note,
    assignees: agenda.assignees?.map(a => a.id),
    issues: agenda.issues?.map(issue => ({
      id: issue.id,
      name: issue.name,
      description: issue.description,
      assignees: issue.assignees?.map(a => a.id),
      target_date: issue.target_date,
      priority: issue.priority
    })) || []
  })) || []
});



// api/ workspaces/<str:slug>/meetings/ [name='workspace-meetings'] 
// all, create

// api/ workspaces/<str:slug>/meetings/<uuid:pk>/ [name='workspace-meeting-detail']
// single get, update, delete