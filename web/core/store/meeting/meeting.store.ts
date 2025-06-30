// store/meeting.store.ts
import { makeObservable, observable, action, runInAction, computed } from "mobx";
import { v4 as uuidv4 } from "uuid";
import { MeetingService } from "@/services/meeting";
// import { CoreRootStore } from "./root.store";
import { IMeeting } from "@plane/types";
import { CoreRootStore } from "../root.store";

export interface IMeetingStore {
  meetingIds: string[];
  meetingMap: { [id: string]: IMeeting };
  meetings: IMeeting[];

  fetchMeetings: (workspaceSlug: string) => Promise<void>;
  addMeeting: (workspaceSlug: string, data: Partial<IMeeting>) => Promise<IMeeting>;
  updateMeeting: (workspaceSlug: string, id: string, data: Partial<IMeeting>) => Promise<IMeeting>;
  deleteMeeting: (workspaceSlug: string, id: string) => Promise<void>;
  removeMeetingFromStore: (id: string) => void;
}

export class MeetingStore implements IMeetingStore {
  meetingIds: string[] = [];
  meetingMap: { [id: string]: IMeeting } = {};
  meetingService;

  constructor(_rootStore: CoreRootStore) {
    makeObservable(this, {
      meetingIds: observable,
      meetingMap: observable,
      meetings: computed,

      fetchMeetings: action,
      addMeeting: action,
      updateMeeting: action,
      deleteMeeting: action,
      removeMeetingFromStore: action,
    });

    this.meetingService = new MeetingService();
  }

  get meetings() {
    return this.meetingIds.map((id) => this.meetingMap[id]);
  }

  fetchMeetings = async (workspaceSlug: string) => {
    try {
      const meetings = await this.meetingService.getMeetings(workspaceSlug);
      runInAction(() => {
        this.meetingIds = [];
        this.meetingMap = {};
        meetings.forEach((meeting) => {
          this.meetingMap[meeting.id] = meeting;
          this.meetingIds.push(meeting.id);
        });
      });
    } catch (error) {
      console.error("Failed to fetch meetings", error);
      throw error;
    }
  };

  addMeeting = async (workspaceSlug: string, data: Partial<IMeeting>) => {
    const tempId = uuidv4();
    try {
      runInAction(() => {
        this.meetingMap[tempId] = { ...data, id: tempId } as IMeeting;
        this.meetingIds.unshift(tempId);
      });

      const newMeeting = await this.meetingService.createMeeting(workspaceSlug, data);

      runInAction(() => {
        delete this.meetingMap[tempId];
        this.meetingMap[newMeeting.id] = newMeeting;
        this.meetingIds = [newMeeting.id, ...this.meetingIds.filter((id) => id !== tempId)];
      });

      return newMeeting;
    } catch (error) {
      runInAction(() => {
        delete this.meetingMap[tempId];
        this.meetingIds = this.meetingIds.filter((id) => id !== tempId);
      });
      console.error("Failed to add meeting", error);
      throw error;
    }
  };

  updateMeeting = async (workspaceSlug: string, id: string, data: Partial<IMeeting>) => {
    const original = this.meetingMap[id];
    try {
      runInAction(() => {
        this.meetingMap[id] = { ...original, ...data };
      });

      const updated = await this.meetingService.updateMeeting(workspaceSlug, id, data);

      runInAction(() => {
        this.meetingMap[id] = updated;
      });

      return updated;
    } catch (error) {
      runInAction(() => {
        this.meetingMap[id] = original;
      });
      console.error("Failed to update meeting", error);
      throw error;
    }
  };

  deleteMeeting = async (workspaceSlug: string, id: string) => {
    const original = this.meetingMap[id];
    try {
      await this.meetingService.deleteMeeting(workspaceSlug, id);
      runInAction(() => {
        delete this.meetingMap[id];
        this.meetingIds = this.meetingIds.filter((mid) => mid !== id);
      });
    } catch (error) {
      runInAction(() => {
        this.meetingMap[id] = original;
        if (!this.meetingIds.includes(id)) this.meetingIds.push(id);
      });
      console.error("Failed to delete meeting", error);
      throw error;
    }
  };

  removeMeetingFromStore = (id: string) => {
    runInAction(() => {
      delete this.meetingMap[id];
      this.meetingIds = this.meetingIds.filter((mid) => mid !== id);
    });
  };
}
