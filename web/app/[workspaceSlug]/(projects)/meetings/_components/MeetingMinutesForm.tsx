"use client";

import { useState } from "react";
import { Plus, Clock, Trash2, StickyNote } from "lucide-react";

const users = ["Mamun Hasan", "Sumaiya", "Salam Hossain"];

type ActionItem = {
  name: string;
  assignee: string;
  dueDate: string;
  priority: string;
};

type AgendaItem = {
  agenda: string;
  owner: string;
  time: string;
  actions: ActionItem[];
  note?: string;
};

export default function MeetingMinutesForm() {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([
    {
      agenda: "Product Plan & TG2",
      owner: "Salam Hossain",
      time: "12:10 - 13:00",
      actions: [],
      note: "",
    },
  ]);

  const handleAddAgenda = () => {
    setAgendaItems([...agendaItems, { agenda: "", owner: "", time: "", actions: [], note: "" }]);
  };

  const handleAddAction = (agendaIdx: number) => {
    const updated = [...agendaItems];
    const owner = updated[agendaIdx].owner;
    updated[agendaIdx].actions.push({
      name: "",
      assignee: owner || "",
      dueDate: "",
      priority: "",
    });
    setAgendaItems(updated);
  };

  const handleRemoveAction = (agendaIdx: number, actionIdx: number) => {
    const updated = [...agendaItems];
    updated[agendaIdx].actions.splice(actionIdx, 1);
    setAgendaItems(updated);
  };

  const handleRemoveAgenda = (agendaIdx: number) => {
    const updated = [...agendaItems];
    updated.splice(agendaIdx, 1);
    setAgendaItems(updated);
  };

  const handleNoteChange = (idx: number, value: string) => {
    const updated = [...agendaItems];
    updated[idx].note = value;
    setAgendaItems(updated);
  };

  return (
    <form className="bg-gray-900 text-gray-100 shadow-xl rounded-2xl p-6 max-w-[90%] mx-auto space-y-8">
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
        {/* // 'Chairperson', "Host", "Participants" */}
        {["Host", "Participants"].map((label, i) => (
          <div key={i}>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">{label}</label>
            <input
              type="text"
              defaultValue={
                label === "Chairperson" ? "Steve Jobs" : label === "Host" ? "Mamun Hasan" : "Sumaiya, Salam, Ibrahim"
              }
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-400"
            />
          </div>
        ))}
      </div>

      {/* Agendas */}
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
          <div key={idx} className="border border-gray-700 rounded-lg relative p-5 space-y-5 bg-gray-800">
            <button
              onClick={() => handleRemoveAgenda(idx)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600"
              title="Delete agenda item"
              type="button"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            {/* Agenda Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-3">
                <label className="text-sm font-semibold text-gray-300 block mb-1">Agenda</label>
                <input
                  type="text"
                  defaultValue={item.agenda}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-300 block mb-1">Owner</label>
                <select
                  defaultValue={item.owner}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                >
                  <option disabled>Select owner</option>
                  {users.map((u, i) => (
                    <option key={i}>{u}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-1">Time</label>
                <input
                  type="text"
                  defaultValue={item.time}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            {/* Action Items */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-200">Action Items</h4>
                <button
                  type="button"
                  className="text-sm flex items-center gap-1 px-2 py-1 border border-gray-600 rounded hover:bg-gray-700 text-gray-200"
                  onClick={() => handleAddAction(idx)}
                >
                  <Plus className="w-4 h-4" /> Add Action
                </button>
              </div>

              {item.actions.map((action, aIdx) => (
                <div
                  key={aIdx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-900 p-4 border border-gray-700 rounded-md"
                >
                  <div className="md:col-span-4">
                    <label className="text-sm font-medium text-gray-300 block mb-1">Action</label>
                    <input
                      type="text"
                      placeholder="Action name"
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-sm font-medium text-gray-300 block mb-1">Assignee</label>
                    <select
                      defaultValue={action.assignee}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    >
                      <option disabled>Select user</option>
                      {users.map((u, i) => (
                        <option key={i}>{u}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-sm font-medium text-gray-300 block mb-1">Due Date</label>
                    <input
                      type="date"
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-sm font-medium text-gray-300 block mb-1">Priority</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                  <div className="md:col-span-1 flex justify-center pt-6">
                    <button
                      type="button"
                      className="text-red-400 hover:text-red-600"
                      onClick={() => handleRemoveAction(idx, aIdx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes/Decisions */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-300">Notes / Decisions</label>
                <button type="button" className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
                  <StickyNote className="w-4 h-4" /> Add Note
                </button>
              </div>
              <textarea
                value={item.note || ""}
                onChange={(e) => handleNoteChange(idx, e.target.value)}
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
