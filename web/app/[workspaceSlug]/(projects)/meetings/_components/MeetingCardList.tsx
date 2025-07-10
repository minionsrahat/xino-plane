"use client";

import { useMemo } from "react";
import { observer } from "mobx-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { PencilIcon } from "lucide-react";
import { IMeeting } from "@plane/types";
import { ContentWrapper } from "@plane/ui";
import { LogoSpinner } from "@/components/common";
import { useMeeting } from "@/hooks/store/use-meeting";
import { IMeetingGroup, sampleMeetings } from "../data/meetings";
// edit icon

const MeetingCardList = observer(() => {
  const now = new Date();
  const router = useRouter();
  const { workspaceSlug } = useParams();
  const meetingStore = useMeeting();

  // fetch workspace favorite
  useSWR(
    workspaceSlug ? `WORKSPACE_MEETINGS_${workspaceSlug}` : null,
    workspaceSlug ? () => meetingStore.fetchMeetings(workspaceSlug.toString()) : null,
    { revalidateIfStale: false, revalidateOnFocus: false }
  );

  const formatDate = (isoDate: string) =>
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
    }).format(new Date(isoDate));

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(+hours, +minutes);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  if (meetingStore.isLoading)
    return (
      <div className="relative flex h-screen w-full items-center justify-center">
        <LogoSpinner />
      </div>
    );
  if (meetingStore.error) return <div>{meetingStore.error.message}</div>;

  const renderMeetingsList = (meetingGroups: IMeetingGroup[]) => (
    <div className="grid grid-cols-1">
      {meetingGroups.map((meetingGroup) => (
        <div key={meetingGroup?.label} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{meetingGroup?.label} Meetings</h2>
          <div className="bg-gray-800 text-white rounded-lg shadow divide-y divide-gray-500">
            {/* Header Row */}
            <div className="grid grid-cols-7 gap-5 text-sm font-bold  tracking-wide text-gray-300 bg-gray-700 px-4 py-3 rounded-t-lg">
              <div>Date 📅</div>
              <div>Start Time ⏰</div>
              <div>Subject 📝</div>
              <div>Description 🧾</div>
              <div>Chairperson 👥</div>
              <div>Host 👥</div>
              {/* <div>Participants 👥</div> */}
              <div className="text-center">Actions ⚙️</div>
            </div>
            {/* Meeting Rows */}
            {meetingGroup?.meetings?.map((meeting) => (
              <div key={meeting?.id} className="grid grid-cols-7 items-center justify-center gap-5 px-4 py-3">
                <div className="text-sm">{formatDateTime(meeting?.start_time, "date")}</div>
                <div className="text-sm ">{formatDateTime(meeting?.start_time, "time")}</div>
                <div className="text-sm">{meeting?.subject}</div>
                <div className="text-sm">{meeting?.description?.slice(0, 20)}...</div>
                <div className="text-sm">{meeting?.chairperson?.display_name}</div>
                <div className="text-sm">{meeting?.host?.display_name}</div>
                {/* <div className="text-sm">{meeting?.participants?.map((p) => p?.display_name).join(", ")}</div> */}
                <div className="flex gap-4 justify-center">
                  {!(meeting?.id === "Me") && !(meetingGroup?.label === "Completed") && (
                    <Link
                      href={`/${workspaceSlug?.toString()}/meetings/create-meeting`}
                      className=" p-1 rounded hover:bg-gray-700"
                    >
                      <PencilIcon size={18} />
                    </Link>
                  )}
                  {!(meeting?.id === "Me") && !(meetingGroup?.label === "Completed") && (
                    <Link
                      href={`/${workspaceSlug?.toString()}/meetings/meeting-minute`}
                      className="inline-block px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                    >
                      Join
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <ContentWrapper>
      <div className="space-y-12">
        <div>
          {/* <h2 className="text-xl font-bold text-white mb-4">Meetings</h2> */}
          {sampleMeetings?.length > 0 ? (
            renderMeetingsList(sampleMeetings)
          ) : (
            <p className="text-gray-400">No meetings.</p>
          )}
        </div>
      </div>
    </ContentWrapper>
  );
});

export default MeetingCardList;

export const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(isoDate));

export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(+hours, +minutes);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

export function formatDateTime(dateString: string, type: "date" | "time"): string {
  const date = new Date(dateString);

  if (type === "date") {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }); // Example: "30 June 2025"
  }

  if (type === "time") {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    }); // Example: "9 AM"
  }

  return "";
}
