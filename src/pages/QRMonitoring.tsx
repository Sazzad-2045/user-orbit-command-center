import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const qrCodes = [
	{
		id: "QR-001",
		name: "Product Launch",
		type: "URL",
		user: "John Doe",
		email: "john.doe@example.com",
		created: "2025-07-01",
		status: "Active",
		scans: 320,
		content: "https://example.com/product",
		isDynamic: true,
		analytics: {
			total: 320,
			unique: 250,
			byLocation: [
				{ country: "Bangladesh", city: "Dhaka", scans: 120 },
				{ country: "Bangladesh", city: "Chittagong", scans: 60 },
				{ country: "India", city: "Kolkata", scans: 40 },
			],
			daily: [
				{ date: "2025-07-01", scans: 10 },
				{ date: "2025-07-02", scans: 20 },
				{ date: "2025-07-03", scans: 30 },
				{ date: "2025-07-04", scans: 40 },
				{ date: "2025-07-05", scans: 50 },
				{ date: "2025-07-06", scans: 60 },
				{ date: "2025-07-07", scans: 110 },
			],
		},
	},
	{
		id: "QR-002",
		name: "Event Poster",
		type: "PDF",
		user: "Jane Smith",
		email: "jane.smith@example.com",
		created: "2025-06-20",
		status: "Inactive",
		scans: 45,
		content: "/files/event-poster.pdf",
		isDynamic: false,
		analytics: {
			total: 45,
			unique: 40,
			byLocation: [
				{ country: "Bangladesh", city: "Dhaka", scans: 20 },
				{ country: "India", city: "Delhi", scans: 25 },
			],
			daily: [
				{ date: "2025-06-20", scans: 5 },
				{ date: "2025-06-21", scans: 10 },
				{ date: "2025-06-22", scans: 15 },
				{ date: "2025-06-23", scans: 15 },
			],
		},
	},
	{
		id: "QR-003",
		name: "Company Brochure",
		type: "PDF",
		user: "Alice Rahman",
		email: "alice.rahman@example.com",
		created: "2025-07-02",
		status: "Active",
		scans: 210,
		content: "/files/brochure.pdf",
		isDynamic: false,
		analytics: { total: 210, unique: 180, byLocation: [], daily: [] },
	},
	{
		id: "QR-004",
		name: "Facebook Page",
		type: "Social Media",
		user: "Sabbir Hossain",
		email: "sabbir.hossain@example.com",
		created: "2025-07-03",
		status: "Active",
		scans: 150,
		content: "https://facebook.com/brandpage",
		isDynamic: true,
		analytics: { total: 150, unique: 120, byLocation: [], daily: [] },
	},
	{
		id: "QR-005",
		name: "vCard for CEO",
		type: "vCard",
		user: "Rafiq Islam",
		email: "rafiq.islam@example.com",
		created: "2025-07-04",
		status: "Active",
		scans: 90,
		content: "vCard data",
		isDynamic: false,
		analytics: { total: 90, unique: 80, byLocation: [], daily: [] },
	},
	{
		id: "QR-006",
		name: "Promo Link",
		type: "URL",
		user: "Mitu Akter",
		email: "mitu.akter@example.com",
		created: "2025-07-05",
		status: "Inactive",
		scans: 60,
		content: "https://promo.com/offer",
		isDynamic: true,
		analytics: { total: 60, unique: 55, byLocation: [], daily: [] },
	},
	{
		id: "QR-007",
		name: "YouTube Channel",
		type: "Social Media",
		user: "Farhan Ahmed",
		email: "farhan.ahmed@example.com",
		created: "2025-07-06",
		status: "Active",
		scans: 300,
		content: "https://youtube.com/channel/xyz",
		isDynamic: true,
		analytics: { total: 300, unique: 250, byLocation: [], daily: [] },
	},
	{
		id: "QR-008",
		name: "Menu QR",
		type: "URL",
		user: "Restaurant BD",
		email: "info@restaurantbd.com",
		created: "2025-07-07",
		status: "Active",
		scans: 180,
		content: "https://restaurantbd.com/menu",
		isDynamic: false,
		analytics: { total: 180, unique: 170, byLocation: [], daily: [] },
	},
	{
		id: "QR-009",
		name: "App Download",
		type: "URL",
		user: "App Team",
		email: "support@app.com",
		created: "2025-07-08",
		status: "Inactive",
		scans: 75,
		content: "https://app.com/download",
		isDynamic: true,
		analytics: { total: 75, unique: 70, byLocation: [], daily: [] },
	},
	{
		id: "QR-010",
		name: "Support Contact",
		type: "Text",
		user: "Support Desk",
		email: "help@support.com",
		created: "2025-07-09",
		status: "Active",
		scans: 40,
		content: "Contact: 123456789",
		isDynamic: false,
		analytics: { total: 40, unique: 35, byLocation: [], daily: [] },
	},
];

