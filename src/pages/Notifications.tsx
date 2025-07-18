import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Demo users (copied from UserProfile.tsx initialUsers)
const users = [
	{
		id: 1,
		name: "John Doe",
		email: "john.doe@example.com",
		plan: "Premium",
		role: "Owner",
		status: "Active",
		signupDate: "2024-01-15",
		lastActive: "2024-07-07",
		country: "United States",
	},
	{
		id: 2,
		name: "Jane Smith",
		email: "jane.smith@example.com",
		plan: "Basic",
		role: "Admin",
		status: "Active",
		signupDate: "2024-02-20",
		lastActive: "2024-07-05",
		country: "Canada",
	},
	{
		id: 3,
		name: "Mike Johnson",
		email: "mike.johnson@example.com",
		plan: "Free",
		role: "Editor",
		status: "Inactive",
		signupDate: "2024-03-10",
		lastActive: "2024-06-20",
		country: "United Kingdom",
	},
	{
		id: 4,
		name: "Sarah Wilson",
		email: "sarah.wilson@example.com",
		plan: "Enterprise",
		role: "Viewer",
		status: "Active",
		signupDate: "2024-01-05",
		lastActive: "2024-07-08",
		country: "Australia",
	},
	{
		id: 5,
		name: "David Brown",
		email: "david.brown@example.com",
		plan: "Premium",
		role: "Admin",
		status: "Active",
		signupDate: "2024-04-12",
		lastActive: "2024-07-06",
		country: "Germany",
	},
	{
		id: 6,
		name: "Alice Rahman",
		email: "alice.rahman@example.com",
		plan: "Basic",
		role: "Editor",
		status: "Active",
		signupDate: "2024-05-10",
		lastActive: "2024-07-08",
		country: "Bangladesh",
	},
	{
		id: 7,
		name: "Sabbir Hossain",
		email: "sabbir.hossain@example.com",
		plan: "Premium",
		role: "Admin",
		status: "Active",
		signupDate: "2024-06-01",
		lastActive: "2024-07-09",
		country: "Bangladesh",
	},
	{
		id: 8,
		name: "Rafiq Islam",
		email: "rafiq.islam@example.com",
		plan: "Enterprise",
		role: "Owner",
		status: "Inactive",
		signupDate: "2024-03-15",
		lastActive: "2024-07-01",
		country: "Bangladesh",
	},
	{
		id: 9,
		name: "Mitu Akter",
		email: "mitu.akter@example.com",
		plan: "Free",
		role: "Viewer",
		status: "Active",
		signupDate: "2024-04-20",
		lastActive: "2024-07-08",
		country: "Bangladesh",
	},
	{
		id: 10,
		name: "Farhan Ahmed",
		email: "farhan.ahmed@example.com",
		plan: "Premium",
		role: "Admin",
		status: "Active",
		signupDate: "2024-05-15",
		lastActive: "2024-07-09",
		country: "Bangladesh",
	},
];
const plans = ["Free", "Basic", "Premium", "Enterprise"];
const roles = ["Owner", "Admin", "Editor", "Viewer"];
const templates = [
	{
		label: "Account Suspension",
		subject: "Your account has been suspended",
		body: "Dear [Name],\n\nYour account has been suspended due to policy violations. Please contact support for more information.\n\nRegards,\nAdmin Team",
	},
	{
		label: "Account Reactivation",
		subject: "Your account has been reactivated",
		body: "Dear [Name],\n\nYour account has been reactivated. Welcome back!\n\nRegards,\nAdmin Team",
	},
	{
		label: "Plan Change Confirmation",
		subject: "Your subscription plan has changed",
		body: "Dear [Name],\n\nYour subscription plan has been updated. Please review your new plan details in your profile.\n\nRegards,\nAdmin Team",
	},
	{
		label: "QR Code Deactivation Warning",
		subject: "QR Code Deactivation Warning",
		body: "Dear [Name],\n\nOne or more of your QR codes are scheduled for deactivation. Please take necessary action.\n\nRegards,\nAdmin Team",
	},
	{
		label: "Billing Issue",
		subject: "Billing Issue Detected",
		body: "Dear [Name],\n\nThere was a problem processing your recent payment. Please update your billing information.\n\nRegards,\nAdmin Team",
	},
];

