"use client";
import { useState } from "react";
import { Clock, Plus, Trash2, StickyNote } from "lucide-react";

// Simulated user list with IDs and names
const users = [
  { id: "uuid1", name: "Salam Hossain" },
  { id: "uuid2", name: "Mamun Hasan" },
  { id: "uuid3", name: "Sumaiya" },
  { id: "uuid4", name: "Ibrahim" },
];

type ActionItem = {
  name: string;
  assignees: string[];
  dueDate: string;
  priority: string;
};

type AgendaItem = {
  id: string;
  agenda: string;
  ownerIds: string[];
  time: string;
  actions: ActionItem[];
  note: string;
};

export default function MeetingMinutesForm() {
  const [host, setHost] = useState<string>(users[1].id);
  const [participants, setParticipants] = useState<string[]>([users[2].id, users[0].id, users[3].id]);
  const [summary, setSummary] = useState("");
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([
    {
      id: "a-1",
      agenda: "Product Plan & TG2",
      ownerIds: [users[0].id],
      time: "12:10 – 13:00",
      actions: [],
      note: "",
    },
  ]);

  const handleAgendaChange = (idx: number, field: keyof AgendaItem, value: any) => {
    const copy = [...agendaItems];
    copy[idx] = { ...copy[idx], [field]: value };
    setAgendaItems(copy);
  };

  const handleAddAgenda = () => {
    setAgendaItems((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        agenda: "",
        ownerIds: [],
        time: "",
        actions: [],
        note: "",
      },
    ]);
  };

  const handleRemoveAgenda = (idx: number) => {
    setAgendaItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddAction = (aIdx: number) => {
    const copy = [...agendaItems];
    copy[aIdx].actions.push({
      name: "",
      assignees: [...copy[aIdx].ownerIds],
      dueDate: "",
      priority: "Low",
    });
    setAgendaItems(copy);
  };

  const handleActionChange = (aIdx: number, actIdx: number, field: keyof ActionItem, value: any) => {
    const copy = [...agendaItems];
    const act = { ...copy[aIdx].actions[actIdx], [field]: value };
    copy[aIdx].actions[actIdx] = act;
    setAgendaItems(copy);
  };

  const handleRemoveAction = (aIdx: number, actIdx: number) => {
    const copy = [...agendaItems];
    copy[aIdx].actions.splice(actIdx, 1);
    setAgendaItems(copy);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const meeting = {
      subject: "IT Business Opening",
      description: summary,
      start_time: "2023-12-01 12:10:00",
      end_time: "2023-12-01 16:00:00",
      host,
      participants,
      agendas: agendaItems.map((item) => ({
        id: item.id,
        title: item.agenda,
        duration_minutes: (() => {
          const [from, to] = item.time.split("–").map((s) => s.trim());
          const [h1, m1] = from.split(":").map(Number);
          const [h2, m2] = to.split(":").map(Number);
          return h2 * 60 + m2 - (h1 * 60 + m1);
        })(),
        assignees: item.ownerIds,
        actions: item.actions.map((a) => ({
          name: a.name,
          assignees: a.assignees,
          dueDate: a.dueDate,
          priority: a.priority,
        })),
        note: item.note,
      })),
      attachments: [] as File[],
    };

    console.log("Submitting meeting:", meeting);
    // send via API...
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 text-gray-100 shadow-xl rounded-2xl p-6 max-w-[90%] mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-white">IT Business Opening</h2>
        <div className="flex items-center text-gray-400">
          <Clock className="w-5 h-5 mr-2" />
          <span>1st Dec 2023 | 12:10 – 16:00</span>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-sm font-semibold text-gray-300 mb-2 block">Host</label>
          <select
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-300 mb-2 block">Participants</label>
          <select
            multiple
            value={participants}
            onChange={(e) => setParticipants(Array.from(e.target.selectedOptions).map((o) => o.value))}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Agendas Section */}
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

        {agendaItems.map((item, idx) => (
          <div key={item.id} className="border border-gray-700 rounded-lg relative p-5 space-y-5 bg-gray-800">
            <button
              onClick={() => handleRemoveAgenda(idx)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600"
              type="button"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-3">
                <label className="text-sm font-semibold text-gray-300 block mb-1">Agenda</label>
                <input
                  type="text"
                  value={item.agenda}
                  onChange={(e) => handleAgendaChange(idx, "agenda", e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-300 block mb-1">Owner(s)</label>
                <select
                  multiple
                  value={item.ownerIds}
                  onChange={(e) =>
                    handleAgendaChange(
                      idx,
                      "ownerIds",
                      Array.from(e.target.selectedOptions).map((o) => o.value)
                    )
                  }
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-1">Time</label>
                <input
                  type="text"
                  value={item.time}
                  onChange={(e) => handleAgendaChange(idx, "time", e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Action Items */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-200">Action Items</h4>
                <button
                  type="button"
                  onClick={() => handleAddAction(idx)}
                  className="text-sm flex items-center gap-1 px-2 py-1 border border-gray-600 rounded hover:bg-gray-700 text-gray-200"
                >
                  <Plus className="w-4 h-4" /> Add Action
                </button>
              </div>

              {item.actions.map((act, aIdx) => (
                <div
                  key={aIdx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-900 p-4 border border-gray-700 rounded-md"
                >
                  <div className="md:col-span-4">
                    <label className="text-sm font-medium text-gray-300 block mb-1">Action</label>
                    <input
                      type="text"
                      value={act.name}
                      onChange={(e) => handleActionChange(idx, aIdx, "name", e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-sm font-medium text-gray-300 block mb-1">Assignee(s)</label>
                    {/* <select
                      multiple
                      value={act.assignees}
                      onChange={(e) =>
                        handleActionChange(
                          idx,
                          aIdx,
                          "assignees",
                          Array.from(e.target.selectedOptions).map((o) => o.value)
                        )
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    >
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select> */}
                    <div className="bg-gray-800 border border-gray-600 p-2 rounded-lg">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {participants.map((p) => (
                          <span key={p} className="bg-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                            {users.find((u) => u.id === p)?.name || p}
                            <button
                              type="button"
                              onClick={() => setParticipants(participants.filter((id) => id !== p))}
                              className="text-red-400 hover:text-red-200"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <select
                        onChange={(e) => {
                          const selected = e.target.value;
                          if (selected && !participants.includes(selected)) {
                            setParticipants([...participants, selected]);
                          }
                          e.target.selectedIndex = 0;
                        }}
                        className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded-md"
                      >
                        <option value="">Select Assignee</option>
                        {users
                          .filter((u) => !participants.includes(u.id))
                          .map((u) => (
                            <option key={u.name} value={u.id}>
                              {u.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-sm font-medium text-gray-300 block mb-1">Due Date</label>
                    <input
                      type="date"
                      value={act.dueDate}
                      onChange={(e) => handleActionChange(idx, aIdx, "dueDate", e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-sm font-medium text-gray-300 block mb-1">Priority</label>
                    <select
                      value={act.priority}
                      onChange={(e) => handleActionChange(idx, aIdx, "priority", e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    >
                      {["Low", "Medium", "High"].map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-1 flex justify-center pt-6">
                    <button
                      type="button"
                      onClick={() => handleRemoveAction(idx, aIdx)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-300">Notes / Decisions</label>
                <button type="button" className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
                  <StickyNote className="w-4 h-4" /> Add Note
                </button>
              </div>
              <textarea
                value={item.note}
                onChange={(e) => handleAgendaChange(idx, "note", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                rows={3}
                placeholder="Add meeting notes or decisions for this agenda..."
              />
            </div>
          </div>
        ))}
      </div>

      {/* Meeting Summary */}
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

      {/* Submit Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" className="px-4 py-2 border border-gray-600 text-gray-200 rounded hover:bg-gray-700">
          Save as Draft
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
          Submit
        </button>
      </div>
    </form>
  );
}
