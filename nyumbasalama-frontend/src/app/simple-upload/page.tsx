'use client';

import { useState, useEffect } from 'react';

const BASE_URL = 'https://nyumba-salama-api.onrender.com/api';

export default function SimpleUploadPage() {
  const [token, setToken] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [university, setUniversity] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'ready' | 'uploading' | 'success' | 'failed'>('ready');
  const [responseBody, setResponseBody] = useState<string>('');
  const [httpStatus, setHttpStatus] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString().slice(11, 23)}] ${msg}`]);
    console.log(msg);
  };

  useEffect(() => {
    addLog('--- PAGE MOUNTED ---');
    const t = localStorage.getItem('token');
    setToken(t);
    addLog(`Token loaded: ${t ? `YES (starts with ${t.substring(0, 15)}...)` : 'NO — not found'}`);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      addLog(`File selected: ${f.name}`);
      addLog(`File size: ${(f.size / 1024 / 1024).toFixed(2)} MB`);
      addLog(`File type: ${f.type}`);
    } else {
      addLog('File cleared');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    addLog('--- UPLOAD STARTED ---');

    if (!token) {
      addLog('ERROR: No authentication token found');
      setErrorMsg('No authentication token found. Please login first.');
      setStatus('failed');
      setHttpStatus(0);
      return;
    }

    if (!file) {
      addLog('ERROR: No file selected');
      setErrorMsg('No file selected.');
      setStatus('failed');
      setHttpStatus(0);
      return;
    }

    setLoading(true);
    setStatus('uploading');
    setResponseBody('');
    setHttpStatus(0);
    setErrorMsg('');
    addLog('Status: uploading');

    try {
      addLog('Creating FormData...');
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', title || file.name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('location', location);
      formData.append('university', university);

      addLog('--- FormData entries ---');
      for (const pair of Array.from(formData.entries())) {
        const val = pair[1];
        if (val instanceof File) {
          addLog(`  ${pair[0]}: [File] name=${val.name}, size=${val.size}, type=${val.type}`);
        } else {
          addLog(`  ${pair[0]}: ${JSON.stringify(val)}`);
        }
      }
      addLog('--- End FormData ---');

      const url = `${BASE_URL}/videos/upload`;
      addLog(`Request URL: ${url}`);
      addLog(`Request method: POST`);
      addLog(`Authorization: Bearer ${token.substring(0, 15)}...`);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      setHttpStatus(res.status);
      addLog(`Response status: ${res.status} ${res.statusText}`);
      addLog(`Response headers: ${JSON.stringify(Object.fromEntries(res.headers.entries()))}`);

      const rawText = await res.text();
      addLog(`Raw response (first 500 chars): ${rawText.substring(0, 500)}`);

      let parsed: unknown = null;
      try {
        parsed = JSON.parse(rawText);
        addLog('Response parsed as JSON successfully');
      } catch {
        addLog('Response is NOT valid JSON');
      }

      const pretty = parsed
        ? JSON.stringify(parsed, null, 2)
        : rawText;

      setResponseBody(pretty);
      console.log('RESPONSE JSON:', parsed);

      if (res.ok) {
        setStatus('success');
        addLog('UPLOAD SUCCESS!');
      } else {
        setStatus('failed');
        setErrorMsg(`HTTP ${res.status}: ${rawText.substring(0, 200)}`);
        addLog(`UPLOAD FAILED with status ${res.status}`);
      }
    } catch (err: unknown) {
      addLog(`CATCH BLOCK: ${String(err)}`);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setStatus('failed');
      setHttpStatus(0);
    } finally {
      setLoading(false);
      addLog('--- UPLOAD FINISHED ---');
    }
  };

  const universities = [
    { value: '', label: '-- Select --' },
    { value: 'UDSM', label: 'University of Dar es Salaam' },
    { value: 'ARU', label: 'Ardhi University' },
    { value: 'MUHAS', label: 'Muhimbili University (MUHAS)' },
    { value: 'DIT', label: 'Dar Institute of Technology (DIT)' },
    { value: 'CBE', label: 'College of Business Education (CBE)' },
    { value: 'IFM', label: 'Institute of Finance Management (IFM)' },
    { value: 'DUCE', label: 'Dar es Salaam University College of Education (DUCE)' },
    { value: 'TIA', label: 'Tanzania Institute of Accountancy (TIA)' },
    { value: 'NIT', label: 'National Institute of Transport (NIT)' },
    { value: 'OUT', label: 'Open University of Tanzania (OUT)' },
    { value: 'SJUIT', label: 'St Joseph University Tanzania (SJUIT)' },
    { value: 'KIU', label: 'Kampala International University Dar Campus (KIU)' },
    { value: 'MNMA', label: 'Mwalimu Nyerere Memorial Academy (MNMA)' },
    { value: 'UoB', label: 'University of Bagamoyo Dar Campus (UoB)' },
    { value: 'BOTH', label: 'All Universities' },
  ];

  const statusColor =
    status === 'success' ? 'text-green-600' :
    status === 'failed' ? 'text-red-600' :
    status === 'uploading' ? 'text-blue-600' :
    'text-gray-500';

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Debug: Simple Video Upload</h1>

      {!token && (
        <div className="p-3 bg-red-50 text-red-700 rounded text-sm font-medium">
          No authentication token found. Please login first.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Video File *</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="block w-full text-sm border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); addLog(`Title: ${e.target.value}`); }}
            placeholder="My house tour video"
            className="block w-full text-sm border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the property..."
            rows={3}
            className="block w-full text-sm border border-gray-300 rounded p-2 resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (TSh)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="50000"
            className="block w-full text-sm border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Mlimani"
            className="block w-full text-sm border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
          <select
            value={university}
            onChange={(e) => { setUniversity(e.target.value); addLog(`University: ${e.target.value}`); }}
            className="block w-full text-sm border border-gray-300 rounded p-2"
          >
            {universities.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full py-2.5 bg-orange-500 text-white rounded font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      <div className="p-3 rounded border text-sm font-medium">
        Status:{' '}
        <span className={statusColor}>
          {status === 'ready' && 'Ready'}
          {status === 'uploading' && 'Uploading...'}
          {status === 'success' && 'Success'}
          {status === 'failed' && 'Failed'}
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 rounded text-sm font-mono whitespace-pre-wrap">
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      {httpStatus !== 0 && (
        <div className="p-3 bg-gray-50 text-gray-700 rounded text-sm">
          <strong>HTTP Status:</strong> {httpStatus}
        </div>
      )}

      {/* DEBUG PANEL */}
      <div className="p-4 bg-gray-100 rounded space-y-3 text-sm font-mono">
        <h3 className="font-bold text-gray-900">Debug Info</h3>
        <div>
          <span className="text-gray-500">Token: </span>
          <span className={token ? 'text-green-700' : 'text-red-600'}>
            {token ? `Yes (${token.length} chars)` : 'No'}
          </span>
        </div>
        <div>
          <span className="text-gray-500">File: </span>
          <span>{file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB, ${file.type})` : 'No file selected'}</span>
        </div>
        <div>
          <span className="text-gray-500">Title: </span>
          <span>{title || '(empty)'}</span>
        </div>
        <div>
          <span className="text-gray-500">Price: </span>
          <span>{price || '(empty)'}</span>
        </div>
        <div>
          <span className="text-gray-500">Location: </span>
          <span>{location || '(empty)'}</span>
        </div>
        <div>
          <span className="text-gray-500">University: </span>
          <span>{university || '(not set)'}</span>
        </div>
        <div>
          <span className="text-gray-500">Loading: </span>
          <span>{loading ? 'Yes' : 'No'}</span>
        </div>
      </div>

      {responseBody && (
        <div className="p-4 bg-white border rounded overflow-auto max-h-96">
          <h3 className="font-bold text-sm mb-2">Response Body</h3>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap">{responseBody}</pre>
        </div>
      )}

      <div className="p-4 bg-gray-900 text-green-400 rounded overflow-auto max-h-96">
        <h3 className="font-bold text-sm mb-2 text-white">Console Logs</h3>
        {logs.map((l, i) => (
          <div key={i} className="text-xs font-mono">{l}</div>
        ))}
      </div>
    </div>
  );
}