const Notifications = () => {
	const navigate = useNavigate();
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [filter, setFilter] = useState({ plan: "", role: "" });
	const [userSearch, setUserSearch] = useState("");
	const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
	const [customSubject, setCustomSubject] = useState(templates[0].subject);
	const [customBody, setCustomBody] = useState(templates[0].body);
	const [showPreview, setShowPreview] = useState(false);
	const [sendingTo, setSendingTo] = useState(null);

	// Filtered users for bulk
	const filteredUsers = users.filter(
		(u) =>
			(!filter.plan || u.plan === filter.plan) &&
			(!filter.role || u.role === filter.role) &&
			(!userSearch ||
				u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
				u.email.toLowerCase().includes(userSearch.toLowerCase()))
	);

	// Handle template change
	const handleTemplateChange = (idx) => {
		setSelectedTemplate(templates[idx]);
		setCustomSubject(templates[idx].subject);
		setCustomBody(templates[idx].body);
	};

	// Handle send
	const handleSend = () => {
		setShowPreview(false);
		setSendingTo(selectedUsers.length === 1 ? selectedUsers[0] : null);
		setTimeout(() => {
			alert("Email sent!");
			if (selectedUsers.length === 1) {
				navigate(`/user-profile/${selectedUsers[0].id}`);
			}
			setSelectedUsers([]);
		}, 500);
	};

	return (
		<div className="p-6 max-w-3xl mx-auto">
			<div className="mb-6">
				<h1 className="text-3xl font-bold tracking-tight">
					Email Notifications
				</h1>
				<p className="text-muted-foreground">
					Communicate with users for administrative actions. Send account, plan,
					QR, and billing notifications.
				</p>
			</div>

			{/* Manual Email Sender */}
			<div className="bg-white rounded-lg shadow p-6 border border-gray-100 mb-8">
				<h2 className="text-xl font-semibold mb-4">Send Email Notification</h2>
				<div className="flex flex-wrap gap-4 mb-4">
					<div>
						<label className="block text-sm font-medium mb-1">Filter by Plan</label>
						<select
							className="input border px-2 py-1 rounded"
							value={filter.plan}
							onChange={(e) =>
								setFilter((f) => ({ ...f, plan: e.target.value }))
							}
						>
							<option value="">All</option>
							{plans.map((p) => (
								<option key={p}>{p}</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Filter by Role</label>
						<select
							className="input border px-2 py-1 rounded"
							value={filter.role}
							onChange={(e) =>
								setFilter((f) => ({ ...f, role: e.target.value }))
							}
						>
							<option value="">All</option>
							{roles.map((r) => (
								<option key={r}>{r}</option>
							))}
						</select>
					</div>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Select Users</label>
					<input
						className="input border px-2 py-1 rounded mb-2 w-full"
						placeholder="Search by name or email..."
						value={userSearch}
						onChange={(e) => setUserSearch(e.target.value)}
					/>
					<div className="overflow-y-auto max-h-64 border rounded scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
						<table className="min-w-full text-sm">
							<thead className="bg-gray-50 sticky top-0 z-10">
								<tr>
									<th className="px-2 py-2 w-10 text-center">
										<input
											type="checkbox"
											checked={
												filteredUsers.length > 0 &&
												filteredUsers.every((u) => selectedUsers.includes(u))
											}
											onChange={(e) => {
												if (e.target.checked) setSelectedUsers(filteredUsers);
												else setSelectedUsers([]);
											}}
										/>
									</th>
									<th className="px-2 py-2 text-center">Name</th>
									<th className="px-2 py-2 text-center">Email ID</th>
									<th className="px-2 py-2 text-center">Plan</th>
									<th className="px-2 py-2 text-center">Role</th>
								</tr>
							</thead>
							<tbody>
								{filteredUsers.map((u) => (
									<tr
										key={u.id}
										className={
											selectedUsers.includes(u) ? "bg-blue-50" : ""
										}
									>
										<td className="px-2 py-1 text-center">
											<input
												type="checkbox"
												checked={selectedUsers.includes(u)}
												onChange={(e) => {
													if (e.target.checked)
														setSelectedUsers([...selectedUsers, u]);
													else
														setSelectedUsers(
															selectedUsers.filter(
																(su) => su !== u
															)
														);
												}}
											/>
										</td>
										<td className="px-2 py-1">{u.name}</td>
										<td className="px-2 py-1">{u.email}</td>
										<td className="px-2 py-1">{u.plan}</td>
										<td className="px-2 py-1">{u.role}</td>
									</tr>
								))}
								{filteredUsers.length === 0 && (
									<tr>
										<td colSpan={3} className="text-center text-gray-400 py-4">
											No users found
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Template</label>
					<select
						className="input border px-2 py-1 rounded"
						value={templates.indexOf(selectedTemplate)}
						onChange={(e) => handleTemplateChange(e.target.value)}
					>
						{templates.map((t, i) => (
							<option key={t.label} value={i}>
								{t.label}
							</option>
						))}
					</select>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Subject</label>
					<input
						className="input border px-2 py-1 rounded w-full"
						value={customSubject}
						onChange={(e) => setCustomSubject(e.target.value)}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Message</label>
					<textarea
						className="input border px-2 py-1 rounded w-full min-h-[100px]"
						value={customBody}
						onChange={(e) => setCustomBody(e.target.value)}
					/>
				</div>
				<div className="flex gap-2">
					<button
						className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
						onClick={() => setShowPreview(true)}
						disabled={selectedUsers.length === 0}
					>
						Preview
					</button>
					<button
						className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold transition"
						onClick={handleSend}
						disabled={selectedUsers.length === 0}
					>
						Send
					</button>
				</div>
			</div>

			{/* Preview Modal */}
			{showPreview && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
					<div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative">
						{/* Close (cross) button */}
						<button
							className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
							aria-label="Close preview"
							onClick={() => setShowPreview(false)}
						>
							&times;
						</button>
						<h3 className="font-bold text-lg mb-2 text-center">
							Email Preview
						</h3>
						<div className="mb-2">
							<span className="font-medium">To:</span>{" "}
							<span className="break-all">
								{selectedUsers.map((u) => u.email).join(", ")}
							</span>
						</div>
						<div className="mb-2">
							<span className="font-medium">Subject:</span>{" "}
							<span className="break-all">{customSubject}</span>
						</div>
						<div className="mb-4 whitespace-pre-line border rounded p-3 bg-gray-50 text-gray-800 text-sm max-h-48 overflow-y-auto">
							{customBody}
						</div>
						<div className="flex justify-end gap-2">
							<button className="btn" onClick={() => setShowPreview(false)}>
								Cancel
							</button>
							<button className="btn btn-primary" onClick={handleSend}>
								Send
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Notifications;