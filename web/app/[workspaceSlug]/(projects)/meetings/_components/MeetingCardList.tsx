"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PencilIcon } from "lucide-react";
import { ContentWrapper } from "@plane/ui";
import { useMeeting } from "@/hooks/store/use-meeting";
import useSWR from "swr";
// edit icon

type Meeting = {
  id: string;
  title: string;
  date: string; // e.g., "2025-06-21"
  startTime: string; // e.g., "20:00"
  endTime: string;
  host: string;
  description: string;
};

// const now = new Date();
const dummyMeetings: Meeting[] = [
  {
    id: "1",
    title: "Live Design Review",
    date: "2025-07-03",
    startTime: "12:00",
    endTime: "14:00",
    host: "Me",
    description: "Design review with live feedback.",
  },
  {
    id: "2",
    title: "Client Sync",
    date: "2025-07-03",
    startTime: "11:00",
    endTime: "13:59",
    host: "Me",
    description: "Real-time discussion with the client on project status.",
  },
  {
    id: "3",
    title: "Sprint Planning",
    date: "2025-06-27",
    startTime: "10:00",
    endTime: "11:00",
    host: "Alice",
    description: "Planning next sprint goals and deliverables.",
  },
  {
    id: "4",
    title: "Team Retrospective",
    date: "2025-06-28",
    startTime: "20:00",
    endTime: "22:00",
    host: "Bob",
    description: "Reviewing the last sprint and identifying improvements.",
  },
  {
    id: "5",
    title: "Developer Standup",
    date: "2025-06-23",
    startTime: "01:00",
    endTime: "04:00",
    host: "Me",
    description: "Daily standup to discuss progress.",
  },
];

export default function MeetingCardList() {
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
  console.log("data_meeting", meetingStore.meetings);

  const { live, upcoming, previous } = useMemo(() => {
    const live: Meeting[] = [];
    const upcoming: Meeting[] = [];
    const previous: Meeting[] = [];

    for (const meeting of dummyMeetings) {
      const start = new Date(`${meeting.date}T${meeting.startTime}`);
      const end = new Date(`${meeting.date}T${meeting.endTime}`);

      if (now >= start && now <= end) {
        live.push(meeting);
      } else if (start > now) {
        upcoming.push(meeting);
      } else {
        previous.push(meeting);
      }
    }

    return { live, upcoming, previous };
  }, []);

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

  const renderMeetings = (meetings: Meeting[], meetingLabel: string, isLive = false) => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {meetings.map((meeting) => (
        <a
          key={meeting.id}
          href={`/meetings/${meeting.id}`} // Link to the meeting detail page
          className="block rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-sm hover:shadow-md transition text-white relative"
        >
          {meeting.host === "Me" && !(meetingLabel === "previous") && (
            <Link
              href={`/${workspaceSlug?.toString()}/meetings/create-meeting`}
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-700"
            >
              <PencilIcon size={18} />
            </Link>
          )}
          <h3 className="text-lg font-semibold mb-1">{meeting.title}</h3>
          <p className="text-sm text-gray-300 mb-1">
            <strong>Start Time:</strong> {formatDate(meeting.date)}
          </p>
          <p className="text-sm text-gray-300 mb-1">
            <strong>Duration:</strong> {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
          </p>

          <p className="text-sm text-gray-300 mb-2">
            <strong>Host:</strong> {meeting.host}
          </p>
          {/* <p className="text-sm text-gray-200">{meeting.description}</p> */}
          {isLive && (
            <div className="mt-2">
              <Link
                href={`/${workspaceSlug?.toString()}/meetings/meeting-minute`}
                className="inline-block px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
              >
                Join
              </Link>
            </div>
          )}
        </a>
      ))}
    </div>
  );

  return (
    <ContentWrapper>
      <div className="space-y-12">
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Live Meetings</h2>
          {live.length > 0 ? renderMeetings(live, "live", true) : <p className="text-gray-400">No live meetings.</p>}
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">Upcoming Meetings</h2>
          {upcoming.length > 0 ? (
            renderMeetings(upcoming, "upcoming")
          ) : (
            <p className="text-gray-400">No upcoming meetings.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">Previous Meetings</h2>
          {previous.length > 0 ? (
            renderMeetings(previous, "previous")
          ) : (
            <p className="text-gray-400">No previous meetings.</p>
          )}
        </div>
      </div>
    </ContentWrapper>
  );
}
