"use client";

import { useState } from "react";
import { Eye, Plus, Trash2, X } from "lucide-react"; // You already use these

export default function MeetingForm() {
  const users = ["Mamun Hasan", "Sumaiya", "Salam Hossain", "Steve Jobs"];
  const selfUser = "Mamun Hasan";
  const [formSubmitState, setFormSubmitState] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  // const [dateTime, setDateTime] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [host, setHost] = useState(selfUser);
  const [participants, setParticipants] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [agendaItems, setAgendaItems] = useState([{ agenda: "Project Kickoff", owner: selfUser, duration: "30 min" }]);

  const addAgenda = () => setAgendaItems([...agendaItems, { agenda: "", owner: "", duration: "" }]);

  const removeAgenda = (index: number) => setAgendaItems(agendaItems.filter((_, i) => i !== index));

  const updateAgendaItem = (index: number, field: string, value: string) => {
    const updated = [...agendaItems];
    updated[index][field as keyof (typeof updated)[0]] = value;
    setAgendaItems(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => setAttachments(attachments.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      date,
      startTime,
      endTime,
      host,
      participants,
      agendaItems,
      attachments,
    };

    console.log("FORM DATA:", formData, formSubmitState);
    // API submission can be done here
    setFormSubmitState("");
  };

  return (
    <form
      className="p-6 max-w-4xl mx-auto rounded-2xl shadow-xl bg-gray-900 text-white space-y-6"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-4">Create New Meeting</h2>

      {/* Subject */}
      <div>
        <label className="block font-medium mb-1">
          Meeting Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter meeting subject"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium mb-1">Meeting Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add description of the meeting..."
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600"
        />
      </div>

      {/* Date, Host */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* <div>
          <label className="block font-medium mb-1">
            Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            required
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}

        {/* Date */}
        <div>
          <label className="block font-medium mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block font-medium mb-1">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block font-medium mb-1">
            End Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Host <span className="text-red-500">*</span>
          </label>
          <select
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600"
          >
            {users.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>

        {/* Participants */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">
            Participants <span className="text-red-500">*</span>
          </label>
          <div className="w-full border border-gray-600 rounded-lg bg-gray-800 p-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {participants.map((p) => (
                <span key={p} className="flex items-center gap-1 bg-gray-700 px-3 py-1 text-sm rounded-full">
                  {p}
                  <button
                    type="button"
                    onClick={() => setParticipants(participants.filter((item) => item !== p))}
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
              className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded-md text-white"
            >
              <option value="">Select participant</option>
              {users
                .filter((u) => !participants.includes(u))
                .map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Agenda Items */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Agenda Items</h3>
        <div className="space-y-4">
          {agendaItems.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-12 md:col-span-5">
                <label className="block font-medium mb-1">Agenda</label>
                <input
                  type="text"
                  value={item.agenda}
                  onChange={(e) => updateAgendaItem(idx, "agenda", e.target.value)}
                  placeholder="Agenda item"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600"
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="block font-medium mb-1">Owner</label>
                <select
                  value={item.owner}
                  onChange={(e) => updateAgendaItem(idx, "owner", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600"
                >
                  <option value="">Select owner</option>
                  {users.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="block font-medium mb-1">Duration</label>
                <input
                  type="text"
                  value={item.duration}
                  onChange={(e) => updateAgendaItem(idx, "duration", e.target.value)}
                  placeholder="e.g. 30 min"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600"
                />
              </div>

              <div className="col-span-12 md:col-span-1 flex items-center justify-center pb-1">
                <button
                  type="button"
                  className="p-2 rounded-full border border-red-600 text-red-400 hover:bg-red-600 hover:text-white transition"
                  onClick={() => removeAgenda(idx)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={addAgenda}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-600 rounded-lg hover:bg-gray-700 transition"
          >
            <Plus size={16} /> Add Agenda
          </button>
        </div>
      </div>

      {/* Attachments */}
      <div>
        <label className="block font-medium mb-1">Attachments</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full file:px-4 file:py-2 file:rounded-lg file:bg-gray-800 file:border file:border-gray-600 file:text-white file:cursor-pointer"
        />
        <div className="mt-3 space-y-2">
          {attachments.map((file, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm"
            >
              <span>{file.name}</span>
              <div className="flex gap-3 items-center">
                <button type="button" className="text-blue-400 hover:underline flex items-center gap-1">
                  <Eye size={16} /> View
                </button>
                <button
                  type="button"
                  onClick={() => removeAttachment(idx)}
                  className="text-red-400 hover:underline flex items-center gap-1"
                >
                  <X size={16} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="submit"
          onClick={() => setFormSubmitState("draft")}
          className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          onClick={() => setFormSubmitState("submit")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
