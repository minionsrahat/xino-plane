import { API_BASE_URL } from "@plane/constants";
import { APIService } from "../api.service";
import { IMeeting } from "@plane/types";

export class MeetingService extends APIService {
  constructor() {
    super(API_BASE_URL)
  }


  async createMeeting(workspaceSlug: string, data: Partial<IMeeting>): Promise<IMeeting> {
    return this.post(`/api/workspaces/${workspaceSlug}/meetings/`, data)
      .then((res) => res?.data)
      .catch((error) => {
        throw error?.response;
      })
  }


  async updateMeeting(workspaceSlug: string, meetingId: string, data: Partial<IMeeting>): Promise<IMeeting> {
    return this.patch(`/api/workspaces/${workspaceSlug}/meetings/${meetingId}/`, data)
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

  async getMeetings(workspaceSlug: string): Promise<IMeeting[]> {
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


// api/ workspaces/<str:slug>/meetings/ [name='workspace-meetings'] 
// all, create

// api/ workspaces/<str:slug>/meetings/<uuid:pk>/ [name='workspace-meeting-detail']
// single get, update, delete