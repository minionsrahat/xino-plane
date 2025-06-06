'use client';

import { useMemo } from "react";
import { PencilIcon } from "lucide-react";
import { ContentWrapper } from "@plane/ui";
 // edit icon

type Meeting = {
  id: string;
  title: string;
  date: string; // ISO date string
  host: string;
  description: string;
};

const dummyMeetings: Meeting[] = [
  {
    id: "1",
    title: "Sprint Planning",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    host: "Alice",
    description: "Discussion on next sprint goals and estimates.",
  },
  {
    id: "2",
    title: "Retrospective",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    host: "Bob",
    description: "Review of last sprint's performance and improvements.",
  },
  {
    id: "3",
    title: "Client Sync",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    host: "Me", // self-hosted
    description: "Update on project progress with the client.",
  },
  {
    id: "4",
    title: "Design Review",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    host: "Diana",
    description: "Review UI/UX designs with the team.",
  },
];

export default function MeetingCardList() {
  const now = new Date();

  const { upcoming, previous } = useMemo(() => {
    const upcoming: Meeting[] = [];
    const previous: Meeting[] = [];

    for (const meeting of dummyMeetings) {
      const meetingDate = new Date(meeting.date);
      if (meetingDate > now) {
        upcoming.push(meeting);
      } else {
        previous.push(meeting);
      }
    }

    return { upcoming, previous };
  }, []);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const renderMeetings = (meetings: Meeting[]) => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {meetings.map((meeting) => (
        <a
          key={meeting.id}
          href={`/meetings/${meeting.id}`} // Link to the meeting detail page
          className="block rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-sm hover:shadow-md transition text-white relative"
        >
          {meeting.host === "Me" && (
            <button
              onClick={(e) => {
                e.preventDefault(); // prevent link navigation
                alert(`Edit Meeting: ${meeting.title}`);
              }}
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-700"
            >
              <PencilIcon size={18} />
            </button>
          )}
          <h3 className="text-lg font-semibold mb-1">{meeting.title}</h3>
          <p className="text-sm text-gray-300 mb-1">
            <strong>Date:</strong> {formatDate(meeting.date)}
          </p>
          <p className="text-sm text-gray-300 mb-2">
            <strong>Host:</strong> {meeting.host}
          </p>
          <p className="text-sm text-gray-200">{meeting.description}</p>
        </a>
      ))}
    </div>
  );

  return (
    <ContentWrapper>
      <div className="space-y-12">
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Upcoming Meetings</h2>
          {upcoming.length > 0 ? renderMeetings(upcoming) : <p className="text-gray-400">No upcoming meetings.</p>}
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">Previous Meetings</h2>
          {previous.length > 0 ? renderMeetings(previous) : <p className="text-gray-400">No previous meetings.</p>}
        </div>
      </div>
    </ContentWrapper>
  );
}
