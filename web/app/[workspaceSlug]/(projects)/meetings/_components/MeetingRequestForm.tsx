'use client';

import { useState } from 'react';
import { Plus, Trash2, Eye, X } from 'lucide-react';

export default function MeetingForm() {
  const users = ['Mamun Hasan', 'Sumaiya', 'Salam Hossain', 'Steve Jobs'];
  const selfUser = 'Mamun Hasan';

  const [agendaItems, setAgendaItems] = useState([
    { agenda: 'Project Kickoff', owner: selfUser, duration: '30 min' },
  ]);
  const [host, setHost] = useState(selfUser);
  const [participants, setParticipants] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);

  const addAgenda = () =>
    setAgendaItems([...agendaItems, { agenda: '', owner: '', duration: '' }]);

  const removeAgenda = (index: number) =>
    setAgendaItems(agendaItems.filter((_, i) => i !== index));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) =>
    setAttachments(attachments.filter((_, i) => i !== index));

  const toggleParticipant = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setParticipants(selected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation logic or API call can go here
    console.log({
      host,
      participants,
      agendaItems,
      attachments,
    });
  };

  return (
    <form
      className="p-6 max-w-4xl mx-auto rounded-2xl shadow-xl bg-gray-900 text-white space-y-6"
      onSubmit={handleSubmit}
    >
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Create New Meeting</h2>

      {/* Meeting Subject */}
      <div>
        <label className="block font-medium mb-1">
          Meeting Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Enter meeting subject"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium mb-1">Meeting Description</label>
        <textarea
          rows={3}
          placeholder="Add description of the meeting..."
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Date & Time, Host, Participants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">
            Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            required
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
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none"
          >
            {users.map((u, i) => (
              <option key={i}>{u}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium mb-1">
            Participants <span className="text-red-500">*</span>
          </label>
          <select
            multiple
            required
            value={participants}
            onChange={toggleParticipant}
            className="w-full h-32 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none"
          >
            {users.map((u, i) => (
              <option key={i}>{u}</option>
            ))}
          </select>
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
                  defaultValue={item.agenda}
                  placeholder="Agenda item"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 placeholder-gray-400"
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="block font-medium mb-1">Owner</label>
                <select
                  defaultValue={item.owner}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600"
                >
                  <option disabled>Select owner</option>
                  {users.map((u, i) => (
                    <option key={i}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="block font-medium mb-1">Duration</label>
                <input
                  type="text"
                  defaultValue={item.duration}
                  placeholder="e.g. 30 min"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 placeholder-gray-400"
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
                <button
                  type="button"
                  className="text-blue-400 hover:underline flex items-center gap-1"
                >
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

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
