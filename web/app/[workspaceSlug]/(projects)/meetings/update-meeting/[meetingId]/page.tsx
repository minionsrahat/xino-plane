"use client";

import MeetingRequestForm from "../../_components/MeetingRequestForm";
import MeetingUpdateForm from "../../_components/MeetingUpdateForm";

export default function CreateMeetingPage() {
  return (
    <>
      <div className="mt-6">
        <MeetingUpdateForm />
      </div>
    </>
  );
}