const qrTypes = ["URL", "Social Media", "PDF", "vCard", "Text"];
const statusOptions = ["Active", "Inactive"];

const reports = {
	highScan: qrCodes.slice(0, 1),
	mostUsedTypes: [{ type: "URL", count: 1 }, { type: "PDF", count: 1 }],
	countByPlan: [{ plan: "Pro", count: 1 }, { plan: "Basic", count: 1 }],
	creationTrend: [
		{ date: "2025-07-01", count: 1 },
		{ date: "2025-06-20", count: 1 },
	],
};

export default function QRMonitoring() {
	const [filters, setFilters] = useState({
		user: "",
		type: "",
		name: "",
		status: "",
		date: "",
	});
	const [selectedQR, setSelectedQR] = useState(null);
	const [showDeactivate, setShowDeactivate] = useState(null);
	const [showDelete, setShowDelete] = useState(null);
	const [deleteReason, setDeleteReason] = useState("");
	const [editContent, setEditContent] = useState("");
	const navigate = useNavigate();

	const filteredQRCodes = qrCodes.filter((qr) =>
		(!filters.user ||
			qr.user.toLowerCase().includes(filters.user.toLowerCase()) ||
			qr.email.toLowerCase().includes(filters.user.toLowerCase())) &&
		(!filters.type || qr.type === filters.type) &&
		(!filters.name || qr.name.toLowerCase().includes(filters.name.toLowerCase())) &&
		(!filters.status || qr.status === filters.status) &&
		(!filters.date || qr.created === filters.date)
	);

	return (
		<div className="p-6 max-w-6xl mx-auto space-y-10">
			{/* Navigation */}
			<div className="flex justify-between items-center mb-6">
				<button
					className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
					onClick={() => navigate("/users")}
				>
					Back to User List
				</button>
			</div>

			{/* Search Filters */}
			<div className="flex flex-wrap gap-3 mb-4">
				<input
					className="input input-sm"
					placeholder="User Name/Email"
					onChange={(e) =>
						setFilters((f) => ({ ...f, user: e.target.value }))
					}
				/>
				<select
					className="input input-sm"
					onChange={(e) =>
						setFilters((f) => ({ ...f, type: e.target.value }))
					}
				>
					<option value="">All Types</option>
					{qrTypes.map((type) => (
						<option key={type} value={type}>
							{type}
						</option>
					))}
				</select>
				<input
					className="input input-sm"
					placeholder="QR Name"
					onChange={(e) =>
						setFilters((f) => ({ ...f, name: e.target.value }))
					}
				/>
				<select
					className="input input-sm"
					onChange={(e) =>
						setFilters((f) => ({ ...f, status: e.target.value }))
					}
				>
					<option value="">All Status</option>
					{statusOptions.map((status) => (
						<option key={status} value={status}>
							{status}
						</option>
					))}
				</select>
				<input
					type="date"
					className="input input-sm"
					onChange={(e) =>
						setFilters((f) => ({ ...f, date: e.target.value }))
					}
				/>
				<button
					className="btn btn-sm"
					onClick={() => alert("Exported as CSV/XLSX!")}
				>
					Export
				</button>
			</div>

			{/* QR Code Table */}
			<div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-100">
				<table className="table-auto w-full text-left">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-4 py-2">QR Name</th>
							<th className="px-4 py-2">Type</th>
							<th className="px-4 py-2">User</th>
							<th className="px-4 py-2">Creation Date</th>
							<th className="px-4 py-2">Status</th>
							<th className="px-4 py-2">Total Scans</th>
							<th className="px-4 py-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredQRCodes.map((qr) => (
							<tr key={qr.id} className="border-t border-gray-100">
								<td
									className="px-4 py-2 cursor-pointer text-blue-700 hover:underline"
									onClick={() => setSelectedQR(qr)}
								>
									{qr.name}
								</td>
								<td className="px-4 py-2">{qr.type}</td>
								<td
									className="px-4 py-2 cursor-pointer text-blue-700 hover:underline"
									onClick={() =>
										navigate(`/user-profile?email=${qr.email}`)
									}
								>
									{qr.user}
								</td>
								<td className="px-4 py-2">{qr.created}</td>
								<td className="px-4 py-2">{qr.status}</td>
								<td className="px-4 py-2">{qr.scans}</td>
								<td className="px-4 py-2 flex gap-1">
									<button
										className="btn btn-xs"
										onClick={() => setSelectedQR(qr)}
									>
										View Details
									</button>
									<button
										className="btn btn-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
										onClick={() => setShowDeactivate(qr)}
									>
										Deactivate
									</button>
									<button
										className="btn btn-xs bg-red-100 hover:bg-red-200 text-red-700"
										onClick={() => setShowDelete(qr)}
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* QR Code Details Pop-up */}
			{selectedQR && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
					<div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-2xl border border-gray-200 relative">
						<button
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
							onClick={() => setSelectedQR(null)}
						>
							<svg
								width="24"
								height="24"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									d="M18 6L6 18M6 6l12 12"
									stroke="#888"
									strokeWidth="2"
									strokeLinecap="round"
								/>
							</svg>
						</button>
						<div className="flex items-center gap-4 mb-6">
							<div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100">
								<svg
									width="32"
									height="32"
									fill="none"
									viewBox="0 0 24 24"
								>
									<rect
										x="4"
										y="4"
										width="16"
										height="16"
										rx="4"
										fill="#6366f1"
										opacity=".15"
									/>
									<rect
										x="8"
										y="8"
										width="8"
										height="8"
										rx="2"
										fill="#6366f1"
									/>
								</svg>
							</div>
							<div>
								<h3 className="text-2xl font-bold text-gray-900 mb-1">
									{selectedQR.name}
								</h3>
								<div className="flex gap-2 text-sm text-gray-500">
									<span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
										{selectedQR.type}
									</span>
									<span className="px-2 py-0.5 rounded bg-gray-100">
										{selectedQR.status}
									</span>
									<span className="px-2 py-0.5 rounded bg-gray-100">
										Created: {selectedQR.created}
									</span>
								</div>
							</div>
						</div>
						<div className="mb-4">
							<div className="text-gray-700 mb-1 font-medium">Content:</div>
							<div className="bg-gray-50 rounded p-3 text-gray-800 break-all border border-gray-100">
								{selectedQR.content}
							</div>
						</div>
						<div className="mb-6">
							<table className="min-w-full text-sm border border-gray-100 rounded overflow-hidden">
								<tbody>
									<tr className="bg-gray-50">
										<td className="py-2 px-4 font-medium text-gray-700">
											User
										</td>
										<td
											className="py-2 px-4 text-blue-700 cursor-pointer hover:underline"
											onClick={() =>
												navigate(`/user-profile?email=${selectedQR.email}`)
											}
										>
											{selectedQR.user}
										</td>
									</tr>
									<tr>
										<td className="py-2 px-4 font-medium text-gray-700">
											Total Scans
										</td>
										<td className="py-2 px-4 text-indigo-700 font-bold">
											{selectedQR.analytics.total ?? selectedQR.scans}
										</td>
									</tr>
									<tr className="bg-gray-50">
										<td className="py-2 px-4 font-medium text-gray-700">
											Unique Scans
										</td>
										<td className="py-2 px-4 text-green-700 font-bold">
											{selectedQR.analytics.unique ?? "-"}
										</td>
									</tr>
									<tr>
										<td className="py-2 px-4 font-medium text-gray-700">
											Location-wise Scans
										</td>
										<td className="py-2 px-4">
											{selectedQR.analytics.byLocation &&
											selectedQR.analytics.byLocation.length > 0 ? (
												<table className="min-w-full text-xs border border-gray-100 rounded">
													<thead>
														<tr className="bg-gray-100">
															<th className="px-2 py-1 text-left">
																Country
															</th>
															<th className="px-2 py-1 text-left">
																City
															</th>
															<th className="px-2 py-1 text-left">
																Scans
															</th>
														</tr>
													</thead>
													<tbody>
														{selectedQR.analytics.byLocation.map((loc, i) => (
															<tr key={i}>
																<td className="px-2 py-1">{loc.country}</td>
																<td className="px-2 py-1">{loc.city}</td>
																<td className="px-2 py-1">{loc.scans}</td>
															</tr>
														))}
													</tbody>
												</table>
											) : (
												<span className="text-gray-400">No data</span>
											)}
										</td>
									</tr>
									<tr className="bg-gray-50">
										<td className="py-2 px-4 font-medium text-gray-700">
											Daily Scan Trends
										</td>
										<td className="py-2 px-4">
											{selectedQR.analytics.daily &&
											selectedQR.analytics.daily.length > 0 ? (
												<div className="w-full h-32 bg-gray-100 rounded flex items-end gap-1 p-2">
													{selectedQR.analytics.daily.map((d, i) => (
														<div
															key={i}
															className="flex flex-col items-center justify-end"
															style={{ height: "100%" }}
														>
															<div
																style={{ height: `${d.scans / 2}px` }}
																className="w-4 bg-indigo-400 rounded-t"
															></div>
															<span className="text-xs mt-1 text-gray-500">
																{d.date.slice(5)}
															</span>
														</div>
													))}
												</div>
											) : (
												<span className="text-gray-400">No data</span>
											)}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="flex flex-wrap gap-2 mt-4">
							<button
								className="btn btn-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
								onClick={() => setShowDeactivate(selectedQR)}
							>
								Deactivate/Block
							</button>
							<button
								className="btn btn-xs"
								onClick={() => alert("Exported as CSV/PDF!")}
							>
								Export Analytics
							</button>
							<button
								className="btn btn-xs"
								onClick={() => setSelectedQR(null)}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Deactivate Pop-up */}
			{showDeactivate && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
					<div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
						<h3 className="font-bold text-lg mb-2">Deactivate QR Code</h3>
						<p>Are you sure you want to deactivate this QR code?</p>
						<div className="flex justify-end gap-2 mt-4">
							<button
								className="btn"
								onClick={() => setShowDeactivate(null)}
							>
								Cancel
							</button>
							<button
								className="btn btn-warning"
								onClick={() => {
									setShowDeactivate(null);
									alert("QR code deactivated!");
								}}
							>
								Deactivate
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete Pop-up */}
			{showDelete && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
					<div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
						<h3 className="font-bold text-lg mb-2">Delete QR Code</h3>
						<p className="text-red-600">
							Are you sure you want to delete this QR code?
						</p>
						<input
							className="input w-full my-2"
							placeholder="Reason"
							value={deleteReason}
							onChange={(e) => setDeleteReason(e.target.value)}
						/>
						<div className="flex justify-end gap-2 mt-4">
							<button
								className="btn"
								onClick={() => setShowDelete(null)}
							>
								Cancel
							</button>
							<button
								className="btn btn-danger"
								disabled={!deleteReason}
								onClick={() => {
									setShowDelete(null);
									alert("QR code deleted!");
								}}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Reports Section */}
			<section className="bg-white rounded-lg p-8 shadow-lg border border-gray-200 mt-10">
				<h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
					<svg
						width="28"
						height="28"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle cx="12" cy="12" r="10" fill="#e0e7ff" />
						<path
							d="M8 17v-2a4 4 0 018 0v2"
							stroke="#6366f1"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<circle cx="12" cy="9" r="3" stroke="#6366f1" strokeWidth="2" />
					</svg>
					QR Analytics & Reports
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* High-scan QR Codes */}
					<div className="bg-indigo-50 rounded-lg p-6 shadow-sm border border-indigo-100">
						<h3 className="text-lg font-semibold mb-3 text-indigo-700 flex items-center gap-2">
							<svg
								width="20"
								height="20"
								fill="none"
								viewBox="0 0 20 20"
							>
								<circle cx="10" cy="10" r="10" fill="#c7d2fe" />
								<path
									d="M6 14v-1a3 3 0 016 0v1"
									stroke="#6366f1"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<circle cx="10" cy="8" r="2" stroke="#6366f1" strokeWidth="1.5" />
							</svg>
							Top High-scan QR Codes
						</h3>
						<ul className="divide-y divide-indigo-100">
							{reports.highScan.map((qr) => (
								<li
									key={qr.id}
									className="py-2 flex justify-between items-center"
								>
									<span className="font-medium text-indigo-900">
										{qr.name}
									</span>
									<span className="text-indigo-600 font-bold">
										{qr.scans} scans
									</span>
								</li>
							))}
						</ul>
					</div>
					{/* Most-used QR Types */}
					<div className="bg-green-50 rounded-lg p-6 shadow-sm border border-green-100">
						<h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center gap-2">
							<svg
								width="20"
								height="20"
								fill="none"
								viewBox="0 0 20 20"
							>
								<rect width="20" height="20" rx="10" fill="#bbf7d0" />
								<path
									d="M6 10h8M10 6v8"
									stroke="#22c55e"
									strokeWidth="1.5"
									strokeLinecap="round"
								/>
							</svg>
							Most-used QR Types
						</h3>
						<ul className="divide-y divide-green-100">
							{reports.mostUsedTypes.map((t) => (
								<li
									key={t.type}
									className="py-2 flex justify-between items-center"
								>
									<span className="font-medium text-green-900">{t.type}</span>
									<span className="text-green-700 font-bold">{t.count}</span>
								</li>
							))}
						</ul>
					</div>
					{/* QR Count by Plan */}
					<div className="bg-yellow-50 rounded-lg p-6 shadow-sm border border-yellow-100">
						<h3 className="text-lg font-semibold mb-3 text-yellow-700 flex items-center gap-2">
							<svg
								width="20"
								height="20"
								fill="none"
								viewBox="0 0 20 20"
							>
								<rect width="20" height="20" rx="10" fill="#fef08a" />
								<path
									d="M6 14v-1a3 3 0 016 0v1"
									stroke="#eab308"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<circle cx="10" cy="8" r="2" stroke="#eab308" strokeWidth="1.5" />
							</svg>
							QR Count by Plan
						</h3>
						<ul className="divide-y divide-yellow-100">
							{reports.countByPlan.map((p) => (
								<li
									key={p.plan}
									className="py-2 flex justify-between items-center"
								>
									<span className="font-medium text-yellow-900">{p.plan}</span>
									<span className="text-yellow-700 font-bold">{p.count}</span>
								</li>
							))}
						</ul>
					</div>
					{/* Creation Trend Graph */}
					<div className="bg-blue-50 rounded-lg p-6 shadow-sm border border-blue-100">
						<h3 className="text-lg font-semibold mb-3 text-blue-700 flex items-center gap-2">
							<svg
								width="20"
								height="20"
								fill="none"
								viewBox="0 0 20 20"
							>
								<rect width="20" height="20" rx="10" fill="#dbeafe" />
								<path
									d="M4 14l4-4 4 4 4-8"
									stroke="#2563eb"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							Creation Trend
						</h3>
						<div className="w-full h-32 bg-blue-100 rounded flex items-end gap-2 mt-2 p-2">
							{reports.creationTrend.map((d, i) => (
								<div
									key={i}
									className="flex flex-col items-center justify-end"
									style={{ height: "100%" }}
								>
									<div
										style={{ height: `${d.count * 30}px` }}
										className="w-4 bg-blue-500 rounded-t"
									></div>
									<span className="text-xs mt-1 text-blue-700">
										{d.date.slice(5)}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="flex justify-end mt-8">
					<button
						className="btn btn-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow"
						onClick={() => alert("Exported as CSV/XLSX/PDF!")}
					>
						Export Reports
					</button>
				</div>
			</section>
		</div>
	);
}