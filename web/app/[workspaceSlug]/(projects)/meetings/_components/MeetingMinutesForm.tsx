"use client";
import { useEffect, useState } from "react";
import { Clock, Plus, Trash2, StickyNote } from "lucide-react";
import { IMeeting, IUser } from "@plane/types/src/meeting";
import { MeetingStore } from "@/store/meeting/meeting.store";
import { useMeeting } from "@/hooks/store/use-meeting";
import { useParams, useRouter } from "next/navigation";
import { observer } from "mobx-react";
import { setToast, TOAST_TYPE } from "@plane/ui";
import { useTranslation } from "@plane/i18n";
import { IAgenda, IssueItem } from "../data/meetings";

// Simulated user list with IDs and names
export const users: IUser[] = [
  {
    id: "9a1aeba2-8eee-4939-a7f9-833d49970f58",
    first_name: "Rahat Uddin",
    last_name: "Azad",
    display_name: "rahatuddin786",
  },
];

const MeetingMinutesForm = observer(() => {
  const [summary, setSummary] = useState("");
  const { t } = useTranslation();
  const router = useRouter();
  const { meetings, updateMeeting } = useMeeting();
  const { meetingId, workspaceSlug } = useParams();
  const meetingData = meetingId ? meetings?.find((m) => m.id === meetingId) : undefined;

  if (!meetingData?.id) {
    router.push(`/${workspaceSlug}/meetings`);
  }

  const [agendaItems, setAgendaItems] = useState<IAgenda[]>([]);
  useEffect(() => {
    if (meetingData?.agendas) {
      const agendasWithDefaults = meetingData.agendas.map((agenda) => ({
        ...agenda,
        issues: agenda.issues || [],
        isNew: false,
      }));
      setAgendaItems(agendasWithDefaults);
    }
  }, [meetingData]);

  const handleUpdateAgenda = (index: number, field: string, value: any) => {
    setAgendaItems((prev) => prev.map((agenda, i) => (i === index ? { ...agenda, [field]: value } : agenda)));
  };

  const handleAddAgenda = () => {
    setAgendaItems((prev) => [
      ...prev,
      {
        title: "",
        assignees: [],
        duration_minutes: 0,
        issues: [],
      },
    ]);
  };

  const handleRemoveAgenda = (index: number) => {
    setAgendaItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddIssue = (agendaIndex: number) => {
    const newIssue = {
      name: "",
      description: "",
      assignees: [],
      target_date: "",
      priority: "Medium",
    };
    setAgendaItems((prev) =>
      prev.map((agenda, i) =>
        i === agendaIndex ? { ...agenda, issues: [...(agenda.issues || []), newIssue] } : agenda
      )
    );
  };

  const handleUpdateIssue = (agendaIndex: number, issueIndex: number, field: string, value: any) => {
    setAgendaItems((prev) =>
      prev.map((agenda, i) => {
        if (i !== agendaIndex) return agenda;
        const updatedIssues = agenda.issues?.map((issue, j) =>
          j === issueIndex ? { ...issue, [field]: value } : issue
        );
        return { ...agenda, issues: updatedIssues };
      })
    );
  };

  const handleRemoveIssue = (agendaIndex: number, issueIndex: number) => {
    setAgendaItems((prev) =>
      prev.map((agenda, i) =>
        i === agendaIndex ? { ...agenda, issues: agenda.issues?.filter((_, j) => j !== issueIndex) } : agenda
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...meetingData,
      agendas: agendaItems,
      summary,
    };
    console.log("Final Meeting Minutes Data:", payload);

    if (meetingData?.id) {
      updateMeeting(workspaceSlug?.toString()!, meetingData?.id, payload)
        .then(() => {
          setToast({
            type: TOAST_TYPE.SUCCESS,
            title: t("success"),
            message: t("meeting_created_successfully"),
          });
          // setFormSubmitState("");
          router.push(`/${workspaceSlug}/meetings`);
        })
        .catch(() => {
          setToast({
            type: TOAST_TYPE.ERROR,
            title: t("error"),
            message: t("something_went_wrong"),
          });
          // setFormSubmitState("");
        });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 text-gray-100 shadow-xl rounded-2xl p-6 max-w-[90%] mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-white">{meetingData?.subject}</h2>
        <div className="flex items-center text-gray-400">
          <Clock className="w-5 h-5 mr-2" />
          <span>{meetingData?.start_time?.split("T")?.[0]} | 12:10 – 16:00</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-sm font-semibold text-gray-300 mb-2 block">Host</label>
          <input
            type="text"
            value={`${meetingData?.host?.first_name ?? ""} ${meetingData?.host?.last_name ?? ""}`}
            readOnly
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-300 mb-2 block">Participants</label>
          <input
            type="text"
            value={meetingData?.participants?.map((p) => p.display_name)?.join(", ") ?? ""}
            readOnly
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Agenda</h3>
          <button
            type="button"
            onClick={handleAddAgenda}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-600 hover:bg-gray-700 text-sm text-gray-200"
          >
            <Plus className="w-4 h-4" /> Add Agenda
          </button>
        </div>

        {agendaItems.map((agenda, agendaIdx) => (
          <div
            key={agenda.id || `agenda-${agendaIdx}`}
            className="border border-gray-700 rounded-lg p-5 bg-gray-800 space-y-4"
          >
            <div className="flex justify-between items-start">
              <input
                type="text"
                placeholder="Agenda Title"
                value={agenda.title}
                onChange={(e) => handleUpdateAgenda(agendaIdx, "title", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveAgenda(agendaIdx)}
                className="text-red-400 hover:text-red-600 ml-4"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-4">
              <input
                type="number"
                value={agenda.duration_minutes}
                onChange={(e) => handleUpdateAgenda(agendaIdx, "duration_minutes", +e.target.value)}
                placeholder="Duration (min)"
                className="w-40 bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <h4 className="text-white mb-2">Issues</h4>
              {agenda.issues?.map((issue, issueIdx) => (
                <div key={issueIdx} className="border border-gray-700 bg-gray-900 p-4 rounded-lg space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={issue.name}
                      onChange={(e) => handleUpdateIssue(agendaIdx, issueIdx, "name", e.target.value)}
                      placeholder="Issue Name"
                      className="bg-gray-800 border border-gray-600 px-3 py-2 rounded w-full"
                    />
                    <input
                      type="text"
                      value={issue.description}
                      onChange={(e) => handleUpdateIssue(agendaIdx, issueIdx, "description", e.target.value)}
                      placeholder="Description"
                      className="bg-gray-800 border border-gray-600 px-3 py-2 rounded w-full"
                    />
                    <input
                      type="date"
                      value={issue.target_date}
                      onChange={(e) => handleUpdateIssue(agendaIdx, issueIdx, "target_date", e.target.value)}
                      className="bg-gray-800 border border-gray-600 px-3 py-2 rounded w-full"
                    />
                  </div>

                  <div className="flex gap-4 items-center">
                    <select
                      value={issue.priority}
                      onChange={(e) => handleUpdateIssue(agendaIdx, issueIdx, "priority", e.target.value)}
                      className="bg-gray-800 border border-gray-600 px-3 py-2 rounded"
                    >
                      {["Low", "Medium", "High"].map((level) => (
                        <option key={level}>{level}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveIssue(agendaIdx, issueIdx)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <label className="text-sm text-white">Assignees</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {issue.assignees?.map((user) => (
                        <span key={user.id} className="bg-gray-700 text-sm px-2 py-1 rounded">
                          {user.display_name}
                        </span>
                      ))}
                    </div>
                    <select
                      onChange={(e) => {
                        const selectedUser = users?.find((u) => u.id === e.target.value);
                        if (selectedUser && !issue.assignees?.some((a) => a.id === selectedUser.id)) {
                          const newAssignees = [...(issue.assignees || []), selectedUser];
                          handleUpdateIssue(agendaIdx, issueIdx, "assignees", newAssignees);
                        }
                      }}
                      className="w-full mt-2 bg-gray-800 border border-gray-600 px-3 py-2 rounded"
                    >
                      <option value="">Select Assignee</option>
                      {users?.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.display_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddIssue(agendaIdx)}
                className="mt-2 text-sm text-blue-400 hover:text-blue-600"
              >
                + Add Issue
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-300 block mb-2">Meeting Summary</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          rows={4}
          placeholder="Final meeting summary..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {/* <button type="button" className="px-4 py-2 border border-gray-600 text-gray-200 rounded hover:bg-gray-700">
          Save as Draft
        </button> */}
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
          Submit
        </button>
      </div>
    </form>
  );
});

export default MeetingMinutesForm;
